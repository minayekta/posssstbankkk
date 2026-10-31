import {
  Breadcrumb,
  DemoNote,
  PageIntro,
  ProductCard,
  SiteShell,
} from "@/components/site-shell";
import { products } from "@/lib/content";
import { Smartphone } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "محصولات و راهکارها" };
export default function ProductsPage() {
  return (
    <SiteShell>
      <Breadcrumb items={[{ label: "محصولات" }]} />
      <PageIntro
        eyebrow="محصولات و بانکداری دیجیتال"
        title="بانکداری، مطابق سبک زندگی شما."
        description="همپا، اینترنت بانک، همتا و خانه سبز را با کاربردشان بشناسید و به صفحه اختصاصی هر محصول بروید."
      />
      <div className="container">
        <div className="feature-band product-feature-band">
          <div>
            <span className="feature-band-kicker">
              محصول منتخب / همراه بانک همپا
            </span>
            <h2>
              کارهای روزمره،
              <br />
              همراه شما.
            </h2>
            <p>دسترسی به مسیر معرفی همراه بانک در یک نگاه.</p>
            <Link className="button button-white" href="/products/hampa">
              آشنایی با همپا{" "}
            </Link>
          </div>
          <div className="feature-phone" aria-hidden="true">
            <div className="feature-phone-screen">
              <span className="phone-spark" />
              <Smartphone size={56} />
              <span className="phone-lines">
                <i />
                <i />
                <i />
              </span>
            </div>
          </div>
        </div>
      </div>
      <section className="page-section page-tone">
        <div className="container" style={{ paddingTop: 55 }}>
          <div className="listing-heading">
            <span>انتخاب محصول</span>
            <h2>راهکارها و سامانه‌ها</h2>
          </div>
          <div className="product-list-grid">
            {products.map((item, index) => (
              <ProductCard key={item.slug} item={item} index={index} />
            ))}
          </div>
          <DemoNote />
        </div>
      </section>
    </SiteShell>
  );
}
