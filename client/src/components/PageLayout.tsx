import TopNavigation from "@/components/TopNavigation";
import LeftSidebar from "@/components/LeftSidebar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useLocation } from "wouter";

interface PageLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
  isLoading?: boolean;
  showBackButton?: boolean;
  headerActions?: React.ReactNode;
}

export default function PageLayout({ 
  children, 
  title, 
  description, 
  isLoading = false,
  showBackButton = true,
  headerActions
}: PageLayoutProps) {
  const [, setLocation] = useLocation();

  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      setLocation('/');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#76B900] mx-auto mb-4" />
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <TopNavigation />
      
      <div className="flex">
        <LeftSidebar />
        
        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {showBackButton && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleBack}
                    className="bg-gray-900 border-gray-800 text-gray-200 hover:bg-gray-800 hover:text-white"
                    data-testid="button-back"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                )}
                <div>
                  <h1 className="text-2xl font-bold text-white">{title}</h1>
                  {description && (
                    <p className="text-gray-400 mt-1">{description}</p>
                  )}
                </div>
              </div>
              {headerActions && (
                <div className="flex items-center space-x-3">
                  {headerActions}
                </div>
              )}
            </div>
            
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
