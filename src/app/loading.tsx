import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen bg-purple flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin text-pink mx-auto mb-4" />
        <p className="text-white">Loading content...</p>
      </div>
    </div>
  );
}