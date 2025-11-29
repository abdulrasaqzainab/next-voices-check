import React from 'react';

type Props = {
  className?: string;
};

export const SoundIcon: React.FC<Props> = ({ className = '' }) => (
  <svg viewBox="0 0 28 24" className={className} xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Sound waveform">
    <title>Sound waveform</title>
    <g fill="currentColor">
      {/*  small */}
      <rect x="0" y="10" width="2" height="6" rx="1.5" />
      {/* big -*/}
      <rect x="3" y="2" width="2" height="16" rx="1.5" />
      {/* big  */}
      <rect x="6" y="4" width="2" height="14" rx="1.5" />
      {/* small*/}
      <rect x="9" y="10" width="2" height="6" rx="1.5" />
      {/* big */}
      <rect x="12" y="1" width="2" height="20" rx="1.5" />
      {/* small*/}
      <rect x="15" y="11" width="2" height="8" rx="1.5" />
      {/* small */}
      <rect x="18" y="13" width="2" height="5" rx="1.5" />
      {/* small*/}
      <rect x="21" y="9" width="2" height="9" rx="1.5" />
      {/* big */}
      <rect x="24" y="6" width="2" height="12" rx="1.5" />
     
    </g>
  </svg>
);

export default SoundIcon;
