const express = require('express');
const axios = require('axios');
const verifyToken = require('../middleware/authMiddleware');
const router = express.Router();

// POST /chat
router.post('/', verifyToken, async (req, res) => {
  const { query, summary } = req.body;
  if (!query || !summary) {
    return res.status(400).json({ message: 'Missing query or summary' });
  }
  const prompt = `You are a helpful finance assistant. The user asked: "${query}"

Here is a summary of their recent transactions and financial data:
${JSON.stringify(summary, null, 2)}

---

Here is a breakdown of their expenses by category:
${summary.expensesByCategory ? Object.entries(summary.expensesByCategory).map(([cat, amt]) => `- ${cat}: ${amt}`).join('\n') : 'N/A'}

Here is a breakdown of their income by category:
${summary.incomeByCategory ? Object.entries(summary.incomeByCategory).map(([cat, amt]) => `- ${cat}: ${amt}`).join('\n') : 'N/A'}

Overall stats:
- Total Income: ${summary.totalIncome}
- Total Expenses: ${summary.totalExpenses}
- Balance: ${summary.balance}

Answer the user's question in a concise, friendly way, follow INR. If you use any numbers, base them only on the summary provided. If you can't answer, say so.`;
  try {
    // Use Gemini API key from environment variable
    const geminiApiKey = process.env.GEMINI_API_KEY;
    const geminiRes = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${geminiApiKey}`,
      { contents: [{ parts: [{ text: prompt }] }] }
    );
    const geminiText = geminiRes.data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    res.json({ response: geminiText });
  } catch (err) {
    console.error('Gemini API error:', err?.response?.data || err);
    res.status(500).json({ message: 'Gemini API error', error: err?.response?.data || err });
  }
});

module.exports = router;
