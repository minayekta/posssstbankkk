"use client";

import { ArrowDown, MapPin } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef } from "react";

export function CinematicHero() {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = root.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      return;
    let cancelled = false;
    let cleanup: (() => void) | undefined;
    (async () => {
      try {
        const [{ gsap }, { ScrollTrigger }] = await Promise.all([
          import("gsap"),
          import("gsap/ScrollTrigger"),
        ]);
        if (cancelled) return;
        gsap.registerPlugin(ScrollTrigger);
        const ctx = gsap.context(() => {
          const tl = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: el,
              start: "top top",
              end: () =>
                `+=${window.innerHeight * (window.innerWidth < 768 ? 0.95 : 1.15)}`,
              scrub: 0.82,
              pin: true,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          });
          tl.to(
            ".cinema-intro-copy",
            { autoAlpha: 0, yPercent: -26, duration: 0.18 },
            0,
          )
            .to(
              ".cinema-building",
              {
                scale: 1.43,
                xPercent: 3.5,
                yPercent: 1.2,
                transformOrigin: "50% 52%",
                duration: 0.56,
              },
              0,
            )
            .to(".cinema-building", { autoAlpha: 0, duration: 0.16 }, 0.48)
            .fromTo(
              ".cinema-final-slide",
              { autoAlpha: 0, scale: 1.05 },
              { autoAlpha: 1, scale: 1, duration: 0.26 },
              0.5,
            )
            .fromTo(
              ".cinema-final-content > *",
              { autoAlpha: 0, y: 32 },
              {
                autoAlpha: 1,
                y: 0,
                stagger: 0.06,
                duration: 0.18,
                ease: "power2.out",
              },
              0.6,
            )
            .to(".cinema-scroll-arrow", { autoAlpha: 0, duration: 0.1 }, 0.18);
        }, el);
        cleanup = () => ctx.revert();
      } catch (e) {
        console.warn("Optional hero animation unavailable", e);
      }
    })();
    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, []);

  return (
    <section
      className="cinema-hero cinema-hero-v6"
      ref={root}
      aria-label="پیشرو در اقتصاد دیجیتال"
    >
      <div className="cinema-building" aria-hidden="true">
        <img src="/images/cinema-hero-wide.webp" alt="" fetchPriority="high" />
        <div className="cinema-building-wash" />
      </div>
      <div className="cinema-intro-copy container">
        <h1 className="text-center">پست بانک ایران</h1>
        <h2 className="text-center">
          پیشرو در <em>اقتصاد دیجیتال</em>
        </h2>
        {/* <p>
          از ساختمان مرکزی تا باجه‌های خدمت، مسیر بانکداری پست بانک روشن‌تر و
          نزدیک‌تر شده است.
        </p> */}
      </div>
      <div className="cinema-final-slide">
        <div className="cinema-final-photo" aria-hidden="true" />
        <div className="cinema-final-shade" />
        <div className="cinema-final-content">
          <h2>
            همه خدمات بانکی،
            <br />
            <em>نزدیک‌تر از همیشه</em>
          </h2>
          <p>
            از مراجعه حضوری تا خدمات غیرحضوری، تجربه‌ای منظم و روان برای کاربر
            امروز.
          </p>
          <div className="cinema-final-actions">
            <Link href="/services" className="button button-primary">
              مشاهده خدمات
            </Link>
            <Link href="/branches" className="button button-outline">
              <MapPin size={17} /> شعب و باجه‌ها
            </Link>
            <a href="#products" className="cinema-slide-link">
              آشنایی با محصولات <ArrowDown size={16} />
            </a>
          </div>
        </div>
      </div>
      <span className="cinema-scroll-arrow" aria-hidden="true">
        <ArrowDown size={22} />
      </span>
    </section>
  );
}
