'use client'
import React, { useState, useEffect } from 'react';

const Questions = ({ ques, answer }) => {
  const [view, setView] = useState(false);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://kit.fontawesome.com/04fddebb2c.js';
    script.crossOrigin = 'anonymous';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className='cursor-pointer w-full p-6 mb-4 rounded-2xl hover:scale-105 transition-all duration-300'
         style={{
           background: "linear-gradient(145deg, rgba(16, 22, 36, 0.8) 0%, rgba(8, 15, 28, 0.9) 100%)",
           border: "1px solid rgba(59, 130, 246, 0.2)",
           backdropFilter: "blur(10px)"
         }}>
      <div className='flex items-center justify-between' onClick={() => setView(!view)}>
        <h4 className='text-xl text-white font-semibold'>{ques}</h4>
        <i
          className={`fa-solid fa-caret-down text-blue-400 mr-4 transition-transform duration-300 ${
            view ? 'rotate-180' : 'rotate-0'
          }`}
        ></i>
      </div>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          view ? 'max-h-[500px] opacity-100 translate-y-0' : 'max-h-0 opacity-0 translate-y-[-10px]'
        }`}
      >
        <p className='text-base text-gray-300 mt-4 pt-4 border-t border-gray-600/30'>
          {answer.split('\n').map((line, idx) => (
            <React.Fragment key={idx}>
              {line}
              <br />
            </React.Fragment>
          ))}
        </p>
      </div>
    </div>
  );
};

export default Questions;