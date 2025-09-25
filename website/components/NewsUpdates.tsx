import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// News/Updates data structure that's easy to update
const newsItems = [
  {
    id: 1,
    date: "2025-09-01",
    title: "Dataset Reaches 1,500 Hours",
    content: "Our audio collection has now surpassed 1,500 hours across all target languages, with significant contributions from community partners in rural areas.",
    category: "milestone",
  },
  {
    id: 2,
    date: "2025-08-15",
    title: "New Model Release",
    content: "We've released improved ASR models for isiZulu and isiXhosa with WER scores decreased by 5% compared to previous versions.",
    category: "technical",
  },
  {
    id: 3,
    date: "2025-07-22",
    title: "Research Paper Accepted",
    content: "Our methodology paper 'Inclusive Speech Recognition for South African Languages' has been accepted at INTERSPEECH 2025.",
    category: "publication",
  },
  {
    id: 4,
    date: "2025-07-10",
    title: "New Funding Partnership",
    content: "We're excited to announce additional funding support from the Department of Science and Innovation to expand our data collection efforts.",
    category: "partnership",
  }
];

// Badge color mapping based on category
const categoryColors: Record<string, string> = {
  milestone: "bg-green-100 text-green-800",
  technical: "bg-blue-100 text-blue-800",
  publication: "bg-purple-100 text-purple-800",
  partnership: "bg-amber-100 text-amber-800",
};

export default function NewsUpdates() {
  return (
    <section className="py-12 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-8">News & Updates</h2>
      <div className="space-y-6">
        {newsItems.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl">{item.title}</CardTitle>
                <Badge className={categoryColors[item.category] || "bg-gray-100"}>
                  {item.category}
                </Badge>
              </div>
              <CardDescription>
                {new Date(item.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </CardDescription>
              <hr className="my-2 border-[#212431]" style={{ borderWidth: '1px' }} />
            </CardHeader>
            <CardContent>
              <p>{item.content}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      {/* <p className="text-center text-sm text-gray-500 mt-8">
        To add more updates, edit the <code className="bg-gray-100 p-1 rounded">newsItems</code> array in <code className="bg-gray-100 p-1 rounded">components/NewsUpdates.tsx</code>
      </p> */}
    </section>
  );
}
