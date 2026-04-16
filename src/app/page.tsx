"use client";

import { useState } from "react";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [message, setMessage] = useState<string>("");
  const [syncData, setSyncData] = useState<any[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setStatus("idle");
      setMessage("");
      setSyncData([]); // Reset table on new file
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setStatus("error");
      setMessage("Please select a file first.");
      return;
    }

    setStatus("uploading");
    setMessage("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const response = await fetch(`${apiUrl}/api/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setMessage(data.message || "Spreadsheet processed successfully.");
        // Capture extracted data string
        if (data.syncData) {
          setSyncData(data.syncData);
        }
      } else {
        setStatus("error");
        setMessage(data.message || "Upload failed.");
      }
    } catch (error) {
      setStatus("error");
      setMessage("Could not connect to the backend server. Make sure it's running.");
    }
  };

  return (
    <main className="min-h-screen bg-neutral-950 font-sans text-neutral-100 p-6 sm:p-12 selection:bg-cyan-500/30">
      {/* Background Gradient */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/20 via-neutral-950 to-neutral-950 -z-10 pointer-events-none"></div>

      <div className="max-w-5xl mx-auto space-y-12">
        {/* Header */}
        <header className="text-center space-y-4 pt-8">
          <div className="inline-flex items-center justify-center p-3 bg-cyan-500/10 rounded-full mb-2 ring-1 ring-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
            <svg className="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 pb-1">
            Payment Tracker System
          </h1>
          <p className="text-neutral-400 max-w-xl mx-auto text-lg pt-2">
            Upload your contractor's spreadsheet logic to intelligently merge and sync values with your Live Tracker.
          </p>
        </header>

        {/* Upload Card */}
        <div className="max-w-xl mx-auto">
          <div className="p-8 backdrop-blur-xl bg-neutral-900/50 rounded-3xl border border-white/5 shadow-2xl transition-all">
            <div className="space-y-6">

              {/* File Drop Area */}
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative flex flex-col items-center justify-center w-full h-40 px-4 transition bg-neutral-950 border-2 border-neutral-800 border-dashed rounded-xl hover:border-cyan-500/50 focus-within:ring-2 focus-within:ring-cyan-500 focus-within:border-transparent">
                  <svg className="w-10 h-10 mb-3 text-cyan-500/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="mb-2 text-sm text-neutral-400 group-hover:text-neutral-300 transition-colors">
                    <span className="font-semibold text-cyan-400">Click to attach</span> or drag and drop
                  </p>
                  <p className="text-xs text-neutral-500">.xlsx, .xls, .csv files only</p>
                  <input
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    onChange={handleFileChange}
                    disabled={status === "uploading"}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Show selected file banner */}
              {file && (
                <div className="flex items-center p-3 bg-cyan-950/30 border border-cyan-500/20 rounded-lg animate-in fade-in slide-in-from-top-2">
                  <svg className="w-5 h-5 text-cyan-400 mr-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium text-cyan-100 truncate">{file.name}</span>
                </div>
              )}

              {/* Upload Button */}
              <button
                onClick={handleUpload}
                disabled={status === "uploading" || !file}
                className={`relative w-full py-4 px-6 rounded-xl font-bold text-white tracking-wide overflow-hidden transition-all duration-300
                  ${status === "uploading" || !file
                    ? "bg-neutral-800 text-neutral-500 cursor-not-allowed border border-neutral-700"
                    : "bg-cyan-600 hover:bg-cyan-500 active:scale-[0.98] border border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:shadow-[0_0_25px_rgba(6,182,212,0.5)]"
                  }`}
              >
                {status === "uploading" ? (
                  <div className="flex items-center justify-center space-x-3">
                    <div className="w-5 h-5 border-2 border-neutral-400 border-t-white rounded-full animate-spin"></div>
                    <span>Initializing Engine...</span>
                  </div>
                ) : (
                  <span>Launch Synchronization</span>
                )}
              </button>

              {/* Status Message Area */}
              {status !== "idle" && (
                <div className={`p-4 rounded-xl text-sm font-medium border backdrop-blur-sm transition-all animate-in zoom-in-95
                  ${status === "success" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : ""}
                  ${status === "error" ? "bg-rose-500/10 text-rose-400 border-rose-500/20" : ""}
                  ${status === "uploading" ? "bg-blue-500/10 text-blue-400 border-blue-500/20" : ""}
                `}>
                  <p className="flex items-center justify-center space-x-2">
                    {status === "success" && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>}
                    {status === "error" && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                    <span>{message || (status === "uploading" ? "Establishing secure connection to APIs..." : "")}</span>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Data Table View */}
        {syncData.length > 0 && (
          <div className="pt-8 pb-12 animate-in slide-in-from-bottom-8 fade-in duration-700 ease-out">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-neutral-100 flex items-center">
                <span className="w-2 h-6 bg-cyan-500 rounded-sm mr-3 shadow-[0_0_8px_rgba(6,182,212,0.8)]"></span>
                Extracted Sync Data
              </h2>
              <span className="px-3 py-1 bg-neutral-800 text-cyan-400 rounded-full text-xs font-semibold border border-neutral-700">
                {syncData.length} records processed
              </span>
            </div>

            <div className="overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/40 backdrop-blur-xl shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-neutral-950/80 border-b border-neutral-800 text-neutral-400">
                    <tr>
                      <th className="px-6 py-5 font-semibold">User Details</th>
                      <th className="px-6 py-5 font-semibold">Address Target</th>
                      <th className="px-6 py-5 font-semibold hidden md:table-cell">Sync Status</th>
                      <th className="px-6 py-5 font-semibold hidden md:table-cell">Days Tracked</th>
                      <th className="px-6 py-5 font-semibold text-right">Extracted Payment</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800/80">
                    {syncData.map((row, idx) => (
                      <tr key={idx} className={`transition-colors ${row.alreadySynced ? 'bg-amber-950/10 opacity-70' : 'hover:bg-neutral-800/40'}`}>
                        <td className="px-6 py-4">
                          <div className="font-medium text-neutral-200">{row.Name || "Unknown"}</div>
                          <div className="text-xs text-neutral-500 mt-1">Claim: {row.Claim || "N/A"}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-neutral-300 font-mono text-xs p-1.5 bg-neutral-950 rounded inline-block border border-neutral-800">
                            {row.Address || "Address not available"}
                          </div>
                        </td>
                        <td className="px-6 py-4 hidden md:table-cell">
                          {row.alreadySynced ? (
                             <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-500/10 text-amber-500 border border-amber-500/20">
                               Already Tracked
                             </span>
                          ) : (
                             <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                               Ready
                             </span>
                          )}
                        </td>
                        <td className="px-6 py-4 hidden md:table-cell">
                          <div className="inline-flex items-center px-2.5 py-1 rounded-md bg-neutral-800/80 text-neutral-300 text-xs font-medium border border-neutral-700/50">
                            {row["Period In Days"] || 0} D
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className={`font-bold text-base ${row.alreadySynced ? 'text-neutral-500 line-through' : 'text-emerald-400'}`}>
                            £{parseFloat(row.Amount || 0).toLocaleString('en-GB', { minimumFractionDigits: 2 })}
                          </div>
                          {parseFloat(row.HB || 0) > 0 && (
                            <div className="text-xs text-neutral-500 mt-1">+ £{parseFloat(row.HB || 0).toLocaleString()} HB</div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}
      </div>
    </main>
  );
}
