// src/pages/LiveTranscription.jsx
import { useEffect, useRef, useState } from "react";
import TranscriptPanel from "../components/Transcription/TranscriptPanel";
import AIFeaturePanel from "../components/Transcription/AIFeaturePanel";

export default function LiveTranscriptionPage() {
  const [transcript, setTranscript] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [localStream, setLocalStream] = useState(null);

  const wsRef = useRef(null);
  const audioCtxRef = useRef(null);
  const processorRef = useRef(null);
  const sourceRef = useRef(null);

  const startRecording = async () => {
    try {
      setTranscript([]);
      wsRef.current = new WebSocket("ws://localhost:9000/api/live");
      wsRef.current.binaryType = "arraybuffer";

      wsRef.current.onopen = async () => {
        // mic here
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        setLocalStream(stream);

        const audioCtx = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 16000 });
        audioCtxRef.current = audioCtx;

        // load audio worklet
        await audioCtx.audioWorklet.addModule("/audio-processor.js");

        const source = audioCtx.createMediaStreamSource(stream);
        sourceRef.current = source;

        const node = new AudioWorkletNode(audioCtx, "audio-processor");
        processorRef.current = node;

        node.port.onmessage = (e) => {
         
          if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(e.data);
          }
        };

        source.connect(node);
        node.connect(audioCtx.destination); 
        // required in some browsers; volume is 0 because data is int16 not audio
        
        setIsRecording(true);
      };

      wsRef.current.onmessage = (ev) => {
        try {
          const d = JSON.parse(ev.data);
          if (d.text) {
            setTranscript(prev => [...prev, { time: new Date().toLocaleTimeString(), text: d.text }]);
          }
        } catch (e) {
          console.error("WS message parse", e);
        }
      };

      wsRef.current.onerror = (err) => console.error("WS err", err);
      wsRef.current.onclose = () => {
        console.log("WS closed");
        setIsRecording(false);
      };
    } catch (err) {
      console.error("Start recording failed:", err);
    }
  };

  const stopRecording = () => {
    try {
      processorRef.current?.disconnect();
      sourceRef.current?.disconnect();
      audioCtxRef.current?.close();
      localStream?.getTracks().forEach(t => t.stop());
      wsRef.current?.close();
    } catch (e) {}
    setLocalStream(null);
    setIsRecording(false);
  };

  useEffect(() => {
    return () => stopRecording();
    
  }, []);

  return (
    <div className="p-8 min-h-screen ">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow">
          <h2 className="text-2xl font-bold mb-4">🎤 Live Mic → Whisper.cpp</h2>

          {!isRecording ? (
            <button onClick={startRecording} className="bg-orange-500 text-white px-6 py-3 rounded-xl">Start Recording</button>
          ) : (
            <button onClick={stopRecording} className="bg-red-500 text-white px-6 py-3 rounded-xl">Stop Recording</button>
          )}

          <TranscriptPanel transcript={transcript} timestampsOn={false} setTimestampsOn={() => {}} loading={false} />
        </div>

        <AIFeaturePanel transcript={transcript} />
      </div>
    </div>
  );
}
