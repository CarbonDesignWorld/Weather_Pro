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
  const models = ['gemini-flash-lite-latest', 'gemini-2.5-flash-lite', 'gemini-3.6-flash', 'gemini-3.8-flash'];
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

const ICON_NAMES = {
  heavy_coat: "heavy coat",
  light_coat: "light coat",
  rain_jacket: "rain jacket",
  wind_breaker: "windbreaker",
  extra_layer: "extra layer",
  long_sleeves: "long sleeves",
  t_shirt: "t-shirt",
  long_pants: "long pants",
  shorts: "shorts",
  boots: "boots",
  rain_boots: "rain boots",
  closed_shoes: "closed shoes",
  sandals: "sandals",
  warm_socks: "warm socks",
  beanie: "beanie",
  sun_hat: "sun hat",
  scarf: "scarf",
  gloves: "gloves",
  shades: "shades",
  umbrella: "umbrella",
  water_bottle: "water bottle",
  sun_screen: "sunscreen",
  lip_balm: "lip balm",
};

const ICON_FASHION_META = {
  heavy_coat: { name: "heavy coat", fabric: "insulated wool or down", feel: "seals body heat against freezing drafts" },
  light_coat: { name: "light coat", fabric: "unlined wool blend or cotton twill", feel: "takes the edge off a brisk morning without overheating" },
  rain_jacket: { name: "rain jacket", fabric: "waterproof breathable nylon shell", feel: "repels steady rain while letting heat escape" },
  wind_breaker: { name: "windbreaker", fabric: "ultralight ripstop nylon", feel: "blocks gusts without trapping heat" },
  extra_layer: { name: "extra layer", fabric: "lightweight merino knit or cardigan", feel: "bridges the gap between cool morning and mild afternoon" },
  long_sleeves: { name: "long sleeves", fabric: "cotton jersey or waffle knit", feel: "shields arms from cool air and mild sun" },
  t_shirt: { name: "t-shirt", fabric: "breathable organic cotton or linen", feel: "lets skin breathe in direct heat" },
  long_pants: { name: "long pants", fabric: "structured dark denim or tailored trousers", feel: "shields legs against wind and damp air" },
  shorts: { name: "shorts", fabric: "linen or lightweight washed cotton twill", feel: "maximum airflow for warm lower body comfort" },
  boots: { name: "boots", fabric: "oiled leather or combat lug-sole", feel: "locks out cold pavement and ground chill" },
  rain_boots: { name: "rain boots", fabric: "waterproof rubber with lugged traction", feel: "keeps feet completely dry through standing water" },
  closed_shoes: { name: "closed shoes", fabric: "leather derbies or canvas sneakers", feel: "versatile everyday foot protection" },
  sandals: { name: "sandals", fabric: "leather slides or minimal open-toe straps", feel: "lets feet breathe freely on warm sidewalks" },
  warm_socks: { name: "warm socks", fabric: "heavy merino wool knit", feel: "essential thermal barrier inside boots" },
  beanie: { name: "beanie", fabric: "ribbed wool or cashmere knit", feel: "stops rapid heat loss from ears and crown" },
  sun_hat: { name: "sun hat", fabric: "woven straw or UPF canvas wide brim", feel: "portable shade shielding face and neck from high UV" },
  scarf: { name: "scarf", fabric: "chunky oatmeal wool knit", feel: "seals the open coat collar against cold wind drafts" },
  gloves: { name: "gloves", fabric: "lined leather or windproof fleece", feel: "preserves finger warmth in biting air" },
  shades: { name: "shades", fabric: "dark UV400 frames", feel: "cuts harsh glare and protects eyes from direct sun" },
  umbrella: { name: "umbrella", fabric: "water-repellent canopy", feel: "overhead protection against downpours" },
  water_bottle: { name: "water bottle", fabric: "insulated flask", feel: "keeps hydration cold through heat" },
  sun_screen: { name: "sunscreen", fabric: "broad-spectrum SPF 50", feel: "invisible barrier against burning UV rays" },
  lip_balm: { name: "lip balm", fabric: "protective beeswax & SPF balm", feel: "prevents wind-chapping and dry lips" },
};

