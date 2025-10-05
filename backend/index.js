// backend/index.js
const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // your frontend
    methods: ["GET", "POST"],
  },
});

// Store current question
let currentQuestion = null;
let votes = {};

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // student joins
  socket.on("join", (name) => {
    console.log(`${name} joined`);
  });

  // teacher starts a question
  socket.on("start_question", (question) => {
    currentQuestion = question;
    votes = {}; // reset votes
    io.emit("new_question", question); // send to all students
  });

  // student votes
  socket.on("submit_vote", (data) => {
    votes[socket.id] = data;
    io.emit("update_votes", votes);
  });

  // teacher ends question
  socket.on("end_question", () => {
    io.emit("question_ended", votes);
    currentQuestion = null;
    votes = {};
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
