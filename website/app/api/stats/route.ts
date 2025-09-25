import path from 'path';
import fs from 'fs';

export const dynamic = "force-static";
export const revalidate = false;

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'public', 'stats.json');
    const data = fs.readFileSync(filePath, 'utf8');
    return new Response(data, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store'
      }
    });
  } catch (error) {
    console.error('Error reading stats data:', error);
    return new Response(JSON.stringify({ error: 'Failed to load stats data' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}
