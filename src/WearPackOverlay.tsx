import React from "react";
import { DayBrief } from "./lib/types";
import WeatherIconItem from "./components/WeatherIconItem";

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

const CONTAINER_W = 900;
const CARD_W = 700;

function Card({ title, icons, description, images, ctaLabel, onCta }: CardProps) {
  return (
    <div
      className="flex flex-col gap-[24px] pt-[40px] pb-[36px] px-[48px] shrink-0"
      style={{ width: CARD_W }}
    >
      {icons}
      <h2
        className="not-italic leading-tight text-[#2e2a26] m-0"
        style={{ fontFamily: "'Source Serif 4', serif", fontSize: 40, fontWeight: 600 }}
      >
        {title}
      </h2>
      <p
        className="text-[#6b655b] text-[16px] leading-relaxed m-0"
        style={{ fontFamily: "Inter, sans-serif", maxWidth: 560 }}
      >
        {description}
      </p>
      <div className="flex gap-[12px]">
        {images.map((src, i) => (
          <img
            key={i}
            src={src}
            alt=""
            className="object-cover rounded-[12px] border border-[#e4dfd6]"
            style={{ width: 160, height: 160 }}
          />
        ))}
      </div>
      <button
        onClick={onCta}
        className="underline text-[#2e2a26] text-[16px] text-center cursor-pointer bg-transparent border-none w-full py-0"
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
    <div className="flex gap-[10px] items-center">
      {brief.wear.icons.map((id) => (
        <WeatherIconItem key={id} id={id} />
      ))}
    </div>
  );

  const packIconsNode = (
    <div className="flex gap-[10px] items-center">
      {brief.pack.icons.map((id) => (
        <WeatherIconItem key={id} id={id} />
      ))}
    </div>
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-[28px] shadow-[0px_8px_40px_rgba(28,42,68,0.18)] overflow-hidden overlay-card"
        style={{ width: CONTAINER_W, maxHeight: "85vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 3-slot track: [wear, pack, wear] so peek always shows the other card */}
        <div
          className="flex"
          style={{
            width: CARD_W * 3,
            transform: `translateX(${atPack ? -CARD_W : 0}px)`,
            transition: "transform 600ms cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <Card
            title="What to wear today."
            icons={wearIconsNode}
            description={brief.wear.description}
            images={WEAR_IMAGES}
            ctaLabel="See what to pack."
            onCta={() => onSwitch("pack")}
          />
          <Card
            title="What to pack today."
            icons={packIconsNode}
            description={brief.pack.description}
            images={PACK_IMAGES}
            ctaLabel="See what to wear."
            onCta={() => onSwitch("wear")}
          />
          <Card
            title="What to wear today."
            icons={wearIconsNode}
            description={brief.wear.description}
            images={WEAR_IMAGES}
            ctaLabel="See what to pack."
            onCta={() => onSwitch("pack")}
          />
        </div>

        {/* Right-edge gradient fading the peeking card */}
        <div
          className="pointer-events-none absolute top-0 right-0 h-full w-[220px]"
          style={{
            background: "linear-gradient(to left, rgba(255,255,255,1) 30%, rgba(255,255,255,0))",
          }}
        />
      </div>
    </div>
  );
}
