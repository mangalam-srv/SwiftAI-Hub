import React, { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'
import { Menu, X } from 'lucide-react'
import Sidebar from '../components/Sidebar'
import { SignIn , useUser } from '@clerk/clerk-react'

const Layout = () => {
  const navigate = useNavigate()
  const [sidebar, setSidebar] = useState(false)
  const {user} = useUser()

  return user? (
    <div className='flex flex-col h-screen'>

      {/* Navbar */}
      <nav className='w-full px-8 h-14 flex items-center justify-between border-b border-gray-200'>
        <div className='flex items-center gap-2 cursor-pointer  ' onClick={() => navigate('/')}>
          <img src={assets.logom} alt="" className='h-10 w-10' />
          <h1 className='font-semibold'>SWIFT-AI HUB</h1>
        </div>

        {sidebar ? (
          <X onClick={() => setSidebar(false)} className='w-6 h-6 text-gray-600 sm:hidden' />
        ) : (
          <Menu onClick={() => setSidebar(true)} className='w-6 h-6 text-gray-600 sm:hidden' />
        )}
      </nav>

      {/* Content Area */}
      <div className='flex flex-1 w-full'>
        <Sidebar sidebar={sidebar} setSidebar={setSidebar} />

        <div className='flex-1 p-6 overflow-y-auto'>
          <Outlet />
        </div>
      </div>

    </div>
  ) : (
    <div className='flex items-center justify-center h-screen'>
      <SignIn/>
    </div>
  )
}

export default Layout