import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DIST_DIR = path.join(__dirname, 'dist');
const PORT = parseInt(process.env.PORT || '8080', 10);
const HOST = '0.0.0.0';

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.txt': 'text/plain; charset=utf-8',
};

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

async function callGemini(apiKey, payload) {
  const models = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash'];
  let lastErr = null;

  for (const model of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        return await res.json();
      }

      const errText = await res.text();
      console.error(`Gemini call failed for ${model} (${res.status}):`, errText);
      lastErr = { status: res.status, statusText: res.statusText, details: errText };

      if (res.status === 401 || res.status === 403) {
        break;
      }
    } catch (e) {
      lastErr = { message: e.message };
    }
  }

  throw lastErr;
}

async function handleChat(req, res) {
  try {
    const { messages, context } = await readJsonBody(req);
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        message: "Chat agent is currently running in offline preview mode. Please configure your GEMINI_API_KEY."
      }));
      return;
    }

    const history = (messages || []).slice(-6);
    const contextJson = JSON.stringify({
      location: context?.location,
      current: context?.current,
      dayRange: context?.dayRange,
      wear: context?.wear,
      pack: context?.pack,
      tags: context?.tags,
      severity: context?.severity,
      hourly: context?.hourly?.map((h) => ({
        time: h.displayTime,
        tempF: h.tempF,
        condition: h.condition,
      })),
    });

    const isExtreme = context?.severity === "extreme";
    const systemInstruction = `You are the assistant inside Today.io, a weather app that tells people what to wear and pack.

You can only discuss TODAY, for the location in CONTEXT below. You have no ability to look up other days, other locations, or historical weather.
If asked about other days or other locations, say: "I can only talk about today right now." and stop.

Answer only from CONTEXT. Never invent a temperature, condition, or forecast. If CONTEXT doesn't contain the answer, say so.

VOICE:
${isExtreme ? "- Severity is extreme: Use plain, factual voice only. No wit or stylisation of any kind." : "- Conclusion first, then the reason, then stop. Short declarative sentences. Specific over intense. No exclamation marks, no hedging, no personified weather, no clichés, no emoji, no profanity."}

RULES:
1. When asked whether an item can be substituted, give a direct YES or NO first, then one line of reasoning grounded in the actual conditions from CONTEXT.
2. Keep answers under 60 words unless the user explicitly asks for detail.
3. SAFETY: You do not give medical diagnoses or travel-safety verdicts.
   - If asked about medical symptoms (heat stroke, hypothermia, etc.): do not diagnose; point to medical professionals or emergency services immediately.
   - If asked whether it is safe to drive, fly, or travel: describe the conditions accurately, do not issue a safety verdict.
   - If asked about an active weather emergency: state conditions and direct to official local authorities.

CONTEXT:
${contextJson}`;

    const contents = history.map((m) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.content || m.text }],
    }));

    let data;
    try {
      data = await callGemini(apiKey, {
        systemInstruction: { parts: [{ text: systemInstruction }] },
        contents,
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 150,
        },
      });
    } catch (callErr) {
      console.error("Gemini chat error:", callErr);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        message: "Unable to complete request right now.",
        error: callErr.statusText || callErr.message || "Failed",
        details: callErr.details,
        retryable: true,
      }));
      return;
    }

    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      message: reply || "I can only answer questions about today's weather and recommendations."
    }));
  } catch (err) {
    console.error("Chat turn error:", err);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: "Internal server error", error: err.message }));
  }
}

async function handleGenerateCopy(req, res) {
  try {
    const { current, dayRange, wearIcons, packIcons, severity } = await readJsonBody(req);
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ fallback: true }));
      return;
    }

    let voiceTone = "Blunt, dry, and confident. Short declarative sentences. Specific over intense. No exclamation marks, no hedging, no personified weather, no clichés, no emoji.";
    if (severity === "elevated") {
      voiceTone = "Blunt but no wit. Straight facts and instruction only. Serious weather conditions.";
    } else if (severity === "extreme") {
      voiceTone = "Plain and factual only. No stylisation or humor of any kind. Dangerous weather conditions.";
    }

    const systemInstruction = `You write the editorial copy for Today.io, a weather utility app that tells people what to wear and pack today in one glance.

TONE: ${voiceTone}

CRITICAL RULES:
1. You MUST describe ONLY the exact items in WEAR_ITEMS and PACK_ITEMS. Never recommend or name any garment or item not in those lists.
2. Character limits (STRICT):
   - headline: 20 to 110 characters.
   - wearDescription: 30 to 180 characters.
   - packDescription: 30 to 180 characters.
   - nowDescription: 20 to 90 characters.
3. Respond in valid, strict JSON ONLY. No markdown fences, no explanatory text.`;

    const prompt = `Current Weather: ${current?.condition}, ${current?.tempF}°F (Feels like ${current?.feelsLikeF}°F).
Day Range: Low ${dayRange?.minTempF}°F / High ${dayRange?.maxTempF}°F. Rain probability: ${current?.precipProbability}%. Wind: ${current?.windMph} mph.
WEAR_ITEMS: ${(wearIcons || []).join(', ') || "None"}
PACK_ITEMS: ${(packIcons || []).join(', ') || "None"}
Severity: ${severity}

Return strict JSON:
{
  "headline": "Short punchy headline summary (20-110 chars)",
  "wearDescription": "Why to wear these specific items (30-180 chars)",
  "packDescription": "Why to pack these specific items (30-180 chars)",
  "nowDescription": "Current moment conditions summary (20-90 chars)"
}`;

    let data;
    try {
      data = await callGemini(apiKey, {
        contents: [{ parts: [{ text: `${systemInstruction}\n\n${prompt}` }] }],
        generationConfig: {
          temperature: 0.4,
          responseMimeType: "application/json",
        },
      });
    } catch (err) {
      console.error("Generate copy error:", err);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ fallback: true }));
      return;
    }

    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    const parsed = rawText ? JSON.parse(rawText) : {};
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(parsed));
  } catch (err) {
    console.error("Generate copy error:", err);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ fallback: true }));
  }
}

const server = http.createServer(async (req, res) => {
  const reqPath = decodeURI(req.url.split('?')[0]);

  // API endpoints
  if (req.method === 'GET' && reqPath === '/api/debug-models') {
    const apiKey = process.env.GEMINI_API_KEY;
    try {
      const resGl = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`, {
        headers: { 'x-goog-api-key': apiKey }
      });
      const glText = await resGl.text();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        glStatus: resGl.status,
        glBody: glText,
      }));
    } catch (e) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: e.message }));
    }
    return;
  }

  if (req.method === 'POST' && reqPath === '/api/chat') {
    return handleChat(req, res);
  }
  if (req.method === 'POST' && reqPath === '/api/generate-copy') {
    return handleGenerateCopy(req, res);
  }

  let filePath = path.join(DIST_DIR, reqPath);

  if (!filePath.startsWith(DIST_DIR)) {
    res.statusCode = 403;
    res.end('Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (!err && stats.isFile()) {
      const ext = path.extname(filePath).toLowerCase();
      res.writeHead(200, {
        'Content-Type': MIME_TYPES[ext] || 'application/octet-stream',
        'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=31536000, immutable'
      });
      fs.createReadStream(filePath).pipe(res);
      return;
    }

    const indexPath = path.join(DIST_DIR, 'index.html');
    fs.readFile(indexPath, (readErr, content) => {
      if (readErr) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(content);
    });
  });
});

server.listen(PORT, HOST, () => {
  console.log(`Server listening on http://${HOST}:${PORT}`);
});
