"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpLeft, ChevronLeft, ChevronRight, Image as ImageIcon, X } from "lucide-react";
import galleryData from "@/data/gallery-albums.json";

type Album = { id:string; title:string; category:string; date:string; cover:string; images:string[]; source?:string; note:string };
const albums = galleryData as Album[];
const categories = ["همه تصاویر", "نمایشگاه‌ها و رویدادها", "نشست‌ها و مدیران", "مناسبت‌ها و مسئولیت اجتماعی", "آرشیو تصویری"];

export function GalleryContent() {
  const [category, setCategory] = useState("همه تصاویر");
  const [album, setAlbum] = useState<Album | null>(null);
  const [index, setIndex] = useState<number | null>(null);
  const visible = useMemo(() => albums.filter(a => category === "همه تصاویر" || a.category === category), [category]);
  const featured = albums.filter(a => a.images.length > 1);
  useEffect(() => {
    if (index === null) return;
    const onKey = (event:KeyboardEvent) => {
      if (event.key === "Escape") setIndex(null);
      if (event.key === "ArrowLeft") setIndex(i => i === null || !album ? i : (i + 1) % album.images.length);
      if (event.key === "ArrowRight") setIndex(i => i === null || !album ? i : (i - 1 + album.images.length) % album.images.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index,album]);
  const current = album && index !== null ? album.images[index] : null;
  return <div className="pb-photo-gallery" dir="rtl">
    {album ? <>
      <div className="pb-gallery-breadcrumb"><button onClick={() => {setAlbum(null);setIndex(null)}} type="button">گالری تصاویر</button><ChevronLeft size={15}/><span>{album.title}</span></div>
      <div className="pb-album-hero"><div><span className="pb-gallery-overline">{album.category}</span><h2>{album.title}</h2><p>{album.note}</p><div className="pb-album-meta"><span>{album.images.length.toLocaleString("fa-IR")} تصویر موجود</span>{album.date && <span>{album.date}</span>}</div></div><img src={album.cover} alt=""/></div>
      <div className="pb-gallery-section-title"><h3>تصاویر آلبوم</h3><span>برای بزرگ‌نمایی روی تصویر کلیک کنید</span></div>
      <div className="pb-gallery-photos">{album.images.map((img,i)=><button type="button" key={`${img}-${i}`} onClick={()=>setIndex(i)} aria-label={`نمایش تصویر ${i+1} از ${album.title}`}><img src={img} alt={`${album.title}، تصویر ${i+1}`} loading="lazy"/><span><ImageIcon size={17}/> مشاهده تصویر {(i+1).toLocaleString("fa-IR")}</span></button>)}</div>
      {album.source && <a className="pb-album-source" href={album.source} target="_blank" rel="noopener noreferrer">دیدن آلبوم کامل در سایت اصلی پست بانک <ArrowUpLeft size={17}/></a>}
      <button type="button" className="pb-gallery-back" onClick={()=>setAlbum(null)}><ArrowRight size={18}/> بازگشت به گالری</button>
    </> : <>
      <div className="pb-gallery-intro"><span className="pb-gallery-overline">آرشیو تصویری پست بانک ایران</span><h2>هر تصویر، یک روایت.</h2><p>رویدادها، دیدارها و لحظه‌های ماندگار بانک را در آلبوم‌های موضوعی مرور کنید.</p></div>
      <div className="pb-gallery-featured">{featured.map((a,i)=><button type="button" className={`pb-featured-album pb-featured-${i}`} key={a.id} onClick={()=>setAlbum(a)}><img src={a.cover} alt=""/><span className="pb-featured-gradient"/><span className="pb-featured-content"><small>{a.category}</small><strong>{a.title}</strong><em>{a.images.length.toLocaleString("fa-IR")} تصویر <ArrowLeft size={18}/></em></span></button>)}</div>
      <div className="pb-gallery-section-title"><h3>مجموعه تصاویر</h3><span>{visible.length.toLocaleString("fa-IR")} آلبوم</span></div>
      <div className="pb-gallery-categories" role="group" aria-label="دسته‌بندی آلبوم‌ها">{categories.map(c=><button key={c} className={category === c ? "is-active" : ""} aria-pressed={category === c} onClick={()=>setCategory(c)} type="button">{c}<span>{(c === "همه تصاویر" ? albums.length : albums.filter(a=>a.category===c).length).toLocaleString("fa-IR")}</span></button>)}</div>
      <div className="pb-gallery-albums">{visible.map((a,i)=><button type="button" key={a.id} onClick={()=>setAlbum(a)} className={`pb-gallery-album pb-gallery-album-${i%4}`}><div className="pb-gallery-cover"><img src={a.cover} alt="" loading="lazy"/><span className="pb-gallery-cover-action"><ArrowUpLeft size={18}/></span></div><div className="pb-gallery-album-info"><small>{a.category} {a.date ? `· ${a.date}` : ""}</small><strong>{a.title}</strong><span>{a.images.length.toLocaleString("fa-IR")} تصویر در دسترس <ArrowLeft size={16}/></span></div></button>)}</div>
    </>}
    {current && album && <div className="pb-gallery-lightbox" role="presentation" onClick={()=>setIndex(null)}><div className="pb-gallery-lightbox-inner" role="dialog" aria-modal="true" aria-label={`تصاویر ${album.title}`} onClick={e=>e.stopPropagation()}><button className="pb-gallery-lightbox-close" type="button" onClick={()=>setIndex(null)} aria-label="بستن"><X size={24}/></button><img src={current} alt={`${album.title}، تصویر ${(index!+1)}`}/><div className="pb-gallery-lightbox-footer"><span>{album.title} · {(index!+1).toLocaleString("fa-IR")} از {album.images.length.toLocaleString("fa-IR")}</span><div><button onClick={()=>setIndex(i=>i === null ? null : (i-1+album.images.length)%album.images.length)} aria-label="تصویر قبلی"><ChevronRight size={22}/></button><button onClick={()=>setIndex(i=>i === null ? null : (i+1)%album.images.length)} aria-label="تصویر بعدی"><ChevronLeft size={22}/></button></div></div></div></div>}
  </div>;
}
