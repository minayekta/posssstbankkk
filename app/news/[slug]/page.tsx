import {
  Breadcrumb,
  DemoNote,
  NewsCard,
  SiteShell,
} from "@/components/site-shell";
import { news } from "@/lib/content";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  return { title: news.find((item) => item.slug === slug)?.title ?? "اخبار" };
}
export default async function NewsDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = news.find((item) => item.slug === slug);
  if (!item) notFound();
  return (
    <SiteShell>
      <Breadcrumb
        items={[{ label: "اخبار", href: "/news" }, { label: item.title }]}
      />
      <article className="article-detail container">
        <header className="news-article-heading">
          <div className="news-article-meta"><span>{item.category}</span><span>{item.date}</span></div>
          <h1>{item.title}</h1>
          <p className="article-lead">{item.summary}</p>
        </header>
        <img
          className="article-hero"
          src={item.image}
          alt={`تصویر مرتبط با خبر: ${item.title}`}
        />
        <div className="article-copy">
          {item.body.split("\n").filter(Boolean).map((paragraph, index) => <p key={index}>{paragraph}</p>)}
          {"sourceUrl" in item && typeof item.sourceUrl === "string" && item.sourceUrl.startsWith("https://www.postbank.ir/") && (
            <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer" className="news-source-link">مشاهده خبر در وب‌سایت رسمی پست بانک <ArrowLeft size={18} /></a>
          )}
        </div>
        <div className="related-links">
          <Link href="/news" className="text-link">
            بازگشت به آرشیو <ArrowLeft size={17} />
          </Link>
          <Link href="/tenders" className="text-link">
            مزایده و مناقصه <ArrowLeft size={17} />
          </Link>
        </div>
        <div style={{ marginTop: 45 }}>
          <h2>مطالب دیگر</h2>
          <div className="news-list-grid">
            {news
              .filter((other) => other.slug !== slug)
              .slice(0, 3)
              .map((other) => (
                <NewsCard item={other} key={other.slug} />
              ))}
          </div>
        </div>
        <DemoNote />
      </article>
    </SiteShell>
  );
}
