import { Breadcrumb, DemoNote, SiteShell } from "@/components/site-shell";
import { boardReports } from "@/data/transparency-reports";
import {
  ArrowUpLeft,
  BookOpen,
  ChartNoAxesColumn,
  ExternalLink,
  FileText,
  Landmark,
  Scale,
  ShieldCheck,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import "./transparency.css";

export const metadata: Metadata = { title: "شفافیت و حقوق مشتریان" };

const sections = [
  {
    title: "استانداردهای شفافیت",
    description: "دسترسی به اطلاعات عمومی و استانداردهای انتشار داده.",
    href: "https://shafaf.postbank.ir/",
    icon: ShieldCheck,
  },
  {
    title: "تعارض منافع",
    description: "مستندات و اطلاعات منتشرشده در زمینه تعارض منافع.",
    href: "https://www.postbank.ir/web/shafaf/taaroz",
    icon: Scale,
  },
  {
    title: "صیانت از مشتریان",
    description: "دسترسی به اطلاعات رسمی صیانت و حقوق مشتریان.",
    href: "https://shafaf.postbank.ir/صیانت",
    icon: ShieldCheck,
  },
  {
    title: "منشور حقوق مشتری",
    description: "حقوق و تعهدات در ارائه خدمات بانکی.",
    href: "https://www.postbank.ir/web/guest/customer-rights-charter",
    icon: BookOpen,
  },
  {
    title: "الزامات قانونی",
    description: "قوانین و الزامات منتشرشده مرتبط با بانک.",
    href: "https://postbank.ir/Legal-requirements",
    icon: Landmark,
  },
  {
    title: "آیین‌نامه‌ها و مقررات",
    description: "اسناد مقرراتی و دستورالعمل‌های منتشرشده.",
    href: "https://www.postbank.ir/web/guest/regulations",
    icon: FileText,
  },
  {
    title: "آمار و داده‌ها",
    description: "اطلاعات و شاخص‌های منتشرشده در سامانه شفافیت.",
    href: "https://shafaf.postbank.ir/",
    icon: ChartNoAxesColumn,
  },
  {
    title: "بدهکاران کلان",
    description: "دسترسی به سند منتشرشده توسط بانک.",
    href: "https://www.postbank.ir/documents/20121/42184/بدهکاران.pdf/18b80ff9-f95b-ebe9-2483-d1c8f7c3762e?t=1649579543322&download=true",
    icon: FileText,
  },
];

export default function TransparencyPage() {
  return (
    <SiteShell>
      <Breadcrumb items={[{ label: "شفافیت و حقوق مشتریان" }]} />
      {/* <PageIntro eyebrow="اسناد، گزارش‌ها و اطلاعات بانکی" title="شفافیت؛ پایه اعتماد" description="گزارش‌های رسمی، اسناد و اطلاعات منتشرشده پست بانک ایران را در یک مسیر ساده و منظم پیدا کنید." /> */}
      <main className="pb-transparency container mt-2">
        <section
          className="pb-transparency-highlight"
          aria-labelledby="board-archive-title"
        >
          <div className="pb-transparency-highlight-content">
            <span className="pb-transparency-kicker">
              <FileText size={16} /> آرشیو گزارش‌های رسمی
            </span>
            <h2 id="board-archive-title">گزارش فعالیت هیئت‌مدیره به مجمع</h2>
            <p>
              گزارش‌های سنواتی هیئت‌مدیره را به‌صورت مرتب ببینید؛ هر فایل را
              جداگانه باز کنید یا از منبع رسمی دانلود کنید.
            </p>
            <div className="pb-transparency-tags">
              <span>{boardReports.length.toLocaleString("fa-IR")} سند</span>
              <span>PDF</span>
              <span>سال‌های ۱۳۹۳ تا ۱۴۰۳</span>
            </div>
            <Link
              href="/transparency/board-reports"
              className="pb-transparency-primary"
            >
              مشاهده آرشیو گزارش‌ها <ArrowUpLeft size={18} />
            </Link>
          </div>
          <div className="pb-transparency-highlight-art" aria-hidden="true">
            <span className="pb-art-orbit" />
            <span className="pb-art-document">
              <FileText size={68} strokeWidth={1.3} />
            </span>
            <span className="pb-art-pill">
              PDF <span>↙</span>
            </span>
          </div>
        </section>
        <div className="pb-transparency-heading">
          <div>
            {/* <span>سایر بخش‌ها</span> */}
            <h2>اطلاعات و مستندات</h2>
          </div>
          <p>
            برای مشاهده اطلاعات این بخش‌ها به سامانه رسمی بانک هدایت می‌شوید.
          </p>
        </div>
        <div className="pb-transparency-grid">
          {sections.map(({ title, description, href, icon: Icon }) => (
            <a
              key={title}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="pb-transparency-card"
            >
              <span className="pb-transparency-card-icon">
                <Icon size={24} />
              </span>
              <h3>{title}</h3>
              <p>{description}</p>
              <span className="pb-transparency-card-link">
                مشاهده منبع رسمی <ExternalLink size={16} />
              </span>
            </a>
          ))}
        </div>
        <p className="pb-transparency-disclaimer">
          لینک‌های گزارش‌ها به وب‌سایت رسمی پست بانک ایران متصل‌اند. برای مشاهده
          و دریافت فایل‌ها به اینترنت یا نسخه ذخیره‌شده محلی نیاز است.
        </p>
        <DemoNote />
      </main>
    </SiteShell>
  );
}
