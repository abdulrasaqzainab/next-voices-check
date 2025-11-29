"use client";

import React from 'react';

interface SvgProvinceMapProps {
  provinceData: Record<string, number>;
  className?: string;
  height?: number;
}

const SvgProvinceMap: React.FC<SvgProvinceMapProps> = ({
  provinceData,
  className = '',
  height = 500,
}) => {
  const [hoveredProvince, setHoveredProvince] = React.useState<string | null>(null);

  // calculate color intensity based on speaker count
  const getColor = (province: string) => {
    const count = provinceData[province] || 0;
    const maxCount = Math.max(...Object.values(provinceData));
    const intensity = count / maxCount;
    
    if (hoveredProvince === province) {
      return `rgba(236, 72, 153, 0.7)`; // hover
    }
    
    //purple gradient based on intensity
    return `rgba(99, 102, 241, ${0.2 + intensity * 0.8})`;
  };

  //total for percentage calculation
  const total = Object.values(provinceData).reduce((a, b) => a + b, 0);

  //accurate province shapes and positions
  const provinces = [
    {
      name: 'Limpopo',
      path: 'M 380 80 L 520 80 L 560 95 L 580 120 L 580 160 L 560 180 L 520 180 L 500 170 L 480 180 L 460 180 L 440 190 L 420 180 L 400 170 L 380 160 Z',
      labelX: 480,
      labelY: 140,
    },
    {
      name: 'Mpumalanga',
      path: 'M 480 180 L 500 170 L 520 180 L 560 180 L 580 160 L 590 180 L 590 220 L 580 250 L 560 260 L 540 265 L 520 260 L 500 250 L 480 240 L 470 220 L 460 200 Z',
      labelX: 530,
      labelY: 220,
    },
    {
      name: 'Gauteng',
      path: 'M 420 180 L 440 190 L 460 180 L 470 220 L 460 240 L 440 250 L 420 240 L 410 220 L 400 200 Z',
      labelX: 435,
      labelY: 215,
    },
    {
      name: 'North West',
      path: 'M 280 160 L 380 160 L 400 170 L 420 180 L 410 220 L 420 240 L 400 260 L 380 270 L 340 270 L 320 260 L 300 240 L 280 220 L 270 200 L 270 180 Z',
      labelX: 340,
      labelY: 215,
    },
    {
      name: 'Free State',
      path: 'M 320 260 L 340 270 L 380 270 L 400 260 L 420 240 L 440 250 L 460 240 L 480 240 L 490 260 L 490 290 L 480 320 L 460 340 L 440 350 L 420 360 L 400 360 L 380 350 L 360 340 L 340 320 L 320 300 L 310 280 Z',
      labelX: 400,
      labelY: 305,
    },
    {
      name: 'KwaZulu-Natal',
      path: 'M 480 240 L 500 250 L 520 260 L 540 265 L 560 260 L 575 270 L 585 290 L 590 320 L 585 350 L 575 380 L 560 405 L 540 425 L 520 435 L 500 440 L 480 435 L 460 420 L 450 400 L 450 380 L 460 360 L 470 340 L 480 320 L 490 290 L 490 260 Z',
      labelX: 520,
      labelY: 340,
    },
    {
      name: 'Eastern Cape',
      path: 'M 340 320 L 360 340 L 380 350 L 400 360 L 420 360 L 440 350 L 460 340 L 480 320 L 480 435 L 500 440 L 520 435 L 510 450 L 490 470 L 470 485 L 440 495 L 410 500 L 380 500 L 350 495 L 320 480 L 300 460 L 280 430 L 270 400 L 270 370 L 280 350 L 300 330 Z',
      labelX: 380,
      labelY: 415,
    },
    {
      name: 'Western Cape',
      path: 'M 160 360 L 200 350 L 240 350 L 270 360 L 280 380 L 280 400 L 270 420 L 280 440 L 300 460 L 320 480 L 340 495 L 320 510 L 290 520 L 260 525 L 230 525 L 200 520 L 170 510 L 145 495 L 125 475 L 110 450 L 100 420 L 105 390 L 120 370 Z',
      labelX: 220,
      labelY: 450,
    },
    {
      name: 'Northern Cape',
      path: 'M 160 100 L 280 100 L 270 140 L 270 180 L 280 200 L 280 220 L 270 240 L 280 260 L 300 260 L 310 280 L 320 300 L 300 330 L 280 350 L 270 370 L 270 400 L 260 420 L 240 430 L 220 420 L 200 400 L 180 370 L 170 340 L 160 310 L 150 270 L 145 230 L 145 190 L 150 150 L 155 120 Z',
      labelX: 220,
      labelY: 260,
    },
  ];

  return (
    <div className={`svg-province-map ${className}`}>
      <svg
        viewBox="0 0 700 600"
        style={{
          width: '100%',
          height: `${height}px`,
          maxWidth: '700px',
          margin: '0 auto',
          display: 'block',
        }}
      >
        {/* Province shapes */}
        {provinces.map((province) => {
          const count = provinceData[province.name] || 0;
          
          return (
            <g key={province.name}>
              <path
                d={province.path}
                fill={getColor(province.name)}
                stroke="rgba(99, 102, 241, 0.6)"
                strokeWidth="2"
                style={{
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={() => setHoveredProvince(province.name)}
                onMouseLeave={() => setHoveredProvince(null)}
              />
              {/* Province labels */}
              <text
                x={province.labelX}
                y={province.labelY}
                textAnchor="middle"
                fill="#374151"
                fontSize="14"
                fontWeight="600"
                pointerEvents="none"
                style={{
                  textShadow: '1px 1px 2px white, -1px -1px 2px white',
                }}
              >
                {province.name}
              </text>
              {count > 0 && (
                <text
                  x={province.labelX}
                  y={province.labelY + 18}
                  textAnchor="middle"
                  fill="#6366f1"
                  fontSize="16"
                  fontWeight="700"
                  pointerEvents="none"
                  style={{
                    textShadow: '1px 1px 2px white, -1px -1px 2px white',
                  }}
                >
                  {count}
                </text>
              )}
            </g>
          );
        })}

        {/* Title */}
        <text
          x="350"
          y="50"
          textAnchor="middle"
          fontSize="24"
          fontWeight="700"
          fill="#6366f1"
        >
          South Africa - Speaker Distribution
        </text>
      </svg>

      {/* Hover tooltip */}
      {hoveredProvince && provinceData[hoveredProvince] && (
        <div
          className="mt-4 p-4 bg-white border-2 border-indigo-500 rounded-lg shadow-lg"
          style={{
            animation: 'fadeIn 0.2s ease-in',
          }}
        >
          <div className="flex items-start justify-between">
            <div>
              <h4 className="text-lg font-bold text-indigo-600">
                {hoveredProvince}
              </h4>
              <div className="mt-2 space-y-1 text-sm text-gray-700">
                <div>
                  <span className="font-semibold">Speakers:</span>{' '}
                  <span className="text-indigo-600 font-bold">
                    {provinceData[hoveredProvince]}
                  </span>
                </div>
                <div>
                  <span className="font-semibold">Percentage:</span>{' '}
                  <span className="text-pink-600 font-bold">
                    {((provinceData[hoveredProvince] / total) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
            <div className="ml-4 px-3 py-2 bg-indigo-100 rounded-lg">
              <div className="text-xs text-indigo-600 font-medium">Rank</div>
              <div className="text-2xl font-bold text-indigo-700">
                #
                {Object.entries(provinceData)
                  .sort(([, a], [, b]) => b - a)
                  .findIndex(([name]) => name === hoveredProvince) + 1}
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default SvgProvinceMap;
