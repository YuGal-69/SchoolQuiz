import React, { useMemo } from 'react';

// This component displays the results of a single poll from the history.
export default function HistoryPollCard({ poll, index }) {
    
    // Check for a valid poll object and options array at the top
    if (!poll || !poll.question || !Array.isArray(poll.options)) {
        // Don't render anything if the poll data is incomplete.
        // You could also render a small error message here.
        console.error("HistoryPollCard received invalid poll data:", poll);
        return null;
    }

    const totalVotes = useMemo(() => {
        // We already know poll.options is an array from the check above
        return poll.options.reduce((sum, opt) => sum + (opt.votes || 0), 0);
    }, [poll]);

    const getPercentage = (votes) => {
        if (totalVotes === 0) return 0;
        return Math.round(((votes || 0) / totalVotes) * 100);
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-lg w-full">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Question {index + 1}</h3>
            <div className="bg-gray-700 text-white p-4 rounded-t-lg font-semibold">
                {poll.question}
            </div>
            <div className="p-4 space-y-3">
                {poll.options.map(option => {
                    const percentage = getPercentage(option.votes);
                    return (
                        <div key={option.id} className="relative w-full p-4 rounded-lg border-2 border-gray-200 flex items-center gap-4 overflow-hidden">
                            <div 
                                className="absolute top-0 left-0 h-full bg-indigo-200"
                                style={{ width: `${percentage}%` }}
                            ></div>
                            <div className="relative flex-shrink-0 bg-indigo-600 text-white font-bold w-8 h-8 rounded-full flex items-center justify-center z-10">{option.id + 1}</div>
                            <span className="relative font-semibold z-10">{option.text}</span>
                            <span className="relative ml-auto font-bold text-gray-700 z-10">{percentage}%</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};