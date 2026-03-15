import { Scissors, ScissorsIcon, Sparkles } from 'lucide-react';
import React, { useState } from 'react'
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';
import toast from 'react-hot-toast';


axios.defaults.baseURL=import.meta.env.VITE_BASE_URL;



const RemoveObj = () => {

  const blogCategories = ['General' , 'Technology' , 'Bussiness' , 'Health' , 'Lifestyle' , 'Education' ,'Travel' , 'Food' , ]
      
        const [selectedCategory , setSelectedCategory ] = useState('General');
        const [input , setInput] = useState(null);
        const [object , setObject] = useState('');
        const [loading , setLoading] = useState(false)
          const [content , setContent]  =useState('')
        
          const {getToken} = useAuth()
      
  const onSubmitHandler = async (e) => {
  e.preventDefault();

  try {
    setLoading(true);

    if (!input) {
      toast.error("Please upload an image");
      return;
    }

    if (object.split(" ").length > 1) {
      toast("Please enter only one object name");
      return;
    }

    const formData = new FormData();
    formData.append("image", input);
    formData.append("object", object);

    const token = await getToken();

    const { data } = await axios.post(
      "/api/ai/remove-image-object",
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    if (data.success) {
      setContent(data.content);
    } else {
      toast.error(data.message);
    }

  } catch (error) {
    toast.error(error.message);
  }

  setLoading(false);
};


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
          onChange={(e)=>setInput(e.target.files[0])} 
          accept='image/*'
          type="file"
          
          className="w-full mt-2 p-2 px-3 text-sm border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-200 text-gray-600"
          required
          />

        {/* Article Length */}


        <p className="mt-6 text-sm font-medium">Describe object to remove</p>
          <textarea
          onChange={(e)=>setObject(e.target.value)} value={object}
          rows={4}
          
          placeholder="e.g., car in background, tree from the image"
          className="w-full mt-2 p-2 px-3 text-sm border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-200"
          required
          />
       
        

        <button disabled={loading} className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#417DF6] to-[#8E37EB] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer">
          {
            loading ? <span className='w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin'> </span> : <Scissors className="w-5"/>
          }
          
          Remove Object
        </button>

      </form>

      {/* Right Column */}
      <div className="w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96 ">

        <div className="flex items-center gap-3">
          <ScissorsIcon className="w-5 h-5 text-[#4A7AFF]"/>
          <h1 className="text-xl font-semibold">Processed Image</h1>

        </div>

        {
          !content ? (
            <div className="flex-1 flex justify-center items-center">
          <div className="text-sm flex flex-col items-center gap-5 text-gray-400 ">
          <ScissorsIcon className="w-9 h-9 "/>
          <p>Upload an image and click "Remove Object" to get started</p>
          </div>

        </div>

          ) : (
            <img src={content} alt="image" className='mt-3 w-full h-full ' />
          )
        }
        

      </div>

    </div>
    </div>
  )
}

export default RemoveObj 