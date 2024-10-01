"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const MAX_FILE_SIZE_MB = 15;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export async function transcribeAudio(formData: FormData) {
  const file = formData.get("audio") as File;
  if (!file) {
    throw new Error("No file uploaded");
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new Error(`File size exceeds the limit of ${MAX_FILE_SIZE_MB}MB`);
  }

  const arrayBuffer = await file.arrayBuffer();
  const base64Audio = Buffer.from(arrayBuffer).toString("base64");

  // Update the model to gemini-1.5-flash
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const result = await model.generateContent([
    "Transcribe the following audio file:",
    {
      inlineData: {
        mimeType: file.type,
        data: base64Audio,
      },
    },
  ]);

  const response = await result.response;
  const transcript = response.text();

  return transcript;
}