import { Card, CardContent } from "@/components/ui/card";
import { ReelDownloader } from "./ReelDownloader";
import "./index.css";

export function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <ReelDownloader />
      </div>
    </div>
  );
}

export default App;
