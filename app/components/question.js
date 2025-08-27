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
    <div className='cursor-pointer w-full border-zinc-700 bg-zinc-800 p-4 mb-4 rounded-2xl border-2 hover:shadow-2xl hover:shadow-zinc-600/20 transition-all'>
      <div className='flex items-center justify-between' onClick={() => setView(!view)}>
        <h4 className='text-xl text-white font-semibold'>{ques}</h4>
        <i
          className={`fa-solid fa-caret-down text-white mr-4 transition-transform duration-300 ${
            view ? 'rotate-180' : 'rotate-0'
          }`}
        ></i>
      </div>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          view ? 'max-h-[500px] opacity-100 translate-y-0' : 'max-h-0 opacity-0 translate-y-[-10px]'
        }`}
      >
        <p className='text-base text-gray-300 mt-2'>
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