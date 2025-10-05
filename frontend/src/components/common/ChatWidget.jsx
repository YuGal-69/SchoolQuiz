import React, { useMemo, useRef, useEffect, useState } from "react";
import { useStore } from "../../store/useStore.js";
import { socket } from "../../socket.js";
import { ChatIcon, CloseIcon } from "./icons.jsx";

export default function ChatWidget() {
  const {
    isChatOpen,
    toggleChat,
    messages,
    addMessage,
    participants,
    userType,
    userName,
  } = useStore();

  const [text, setText] = useState("");
  const listRef = useRef(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, isChatOpen]);

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    socket.emit("chat:sendMessage", trimmed);
    setText("");
  };

  const [activeTab, setActiveTab] = useState("chat"); // chat | participants

  const participantsSorted = useMemo(
    () => [...participants].sort((a, b) => a.name.localeCompare(b.name)),
    [participants]
  );

  return (
    <>
      {/* Floating button */}
      {!isChatOpen && (
        <button
          aria-label="Open chat"
          onClick={toggleChat}
          className="fixed bottom-6 right-6 bg-indigo-600 text-white rounded-full w-14 h-14 shadow-lg flex items-center justify-center"
        >
          <ChatIcon />
        </button>
      )}

      {/* Panel */}
      {isChatOpen && (
        <div className="fixed bottom-6 right-6 w-[360px] bg-white rounded-xl shadow-2xl z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <div className="flex gap-6 text-sm">
              <button
                className={`font-semibold ${
                  activeTab === "chat" ? "text-indigo-600" : "text-gray-600"
                }`}
                onClick={() => setActiveTab("chat")}
              >
                Chat
              </button>
              <button
                className={`font-semibold ${
                  activeTab === "participants"
                    ? "text-indigo-600"
                    : "text-gray-600"
                }`}
                onClick={() => setActiveTab("participants")}
              >
                Participants
              </button>
            </div>
            <button
              aria-label="Close"
              onClick={toggleChat}
              className="text-gray-500"
            >
              <CloseIcon />
            </button>
          </div>

          {activeTab === "chat" ? (
            <div className="flex flex-col h-80">
              <div
                ref={listRef}
                className="flex-1 overflow-y-auto p-4 space-y-3"
              >
                {messages.map((m) => {
                  const mine = m?.sender?.name === userName;
                  return (
                    <div
                      key={m.id}
                      className={`flex ${
                        mine ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[80%] px-3 py-2 rounded-lg text-sm shadow ${
                          mine
                            ? "bg-indigo-600 text-white"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {!mine && (
                          <div className="text-[11px] font-semibold opacity-80 mb-1">
                            {m?.sender?.name || "User"}
                          </div>
                        )}
                        <div>{m.text}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="p-3 border-t flex gap-2">
                <input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Type a message"
                  className="flex-1 border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  onClick={handleSend}
                  className="bg-indigo-600 text-white text-sm font-semibold px-4 py-2 rounded-md"
                >
                  Send
                </button>
              </div>
            </div>
          ) : (
            <div className="h-80 overflow-y-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500">
                    <th className="px-4 py-2">Name</th>
                    <th className="px-4 py-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {participantsSorted.map((p) => (
                    <tr key={p.id} className="border-t">
                      <td className="px-4 py-2">{p.name}</td>
                      <td className="px-4 py-2 text-right">
                        {userType === "teacher" ? (
                          <button
                            className="text-indigo-600 hover:underline"
                            onClick={() =>
                              socket.emit("teacher:kickParticipant", p.id)
                            }
                          >
                            Kick out
                          </button>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </>
  );
}
