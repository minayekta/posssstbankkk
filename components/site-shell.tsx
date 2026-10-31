import type { NewsItem, Product, Service } from "@/lib/content";
import { productDestinations } from "@/lib/official-links";
import {
  ArrowLeft,
  ChevronLeft,
  Images,
  MapPin,
  Newspaper,
} from "lucide-react";
import Link from "next/link";
import { ContentIcon } from "./icons";
import { SiteHeader } from "./site-header";

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main id="main-content">{children}</main>
      <SiteFooter />
    </>
  );
}
export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="eyebrow">
      <span className="" />
      {children}
    </span>
  );
}
export function SectionHeading({
  eyebrow,
  title,
  description,
  href,
  linkLabel,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <div className="section-heading">
      <div>
        <h2>{title}</h2>
        {description && <p>{description}</p>}
      </div>
      {href && (
        <Link href={href} className="text-link">
          {linkLabel ?? "مشاهده همه"}
          <ArrowLeft size={18} />
        </Link>
      )}
    </div>
  );
}
export function Breadcrumb({
  items,
}: {
  items: { label: string; href?: string }[];
}) {
  return (
    <nav className="breadcrumbs container" aria-label="مسیر صفحه">
      <Link href="/">خانه</Link>
      {items.map((item, i) => (
        <span key={`${item.label}-${i}`} className="breadcrumb-segment">
          <ChevronLeft size={14} />
          {item.href ? (
            <Link href={item.href}>{item.label}</Link>
          ) : (
            <span aria-current="page">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
export function PageIntro({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="page-intro container">
      {/* <Eyebrow>{eyebrow}</Eyebrow> */}
      <h1>{title}</h1>
      <p>{description}</p>
    </div>
  );
}
export function ServiceCard({
  item,
  index,
}: {
  item: Service;
  index?: number;
}) {
  return (
    <Link
      className={`service-card tone-${item.tone}`}
      href={`/services/${item.slug}`}
    >
      <span className="service-icon">
        <ContentIcon name={item.icon} />
      </span>
      <span className="service-index">
        {String((index ?? 0) + 1).padStart(2, "0")}
      </span>
      <span className="service-card-body">
        <small>{item.category}</small>
        <strong>{item.title}</strong>
        <span>{item.summary}</span>
      </span>
      {/* <span className="round-arrow"></span> */}
    </Link>
  );
}

export function ProductCard({ item, index }: { item: Product; index: number }) {
  return (
    <a
      href={productDestinations[item.slug]}
      target="_blank"
      rel="noopener noreferrer"
      className={`product-card product-${index} tone-${item.tone}`}
      aria-label={`ورود به سامانه ${item.title}`}
    >
      <div className="product-card-top">
        <span>{item.eyebrow}</span>
      </div>

      <div className="product-card-art" aria-hidden="true">
        <span className="art-glow" />
        <span className="art-orbit orbit-one" />
        <span className="art-orbit orbit-two" />

        <span className="art-device">
          <ContentIcon name={item.icon} size={42} />
        </span>
      </div>

      <div className="product-card-bottom text-center">
        <h3>{item.title}</h3>
        <p>{item.summary}</p>
      </div>
    </a>
  );
}

export function NewsCard({
  item,
  featured = false,
}: {
  item: NewsItem;
  featured?: boolean;
}) {
  return (
    <Link
      href={`/news/${item.slug}`}
      className={`news-card ${featured ? "news-card-featured" : ""}`}
    >
      <div className="news-card-image">
        <img
          src={item.image}
          alt="تصویر نمایشی برای خبر"
          loading={featured ? "eager" : "lazy"}
        />
      </div>
      <div className="news-card-content">
        <span className="news-meta">
          {item.category}
          <i />
          {item.date}
        </span>
        <h3>{item.title}</h3>
        <p>{item.summary}</p>
        <span className="news-read">
          ادامه مطلب <ArrowLeft size={17} />
        </span>
      </div>
    </Link>
  );
}
export function DemoNote() {
  return (
    <div className="demo-note">
      <span className="demo-dot" /> این صفحه با داده‌های نمونه برای بررسی طراحی
      ساخته شده است.
    </div>
  );
}

function SiteFooter() {
  const footerGroups = [
    {
      title: "خدمات پرکاربرد",
      links: [
        { label: "خرید شارژ", href: "/services/mobile-topup" },
        { label: "پرداخت قبوض", href: "/services/bill-payment" },
        { label: "پرداخت اقساط", href: "/services/installments" },
        { label: "دریافت شبا", href: "/services/sheba" },
      ],
    },
    {
      title: "دسترسی‌های سریع",
      links: [
        { label: "محصولات", href: "/products" },
        { label: "سامانه‌ها", href: "/systems" },
        { label: "اخبار و اطلاعیه‌ها", href: "/news" },
        { label: "بانکداری نوجوانان", href: "/young" },
        { label: "مزایده و مناقصه", href: "/tenders" },
      ],
    },
    {
      title: "خدمات الکترونیکی",
      links: [
        { label: "میز خدمت الکترونیکی", href: "/e-desk" },
        { label: "شفافیت", href: "/transparency" },
        { label: "مشارکت الکترونیکی", href: "/participation" },
        { label: "پشتیبانی", href: "/support" },
        { label: "نرخ ارز و بازار", href: "/market" },
      ],
    },
    {
      title: "درباره پست بانک",
      links: [
        { label: "درباره ما", href: "/about" },
        { label: "امور سهامداران", href: "/investors" },
        { label: "شعب و باجه‌ها", href: "/branches" },
        { label: "گالری تصاویر", href: "/gallery" },
        { label: "ارتباط با ما", href: "/contact" },
      ],
    },
  ];

  return (
    <footer className="site-footer" dir="rtl">
      <div className="container post-footer-layout px-20">
        {/* Four separate link columns */}
        {footerGroups.map((group) => (
          <div className="post-footer-column" key={group.title}>
            <h3>{group.title}</h3>

            <ul>
              {group.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Logo on the left */}
        <div className="post-footer-brand">
          <Link href="/" className="post-footer-brand-link">
            <img
              src="/images/postbank-logo.svg"
              alt="لوگوی پست بانک ایران"
              width={68}
              height={72}
            />
            <div className="post-footer-brand-name">
              <strong>پست بانک ایران</strong>
              <small>پیشرو در اقتصاد دیجیتال</small>
            </div>
          </Link>

          <p>ارائه خدمات بانکی نوین، در دسترس و هوشمند برای همه مردم ایران.</p>

          <div className="post-footer-shortcuts">
            <Link href="/news" aria-label="اخبار">
              <Newspaper size={18} />
            </Link>

            <Link href="/gallery" aria-label="گالری تصاویر">
              <Images size={18} />
            </Link>

            <Link href="/branches" aria-label="شعب و باجه‌ها">
              <MapPin size={18} />
            </Link>
          </div>
        </div>
      </div>

      <div className="container post-footer-contact">
        <div className="post-footer-divider" />

        <Link href="/contact" className="post-footer-contact-link">
          <strong>ارتباط با ما</strong>
          <span>برای پرسش‌ها، پیشنهادها و پشتیبانی</span>
          <ArrowLeft size={20} />
        </Link>

        <div className="post-footer-divider" />
      </div>

      {/* <div className="container post-footer-bottom">
        <span>© پست بانک ایران — تمامی حقوق محفوظ است.</span>
        <Link href="/accessibility">راهنمای دسترس‌پذیری</Link>
      </div> */}
    </footer>
  );
}
