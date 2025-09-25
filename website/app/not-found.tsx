'use client';

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-[60vh] flex-col">
      <h2 className="text-4xl font-bold mb-4">404 - Page Not Found</h2>
      <p className="text-xl mb-8">The page you are looking for does not exist.</p>
      <Link 
        href="/"
        className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        Return to Homepage
      </Link>
    </div>
  );
}