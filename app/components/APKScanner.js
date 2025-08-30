'use client'
import React, { useState, useEffect, useRef } from 'react';
import { Upload, Shield, Lock, Smartphone, DollarSign, FileText, Search, CheckCircle, AlertTriangle, XCircle, Loader2 } from 'lucide-react';

const APKScanner = ({ onBackToHome, initialFile = null }) => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [currentScanId, setCurrentScanId] = useState(null);
  const [scanResults, setScanResults] = useState({});
  const [scanStates, setScanStates] = useState({
    metadata: 'idle',
    signature: 'idle',
    deep: 'idle'
  });
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [overallStatus, setOverallStatus] = useState('uploading'); // 'uploading', 'scanning', 'completed'

  // Polling refs
  const pollingIntervals = useRef({});
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const newParticles = [];
    const particleCount = typeof window !== 'undefined' && window.innerWidth < 768 ? 30 : 50;
    for (let i = 0; i < particleCount; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 8,
        duration: Math.random() * 3 + 5,
      });
    }
    setParticles(newParticles);

    // Cleanup polling intervals on unmount
    return () => {
      Object.values(pollingIntervals.current).forEach(interval => {
        if (interval) clearInterval(interval);
      });
    };
  }, []);

  // Auto-upload when initialFile is provided
  useEffect(() => {
    if (initialFile) {
      const timer = setTimeout(() => {
        uploadFile(initialFile);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [initialFile]);

  // Upload file to backend and get scan_id
  const uploadFile = async (file) => {
    if (!file) return;
    
    // Reset previous state
    Object.values(pollingIntervals.current).forEach(i => i && clearInterval(i));
    pollingIntervals.current = {};
    setScanResults({});
    setScanStates({ metadata: 'idle', signature: 'idle', deep: 'idle' });
    setUploadProgress(0);
    setOverallStatus('uploading');

    setUploadedFile(file);
    setIsUploading(true);
    
    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 95) {
            clearInterval(progressInterval);
            return 95;
          }
          return prev + 10;
        });
      }, 200);

      const formData = new FormData();
      formData.append('file', file);
      
      // Real API call to upload APK
      const response = await fetch('/upload_apk/', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.status}`);
      }

      const result = await response.json();
      const scanId = result.scan_id;
      
      // Complete upload progress
      setUploadProgress(100);
      setTimeout(() => {
        setCurrentScanId(scanId);
        setIsUploading(false);
        setOverallStatus('scanning');
        
        // Start scanning process
        startScanningProcess(scanId);
      }, 500);
      
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Please try again.');
      setIsUploading(false);
      setUploadProgress(0);
      setOverallStatus('uploading');
    }
  };

  // Start the scanning process by initiating deep scan
  const startScanningProcess = async (scanId) => {
    try {
      // Start deep scan
      const response = await fetch(`/deep_scan/${scanId}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Deep scan initiation failed: ${response.status}`);
      }

      // Start polling for scan status
      startStatusPolling(scanId);
      
    } catch (error) {
      console.error('Failed to start scanning process:', error);
      setScanStates(prev => ({ 
        ...prev, 
        metadata: 'error', 
        signature: 'error', 
        deep: 'error' 
      }));
    }
  };

  // Poll scan status continuously
  const startStatusPolling = (scanId) => {
    // Clear any existing polling
    if (pollingIntervals.current.status) {
      clearInterval(pollingIntervals.current.status);
    }

    // Set initial scanning states
    setScanStates({
      metadata: 'loading',
      signature: 'loading',
      deep: 'loading'
    });

    pollingIntervals.current.status = setInterval(async () => {
      try {
        const response = await fetch(`/scan_status/${scanId}/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Status polling failed: ${response.status}`);
        }

        const statusData = await response.json();
        
        // Update scan states based on backend response
        updateScanStates(statusData);
        
        // Check if all scans are completed
        if (statusData.metadata?.completed && statusData.signature?.completed && statusData.deep?.completed) {
          // Stop polling
          clearInterval(pollingIntervals.current.status);
          pollingIntervals.current.status = null;
          setOverallStatus('completed');
          
          // Update final results
          updateFinalResults(statusData);
        }
        
      } catch (error) {
        console.error('Status polling failed:', error);
        // Stop polling on error
        clearInterval(pollingIntervals.current.status);
        pollingIntervals.current.status = null;
        setScanStates(prev => ({
          metadata: prev.metadata === 'loading' ? 'error' : prev.metadata,
          signature: prev.signature === 'loading' ? 'error' : prev.signature,
          deep: prev.deep === 'loading' ? 'error' : prev.deep
        }));
      }
    }, 1500); // Poll every 1.5 seconds
  };

  // Update scan states based on backend response
  const updateScanStates = (statusData) => {
    const newStates = {};
    
    // Update metadata state
    if (statusData.metadata?.completed) {
      newStates.metadata = 'completed';
    } else if (statusData.metadata?.error) {
      newStates.metadata = 'error';
    } else if (statusData.metadata?.started) {
      newStates.metadata = 'loading';
    }
    
    // Update signature state
    if (statusData.signature?.completed) {
      newStates.signature = 'completed';
    } else if (statusData.signature?.error) {
      newStates.signature = 'error';
    } else if (statusData.signature?.started) {
      newStates.signature = 'loading';
    }
    
    // Update deep scan state
    if (statusData.deep?.completed) {
      newStates.deep = 'completed';
    } else if (statusData.deep?.error) {
      newStates.deep = 'error';
    } else if (statusData.deep?.started) {
      newStates.deep = 'loading';
    }

    setScanStates(prev => ({ ...prev, ...newStates }));
    
    // Update results as they become available
    updatePartialResults(statusData);
  };

  // Update partial results as they become available
  const updatePartialResults = (statusData) => {
    const newResults = {};
    
    if (statusData.metadata?.completed && statusData.metadata.results) {
      newResults.metadata = formatMetadataResults(statusData.metadata.results);
    }
    
    if (statusData.signature?.completed && statusData.signature.results) {
      newResults.signature = formatSignatureResults(statusData.signature.results);
    }
    
    if (statusData.deep?.completed && statusData.deep.results) {
      newResults.deep = formatDeepScanResults(statusData.deep.results);
    }
    
    if (Object.keys(newResults).length > 0) {
      setScanResults(prev => ({ ...prev, ...newResults }));
    }
  };

  // Update final results when all scans are completed
  const updateFinalResults = (statusData) => {
    const finalResults = {};
    
    if (statusData.metadata?.results) {
      finalResults.metadata = formatMetadataResults(statusData.metadata.results);
    }
    
    if (statusData.signature?.results) {
      finalResults.signature = formatSignatureResults(statusData.signature.results);
    }
    
    if (statusData.deep?.results) {
      finalResults.deep = formatDeepScanResults(statusData.deep.results);
    }
    
    setScanResults(finalResults);
  };

  // Format metadata results for display
  const formatMetadataResults = (data) => ({
    status: data.risk_level === 'safe' ? 'safe' : data.risk_level === 'high' ? 'danger' : 'warning',
    title: 'Metadata Analysis',
    description: 'APK metadata extracted and verified',
    content: `Package Name: ${data.package_name || 'Unknown'}
