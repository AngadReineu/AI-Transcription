const express = require("express");
const vader = require("vader-sentiment");
const natural = require("natural");
const { summarizeText } = require("../utils/gemini");

const router = express.Router();
// summary

router.post("/summary", async (req, res) => {
  try {
    const { transcript } = req.body;
    if (!transcript) return res.status(400).json({ error: "Transcript missing" });

    const summary = await summarizeText(
      Array.isArray(transcript)
        ? transcript.map(t => t.text).join(" ")
        : transcript
    );

    res.json({ success: true, response: summary });
  } catch (err) {
    console.error("Summary error:", err);
    res.status(500).json({ success: false, response: "Summarization failed" });
  }
});

//sentiment
router.post("/sentiment", (req, res) => {
  try {
    const { transcript } = req.body;
    if (!transcript) return res.status(400).json({ error: "Transcript missing" });

    const text = Array.isArray(transcript)
      ? transcript.map(t => t.text).join(" ")
      : transcript;

    const scores = vader.SentimentIntensityAnalyzer.polarity_scores(text);
    res.json({ success: true, response: scores });
  } catch (err) {
    console.error("Sentiment error:", err);
    res.status(500).json({ success: false, response: "Sentiment analysis failed" });
  }
});

// topic
router.post("/topics", (req, res) => {
  try {
    const { transcript } = req.body;
    if (!transcript) return res.status(400).json({ error: "Transcript missing" });

    const text = Array.isArray(transcript)
      ? transcript.map(t => t.text).join(" ")
      : transcript;

    const tokenizer = new natural.WordTokenizer();
    const words = tokenizer.tokenize(text.toLowerCase());

    const stopwords = new Set(natural.stopwords);
    const filtered = words.filter(w => !stopwords.has(w) && w.length > 2);

    const tfidf = new natural.TfIdf();
    tfidf.addDocument(filtered.join(" "));

    const keywords = tfidf.listTerms(0).slice(0, 10).map(i => i.term);
    res.json({ success: true, response: keywords });
  } catch (err) {
    console.error("Topic extraction error:", err);
    res.status(500).json({ success: false, response: "Topic extraction failed" });
  }
});

module.exports = router;
