import axios from "axios";
import { CloudArrowUpIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

export default function UploadForm({ setVideoUrl, setTranscript, setLoading }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // ✅ File type validation
    if (!file.type.startsWith("video/") && !file.type.startsWith("audio/")) {
      setError("Please upload a valid audio or video file.");
      return;
    }

    // ✅ Show video preview instantly
    setVideoUrl(URL.createObjectURL(file));
    setError("");
    setUploading(true);
    setLoading(true); // 👈 Tell TranscriptPanel to show “Transcribing...” message

    try {
      const formData = new FormData();
      formData.append("audio", file);

      const res = await axios.post("http://localhost:9000/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success && res.data.transcript) {
        setTranscript(res.data.transcript);
      } else {
        console.error("Transcription response invalid:", res.data);
        setError("⚠️ Transcription failed. Try again.");
      }
    } catch (err) {
      console.error("Upload/transcription error:", err);
      setError("❌ Server error — could not process file.");
    } finally {
      setUploading(false);
      setLoading(false); // 👈 Hide “Transcribing...” once done
    }
  };

  return (
    <div className="w-full">
      <label className="w-full flex flex-col items-center justify-center p-10 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer hover:border-orange-400 transition relative">
        <CloudArrowUpIcon className="h-14 w-14 text-gray-400 mb-3" />
        <p className="text-gray-600 text-lg">Drag & Drop or Click to Upload</p>
        <p className="text-sm text-gray-400 mt-1">MP4, MP3, WAV supported</p>

        <input
          type="file"
          accept="video/*,audio/*"
          className="hidden"
          onChange={handleUpload}
        />

        {uploading && (
          <p className="absolute bottom-3 text-orange-500 font-semibold animate-pulse">
            🎙️ Uploading & Transcribing...
          </p>
        )}
      </label>

      {error && (
        <p className="mt-3 text-red-600 text-sm font-medium text-center">{error}</p>
      )}
    </div>
  );
}
