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
        <label htmlFor="file-upload" className="cursor-pointer px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Upload APK
        </label>
      </div>
    </div>
  );
};

export default Hero;
