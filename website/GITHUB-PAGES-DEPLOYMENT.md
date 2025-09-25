# GitHub Pages Deployment Configuration for Next.js

To configure this Next.js project for GitHub Pages deployment, follow these steps:

## 1. Add export configuration to Next.js config

Update `next.config.ts` to include these settings:

```typescript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',  // Enable static HTML export
  images: {
    unoptimized: true,  // Required for static export
  },
  // Configure the base path if deploying to a subfolder
  // basePath: '/za-african-next-voices',
  trailingSlash: true,  // Add trailing slashes to URLs
};

module.exports = nextConfig;
```

## 2. Add GitHub Actions workflow file

Create a file at `.github/workflows/deploy.yml` with the following content:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]  # Or your primary branch name

permissions:
  contents: write

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'  # Use appropriate Node version
          
      - name: Install dependencies
        working-directory: website
        run: npm ci
        
      - name: Build site
        working-directory: website
        run: npm run build
        
      - name: Deploy to GitHub Pages
        uses: JamesIves/github-pages-deploy-action@v4
        with:
          folder: website/out  # The output folder from Next.js export
```

## 3. Create a `.nojekyll` file

Create an empty file named `.nojekyll` in the `public` directory to prevent GitHub Pages from processing the files with Jekyll.

## 4. Adjust the `package.json` scripts

Update the `build` script in `website/package.json`:

```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "export": "next export"  // This may not be needed in Next.js 13+ as it's included in build
}
```

## Important Considerations

1. **Relative URLs**: Ensure all internal links and resource references use relative URLs or begin with `/` (e.g., `/images/logo.png`).

2. **Static Data**: All dynamic data must be baked into the static files at build time. API routes will not function in static hosting.

3. **Testing**: Before deploying, run `npm run build` locally and test the output using a local static file server to ensure everything works correctly.

4. **404 Page**: The `not-found.tsx` page will be used for any non-existent paths.

5. **Repository Settings**: In your GitHub repository settings, ensure GitHub Pages is configured to deploy from the correct branch and directory.