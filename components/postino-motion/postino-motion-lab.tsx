"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import styles from "./postino-motion-lab.module.css";

const emojis = [
  {
    file: "laugh",
    title: "خوشحال",
    line: "آفرین! همین‌جوری ادامه بده!",
    action: "سکه‌های خوشحالی",
  },
  {
    file: "thinking",
    title: "متفکر",
    line: "قبل از خرید، یکم فکر کن!",
    action: "نقشه پس‌انداز",
  },
  {
    file: "surprised",
    title: "متعجب",
    line: "واو! چه کشف جالبی!",
    action: "کشف یک راز",
  },
  {
    file: "like",
    title: "آفرین",
    line: "تصمیم هوشمندانه بود!",
    action: "چالش هوشمند",
  },
  {
    file: "serious",
    title: "جدی",
    line: "وقت یه تصمیم مهمه!",
    action: "انتخاب بزرگ",
  },
  {
    file: "tired",
    title: "خسته",
    line: "گاهی یه استراحت هم لازمه!",
    action: "استراحت کوتاه",
  },
];

export function PostinoMotionLab() {
  const root = useRef<HTMLElement>(null);
  const [awakened, setAwakened] = useState<number | null>(null);
  const [confetti, setConfetti] = useState<number | null>(null);
  const [motionReady, setMotionReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let cleanup: (() => void) | undefined;
    const run = async () => {
      if (
        !root.current ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      )
        return;
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled || !root.current) return;
      gsap.registerPlugin(ScrollTrigger);
      const scope = root.current;
      const ctx = gsap.context(() => {
        const flying = Array.from(
          scope.querySelectorAll<HTMLElement>("[data-fly]"),
        );
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: scope.querySelector("[data-journey]"),
            start: "top top",
            end: "+=155%",
            pin: true,
            scrub: 0.85,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
        flying.forEach((node, i) => {
          const direction = i % 2 === 0 ? -1 : 1;
          gsap.set(node, {
            xPercent: direction * 105,
            yPercent: (i - 2) * 90,
            rotation: direction * 24,
            scale: 0.65,
          });
          timeline.to(
            node,
            {
              xPercent: ((i % 3) - 1) * 16,
              yPercent: -15 + (i % 2) * 26,
              rotation: direction * -5,
              scale: 1,
              duration: 0.5,
              ease: "power2.inOut",
            },
            0.12 + i * 0.045,
          );
          timeline.to(
            node,
            {
              xPercent: direction * -100,
              yPercent: -100 - i * 12,
              rotation: direction * -35,
              scale: 0.65,
              opacity: 0,
              duration: 0.5,
            },
            0.66 + i * 0.035,
          );
        });
        gsap.fromTo(
          scope.querySelectorAll("[data-reveal]"),
          { autoAlpha: 0, y: 80, scale: 0.92 },
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            stagger: 0.1,
            duration: 0.7,
            ease: "back.out(1.4)",
            scrollTrigger: {
              trigger: scope.querySelector("[data-cards]"),
              start: "top 77%",
            },
          },
        );
      }, scope);
      cleanup = () => ctx.revert();
      setMotionReady(true);
    };
    void run().catch((err) =>
      console.warn("Postino motion is unavailable", err),
    );
    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, []);

  function wake(index: number) {
    setAwakened(index);
    setConfetti(index);
    window.setTimeout(() => setConfetti((v) => (v === index ? null : v)), 850);
  }

  return (
    <main className={styles.page} ref={root} dir="rtl">
      <div className={styles.topbar}>
        <Link href="/young" className={styles.back}>
          ↗ بازگشت به گرینو
        </Link>
        <span>آزمایشگاه موشن ✨</span>
        <span className={styles.live}>
          {motionReady ? "موشن فعال" : "تجربه تعاملی"}
        </span>
      </div>
      <section className={styles.journey} data-journey>
        <div className={styles.gridGlow} />
        <div className={styles.heroText}>
          <div className={styles.pill}>ایده ۲ · سفر ایموجی‌ها</div>
          <h1>
            گرینوها <em>جون می‌گیرن!</em>
          </h1>
          <p>
            اسکرول کن تا ایموجی‌ها از گوشه‌های صفحه حرکت کنن، وسط جمع بشن و به
            سمت ماجراجویی بعدی پرواز کنن.
          </p>
          <span className={styles.scrollHint}>↓ برای شروع اسکرول کن</span>
        </div>
        <div className={styles.flyStage} aria-hidden="true">
          {emojis.map((emoji, i) => (
            <img
              key={emoji.file}
              data-fly
              className={`${styles.flying} ${styles[`fly${i}`]}`}
              src={`/images/postino/${emoji.file}.webp`}
              alt=""
            />
          ))}
        </div>
        <div className={styles.orbit} aria-hidden="true" />
      </section>
      <section className={styles.cardsSection} data-cards>
        <div className={styles.cardsHeader}>
          <div className={styles.pill}>ایده ۶ · ایموجی‌های بیدارشونده</div>
          <h2>
            روی کارت‌ها برو، <em>بیدارشون کن!</em>
          </h2>
          <p>
            روی دسکتاپ موس رو روی کارت ببر؛ روی موبایل کارت رو لمس کن. هر گرینو
            یک واکنش اختصاصی داره.
          </p>
        </div>
        <div className={styles.cards}>
          {emojis.map((emoji, i) => (
            <button
              data-reveal
              type="button"
              className={`${styles.card} ${styles[`tone${i}`]} ${awakened === i ? styles.awake : ""}`}
              key={emoji.file}
              onMouseEnter={() => wake(i)}
              onFocus={() => wake(i)}
              onClick={() => wake(i)}
              aria-label={`بیدار کردن گرینوی ${emoji.title}`}
            >
              <span className={styles.cardOrb} aria-hidden="true" />
              <span className={styles.sleepZ} aria-hidden="true">
                {awakened === i ? "✦" : "Z z"}
              </span>
              <img
                className={styles.cardEmoji}
                src={`/images/postino/${emoji.file}.webp`}
                alt={`گرینو ${emoji.title}`}
              />
              {confetti === i && (
                <span className={styles.sparkles} aria-hidden="true">
                  ✦ ✳ ✨ ✦
                </span>
              )}
              <span className={styles.cardTitle}>{emoji.action}</span>
              <span className={styles.cardCaption}>
                {awakened === i ? emoji.line : "برای بیدار کردن لمس کن"}
              </span>
              <span className={styles.cardArrow}>↖</span>
            </button>
          ))}
        </div>
      </section>
      <section className={styles.bottom}>
        <img src="/images/postino/laugh.webp" alt="گرینو خوشحال" />
        <div>
          <div className={styles.pill}>پایان نسخه تست</div>
          <h2>کدوم واکنش رو بیشتر دوست داشتی؟</h2>
          <p>
            این صفحه صرفاً برای تست حرکت کاراکترهاست و به صفحه اصلی نوجوانان دست
            نمی‌زنه.
          </p>
          <Link href="/young" className={styles.cta}>
            بازگشت به دنیای گرینو ←
          </Link>
        </div>
      </section>
    </main>
  );
}
