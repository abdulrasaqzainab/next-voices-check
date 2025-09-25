'use client';

import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { fallbackStats, StatsType } from '@/lib/fallbackStats';

// This component dynamically loads the stats from the stats.json file
// making it easy to update benchmark data
export default function TechnicalBenchmarks() {
  const [stats, setStats] = useState<StatsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeCard, setActiveCard] = useState(0);
  
  // Total number of cards to display
  const totalCards = 3;

  const goToNextCard = () => {
    setActiveCard((prev) => (prev + 1) % totalCards);
  };

  const goToPrevCard = () => {
    setActiveCard((prev) => (prev - 1 + totalCards) % totalCards);
  };

  useEffect(() => {
    // For GitHub Pages deployment, we're directly using the fallbackStats
    // instead of fetching from an API endpoint
    setStats(fallbackStats);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <section className="py-12 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Technical Benchmarks</h2>
          <div className="text-center">Loading benchmark data...</div>
        </div>
      </section>
    );
  }

  if (!stats) {
    return (
      <section className="py-12 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Technical Benchmarks</h2>
          <div className="text-center">Failed to load benchmark data.</div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-white">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-8">Technical Benchmarks</h2>
        
        <div className="w-full max-w-4xl mx-auto">
          {/* Carousel Container */}
          <div className="relative">
            {/* Card 0: ASR Performance Card */}
            <div className={`transition-opacity duration-300 ${activeCard === 0 ? 'opacity-100' : 'opacity-0 absolute inset-0 pointer-events-none'}`}>
              <Card className="w-full">
                <CardContent className="h-96 overflow-y-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {stats.modelPerformance?.speechToText?.werScores && 
                      Object.entries(stats.modelPerformance.speechToText.werScores).map(([language, score]) => (
                        <Card key={language} className="bg-gray-50 border-0">
                          <CardContent className="pt-4">
                            <h3 className="font-semibold mb-1">{language}</h3>
                            <div className="text-xl font-bold">{String(score)}%</div>
                            <div className="mt-2 text-sm text-gray-500">
                              <span className="text-green-600">↓ {stats.modelPerformance.speechToText.improvementFromBaseline[language]}%</span> from baseline
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Card 1: TTS Performance Card */}
            <div className={`transition-opacity duration-300 ${activeCard === 1 ? 'opacity-100' : 'opacity-0 absolute inset-0 pointer-events-none'}`}>
              <Card className="w-full">
                <CardContent className="h-96 overflow-y-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {stats.modelPerformance?.textToSpeech?.mosScores && 
                      Object.entries(stats.modelPerformance.textToSpeech.mosScores).map(([language, score]) => (
                        <Card key={language} className="bg-gray-50 border-0">
                          <CardContent className="pt-4">
                            <h3 className="font-semibold mb-1">{language}</h3>
                            <div className="text-xl font-bold">{String(score)}/5.0</div>
                            <div className="mt-2 text-sm text-gray-500">
                              Quality rating
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Card 2: Data Collection Stats */}
            <div className={`transition-opacity duration-300 ${activeCard === 2 ? 'opacity-100' : 'opacity-0 absolute inset-0 pointer-events-none'}`}>
              <Card className="w-full">
                <CardContent className="h-96 overflow-y-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {stats.dataCollection?.audioHours?.byLanguage && 
                      Object.entries(stats.dataCollection.audioHours.byLanguage).map(([language, hours]) => (
                        <Card key={language} className="bg-gray-50 border-0">
                          <CardContent className="pt-4">
                            <h3 className="font-semibold mb-1">{language}</h3>
                            <div className="text-xl font-bold">{String(hours)} hours</div>
                            <div className="mt-2 text-sm text-gray-500">
                              {Math.round(Number(hours) / stats.dataCollection.audioHours.total * 100)}% of total
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Navigation Controls */}
            <div className="flex justify-between mt-6 items-center">
              <button
                onClick={goToPrevCard}
                aria-label="Previous"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-[#212431] hover:bg-[#181a22] text-white transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </button>

              <div className="flex gap-1 items-center">
                {[...Array(totalCards)].map((_, index) => (
                  <span
                    key={index}
                    className={`block h-2 w-2 rounded-full ${activeCard === index ? 'bg-[#212431]' : 'bg-gray-300'}`}
                  />
                ))}
              </div>

              <button
                onClick={goToNextCard}
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

        {/* <p className="text-center text-sm text-gray-500 mt-8">
          To update these benchmarks, edit the <code className="bg-gray-100 p-1 rounded">stats.json</code> file
        </p> */}
      </div>
    </section>
  );
}
