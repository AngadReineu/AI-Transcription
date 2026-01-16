import React from 'react'
import { FaPhotoVideo } from 'react-icons/fa'
import { HiOutlineSquares2X2 } from 'react-icons/hi2'
import { MdLiveTv } from 'react-icons/md'
import { Link } from 'react-router-dom'

const AllFeature = () => {
    return (
        <div className="min-h-screen flex flex-col">


            <div className="w-full py-6 bg-white shadow-md">
                <h2 className="font-semibold text-2xl text-gray-700 ml-6">
                    Explore All Our Features
                </h2>
            </div>

            <div className="container mx-auto px-6 py-10 
                      grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3
                      gap-10">

               
                {[
                    {
                        link: "/live",
                        icon: <MdLiveTv className="w-16 h-16 text-blue-500" />,
                        title: "Live Transcription"
                    },
                    {
                        link: "/video-transcription",
                        icon: <FaPhotoVideo className="w-16 h-16 text-purple-500" />,
                        title: "Upload Audio/Video"
                    },
                    {
                        link: "/youtube",
                        icon: <HiOutlineSquares2X2 className="w-16 h-16 text-green-500" />,
                        title: "YouTube Link Transcription"
                    }
                ].map((item, i) => (
                    <Link key={i} to={item.link}>
                        <div className="flex flex-col items-center justify-center 
                            rounded-2xl bg-white/80 hover:bg-white 
                            transition-all duration-500 
                            hover:-translate-y-2 hover:shadow-2xl
                            py-20 px-10 cursor-pointer text-center">

                            {item.icon}
                            <h2 className="text-xl font-semibold mt-4">{item.title}</h2>

                        </div>
                    </Link>
                ))}

            </div>


            <div className="mt-auto">
            </div>

        </div>
    );
};

export default AllFeature;
