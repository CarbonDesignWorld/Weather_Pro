import React, { useState } from "react";
import { LocationInfo } from "../lib/types";
import { searchLocations } from "../lib/weather";

interface Props {
  open: boolean;
  onClose: () => void;
  onSelect: (loc: LocationInfo) => void;
}

export default function LocationSearchModal({ open, onClose, onSelect }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<LocationInfo[]>([]);
  const [searching, setSearching] = useState(false);

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
            className="text-[28px] font-semibold text-[#2e2a26] m-0"
            style={{ fontFamily: "'Source Serif 4', serif" }}
          >
            Change Location
          </h2>
          <button
            onClick={onClose}
            className="text-[#6b655b] hover:text-[#2e2a26] text-[16px] underline cursor-pointer bg-transparent border-none"
            style={{ fontFamily: "'Source Serif 4', serif" }}
          >
            Close
          </button>
        </div>

        <form onSubmit={handleSearch} className="flex gap-[12px] mb-[20px]">
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search city, e.g. London, Tokyo, Seattle"
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
                  {r.region}
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
