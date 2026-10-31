"use client";

import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { useEffect, useState } from "react";

const slides = [
  {
    image: "/images/hero-branch.png",
    alt: "تصویر مفهومی از نمای شعبه بانکی مدرن",
    caption: "شعبه‌ای نزدیک‌تر به شما",
  },
  {
    image: "/images/hero-interior.webp",
    alt: "تصویر مفهومی از فضای داخلی شعبه بانک",
    caption: "تجربه‌ای ساده و خوشایند",
  },
  {
    image: "/images/news-branch.webp",
    alt: "تصویر نمایشی از فضای خدمات بانکی",
    caption: "همراه کارهای روزمره",
  },
];

export function HeroSlider() {
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(true);
  useEffect(() => {
    if (
      !playing ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const timer = window.setInterval(
      () => setActive((i) => (i + 1) % slides.length),
      5200,
    );
    return () => window.clearInterval(timer);
  }, [playing]);
  const change = (index: number) =>
    setActive((index + slides.length) % slides.length);
  return (
    <div
      className="hero-media hero-slider"
      aria-label="تصاویر شعبه و خدمات بانکی"
      aria-roledescription="اسلایدر"
    >
      {slides.map((slide, i) => (
        <img
          key={slide.image}
          src={slide.image}
          alt={slide.alt}
          className={`hero-slide ${active === i ? "is-active" : ""}`}
          aria-hidden={active !== i}
          fetchPriority={i === 0 ? "high" : "auto"}
        />
      ))}
      <div className="hero-media-overlay">
        <span>پست بانک ایران / {String(active + 1).padStart(2, "0")}</span>
        <strong>{slides[active].caption}</strong>
        <span className="hero-line" />
      </div>
      <div className="hero-slider-controls" aria-label="کنترل اسلایدر">
        <button
          type="button"
          onClick={() => change(active - 1)}
          aria-label="تصویر قبلی"
        >
          <ChevronRight size={17} />
        </button>
        <div className="hero-slider-dots">
          {slides.map((slide, i) => (
            <button
              key={slide.image}
              type="button"
              className={active === i ? "active" : ""}
              aria-label={`نمایش تصویر ${i + 1}`}
              aria-current={active === i ? "true" : undefined}
              onClick={() => change(i)}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => change(active + 1)}
          aria-label="تصویر بعدی"
        >
          <ChevronLeft size={17} />
        </button>
        <button
          type="button"
          onClick={() => setPlaying((v) => !v)}
          aria-label={playing ? "توقف پخش خودکار" : "پخش خودکار"}
        >
          {playing ? <Pause size={15} /> : <Play size={15} />}
        </button>
      </div>
    </div>
  );
}
