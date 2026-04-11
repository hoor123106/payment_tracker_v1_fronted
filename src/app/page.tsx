"use client";

import { useState } from "react";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [message, setMessage] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setStatus("idle");
      setMessage("");
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
      const response = await fetch("http://localhost:5000/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setMessage(data.message || "File processed successfully");
      } else {
        setStatus("error");
        setMessage(data.message || "Upload failed");
      }
    } catch (error) {
      setStatus("error");
      setMessage("Could not connect to the backend server.");
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Payment Tracker
        </h1>
        
        <div className="space-y-6">
          {/* File Input */}
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Contractor Spreadsheet
            </label>
            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileChange}
              disabled={status === "uploading"}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100
                cursor-pointer transition-all"
            />
          </div>

          {/* Upload Button */}
          <button
            onClick={handleUpload}
            disabled={status === "uploading" || !file}
            className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all
              ${status === "uploading" || !file 
                ? "bg-gray-400 cursor-not-allowed" 
                : "bg-blue-600 hover:bg-blue-700 active:transform active:scale-95 shadow-md hover:shadow-lg"
              }`}
          >
            {status === "uploading" ? (
              <div className="flex items-center justify-center space-x-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Processing...</span>
              </div>
            ) : (
              "Upload and Sync"
            )}
          </button>

          {/* Status Area */}
          {status !== "idle" && (
            <div className={`mt-4 p-4 rounded-lg text-sm font-medium animate-in fade-in duration-300
              ${status === "success" ? "bg-green-50 text-green-700 border border-green-200" : ""}
              ${status === "error" ? "bg-red-50 text-red-700 border border-red-200" : ""}
              ${status === "uploading" ? "bg-blue-50 text-blue-700 border border-blue-200" : ""}
            `}>
              <p className="text-center">{message || (status === "uploading" ? "Uploading file..." : "")}</p>
            </div>
          )}
        </div>
      </div>
      
      <p className="mt-8 text-gray-400 text-xs">
        Supported formats: .xlsx, .xls, .csv
      </p>
    </main>
  );
}
