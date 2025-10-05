import { useEffect } from "react";
import { socket } from "../socket.js";
import { useStore } from "../store/useStore.js";

// This custom hook centralizes all socket event listeners for the application.
export default function useSocketManager() {
  useEffect(() => {
    // --- Central Event Listeners ---

    const onInitialState = ({ poll, participants }) => {
      if (participants) useStore.getState().setParticipants(participants);
      if (poll) {
        useStore.getState().setPoll(poll);
        // <-- FIX: Changed from poll.sessionId to poll.id -->
        if (poll.id) {
          useStore.getState().setSessionId(poll.id);
        }
      }
    };

    const onStateUpdated = ({ poll }) => {
      if (poll) {
        useStore.getState().setPoll(poll);
        // <-- FIX: Changed from poll.sessionId to poll.id -->
        if (poll.id) {
          useStore.getState().setSessionId(poll.id);
        }
      }
    };
    
    const onPollCreated = (poll) => {
      // For debugging, you can keep this or remove it.
      console.log("Received 'poll:created' event. The poll object is:", poll);

      useStore.getState().setPoll(poll);
      // <-- FIX: Changed from poll.sessionId to poll.id -->
      if (poll && poll.id) {
        useStore.getState().setSessionId(poll.id);
        // This will now work correctly!
        console.log(`Session ID set to: ${poll.id}`);
      }
    };

    const onPollStarted = (poll) => {
      useStore.getState().setPoll(poll);
      const { setPollDeadline } = useStore.getState();
      if (typeof setPollDeadline === "function" && poll?.timeLimit) {
        setPollDeadline(Date.now() + poll.timeLimit * 1000);
      }
    };
    
    const onPollUpdated = (poll) => {
      useStore.getState().setPoll(poll);
    };

    const onPollEnded = (poll) => {
      useStore.getState().setPoll(poll);
      const { setPollDeadline } = useStore.getState();
      if (typeof setPollDeadline === "function") {
        setPollDeadline(null);
      }
    };
    
    const onParticipantsUpdated = (participants) => {
      useStore.getState().setParticipants(participants);
    };

    const onChatMessage = (message) => {
      useStore.getState().addMessage(message);
    };

    const onSystemKicked = () => {
      useStore.getState().setKicked(true);
      socket.disconnect();
    };

    // --- Register all listeners ---
    socket.on("state:initial", onInitialState);
    socket.on("state:updated", onStateUpdated);
    socket.on("poll:created", onPollCreated);
    socket.on("poll:started", onPollStarted);
    socket.on("poll:updated", onPollUpdated);
    socket.on("poll:ended", onPollEnded);
    socket.on("participants:updated", onParticipantsUpdated);
    socket.on("chat:message", onChatMessage);
    socket.on("system:kicked", onSystemKicked);

    // --- Cleanup on unmount ---
    return () => {
      socket.off("state:initial", onInitialState);
      socket.off("state:updated", onStateUpdated);
      socket.off("poll:created", onPollCreated);
      // ... and so on for all other listeners
    };
  }, []);
}