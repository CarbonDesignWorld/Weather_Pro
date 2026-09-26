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
        message: "Stylist agent is currently in offline preview. Configure your GEMINI_API_KEY for live consultations."
      }));
      return;
    }

    const history = (messages || []).slice(-6);
    const contextJson = JSON.stringify({
      location: context?.location,
      current: context?.current,
      dayRange: context?.dayRange,
      severity: context?.severity,
      hourly: context?.hourly?.map((h) => ({
        time: h.displayTime,
        tempF: h.tempF,
        tempC: h.tempC,
        condition: h.condition,
      })),
    });

    const systemInstruction = `You are the personal wardrobe stylist and meteorological editor inside Today.io.
PERSONA: Minimalist Stylist.
Tone: Discerning, calm, sharp, understated, and pragmatic. You value clean silhouettes, breathable fabrics, and functional layering over frivolous fashion. Never use emojis, exclamation marks, or corporate filler ("navigate the changing weather", "essential pieces", "seamless transition"). Keep answers under 60 words unless asked for a multi-day itinerary.

You have access to TODAY's localized weather in CONTEXT below (temperatures, feels-like, wind, humidity, UV index, and hourly trends).

SPECIAL AGENTIC INTENTS:
1. "Dress for the night" / Night queries:
   - Isolate the forecast between 6 PM and 2 AM from CONTEXT.
   - Address evening temperature drops, rising humidity, or nighttime gusts.
   - Advise transitioning daytime staples with structured evening outerwear, deeper tonal palettes, and footwear suited for cooler pavement.
2. "Dress for an event" / Formal or occasion queries:
   - Provide elevated, tailored styling that directly accounts for today's weather hazards (e.g. humid hair/creasing risks, rain resilience for formal footwear, or wind-blocking outerwear over delicate fabrics).
3. "Pack for vacation" / "Pack for a vacation":
   - If the user has not provided a destination or duration, politely ask: "Where are you heading and for how many days? I will curate a modular capsule wardrobe for the trip."
   - If a destination/trip length is provided, assemble a concise, modular capsule emphasizing interchangeable layers.
4. Garment omission / substitution ("Can I skip the coat?", "Can I wear shorts?"):
   - Give a direct verdict in your first sentence grounded in CONTEXT feels-like and wind data.

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
          temperature: 0.35,
          maxOutputTokens: 800,
        },
      });
    } catch (callErr) {
      console.error("Gemini chat error:", callErr);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        message: "Unable to consult the stylist right now.",
        error: callErr.statusText || callErr.message || "Failed",
        retryable: true,
      }));
      return;
    }

    const rawReply = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    const reply = cleanCopyText(rawReply);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      message: reply || "Keep pieces simple, functional, and tailored to current conditions."
    }));
  } catch (err) {
    console.error("Chat turn error:", err);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: "Internal server error", error: err.message }));
  }
}

async function handleGenerateCopy(req, res) {
  try {
    const { current, dayRange, severity, location } = await readJsonBody(req);
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ fallback: true }));
      return;
    }

    const systemInstruction = `You write the editorial weather briefing and wardrobe styling for Today.io.
PERSONA: Minimalist Stylist.
TONE: Crisp, direct, tactile, and discerning. No exclamation marks. No clichés ("step out in style", "must-have", "navigate the day"). No emojis.

CADENCE ARCHITECTURE (Strict 3-beat rhythm for both Wear and Pack):
- Sentence 1 (Short Anchor): 4 to 7 words. Direct outfit verdict or essential command.
- Sentence 2 (The Sensory Breath): 10 to 18 words. Specific fabrics (e.g. unlined wool, crisp poplin, washed linen, heavyweight jersey), fit, and how the garment regulates body climate against temperature, humidity, or wind.
- Sentence 3 (Atmospheric Detail / Shift): 8 to 14 words. Address the day's progression (evening chill, sudden gusts, UV glare, or dampness).

OUTPUT FIELDS:
1. "nowDescription": Exactly 2 sentences capturing what it immediately feels like outside. Compare ambient temperature with the apparent "feels like" temperature, wind bite, humidity, and atmospheric momentum. (60 to 140 characters).
2. "wearDescription": 2 or 3 sentences following the Cadence Architecture (Anchor -> Breath -> Detail). Describe specific garments, fabrics, and styling. (70 to 175 characters).
3. "packDescription": 2 sentences following the Cadence Architecture. Specific carry gear (umbrella, sunglasses, tote, layers) and immediate weather justification. (50 to 130 characters).
4. "headline": 2 to 4 words on one line. Punchy verdict. (10 to 25 characters).

Respond in valid strict JSON only.`;

    const feelsLikeDelta = (current?.feelsLikeF !== undefined && current?.tempF !== undefined)
      ? current.feelsLikeF - current.tempF
      : 0;
    const precipChance = dayRange?.next3hMaxPrecipProb !== undefined ? dayRange.next3hMaxPrecipProb : current?.precipProbability;

    const weatherSummary = `Location: ${location?.city || "Local"}
Current: ${current?.condition || "Clear"}, ${current?.tempF}°F (Apparent feels-like: ${current?.feelsLikeF}°F, delta: ${feelsLikeDelta > 0 ? "+" : ""}${feelsLikeDelta}°F).
Wind: ${current?.windMph || 0} mph. Humidity: ${current?.humidity || 50}%. UV Index: ${current?.uvIndex || 0}.
Day Range: Low ${dayRange?.minTempF || current?.tempF || 65}°F / High ${dayRange?.maxTempF || current?.tempF || 75}°F.
Precipitation chance (next 3 hours): ${precipChance || 0}%.
Severity: ${severity || "normal"}`;

    let data;
    try {
      data = await callGemini(apiKey, {
        contents: [{ parts: [{ text: `${systemInstruction}\n\n${weatherSummary}` }] }],
        generationConfig: {
          temperature: 0.35,
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
    if (parsed.nowDescription && typeof parsed.nowDescription === 'string') {
      parsed.nowDescription = smartTrim(parsed.nowDescription, 160);
    }
    if (parsed.wearDescription && typeof parsed.wearDescription === 'string') {
      parsed.wearDescription = smartTrim(parsed.wearDescription, 195);
    }
    if (parsed.packDescription && typeof parsed.packDescription === 'string') {
      parsed.packDescription = smartTrim(parsed.packDescription, 150);
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
