import { useState } from "react";
import UploadForm from "../components/Transcription/UploadForm";
import VideoPreview from "../components/Transcription/VideoPreview";
import TranscriptPanel from "../components/Transcription/TranscriptPanel";
import AIFeaturePanel from "../components/Transcription/AIFeaturePanel";

export default function TranscriptionPage() {
  const [videoUrl, setVideoUrl] = useState(null);
  const [transcript, setTranscript] = useState([]);
  const [timestampsOn, setTimestampsOn] = useState(true);
  const [loading, setLoading] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br  p-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/*left */}
        <div className="lg:col-span-2 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-gray-200">

         
          {!videoUrl && (
            <UploadForm
              setVideoUrl={setVideoUrl}
              setTranscript={setTranscript}
              setLoading={setLoading}
            />
          )}

          
          {videoUrl && (
            <>
              <VideoPreview videoUrl={videoUrl} />
              <TranscriptPanel
                transcript={transcript}
                timestampsOn={timestampsOn}
                setTimestampsOn={setTimestampsOn}
                loading={loading}
              />
            </>
          )}

        </div>

        
        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-gray-200 h-fit w-fit">
          <AIFeaturePanel transcript={transcript} />
        </div>

      </div>
    </div>
  );
}
