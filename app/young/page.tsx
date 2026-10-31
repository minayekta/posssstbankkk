import { PostinoExperience } from "@/components/postino-experience";
import { SiteShell } from "@/components/site-shell";
import { BookOpenCheck, HeartHandshake, PiggyBank } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "گرینو | دنیای نوجوانان پست بانک",
  description:
    "گرینو، کانسپت فضای آینده نوجوانان پست بانک برای آشنایی با پس‌انداز و سواد مالی؛ به‌زودی.",
};

export default function PostinoPage() {
  return (
    <SiteShell>
      <PostinoExperience />
      <div
        className="container"
        style={{
          paddingBlock: "24px 38px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Link href="/young/greeno" className="button button-primary">
          تجربه بازی گرینو؛ آینده‌تو بازی کن
        </Link>
      </div>
      <section
        className="container young-page-topics"
        aria-label="آشنایی با گرینو"
      >
        <div className="postino-intro-label">در حال طراحی و توسعه</div>
        <h2>قراره اینجا چه خبره باشه؟</h2>
        <p className="postino-note">
          گرینو فعلاً یک ایده در مرحله طراحی است و هنوز خدمت بانکی فعالی برای
          نوجوانان ارائه نمی‌کند.
        </p>
        <div className="young-topic-grid">
          <div>
            <PiggyBank size={36} />
            <h3>پس‌انداز با هدف</h3>
            <p>یاد بگیریم برای خواسته‌هامون برنامه داشته باشیم.</p>
          </div>
          <div>
            <BookOpenCheck size={36} />
            <h3>یادگیری با بازی</h3>
            <p>مفاهیم مالی رو ساده و سرگرم‌کننده تجربه کنیم.</p>
          </div>
          <div>
            <HeartHandshake size={36} />
            <h3>همراه خانواده</h3>
            <p>
              تجربه‌ای آینده‌نگر با توجه به نقش خانواده و مقررات مربوط به افراد
              زیر سن قانونی.
            </p>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
