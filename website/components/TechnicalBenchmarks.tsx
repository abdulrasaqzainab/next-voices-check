"use client";

import { Card, CardContent } from "@/components/ui/card";
import Carousel from "@/components/ui/carousel";
import { useEffect, useState } from "react";
import { fallbackStats, StatsType } from '@/lib/fallbackStats';

// This component dynamically loads the stats from the stats.json file
// making it easy to update benchmark data
export default function TechnicalBenchmarks() {
  const [stats, setStats] = useState<StatsType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    
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
          <Carousel>
            {/* Slide 0: ASR Performance Card */}
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

            {/* Slide 1: TTS Performance Card */}
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

            {/* Slide 2: Data Collection Stats */}
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
          </Carousel>
        </div>

        {/* <p className="text-center text-sm text-gray-500 mt-8">
          To update these benchmarks, edit the <code className="bg-gray-100 p-1 rounded">stats.json</code> file
        </p> */}
      </div>
    </section>
  );
}
