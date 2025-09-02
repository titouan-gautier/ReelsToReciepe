import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export function ReelDownloader() {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleDownload = async () => {
    if (!url.trim()) {
      setMessage("Veuillez entrer une URL valide");
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      // Appeler l'API backend pour le téléchargement direct
      const apiUrl = `http://localhost:3000/download?url=${encodeURIComponent(url)}`;

      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      // Créer un lien de téléchargement automatique
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = 'reels_audio.mp3';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);

      setMessage("✅ Téléchargement réussi !");
    } catch (error) {
      console.error("Erreur lors du téléchargement:", error);
      setMessage(`❌ Erreur: ${(error as Error).message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Reels to Recipe</CardTitle>
        <CardDescription>
          Entrez l'URL d'un reel Instagram pour lancer l'automatisation
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="reel-url">URL du Reel Instagram</Label>
          <Input
            id="reel-url"
            type="url"
            placeholder="https://www.instagram.com/reel/..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full"
          />
        </div>

        <Button
          onClick={handleDownload}
          disabled={isLoading}
          className="w-full"
          size="lg"
        >
          {isLoading ? "Lancement en cours..." : "Lancer l'Automatisation"}
        </Button>

        {message && (
          <div
            className={`text-center text-sm p-2 rounded ${
              message.includes("Erreur") || message.includes("Veuillez")
                ? "bg-destructive/10 text-destructive"
                : "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
            }`}
          >
            {message}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
