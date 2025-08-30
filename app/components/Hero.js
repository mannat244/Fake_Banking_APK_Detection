'use client';
import React, { useState } from 'react'

const Hero = () => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    console.log(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].name.endsWith('.apk')) {
      console.log(files[0]);
    }
  };

  return (
    <div className="h-screen flex items-center justify-between px-32" 
         style={{
           background: "radial-gradient(ellipse at center, #0a1428 0%, #061018 30%, #030b1a 70%, #000408 100%)"
         }}>
      <div className="flex flex-col justify-center ml-16">
        <h1 className="text-7xl font-bold mb-4 font-serif">
          <span className="text-white">Download safe.</span><br></br>
          <span className="bg-gradient-to-tl from-slate-800 via-cyan-500 to-zinc-400 bg-clip-text text-transparent">Bank safe.<br></br> Stay safe.</span>
        </h1>
        <p className="text-lg text-white mb-6 font-sans">
         Protect your money before it's too late.<br></br>Our AI-powered system detects and stops fake banking apps<br></br> before they reach your phone.
        </p>
        
        {/* Drag and Drop Upload Area - Adjusted padding and button styling */}
        <div 
          className={`relative border-2 border-dashed rounded-2xl py-2 px-8 w-[450px] flex items-center justify-center transition-all duration-300 ${
            isDragOver 
              ? 'border-cyan-400 bg-cyan-500/10' 
              : 'border-gray-500 hover:border-cyan-500'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="text-center">
            <div className="mb-4">
              <svg className="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
            </div>
            <p className="text-white text-base mb-3">Drag and drop your APK file here</p>
            <p className="text-gray-400 text-sm mb-4">or</p>
            
            <input
              type="file"
              className="hidden"
              id="file-upload"
              onChange={handleFileChange}
              accept=".apk"
            />
            <label
              htmlFor="file-upload"
              className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-white rounded-lg group bg-gradient-to-br from-cyan-400 to-blue-900 hover:from-cyan-300 hover:to-blue-800 focus:ring-4 focus:outline-none focus:ring-cyan-800 cursor-pointer transition-all duration-300"
            >
              <span className="relative flex items-center gap-2 px-5 py-2.5 transition-all ease-in duration-300 bg-gray-900 rounded-md group-hover:bg-transparent">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5-5m0 0l5 5m-5-5v12" />
                </svg>
                Upload APK
              </span>
            </label>
          </div>
        </div>
      </div>
      <img
        src="/designs/hero-vector-img.png"
        alt="Hero"
        className="w-[500px] h-auto object-contain rounded-lg mr-16"
      />
    </div>
  );
};

export default Hero;