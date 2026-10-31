"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { NewsCard, ServiceCard } from "./site-shell";
import type { NewsItem, Service } from "@/lib/content";

type Props = { kind: "services"; items: Service[]; categories: string[]; initialCategory?: string } | { kind: "news"; items: NewsItem[]; categories: string[]; initialCategory?: string };

export function CatalogFilter(props: Props) {
  const [category, setCategory] = useState(props.initialCategory && props.categories.includes(props.initialCategory) ? props.initialCategory : "همه");
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => props.items.filter(item => (category === "همه" || item.category === category) && `${item.title} ${item.summary} ${item.category}`.includes(query.trim())), [category,query,props.items]);
  return <><div className="filter-bar" aria-label="فیلتر محتوا">{props.categories.map(item => <button type="button" key={item} className={`filter-pill ${category===item?"active":""}`} aria-pressed={category===item} onClick={() => setCategory(item)}>{item}</button>)}<label className="catalog-search"><Search size={16}/><input value={query} onChange={event => setQuery(event.target.value)} placeholder="جستجو در این بخش" aria-label="جستجو در فهرست"/></label></div><div className={props.kind==="services"?"content-grid":"news-list-grid"}>{filtered.length ? filtered.map((item,index) => props.kind==="services" ? <ServiceCard key={item.slug} item={item as Service} index={index}/> : <NewsCard key={item.slug} item={item as NewsItem}/>) : <div className="empty-state">موردی با این عبارت پیدا نشد. دسته یا عبارت جستجو را تغییر دهید.</div>}</div></>;
}
