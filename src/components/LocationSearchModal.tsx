import React, { useState } from "react";
import { LocationInfo } from "../lib/types";
import { searchLocations, resolveUserLocation } from "../lib/weather";

interface Props {
  open: boolean;
  onClose: () => void;
  onSelect: (loc: LocationInfo) => void;
}

export default function LocationSearchModal({ open, onClose, onSelect }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<LocationInfo[]>([]);
  const [searching, setSearching] = useState(false);
  const [detecting, setDetecting] = useState(false);

  if (!open) return null;

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    setSearching(true);
    try {
      const res = await searchLocations(query.trim());
      setResults(res);
    } finally {
      setSearching(false);
    }
  }

  async function handleUseCurrentLocation() {
    setDetecting(true);
    try {
      const loc = await resolveUserLocation(true);
      onSelect(loc);
      onClose();
    } finally {
      setDetecting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="relative bg-[#faf8f4] rounded-[28px] shadow-[0px_8px_40px_rgba(28,42,68,0.2)] p-[32px] w-[500px] max-w-[90vw] border border-[#e4dfd6]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-[20px]">
          <h2
            className="text-[28px] font-semibold text-[#6b655b] m-0"
            style={{ fontFamily: "'Source Serif 4', serif" }}
          >
            Change Location
          </h2>
          <button
            onClick={onClose}
            className="text-[#6b655b] text-[16px] underline cursor-pointer bg-transparent border-none"
            style={{ fontFamily: "'Source Serif 4', serif" }}
          >
            Close
          </button>
        </div>

        {/* Quick Action: Auto-detect location via GPS / IP */}
        <button
          type="button"
          onClick={handleUseCurrentLocation}
          disabled={detecting}
          className="w-full mb-[16px] bg-white hover:bg-[#f0ece4] border border-[#e4dfd6] rounded-[16px] px-[16px] py-[12px] text-[#2e2a26] flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-2xs font-medium"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          <svg
            width="13"
            height="18"
            viewBox="0 0 13 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-[#4a69a9] flex-shrink-0"
          >
            <path
              d="M6.5 0C2.91 0 0 2.91 0 6.5C0 11.375 6.5 18 6.5 18C6.5 18 13 11.375 13 6.5C13 2.91 10.09 0 6.5 0ZM6.5 8.875C5.19 8.875 4.125 7.81 4.125 6.5C4.125 5.19 5.19 4.125 6.5 4.125C7.81 4.125 8.875 5.19 8.875 6.5C8.875 7.81 7.81 8.875 6.5 8.875Z"
              fill="currentColor"
            />
          </svg>
          <span>{detecting ? "Detecting location..." : "Use My Current Location"}</span>
        </button>

        <form onSubmit={handleSearch} className="flex gap-[12px] mb-[20px]">
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search city, state, or zip (e.g. 90210, Miami, Austin TX)"
            className="flex-1 bg-white border border-[#e4dfd6] rounded-[16px] px-[16px] py-[12px] text-[16px] text-[#2e2a26] outline-none placeholder-[#8b8478]"
            style={{ fontFamily: "Inter, sans-serif" }}
          />
          <button
            type="submit"
            disabled={searching || !query.trim()}
            className="bg-[#4a69a9] hover:bg-[#3a5384] text-white px-[20px] py-[12px] rounded-[16px] font-medium border-none cursor-pointer transition-colors disabled:opacity-50"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            {searching ? "Searching..." : "Search"}
          </button>
        </form>

        <div className="max-h-[260px] overflow-y-auto flex flex-col gap-[8px]">
          {results.length > 0 ? (
            results.map((r, i) => (
              <button
                key={i}
                onClick={() => {
                  onSelect(r);
                  onClose();
                }}
                className="w-full text-left bg-white hover:bg-[#f0ece4] p-[14px] rounded-[14px] border border-[#e4dfd6] cursor-pointer transition-colors flex justify-between items-center"
              >
                <span className="font-medium text-[#2e2a26] text-[16px]" style={{ fontFamily: "Inter, sans-serif" }}>
                  {r.city}
                </span>
                <span className="text-[#6b655b] text-[14px]" style={{ fontFamily: "Inter, sans-serif" }}>
                  {r.stateCode || r.region}{r.postalCode ? ` ${r.postalCode}` : ""}
                </span>
              </button>
            ))
          ) : query && !searching ? (
            <p className="text-[#6b655b] text-center py-4 text-[15px]" style={{ fontFamily: "Inter, sans-serif" }}>
              No locations found for &ldquo;{query}&rdquo;.
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
