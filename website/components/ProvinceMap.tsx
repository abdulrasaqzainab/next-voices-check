"use client";

import React, { useEffect, useRef, useMemo } from 'react';
import { topology } from '../../data/MapTopology';

interface LanguageData {
  language: string;
  percentage: number;
  speakers: number;
}

interface ProvinceMapProps {
  provinceData?: Record<string, number>;
  provinceLanguageData?: Record<string, LanguageData>;
  className?: string;
  height?: number;
}

const ProvinceMap: React.FC<ProvinceMapProps> = ({
  provinceData,
  provinceLanguageData,
  className = '',
  height = 500,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<Highcharts.Chart | null>(null);

  //province code mapping 
  const provinceCodeMap: Record<string, string> = useMemo(() => ({
    'Eastern Cape': 'za-ec',
    'Free State': 'za-fs',
    'Gauteng': 'za-gt',
    'KwaZulu-Natal': 'za-nl',
    'Limpopo': 'za-np',  //changed from za-lp to za-np to match topology
    'Mpumalanga': 'za-mp',
    'Northern Cape': 'za-nc',
    'North West': 'za-nw',
    'Western Cape': 'za-wc',
  }), []);

  // Intensity-based color mapping (yellow to red gradient)
  const getIntensityColor = (percentage: number): string => {
    if (percentage >= 70) return '#7F1D1D'; // Dark red
    if (percentage >= 60) return '#DC2626'; // Red
    if (percentage >= 40) return '#F59E0B'; // Orange
    if (percentage >= 25) return '#FCD34D'; // Yellow
    return '#FEF3C7'; // Light yellow
  };

  useEffect(() => {
    let isMounted = true;
    
    const initializeMap = async () => {
      if (!containerRef.current || typeof window === 'undefined') return;

      try {
        const Highcharts = (await import('highcharts/highmaps')).default;
        
        if (!isMounted) return;

        console.log('ProvinceMap initializing...');

        // Always try to load CSV data first for most accurate information
        try {
          const response = await fetch('/csv/province_language_stats.csv');
          if (response.ok) {
            const csvText = await response.text();
            const rows = csvText.trim().split('\n').map(row => row.split(','));
            console.log('CSV loaded successfully, rows:', rows.length);

            const getProvinceCode = (province: string): string | null => {
              return provinceCodeMap[province] || null;
            };

            const processedData = rows.slice(1).map((row) => {
              const [province, dominantLanguage, , totalHours, , , , , percentage] = row;
              const provinceCode = getProvinceCode(province.trim());
              const hours = parseFloat(totalHours);
              const dominancePercentage = parseFloat(percentage);
              
              console.log(`Processing: ${province} -> ${provinceCode}, Language: ${dominantLanguage}, Hours: ${hours}, Percentage: ${dominancePercentage}%`);
              
              return {
                'hc-key': provinceCode,
                name: province.trim(),
                value: hours, // Use total hours for color intensity
                dominantLanguage: dominantLanguage.trim(),
                totalHours: hours,
                dominancePercentage: dominancePercentage
              };
            }).filter(item => item['hc-key'] !== null);

            console.log('Processed CSV data:', processedData);

            // Find min and max hours for color scale
            const hours = processedData.map(d => d.totalHours);
            const minHours = Math.min(...hours);
            const maxHours = Math.max(...hours);
            
            console.log(`Hours range: ${minHours} - ${maxHours}`);

            const chart = Highcharts.mapChart(containerRef.current, {
              chart: {
                map: topology,
                backgroundColor: 'transparent',
                height: height,
              },

              title: {
                text: '',
              },

              colorAxis: {
                min: minHours,
                max: maxHours,
                stops: [
                  [0, '#FEF3C7'],        // Light yellow (lowest hours)
                  [0.3, '#FCD34D'],      // Yellow
                  [0.6, '#F59E0B'],      // Orange
                  [0.8, '#DC2626'],      // Red
                  [1, '#7F1D1D']         // Dark red (highest hours)
                ],
                labels: {
                  style: {
                    color: '#374151',
                  },
                  format: '{value:.0f}h'
                },
              },

              legend: {
                enabled: true,
                align: 'right',
                verticalAlign: 'middle',
                layout: 'vertical',
                itemStyle: {
                  color: '#374151',
                  fontSize: '12px',
                },
                title: {
                  text: 'Total Audio Hours',
                  style: {
                    color: '#374151',
                    fontWeight: 'bold',
                  },
                },
              },

              tooltip: {
                useHTML: true,
                backgroundColor: '#ffffff',
                borderWidth: 2,
                borderColor: 'rgba(59, 130, 246, 0.8)',
                borderRadius: 8,
                shadow: {
                  color: 'rgba(0, 0, 0, 0.1)',
                  offsetX: 2,
                  offsetY: 2,
                  opacity: 0.3,
                  width: 3,
                },
                padding: 12,
                style: {
                  fontSize: '14px',
                },
                formatter: function () {
                  const point = (this as any).point;
                  const provinceName = point.name;
                  const language = point.dominantLanguage;
                  const hours = point.totalHours;
                  const percentage = point.dominancePercentage;
                  
                  // Color based on hours intensity
                  const normalizedHours = (hours - minHours) / (maxHours - minHours);
                  let intensityColor = '#FEF3C7'; // Default light yellow
                  if (normalizedHours >= 0.8) intensityColor = '#7F1D1D'; // Dark red
                  else if (normalizedHours >= 0.6) intensityColor = '#DC2626'; // Red
                  else if (normalizedHours >= 0.3) intensityColor = '#F59E0B'; // Orange
                  else if (normalizedHours >= 0.15) intensityColor = '#FCD34D'; // Yellow
                  
                  return `
                    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                      <div style="
                        font-size: 16px; 
                        font-weight: 600; 
                        color: ${intensityColor}; 
                        margin-bottom: 8px;
                        border-bottom: 2px solid ${intensityColor};
                        padding-bottom: 6px;
                      ">
                        ${provinceName}
                      </div>
                      <div style="color: #374151; margin-top: 8px;">
                        <div style="margin: 4px 0;">
                          <span style="font-weight: 600;">Total Audio:</span> 
                          <span style="color: ${intensityColor}; font-weight: 600;">${hours.toFixed(1)} hours</span>
                        </div>
                        <div style="margin: 4px 0;">
                          <span style="font-weight: 600;">Most Spoken:</span> 
                          <span style="color: ${intensityColor}; font-weight: 600;">${language}</span>
                        </div>
                        <div style="margin: 4px 0;">
                          <span style="font-weight: 600;">Dominance:</span> 
                          <span style="color: #6366f1; font-weight: 600;">${percentage}%</span>
                        </div>
                      </div>
                    </div>
                  `;
                },
              },

              plotOptions: {
                map: {
                  states: {
                    hover: {
                      brightness: 0.3,
                      borderColor: '#000000',
                      borderWidth: 2,
                    },
                  },
                },
              },

              series: [
                {
                  type: 'map',
                  name: 'Audio Collection by Province',
                  data: processedData,
                  joinBy: 'hc-key',
                  borderColor: 'rgba(255, 255, 255, 0.8)',
                  borderWidth: 2,
                  nullColor: 'rgba(229, 231, 235, 0.3)',
                  dataLabels: {
                    enabled: true,
                    format: '{point.name}<br/><span style="font-size: 9px;">{point.totalHours:.0f}h ({point.dominantLanguage})</span>',
                    style: {
                      color: '#ffffff',
                      fontWeight: '600',
                      fontSize: '9px',
                      textOutline: '2px black',
                    },
                  },
                } as any,
              ],

              credits: {
                enabled: false,
              },

              responsive: {
                rules: [
                  {
                    condition: {
                      maxWidth: 500,
                    },
                    chartOptions: {
                      legend: {
                        enabled: false,
                      },
                      dataLabels: {
                        enabled: false,
                      },
                    },
                  },
                ],
              },
            });

            if (isMounted) {
              chartRef.current = chart;
            }
            return; // Exit early if CSV loaded successfully
          }
        } catch (csvError) {
          console.log('Could not load CSV, falling back to prop data:', csvError);
        }

        // Fallback: Handle language-based map from props
        if (provinceLanguageData) {
          console.log('Processing province language data...');
          console.log('Available provinces:', Object.keys(provinceLanguageData));
          console.log('Available codes:', Object.keys(provinceCodeMap));
          
          const mapData = Object.entries(provinceLanguageData).map(([province, data]) => {
            const code = provinceCodeMap[province];
            console.log(`Mapping ${province} -> ${code}`, data);
            if (!code) {
              console.warn(`No code found for province: ${province}`);
              return null;
            }
            
            return {
              'hc-key': code,
              name: province,
              language: data.language,
              percentage: data.percentage,
              speakers: data.speakers,
              value: data.percentage  // Use percentage for color intensity
            };
          }).filter(Boolean);

          // Find min and max percentages for color scale
          const percentages = mapData.filter(d => d !== null).map(d => d.percentage);
          const minPercentage = Math.min(...percentages);
          const maxPercentage = Math.max(...percentages);

          const chart = Highcharts.mapChart(containerRef.current, {
            chart: {
              map: topology,
              backgroundColor: 'transparent',
              height: height,
            },

            title: {
              text: '',
            },

            colorAxis: {
              min: minPercentage,
              max: maxPercentage,
              stops: [
                [0, '#FEF3C7'],        // Light yellow
                [0.3, '#FCD34D'],      // Yellow
                [0.6, '#F59E0B'],      // Orange
                [0.8, '#DC2626'],      // Red
                [1, '#7F1D1D']         // Dark red
              ],
              labels: {
                style: {
                  color: '#374151',
                },
                format: '{value}%'
              },
            },

            legend: {
              enabled: true,
              align: 'right',
              verticalAlign: 'middle',
              layout: 'vertical',
              itemStyle: {
                color: '#374151',
                fontSize: '12px',
              },
              title: {
                text: 'Language Dominance (%)',
                style: {
                  color: '#374151',
                  fontWeight: 'bold',
                },
              },
            },

            tooltip: {
              useHTML: true,
              backgroundColor: '#ffffff',
              borderWidth: 2,
              borderColor: 'rgba(59, 130, 246, 0.8)',
              borderRadius: 8,
              shadow: {
                color: 'rgba(0, 0, 0, 0.1)',
                offsetX: 2,
                offsetY: 2,
                opacity: 0.3,
                width: 3,
              },
              padding: 12,
              style: {
                fontSize: '14px',
              },
              formatter: function () {
                const point = (this as any).point;
                const provinceName = point.name;
                const language = point.language;
                const percentage = point.percentage;
                const speakers = point.speakers;
                
                // Color based on intensity (percentage)
                let intensityColor = '#FEF3C7'; // Default light yellow
                if (percentage >= 70) intensityColor = '#7F1D1D'; // Dark red
                else if (percentage >= 60) intensityColor = '#DC2626'; // Red
                else if (percentage >= 40) intensityColor = '#F59E0B'; // Orange
                else if (percentage >= 25) intensityColor = '#FCD34D'; // Yellow
                
                return `
                  <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                    <div style="
                      font-size: 16px; 
                      font-weight: 600; 
                      color: ${intensityColor}; 
                      margin-bottom: 8px;
                      border-bottom: 2px solid ${intensityColor};
                      padding-bottom: 6px;
                    ">
                      ${provinceName}
                    </div>
                    <div style="color: #374151; margin-top: 8px;">
                      <div style="margin: 4px 0;">
                        <span style="font-weight: 600;">Most Spoken:</span> 
                        <span style="color: ${intensityColor}; font-weight: 600;">${language}</span>
                      </div>
                      <div style="margin: 4px 0;">
                        <span style="font-weight: 600;">Dominance:</span> 
                        <span style="color: ${intensityColor}; font-weight: 600;">${percentage}%</span>
                      </div>
                      <div style="margin: 4px 0;">
                        <span style="font-weight: 600;">Dataset Speakers:</span> 
                        <span style="color: #6366f1;">${speakers.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                `;
              },
            },

            plotOptions: {
              map: {
                states: {
                  hover: {
                    brightness: 0.3,
                    borderColor: '#000000',
                    borderWidth: 2,
                  },
                },
              },
            },

            series: [
              {
                type: 'map',
                name: 'Language Dominance by Province',
                data: mapData,
                joinBy: 'hc-key',
                borderColor: 'rgba(255, 255, 255, 0.8)',
                borderWidth: 2,
                nullColor: 'rgba(229, 231, 235, 0.3)',
                dataLabels: {
                  enabled: true,
                  format: '{point.name}<br/><span style="font-size: 9px;">{point.language} ({point.percentage}%)</span>',
                  style: {
                    color: '#ffffff',
                    fontWeight: '600',
                    fontSize: '9px',
                    textOutline: '2px black',
                  },
                },
              } as any,
            ],

            credits: {
              enabled: false,
            },

            responsive: {
              rules: [
                {
                  condition: {
                    maxWidth: 500,
                  },
                  chartOptions: {
                    legend: {
                      enabled: false,
                    },
                    dataLabels: {
                      enabled: false,
                    },
                  },
                },
              ],
            },
          });

          if (isMounted) {
            chartRef.current = chart;
          }

        } else if (provinceData) {
          // Fallback to old speaker count map
          const mapData = Object.entries(provinceData).map(([province, count]) => {
            const code = provinceCodeMap[province];
            return code ? [code, count] : null;
          }).filter(Boolean);

          const maxValue = Math.max(...Object.values(provinceData));

          const chart = Highcharts.mapChart(containerRef.current, {
            chart: {
              map: topology,
              backgroundColor: 'transparent',
              height: height,
            },

            title: {
              text: '',
            },

            colorAxis: {
              min: 0,
              max: maxValue,
              stops: [
                [0, 'rgba(99, 102, 241, 0.2)'],
                [0.5, 'rgba(99, 102, 241, 0.6)'],
                [1, 'rgba(99, 102, 241, 1)'],
              ],
            },

            legend: {
              enabled: true,
              title: {
                text: 'Speakers',
                style: {
                  color: '#374151',
                  fontWeight: 'bold',
                },
              },
            },

            tooltip: {
              useHTML: true,
              backgroundColor: '#ffffff',
              borderWidth: 2,
              borderColor: 'rgba(99, 102, 241, 0.8)',
              borderRadius: 8,
              formatter: function () {
                const point = (this as any).point;
                const provinceName = point.name;
                const value = point.value || 0;
                const total = Object.values(provinceData).reduce((a, b) => a + b, 0);
                const percentage = ((value / total) * 100).toFixed(1);
                
                return `
                  <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                    <div style="
                      font-size: 16px; 
                      font-weight: 600; 
                      color: #6366f1; 
                      margin-bottom: 8px;
                      border-bottom: 2px solid #6366f1;
                      padding-bottom: 6px;
                    ">
                      ${provinceName}
                    </div>
                    <div style="color: #374151; margin-top: 8px;">
                      <div style="margin: 4px 0;">
                        <span style="font-weight: 600;">Speakers:</span> 
                        <span style="color: #6366f1; font-weight: 600;">${value.toLocaleString()}</span>
                      </div>
                      <div style="margin: 4px 0;">
                        <span style="font-weight: 600;">Percentage:</span> 
                        <span style="color: #ec4899;">${percentage}%</span>
                      </div>
                    </div>
                  </div>
                `;
              },
            },

            series: [
              {
                type: 'map',
                name: 'Speakers by Province',
                data: mapData as [string, number][],
                joinBy: ['hc-key', 0] as [string, number],
                borderColor: 'rgba(99, 102, 241, 0.4)',
                borderWidth: 1,
                nullColor: 'rgba(229, 231, 235, 0.3)',
              },
            ] as Highcharts.SeriesOptionsType[],

            credits: {
              enabled: false,
            },
          });

          if (isMounted) {
            chartRef.current = chart;
          }
        }

      } catch (error) {
        console.error('Error initializing map:', error);
        console.error('Error details:', error instanceof Error ? error.message : String(error));
        console.error('Stack:', error instanceof Error ? error.stack : 'No stack available');
        if (containerRef.current && isMounted) {
          containerRef.current.innerHTML = `
            <div style="
              text-align: center; 
              padding: 50px; 
              color: #6b7280; 
              background: rgba(243, 244, 246, 0.5); 
              border-radius: 8px;
              border: 2px dashed rgba(220, 38, 38, 0.3);
            ">
              <h3 style="color: #dc2626; margin: 0 0 8px 0;">Map Error</h3>
              <p style="color: #6b7280; margin: 0; font-size: 14px;">Error: ${String(error)}</p>
              <p style="color: #6b7280; margin: 8px 0 0 0; font-size: 12px;">Check browser console for details</p>
            </div>
          `;
        }
      }
    };

    initializeMap();

    return () => {
      isMounted = false;
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, [provinceData, provinceLanguageData, height, provinceCodeMap]);

  //handle resize
  useEffect(() => {
    const handleResize = () => {
      if (chartRef.current) {
        chartRef.current.reflow();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div
      ref={containerRef}
      className={`province-map-container ${className}`}
      style={{
        width: '100%',
        height: `${height}px`,
        minHeight: '300px',
        position: 'relative',
      }}
    />
  );
};

export default ProvinceMap;