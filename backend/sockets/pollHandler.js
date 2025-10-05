import {
    createPoll,
    startPoll,
    endPoll,
    addVote,
    addParticipant,
    removeParticipant,
    getPoll,
    getParticipants,
    allStudentsVoted
} from '../store/pollStore.js';

export default function pollHandler(io, socket) {
    // === CONNECTION & DISCONNECT ===
    // When a user connects, send them the current state
    socket.emit('state:initial', {
        poll: getPoll(),
        participants: getParticipants(),
    });

    const handleDisconnect = () => {
        const updatedParticipants = removeParticipant(socket.id);
        io.emit('participants:updated', updatedParticipants);
        // Also broadcast updated poll results if the disconnected user had voted
        const currentPoll = getPoll();
        if (currentPoll) {
            io.emit('poll:updated', currentPoll);
        }
    };

    // === USER & PARTICIPANT EVENTS ===
    const handleJoin = (name) => {
        const updatedParticipants = addParticipant(socket.id, name);
        io.emit('participants:updated', updatedParticipants);
    };

    const handleKickParticipant = (participantId) => {
        const targetSocket = io.sockets.sockets.get(participantId);
        if (targetSocket) {
            targetSocket.emit('system:kicked');
            targetSocket.disconnect(true);
        }
        // Disconnect will trigger handleDisconnect to clean up
    };


    // === TEACHER EVENTS ===
    const handleCreatePoll = (pollData) => {
        const newPoll = createPoll(pollData, socket.id);
        // The teacher who created it becomes the official teacher for this poll
        socket.emit('poll:created', newPoll);
        // Let everyone know a new poll is ready (but not active)
        io.emit('state:updated', { poll: newPoll });
    };

    const handleStartPoll = () => {
        const activePoll = startPoll(io);
        if (activePoll) {
            io.emit('poll:started', activePoll);
        }
    };

    const handleEndPoll = () => {
        const finishedPoll = endPoll(io);
        if (finishedPoll) {
            // The endPoll function already emits 'poll:ended'
        }
    };

    // === STUDENT EVENTS ===
    const handleStudentVote = ({ optionId }) => {
        const updatedPoll = addVote(socket.id, optionId);
        if (updatedPoll) {
            io.emit('poll:updated', updatedPoll);
            // Check if all students have voted to end the poll early
            if (allStudentsVoted()) {
                endPoll(io);
            }
        }
    };

    // === CHAT EVENTS ===
    const handleChatMessage = (message) => {
        const sender = getParticipants().find(p => p.id === socket.id);
        if (sender) {
            // Broadcast to everyone including sender
            io.emit('chat:message', {
                id: `msg_${Date.now()}`,
                sender: sender,
                text: message,
            });
        }
    };


    // Registering event listeners
    socket.on('disconnect', handleDisconnect);
    socket.on('user:join', handleJoin);
    socket.on('teacher:createPoll', handleCreatePoll);
    socket.on('teacher:startPoll', handleStartPoll);
    socket.on('teacher:endPoll', handleEndPoll);
    socket.on('teacher:kickParticipant', handleKickParticipant);
    socket.on('student:vote', handleStudentVote);
    socket.on('chat:sendMessage', handleChatMessage);
}
