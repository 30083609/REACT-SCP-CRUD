import React from 'react'

const Landing = ({ onEnter }) => {
  return (
    <div className="landing-page">
      <h1 className="scp-title">SCP Database</h1>
      <img
        src="https://res.cloudinary.com/dfo9ahmct/image/upload/v1746529958/Landing_Secret_Forest_Vault_lgtvco.gif"
        alt="SCP Foundation Entrance"
        className="landing-image"
      />
      <button onClick={onEnter}>Enter Site</button>
    </div>
  )
}

export default Landing
