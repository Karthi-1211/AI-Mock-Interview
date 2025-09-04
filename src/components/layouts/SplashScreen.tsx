import React from "react";
import Logo from "@/components/common/Logo";

const SplashScreen: React.FC = () => {
  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">
      {/* Animated blobs */}
      <div className="absolute -top-24 -left-24 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute -bottom-16 -right-16 w-96 h-96 bg-black/10 rounded-full blur-3xl animate-[pulse_2.5s_ease-in-out_infinite]" />

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center text-white px-6">
        <div className="flex items-center gap-3 mb-6 animate-[fadeIn_0.8s_ease-out_forwards] opacity-0">
          <Logo className="h-10 w-10" />
          <span className="text-2xl font-semibold tracking-wide">AI Mock Interview</span>
        </div>

        <h1 className="text-3xl md:text-5xl font-bold text-center leading-tight animate-[fadeInUp_0.9s_ease-out_0.1s_forwards] opacity-0">
          Preparing your interview experience
        </h1>
        <p className="mt-3 text-white/90 text-center max-w-xl animate-[fadeInUp_0.9s_ease-out_0.25s_forwards] opacity-0">
          Calibrating AI models, loading templates, and warming up analytics
        </p>

        {/* Loader ring */}
        <div className="mt-10 relative w-24 h-24 animate-[fadeIn_0.9s_ease-out_0.3s_forwards] opacity-0">
          <div className="absolute inset-0 rounded-full border-4 border-white/20" />
          <div className="absolute inset-2 rounded-full border-t-4 border-white animate-spin" />
          <div className="absolute inset-0 rounded-full animate-[ping_2s_linear_infinite] bg-white/5" />
        </div>

        {/* Progress bar */}
        <div className="mt-10 w-64 h-2 bg-white/20 rounded-full overflow-hidden animate-[fadeIn_0.8s_ease-out_0.35s_forwards] opacity-0">
          <div className="h-full bg-white animate-[progress_2s_ease-in-out_infinite]" />
        </div>

        <style>{`
          @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
          @keyframes fadeInUp { from { opacity: 0; transform: translateY(8px) } to { opacity: 1; transform: translateY(0) } }
          @keyframes progress { 0% { width: 0% } 50% { width: 80% } 100% { width: 0% } }
        `}</style>
      </div>
    </div>
  );
};

export default SplashScreen;


