import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpLeft } from "lucide-react";
import { Breadcrumb, DemoNote, PageIntro, SiteShell } from "@/components/site-shell";
import { news } from "@/lib/content";

export const metadata: Metadata={title:"مزایده‌ها و مناقصه‌ها"};
export default function TendersPage(){const items=news.filter(item=>item.category==="مزایده و مناقصه");return <SiteShell><Breadcrumb items={[{label:"اخبار",href:"/news"},{label:"مزایده و مناقصه"}]}/><PageIntro eyebrow="آرشیو آگهی‌ها" title="مزایده‌ها و مناقصه‌ها" description="دسترسی مستقیم به فهرست آگهی‌ها، متن هر مورد و جایگاه اسناد مرتبط. آگهی‌های این صفحه نمایشی‌اند."/><section className="page-section page-tone"><div className="container" style={{paddingTop:36}}><div className="tender-list">{items.map(item=><Link href={`/news/${item.slug}`} className="tender-item" key={item.slug}><div><span>{item.date} / نمونه نمایشی</span><h3>{item.title}</h3><p>{item.summary}</p></div></Link>)}</div><DemoNote/></div></section></SiteShell>}
