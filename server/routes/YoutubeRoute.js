const express = require("express");
const fs = require("fs");
const path = require("path");
const ffmpeg = require("fluent-ffmpeg");
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const ytdlp = require("yt-dlp-exec");

const { transcribeWithWhisper } = require("../utils/whisperHttp");

ffmpeg.setFfmpegPath(ffmpegPath);

const router = express.Router();

// === Convert to WAV (same as upload route) ===
function convertToWav(inputPath) {
  return new Promise((resolve, reject) => {
    const outputPath = inputPath + ".wav";

    ffmpeg(inputPath)
      .audioChannels(1)
      .audioFrequency(16000)
      .format("wav")
      .audioCodec("pcm_s16le")
      .on("end", () => resolve(outputPath))
      .on("error", (err) => reject(err))
      .save(outputPath);
  });
}

router.post("/", async (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res
      .status(400)
      .json({ success: false, error: "YouTube URL is required" });
  }

  try {
    console.log("⬇️ Downloading YouTube audio…");

    const outputDir = "downloads";
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

    const fileBase = `${Date.now()}`;
    const outputFile = path.join(outputDir, `${fileBase}.webm`);

    // === yt-dlp download clean + stable ===
    await ytdlp(url, {
      output: outputFile,
      format: "bestaudio",
      ffmpegLocation: ffmpegPath, // critical fix
    });

    console.log("🎵 Download complete:", outputFile);

    // Convert → WAV
    const wavPath = await convertToWav(outputFile);

    // Whisper
    const result = await transcribeWithWhisper(wavPath);

    // Cleanup
    fs.unlinkSync(outputFile);
    fs.unlinkSync(wavPath);

    res.json({
      success: true,
      transcript: result.segments
        ? result.segments.map((s) => ({
            time: s.start?.toFixed(2) || "0.00",
            text: s.text.trim(),
          }))
        : [{ text: result.text }],
    });

  } catch (err) {
    console.error("YOUTUBE ERROR:", err);
    res.status(500).json({
      success: false,
      transcript: [],
      error: err.message,
    });
  }
});

module.exports = router;
