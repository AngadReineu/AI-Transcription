import { ClipboardDocumentIcon, ClockIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

export default function TranscriptPanel({
  transcript = [],
  timestampsOn,
  setTimestampsOn,
  loading = false,
}) {
  const [copied, setCopied] = useState(false);

  const copyText = async () => {
    if (!transcript.length) {
      alert("No transcript available to copy.");
      return;
    }

    const text = transcript
      .map((t) => (timestampsOn ? `${t.time || "00:00"} ${t.text}` : t.text))
      .join("\n");

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Clipboard copy failed:", err);
      alert("Copy failed — please try again.");
    }
  };

  return (
    <div className="mt-6 transition-all duration-500">
      {/* === Top Controls === */}
      <div className="flex items-center justify-between mb-4">
        {/* COPY BUTTON */}
        <button
          onClick={copyText}
          disabled={!transcript.length || loading}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow transition font-medium ${
            copied
              ? "bg-green-500 text-white"
              : "bg-orange-500 hover:bg-orange-600 text-white"
          } disabled:opacity-60 disabled:cursor-not-allowed`}
        >
          <ClipboardDocumentIcon className="w-5 h-5" />
          {copied ? "Copied!" : "Copy"}
        </button>

        {/* TIMESTAMP TOGGLE */}
        <button
          onClick={() => setTimestampsOn(!timestampsOn)}
          disabled={loading}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition font-medium ${
            timestampsOn
              ? "bg-orange-100 text-orange-700 border-orange-300"
              : "bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300"
          } disabled:opacity-60 disabled:cursor-not-allowed`}
        >
          <ClockIcon className="w-5 h-5" />
          {timestampsOn ? "Timestamps ON" : "Timestamps OFF"}
        </button>
      </div>

      {/* === Loading Indicator (always visible, not buried in box) === */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-10 mb-4">
          <div className="w-10 h-10 border-4 border-orange-300 border-t-orange-600 rounded-full animate-spin mb-3"></div>
          <p className="text-lg font-semibold text-orange-600 animate-pulse">
            🎧 Transcribing... please wait
          </p>
        </div>
      )}

      {/* === Transcript Content === */}
      <div
        className={`max-h-[500px] overflow-y-auto border rounded-2xl p-6 bg-gray-50 shadow-inner leading-relaxed space-y-3 transition-opacity duration-300 ${
          loading ? "opacity-50 blur-sm pointer-events-none" : "opacity-100"
        }`}
      >
        {!loading && transcript.length ? (
          transcript.map((line, i) => (
            <div
              key={i}
              className="flex items-start text-gray-800 text-[15px] bg-white p-3 rounded-xl shadow-sm hover:shadow-md transition"
            >
              {timestampsOn && (
                <span className="bg-gray-200 text-xs px-2 py-1 rounded-lg mr-3 font-medium text-gray-700 whitespace-nowrap mt-[2px]">
                  {line.time || "00:00"}
                </span>
              )}
              <span className="flex-1">{line.text}</span>
            </div>
          ))
        ) : !loading ? (
          <p className="text-gray-500 text-center mt-10 text-sm">
            No transcript yet. Upload a file to generate one.
          </p>
        ) : null}
      </div>
    </div>
  );
}
