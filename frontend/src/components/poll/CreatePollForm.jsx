import React, { useState } from "react";

export default function CreatePollForm({ onCreate }) {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState([
    { text: "", isCorrect: false },
    { text: "", isCorrect: false }
  ]);
  const [timeLimit, setTimeLimit] = useState(60);

  const updateOption = (idx, value) => {
    const copy = [...options];
    copy[idx].text = value;
    setOptions(copy);
  };

  const toggleCorrect = (idx) => {
    const copy = [...options];
    copy[idx].isCorrect = !copy[idx].isCorrect;
    setOptions(copy);
  };

  const addOption = () => setOptions((o) => [...o, { text: "", isCorrect: false }]);

  const removeOption = (idx) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== idx));
    }
  };

  const handleSubmit = () => {
    if (!question.trim() || options.some((o) => !o.text.trim())) {
      alert("Please fill in all fields");
      return;
    }
    if (!options.some((o) => o.isCorrect)) {
      alert("Please mark at least one correct answer");
      return;
    }

    // ✅ Ensure only text & isCorrect are sent — no accidental object structures
    const formattedOptions = options.map((o) => ({
      text: String(o.text),
      isCorrect: Boolean(o.isCorrect)
    }));

    onCreate({ question: String(question), options: formattedOptions, timeLimit: Number(timeLimit) });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-3 sm:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xl sm:text-2xl font-bold">I</span>
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Intervue Poll</h1>
                <p className="text-xs sm:text-sm text-gray-500">
                  Create engaging polls for your students
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-indigo-50 px-3 sm:px-4 py-2 rounded-xl border border-indigo-100 w-full sm:w-auto">
              <svg className="w-4 h-4 text-indigo-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <select
                className="bg-transparent text-indigo-700 font-semibold outline-none cursor-pointer flex-1 sm:flex-none"
                value={timeLimit}
                onChange={(e) => setTimeLimit(e.target.value)}
              >
                {[15, 30, 45, 60, 90, 120].map((t) => (
                  <option key={t} value={t}>{t}s</option>
                ))}
              </select>
            </div>
          </div>

          {/* Question Input */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Poll Question
            </label>
            <textarea
              rows={4}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl p-3 sm:p-4 text-base sm:text-lg focus:border-indigo-500 focus:bg-white transition-all outline-none resize-none"
              placeholder="Enter your question here..."
            />
            <p className="text-xs text-gray-500">
              Make your question clear and concise
            </p>
          </div>
        </div>

        {/* Options */}
        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-6">
            <h2 className="text-base sm:text-lg font-bold text-gray-900">Answer Options</h2>
            <span className="text-xs sm:text-sm text-gray-500">Mark correct answer(s)</span>
          </div>

          <div className="space-y-3">
            {options.map((opt, i) => (
              <div
                key={`option-${i}`}
                className={`group relative bg-gray-50 rounded-xl p-3 sm:p-4 border-2 transition-all ${
                  opt.isCorrect
                    ? "border-green-400 bg-green-50"
                    : "border-gray-200 hover:border-indigo-300"
                }`}
              >
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 text-white flex items-center justify-center text-xs sm:text-sm font-bold flex-shrink-0">
                      {String.fromCharCode(65 + i)}
                    </div>
                    <input
                      value={opt.text}
                      onChange={(e) => updateOption(i, e.target.value)}
                      className="flex-1 bg-transparent outline-none text-gray-900 font-medium placeholder-gray-400 text-sm sm:text-base min-w-0"
                      placeholder={`Option ${i + 1}`}
                    />
                  </div>

                  <div className="flex items-center gap-2 justify-end sm:justify-start">
                    <button
                      onClick={() => toggleCorrect(i)}
                      className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-lg font-semibold text-xs sm:text-sm transition-all flex-shrink-0 ${
                        opt.isCorrect
                          ? "bg-green-500 text-white"
                          : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                      }`}
                    >
                      {opt.isCorrect ? (
                        <>
                          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="hidden xs:inline">Correct</span>
                          <span className="xs:hidden">✓</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="hidden xs:inline">Mark</span>
                          <span className="xs:hidden">○</span>
                        </>
                      )}
                    </button>

                    {options.length > 2 && (
                      <button
                        onClick={() => removeOption(i)}
                        className="sm:opacity-0 sm:group-hover:opacity-100 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all flex-shrink-0"
                        title="Remove option"
                      >
                        <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {options.length < 6 && (
            <button
              onClick={addOption}
              className="mt-4 w-full border-2 border-dashed border-gray-300 rounded-xl p-3 sm:p-4 text-gray-600 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all flex items-center justify-center gap-2 font-semibold text-sm sm:text-base"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Another Option
            </button>
          )}

          <button
            onClick={handleSubmit}
            className="mt-6 w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-3 sm:py-4 rounded-xl hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all text-sm sm:text-base"
          >
            Create Poll & Ask Question
          </button>
        </div>

        <div className="mt-4 sm:mt-6 bg-blue-50 border border-blue-200 rounded-xl p-3 sm:p-4">
          <p className="text-xs sm:text-sm text-blue-800">
            <strong>💡 Tip:</strong> You can mark multiple correct answers for complex questions.
            Students will see the correct answers after submitting their responses.
          </p>
        </div>
      </div>
    </div>
  );
}
