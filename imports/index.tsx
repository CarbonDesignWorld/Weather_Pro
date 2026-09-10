import { useState } from "react";
import svgPaths from "./svg-7a2pt52j2y";
import imgWeatherVisualDisplay from "./468d1251b756da2aa4f79a32648edd195a653df0.png";
type PromptSuggestionProps = {
  className?: string;
  promptText?: string;
  state?: "Default" | "Hover" | "Pressing";
};

function PromptSuggestion({ className, promptText = "What if I am out all day?", state = "Default" }: PromptSuggestionProps) {
  return (
    <div className={className || `relative rounded-[22px] shadow-[0px_1px_4px_1px_rgba(28,42,68,0.2)] w-[333px] ${state === "Pressing" ? "bg-[#2a3d61]" : state === "Hover" ? "bg-[#3a5384] cursor-pointer" : "bg-[#4a69a9]"}`}>
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-start px-[16px] py-[24px] relative size-full">
          <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[16px] text-white whitespace-nowrap">{promptText}</p>
        </div>
      </div>
    </div>
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
type SunHatProps = {
  className?: string;
  copy?: "No";
};

function SunHat({ className, copy = "No" }: SunHatProps) {
  return (
    <div className={className || "relative"}>
      <div className="flex flex-col items-center size-full">
        <div className="content-stretch flex flex-col items-center relative size-full">
          <div className="bg-[#f0ece4] content-stretch flex items-center justify-center p-[8px] relative rounded-[22px] shrink-0 size-[44px]">
            <div className="relative shrink-0 size-[34px]" data-name="cap">
              <svg className="absolute block inset-0 size-full" fill="none" height="34" preserveAspectRatio="none" viewBox="0 0 34 34" width="34">
                <g id="cap">
                  <path d={svgPaths.pc1d7670} fill="#5B7FC7" id="Vector" />
                </g>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
type ShortsProps = {
  className?: string;
  copy?: "No";
};

function Shorts({ className, copy = "No" }: ShortsProps) {
  return (
    <div className={className || "relative"}>
      <div className="flex flex-col items-center size-full">
        <div className="content-stretch flex flex-col items-center relative size-full">
          <div className="bg-[#f0ece4] content-stretch flex h-[44px] items-center justify-center p-[8px] relative rounded-[22px] shrink-0 w-full">
            <div className="relative shrink-0 size-[28px]" data-name="shorts- (2)">
              <svg className="absolute block inset-0 size-full" fill="none" height="28" preserveAspectRatio="none" viewBox="0 0 28 28" width="28">
                <g id="shorts- (2)">
                  <path d={svgPaths.p2cafffb0} fill="#5B7FC7" id="Vector" />
                </g>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
type TShirtProps = {
  className?: string;
  copy?: "No";
};

function TShirt({ className, copy = "No" }: TShirtProps) {
  return (
    <div className={className || "relative"}>
      <div className="flex flex-col items-center size-full">
        <div className="content-stretch flex flex-col items-center relative size-full">
          <div className="bg-[#f0ece4] content-stretch flex h-[44px] items-center justify-center p-[8px] relative rounded-[22px] shrink-0 w-full">
            <div className="relative shrink-0 size-[28px]" data-name="t-shirt (2)">
              <svg className="absolute block inset-0 size-full" fill="none" height="28" preserveAspectRatio="none" viewBox="0 0 28 28" width="28">
                <g id="t-shirt (2)">
                  <path d={svgPaths.p24c7b70} fill="#5B7FC7" id="Vector" />
                </g>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
type HeavyCoatProps = {
  className?: string;
  copy?: "No";
};

function HeavyCoat({ className, copy = "No" }: HeavyCoatProps) {
  return (
    <div className={className || "relative"}>
      <div className="flex flex-col items-center size-full">
        <div className="content-stretch flex flex-col items-center relative size-full">
          <div className="bg-[#f0ece4] content-stretch flex items-start p-[8px] relative rounded-[22px] shrink-0 size-[44px]">
            <div className="relative shrink-0 size-[28px]" data-name="a-down-jacket- (7)">
              <svg className="absolute block inset-0 size-full" fill="none" height="28" preserveAspectRatio="none" viewBox="0 0 28 28" width="28">
                <g id="a-down-jacket- (7)">
                  <path d={svgPaths.p2d822f0} fill="#5B7FC7" id="Vector" />
                </g>
              </svg>
            </div>
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
};

function ClickableText({ className, buttonLabel = "Change Location", state = "Default" }: ClickableTextProps) {
  const [hovered, setHovered] = useState(false);
  const isHovered = hovered || state === "Hoover";
  return (
    <div
      className={`${className || "relative"} cursor-pointer`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="flex flex-col items-center justify-center size-full">
        <div className="content-stretch flex flex-col items-center justify-center px-[24px] relative size-full">
          <p
            className="[text-decoration-skip-ink:none] [text-underline-position:from-font] [word-break:break-word] decoration-from-font decoration-solid font-['Source_Serif_Pro:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[16px] underline w-full transition-colors duration-150"
            style={{ color: isHovered ? "#6b655b" : "#2e2a26" }}
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

function Header({ className, brandName = "Today.io", dateLabel = "Sept 6", status = "Closed", temperatureLabel = "74 F | 23 C" }: HeaderProps) {
  return (
    <div className={className || "bg-[#faf8f4] h-[93px] overflow-clip relative w-[1634px]"}>
      <div className="absolute bg-[#faf8f4] content-stretch flex items-center justify-end left-0 overflow-clip px-[14px] py-[13px] top-0 w-[395px]" data-name="Tab">
        <div className="content-stretch flex flex-[1_0_0] gap-[26px] items-center min-w-px relative" data-name="Data Frame">
          <div className="[word-break:break-word] content-stretch flex flex-col gap-[3px] items-start leading-[normal] not-italic relative shrink-0 text-[#2e2a26] text-[16px] w-[85px]" data-name="Data">
            <p className="font-['Source_Serif_Pro:Light',sans-serif] relative shrink-0 w-full">{brandName}</p>
            <p className="font-['Source_Serif_Pro:Light',sans-serif] relative shrink-0 w-full">{dateLabel}</p>
            <p className="font-['Source_Serif_Pro:Regular',sans-serif] relative shrink-0 w-full">{temperatureLabel}</p>
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
  return (
    <div className="[word-break:break-word] absolute content-stretch flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold gap-[193px] items-start leading-[normal] left-[42px] not-italic text-[#6b655b] text-[24px] top-[53px] w-[104px]" data-name="Time Stamps">
      <p className="relative shrink-0 w-full">8:00 am</p>
      <p className="relative shrink-0 w-full">11:00 am</p>
      <p className="relative shrink-0 w-full">2:00 pm</p>
      <p className="relative shrink-0 w-full">5:00 pm</p>
    </div>
  );
}

function DailyTags() {
  return (
    <div className="content-stretch flex gap-[11px] items-start relative shrink-0" data-name="Daily Tags">
      <DailyTag className="bg-[#d5cfc4] relative rounded-[166px] shrink-0" />
      <DailyTag className="bg-[#d5cfc4] relative rounded-[166px] shrink-0" tagLabel="Sunny" />
      <DailyTag className="bg-[#d5cfc4] relative rounded-[166px] shrink-0" tagLabel="Dry" />
    </div>
  );
}

function Frame10() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[normal] min-w-full not-italic relative shrink-0 text-[#6b655b] text-[16px] w-[min-content]">{`You can expect a cool morning. Chilly, bring a jacket that's packable.`}</p>
      <DailyTags />
    </div>
  );
}

function TimeAndConditions() {
  return (
    <div className="bg-[#faf8f4] border border-[#e4dfd6] border-solid flex-[1_0_0] h-full min-w-px overflow-clip relative rounded-[50px] shadow-[0px_1px_4px_1px_rgba(28,42,68,0.2)]" data-name="Time and conditions">
      <TimeStamps />
      <div className="-translate-x-1/2 absolute bg-[#f0ece4] left-[calc(50%-5.5px)] rounded-[22px] top-[91px] w-[276px]" data-name="Side Panel Descriptive Card">
        <div className="overflow-clip rounded-[inherit] size-full">
          <div className="content-stretch flex flex-col gap-[10px] items-start p-[16px] relative size-full">
            <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[#6b655b] text-[20px] whitespace-nowrap">Now: 8:33am</p>
            <Frame10 />
          </div>
        </div>
      </div>
    </div>
  );
}

function WeatherMessageBox() {
  return (
    <div className="bg-[#faf8f4] content-stretch flex flex-[1_0_0] h-[139px] items-start justify-between min-w-px overflow-clip px-[24px] py-[16px] relative rounded-[30px]" data-name="Weather message Box">
      <p className="[word-break:break-word] flex-[1_0_0] font-['Inter:Regular',sans-serif] font-normal leading-[normal] min-w-px not-italic relative text-[16px] text-black">84 degrees and climbing. Find shade where you can.</p>
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex gap-[14px] items-center relative shrink-0">
      <LocationIcon className="h-[20px] relative shrink-0 w-[15px]" />
      <p className="[word-break:break-word] font-['Source_Serif_Pro:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#6b655b] text-[16px] whitespace-nowrap">New York, New York</p>
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
  return (
    <div className="content-stretch flex h-[160px] items-start justify-end relative shrink-0 w-full">
      <div className="[word-break:break-word] flex-[1_0_0] font-['Source_Serif_Pro:Regular',sans-serif] leading-[0] min-w-px not-italic relative text-[#2e2a26] text-[64px]">
        <p className="leading-[normal] mb-0">Hello,</p>
        <p className="leading-[normal]">Dress Light today</p>
      </div>
      <div className="bg-white relative rounded-[90px] shrink-0 w-fit" data-name="Location Indicator">
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
  return (
    <div className="content-stretch flex gap-[12px] items-center relative shrink-0 w-full" data-name="Icon Frame">
      <HeavyCoat className="relative shrink-0" />
      <TShirt className="relative shrink-0" />
      <Shorts className="relative shrink-0" />
      <SunHat className="relative shrink-0" />
    </div>
  );
}

function Frame4() {
  return (
    <div className="content-stretch flex gap-[34px] items-start relative shrink-0 w-full">
      <div className="bg-white relative rounded-[22px] shrink-0 w-[246px]" data-name="Frame Background Cell">
        <div className="overflow-clip rounded-[inherit] size-full">
          <div className="content-stretch flex flex-col items-start px-[16px] py-[8px] relative size-full">
            <IconFrame />
          </div>
        </div>
      </div>
      <p className="[word-break:break-word] flex-[1_0_0] font-['Inter:Regular',sans-serif] font-normal leading-[normal] min-w-px not-italic relative text-[16px] text-black">T-shirt, shorts, sandals, and a hat. Today is not the day for denim.</p>
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

function Frame13() {
  return (
    <div className="relative shrink-0 size-[44px]">
      <svg className="absolute block inset-0 size-full" fill="none" height="44" preserveAspectRatio="none" viewBox="0 0 44 44" width="44">
        <g id="Frame 93">
          <rect fill="#F0ECE4" height="44" rx="22" width="44" />
          <path d={svgPaths.p1271ba00} fill="#5B7FC7" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group() {
  return (
    <div className="h-[29px] relative shrink-0 w-[17.06px]" data-name="Group">
      <svg className="absolute block inset-0 size-full" fill="none" height="29" preserveAspectRatio="none" viewBox="0 0 17.0601 29" width="17.0601">
        <g id="Group">
          <path clipRule="evenodd" d={svgPaths.p2b951680} fill="#5B7FC7" fillRule="evenodd" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame12() {
  return (
    <div className="bg-[#f0ece4] content-stretch flex items-center justify-center p-[8px] relative rounded-[22px] shrink-0 size-[44px]">
      <Group />
    </div>
  );
}

function Component000102Ff() {
  return (
    <div className="h-[10.706px] relative shrink-0 w-[28px]" data-name="#000102ff">
      <svg className="absolute block inset-0 size-full" fill="none" height="10.7061" preserveAspectRatio="none" viewBox="0 0 27.9998 10.7061" width="27.9998">
        <g id="#000102ff">
          <path d={svgPaths.p2f13c100} fill="#5B7FC7" id="Vector" />
          <path d={svgPaths.pf412200} fill="#5B7FC7" id="Vector_2" />
          <path d={svgPaths.p2f0d48b0} fill="#5B7FC7" id="Vector_3" />
          <path d={svgPaths.p2305ee80} fill="#5B7FC7" id="Vector_4" />
        </g>
      </svg>
    </div>
  );
}

function Frame11() {
  return (
    <div className="bg-[#f0ece4] content-stretch flex items-center justify-center p-[8px] relative rounded-[22px] shrink-0 size-[44px]">
      <Component000102Ff />
    </div>
  );
}

function IconFrame1() {
  return (
    <div className="content-stretch flex gap-[12px] items-center relative shrink-0 w-full" data-name="Icon Frame">
      <div className="relative shrink-0" data-name="Sun Screen">
        <div className="flex flex-col items-center size-full">
          <div className="content-stretch flex flex-col items-center relative size-full">
            <Frame13 />
          </div>
        </div>
      </div>
      <div className="relative shrink-0" data-name="Water Bottle">
        <div className="flex flex-col items-center size-full">
          <div className="content-stretch flex flex-col items-center relative size-full">
            <Frame12 />
          </div>
        </div>
      </div>
      <div className="relative shrink-0" data-name="Shades">
        <div className="flex flex-col items-center size-full">
          <div className="content-stretch flex flex-col items-center relative size-full">
            <Frame11 />
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame7() {
  return (
    <div className="content-stretch flex gap-[34px] items-start relative shrink-0 w-full">
      <div className="bg-white relative rounded-[22px] shrink-0 w-[246px]" data-name="Frame Background Cell">
        <div className="overflow-clip rounded-[inherit] size-full">
          <div className="content-stretch flex flex-col items-start px-[16px] py-[8px] relative size-full">
            <IconFrame1 />
          </div>
        </div>
      </div>
      <p className="[word-break:break-word] flex-[1_0_0] font-['Inter:Regular',sans-serif] font-normal leading-[normal] min-w-px not-italic relative text-[16px] text-black">Water and sunscreen. UV is at 9, which burns unprotected skin in under fifteen minutes.</p>
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
  return (
    <div className="content-stretch flex items-end justify-between relative shrink-0 w-full">
      <Frame8 />
      <ConfidenceCard className="relative shrink-0" />
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col h-full items-end justify-between min-w-px relative">
      <Frame9 />
      <Frame3 />
    </div>
  );
}

function SuggestionPrompt() {
  return (
    <div className="content-stretch flex gap-[20px] items-start justify-center relative shrink-0 w-[1053px]" data-name="Suggestion Prompt">
      <button className="bg-[#4a69a9] cursor-pointer flex-[1_0_32px] min-w-px relative rounded-[22px] shadow-[0px_1px_4px_1px_rgba(28,42,68,0.2)]" data-name="Prompt Suggestion">
        <div className="overflow-clip rounded-[inherit] size-full">
          <div className="content-stretch flex items-start px-[16px] py-[24px] relative size-full">
            <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[16px] text-left text-white whitespace-nowrap">What if I am out all day?</p>
          </div>
        </div>
      </button>
      <div className="bg-[#4a69a9] flex-[1_0_32px] min-w-px relative rounded-[22px] shadow-[0px_1px_4px_1px_rgba(28,42,68,0.2)]" data-name="Prompt Suggestion">
        <div className="overflow-clip rounded-[inherit] size-full">
          <div className="content-stretch flex items-start px-[16px] py-[24px] relative size-full">
            <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[16px] text-white whitespace-nowrap">Should I pack an umbrella today?</p>
          </div>
        </div>
      </div>
      <PromptSuggestion className="bg-[#4a69a9] flex-[1_0_32px] min-w-px relative rounded-[22px] shadow-[0px_1px_4px_1px_rgba(28,42,68,0.2)]" promptText="Why not shorts?" />
    </div>
  );
}

function ChatWindow() {
  return (
    <div className="bg-[#f0ece4] content-stretch flex flex-[1_0_0] flex-col items-center justify-between min-h-px overflow-clip px-[16px] py-[24px] relative rounded-[42px] w-full" data-name="Chat Window">
      <SuggestionPrompt />
      <div className="bg-[#faf8f4] min-h-[86px] relative rounded-[22px] shrink-0 w-[1053px]" data-name="Chat Box">
        <div className="min-h-[inherit] overflow-clip rounded-[inherit] size-full">
          <div className="content-stretch flex items-start min-h-[inherit] p-[16px] relative size-full">
            <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[normal] min-h-[54px] not-italic relative self-stretch shrink-0 text-[#2e2a26] text-[16px] w-[1021px]">Ask about today</p>
          </div>
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
                <div className="h-full max-w-[506px] relative rounded-[22px] shrink-0 w-[317px]" data-name="Weather Visual Display">
                  <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[22px] size-full" src={imgWeatherVisualDisplay} />
                  <div className="flex flex-row items-end max-w-[inherit] overflow-clip rounded-[inherit] size-full">
                    <div className="content-stretch flex items-end justify-between max-w-[inherit] px-[25px] py-[19px] relative size-full">
                      <WeatherMessageBox />
                    </div>
                  </div>
                </div>
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