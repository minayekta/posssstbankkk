import { NextResponse } from "next/server";
import { getFallbackMarketData } from "@/lib/market-data";

function extractGoldPrice(raw: unknown): number | null {
  if (!raw) return null;
  if (Array.isArray(raw)) {
    for (const item of raw) {
      if (typeof item === "number" && item > 1000) return item;
      if (Array.isArray(item) && typeof item[1] === "number") return item[1];
      if (item && typeof item === "object" && "gold" in item) {
        const value = Number((item as { gold?: unknown }).gold);
        if (Number.isFinite(value) && value > 1000) return value;
      }
    }
  }
  if (typeof raw === "object" && raw !== null && "gold" in raw) {
    const value = Number((raw as { gold?: unknown }).gold);
    if (Number.isFinite(value) && value > 1000) return value;
  }
  return null;
}

export async function GET() {
  const fallback = getFallbackMarketData();
  let usd = fallback.market.usd;
  let euro = fallback.market.euro;
  let ounce = fallback.market.ounce;
  let marketSource: "live" | "fallback" = "fallback";

  const [fxResult, goldResult] = await Promise.allSettled([
    fetch("https://open.er-api.com/v6/latest/USD", {
      cache: "no-store",
      headers: { accept: "application/json" },
    }),
    fetch("https://api.metals.live/v1/spot", {
      cache: "no-store",
      headers: { accept: "application/json" },
    }),
  ]);

  if (fxResult.status === "fulfilled" && fxResult.value.ok) {
    try {
      const fx = await fxResult.value.json();
      const nextUsd = Number(fx?.rates?.IRR);
      const nextEuro = Number(fx?.rates?.IRR) / Math.max(Number(fx?.rates?.EUR) || 0.92, 0.0001);
      if (Number.isFinite(nextUsd) && nextUsd >= 100000 && nextUsd <= 1000000) {
        usd = Math.round(nextUsd);
        marketSource = "live";
      }
      if (Number.isFinite(nextEuro) && nextEuro >= 100000 && nextEuro <= 1200000) {
        euro = Math.round(nextEuro);
      }
    } catch {}
  }

  if (goldResult.status === "fulfilled" && goldResult.value.ok) {
    try {
      const goldPayload = await goldResult.value.json();
      const liveGold = extractGoldPrice(goldPayload);
      if (liveGold && Number.isFinite(liveGold) && liveGold > 1000 && liveGold < 10000) {
        ounce = liveGold;
        marketSource = "live";
      }
    } catch {}
  }

  const gold18 = Math.round((((ounce * usd) / 31.1035) * 0.75) / 10) * 10;

  return NextResponse.json({
    market: {
      usd,
      euro,
      gold18,
      ounce,
      updatedAt: new Date().toISOString(),
      source: marketSource,
    },
    stock: fallback.stock,
  });
}
