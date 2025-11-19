// src/pages/YouTubeTranscriptionPage.jsx
import { useState } from "react";
import axios from "axios";
import TranscriptPanel from "../components/Transcription/TranscriptPanel";
import AIFeaturePanel from "../components/Transcription/AIFeaturePanel";

export default function YouTubeTranscriptionPage() {
  const [url, setUrl] = useState("");
  const [videoId, setVideoId] = useState(null);
  const [transcript, setTranscript] = useState([]);
  const [loading, setLoading] = useState(false);
  const [timestampsOn, setTimestampsOn] = useState(true);
  const [error, setError] = useState("");

  const extractId = (link) => {
    const regex = /(?:v=|youtu\.be\/|\/embed\/)([a-zA-Z0-9_-]{11})/;
    const match = link.match(regex);
    return match ? match[1] : null;
  };

  const handleTranscribe = async () => {
    if (!url) {
      setError("Please enter a YouTube video URL.");
      return;
    }

    const id = extractId(url);
    if (!id) {
      setError("Invalid YouTube URL format.");
      return;
    }

    setVideoId(id);
    setError("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:9000/api/youtube", { url });

      if (res.data && res.data.success && Array.isArray(res.data.transcript)) {
        setTranscript(res.data.transcript); // array of { text, time? }
      } else {
        setError("⚠️ Could not generate transcript.");
      }
    } catch (err) {
      console.error("YouTube transcription error:", err);
      setError("❌ Server error — try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br p-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">

        <div className="lg:col-span-2 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-gray-200">

          <div className="mb-5">
            <h2 className="text-xl font-bold text-gray-800 mb-3">YouTube Link</h2>
            <div className="flex gap-3">
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter YouTube video URL..."
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
              <button
                onClick={handleTranscribe}
                disabled={loading}
                className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-5 py-2 rounded-lg shadow transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Processing..." : "Transcribe"}
              </button>
            </div>
            {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
          </div>

          {videoId && (
            <div className="w-full aspect-video rounded-2xl overflow-hidden shadow-lg border border-gray-200 mb-5">
              <iframe
                src={`https://www.youtube.com/embed/${videoId}`}
                title="YouTube video player"
                className="w-full h-full"
                allowFullScreen
              />
            </div>
          )}

          <TranscriptPanel
            transcript={transcript}
            timestampsOn={timestampsOn}
            setTimestampsOn={setTimestampsOn}
            loading={loading}
          />
        </div>

        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-gray-300 h-fit w-fit">
          <AIFeaturePanel transcript={transcript} />
        </div>
      </div>
    </div>
  );
}
