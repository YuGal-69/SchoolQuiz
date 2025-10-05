import React, { useState, useEffect } from "react";
import { useStore } from "../store/useStore.js";
import { socket } from "../socket.js";
import PollHeader from "../components/poll/PollHeader.jsx";
import PollVotingCard from "../components/poll/PollVotingCard.jsx";
import PollResultsCard from "../components/poll/PollResultsCard.jsx";
import WaitingScreen from "../components/poll/WaitingScreen.jsx";

export default function StudentPage() {
  const { poll } = useStore();
  const [votedForOptionId, setVotedForOptionId] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);

  // Reset local state when a new poll question (new ID) appears
  useEffect(() => {
    if (poll?.id) {
      setHasVoted(false);
      setVotedForOptionId(null);
    }
  }, [poll?.id]);

  const handleVote = (optionId) => {
    if (optionId != null && !hasVoted) {
      const voteData = { pollId: poll.id, optionId };
      socket.emit("student:vote", voteData);
      setVotedForOptionId(optionId);
      setHasVoted(true);
    }
  };

  const renderContent = () => {
    // FIX #1: Add a guard clause to prevent rendering with no poll data
    if (!poll) {
      return <WaitingScreen text="Connecting to the poll session..." />;
    }

    // State 1: Poll is finished, show the results card
    if (poll.isFinished) {
      // FIX #2: Pass showFooter prop to display the correct message
      return <PollResultsCard poll={poll} votedForOptionId={votedForOptionId} showFooter={true} />;
    }

    // State 2: Poll is currently active
    if (poll.isActive) {
      // State 2.1: Student has voted, show their selection and a waiting message
      if (hasVoted) {
        return (
          <>
            <PollVotingCard
              poll={poll}
              selectedOption={votedForOptionId}
              disabled={true} // Pass a prop to disable further voting
            />
            <p className="text-center mt-8 text-gray-700 font-semibold">
              Wait for the teacher to ask a new question..
            </p>
          </>
        );
      }
      // State 2.2: Student has not voted yet, show the voting options
      return (
        <PollVotingCard
          poll={poll}
          selectedOption={votedForOptionId}
          setSelectedOption={setVotedForOptionId}
          // FIX #3: Pass an inline function to correctly handle the vote
          onSubmit={() => handleVote(votedForOptionId)}
        />
      );
    }

    // Default State: No active or finished poll, show the main waiting screen
    return <WaitingScreen text="Wait for the teacher to ask a new question.." />;
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Header is only shown if there is an active or finished poll */}
      {poll && <PollHeader poll={poll} />}
      <div className="mt-4">{renderContent()}</div>
    </div>
  );
}