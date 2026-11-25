
import express from "express";
import { GoogleGenAI } from "@google/genai";
import path from "node:path";
import { fileURLToPath } from "node:url";

const app = express();
const PORT = process.env.PORT || 10000;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(express.json({ limit: "1mb" }));

// الصفحة الرئيسية
app.get("/", (_req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// فحص السيرفر
app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    app: "M3 AI",
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY)
  });
});

// المحادثة مع الذكاء الاصطناعي
app.post("/api/chat", async (req, res) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(503).json({
        error: "لم يتم إعداد Gemini API Key"
      });
    }

    const messages = req.body?.messages;

    if (!Array.isArray(messages) || !messages.length || messages.length > 30) {
      return res.status(400).json({ error: "الرسائل غير صالحة" });
    }

    const contents = messages
      .filter(m => m && ["user", "model"].includes(m.role) && typeof m.text === "string")
      .map(m => ({
        role: m.role,
        parts: [{ text: m.text.slice(0, 12000) }]
      }));

    if (!contents.length || contents[contents.length - 1].role !== "user") {
      return res.status(400).json({ error: "أرسل رسالة صحيحة" });
    }

    const ai = new GoogleGenAI({ apiKey });

    const result = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL || "gemini-3.8-flash",
      contents,
      config: {
        systemInstruction: "أنت M3 AI، مساعد ذكي مفيد وواضح. أجب بلغة المستخدم."
      }
    });

    res.json({ reply: result.text || "لم يصل رد نصي." });

  } catch (error) {
    console.error("Gemini error:", error);
    res.status(500).json({
      error: "تعذر الاتصال بـ Gemini"
    });
  }
});

app.listen(PORT, () => {
  console.log(`M3 AI running on port ${PORT}`);
});
