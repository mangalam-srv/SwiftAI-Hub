import OpenAI from "openai";
import sql from "../configs/db.js";
import { clerkClient } from "@clerk/express";
import axios from "axios";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import FormData from "form-data";
import { createRequire } from "module";
import Groq from "groq-sdk";

const require = createRequire(import.meta.url);
const pdf = require("pdf-parse");

const AI = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});


/* =========================
   ARTICLE GENERATOR
========================= */

export const generateArticle = async (req, res) => {
  try {

    const { userId } = await req.auth();
    const { prompt, length } = req.body;

    const plan = req.plan;
    const free_usage = req.free_usage;

    if (!prompt) {
      return res.json({ success: false, message: "Prompt required" });
    }

    if (plan !== "premium" && free_usage >= 10) {
      return res.json({ success: false, message: "limit reached" });
    }

    const response = await groq.chat.completions.create({
  model: "llama-3.1-8b-instant",
  messages: [
    { role: "system", content: "You are an expert blog writer." },
    { role: "user", content: prompt }
  ],
  temperature: 0.7,
  max_tokens: Math.min(length, 500)
});

    const content = response.choices[0].message.content;

    await sql`
      INSERT INTO creations (user_id,prompt,content,type)
      VALUES (${userId}, ${prompt}, ${content}, 'article')
    `;

    if (plan !== "premium") {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: { free_usage: free_usage + 1 }
      });
    }

    res.json({ success: true, content });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};


/* =========================
   BLOG TITLE GENERATOR
========================= */

export const generateBlogTitle = async (req, res) => {
  try {

    const { userId } = await req.auth();
    const { prompt } = req.body;

    const plan = req.plan;
    const free_usage = req.free_usage;

    if (!prompt) {
      return res.json({ success: false, message: "Prompt required" });
    }

    if (plan !== "premium" && free_usage >= 10) {
      return res.json({ success: false, message: "limit reached" });
    }

const response = await groq.chat.completions.create({
  model: "llama-3.1-8b-instant",
  messages: [
    {
      role: "system",
      content: `
Return 10 blog titles in Markdown bullet list format.

Example:

### Blog Title Ideas
- Title 1
- Title 2
- Title 3
`
    },
    { role: "user", content: prompt }
  ],
  max_tokens: 150
});

    const content = response.choices[0].message.content;

    await sql`
      INSERT INTO creations (user_id,prompt,content,type)
      VALUES (${userId}, ${prompt}, ${content}, 'blog-title')
    `;

    if (plan !== "premium") {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: { free_usage: free_usage + 1 }
      });
    }

    res.json({ success: true, content });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};


/* =========================
   IMAGE GENERATOR
========================= */

export const generateImage = async (req, res) => {
  try {

    const { userId } = await req.auth();
    const { prompt, publish } = req.body;
    const plan = req.plan;

    if (!prompt) {
      return res.json({ success: false, message: "Prompt required" });
    }

    if (plan !== "premium") {
      return res.json({ success: false, message: "Only premium users allowed" });
    }

    const formData = new FormData();
    formData.append("prompt", prompt);

    const { data } = await axios.post(
      "https://clipdrop-api.co/text-to-image/v1",
      formData,
      {
        headers: {
          "x-api-key": process.env.CLIPDROP_API_KEY,
          ...formData.getHeaders()
        },
        responseType: "arraybuffer"
      }
    );

    const base64Image = `data:image/png;base64,${Buffer.from(data).toString("base64")}`;

    const upload = await cloudinary.uploader.upload(base64Image);

    await sql`
      INSERT INTO creations (user_id,prompt,content,type,publish)
      VALUES (${userId}, ${prompt}, ${upload.secure_url}, 'image', ${publish ?? false})
    `;

    res.json({ success: true, content: upload.secure_url });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};


/* =========================
   REMOVE IMAGE BACKGROUND
========================= */

export const removeImageBG = async (req, res) => {
  try {

    const { userId } = await req.auth();
    const image = req.file;
    const plan = req.plan;

    if (!image) {
      return res.json({ success: false, message: "Image required" });
    }

    if (plan !== "premium") {
      return res.json({ success: false, message: "Only premium users allowed" });
    }

    const upload = await cloudinary.uploader.upload(image.path, {
      transformation: [{ effect: "background_removal" }]
    });

    fs.unlinkSync(image.path);

    await sql`
      INSERT INTO creations (user_id,prompt,content,type)
      VALUES (${userId}, 'Removed background from image', ${upload.secure_url}, 'image')
    `;

    res.json({ success: true, content: upload.secure_url });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};


/* =========================
   REMOVE OBJECT FROM IMAGE
========================= */

export const removeImageOBJ = async (req, res) => {
  try {

    const { userId } = await req.auth();
    const image = req.file;
    const { object } = req.body;
    const plan = req.plan;

    if (!image || !object) {
      return res.json({ success: false, message: "Image and object required" });
    }

    if (plan !== "premium") {
      return res.json({ success: false, message: "Only premium users allowed" });
    }

    const upload = await cloudinary.uploader.upload(image.path);

    fs.unlinkSync(image.path);

    const imageUrl = cloudinary.url(upload.public_id, {
      transformation: [{ effect: `gen_remove:${object}` }]
    });

    await sql`
      INSERT INTO creations (user_id,prompt,content,type)
      VALUES (${userId}, ${`Removed ${object} from image`}, ${imageUrl}, 'image')
    `;

    res.json({ success: true, content: imageUrl });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};


/* =========================
   RESUME REVIEW
========================= */

export const resumeReview = async (req, res) => {
  try {

    const { userId } = await req.auth();
    const resume = req.file;
    const plan = req.plan;

    if (!resume) {
      return res.json({ success: false, message: "Resume required" });
    }

    if (plan !== "premium") {
      return res.json({ success: false, message: "Only premium users allowed" });
    }

    if (resume.size > 5 * 1024 * 1024) {
      return res.json({ success: false, message: "File must be under 5MB" });
    }

    const buffer = fs.readFileSync(resume.path);
    const pdfData = await pdf(buffer);

    fs.unlinkSync(resume.path);

    const prompt = `
You are an expert recruiter.

Analyze this resume and give:

1. Strengths
2. Weaknesses
3. Missing Skills
4. ATS Score out of 100
5. Improvement suggestions

Resume:
${pdfData.text}
`;

    const response = await AI.chat.completions.create({
      model: "gemini-3-flash-preview",
      messages: [
        { role: "system", content: "You are a professional HR recruiter." },
        { role: "user", content: prompt }
      ],
      max_tokens: 1000
    });

    const content = response.choices[0].message.content;

    await sql`
      INSERT INTO creations (user_id,prompt,content,type)
      VALUES (${userId}, 'Resume review', ${content}, 'resume-review')
    `;

    res.json({ success: true, content });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};