import { Link } from "react-router-dom";
import carVideo from "../../assets/heroVideo.mp4";

const HeroSection = () => {
  return (
    <section className="relative w-full overflow-hidden">
      {/* Background Video */}
      <video
        className="w-full h-[450px] md:h-[650px] lg:h-[780px] object-cover"
        src={carVideo}
        autoPlay
        loop
        muted
        playsInline
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 flex justify-end items-center">
        <div className="max-w-3xl px-8 sm:px-12 md:px-20 lg:px-28">
          <h1 className="text-white font-extrabold tracking-tight 
                         text-4xl sm:text-5xl md:text-7xl lg:text-7xl drop-shadow-xl">
            TRANSCRIBE  
            <span className="block text-orange-400">TODAY!</span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-gray-200 max-w-xl drop-shadow-sm">
            Live, Audio/Video & YouTube transcriptions — fast, accurate and powered by AI.
          </p>

          <div className="mt-8">
            <Link
              to="/all-feature"
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 
                         rounded-xl text-lg font-semibold shadow-xl hover:shadow-2xl transition-all"
            >
              Explore Features
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
