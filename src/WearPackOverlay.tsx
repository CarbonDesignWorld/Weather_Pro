import svgPaths from "#imports/svg-7a2pt52j2y";

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

function IconCircle({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[#f0ece4] flex items-center justify-center rounded-[22px] shrink-0 size-[44px]">
      {children}
    </div>
  );
}

function WearIcons() {
  return (
    <div className="flex gap-[10px] items-center">
      <IconCircle><svg fill="none" height="28" viewBox="0 0 28 28" width="28"><path d={svgPaths.p2d822f0} fill="#5B7FC7" /></svg></IconCircle>
      <IconCircle><svg fill="none" height="28" viewBox="0 0 28 28" width="28"><path d={svgPaths.p24c7b70} fill="#5B7FC7" /></svg></IconCircle>
      <IconCircle><svg fill="none" height="28" viewBox="0 0 28 28" width="28"><path d={svgPaths.p2cafffb0} fill="#5B7FC7" /></svg></IconCircle>
      <IconCircle><svg fill="none" height="34" viewBox="0 0 34 34" width="34"><path d={svgPaths.pc1d7670} fill="#5B7FC7" /></svg></IconCircle>
    </div>
  );
}

function PackIcons() {
  return (
    <div className="flex gap-[10px] items-center">
      <IconCircle>
        <svg fill="none" height="28" viewBox="0 0 27.9998 10.7061" width="28">
          <path d={svgPaths.p2f13c100} fill="#5B7FC7" />
          <path d={svgPaths.pf412200} fill="#5B7FC7" />
          <path d={svgPaths.p2f0d48b0} fill="#5B7FC7" />
          <path d={svgPaths.p2305ee80} fill="#5B7FC7" />
        </svg>
      </IconCircle>
      <IconCircle><svg fill="none" height="29" viewBox="0 0 17.0601 29" width="17"><path clipRule="evenodd" d={svgPaths.p2b951680} fill="#5B7FC7" fillRule="evenodd" /></svg></IconCircle>
      <IconCircle><svg fill="none" height="44" viewBox="0 0 44 44" width="44"><path d={svgPaths.p1271ba00} fill="#5B7FC7" /></svg></IconCircle>
    </div>
  );
}

type CardProps = {
  title: string;
  icons: React.ReactNode;
  images: string[];
  ctaLabel: string;
  onCta: () => void;
};

// Container is 900px wide; each card slot is 700px so 200px of next card always peeks
const CONTAINER_W = 900;
const CARD_W = 700;

function Card({ title, icons, images, ctaLabel, onCta }: CardProps) {
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
      <p className="text-[#6b655b] text-[16px] leading-relaxed m-0" style={{ fontFamily: "Inter, sans-serif", maxWidth: 560 }}>
        The denim jeans are your best option. To get through a weather day that
        starts cold and end very hot, you'll want something insulating
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
  onClose: () => void;
  onSwitch: (to: OverlayType) => void;
};

export default function WearPackOverlay({ open, onClose, onSwitch }: Props) {
  if (!open) return null;

  const atPack = open === "pack";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Outer viewport: fixed width clips carousel, 200px always peeks */}
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
            icons={<WearIcons />}
            images={WEAR_IMAGES}
            ctaLabel="See what to pack."
            onCta={() => onSwitch("pack")}
          />
          <Card
            title="What to pack today."
            icons={<PackIcons />}
            images={PACK_IMAGES}
            ctaLabel="See what to wear."
            onCta={() => onSwitch("wear")}
          />
          {/* Duplicate wear at slot 3 so it peeks when pack is active */}
          <Card
            title="What to wear today."
            icons={<WearIcons />}
            images={WEAR_IMAGES}
            ctaLabel="See what to pack."
            onCta={() => onSwitch("pack")}
          />
        </div>

        {/* Right-edge gradient fading the peeking card */}
        <div
          className="pointer-events-none absolute top-0 right-0 h-full w-[220px]"
          style={{ background: "linear-gradient(to left, rgba(255,255,255,1) 30%, rgba(255,255,255,0))" }}
        />
      </div>
    </div>
  );
}
