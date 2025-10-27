import { Sandpack } from "@codesandbox/sandpack-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play } from "lucide-react";

interface CodePreviewProps {
  code: Record<string, string>; // { "src/App.tsx": "...", "package.json": "..." }
  framework?: string;
  className?: string;
}

export function CodePreview({ code, framework = "react", className = "" }: CodePreviewProps) {
  // Convert code object to Sandpack files format
  const files = Object.entries(code).reduce((acc, [path, content]) => {
    acc[path.startsWith('/') ? path : `/${path}`] = { code: content };
    return acc;
  }, {} as Record<string, { code: string }>);

  // Determine the template based on framework or detected files
  const hasReact = framework === "react" || 
                   Object.keys(code).some(k => k.endsWith('.tsx') || k.endsWith('.jsx')) ||
                   code["package.json"]?.includes('"react"');

  const template = hasReact ? "react-ts" : "vanilla";

  // Ensure package.json exists for React apps
  if (hasReact && !files["/package.json"]) {
    files["/package.json"] = {
      code: JSON.stringify({
        "name": "preview-app",
        "version": "1.0.0",
        "dependencies": {
          "react": "^18.2.0",
          "react-dom": "^18.2.0",
          "react-router-dom": "^6.20.0"
        },
        "devDependencies": {
          "@types/react": "^18.2.0",
          "@types/react-dom": "^18.2.0",
          "typescript": "^5.0.0"
        }
      }, null, 2)
    };
  }

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
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="rounded-lg overflow-hidden" style={{ height: "600px" }}>
          <Sandpack
            template={template}
            files={files}
            theme="dark"
            options={{
              showNavigator: true,
              showTabs: true,
              showLineNumbers: true,
              showInlineErrors: true,
              wrapContent: true,
              editorHeight: 600,
              editorWidthPercentage: 50,
            }}
            customSetup={{
              dependencies: {
                "react": "^18.2.0",
                "react-dom": "^18.2.0",
                "react-router-dom": "^6.20.0",
              },
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
}
