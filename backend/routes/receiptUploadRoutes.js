const express = require('express');
const multer = require('multer');
const Tesseract = require('tesseract.js');
const axios = require('axios');
const fs = require('fs');
const Transaction = require('../models/Transaction');
const verifyToken = require('../middleware/authMiddleware');
const pdfParse = require('../middleware/pdfParse');
const path = require('path');
const Poppler = require('pdf-poppler');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// POST /receipt-upload
router.post('/receipt-upload', verifyToken, upload.single('receipt'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    const filePath = req.file.path;
    const ext = path.extname(req.file.originalname).toLowerCase();
    let ocrRawText = '';
    let confidence = 0.8;
    if (ext === '.pdf') {
      // Try to extract text from PDF
      try {
        const dataBuffer = fs.readFileSync(filePath);
        const pdfData = await pdfParse(dataBuffer);
        ocrRawText = pdfData.text;
        confidence = 0.9;
      } catch (pdfErr) {
        ocrRawText = '';
      }
      // If no text found, fallback to Tesseract on each page image
      if (!ocrRawText.trim()) {
        const outputDir = filePath + '_pages';
        fs.mkdirSync(outputDir, { recursive: true });
        await Poppler.convert(filePath, {
          format: 'jpeg',
          out_dir: outputDir,
          out_prefix: 'page',
          page: null // all pages
        });
        const pageFiles = fs.readdirSync(outputDir).filter(f => f.endsWith('.jpg'));
        let allText = '';
        let minConf = 1;
        for (const pageFile of pageFiles) {
          const pagePath = outputDir + '/' + pageFile;
          const { data: { text, confidence: tConf } } = await Tesseract.recognize(
            pagePath,
            'eng',
            { logger: m => console.log(m) }
          );
          allText += text + '\n';
          minConf = Math.min(minConf, tConf || 0.7);
          fs.unlinkSync(pagePath);
        }
        ocrRawText = allText;
        confidence = minConf;
        fs.rmdirSync(outputDir);
      }
    } else {
      // OCR extraction for images
      const { data: { text, confidence: tConf } } = await Tesseract.recognize(
        filePath,
        'eng',
        { logger: m => console.log(m) }
      );
      ocrRawText = text;
      confidence = tConf || 0.7;
    }
    // --- Multi-bill extraction: split OCR text by page and process each page separately ---
    let ocrPages = [];
    if (ext === '.pdf' && fs.existsSync(filePath + '_pages')) {
      // If we have page images, split by page
      const outputDir = filePath + '_pages';
      const pageFiles = fs.readdirSync(outputDir).filter(f => f.endsWith('.jpg'));
      for (const pageFile of pageFiles) {
        const pagePath = outputDir + '/' + pageFile;
        const { data: { text } } = await Tesseract.recognize(pagePath, 'eng');
        ocrPages.push(text);
      }
      // Clean up page images
      for (const pageFile of pageFiles) {
        fs.unlinkSync(outputDir + '/' + pageFile);
      }
      fs.rmdirSync(outputDir);
    } else if (ocrRawText && ocrRawText.split('\f').length > 1) {
      // If OCR text has form feed (page break)
      ocrPages = ocrRawText.split('\f');
    } else if (ocrRawText) {
      ocrPages = [ocrRawText];
    }
    // Log detected OCR text for debugging
    console.log('--- OCR Detected Text ---');
    ocrPages.forEach((page, idx) => {
      console.log(`Page ${idx + 1}:\n${page}\n--- End of Page ---`);
    });

    let allExtracted = [];
    let geminiDebugResponses = [];
    for (let i = 0; i < ocrPages.length; i++) {
      const pageText = ocrPages[i];
      const prompt = `Extract all financial transactions from this receipt page text. If there are multiple bills or transactions, return an array of JSON objects, each matching this schema: { type: "income" | "expense", category: "string", subcategory: "string (optional)", amount: number (no currency symbol), currency: "string", date: "ISO format string", description: "short transaction note", paymentMethod: "cash" | "card" | "upi" | "bank_transfer" | "other", tags: ["string"], source: "receipt", status: "confirmed", metadata: { extractedFromOCR: true, ocrRawText: "<raw extracted text>", confidenceScore: number between 0 and 1 } }. If there is only one transaction, return an array with a single object. If no transaction is found, return an empty array []. Do not return explanations or markdown, only the JSON array.\n\nReceipt page text: ${pageText}`;
      let geminiRes;
      try {
        geminiRes = await axios.post(
          'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyDUKvKn5sighw0kbadaRCN7__fubxBb1Tw',
          { contents: [{ parts: [{ text: prompt }] }] }
        );
      } catch (apiErr) {
        console.error('Gemini API error:', apiErr?.response?.data || apiErr);
        fs.unlink(filePath, () => {});
        return res.status(500).json({ message: 'Gemini API error', error: apiErr?.response?.data || apiErr });
      }
      // Log Gemini response for debugging
      geminiDebugResponses.push(geminiRes.data);
      const geminiText = geminiRes.data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
      let transactionData;
      // Try to extract JSON array from code block or text
      let jsonMatch = geminiText.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
      let jsonString = jsonMatch ? jsonMatch[1] : geminiText;
      if (jsonString.includes(']')) {
        jsonString = jsonString.substring(0, jsonString.lastIndexOf(']') + 1);
      } else if (jsonString.includes('}')) {
        jsonString = jsonString.substring(0, jsonString.lastIndexOf('}') + 1);
      }
      jsonString = jsonString.replace(/^```json|^```|```$/g, '').trim();
      try {
        transactionData = JSON.parse(jsonString);
      } catch {
        // Try to find the first [...] or {...} block in the string
        let arrMatch = geminiText.match(/\[[\s\S]*\]/);
        let curlyMatch = geminiText.match(/{[\s\S]*}/);
        let block = arrMatch ? arrMatch[0] : (curlyMatch ? curlyMatch[0] : null);
        if (block) {
          block = block.replace(/^```json|^```|```$/g, '').trim();
          try {
            transactionData = JSON.parse(block);
          } catch {
            transactionData = [];
          }
        } else {
          transactionData = [];
        }
      }
      let transactions = Array.isArray(transactionData) ? transactionData : (transactionData ? [transactionData] : []);
      // Fallback: If no transactions found, try a single-transaction prompt
      if (transactions.length === 0) {
        const singlePrompt = `Extract a single financial transaction from this receipt page text. Return a JSON object matching this schema: { type: "income" | "expense", category: "string", subcategory: "string (optional)", amount: number (no currency symbol), currency: "string", date: "ISO format string", description: "short transaction note", paymentMethod: "cash" | "card" | "upi" | "bank_transfer" | "other", tags: ["string"], source: "receipt", status: "confirmed", metadata: { extractedFromOCR: true, ocrRawText: "<raw extracted text>", confidenceScore: number between 0 and 1 } }. If no transaction is found, return {}. Do not return explanations or markdown, only the JSON object.\n\nReceipt page text: ${pageText}`;
        try {
          const singleRes = await axios.post(
            'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyDUKvKn5sighw0kbadaRCN7__fubxBb1Tw',
            { contents: [{ parts: [{ text: singlePrompt }] }] }
          );
          const singleText = singleRes.data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
          let singleMatch = singleText.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
          let singleString = singleMatch ? singleMatch[1] : singleText;
          if (singleString.includes('}')) {
            singleString = singleString.substring(0, singleString.lastIndexOf('}') + 1);
          }
          singleString = singleString.replace(/^```json|^```|```$/g, '').trim();
          let singleObj = {};
          try {
            singleObj = JSON.parse(singleString);
          } catch {
            let curlyMatch = singleText.match(/{[\s\S]*}/);
            if (curlyMatch) {
              let curlyString = curlyMatch[0];
              curlyString = curlyString.replace(/^```json|^```|```$/g, '').trim();
              try {
                singleObj = JSON.parse(curlyString);
              } catch {
                singleObj = {};
              }
            }
          }
          if (singleObj && Object.keys(singleObj).length > 0 && singleObj.type && singleObj.amount && singleObj.date) {
            transactions = [singleObj];
          }
        } catch (e) {
          // ignore fallback error
        }
      }
      // Add to allExtracted
      for (const tx of transactions) {
        if (tx && tx.type && tx.amount && tx.date) {
          allExtracted.push({ ...tx, _ocrPage: i + 1 });
        }
      }
    }
    // If still no transactions, return a friendly message
    if (!allExtracted || allExtracted.length === 0) {
      fs.unlink(filePath, () => {});
      return res.status(200).json({ message: 'No transactions detected in this receipt.' });
    }

    // Save all extracted transactions
    const requiredFields = ['type', 'amount', 'date'];
    let savedTransactions = [];
    for (let tx of allExtracted) {
      tx.userId = req.userId;
      tx.source = 'receipt';
      tx.status = 'confirmed';
      tx.metadata = {
        ...tx.metadata,
        extractedFromOCR: true,
        ocrRawText,
        confidenceScore: confidence ? confidence / 100 : 0.8,
        ocrPage: tx._ocrPage
      };
      delete tx._ocrPage;
      // Validate only the most important required fields
      for (const field of requiredFields) {
        if (tx[field] === undefined || tx[field] === null || tx[field] === '') {
          return res.status(400).json({ message: `Missing required field: ${field}` });
        }
      }
      // Parse date if needed
      if (typeof tx.date === 'string') {
        tx.date = new Date(tx.date);
        if (isNaN(tx.date)) {
          return res.status(400).json({ message: 'Invalid date format from Gemini' });
        }
      }
      const saved = await Transaction.create(tx);
      savedTransactions.push(saved);
    }
    fs.unlink(filePath, () => {});
    res.json(savedTransactions.length === 1 ? savedTransactions[0] : savedTransactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
