const { WebSocketServer } = require("ws");
const fs = require("fs/promises");
const fsSync = require("fs");
const path = require("path");
const axios = require("axios");
const FormData = require("form-data");

const OUT_DIR = path.resolve(__dirname, "..", "tmp_live");
if (!fsSync.existsSync(OUT_DIR)) fsSync.mkdirSync(OUT_DIR, { recursive: true });

function writeWavFile(filePath, int16Buffer, sampleRate = 16000, numChannels = 1) {
  // int16Buffer is a Buffer containing PCM16LE samples
  const byteRate = sampleRate * numChannels * 2;
  const blockAlign = numChannels * 2;
  const dataSize = int16Buffer.length;
  const buffer = Buffer.alloc(44 + dataSize);

  // RIFF header
  buffer.write("RIFF", 0);
  buffer.writeUInt32LE(36 + dataSize, 4); // file size - 8
  buffer.write("WAVE", 8);

  // fmt chunk
  buffer.write("fmt ", 12);
  buffer.writeUInt32LE(16, 16); // PCM chunk size
  buffer.writeUInt16LE(1, 20); // audio format (1 = PCM)
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(16, 34); // bits per sample

  // data chunk
  buffer.write("data", 36);
  buffer.writeUInt32LE(dataSize, 40);

  // PCM data
  int16Buffer.copy(buffer, 44);

  return fs.writeFile(filePath, buffer);
}

function uniqueFilePath() {
  return path.join(OUT_DIR, `live_${Date.now()}_${Math.floor(Math.random() * 10000)}.wav`);
}

function concatBuffers(buffers) {
  if (!buffers || buffers.length === 0) return Buffer.alloc(0);
  return Buffer.concat(buffers);
}

function nowLabel() {
  return new Date().toISOString();
}

function log(...args) {
  console.log("[LIVE WS]", ...args);
}

function safeUnlink(filePath) {
  return fs.unlink(filePath).catch(() => {});
}

function spawnProcessAudioAndSendToWhisper(pcmBuffer, client) {
  // returns Promise
  return new Promise(async (resolve) => {
    const wavPath = uniqueFilePath();

    try {
      await writeWavFile(wavPath, pcmBuffer, 16000, 1);

      // POST to whisper server
      const form = new FormData();
      form.append("file", fsSync.createReadStream(wavPath));

      log("→ sending to whisper:", path.basename(wavPath));
      const resp = await axios.post("http://localhost:9001/inference", form, {
        headers: form.getHeaders(),
        maxBodyLength: Infinity,
        timeout: 120000,
      });

      // whisper returns { text, segments?, ... }
      const text = resp.data?.text ?? (Array.isArray(resp.data?.segments) ? resp.data.segments.map(s=>s.text).join(" ") : "");
      log("← whisper returned:", text ? text.slice(0,120) + (text.length>120?"...":"") : "(empty)");

      if (text) {
        client.send(JSON.stringify({ text }));
      }

      resolve();
    } catch (err) {
      log("❌ Whisper POST error:", err.message || err.toString());
      // send error to client if you want:
      // client.send(JSON.stringify({ error: err.message }));
      resolve();
    } finally {
      safeUnlink(wavPath);
    }
  });
}

