"use client";

import { AccessibilityPanel } from "@/components/accessibility-panel";
import { officialLinks } from "@/lib/official-links";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronDown, Menu, Search, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";

const navigation = [
  {
    label: "خدمات",
    href: "/services",
    children: [
      { label: "خدمات ارزی", href: "/services/category/currency" },
      { label: "خدمات ریالی", href: "/services/category/rial" },
      { label: "خدمات شناسنامه‌دار", href: "/services/category/identified" },
      { label: "خدمات ویژه", href: "/services/category/special" },
    ],
  },
  {
    label: "محصولات",
    href: "/products",
    children: [
      { label: "همپا", href: "/products/hampa" },
      { label: "اینترنت بانک", href: "/products/internet-bank" },
      { label: "همتا", href: "/products/hamta" },
      { label: "خانه سبز", href: "/products/green-house" },
    ],
  },
  {
    label: "اخبار",
    href: "/news",
    children: [
      { label: "اخبار بانک", href: "/news" },
      { label: "اطلاعیه‌ها", href: "/news?category=اطلاعیه‌ها" },
      { label: "مزایده و مناقصه", href: "/tenders" },
      { label: "گالری تصاویر", href: "/gallery" },
    ],
  },
  { label: "میز خدمت", href: "/e-desk" },
  { label: "شفافیت", href: "/transparency" },
  {
    label: "درباره ما",
    href: "/about",
    children: [
      { label: "معرفی بانک", href: "/about" },
      { label: "امور سهامداران", href: "/investors" },
      { label: "شعب و باجه‌ها", href: "/branches" },
      { label: "ارتباط با ما", href: "/contact" },
    ],
  },
];

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveDropdown(null);
        setMenuOpen(false);
        setSearchOpen(false);
        setAccessOpen(false);
      }
    };
    const onOutside = (event: PointerEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node))
        setActiveDropdown(null);
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onOutside);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onOutside);
    };
  }, []);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [accessOpen, setAccessOpen] = useState(false);
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  function submitSearch(event: FormEvent) {
    event.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setSearchOpen(false);
      setMenuOpen(false);
    }
  }
  return (
    <>
      <a href="#main-content" className="skip-link">
        رفتن به محتوای اصلی
      </a>
      <div className="top-strip">
        <div className="container top-strip-inner">
          <span>پست بانک ایران</span>
          <div>
            <Link href="/contact">ارتباط با ما</Link>
            <span className="top-separator">/</span>
            <Link href="/branches">شعب و باجه‌ها</Link>
            <span className="top-separator">/</span>
            <Link href="/en" lang="en" dir="ltr">
              EN
            </Link>
          </div>
        </div>
      </div>
      <header className="site-header">
        <div className="container header-inner">
          <Link
            href="/"
            className="brand"
            aria-label="صفحه اصلی پست بانک ایران"
          >
            <img
              className="brand-logo"
              src="/images/postbank-logo.svg"
              alt=""
              width="49"
              height="52"
            />
            <span className="brand-type">
              <strong>پست بانک ایران</strong>
              <small>پیشرو در اقتصاد دیجیتال</small>
            </span>
          </Link>
          <nav
            ref={navRef}
            className={`primary-nav ${menuOpen ? "is-open" : ""}`}
            aria-label="منوی اصلی"
          >
            {[...navigation]
              .sort(
                (a, b) =>
                  Number(Boolean(b.children)) - Number(Boolean(a.children)),
              )
              .map((item) => (
                <div
                  className={`nav-item ${item.children ? "has-dropdown" : ""} ${activeDropdown === item.label ? "is-expanded" : ""}`}
                  key={item.label}
                  onMouseEnter={() => {
                    if (
                      window.matchMedia(
                        "(min-width: 1001px) and (hover: hover)",
                      ).matches
                    )
                      setActiveDropdown(item.children ? item.label : null);
                  }}
                  onMouseLeave={() => {
                    if (
                      window.matchMedia(
                        "(min-width: 1001px) and (hover: hover)",
                      ).matches
                    )
                      setActiveDropdown(null);
                  }}
                >
                  <div className="nav-main-row">
                    <Link
                      href={item.href}
                      onClick={() => {
                        setMenuOpen(false);
                        setActiveDropdown(null);
                      }}
                    >
                      {item.label}
                    </Link>
                    {item.children && (
                      <button
                        type="button"
                        className="nav-dropdown-toggle"
                        aria-label={`نمایش زیرمنوی ${item.label}`}
                        aria-expanded={activeDropdown === item.label}
                        onClick={() =>
                          setActiveDropdown((v) =>
                            v === item.label ? null : item.label,
                          )
                        }
                      >
                        <ChevronDown size={14} />
                      </button>
                    )}
                  </div>
                  {item.children && (
                    <div
                      className={`nav-dropdown ${"mega" in item && item.mega ? "nav-mega" : ""}`}
                      data-open={activeDropdown === item.label}
                    >
                      <div className="nav-dropdown-grid">
                        {item.children.map((child, index) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            style={
                              { "--item-order": index } as React.CSSProperties
                            }
                            onClick={() => {
                              setMenuOpen(false);
                              setActiveDropdown(null);
                            }}
                          >
                            <span>{child.label}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            <Link
              className="mobile-nav-contact"
              href="/contact"
              onClick={() => setMenuOpen(false)}
            >
              ارتباط با ما
            </Link>
          </nav>
          <div className="header-actions">
            {/* <button
              type="button"
              className="icon-button"
              aria-label="تنظیمات دسترس‌پذیری"
              aria-expanded={accessOpen}
              onClick={() => setAccessOpen(!accessOpen)}
            >
              <Accessibility size={20} />
            </button> */}
            <Link
              href="/young"
              className="header-greeno-badge"
              title="پُستینو و گرینو"
              aria-label="ورود به دنیای نوجوانان پست بانک"
            >
              <img
                src="/images/greeno-nav-icon.webp"
                width="42"
                height="42"
                alt=""
              />
            </Link>
            <button
              className="icon-button search-toggle"
              aria-label="جستجو"
              aria-expanded={searchOpen}
              onClick={() => {
                setSearchOpen(!searchOpen);
                setActiveDropdown(null);
              }}
            >
              <Search size={20} />
            </button>
            <a
              className="header-cta"
              href={officialLinks.internetBank}
              target="_blank"
              rel="noopener noreferrer"
            >
              ورود به اینترنت بانک
            </a>
            <button
              className="icon-button menu-toggle"
              aria-label={menuOpen ? "بستن منو" : "باز کردن منو"}
              aria-expanded={menuOpen}
              onClick={() => {
                setMenuOpen(!menuOpen);
                setActiveDropdown(null);
              }}
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>
      {accessOpen && <AccessibilityPanel close={() => setAccessOpen(false)} />}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            key="site-search"
            className="search-overlay"
            initial={
              reduceMotion
                ? { opacity: 1 }
                : { opacity: 0, y: -18, filter: "blur(8px)" }
            }
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={
              reduceMotion
                ? { opacity: 0 }
                : { opacity: 0, y: -12, filter: "blur(6px)" }
            }
            transition={{
              duration: reduceMotion ? 0.1 : 0.35,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <motion.form
              initial={reduceMotion ? false : { scaleX: 0.93 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              onSubmit={submitSearch}
              className="container search-form"
            >
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="نام خدمت، محصول یا خبر را جستجو کنید..."
                aria-label="جستجوی سایت"
              />
              <button
                type="submit"
                className="search-submit-icon"
                aria-label="اجرای جستجو"
              >
                <Search size={20} />
              </button>
              <button
                type="button"
                className="search-close"
                onClick={() => setSearchOpen(false)}
                aria-label="بستن جستجو"
              >
                <X size={20} />
              </button>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
