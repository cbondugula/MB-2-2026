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

  const findFile = (patterns: string[]) => {
    for (const pattern of patterns) {
      const exactMatch = code[pattern];
      if (exactMatch) return exactMatch;
      
      const pathMatch = Object.keys(code).find(key => 
        key.endsWith(`/${pattern}`) || key === pattern
      );
      if (pathMatch) return code[pathMatch];
    }
    return "";
  };

  const generatePreviewHTML = () => {
    try {
      console.log("Generating preview with code:", Object.keys(code));
      
      const html = findFile(["index.html", "public/index.html"]);
      const css = findFile(["style.css", "styles.css", "App.css", "src/App.css"]);
      const js = findFile(["script.js", "main.js"]);
      const appTsx = findFile(["App.tsx", "App.jsx", "src/App.tsx", "src/App.jsx"]);
      const mainComponent = findFile(["Dashboard.tsx", "src/components/Dashboard.tsx"]);

      const isReactApp = framework === "react" || appTsx || code["package.json"] || Object.keys(code).some(k => k.endsWith('.tsx') || k.endsWith('.jsx'));

      if (isReactApp) {
        // Transform components by removing imports and exports
        const transformComponent = (code: string) => {
          let transformed = code;
          
          // Remove all import statements
          transformed = transformed.replace(/import\s+.*?from\s+['"].*?['"];?\n?/g, '');
          transformed = transformed.replace(/import\s+['"].*?['"];?\n?/g, '');
          
          // Remove export default
          transformed = transformed.replace(/export\s+default\s+/g, '');
          
          // Remove export keyword
          transformed = transformed.replace(/export\s+/g, '');
          
          // Remove TypeScript type annotations
          // Remove : Type from variables
          transformed = transformed.replace(/:\s*\w+(<[^>]+>)?(?=\s*[=;,)])/g, '');
          
          // Remove React.FC
          transformed = transformed.replace(/:\s*React\.FC(<[^>]+>)?/g, '');
          
          // Remove interface/type definitions
          transformed = transformed.replace(/interface\s+\w+\s*\{[^}]*\}/g, '');
          transformed = transformed.replace(/type\s+\w+\s*=\s*[^;]+;/g, '');
          
          // Remove generic type constraints
          transformed = transformed.replace(/useParams<\{[^}]+\}>\(\)/g, 'useParams()');
          transformed = transformed.replace(/useState<[^>]+>/g, 'useState');
          
          // Remove any remaining type annotations in angle brackets
          transformed = transformed.replace(/<\{[^}]+\}>/g, '');
          
          return transformed;
        };

        // Get all component files and transform them
        const componentFiles = Object.entries(code)
          .filter(([key]) => key.endsWith('.tsx') || key.endsWith('.jsx'))
          .map(([filename, content]) => ({
            name: filename.split('/').pop()?.replace(/\.(tsx|jsx)$/, ''),
            code: transformComponent(content)
          }));

        // Build the components code
        const componentsCode = componentFiles
          .map(({ code }) => code)
          .join('\n\n');

        // Debug: Log transformed code
        console.log("=== TRANSFORMED CODE ===");
        console.log(componentsCode.substring(0, 500));
        console.log("=== END PREVIEW ===");

        // Create router mocks
        const routerMocks = `
          // Mock react-router-dom
          const BrowserRouter = ({ children }) => children;
          const Router = ({ children }) => children;
          const Routes = ({ children }) => {
            const route = React.Children.toArray(children).find(child => 
              child.props.path === '/' || child.props.path === window.location.hash.slice(1)
            );
            return route || React.Children.toArray(children)[0];
          };
          const Route = ({ element }) => element;
          const Link = ({ to, children, className }) => 
            React.createElement('a', { 
              href: '#' + to, 
              className,
              onClick: (e) => { e.preventDefault(); window.location.hash = to; }
            }, children);
          const useParams = () => {
            const hash = window.location.hash.slice(1);
            const parts = hash.split('/');
            return { id: parts[parts.length - 1] };
          };
          const useNavigate = () => (path) => { window.location.hash = path; };
        `;

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
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: system-ui, -apple-system, sans-serif; }
    ${css}
  </style>
  <script>
    // Catch Babel transpilation errors
    window.addEventListener('error', function(e) {
      console.error('❌ Global error:', e.message, e.error);
      if (e.message.includes('Babel')) {
        document.getElementById('root').innerHTML = 
          '<div style="padding: 20px; color: red; font-family: monospace;">' +
          '<h2>Babel Transpilation Error</h2>' +
          '<p>' + e.message + '</p>' +
          '</div>';
      }
    });
  </script>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel" data-type="module">
    try {
      console.log('🔵 Starting React app mount...');
      
      ${routerMocks}
      
      console.log('🔵 Router mocks loaded');
      
      ${componentsCode}
      
      console.log('🔵 Components code executed');
      console.log('🔵 App component:', typeof App);
      
      const root = ReactDOM.createRoot(document.getElementById('root'));
      console.log('🔵 React root created');
      
      root.render(React.createElement(App));
      console.log('✅ React app mounted successfully!');
      
      // Handle hash changes for routing
      window.addEventListener('hashchange', () => {
        root.render(React.createElement(App));
      });
    } catch (error) {
      console.error('❌ Failed to mount React app:', error);
      console.error('❌ Error stack:', error.stack);
      document.getElementById('root').innerHTML = 
        '<div style="padding: 20px; color: red; font-family: monospace;">' +
        '<h2>Preview Error</h2>' +
        '<p><strong>Message:</strong> ' + error.message + '</p>' +
        '<pre style="white-space: pre-wrap; font-size: 12px;">' + error.stack + '</pre>' +
        '</div>';
    }
  </script>
</body>
</html>`;
      }

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
