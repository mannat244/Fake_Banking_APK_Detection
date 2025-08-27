'use client';
import React from 'react'

const Hero = () => {

  const handleFileChange = (event) => {
    // You can handle the selected file here
    const file = event.target.files[0];
    console.log(file);
  };

  return (
    <div className="h-screen flex items-center justify-between px-16">
      <div className="flex flex-col justify-center">
        <h1 className="bg-gradient-to-tl from-slate-800 via-cyan-500 to-zinc-400 bg-clip-text text-transparent text-7xl font-bold mb-4 font-serif">Download safe.<br></br> Bank safe.<br></br> Stay safe.</h1>
        <p className="text-lg text-white mb-6 font-serif">
         Protect your money before it’s too late.<br></br>Our AI-powered system detects and stops fake banking apps<br></br> before they reach your phone.
        </p>
        <input
          type="file"
          className="hidden"
          id="file-upload"
          onChange={handleFileChange}
          accept=".apk"
        />
        <label
          htmlFor="file-upload"
          className="inline-flex items-center gap-2 cursor-pointer px-4 py-3 w-45 bg-gradient-to-r from-cyan-900 via-cyan-700 to-cyan-500 text-white font-semibold rounded-lg shadow-md ring-2 ring-blue-300 hover:from-cyan-950 hover:to-cyan-900 hover:ring-blue-500 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-blue-400 mt-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5-5m0 0l5 5m-5-5v12" /></svg>
          Upload APK
        </label>
      </div>
      <img
        src="/designs/hero-vector-img.png"
        alt="Hero"
        className="w-[500px] h-auto object-contain rounded-lg"
      />
    </div>
  );
};

export default Hero;
