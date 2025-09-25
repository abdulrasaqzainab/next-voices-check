export default function imageLoader({ src, width, quality }: { src: string; width: number; quality?: number }) {
  // Get the repo name from environment variable, fallback to empty string for local dev
  const repo = process.env.GITHUB_REPOSITORY?.split('/')[1] || '';
  const baseUrl = repo ? `/${repo}` : '';
  
  // Remove any leading slash from src
  const normalizedSrc = src.startsWith('/') ? src.slice(1) : src;
  
  // Construct the full URL
  return `${baseUrl}/${normalizedSrc}`;
}