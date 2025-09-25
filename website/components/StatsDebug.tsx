'use client';

import { useEffect, useState } from 'react';
import { StatsType } from '@/lib/fallbackStats';

export default function StatsDebug() {
  const [data, setData] = useState<StatsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/stats');
        
        if (!response.ok) {
          throw new Error(`API responded with status: ${response.status}`);
        }
        
        const result = await response.json();
        setData(result);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching stats:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        setLoading(false);
      }
    }
    
    fetchData();
  }, []);

  return (
    <div style={{ 
      padding: '20px', 
      margin: '20px', 
      border: '1px solid #ccc', 
      borderRadius: '5px',
      backgroundColor: '#f5f5f5'
    }}>
      <h2>Stats Debug Panel</h2>
      
      {loading ? (
        <p>Loading stats data...</p>
      ) : error ? (
        <div>
          <p>Error loading stats: {error}</p>
        </div>
      ) : (
        <div>
          <p>Stats loaded successfully!</p>
          <pre style={{ 
            maxHeight: '200px', 
            overflow: 'auto', 
            padding: '10px', 
            backgroundColor: '#eee',
            border: '1px solid #ddd',
            borderRadius: '3px' 
          }}>
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
