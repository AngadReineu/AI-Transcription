const { GoogleGenAI } = require("@google/genai");
require("dotenv").config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Retry helper
async function retry(fn, retries = 3, delay = 1000) {
  try {
    return await fn();
  } catch (err) {
    if (retries <= 0) throw err;
    await new Promise(res => setTimeout(res, delay));
    return retry(fn, retries - 1, delay * 2);
  }
}

async function summarizeText(text) {
  try {
    const result = await retry(async () => {
      return await ai.models.generateContent({
        model: "models/gemini-2.5-flash",
        contents: [
          {
            role: "user",
            parts: [
              { text: `Summarize this conversation clearly:\n\n${text}` },
            ],
          },
        ],
      });
    });

    const summary =
      result?.candidates?.[0]?.content?.parts?.[0]?.text ??
      "⚠️ No summary generated.";

    return summary;

  } catch (error) {
    console.error("Gemini summarization error:", error);
    return "⚠️ Summarization failed. Try again later.";
  }
}

module.exports = { summarizeText };
