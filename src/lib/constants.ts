import { IconId, SeverityLevel, TemperatureTagId, SkyTagId, MoistureTagId } from "./types";

export interface WMOInfo {
  code: number;
  condition: string;
  isRain: boolean;
  isSnow: boolean;
  isClear: boolean;
}

export const WMO_CODES: Record<number, WMOInfo> = {
  0: { code: 0, condition: "Clear sky", isRain: false, isSnow: false, isClear: true },
  1: { code: 1, condition: "Mainly clear", isRain: false, isSnow: false, isClear: true },
  2: { code: 2, condition: "Partly cloudy", isRain: false, isSnow: false, isClear: false },
  3: { code: 3, condition: "Overcast", isRain: false, isSnow: false, isClear: false },
  45: { code: 45, condition: "Fog", isRain: false, isSnow: false, isClear: false },
  48: { code: 48, condition: "Freezing fog", isRain: false, isSnow: false, isClear: false },
  51: { code: 51, condition: "Light drizzle", isRain: true, isSnow: false, isClear: false },
  53: { code: 53, condition: "Drizzle", isRain: true, isSnow: false, isClear: false },
  55: { code: 55, condition: "Heavy drizzle", isRain: true, isSnow: false, isClear: false },
  61: { code: 61, condition: "Light rain", isRain: true, isSnow: false, isClear: false },
  63: { code: 63, condition: "Rain", isRain: true, isSnow: false, isClear: false },
  65: { code: 65, condition: "Heavy rain", isRain: true, isSnow: false, isClear: false },
  66: { code: 66, condition: "Freezing rain", isRain: true, isSnow: false, isClear: false },
  67: { code: 67, condition: "Heavy freezing rain", isRain: true, isSnow: false, isClear: false },
  71: { code: 71, condition: "Light snow", isRain: false, isSnow: true, isClear: false },
  73: { code: 73, condition: "Snow", isRain: false, isSnow: true, isClear: false },
  75: { code: 75, condition: "Heavy snow", isRain: false, isSnow: true, isClear: false },
  77: { code: 77, condition: "Snow grains", isRain: false, isSnow: true, isClear: false },
  80: { code: 80, condition: "Light showers", isRain: true, isSnow: false, isClear: false },
  81: { code: 81, condition: "Showers", isRain: true, isSnow: false, isClear: false },
  82: { code: 82, condition: "Violent showers", isRain: true, isSnow: false, isClear: false },
  85: { code: 85, condition: "Snow showers", isRain: false, isSnow: true, isClear: false },
  86: { code: 86, condition: "Heavy snow showers", isRain: false, isSnow: true, isClear: false },
  95: { code: 95, condition: "Thunderstorm", isRain: true, isSnow: false, isClear: false },
  96: { code: 96, condition: "Thunderstorm with hail", isRain: true, isSnow: false, isClear: false },
  99: { code: 99, condition: "Severe thunderstorm with hail", isRain: true, isSnow: false, isClear: false },
};

export function getWMOInfo(code: number): WMOInfo {
  return (
    WMO_CODES[code] ?? {
      code,
      condition: "Partly cloudy",
      isRain: false,
      isSnow: false,
      isClear: false,
    }
  );
}

export interface IconMeta {
  id: IconId;
  name: string;
  slot: "Wear" | "Pack";
  zone: "Outer" | "Top" | "Bottom" | "Feet" | "Head" | "Accessory";
  ariaLabel: string;
  fabric: string;
  weight: "ultralight" | "light" | "mid" | "heavy";
  breathability: "high" | "medium" | "low";
  fit: string;
  coverage: "full" | "partial" | "minimal";
  layerPosition?: "base" | "mid" | "outer" | "shell";
  transitionHint?: string;
  weatherFeel: string;
  sensoryNote: string;
  weatherFunction: string[];
  stylingTip?: string;
  altNames: string[];
}

