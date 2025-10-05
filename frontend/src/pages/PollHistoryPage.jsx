import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom"; // <-- FIX: Import useParams
import { fetchPollHistory } from "../services/api.js";
import HistoryPollCard from "../components/poll/HistoryPollCard.jsx";

export default function PollHistoryPage() {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // <-- FIX: Get the sessionId from the URL using the useParams hook -->
  const { sessionId } = useParams();

  useEffect(() => {
    // <-- FIX: Check if sessionId exists before trying to fetch -->
    if (!sessionId) {
      setError("No session ID found in URL.");
      setIsLoading(false);
      return;
    }

    const loadHistory = async () => {
      try {
        setIsLoading(true);
        setError(null);
        // <-- FIX: Pass the sessionId to your API function -->
        const data = await fetchPollHistory(sessionId);
        
        console.log(`API response for session ${sessionId}:`, data);

        if (Array.isArray(data)) {
          setHistory(data);
        } else {
          setHistory([]);
          console.error("API did not return an array for poll history:", data);
          setError("Failed to load poll history due to unexpected data format.");
        }
      } catch (err) {
        console.error("Failed to fetch poll history:", err);
        setError("Could not retrieve the poll history. Please check the session ID and try again.");
      } finally {
        setIsLoading(false);
      }
    };

    loadHistory();
  }, [sessionId]); // <-- FIX: Add sessionId to dependency array

  // Render logic to show the error message
  const renderContent = () => {
    if (isLoading) {
      return <p className="text-center text-gray-500">Loading history...</p>;
    }
    if (error) {
      return <p className="text-center text-red-500">{error}</p>;
    }
    if (history.length === 0) {
      return (
        <p className="text-center text-gray-500">
          No poll history found for this session.
        </p>
      );
    }
    return (
      <div className="space-y-8">
        {history.map((poll, index) => (
          <HistoryPollCard key={poll.id || index} poll={poll} index={index} />
        ))}
      </div>
    );
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4">
      <div className="flex flex-wrap items-center mb-8 gap-3">
        <div className="inline-flex items-center bg-gray-100 rounded-full px-3 py-1">
          <img src="/logo.png" alt="Intervue Poll" className="h-6 w-auto" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800">View Poll History</h1>
        <Link to="/teacher" className="ml-auto text-indigo-600 hover:underline">
          Back
        </Link>
      </div>
      {renderContent()}
    </div>
  );
}