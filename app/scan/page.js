'use client';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

const page = () => {
  const searchParams = useSearchParams();
  const [scanID, setScanID] = useState("");
  const [BaseURL] = useState("/https://fraudrakshakapi.onrender.com");

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
      if (!res.ok) throw new Error(`Error: ${res.status}`);
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
      <h1 className="text-2xl mb-4">Scan ID: <span className="text-cyan-400">{scanID}</span></h1>

      {/* Metadata Accordion */}
      <div className="border border-gray-700 rounded-lg overflow-hidden mb-4">
        <button 
          className="w-full px-4 py-3 text-left bg-gray-800 hover:bg-gray-700 flex justify-between items-center"
          onClick={() => setOpenAccordion(prev => ({ ...prev, metadata: !prev.metadata }))}
        >
          <span className="font-semibold">Metadata Details</span>
          <span>{openAccordion.metadata ? '−' : '+'}</span>
        </button>
        {openAccordion.metadata && (
          <div className="p-4 bg-gray-900">
            {loadingMetadata && <p>Loading metadata...</p>}
            {metadataError && <p className="text-red-400">{metadataError}</p>}
            {metadata && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-800 rounded-lg p-4">
                  <h2 className="font-semibold text-lg mb-2">APK Details</h2>
                  <ul className="space-y-1 text-sm">
                    <li><strong>Package Name:</strong> {metadata.apk_details?.package_name ?? 'N/A'}</li>
                    <li><strong>App Name:</strong> {metadata.apk_details?.app_name ?? 'N/A'}</li>
                    <li><strong>Version Name:</strong> {metadata.apk_details?.version_name ?? 'N/A'}</li>
                    <li><strong>Version Code:</strong> {metadata.apk_details?.version_code ?? 'N/A'}</li>
                  </ul>
                </div>
                <div className="bg-gray-800 rounded-lg p-4">
                  <h2 className="font-semibold text-lg mb-2">Play Store Match</h2>
                  {metadata.play_store_match?.error ? (
                    <p className="text-red-400">{metadata.play_store_match.error}</p>
                  ) : (
                    <ul className="space-y-1 text-sm">
                      {Object.entries(metadata.play_store_match ?? {}).map(([key, value]) => (
                        <li key={key}><strong>{key.replace(/_/g, ' ')}:</strong> {value ?? 'N/A'}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )}
            {metadata?.reasons?.length > 0 && (
              <div className="mt-4 bg-red-800/30 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Reasons / Alerts</h3>
                <ul className="list-disc list-inside text-sm">
                  {metadata.reasons.map((r, idx) => <li key={idx}>{r}</li>)}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>


      {/* Signature Accordion */}
    <div className="border border-gray-700 rounded-lg overflow-hidden">
        <button 
          className="w-full px-4 py-3 text-left bg-gray-800 hover:bg-gray-700 flex justify-between items-center"
          onClick={() => setOpenAccordion(prev => ({ ...prev, signature: !prev.signature }))}
        >
          <span className="font-semibold">Signature Check</span>
          <span>{openAccordion.signature ? '−' : '+'}</span>
        </button>
        {openAccordion.signature && (
          <div className="p-4 bg-gray-900">
            {loadingSignature && <p>Checking signature...</p>}
            {signatureError && <p className="text-red-400">{signatureError}</p>}
            {signature && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-800 rounded-lg p-4">
                  <h2 className="font-semibold text-lg mb-2">App Details</h2>
                  <ul className="space-y-1 text-sm">
                    <li><strong>Package Name:</strong> {signature.app_details?.package_name ?? 'N/A'}</li>
                    <li><strong>App Name:</strong> {signature.app_details?.app_name ?? 'N/A'}</li>
                  </ul>
                </div>
                <div className="bg-gray-800 rounded-lg p-4">
                  <h2 className="font-semibold text-lg mb-2">Signatures</h2>
                  <ul className="space-y-1 text-sm">
                    <li><strong>Extracted Signatures:</strong> {signature.extracted_signatures?.join(', ') ?? 'N/A'}</li>
                    <li><strong>Trusted Signatures:</strong> {signature.trusted_signatures?.join(', ') ?? 'N/A'}</li>
                    <li><strong>Signature Match:</strong> {signature.signature_match ? 'Yes' : 'No'}</li>
                    <li><strong>Verdict:</strong> {signature.verdict ?? 'N/A'}</li>
                  </ul>
                </div>
              </div>
            )}
            {signature?.reasons?.length > 0 && (
              <div className="mt-4 bg-yellow-800/30 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Reasons / Alerts</h3>
                <ul className="list-disc list-inside text-sm">
                  {signature.reasons.map((r, idx) => <li key={idx}>{r}</li>)}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Deep Scan Accordion */}
      <div className="border border-gray-700 rounded-lg overflow-hidden">
        <button 
          className="w-full px-4 py-3 text-left bg-gray-800 hover:bg-gray-700 flex justify-between items-center"
          onClick={() => setOpenAccordion(prev => ({ ...prev, deepScan: !prev.deepScan }))}
        >
          <span className="font-semibold">Deep Scan</span>
          <span>{openAccordion.deepScan ? '−' : '+'}</span>
        </button>
        {openAccordion.deepScan && (
          <div className="p-4 bg-gray-900 space-y-4">
            {deepScanError && <p className="text-red-400">{deepScanError}</p>}
            {deepScanStatus && <p>Status: <strong>{deepScanStatus}</strong></p>}

            {/* Logs */}
            {deepScanLogs.length > 0 && (
              <div className="bg-gray-800 p-2 rounded-lg font-mono text-sm overflow-auto max-h-64">
                {deepScanLogs.map((log, idx) => <div key={idx}>{log}</div>)}
              </div>
            )}

            {/* Deep Scan Result */}
            {deepScanResult && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Summary */}
                <div className="bg-gray-800 p-4 rounded-lg">
                  <h2 className="font-semibold mb-2">Scan Summary</h2>
                  <ul className="text-sm space-y-1">
                    <li><strong>APK Path:</strong> {deepScanResult.scan_summary?.apk_path}</li>
                    <li><strong>Total Files Scanned:</strong> {deepScanResult.scan_summary?.total_files_scanned}</li>
                    <li><strong>Scan Timestamp:</strong> {deepScanResult.scan_summary?.scan_timestamp}</li>
                  </ul>
                </div>

                {/* Suspicious Findings */}
                <div className="bg-gray-800 p-4 rounded-lg overflow-auto max-h-64">
                  <h2 className="font-semibold mb-2">Suspicious Findings</h2>
                  {deepScanResult.suspicious_findings?.length > 0 ? (
                    <ul className="text-sm space-y-1">
                      {deepScanResult.suspicious_findings.map((f, idx) => (
                        <li key={idx}>
                          <span className="font-semibold">{f.severity.toUpperCase()}</span> - {f.rule_name} in {f.file_path}:{f.line_number} <br/>
                          <span className="text-yellow-300">{f.matched_data}</span>
                        </li>
                      ))}
                    </ul>
                  ) : <p>No suspicious findings.</p>}
                </div>

                {/* Inventory */}
                <div className="bg-gray-800 p-4 rounded-lg">
                  <h2 className="font-semibold mb-2">Permissions</h2>
                  <ul className="text-sm list-disc list-inside">
                    {deepScanResult.inventory?.all_permissions_found?.map((perm, idx) => <li key={idx}>{perm}</li>)}
                  </ul>
                  <h2 className="font-semibold mt-4 mb-2">URLs Found</h2>
                  <ul className="text-sm list-disc list-inside">
                    {deepScanResult.inventory?.all_urls_found?.map((url, idx) => <li key={idx}>{url}</li>)}
                  </ul>
                </div>

                {/* Safe Browsing */}
                <div className="bg-gray-800 p-4 rounded-lg">
                  <h2 className="font-semibold mb-2">Safe Browsing</h2>
                  {deepScanResult.safe_browsing_results?.flagged_urls?.length > 0 ? (
                    <ul className="text-sm list-disc list-inside">
                      {deepScanResult.safe_browsing_results.flagged_urls.map((url, idx) => <li key={idx}>{url}</li>)}
                    </ul>
                  ) : <p>No flagged URLs.</p>}
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
