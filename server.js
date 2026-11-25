import express from "express";
import { GoogleGenAI } from "@google/genai";
import path from "node:path";
import { fileURLToPath } from "node:url";

const app = express();
const PORT = process.env.PORT || 3000;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(express.json({ limit: "1mb" }));
app.use((_req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, app: "M3 AI", geminiConfigured: Boolean(process.env.GEMINI_API_KEY) });
});

app.post("/api/chat", async (req, res) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(503).json({
        error: "لم يتم إعداد Gemini بعد. أضف GEMINI_API_KEY في Environment على Render."
      });
    }

    const messages = req.body?.messages;
    if (!Array.isArray(messages) || messages.length === 0 || messages.length > 30) {
      return res.status(400).json({ error: "الرسائل المرسلة غير صالحة." });
    }

    const contents = messages
      .filter(m => m && ["user", "model"].includes(m.role) && typeof m.text === "string")
      .map(m => ({
        role: m.role,
        parts: [{ text: m.text.slice(0, 12000) }]
      }));

    if (!contents.length || contents[contents.length - 1].role !== "user") {
      return res.status(400).json({ error: "أرسل رسالة صحيحة أولاً." });
    }

    const ai = new GoogleGenAI({ apiKey });
    const result = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL || "gemini-3.8-flash",
      contents,
      config: {
        systemInstruction: "أنت M3 AI، مساعد ذكي مفيد وواضح. أجب بلغة المستخدم، واستخدم العربية عند التحدث بالعربية. كن دقيقاً، وإذا لم تعرف شيئاً فقل ذلك بوضوح."
      }
    });

    res.json({ reply: result.text || "لم يصل رد نصي من Gemini." });
  } catch (error) {
    console.error("Gemini request failed:", error);
    const status = error?.status === 429 ? 429 : 500;
    res.status(status).json({
      error: status === 429
        ? "تم بلوغ حد الاستخدام مؤقتاً. حاول لاحقاً."
        : "تعذر الاتصال بـ Gemini. تحقق من مفتاح API وإعدادات النموذج."
    });
  }
});

app.use((req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => console.log(`M3 AI running on port ${PORT}`));
