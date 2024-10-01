"use client";

import { useTranscriptionStore } from "@/store/TranscriptionStore";
import { useState } from "react";
import { Copy, Download, Check } from "lucide-react";
import toast from "react-hot-toast";

export function TranscriptionResult() {
  const { transcript } = useTranscriptionStore();
  const [copied, setCopied] = useState(false);

  if (!transcript) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(transcript);
      setCopied(true);
      toast.success("Transcript copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy transcript");
    }
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([transcript], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "transcript.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success("Transcript downloaded!");
  };

  return (
    <div className="mt-8 w-full max-w-3xl mx-auto rounded-lg shadow-xl p-6">
      <h2 className="text-2xl font-semibold mb-4 text-left text-white">
        Transcription Result:
      </h2>
      <div className="bg-gray-900 rounded-lg p-4 mb-4">
        <p className="whitespace-pre-wrap text-gray-300 leading-relaxed">
          {transcript}
        </p>
      </div>
      <div className="flex justify-end space-x-4">
        <button
          onClick={handleCopy}
          className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg shadow-md hover:from-blue-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition-colors"
        >
          {copied ? (
            <Check className="w-5 h-5 mr-2" />
          ) : (
            <Copy className="w-5 h-5 mr-2" />
          )}
          {copied ? "Copied" : "Copy"}
        </button>
        <button
          onClick={handleDownload}
          className="flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-teal-500 text-white font-semibold rounded-lg shadow-md hover:from-green-600 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75 transition-colors"
        >
          <Download className="w-5 h-5 mr-2" />
          Download
        </button>
      </div>
    </div>
  );
}
