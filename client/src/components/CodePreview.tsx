import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Play, 
  RefreshCw, 
  Maximize2, 
  AlertCircle,
  Code as CodeIcon,
  Loader2
} from "lucide-react";

interface CodePreviewProps {
  code: Record<string, string>; // { "index.html": "...", "style.css": "..." }
  framework?: string;
  className?: string;
}

export function CodePreview({ code, framework = "html", className = "" }: CodePreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState<"preview" | "code">("preview");

  const generatePreviewHTML = () => {
    try {
      // For simple HTML/CSS/JS apps
      const html = code["index.html"] || code["App.tsx"] || code["main.tsx"] || "";
      const css = code["style.css"] || code["styles.css"] || "";
      const js = code["script.js"] || code["main.js"] || "";

      // If it's a React app, we need to provide a minimal runtime
      if (framework === "react" || code["App.tsx"] || code["package.json"]) {
        return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Preview</title>
  <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: system-ui, -apple-system, sans-serif; }
    ${css}
  </style>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel">
    ${code["App.tsx"] || code["App.jsx"] || ""}
    
    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(<App />);
  </script>
</body>
</html>`;
      }

      // For vanilla HTML/CSS/JS
      return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Preview</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: system-ui, -apple-system, sans-serif; }
    ${css}
  </style>
</head>
<body>
  ${html}
  <script>${js}</script>
</body>
</html>`;
    } catch (err) {
      console.error("Error generating preview:", err);
      setError("Failed to generate preview. The code may have syntax errors.");
      return "";
    }
  };

  const refreshPreview = () => {
    setIsLoading(true);
    setError(null);
    
    setTimeout(() => {
      if (iframeRef.current) {
        const previewHTML = generatePreviewHTML();
        if (previewHTML) {
          iframeRef.current.srcdoc = previewHTML;
        }
      }
      setIsLoading(false);
    }, 500);
  };

  useEffect(() => {
    refreshPreview();
  }, [code]);

  const openFullscreen = () => {
    const previewHTML = generatePreviewHTML();
    const newWindow = window.open("", "_blank");
    if (newWindow) {
      newWindow.document.write(previewHTML);
      newWindow.document.close();
    }
  };

  return (
    <Card className={`bg-gray-800 border-gray-700 ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CardTitle className="text-lg text-white flex items-center gap-2">
              <Play className="w-5 h-5 text-green-400" />
              Live Preview
            </CardTitle>
            <Badge variant="outline" className="bg-green-900 text-green-300 border-green-700 text-xs">
              {framework}
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <Tabs value={previewMode} onValueChange={(v) => setPreviewMode(v as any)} className="mr-2">
              <TabsList className="bg-gray-700">
                <TabsTrigger value="preview" className="text-xs">
                  <Play className="w-3 h-3 mr-1.5" />
                  Preview
                </TabsTrigger>
                <TabsTrigger value="code" className="text-xs">
                  <CodeIcon className="w-3 h-3 mr-1.5" />
                  Source
                </TabsTrigger>
              </TabsList>
            </Tabs>
            
            <Button
              variant="outline"
              size="sm"
              onClick={refreshPreview}
              disabled={isLoading}
              className="bg-gray-700 border-gray-600 text-gray-200"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={openFullscreen}
              className="bg-gray-700 border-gray-600 text-gray-200"
            >
              <Maximize2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {error && (
          <div className="bg-red-900/20 border border-red-700 rounded-lg p-4 mb-4">
            <div className="flex items-start gap-2 text-red-400">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-sm">Preview Error</p>
                <p className="text-xs mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        {previewMode === "preview" ? (
          <div className="relative bg-white rounded-lg overflow-hidden" style={{ height: "600px" }}>
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50 z-10">
                <Loader2 className="w-8 h-8 text-green-500 animate-spin" />
              </div>
            )}
            <iframe
              ref={iframeRef}
              className="w-full h-full border-0"
              sandbox="allow-scripts allow-forms allow-modals allow-popups"
              title="Code Preview"
            />
          </div>
        ) : (
          <div className="bg-gray-950 rounded-lg p-4 overflow-auto" style={{ height: "600px" }}>
            <pre className="text-xs text-gray-300 font-mono">
              {generatePreviewHTML()}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
