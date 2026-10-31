import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { ContentIcon } from "@/components/icons";
import { Breadcrumb, DemoNote, Eyebrow, ProductCard, SiteShell } from "@/components/site-shell";
import { products } from "@/lib/content";
import { productDestinations } from "@/lib/official-links";

export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{const {slug}=await params;return {title:products.find(item=>item.slug===slug)?.title??"محصولات"}}
export default async function ProductDetail({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const item=products.find(item=>item.slug===slug);if(!item)notFound();return <SiteShell><Breadcrumb items={[{label:"محصولات",href:"/products"},{label:item.title}]}/><div className="container detail-top"><div><Eyebrow>{item.eyebrow}</Eyebrow><h1>{item.title}</h1><p>{item.summary}</p><a href={productDestinations[item.slug]} target="_blank" rel="noopener noreferrer" className="button button-primary">ورود به سامانه رسمی </a></div><div className="detail-illustration"><span><ContentIcon name={item.icon} size={62}/></span></div></div><div className="container detail-body" id="product-guide"><article><Eyebrow>معرفی محصول</Eyebrow><h2>دسترسی روشن‌تر به {item.title}</h2><p>{item.description}</p><p>این صفحه جایگاه معرفی، راهنمای استفاده، پرسش‌های متداول و مسیر ورود به سامانه را نشان می‌دهد. پیوند ورود به سامانه از کد صفحه اصلی وب‌سایت رسمی بانک برداشته شده است.</p><h2>دیگر محصولات</h2><div className="product-list-grid">{products.filter(other=>other.slug!==slug).slice(0,2).map((other,index)=><ProductCard item={other} index={index} key={other.slug}/>)}</div></article><aside className="detail-panel"><h3>در این بخش</h3><ul>{item.features.map(feature=><li key={feature}>{feature}</li>)}</ul><Link href="/systems" className="button button-primary">همه سامانه‌ها <ArrowLeft size={16}/></Link><small>سامانه در پنجره‌ای تازه باز می‌شود.</small></aside></div><div className="container"><DemoNote/></div></SiteShell>}
