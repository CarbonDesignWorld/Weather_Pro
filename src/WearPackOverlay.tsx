import React from "react";
import { DayBrief } from "./lib/types";
import WeatherIconItem from "./components/WeatherIconItem";
import { cleanCopyText } from "./lib/constants";

export type OverlayType = "wear" | "pack" | null;

const WEAR_IMAGES = [
  "https://images.unsplash.com/photo-1601036572102-f8cd483c9518?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
  "https://images.unsplash.com/photo-1762343945693-a681611031f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
  "https://images.unsplash.com/photo-1771012265579-eef6d075777f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
];

const PACK_IMAGES = [
  "https://images.unsplash.com/photo-1635631414456-6a9dc5051a3d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
  "https://images.unsplash.com/photo-1593695284981-7e4beef78ab4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
  "https://images.unsplash.com/photo-1616118132534-381148898bb4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
];

type CardProps = {
  title: string;
  icons: React.ReactNode;
  description: string;
  images: string[];
  ctaLabel: string;
  onCta: () => void;
};

const DESKTOP_CONTAINER_W = 900;
const DESKTOP_CARD_W = 700;

function Card({ title, icons, description, images, ctaLabel, onCta }: CardProps) {
  return (
    <div
      className="flex flex-col gap-[16px] lg:gap-[24px] pt-[24px] lg:pt-[40px] pb-[24px] lg:pb-[36px] px-[20px] lg:px-[48px] shrink-0 w-full max-w-[700px]"
    >
      {icons}
      <h2
        className="not-italic leading-tight text-[#6b655b] m-0 text-[28px] lg:text-[40px]"
        style={{ fontFamily: "'Source Serif 4', serif", fontWeight: 600 }}
      >
        {title}
      </h2>
      <p
        className="text-[#6b655b] text-[15px] lg:text-[16px] leading-relaxed m-0 max-w-[560px]"
        style={{ fontFamily: "Inter, sans-serif" }}
      >
        {cleanCopyText(description)}
      </p>
      <div className="flex gap-[8px] lg:gap-[12px] overflow-x-auto pb-1 no-scrollbar">
        {images.map((src, i) => (
          <img
            key={i}
            src={src}
            alt=""
            className={`object-cover rounded-[12px] border border-[#e4dfd6] size-[110px] lg:size-[160px] shrink-0 ${
              i >= 2 ? "hidden sm:block" : ""
            }`}
          />
        ))}
      </div>
      <button
        onClick={onCta}
        className="underline text-[#6b655b] text-[15px] lg:text-[16px] text-center cursor-pointer bg-transparent border-none w-full py-1"
        style={{ fontFamily: "'Source Serif 4', serif" }}
      >
        {ctaLabel}
      </button>
    </div>
  );
}

type Props = {
  open: OverlayType;
  brief: DayBrief | null;
  onClose: () => void;
  onSwitch: (to: OverlayType) => void;
};

export default function WearPackOverlay({ open, brief, onClose, onSwitch }: Props) {
  if (!open || !brief) return null;

  const atPack = open === "pack";

  const wearIconsNode = (
    <div className="flex gap-[8px] lg:gap-[10px] items-center">
      {brief.wear.icons.map((id) => (
        <WeatherIconItem key={id} id={id} />
      ))}
    </div>
  );

  const packIconsNode = (
    <div className="flex gap-[8px] lg:gap-[10px] items-center">
      {brief.pack.icons.map((id) => (
        <WeatherIconItem key={id} id={id} />
      ))}
    </div>
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-xs p-[16px]"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-[24px] lg:rounded-[28px] shadow-[0px_8px_40px_rgba(28,42,68,0.18)] overflow-hidden overlay-card w-[85vw] max-w-[900px] max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Carousel track */}
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{
            transform: `translateX(${atPack ? -100 : 0}%)`,
          }}
        >
          <div className="w-full shrink-0">
            <Card
              title="What to wear today."
              icons={wearIconsNode}
              description={brief.wear.description}
              images={WEAR_IMAGES}
              ctaLabel="See what to pack."
              onCta={() => onSwitch("pack")}
            />
          </div>
          <div className="w-full shrink-0">
            <Card
              title="What to pack today."
              icons={packIconsNode}
              description={brief.pack.description}
              images={PACK_IMAGES}
              ctaLabel="See what to wear."
              onCta={() => onSwitch("wear")}
            />
          </div>
        </div>

        {/* Right-edge gradient fading the peeking card (hidden on mobile) */}
        <div
          className="hidden lg:block pointer-events-none absolute top-0 right-0 h-full w-[220px]"
          style={{
            background: "linear-gradient(to left, rgba(255,255,255,1) 30%, rgba(255,255,255,0))",
          }}
        />
      </div>
    </div>
  );
}
