"use client";

import services from "@/data/e-desk-services.json";
import {
  ArrowLeft,
  ArrowUpLeft,
  BookOpen,
  ChartNoAxesColumn,
  ChevronLeft,
  CircleHelp,
  CreditCard,
  ExternalLink,
  FileDown,
  FileText,
  Headset,
  Landmark,
  MessageCircleWarning,
  MessageSquareText,
  Search,
  ShieldCheck,
  Smartphone,
  Wallet,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";

type Service = (typeof services)[number];
type ActionKey = keyof Service["actions"];
const actionList = [
  { key: "identity", name: "شناسنامه خدمت", icon: FileText, kind: "document" },
  { key: "survey", name: "نظرسنجی", icon: MessageSquareText, kind: "link" },
  {
    key: "complaint",
    name: "ثبت شکایت",
    icon: MessageCircleWarning,
    kind: "link",
  },
  { key: "faq", name: "سؤالات متداول", icon: CircleHelp, kind: "document" },
  {
    key: "statistics",
    name: "آمار و اطلاعات",
    icon: ChartNoAxesColumn,
    kind: "document",
  },
  { key: "guide", name: "راهنمای دیجیتال", icon: BookOpen, kind: "link" },
  { key: "consulting", name: "مشاوره الکترونیکی", icon: Headset, kind: "link" },
  {
    key: "sla",
    name: "بیانیه سطح توافق خدمات",
    icon: ShieldCheck,
    kind: "document",
  },
] as const;
const groups = [
  "همه خدمات",
  "کارت و پرداخت",
  "حساب‌ها و انتقال وجه",
  "چک و اسناد",
  "تسهیلات و اعتبارات",
  "ارزی",
  "سرمایه‌گذاری",
  "سایر خدمات",
];
function normalize(input: string) {
  return input
    .replace(/[يی]/g, "ی")
    .replace(/[كک]/g, "ک")
    .replace(/[\u200c\u200d]/g, " ")
    .replace(/[۰-۹]/g, (n) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(n)))
    .replace(/[٠-٩]/g, (n) => String("٠١٢٣٤٥٦٧٨٩".indexOf(n)))
    .toLowerCase()
    .trim();
}
/** One coherent palette per service category; used by cards and their icons. */
function categoryTone(category: string) {
  const tones: Record<string, string> = {
    "کارت و پرداخت": "teal",
    "حساب‌ها و انتقال وجه": "blue",
    "چک و اسناد": "violet",
    "تسهیلات و اعتبارات": "amber",
    ارزی: "cyan",
    سرمایه‌گذاری: "rose",
    "سایر خدمات": "green",
  };
  return tones[category] ?? "green";
}

