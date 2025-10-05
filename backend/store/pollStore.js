// Using a simple object to store state in memory.
let state = {
    poll: null,
    participants: {}, // Store participants by socket.id
    history: []
};

let pollTimer = null;

/**
 * Creates a new poll, replacing the old one.
 */
export const createPoll = (pollData, teacherSocketId) => { // Clear any existing timer
    if (pollTimer) {
        clearTimeout(pollTimer);
        pollTimer = null;
    }

    const pollId = `poll_${
        Date.now()
    }`;
    const newPoll = {
        id: pollId,
        question: pollData.question,
        options: pollData.options.map(
            (optionInput, index) => { // Normalize option input to ensure text is always a string
                const rawText = typeof optionInput === "object" && optionInput !== null ? optionInput.text : optionInput;
                const isCorrect = typeof optionInput === "object" && optionInput !== null ? Boolean(optionInput.isCorrect) : false;

                return {id: index, text: String(rawText), isCorrect, votes: 0};
            }
        ),
        voters: {}, // Tracks who has voted { socketId: optionId }
        isActive: false,
        isFinished: false,
        timeLimit: pollData.timeLimit || 60,
        teacherSocketId: teacherSocketId,
        startedAt: null,
        endedAt: null
    };

    state.poll = newPoll;
    console.log("Poll created:", newPoll);
    return newPoll;
};

/**
 * Starts the current poll and sets a timer to end it.
 */
export const startPoll = (io) => {
    if (state.poll && ! state.poll.isActive) {
        state.poll.isActive = true;
        state.poll.startedAt = Date.now();

        // Set a timer to automatically end the poll
        pollTimer = setTimeout(() => {
            endPoll(io);
        }, state.poll.timeLimit * 1000);

        console.log(`Poll ${
            state.poll.id
        } started.`);
        return state.poll;
    }
    return null;
};

/**
 * Ends the current poll, calculates final results, and moves it to history.
 */
export const endPoll = (io) => {
    if (state.poll && state.poll.isActive) {
        clearTimeout(pollTimer);
        pollTimer = null;

        state.poll.isActive = false;
        state.poll.isFinished = true;
        state.poll.endedAt = Date.now();

        // Add to history
        state.history.push(state.poll);

        console.log(`Poll ${
            state.poll.id
        } ended.`);
        io.emit("poll:ended", state.poll);
        return state.poll;
    }
    return null;
};

/**
 * Adds a vote to the current poll.
 */
export const addVote = (socketId, optionId) => {
    if (state.poll && state.poll.isActive && ! state.poll.voters[socketId]) {
        const option = state.poll.options.find((opt) => opt.id === optionId);
        if (option) {
            option.votes += 1;
            state.poll.voters[socketId] = optionId;
            console.log(`Vote added by ${socketId} for option ${optionId}.`);
            return state.poll;
        }
    }
    return null;
};

/**
 * Adds a participant to the session.
 */
export const addParticipant = (socketId, name) => {
    state.participants[socketId] = {
        id: socketId,
        name
    };
    console.log("Participant added:", state.participants[socketId]);
    return Object.values(state.participants);
};

/**
 * Removes a participant from the session.
 */
export const removeParticipant = (socketId) => {
    if (state.participants[socketId]) {
        console.log(`Participant removed: ${
            state.participants[socketId].name
        }`);
        delete state.participants[socketId];
    }
    // Handle un-voting if the user voted
    if (state.poll && state.poll.voters[socketId]) {
        const votedOptionId = state.poll.voters[socketId];
        const option = state.poll.options.find((opt) => opt.id === votedOptionId);
        if (option) {
            option.votes -= 1;
        }
        delete state.poll.voters[socketId];
    }
    return Object.values(state.participants);
};

export const getPoll = () => state.poll;
export const getParticipants = () => Object.values(state.participants);
export const getHistory = () => state.history;
export const allStudentsVoted = () => {
    if (! state.poll) 
        return false;
    
    // Count non-teacher participants
    const studentCount = Object.values(state.participants).filter((p) => p.id !== state.poll.teacherSocketId).length;
    const voteCount = Object.keys(state.poll.voters).length;
    return studentCount > 0 && voteCount >= studentCount;
};
