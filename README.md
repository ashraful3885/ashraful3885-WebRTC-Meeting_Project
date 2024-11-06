# WebRTC Video Conferencing Application

This WebRTC application enables real-time video and audio communication with a built-in chat feature. Users can join rooms by entering their name and room ID, interact with other participants, and control their video/audio settings. The application is designed to be responsive, allowing seamless use on both desktop and mobile devices.

## Table of Contents
- [Project Structure](#project-structure)
- [Features](#features)
- [Installation and Setup](#installation-and-setup)
- [Usage](#usage)
- [Configuration](#configuration)
- [Dependencies](#dependencies)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## Project Structure

The main directories and files are organized as follows:
webrtc-app/ (root directory) ├── public/ # Client-side files │ ├── index.html # Entry page for user input (name and room ID) │ ├── room.html # Main video conference interface │ ├── style.css # Styling for layout and responsiveness │ └── script.js # Client-side logic for video, chat, and user interactions ├── socket.io/ │ └── socket.io.js # Socket.IO client-side library ├── server.js # Server-side script to manage WebSocket connections ├── package.json # Project metadata and dependencies └── package-lock.json # Dependency lock file

### Key Files
- **index.html**: Entry page where users enter their name and room ID to join a room.
- **room.html**: Main interface that displays video feeds, chat, and controls for video/audio.
- **style.css**: CSS for a responsive, user-friendly layout.
- **script.js**: Manages client-side logic for video and chat functionality.
- **server.js**: Server-side logic to handle WebSocket connections and room management.

## Features

- **Join a Room**: Users enter a name and room ID to join an existing room or create a new one.
- **Dynamic User Management**: New users can join dynamically, with video feeds added automatically for each participant.
- **Responsive UI**: The interface is optimized for both desktop and mobile; video containers wrap as needed based on screen size.
- **Full Control Over Video/Audio**: Users can mute/unmute the microphone, toggle the camera, and end calls.
- **User-Friendly Chat**: Send and receive text messages with all participants within the room.

## Installation and Setup

To set up the WebRTC Video Conferencing Application locally:

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd webrtc-app
