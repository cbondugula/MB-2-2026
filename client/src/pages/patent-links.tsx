import { useQuery } from "@tanstack/react-query";
import { ExternalLink } from "lucide-react";

export default function PatentLinks() {
  const { data: patents, isLoading } = useQuery({
    queryKey: ['/api/patents/all-status'],
  });

  if (isLoading) {
    return <div className="p-6">Loading patent links...</div>;
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-6">MedBuilder Patent Filing Links</h1>
        
        <div className="space-y-4">
          {patents?.status?.patents && Object.entries(patents.status.patents).map(([id, patent]: [string, any]) => (
            <div key={id} className="border rounded p-4">
              <h3 className="font-semibold text-lg mb-2">{patent.title}</h3>
              <button 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center justify-center gap-2" 
                onClick={() => window.open(`/api/patents/individual/${id}`, '_blank')}
              >
                <ExternalLink className="h-4 w-4" />
                View Complete Patent Application
              </button>
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-blue-50 rounded">
          <p className="text-sm text-gray-700">
            <strong>Filing Instructions:</strong> Click each link to review complete patent documentation. 
            Use TITLE ONLY when filing with USPTO - no internal numbers.
          </p>
        </div>
      </div>
    </div>
  );
}