"use client";

import { useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const ease = [0.22, 1, 0.36, 1] as const;

/** Word-by-word entrance animation. Persian text is passed without reshaping the script. */
export function ScrollWordReveal({ text, className = "" }: { text: string; className?: string }) {
  const reduce = useReducedMotion();
  return <span className={`motion-word-reveal ${className}`} aria-label={text}>
    {text.split(/\s+/).map((word, index) => <span aria-hidden="true" key={`${word}-${index}`} className="motion-word-clip"><motion.span
      initial={reduce ? false : { opacity: 0.12, y: "105%", filter: "blur(7px)" }}
      whileInView={{ opacity: 1, y: "0%", filter: "blur(0px)" }} viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.75, delay: reduce ? 0 : Math.min(index * 0.065, 0.65), ease }}
    >{word}</motion.span></span>)}
  </span>;
}

/** Iris curtain opened by a click; content remains usable by keyboard and screen readers. */
export function IrisCurtain({ label, children }: { label: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  return <section className="iris-curtain-card">
    <motion.button className="iris-curtain-trigger" type="button" aria-expanded={open} onClick={() => setOpen(v => !v)} whileTap={reduce ? undefined : {scale: .985}}>
      <span>{label}</span><span aria-hidden="true">{open ? "−" : "+"}</span>
    </motion.button>
    <AnimatePresence initial={false}>{open && <motion.div className="iris-curtain-content" initial={reduce ? {opacity: 1} : {opacity:0, height:0, clipPath:"circle(0% at 50% 0%)"}} animate={{opacity:1,height:"auto",clipPath:"circle(160% at 50% 0%)"}} exit={reduce ? {opacity:0} : {opacity:0,height:0,clipPath:"circle(0% at 50% 0%)"}} transition={{duration:reduce ? 0.15 : 0.65,ease}}><div>{children}</div></motion.div>}</AnimatePresence>
  </section>;
}

/** Scroll-linked reveal clipping the section from both sides, without trapping scroll. */
export function CurtainScope({ children, className = "" }: { children: ReactNode; className?:string }) {
  const ref=useRef<HTMLDivElement>(null);const reduce=useReducedMotion();
  const {scrollYProgress}=useScroll({target:ref,offset:["start 92%","start 22%"]});
  const clip=useTransform(scrollYProgress,[0,1],["inset(0 18% round 35px)","inset(0 0% round 20px)"]);
  const opacity=useTransform(scrollYProgress,[0,1],[.55,1]);
  return <motion.div ref={ref} className={`curtain-scope ${className}`} style={reduce?undefined:{clipPath:clip,opacity}}>{children}</motion.div>;
}

/** Scroll entering item animation: quiet but clearly visible. */
export function SoftReveal({ children, className="", delay=0 }: {children:ReactNode; className?:string; delay?:number}) {
  const reduce=useReducedMotion();
  return <motion.div className={className} initial={reduce?false:{opacity:0,y:45,scale:.96}} whileInView={{opacity:1,y:0,scale:1}} viewport={{once:true,amount:.12}} transition={{duration:.78,delay,ease}}>{children}</motion.div>;
}

export function SkeletonShimmer({ label="در حال بارگذاری پیش‌نمایش" }: { label?: string }) {
  return <div className="editorial-shimmer" aria-label={label} role="img"><span className="shimmer-illustration"/><span className="shimmer-line"/><span className="shimmer-line short"/></div>;
}

/** An editorial OSS-style visual hero with organic glows and gentle entrance. */
export function OssHero({ children }: {children:ReactNode}) {
  return <motion.div className="oss-hero" initial={{opacity:0,y:35}} animate={{opacity:1,y:0}} transition={{duration:.9,ease}}><span aria-hidden="true" className="oss-hero-orbit"/>{children}</motion.div>;
}
