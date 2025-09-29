'use client';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  return (
    <div className="min-h-screen bg-purple flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-red-400 text-xl font-bold mb-4">Something went wrong!</h2>
        <p className="text-gray-300 mb-6">
          {error.message || 'Failed to load content. Please try again.'}
        </p>
        <button 
          onClick={reset}
          className="px-6 py-3 bg-pink text-white rounded-lg hover:bg-pink/80 transition-colors font-semibold"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}