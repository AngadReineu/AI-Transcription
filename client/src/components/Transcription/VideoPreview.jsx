import { useState, useRef } from "react";
import { PlayIcon } from "@heroicons/react/24/solid";

export default function VideoPreview({ videoUrl }) {
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef(null);

  const handlePlay = () => {
    videoRef.current?.play();
    setPlaying(true);
  };

  return (
    <div className="relative w-full h-[400px] md:h-[550px] lg:h-[600px] rounded-2xl overflow-hidden shadow-lg border border-gray-200 mb-6 bg-black">
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        src={videoUrl}
        controls={playing}
        onPlay={() => setPlaying(true)}
      />

      {/* Center Play Button (only before play starts) */}
      {!playing && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-black/40 cursor-pointer transition"
          onClick={handlePlay}
        >
          <div className="bg-white/90 p-6 rounded-full shadow-lg hover:scale-110 transition-transform duration-200">
            <PlayIcon className="w-12 h-12 text-orange-500" />
          </div>
        </div>
      )}
    </div>
  );
}
