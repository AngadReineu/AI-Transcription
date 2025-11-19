const express = require("express");
const multer = require("multer");
const fs = require("fs");
const ffmpeg = require("fluent-ffmpeg");
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const { transcribeWithWhisper } = require("../utils/whisperHttp");

ffmpeg.setFfmpegPath(ffmpegPath);

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// REAL WORKING conversion for Whisper.cpp
function convertToWav(inputPath) {
  return new Promise((resolve, reject) => {
    const outputPath = inputPath + ".wav";

    ffmpeg(inputPath)
      .noVideo()
      .audioCodec("pcm_s16le")
      .audioFrequency(16000)
      .audioChannels(1)
      .format("wav")
      .on("end", () => resolve(outputPath))
      .on("error", reject)
      .save(outputPath);
  });
}

router.post("/", upload.single("audio"), async (req, res) => {
  try {
    const inputPath = req.file.path;

    // Convert to WAV 16kHz mono PCM16
    const wavPath = await convertToWav(inputPath);

    // Whisper transcribe
    const result = await transcribeWithWhisper(wavPath);

    fs.unlinkSync(inputPath);
    fs.unlinkSync(wavPath);

    let transcriptArray = [];

    if (result.segments) {
      transcriptArray = result.segments.map((s) => ({
        time: s.start.toFixed(2),
        text: s.text.trim(),
      }));
    } else {
      transcriptArray = [{ time: "0.00", text: result.text }];
    }

    res.json({ success: true, transcript: transcriptArray });

  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
