"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Carousel from "@/components/ui/carousel";
import ProvinceMap from "@/components/ProvinceMap";
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
  BubbleController,
} from 'chart.js';
import { Bar, Doughnut, Bubble } from 'react-chartjs-2';

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
  RadialLinearScale,
  BubbleController
);

// Custom color palette for 7 languages
const colors = {
  languages: [
    'rgba(236, 72, 153, 0.8)',    // isiZulu - Pink
    'rgba(99, 102, 241, 0.8)',    // isiXhosa - Indigo
    'rgba(16, 185, 129, 0.8)',    // Sesotho - Green
    'rgba(249, 115, 22, 0.8)',    // seTswana - Orange
    'rgba(168, 85, 247, 0.8)',    // Xitsonga - Purple
    'rgba(14, 165, 233, 0.8)',    // Tshivenda - Sky Blue
     'rgba(251, 191, 36, 0.8)',    // isiNdebele - Amber
  ],
  demographics: ['rgba(59, 130, 246, 0.8)', 'rgba(236, 72, 153, 0.8)'],
  domains: [
    '#3b82f6', '#ec4899', '#10b981', '#f59e0b', '#8b5cf6',
    '#14b8a6', '#f97316', '#06b6d4', '#84cc16', '#a855f7'
  ]
};