function cleanCopyText(text) {
  if (!text || typeof text !== "string") return text;
  return text
    .replace(/\bt_shirts?\b/gi, (m) => (m.toLowerCase().endsWith("s") ? "t-shirts" : "t-shirt"))
    .replace(/\bsun_hats?\b/gi, (m) => (m.toLowerCase().endsWith("s") ? "sun hats" : "sun hat"))
    .replace(/\bwater_bottles?\b/gi, (m) => (m.toLowerCase().endsWith("s") ? "water bottles" : "water bottle"))
    .replace(/\bsun_screens?\b/gi, "sunscreen")
    .replace(/\brain_jackets?\b/gi, (m) => (m.toLowerCase().endsWith("s") ? "rain jackets" : "rain jacket"))
    .replace(/\bwind_breakers?\b/gi, (m) => (m.toLowerCase().endsWith("s") ? "windbreakers" : "windbreaker"))
    .replace(/\bheavy_coats?\b/gi, (m) => (m.toLowerCase().endsWith("s") ? "heavy coats" : "heavy coat"))
    .replace(/\blight_coats?\b/gi, (m) => (m.toLowerCase().endsWith("s") ? "light coats" : "light coat"))
    .replace(/\bextra_layers?\b/gi, (m) => (m.toLowerCase().endsWith("s") ? "extra layers" : "extra layer"))
    .replace(/\blong_sleeves?\b/gi, "long sleeves")
    .replace(/\blong_pants\b/gi, "long pants")
    .replace(/\brain_boots?\b/gi, "rain boots")
    .replace(/\bclosed_shoes?\b/gi, "closed shoes")
    .replace(/\bwarm_socks?\b/gi, "warm socks")
    .replace(/\blip_balms?\b/gi, "lip balm")
    .replace(/([a-zA-Z]+)_([a-zA-Z]+)/g, (_match, p1, p2) => {
      const lower1 = p1.toLowerCase();
      const lower2 = p2.toLowerCase();
      if (lower1 === "t" && lower2.startsWith("shirt")) return lower2.endsWith("s") ? "t-shirts" : "t-shirt";
      if (lower1 === "sun" && lower2.startsWith("screen")) return "sunscreen";
      if (lower1 === "wind" && lower2.startsWith("breaker")) return lower2.endsWith("s") ? "windbreakers" : "windbreaker";
      return `${p1} ${p2}`;
    });
}

function smartTrim(text, maxLen) {
  if (!text || typeof text !== 'string') return text;
  const cleaned = cleanCopyText(text.trim());
  if (cleaned.length <= maxLen) return cleaned;

  const sub = cleaned.slice(0, maxLen);
  const lastPeriod = sub.lastIndexOf('. ');
  const lastExcl = sub.lastIndexOf('! ');
  const lastQ = sub.lastIndexOf('? ');
  const lastEnd = Math.max(lastPeriod, lastExcl, lastQ);

  if (lastEnd >= maxLen * 0.45) {
    return cleaned.slice(0, lastEnd + 1).trim();
  }

  if (/[.!?]$/.test(sub)) {
    return sub.trim();
  }

  const lastSpace = sub.lastIndexOf(' ');
  if (lastSpace > 0) {
    const trimmed = sub.slice(0, lastSpace).replace(/[,;:\s]+$/, '').trim();
    return trimmed + '.';
  }

  return sub;
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
      wear: {
        ...context?.wear,
        items: (context?.wear?.icons || []).map((id) => ICON_NAMES[id] || id.replace(/_/g, " ")),
      },
      pack: {
        ...context?.pack,
        items: (context?.pack?.icons || []).map((id) => ICON_NAMES[id] || id.replace(/_/g, " ")),
      },
      tags: context?.tags,
      severity: context?.severity,
      hourly: context?.hourly?.map((h) => ({
        time: h.displayTime,
        tempF: h.tempF,
        condition: h.condition,
      })),
    });

    const isExtreme = context?.severity === "extreme";
    const systemInstruction = `You are the personal weather and wardrobe assistant inside Today.io.
Your job is to answer the user's questions about today's weather and what to wear or pack.

You can only discuss TODAY, for the location in CONTEXT below. You have no ability to look up other days, other locations, or historical weather.

If asked about other days or other locations, say: "I can only talk about today right now." and stop.

Answer only from CONTEXT. Never invent a temperature, condition, or forecast. If CONTEXT doesn't contain the answer, say so.

RULES:
1. When asked whether an item can be skipped, omitted, or substituted (e.g. "Can I skip the jacket?", "Can I wear shorts?", "Why the boots?", "Can I pack a jacket"):
   - Give a direct, helpful answer grounded in CONTEXT.
   - If asked about an item that is NOT recommended in CONTEXT (like boots or a jacket when it is sunny and warm), clarify directly that the item is not needed or recommended today because of the warm conditions.
2. If asked "What if I am out all day?", summarize the day's temperature progression and key advice based on the hourly timeline in CONTEXT.
3. Maintain a natural, concise, and helpful tone. Do not output lone fragments like just a temperature number. Provide complete, helpful sentences.
4. Keep answers under 60 words unless the user explicitly asks for detail.
5. Use natural English phrasing for clothing and accessories. NEVER use underscores or raw code identifiers (write "t-shirt", "sun hat", "water bottle", "sunscreen").
6. SAFETY: You do not give medical diagnoses or travel-safety verdicts.
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
          temperature: 0.4,
          maxOutputTokens: 800,
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

    const rawReply = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    const reply = cleanCopyText(rawReply);
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

    const wearDescriptions = (wearIcons || []).map((id) => {
      const meta = ICON_FASHION_META[id];
      return meta ? `${meta.name} [fabric: ${meta.fabric}; sensation: ${meta.feel}]` : (ICON_NAMES[id] || id.replace(/_/g, " "));
    }).join("; ");

    const packDescriptions = (packIcons || []).map((id) => {
      const meta = ICON_FASHION_META[id];
      return meta ? `${meta.name} [fabric: ${meta.fabric}; sensation: ${meta.feel}]` : (ICON_NAMES[id] || id.replace(/_/g, " "));
    }).join("; ");

    const systemInstruction = `You write the editorial copy for Today.io, a weather utility app that tells people what to wear and pack today in one glance.

