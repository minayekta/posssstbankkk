"use client";

import {
  formatFaNumber,
  getFallbackMarketData,
  type MarketApiResponse,
} from "@/lib/market-data";
import { ArrowLeft, BadgeDollarSign, Coins, LineChart } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

function formatDate(value: string) {
  try {
    return new Intl.DateTimeFormat("fa-IR", {
      hour: "2-digit",
      minute: "2-digit",
      month: "long",
      day: "numeric",
    }).format(new Date(value));
  } catch {
    return "اکنون";
  }
}

export function SplitChartSection() {
  const root = useRef<HTMLElement>(null);
  const [data, setData] = useState<MarketApiResponse>(() =>
    getFallbackMarketData(),
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!root.current || matchMedia("(prefers-reduced-motion: reduce)").matches)
      return;
    let stopped = false;
    let cleanup: (() => void) | undefined;
    (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (stopped || !root.current) return;
      gsap.registerPlugin(ScrollTrigger);
      const ctx = gsap.context(() => {
        const mobile = matchMedia("(max-width: 800px)").matches;
        gsap
          .timeline({
            scrollTrigger: {
              trigger: root.current,
              start: "top 85%",
              end: "center 48%",
              scrub: 1,
              invalidateOnRefresh: true,
            },
          })
          .fromTo(
            ".split-chart-copy",
            { x: mobile ? 0 : 140, y: mobile ? 32 : 0, opacity: 0.4 },
            { x: 0, y: 0, opacity: 1, ease: "power2.out" },
            0,
          )
          .fromTo(
            ".split-chart-visual",
            {
              x: mobile ? 0 : -140,
              y: mobile ? 38 : 0,
              opacity: 0.4,
              rotation: mobile ? 0 : -2,
            },
            { x: 0, y: 0, opacity: 1, rotation: 0, ease: "power2.out" },
            0,
          );
      }, root);
      cleanup = () => ctx.revert();
    })().catch(console.warn);
    return () => {
      stopped = true;
      cleanup?.();
    };
  }, []);

  useEffect(() => {
    let active = true;
    fetch("/api/market", { cache: "no-store" })
      .then((res) =>
        res.ok
          ? res.json()
          : Promise.reject(new Error("market request failed")),
      )
      .then((payload: MarketApiResponse) => {
        if (active) setData(payload);
      })
      .catch(() => {
        if (active) setData(getFallbackMarketData());
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const values = data.stock.series;
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = Math.max(max - min, 1);
  const points = useMemo(
    () =>
      values
        .map((value, index) => {
          const x = 32 + index * 46.5;
          const y = 170 - ((value - min) / range) * 118;
          return `${x},${y}`;
        })
        .join(" "),
    [values, min, range],
  );
  const fill = `32,185 ${points} 543,185`;
  const sourceLabel =
    data.market.source === "live"
      ? "به‌روزرسانی خودکار از منبع برخط"
      : "نمایش داده پشتیبان در صورت نبود دسترسی";
  const stockLabel =
    data.stock.source === "mock"
      ? "نمودار نمونه برای نماد پست بانک"
      : "نمودار دریافت‌شده از منبع زنده";

  return (
    <section
      className="section investors-teaser split-chart-section"
      ref={root}
    >
      <div className="container split-chart-layout">
        <div className="split-chart-copy">
          <h2>نبض بازار، کنار روند سهام پست بانک</h2>
          <p>
            همان موشن نرم قبلی حفظ شده است؛ این بار در کنار نمودار، قیمت‌های
            شاخص بازار را هم یکجا می‌بینید. اگر منبع برخط در دسترس نباشد، داده
            پشتیبان نمایش داده می‌شود تا چیدمان صفحه به‌هم نریزد.
          </p>
          <div className="market-snapshot-grid">
            <article className="market-snapshot-card market-snapshot-green">
              <span className="market-snapshot-icon">
                <BadgeDollarSign size={20} />
              </span>
              <small>دلار آمریکا</small>
              <strong>
                {formatFaNumber(data.market.usd)} <span>ریال</span>
              </strong>
            </article>
            <article className="market-snapshot-card market-snapshot-blue">
              <span className="market-snapshot-icon">
                <LineChart size={20} />
              </span>
              <small>یورو</small>
              <strong>
                {formatFaNumber(data.market.euro)} <span>ریال</span>
              </strong>
            </article>
            <article className="market-snapshot-card market-snapshot-gold">
              <span className="market-snapshot-icon">
                <Coins size={20} />
              </span>
              <small>طلای ۱۸ عیار</small>
              <strong>
                {formatFaNumber(data.market.gold18)} <span>ریال</span>
              </strong>
            </article>
          </div>
          <div className="market-snapshot-meta">
            <span>{loading ? "در حال دریافت داده..." : sourceLabel}</span>
            <span>آخرین بروزرسانی: {formatDate(data.market.updatedAt)}</span>
          </div>
          <div className="market-snapshot-actions">
            <Link href="/market" className="text-link">
              بازار و نرخ‌ها <ArrowLeft size={18} />
            </Link>
            <Link href="/investors" className="text-link">
              صفحه سهامداران <ArrowLeft size={18} />
            </Link>
          </div>
        </div>
        <div className="split-chart-visual">
          <div className="market-chart-card sample-chart sample-chart-compact">
            <div className="sample-chart-head">
              <span>
                روند نماد <strong>{data.stock.symbol}</strong>
              </span>
              <span className="chart-legend">
                <i /> {stockLabel}
              </span>
            </div>
            <svg
              viewBox="0 0 575 205"
              role="img"
              aria-label="نمودار روند سهام پست بانک ایران در بازه نمونه یا داده زنده"
            >
              <defs>
                <linearGradient
                  id="postbank-market-gradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#2dac74" stopOpacity=".32" />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                </linearGradient>
              </defs>
              {[40, 85, 130, 175].map((y) => (
                <line
                  className="chart-grid"
                  key={y}
                  x1="32"
                  x2="543"
                  y1={y}
                  y2={y}
                  stroke="#dce9e2"
                  strokeDasharray="4 7"
                />
              ))}
              <polygon
                className="chart-area"
                points={fill}
                fill="url(#postbank-market-gradient)"
                opacity=".8"
              />
              <polyline
                className="chart-line"
                points={points}
                fill="none"
                stroke="#0a754f"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle
                className="chart-point"
                cx="543"
                cy={170 - ((values.at(-1)! - min) / range) * 118}
                r="7"
                fill="#0a754f"
                stroke="white"
                strokeWidth="4"
              />
            </svg>
            <div className="sample-chart-axis">
              <span>{data.stock.labels[0]}</span>
              <span>{data.stock.labels.at(-1)}</span>
            </div>
            <div className="market-chart-footer">
              <div>
                <small>آخرین قیمت</small>
                <strong>{formatFaNumber(data.stock.last)} ریال</strong>
              </div>
              <div>
                <small>تغییر بازه</small>
                <strong
                  className={
                    data.stock.changePercent >= 0 ? "positive" : "negative"
                  }
                >
                  {data.stock.changePercent >= 0 ? "+" : ""}
                  {formatFaNumber(data.stock.changePercent, 2)}٪
                </strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
