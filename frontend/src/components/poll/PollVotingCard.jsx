import React from "react";

export default function PollVotingCard({
    poll,
    selectedOption,
    setSelectedOption,
    onSubmit,
    disabled = false
}) {
    if (!poll) 
        return null;
    


    return (<div className="bg-white rounded-xl shadow-md p-1.5">
        <div className="bg-gray-700 text-white font-semibold p-4 rounded-t-lg"> {
            poll.question
        } </div>
        <div className="p-4 space-y-3"> {
            poll.options.map((option, index) => (<button key={
                    option.id
                }
                type="button"
                disabled={disabled}
                onClick={
                    () => !disabled && setSelectedOption(option.id)
                }
                className={
                    `w-full text-left flex items-center border rounded-lg p-3 transition-all ${
                        selectedOption === option.id ? "border-indigo-600 bg-indigo-50 border-2 ring-2 ring-indigo-200" : "border-gray-200 bg-white" // <-- FIXED: Changed bg-gray-50 to bg-white
                    } ${
                        disabled ? "bg-gray-100 cursor-not-allowed" : "hover:border-indigo-400"
                    }`
            }>
                <span className="bg-indigo-600 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center mr-3"> {
                    index + 1
                } </span>
                <span className="font-semibold text-gray-800"> {
                    typeof option.text === 'object' ? (option.text ?. text || JSON.stringify(option.text)) : option.text
                }</span>
            </button>))
        } </div>

        {
        !disabled && (<div className="p-4 pt-0">
            <button onClick={onSubmit}
                disabled={
                    selectedOption == null
                }
                className="w-full bg-indigo-600 text-white font-bold py-3 px-8 rounded-lg shadow-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                Submit
            </button>
        </div>)
    } </div>);
}
