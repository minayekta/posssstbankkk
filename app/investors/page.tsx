import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ExternalLink, FileText, LineChart } from "lucide-react";
import { SampleChart } from "@/components/sample-chart";
import { Breadcrumb, DemoNote, PageIntro, SiteShell } from "@/components/site-shell";

export const metadata: Metadata = { title: "امور سهامداران" };
export default function InvestorsPage() { return <SiteShell>
  <Breadcrumb items={[{label:"امور سهامداران"}]}/>
  <PageIntro eyebrow="بازار و گزارش‌ها" title="امور سهامداران" description="جایگاهی مشخص برای نمودارها، گزارش‌ها و پیوندهای سهامداری. اطلاعات این دمو نمونه است و به داده بازار متصل نیست."/>
  <section className="page-section page-tone"><div className="container investor-layout">
    <div className="investor-chart-panel"><div className="investor-panel-title"><LineChart size={23}/><div><h2>نمای نمودار سهام</h2><p>پیش‌نمایش قالب نمودار؛ برای نسخه نهایی باید منبع معتبر و زمان به‌روزرسانی داده مشخص شود.</p></div></div><SampleChart/></div>
    <div className="investor-side"><div className="info-panel"><FileText color="#0a754f"/><h3>گزارش‌ها و اطلاعیه‌ها</h3><p>در نسخه نهایی، گزارش‌های منتشرشده و اسناد تأییدشده بانک در این بخش قرار می‌گیرند.</p><Link href="/news" className="text-link">مرور اطلاعیه‌ها <ArrowLeft size={16}/></Link></div><div className="info-panel"><ExternalLink color="#0a754f"/><h3>سامانه سهامداران</h3><p>جایگاه راهنمای ورود و پیوند رسمی سامانه سهامداران پس از تأیید نشانی و محتوای آن.</p></div></div>
  </div></section><div className="container"><DemoNote/></div>
</SiteShell>; }
