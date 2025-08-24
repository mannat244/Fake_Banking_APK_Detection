import React from 'react'

const Scan = () => {
  return (
    <div>
    <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
        <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 48 48">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 32v-8m0 0l8-8m-8 8l-8-8m8 8v8m16 0a4 4 0 01-4 4H12a4 4 0 01-4-4V16a4 4 0 014-4h20a4 4 0 014 4v16z"/>
        </svg>
        <p className="mb-2 text-gray-600">Click to upload or drag and drop</p>
        <input type="file" className="hidden" id="file-upload" />
        <label htmlFor="file-upload" className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Select File
        </label>
    </div>
    </div>
  )
}

export default Scan
