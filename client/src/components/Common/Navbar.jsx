import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { HiBars3BottomRight, HiOutlineUser } from "react-icons/hi2"
import { IoMdClose } from "react-icons/io"

const Navbar = () => {
    const [toggleNavbar, setToggleNavbar] = useState(false);

    const toggleNavebarOpen = () => {
        setToggleNavbar(!toggleNavbar)
    }
    return (
        <>
            <nav className='w-full flex items-center justify-between py-4 px-6 border-b border-white/40 bg-white backdrop-blur-md shadow-md'>
                {/* left logo */}
                <div>
                    <Link to="/" className="text-2xl font-medium">TranscriptoAI</Link>
                </div>
                {/* cetner links */}
                <div className='hidden md:flex space-x-6 py-2'>
                    <Link to="/live" className='text-gray-700 hover:text-black text-sm font-medium uppercase'>
                        Live Transcription
                    </Link>
                    <Link to="/video-transcription" className='text-gray-700 hover:text-black text-sm font-medium uppercase'>
                        Video Transcription
                    </Link>
                    <Link to="/all-feature" className='text-gray-700 hover:text-black text-sm font-medium uppercase'>
                        All Features
                    </Link>
                </div>

                {/* right profile */}
                <div className="flex items-center space-x-4">
                    <Link to="#" className='hover:text-black'>
                        <HiOutlineUser className='w-6 h-6 text-gray-700' />
                    </Link>

                    <button onClick={toggleNavebarOpen} className='md:hidden'>
                        <HiBars3BottomRight className='h-6 w-6 text-gray-700 cursor-pointer' />
                    </button>
                </div>
            </nav>

            {/* mobile view */}
            <div className={`fixed top-0 left-0 w-3/4 sm:w-1/2 md:w-1/3 h-full
                            bg-white shadow-lg transform transition-transform duration-300 z-50
                           ${toggleNavbar ? "translate-x-0" : "-translate-x-full"}`}>
                <div className='flex justify-end p-4'>
                    <button onClick={toggleNavebarOpen}>
                        <IoMdClose className="h-6 w-6 text-gray-600 cursor-pointer" />
                    </button>
                </div>
                <div className='p-4'>
                    <h2 className='text-xl font-semibold border-b mb-4 '>
                        Menu
                    </h2>

                    <div className=" pb-3 mb-3">
                        <h3 className="text-lg font-semibold mb-2">Transription</h3>
                        <nav className="space-y-2 pl-3">
                            <Link to="#" onClick={toggleNavebarOpen} className="flex items-center gap-2 text-gray-600 hover:text-black">
                                <span className="text-sm">•</span> Live Transcription
                            </Link>
                            <Link to="#" onClick={toggleNavebarOpen} className="flex items-center gap-2 text-gray-600 hover:text-black">
                                <span className="text-sm">•</span> Video Transcription
                            </Link>
                            <Link to="#" onClick={toggleNavebarOpen} className="flex items-center gap-2 text-gray-600 hover:text-black">
                                <span className="text-sm">•</span> All Features
                            </Link>

                        </nav>
                    </div>



                </div>
            </div>
        </>
    )
}

export default Navbar