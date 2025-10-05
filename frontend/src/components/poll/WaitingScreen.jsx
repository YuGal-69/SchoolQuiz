import React from "react";

export default function WaitingScreen({
  text = "Wait for the teacher to ask questions..",
}) {
  return (
    // Wrapper for full-screen vertical and horizontal centering
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4">
      <div className="text-center">

        {/* 1. Logo Chip - Styled to match the design */}
        <div className="inline-flex items-center bg-indigo-600 text-white text-sm font-medium px-4 py-1.5 rounded-full mb-8">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Intervue Poll
        </div>

        {/* 2. Spinner - Styled to match */}
        <div className="flex items-center justify-center my-8">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        </div>

        {/* 3. Status Text */}
        <p className="text-xl font-semibold text-gray-800">{text}</p>
        
      </div>
    </div>
  );
}