import { CatalogFilter } from "@/components/catalog-filter";
import { Breadcrumb, DemoNote, SiteShell } from "@/components/site-shell";
import { SoftReveal } from "@/components/ui/motion-effects";
import { news, newsCategories } from "@/lib/content";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "اخبار و اطلاعیه‌ها" };
export default async function NewsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  return (
    <SiteShell>
      <Breadcrumb items={[{ label: "اخبار" }]} />
      {/* <PageIntro
        eyebrow="اتاق خبر"
        title="خبرها، در یک قاب روشن."
        description="خبرها و اطلاعیه‌ها را به شکل موضوعی بخوانید؛ برای آگهی‌ها هم مسیر جداگانه‌ای در دسترس است."
      /> */}
      {/* <div className="container">
        <OssHero>
          <CurtainScope>
            <Link href={`/news/${news[0].slug}`} className="editorial-feature">
              <div className="editorial-feature-image">
                <img src={news[0].image} alt="تصویر نمایشی خبر منتخب" />
              </div>
              <div className="editorial-feature-copy">
                <span>روایت منتخب / {news[0].category}</span>
                <h2>{news[0].title}</h2>
                <p>{news[0].summary}</p>
                <strong>خواندن خبر </strong>
              </div>
            </Link>
          </CurtainScope>
        </OssHero>
      </div> */}
      <section className="page-section page-tone">
        <div className="container" style={{ paddingTop: 55 }}>
          {/* <div className="listing-heading">
            <span>آرشیو مطالب</span>
            <h2>
              <ScrollWordReveal text="آخرین خبرها و اطلاعیه‌ها" />
            </h2>
            <Link href="/tenders">مزایده و مناقصه </Link>
          </div> */}
          <SoftReveal>
            {/* <div className="news-skeleton-decoration" aria-hidden="true">
              <SkeletonShimmer label="نمایش نمونه افکت شایمر" />
            </div> */}
            <CatalogFilter
              kind="news"
              items={news}
              categories={newsCategories}
              initialCategory={category}
            />
          </SoftReveal>
          <DemoNote />
        </div>
      </section>
    </SiteShell>
  );
}
