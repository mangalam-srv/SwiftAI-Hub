import express from 'express';
import { generateArticle, generateBlogTitle, generateImage, removeImageBG, removeImageOBJ, resumeReview } from '../controllers/aicontroller.js';
import { auth } from '../middlewares/auth.js';
import { upload } from '../configs/multer.js';

const aiRouter = express.Router();

aiRouter.post('/generate-article' , auth , generateArticle);
aiRouter.post('/generate-blog-title' , auth , generateBlogTitle);
aiRouter.post('/generate-image' , auth , generateImage);
aiRouter.post('/remove-image-bg' ,upload.single('image'), auth , removeImageBG);
aiRouter.post('/remove-image-object' ,upload.single('image'), auth , removeImageOBJ);
aiRouter.post('/resume-review' ,upload.single('resume'), auth , resumeReview);


export default aiRouter