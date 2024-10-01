"use client";

import { useState, useEffect } from "react";
import { transcribeAudio } from "@/app/action";
import { useTranscriptionStore } from "@/store/TranscriptionStore";
import toast from "react-hot-toast";

const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB in bytes

// Define the SpeechRecognition, SpeechRecognitionEvent, and SpeechRecognitionErrorEvent types
type SpeechRecognition = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onstart: () => void;
  onend: () => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
};

type SpeechRecognitionEvent = {
  results: {
    [key: number]: {
      [key: number]: {
        transcript: string;
      };
    };
  };
};

type SpeechRecognitionErrorEvent = {
  error: string;
};

export function TranscriptionForm() {
  const { setTranscript } = useTranscriptionStore();
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(
    null
  );
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    if ("webkitSpeechRecognition" in window) {
      const speechRecognition = new (
        window as typeof window & {
          webkitSpeechRecognition: new () => SpeechRecognition;
        }
      ).webkitSpeechRecognition();
      speechRecognition.continuous = false;
      speechRecognition.interimResults = false;
      speechRecognition.lang = "en-US";

      speechRecognition.onstart = () => {
        setIsRecording(true);
      };

      speechRecognition.onend = () => {
        setIsRecording(false);
      };

      speechRecognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript;
        setTranscript(transcript);
        toast.success("Voice transcribed successfully!", {
          duration: 3000,
          position: "top-center",
        });
      };

      speechRecognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error("Speech recognition error:", event.error);
        toast.error("Error transcribing voice. Please try again.", {
          duration: 4000,
          position: "top-center",
        });
      };

      setRecognition(speechRecognition);
    } else {
      toast.error("Speech recognition not supported in this browser.", {
        duration: 4000,
        position: "top-center",
      });
    }
  }, [setTranscript]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > MAX_FILE_SIZE) {
        toast.error(
          "File size exceeds 15MB limit. Please choose a smaller file.",
          {
            duration: 4000,
            position: "top-center",
          }
        );
        e.target.value = ""; // Reset the input
      } else {
        setFile(selectedFile);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) return;

    setIsLoading(true);
    const formData = new FormData();
    formData.append("audio", file);

    try {
      const transcript = await transcribeAudio(formData);
      setTranscript(transcript);
      toast.success("Audio transcribed successfully!", {
        duration: 3000,
        position: "top-center",
      });
    } catch (error) {
      console.error("Error transcribing audio:", error);
      toast.error("Error transcribing audio. Please try again.", {
        duration: 4000,
        position: "top-center",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceClick = () => {
    if (recognition) {
      recognition.start();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 w-full max-w-2xl mx-auto p-8 bg-white rounded-lg shadow-lg"
    >
      <div className="flex items-center justify-center w-full">
        <label
          htmlFor="audio-file"
          className="flex flex-col items-center justify-center w-full h-40 border-2 border-green-300 border-dashed rounded-lg cursor-pointer bg-green-50 hover:bg-green-100 transition-colors"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg
              className="w-10 h-10 mb-4 text-green-500"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 16"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
              />
            </svg>
            <p className="mb-2 text-sm text-green-500">
              <span className="font-semibold">Click to upload</span> or drag and
              drop
            </p>
            <p className="text-xs text-green-500">
              MP3, WAV, or M4A (MAX. 15MB)
            </p>
          </div>
          <input
            id="audio-file"
            type="file"
            accept="audio/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
      </div>
      {file && (
        <p className="text-sm text-gray-700 text-center">
          Selected file: {file.name} ({(file.size / (1024 * 1024)).toFixed(2)}{" "}
          MB)
        </p>
      )}
      <div className="flex justify-center space-x-4">
        <button
          type="submit"
          disabled={!file || isLoading}
          className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline-block"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Converting...
            </>
          ) : (
            "Convert Audio"
          )}
        </button>
        <button
          type="button"
          onClick={handleVoiceClick}
          className="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-semibold rounded-lg shadow-md hover:from-purple-600 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-75 transition-colors"
        >
          {isRecording ? "Recording..." : "Voice Chat"}
        </button>
      </div>
    </form>
  );
}
