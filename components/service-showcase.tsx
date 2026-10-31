"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowUpLeft, CheckCircle2 } from "lucide-react";
import type { Service } from "@/lib/content";
import { ContentIcon } from "./icons";

export function ServiceShowcase({ items }: { items: Service[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    const cards = Array.from(root.querySelectorAll<HTMLElement>(".service-step"));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) {
          const index = Number(visible.target.dataset.index ?? 0);
          setActiveIndex(index);
        }
      },
      {
        threshold: [0.42, 0.65, 0.9],
        rootMargin: "-18% 0px -25% 0px",
      },
    );

    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, [items.length]);

  const activeItem = items[activeIndex] ?? items[0];
  const highlights = useMemo(
    () => [
      `${activeItem.category} | مسیر پرکاربرد`,
      activeItem.cta,
      "راهنمای روشن، سریع و امن برای انجام خدمت",
    ],
    [activeItem],
  );

  return (
    <div ref={containerRef} className="services-showcase">
      <div className={`service-preview-card tone-${activeItem.tone}`}>
        <div className="service-preview-badge">
          <ContentIcon name={activeItem.icon} size={28} />
          <span>خدمت منتخب</span>
        </div>
        <div className="service-preview-copy">
          <small>{activeItem.category}</small>
          <h3>{activeItem.title}</h3>
          <p>{activeItem.description}</p>
          <ul>
            {highlights.map((item) => (
              <li key={item}>
                <CheckCircle2 size={16} />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <Link href={`/services/${activeItem.slug}`} className="button button-primary button-magnetic">
            {activeItem.cta} 
          </Link>
        </div>
        <div className="service-preview-art" aria-hidden="true">
          <span className="preview-orbit orbit-a" />
          <span className="preview-orbit orbit-b" />
          <span className="preview-chip chip-a" />
          <span className="preview-chip chip-b" />
          <span className="preview-device">
            <ContentIcon name={activeItem.icon} size={44} />
          </span>
        </div>
      </div>

      <div className="service-steps" aria-label="فهرست خدمات پرکاربرد">
        {items.map((item, index) => (
          <Link
            href={`/services/${item.slug}`}
            key={item.slug}
            data-index={index}
            className={`service-step tone-${item.tone} ${index === activeIndex ? "is-active" : ""}`}
            onMouseEnter={() => setActiveIndex(index)}
            onFocus={() => setActiveIndex(index)}
          >
            <span className="service-step-count">{String(index + 1).padStart(2, "0")}</span>
            <span className="service-step-icon">
              <ContentIcon name={item.icon} size={24} />
            </span>
            <span className="service-step-body">
              <small>{item.category}</small>
              <strong>{item.title}</strong>
              <span>{item.summary}</span>
            </span>
            <span className="service-step-arrow">
              
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
