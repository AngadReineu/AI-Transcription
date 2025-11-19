const express = require("express");
const http = require("http");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDataBase = require("./config/database");

const uploadRoutes = require("./routes/uploadRoute");
const youtubeRoutes = require("./routes/youtubeRoute");
const setupLiveWS = require("./routes/LiveRoute");
const aiRoutes = require("./routes/aiRoutes");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
connectDataBase();

// Default route
app.get("/", (req, res) => {
  res.send("🎉 Welcome to the Transcription API!");
});

// REST routes
app.use("/api/upload", uploadRoutes);
app.use("/api/youtube", youtubeRoutes);
app.use("/api/ai", aiRoutes);

// Create HTTP + WebSocket server
const server = http.createServer(app);

// Attach Whisper Live WebSocket
setupLiveWS(server);

const PORT = process.env.PORT || 9000;
server.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log("🧠 Whisper Live WS → ws://localhost:9000/api/live-whisper");
});