function setupLiveWS(server, opts = {}) {
  const PROCESS_INTERVAL_MS = opts.processIntervalMs ?? 1000; // how often to process buffer (1s)
  const MAX_BUFFER_MS = opts.maxBufferMs ?? 5000; // avoid growing forever
  const wss = new WebSocketServer({ noServer: true });

  server.on("upgrade", (req, socket, head) => {
    if (req.url === "/api/live") {
      wss.handleUpgrade(req, socket, head, (ws) => {
        wss.emit("connection", ws, req);
      });
    }
  });

  wss.on("connection", (client) => {
    log("Client connected", nowLabel());

    // We'll store raw PCM16LE chunks (Buffers)
    let pcmChunks = [];
    let totalBytes = 0;
    let interval = setInterval(async () => {
      try {
        if (pcmChunks.length === 0) return;
        // combine
        const combined = concatBuffers(pcmChunks);
        // reset
        pcmChunks = [];
        totalBytes = 0;

        // Very small audio is skipped (avoid whisper errors)
        if (combined.length < 16000 * 2 * 0.05) { // <50ms
          log("Skipping too-short chunk", combined.length, "bytes");
          return;
        }

        await spawnProcessAudioAndSendToWhisper(combined, client);
      } catch (err) {
        log("Interval error:", err.message || err.toString());
      }
    }, PROCESS_INTERVAL_MS);

    client.on("message", (data) => {
      // Expect raw PCM Int16LE ArrayBuffer from browser
      // Some clients send Buffer objects directly (node ws converts). Normalize:
      const buf = Buffer.isBuffer(data) ? data : Buffer.from(data);
      pcmChunks.push(buf);
      totalBytes += buf.length;

      // Prevent unbounded memory usage
      const maxBytes = (16000 * 2) * (MAX_BUFFER_MS / 1000); // sampleRate * bytesPerSample * seconds
      if (totalBytes > maxBytes) {
        log("Buffer too big, truncating older data");
        // keep only the last ~MAX_BUFFER_MS ms
        const keepBytes = maxBytes;
        let acc = 0;
        const newChunks = [];
        for (let i = pcmChunks.length - 1; i >= 0; i--) {
          acc += pcmChunks[i].length;
          newChunks.unshift(pcmChunks[i]);
          if (acc >= keepBytes) break;
        }
        pcmChunks = newChunks;
        totalBytes = acc;
      }
    });

    client.on("close", () => {
      clearInterval(interval);
      log("Client disconnected", nowLabel());
    });

    client.on("error", (err) => {
      clearInterval(interval);
      log("Client error", err.message || err.toString());
    });
  });

  log("Live WS ready at ws://localhost:9000/api/live");
  return wss;
}

module.exports = setupLiveWS;


// const { WebSocketServer } = require("ws");
// const fs = require("fs/promises");
// const fsSync = require("fs");
// const path = require("path");
// const axios = require("axios");
// const FormData = require("form-data");

// const OUT_DIR = path.resolve(__dirname, "..", "tmp_live");
// if (!fsSync.existsSync(OUT_DIR)) fsSync.mkdirSync(OUT_DIR, { recursive: true });

// const GROQ_API_KEY = process.env.GROQ_API_KEY;
// const GROQ_URL = "https://api.groq.com/openai/v1/audio/transcriptions";

// function writeWavFile(filePath, int16Buffer, sampleRate = 16000, numChannels = 1) {
//   const byteRate = sampleRate * numChannels * 2;
//   const blockAlign = numChannels * 2;
//   const dataSize = int16Buffer.length;
//   const buffer = Buffer.alloc(44 + dataSize);

//   buffer.write("RIFF", 0);
//   buffer.writeUInt32LE(36 + dataSize, 4);
//   buffer.write("WAVE", 8);

//   buffer.write("fmt ", 12);
//   buffer.writeUInt32LE(16, 16);
//   buffer.writeUInt16LE(1, 20);
//   buffer.writeUInt16LE(numChannels, 22);
//   buffer.writeUInt32LE(sampleRate, 24);
//   buffer.writeUInt32LE(byteRate, 28);
//   buffer.writeUInt16LE(blockAlign, 32);
//   buffer.writeUInt16LE(16, 34);

//   buffer.write("data", 36);
//   buffer.writeUInt32LE(dataSize, 40);

//   int16Buffer.copy(buffer, 44);

//   return fs.writeFile(filePath, buffer);
// }

// function uniqueFilePath() {
//   return path.join(OUT_DIR, `live_${Date.now()}_${Math.floor(Math.random() * 10000)}.wav`);
// }

// function concatBuffers(buffers) {
//   if (!buffers || buffers.length === 0) return Buffer.alloc(0);
//   return Buffer.concat(buffers);
// }

// function nowLabel() {
//   return new Date().toISOString();
// }

// function log(...args) {
//   console.log("[LIVE WS]", ...args);
// }

// function safeUnlink(filePath) {
//   return fs.unlink(filePath).catch(() => {});
// }

