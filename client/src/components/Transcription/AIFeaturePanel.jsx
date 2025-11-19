import { useState } from "react";
import axios from "axios";
import { SparklesIcon, LightBulbIcon, FaceSmileIcon } from "@heroicons/react/24/solid";

export default function AIFeaturePanel({ transcript }) {
  const [result, setResult] = useState(null);
  const [activeFeature, setActiveFeature] = useState(null);
  const [loading, setLoading] = useState(false);

  // Convert your transcript array → text string
  const transcriptText = transcript
    ?.map(t => typeof t === "string" ? t : t.text)
    .join(" ") || "";

  const runAI = async (type) => {
    try {
      setLoading(true);
      setActiveFeature(type);
      setResult(null);

      const res = await axios.post(`http://localhost:9000/api/ai/${type}`, {
        transcript: transcriptText,
      });

      setResult(res.data.response ?? "⚠️ Unexpected response format.");
    } catch (err) {
      console.error("Backend error:", err.message);
      setResult("⚠️ Backend not connected or API error.");
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { name: "Summary", icon: SparklesIcon, type: "summary" },
    { name: "Key Topics", icon: LightBulbIcon, type: "topics" },
    { name: "Sentiment", icon: FaceSmileIcon, type: "sentiment" },
  ];

  const getSentimentEmoji = (compound) => {
    if (compound >= 0.3) return { emoji: "😊", label: "Positive", color: "text-green-600" };
    if (compound <= -0.3) return { emoji: "😡", label: "Negative", color: "text-red-600" };
    return { emoji: "😐", label: "Neutral", color: "text-yellow-500" };
  };

  const renderResult = () => {
    if (loading)
      return (
        <div className="text-center py-10 text-orange-500 font-medium animate-pulse">
          ✨ Generating {activeFeature}...
        </div>
      );

    if (!result)
      return (
        <div className="text-gray-500 text-center py-10">
          Select a tool above to analyze the transcript.
        </div>
      );

    if (typeof result === "string") {
      return <p className="text-gray-800 whitespace-pre-wrap">{result}</p>;
    }

    if (Array.isArray(result)) {
      return (
        <ul className="list-disc pl-6 text-gray-800 space-y-2">
          {result.map((t, i) => <li key={i}>{t}</li>)}
        </ul>
      );
    }

    if (typeof result === "object") {
      const s = getSentimentEmoji(result.compound ?? 0);
      return (
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-xl font-semibold">
            <span className={`${s.color} text-3xl`}>{s.emoji}</span>
            <span>{s.label} Sentiment</span>
          </div>
          <div className="border-t pt-3 text-[15px] space-y-1">
            <p><strong>Positive:</strong> {result.pos}</p>
            <p><strong>Neutral:</strong> {result.neu}</p>
            <p><strong>Negative:</strong> {result.neg}</p>
            <p><strong>Compound:</strong> {result.compound?.toFixed(3)}</p>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="bg-white rounded-2xl p-7 shadow-xl border-gray-300">
      <h2 className="text-2xl font-bold mb-6">AI Features</h2>

      <div className="flex flex-wrap gap-3 mb-6">
        {features.map(({ name, icon: Icon, type }) => (
          <button
            key={type}
            onClick={() => runAI(type)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border shadow-sm ${
              activeFeature === type
                ? "bg-orange-100 border-orange-300 text-orange-700"
                : "bg-gray-100 hover:bg-orange-50 border-gray-200"
            }`}
          >
            <Icon className="w-5 h-5 text-orange-500" /> {name}
          </button>
        ))}
      </div>

      <div className="border rounded-2xl bg-gray-50 p-5 overflow-y-auto shadow-inner flex-1">
        {renderResult()}
      </div>
    </div>
  );
}