export const ICONS: Record<IconId, IconMeta> = {
  heavy_coat: {
    id: "heavy_coat",
    name: "Heavy coat",
    slot: "Wear",
    zone: "Outer",
    ariaLabel: "Heavy coat",
    fabric: "Insulated wool, down, or heavy synthetic shell",
    weight: "heavy",
    breathability: "low",
    fit: "Close-fitting, layerable over knitwear",
    coverage: "full",
    layerPosition: "outer",
    weatherFeel: "Seals in body heat against freezing wind",
    sensoryNote: "Bitter cold that numbs exposed skin in minutes",
    weatherFunction: ["thermal insulation", "wind-blocking"],
    stylingTip: "A structured dark overcoat keeps cold dressing sharp",
    altNames: ["wool overcoat", "insulated coat", "parka"],
  },
  light_coat: {
    id: "light_coat",
    name: "Light coat",
    slot: "Wear",
    zone: "Outer",
    ariaLabel: "Light coat",
    fabric: "Unlined wool blend, cotton twill, or soft-shell",
    weight: "mid",
    breathability: "medium",
    fit: "Structured, hip-length",
    coverage: "full",
    layerPosition: "outer",
    transitionHint: "Keep on for crisp mornings, open up by afternoon",
    weatherFeel: "Takes the edge off a brisk morning without overheating",
    sensoryNote: "That in-between chill where a hoodie isn't quite enough",
    weatherFunction: ["light warmth", "wind break"],
    altNames: ["trench jacket", "chore coat", "soft-shell jacket"],
  },
  rain_jacket: {
    id: "rain_jacket",
    name: "Rain jacket",
    slot: "Wear",
    zone: "Outer",
    ariaLabel: "Rain jacket",
    fabric: "Waterproof ripstop nylon or breathable membrane shell",
    weight: "light",
    breathability: "medium",
    fit: "Roomy enough over a base layer, cinchable hood",
    coverage: "full",
    layerPosition: "shell",
    weatherFeel: "Repels steady rain while letting body heat escape",
    sensoryNote: "The kind of damp that soaks through cotton in minutes",
    weatherFunction: ["waterproof", "wind-resistant"],
    altNames: ["rain shell", "waterproof jacket", "mac"],
  },
  wind_breaker: {
    id: "wind_breaker",
    name: "Windbreaker",
    slot: "Wear",
    zone: "Outer",
    ariaLabel: "Windbreaker",
    fabric: "Ultralight ripstop nylon, packable shell",
    weight: "ultralight",
    breathability: "medium",
    fit: "Cropped or relaxed, elasticated cuffs, high collar",
    coverage: "full",
    layerPosition: "shell",
    transitionHint: "Easy to shed and pack once the wind settles",
    weatherFeel: "Blocks gusts without trapping excess heat",
    sensoryNote: "A persistent wind that steals warmth from bare arms",
    weatherFunction: ["wind blocking", "lightweight shell"],
    altNames: ["wind shell", "nylon zip jacket", "track jacket"],
  },
  extra_layer: {
    id: "extra_layer",
    name: "Extra layer",
    slot: "Wear",
    zone: "Outer",
    ariaLabel: "Extra layer",
    fabric: "Lightweight merino knit, cardigan, or zip fleece",
    weight: "mid",
    breathability: "high",
    fit: "Close to the body, clean lines",
    coverage: "full",
    layerPosition: "mid",
    transitionHint: "Throw on early, stash away as temperatures peak",
    weatherFeel: "Bridges the gap between cool morning and mild afternoon",
    sensoryNote: "Cool enough to want something, warm enough to shed it later",
    weatherFunction: ["adaptable warmth", "mid-layer insulation"],
    altNames: ["cardigan", "knit layer", "zip fleece"],
  },
  long_sleeves: {
    id: "long_sleeves",
    name: "Long sleeves",
    slot: "Wear",
    zone: "Top",
    ariaLabel: "Long sleeves",
    fabric: "Fine-gauge cotton jersey, merino wool, or waffle knit",
    weight: "light",
    breathability: "high",
    fit: "Relaxed crewneck, wrist-length sleeves",
    coverage: "full",
    layerPosition: "base",
    weatherFeel: "Shields arms from brisk air and mild sun exposure",
    sensoryNote: "A steady coolness that bare arms notice after an hour",
    weatherFunction: ["moderate warmth", "light arm coverage"],
    altNames: ["long-sleeve crewneck", "waffle top", "merino top"],
  },
  t_shirt: {
    id: "t_shirt",
    name: "T-shirt",
    slot: "Wear",
    zone: "Top",
    ariaLabel: "T-shirt",
    fabric: "Breathable organic cotton, linen blend, or airy jersey",
    weight: "ultralight",
    breathability: "high",
    fit: "Oversized boxy cut or relaxed drape",
    coverage: "partial",
    layerPosition: "base",
    weatherFeel: "Lets your skin breathe in direct heat",
    sensoryNote: "The kind of heat where heavy fabrics stick to your back",
    weatherFunction: ["maximum ventilation", "heat dissipation"],
    altNames: ["cotton tee", "boxy tee", "short-sleeve top"],
  },
  long_pants: {
    id: "long_pants",
    name: "Long pants",
    slot: "Wear",
    zone: "Bottom",
    ariaLabel: "Long pants",
    fabric: "Structured dark denim, tailored cotton chino, or wool trousers",
    weight: "mid",
    breathability: "medium",
    fit: "Straight-leg or relaxed taper, ankle break",
    coverage: "full",
    weatherFeel: "Keeps legs shielded against wind, damp, and cool air",
    sensoryNote: "A chill that seeps in below the knee on exposed legs",
    weatherFunction: ["full leg coverage", "draft protection"],
    altNames: ["trousers", "dark denim", "chinos"],
  },
  shorts: {
    id: "shorts",
    name: "Shorts",
    slot: "Wear",
    zone: "Bottom",
    ariaLabel: "Shorts",
    fabric: "Breathable linen, washed cotton twill, or lightweight poplin",
    weight: "ultralight",
    breathability: "high",
    fit: "Tailored mid-thigh, relaxed leg opening",
    coverage: "partial",
    weatherFeel: "Maximum airflow for warm lower body comfort",
    sensoryNote: "Warm enough that anything covering the knees feels heavy",
    weatherFunction: ["heat dissipation", "airflow"],
    altNames: ["linen shorts", "tailored shorts", "cotton shorts"],
  },
  boots: {
    id: "boots",
    name: "Boots",
    slot: "Wear",
    zone: "Feet",
    ariaLabel: "Boots",
    fabric: "Oiled leather, durable combat lug sole, or shearling-lined",
    weight: "heavy",
    breathability: "low",
    fit: "Laced high, supportive ankle wrap",
    coverage: "full",
    weatherFeel: "Locks out cold drafts and frozen ground temperature",
    sensoryNote: "Cold pavement that stiffens thin sneaker soles",
    weatherFunction: ["ground insulation", "cold resistance"],
    altNames: ["combat boots", "leather boots", "lug-sole boots"],
  },
  rain_boots: {
    id: "rain_boots",
    name: "Rain boots",
    slot: "Wear",
    zone: "Feet",
    ariaLabel: "Rain boots",
    fabric: "Vulcanized waterproof rubber with lugged traction sole",
    weight: "mid",
    breathability: "low",
    fit: "Mid-calf slip-on with generous footbed",
    coverage: "full",
    weatherFeel: "Keeps feet completely dry through standing puddles and gutters",
    sensoryNote: "Puddled crosswalks and rain splashback from passing traffic",
    weatherFunction: ["waterproof seal", "wet traction"],
    altNames: ["waterproof boots", "rubber wellies", "rain boots"],
  },
  closed_shoes: {
    id: "closed_shoes",
    name: "Closed shoes",
    slot: "Wear",
    zone: "Feet",
    ariaLabel: "Closed shoes",
    fabric: "Smooth leather derbies, canvas kicks, or breathable sneakers",
    weight: "light",
    breathability: "medium",
    fit: "Secure lace-up, cushioned walkable sole",
    coverage: "full",
    weatherFeel: "Versatile everyday foot protection for dry mild weather",
    sensoryNote: "Mild and dry enough for your everyday leather or canvas pair",
    weatherFunction: ["foot protection", "all-day comfort"],
    altNames: ["leather derbies", "sneakers", "oxfords"],
  },
  sandals: {
    id: "sandals",
    name: "Sandals",
    slot: "Wear",
    zone: "Feet",
    ariaLabel: "Sandals",
    fabric: "Full-grain leather slides, woven straps, or ergonomic footbeds",
    weight: "ultralight",
    breathability: "high",
    fit: "Open-toe, slip-on ease",
    coverage: "minimal",
    weatherFeel: "Lets feet breathe freely on hot sidewalks",
    sensoryNote: "A dry, sunny afternoon that calls for open toes",
    weatherFunction: ["open ventilation", "heat dissipation"],
    altNames: ["leather slides", "minimal sandals", "mules"],
  },
  warm_socks: {
    id: "warm_socks",
    name: "Warm socks",
    slot: "Wear",
    zone: "Feet",
    ariaLabel: "Warm socks",
    fabric: "Heavy merino wool or looped thermal knit",
    weight: "mid",
    breathability: "medium",
    fit: "Mid-calf cushion, reinforced toe and heel",
    coverage: "full",
    weatherFeel: "Adds a crucial thermal barrier inside your footwear",
    sensoryNote: "A deep winter chill that numbs toes through standard cotton",
    weatherFunction: ["thermal warmth", "moisture buffering"],
    altNames: ["wool socks", "thermal socks", "merino socks"],
  },
  beanie: {
    id: "beanie",
    name: "Beanie",
    slot: "Wear",
    zone: "Head",
    ariaLabel: "Beanie",
    fabric: "Ribbed merino wool or soft cashmere knit",
    weight: "mid",
    breathability: "medium",
    fit: "Snug over the ears and crown",
    coverage: "partial",
    weatherFeel: "Stops rapid heat loss from head and ears in cold wind",
    sensoryNote: "Cold air that stings exposed ears within five minutes",
    weatherFunction: ["heat retention", "ear coverage"],
    altNames: ["ribbed beanie", "knit cap", "wool beanie"],
  },
  sun_hat: {
    id: "sun_hat",
    name: "Sun hat",
    slot: "Wear",
    zone: "Head",
    ariaLabel: "Sun hat",
    fabric: "Woven raffia straw, heavy cotton twill, or UPF 50+ canvas",
    weight: "ultralight",
    breathability: "high",
    fit: "Wide-brimmed circumference shading face and back of neck",
    coverage: "partial",
    weatherFeel: "Creates portable personal shade from intense overhead sun",
    sensoryNote: "Blistering midday UV that bakes the forehead and scalp",
    weatherFunction: ["UV shielding", "overhead shade"],
    altNames: ["wide-brim hat", "straw hat", "bucket hat"],
  },
  scarf: {
    id: "scarf",
    name: "Scarf",
    slot: "Wear",
    zone: "Accessory",
    ariaLabel: "Scarf",
    fabric: "Chunky oatmeal knit wool, cashmere blend, or brushed alpaca",
    weight: "mid",
    breathability: "medium",
    fit: "Double-wrapped close to the neckline",
    coverage: "partial",
    weatherFeel: "Seals the open coat collar against cold wind drafts",
    sensoryNote: "A biting draft that searches out every gap in your neckline",
    weatherFunction: ["neck seal", "draft barrier"],
    altNames: ["chunky scarf", "knit scarf", "wool scarf"],
  },
  gloves: {
    id: "gloves",
    name: "Gloves",
    slot: "Wear",
    zone: "Accessory",
    ariaLabel: "Gloves",
    fabric: "Lined leather, cashmere knit, or windproof fleece",
    weight: "mid",
    breathability: "low",
    fit: "Snug, articulated fingers",
    coverage: "full",
    weatherFeel: "Preserves finger dexterity in bitter cold and damp wind",
    sensoryNote: "Cold so sharp your hands ache if you pull them out of your pockets",
    weatherFunction: ["hand insulation", "wind chill barrier"],
    altNames: ["leather gloves", "lined gloves", "wool gloves"],
  },
  shades: {
    id: "shades",
    name: "Shades",
    slot: "Wear",
    zone: "Accessory",
    ariaLabel: "Sunglasses",
    fabric: "Polarized acetate or lightweight titanium with UV400 lenses",
    weight: "ultralight",
    breathability: "high",
    fit: "Angular wraparound or slim rectangular dark frames",
    coverage: "minimal",
    weatherFeel: "Cuts sharp sidewalk glare and prevents squinting in direct sun",
    sensoryNote: "Intense daylight that makes you squint the second you step outside",
    weatherFunction: ["UV protection", "glare reduction"],
    altNames: ["sunglasses", "dark shades", "sunglass frames"],
  },
  umbrella: {
    id: "umbrella",
    name: "Umbrella",
    slot: "Pack",
    zone: "Accessory",
    ariaLabel: "Umbrella",
    fabric: "Water-repellent Teflon-coated polyester canopy on fiberglass ribs",
    weight: "mid",
    breathability: "low",
    fit: "Generous overhead dome, rubberized ergonomic handle",
    coverage: "full",
    weatherFeel: "Direct overhead protection against downpours and drizzle",
    sensoryNote: "Steady rain that drums steadily against the canopy overhead",
    weatherFunction: ["overhead rain shield"],
    altNames: ["matte black umbrella", "compact umbrella", "rain umbrella"],
  },
  water_bottle: {
    id: "water_bottle",
    name: "Water bottle",
    slot: "Pack",
    zone: "Accessory",
    ariaLabel: "Water bottle",
    fabric: "Double-wall vacuum-insulated stainless steel",
    weight: "light",
    breathability: "high",
    fit: "Sleek, pocketable or tote-friendly silhouette",
    coverage: "minimal",
    weatherFeel: "Keeps hydration cold through sustained heat and dry wind",
    sensoryNote: "Dry air and heat that leaves you thirsty before you feel it",
    weatherFunction: ["thermal hydration"],
    altNames: ["insulated bottle", "water flask", "hydration flask"],
  },
  sun_screen: {
    id: "sun_screen",
    name: "Sunscreen",
    slot: "Pack",
    zone: "Accessory",
    ariaLabel: "Sunscreen",
    fabric: "Broad-spectrum SPF 50+ matte fluid or zinc mineral shield",
    weight: "ultralight",
    breathability: "high",
    fit: "Invisible, weightless layer on skin",
    coverage: "full",
    weatherFeel: "Invisible barrier shielding skin against burning UV rays",
    sensoryNote: "Sun that turns exposed skin red within 15 minutes",
    weatherFunction: ["UV defense", "sun protection"],
    altNames: ["SPF 50 shield", "sunscreen lotion", "mineral sunscreen"],
  },
  lip_balm: {
    id: "lip_balm",
    name: "Lip balm",
    slot: "Pack",
    zone: "Accessory",
    ariaLabel: "Lip balm",
    fabric: "Beeswax, shea butter, and SPF barrier formula",
    weight: "ultralight",
    breathability: "low",
    fit: "Pocket-sized twist tube",
    coverage: "minimal",
    weatherFeel: "Prevents wind-chapped lips in dry, gusty, or freezing weather",
    sensoryNote: "Brisk wind that strips natural moisture from exposed lips",
    weatherFunction: ["windburn barrier", "moisture seal"],
    altNames: ["moisturizing balm", "SPF lip shield", "lip care"],
  },
};

