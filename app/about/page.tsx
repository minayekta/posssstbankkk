import { Breadcrumb, SiteShell } from "@/components/site-shell";
import { officialLinks } from "@/lib/official-links";
import {
  ArrowLeft,
  BookOpen,
  Compass,
  HeartHandshake,
  ShieldCheck,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "درباره پست بانک ایران" };

const resources = [
  {
    title: "بیانیه مأموریت",
    text: "آشنایی با تعریف رسمی مأموریت بانک",
    href: officialLinks.mission,
    icon: Compass,
  },
  {
    title: "چشم‌انداز",
    text: "جهت‌گیری و چشم‌انداز منتشرشده بانک",
    href: officialLinks.vision,
    icon: BookOpen,
  },
  {
    title: "مسئولیت اجتماعی",
    text: "تعهد و فعالیت‌های اجتماعی بانک",
    href: officialLinks.socialResponsibility,
    icon: HeartHandshake,
  },
  {
    title: "حقوق مشتریان",
    text: "منشور حقوق مشتریان در وب‌سایت رسمی",
    href: officialLinks.customerRights,
    icon: ShieldCheck,
  },
];

export default function AboutPage() {
  return (
    <SiteShell>
      <Breadcrumb items={[{ label: "درباره ما" }]} />
      <section className="about-hero container">
        <div className="about-hero-copy">
          {/* <Eyebrow>درباره پست بانک ایران</Eyebrow> */}
          <h1>
            بانکی با راه‌های
            <br />
            <em>نزدیک‌تر برای ارتباط.</em>
          </h1>
          <p>
            پست بانک ایران خدمات بانکی را در مسیرهای حضوری و دیجیتال در دسترس
            قرار می‌دهد. این صفحه دریچه‌ای برای شناخت تاریخچه، مأموریت و مسیرهای
            ارتباط با بانک است.
          </p>
          <div className="about-actions">
            <a
              className="button button-primary"
              href={officialLinks.history}
              target="_blank"
              rel="noopener noreferrer"
            >
              تاریخچه در وب‌سایت رسمی{" "}
            </a>
            <Link className="button button-outline" href="/branches">
              پیدا کردن شعبه <ArrowLeft size={17} />
            </Link>
          </div>
        </div>
        <div className="about-hero-image">
          <img
            src="/images/news-branch-card.webp"
            alt="نمای مفهومی از یک شعبه بانک"
          />
          <span>تصویر مفهومی برای نسخه نمایشی</span>
        </div>
      </section>

      <section className="about-story">
        <div className="container about-story-layout">
          <div className="about-story-heading">
            <p>تاریخچه / نگاهی کوتاه</p>
            <h2>
              از آغاز فعالیت
              <br />
              تا خدمات امروز
            </h2>
            <p>
              در این دمو تنها نقاط اصلی مسیر بانک به‌صورت خلاصه آمده‌اند. برای
              متن کامل و به‌روز، به صفحه تاریخچه در وب‌سایت رسمی مراجعه کنید.
            </p>
            <a
              className="text-link"
              href={officialLinks.history}
              target="_blank"
              rel="noopener noreferrer"
            >
              مطالعه تاریخچه کامل{" "}
            </a>
          </div>
          <div className="about-timeline">
            <div className="timeline-item">
              <span className="timeline-year">۱۳۷۵</span>
              <div>
                <h3>آغاز فعالیت رسمی</h3>
                <p>
                  پست بانک ایران پس از تصویب اساسنامه، فعالیت رسمی خود را از
                  دی‌ماه ۱۳۷۵ آغاز کرد.
                </p>
              </div>
            </div>
            <div className="timeline-item">
              <span className="timeline-year">۱۳۸۵</span>
              <div>
                <h3>ادامه فعالیت بانکی</h3>
                <p>
                  مرحله‌ای در مسیر توسعه فعالیت‌های بانکی و خدمات مالی در سطح
                  کشور.
                </p>
              </div>
            </div>
            <div className="timeline-item">
              <span className="timeline-year">امروز</span>
              <div>
                <h3>دسترسی حضوری و دیجیتال</h3>
                <p>
                  شعب و باجه‌ها، همراه بانک، اینترنت بانک و سامانه‌های تخصصی،
                  راه‌های مختلف دسترسی به خدمات‌اند.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section about-resources">
        <div className="container">
          <div className="about-section-heading">
            {/* <Eyebrow>اسناد و اطلاعات رسمی</Eyebrow> */}
            <h2>بیشتر با بانک آشنا شوید</h2>
            <p>
              این مسیرها از منوی «معرفی» در سورس صفحه اصلی پست بانک برداشته
              شده‌اند.
            </p>
          </div>
          <div className="about-resource-grid">
            {resources.map(({ title, text, href, icon: Icon }) => (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="about-resource"
                key={title}
              >
                <span className="about-resource-icon">
                  <Icon size={26} />
                </span>
                <h3>{title}</h3>
                <p>{text}</p>
                <span>مطالعه در سایت رسمی </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* <section className="about-access">
        <div className="container about-access-inner">
          <div>
            <MapPin size={28} />
            <h2>خدمات نزدیک به شما</h2>
            <p>
              برای مراجعه حضوری، شهر و شعبه را در صفحه شعب و باجه‌ها انتخاب
              کنید؛ برای کارهای روزمره هم سامانه‌های غیرحضوری در دسترس‌اند.
            </p>
          </div>
          <div>
            <Link href="/branches" className="button button-white">
              شعب و باجه‌ها{" "}
            </Link>
            <Link href="/products" className="button button-outline">
              محصولات و سامانه‌ها <ArrowLeft size={17} />
            </Link>
          </div>
        </div>
      </section> */}
    </SiteShell>
  );
}
