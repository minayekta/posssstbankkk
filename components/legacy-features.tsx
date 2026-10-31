import { legacyGroups } from "@/lib/legacy-catalog";
import {
  Banknote,
  CircleHelp,
  Coins,
  FileCheck2,
  Globe2,
  Handshake,
  Landmark,
  LockKeyhole,
  ShieldCheck,
  Users,
  WalletCards,
} from "lucide-react";
import Link from "next/link";
const icons = [Globe2, WalletCards, FileCheck2, ShieldCheck];
export function LegacyServicesHub({ compact = false }: { compact?: boolean }) {
  return (
    <div className={compact ? "legacy-hub legacy-hub-compact" : "legacy-hub"}>
      {legacyGroups.map((g, i) => {
        const Icon = icons[i];
        return (
          <Link
            href={`/services/category/${g.slug}`}
            className={`legacy-category legacy-${g.tone}`}
            key={g.slug}
          >
            <span className="legacy-category-symbol">
              <Icon size={compact ? 26 : 31} strokeWidth={1.7} />
            </span>
            <span className="legacy-category-count">
              {String(g.items.length).padStart(2, "0")} خدمت
            </span>
            <h3>{g.title}</h3>
            <p>{g.desc}</p>
            <span className="legacy-category-link">مرور خدمات </span>
          </Link>
        );
      })}
    </div>
  );
}
export function PortalLinks() {
  const portals = [
    {
      title: "همراه بانک",
      subtitle: "بانک همراه شما",
      href: "/products/hampa",
      icon: WalletCards,
    },
    {
      title: "اینترنت بانک",
      subtitle: "دسترسی آنلاین",
      href: "/products/internet-bank",
      icon: LockKeyhole,
    },
    {
      title: "خانه سبز",
      subtitle: "خدمات هوشمند",
      href: "/products/green-house",
      icon: Landmark,
    },
    {
      title: "میز خدمت",
      subtitle: "درخواست‌ها و راهنما",
      href: "/e-desk",
      icon: Handshake,
    },
  ];
  return (
    <div className="legacy-portal-grid">
      {portals.map((p) => (
        <Link key={p.title} href={p.href} className="legacy-portal">
          <p.icon size={24} />
          <span>
            <strong>{p.title}</strong>
            <small>{p.subtitle}</small>
          </span>
        </Link>
      ))}
    </div>
  );
}
export function InstitutionalLinks() {
  const items = [
    {
      title: "استانداردهای شفافیت",
      summary: "حقوق مشتری، تعارض منافع و اطلاع‌رسانی",
      href: "/transparency",
      icon: ShieldCheck,
    },
    {
      title: "مشارکت الکترونیکی",
      summary: "نظرسنجی و تعامل با بانک",
      href: "/participation",
      icon: Users,
    },
    {
      title: "امور سهامداران",
      summary: "اطلاعیه‌ها و اطلاعات مرتبط با سهام",
      href: "/investors",
      icon: Coins,
    },
    {
      title: "راهنما و پشتیبانی",
      summary: "پرسش، شکایت و درخواست ملاقات",
      href: "/support",
      icon: CircleHelp,
    },
  ];
  return (
    <div className="legacy-institutional text-center ">
      {items.map((item) => (
        <Link className="legacy-inst-card" href={item.href} key={item.title}>
          <span className="legacy-inst-icon mx-auto">
            <item.icon size={26} />
          </span>
          <h3>{item.title}</h3>
          <p>{item.summary}</p>
          {/* <span>مشاهده بخش </span> */}
        </Link>
      ))}
    </div>
  );
}
export function FinancePreview() {
  return (
    <section className="legacy-finance-section">
      <div className="container legacy-finance-layout">
        <div>
          <span className="legacy-mini-kicker">اطلاعات و بازار</span>
          <h2>اطلاعات مهم، با یک نگاه روشن.</h2>
          <p>
            نرخ ارز، سود سپرده و اطلاعات سهام از مسیرهای اختصاصی قابل پیگیری
            هستند. داده زنده تنها پس از اتصال به منبع معتبر نمایش داده می‌شود.
          </p>
          <div className="legacy-finance-actions">
            <Link href="/market" className="button button-primary">
              نرخ ارز و اطلاعات بازار{" "}
            </Link>
            <Link href="/investors" className="button button-outline">
              امور سهامداران{" "}
            </Link>
          </div>
        </div>
        <div className="legacy-finance-visual">
          <div className="legacy-finance-icon">
            <Banknote size={32} />
          </div>
          <div className="legacy-finance-stat">
            <span>نرخ ارز</span>
            <strong>آرشیو و راهنمای دریافت</strong>
          </div>
          <div className="legacy-finance-stat">
            <span>نرخ سود</span>
            <strong>اطلاعات و شرایط سپرده‌ها</strong>
          </div>
          <div className="legacy-finance-stat">
            <span>سهام بانک</span>
            <strong>گزارش‌ها و اطلاعیه‌ها</strong>
          </div>
          <small>این بخش عدد ساختگی یا قیمت غیرواقعی نمایش نمی‌دهد.</small>
        </div>
      </div>
    </section>
  );
}
