import React, { useState } from "react";
import { useStore } from "../store/useStore.js";
import { socket } from "../socket.js";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const [role, setRole] = useState("student");
  const { setUser } = useStore();
  const navigate = useNavigate();

  const handleContinue = () => {
    if (role === "student") {
      // Go to dedicated student join page for name entry
      navigate("/join");
      return;
    }
    // Teacher joins immediately
    const username = "Teacher";
    setUser(username, "teacher");
    socket.connect();
    socket.emit("user:join", username);
    navigate("/teacher");
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* 1. Logo Chip */}
        <div className="inline-flex items-center bg-gray-100 rounded-full px-3 py-1 mb-6">
          <img src="/logo.png" alt="Intervue Poll" />
        </div>

      <h1 className="text-5xl font-bold text-gray-900 text-center mb-3">
        Welcome to the <span className="text-black">Live Polling System</span>
      </h1>
      <p className="text-gray-600 text-center mb-10">
        Please select the role that best describes you to begin using the live
        polling system
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
        <button
          onClick={() => setRole("student")}
          className={`text-left p-6 rounded-xl border-2 transition ${
            role === "student" ? "border-indigo-600" : "border-gray-200"
          }`}
        >
          <div className="text-xl font-semibold mb-2">I'm a Student</div>
          <div className="text-gray-500 text-sm">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry
          </div>
        </button>
        <button
          onClick={() => setRole("teacher")}
          className={`text-left p-6 rounded-xl border-2 transition ${
            role === "teacher" ? "border-indigo-600" : "border-gray-200"
          }`}
        >
          <div className="text-xl font-semibold mb-2">I'm a Teacher</div>
          <div className="text-gray-500 text-sm">
            Submit answers and view live poll results in real-time.
          </div>
        </button>
      </div>

      {/* Student name is captured on /join per Figma */}

      <div className="flex justify-center">
        <button
          onClick={handleContinue}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold px-10 py-3 rounded-full disabled:opacity-50"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
