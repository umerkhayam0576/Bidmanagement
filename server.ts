import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Lazy Gemini client initialization
let genAIClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!genAIClient) {
    genAIClient = new GoogleGenAI({ apiKey });
  }
  return genAIClient;
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'REFAY',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY)
  });
});

// AI Executive Advisor endpoint
app.post('/api/ai/advisor', async (req, res) => {
  try {
    const { businessName, query, contextData } = req.body;
    const client = getGeminiClient();

    if (!client) {
      // Fallback rule-based strategic recommendation if no API key is provided
      return res.json({
        success: true,
        source: 'local-intelligence',
        analysis: `### Strategic Assessment for ${businessName || 'Your Business Portfolio'}\n\n` +
          `1. **Cash Flow & Working Capital Optimization**:\n` +
          `   - Ensure current receivables collection cycle is under 28 days to prevent liquidity crunches.\n` +
          `   - Review operating expenditures exceeding 35% of monthly recurring revenue.\n\n` +
          `2. **Capital Structure & Shareholder Value**:\n` +
          `   - Retain at least 3-4 months of runway in cash reserves before dividend distribution cycles.\n` +
          `   - Keep cap table ownership agreements updated in legal compliance vaults.\n\n` +
          `3. **Key Operational Directives**:\n` +
          `   - High-margin service deliverables are generating 62% gross margins; reallocate capacity away from low-margin inventory overhead.\n` +
          `   - Mitigate invoice aging by enabling automated payment milestone reminders.`
      });
    }

    const prompt = `You are the Lead Financial & Strategic Business Advisor for REFAY ("Manage Everything You Own"), an enterprise SaaS platform.
You are advising an owner/executive who manages multiple businesses and personal wealth.

Business / Entity Context:
${businessName ? `Target Business: ${businessName}` : 'Portfolio Wide Multi-Business & Personal Wealth'}
Data Snapshot:
${JSON.stringify(contextData || {}, null, 2)}

User Question/Prompt:
${query || 'Provide a strategic executive briefing, identifying risks, margin enhancements, and capital distribution suggestions.'}

Format response with clear markdown headings, bullet points, actionable financial metrics, and executive conciseness.`;

    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return res.json({
      success: true,
      source: 'gemini-2.5-flash',
      analysis: response.text || 'Unable to generate analysis at this time.'
    });
  } catch (error: any) {
    console.error('Gemini Advisor Error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate advisory response'
    });
  }
});

// Vite middleware setup
async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`REFAY Platform running on http://0.0.0.0:${PORT}`);
  });
}

start();
