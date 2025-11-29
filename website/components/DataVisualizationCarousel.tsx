"use client";

import Carousel from "@/components/ui/carousel";
import Image from "next/image";
import * as React from "react";

export default function DataVisualizationCarousel() {
  const images = [
    { src: '/za-african-next-voices/images/Stats_On_WWW.png', title: 'Website statistics overview' },
    { src: '/za-african-next-voices/images/Stats_On_WWW_2.png', title: 'Detailed dataset breakdown' },
    { src: '/za-african-next-voices/images/sa_map1.PNG', title: 'Language distribution by hometown and gender across South Africa' },
    { src: '/za-african-next-voices/images/sa_map2.PNG', title: 'Language distribution by birthplace and gender across South Africa' },
  ];

  return (
    <section className="py-8 bg-white">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-6">Data Visualizations</h2>
        <Carousel>
          {images.map((img, idx) => (
            <figure key={idx} className="w-full flex flex-col items-center justify-center py-8">
              {/* Title above the image */}
              <h3 className="mb-4 text-center text-lg md:text-xl font-semibold text-gray-800">{img.title}</h3>
              {/* Use Next.js Image for optimization */}
              <Image src={img.src} alt={img.title} width={1200} height={560} className="w-full max-h-[560px] object-contain rounded-lg shadow-md" />
            </figure>
          ))}
        </Carousel>
      </div>
    </section>
  );
}
