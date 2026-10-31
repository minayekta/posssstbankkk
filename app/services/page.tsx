import { CatalogFilter } from "@/components/catalog-filter";
import { LegacyServicesHub } from "@/components/legacy-features";
import { Breadcrumb, DemoNote, SiteShell } from "@/components/site-shell";
import { serviceCategories, services } from "@/lib/content";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "خدمات بانکی" };
export default function ServicesPage() {
  return (
    <SiteShell>
      <Breadcrumb items={[{ label: "خدمات" }]} />
      {/* <PageIntro
        eyebrow="خدمات پست بانک"
        title="هر کار بانکی، با یک مسیر روشن."
        description="از پرداخت‌های روزمره تا خدمات غیرحضوری؛ دسته‌بندی را انتخاب کنید یا نام خدمت را جستجو کنید."
      /> */}
      <section className="section legacy-service-categories">
        <div className="container">
          <div className="listing-heading">
            {/* <span>دسته‌بندی جامع</span> */}
            <h2>خدمات را بر اساس نیازتان انتخاب کنید</h2>
          </div>
          <LegacyServicesHub />
        </div>
      </section>
      <section className="page-section page-tone">
        <div className="container" style={{ paddingTop: 55 }}>
          <div className="listing-heading">
            <span>همه خدمات</span>
            <h2>خدمت موردنظرتان را انتخاب کنید</h2>
          </div>
          <CatalogFilter
            kind="services"
            items={services}
            categories={serviceCategories}
          />
          <DemoNote />
        </div>
      </section>
    </SiteShell>
  );
}