App Version: ${data.version || 'Unknown'}
Target SDK: ${data.target_sdk || 'Unknown'}
Permissions: ${data.permissions?.length || 0} requested
Install Sources: ${data.install_source || 'Unknown'}
Certificate: ${data.certificate_status || 'Unknown'}
File Hash: ${data.file_hash || 'Unknown'}`,
    icon: FileText,
    details: {
      packageName: data.package_name || 'Unknown',
      version: data.version || 'Unknown',
      permissions: data.permissions || [],
      fileSize: uploadedFile ? `${(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB` : 'Unknown',
      installSource: data.install_source || 'Unknown'
    }
  });

  // Format signature results for display
  const formatSignatureResults = (data) => ({
    status: data.trust_level === 'high' ? 'safe' : data.trust_level === 'low' ? 'danger' : 'warning',
    title: 'Signature Verification',
    description: 'Digital signature validation completed',
    content: `Certificate Subject: ${data.certificate_subject || 'Unknown'}
Certificate Issuer: ${data.certificate_issuer || 'Unknown'}
Valid From: ${data.valid_from || 'Unknown'} to ${data.valid_until || 'Unknown'}
Key Algorithm: ${data.key_algorithm || 'Unknown'}
Signature Algorithm: ${data.signature_algorithm || 'Unknown'}
Trust Level: ${data.trust_level || 'Unknown'}`,
    icon: Shield,
    details: {
      issuer: data.certificate_issuer || 'Unknown',
      validUntil: data.valid_until || 'Unknown',
      algorithm: data.key_algorithm || 'Unknown',
      trustLevel: data.trust_level || 'Unknown',
      chainValid: data.chain_valid || false
    }
  });

  // Format deep scan results for display
  const formatDeepScanResults = (data) => ({
    status: data.risk_level === 'low' ? 'safe' : data.risk_level === 'high' ? 'danger' : 'warning',
    title: 'Deep Security Scan',
    description: 'Comprehensive malware analysis completed',
    content: `Malware Signatures: ${data.malware_detections || 0} threats detected
Behavioral Analysis: ${data.behavioral_risk || 'Unknown'} risk indicators found
Network Analysis: ${data.network_domains || 0} external domains contacted
Privacy Concerns: ${data.privacy_issues?.length || 0} issues identified
Code Obfuscation: ${data.obfuscation_level || 'Unknown'}% of code is obfuscated
Overall Risk: ${data.risk_level?.toUpperCase() || 'UNKNOWN'}`,
    icon: Search,
    details: {
      malwareDetection: `${data.malware_detections || 0} threats`,
      networkDomains: data.network_domains || 0,
      obfuscationLevel: `${data.obfuscation_level || 0}%`,
      riskLevel: data.risk_level?.toUpperCase() || 'UNKNOWN',
      privacyConcerns: data.privacy_issues || []
    }
  });

  const resetApp = () => {
    // Clear all polling intervals
    Object.values(pollingIntervals.current).forEach(interval => {
      if (interval) clearInterval(interval);
    });
    pollingIntervals.current = {};
    
    // Reset state
    setUploadedFile(null);
    setCurrentScanId(null);
    setScanResults({});
    setScanStates({ metadata: 'idle', signature: 'idle', deep: 'idle' });
    setUploadProgress(0);
    setIsUploading(false);
    setOverallStatus('uploading');
    
    // Call parent callback
    if (onBackToHome) onBackToHome();
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'safe': return 'text-green-400 border-green-400 bg-green-400/20';
      case 'warning': return 'text-yellow-400 border-yellow-400 bg-yellow-400/20';
      case 'danger': return 'text-red-400 border-red-400 bg-red-400/20';
      default: return 'text-gray-400 border-gray-400 bg-gray-400/20';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'safe': return <CheckCircle className="w-4 h-4" />;
      case 'warning': return <AlertTriangle className="w-4 h-4" />;
      case 'danger': return <XCircle className="w-4 h-4" />;
      default: return null;
    }
  };

  const getScanButtonState = (scanType) => {
    const state = scanStates[scanType];
    switch(state) {
      case 'loading':
        return 'border-orange-400 text-orange-400 bg-orange-400/10 cursor-not-allowed';
      case 'completed':
        return 'border-green-400 text-green-400 bg-green-400/10';
      case 'error':
        return 'border-red-400 text-red-400 bg-red-400/10';
      default:
        return 'border-gray-400 text-gray-400 bg-gray-400/10';
    }
  };

  return (
    <div className="min-h-screen" style={{
      background: "radial-gradient(ellipse at center, #0a1428 0%, #061018 30%, #030b1a 70%, #000408 100%)"
    }}>
      {/* Background Particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute w-0.5 h-0.5 bg-cyan-400 rounded-full opacity-60 animate-pulse"
            style={{
              left: `${particle.x}%`,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${particle.duration}s`,
              animation: `float ${particle.duration}s ease-in-out infinite ${particle.delay}s`
            }}
          />
        ))}
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-gray-900/90 backdrop-blur-lg border-b border-cyan-400/20 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex space-x-4 sm:space-x-8">
              <button onClick={resetApp} className="text-gray-300 hover:text-cyan-400 transition-colors text-sm sm:text-base">
                Home
              </button>
              <a href="#" className="text-gray-300 hover:text-cyan-400 transition-colors text-sm sm:text-base">About</a>
              <a href="#" className="text-gray-300 hover:text-cyan-400 transition-colors text-sm sm:text-base">FAQ</a>
              <a href="#" className="text-gray-300 hover:text-cyan-400 transition-colors text-sm sm:text-base">Blogs</a>
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-20 sm:pt-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
              <span className="text-white">APK </span>
              <span className="bg-gradient-to-tl from-slate-800 via-cyan-500 to-zinc-400 bg-clip-text text-transparent">
                Security Analysis
              </span>
            </h1>
            
            {/* Upload Progress */}
            {isUploading && (
              <div className="bg-gray-900/50 backdrop-blur-lg border border-cyan-400/20 rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8 max-w-2xl mx-auto">
                <h3 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">Uploading APK...</h3>
                <div className="w-full bg-gray-700 rounded-full h-3 mb-2">
                  <div 
                    className="bg-gradient-to-r from-cyan-400 to-blue-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-400">{uploadProgress}% complete</p>
              </div>
            )}
            
            {/* File Info */}
            {uploadedFile && !isUploading && (
              <div className="bg-gray-900/50 backdrop-blur-lg border border-cyan-400/20 rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8 max-w-2xl mx-auto">
                <h3 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">File Information</h3>
                <div className="text-left space-y-2">
                  <p className="text-gray-300 text-sm sm:text-base">
                    <span className="font-semibold text-white">File Name:</span> {uploadedFile.name}
                  </p>
                  <p className="text-gray-300 text-sm sm:text-base">
                    <span className="font-semibold text-white">Size:</span> {(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                  {currentScanId && (
                    <p className="text-gray-300 text-sm sm:text-base">
                      <span className="font-semibold text-white">Scan ID:</span> {currentScanId}
                    </p>
                  )}
                  <p className="text-gray-300 text-sm sm:text-base">
                    <span className="font-semibold text-white">Status:</span> 
                    <span className={`ml-2 ${overallStatus === 'completed' ? 'text-green-400' : 'text-yellow-400'}`}>
                      {overallStatus === 'uploading' ? 'Uploading...' : 
                       overallStatus === 'scanning' ? 'Analysis in progress' : 
                       'Analysis completed'}
                    </span>
                  </p>
                </div>
              </div>
            )}

            {/* Scan Progress Indicators */}
            {overallStatus === 'scanning' && (
              <>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-6 sm:mb-8">
                  <div className={`flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-xl border-2 transition-all duration-300 font-semibold text-sm sm:text-base ${getScanButtonState('metadata')}`}>
                    {scanStates.metadata === 'loading' ? (
                      <Loader2 className="w-4 sm:w-5 h-4 sm:h-5 animate-spin" />
                    ) : scanStates.metadata === 'completed' ? (
                      <CheckCircle className="w-4 sm:w-5 h-4 sm:h-5" />
                    ) : scanStates.metadata === 'error' ? (
                      <XCircle className="w-4 sm:w-5 h-4 sm:h-5" />
                    ) : (
                      <FileText className="w-4 sm:w-5 h-4 sm:h-5" />
                    )}
                    <span className="hidden sm:inline">
                      {scanStates.metadata === 'loading' ? 'Analyzing Metadata...' : 
                       scanStates.metadata === 'completed' ? 'Metadata Complete' :
                       scanStates.metadata === 'error' ? 'Analysis Failed' : 'Metadata Analysis'}
                    </span>
                    <span className="sm:hidden">
                      {scanStates.metadata === 'loading' ? 'Analyzing...' : 
                       scanStates.metadata === 'completed' ? 'Complete' :
                       scanStates.metadata === 'error' ? 'Failed' : 'Metadata'}
                    </span>
                  </div>

                  <div className={`flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-xl border-2 transition-all duration-300 font-semibold text-sm sm:text-base ${getScanButtonState('signature')}`}>
                    {scanStates.signature === 'loading' ? (
                      <Loader2 className="w-4 sm:w-5 h-4 sm:h-5 animate-spin" />
                    ) : scanStates.signature === 'completed' ? (
                      <CheckCircle className="w-4 sm:w-5 h-4 sm:h-5" />
                    ) : scanStates.signature === 'error' ? (
                      <XCircle className="w-4 sm:w-5 h-4 sm:h-5" />
                    ) : (
                      <Shield className="w-4 sm:w-5 h-4 sm:h-5" />
                    )}
                    <span className="hidden sm:inline">
                      {scanStates.signature === 'loading' ? 'Verifying Signature...' : 
                       scanStates.signature === 'completed' ? 'Signature Verified' :
                       scanStates.signature === 'error' ? 'Verification Failed' : 'Signature Check'}
                    </span>
                    <span className="sm:hidden">
                      {scanStates.signature === 'loading' ? 'Verifying...' : 
                       scanStates.signature === 'completed' ? 'Verified' :
                       scanStates.signature === 'error' ? 'Failed' : 'Signature'}
                    </span>
                  </div>

                  <div className={`flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-xl border-2 transition-all duration-300 font-semibold text-sm sm:text-base ${getScanButtonState('deep')}`}>
                    {scanStates.deep === 'loading' ? (
                      <Loader2 className="w-4 sm:w-5 h-4 sm:h-5 animate-spin" />
                    ) : scanStates.deep === 'completed' ? (
                      <CheckCircle className="w-4 sm:w-5 h-4 sm:h-5" />
                    ) : scanStates.deep === 'error' ? (
                      <XCircle className="w-4 sm:w-5 h-4 sm:h-5" />
                    ) : (
                      <Search className="w-4 sm:w-5 h-4 sm:h-5" />
                    )}
                    <span className="hidden sm:inline">
                      {scanStates.deep === 'loading' ? 'Deep Scanning...' : 
                       scanStates.deep === 'completed' ? 'Deep Scan Complete' :
                       scanStates.deep === 'error' ? 'Scan Failed' : 'Deep Security Scan'}
                    </span>
                    <span className="sm:hidden">
                      {scanStates.deep === 'loading' ? 'Scanning...' : 
                       scanStates.deep === 'completed' ? 'Complete' :
                       scanStates.deep === 'error' ? 'Failed' : 'Deep Scan'}
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="max-w-2xl mx-auto mb-8">
                  <div className="flex justify-between text-sm text-gray-400 mb-2">
                    <span>Analysis Progress</span>
                    <span>{Math.round(((Object.values(scanStates).filter(s => s === 'completed').length) / 3) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-cyan-400 to-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${((Object.values(scanStates).filter(s => s === 'completed').length) / 3) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Results Grid */}
          {Object.keys(scanResults).length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
              {Object.entries(scanResults).map(([scanType, result]) => {
                const IconComponent = result.icon;
                return (
                  <div key={scanType} className="bg-gray-900/50 backdrop-blur-lg border border-cyan-400/20 rounded-2xl p-4 sm:p-6 relative overflow-hidden transform transition-all duration-500 hover:scale-105 animate-fade-in">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 to-blue-600"></div>
                    
                    <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                      <div className="p-2 sm:p-3 bg-cyan-400/20 rounded-xl">
                        <IconComponent className="w-5 sm:w-6 h-5 sm:h-6 text-cyan-400" />
                      </div>
                      <div>
                        <h3 className="text-lg sm:text-xl font-semibold text-white">{result.title}</h3>
                        <p className="text-gray-400 text-xs sm:text-sm">{result.description}</p>
                      </div>
                    </div>

                    <div className="text-gray-300 mb-3 sm:mb-4 leading-relaxed text-xs sm:text-sm">
                      {result.content}
                    </div>

                    {/* Detailed Results */}
                    {result.details && (
                      <div className="mb-3 sm:mb-4 p-2 sm:p-3 bg-gray-800/50 rounded-lg">
                        <h4 className="text-xs sm:text-sm font-semibold text-cyan-400 mb-2">Technical Details:</h4>
                        <div className="space-y-1 text-xs text-gray-300">
                          {Object.entries(result.details).map(([key, value]) => (
                            <div key={key} className="flex justify-between">
                              <span className="capitalize text-gray-400">{key.replace(/([A-Z])/g, ' $1')}:</span>
                              <span className="text-white font-mono text-right">
                                {Array.isArray(value) ? value.join(', ') : String(value)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className={`inline-flex items-center gap-2 px-3 sm:px-4 py-1 sm:py-2 rounded-full border text-xs sm:text-sm font-semibold ${getStatusColor(result.status)}`}>
                      {getStatusIcon(result.status)}
                      {result.status.toUpperCase()}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Overall Security Summary */}
          {overallStatus === 'completed' && Object.keys(scanResults).length === 3 && (
            <div className="bg-gray-900/50 backdrop-blur-lg border border-cyan-400/20 rounded-2xl p-6 sm:p-8 mb-8 animate-fade-in">
              <div className="text-center">
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">Overall Security Assessment</h3>
                <div className="flex justify-center items-center gap-4 mb-6">
                  <div className="w-12 sm:w-16 h-12 sm:h-16 bg-green-400/20 rounded-full flex items-center justify-center">
                    <Shield className="w-6 sm:w-8 h-6 sm:h-8 text-green-400" />
                  </div>
                </div>
                <div className="max-w-2xl mx-auto">
                  <p className="text-base sm:text-lg text-gray-300 mb-4">
                    Analysis Complete! Your APK has been thoroughly examined across multiple security dimensions.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                    <div className="text-center p-3 sm:p-4 bg-gray-800/50 rounded-lg">
                      {getStatusIcon(scanResults.metadata?.status)}
                      <h4 className="font-semibold text-white text-sm sm:text-base mt-2">Metadata</h4>
                      <p className={`text-xs sm:text-sm ${getStatusColor(scanResults.metadata?.status).split(' ')[0]}`}>
                        {scanResults.metadata?.status?.charAt(0).toUpperCase() + scanResults.metadata?.status?.slice(1)}
                      </p>
                    </div>
                    <div className="text-center p-3 sm:p-4 bg-gray-800/50 rounded-lg">
                      {getStatusIcon(scanResults.signature?.status)}
                      <h4 className="font-semibold text-white text-sm sm:text-base mt-2">Signature</h4>
                      <p className={`text-xs sm:text-sm ${getStatusColor(scanResults.signature?.status).split(' ')[0]}`}>
                        {scanResults.signature?.status?.charAt(0).toUpperCase() + scanResults.signature?.status?.slice(1)}
                      </p>
                    </div>
                    <div className="text-center p-3 sm:p-4 bg-gray-800/50 rounded-lg">
                      {getStatusIcon(scanResults.deep?.status)}
                      <h4 className="font-semibold text-white text-sm sm:text-base mt-2">Deep Scan</h4>
                      <p className={`text-xs sm:text-sm ${getStatusColor(scanResults.deep?.status).split(' ')[0]}`}>
                        {scanResults.deep?.status?.charAt(0).toUpperCase() + scanResults.deep?.status?.slice(1)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={resetApp}
                    className="mt-6 px-6 py-3 bg-gradient-to-r from-cyan-400 to-blue-600 text-white rounded-lg hover:scale-105 transition-transform font-semibold"
                  >
                    Scan Another APK
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(100vh) translateX(0); opacity: 0; }
          10% { opacity: 0.6; }
          90% { opacity: 0.6; }
          100% { transform: translateY(-100px) translateX(100px); opacity: 0; }
        }
        
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default APKScanner;