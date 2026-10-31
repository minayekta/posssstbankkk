import type { Metadata } from "next";
import { Breadcrumb, DemoNote, SiteShell } from "@/components/site-shell";
import { FAQAccordion } from "@/components/interaction-center";
import { ServiceDeskCatalog } from "@/components/service-desk-catalog";
import { MessagesSquare, ShieldCheck } from "lucide-react";
import Link from "next/link";
import "./service-desk.css";

export const metadata: Metadata = { title: "میز خدمت الکترونیکی | پست بانک ایران", description: "جست‌وجوی خدمات بانکی و دسترسی به شناسنامه، نظرسنجی، شکایت، راهنما و مدارک رسمی خدمات" };

export default function Page() {
  return <SiteShell>
    <div className="container"><Breadcrumb items={[{ label: "میز خدمت الکترونیکی" }]} /></div>
    <ServiceDeskCatalog />
    <section className="section desk-faq-section" id="desk-faq">
      <div className="container">
        <div className="listing-heading"><span>راهنمای مراجعه‌کنندگان</span><h2>پرسش‌های متداول</h2></div>
        <FAQAccordion />
        <div className="desk-help-links">
          <Link href="/contact"><MessagesSquare size={19}/> ارتباط با ما</Link>
          <Link href="/transparency"><ShieldCheck size={19}/> حقوق مشتریان و شفافیت</Link>
        </div>
        <p className="legacy-verify-note">لینک‌های میز خدمت از نسخه ارسالی سایت رسمی استخراج شده‌اند؛ امکان دسترسی و آخرین وضعیت هر لینک باید پیش از انتشار نهایی بررسی شود.</p>
        <DemoNote />
      </div>
    </section>
  </SiteShell>;
}
