import express from "express";
import type { Request, Response } from "express";
import { exec } from "child_process";
import { Readable } from "stream";

const app = express();
const PORT: number = parseInt(process.env.PORT || "3000", 10);

app.get("/download", async (req: Request, res: Response) => {
  const { url } = req.query as { url?: string };
  if (!url) {
    console.log("❌ Erreur : URL manquante dans la requête");
    return res.status(400).send("URL required");
  }

  console.log(`🚀 Démarrage du téléchargement audio depuis : ${url}`);
  console.log("� Streaming direct du fichier audio...");

  const command = `python3.10 -m yt_dlp -x --audio-format mp3 -o - ${url}`;

  exec(command, { maxBuffer: 1024 * 1024 * 50 }, (error, stdout, stderr) => {
    if (error) {
      console.error("❌ Erreur lors du téléchargement :", error.message);
      if (!res.headersSent) {
        return res.status(500).send(error.message);
      }
      return;
    }

    if (stderr && stderr.trim()) {
      console.warn("⚠️ Warnings yt-dlp :", stderr);
    }

    console.log("✅ Audio récupéré avec succès, streaming en cours...");

    // Définir les headers pour le téléchargement
    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="reels_audio.mp3"'
    );

    // Créer un stream à partir de stdout et le pipe vers la réponse
    const stream = Readable.from(stdout);
    stream.pipe(res);

    // Gérer les erreurs de stream
    stream.on("error", (streamError) => {
      console.error("❌ Erreur lors du streaming :", streamError);
      if (!res.headersSent) {
        res.status(500).send("Erreur lors du streaming");
      }
    });

    res.on("finish", () => {
      console.log("📤 Streaming terminé avec succès");
    });
  });
});

app.listen(PORT, () => console.log(`API running on port ${PORT}`));
