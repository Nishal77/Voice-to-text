import { TranscriptionForm } from "@/components/TranscriptionForm";
import { TranscriptionResult } from "@/components/TranscriptionResult";
import { Toaster } from "react-hot-toast";

export default function Home() {
  return (
    <main className="relative min-h-screen flex items-center justify-center bg-black text-white py-12 px-4 sm:px-6 lg:px-8">
      <Toaster position="top-center" />
      <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f5e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f5e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <div className="text-center mb-12">
          <button className="relative inline-flex h-10 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-gray-50 mb-4">
            <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
            <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-gray-950 px-8 py-1 text-sm font-medium text-gray-50 backdrop-blur-3xl">
              Get Started 👋
            </span>
          </button>
          <h1 className="text-6xl font-bold mb-4 bg-white text-transparent bg-clip-text">
            Transform Your Voice into Words Instantly!
          </h1>
          <p className="text-lg text-gray-400 mb-8 sm:text-base">
            Upload your audio and get an instant transcript in 65+ languages
            effortlessly..
          </p>
        </div>

        <div className=" backdrop-blur-sm rounded-lg shadow-xl p-6 mb-8">
          <TranscriptionForm />
        </div>

        <TranscriptionResult />
      </div>
    </main>
  );
}
