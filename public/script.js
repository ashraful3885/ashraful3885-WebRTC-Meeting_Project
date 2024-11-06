document.addEventListener("DOMContentLoaded", () => {
    const localVideo = document.getElementById("localVideo");
    const remoteVideosContainer = document.getElementById("remoteVideos");
    const chatMessages = document.getElementById("chatMessages");
    const chatInput = document.getElementById("chatInput");
    const sendBtn = document.getElementById("sendBtn");
    const roomIdDisplay = document.getElementById("roomIdDisplay");

    const toggleMicBtn = document.getElementById("toggleMic");
    const toggleVideoBtn = document.getElementById("toggleVideo");
    const endCallBtn = document.getElementById("endCall");

    let localStream;
    let peerConnections = {};
    let socket;
    let isMicEnabled = true;
    let isVideoEnabled = true;

    const params = new URLSearchParams(window.location.search);
    const username = params.get("username");
    const roomId = params.get("roomId");
    roomIdDisplay.textContent = roomId;

    async function startStream() {
        return navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then((stream) => {
                localStream = stream;
                localVideo.srcObject = localStream;

                const localUsernameElem = document.getElementById("localUsername");
                localUsernameElem.textContent = `${username} (You)`;
            })
            .catch((error) => {
                console.error("Error accessing media devices:", error);
                throw error;
            });
    }

    function connectToSocket() {
        socket = io.connect();
        socket.emit("joinRoom", { username, roomId });

        socket.on("message", (message) => {
            displayMessage(message.username, message.text);
        });

        initializeSocketEvents();
    }

    function displayMessage(sender, text) {
        const displaySender = sender === username ? `${sender} (You)` : sender;
        chatMessages.innerHTML += `<p><strong>${displaySender}:</strong> ${text}</p>`;
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    sendBtn.addEventListener("click", () => {
        const message = chatInput.value;
        if (message.trim()) {
            socket.emit("chatMessage", message);
            chatInput.value = "";
        }
    });

    toggleMicBtn.addEventListener("click", () => {
        isMicEnabled = !isMicEnabled;
        localStream.getAudioTracks()[0].enabled = isMicEnabled;
        toggleMicBtn.style.backgroundColor = isMicEnabled ? "" : "black"; // Revert to normal color when on, black when off
    });

    toggleVideoBtn.addEventListener("click", () => {
        isVideoEnabled = !isVideoEnabled;
        localStream.getVideoTracks()[0].enabled = isVideoEnabled;
        toggleVideoBtn.style.backgroundColor = isVideoEnabled ? "" : "black"; // Revert to normal color when on, black when off
    });

    endCallBtn.addEventListener("click", () => {
        socket.disconnect();
        localStream.getTracks().forEach(track => track.stop());
        window.location.href = "/";
    });

    function setupPeerConnection(userId, remoteUsername) {
        if (peerConnections[userId]) return peerConnections[userId];

        const peerConnection = new RTCPeerConnection({
            iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
        });

        peerConnections[userId] = peerConnection;

        localStream.getTracks().forEach((track) => {
            peerConnection.addTrack(track, localStream);
        });

        peerConnection.ontrack = (event) => {
            const remoteStream = event.streams[0];
            let remoteVideoWrapper = document.getElementById(`video-${userId}`);
            if (!remoteVideoWrapper) {
                remoteVideoWrapper = document.createElement("div");
                remoteVideoWrapper.classList.add("video-wrapper");
                remoteVideoWrapper.id = `video-${userId}`;

                const remoteVideo = document.createElement("video");
                remoteVideo.autoplay = true;
                remoteVideo.playsInline = true;
                remoteVideo.srcObject = remoteStream;
                remoteVideoWrapper.appendChild(remoteVideo);

                const remoteUsernameElem = document.createElement("p");
                remoteUsernameElem.classList.add("username");
                remoteUsernameElem.textContent = remoteUsername;
                remoteVideoWrapper.appendChild(remoteUsernameElem);

                remoteVideosContainer.appendChild(remoteVideoWrapper);
            }
        };

        peerConnection.onicecandidate = (event) => {
            if (event.candidate) {
                socket.emit("iceCandidate", { candidate: event.candidate, to: userId });
            }
        };

        return peerConnection;
    }

    function initializeSocketEvents() {
        socket.on("userConnected", async ({ userId, username }) => {
            if (!peerConnections[userId]) {
                const peerConnection = setupPeerConnection(userId, username);
                const offer = await peerConnection.createOffer();
                await peerConnection.setLocalDescription(offer);
                socket.emit("offer", { offer, to: userId });
            }
        });

        socket.on("offer", async ({ offer, from, username }) => {
            const peerConnection = setupPeerConnection(from, username);
            await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
            const answer = await peerConnection.createAnswer();
            await peerConnection.setLocalDescription(answer);
            socket.emit("answer", { answer, to: from });
        });

        socket.on("answer", ({ answer, from }) => {
            const peerConnection = peerConnections[from];
            if (peerConnection) {
                peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
            }
        });

        socket.on("iceCandidate", ({ candidate, from }) => {
            const peerConnection = peerConnections[from];
            if (peerConnection && candidate) {
                peerConnection.addIceCandidate(new RTCIceCandidate(candidate)).catch((e) => {
                    console.error("Error adding received ICE candidate", e);
                });
            }
        });

        socket.on("userDisconnected", ({ userId }) => {
            handlePeerDisconnect(userId);
        });
    }

    function handlePeerDisconnect(userId) {
        if (peerConnections[userId]) {
            peerConnections[userId].close();
            delete peerConnections[userId];
            const videoWrapper = document.getElementById(`video-${userId}`);
            if (videoWrapper) {
                videoWrapper.remove();
            }
        }
    }

    startStream().then(connectToSocket);
});
