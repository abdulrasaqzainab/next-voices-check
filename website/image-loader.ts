export default function imageLoader({ src, width, quality }: { src: string; width: number; quality?: number }) {
  const repo = process.env.GITHUB_REPOSITORY?.split('/')[1] || '';
  const baseUrl = repo ? `/${repo}` : '';
  
  // Remove any leading slash from src and handle public directory paths
  const normalizedSrc = src.startsWith('/') ? src.slice(1) : src;
  
  // Construct the full URL
  return `${baseUrl}/${normalizedSrc}`;
}