"use client";

import React, { useState } from 'react'

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full h-16 z-50 flex items-center justify-between px-4 sm:px-6 border-b border-[#0e1b2e4d] backdrop-blur-lg bg-[#061018]/80">
      
      {/* Logo */}
      <div className="flex items-center ml-35">
        <img
          src="/designs/logo.png"
          alt="Logo"
          className="h-8 sm:h-10 lg:h-12 w-auto object-contain cursor-pointer"
        />
      </div>

      {/* Desktop Menu */}
      <div className="hidden md:flex gap-4 lg:gap-8 items-center mr-64">
        <a href="#home" className="text-white hover:text-[#47a4d7] font-medium transition duration-300 text-sm lg:text-base">Home</a>
        <a href="#about" className="text-white hover:text-[#47a4d7] font-medium transition duration-300 text-sm lg:text-base">Services</a>
        <a href="#blog" className="text-white hover:text-[#47a4d7] font-medium transition duration-300 text-sm lg:text-base">Blogs</a>
        <a href="#faq" className="text-white hover:text-[#47a4d7] font-medium transition duration-300 text-sm lg:text-base">FAQs</a>
      </div>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden text-white p-2"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label="Toggle menu"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {isMenuOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="absolute top-16 left-0 w-full bg-[#061018]/95 backdrop-blur-lg border-b border-[#0e1b2e4d] md:hidden">
          <div className="flex flex-col space-y-4 p-4">
            <a 
              href="#home" 
              className="text-white hover:text-[#47a4d7] font-medium transition duration-300 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </a>
            <a 
              href="#about" 
              className="text-white hover:text-[#47a4d7] font-medium transition duration-300 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Services
            </a>
            <a 
              href="#blog" 
              className="text-white hover:text-[#47a4d7] font-medium transition duration-300 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Blogs
            </a>
            <a 
              href="#faq" 
              className="text-white hover:text-[#47a4d7] font-medium transition duration-300 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              FAQs
            </a>
          </div>
        </div>
      )}
    </nav>
  )
}

export default NavBar