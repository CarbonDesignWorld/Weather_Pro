import { useState, useEffect } from "react";
import svgPaths from "./svg-7a2pt52j2y";
import imgWeatherVisualDisplay from "./468d1251b756da2aa4f79a32648edd195a653df0.png";
import { useWeather } from "../src/context/WeatherContext";
import WeatherIconItem from "../src/components/WeatherIconItem";
import { TAG_LABELS } from "../src/lib/constants";
import { getTemperatureColor, getTimelineGradient, getWeatherVisual } from "../src/lib/weatherVisuals";

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

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => { setHover(false); setPressed(false); }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      className={className || `relative rounded-[22px] shadow-[0px_1px_4px_1px_rgba(28,42,68,0.2)] w-[333px] text-left cursor-pointer border-none transition-colors duration-150 ${activeState === "Pressing" ? "bg-[#2a3d61]" : activeState === "Hover" ? "bg-[#3a5384]" : "bg-[#4a69a9]"}`}
    >
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-start px-[16px] py-[24px] relative size-full">
          <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[16px] text-white whitespace-nowrap">{promptText}</p>
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
      <div className="flex flex-col items-end justify-center size-full">
        <div className="content-stretch flex flex-col items-end justify-center relative size-full">
          <div className="bg-[#6b655b] content-stretch flex flex-col h-[31px] items-center justify-center px-[12px] relative rounded-[99px] shrink-0 w-full">
            <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[20px] text-white whitespace-nowrap">{confidenceLabel}</p>
          </div>
        </div>
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
            style={{ color: isHovered ? "#2e2a26" : "#6b655b" }}
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
          <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#2e2a26] text-[16px] whitespace-nowrap">{tagLabel}</p>
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
    <div className={className || "bg-[#faf8f4] h-[93px] overflow-clip relative w-[1634px]"}>
      <div className="absolute bg-[#faf8f4] content-stretch flex items-center justify-end left-0 overflow-clip px-[14px] py-[13px] top-0 w-[395px]" data-name="Tab">
        <div className="content-stretch flex flex-[1_0_0] gap-[26px] items-center min-w-px relative" data-name="Data Frame">
          <div className="[word-break:break-word] content-stretch flex flex-col gap-[3px] items-start leading-[normal] not-italic relative shrink-0 text-[#2e2a26] text-[16px] w-[140px]" data-name="Data">
            <p className="font-['Source_Serif_Pro:Light',sans-serif] relative shrink-0 w-full">{brandName}</p>
            <p className="font-['Source_Serif_Pro:Light',sans-serif] relative shrink-0 w-full">{dateStr}</p>
            <p className="font-['Source_Serif_Pro:Regular',sans-serif] relative shrink-0 w-full font-medium">{tempStr}</p>
          </div>
          <div className="flex items-center justify-center relative shrink-0">
            <div className="-scale-y-100 flex-none rotate-180">
              <div className="relative size-[18px]" data-name="Drop Down Arrow" />
            </div>
          </div>
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
                  <span className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[#2e2a26] text-[18px]">
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
  const desc = ctx?.brief?.hourly?.[0]?.description || "You can expect a cool morning. Chilly, bring a jacket that's packable.";

  return (
    <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0 w-full">
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-relaxed not-italic relative shrink-0 text-[#6b655b] text-[15px]">{desc}</p>
      <DailyTags />
    </div>
  );
}

function TimeAndConditions() {
  const ctx = useWeather();
  const now = new Date();
  const timeStr = `${now.getHours() % 12 || 12}:${now.getMinutes().toString().padStart(2, "0")}${now.getHours() < 12 ? "am" : "pm"}`;

  return (
    <div className="bg-[#faf8f4] border border-[#e4dfd6] border-solid flex-[1_0_0] h-full min-w-px flex flex-col rounded-[50px] shadow-[0px_1px_4px_1px_rgba(28,42,68,0.2)] overflow-hidden" data-name="Time and conditions">
      {/* Top section: Descriptive Card in flow (does not block timestamps) */}
      <div className="p-[18px] pb-[14px] shrink-0">
        <div className="bg-[#f0ece4] rounded-[22px] p-[16px] shadow-[0px_2px_8px_rgba(28,42,68,0.06)]" data-name="Side Panel Descriptive Card">
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

function WeatherMessageBox() {
  const ctx = useWeather();
  const headline = ctx?.brief?.headline || "84 degrees and climbing. Find shade where you can.";

  return (
    <div className="bg-[#faf8f4]/95 backdrop-blur-xs content-stretch flex flex-[1_0_0] h-[139px] items-start justify-between min-w-px overflow-clip px-[24px] py-[16px] relative rounded-[30px] shadow-[0px_2px_8px_rgba(28,42,68,0.08)]" data-name="Weather message Box">
      <p className="[word-break:break-word] flex-[1_0_0] font-['Inter:Regular',sans-serif] font-normal leading-relaxed min-w-px not-italic relative text-[16px] text-black">{headline}</p>
    </div>
  );
}

function Frame() {
  const ctx = useWeather();
  const loc = ctx?.brief?.location;
  const locText = loc ? `${loc.city}, ${loc.region}` : "New York, New York";

  return (
    <div className="content-stretch flex gap-[14px] items-center relative shrink-0">
      <LocationIcon className="h-[20px] relative shrink-0 w-[15px]" />
      <p className="[word-break:break-word] font-['Source_Serif_Pro:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#6b655b] text-[16px] whitespace-nowrap">{locText}</p>
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

function Frame9() {
  const ctx = useWeather();
  const greeting = ctx?.brief?.greeting || "Hey,";
  const headline = ctx?.brief?.headline || "Dress light today";

  return (
    <div className="content-stretch flex h-[115px] max-h-[115px] items-start justify-between relative shrink-0 w-full overflow-hidden">
      <div className="flex-1 font-['Source_Serif_Pro:Semi_Bold','Source_Serif_4',serif] font-semibold min-w-0 not-italic relative text-[#2e2a26] overflow-hidden" data-name="Frame 53">
        <p className="leading-[1.1] mb-[2px] text-[48px] font-semibold tracking-tight whitespace-nowrap overflow-hidden text-ellipsis">{greeting}</p>
        <p className="leading-[1.15] text-[36px] font-semibold whitespace-nowrap overflow-hidden text-ellipsis" title={headline}>{headline}</p>
      </div>
      <div className="bg-white relative rounded-[90px] shrink-0 w-fit ml-[16px]" data-name="Location Indicator">
        <div className="flex flex-col items-center justify-center overflow-clip rounded-[inherit] size-full">
          <div className="content-stretch flex flex-col items-center justify-center px-[16px] py-[8px] relative size-full">
            <Frame1 />
          </div>
        </div>
        <div aria-hidden className="absolute border border-[#e4dfd6] border-solid inset-0 pointer-events-none rounded-[90px]" />
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
    <div className="content-stretch flex gap-[34px] items-start relative shrink-0 w-full">
      <div
        className="bg-white relative rounded-[22px] shrink-0 w-[246px] cursor-pointer hover:shadow-md transition-shadow"
        data-name="Frame Background Cell"
        onClick={() => ctx?.openOverlay("wear")}
        role="button"
        tabIndex={0}
        aria-label="View details on what to wear"
      >
        <div className="overflow-clip rounded-[inherit] size-full">
          <div className="content-stretch flex flex-col items-start px-[16px] py-[8px] relative size-full">
            <IconFrame />
          </div>
        </div>
      </div>
      <p className="[word-break:break-word] flex-[1_0_0] font-['Inter:Regular',sans-serif] font-normal leading-relaxed min-w-px not-italic relative text-[16px] text-black">{desc}</p>
    </div>
  );
}

function Frame5() {
  return (
    <div className="content-stretch flex flex-col gap-[9px] items-start relative shrink-0 w-full">
      <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[#2e2a26] text-[20px] w-full">Wear</p>
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
    <div className="content-stretch flex gap-[34px] items-start relative shrink-0 w-full">
      <div
        className="bg-white relative rounded-[22px] shrink-0 w-[246px] cursor-pointer hover:shadow-md transition-shadow"
        data-name="Frame Background Cell"
        onClick={() => ctx?.openOverlay("pack")}
        role="button"
        tabIndex={0}
        aria-label="View details on what to pack"
      >
        <div className="overflow-clip rounded-[inherit] size-full">
          <div className="content-stretch flex flex-col items-start px-[16px] py-[8px] relative size-full">
            <IconFrame1 />
          </div>
        </div>
      </div>
      <p className="[word-break:break-word] flex-[1_0_0] font-['Inter:Regular',sans-serif] font-normal leading-relaxed min-w-px not-italic relative text-[16px] text-black">{desc}</p>
    </div>
  );
}

function Frame6() {
  return (
    <div className="content-stretch flex flex-col gap-[9px] items-start relative shrink-0 w-full">
      <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[20px] text-black w-full">Pack</p>
      <Frame7 />
    </div>
  );
}

function Frame8() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-[555px]">
      <Frame5 />
      <Frame6 />
    </div>
  );
}

function Frame3() {
  const ctx = useWeather();
  const conf = ctx?.brief?.confidence;

  return (
    <div className="content-stretch flex items-end justify-between relative shrink-0 w-full">
      <Frame8 />
      {conf !== null && conf !== undefined && (
        <ConfidenceCard className="relative shrink-0" confidenceLabel={`Confidence ${conf}%`} />
      )}
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col h-full items-end justify-between min-w-px relative">
      <div className="w-full flex justify-between items-start">
        <Frame9 />
      </div>
      <div className="w-full flex justify-between items-end">
        <Frame3 />
      </div>
    </div>
  );
}

function SuggestionPrompt() {
  const ctx = useWeather();

  return (
    <div className="content-stretch flex gap-[20px] items-start justify-center relative shrink-0 w-[1053px]" data-name="Suggestion Prompt">
      <PromptSuggestion
        className="bg-[#4a69a9] flex-[1_0_32px] min-w-px relative rounded-[22px] shadow-[0px_1px_4px_1px_rgba(28,42,68,0.2)]"
        promptText="What if I am out all day?"
        onClick={() => ctx?.openChatWithPrompt("What if I am out all day?")}
      />
      <PromptSuggestion
        className="bg-[#4a69a9] flex-[1_0_32px] min-w-px relative rounded-[22px] shadow-[0px_1px_4px_1px_rgba(28,42,68,0.2)]"
        promptText="Can I skip the jacket?"
        onClick={() => ctx?.openChatWithPrompt("Can I skip the jacket?")}
      />
      <PromptSuggestion
        className="bg-[#4a69a9] flex-[1_0_32px] min-w-px relative rounded-[22px] shadow-[0px_1px_4px_1px_rgba(28,42,68,0.2)]"
        promptText="Why the boots?"
        onClick={() => ctx?.openChatWithPrompt("Why the boots?")}
      />
    </div>
  );
}

function ChatWindow() {
  const ctx = useWeather();

  return (
    <div className="bg-[#f0ece4] content-stretch flex flex-[1_0_0] flex-col items-center justify-between min-h-px overflow-clip px-[16px] py-[24px] relative rounded-[42px] w-full" data-name="Chat Window">
      <SuggestionPrompt />
      <div
        className="bg-[#faf8f4] min-h-[86px] relative rounded-[22px] shrink-0 w-[1053px] cursor-pointer hover:bg-white transition-colors"
        data-name="Chat Box"
        onClick={() => ctx?.openChatWithPrompt("")}
        role="button"
        tabIndex={0}
      >
        <div className="min-h-[inherit] overflow-clip rounded-[inherit] size-full">
          <div className="content-stretch flex items-center min-h-[inherit] px-[20px] py-[16px] relative size-full">
            <p className="font-['Inter:Regular',sans-serif] font-normal text-[#6b655b] text-[16px] m-0">Ask about today</p>
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
    <div className="h-full max-w-[506px] relative rounded-[22px] shrink-0 w-[270px] overflow-hidden shadow-[0px_4px_20px_rgba(28,42,68,0.12)]" data-name="Weather Visual Display">
      <img
        alt={ctx?.brief?.current.condition || "Weather conditions"}
        className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[22px] size-full transition-opacity duration-700"
        src={imgSrc}
        onError={() => setImgSrc(imgWeatherVisualDisplay)}
      />
      {/* Atmospheric gradient overlay for contrast */}
      <div className="absolute inset-x-0 bottom-0 h-[170px] bg-gradient-to-t from-black/40 via-black/10 to-transparent pointer-events-none rounded-b-[22px]" />
      <div className="flex flex-row items-end max-w-[inherit] overflow-clip rounded-[inherit] size-full relative z-10">
        <div className="content-stretch flex items-end justify-between max-w-[inherit] px-[25px] py-[19px] relative size-full">
          <WeatherMessageBox />
        </div>
      </div>
    </div>
  );
}

function Main() {
  return (
    <div className="bg-[#faf8f4] content-stretch flex flex-[1_0_0] items-start justify-center min-h-px px-[24px] relative w-full" data-name="Main">
      <div className="bg-[#faf8f4] h-full relative shrink-0 w-[395px]" data-name="Side Panel">
        <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
          <div className="content-stretch flex items-center p-[24px] relative size-full">
            <TimeAndConditions />
          </div>
        </div>
      </div>
      <div className="h-[839px] max-w-[1800px] relative shrink-0 w-[1182px]" data-name="Center Screen">
        <div className="flex flex-col items-center justify-end max-w-[inherit] size-full">
          <div className="content-stretch flex flex-col gap-[20px] items-center justify-end max-w-[inherit] p-[24px] relative size-full">
            <div className="h-[471px] relative shrink-0 w-[1134px]" data-name="Detail Display">
              <div className="content-stretch flex gap-[24px] items-start relative size-full">
                <WeatherVisualHero />
                <Frame2 />
              </div>
            </div>
            <div className="h-[300px] relative shrink-0 w-[1134px]" data-name="Chat Window">
              <div className="flex flex-col items-center justify-end size-full">
                <div className="content-stretch flex flex-col items-center justify-end relative size-full">
                  <ChatWindow />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HomeScreen() {
  return (
    <div className="bg-white content-stretch flex flex-col items-start relative size-full" data-name="Home Screen">
      <Header className="bg-[#faf8f4] h-[93px] overflow-clip relative shrink-0 w-full" />
      <Main />
    </div>
  );
}