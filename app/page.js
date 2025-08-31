'use client'
import React, { useState } from "react";
import NavBar from "./components/NavBar";
import Blog from "./components/Blog";
import Hero from "./components/Hero";
import Faq from "./components/faq";
import About from "./components/About";
import APKScanner from "./components/APKScanner";

export default function Home() {
  
  return (
    <div>
      <NavBar />
          <section id="home">
            <Hero/>
          </section>
          <section id="about">
            <About/>
          </section>
          <section id="blog">
            <Blog/>
          </section>
          <section id="faq">
            <Faq />
          </section>
    </div>
  );
}