'use client'
import React, { useState } from "react";
import NavBar from "./components/NavBar";
import Blog from "./components/Blog";
import Hero from "./components/Hero";
import Faq from "./components/faq";
import About from "./components/About";
import APKScanner from "./components/APKScanner";

export default function Home() {
  const [showScanner, setShowScanner] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  console.log('Page component - showScanner:', showScanner);
  console.log('Page component - selectedFile:', selectedFile);

  const handleFileSelected = (file) => {
    console.log('handleFileSelected called with file:', file);
    console.log('File name:', file?.name);
    console.log('File size:', file?.size);
    
    if (!file) {
      console.error('No file received in handleFileSelected');
      return;
    }
    
    console.log('Setting selectedFile and showScanner to true');
    setSelectedFile(file);
    setShowScanner(true);
    
    console.log('State should be updated now');
  };

  const handleBackToHome = () => {
    console.log('handleBackToHome called');
    setShowScanner(false);
    setSelectedFile(null);
  };

  console.log('Rendering page - showScanner:', showScanner);

  return (
    <div>
      {!showScanner && <NavBar />}

      {!showScanner ? (
        <>
          <section id="home">
            <Hero onFileSelect={handleFileSelected} />
          </section>
          <section id="about">
            <About />
          </section>
          <section id="blog">
            <Blog
              name="The Rise of Cybersecurity in the Digital Age"
              details="Cybersecurity is increasingly vital as digital threats evolve. Organizations must adopt robust measures to protect sensitive data and ensure safe online experiences."
            />
          </section>
          <section id="faq">
            <Faq />
          </section>
        </>
      ) : (
        <>
          {console.log('Rendering APKScanner with file:', selectedFile)}
          <APKScanner onBackToHome={handleBackToHome} initialFile={selectedFile} />
        </>
      )}
    </div>
  );
}