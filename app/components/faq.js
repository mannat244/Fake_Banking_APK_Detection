import React, { forwardRef } from 'react'
import Questions from './question'

const FAQ = forwardRef((props, ref) => {
  
  return (
    <div ref={ref} className='bg-zinc-900 p-[40px] leading-[1.6rem]  '>
        <h1 className='text-4xl font-bold text-center  text-white p-[20px] mb-[30px]'  >Frequently Asked Questions</h1>
        <Questions ques="What is Resume2Web?" answer="Resume2Web is a free online tool that converts your resume into a professional portfolio website. Simply upload your resume, and our AI-powered system will generate a fully functional website showcasing your skills, experience, and projects."/>
        <Questions ques="Do I need coding knowledge to use Resume2Web?" answer="No! Resume2Web is designed for everyone, even if you have no coding experience. Just upload your resume, and we take care of the rest—creating a well-structured and visually appealing portfolio for you."/>
        <Questions ques="Is Resume2Web completely free?" answer="Yes! Resume2Web is 100% free to use. There are no hidden charges, and you can generate and download your portfolio website without any cost."/>
        <Questions ques="Can I customize the generated portfolio?" answer="Yes! Resume2Web allows you to choose different themes and layouts. You can also edit content, add new sections, and personalize your portfolio as per your needs."/>
        <Questions ques="What file formats are supported for uploading my resume?" answer="Resume2Web supports resumes in PDF formats. Simply upload your file, and we will extract the necessary details to create your portfolio website."/>
    </div>
  )
})

export default FAQ