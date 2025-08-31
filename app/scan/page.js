'use client';
import { XCircle , AlertTriangle, Shield, CheckCircle } from "lucide-react"; 
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

const page = () => {
  const searchParams = useSearchParams();
  const [scanID, setScanID] = useState("");
  const [BaseURL] = useState("https://fraudrakshakapi.onrender.com");

  const [loadingMetadata, setLoadingMetadata] = useState(false);
  const [metadata, setMetadata] = useState(null);
  const [metadataError, setMetadataError] = useState(null);

  const [loadingSignature, setLoadingSignature] = useState(false);
  const [signature, setSignature] = useState(null);
  const [signatureError, setSignatureError] = useState(null);

  const [deepScanStatus, setDeepScanStatus] = useState(null);
  const [deepScanLogs, setDeepScanLogs] = useState([]);
  const [deepScanResult, setDeepScanResult] = useState(null);
  const [deepScanError, setDeepScanError] = useState(null);

  const [openAccordion, setOpenAccordion] = useState({ metadata: true, signature: false, deepScan: false });

  useEffect(() => {
    const id = searchParams.get('scanId');
    setScanID(id);

    if (id) {
      fetchMetadata(id);
      fetchSignature(id);
      startDeepScan(id);
    }
  }, []);

  const fetchMetadata = async (id) => {
    setLoadingMetadata(true);
    setMetadataError(null);
    try {
      const res = await fetch(`${BaseURL}/scan_metadata/${id}/`, { method: 'POST', headers: { 'accept': 'application/json' }, body: '' });
      const data = await res.json();
      setMetadata(data.result);
    } catch (err) {
      console.error(err);
      setMetadataError('Failed to fetch metadata.');
    } finally {
      setLoadingMetadata(false);
    }
  };

  const fetchSignature = async (id) => {
    setLoadingSignature(true);
    setSignatureError(null);
    try {
      const res = await fetch(`${BaseURL}/scan_signature/${id}/`, { method: 'POST', headers: { 'accept': 'application/json' }, body: '' });
      
      const data = await res.json();
      setSignature(data.result);
    } catch (err) {
      console.error(err);
      setSignatureError('Failed to fetch signature.');
    } finally {
      setLoadingSignature(false);
    }
  };

  const startDeepScan = async (id) => {
    try {
      const res = await fetch(`${BaseURL}/deep_scan/${id}/`, { method: 'POST', headers: { 'accept': 'application/json' }, body: '' });
      setDeepScanStatus('started');
      pollDeepScan(id);
    } catch (err) {
      console.error(err);
      setDeepScanError('Failed to start deep scan.');
    }
  };

  const pollDeepScan = async (id) => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`${BaseURL}/scan_status/${id}/`, { headers: { accept: 'application/json' } });
        const data = await res.json();
        setDeepScanStatus(data.status);
        setDeepScanLogs(data.progress_logs?.slice(-10) || []);
        if (data.status === 'deep_scanned') {
          setDeepScanResult(data.deep_scan_result);
          clearInterval(interval);
        }
      } catch (err) {
        console.error(err);
        setDeepScanError('Failed to fetch scan status.');
        clearInterval(interval);
      }
    }, 2000);
  };

  return (
    <div className="min-h-screen p-6 bg-gray-900 text-white space-y-4">
      <h1 className='text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 text-center'>
        <span className="text-white">APK</span>
        <span className="bg-gradient-to-tl from-slate-800 via-cyan-500 to-zinc-400 bg-clip-text text-transparent"> Security Analysis</span>
      </h1>
      <h1 className="text-1xl mb-4 font-bold text-white">Scan ID: <span className="text-cyan-400">{scanID}</span></h1>
      {/* Summary Cards */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
  {/* Metadata Summary Card */}
  {metadata && (
    <div className="bg-gray-800/50 backdrop-blur-lg border border-cyan-400/20 rounded-xl p-4">
      <div className="flex items-center gap-3 mb-3">
        {metadata?.score >= 90 ? (
          <CheckCircle className="w-6 h-6 text-green-400" />
        ) : metadata?.score >= 70 ? (
          <Shield className="w-6 h-6 text-yellow-400" />
        ) : metadata?.score >= 50 ? (
          <AlertTriangle className="w-6 h-6 text-orange-400" />
        ) : (
          <XCircle className="w-6 h-6 text-red-400" />
        )}
        <h3 className="font-semibold text-white">Metadata Check</h3>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-gray-400 text-sm">Play Store:</span>
          <span className={`text-sm font-semibold ${
            metadata.play_store_match?.error ? 'text-red-400' : 'text-green-400'
          }`}>
            {metadata.play_store_match?.error ? 'Not Found' : 'Found'}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-400 text-sm">Score:</span>
          <span className={`text-sm font-bold ${
            metadata.score >= 90 ? 'text-green-400' :
            metadata.score >= 70 ? 'text-yellow-400' :
            metadata.score >= 50 ? 'text-orange-400' :
            'text-red-400'
          }`}>
            {metadata.score}/100
          </span>
        </div>
      </div>
    </div>
  )}

  {/* Signature Summary Card */}
  {signature && (
    <div className="bg-gray-800/50 backdrop-blur-lg border border-cyan-400/20 rounded-xl p-4">
      <div className="flex items-center gap-3 mb-3">
        {signature?.score >= 90 ? (
          <CheckCircle className="w-6 h-6 text-green-400" />
        ) : signature?.score >= 70 ? (
          <Shield className="w-6 h-6 text-yellow-400" />
        ) : signature?.score >= 50 ? (
          <AlertTriangle className="w-6 h-6 text-orange-400" />
        ) : (
          <XCircle className="w-6 h-6 text-red-400" />
        )}
        <h3 className="font-semibold text-white">Signature Check</h3>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-gray-400 text-sm">DB Match:</span>
          <span className={`text-sm font-semibold ${
            signature?.signature_match ? 'text-green-400' : 'text-red-400'
          }`}>
            {signature?.signature_match ? 'Matched' : 'No Match'}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-400 text-sm">Score:</span>
          <span className={`text-sm font-bold ${
            signature.score >= 90 ? 'text-green-400' :
            signature.score >= 70 ? 'text-yellow-400' :
            signature.score >= 50 ? 'text-orange-400' :
            'text-red-400'
          }`}>
            {signature.score}/100
          </span>
        </div>
      </div>
    </div>
  )}

  {/* Deep Scan Summary Card */}
  {deepScanResult && (
    <div className="bg-gray-800/50 backdrop-blur-lg border border-cyan-400/20 rounded-xl p-4">
      <div className="flex items-center gap-3 mb-3">
        {deepScanResult?.suspicious_findings?.length > 0 ? (
          <XCircle className="w-6 h-6 text-red-400" />
        ) : deepScanResult?.suspicious_findings?.length === 0 ? (
          <CheckCircle className="w-6 h-6 text-green-400" />
        ) : (
          <Shield className="w-6 h-6 text-cyan-400" />
        )}
        <h3 className="font-semibold text-white">Deep Scan</h3>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-gray-400 text-sm">Files Scanned:</span>
          <span className="text-white text-sm font-semibold">
            {deepScanResult.scan_summary?.total_files_scanned || 'N/A'}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-400 text-sm">Suspicious Perms:</span>
          <span className={`text-sm font-semibold ${
            deepScanResult.inventory?.all_permissions_found?.filter(perm => 
              perm.includes('CAMERA') || perm.includes('MICROPHONE') || 
              perm.includes('LOCATION') || perm.includes('SMS') || 
              perm.includes('CALL') || perm.includes('CONTACTS') || 
              perm.includes('STORAGE') || perm.includes('ADMIN') || 
              perm.includes('SYSTEM') || perm.includes('ROOT')
            ).length > 0 ? 'text-yellow-400' : 'text-green-400'
          }`}>
            {deepScanResult.inventory?.all_permissions_found?.filter(perm => 
              perm.includes('CAMERA') || perm.includes('MICROPHONE') || 
              perm.includes('LOCATION') || perm.includes('SMS') || 
              perm.includes('CALL') || perm.includes('CONTACTS') || 
              perm.includes('STORAGE') || perm.includes('ADMIN') || 
              perm.includes('SYSTEM') || perm.includes('ROOT')
            ).length || 0}
          </span>
        </div>
      </div>
    </div>
  )}
</div>
      {/* Metadata Accordion */}
<div className="bg-gray-900/50 backdrop-blur-lg border border-cyan-400/20 rounded-2xl overflow-hidden mb-4">
  <button 
    className="w-full px-6 py-4 text-left hover:bg-gray-800/30 flex justify-between items-center transition-colors duration-200"
    onClick={() => setOpenAccordion(prev => ({ ...prev, metadata: !prev.metadata }))}
  >
    <div className="flex items-center gap-4">
      {loadingMetadata ? (
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-cyan-400"></div>
      ) : metadata?.score >= 90 ? (
        <CheckCircle className="w-6 h-6 text-green-400" />
      ) : metadata?.score >= 70 ? (
        <Shield className="w-6 h-6 text-yellow-400" />
      ) : metadata?.score >= 50 ? (
        <AlertTriangle className="w-6 h-6 text-orange-400" />
      ) : metadata ? (
        <XCircle className="w-6 h-6 text-red-400" />
      ) : (
        <Shield className="w-6 h-6 text-gray-400" />
      )}
      <div>
        <span className="font-semibold text-white text-lg">Metadata Analysis</span>
        <p className="text-sm text-gray-400">
          {loadingMetadata ? 'Analyzing metadata...' : 'APK metadata and Play Store verification'}
        </p>
      </div>
    </div>
    <div className="flex items-center gap-4">
      {metadata?.score && !loadingMetadata && (
        <div className={`px-3 py-1 rounded-full border font-bold text-sm ${
          metadata.score >= 90 ? 'text-green-400 bg-green-400/20 border-green-400' :
          metadata.score >= 70 ? 'text-yellow-400 bg-yellow-400/20 border-yellow-400' :
          metadata.score >= 50 ? 'text-orange-400 bg-orange-400/20 border-orange-400' :
          'text-red-400 bg-red-400/20 border-red-400'
        }`}>
          {metadata.score}/100
        </div>
      )}
      <span className="text-gray-400">{openAccordion.metadata ? '−' : '+'}</span>
    </div>
  </button>
  {openAccordion.metadata && (
    <div className="border-t border-gray-700/50 p-6">
      {loadingMetadata && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
          <span className="ml-3 text-gray-300">Loading metadata...</span>
        </div>
      )}
      {metadataError && (
        <div className="bg-red-900/30 border border-red-400/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <XCircle className="w-5 h-5 text-red-400" />
            <span className="text-red-400 font-semibold">Analysis Failed</span>
          </div>
          <p className="text-red-300 mt-2">{metadataError}</p>
        </div>
      )}
      {metadata && (
        <div className="space-y-6">
          {/* Verdict Section */}
          <div className="flex items-center justify-between">
            <span className="text-gray-300 font-medium">Security Verdict:</span>
            <span className={`px-4 py-2 rounded-lg border font-semibold text-sm ${
              metadata?.verdict?.toLowerCase().includes('genuine') 
                ? 'text-green-400 bg-green-400/20 border-green-400'
                : metadata?.verdict?.toLowerCase().includes('suspicious')
                ? 'text-red-400 bg-red-400/20 border-red-400'
                : 'text-yellow-400 bg-yellow-400/20 border-yellow-400'
            }`}>
              {metadata?.verdict || 'Unknown'}
            </span>
          </div>

          {/* APK Details */}
          <div className="bg-gray-800/50 rounded-lg p-4">
            <h4 className="text-lg font-semibold text-cyan-400 mb-4">APK Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex justify-between py-2 border-b border-gray-600/30">
                <span className="text-gray-400 font-medium">Package Name:</span>
                <span className="text-white font-mono text-right">{metadata.apk_details?.package_name??'N/A'}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-600/30">
                <span className="text-gray-400 font-medium">App Name:</span>
                <span className="text-white text-right">{metadata.apk_details?.app_name ?? 'N/A'}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-600/30">
                <span className="text-gray-400 font-medium">Version Name:</span>
                <span className="text-white font-mono text-right">{metadata.apk_details?.version_name??'N/A'}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-600/30">
                <span className="text-gray-400 font-medium">Version Code:</span>
                <span className="text-white font-mono text-right">{metadata.apk_details?.version_code??'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Play Store Match */}
          <div className="bg-gray-800/50 rounded-lg p-4">
            <h4 className="text-lg font-semibold text-cyan-400 mb-4">Play Store Verification</h4>
            {metadata.play_store_match?.error ? (
              <div className="bg-red-900/30 border border-red-400/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <XCircle className="w-5 h-5 text-red-400" />
                  <span className="text-red-400 font-semibold">Not Found on Play Store</span>
                </div>
                <p className="text-red-300 text-sm">{metadata.play_store_match.error}</p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  {metadata?.play_store_match?.play_store_title && (
                    <div className="flex justify-between py-2 border-b border-gray-600/30">
                      <span className="text-gray-400 font-medium">Play Store Title:</span>
                      <span className="text-white text-right">{metadata.play_store_match.play_store_title}</span>
                    </div>
                  )}
                  {metadata?.play_store_match?.developer && (
                    <div className="flex justify-between py-2 border-b border-gray-600/30">
                      <span className="text-gray-400 font-medium">Developer:</span>
                      <span className="text-white text-right">{metadata.play_store_match.developer}</span>
                    </div>
                  )}
                  {metadata?.play_store_match?.play_store_version && (
                    <div className="flex justify-between py-2 border-b border-gray-600/30">
                      <span className="text-gray-400 font-medium">Play Store Version:</span>
                      <span className="text-white font-mono text-right">{metadata.play_store_match.play_store_version}</span>
                    </div>
                  )}
                  {metadata?.play_store_match?.package_match !== undefined && (
                    <div className="flex justify-between py-2 border-b border-gray-600/30">
                      <span className="text-gray-400 font-medium">Package Match:</span>
                      <span className={`text-right font-semibold ${metadata.play_store_match.package_match ? 'text-green-400' : 'text-red-400'}`}>
                        {metadata.play_store_match.package_match ? 'Yes' : 'No'}
                      </span>
                    </div>
                  )}
                  {metadata?.play_store_match?.version_match !== undefined && (
                    <div className="flex justify-between py-2 border-b border-gray-600/30">
                      <span className="text-gray-400 font-medium">Version Match:</span>
                      <span className={`text-right font-semibold ${metadata.play_store_match.version_match ? 'text-green-400' : 'text-red-400'}`}>
                        {metadata.play_store_match.version_match ? 'Yes' : 'No'}
                      </span>
                    </div>
                  )}
                  {metadata?.play_store_match?.app_name_match !== undefined && metadata?.play_store_match?.app_name_match !== null && (
                    <div className="flex justify-between py-2 border-b border-gray-600/30">
                      <span className="text-gray-400 font-medium">App Name Match:</span>
                      <span className={`text-right font-semibold ${metadata.play_store_match.app_name_match ? 'text-green-400' : 'text-red-400'}`}>
                        {metadata.play_store_match.app_name_match ? 'Yes' : 'No'}
                      </span>
                    </div>
                  )}
                </div>
                {metadata?.play_store_match?.play_store_url && (
                  <div className="mt-4 pt-4 border-t border-gray-600/30">
                    <a 
                      href={metadata.play_store_match.play_store_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-green-600/20 hover:bg-green-600/30 border border-green-500/30 text-green-400 rounded-lg transition-colors duration-200 text-sm font-medium"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.61 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                      </svg>
                      View on Play Store
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Analysis Reasons */}
          {metadata?.reasons?.length > 0 && (
            <div className="bg-gray-800/50 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-cyan-400 mb-4">Analysis Details</h4>
              <div className="space-y-2">
                {metadata.reasons.map((reason, idx) => (
                  <div key={idx} className={`p-3 rounded-lg text-sm ${
                    reason.includes('✅') ? 'bg-green-900/30 border border-green-400/30 text-green-300' :
                    reason.includes('❌') ? 'bg-red-900/30 border border-red-400/30 text-red-300' :
                    'bg-yellow-900/30 border border-yellow-400/30 text-yellow-300'
                  }`}>
                    {reason}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Security Score */}
          {metadata.score && (
            <div className="bg-gray-800/50 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-cyan-400 mb-4">Security Score Analysis</h4>
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-300">Overall Security Score:</span>
                <div className="flex items-center gap-3">
                  {metadata.score >= 90 ? (
                    <CheckCircle className="w-6 h-6 text-green-400" />
                  ) : metadata.score >= 70 ? (
                    <Shield className="w-6 h-6 text-yellow-400" />
                  ) : metadata.score >= 50 ? (
                    <AlertTriangle className="w-6 h-6 text-orange-400" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-400" />
                  )}
                  <span className={`text-2xl font-bold ${
                    metadata.score >= 90 ? 'text-green-400' :
                    metadata.score >= 70 ? 'text-yellow-400' :
                    metadata.score >= 50 ? 'text-orange-400' :
                    'text-red-400'
                  }`}>
                    {metadata.score}/100
                  </span>
                </div>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3 mb-3">
                <div 
                  className={`h-3 rounded-full transition-all duration-500 ${
                    metadata.score >= 90 ? 'bg-gradient-to-r from-green-500 to-green-400' :
                    metadata.score >= 70 ? 'bg-gradient-to-r from-yellow-500 to-yellow-400' :
                    metadata.score >= 50 ? 'bg-gradient-to-r from-orange-500 to-orange-400' :
                    'bg-gradient-to-r from-red-500 to-red-400'
                  }`}
                  style={{ width: `${metadata.score}%` }}
                ></div>
              </div>
              <div className="grid grid-cols-4 text-xs text-gray-400 text-center">
                <span>Critical</span> 
                <span>Low</span>
                <span>Medium</span>
                <span>Safe</span>
              </div>
              <p className="text-sm text-gray-300 mt-3">
                {metadata.score >= 90 ? 'This APK appears to be authentic and safe to install.' :
                 metadata.score >= 70 ? 'This APK has minor concerns but is generally safe.' :
                 metadata.score >= 50 ? 'This APK has several red flags. Install with caution.' :
                 'This APK is highly suspicious and should not be installed.'}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )}
</div>


      

{/* Signature Accordion */}
<div className="bg-gray-900/50 backdrop-blur-lg border border-cyan-400/20 rounded-2xl overflow-hidden mb-4">
  <button 
    className="w-full px-6 py-4 text-left hover:bg-gray-800/30 flex justify-between items-center transition-colors duration-200"
    onClick={() => setOpenAccordion(prev => ({ ...prev, signature: !prev.signature }))}
  >
    <div className="flex items-center gap-4">
      {loadingSignature ? (
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-cyan-400"></div>
      ) : signature?.score >= 90 ? (
        <CheckCircle className="w-6 h-6 text-green-400" />
      ) : signature?.score >= 70 ? (
        <Shield className="w-6 h-6 text-yellow-400" />
      ) : signature?.score >= 50 ? (
        <AlertTriangle className="w-6 h-6 text-orange-400" />
      ) : signature ? (
        <XCircle className="w-6 h-6 text-red-400" />
      ) : (
        <Shield className="w-6 h-6 text-gray-400" />
      )}
      <div>
        <span className="font-semibold text-white text-lg">Signature Analysis</span>
        <p className="text-sm text-gray-400">
          {loadingSignature ? 'Verifying signatures...' : 'APK signature verification and certificate validation'}
        </p>
      </div>
    </div>
    <div className="flex items-center gap-4">
      {signature?.score && !loadingSignature && (
        <div className={`px-3 py-1 rounded-full border font-bold text-sm ${
          signature.score >= 90 ? 'text-green-400 bg-green-400/20 border-green-400' :
          signature.score >= 70 ? 'text-yellow-400 bg-yellow-400/20 border-yellow-400' :
          signature.score >= 50 ? 'text-orange-400 bg-orange-400/20 border-orange-400' :
          'text-red-400 bg-red-400/20 border-red-400'
        }`}>
          {signature.score}/100
        </div>
      )}
      <span className="text-gray-400">{openAccordion.signature ? '−' : '+'}</span>
    </div>
  </button>
  {openAccordion.signature && (
    <div className="border-t border-gray-700/50 p-6">
      {loadingSignature && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
          <span className="ml-3 text-gray-300">Checking signature...</span>
        </div>
      )}
      {signatureError && (
        <div className="bg-red-900/30 border border-red-400/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <XCircle className="w-5 h-5 text-red-400" />
            <span className="text-red-400 font-semibold">Analysis Failed</span>
          </div>
          <p className="text-red-300 mt-2">{signatureError}</p>
        </div>
      )}
      {signature && (
        <div className="space-y-6">
          {/* Verdict Section */}
          <div className="flex items-center justify-between">
            <span className="text-gray-300 font-medium">Signature Verdict:</span>
            <span className={`px-4 py-2 rounded-lg border font-semibold text-sm ${
              signature?.verdict?.toLowerCase().includes('genuine') 
                ? 'text-green-400 bg-green-400/20 border-green-400'
                : signature?.verdict?.toLowerCase().includes('suspicious') || signature?.verdict?.toLowerCase().includes('modified')
                ? 'text-red-400 bg-red-400/20 border-red-400'
                : 'text-yellow-400 bg-yellow-400/20 border-yellow-400'
            }`}>
              {signature?.verdict || 'Unknown'}
            </span>
          </div>

          <div className="bg-gray-800/50 rounded-lg p-4">
            <h4 className="text-lg font-semibold text-cyan-400 mb-4">App Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex justify-between py-2 border-b border-gray-600/30">
                <span className="text-gray-400 font-medium">Package Name:</span>
                <span className="text-white font-mono text-right">{signature?.app_details?.package_name??'N/A'}</span>
              </div>
              {signature?.app_details?.app_name && (
                <div className="flex justify-between py-2 border-b border-gray-600/30">
                  <span className="text-gray-400 font-medium">App Name:</span>
                  <span className="text-white text-right">{signature.app_details?.app_name ?? 'N/A'}</span>
                </div>
              )}
            </div>
          </div>

          {/* Signature Verification */}
          <div className="bg-gray-800/50 rounded-lg p-4">
            <h4 className="text-lg font-semibold text-cyan-400 mb-4">Signature Verification</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex justify-between py-2 border-b border-gray-600/30">
                <span className="text-gray-400 font-medium">Signature Match:</span>
                <span className={`text-right font-semibold ${signature?.signature_match ? 'text-green-400' : 'text-red-400'}`}>
                  {signature?.signature_match ? 'Yes' : 'No'}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-600/30">
                <span className="text-gray-400 font-medium">Trusted Signatures:</span>
                <span className="text-white text-right">
                  {signature?.trusted_signatures?.length > 0 ? signature.trusted_signatures.length : 'None'}
                </span>
              </div>
            </div>
            
            {/* Extracted Signature Display */}
            {signature?.extracted_signatures?.length > 0 && (
              <div className="mt-4">
                <span className="text-gray-400 font-medium text-sm">Extracted Signature:</span>
                <div className="mt-2 p-3 bg-gray-700/50 rounded font-mono text-xs text-gray-300 break-all">
                  {signature.extracted_signatures[0]}
                </div>
              </div>
            )}
            
            {signature?.trusted_signatures?.length > 0 && (
              <div className="mt-4">
                <span className="text-gray-400 font-medium text-sm">Trusted Signature:</span>
                <div className="mt-2 p-3 bg-gray-700/50 rounded font-mono text-xs text-gray-300 break-all">
                  {signature.trusted_signatures[0]}
                </div>
              </div>
            )}
          </div>

          {/* Analysis Reasons */}
          {signature?.reasons?.length > 0 && (
            <div className="bg-gray-800/50 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-cyan-400 mb-4">Analysis Details</h4>
              <div className="space-y-2">
                {signature.reasons.map((reason, idx) => (
                  <div key={idx} className={`p-3 rounded-lg text-sm ${
                    reason.includes('✅') ? 'bg-green-900/30 border border-green-400/30 text-green-300' :
                    reason.includes('❌') ? 'bg-red-900/30 border border-red-400/30 text-red-300' :
                    'bg-yellow-900/30 border border-yellow-400/30 text-yellow-300'
                  }`}>
                    {reason}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Security Score */}
          {signature?.score && (
            <div className="bg-gray-800/50 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-cyan-400 mb-4">Security Score Analysis</h4>
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-300">Overall Security Score:</span>
                <div className="flex items-center gap-3">
                  {signature.score >= 90 ? (
                    <CheckCircle className="w-6 h-6 text-green-400" />
                  ) : signature.score >= 70 ? (
                    <Shield className="w-6 h-6 text-yellow-400" />
                  ) : signature.score >= 50 ? (
                    <AlertTriangle className="w-6 h-6 text-orange-400" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-400" />
                  )}
                  <span className={`text-2xl font-bold ${
                    signature.score >= 90 ? 'text-green-400' :
                    signature.score >= 70 ? 'text-yellow-400' :
                    signature.score >= 50 ? 'text-orange-400' :
                    'text-red-400'
                  }`}>
                    {signature.score}/100
                  </span>
                </div>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3 mb-3">
                <div 
                  className={`h-3 rounded-full transition-all duration-500 ${
                    signature.score >= 90 ? 'bg-gradient-to-r from-green-500 to-green-400' :
                    signature.score >= 70 ? 'bg-gradient-to-r from-yellow-500 to-yellow-400' :
                    signature.score >= 50 ? 'bg-gradient-to-r from-orange-500 to-orange-400' :
                    'bg-gradient-to-r from-red-500 to-red-400'
                  }`}
                  style={{ width: `${signature.score}%` }}
                ></div>
              </div>
              <div className="grid grid-cols-4 text-xs text-gray-400 text-center">
                <span>Critical</span>
                <span>Low</span>
                <span>Medium</span>
                <span>Safe</span>
              </div>
              <p className="text-sm text-gray-300 mt-3">
                {signature.score >= 90 ? 'This APK signature is verified and safe to install.' :
                 signature.score >= 70 ? 'This APK signature has minor concerns but is generally safe.' :
                 signature.score >= 50 ? 'This APK signature has several red flags. Install with caution.' :
                 'This APK signature is highly suspicious and should not be installed.'}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )}
</div>

      {/* Deep Scan Accordion */}
<div className="bg-gray-900/50 backdrop-blur-lg border border-cyan-400/20 rounded-2xl overflow-hidden mb-4">
 <button 
   className="w-full px-6 py-4 text-left hover:bg-gray-800/30 flex justify-between items-center transition-colors duration-200"
   onClick={() => setOpenAccordion(prev => ({ ...prev, deepScan: !prev.deepScan }))}
 >
   <div className="flex items-center gap-4">
     {deepScanStatus && deepScanStatus !== 'completed' ? (
       <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-cyan-400"></div>
     ) : deepScanResult?.suspicious_findings?.length > 0 ? (
       <XCircle className="w-6 h-6 text-red-400" />
     ) : deepScanResult?.suspicious_findings?.length === 0 ? (
       <CheckCircle className="w-6 h-6 text-green-400" />
     ) : (
       <Shield className="w-6 h-6 text-cyan-400" />
     )}
     <div>
       <span className="font-semibold text-white text-lg">Deep Scan Analysis</span>
       <p className="text-sm text-gray-400">
         {deepScanStatus && deepScanStatus !== 'completed' ? 
           'Scanning in progress...' : 
           'Comprehensive APK file and permission analysis'
         }
       </p>
     </div>
   </div>
   <div className="flex items-center gap-4">
     {deepScanResult?.suspicious_findings?.length > 0 && (
       <div className="px-3 py-1 rounded-full border font-bold text-sm text-red-400 bg-red-400/20 border-red-400">
         {deepScanResult.suspicious_findings.length} Issues
       </div>
     )}
     <span className="text-gray-400">{openAccordion.deepScan ? '−' : '+'}</span>
   </div>
 </button>
 {openAccordion.deepScan && (
   <div className="border-t border-gray-700/50 p-6">
     {deepScanError && (
       <div className="bg-red-900/30 border border-red-400/30 rounded-lg p-4 mb-6">
         <div className="flex items-center gap-2">
           <XCircle className="w-5 h-5 text-red-400" />
           <span className="text-red-400 font-semibold">Scan Failed</span>
         </div>
         <p className="text-red-300 mt-2">{deepScanError}</p>
       </div>
     )}
     
     {deepScanStatus && deepScanStatus !== 'completed' && (
       <div className="bg-cyan-900/30 border border-cyan-400/30 rounded-lg p-4 mb-6">
         <div className="flex items-center gap-2">
           <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-cyan-400"></div>
           <span className="text-cyan-400 font-semibold">Scan Status</span>
         </div>
         <p className="text-cyan-300 mt-2">{deepScanStatus}</p>
       </div>
     )}

     {/* Logs */}
     {deepScanLogs.length > 0 && (
       <div className="bg-gray-800/50 rounded-lg p-4 mb-6">
         <h4 className="text-lg font-semibold text-cyan-400 mb-4">Scan Logs</h4>
         <div className="bg-gray-900/50 p-3 rounded-lg font-mono text-sm overflow-auto max-h-64 text-gray-300">
           {deepScanLogs.map((log, idx) => <div key={idx} className="py-1">{log}</div>)}
         </div>
       </div>
     )}

     {/* Deep Scan Result */}
     {deepScanResult && (
       <div className="space-y-6">
         {/* Summary */}
         <div className="bg-gray-800/50 rounded-lg p-4">
           <h4 className="text-lg font-semibold text-cyan-400 mb-4">Scan Summary</h4>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
             <div className="flex justify-between py-2 border-b border-gray-600/30">
               <span className="text-gray-400 font-medium">APK Path:</span>
               <span className="text-white font-mono text-right">{deepScanResult.scan_summary?.apk_path || 'N/A'}</span>
             </div>
             <div className="flex justify-between py-2 border-b border-gray-600/30">
               <span className="text-gray-400 font-medium">Total Files Scanned:</span>
               <span className="text-white text-right">{deepScanResult.scan_summary?.total_files_scanned || 'N/A'}</span>
             </div>
             <div className="flex justify-between py-2 border-b border-gray-600/30">
               <span className="text-gray-400 font-medium">Scan Timestamp:</span>
               <span className="text-white text-right">{deepScanResult.scan_summary?.scan_timestamp || 'N/A'}</span>
             </div>
           </div>
         </div>

         {/* Suspicious Findings */}
         <div className="bg-gray-800/50 rounded-lg p-4">
           <h4 className="text-lg font-semibold text-cyan-400 mb-4">Suspicious Findings</h4>
           {deepScanResult.suspicious_findings?.length > 0 ? (
             <div className="space-y-3 max-h-64 overflow-auto">
               {deepScanResult.suspicious_findings.map((finding, idx) => (
                 <div key={idx} className={`p-3 rounded-lg text-sm border ${
                   finding.severity?.toLowerCase() === 'high' ? 'bg-red-900/30 border-red-400/30 text-red-300' :
                   finding.severity?.toLowerCase() === 'medium' ? 'bg-yellow-900/30 border-yellow-400/30 text-yellow-300' :
                   'bg-orange-900/30 border-orange-400/30 text-orange-300'
                 }`}>
                   <div className="font-semibold mb-1">
                     {finding.severity?.toUpperCase()} - {finding.rule_name}
                   </div>
                   <div className="text-xs text-gray-400 mb-2">
                     {finding.file_path}:{finding.line_number}
                   </div>
                   <div className="font-mono text-xs">
                     {finding.matched_data}
                   </div>
                 </div>
               ))}
             </div>
           ) : (
             <div className="bg-green-900/30 border border-green-400/30 rounded-lg p-4">
               <div className="flex items-center gap-2">
                 <CheckCircle className="w-5 h-5 text-green-400" />
                 <span className="text-green-400 font-semibold">No suspicious findings detected</span>
               </div>
             </div>
           )}
         </div>

         {/* Suspicious Permissions */}
         {deepScanResult.inventory?.all_permissions_found && (
           <div className="bg-gray-800/50 rounded-lg p-4">
             <h4 className="text-lg font-semibold text-cyan-400 mb-4">Suspicious Permissions</h4>
             <div className="space-y-2 max-h-64 overflow-auto">
               {deepScanResult.inventory.all_permissions_found
                 .filter(perm => 
                   perm.includes('CAMERA') || 
                   perm.includes('MICROPHONE') || 
                   perm.includes('LOCATION') || 
                   perm.includes('SMS') || 
                   perm.includes('CALL') || 
                   perm.includes('CONTACTS') || 
                   perm.includes('STORAGE') ||
                   perm.includes('ADMIN') ||
                   perm.includes('SYSTEM') ||
                   perm.includes('ROOT')
                 )
                 .map((perm, idx) => (
                   <div key={idx} className="p-3 rounded-lg text-sm bg-yellow-900/30 border border-yellow-400/30 text-yellow-300">
                     <div className="flex items-center gap-2">
                       <AlertTriangle className="w-4 h-4" />
                       <span className="font-mono">{perm}</span>
                     </div>
                   </div>
                 ))
               }
               {deepScanResult.inventory.all_permissions_found
                 .filter(perm => 
                   !(perm.includes('CAMERA') || 
                     perm.includes('MICROPHONE') || 
                     perm.includes('LOCATION') || 
                     perm.includes('SMS') || 
                     perm.includes('CALL') || 
                     perm.includes('CONTACTS') || 
                     perm.includes('STORAGE') ||
                     perm.includes('ADMIN') ||
                     perm.includes('SYSTEM') ||
                     perm.includes('ROOT'))
                 ).length === deepScanResult.inventory.all_permissions_found.length && (
                 <div className="bg-green-900/30 border border-green-400/30 rounded-lg p-4">
                   <div className="flex items-center gap-2">
                     <CheckCircle className="w-5 h-5 text-green-400" />
                     <span className="text-green-400 font-semibold">No suspicious permissions detected</span>
                   </div>
                 </div>
               )}
             </div>
           </div>
         )}

         {/* All Permissions */}
         <div className="bg-gray-800/50 rounded-lg p-4">
           <h4 className="text-lg font-semibold text-cyan-400 mb-4">All Permissions</h4>
           <div className="max-h-64 overflow-auto">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
               {deepScanResult.inventory?.all_permissions_found?.map((perm, idx) => (
                 <div key={idx} className="p-2 bg-gray-700/50 rounded text-sm font-mono text-gray-300">
                   {perm}
                 </div>
               ))}
             </div>
           </div>
         </div>

         {/* URLs Found */}
         <div className="bg-gray-800/50 rounded-lg p-4">
           <h4 className="text-lg font-semibold text-cyan-400 mb-4">URLs Found</h4>
           <div className="max-h-64 overflow-auto">
             {deepScanResult.inventory?.all_urls_found?.length > 0 ? (
               <div className="space-y-2">
                 {deepScanResult.inventory.all_urls_found.map((url, idx) => (
                   <div key={idx} className="p-2 bg-gray-700/50 rounded text-sm font-mono text-gray-300 break-all">
                     {url}
                   </div>
                 ))}
               </div>
             ) : (
               <div className="text-gray-400 text-sm">No URLs found</div>
             )}
           </div>
         </div>

         {/* Safe Browsing */}
         <div className="bg-gray-800/50 rounded-lg p-4">
           <h4 className="text-lg font-semibold text-cyan-400 mb-4">Safe Browsing Results</h4>
           {deepScanResult.safe_browsing_results?.flagged_urls?.length > 0 ? (
             <div className="space-y-2">
               {deepScanResult.safe_browsing_results.flagged_urls.map((url, idx) => (
                 <div key={idx} className="p-3 rounded-lg text-sm bg-red-900/30 border border-red-400/30 text-red-300">
                   <div className="flex items-center gap-2">
                     <XCircle className="w-4 h-4" />
                     <span className="font-mono break-all">{url}</span>
                   </div>
                 </div>
               ))}
             </div>
           ) : (
             <div className="bg-green-900/30 border border-green-400/30 rounded-lg p-4">
               <div className="flex items-center gap-2">
                 <CheckCircle className="w-5 h-5 text-green-400" />
                 <span className="text-green-400 font-semibold">No flagged URLs found</span>
               </div>
             </div>
           )}
         </div>
       </div>
     )}
   </div>
 )}
</div>
</div>
  );
};

export default page;
