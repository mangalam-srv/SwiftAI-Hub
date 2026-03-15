import { Eraser, FileText, LucideEraser, Sparkles } from "lucide-react"
import React, { useState } from "react"
import axios from "axios"
import { useAuth } from "@clerk/clerk-react"
import toast from "react-hot-toast"

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL
import  ReactMarkdown  from 'react-markdown';

const ReviewResume = () => {
  const blogCategories = [
    "General",
    "Technology",
    "Bussiness",
    "Health",
    "Lifestyle",
    "Education",
    "Travel",
    "Food",
  ]

  const [selectedCategory, setSelectedCategory] = useState("General")
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [content, setContent] = useState("")

  const { getToken } = useAuth()
  const onSubmitHandler = async (e) => {
    e.preventDefault()

    try {
      setLoading(true)

      if (!input) {
        toast.error("Please upload an image")
        return
      }

      

      const formData = new FormData()
      formData.append("resume", input)

      const token = await getToken()

      const { data } = await axios.post(
        "/api/ai/resume-review",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      if (data.success) {
        setContent(data.content)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }

    setLoading(false)
  }
  return (
    <div>
      <div className="h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-6 text-slate-700">
        {/* Left Column */}
        <form
          onSubmit={onSubmitHandler}
          className="w-full max-w-lg p-6 bg-white rounded-xl border border-gray-200"
        >
          {/* Title */}
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 text-[#00DA83]" />
            <h1 className="text-xl font-semibold">Resume Review</h1>
          </div>

          {/* Article Topic */}
          <p className="mt-6 text-sm font-medium">Upload Resume</p>
          <input
            onChange={(e) => setInput(e.target.files[0])}
            accept="application/pdf"
            type="file"
            className="w-full mt-2 p-2 px-3 text-sm border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-200 text-gray-600"
            required
          />

          {/* Article Length */}

          <p className="text-xs text-gray-500 font-light mt-1">
            Supports PDF format
          </p>
          <button  className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#00DA83] to-[#009BB3] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer">
            {
              loading ? <span className="w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin"></span> : <FileText className="w-5" />
            }
            
            Review Resume
          </button>
        </form>

        {/* Right Column */}
        <div className="w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96 max-h-[600px]">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-[#00DA83]" />
            <h1 className="text-xl font-semibold">Analysis Result</h1>
          </div>
          {
            !content ? (
              <div className="flex-1 flex justify-center items-center">
            <div className="text-sm flex flex-col items-center gap-5 text-gray-400 ">
              <FileText className="w-9 h-9 " />
              <p>Upload your resume and click "Review Resume" to get started</p>
            </div>
          </div>
            ) : (
              <div className="mt-3 h-full overflow-y-scroll text-sm text-slate-600">
                <div className="reset-tw">
                <ReactMarkdown>
                   {content}
                  </ReactMarkdown>
                </div>
                


              </div>
            )
          }
          
        </div>
      </div>
    </div>
  )
}

export default ReviewResume
