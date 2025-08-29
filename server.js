import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// Endpoint to scrape Instagram media
app.post("/download", async (req, res) => {
  const { url } = req.body;

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0 Safari/537.36",
      },
    });

    const html = await response.text();

    // Look for JSON data
    const jsonMatch = html.match(/"display_url":"([^"]+)"/);
    const videoMatch = html.match(/"video_url":"([^"]+)"/);

    if (videoMatch) {
      res.json({ type: "VIDEO", media_url: videoMatch[1].replace(/\\u0026/g, "&") });
    } else if (jsonMatch) {
      res.json({ type: "IMAGE", media_url: jsonMatch[1].replace(/\\u0026/g, "&") });
    } else {
      res.status(404).json({ error: "Media not found. Maybe private?" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to scrape content" });
  }
});

app.listen(5000, () => console.log("✅ Server running on http://localhost:5000"));
