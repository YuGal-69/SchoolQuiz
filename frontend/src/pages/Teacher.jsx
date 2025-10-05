import React from "react";
import { Link } from "react-router-dom";
import { useStore } from "../store/useStore.js";
import { socket } from "../socket.js";
import PollResultsCard from "../components/poll/PollResultsCard.jsx";
import CreatePollForm from "../components/poll/CreatePollForm.jsx";
import PollHeader from "../components/poll/PollHeader.jsx";

// --- Helper Component for the "Waiting to Start" state ---
const StartPollScreen = ({ poll, onStart }) => (
  <div className="text-center w-full max-w-2xl mx-auto">
    <h2 className="text-2xl font-bold mb-4">Poll Created!</h2>
    <p className="text-gray-600 mb-6">
      Ready to start the poll for your students?
    </p>

    <div className="bg-white p-6 rounded-lg shadow-md mb-6 text-left">
      <h3 className="text-xl font-semibold">{poll.question}</h3>
      <ul className="mt-4 space-y-2">
        {poll.options.map((opt, index) => (
          <li key={index} className="text-gray-700">
            {index + 1}.{" "}
            {typeof opt.text === "object"
              ? opt.text?.text || JSON.stringify(opt.text)
              : opt.text}
          </li>
        ))}
      </ul>
    </div>

    <button
      onClick={onStart}
      className="bg-green-500 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-green-600 transform hover:-translate-y-1 transition-all"
    >
      Start Poll
    </button>
  </div>
);

// --- Main Teacher Page Component ---
export default function TeacherPage() {
  const { poll, setPoll, sessionId } = useStore();

  // --- Event Handlers ---
  const handleCreatePoll = ({ question, options, timeLimit }) => {
    // Ensure clean data structure before emitting
    const cleanedOptions = options.map((opt) => ({
      text:
        typeof opt.text === "object"
          ? opt.text.text || JSON.stringify(opt.text)
          : opt.text,
      isCorrect: opt.isCorrect || false,
    }));

    socket.emit("teacher:createPoll", { question, options: cleanedOptions, timeLimit });
  };

  const handleStartPoll = () => {
    if (poll) socket.emit("teacher:startPoll", { pollId: poll.id });
  };

  const handleAskNewQuestion = () => {
    setPoll(null);
  };

  // --- View Logic ---
  const renderContent = () => {
    if (poll?.isFinished) {
      return (
        <div>
          <PollHeader poll={poll} />
          <PollResultsCard poll={poll} />
          <div className="text-center mt-8">
            <button
              onClick={handleAskNewQuestion}
              className="bg-indigo-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-indigo-700 transform hover:-translate-y-1 transition-all"
            >
              + Ask a New Question
            </button>
          </div>
        </div>
      );
    }

    if (poll?.isActive) {
      return (
        <div>
          <PollHeader poll={poll} />
          <PollResultsCard poll={poll} />
          <p className="text-center mt-6 text-gray-500 animate-pulse">
            Poll is currently active...
          </p>
        </div>
      );
    }

    if (poll) {
      return <StartPollScreen poll={poll} onStart={handleStartPoll} />;
    }

    return <CreatePollForm onCreate={handleCreatePoll} />;
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="w-full flex justify-end mb-4">
        <Link
          to={sessionId ? `/history/${sessionId}` : "#"}
          className={`font-semibold py-2 px-4 rounded-lg transition-colors inline-flex items-center ${
            !sessionId
              ? "bg-gray-400 text-gray-700 cursor-not-allowed"
              : "bg-gray-700 text-white hover:bg-gray-800"
          }`}
          onClick={(e) => !sessionId && e.preventDefault()}
        >
          View Poll History
        </Link>
      </div>
      {renderContent()}
    </div>
  );
}
