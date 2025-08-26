'use client';
import React from 'react'

const Hero = () => {

  const handleFileChange = (event) => {
    // You can handle the selected file here
    const file = event.target.files[0];
    console.log(file);
  };

  return (
    <div
      className="bg-[url('/designs/hero-bg.png')] bg-cover bg-center h-screen flex flex-col items-center justify-center"
    >
      <h1 className="text-4xl font-bold text-white mb-4">Welcome to Fake Banking APK Detector</h1>
      <p className="text-lg text-white mb-6">Detect and analyze fake banking applications with ease.</p>
      <button className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Get Started</button>
    </div>
  );
};

export default Hero;
