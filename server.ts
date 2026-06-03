import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import 'dotenv/config';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  app.post("/api/analyze", async (req, res) => {
    try {
      const { schedules } = req.body;
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `I am a Software Engineer. Please analyze the following Planned versus Actual schedule data for my day:
${JSON.stringify(schedules, null, 2)}

Please provide:
1. **Daily Summary: Planned vs. Actual**: Use a clean Markdown table comparing Planned Time, Actual Time, and the Delta (difference) for each task.
2. **Top Bottlenecks & Inefficiencies**: Identify specific discrepancies, bottlenecks, and time-use inefficiencies based on the notes provided.
3. **Optimization Strategies**: Conclude with 2-3 structural and actionable suggestions for improvement to help me better manage my focus and time tomorrow.

Keep the tone professional and the formatting highly scannable using short paragraphs and bullet points.`,
      });
      res.json({ analysis: response.text });
    } catch (e: any) {
      res.status(500).json({ error: e.message || "Failed to analyze data" });
    }
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
