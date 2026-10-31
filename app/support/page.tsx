import {
  DraftRequestForm,
  FAQAccordion,
} from "@/components/interaction-center";
import { Breadcrumb, DemoNote, SiteShell } from "@/components/site-shell";
import type { Metadata } from "next";
import Link from "next/link";
export const metadata: Metadata = { title: "ارتباطات و پشتیبانی" };
export default function Page() {
  return (
    <SiteShell>
      <Breadcrumb items={[{ label: "ارتباطات و پشتیبانی" }]} />
      {/* <PageIntro
        eyebrow="پست بانک ایران / خدمات و اطلاعات"
        title="یک مسیر برای هر درخواست"
        description="درخواست، شکایت و پیگیری را از مسیر درست شروع کنید."
      /> */}
      <section className="page-section legacy-page-wrap">
        <div className="container">
          <div className="legacy-page-grid">
            <article className="legacy-page-card" key="0">
              <span className="legacy-card-no">01</span>
              <h2>ثبت درخواست و شکایت</h2>
              <p>
                اطلاعات و شرایط رسمی این بخش پس از تأیید محتوا تکمیل می‌شود.
              </p>
            </article>
            <article className="legacy-page-card" key="1">
              <span className="legacy-card-no">02</span>
              <h2>سامانه شکایات وزارت ارتباطات</h2>
              <p>
                اطلاعات و شرایط رسمی این بخش پس از تأیید محتوا تکمیل می‌شود.
              </p>
            </article>
            <article className="legacy-page-card" key="2">
              <span className="legacy-card-no">03</span>
              <h2>درخواست ملاقات حضوری</h2>
              <p>
                اطلاعات و شرایط رسمی این بخش پس از تأیید محتوا تکمیل می‌شود.
              </p>
            </article>
            <article className="legacy-page-card" key="3">
              <span className="legacy-card-no">04</span>
              <h2>مشاوره الکترونیکی</h2>
              <p>
                اطلاعات و شرایط رسمی این بخش پس از تأیید محتوا تکمیل می‌شود.
              </p>
            </article>
            <article className="legacy-page-card" key="4">
              <span className="legacy-card-no">05</span>
              <h2>سؤالات متداول</h2>
              <p>
                اطلاعات و شرایط رسمی این بخش پس از تأیید محتوا تکمیل می‌شود.
              </p>
            </article>
            <article className="legacy-page-card" key="5">
              <span className="legacy-card-no">06</span>
              <h2>مزایده و مناقصه</h2>
              <p>
                اطلاعات و شرایط رسمی این بخش پس از تأیید محتوا تکمیل می‌شود.
              </p>
            </article>
            <article className="legacy-page-card" key="6">
              <span className="legacy-card-no">07</span>
              <h2>روابط عمومی</h2>
              <p>
                اطلاعات و شرایط رسمی این بخش پس از تأیید محتوا تکمیل می‌شود.
              </p>
            </article>
          </div>
          <div className="legacy-interactions">
            <DraftRequestForm />
            <h2 className="legacy-faq-title">پرسش‌های پرتکرار</h2>
            <FAQAccordion />
          </div>
          <div className="legacy-page-paths">
            <h2>مسیرهای مرتبط</h2>
            <div>
              <Link className="legacy-quick-link" href="/contact" key="0">
                تماس با بانک{" "}
              </Link>
              <Link className="legacy-quick-link" href="/tenders" key="1">
                مزایده و مناقصه{" "}
              </Link>
              <Link className="legacy-quick-link" href="/e-desk" key="2">
                میز خدمت{" "}
              </Link>
            </div>
          </div>
          <p className="legacy-verify-note">
            این بخش نمونه طراحی و ساختار اطلاعات است؛ برای خدمات عملیاتی،
            داده‌های زنده و ارسال درخواست باید به سامانه‌های رسمی و تأییدشده
            بانک متصل شود.
          </p>
          <DemoNote />
        </div>
      </section>
    </SiteShell>
  );
}
