import React from 'react'
import './styles.css'

/*
 Landing page — first screen.  
 Props:
 onEnter: callback to show the main menu.
 */ 

const Landing = ({ onEnter }) => {
  return (
    <div className="landing-page">
      <img
        src="https://res.cloudinary.com/dfo9ahmct/image/upload/v1746527699/Entrance_fpyllf.webp"
        alt="Landing"
        className="landing-image"
      />

      <button onClick={onEnter}>Enter</button>
    </div>
  )
}

export default Landing
