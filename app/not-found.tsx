import Link from 'next/link';
import {ArrowUpLeft,SearchX} from 'lucide-react';
import {SiteShell} from '@/components/site-shell';
export default function NotFound(){return <SiteShell><section className="legacy-404 container"><div><SearchX size={58} strokeWidth={1.4}/><span>۴۰۴</span><h1>این مسیر را پیدا نکردیم.</h1><p>شاید نشانی تغییر کرده باشد. از صفحه اصلی یا دسته‌بندی خدمات می‌توانید مسیرتان را دوباره پیدا کنید.</p><div><Link className="button button-primary" href="/">بازگشت به خانه </Link><Link className="button button-outline" href="/services">مرور خدمات</Link></div></div></section></SiteShell>}
