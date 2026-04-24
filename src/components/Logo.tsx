import React from 'react';

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: number;
}

export const Logo: React.FC<LogoProps> = ({ className = '', showText = true, size = 32 }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div 
        className="relative flex items-center justify-center shrink-0"
        style={{ width: size, height: size }}
      >
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <defs>
            {/* Filter for subtle 3D lift */}
            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="2" />
              <feOffset dx="1" dy="2" result="offsetblur" />
              <feComponentTransfer>
                <feFuncA type="linear" slope="0.3" />
              </feComponentTransfer>
              <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Gradient for the main white body */}
            <linearGradient id="white_body" x1="20" y1="10" x2="60" y2="90" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FFFFFF" />
              <stop offset="0.5" stopColor="#F8F9FA" />
              <stop offset="1" stopColor="#E5E7EB" />
            </linearGradient>

            {/* Vibrant, high-contrast yellow gradient for the swoosh */}
            <linearGradient id="yellow_vibrant" x1="60" y1="45" x2="90" y2="85" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FFD700" />
              <stop offset="0.4" stopColor="#FBBF24" />
              <stop offset="0.8" stopColor="#D97706" />
              <stop offset="1" stopColor="#92400E" />
            </linearGradient>

            {/* Glossy overlay gradient */}
            <linearGradient id="gloss" x1="30" y1="10" x2="30" y2="40" gradientUnits="userSpaceOnUse">
              <stop stopColor="white" stopOpacity="0.8" />
              <stop offset="1" stopColor="white" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Main stylized R shape */}
          <path
            d="M22 20C22 15.5817 25.5817 12 30 12H65C76.0457 12 85 20.9543 85 32V38C85 49.0457 76.0457 58 65 58H42V88C42 91.3137 39.3137 94 36 94H28C24.6863 94 22 91.3137 22 88V20Z"
            fill="url(#white_body)"
            filter="url(#shadow)"
          />

          {/* Internal R cutout */}
          <path
            d="M42 27H60C62.7614 27 65 29.2386 65 32C65 34.7614 62.7614 37 60 37H42V27Z"
            fill="#E5E7EB"
            opacity="0.5"
          />

          {/* Realistic High-Intensity Yellow Swoosh */}
          <path
            d="M58 58L78 92C79.5 94.5 83 94.5 84.5 92L98 68C94 53 83 48 73 48C68 48 63 51 58 58Z"
            fill="url(#yellow_vibrant)"
            filter="url(#shadow)"
          />

          {/* Glossy Highlight on the white body top */}
          <path
            d="M30 12H65C70 12 75 14 78 18L30 18C26 18 22 16 22 14C22 13 26 12 30 12Z"
            fill="url(#gloss)"
            opacity="0.6"
          />
        </svg>
      </div>
      {showText && (
        <span className="font-black text-[#003A8F] tracking-tighter" style={{ fontSize: size * 0.6 }}>
          PayRaya
        </span>
      )}
    </div>
  );
};
