import { ContentIcon } from "@/components/icons";
import { Breadcrumb, DemoNote, SiteShell } from "@/components/site-shell";
import { products } from "@/lib/content";
import { productDestinations } from "@/lib/official-links";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "سامانه‌های بانکی" };
export default function SystemsPage() {
  return (
    <SiteShell>
      <Breadcrumb items={[{ label: "سامانه‌ها" }]} />
      {/* <PageIntro
        eyebrow="سامانه‌های پست بانک"
        title="راه ورود به هر سامانه را پیدا کنید."
        description="سامانه‌ها را با کاربردشان مرور کنید. مسیر ورود از لینک‌های موجود در سورس سایت رسمی گرفته شده است."
      /> */}
      <section className="page-section page-tone">
        <div className="container" style={{ paddingTop: 35 }}>
          <div className="simple-page-grid">
            {products.map((item) => (
              <article className="info-panel" key={item.slug}>
                <span className="service-icon">
                  <ContentIcon name={item.icon} />
                </span>
                <h3 style={{ marginTop: 18 }}>{item.title}</h3>
                <p>{item.summary}</p>
                <div className="system-card-links">
                  <Link className="text-link" href={`/products/${item.slug}`}>
                    معرفی سامانه{" "}
                  </Link>
                  <a
                    className="text-link"
                    href={productDestinations[item.slug]}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    ورود رسمی{" "}
                  </a>
                </div>
              </article>
            ))}
          </div>
          <DemoNote />
        </div>
      </section>
    </SiteShell>
  );
}
