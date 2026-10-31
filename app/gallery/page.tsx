import type { Metadata } from "next";
import { Breadcrumb, DemoNote, PageIntro, SiteShell } from "@/components/site-shell";
import { GalleryContent } from "@/components/gallery-content";

export const metadata: Metadata={title:"گالری تصاویر"};
export default function GalleryPage(){return <SiteShell><Breadcrumb items={[{label:"گالری تصاویر"}]}/><PageIntro eyebrow="روابط عمومی" title="روایت‌ها در قاب تصویر" description="تصاویر را بر اساس موضوع ببینید؛ کنار تصاویر نمونه شعب، به چند پوستر در وب‌سایت رسمی پیوند داده‌ایم."/><section className="page-section page-tone"><div className="container" style={{paddingTop:35}}><GalleryContent/><DemoNote/></div></section></SiteShell>}
