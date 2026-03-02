import React from 'react';

/**
 * SceneIQ logo — a stylised eye with AI viewfinder brackets.
 * Pass a unique `id` prop when rendering more than one instance on the same
 * page (e.g. Navbar + auth page) so the SVG gradient IDs don't collide.
 */
const Logo = ({ size = 40, id = 'logo' }) => {
  const gradId = `${id}-grad`;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 44 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradId} x1="4" y1="10" x2="40" y2="34" gradientUnits="userSpaceOnUse">
          <stop stopColor="#22d3ee" />
          <stop offset="1" stopColor="#a855f7" />
        </linearGradient>
      </defs>

      {/* Eye outline */}
      <path
        d="M22 11C13 11 5 22 5 22C5 22 13 33 22 33C31 33 39 22 39 22C39 22 31 11 22 11Z"
        stroke={`url(#${gradId})`}
        strokeWidth="2"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Iris */}
      <circle cx="22" cy="22" r="6.5" stroke={`url(#${gradId})`} strokeWidth="1.8" fill="none" />

      {/* Pupil */}
      <circle cx="22" cy="22" r="3" fill={`url(#${gradId})`} />

      {/* Viewfinder brackets — top-left (cyan) */}
      <path d="M5 17 L5 9 L13 9" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {/* Viewfinder brackets — top-right (cyan) */}
      <path d="M39 17 L39 9 L31 9" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {/* Viewfinder brackets — bottom-left (purple) */}
      <path d="M5 27 L5 35 L13 35" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {/* Viewfinder brackets — bottom-right (purple) */}
      <path d="M39 27 L39 35 L31 35" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export default Logo;
