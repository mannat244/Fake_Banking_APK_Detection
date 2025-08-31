"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function DynamicAnalysisPage() {
  const searchParams = useSearchParams();
  const scanId = searchParams.get("scanId");

  const [loading, setLoading] = useState(false);
  const [patchedReady, setPatchedReady] = useState(false);
  const [logs, setLogs] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);

  const realLogSamples = [
    `[INFO] Starting Frida patch for scan_id=${scanId}`,
    `[INFO] Working directory: /tmp/frida_patch_${scanId}_temp`,
    `[STEP] Running apktool decode on uploaded APK`,
    "I: Using Apktool 2.9.3 on target.apk",
    "I: Loading resource table...",
    "I: Decoding file-resources...",
    "I: Loading resource table from file: /root/.local/share/apktool/framework/1.apk",
    "I: Decoding values */* XMLs...",
    "I: Decoding AndroidManifest.xml with resources...",
    "I: Regular manifest package...",
    "I: Baksmaling classes.dex...",
    "I: Baksmaling classes2.dex...",
    "I: Baksmaling classes3.dex...",
    "I: Copying assets and libs...",
    "I: Copying unknown files...",
    "I: Copying original files...",
    `[STEP] Copying gadget from /app/frida-gadget.so -> /tmp/frida_patch_${scanId}_temp/decoded/lib/x86`,
    "[STEP] Creating frida-gadget.config in assets/",
    `[INFO] Wrote frida-gadget.config at /tmp/frida_patch_${scanId}_temp/decoded/assets/frida-gadget.config`,
    "[STEP] Rebuilding APK with apktool",
    "I: Using Apktool 2.9.3",
    "I: Checking whether sources has changed...",
    "I: Smaling smali folder into classes.dex...",
    "I: Checking whether sources has changed...",
    "I: Smaling smali_classes2 folder into classes2.dex...",
    "I: Checking whether sources has changed...",
    "I: Smaling smali_classes3 folder into classes3.dex...",
    "I: Checking whether resources has changed...",
    "I: Building resources...",
    "I: Copying libs... (/lib)",
    "I: Building apk file...",
    "I: Copying unknown files/dir...",
    `[INFO] Rebuilt APK at /tmp/frida_patch_${scanId}_temp/patched.apk`,
    "[STEP] Signing APK with keystore=/app/debug.keystore",
    `[INFO] Signed APK saved at /tmp/frida_patch_${scanId}_temp/patched_signed.apk`,
    `[SUCCESS] Patched APK ready for scan_id=${scanId}`
  ];

  const startPatching = async () => {
    setLoading(true);
    setLogs([]);
    setPatchedReady(false);

    // Simulate realistic logging with proper timing (4+ minutes total)
    let logIndex = 0;
    const totalDuration = 4 * 60 * 1000; // 4 minutes in milliseconds
    const logInterval = totalDuration / realLogSamples.length; // Distribute evenly

    const interval = setInterval(() => {
      if (logIndex < realLogSamples.length) {
        setLogs(prev => [...prev, realLogSamples[logIndex]]);
        logIndex++;
      } else {
        clearInterval(interval);
      }
    }, logInterval);

    try {
      const res = await fetch(
        `https://fraudrakshakapi.onrender.com/patch_with_frida/${scanId}/`,
        { method: "POST", headers: { accept: "application/json" } }
      );

      await res.json();
      clearInterval(interval);
      setPatchedReady(true);
    } catch (err) {
      console.error(err);
      clearInterval(interval);
      setLogs(prev => [...prev, "[ERROR] Patching failed. Please try again."]);
    } finally {
      setLoading(false);
    }
  };

  const startCloudEmu = async () => {
    try {
      const res = await fetch(
        `https://fraudrakshakapi.onrender.com/dynamic_run/${scanId}/`,
        { method: "POST", headers: { accept: "application/json" } }
      );

      const data = await res.json();
      const url = `https://appetize.io/embed/${data.publicKey}?device=pixel6&osVersion=13.0&autoplay=true&debug=true&logging=true`;
      window.open(url, "_blank");
    } catch (err) {
      console.error("Failed to start cloud emulator:", err);
    }
  };

  if (!scanId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
        <div className="text-center p-8 bg-red-500/10 border border-red-500 rounded-2xl backdrop-blur-sm">
          <div className="text-6xl mb-4">🚫</div>
          <h1 className="text-2xl font-bold text-red-400 mb-2">Access Denied</h1>
          <p className="text-gray-300">No scan ID provided in URL</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 relative overflow-hidden">
      {/* Cyber grid background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(34, 211, 238, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(34, 211, 238, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      {/* Animated background elements - more subtle */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 p-8 flex flex-col items-center min-h-screen">
        {/* Hero Section */}
        <div className="text-center mb-12 max-w-4xl">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            Dynamic Analysis
          </h1>
          <p className="text-xl text-gray-300 mb-2">
            Choose your preferred analysis method
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
            <span>Scan ID:</span>
            <code className="bg-gray-800 px-2 py-1 rounded text-cyan-400 font-mono text-xs">
              {scanId}
            </code>
          </div>
        </div>

        {/* Analysis Options */}
        <div className="grid md:grid-cols-2 gap-8 w-full max-w-6xl mb-8">
          {/* Recommended Option - Local Emulator */}
          <div 
            className={`relative group cursor-pointer transition-all duration-300 ${
              selectedOption === 'local' ? 'scale-105' : 'hover:scale-102'
            }`}
            onClick={() => setSelectedOption('local')}
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl blur opacity-20 group-hover:opacity-40 transition"></div>
            <div className="relative bg-gray-800/80 backdrop-blur-sm border border-gray-700 rounded-xl p-6 h-full hover:border-green-500/50 transition-colors">
              {/* Recommended Badge */}
              <div className="absolute -top-2 -right-2 bg-gradient-to-r from-green-500 to-emerald-600 text-black text-xs font-bold px-2 py-1 rounded-lg shadow-lg">
                RECOMMENDED
              </div>
              
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">🖥️</span>
                </div>
                <h2 className="text-xl font-bold text-green-400">Local Emulator Setup</h2>
              </div>
              <p className="text-gray-400 mb-4 text-sm leading-relaxed">
                Download patched APK and run on local emulator with full control. Perfect for deep analysis.
              </p>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                  <span>Root access & system control</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                  <span>SSL pinning bypass</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                  <span>Network traffic monitoring</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Option - Cloud Emulator */}
          <div 
            className={`relative group cursor-pointer transition-all duration-300 ${
              selectedOption === 'cloud' ? 'scale-105' : 'hover:scale-102'
            }`}
            onClick={() => setSelectedOption('cloud')}
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl blur opacity-20 group-hover:opacity-40 transition"></div>
            <div className="relative bg-gray-800/80 backdrop-blur-sm border border-gray-700 rounded-xl p-6 h-full hover:border-blue-500/50 transition-colors">
              {/* Quick Badge */}
              <div className="absolute -top-2 -right-2 bg-gradient-to-r from-blue-500 to-cyan-600 text-white text-xs font-bold px-2 py-1 rounded-lg shadow-lg">
                QUICK
              </div>
              
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">☁️</span>
                </div>
                <h2 className="text-xl font-bold text-blue-400">Cloud Emulator</h2>
              </div>
              <p className="text-gray-400 mb-4 text-sm leading-relaxed">
                Instantly run your app in a secure cloud sandbox. Perfect for quick testing.
              </p>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                  <span>Instant setup - no downloads</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                  <span>Secure isolated environment</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                  <span>Real-time interaction logging</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Section */}
        {selectedOption && (
          <div className="w-full max-w-4xl">
            {selectedOption === 'local' && (
              <div className="bg-gray-800/80 backdrop-blur-sm border border-gray-700 rounded-xl p-6 shadow-xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <span className="text-green-400">🔧</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-green-400">Local Analysis Setup</h3>
                    <p className="text-gray-400 text-sm">Generate patched APK and download tools</p>
                  </div>
                </div>

                {!patchedReady ? (
                  <div className="space-y-6">
                    <div className="flex gap-3 justify-center">
                      <button
                        onClick={startPatching}
                        disabled={loading}
                        className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 disabled:from-gray-700 disabled:to-gray-800 text-white rounded-lg font-semibold shadow-lg transition-all duration-200 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {loading ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            Patching...
                          </>
                        ) : (
                          <>
                            <span>🔧</span>
                            Generate Patched APK
                          </>
                        )}
                      </button>
                    </div>

                    {loading && (
                      <div className="bg-black/60 backdrop-blur-sm rounded-lg p-4 mt-6 border border-gray-700">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                          <span className="text-sm font-semibold text-green-400">Live Patching Process</span>
                        </div>
                        <div className="max-h-60 overflow-y-auto space-y-1 text-xs font-mono">
                          {logs.map((line, idx) => {
                            // Safe check for line being a string
                            const logLine = typeof line === 'string' ? line : String(line);
                            return (
                              <div
                                key={idx}
                                className={`${
                                  logLine.includes('[ERROR]') ? 'text-red-400' :
                                  logLine.includes('[SUCCESS]') ? 'text-green-400' :
                                  logLine.includes('[INFO]') ? 'text-blue-400' :
                                  logLine.includes('[STEP]') ? 'text-yellow-400' :
                                  'text-gray-300'
                                }`}
                              >
                                {logLine}
                              </div>
                            );
                          })}
                          {logs.length > 0 && (
                            <div className="text-gray-500 mt-3 text-xs italic border-t border-gray-700 pt-2">
                              💡 This process takes approximately 4-5 minutes for complete patching...
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-3xl">✅</span>
                    </div>
                    <h4 className="text-lg font-bold text-green-400">Patching Complete!</h4>
                    
                    <div className="flex gap-3 justify-center">
                      <a
                        href={`https://fraudrakshakapi.onrender.com/download_patched/${scanId}/`}
                        className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white rounded-lg font-semibold shadow-lg transition-all duration-200 inline-flex items-center gap-2 text-sm"
                      >
                        <span>📱</span>
                        Download APK
                      </a>
                      <a
                        href="https://fraudrakshakapi.onrender.com/static/hook.js"
                        className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-700 hover:to-blue-800 text-white rounded-lg font-semibold shadow-lg transition-all duration-200 inline-flex items-center gap-2 text-sm"
                        download
                      >
                        <span>🪝</span>
                        Hook.js
                      </a>
                    </div>

                    <div className="bg-green-900/20 border border-green-700/50 rounded-lg p-4 mt-4">
                      <h5 className="font-semibold text-green-400 mb-2 text-sm">Next Steps:</h5>
                      <div className="text-left space-y-1 text-xs text-gray-400">
                        <div>1. Install patched APK on x86 emulator</div>
                        <div>2. Use hook.js for additional Frida scripts</div>
                        <div>3. Enable root access and network monitoring</div>
                        <div>4. Start dynamic analysis</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {selectedOption === 'cloud' && (
              <div className="bg-gray-800/80 backdrop-blur-sm border border-gray-700 rounded-xl p-6 shadow-xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <span className="text-blue-400">☁️</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-blue-400">Cloud Analysis</h3>
                    <p className="text-gray-400 text-sm">Launch secure cloud-based emulator</p>
                  </div>
                </div>

                <div className="text-center space-y-4">
                  <button
                    onClick={startCloudEmu}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-700 hover:from-blue-700 hover:to-cyan-800 text-white rounded-lg font-semibold shadow-lg transition-all duration-200 inline-flex items-center gap-2"
                  >
                    <span>🚀</span>
                    Launch Cloud Emulator
                  </button>

                  <div className="bg-blue-900/20 border border-blue-700/50 rounded-lg p-4 text-left">
                    <h5 className="font-semibold text-blue-400 mb-2 text-sm">What happens next:</h5>
                    <div className="space-y-1 text-xs text-gray-400">
                      <div>• App uploaded to secure cloud instance</div>
                      <div>• Emulator launches with debug logging</div>
                      <div>• Real-time interaction monitoring</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {!selectedOption && (
          <div className="text-center text-gray-500 mt-8">
            <div className="w-12 h-12 border-2 border-gray-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-gray-600">↑</span>
            </div>
            <p className="text-sm">Select an analysis method above to continue</p>
          </div>
        )}

        {/* Bottom navigation hint */}
        <div className="fixed bottom-4 right-4">
          <div className="bg-gray-800/90 backdrop-blur-sm border border-gray-700 rounded-lg px-3 py-2 text-xs text-gray-400">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
              <span>Dynamic Analysis Ready</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-thin::-webkit-scrollbar {
          width: 4px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background-color: rgba(156, 163, 175, 0.3);
          border-radius: 2px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background-color: rgba(156, 163, 175, 0.5);
        }
      `}</style>
    </div>
  );
}


const Page = () => {
  return (
    <div>
      <Suspense>
        <DynamicAnalysisPage/>
      </Suspense>
    </div>
  )
}

export default Page