export const TAG_LABELS: Record<TemperatureTagId | SkyTagId | MoistureTagId, string> = {
  hot: "Hot",
  warm: "Warm",
  mild: "Mild",
  cool: "Cool",
  cold: "Cold",
  sunny: "Sunny",
  cloudy: "Cloudy",
  wet: "Wet",
  humid: "Humid",
  dry: "Dry",
};

/**
 * Removes underscores and converts raw icon identifiers or code tokens into natural English phrases.
 * e.g. "t_shirt" -> "t-shirt", "sun_hat" -> "sun hat", "water_bottle" -> "water bottle", "sun_screen" -> "sunscreen"
 */
export function cleanCopyText(text: string): string {
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

/**
 * Safely trims text to fit within a character budget without chopping words in half.
 * Prefers ending at a completed sentence (. ! ?). Otherwise trims cleanly at the last full word.
 */
export function smartTrim(text: string, maxLen: number): string {
  if (!text || typeof text !== "string") return text;
  const cleaned = cleanCopyText(text.trim());
  if (cleaned.length <= maxLen) return cleaned;

  const sub = cleaned.slice(0, maxLen);
  const lastPeriod = sub.lastIndexOf(". ");
  const lastExcl = sub.lastIndexOf("! ");
  const lastQ = sub.lastIndexOf("? ");
  const lastEnd = Math.max(lastPeriod, lastExcl, lastQ);

  if (lastEnd >= maxLen * 0.45) {
    return cleaned.slice(0, lastEnd + 1).trim();
  }

  if (/[.!?]$/.test(sub)) {
    return sub.trim();
  }

  const lastSpace = sub.lastIndexOf(" ");
  if (lastSpace > 0) {
    const trimmed = sub.slice(0, lastSpace).replace(/[,;:\s]+$/, "").trim();
    return trimmed + ".";
  }

  return sub;
}

export function getFallbackHeadline(condition: string, tempF: number, severity: SeverityLevel): string {
  if (severity === "extreme") return "Extreme conditions";
  if (tempF >= 80) return "Dress light today";
  if (tempF <= 45) return "Layer up today";
  if (condition.toLowerCase().includes("rain")) return "Grab a raincoat";
  return "Dress light today";
}

export function getFallbackWearDescription(icons: IconId[]): string {
  const names = icons.map((id) => ICONS[id]?.name ?? id);
  if (names.length === 0) return "Dress comfortably for today's weather.";
  return cleanCopyText(`Wear ${names.slice(0, -1).join(", ")}${names.length > 1 ? " and " : ""}${names[names.length - 1]}.`);
}

export function getFallbackPackDescription(icons: IconId[]): string {
  const names = icons.map((id) => ICONS[id]?.name ?? id);
  if (names.length === 0) return "No extra items needed today.";
  return cleanCopyText(`Pack ${names.slice(0, -1).join(", ")}${names.length > 1 ? " and " : ""}${names[names.length - 1]}.`);
}

export function getFallbackNowDescription(
  condition: string,
  tempF: number,
  maxTempF?: number,
  windMph?: number,
  shortTermPrecipProb?: number,
): string {
  const rounded = Math.round(tempF);
  const condLower = condition.toLowerCase();

  // If short term rain is imminent or occurring
  if (
    (shortTermPrecipProb !== undefined && shortTermPrecipProb >= 50) ||
    condLower.includes("rain") ||
    condLower.includes("drizzle") ||
    condLower.includes("shower")
  ) {
    return cleanCopyText(`${rounded}°, ${condLower}. Damp conditions settling in over the next few hours with slick pavement.`);
  }

  if (condLower.includes("thunder") || condLower.includes("storm")) {
    return cleanCopyText(`${rounded}° with active storm systems. Expect gusty winds and sudden heavy downpours.`);
  }

  if (rounded >= 85 || (maxTempF && maxTempF >= 88)) {
    return cleanCopyText(`${rounded}° and climbing under ${condLower}. High heat and peak UV through the afternoon—find shade where you can.`);
  }

  if (rounded <= 45) {
    const windNote = windMph && windMph > 15 ? ` Gusts up to ${Math.round(windMph)} mph add a sharp bite.` : "";
    return cleanCopyText(`Currently ${rounded}° and brisk.${windNote} Dress warmly if you'll be out past sunset.`);
  }

  return cleanCopyText(`${condition} and ${rounded}°. Mild, steady conditions with comfortable temperatures continuing through the next few hours.`);
}

export function getNarrativeWearDescription(icons: IconId[], tempF: number, condition: string): string {
  if (tempF <= 35 || condition.toLowerCase().includes("snow")) {
    return "Today you should wear something warm. A heavy jacket, long insulated pants, warm and insulated boots. If you are going to be outside for a long time, you'll want to wear a warm hat and gloves.";
  }
  if (condition.toLowerCase().includes("rain")) {
    return "Damp air and persistent rain call for a waterproof jacket or raincoat, breathable layers underneath, and water-resistant boots or closed shoes with good grip on slick streets.";
  }
  if (tempF >= 78) {
    return "Light, breathable fabrics are your best friend today. A loose cotton tee or linen shirt, tailored shorts, and comfortable open or slip-on footwear will keep you cool in the heat.";
  }
  if (tempF >= 65) {
    return "A comfortable, temperate day ideal for breathable layers. A relaxed long-sleeve or light tee with straight-leg trousers and versatile everyday shoes.";
  }
  return "Cooler conditions call for medium-weight layering. A classic crewneck or sweater over a soft tee, durable denim or chinos, and sturdy closed leather shoes.";
}

export function getNarrativeBringDescription(icons: IconId[], tempF: number, condition: string): string {
  if (condition.toLowerCase().includes("rain") || icons.includes("umbrella")) {
    return "Keep an umbrella within arm's reach and consider a compact waterproof bag cover to protect your everyday carry from sudden rain bursts.";
  }
  if (tempF <= 35) {
    return "Always pack water, but you can also pack hot tea or water as an alternative. Pack your gloves, maybe a scarf, if you plan to be outside for a long period of time.";
  }
  if (tempF >= 78) {
    return "Stay hydrated with a cold water bottle, pack your sunglasses for peak afternoon glare, and keep sunscreen handy if you will be under direct sun.";
  }
  return "Bring a reusable water bottle and sunglasses for changing light conditions throughout the afternoon.";
}

