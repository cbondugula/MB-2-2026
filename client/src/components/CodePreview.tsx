import { Sandpack } from "@codesandbox/sandpack-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Code, ExternalLink } from "lucide-react";
import { useState } from "react";

interface CodePreviewProps {
  code: Record<string, string>; // { "App.tsx": "...", "App.css": "..." }
  framework?: string;
  className?: string;
}

export function CodePreview({ code, framework = "react", className = "" }: CodePreviewProps) {
  const [showCode, setShowCode] = useState(false);
  
  // Check if we have valid code files
  const hasCode = Object.keys(code).length > 0;
  
  if (!hasCode) {
    return (
      <Card className={`bg-gray-800 border-gray-700 ${className}`}>
        <CardContent className="py-12 text-center">
          <Code className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">No code files to preview</p>
        </CardContent>
      </Card>
    );
  }

  // Convert code object to Sandpack files format with proper paths
  const files: Record<string, { code: string }> = {};
  
  Object.entries(code).forEach(([path, content]) => {
    // Ensure path starts with /
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    files[normalizedPath] = { code: content };
  });

  // Add index.tsx entry point if missing
  if (!files["/index.tsx"] && !files["/index.ts"] && !files["/index.js"]) {
    const appFile = Object.keys(files).find(f => f.includes('App.tsx') || f.includes('App.jsx') || f.includes('App.ts'));
    const appImport = appFile ? appFile.replace('/', '').replace('.tsx', '').replace('.jsx', '').replace('.ts', '') : 'App';
    
    files["/index.tsx"] = {
      code: `import { createRoot } from "react-dom/client";
import ${appImport} from "./${appImport}";
${files["/App.css"] ? 'import "./App.css";' : ''}

const root = createRoot(document.getElementById("root")!);
root.render(<${appImport} />);
`
    };
  }

  return (
    <Card className={`bg-gray-800 border-gray-700 ${className}`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CardTitle className="text-lg text-white flex items-center gap-2">
              <Play className="w-5 h-5 text-[#8CC63F]" />
              Live Preview
            </CardTitle>
            <Badge variant="outline" className="bg-[#1a3d00] text-[#8CC63F] border-[#5a8f00] text-xs">
              {framework}
            </Badge>
          </div>
          <button
            onClick={() => setShowCode(!showCode)}
            className="text-xs text-gray-400 hover:text-white flex items-center gap-1"
          >
            <Code className="w-3 h-3" />
            {showCode ? 'Hide Code' : 'Show Code'}
          </button>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="rounded-lg overflow-hidden border border-gray-700" style={{ height: "500px" }}>
          <Sandpack
            template="react-ts"
            files={files}
            theme="dark"
            options={{
              showNavigator: false,
              showTabs: showCode,
              showLineNumbers: showCode,
              showInlineErrors: true,
              wrapContent: true,
              editorHeight: 500,
              editorWidthPercentage: showCode ? 50 : 0,
              initMode: "lazy",
              autorun: true,
              recompileMode: "delayed",
              recompileDelay: 1000,
            }}
            customSetup={{
              dependencies: {
                "react": "^18.2.0",
                "react-dom": "^18.2.0",
              },
            }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">
          Powered by CodeSandbox • Click "Try again" if preview doesn't load
        </p>
      </CardContent>
    </Card>
  );
}
