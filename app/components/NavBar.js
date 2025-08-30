"use client";

import React from 'react'

const NavBar = () => {
  return (
    <nav className="fixed top-0 left-0 w-full h-16 z-50 flex items-center justify-between px-6 border-b border-[#0e1b2e4d] backdrop-blur-lg bg-[#061018]/80">
      {/* Logo Section */}
      <div className="flex items-center">
        <img
          src="/designs/logo.png"
          alt="Logo"
          className="h-12 w-auto object-contain cursor-pointer ml-35"
        />
      </div>

      {/* Links Section */}
      <div className="flex gap-8 items-center mr-64">
        <a href="#home" className="text-white hover:text-[#47a4d7] font-medium transition duration-300">Home</a>
        <a href="#about" className="text-white hover:text-[#47a4d7] font-medium transition duration-300">Services</a>
        <a href="#blog" className="text-white hover:text-[#47a4d7] font-medium transition duration-300">Blogs</a>
        <a href="#faq" className="text-white hover:text-[#47a4d7] font-medium transition duration-300">FAQs</a>
      </div>
    </nav>
  )
}

export default NavBar
