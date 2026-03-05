import { Scissors, ScissorsIcon, Sparkles } from 'lucide-react';
import React, { useState } from 'react'

const RemoveObj = () => {

  const blogCategories = ['General' , 'Technology' , 'Bussiness' , 'Health' , 'Lifestyle' , 'Education' ,'Travel' , 'Food' , ]
      
        const [selectedCategory , setSelectedCategory ] = useState('General');
        const [input , setInput] = useState('');
        const [object , setObject] = useState('');
      
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
          <Sparkles className="w-6 text-[#4A7AFF]" />
          <h1 className="text-xl font-semibold">Object Removal</h1>
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


        <p className="mt-6 text-sm font-medium">Describe object to remove</p>
          <textarea
          onClick={(e)=>setObject(e.target.value)} value={object}
          row={4}
          
          placeholder="e.g., car in background, tree from the image"
          className="w-full mt-2 p-2 px-3 text-sm border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-200"
          required
          />
       
        

        <button className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#417DF6] to-[#8E37EB] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer">
          <Scissors className="w-5"/>
          Remove Object
        </button>

      </form>

      {/* Right Column */}
      <div className="w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96 ">

        <div className="flex items-center gap-3">
          <ScissorsIcon className="w-5 h-5 text-[#4A7AFF]"/>
          <h1 className="text-xl font-semibold">Processed Image</h1>

        </div>
        <div className="flex-1 flex justify-center items-center">
          <div className="text-sm flex flex-col items-center gap-5 text-gray-400 ">
          <ScissorsIcon className="w-9 h-9 "/>
          <p>Upload an image and click "Remove Object" to get started</p>
          </div>

        </div>

      </div>

    </div>
    </div>
  )
}

export default RemoveObj 