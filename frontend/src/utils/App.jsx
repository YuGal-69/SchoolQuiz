import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useStore } from "../store/useStore.js";
import useSocketManager from "../hooks/useSocketListener.js";

import LandingPage from "../pages/LandingPage.jsx";
import TeacherPage from "../pages/Teacher.jsx";
import StudentPage from "../pages/Student.jsx";
import StudentJoin from "../pages/StudentJoin.jsx";
import KickedPage from "../pages/Kiked.jsx";
import PollHistoryPage from "../pages/PollHistoryPage.jsx";
import ChatWidget from "../components/common/ChatWidget.jsx";

export default function App() {
  const { isJoined, isKicked, userType } = useStore();
  useSocketManager();

  if (isKicked) {
    return <KickedPage />;
  }

  return (
    <Router>
      <main className="bg-gray-50 font-sans w-full min-h-screen flex flex-col items-center justify-center p-4 sm:p-8 relative">
        <Routes>
          {!isJoined ? (
            <>
              <Route path="/" element={<LandingPage />} />
              <Route path="/join" element={<StudentJoin />} />
              <Route path="*" element={<Navigate to="/" />} />
            </>
          ) : (
            <>
              <Route
                path="/"
                element={
                  userType === "teacher" ? (
                    <Navigate to="/teacher" />
                  ) : (
                    <Navigate to="/student" />
                  )
                }
              />
              <Route path="/teacher" element={<TeacherPage />} />
              <Route path="/student" element={<StudentPage />} />

              {/* <-- FIX: The route now accepts a dynamic sessionId parameter --> */}
              {userType === "teacher" && (
                <Route path="/history/:sessionId" element={<PollHistoryPage />} />
              )}

              <Route path="*" element={<Navigate to="/" />} />
            </>
          )}
        </Routes>
        {isJoined && <ChatWidget />}
      </main>
    </Router>
  );
}