// Generated statistics (from actual table_stats.json with isiNdebele included)
const stats = {
  overview: {
    totalClips: 483191,
    totalHours: 3015.79,
    totalSpeakers: 2335,
    totalLanguages: 7
  },
  languages: {
    zul: {
      name: "isiZulu", clips: 59115, hours: 502.85, speakers: 482, avgDuration: 30.62,
      genders: { female: 33434, male: 25681 },
      ageGroups: { "30-39": 19020, "40-49": 5185, "18-29": 33167, "50-59": 1028, "60+": 715 },
      domains: { "Finance": 4326, "Agriculture": 10467, "Health": 10613, "Culture and Society": 4235,
        "Transport": 4731, "Telecommunication": 4152, "Sports and Hobbies": 4419, "General": 16172 }
    },
    xho: {
      name: "isiXhosa", clips: 73665, hours: 504.28, speakers: 480, avgDuration: 24.64,
      genders: { female: 44571, male: 29094 },
      ageGroups: { "30-39": 24716, "18-29": 38476, "40-49": 8831, "50-59": 1211, "60+": 431 },
      domains: { "Culture and Society": 4917, "Telecommunication": 4995, "Sports and Hobbies": 5306,
        "Transport": 5218, "Finance": 4732, "Agriculture": 11574, "Health": 10874, "General": 26049 }
    },
    sot: {
      name: "Sesotho", clips: 78113, hours: 503.58, speakers: 480, avgDuration: 23.21,
      genders: { male: 35072, female: 43041 },
      ageGroups: { "18-29": 49740, "30-39": 20020, "40-49": 6177, "50-59": 2176, "60+": 0 },
      domains: { "Agriculture": 12988, "Health": 12484, "General": 28239, "Telecommunication": 4866,
        "Finance": 4804, "Sports and Hobbies": 5058, "Transport": 4855, "Culture and Society": 4819 }
    },
    tsn: {
      name: "seTswana", clips: 99527, hours: 502.18, speakers: 487, avgDuration: 18.16,
      genders: { male: 29424, female: 70103 },
      ageGroups: { "18-29": 68025, "30-39": 26185, "40-49": 4828, "50-59": 489, "60+": 0 },
      domains: { "Telecommunication": 5056, "Sports and Hobbies": 5480, "Agriculture": 13685,
        "Health": 12858, "Finance": 5134, "Transport": 5544, "Culture and Society": 5690, "General": 46080 }
    },
    tso: {
      name: "Xitsonga", clips: 79107, hours: 500.15, speakers: 198, avgDuration: 22.76,
      genders: { female: 42786, male: 36321 },
      ageGroups: { "18-29": 60004, "30-39": 14390, "40-49": 4056, "60+": 353, "50-59": 304 },
      domains: { "Agriculture": 12119, "Health": 12998, "Finance": 6665, "Telecommunication": 6955,
        "Sports and Hobbies": 6872, "Transport": 6813, "Culture and Society": 6695, "General - Civic Life": 4222,
        "General": 11534, "General - Knowledge": 4234 }
    },
    ven: {
      name: "Tshivenda", clips: 42402, hours: 250.89, speakers: 104, avgDuration: 21.3,
      genders: { male: 18065, female: 24337 },
      ageGroups: { "18-29": 33761, "30-39": 6697, "40-49": 1268, "50-59": 380, "60+": 296 },
      domains: { "Sports and Hobbies": 3929, "Health": 7758, "Culture and Society": 3942,
        "Agriculture": 7471, "Transport": 3668, "Finance": 3953, "Telecommunication": 3996,
        "General": 3432, "General Topics": 2109, "General - Civic Life": 2144 }
    },
    nbl: {
      name: "isiNdebele", clips: 51262, hours: 251.86, speakers: 104, avgDuration: 17.69,
      genders: { male: 25631, female: 25631 },
      ageGroups: { "18-29": 30757, "30-39": 20505, "40-49": 0, "50-59": 0, "60+": 0 },
      domains: { "Health": 9484, "Agriculture": 8290, "Culture and Society": 6524, "General": 5701,
        "Telecommunication": 4736, "Sports and Hobbies": 4733, "Transport": 4668, "Finance": 3699,
        "General - Knowledge": 2290, "General - Civic Life": 1137 }
    }
  },
  demographics: {
    ageGroups: { "30-39": 131533, "40-49": 30345, "18-29": 313930, "50-59": 5588, "60+": 1795 },
    genders: { male: 199288, female: 283903, unknown: 0 },
    provinces: { "KwaZulu-Natal": 37233, "Gauteng": 171074, "Mpumalanga": 21499, "Eastern Cape": 41867,
      "Free State": 42746, "North West": 41120, "Limpopo": 52890, "Western Cape": 17643, "Northern Cape": 5857 },
    mostSpokenByProvince: {
      "Gauteng": { language: "seTswana", percentage: 23.8, speakers: Math.round(171074 / 700) },
      "Limpopo": { language: "Xitsonga", percentage: 51.4, speakers: Math.round(52890 / 700) },
      "KwaZulu-Natal": { language: "isiZulu", percentage: 96.9, speakers: Math.round(37233 / 700) },
      "Eastern Cape": { language: "isiXhosa", percentage: 95.2, speakers: Math.round(41867 / 700) },
      "Free State": { language: "Sesotho", percentage: 90.6, speakers: Math.round(42746 / 700) },
      "North West": { language: "seTswana", percentage: 88.3, speakers: Math.round(41120 / 700) },
      "Mpumalanga": { language: "Xitsonga", percentage: 76.6, speakers: Math.round(21499 / 700) },
      "Western Cape": { language: "isiXhosa", percentage: 91.7, speakers: Math.round(17643 / 700) },
      "Northern Cape": { language: "seTswana", percentage: 93.3, speakers: Math.round(5857 / 700) }
    }
  }
};


