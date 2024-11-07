import React from 'react';

const LoadingSwirl = ({ size = '40px', color = 'blue-500' }) => { // Default size and color
  return (
    <div 
      className={`animate-spin rounded-full border-t-4 border-solid border-t-${color} border-r-transparent border-b-transparent border-l-transparent self-center m-24`}
      style={{ width: size, height: size }}
    ></div>
  );
};

export default LoadingSwirl;