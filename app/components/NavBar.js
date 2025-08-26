"use client";

import React from 'react'
import Link from 'next/link';

const NavBar = () => {
  return (
    <nav className="flex items-center p-4" style={{ backgroundColor: '#000512' }}>
      {/* Empty space for left (logo) */}
      <div className="flex-1"></div>

      
      <div className="flex gap-8 items-center flex-none">
        <Link href="/about" className="text-white hover:text-[#47a4d7] font-medium transition duration-300">About</Link>
        <Link href="/faq" className="text-white hover:text-[#47a4d7] font-medium transition duration-300">Faq</Link>
        <Link href="/blogs" className="text-white hover:text-[#47a4d7] font-medium transition duration-300">Blogs</Link>
      </div>
      <div className="flex-1 flex justify-end pr-20">
        <Link 
          href="/get-app" 
          className="relative inline-block px-6 py-2 font-semibold text-white rounded-full overflow-hidden group"
        >
          {/* animated gradient border */}
          <span className="absolute inset-0 rounded-full p-[2px] bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 animate-borderLight bg-[length:200%_200%]"></span>
          {/* inner background */}
          <span className="absolute inset-[2px] bg-black rounded-full"></span>
          <span className="relative z-10">Get App</span>
        </Link>
      </div>
    </nav>
  )
}

export default NavBar
