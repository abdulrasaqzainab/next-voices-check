export default function imageLoader({ src, width, quality }: { src: string; width: number; quality?: number }) {
  const baseUrl = '/next-voices-check';
  
  // Remove any leading slash from src
  const normalizedSrc = src.startsWith('/') ? src.slice(1) : src;
  
  // Construct the full URL
  return `${baseUrl}/${normalizedSrc}`;
}