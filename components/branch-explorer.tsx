"use client";

import { useMemo, useState } from "react";
import { ArrowUpLeft, LocateFixed, MapPin, Navigation, RotateCcw, Search, SlidersHorizontal } from "lucide-react";
import branchData from "@/data/branches.json";
import { BranchMap } from "./branch-map";

export type Branch = {
  id: string; name: string; type: string; province: string; city: string;
  address: string; lat: number; lng: number;
};

const allBranches: Branch[] = branchData.branches;
const normalize = (value: string) => value.replaceAll("ي", "ی").replaceAll("ك", "ک").replace(/[\u064b-\u065f]/g, "").trim().toLocaleLowerCase("fa");
const radians = (value: number) => value * Math.PI / 180;
function distanceKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const dLat = radians(b.lat - a.lat);
  const dLng = radians(b.lng - a.lng);
  const value = Math.sin(dLat / 2) ** 2 + Math.cos(radians(a.lat)) * Math.cos(radians(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(value), Math.sqrt(1 - value));
}
function neshanLink(branch: Branch) {
  const coordinates = `${branch.lat},${branch.lng}`;
  return `https://neshan.org/maps/${encodeURIComponent(`${coordinates},16.0z,0.0p`)}/routing/car/destination/${encodeURIComponent(coordinates)}`;
}

