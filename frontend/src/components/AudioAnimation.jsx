import React from 'react';
import '../index.css'

const AnimatedGlowingOrb = ({ isRecording}) => {
    return (
      <div className={`orb-container ${isRecording ? 'active' : 'inactive'}`}>
        <div className="orb" />
      </div>
    );
  };
  
  export default AnimatedGlowingOrb;