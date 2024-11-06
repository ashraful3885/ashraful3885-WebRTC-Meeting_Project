# WebRTC Meeting Project

A simple WebRTC-based video meeting application with chat and full audio/video controls, built to allow users to join a virtual meeting room, view video streams, and communicate in real-time. This project is responsive, supporting desktop and mobile screens.

## Features
- **Join by Name and Room ID**: Users can enter a name and unique room ID to join a video meeting.
- **Dynamic User Joining**: Supports multiple users joining the same room in real-time.
- **Responsive UI**: Video containers automatically wrap based on screen size, making it mobile-friendly.
- **Full Control**: Mute/unmute microphone, toggle video, and end call options for each user.
- **In-Room Chat**: Users can send and receive text messages within the meeting room.

## Project Structure
- **`index.html`**: Entry page where users input their name and room ID.
- **`room.html`**: Main meeting room interface with video streams and chat.
- **`style.css`**: Styling for the meeting interface and components.
- **`script.js`**: Core JavaScript file handling WebRTC connections and user interactions.
- **`server.js`**: Node.js server that manages WebSocket connections using Socket.IO, handling user entry and exit events.

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) installed on your machine.
- A clone of this repository.

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/ashraful3885/WebRTC-Meeting_Project.git
   cd WebRTC-Meeting_Project
2. Install dependencies:
   ```bash
   npm install
### Running the Application
Start the server:
```bash
node server.js

bcxbvbkxcb
