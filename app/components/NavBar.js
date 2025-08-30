"use client";

import React from 'react'

const NavBar = () => {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 flex items-center justify-center p-4 backdrop-blur-md" 
         style={{ 
           background: "rgba(6, 16, 24, 0.95)",
           borderBottom: "1px solid rgba(14, 27, 46, 0.3)"
         }}>
      
      <div className="flex gap-8 items-center">
        <a href="#about" className="text-white hover:text-[#47a4d7] font-medium transition duration-300">About</a>
        <a href="#faq" className="text-white hover:text-[#47a4d7] font-medium transition duration-300">Faq</a>
        <a href="#blog" className="text-white hover:text-[#47a4d7] font-medium transition duration-300">Blogs</a>
      </div>
    </nav>
  )
}

export default NavBar