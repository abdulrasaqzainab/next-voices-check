"use client";

import { useState } from 'react';
import { SoundIcon } from './SoundIcon'; 
export default function AudioCarousel() {
  const audios = [
    { src: '/za-african-next-voices/audio/Zulu1.wav', title: 'Zulu1' },
    { src: '/za-african-next-voices/audio/Zulu2.wav', title: 'Zulu2' },
    { src: '/za-african-next-voices/audio/Zulu3.wav', title: 'Zulu3' },
    { src: '/za-african-next-voices/audio/Xhosa1.wav', title: 'Xhosa1' },
  ];

  const total = audios.length;
  const [active, setActive] = useState(0);

  const goNext = () => setActive((p) => (p + 1) % total);
  const goPrev = () => setActive((p) => (p - 1 + total) % total);

  return (
    <section className="py-8 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <header className="mb-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold ">Audio Samples</h2>
          <p className="text-sm text-gray-600 mt-1">Listen to short clips from the dataset</p>
        </header>
        <div className="relative">
          {audios.map((a, i) => (
            <div
              key={a.src}
              className={`transition-opacity duration-300 ${active === i ? 'opacity-100' : 'opacity-0 absolute inset-0 pointer-events-none'}`}>
              <div className="w-full flex flex-col items-center justify-center py-16">
                <figure>
                  <SoundIcon className="w-32 md:w-48 lg:w-56 mb-6 text-[#212431]" />
                </figure>
                <div className="w-72 md:w-96 lg:w-[720px]">
                  <audio controls className="w-full h-12">
                    <source src={a.src} type="audio/wav" />
                    Your browser does not support the audio element.
                  </audio>
                </div>
              </div>
            </div>
          ))}

          {/* Controls */}
          <div className="flex justify-between mt-6 items-center">
            <button
              onClick={goPrev}
              aria-label="Previous"
              className="w-10 h-10 flex items-center justify-center rounded-full bg-[#212431] hover:bg-[#181a22] text-white transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </button>

            <div className="flex gap-1 items-center">
              {audios.map((_, idx) => (
                <span key={idx} className={`block h-2 w-2 rounded-full ${active === idx ? 'bg-[#212431]' : 'bg-gray-300'}`} />
              ))}
            </div>

            <button
              onClick={goNext}
              aria-label="Next"
              className="w-10 h-10 flex items-center justify-center rounded-full bg-[#212431] hover:bg-[#181a22] text-white transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
