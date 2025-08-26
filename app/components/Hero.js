'use client';
import React from 'react'

const Hero = () => {

  const handleFileChange = (event) => {
    // You can handle the selected file here
    const file = event.target.files[0];
    console.log(file);
  };

  return (
    <div className="bg-[url('/designs/hero-bg.png')] bg-cover bg-center h-screen flex flex-col items-center justify-center">
      <div className="self-start text-left ml-16 -mt-30">
        <h1 className="text-6xl font-bold text-white mb-4 font-serif">Is Your App Real?</h1>
        <p className="text-lg text-white mb-6 font-mono">Find out before you lose everything,<br /> Your peace of mind is just one click away.</p>
        <input
          type="file"
          className="hidden"
          id="file-upload"
          onChange={handleFileChange}
          accept=".apk"
        />
        <label
          htmlFor="file-upload"
          className="inline-flex items-center gap-2 cursor-pointer px-8 py-3 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 text-white font-semibold rounded-lg shadow-md ring-2 ring-blue-300 hover:from-blue-600 hover:to-blue-800 hover:ring-blue-500 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-blue-400 mt-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5-5m0 0l5 5m-5-5v12" /></svg>
          Upload APK
        </label>
      </div>
    </div>
  );
};

export default Hero;
