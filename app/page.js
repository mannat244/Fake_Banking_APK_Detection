import Image from "next/image";
import NavBar from "./components/NavBar";
import Scan from "./components/Scan";
import Blog from "./components/Blog";
import Hero from "./components/Hero";


export default function Home() {
  return (
    <div>
      <NavBar/>
      <Hero/>
      <Scan/>
      <Blog 
        name="The Rise of Cybersecurity in the Digital Age" 
        details="Cybersecurity is increasingly vital as digital threats evolve. Organizations must adopt robust measures to protect sensitive data and ensure safe online experiences."
      />
    </div>
  );
}
