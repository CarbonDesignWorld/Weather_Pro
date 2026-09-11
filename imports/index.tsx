import { useState, useEffect } from "react";
import svgPaths from "./svg-7a2pt52j2y";
import imgWeatherVisualDisplay from "./468d1251b756da2aa4f79a32648edd195a653df0.png";
import { useWeather } from "../src/context/WeatherContext";
import WeatherIconItem from "../src/components/WeatherIconItem";
import { TAG_LABELS } from "../src/lib/constants";
import { getTemperatureColor, getTimelineGradient, getWeatherVisual } from "../src/lib/weatherVisuals";
import { ChatCard } from "../src/ChatView";

type PromptSuggestionProps = {
  className?: string;
  promptText?: string;
  state?: "Default" | "Hover" | "Pressing";
  onClick?: () => void;
};

function PromptSuggestion({ className, promptText = "What if I am out all day?", state = "Default", onClick }: PromptSuggestionProps) {
  const [hover, setHover] = useState(false);
  const [pressed, setPressed] = useState(false);

  const activeState = pressed ? "Pressing" : hover ? "Hover" : state;
  const bgClass = activeState === "Pressing" ? "bg-[#2a3d61]" : activeState === "Hover" ? "bg-[#3a5384]" : "bg-[#4a69a9]";

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => { setHover(false); setPressed(false); }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      className={`relative rounded-[22px] shadow-[0px_1px_4px_1px_rgba(28,42,68,0.2)] text-left cursor-pointer border-none transition-colors duration-150 ${bgClass} ${className || "flex-1 min-w-0"}`}
    >
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-start px-[14px] xl:px-[16px] py-[14px] xl:py-[24px] relative size-full">
          <p className="font-['Inter:Regular',sans-serif] font-normal leading-snug not-italic relative text-[13px] sm:text-[14px] xl:text-[16px] text-white whitespace-nowrap sm:truncate w-full" title={promptText}>{promptText}</p>
        </div>
      </div>
    </button>
  );
}

type ConfidenceCardProps = {
  className?: string;
  confidenceLabel?: string;
};

