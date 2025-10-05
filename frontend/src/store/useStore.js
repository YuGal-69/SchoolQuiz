import { create } from "zustand";

export const useStore = create((set) => ({
  // State variables
  userName: "",
  userType: null, // 'teacher' or 'student'
  isJoined: false,
  isKicked: false,
  sessionId: null,

  poll: null,
  participants: [],

  isChatOpen: false,
  messages: [],
  pollDeadlineMs: null,

  // Actions
  setUser: (name, type) =>
    set({ userName: name, userType: type, isJoined: true }),
  setKicked: (kicked) => set({ isKicked: kicked }),
  setSessionId: (id) => set({ sessionId: id }),

  setPoll: (poll) => set({ poll }),
  setParticipants: (participants) => set({ participants }),

  toggleChat: () =>
    set((state) => ({ isChatOpen: !state.isChatOpen })), // ✅ fixed
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
  setPollDeadline: (deadline) => set({ pollDeadlineMs: deadline }),

  reset: () =>
    set({
      userName: "",
      userType: null,
      isJoined: false,
      isKicked: false,
      poll: null,
      sessionId: null,
      participants: [],
      messages: [],
      isChatOpen: false, // also reset
    }),
}));
