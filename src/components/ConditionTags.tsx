import React from "react";
import tagSunny from "../assets/figma_svgs/tag_sunny.svg";
import tagCloudy from "../assets/figma_svgs/tag_cloudy.svg";
import tagSnowy from "../assets/figma_svgs/tag_snowy.svg";
import tagClear from "../assets/figma_svgs/tag_clear.svg";
import tagWindy from "../assets/figma_svgs/tag_windy.svg";
import tagRainy from "../assets/figma_svgs/tag_rainy.svg";
import tagHumid from "../assets/figma_svgs/tag_humid.svg";

export type ConditionTagType =
  | "Humid"
  | "Cloudy"
  | "Clear"
  | "Rainy"
  | "Snowy"
  | "Sunny"
  | "Windy";

const TAG_ASSETS: Record<ConditionTagType, string> = {
  Sunny: tagSunny,
  Cloudy: tagCloudy,
  Snowy: tagSnowy,
  Clear: tagClear,
  Windy: tagWindy,
  Rainy: tagRainy,
  Humid: tagHumid,
};

/**
 * Deterministically determines exactly 3 condition tags from the 7 predetermined Figma tags
 * [Humid, Cloudy, Clear, Rainy, Snowy, Sunny, Windy]
 */
export function getThreeConditionTags(
  condition?: string,
  windMph?: number,
  humidity?: number
): [ConditionTagType, ConditionTagType, ConditionTagType] {
  const condLower = (condition || "").toLowerCase();
  const tags: ConditionTagType[] = [];

  // 1. Primary Precipitation / Sky Condition
  if (
    condLower.includes("snow") ||
    condLower.includes("blizzard") ||
    condLower.includes("flurr") ||
    condLower.includes("sleet")
  ) {
    tags.push("Snowy");
  } else if (
    condLower.includes("rain") ||
    condLower.includes("drizzle") ||
    condLower.includes("shower") ||
    condLower.includes("storm") ||
    condLower.includes("thunder")
  ) {
    tags.push("Rainy");
  } else if (
    condLower.includes("cloud") ||
    condLower.includes("overcast") ||
    condLower.includes("fog") ||
    condLower.includes("haze")
  ) {
    tags.push("Cloudy");
  } else if (condLower.includes("sun")) {
    tags.push("Sunny");
  } else {
    tags.push("Clear");
  }

  // 2. Wind factor
  const isWindy =
    (windMph !== undefined && windMph >= 10) ||
    condLower.includes("wind") ||
    condLower.includes("breeze") ||
    condLower.includes("gust");
  if (isWindy && !tags.includes("Windy")) {
    tags.push("Windy");
  }

  // 3. Humidity factor
  const isHumid =
    (humidity !== undefined && humidity >= 60) ||
    condLower.includes("humid") ||
    condLower.includes("mist");
  if (isHumid && !tags.includes("Humid")) {
    tags.push("Humid");
  }

  // 4. Fill up to 3 distinct tags
  const fallbacks: ConditionTagType[] = [
    "Clear",
    "Windy",
    "Humid",
    "Cloudy",
    "Sunny",
    "Rainy",
    "Snowy",
  ];

  for (const f of fallbacks) {
    if (tags.length >= 3) break;
    if (!tags.includes(f)) {
      tags.push(f);
    }
  }

  return [tags[0], tags[1], tags[2]];
}

interface ConditionTagsProps {
  condition?: string;
  windMph?: number;
  humidity?: number;
}

export default function ConditionTags({
  condition,
  windMph,
  humidity,
}: ConditionTagsProps) {
  const threeTags = getThreeConditionTags(condition, windMph, humidity);

  return (
    <div
      data-name="Condition Frame"
      className="flex items-center gap-2 flex-nowrap select-none"
    >
      {threeTags.map((tag) => (
        <img
          key={tag}
          src={TAG_ASSETS[tag]}
          alt={tag}
          className="h-[22px] w-auto flex-shrink-0"
        />
      ))}
    </div>
  );
}