function ConfidenceCard({ className, confidenceLabel = "Confidence 94%" }: ConfidenceCardProps) {
  return (
    <div className={className || "relative"} data-name="Confidence Card">
      <div className="bg-[#d5cfc4] flex items-center justify-center px-[14px] py-[6px] rounded-[99px] shrink-0 w-fit">
        <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[13px] sm:text-[14px] text-[#6b655b] whitespace-nowrap">{confidenceLabel}</p>
      </div>
    </div>
  );
}

type ClickableTextProps = {
  className?: string;
  buttonLabel?: string;
  state?: "Default" | "Hoover";
  onClick?: () => void;
};

function ClickableText({ className, buttonLabel = "Change Location", state = "Default", onClick }: ClickableTextProps) {
  const [hovered, setHovered] = useState(false);
  const isHovered = hovered || state === "Hoover";
  return (
    <div
      onClick={onClick}
      className={`${className || "relative"} cursor-pointer`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="flex flex-col items-center justify-center size-full">
        <div className="content-stretch flex flex-col items-center justify-center px-[24px] relative size-full">
          <p
            className="[text-decoration-skip-ink:none] [text-underline-position:from-font] [word-break:break-word] decoration-from-font decoration-solid font-['Source_Serif_Pro:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[16px] underline w-full transition-colors duration-150"
            style={{ color: isHovered ? "#8b8478" : "#6b655b" }}
          >
            {buttonLabel}
          </p>
        </div>
      </div>
    </div>
  );
}

function LocationIcon({ className }: { className?: string }) {
  return (
    <div className={className || "h-[20px] relative w-[15px]"} data-name="Location Icon">
      <svg className="absolute block inset-0 size-full" fill="none" height="20" preserveAspectRatio="none" viewBox="0 0 15 20" width="15">
        <path d={svgPaths.p24197100} fill="#6B655B" id="Vector" />
      </svg>
    </div>
  );
}

type DailyTagProps = {
  className?: string;
  tagLabel?: string;
};

function DailyTag({ className, tagLabel = "Warm" }: DailyTagProps) {
  return (
    <div className={className || "bg-[#d5cfc4] relative rounded-[166px]"} data-name="Daily Tag">
      <div className="flex flex-row items-center justify-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-center justify-center px-[8px] py-[4px] relative size-full">
          <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#6b655b] text-[16px] whitespace-nowrap">{tagLabel}</p>
        </div>
      </div>
    </div>
  );
}

type HeaderProps = {
  className?: string;
  brandName?: string;
  dateLabel?: string;
  status?: "Closed";
  temperatureLabel?: string;
};

function formatHeaderDate(d: Date = new Date()): string {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
  return `${months[d.getMonth()]} ${d.getDate()}`;
}

function Header({ className, brandName = "Today.io", dateLabel, status = "Closed", temperatureLabel = "74 F | 23 C" }: HeaderProps) {
  const ctx = useWeather();
  const dateStr = dateLabel || formatHeaderDate();
  const tempStr = ctx?.brief ? `${ctx.brief.current.tempF} F | ${ctx.brief.current.tempC} C` : temperatureLabel;

  return (
    <div className={className || "bg-[#faf8f4] h-[60px] lg:h-[93px] overflow-clip relative w-full shrink-0"}>
      {/* Mobile Top App Bar (< 1024px) */}
      <div className="flex lg:hidden justify-between items-center px-4 h-full bg-[#faf8f4] border-b border-[#e4dfd6] w-full">
        <span className="font-['Source_Serif_Pro:Semi_Bold','Source_Serif_4',serif] font-semibold text-[22px] text-[#6b655b] shrink-0">{brandName}</span>
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-1.5 text-[13px] text-[#6b655b] font-medium font-['Source_Serif_Pro:Regular',sans-serif]">
            <span>{dateStr}</span>
            <span>•</span>
            <span className="font-semibold text-[#6b655b]">{tempStr}</span>
          </div>
          <button
            type="button"
            onClick={() => ctx?.openChatWithPrompt("")}
            aria-label="Open Weather Chat Assistant"
            className="flex items-center justify-center size-[36px] rounded-full bg-[#d5cfc4] hover:bg-[#c8c1b4] active:bg-[#bcb4a6] text-[#6b655b] transition-colors cursor-pointer border-none shadow-none"
            title="Ask Today Assistant"
          >
            <svg className="size-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Desktop Header Row (>= 1024px) */}
      <div className="hidden lg:flex content-stretch items-center justify-center min-h-px px-[16px] xl:px-[24px] relative w-full h-full">
        <div className="h-full shrink-0 w-[300px] lg:w-[320px] xl:w-[360px] 2xl:w-[395px] flex items-center px-[14px] py-[13px] transition-[width] duration-200" data-name="Tab">
          <div className="content-stretch flex flex-[1_0_0] gap-[26px] items-center min-w-px relative" data-name="Data Frame">
            <div className="[word-break:break-word] content-stretch flex flex-col gap-[3px] items-start leading-[normal] not-italic relative shrink-0 text-[#6b655b] text-[16px] w-[140px]" data-name="Data">
              <p className="font-['Source_Serif_Pro:Light',sans-serif] relative shrink-0 w-full">{brandName}</p>
              <p className="font-['Source_Serif_Pro:Light',sans-serif] relative shrink-0 w-full">{dateStr}</p>
              <p className="font-['Source_Serif_Pro:Regular',sans-serif] relative shrink-0 w-full font-medium text-[#6b655b]">{tempStr}</p>
            </div>
            <div className="flex items-center justify-center relative shrink-0">
              <div className="-scale-y-100 flex-none rotate-180">
                <div className="relative size-[18px]" data-name="Drop Down Arrow" />
              </div>
            </div>
          </div>
        </div>

        <div className="h-full max-w-[1182px] flex-1 min-w-0 flex items-center justify-end px-[16px] xl:px-[24px]">
          {ctx?.chatOpen && (
            <button
              type="button"
              onClick={() => ctx.closeChat()}
              className="cursor-pointer bg-transparent border-none text-[#6b655b] underline text-[16px] transition-colors duration-150 hover:text-[#8b8478]"
              style={{ fontFamily: "'Source Serif 4', serif" }}
            >
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function TimeStamps() {
  const ctx = useWeather();
  const hourly = ctx?.brief?.hourly;

  if (hourly && hourly.length > 0) {
    const timelineGradient = getTimelineGradient(hourly);

    return (
      <div className="relative pl-[22px] py-[6px] w-full" data-name="Time Stamps">
        {/* Continuous thermal gradient rail */}
        <div
          className="absolute left-[6px] top-[10px] bottom-[10px] w-[5px] rounded-full shadow-xs opacity-90"
          style={{ background: timelineGradient }}
          title="Thermal progression of the day"
        />

        <div className="flex flex-col gap-[26px] w-full">
          {hourly.map((h, i) => {
            const tempColor = getTemperatureColor(h.tempF);
            return (
              <div key={i} className="flex flex-col w-full">
                {h.isDateBoundary && (
                  <span className="text-[11px] uppercase tracking-wider text-[#8b8478] mb-1 font-semibold border-b border-[#e4dfd6] pb-0.5 w-fit">
                    Tomorrow
                  </span>
                )}
                <div className="flex items-center justify-between w-full pr-2">
                  <span className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[#6b655b] text-[18px]">
                    {h.displayTime}
                  </span>

                  {/* Temperature cell placed right next to hour slot:time */}
                  <div className="flex items-center gap-2">
                    <div
                      className="h-[6px] w-[28px] rounded-full shadow-xs"
                      style={{
                        background: `linear-gradient(to right, ${tempColor}, ${getTemperatureColor(h.tempF + 5)})`,
                      }}
                    />
                    <span
                      className="text-[16px] font-semibold tracking-tight"
                      style={{ color: tempColor }}
                    >
                      {h.tempF}°F
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="relative pl-[22px] py-[6px] w-full" data-name="Time Stamps">
      <div className="flex flex-col gap-[26px] w-full font-['Inter:Semi_Bold',sans-serif] font-semibold text-[#6b655b] text-[18px]">
        <div className="flex items-center justify-between w-full pr-2"><span>8:00 am</span><span>72°F</span></div>
        <div className="flex items-center justify-between w-full pr-2"><span>11:00 am</span><span>81°F</span></div>
        <div className="flex items-center justify-between w-full pr-2"><span>2:00 pm</span><span>86°F</span></div>
        <div className="flex items-center justify-between w-full pr-2"><span>5:00 pm</span><span>82°F</span></div>
      </div>
    </div>
  );
}

function DailyTags() {
  const ctx = useWeather();
  if (ctx?.brief) {
    return (
      <div className="content-stretch flex flex-wrap gap-[8px] items-start relative shrink-0" data-name="Daily Tags">
        {ctx.brief.tags.map((tagId, idx) => (
          <DailyTag key={idx} className="bg-[#d5cfc4] relative rounded-[166px] shrink-0" tagLabel={TAG_LABELS[tagId] || tagId} />
        ))}
      </div>
    );
  }

  return (
    <div className="content-stretch flex flex-wrap gap-[8px] items-start relative shrink-0" data-name="Daily Tags">
      <DailyTag className="bg-[#d5cfc4] relative rounded-[166px] shrink-0" tagLabel="Warm" />
      <DailyTag className="bg-[#d5cfc4] relative rounded-[166px] shrink-0" tagLabel="Sunny" />
      <DailyTag className="bg-[#d5cfc4] relative rounded-[166px] shrink-0" tagLabel="Dry" />
    </div>
  );
}

function Frame10() {
  const ctx = useWeather();
  const desc = ctx?.brief?.nowDescription || ctx?.brief?.hourly?.[0]?.description || "You can expect a cool morning. Chilly, bring a jacket that's packable.";

  return (
    <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0 w-full">
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-relaxed not-italic relative shrink-0 text-[#6b655b] text-[15px]">{desc}</p>
      <DailyTags />
    </div>
  );
}

function MobileConditionsCard() {
  const ctx = useWeather();
  const now = new Date();
  const timeStr = `${now.getHours() % 12 || 12}:${now.getMinutes().toString().padStart(2, "0")}${now.getHours() < 12 ? "am" : "pm"}`;

  return (
    <div className="bg-[#f0ece4] rounded-[22px] p-[16px] shadow-none w-full" data-name="Mobile Conditions Card">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic text-[#6b655b] text-[17px] mb-[8px]">Now: {timeStr}</p>
      <Frame10 />
    </div>
  );
}

function MobileHourlyTimeline() {
  const ctx = useWeather();
  const hourly = ctx?.brief?.hourly;
  if (!hourly || hourly.length === 0) return null;

  return (
    <div className="w-full min-w-0 flex flex-col gap-2">
      <p className="font-['Inter:Medium',sans-serif] font-medium text-[#6b655b] text-[15px] px-1">Today's Forecast</p>
      <div className="w-full min-w-0 overflow-x-auto no-scrollbar py-1 flex gap-3">
        {hourly.map((h, i) => {
          const tempColor = getTemperatureColor(h.tempF);
          return (
            <div
              key={i}
              className="flex flex-col items-center justify-between min-w-[76px] bg-[#f0ece4] rounded-[18px] py-3 px-2 shrink-0 shadow-none"
            >
              <span className="text-[12px] font-semibold text-[#6b655b] whitespace-nowrap">{h.displayTime}</span>
              <div
                className="w-2.5 h-2.5 rounded-full my-2.5"
                style={{ backgroundColor: tempColor }}
              />
              <span className="text-[15px] font-bold text-[#6b655b]">{h.tempF}°</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TimeAndConditions() {
  const ctx = useWeather();
  const now = new Date();
  const timeStr = `${now.getHours() % 12 || 12}:${now.getMinutes().toString().padStart(2, "0")}${now.getHours() < 12 ? "am" : "pm"}`;

  return (
    <div className="bg-[#faf8f4] border border-[#e4dfd6] border-solid flex-[1_0_0] h-full min-w-px flex flex-col rounded-[36px] sm:rounded-[40px] lg:rounded-[44px] shadow-none overflow-hidden" data-name="Time and conditions">
      {/* Top section: Descriptive Card in flow (does not block timestamps) */}
      <div className="p-[18px] pb-[14px] shrink-0">
        <div className="bg-[#f0ece4] rounded-[22px] p-[16px] shadow-none" data-name="Side Panel Descriptive Card">
          <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[#6b655b] text-[18px] whitespace-nowrap mb-[8px]">Now: {timeStr}</p>
          <Frame10 />
        </div>
      </div>

      {/* Subtle divider */}
      <div className="h-px bg-[#e4dfd6] mx-[18px] shrink-0" />

      {/* Scrollable Hourly Timeline */}
      <div className="flex-1 overflow-y-auto px-[18px] py-[16px]">
        <TimeStamps />
      </div>
    </div>
  );
}

function Frame() {
  const ctx = useWeather();
  const loc = ctx?.brief?.location;
  const locText = loc ? `${loc.city}, ${loc.region}` : "New York, New York";

  return (
    <div className="content-stretch flex gap-[8px] sm:gap-[14px] items-center relative shrink-0">
      <LocationIcon className="h-[16px] sm:h-[20px] relative shrink-0 w-[12px] sm:w-[15px]" />
      <p className="[word-break:break-word] font-['Source_Serif_Pro:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#6b655b] text-[13px] sm:text-[16px] whitespace-nowrap">{locText}</p>
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-full">
      <Frame />
    </div>
  );
}

function LocationIndicator({ className }: { className?: string }) {
  return (
    <div className={`bg-white relative rounded-[90px] shrink-0 w-fit ${className || ""}`} data-name="Location Indicator">
      <div className="flex flex-col items-center justify-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col items-center justify-center px-[10px] sm:px-[16px] py-[6px] sm:py-[8px] relative size-full">
          <Frame1 />
        </div>
      </div>
      <div aria-hidden className="absolute border border-[#e4dfd6] border-solid inset-0 pointer-events-none rounded-[90px]" />
    </div>
  );
}

function Frame9() {
  const ctx = useWeather();
  const headline = ctx?.brief?.headline || "Dress light today";

  return (
    <div className="flex flex-col items-start relative shrink-0 w-full gap-[8px]" data-name="Frame 9">
      <div className="w-full flex justify-end items-center">
        <LocationIndicator />
      </div>
      <div className="w-full font-['Source_Serif_Pro:Semi_Bold','Source_Serif_4',serif] font-semibold min-w-0 not-italic text-[#6b655b]" data-name="Frame 53">
        <p className="leading-[1.15] text-[26px] sm:text-[30px] font-semibold tracking-tight text-[#6b655b]" title={headline}>{headline}</p>
      </div>
    </div>
  );
}

function IconFrame() {
  const ctx = useWeather();
  const wearIcons = ctx?.brief?.wear?.icons;

  if (wearIcons && wearIcons.length > 0) {
    return (
      <div className="content-stretch flex gap-[12px] items-center relative shrink-0 w-full" data-name="Icon Frame">
        {wearIcons.map((id) => (
          <WeatherIconItem key={id} id={id} />
        ))}
      </div>
    );
  }

  return (
    <div className="content-stretch flex gap-[12px] items-center relative shrink-0 w-full" data-name="Icon Frame">
      <WeatherIconItem id="heavy_coat" />
      <WeatherIconItem id="t_shirt" />
      <WeatherIconItem id="shorts" />
      <WeatherIconItem id="sun_hat" />
    </div>
  );
}

function Frame4() {
  const ctx = useWeather();
  const desc = ctx?.brief?.wear?.description || "T-shirt, shorts, sandals, and a hat. Today is not the day for denim.";

  return (
    <div className="content-stretch flex flex-col sm:flex-row gap-[10px] sm:gap-[14px] xl:gap-[24px] items-start relative shrink-0 w-full">
      <div
        className="bg-white relative rounded-[22px] shrink-0 w-fit max-w-[246px] cursor-pointer hover:shadow-md transition-shadow"
        data-name="Frame Background Cell"
        onClick={() => ctx?.openOverlay("wear")}
        role="button"
        tabIndex={0}
        aria-label="View details on what to wear"
      >
        <div className="overflow-clip rounded-[inherit] size-full">
          <div className="content-stretch flex flex-col items-start px-[12px] xl:px-[16px] py-[8px] relative size-full">
            <IconFrame />
          </div>
        </div>
      </div>
      <p className="[word-break:break-word] flex-1 min-w-0 font-['Inter:Regular',sans-serif] font-normal leading-relaxed not-italic relative text-[14px] xl:text-[15px] text-[#6b655b]">{desc}</p>
    </div>
  );
}

function Frame5({ conf = 94 }: { conf?: number }) {
  return (
    <div className="content-stretch flex flex-col gap-[9px] items-start relative shrink-0 w-full">
      <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[#6b655b] text-[20px] w-full">Wear</p>
      <Frame4 />
    </div>
  );
}

function IconFrame1() {
  const ctx = useWeather();
  const packIcons = ctx?.brief?.pack?.icons;

  if (packIcons && packIcons.length > 0) {
    return (
      <div className="content-stretch flex gap-[12px] items-center relative shrink-0 w-full" data-name="Icon Frame">
        {packIcons.map((id) => (
          <WeatherIconItem key={id} id={id} />
        ))}
      </div>
    );
  }

  return (
    <div className="content-stretch flex gap-[12px] items-center relative shrink-0 w-full" data-name="Icon Frame">
      <WeatherIconItem id="sun_screen" />
      <WeatherIconItem id="water_bottle" />
      <WeatherIconItem id="shades" />
    </div>
  );
}

function Frame7() {
  const ctx = useWeather();
  const desc = ctx?.brief?.pack?.description || "Water and sunscreen. UV is at 9, which burns unprotected skin in under fifteen minutes.";

  return (
    <div className="content-stretch flex flex-col sm:flex-row gap-[10px] sm:gap-[14px] xl:gap-[24px] items-start relative shrink-0 w-full">
      <div
        className="bg-white relative rounded-[22px] shrink-0 w-fit max-w-[246px] cursor-pointer hover:shadow-md transition-shadow"
        data-name="Frame Background Cell"
        onClick={() => ctx?.openOverlay("pack")}
        role="button"
        tabIndex={0}
        aria-label="View details on what to pack"
      >
        <div className="overflow-clip rounded-[inherit] size-full">
          <div className="content-stretch flex flex-col items-start px-[12px] xl:px-[16px] py-[8px] relative size-full">
            <IconFrame1 />
          </div>
        </div>
      </div>
      <p className="[word-break:break-word] flex-1 min-w-0 font-['Inter:Regular',sans-serif] font-normal leading-relaxed not-italic relative text-[14px] xl:text-[15px] text-[#6b655b]">{desc}</p>
    </div>
  );
}

function Frame6() {
  return (
    <div className="content-stretch flex flex-col gap-[9px] items-start relative shrink-0 w-full">
      <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[#6b655b] text-[20px] w-full">Pack</p>
      <Frame7 />
    </div>
  );
}

function Frame8({ conf = 94 }: { conf?: number }) {
  return (
    <div className="content-stretch flex flex-col gap-[14px] xl:gap-[16px] items-start relative flex-1 min-w-0 max-w-[555px] w-full">
      <Frame5 conf={conf} />
      <Frame6 />
    </div>
  );
}

function Frame2() {
  const ctx = useWeather();
  const headline = ctx?.brief?.headline || "Dress light today";
  const conf = ctx?.brief?.confidence ?? 94;

  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col h-full justify-between min-w-0 relative w-full" data-name="Detail Info Panel">
      {/* Top Stack: Location Indicator on the far right, and Recommend Text + Wear/Pack starting at the bottom of the location frame */}
      <div className="w-full flex flex-col items-start shrink-0">
        {/* Top row: Location Indicator on the far right */}
        <div className="w-full flex justify-end items-start shrink-0">
          <LocationIndicator />
        </div>

        {/* Recommend text & Wear/Pack stack positioned at the top, starting directly at the bottom of the location frame */}
        <div className="flex flex-col gap-[12px] xl:gap-[16px] w-full max-w-[580px] mt-[4px] sm:mt-[6px]">
          <div className="font-['Source_Serif_Pro:Semi_Bold','Source_Serif_4',serif] font-semibold min-w-0 not-italic text-[#6b655b]" data-name="Frame 53">
            <p className="leading-[1.15] text-[28px] sm:text-[34px] xl:text-[42px] font-semibold tracking-tight whitespace-nowrap overflow-hidden text-ellipsis" title={headline}>
              {headline}
            </p>
          </div>
          <Frame8 conf={conf} />
        </div>
      </div>

      {/* Bottom row: Confidence Card on the far right, vertically aligned with Location Indicator */}
      <div className="w-full flex justify-end items-end shrink-0">
        <ConfidenceCard className="relative shrink-0" confidenceLabel={`Confidence ${conf}%`} />
      </div>
    </div>
  );
}

function SuggestionPrompt() {
  const ctx = useWeather();

  return (
    <div className="content-stretch flex overflow-x-auto no-scrollbar sm:overflow-visible gap-[10px] xl:gap-[20px] items-stretch sm:justify-center relative shrink-0 w-full min-w-0 max-w-[1053px] py-1" data-name="Suggestion Prompt">
      <PromptSuggestion
        className="shrink-0 sm:shrink sm:flex-1 min-w-[200px] sm:min-w-0"
        promptText="What if I am out all day?"
        onClick={() => ctx?.openChatWithPrompt("What if I am out all day?")}
      />
      <PromptSuggestion
        className="shrink-0 sm:shrink sm:flex-1 min-w-[180px] sm:min-w-0"
        promptText="Can I skip the jacket?"
        onClick={() => ctx?.openChatWithPrompt("Can I skip the jacket?")}
      />
      <PromptSuggestion
        className="shrink-0 sm:shrink sm:flex-1 min-w-[150px] sm:min-w-0"
        promptText="Why the boots?"
        onClick={() => ctx?.openChatWithPrompt("Why the boots?")}
      />
    </div>
  );
}

function ChatWindow() {
  const ctx = useWeather();

  return (
    <div className="bg-[#f0ece4] content-stretch flex flex-col items-center justify-between overflow-hidden px-[14px] sm:px-[16px] py-[16px] sm:py-[24px] gap-[14px] sm:gap-[20px] relative rounded-[28px] sm:rounded-[42px] w-full min-w-0" data-name="Chat Window">
      <SuggestionPrompt />
      <div
        className="bg-[#faf8f4] min-h-[64px] sm:min-h-[86px] relative rounded-[22px] shrink-0 w-full max-w-[1053px] cursor-pointer hover:bg-white transition-colors"
        data-name="Chat Box"
        onClick={() => ctx?.openChatWithPrompt("")}
        role="button"
        tabIndex={0}
      >
        <div className="min-h-[inherit] overflow-clip rounded-[inherit] size-full">
          <div className="content-stretch flex items-center min-h-[inherit] px-[18px] sm:px-[20px] py-[14px] sm:py-[16px] relative size-full">
            <p className="font-['Inter:Regular',sans-serif] font-normal text-[#6b655b] text-[15px] sm:text-[16px] m-0">Ask about today</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function WeatherVisualHero() {
  const ctx = useWeather();
  const [imgSrc, setImgSrc] = useState(imgWeatherVisualDisplay);

  useEffect(() => {
    if (ctx?.brief) {
      const visual = getWeatherVisual(ctx.brief.current.conditionCode, ctx.brief.current.isDay);
      setImgSrc(visual);
    }
  }, [ctx?.brief?.current.conditionCode, ctx?.brief?.current.isDay]);

  return (
    <div className="h-[180px] sm:h-[220px] lg:h-full w-full lg:w-[240px] xl:w-[270px] max-w-none lg:max-w-[506px] relative rounded-[36px] sm:rounded-[40px] lg:rounded-[44px] shrink-0 overflow-hidden shadow-none transition-[width] duration-200" data-name="Weather Visual Display">
      <img
        alt={ctx?.brief?.current.condition || "Weather conditions"}
        className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[inherit] size-full transition-opacity duration-700"
        src={imgSrc}
        onError={() => setImgSrc(imgWeatherVisualDisplay)}
      />
    </div>
  );
}

function Main() {
  const ctx = useWeather();
  const conf = ctx?.brief?.confidence ?? 94;

  return (
    <div className="bg-[#faf8f4] w-full flex-1 min-w-0" data-name="Main">
      {/* MOBILE & TABLET PORTRAIT FLOW (< 1024px) */}
      <div className="flex flex-col lg:hidden w-full min-w-0 px-4 py-4 gap-5 max-w-[640px] mx-auto pb-12 overflow-x-hidden">
        {/* 1. Greeting & Location Indicator */}
        <Frame9 />

        {/* 2. Visual Weather Hero Banner */}
        <WeatherVisualHero />

        {/* 3. Conditions Card ("Now: time" + description + tags) */}
        <MobileConditionsCard />

        {/* 4. Hourly Horizontal Swipe Timeline */}
        <MobileHourlyTimeline />

        {/* 5. Wear & Pack Recommendations */}
        <div className="bg-[#faf8f4] border border-[#e4dfd6] rounded-[24px] p-4 shadow-none w-full min-w-0 flex flex-col gap-3">
          {/* Confidence percentage frame at top */}
          <div className="w-full flex justify-end items-center">
            <ConfidenceCard className="relative shrink-0" confidenceLabel={`Confidence ${conf}%`} />
          </div>

          {/* Underneath: Wear & Pack description frames */}
          <Frame8 conf={conf} />
        </div>
      </div>

      {/* DESKTOP FLOW (>= 1024px) */}
      <div className="hidden lg:flex content-stretch flex-[1_0_0] items-start justify-center min-h-px px-[16px] xl:px-[24px] relative w-full h-[calc(100vh-93px)] min-h-[750px]">
        <div className="bg-[#faf8f4] h-full relative shrink-0 w-[300px] lg:w-[320px] xl:w-[360px] 2xl:w-[395px] transition-[width] duration-200" data-name="Side Panel">
          <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
            <div className="content-stretch flex items-center p-[16px] xl:p-[24px] relative size-full">
              <TimeAndConditions />
            </div>
          </div>
        </div>
        <div className="h-full max-w-[1182px] flex-1 min-w-0 relative" data-name="Center Screen">
          <div className="flex flex-col items-center justify-end max-w-[inherit] size-full">
            <div className="content-stretch flex flex-col items-center justify-end max-w-[inherit] p-[16px] xl:p-[24px] relative size-full">
              {ctx?.chatOpen ? (
                <ChatCard />
              ) : (
                <div className="flex flex-col gap-[20px] items-center justify-end size-full">
                  <div className="flex-1 min-h-[360px] max-h-[471px] relative shrink-0 w-full max-w-[1134px] min-w-0" data-name="Detail Display">
                    <div className="content-stretch flex gap-[16px] xl:gap-[24px] items-stretch relative size-full">
                      <WeatherVisualHero />
                      <Frame2 />
                    </div>
                  </div>
                  <div className="h-[260px] xl:h-[300px] relative shrink-0 w-full max-w-[1134px] min-w-0" data-name="Chat Window">
                    <div className="flex flex-col items-center justify-end size-full">
                      <div className="content-stretch flex flex-col items-center justify-end relative size-full">
                        <ChatWindow />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HomeScreen() {
  return (
    <div className="bg-[#faf8f4] content-stretch flex flex-col items-start relative size-full min-h-screen min-w-0" data-name="Home Screen">
      <Header className="bg-[#faf8f4] h-[60px] lg:h-[93px] overflow-clip relative shrink-0 w-full" />
      <Main />
    </div>
  );
}