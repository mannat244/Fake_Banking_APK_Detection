'use client'
import React, { forwardRef } from 'react'
import Questions from './question'

const FAQ = forwardRef((props, ref) => {
  
  return (
    <div ref={ref} 
         className='min-h-screen w-full'
         style={{
           background: "radial-gradient(ellipse at center, #0a1428 0%, #061018 30%, #030b1a 70%, #000408 100%)"
         }}>
      <div className='p-16 leading-[1.6rem] w-full max-w-6xl mx-auto'>
        <h1 className='text-5xl font-bold text-center text-white p-5 mb-8'>Frequently Asked Questions</h1>
        <div className="space-y-4">
          <Questions ques="What is FraudRakshak?" answer="Cybercriminals distribute fake banking apps that look like legitimate ones. These malicious APKs steal sensitive information such as login credentials, leading to financial theft. FraudRakshak detects and flags such fake apps before they reach users."/>
          <Questions ques="How does the detection system work?" answer={"We use a two-step approach:\n" +
  "1. Static Analysis: Extracts and examines APK features like package name, signatures, permissions, certificates, and embedded code.\n" +
  "2. Dynamic Analysis: Runs the app in a sandboxed emulator to observe real-time behavior such as network connections, API calls, and hidden malicious activities."
  }/>
          <Questions ques="What features are analyzed in the APK?" answer={"1. Package name and metadata validation \n" +
  "2. Signature and certificate authenticity \n" +
  "3. Requested permissions (flagging dangerous ones) \n" +
  "4. Embedded URLs, API keys, and cryptographic methods \n" +
  "5. Runtime behaviors and network traffic patterns"}/>
          <Questions ques="How are uploaded APKs handled securely?" answer="Uploaded files are analyzed in an isolated sandbox environment. They are not shared with third parties and are deleted after the analysis to protect user privacy."/>
          <Questions ques="How is this different from Play Protect or VirusTotal?" answer="Unlike general malware scanners, our system is specialized for banking apps. It focuses on features like package name authenticity, developer signatures, permissions, and banking-specific threats."/>
        </div>
    </div>
    </div>
  )
})

export default FAQ