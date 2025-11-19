import { MdLiveTv } from "react-icons/md";
import { FaPhotoVideo } from "react-icons/fa";
import { HiOutlineSquares2X2 } from "react-icons/hi2";
import { Link } from "react-router-dom";

export default function FeatureShowcase() {
  const cardStyle =
    "flex flex-col items-center justify-center gap-4 h-[280px] rounded-3xl bg-white/80 backdrop-blur-xl hover:bg-white transition-all duration-300 hover:scale-[1.04] hover:-translate-y-2 hover:shadow-xl cursor-pointer text-center";

  return (
    <section className="py-20">
      <h2 className="text-center text-4xl font-extrabold text-gray-800">
        EVERYTHING YOU NEED <br />
        <span className="text-orange-600">ALL IN ONE PLACE</span>
      </h2>

      <p className="text-center mt-4 text-gray-600">
        Transcribe, collaborate & share — right in your browser.
      </p>

      <div className="container mx-auto px-5 mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        <Link to="/live">
          <div className={cardStyle}>
            <MdLiveTv className="text-blue-500 w-14 h-14" />
            <h3 className="text-xl font-semibold">Live Transcription</h3>
          </div>
        </Link>

        <Link to="/video-transcription">
          <div className={cardStyle}>
            <FaPhotoVideo className="text-purple-500 w-14 h-14" />
            <h3 className="text-xl font-semibold">Audio/Video Transcription</h3>
          </div>
        </Link>

        <Link to="/youtube">
          <div className={cardStyle}>
            <HiOutlineSquares2X2 className="text-green-500 w-14 h-14" />
            <h3 className="text-xl font-semibold">YouTube Link Transcription</h3>
          </div>
        </Link>
      </div>
    </section>
  );
}
