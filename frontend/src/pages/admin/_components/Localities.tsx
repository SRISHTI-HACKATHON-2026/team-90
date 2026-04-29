import { useState } from "react";
import { MapPin, Home, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils.ts";

const GLASS_CARD = {
  background: "rgba(30,41,59,0.5)",
  backdropFilter: "blur(12px)",
  border: "1px solid rgba(255,255,255,0.08)",
} as const;

type House = { id: string; active: boolean };

type Locality = {
  name: string;
  houses: number;
};

const LOCALITIES: Locality[] = [
  { name: "Cluster A", houses: 12 },
  { name: "Cluster B", houses: 8 },
  { name: "Cluster C", houses: 15 },
  { name: "Cluster D", houses: 10 },
  { name: "Cluster E", houses: 14 },
  { name: "Cluster F", houses: 9 },
  { name: "Cluster G", houses: 11 },
  { name: "Cluster H", houses: 13 },
];

// Deterministically generate houses with some active, some inactive
function generateHouses(count: number, seed: number): House[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `H${i + 1}`,
    active: ((seed + i * 3) % 5) !== 0,
  }));
}

const LOCALITY_HOUSES: Record<string, House[]> = {
  "Cluster A": generateHouses(12, 1),
  "Cluster B": generateHouses(8, 7),
  "Cluster C": generateHouses(15, 4),
  "Cluster D": generateHouses(10, 2),
  "Cluster E": generateHouses(14, 5),
  "Cluster F": generateHouses(9, 3),
  "Cluster G": generateHouses(11, 6),
  "Cluster H": generateHouses(13, 8),
};

