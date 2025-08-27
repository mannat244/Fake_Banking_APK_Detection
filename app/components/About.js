import React from 'react';

const services = [
  {
    title: "Metadata & Package Verification",
    desc: "We validate the APK’s package name, version, and Google Play metadata to confirm authenticity against official records.",
    icon: "🛡️", // Replace with your SVG/icon
  },
  {
    title: "Signature Matching",
    desc: "The APK’s signature is compared against our trusted in-house database of original banking apps, ensuring the app hasn’t been tampered with.",
    icon: "🕑",
  },
  {
    title: "Permission & Manifest Analysis",
    desc: "By extracting permissions and flags from the APK manifest, we identify suspicious or dangerous requests that may signal fraudulent intent.",
    icon: "☁️",
  },
  {
    title: "Code & URL Inspection",
    desc: "Using advanced decompilation and YARA-based scanning, we detect malicious URLs, leaked tokens, and weak cryptographic methods hidden within the code.",
    icon: "💡",
  },
  {
    title: "Real-Time Behavioral Analysis",
    desc: "The APK is run in a controlled emulator to observe its behavior, allowing us to detect hidden malicious actions that static checks might miss.",
    icon: "🔑",
  },
  {
    title: "API & Network Call Monitoring",
    desc: "With tools like Frida and Objection, we analyze API calls, SSL bypass attempts, and other runtime exploits to uncover advanced fraud techniques.",
    icon: "🔄",
  },
];

const About = () => (
  <section className="py-16 px-4">
    <h2 className="text-3xl font-bold text-center text-white mb-4">Service Overview</h2>
    <p className="text-center text-gray-300 mb-10">
        We safeguard your banking experience with a two-layered approach: Static Analysis for deep inspection of APK code and metadata,<br></br> and Dynamic Analysis for real-time behavior monitoring. Together, these methods ensure no fraudulent app slips through undetected.
    </p>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
      {services.map((service, idx) => (
        <div key={idx} className="bg-[#101624] rounded-2xl shadow-lg p-8 w-full max-w-xs flex flex-col items-center border border-blue-900 hover:scale-105 transition-transform duration-300">
          <div className="text-4xl mb-4">{service.icon}</div>
          <h3 className="text-white text-xl font-semibold mb-2 text-center">{service.title}</h3>
          <p className="text-gray-300 text-center">{service.desc}</p>
        </div>
      ))}
    </div>
  </section>
);

export default About;