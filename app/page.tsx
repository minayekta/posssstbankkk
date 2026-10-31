import { CinematicHero } from "@/components/cinematic-hero";
import { InstitutionalLinks } from "@/components/legacy-features";
import {
  DemoNote,
  NewsCard,
  ProductCard,
  SectionHeading,
  SiteShell,
} from "@/components/site-shell";
import { SplitChartSection } from "@/components/split-chart-section";
import { SystemsPerspective } from "@/components/systems-perspective";
import { news, products } from "@/lib/content";
import Link from "next/link";

export default function Home() {
  return (
    <SiteShell>
      <CinematicHero />

      <SystemsPerspective />

      <section className="section products-section" id="products">
        <div className="container">
          <SectionHeading
            eyebrow="۰۳ / محصولات و تجربه دیجیتال"
            title="چند راه، برای نزدیک‌تر بودن"
            description="محصولات و سامانه‌ها را با کاربردشان بشناسید و مسیر مناسب خود را انتخاب کنید."
            href="/products"
            linkLabel="همه محصولات"
          />
          <div className="product-grid">
            {products.map((product, index) => (
              <ProductCard item={product} index={index} key={product.slug} />
            ))}
          </div>
        </div>
      </section>

      <section className="section news-section" id="news">
        <div className="container">
          <SectionHeading
            eyebrow="۰۵ / اتاق خبر"
            title="تازه‌ترین روایت‌ها از پست بانک"
            description="اخبار، اطلاعیه‌ها و آگهی‌ها در مسیرهای جدا و قابل جستجو."
            href="/news"
            linkLabel="آرشیو اخبار"
          />
          <div className="news-home-grid">
            <NewsCard item={news[0]} featured />
            <div className="news-home-side">
              <div className="news-side-label">تازه‌ترین مطالب</div>
              {news.slice(1, 4).map((item) => (
                <Link
                  href={`/news/${item.slug}`}
                  className="news-side-row"
                  key={item.slug}
                >
                  <span>
                    <small>
                      {item.category} / {item.date}
                    </small>
                    <strong>{item.title}</strong>
                  </span>
                </Link>
              ))}
              <Link href="/tenders" className="tender-strip">
                <span>
                  <strong>مزایده‌ها و مناقصه‌ها</strong>
                  <small>دسترسی مستقیم به آرشیو آگهی‌ها</small>
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <SplitChartSection />
      <section className="section legacy-home-institutional">
        <div className="container">
          <SectionHeading
            eyebrow="بانکداری پاسخگو"
            title="خدمات سازمانی، شفاف و در دسترس"
            description="از درخواست‌های عمومی تا امور سهامداران و شفافیت، هر مسیر جای مشخص خودش را دارد."
          />
          <InstitutionalLinks />
        </div>
      </section>
      <div className="container">
        <DemoNote />
      </div>
    </SiteShell>
  );
}
