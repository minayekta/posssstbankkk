import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Download, ExternalLink, FileText, FolderOpen, ShieldCheck } from "lucide-react";
import { Breadcrumb, SiteShell } from "@/components/site-shell";
import { boardReports } from "@/data/transparency-reports";
import "../transparency.css";

export const metadata: Metadata = { title: "گزارش فعالیت هیئت‌مدیره به مجمع" };

export default function BoardReportsPage() {
 return <SiteShell>
  <Breadcrumb items={[{label:"شفافیت و حقوق مشتریان",href:"/transparency"},{label:"گزارش فعالیت هیئت‌مدیره"}]} />
  <main className="pb-documents container">
    <div className="pb-documents-head">
      <Link className="pb-documents-back" href="/transparency"><ArrowRight size={17}/> بازگشت به شفافیت</Link>
      <span className="pb-transparency-kicker"><FolderOpen size={16}/> آرشیو اسناد رسمی</span>
      <h1>گزارش فعالیت هیئت‌مدیره به مجمع</h1>
      <p>گزارش‌های منتشرشده برای سال‌های مختلف؛ با قابلیت مشاهده در مرورگر و دریافت مستقیم PDF از منبع رسمی بانک.</p>
      <div className="pb-documents-stat"><FileText size={18}/>{boardReports.length.toLocaleString("fa-IR")} گزارش <span/> <ShieldCheck size={18}/> لینک به وب‌سایت رسمی پست بانک ایران</div>
    </div>
    <div className="pb-documents-list">{boardReports.map((report,i)=><article key={report.year} className="pb-document-row"><div className="pb-document-icon"><FileText size={27}/><span>PDF</span></div><div className="pb-document-info"><span className="pb-document-label">گزارش سال مالی {Number(report.year).toLocaleString("fa-IR",{useGrouping:false})}</span><h2>{report.title}</h2><p>سند منتشرشده در درگاه رسمی پست بانک ایران</p></div><div className="pb-document-actions"><a href={report.url.replace(/&download=true$/, "")} target="_blank" rel="noopener noreferrer" className="pb-document-open">مشاهده <ExternalLink size={16}/></a><a href={report.url} target="_blank" rel="noopener noreferrer" className="pb-document-download" aria-label={`دریافت PDF گزارش سال ${report.year}`}>دانلود PDF <Download size={17}/></a></div></article>)}</div>
    <p className="pb-transparency-disclaimer">فایل‌ها روی وب‌سایت رسمی پست بانک قرار دارند. دکمه دانلود به فایل اصلی هدایت می‌شود؛ شروع دانلود ممکن است بسته به تنظیمات مرورگر یا پاسخ سرور متفاوت باشد. در نسخه بدون اینترنت، لازم است PDFها را در پوشه public پروژه قرار دهید و نشانی لینک‌ها را محلی کنید.</p>
  </main>
 </SiteShell>;
}
