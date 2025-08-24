import { useQuery } from "@tanstack/react-query";
import { ExternalLink } from "lucide-react";

export default function InnovationLinks() {
  const { data: innovations, isLoading } = useQuery({
    queryKey: ['/api/innovations/all-status'],
  });

  if (isLoading) {
    return <div className="p-6">Loading innovation links...</div>;
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-6">Innovation Management Links</h1>
        
        <div className="space-y-3">
          <div className="p-3 border rounded">
            <h3 className="font-medium">Innovation 001</h3>
            <button 
              className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm flex items-center gap-2" 
              onClick={() => window.open(`/api/innovations/individual/001`, '_blank')}
            >
              <ExternalLink className="h-4 w-4" />
              View
            </button>
          </div>

          <div className="p-3 border rounded">
            <h3 className="font-medium">Patent 002</h3>
            <button 
              className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm flex items-center gap-2" 
              onClick={() => window.open(`/api/patents/individual/002`, '_blank')}
            >
              <ExternalLink className="h-4 w-4" />
              View
            </button>
          </div>

          <div className="p-3 border rounded">
            <h3 className="font-medium">Patent 003</h3>
            <button 
              className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm flex items-center gap-2" 
              onClick={() => window.open(`/api/patents/individual/003`, '_blank')}
            >
              <ExternalLink className="h-4 w-4" />
              View
            </button>
          </div>

          <div className="p-3 border rounded">
            <h3 className="font-medium">Patent 004</h3>
            <button 
              className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm flex items-center gap-2" 
              onClick={() => window.open(`/api/patents/individual/004`, '_blank')}
            >
              <ExternalLink className="h-4 w-4" />
              View
            </button>
          </div>

          <div className="p-3 border rounded">
            <h3 className="font-medium">Patent 005</h3>
            <button 
              className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm flex items-center gap-2" 
              onClick={() => window.open(`/api/patents/individual/005`, '_blank')}
            >
              <ExternalLink className="h-4 w-4" />
              View
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}