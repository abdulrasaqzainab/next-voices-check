import { Card, CardDescription, CardFooter, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Github, Twitter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { GradientSection } from "@/components/ui/gradient-section";
import StatsVisualization from "@/components/StatsVisualization";
import Image from 'next/image';
import AudioCarousel from '@/components/AudioCarousel';
// No need for importing statsData as we're using fallbackStats directly in the components



export default function App() {
  return (
    <div className="min-h-screen text-gray-900 bg-gradient-to-br from-yellow-200 via-yellow-400 to-green-500">
      {/* Hero Section */}
      <GradientSection variant="hero" className="text-center text-white">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Swivuriso: ZA-African Next Voices
        </h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto">
          <b>A large-scale multilingual speech dataset for 7 South African languages
          supporting ASR research and inclusive technologies.</b>
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
      </GradientSection>

          
            {/* About the Project Section */}
      <section className="py-12 bg-white">
        <div className="max-w-3xl mx-auto text-center">
           <Card className="w-full ">
            <CardTitle>About the Project</CardTitle>
            <CardDescription>
              Swivuriso is unique in that it combines both <strong>scripted</strong> and  
              <strong>unscripted</strong> speech, reflecting how people actually use language in daily life. 
              All recordings are collected through <strong>ethical, community-centered processes</strong>, 
              ensuring that participants are fairly engaged and that the data benefits the wider community. 
              This approach strengthens both the quality of the dataset and its long-term impact.
              <br></br>
              <br></br>
              The dataset covers the following seven languages, with the goal of building a balanced resource 
              that reflects South Africa’s linguistic diversity:
              <br></br>
               <ul className="flex flex-wrap gap-4 text-xs justify-center">
                  <li><strong>isiZulu</strong> – 500h</li>
                  <li><strong>isiXhosa</strong> – 500h</li>
                  <li><strong>Sesotho</strong> – 500h</li>
                  <li><strong>Sepedi</strong> – 500h</li>
                  <li><strong>Setswana</strong> – 500h</li>
                  <li><strong>isiNdebele</strong> – 250h</li>
                  <li><strong>Tshivenda</strong> – 250h</li>
                </ul>
              <br></br>
              <br></br>
              In total, the dataset will reach <strong>3,000 hours</strong> of high-quality, 
              multilingual audio. These recordings will form the foundation for robust ASR models, 
              helping to break literacy barriers, make digital content locally relevant, 
              and accelerate innovation in South African language technologies.  
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
      <GradientSection className="text-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-6">Project Team</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 text-center">
            {["Vukosi Marivate (co-PI)", "Kayode Olaleye (co-PI)", "Sitwala Mundia", "Unarine Netshifhefhe", "Nia Zion van Wyk", "Mahmooda Milanzie", "Tsholofelo Mogale", "Chijioke Okorie", "Thapelo Sindane", "Andinda Bakainaga", "Graham Morrissey", "Dale Dunbar", "Franscois Smit", "Tsosheletso Chidi", "Rooweither Mabuya", "Andiswa Bukula", "Respect Mlambo", "Tebogo Macucwa", "Zainab Abdulrasaq", "Kesego Mokgosi", "Francois Smit","Idris Abdulmumin","Seani Rananga"].map((name) => (
              <Badge variant="names" key={name}>
                {name}
              </Badge>
            ))}
          </div>
        </div>
      </GradientSection>

      ,
      {/* Partners Section */}
      <GradientSection variant="plain">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Partners & Supporters</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 items-center justify-center">
            <a href="https://waywithwords.net" target="_blank" rel="noreferrer" >
              <Image src="/za-african-next-voices/images/WayWithWords.png" alt="Way With Words" width={100} height={60} className="h-16 mx-auto" />
            </a>
            <a href="https://www.up.ac.za/faculty-of-law" target="_blank" rel="noreferrer" >
              <Image src="/za-african-next-voices/images/Law_UP.png" alt="UP Law" width={150} height={48} className="h-12 mx-auto" />
            </a>
            <a href="https://www.meta.com/about/" target="_blank" rel="noreferrer" >
              <Image src="/za-african-next-voices/images/Meta-Logo-trans.png" alt="Meta" width={60} height={48} className="h-12 mx-auto" />
            </a>
            <a href="https://www.gatesfoundation.org/" target="_blank" rel="noreferrer" >
              <Image src="/za-african-next-voices/images/Gates_Foundation_Logo.png" alt="Gates Foundation" width={150} height={48} className="h-12 mx-auto" />
            </a>
          </div>
        </div>
      </GradientSection>


      {/* Data Sources (copied from index.html link style) */}
      <section className="py-12 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Data Sources</h2>
          <p className="text-center">
            Vukuzenzele Newspaper <a href="https://www.vukuzenzele.gov.za" target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">[Website]</a>
            <a href="https://github.com/dsfsi/vukuzenzele-nlp" target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">[Data Repo]</a>, Wikipedia, African Wordnet, GrainSA, Agricultural Research Council, SADiLaR, Masakhane
          </p>
        </div>
      </section>



       {/* Audio carousel */}
      <AudioCarousel />


  {/* Statistics Visualization Section */}
  <StatsVisualization />

  {/* Technical Benchmarks Section -- commented out because it has mock data */}
  {/* <TechnicalBenchmarks /> */}

  {/* News & Updates Section -- commented out because it has mock data */}
  {/* <NewsUpdates /> */}
      
  {/* Community Impact Section -- commented out because it has mock data */}
  {/* <CommunityImpact /> */}

  {/* Data visualizations carousel -- commented out because outdated */}
  {/* <DataVisualizationCarousel /> */}

      {/* Footer */}
      <GradientSection variant="footer" className="text-center text-white">
        <p className="text-sm">Citation: TBC</p>
        <p className="text-xs mt-2">Acknowledgments: Lelapa AI, Agricultural Research Council, Karya, Lanfrica, SADiLaR</p>
        <div className="flex justify-center mt-6">
          <Image src="/za-african-next-voices/images/dsfsi_logo2.png" alt="DSFSI Logo" width={18} height={18} className="h-16 flex items-center justify-center mt-6 w-18 h-18 rounded-full bg-white shadow" />
        </div>
      </GradientSection>
    </div>
  );
}
