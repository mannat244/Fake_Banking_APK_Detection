import Image from "next/image";
import NavBar from "./components/NavBar";
import Blog from "./components/Blog";
import Hero from "./components/Hero";
import Faq from "./components/faq";
import About from "./components/About";


export default function Home() {
  return (
    <div>
      <NavBar/>
      <section id="about">
        <Hero/>
      </section>
      <section id="service">
        <About/>
      </section>
      
      {/* Add your FAQ section/component here if you have one */}
      {/* <section id="faq"> <FaqComponent /> </section> */}
      <section id="blog">
        <Blog 
          name="The Rise of Cybersecurity in the Digital Age" 
          details="Cybersecurity is increasingly vital as digital threats evolve. Organizations must adopt robust measures to protect sensitive data and ensure safe online experiences."
        />
      </section>
      <section id="faq">
        <Faq />
      </section>
    </div>
  );
}
