'use client'
import React, { forwardRef } from 'react'
import Questions from './question'

const FAQ = forwardRef((props, ref) => {
  
  return (
    <div ref={ref} className='bg-[#101624] p-[40px] leading-[1.6rem]  'style={{background: "radial-gradient(125% 125% at 50% 100%, #000000 40%, #010133 100%)"}}>
        <h1 className='text-4xl font-bold text-center  text-white p-[20px] mb-[30px]'  >Frequently Asked Questions</h1>
        <Questions ques="What is ScanWare?" answer="Cybercriminals distribute fake banking apps that look like legitimate ones. These malicious APKs steal sensitive information such as login credentials, leading to financial theft. ScanWare detects and flags such fake apps before they reach users."/>
        <Questions ques="How does the detection system work?" answer={"We use a two-step approach:\n" +

"1. Static Analysis: Extracts and examines APK features like package name, signatures, permissions, certificates, and embedded code.\n" +

"2. Dynamic Analysis: Runs the app in a sandboxed emulator to observe real-time behavior such as network connections, API calls, and hidden malicious activities."
}/>
        <Questions ques="Is Resume2Web completely free?" answer="Yes! Resume2Web is 100% free to use. There are no hidden charges, and you can generate and download your portfolio website without any cost."/>
        <Questions ques="Can I customize the generated portfolio?" answer="Yes! Resume2Web allows you to choose different themes and layouts. You can also edit content, add new sections, and personalize your portfolio as per your needs."/>
        <Questions ques="What file formats are supported for uploading my resume?" answer="Resume2Web supports resumes in PDF formats. Simply upload your file, and we will extract the necessary details to create your portfolio website."/>
    </div>
  )
})

export default FAQ