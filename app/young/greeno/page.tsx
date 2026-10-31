import type { Metadata } from 'next';
import GreenoGame from '@/components/greeno/game';
export const metadata: Metadata = { title: 'گرینو | آینده‌تو بازی کن', description: 'یک شهر، پنج تصمیم و آینده‌ای که خودت می‌سازی؛ بازی آموزشی بانکداری نوجوانان.' };
export default function GreenoPage() { return <GreenoGame />; }
