'use client'
import React, { forwardRef } from 'react'
import Questions from './question'

const FAQ = forwardRef((props, ref) => {
  
  return (
    <div ref={ref} className='bg-zinc-900 p-[40px] leading-[1.6rem] w-full max-w-6xl mx-auto'>
        <h1 className='text-4xl font-bold text-center  text-white p-[20px] mb-[30px]'  >Frequently Asked Questions</h1>
        <Questions ques="What is ScanWare?" answer="Cybercriminals distribute fake banking apps that look like legitimate ones. These malicious APKs steal sensitive information such as login credentials, leading to financial theft. ScanWare detects and flags such fake apps before they reach users."/>
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
  )
})

export default FAQ