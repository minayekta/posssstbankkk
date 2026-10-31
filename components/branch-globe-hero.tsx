"use client";

import { useEffect, useRef } from "react";
import { MapPin, ArrowDown } from "lucide-react";

export function BranchGlobeHero() {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!root.current || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let dead = false;
    let dispose: (() => void) | undefined;
    (async () => {
      const [{gsap},{ScrollTrigger}] = await Promise.all([import('gsap'),import('gsap/ScrollTrigger')]);
      if (dead || !root.current) return;
      gsap.registerPlugin(ScrollTrigger);
      const ctx=gsap.context(()=>{
        gsap.timeline({scrollTrigger:{trigger:root.current,start:'top top',end:'+=115%',scrub:1,pin:true,anticipatePin:1}})
          .to('.branch-globe',{scale:2.25,rotate:32,xPercent:-13,opacity:.34,duration:1},0)
          .to('.globe-hero-copy',{y:-65,opacity:0,duration:.44},0)
          .to('.globe-zoom-label',{opacity:1,scale:1,duration:.4},.48)
          .to('.globe-zoom-label',{opacity:0,duration:.12},.88);
      },root);
      dispose=()=>ctx.revert();
    })().catch(console.warn);
    return ()=>{dead=true;dispose?.()};
  },[]);
  return <section className="branch-globe-scene" ref={root} aria-label="جستجوی شعب در سراسر ایران">
    <div className="branch-globe-sky" aria-hidden="true"><span className="globe-star star-one"/><span className="globe-star star-two"/><span className="globe-star star-three"/></div>
    <div className="branch-globe" aria-hidden="true"><div className="branch-globe-sphere"><div className="globe-longitudes"/><div className="globe-latitudes"/><div className="globe-continent continent-one"/><div className="globe-continent continent-two"/><div className="globe-continent continent-three"/><div className="globe-marker marker-a"/><div className="globe-marker marker-b"/><div className="globe-marker marker-c"/></div><span className="globe-orbit orbit-a"/><span className="globe-orbit orbit-b"/></div>
    <div className="globe-hero-copy"><span className="globe-kicker"><MapPin size={17}/> شبکه شعب و باجه‌ها</span><h1>هرجا باشی،<br/><em>کنار تو هستیم.</em></h1><p>شعبه، شهر یا استان موردنظرت را پیدا کن و روی نقشه ببین.</p><a className="button button-primary" href="#branch-search-area">جستجوی شعب <ArrowDown size={17}/></a></div>
    <div className="globe-zoom-label">از نقشه جهان، به نزدیک‌ترین شعبه</div>
  </section>;
}
