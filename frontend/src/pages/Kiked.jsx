import React from "react";

export default function KickedPage() {
  return (
    // Main wrapper to center the content on the entire screen
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <div className="text-center max-w-md">
        {/* 1. Logo Chip */}
        <div className="inline-flex items-center bg-gray-100 rounded-full px-3 py-1 mb-6">
          <img src="/logo.png" alt="Intervue Poll" />
        </div>

        {/* 2. Main Heading */}
        <h1 className="text-4xl font-bold text-gray-900 mb-3">
          You've been Kicked out !
        </h1>

        {/* 3. Subheading */}
        <p className="text-gray-500">
          Looks like the teacher had removed you from the poll system. Please
          <br />
          Try again sometime.
        </p>
      </div>
    </div>
  );
}
