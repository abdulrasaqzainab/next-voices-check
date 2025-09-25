import { Card, CardDescription, CardFooter, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Github, Twitter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import NewsUpdates from "@/components/NewsUpdates";
import CommunityImpact from "@/components/CommunityImpact";
import TechnicalBenchmarks from "@/components/TechnicalBenchmarks";
import StatsVisualization from "@/components/StatsVisualization";
import Image from 'next/image';
// No need for importing statsData as we're using fallbackStats directly in the components



export default function App() {
  return (
    <div className="min-h-screen text-gray-900 bg-gradient-to-br from-red-200 via-yellow-400 via-white to-teal-500">
      {/* Hero Section */}
      <section className="py-16 text-center bg-gradient-to-r  text-white">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Swivuriso: ZA-African Next Voices
        </h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto">
          A large-scale multilingual speech dataset for 7 South African languages
          supporting ASR research and inclusive technologies.
        </p>
        <div className="mt-6 flex justify-center gap-4">
          <Button asChild variant="default" size={"pill"}>
            <a href="https://huggingface.co/datasets/dsfsi-anv/za-african-next-voices/" target="_blank" rel="noreferrer">
              Hugging Face
            </a>
          </Button>
          <Button asChild variant="default" size={"pill"}>
            <a href="https://github.com/dsfsi/za-next-voices-2025" target="_blank" rel="noreferrer">
              <Github className="mr-2 h-4 w-4" /> GitHub
            </a>
          </Button>
          <Button asChild variant="default" size={"pill"}>
            <a href="https://twitter.com/dsfsi_research" target="_blank" rel="noreferrer">
              <Twitter className="mr-2 h-4 w-4" /> @DSFSI_Research
            </a>
          </Button>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="max-w-3xl mx-auto text-center">
           <Card className="w-full ">
            <CardTitle>About the Project</CardTitle>
            <CardDescription>
                <strong>Swivuriso</strong> is a multilingual speech dataset targeting over
                <strong> 3000 hours</strong> of audio across <strong>7 South African languages</strong>.
                It supports Automatic Speech Recognition (ASR) and inclusive speech technologies,
                combining both scripted and unscripted speech.
            </CardDescription>
          <CardFooter>
            <a
              href="https://arxiv.org/abs/XXXX.XXXXX"
              target="_blank"
              rel="noreferrer"
              className="text-indigo-600 hover:underline"
            >
              Dataset Paper (ArXiv, Work in Progress)
            </a>
            </CardFooter>
         
          </Card>
        </div>
      </section>

      {/* Authors Section */}
      <section className="py-12 max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-6">Project Team</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 text-center">
          {["Vukosi Marivate (co-PI)", "Kayode Olaleye (co-PI)", "Sitwala Mundia", "Unarine Netshifhefhe", "Nia Zion van Wyk", "Mahmooda Milanzie", "Tsholofelo Mogale", "Chijioke Okorie", "Thapelo Sindane", "Andinda Bakainaga", "Graham Morrissey", "Dale Dunbar", "Franscois Smit", "Tsosheletso Chidi", "Rooweither Mabuya", "Andiswa Bukula", "Respect Mlambo", "Tebogo Macucwa"].map((name) => (
            <Badge variant="names" key={name}>
              {name}
            </Badge>
          ))}
        </div>
      </section>

      
      {/* Partners Section */}
      <section className="py-12 max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-8">Partners & Supporters</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 items-center justify-center">
          <div className="flex items-center justify-center">
            <Image 
              src={'/images/WayWithWords.png'} 
              alt="Way With Words" 
              width={128}
              height={128}
              className="h-16 w-auto object-contain"
              priority
            />
          </div>
          <div className="flex items-center justify-center">
            <Image 
              src={'/images/Law_UP.png'} 
              alt="UP Law" 
              width={96}
              height={96}
              className="h-12 w-auto object-contain"
              priority
            />
          </div>
          <div className="flex items-center justify-center">
            <Image 
              src={'/images/Meta-Logo-trans.png'} 
              alt="Meta" 
              width={96}
              height={96}
              className="h-12 w-auto object-contain"
              priority
            />
          </div>
          <div className="flex items-center justify-center">
            <Image 
              src={'/images/Gates_Foundation_Logo.png'} 
              alt="Gates Foundation" 
              width={96}
              height={96}
              className="h-12 w-auto object-contain"
              priority
            />
          </div>
        </div>
      </section>

      {/* Statistics Visualization Section */}
      <StatsVisualization />
           
      {/* Technical Benchmarks Section */}
      <TechnicalBenchmarks />

      {/* News & Updates Section */}
      <NewsUpdates />
      
      {/* Community Impact Section */}
      <CommunityImpact />

      {/* Footer */}
      <footer className="py-8 text-center bg-gray-900 text-gray-300">
        <p className="text-sm">Citation: TBC</p>
        <p className="text-xs mt-2">Acknowledgments: Lelapa AI, Agricultural Research Council, Karya, Lanfrica, SADiLaR</p>
        <div className="flex justify-center mt-6">
          <Image src="/images/dsfsi_logo2.png" alt="DSFSI Logo" width={64} height={64} className="h-16" />
        </div>
      </footer>
    </div>
  );
}
