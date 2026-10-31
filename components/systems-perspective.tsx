"use client";

import { ContentIcon } from "@/components/icons";
import { services } from "@/lib/content";
import Link from "next/link";
import { useEffect, useRef } from "react";

export function SystemsPerspective() {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    if (
      !ref.current ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    let dead = false;
    let cleanup: (() => void) | undefined;
    (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (dead || !ref.current) return;
      gsap.registerPlugin(ScrollTrigger);
      const ctx = gsap.context(() => {
        const elements = gsap.utils.toArray<HTMLElement>(
          ".spatial-service-card",
        );
        const desktop = window.matchMedia("(min-width: 801px)").matches;
        const positions = [
          [-280, -120, -18],
          [210, -85, 13],
          [-190, 112, 12],
          [230, 122, -14],
          [0, 180, -10],
        ];
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: ref.current,
            start: "top 96%",
            end: "top 38%",
            scrub: 0.65,
            invalidateOnRefresh: true,
          },
        });
        elements.forEach((el, index) => {
          const [x, y, rotation] = positions[index] ?? [0, 90, 0];
          timeline.fromTo(
            el,
            {
              x: desktop ? x : x * 0.22,
              y: desktop ? y : y * 0.28,
              rotation: desktop ? rotation : rotation * 0.35,
              scale: 0.72,
              opacity: 0.18,
            },
            {
              x: 0,
              y: 0,
              rotation: 0,
              scale: 1,
              opacity: 1,
              ease: "power2.out",
              duration: 1,
            },
            0,
          );
        });
      }, ref);
      cleanup = () => ctx.revert();
    })().catch(console.warn);
    return () => {
      dead = true;
      cleanup?.();
    };
  }, []);

  return (
    <section
      id="services"
      className="spatial-section spatial-services-section"
      ref={ref}
      aria-label="خدمات بانکی"
    >
      <div className="container">
        <div className="spatial-heading">
          <h2>خدمات بانکی، ساده و نزدیک</h2>
        </div>
        <div className="spatial-stage">
          {services.slice(0, 5).map((item, index) => (
            <Link
              key={item.slug}
              href={`/services/${item.slug}`}
              className={`spatial-service-card spatial-color-${index}`}
            >
              <span className="spatial-icon-shell" aria-hidden="true">
                {/* <span className="spatial-orbit spatial-orbit-large" /> */}
                {/* <span className="spatial-orbit spatial-orbit-small" /> */}
                <span className="spatial-icon">
                  <ContentIcon name={item.icon} size={35} />
                </span>
              </span>
              <small>{item.category}</small>
              <strong>{item.title}</strong>
              <span className="spatial-card-description">{item.summary}</span>
            </Link>
          ))}
        </div>
        <Link href="/services" className="spatial-more mt-4">
          مشاهده همه خدمات
        </Link>
      </div>
    </section>
  );
}
