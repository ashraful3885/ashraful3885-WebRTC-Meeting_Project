const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public")));

const users = {};

function addUser(socketId, username, roomId) {
    users[socketId] = { username, roomId };
}

function removeUser(socketId) {
    delete users[socketId];
}

function getUsersInRoom(roomId) {
    return Object.values(users).filter(user => user.roomId === roomId);
}

io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);

    socket.on("joinRoom", ({ username, roomId }) => {
        if (roomId) {
            socket.join(roomId);
            addUser(socket.id, username, roomId);
            console.log(`${username} has joined room: ${roomId}`);

            socket.to(roomId).emit("message", { username: "System", text: `${username} has joined the room.` });
            io.to(roomId).emit("roomUsers", { users: getUsersInRoom(roomId) });
            socket.to(roomId).emit("userConnected", { userId: socket.id, username });
        }
    });

    socket.on("chatMessage", (message) => {
        const user = users[socket.id];
        if (user && user.roomId) {
            io.to(user.roomId).emit("message", { username: user.username, text: message });
        }
    });

    socket.on("offer", ({ offer, to }) => {
        io.to(to).emit("offer", { offer, from: socket.id, username: users[socket.id].username });
    });

    socket.on("answer", ({ answer, to }) => {
        io.to(to).emit("answer", { answer, from: socket.id });
    });

    socket.on("iceCandidate", ({ candidate, to }) => {
        io.to(to).emit("iceCandidate", { candidate, from: socket.id });
    });

    socket.on("disconnect", () => {
        const user = users[socket.id];
        if (user) {
            const { username, roomId } = user;
            removeUser(socket.id);
            console.log(`${username} has left room: ${roomId}`);

            socket.to(roomId).emit("message", { username: "System", text: `${username} has left the room.` });
            io.to(roomId).emit("roomUsers", { users: getUsersInRoom(roomId) });
            socket.to(roomId).emit("userDisconnected", { userId: socket.id });
        }
    });
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