export function BranchExplorer() {
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [nearest, setNearest] = useState(false);
  const [locating, setLocating] = useState(false);
  const [locationMessage, setLocationMessage] = useState("");

  const availableCities = branchData.provinces.find(item => item.name === province)?.cities ?? [];
  const visible = useMemo(() => {
    if (nearest && position) return [...allBranches].sort((a, b) => distanceKm(position, a) - distanceKm(position, b)).slice(0, 5);
    const keyword = normalize(query);
    return allBranches.filter(branch =>
      (!province || branch.province === province) && (!city || branch.city === city) &&
      (!keyword || normalize(`${branch.name} ${branch.province} ${branch.city} ${branch.address}`).includes(keyword))
    );
  }, [province, city, query, nearest, position]);
  const selected = visible.find(branch => branch.id === selectedId) ?? null;

  function reset() { setProvince(""); setCity(""); setQuery(""); setSelectedId(""); setNearest(false); setLocationMessage(""); }
  function findNearest() {
    if (!navigator.geolocation) { setLocationMessage("موقعیت‌یابی در این مرورگر در دسترس نیست. استان و شهر را دستی انتخاب کنید."); return; }
    setLocating(true); setLocationMessage("");
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setPosition({ lat: coords.latitude, lng: coords.longitude });
        setProvince(""); setCity(""); setQuery(""); setSelectedId(""); setNearest(true);
        setLocationMessage("نزدیک‌ترین نقاط نمونه بر اساس فاصله مستقیم مرتب شدند؛ این فاصله مسیر رانندگی نیست.");
        setLocating(false);
      },
      () => { setLocationMessage("دسترسی به موقعیت انجام نشد. می‌توانید استان و شهر را دستی انتخاب کنید."); setLocating(false); },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 }
    );
  }

  return <section className="branch-section page-tone">
    <div className="container">
      <div className="branch-notice"><span className="branch-notice-icon"><MapPin size={18}/></span><p><strong>راهنمای نسخه نمایشی</strong> نام، نشانی و مختصات شعب این صفحه ساختگی یا تقریبی است. برای مراجعه حضوری از <a href="https://www.postbank.ir/" target="_blank" rel="noopener noreferrer">اطلاعات وب‌سایت رسمی بانک</a> استفاده کنید.</p></div>
      <div className="branch-toolbar">
        <div className="branch-field"><label htmlFor="branch-province">استان</label><select id="branch-province" value={province} onChange={event => { setProvince(event.target.value); setCity(""); setSelectedId(""); setNearest(false); }}><option value="">همه استان‌ها</option>{branchData.provinces.map(item => <option key={item.name} value={item.name}>{item.name}</option>)}</select></div>
        <div className="branch-field"><label htmlFor="branch-city">شهر</label><select id="branch-city" value={city} disabled={!province} onChange={event => { setCity(event.target.value); setSelectedId(""); setNearest(false); }}><option value="">{province ? "همه شهرهای این استان" : "ابتدا استان را انتخاب کنید"}</option>{availableCities.map(item => <option value={item} key={item}>{item}</option>)}</select></div>
        <div className="branch-field branch-search-field"><label htmlFor="branch-search">نام شعبه یا باجه</label><div className="branch-search-box"><Search size={18}/><input id="branch-search" type="search" value={query} onChange={event => { setQuery(event.target.value); setSelectedId(""); setNearest(false); }} placeholder="مثلاً ونک، آزادی یا مشهد"/></div></div>
        <button className="branch-near-button" onClick={findNearest} disabled={locating} type="button"><LocateFixed size={19}/>{locating ? "در حال یافتن..." : "نزدیک من"}</button>
      </div>
      {locationMessage && <p className="branch-location-message" role="status">{locationMessage}</p>}
      <div className="branch-workspace">
        <div className="branch-results">
          <div className="branch-results-head"><div><span><SlidersHorizontal size={16}/> نتیجه جستجو</span><h2>{nearest ? "نزدیک‌ترین شعب نمونه" : city ? `شعب ${city}` : province ? `شعب استان ${province}` : "شعب و باجه‌های نمونه"}</h2></div><strong>{visible.length.toLocaleString("fa-IR")} مورد</strong></div>
          <div className="branch-results-scroll" aria-live="polite">
            {visible.length ? visible.map(branch => {
              const distance = nearest && position ? distanceKm(position, branch) : null;
              return <article key={branch.id} className={`branch-card ${selected?.id === branch.id ? "is-selected" : ""}`}>
                <button className="branch-card-main" type="button" onClick={() => setSelectedId(branch.id)} aria-label={`نمایش ${branch.name} روی نقشه`}><span className="branch-card-icon"><MapPin size={21}/></span><span className="branch-card-info"><span className="branch-card-type">{branch.type} · {branch.province}</span><strong>{branch.name}</strong><small>{branch.address}</small>{distance !== null && <em>حدود {distance.toLocaleString("fa-IR", { maximumFractionDigits: 1 })} کیلومتر فاصله مستقیم</em>}</span></button>
                <div className="branch-card-actions"><button type="button" onClick={() => setSelectedId(branch.id)}>نمایش روی نقشه <MapPin size={14}/></button><a href={neshanLink(branch)} target="_blank" rel="noopener noreferrer" aria-label={`باز کردن مقصد نمونه ${branch.name} در نشان`}>مسیریابی با نشان </a></div>
              </article>;
            }) : <div className="branch-empty"><Search size={25}/><strong>موردی پیدا نشد</strong><p>نام کوتاه‌تری جستجو کنید یا استان و شهر دیگری انتخاب کنید.</p><button type="button" onClick={reset}>پاک کردن فیلترها</button></div>}
          </div>
          <div className="branch-results-bottom"><span>{branchData.provinces.length.toLocaleString("fa-IR")} استان · {allBranches.length.toLocaleString("fa-IR")} نقطه نمایشی</span><button type="button" onClick={reset}><RotateCcw size={14}/> نمایش همه</button></div>
        </div>
        <div className="branch-map-column"><div className="branch-map-top"><span><Navigation size={17}/> نمای نقشه</span><small>روی نشانگرها بزنید</small></div><BranchMap branches={visible} selected={selected} location={position} onSelect={setSelectedId}/><div className="branch-map-footer"><span>نقشه © OpenStreetMap</span><span>نقاط روی نقشه فقط برای بررسی تجربه کاربری‌اند.</span></div></div>
      </div>
    </div>
  </section>;
}
