export default function imageLoader({ src, width, quality }: { src: string; width: number; quality?: number }) {
  const repo = process.env.GITHUB_REPOSITORY?.split('/')[1] || '';
  const baseUrl = repo ? `/${repo}` : '';
  
  // Remove any leading slash from src
  let normalizedSrc = src.startsWith('/') ? src.slice(1) : src;
  
  // If the path starts with static, keep it as is, otherwise prepend it
  if (!normalizedSrc.startsWith('static/')) {
    normalizedSrc = `static/${normalizedSrc}`;
  }
  
  // Construct the full URL
  return `${baseUrl}/${normalizedSrc}`;
}