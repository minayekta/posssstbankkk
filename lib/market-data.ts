export type MarketApiResponse = {
  market: {
    usd: number;
    euro: number;
    gold18: number;
    ounce: number;
    updatedAt: string;
    source: "live" | "fallback";
  };
  stock: {
    symbol: string;
    name: string;
    last: number;
    changePercent: number;
    labels: string[];
    series: number[];
    updatedAt: string;
    source: "live" | "mock";
  };
};

export function getFallbackMarketData(): MarketApiResponse {
  return {
    market: {
      usd: 628500,
      euro: 684200,
      gold18: 4520000,
      ounce: 3360,
      updatedAt: new Date().toISOString(),
      source: "fallback",
    },
    stock: {
      symbol: "پست بانک",
      name: "سهام پست بانک ایران",
      last: 3145,
      changePercent: 1.84,
      labels: ["روز ۱", "روز ۲", "روز ۳", "روز ۴", "روز ۵", "روز ۶", "روز ۷", "روز ۸", "روز ۹", "روز ۱۰", "روز ۱۱", "روز ۱۲"],
      series: [2780, 2825, 2860, 2910, 2895, 2960, 2990, 3040, 3015, 3080, 3110, 3145],
      updatedAt: new Date().toISOString(),
      source: "mock",
    },
  };
}

export function formatFaNumber(value: number, maximumFractionDigits = 0) {
  return new Intl.NumberFormat("fa-IR", { maximumFractionDigits }).format(value);
}