export function Localities() {
  const [expanded, setExpanded] = useState<string | null>(null);

  const toggle = (name: string) => {
    setExpanded((prev) => (prev === name ? null : name));
  };

  return (
    <section className="space-y-4">
      {/* Header */}
      <div
        className="rounded-xl p-4 flex items-center justify-between"
        style={GLASS_CARD}
      >
        <div className="flex items-center gap-3">
          <div
            className="flex items-center justify-center w-9 h-9 rounded-lg"
            style={{
              background: "rgba(16,185,129,0.15)",
              border: "1px solid rgba(16,185,129,0.4)",
              boxShadow: "0 0 12px rgba(16,185,129,0.2)",
            }}
          >
            <MapPin size={16} style={{ color: "#10B981" }} />
          </div>
          <div>
            <div
              className="text-sm font-semibold tracking-[0.2em] uppercase text-white"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Localities &amp; Households
            </div>
            <div
              className="text-[10px] tracking-widest uppercase"
              style={{
                fontFamily: "JetBrains Mono, monospace",
                color: "rgba(16,185,129,0.7)",
              }}
            >
              {LOCALITIES.length} clusters ·{" "}
              {LOCALITIES.reduce((a, l) => a + l.houses, 0)} total households
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm" style={{ background: "#10B981" }} />
            <span
              className="text-[10px] uppercase tracking-wider"
              style={{
                fontFamily: "JetBrains Mono, monospace",
                color: "rgba(255,255,255,0.4)",
              }}
            >
              Active
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <div
              className="w-3 h-3 rounded-sm"
              style={{
                background:
                  "repeating-linear-gradient(45deg, rgba(100,116,139,0.4) 0px, rgba(100,116,139,0.4) 2px, transparent 2px, transparent 6px)",
                border: "1px solid rgba(100,116,139,0.3)",
              }}
            />
            <span
              className="text-[10px] uppercase tracking-wider"
              style={{
                fontFamily: "JetBrains Mono, monospace",
                color: "rgba(255,255,255,0.4)",
              }}
            >
              Inactive
            </span>
          </div>
        </div>
      </div>

      {/* Locality Cards Grid */}
      <div className="grid grid-cols-3 gap-3">
        {LOCALITIES.map((locality) => {
          const houses = LOCALITY_HOUSES[locality.name];
          const activeCount = houses.filter((h) => h.active).length;
          const isOpen = expanded === locality.name;

          return (
            <div key={locality.name} className="space-y-2">
              <button
                onClick={() => toggle(locality.name)}
                className={cn(
                  "w-full text-left rounded-xl p-4 transition-all cursor-pointer",
                  isOpen
                    ? "border border-emerald-400/40"
                    : "border border-white/[0.08] hover:border-white/20"
                )}
                style={{
                  background: isOpen
                    ? "rgba(16,185,129,0.08)"
                    : "rgba(30,41,59,0.5)",
                  backdropFilter: "blur(12px)",
                  boxShadow: isOpen
                    ? "0 0 20px rgba(16,185,129,0.1)"
                    : "none",
                }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div
                    className="flex items-center justify-center w-8 h-8 rounded-lg"
                    style={{
                      background: isOpen
                        ? "rgba(16,185,129,0.2)"
                        : "rgba(255,255,255,0.05)",
                      border: isOpen
                        ? "1px solid rgba(16,185,129,0.4)"
                        : "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    <MapPin
                      size={14}
                      style={{
                        color: isOpen
                          ? "#10B981"
                          : "rgba(255,255,255,0.4)",
                      }}
                    />
                  </div>
                  {isOpen ? (
                    <ChevronUp size={14} style={{ color: "#10B981" }} />
                  ) : (
                    <ChevronDown
                      size={14}
                      style={{ color: "rgba(255,255,255,0.3)" }}
                    />
                  )}
                </div>

                <div
                  className="text-sm font-semibold uppercase tracking-[0.15em] mb-1"
                  style={{
                    fontFamily: "Inter, sans-serif",
                    color: isOpen
                      ? "#10B981"
                      : "rgba(255,255,255,0.85)",
                  }}
                >
                  {locality.name}
                </div>

                <div className="flex items-center gap-1.5 mb-3">
                  <Home size={10} style={{ color: "rgba(255,255,255,0.3)" }} />
                  <span
                    className="text-[11px]"
                    style={{
                      fontFamily: "JetBrains Mono, monospace",
                      color: "rgba(255,255,255,0.45)",
                    }}
                  >
                    {locality.houses} houses
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span
                      className="text-[9px] uppercase tracking-widest"
                      style={{
                        fontFamily: "JetBrains Mono, monospace",
                        color: "rgba(255,255,255,0.3)",
                      }}
                    >
                      Active
                    </span>
                    <span
                      className="text-[9px] tabular-nums"
                      style={{
                        fontFamily: "JetBrains Mono, monospace",
                        color: "#10B981",
                      }}
                    >
                      {activeCount}/{locality.houses}
                    </span>
                  </div>
                  <div
                    className="h-1.5 rounded-full"
                    style={{ background: "rgba(255,255,255,0.06)" }}
                  >
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${
                          (activeCount / locality.houses) * 100
                        }%`,
                        background:
                          "linear-gradient(90deg, #10B981, #34d399)",
                        boxShadow:
                          "0 0 6px rgba(16,185,129,0.5)",
                      }}
                    />
                  </div>
                </div>
              </button>

              {isOpen && (
                <div
                  className="rounded-xl p-4"
                  style={{
                    background: "rgba(2,6,23,0.8)",
                    border: "1px solid rgba(16,185,129,0.2)",
                    backdropFilter: "blur(12px)",
                  }}
                >
                  <div
                    className="text-[9px] uppercase tracking-widest mb-3"
                    style={{
                      fontFamily: "Inter, sans-serif",
                      color: "rgba(255,255,255,0.3)",
                    }}
                  >
                    Household Status
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {houses.map((house) => (
                      <div
                        key={house.id}
                        className="flex flex-col items-center gap-1"
                      >
                        <div
                          className="w-8 h-8 rounded-md flex items-center justify-center"
                          style={
                            house.active
                              ? {
                                  background:
                                    "rgba(16,185,129,0.2)",
                                  border:
                                    "1px solid rgba(16,185,129,0.5)",
                                  boxShadow:
                                    "0 0 8px rgba(16,185,129,0.25)",
                                }
                              : {
                                  background:
                                    "repeating-linear-gradient(45deg, rgba(100,116,139,0.15) 0px, rgba(100,116,139,0.15) 2px, transparent 2px, transparent 6px)",
                                  border:
                                    "1px solid rgba(100,116,139,0.25)",
                                }
                          }
                        >
                          <Home
                            size={12}
                            style={{
                              color: house.active
                                ? "#10B981"
                                : "rgba(100,116,139,0.5)",
                            }}
                          />
                        </div>

                        <span
                          className="text-[8px] tabular-nums"
                          style={{
                            fontFamily:
                              "JetBrains Mono, monospace",
                            color: house.active
                              ? "rgba(16,185,129,0.7)"
                              : "rgba(100,116,139,0.5)",
                          }}
                        >
                          {house.id}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}