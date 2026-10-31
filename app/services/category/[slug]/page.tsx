import { Breadcrumb, DemoNote, SiteShell } from "@/components/site-shell";
import { legacyGroups } from "@/lib/legacy-catalog";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
export function generateStaticParams() {
  return legacyGroups.map((g) => ({ slug: g.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: legacyGroups.find((g) => g.slug === slug)?.title || "دسته خدمات",
  };
}
export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const group = legacyGroups.find((g) => g.slug === slug);
  if (!group) notFound();
  return (
    <SiteShell>
      <Breadcrumb
        items={[{ label: "خدمات", href: "/services" }, { label: group.title }]}
      />
      {/* <PageIntro
        eyebrow="راهنمای جامع خدمات"
        title={group.title}
        description={group.desc}
      /> */}
      <section className="page-section">
        <div className="container">
          <div className="legacy-detail-top">
            {/* <div>
              <span>فهرست خدمات این دسته</span>
              <strong>
                {group.items.length.toLocaleString("fa-IR")} عنوان
              </strong>
            </div> */}
            {/* <Link href="/services" className="text-link">
              همه دسته‌ها <ChevronLeft size={18} />
            </Link> */}
          </div>
          <div className="legacy-detail-grid">
            {group.items.map((item, i) => (
              <div className="legacy-detail-item" key={item}>
                <span className="legacy-item-count">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h2>{item}</h2>
                <p>
                  شرح خدمت، مدارک لازم و مسیر انجام پس از تأیید اطلاعات رسمی
                  بانک تکمیل می‌شود.
                </p>
                <span className="legacy-item-status">
                  راهنمای خدمت / در حال تکمیل
                </span>
              </div>
            ))}
          </div>
          <DemoNote />
        </div>
      </section>
    </SiteShell>
  );
}