function ServiceIcon({ category }: { category: string }) {
  const Icon =
    category === "کارت و پرداخت"
      ? CreditCard
      : category === "تسهیلات و اعتبارات"
        ? Wallet
        : category === "حساب‌ها و انتقال وجه"
          ? Landmark
          : category === "ارزی"
            ? ArrowUpLeft
            : category === "چک و اسناد"
              ? FileText
              : category === "سرمایه‌گذاری"
                ? ChartNoAxesColumn
                : Smartphone;
  return <Icon size={24} strokeWidth={1.75} />;
}
export function ServiceDeskCatalog() {
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState("همه خدمات");
  const [active, setActive] = useState<Service | null>(null);
  const [showAll, setShowAll] = useState(false);
  const filtered = useMemo(
    () =>
      services.filter(
        (service) =>
          (group === "همه خدمات" || service.category === group) &&
          (!normalize(query) ||
            normalize(
              `${service.title} ${service.code} ${service.category}`,
            ).includes(normalize(query))),
      ),
    [query, group],
  );
  const visible = showAll || query.trim() ? filtered : filtered.slice(0, 12);
  return (
    <div className="edesk" dir="rtl">
      {/* <section className="edesk-hero">
        <div className="container edesk-hero-inner">
          <div className="edesk-hero-copy">
            <span className="edesk-eyebrow">
              <BadgeCheck size={15} /> میز خدمت الکترونیکی پست بانک ایران
            </span>
            <h1>
              خدمت موردنظرتان،
              <br />
              <em>فقط چند کلیک فاصله دارد.</em>
            </h1>
            <p>
              اطلاعات، راهنماها و مسیرهای ارتباطی خدمات بانکی را یک‌جا پیدا
              کنید. از شناسنامه هر خدمت تا نظرسنجی و ثبت شکایت.
            </p>
         
            <div className="edesk-stat">
              <span>
                <CheckCircle2 size={17} />{" "}
                {services.length.toLocaleString("fa-IR")} خدمت فهرست‌شده
              </span>
              <span>
                <ShieldCheck size={17} /> لینک‌های رسمی خدمات
              </span>
            </div>
          </div>
          <div className="edesk-art" aria-hidden="true">
            <div className="edesk-art-ring edesk-ring-a" />
            <div className="edesk-art-ring edesk-ring-b" />
            <div className="edesk-art-core">
              <Landmark size={58} strokeWidth={1.25} />
            </div>
            <span className="edesk-orbit-icon edesk-orbit-1">
              <CreditCard size={24} />
            </span>
            <span className="edesk-orbit-icon edesk-orbit-2">
              <FileText size={24} />
            </span>
            <span className="edesk-orbit-icon edesk-orbit-3">
              <Headset size={24} />
            </span>
          </div>
        </div>
      </section> */}
      <section
        className="container edesk-catalog"
        id="edesk-catalog"
        aria-label="فهرست خدمات بانکی"
      >
        <div className="edesk-section-title">
          <div>
            <h2>فهرست خدمات بانکی</h2>
            {/* <p>یک دسته را انتخاب کنید یا نام خدمت را جست‌وجو کنید.</p> */}
          </div>
          <div className="edesk-search-wrap">
            <Search size={22} aria-hidden="true" />
            <input
              type="search"
              aria-label="جست‌وجوی خدمات"
              placeholder="نام خدمت یا کد آن را جست‌وجو کنید..."
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setShowAll(false);
              }}
            />
            {query ? (
              <button
                type="button"
                aria-label="پاک کردن جست‌وجو"
                onClick={() => setQuery("")}
              >
                <X size={19} />
              </button>
            ) : (
              <span className="edesk-search-hotkey">جست‌وجوی سریع</span>
            )}
          </div>
        </div>
        <div
          className="edesk-filters"
          role="group"
          aria-label="دسته‌بندی خدمات"
        >
          {groups.map((g) => (
            <button
              key={g}
              type="button"
              aria-pressed={group === g}
              className={group === g ? "is-active" : ""}
              onClick={() => {
                setGroup(g);
                setShowAll(false);
              }}
            >
              {g}
            </button>
          ))}
        </div>
        {visible.length ? (
          <>
            <div className="edesk-cards">
              {visible.map((item) => (
                <article
                  className="edesk-card"
                  data-tone={categoryTone(item.category)}
                  key={item.id}
                >
                  <div className="edesk-card-top">
                    <span className="edesk-card-icon">
                      <ServiceIcon category={item.category} />
                    </span>
                    <span className="edesk-card-tag">{item.category}</span>
                  </div>
                  <h3>{item.title}</h3>
                  <div className="edesk-card-bottom">
                    <span>
                      {item.code ? `کد خدمت: ${item.code}` : "خدمت بانکی"}
                    </span>
                    <button type="button" onClick={() => setActive(item)}>
                      جزئیات خدمت <ChevronLeft size={17} />
                    </button>
                  </div>
                </article>
              ))}
            </div>
            {!showAll && !query && filtered.length > 12 && (
              <div className="edesk-show-more">
                <button type="button" onClick={() => setShowAll(true)}>
                  نمایش همه {filtered.length.toLocaleString("fa-IR")} خدمت{" "}
                  <ArrowLeft size={17} />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="edesk-empty">
            <Search size={28} />
            <strong>خدمتی با این مشخصات پیدا نشد</strong>
            <p>عبارت دیگری وارد کنید یا دسته‌بندی را تغییر دهید.</p>
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setGroup("همه خدمات");
              }}
            >
              نمایش همه خدمات
            </button>
          </div>
        )}
      </section>
      {active && (
        <div
          className="edesk-modal"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setActive(null);
          }}
        >
          <div
            className="edesk-dialog"
            data-tone={categoryTone(active.category)}
            role="dialog"
            aria-modal="true"
            aria-labelledby="edesk-dialog-title"
          >
            <div className="edesk-dialog-header">
              <div>
                <span className="edesk-overline">جزئیات و دسترسی‌های خدمت</span>
                <h2 id="edesk-dialog-title">{active.title}</h2>
                <p>
                  {active.code ? `کد خدمت ${active.code} • ` : ""}
                  {active.category}
                </p>
              </div>
              <button
                type="button"
                className="edesk-close"
                aria-label="بستن پنجره"
                onClick={() => setActive(null)}
              >
                <X size={22} />
              </button>
            </div>
            <div className="edesk-actions">
              {actionList.map((action) => {
                const href = active.actions[action.key as ActionKey];
                const Icon = action.icon;
                return href ? (
                  <a
                    key={action.key}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="edesk-action"
                  >
                    <span>
                      <Icon size={21} />
                    </span>
                    <strong>{action.name}</strong>
                    {action.kind === "document" ? (
                      <FileDown size={16} className="edesk-action-arrow" />
                    ) : (
                      <ExternalLink size={15} className="edesk-action-arrow" />
                    )}
                  </a>
                ) : (
                  <div key={action.key} className="edesk-action is-disabled">
                    <span>
                      <Icon size={21} />
                    </span>
                    <strong>{action.name}</strong>
                    <small>لینک موجود نیست</small>
                  </div>
                );
              })}
            </div>
            <div className="edesk-dialog-footer">
              <span>
                <ShieldCheck size={16} /> دسترسی به منابع وب‌سایت رسمی پست بانک
              </span>
              <a href={active.href} target="_blank" rel="noopener noreferrer">
                صفحه معرفی خدمت <ExternalLink size={15} />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
