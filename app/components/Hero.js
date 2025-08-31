'use client';
import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import { Bounce, toast} from 'react-toastify';


const successUpload = () => {
  toast.success('Apk Uploaded succesfully!', {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
    transition: Bounce,
    });
}

const Hero = () => {

  const [isDragOver, setIsDragOver] = useState(false);
  const [file, setFile] = useState(null);
  const [scanId, setScanId] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;
    if (!selectedFile.name.toLowerCase().endsWith('.apk')) {
      alert('Please upload a valid .apk file');
      return;
    }
    setFile(selectedFile);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (!droppedFile) return;
    if (!droppedFile.name.toLowerCase().endsWith('.apk')) {
      alert('Please upload a valid APK file');
      return;
    }
    setFile(droppedFile);
  };

  const handleUpload = async () => {
    if (!file) return alert('No file selected');

    const formData = new FormData();
    formData.append('file', file);

    try {
      setLoading(true);
      const res = await fetch(
        'https://fraudrakshakapi.onrender.com/upload_apk/',
        { method: 'POST', body: formData }
      );
      const data = await res.json();
      setScanId(data.scan_id);
      successUpload()
    localStorage.setItem('scan_id', data.scan_id);
    setTimeout(() => {
      window.location.href = `/scan?scanId=${data.scan_id}`;
    }, 1000);
    
    } catch (err) {
      console.error(err);
      alert('Error uploading file');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row items-center justify-between px-4 sm:px-8 lg:px-32 py-8 lg:py-0" 
         style={{ background: 'radial-gradient(ellipse at center, #0a1428 0%, #061018 30%, #030b1a 70%, #000408 100%)' }}>
      <div className="flex flex-col justify-center w-full lg:w-1/2 lg:ml-16 mt-16 lg:mt-20 mb-8 lg:mb-0">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 font-serif text-center lg:text-left">
          <span className="text-white">Stopping fraud</span><br />
          <span className="bg-gradient-to-tl from-slate-800 via-cyan-500 to-zinc-400 bg-clip-text text-transparent">Securing trust.</span>
        </h1>
        <p className="text-base sm:text-lg text-white mb-6 font-sans text-center lg:text-left max-w-2xl lg:max-w-none">
         Protect your money before it's too late.<br />Our AI-powered system detects and stops fake banking apps<br /> before they reach your phone.
        </p>
        <div 
          className={`relative border-2 border-dashed rounded-2xl py-4 sm:py-6 lg:py-2 px-4 sm:px-8 w-full max-w-md lg:max-w-[450px] flex flex-col items-center justify-center transition-all duration-300 mx-auto lg:mx-0 ${
            isDragOver ? 'border-cyan-400 bg-cyan-500/10' : 'border-gray-500 hover:border-cyan-500'
          }`}
          style={{ marginTop: '2.5rem' }}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="text-center mb-4">
            <Upload className="w-10 h-10 mx-auto text-gray-400" />
            <p className="text-white text-sm sm:text-base mb-3">Drag and drop your APK file here</p>
            <p className="text-gray-400 text-xs sm:text-sm mb-4">or</p>
            <input
              type="file"
              className="hidden"
              id="file-upload"
              onChange={handleFileChange}
              accept=".apk"
            />
            <label
              htmlFor="file-upload"
              className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-xs sm:text-sm font-medium text-white rounded-lg group bg-gradient-to-br from-cyan-400 to-blue-900 hover:from-cyan-300 hover:to-blue-800 focus:ring-4 focus:outline-none focus:ring-cyan-800 cursor-pointer transition-all duration-300"
            >
              <span className="relative flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 transition-all ease-in duration-300 bg-gray-900 rounded-md group-hover:bg-transparent">
                <Upload className="w-3 sm:w-4 h-3 sm:h-4" /> Upload APK
              </span>
            </label>
          </div>

          {file && (
            <div className="w-full flex flex-col items-center">
              <p className="text-gray-200 text-sm mb-2">Selected file: {file.name}</p>
              <button
                onClick={handleUpload}
                disabled={loading}
                className="w-full py-2 px-4 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600"
              >
                {loading ? 'Uploading...' : 'Upload'}
              </button>
            </div>
          )}

          {scanId && (
            <div className="mt-4 p-3 bg-green-100 rounded-lg text-green-800">
              ✅ Upload successful! Scan ID: <strong>{scanId}</strong>
            </div>
          )}
        </div>
      </div>
      <div className="w-full lg:w-1/2 flex justify-center lg:justify-end lg:mr-16">
        <img
          src="/designs/hero-vector-img.png"
          alt="Hero"
          className="w-80 sm:w-96 md:w-[400px] lg:w-[500px] h-auto object-contain rounded-lg"
        />
      </div>
    </div>
  );
};

export default Hero;
