# ZA African Next Voices - GitHub Pages Content Management

This document provides instructions for updating content in the various sections of the ZA African Next Voices website.

## 1. Stats Dashboard and Visualizations

The statistics displayed on the website are managed through a single file:

**File Location:** `website/lib/fallbackStats.ts`

This file contains structured data organized into these main categories:

- **dataCollection**: Information about audio hours, transcriptions, and speaker demographics
- **modelPerformance**: Speech-to-text and text-to-speech model performance metrics
- **impact**: Statistics about downloads, citations, and deployments
- **timeline**: Project milestones and last update date

All visualizations (charts, graphs, and statistics displays) automatically update when you modify this file. The visualizations are displayed in a carousel format with "Next" and "Previous" navigation buttons, allowing users to focus on one visualization at a time. The carousel includes:

- Language distribution bar chart
- Model performance radar chart
- Speaker demographics doughnut chart
- Key metrics summary cards

To update the statistics:

1. Open `website/lib/fallbackStats.ts`
2. Locate the specific field you want to update in the `fallbackStats` object
3. Change the value to the new statistic
4. Save the file
5. Rebuild and redeploy the site (see Deployment section below)

> **Important for GitHub Pages deployment**: Since GitHub Pages is a static host, we use pre-loaded statistics directly from the `fallbackStats.ts` file rather than API calls. This change is necessary since GitHub Pages cannot run server-side code like API routes.

## 2. News/Updates Section

The News and Updates section displays recent project announcements and milestones.

**File Location:** `website/components/NewsUpdates.tsx`

To add or update news items:

1. Open `website/components/NewsUpdates.tsx`
2. Locate the `newsItems` array near the top of the file
3. Add a new object to the array with the following structure:
   ```javascript
   {
     id: 5, // Increment this number for each new item
     date: "2025-10-01", // Date in YYYY-MM-DD format
     title: "Your News Title",
     content: "Description of your news or update",
     category: "milestone" // Choose from: milestone, technical, publication, partnership
   }
   ```
4. Save the file

Categories have different color schemes to visually distinguish between different types of updates.

## 3. Community Impact Section

The Community Impact section showcases stories of how the project is being used.

**File Location:** `website/components/CommunityImpact.tsx`

To add or update impact stories:

1. Open `website/components/CommunityImpact.tsx`
2. Locate the `impactStories` array near the top of the file
3. Add a new object to the array with the following structure:
   ```javascript
   {
     id: 5, // Increment this number for each new item
     title: "Title of Impact Story",
     organization: "Organization Name",
     content: "Description of the impact and how the project was used",
     quote: "A notable quote about the impact",
     person: "Name and Title of the person quoted",
     imageUrl: "/images/organization-logo.png" // Use this format for GitHub Pages
   }
   ```
4. Save the file

If you want to include a new organization logo:
1. Add the image file to `website/public/images/`
2. Reference it in the `imageUrl` field using the format `/images/filename.png`

> **Important for GitHub Pages deployment**: All image paths must start with `/images/` and the actual files must be placed in the `public/images/` directory.

## 4. Technical Benchmarks Section

The Technical Benchmarks section displays model performance metrics, which are now loaded from the `fallbackStats.ts` file.

To update the benchmarks:

1. Open `website/lib/fallbackStats.ts`
2. Update the values in the `modelPerformance` section:
   ```typescript
   "modelPerformance": {
     "speechToText": {
       "werScores": {
         "isiZulu": 15.4,  // Update these values
         // ...
       },
       "improvementFromBaseline": {
         "isiZulu": 32,  // Update these values
         // ...
       }
     },
     "textToSpeech": {
       "mosScores": {
         "isiZulu": 4.2,  // Update these values
         // ...
       }
     }
   }
   ```
3. Save the file
4. Rebuild and redeploy the site

## 5. Deployment Instructions for GitHub Pages

After making any changes to the content files, follow these steps to deploy the updated website:

1. Commit your changes to your Git repository
   ```bash
   git add .
   git commit -m "Update website content"
   git push
   ```

2. If using GitHub Actions for deployment, the site will automatically rebuild and deploy
   
3. If manually deploying:
   ```bash
   # Navigate to your project directory
   cd za-african-next-voices

   # Build the project
   cd website
   npm run build

   # Deploy to GitHub Pages (if using gh-pages package)
   npm run deploy
   ```

4. Wait a few minutes for the changes to propagate through GitHub Pages

## General Tips

- Always test changes in a development environment before pushing to production
- Keep content concise and focused on the most important information
- Maintain consistent formatting and writing style
- Use the existing categories and structure to ensure visual consistency
- All images must be in the `public/images/` directory for GitHub Pages

**Important Note**: Since this website is deployed as a static site on GitHub Pages, any changes requiring server-side processing (like adding new API endpoints) will not work. All data must be included directly in the code files or as static files in the public directory.

For any questions or assistance with content updates, please contact the project administrators.
