import React from 'react'
import TopBar from '../Layout/TopBar'
import Navbar from './Navbar'

const Header = () => {
  return (
    <header>
        {/* top bar */}
        <TopBar/>
        {/* Nav bar */}
        <Navbar/>
        
    </header>
  )
}

export default Header