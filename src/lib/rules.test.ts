import { evaluateRules } from "./rules";
import { CurrentConditions, DayRange } from "./types";

function mockInput(
  lowF: number,
  highF: number,
  precipProb: number,
  windMph: number,
  uvIndex: number,
  conditionCode: number
) {
  const current: CurrentConditions = {
    time: "2026-09-10T12:00:00",
    tempF: highF,
    tempC: ((highF - 32) * 5) / 9,
    feelsLikeF: highF,
    conditionCode,
    condition: "Test condition",
    windMph,
    precipProbability: precipProb,
    uvIndex,
    humidity: 50,
    isDay: true,
  };

  const dayRange: DayRange = {
    minTempF: lowF,
    maxTempF: highF,
    totalPrecipMm: 0,
    maxWindMph: windMph,
    maxUvIndex: uvIndex,
    maxPrecipProb: precipProb,
  };

  return { current, dayRange };
}

describe("Rules Engine Invariants & Scenarios", () => {
  test("Case 1: Summer heat should select light clothes and sun protection", () => {
    const res = evaluateRules(mockInput(74, 92, 5, 6, 9, 0));
    expect(res.wearIcons).toContain("t_shirt");
    expect(res.wearIcons).toContain("shorts");
    expect(res.wearIcons).not.toContain("heavy_coat");
    expect(res.wearIcons).not.toContain("long_pants");
    expect(res.packIcons).toContain("water_bottle");
    expect(res.packIcons).toContain("sun_screen");
  });

  test("Case 3: Rainy mild should select rain gear and umbrella", () => {
    const res = evaluateRules(mockInput(52, 61, 85, 10, 2, 63));
    expect(res.wearIcons).toContain("rain_jacket");
    expect(res.wearIcons).toContain("rain_boots");
    expect(res.packIcons).toContain("umbrella");
    expect(res.wearIcons).not.toContain("sandals");
    expect(res.wearIcons).not.toContain("shades");
  });

  test("Case 4: High wind suppresses umbrella", () => {
    // 28mph wind > 18mph threshold
    const res = evaluateRules(mockInput(34, 41, 70, 28, 1, 65));
    expect(res.packIcons).not.toContain("umbrella");
  });

  test("Never selects both shorts and long pants simultaneously", () => {
    const resHot = evaluateRules(mockInput(75, 85, 0, 5, 5, 0));
    const hasBothHot = resHot.wearIcons.includes("shorts") && resHot.wearIcons.includes("long_pants");
    expect(hasBothHot).toBe(false);

    const resCold = evaluateRules(mockInput(30, 45, 0, 5, 1, 0));
    const hasBothCold = resCold.wearIcons.includes("shorts") && resCold.wearIcons.includes("long_pants");
    expect(hasBothCold).toBe(false);
  });

  test("Always selects exactly 3 tags (Temperature, Sky, Moisture)", () => {
    const res = evaluateRules(mockInput(55, 70, 10, 8, 5, 1));
    expect(res.tags).toHaveLength(3);
    expect(["hot", "warm", "mild", "cool", "cold"]).toContain(res.tags[0]);
    expect(["sunny", "cloudy"]).toContain(res.tags[1]);
    expect(["wet", "humid", "dry"]).toContain(res.tags[2]);
  });
});
