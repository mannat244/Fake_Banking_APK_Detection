import React from 'react';

const services = [
  {
    title: "Metadata & Package Verification",
    desc: "We validate the APK's package name, version, and Google Play metadata to confirm authenticity against official records.",
    icon: (
      <svg className="w-8 h-8 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1M12 7C13.11 7 14 7.9 14 9C14 10.11 13.11 11 12 11C10.9 11 10 10.11 10 9C10 7.9 10.9 7 12 7M18 9C18 12.53 15.64 15.83 12.67 16.81C11.26 17.21 9.74 17.21 8.33 16.81C5.36 15.83 3 12.53 3 9V6.3L12 3L21 6.3V9Z"/>
      </svg>
    ),
  },
  {
    title: "Signature Matching",
    desc: "The APK's signature is compared against our trusted in-house database of original banking apps, ensuring the app hasn't been tampered with.",
    icon: (
      <svg className="w-8 h-8 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 12C14.21 12 16 10.21 16 8S14.21 4 12 4 8 5.79 8 8 9.79 12 12 12M12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z"/>
      </svg>
    ),
  },
  {
    title: "Permission & Manifest Analysis",
    desc: "By extracting permissions and flags from the APK manifest, we identify suspicious or dangerous requests that may signal fraudulent intent.",
    icon: (
      <svg className="w-8 h-8 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
        <path d="M21,16.5C21,16.88 20.79,17.21 20.47,17.38L12.57,21.82C12.41,21.94 12.21,22 12,22C11.79,22 11.59,21.94 11.43,21.82L3.53,17.38C3.21,17.21 3,16.88 3,16.5V7.5C3,7.12 3.21,6.79 3.53,6.62L11.43,2.18C11.59,2.06 11.79,2 12,2C12.21,2 12.41,2.06 12.57,2.18L20.47,6.62C20.79,6.79 21,7.12 21,7.5V16.5M12,4.15L6.04,7.5L12,10.85L17.96,7.5L12,4.15Z"/>
      </svg>
    ),
  },
  {
    title: "Code & URL Inspection",
    desc: "Using advanced decompilation and YARA-based scanning, we detect malicious URLs, leaked tokens, and weak cryptographic methods hidden within the code.",
    icon: (
      <svg className="w-8 h-8 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
        <path d="M8,3A2,2 0 0,0 6,5V9A2,2 0 0,1 4,11H3V13H4A2,2 0 0,1 6,15V19A2,2 0 0,0 8,21H10V19H8V14A2,2 0 0,0 6,12A2,2 0 0,0 8,10V5H10V3M16,3A2,2 0 0,1 18,5V9A2,2 0 0,0 20,11H21V13H20A2,2 0 0,0 18,15V19A2,2 0 0,1 16,21H14V19H16V14A2,2 0 0,1 18,12A2,2 0 0,1 16,10V5H14V3H16Z"/>
      </svg>
    ),
  },
  {
    title: "Real-Time Behavioral Analysis",
    desc: "The APK is run in a controlled emulator to observe its behavior, allowing us to detect hidden malicious actions that static checks might miss.",
    icon: (
      <svg className="w-8 h-8 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12,18.5A6.5,6.5 0 0,1 5.5,12A6.5,6.5 0 0,1 12,5.5A6.5,6.5 0 0,1 18.5,12A6.5,6.5 0 0,1 12,18.5M12,16.5A4.5,4.5 0 0,0 16.5,12A4.5,4.5 0 0,0 12,7.5A4.5,4.5 0 0,0 7.5,12A4.5,4.5 0 0,0 12,16.5M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"/>
      </svg>
    ),
  },
  {
    title: "API & Network Call Monitoring",
    desc: "With tools like Frida and Objection, we analyze API calls, SSL bypass attempts, and other runtime exploits to uncover advanced fraud techniques.",
    icon: (
      <svg className="w-8 h-8 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
        <path d="M15,9H9V7.5H15M15,16.5H9V15H15M21,5V19A2,2 0 0,1 19,21H5A2,2 0 0,1 3,19V5A2,2 0 0,1 5,3H19A2,2 0 0,1 21,5M19,5H5V19H19V5Z"/>
      </svg>
    ),
  },
];

const About = () => (
  <section className="py-16 px-4" 
           style={{
             background: "radial-gradient(ellipse at center, #0a1428 0%, #061018 30%, #030b1a 70%, #000408 100%)"
           }}>
    <h2 className="text-5xl font-bold text-white mb-6 text-center">Service Overview</h2>
    <p className="text-center text-gray-300 mb-10">
        Double-layered protection that outsmarts even the smartest fake apps.
    </p>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center max-w-5xl mx-auto">
      {services.map((service, idx) => (
        <div key={idx} 
             className="rounded-2xl shadow-xl p-6 w-full max-w-sm flex flex-col items-center hover:scale-105 transition-all duration-300 group"
             style={{
               background: "linear-gradient(145deg, rgba(16, 22, 36, 0.8) 0%, rgba(8, 15, 28, 0.9) 100%)",
               border: "1px solid rgba(59, 130, 246, 0.2)",
               backdropFilter: "blur(10px)"
             }}>
          <div className="mb-4 p-3 rounded-lg border border-blue-400/30" 
               style={{
                 background: "linear-gradient(145deg, rgba(59, 130, 246, 0.15) 0%, rgba(37, 99, 235, 0.25) 100%)"
               }}>
            {service.icon}
          </div>
          <h3 className="text-white text-lg font-semibold mb-3 text-center">{service.title}</h3>
          <p className="text-gray-300 text-center text-sm leading-relaxed">{service.desc}</p>
        </div>
      ))}
    </div>
  </section>
);

export default About;
