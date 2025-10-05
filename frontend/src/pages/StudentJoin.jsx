import React, { useState } from "react";
import { useStore } from "../store/useStore.js";
import { socket } from "../socket.js";


export default function StudentJoin() {
  const [name, setName] = useState("");
  const { setUser } = useStore();

  const handleContinue = () => {
    if (!name.trim()) return;
    setUser(name, "student");
    socket.connect();
    socket.emit("user:join", name);
  };

  return (
    <div className="w-full max-w-2xl mx-auto text-center">
      {/* 1. Logo Chip */}
        <div className="inline-flex items-center bg-gray-100 rounded-full px-3 py-1 mb-6">
          <img src="/logo.png" alt="Intervue Poll" />
        </div>
      <h1 className="text-5xl font-bold text-gray-900 mb-2">
        Let's Get Started
      </h1>
      <p className="text-gray-600 mb-10">
        If you’re a student, you’ll be able to submit your answers, participate
        in live polls, and see how your responses compare with your classmates
      </p>
      <div className="max-w-xl mx-auto mb-8 text-left">
        <label className="block font-semibold text-gray-700 mb-2">
          Enter your Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Rahul Bajaj"
          className="w-full px-4 py-3 bg-gray-100 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
      <button
        onClick={handleContinue}
        disabled={!name}
        className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold px-10 py-3 rounded-full disabled:opacity-50"
      >
        Continue
      </button>
    </div>
  );
}
