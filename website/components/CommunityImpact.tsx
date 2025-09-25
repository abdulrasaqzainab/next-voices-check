'use client';

import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from 'next/image';

// Impact stories data structure that's easy to update
const impactStories = [
	{
		id: 1,
		title: "Improved Educational Access",
		organization: "University of Limpopo",
		content: "Using our ASR models, the university developed lecture transcription tools for isiZulu and Sesotho speakers, improving access for over 3,000 students.",
		quote: "The models have transformed how we support diverse language speakers in our programs.",
		person: "Dr. Thabo Molekwa, Department of Computer Science",
		imageUrl: "/images/uofl.png",
	},
	{
		id: 2,
		title: "Healthcare Communication Bridge",
		organization: "Rural Health Initiative",
		content: "Deployed our speech technologies in 12 rural clinics, helping healthcare workers communicate with patients in their native languages.",
		quote: "Staff report 40% better understanding of patient concerns when using the translation system.",
		person: "Nomsa Dlamini, Program Director",
		imageUrl: "/images/rhi.png",
	},
	{
		id: 3,
		title: "Preserving Cultural Heritage",
		organization: "South African Heritage Council",
		content: "Our models helped transcribe over 200 hours of oral histories from elders speaking endangered language dialects.",
		quote: "These technologies are instrumental in our mission to preserve linguistic heritage for future generations.",
		person: "Michael van der Merwe, Heritage Preservation Lead",
		imageUrl: "/images/sahc.png",
	},
	{
		id: 4,
		title: "Government Services Accessibility",
		organization: "Department of Home Affairs",
		content: "Integrated voice recognition in service kiosks supporting Xitsonga and Setswana, serving over 15,000 citizens monthly.",
		quote: "We've seen a 35% reduction in service time and improved satisfaction scores.",
		person: "Lerato Moloi, Digital Transformation Officer",
		imageUrl: "/images/dha.png",
	},
];

export default function CommunityImpact() {
	return (
		<section className="py-12 bg-gradient-to-b from-white to-gray-50">
			<div className="max-w-5xl mx-auto">
				<h2 className="text-2xl font-bold text-center mb-8">Community Impact</h2>

				<div className="grid md:grid-cols-2 gap-6">
					{impactStories.map((story) => (
						<Card key={story.id} className="flex flex-col h-full">
							<div className="flex items-center gap-4 mb-2 p-6">
								<Image
									src={story.imageUrl}
									alt={story.organization}
									width={56}
									height={56}
									className="w-14 h-14 object-contain rounded-md border border-gray-200 bg-white"
								/>
								<div>
									<CardTitle className="text-xl">{story.title}</CardTitle>
									<CardDescription>
										<Badge variant="outline" className="mt-1">
											{story.organization}
										</Badge>
									</CardDescription>
								</div>
							</div>
							<CardContent className="flex-grow">
								<p className="mb-4">{story.content}</p>
								<blockquote className="border-l-4 border-indigo-300 pl-4 italic text-gray-600">
									&ldquo;{story.quote}&rdquo;
								</blockquote>
								<p className="text-sm mt-2 text-gray-500">— {story.person}</p>
							</CardContent>
						</Card>
					))}
				</div>

				{/* <p className="text-center text-sm text-gray-500 mt-8">
          To add more impact stories, edit the <code className="bg-gray-100 p-1 rounded">impactStories</code> array in <code className="bg-gray-100 p-1 rounded">components/CommunityImpact.tsx</code>
        </p> */}
			</div>
		</section>
	);
}