export default function StatsVisualization() {
  // Helper function to format numbers consistently (avoids hydration errors)
  const formatNumber = (num: number): string => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  // Chart data preparations
  const languageData = {
    labels: Object.values(stats.languages).map(l => l.name),
    datasets: [{
      label: 'Audio Hours',
      data: Object.values(stats.languages).map(l => l.hours),
      backgroundColor: colors.languages,
      borderColor: colors.languages.map(c => c.replace('0.8', '1')),
      borderWidth: 2,
    }]
  };

  const genderData = {
    labels: ['Male Speakers', 'Female Speakers'],
    datasets: [{
      data: [stats.demographics.genders.male, stats.demographics.genders.female],
      backgroundColor: colors.demographics,
      borderColor: '#ffffff',
      borderWidth: 3,
    }]
  };

  const ageData = {
    labels: Object.keys(stats.demographics.ageGroups).filter(k => k !== 'unknown'),
    datasets: [{
      label: 'Speakers',
      data: Object.entries(stats.demographics.ageGroups)
        .filter(([k]) => k !== 'unknown')
        .map(([, v]) => v),
      backgroundColor: 'rgba(16, 185, 129, 0.7)',
      borderColor: 'rgba(16, 185, 129, 1)',
      borderWidth: 2,
    }]
  };

  //bubble chart showing language stats
  const bubbleData = {
    datasets: Object.entries(stats.languages).map(([, lang], index) => ({
      label: lang.name,
      data: [{
        x: lang.speakers,
        y: lang.hours,
        r: Math.sqrt(lang.clips) / 10
      }],
      backgroundColor: colors.languages[index],
      borderColor: colors.languages[index].replace('0.8', '1'),
      borderWidth: 2,
    }))
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' as const },
      tooltip: { mode: 'index' as const, intersect: false }
    },
    scales: {
      y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } },
      x: { grid: { color: 'rgba(0,0,0,0.05)' } }
    }
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' as const },
      tooltip: {
        callbacks: {
          label: (context: { label: string; parsed: number; dataset: { data: number[] } }) => {
            const label = context.label || '';
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    }
  };

  const bubbleOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' as const },
      tooltip: {
        callbacks: {
          label: (context: { dataset: { label?: string }; raw: unknown }) => {
            const lang = context.dataset.label || '';
            const data = context.raw as { x: number; y: number; r: number };
            return [
              `${lang}`,
              `Speakers: ${data.x}`,
              `Hours: ${data.y.toFixed(1)}`,
              `Clips: ${Math.round(data.r * data.r * 100)}`
            ];
          }
        }
      }
    },
    scales: {
      x: { title: { display: true, text: 'Number of Speakers' }, beginAtZero: true },
      y: { title: { display: true, text: 'Audio Hours' }, beginAtZero: true }
    }
  };

  // Domain/Category data 
  const allDomains: { [key: string]: number } = {};
  Object.values(stats.languages).forEach(lang => {
    Object.entries(lang.domains).forEach(([domain, count]) => {
      
      const normalizedDomain = domain.replace(/^General - /, '').replace(/General Topics/, 'General');
      allDomains[normalizedDomain] = (allDomains[normalizedDomain] || 0) + count;
    });
  });

  //per category breakdown
  const mainDomains = ['Agriculture', 'Health', 'Finance', 'Transport', 'Telecommunication', 'Culture and Society', 'Sports and Hobbies', 'General'];
  const languageNames = Object.values(stats.languages).map(l => l.name);
  
  const domainByLanguageData = {
    labels: languageNames,
    datasets: mainDomains.map((domain, idx) => ({
      label: domain,
      data: Object.values(stats.languages).map(lang => {
        let total = 0;
        Object.entries(lang.domains).forEach(([d, count]) => {
          if (d === domain || d.startsWith(domain) || (domain === 'General' && d.includes('General'))) {
            total += count;
          }
        });
        return total;
      }),
      backgroundColor: colors.domains[idx],
      borderColor: colors.domains[idx] + 'cc',
      borderWidth: 1,
    }))
  };

  const stackedBarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' as const },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        callbacks: {
          label: (context: { dataset: { label?: string }; parsed: { y: number } }) => {
            const label = context.dataset.label || '';
            const value = context.parsed.y || 0;
            return `${label}: ${formatNumber(value)} clips`;
          }
        }
      }
    },
    scales: {
      x: { stacked: true, grid: { color: 'rgba(0,0,0,0.05)' } },
      y: { stacked: true, beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } }
    }
  };

  return (
    <section className="py-12 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-3">Dataset Statistics</h2>
         
        </div>

        <Carousel>
          {/* Card 0: Overview Stats */}
          <Card className="w-full shadow-lg">
            <CardHeader>
              <CardTitle>Project Overview</CardTitle>
              <CardDescription>Current dataset statistics</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-indigo-50 rounded-xl p-5 text-center transform hover:scale-105 transition">
                  <p className="text-sm text-indigo-600 font-medium mb-1">Total Hours</p>
                  <p className="text-4xl font-bold text-indigo-700">{formatNumber(Math.round(stats.overview.totalHours))}</p>
                </div>
                <div className="bg-pink-50 rounded-xl p-5 text-center transform hover:scale-105 transition">
                  <p className="text-sm text-pink-600 font-medium mb-1">Total Clips</p>
                  <p className="text-4xl font-bold text-pink-700">{formatNumber(stats.overview.totalClips)}</p>
                </div>
                <div className="bg-green-50 rounded-xl p-5 text-center transform hover:scale-105 transition">
                  <p className="text-sm text-green-600 font-medium mb-1">Speakers</p>
                  <p className="text-4xl font-bold text-green-700">{formatNumber(stats.overview.totalSpeakers)}</p>
                </div>
                <div className="bg-orange-50 rounded-xl p-5 text-center transform hover:scale-105 transition">
                  <p className="text-sm text-orange-600 font-medium mb-1">Languages</p>
                  <p className="text-4xl font-bold text-orange-700">{stats.overview.totalLanguages}</p>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.values(stats.languages).map((lang, i) => (
                  <div key={i} className="bg-white border-2 rounded-lg p-4 hover:shadow-md transition">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-gray-800">{lang.name}</h3>
                      <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
                        {lang.hours.toFixed(1)}h
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-sm text-gray-600">
                      <div><span className="font-medium">{formatNumber(lang.clips)}</span> clips</div>
                      <div><span className="font-medium">{formatNumber(lang.speakers)}</span> speakers</div>
                      <div><span className="font-medium">{lang.avgDuration.toFixed(1)}s</span> avg</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>



 {/* Card 7: Interactive Province Map */}
          <Card className="w-full shadow-lg">
            <CardHeader >
              <CardTitle>Interactive Geographic Map</CardTitle>
              <CardDescription>
              Language dominance by province with dataset distribution.              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <ProvinceMap 
                provinceLanguageData={stats.demographics.mostSpokenByProvince}
                height={500}
              />
             
            </CardContent>
          </Card>
         

          {/* Card 2: Hours Distribution */}
          <Card className="w-full shadow-lg">
            <CardHeader>
              <CardTitle>Audio Hours by Language</CardTitle>
              <CardDescription>Total recording time collected per language</CardDescription>
            </CardHeader>
            <CardContent className="h-96">
              <Bar data={languageData} options={chartOptions} />
            </CardContent>
          </Card>

          {/* Card 3: Speaker Distribution Bubble */}
          <Card className="w-full shadow-lg">
            <CardHeader>
              <CardTitle>Language Metrics Comparison</CardTitle>
              <CardDescription>Speakers vs Hours (bubble size = clips)</CardDescription>
            </CardHeader>
            <CardContent className="h-96">
              <Bubble data={bubbleData} options={bubbleOptions} />
            </CardContent>
          </Card>

          {/* Card 4: Demographics - Gender */}
          <Card className="w-full shadow-lg">
            <CardHeader>
              <CardTitle>Speaker Demographics</CardTitle>
              <CardDescription>Gender distribution across all languages</CardDescription>
            </CardHeader>
            <CardContent className="h-96">
              <div className="flex justify-center items-center h-full">
                <div className="w-80 h-80">
                  <Doughnut data={genderData} options={doughnutOptions} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card 5: Age Groups */}
          <Card className="w-full shadow-lg">
            <CardHeader>
              <CardTitle>Age Distribution</CardTitle>
              <CardDescription>Speaker count by age range</CardDescription>
            </CardHeader>
            <CardContent className="h-96">
              <Bar data={ageData} options={chartOptions} />
            </CardContent>
          </Card>

        

          {/* Card 7: Domain Distribution by Language */}
          <Card className="w-full shadow-lg">
            <CardHeader>
              <CardTitle>Categories by Language</CardTitle>
              <CardDescription>Domain distribution across all languages </CardDescription>
            </CardHeader>
            <CardContent className="h-96">
              <Bar data={domainByLanguageData} options={stackedBarOptions} />
            </CardContent>
          </Card>

         
             

         
        </Carousel>
      </div>
    </section>
  );
}
