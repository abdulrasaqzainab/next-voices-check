This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## How to replace the mock data and turn on the real sections

 A few sections on the homepage use mock/fallback data during development. When you have real data, replace the mock JSON or API calls and then uncomment the components in `app/page.tsx` so they render on the site.

Where the mock sections live
- `StatsVisualization` — uses `lib/fallbackStats.ts` by default for GitHub Pages/dev. Replace with your real stats JSON or update the fetch logic.
- `TechnicalBenchmarks` — reads benchmark numbers from the same fallback source. Swap in your real `stats.json` or an API endpoint.
- `NewsUpdates` — this renders a simple list now; point it to your real feed or update the local mock list.
- `CommunityImpact` — uses a small mock object for downloads/citations/contributors. Replace with your real metrics source.

How to enable the real sections
1. Add/replace your real data files inside `public/` or `public/csv/` or wire up your API.
2. Edit `app/page.tsx` and find these commented lines (near the bottom of the file):

	{/* these section use mock data, uncomment them once you have real data */}

	{/* Statistics Visualization Section */}
	{/* <StatsVisualization /> */}
            
	{/* Technical Benchmarks Section */}
	{/* <TechnicalBenchmarks /> */}

	{/* News & Updates Section */}
	{/* <NewsUpdates /> */}
         
	{/* Community Impact Section */}
	{/* <CommunityImpact /> */}

3. Uncomment the component lines you want to enable (remove the surrounding `{/*` and `*/}`) and save.
4. Start the dev server and sanity-check the UI:

```bash
npm run dev
# then open http://localhost:3000
```

