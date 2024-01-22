

import React from 'react';
import customLogo from './pic_loading.jpg';

const loading = () => {
  const containerStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFD700',
    zIndex: 9999,
  };

  const imgStyle = {
    width: '150px',
    height: '150px',
    transform: 'rotate(0deg) scale(1)',
    animation: 'rotateZoom 1s linear infinite',
  };

  return (
    <div style={containerStyle}>
      <img src={customLogo} alt="Custom Logo" style={imgStyle} />
      <style>
        {`
          @keyframes rotateZoom {
            0% {
              transform: rotate(0deg) scale(1);
            }
            50% {
              transform: rotate(180deg) scale(1.2);
            }
            100% {
              transform: rotate(360deg) scale(1);
            }
          }

          body,
          html {
            height: 100%;
            margin: 0;
          }
        `}
      </style>
    </div>
  );
};

export default loading;
