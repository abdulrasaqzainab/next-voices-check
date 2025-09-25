'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { fallbackStats, StatsType } from '@/lib/fallbackStats';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  RadialLinearScale,
  TooltipItem,
} from 'chart.js';
import { Bar, Doughnut, Radar } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  RadialLinearScale
);

// Custom color palette for charts
const colors = {
  primary: [
    'rgba(99, 102, 241, 0.8)',
    'rgba(79, 70, 229, 0.8)',
    'rgba(67, 56, 202, 0.8)',
    'rgba(55, 48, 163, 0.8)',
    'rgba(49, 46, 129, 0.8)',
  ],
  secondary: [
    'rgba(236, 72, 153, 0.8)',
    'rgba(219, 39, 119, 0.8)',
    'rgba(190, 24, 93, 0.8)',
    'rgba(157, 23, 77, 0.8)',
    'rgba(131, 24, 67, 0.8)',
  ],
  tertiary: [
    'rgba(16, 185, 129, 0.8)',
    'rgba(5, 150, 105, 0.8)',
    'rgba(4, 120, 87, 0.8)',
    'rgba(6, 95, 70, 0.8)',
    'rgba(6, 78, 59, 0.8)',
  ],
};

export default function StatsVisualization() {
  const [stats, setStats] = useState<StatsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeCard, setActiveCard] = useState(0);
  
  // Total number of cards to display
  const totalCards = 4;

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

  if (loading || !stats) {
    return (
      <section className="py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Dataset Statistics</h2>
          <div className="text-center py-12">{loading ? "Loading statistics..." : "Failed to load statistics."}</div>
        </div>
      </section>
    );
  }

  // Prepare data for language distribution chart
  const languageData = {
    labels: Object.keys(stats.dataCollection.audioHours.byLanguage),
    datasets: [
      {
        label: 'Audio Hours',
        data: Object.values(stats.dataCollection.audioHours.byLanguage),
        backgroundColor: colors.primary,
        borderColor: colors.primary.map(color => color.replace('0.8', '1')),
        borderWidth: 1,
      },
      {
        label: 'Transcribed Hours',
        data: Object.keys(stats.dataCollection.audioHours.byLanguage).map(
          lang => stats.dataCollection.transcribedHours.byLanguage[lang] || 0
        ),
        backgroundColor: colors.secondary,
        borderColor: colors.secondary.map(color => color.replace('0.8', '1')),
        borderWidth: 1,
      },
    ],
  };

  // Prepare data for speaker demographics (gender) chart
  const genderData = {
    labels: Object.keys(stats.dataCollection.speakers.byGender),
    datasets: [
      {
        data: Object.values(stats.dataCollection.speakers.byGender),
        backgroundColor: colors.tertiary,
        borderColor: '#ffffff',
        borderWidth: 2,
      },
    ],
  };

  // Prepare data for model performance radar chart
  const performanceData = {
    labels: Object.keys(stats.modelPerformance.speechToText.werScores),
    datasets: [
      {
        label: 'WER Score (%)',
        data: Object.values(stats.modelPerformance.speechToText.werScores),
        backgroundColor: 'rgba(99, 102, 241, 0.2)',
        borderColor: 'rgba(99, 102, 241, 1)',
        borderWidth: 2,
      },
      {
        label: 'MOS Score (normalized to 0-100)',
        data: Object.keys(stats.modelPerformance.textToSpeech.mosScores).map(
          lang => {
            // Normalize MOS scores (1-5) to 0-100 scale for radar chart comparison
            const mosScore = stats.modelPerformance.textToSpeech.mosScores[lang];
            return (mosScore / 5) * 100;
          }
        ),
        backgroundColor: 'rgba(236, 72, 153, 0.2)',
        borderColor: 'rgba(236, 72, 153, 1)',
        borderWidth: 2,
      },
    ],
  };

  // Options for bar chart
  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Language Distribution (Hours)',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  // Options for radar chart
  const radarOptions = {
    responsive: true,
    scales: {
      r: {
        beginAtZero: true,
        max: 100,
        ticks: {
          stepSize: 20,
        },
      },
    },
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Model Performance by Language',
      },
      tooltip: {
        callbacks: {
          label: function(context: TooltipItem<'radar'>) {
            const label = context.dataset.label || '';
            if (label === 'MOS Score (normalized to 0-100)') {
              // Convert back to 1-5 scale for the tooltip
              const value = (Number(context.raw) / 100) * 5;
              return `MOS Score: ${value.toFixed(1)}/5`;
            } else {
              return `WER Score: ${context.raw}%`;
            }
          }
        }
      }
    },
  };

  // Options for doughnut chart
  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right' as const,
      },
      title: {
        display: true,
        text: 'Speaker Demographics',
      },
    },
  };

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-8">Dataset Statistics</h2>
        
        <div className="w-full max-w-4xl mx-auto">
          {/* Carousel Container */}
          <div className="relative">
            {/* Card 0: Language Distribution Chart */}
            <div className={`transition-opacity duration-300 ${activeCard === 0 ? 'opacity-100' : 'opacity-0 absolute inset-0 pointer-events-none'}`}>
              <Card className="w-full">
                <CardHeader>
                  <CardTitle>Language Distribution</CardTitle>
                  <CardDescription>Audio hours collected and transcribed per language</CardDescription>
                </CardHeader>
                <CardContent className="h-96">
                  <Bar data={languageData} options={barOptions} />
                </CardContent>
              </Card>
            </div>
            
            {/* Card 1: Model Performance Chart */}
            <div className={`transition-opacity duration-300 ${activeCard === 1 ? 'opacity-100' : 'opacity-0 absolute inset-0 pointer-events-none'}`}>
              <Card className="w-full">
                <CardHeader>
                  <CardTitle>Model Performance</CardTitle>
                  <CardDescription>WER and MOS scores by language (lower WER is better)</CardDescription>
                </CardHeader>
                <CardContent className="h-96">
                  <Radar data={performanceData} options={radarOptions} />
                </CardContent>
              </Card>
            </div>
            
            {/* Card 2: Speaker Demographics Chart */}
            <div className={`transition-opacity duration-300 ${activeCard === 2 ? 'opacity-100' : 'opacity-0 absolute inset-0 pointer-events-none'}`}>
              <Card className="w-full">
                <CardHeader>
                  <CardTitle>Speaker Demographics</CardTitle>
                  <CardDescription>Distribution of speakers by gender</CardDescription>
                </CardHeader>
                <CardContent className="h-96">
                  <div className="flex justify-center items-center h-full">
                    <div className="w-64">
                      <Doughnut data={genderData} options={doughnutOptions} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Card 3: Key Statistics */}
            <div className={`transition-opacity duration-300 ${activeCard === 3 ? 'opacity-100' : 'opacity-0 absolute inset-0 pointer-events-none'}`}>
              <Card className="w-full">
                <CardHeader>
                  <CardTitle>Key Metrics</CardTitle>
                  <CardDescription>Summary of important dataset statistics</CardDescription>
                </CardHeader>
                <CardContent className="h-96">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-indigo-50 rounded-lg p-4">
                      <h3 className="text-sm text-indigo-800 font-medium mb-1">Total Audio</h3>
                      <p className="text-3xl font-bold text-indigo-600">{stats.dataCollection.audioHours.total} hours</p>
                    </div>
                    <div className="bg-pink-50 rounded-lg p-4">
                      <h3 className="text-sm text-pink-800 font-medium mb-1">Transcribed</h3>
                      <p className="text-3xl font-bold text-pink-600">{stats.dataCollection.transcribedHours.total} hours</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4">
                      <h3 className="text-sm text-green-800 font-medium mb-1">Unique Speakers</h3>
                      <p className="text-3xl font-bold text-green-600">{stats.dataCollection.speakers.total}</p>
                    </div>
                    <div className="bg-amber-50 rounded-lg p-4">
                      <h3 className="text-sm text-amber-800 font-medium mb-1">Project Impact</h3>
                      <p className="text-3xl font-bold text-amber-600">{stats.impact.downloads.toLocaleString()} downloads</p>
                    </div>
                    <div className="bg-sky-50 rounded-lg p-4">
                      <h3 className="text-sm text-sky-800 font-medium mb-1">Citations</h3>
                      <p className="text-3xl font-bold text-sky-600">{stats.impact.citations}</p>
                    </div>
                    <div className="bg-violet-50 rounded-lg p-4">
                      <h3 className="text-sm text-violet-800 font-medium mb-1">Contributors</h3>
                      <p className="text-3xl font-bold text-violet-600">{stats.impact.activeContributors}</p>
                    </div>
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
          Last updated: {new Date(stats.timeline.lastUpdated).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </p> */}
      </div>
    </section>
  );
}
