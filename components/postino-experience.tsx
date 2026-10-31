"use client";

import { Sparkles } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef } from "react";

const faces = [
  {
    image: "/images/postino/surprised.webp",
    name: "شگفت‌زده",
    x: -360,
    y: -230,
    r: -22,
  },
  {
    image: "/images/postino/neutral.webp",
    name: "بی‌تفاوت",
    x: 320,
    y: -280,
    r: 25,
  },
  { image: "/images/postino/like.webp", name: "آفرین", x: -430, y: 100, r: 15 },
  {
    image: "/images/postino/thinking.webp",
    name: "متفکر",
    x: 360,
    y: 180,
    r: -17,
  },
  { image: "/images/postino/serious.webp", name: "جدی", x: 0, y: -340, r: 19 },
  { image: "/images/postino/tired.webp", name: "خسته", x: -90, y: 280, r: -25 },
];

export function PostinoExperience({ compact = false }: { compact?: boolean }) {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = root.current;
    if (
      !element ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    let cancelled = false;
    let dispose: (() => void) | undefined;

    void (async () => {
      try {
        const [{ gsap }, { ScrollTrigger }] = await Promise.all([
          import("gsap"),
          import("gsap/ScrollTrigger"),
        ]);
        if (cancelled) return;
        gsap.registerPlugin(ScrollTrigger);
        const ctx = gsap.context(() => {
          const items = gsap.utils.toArray<HTMLElement>(
            ".postino-face:not(.postino-happy)",
          );
          const isMobile = window.matchMedia("(max-width: 720px)").matches;
          gsap.set(items, {
            x: (i: number) => faces[i].x * (isMobile ? 0.46 : 1),
            y: (i: number) => faces[i].y * (isMobile ? 0.48 : 1),
            rotation: (i: number) => faces[i].r,
            scale: 0.38,
            opacity: 0,
          });
          gsap.set(".postino-happy", { scale: 0.32, opacity: 0, rotate: -14 });
          gsap.set(".postino-message", { opacity: 0, y: 60 });
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: element,
              start: "top 82%",
              end: compact ? "+=125%" : "+=175%",
              scrub: 0.85,
              invalidateOnRefresh: true,
            },
          });
          tl.to(
            items,
            {
              x: 0,
              y: 0,
              rotation: 0,
              scale: 0.83,
              opacity: 1,
              stagger: 0.045,
              duration: 0.36,
              ease: "back.out(1.2)",
            },
            0,
          )
            .to(
              ".postino-happy",
              {
                opacity: 1,
                scale: 1,
                rotation: 0,
                duration: 0.35,
                ease: "back.out(1.1)",
              },
              0.12,
            )
            .to(
              items,
              {
                x: (i: number) => faces[i].x * (isMobile ? 0.58 : 1.2),
                y: (i: number) => faces[i].y * (isMobile ? 0.6 : 1.1) - 170,
                rotation: (i: number) => -faces[i].r,
                scale: 0.22,
                opacity: 0,
                stagger: 0.035,
                duration: 0.48,
              },
              0.39,
            )
            .to(
              ".postino-happy",
              {
                scale: isMobile ? 1.4 : 1.68,
                y: isMobile ? -10 : -20,
                duration: 0.43,
                ease: "power2.inOut",
              },
              0.54,
            )
            .to(".postino-message", { opacity: 1, y: 0, duration: 0.33 }, 0.68);
        }, element);
        dispose = () => ctx.revert();
      } catch (error) {
        console.warn("Postino animation is unavailable", error);
      }
    })();
    return () => {
      cancelled = true;
      dispose?.();
    };
  }, [compact]);

  return (
    <section
      className={`postino-experience ${compact ? "postino-compact" : ""}`}
      ref={root}
      aria-label="گرینو، تجربه آینده نوجوانان"
    >
      <div className="postino-stage">
        <div className="postino-copy">
          <span className="postino-kicker">
            <Sparkles size={17} /> تجربه‌ای تازه برای نسل تازه
          </span>
          <h2>
            سلام، من <em>گرینو</em> هستم!
          </h2>
          <p>کلی ایده و ماجراجویی برای یادگرفتن درباره پول و پس‌انداز داریم</p>
        </div>
        <div
          className="postino-characters"
          aria-label="چهره‌های مختلف شخصیت گرینو"
        >
          {faces.map((face, index) => (
            <img
              key={face.name}
              className={`postino-face postino-face-${index + 1}`}
              src={face.image}
              alt={face.name}
              width="160"
              height="160"
              loading="lazy"
            />
          ))}
          <img
            className="postino-face postino-happy"
            src="/images/postino/laugh.webp"
            alt="چهره خندان گرینو"
            width="260"
            height="260"
            loading="lazy"
          />
        </div>
        <div className="postino-message">
          <span>یه خبر هیجان‌انگیز!</span>
          <h3>دنیای گرینو به‌زودی از راه می‌رسه</h3>
          <p>
            فضایی برای کشف، یادگیری و ساختن عادت‌های خوب مالی، همراه با خانواده.
          </p>
          <Link href="/young" className="button button-primary">
            آشنایی با گرینو{" "}
          </Link>
        </div>
      </div>
    </section>
  );
}
