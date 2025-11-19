const FeatureComparison = () => {
  return (
    <section className="py-16 px-4">
      <h2 className="text-center text-3xl font-bold text-gray-800 mb-10">
        Why Choose TranscriptoAI?
      </h2>

      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">

        <div className="bg-white/80 rounded-xl shadow p-8 text-center">
          <h3 className="text-xl font-semibold mb-3">⚡ Faster</h3>
          <p className="text-gray-600">
            Transcribe audio/video in seconds using Whisper.cpp optimized server.
          </p>
        </div>

        <div className="bg-white/80 rounded-xl shadow p-8 text-center">
          <h3 className="text-xl font-semibold mb-3">🎯 More Accurate</h3>
          <p className="text-gray-600">
            16kHz preprocessing + segment handling = cleaner text output.
          </p>
        </div>

        <div className="bg-white/80 rounded-xl shadow p-8 text-center">
          <h3 className="text-xl font-semibold mb-3">🖥️ All-in-One</h3>
          <p className="text-gray-600">
            Live mic, audio/video upload, and YouTube transcription in one dashboard.
          </p>
        </div>

      </div>
    </section>
  );
};

export default FeatureComparison;
