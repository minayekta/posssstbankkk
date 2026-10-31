import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { MotionEnhancer } from "@/components/motion-enhancer";


const uiFont = localFont({
  src: [
    { path: "../public/fonts/IRANSansXFaNum-Regular.woff2", weight: "400", style: "normal" },
    { path: "../public/fonts/IRANSansXFaNum-Medium.woff2", weight: "500", style: "normal" },
    { path: "../public/fonts/IRANSansXFaNum-DemiBold.woff2", weight: "600", style: "normal" },
    { path: "../public/fonts/IRANSansXFaNum-Bold.woff2", weight: "700", style: "normal" },
    { path: "../public/fonts/IRANSansXFaNum-ExtraBold.woff2", weight: "800", style: "normal" },
    { path: "../public/fonts/IRANSansXFaNum-Black.woff2", weight: "900", style: "normal" },
  ],
  variable: "--font-ui",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: { default: "پست بانک ایران | دمو بازطراحی", template: "%s | پست بانک ایران" },
  description: "نسخه نمایشی بازطراحی وب‌سایت پست بانک ایران؛ خدمات، محصولات، اخبار و سامانه‌ها با داده‌های نمونه.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body className={`${uiFont.variable} antialiased`}><MotionEnhancer/>{children}</body>
    </html>
  );
}
