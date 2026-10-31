"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function MotionEnhancer() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const targets = document.querySelectorAll<HTMLElement>(
      ".section-heading, .page-intro, .service-card, .product-card, .news-card, .info-panel, .branch-card, .feature-band, .editorial-feature, .about-timeline .timeline-item, .about-resource, .about-story-heading, .gallery-category-mosaic > *, .service-step, .service-preview-card",
    );

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px 25px 0px" },
    );

    targets.forEach((target) => {
      target.classList.add("motion-item");
      observer.observe(target);
    });

    const tiltTargets = Array.from(
      document.querySelectorAll<HTMLElement>(".product-card, .shortcut, .service-step, .service-preview-card"),
    );
    const buttonTargets = Array.from(document.querySelectorAll<HTMLElement>(".button-magnetic"));

    const cleanups: Array<() => void> = [];

    tiltTargets.forEach((node) => {
      const move = (event: MouseEvent) => {
        const rect = node.getBoundingClientRect();
        const px = (event.clientX - rect.left) / rect.width;
        const py = (event.clientY - rect.top) / rect.height;
        node.style.setProperty("--pointer-x", `${px * 100}%`);
        node.style.setProperty("--pointer-y", `${py * 100}%`);
      };
      const leave = () => {
        node.style.removeProperty("--pointer-x");
        node.style.removeProperty("--pointer-y");
      };
      node.addEventListener("mousemove", move);
      node.addEventListener("mouseleave", leave);
      cleanups.push(() => {
        node.removeEventListener("mousemove", move);
        node.removeEventListener("mouseleave", leave);
      });
    });

    buttonTargets.forEach((node) => {
      const move = (event: MouseEvent) => {
        const rect = node.getBoundingClientRect();
        const x = event.clientX - rect.left - rect.width / 2;
        const y = event.clientY - rect.top - rect.height / 2;
        node.style.setProperty("--mx", `${x * 0.1}px`);
        node.style.setProperty("--my", `${y * 0.1}px`);
      };
      const leave = () => {
        node.style.setProperty("--mx", "0px");
        node.style.setProperty("--my", "0px");
      };
      node.addEventListener("mousemove", move);
      node.addEventListener("mouseleave", leave);
      cleanups.push(() => {
        node.removeEventListener("mousemove", move);
        node.removeEventListener("mouseleave", leave);
      });
    });

    return () => {
      observer.disconnect();
      cleanups.forEach((cleanup) => cleanup());
    };
  }, [pathname]);

  return null;
}
