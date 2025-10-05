import React from 'react';

export default function PollResultsCard({
    poll,
    votedForOptionId,
    showFooter = false
}) {
    if (!poll) return null;

    const totalVotes = poll.options.reduce((sum, option) => sum + (option.votes || 0), 0);

    return (
        <div className="bg-white rounded-xl shadow-md p-1.5">
            <div className="bg-gray-700 text-white font-semibold p-4 rounded-t-lg">
                {poll.question}
            </div>
            <div className="p-4 space-y-3">
                {poll.options.map((option, index) => {
                    const percentage =
                        totalVotes > 0
                            ? Math.round(((option.votes || 0) / totalVotes) * 100)
                            : 0;
                    const isVotedOption =
                        votedForOptionId && option.id === votedForOptionId;

                    // Adjust text color based on background for readability
                    const mainTextColor =
                        percentage > 40 ? 'text-white' : 'text-gray-800';
                    const percentTextColor =
                        percentage > 10 ? 'text-white' : 'text-gray-800';

                    return (
                        <div
                            key={option.id}
                            className={`relative flex items-center justify-between border rounded-lg p-3 overflow-hidden ${
                                isVotedOption ? 'border-indigo-600 border-2' : 'border-gray-200'
                            }`}
                        >
                            {/* Background fill bar */}
                            <div
                                className="absolute top-0 left-0 h-full bg-indigo-600 z-0"
                                style={{ width: `${percentage}%` }}
                            />

                            {/* Foreground content */}
                            <div className="relative z-10 flex items-center">
                                <span className="bg-indigo-600 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center mr-3">
                                    {index + 1}
                                </span>
                                <span
                                    className={`font-semibold transition-colors duration-300 ${mainTextColor}`}
                                >
                                    {typeof option.text === 'object'
                                        ? option.text?.text || JSON.stringify(option.text)
                                        : option.text}
                                </span>
                            </div>

                            <span
                                className={`relative z-10 font-bold transition-colors duration-300 ${percentTextColor}`}
                            >
                                {percentage}%
                            </span>
                        </div>
                    );
                })}
            </div>

            {showFooter && (
                <p className="text-center py-4 text-gray-700 font-semibold">
                    Wait for the teacher to ask a new question..
                </p>
            )}
        </div>
    );
}
