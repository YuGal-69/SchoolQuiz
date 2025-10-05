import React, { useEffect, useState } from "react";
import { ClockIcon } from "../common/icons.jsx";
import { useStore } from "../../store/useStore.js";

export default function PollHeader({ title = "Question" }) {
  const { poll } = useStore();
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    const tick = () => {
      if (!poll?.isActive || !poll?.startedAt || !poll?.timeLimit) {
        setRemaining(0);
        return;
      }
      const endAt = poll.startedAt + poll.timeLimit * 1000;
      const ms = Math.max(0, endAt - Date.now());
      setRemaining(Math.ceil(ms / 1000));
    };
    tick();
    const id = setInterval(tick, 250);
    return () => clearInterval(id);
  }, [poll?.isActive, poll?.startedAt, poll?.timeLimit]);

  return (
    <div className="flex items-center justify-between mb-4">
      <div className="text-2xl font-bold text-gray-800 flex items-center gap-2">
        <span>
          {title} {poll?.id ? 1 : ""}
        </span>
      </div>
      <div className="flex items-center gap-2 text-red-600 font-semibold">
        <ClockIcon />
        <span>
          {remaining ? `00:${String(remaining).padStart(2, "0")}` : ""}
        </span>
      </div>
    </div>
  );
}
