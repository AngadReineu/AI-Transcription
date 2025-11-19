
import React from 'react'
import collection from "../../assets/collection2.png"
import { Link } from 'react-router-dom'

const FeatureCollection = () => {
  return (
    <section className='py-16 px-4 lg:px-0'>
            <div className='container mx-auto flex flex-col-reverse lg:flex-row items-center bg-[#FAF6F0] rounded-3xl'>
                {/* left written stuff */}
                <div className="lg:w-1/2 p-8 text-center lg:text-left">
                    <h2 className="text-lg font-semibold text-gray-700 mb-2">
                       Turn Speech Into Text. Fast.
                    </h2>
                    <h2 className="text-xl lg:text-2xl font-bold mb-6">
                        Accurate transcription for audio, video, and YouTube powered by AI.
                    </h2>
                    <p className="text-lg text-gray-600 mb-6">
                     Explore all our features
                    </p>
                    <Link to="/all-feature" className='bg-black text-white px-6 py-3 rounded-lg text-lg hover:bg-gray-800'>
                        Transcribe Now
                    </Link>
                </div>
            {/* right photo side */}

            <div className="lg:w-1/2 ">
                <img 
                src={collection} 
                alt="Featured Product"
                className='w-full h-full object-cover lg:rounded-tr-3xl lg:rounded-br-3xl' />
            </div>


            </div>
        </section>
  )
}

export default FeatureCollection