// /**
//  * ⬇️ ⬇️ ⬇️ MAIN CHANGE: Whisper → Groq Cloud ⬇️ ⬇️ ⬇️
//  */
// async function spawnProcessAudioAndSendToGroq(pcmBuffer, client) {
//   return new Promise(async (resolve) => {
//     const wavPath = uniqueFilePath();

//     try {
//       await writeWavFile(wavPath, pcmBuffer, 16000, 1);

//       const form = new FormData();
//       form.append("file", fsSync.createReadStream(wavPath));
//       form.append("model", "whisper-large-v3-turbo");
//       form.append("response_format", "verbose_json"); // gets word/segment timestamps
//       form.append("language", "en"); // optional

//       log("→ sending to Groq:", path.basename(wavPath));

//       const resp = await axios.post(GROQ_URL, form, {
//         headers: {
//           Authorization: `Bearer ${GROQ_API_KEY}`,
//           ...form.getHeaders(),
//         },
//         timeout: 120000,
//         maxBodyLength: Infinity,
//       });

//       let text =
//         resp.data?.text ||
//         (Array.isArray(resp.data?.segments)
//           ? resp.data.segments.map((s) => s.text).join(" ")
//           : "");

//       log("← Groq returned:", text ? text.slice(0, 120) + (text.length > 120 ? "..." : "") : "(empty)");

//       if (text) {
//         client.send(JSON.stringify({ text }));
//       }

//       resolve();
//     } catch (err) {
//       log("❌ Groq POST error:", err.message || err.toString());
//       resolve();
//     } finally {
//       safeUnlink(wavPath);
//     }
//   });
// }

// /**
//  * WebSocket Setup
//  */
// function setupLiveWS(server, opts = {}) {
//   const PROCESS_INTERVAL_MS = opts.processIntervalMs ?? 1000;
//   const MAX_BUFFER_MS = opts.maxBufferMs ?? 5000;

//   const wss = new WebSocketServer({ noServer: true });

//   server.on("upgrade", (req, socket, head) => {
//     if (req.url === "/api/live") {
//       wss.handleUpgrade(req, socket, head, (ws) => {
//         wss.emit("connection", ws, req);
//       });
//     }
//   });

//   wss.on("connection", (client) => {
//     log("Client connected", nowLabel());

//     let pcmChunks = [];
//     let totalBytes = 0;

//     let interval = setInterval(async () => {
//       try {
//         if (pcmChunks.length === 0) return;

//         const combined = concatBuffers(pcmChunks);

//         pcmChunks = [];
//         totalBytes = 0;

//         if (combined.length < 16000 * 2 * 0.05) {
//           log("Skipping too-short chunk", combined.length, "bytes");
//           return;
//         }

//         await spawnProcessAudioAndSendToGroq(combined, client);
//       } catch (err) {
//         log("Interval error:", err.message || err.toString());
//       }
//     }, PROCESS_INTERVAL_MS);

//     client.on("message", (data) => {
//       const buf = Buffer.isBuffer(data) ? data : Buffer.from(data);
//       pcmChunks.push(buf);
//       totalBytes += buf.length;

//       const maxBytes = 16000 * 2 * (MAX_BUFFER_MS / 1000);

//       if (totalBytes > maxBytes) {
//         log("Buffer too big, truncating older data");

//         const keepBytes = maxBytes;
//         let acc = 0;
//         const newChunks = [];

//         for (let i = pcmChunks.length - 1; i >= 0; i--) {
//           acc += pcmChunks[i].length;
//           newChunks.unshift(pcmChunks[i]);
//           if (acc >= keepBytes) break;
//         }

//         pcmChunks = newChunks;
//         totalBytes = acc;
//       }
//     });

//     client.on("close", () => {
//       clearInterval(interval);
//       log("Client disconnected", nowLabel());
//     });

//     client.on("error", (err) => {
//       clearInterval(interval);
//       log("Client error", err.message || err.toString());
//     });
//   });

//   log("Live WS ready at ws://localhost:9000/api/live");
//   return wss;
// }

// module.exports = setupLiveWS;
