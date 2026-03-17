import React, { useState } from 'react';

const BrandLogo = ({ className = "w-10 h-10" }) => {
  const [errorStatus, setErrorStatus] = useState(0); // 0: initial, 1: fallback, 2: text fallback

  if (errorStatus === 2) {
    return (
      <div className={`${className} bg-accent flex items-center justify-center text-white text-lg font-bold rounded-lg shadow-sm shrink-0`}>
        C
      </div>
    );
  }

  return (
    <div className={`${className} rounded-lg flex items-center justify-center overflow-hidden shadow-sm shrink-0`}>
      <img
        src={errorStatus === 0 ? "/image.png" : "/logo.png"}
        alt="Cloudlet"
        className="w-full h-full object-cover"
        onError={() => {
          if (errorStatus === 0) {
            setErrorStatus(1);
          } else {
            setErrorStatus(2);
          }
        }}
      />
    </div>
  );
};

export default BrandLogo;