TONE: ${voiceTone}

CRITICAL RULES:
1. You MUST describe ONLY the exact items in WEAR_ITEMS and PACK_ITEMS. Never recommend or name any garment or item not in those lists.
2. FASHION, FABRICS & SENSORY DEPTH:
   - For wearDescription, describe the outfit intentionally: evoke fabric textures (cotton, linen, wool, ripstop nylon), fit (boxy, tailored, relaxed), and the physical sensation of the weather against skin and garments.
   - Do NOT simply list item names like a grocery list. Explain how these specific pieces and fabrics work together to keep the body comfortable today.
   - nowDescription must capture the immediate 3-hour atmospheric feel (temperature momentum, breeze, UV intensity, or dampness).
3. Character limits (STRICT):
   - headline: 10 to 25 characters STRICT MAX. Exactly 2 to 4 words on ONE single line (e.g. "Dress light today", "Layer up for cold", "Stay cool out there"). NEVER exceed 25 characters or wrap.
   - wearDescription: 40 to 110 characters STRICT MAX. Exactly 1 or 2 concise, complete sentences describing fabric textures and how it feels. Never exceed 110 characters. Must finish the sentence completely.
   - packDescription: 30 to 85 characters STRICT MAX.
   - nowDescription: 40 to 105 characters STRICT MAX.
4. Use natural English phrasing for clothing and items (write "t-shirt", "sun hat", "water bottle", "sunscreen"). NEVER use underscores or raw code identifiers.
5. Respond in valid, strict JSON ONLY. No markdown fences, no explanatory text.`;

    const shortTermPrecip = dayRange?.next3hMaxPrecipProb !== undefined ? dayRange.next3hMaxPrecipProb : current?.precipProbability;
    const prompt = `Current Weather: ${current?.condition}, ${current?.tempF}°F (Feels like ${current?.feelsLikeF}°F).
Day Range: Low ${dayRange?.minTempF}°F / High ${dayRange?.maxTempF}°F. Rain probability (next 3 hours): ${shortTermPrecip}%. Wind: ${current?.windMph} mph.
WEAR_ITEMS: ${wearDescriptions || "None"}
PACK_ITEMS: ${packDescriptions || "None"}
Severity: ${severity}

Return strict JSON:
{
  "headline": "Short single-line punchy headline (10-25 chars)",
  "wearDescription": "Why and how to wear these specific fabrics and items (40-110 chars)",
  "packDescription": "Why to pack these specific items (30-85 chars)",
  "nowDescription": "Immediate 3-hour atmospheric conditions summary (40-105 chars)"
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
    if (parsed.headline && typeof parsed.headline === 'string') {
      parsed.headline = cleanCopyText(parsed.headline.trim().replace(/[\r\n]+/g, ' ').slice(0, 25));
    }
    if (parsed.wearDescription && typeof parsed.wearDescription === 'string') {
      parsed.wearDescription = smartTrim(parsed.wearDescription, 115);
    }
    if (parsed.packDescription && typeof parsed.packDescription === 'string') {
      parsed.packDescription = smartTrim(parsed.packDescription, 90);
    }
    if (parsed.nowDescription && typeof parsed.nowDescription === 'string') {
      parsed.nowDescription = smartTrim(parsed.nowDescription, 110);
    }
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
