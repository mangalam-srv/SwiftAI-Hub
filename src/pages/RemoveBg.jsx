import { Eraser, EraserIcon, LucideEraser, Sparkles } from 'lucide-react';
import React, { useState } from 'react'

const RemoveBg = () => {

  const blogCategories = ['General' , 'Technology' , 'Bussiness' , 'Health' , 'Lifestyle' , 'Education' ,'Travel' , 'Food' , ]
    
      const [selectedCategory , setSelectedCategory ] = useState('General');
      const [input , setInput] = useState('');
    
      const onSubmitHandler = async(e)=>{
        e.preventDefault()
      }
  return (
    <div>
      <div className="h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-6 text-slate-700">

      {/* Left Column */}
      <form 
      onSubmit={onSubmitHandler}
      className="w-full max-w-lg p-6 bg-white rounded-xl border border-gray-200">

        {/* Title */}
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 text-[#FF4938]" />
          <h1 className="text-xl font-semibold">Background Removal</h1>
        </div>

          {/* Article Topic */}
          <p className="mt-6 text-sm font-medium">Upload Image</p>
          <input
          onClick={(e)=>setInput(e.target.files[0])} 
          accept='image/*'
          type="file"
          
          className="w-full mt-2 p-2 px-3 text-sm border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-200 text-gray-600"
          required
          />

        {/* Article Length */}
       
        

       <p className='text-xs text-gray-500 font-light mt-1'>Supports JPG, PNG, and other file formats</p>
        <button className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#F6AB41] to-[#FF4938] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer">
          <Eraser className="w-5"/>
          Remove Background
        </button>

      </form>

      {/* Right Column */}
      <div className="w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96 ">

        <div className="flex items-center gap-3">
          <LucideEraser className="w-5 h-5 text-[#FF4938]"/>
          <h1 className="text-xl font-semibold">Processed Image</h1>

        </div>
        <div className="flex-1 flex justify-center items-center">
          <div className="text-sm flex flex-col items-center gap-5 text-gray-400 ">
          <LucideEraser className="w-9 h-9 "/>
          <p>Upload an image and click "Remove Background" to get started</p>
          </div>

        </div>

      </div>

    </div>
    </div>
  )
}

export default RemoveBg