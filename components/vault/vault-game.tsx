"use client";

import { ArrowRight, Check, RotateCcw, Sparkles, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "./vault-game.module.css";

type Mission = {
  title: string;
  location: string;
  story: string;
  prompt: string;
  choices: [string, string, string];
  correct: number;
  explanation: string;
  reward: number;
  icon: string;
};

const missionRows: [
  string,
  string,
  string,
  string,
  [string, string, string],
  number,
  string,
  number,
  string,
][] = [
  [
    "پیام وسوسه‌انگیز",
    "خیابان خرید",
    "روی گوشی‌ات یک پیشنهاد عجیب ظاهر شده: فقط تا امشب!",
    "قبل از خرید یک وسیله تخفیف‌خورده چکار می‌کنی؟",
    [
      "همان لحظه می‌خرم",
      "نیازم و قیمت جایگزین را بررسی می‌کنم",
      "از دوست‌هایم می‌خواهم بخرند",
    ],
    1,
    "تخفیف به‌تنهایی دلیل خوبی برای خرید نیست؛ اول نیازت را بسنج.",
    20,
    "🛍️",
  ],
  [
    "دوچرخه یا هدفون؟",
    "پارک آرزوها",
    "۲۰۰ سکه داری و دوچرخه محبوبت ۶۰۰ سکه قیمت دارد.",
    "هدفون جدید را همین امروز بخری یا برای دوچرخه برنامه بچینی؟",
    [
      "همه پول را خرج هدفون می‌کنم",
      "دوچرخه را فراموش می‌کنم",
      "بخشی برای تفریح و بخشی برای هدف کنار می‌گذارم",
    ],
    2,
    "هم لذت امروز مهم است، هم هدف فردا؛ یک بودجه متعادل بساز.",
    25,
    "🚲",
  ],
  [
    "رمز مخفی",
    "اتاق امنیت",
    "شخصی در پیام‌رسان خود را پشتیبانی بانک معرفی می‌کند.",
    "او رمز یک‌بارمصرفت را می‌خواهد. چه می‌کنی؟",
    [
      "رمز را می‌فرستم",
      "پاسخ نمی‌دهم و از راه رسمی بررسی می‌کنم",
      "برای امتحان رمز اشتباه می‌فرستم",
    ],
    1,
    "رمز، کد ورود و اطلاعات حساس را نباید در اختیار دیگران گذاشت.",
    30,
    "🔐",
  ],
  [
    "نجات کیف پول",
    "میدان شهر",
    "۵۰۰ سکه داری: ۳۰۰ نیاز ضروری، ۱۰۰ تفریح و ۱۰۰ پس‌انداز.",
    "اگر هزینه ضروری ناگهان ۵۰ سکه بیشتر شود، بهترین کار چیست؟",
    [
      "از تفریح غیرضروری کم می‌کنم",
      "پس‌انداز را کامل حذف می‌کنم",
      "بدون بررسی قرض می‌گیرم",
    ],
    0,
    "با تغییر شرایط، اولویت‌های بودجه را به‌روزرسانی کن.",
    20,
    "🪙",
  ],
  [
    "قیمت عجیب",
    "بازارچه",
    "یک وسیله در سه فروشگاه با قیمت‌های مختلف پیدا کرده‌ای.",
    "بهترین روش مقایسه چیست؟",
    [
      "گران‌ترین همیشه بهتر است",
      "ارزان‌ترین را بدون بررسی می‌گیرم",
      "کیفیت، گارانتی و قیمت نهایی را مقایسه می‌کنم",
    ],
    2,
    "قیمت تنها یکی از معیارهای خرید هوشمندانه است.",
    25,
    "🏷️",
  ],
  [
    "درآمد اتفاقی",
    "ایستگاه پاداش",
    "۱۲۰ سکه مجازی هدیه گرفته‌ای.",
    "چطور تقسیمش می‌کنی؟",
    [
      "تمامش را خرج می‌کنم",
      "برای نیاز، تفریح و پس‌انداز تقسیم می‌کنم",
      "بی‌هدف نگه می‌دارم",
    ],
    1,
    "برای پول پیش‌بینی‌نشده هم برنامه داشته باش.",
    25,
    "🎁",
  ],
  [
    "لینک مشکوک",
    "تونل پیام‌ها",
    "پیامی آمده: برای دریافت جایزه روی لینک ناشناس کلیک کن.",
    "اولین تصمیم چیست؟",
    [
      "لینک را برای دوستان می‌فرستم",
      "مشخصات کارت وارد می‌کنم",
      "لینک را باز نمی‌کنم و اعتبار فرستنده را می‌سنجم",
    ],
    2,
    "جایزه‌های غیرمنتظره می‌توانند طعمه کلاهبرداری باشند.",
    30,
    "🕵️",
  ],
  [
    "سکه‌های گمشده",
    "کارگاه حسابداری",
    "ابتدای هفته ۴۰۰ سکه داشتی، ۱۱۰ خرج خوراکی و ۷۰ خرج بازی کردی.",
    "الان چند سکه باقی مانده؟",
    ["۲۲۰ سکه", "۲۸۰ سکه", "۳۳۰ سکه"],
    0,
    "۴۰۰ منهای ۱۱۰ منهای ۷۰ می‌شود ۲۲۰؛ ثبت خرج‌ها کمک می‌کند.",
    20,
    "🧮",
  ],
  [
    "باشگاه پس‌انداز",
    "باشگاه اهداف",
    "برای خرید یک وسیله ۳۰۰ سکه کم داری و هفته‌ای ۷۵ سکه پس‌انداز می‌کنی.",
    "چند هفته بعد به هدف می‌رسی؟",
    ["۲ هفته", "۴ هفته", "۸ هفته"],
    1,
    "هدف بزرگ را به گام‌های کوچک تبدیل کن.",
    25,
    "🎯",
  ],
  [
    "هدیه برای دوست",
    "خیابان دوستی",
    "می‌خواهی هدیه‌ای بخری ولی بودجه‌ات محدود است.",
    "کدام انتخاب بهتر است؟",
    [
      "هدیه خلاقانه و مناسب بودجه",
      "قرض گرفتن بدون برنامه",
      "خرید گران برای تحت تأثیر قرار دادن",
    ],
    0,
    "ارزش هدیه به فکر و توجه توست، نه فقط قیمتش.",
    20,
    "🎈",
  ],
  [
    "مسیر کوتاه",
    "ایستگاه سفر",
    "دو مسیر برای سفر داری: ارزان‌تر ولی طولانی‌تر، سریع‌تر ولی گران‌تر.",
    "چه چیزی را می‌سنجی؟",
    ["فقط پول", "فقط زمان", "هزینه، زمان و ایمنی"],
    2,
    "تصمیم مالی خوب چند معیار را با هم در نظر می‌گیرد.",
    25,
    "🚌",
  ],
  [
    "بازی اشتراکی",
    "دنیای بازی",
    "بازی آنلاین اشتراک ماهانه دارد.",
    "قبل از ثبت اشتراک چه می‌کنی؟",
    [
      "هزینه ماه‌های بعد و لغو اشتراک را بررسی می‌کنم",
      "بدون خواندن شرایط تأیید می‌کنم",
      "شماره کارت دوستم را وارد می‌کنم",
    ],
    0,
    "هزینه‌های کوچک تکرارشونده می‌توانند بزرگ شوند.",
    20,
    "🎮",
  ],
  [
    "کیف پول مشترک",
    "تیم دوستی",
    "با دوستانت برای یک پروژه پول جمع کرده‌اید.",
    "چطور حساب‌ها را منظم نگه می‌داری؟",
    [
      "فقط به حافظه اعتماد می‌کنم",
      "هزینه‌ها و سهم هر نفر را شفاف ثبت می‌کنم",
      "یک نفر بدون اطلاع همه خرج می‌کند",
    ],
    1,
    "ثبت شفاف، اختلاف‌های مالی را کمتر می‌کند.",
    25,
    "🤝",
  ],
  [
    "تعمیر یا تعویض؟",
    "تعمیرگاه",
    "وسایلت خراب شده اما تعمیرش هزینه کمتری دارد.",
    "چه می‌کنی؟",
    [
      "حتماً مدل تازه می‌خرم",
      "وسایل را دور می‌اندازم",
      "هزینه و کیفیت تعمیر را با تعویض می‌سنجم",
    ],
    2,
    "همیشه خرید جدید بهترین راه نیست.",
    25,
    "🔧",
  ],
  [
    "مسابقه تبلیغ",
    "استودیو آگهی",
    "دو تبلیغ مدعی‌اند محصولشان بهترین است.",
    "چگونه تصمیم می‌گیری؟",
    [
      "مشخصات و نظر منابع معتبر را بررسی می‌کنم",
      "هرکدام پررنگ‌تر بود می‌خرم",
      "چون معروف است حتماً خوب است",
    ],
    0,
    "ادعاهای تبلیغاتی را با شواهد مقایسه کن.",
    20,
    "📣",
  ],
  [
    "پاداش فوری",
    "دروازه انتخاب",
    "می‌توانی امروز ۵۰ سکه مجازی بگیری یا بعداً ۸۰ سکه.",
    "برای تصمیم چه باید پرسید؟",
    [
      "بدون فکر ۵۰ را انتخاب می‌کنم",
      "نیاز فعلی و ارزش صبر کردن را بررسی می‌کنم",
      "تصمیم را شانسی می‌گیرم",
    ],
    1,
    "صبر همیشه بهترین گزینه نیست؛ تصمیم به موقعیت بستگی دارد.",
    25,
    "⏳",
  ],
  [
    "نگهبان اطلاعات",
    "قلعه دیجیتال",
    "یک سایت خرید ناشناخته قیمت باورنکردنی پیشنهاد می‌دهد.",
    "قبل از پرداخت چه می‌کنی؟",
    [
      "اعتبار فروشگاه و نشانی پرداخت را بررسی می‌کنم",
      "اطلاعات کارت را سریع ثبت می‌کنم",
      "رمز را برای فروشنده می‌فرستم",
    ],
    0,
    "درگاه معتبر و فروشگاه شناخته‌شده امنیت را بیشتر می‌کنند.",
    30,
    "🛡️",
  ],
  [
    "روز بدون خرید",
    "باغ آرامش",
    "امروز حوصله‌ات سر رفته و دلت خرید آنلاین می‌خواهد.",
    "چه ایده‌ای مفیدتر است؟",
    [
      "یک وسیله تصادفی سفارش می‌دهم",
      "برای هیجان خرید می‌کنم",
      "سراغ تفریح رایگان یا کم‌هزینه می‌روم",
    ],
    2,
    "همه سرگرمی‌ها نیاز به خرج کردن ندارند.",
    20,
    "🌳",
  ],
  [
    "قطعات ربات",
    "آزمایشگاه",
    "برای ساخت ربات به سه قطعه ۸۰، ۱۲۰ و ۵۰ سکه‌ای نیاز داری.",
    "جمع هزینه چقدر می‌شود؟",
    ["۲۰۰", "۲۵۰", "۳۰۰"],
    1,
    "هزینه کل پروژه را قبل از شروع تخمین بزن.",
    25,
    "🤖",
  ],
  [
    "قرارداد کوچک",
    "خانه قراردادها",
    "برای شرکت در یک کلاس، هزینه‌ای را پیشاپیش می‌خواهند.",
    "به چه چیزی توجه می‌کنی؟",
    [
      "فقط عکس تبلیغ",
      "نظر یک دوست",
      "شرایط بازپرداخت، برنامه کلاس و هزینه کامل",
    ],
    2,
    "همیشه شرایط خرید خدمات را بخوان.",
    25,
    "📜",
  ],
  [
    "سفر گروهی",
    "اردوگاه",
    "بودجه گروه برای سفر محدود است.",
    "کدام برنامه بهتر است؟",
    [
      "بودجه رفت‌وآمد، خوراک و مبلغ اضطراری تعیین می‌کنیم",
      "همه سکه‌ها را روز اول خرج می‌کنیم",
      "بدون قیمت گرفتن رزرو می‌کنیم",
    ],
    0,
    "برای سفر، هزینه‌های فراموش‌شده را هم پیش‌بینی کن.",
    25,
    "🏕️",
  ],
  [
    "مغازه خیالی",
    "بازار کارآفرینان",
    "ده محصول ساخته‌ای؛ هر کدام ۳۰ سکه هزینه داشته است.",
    "برای تعیین قیمت فروش چه می‌سنجی؟",
    ["فقط سلیقه", "هزینه ساخت و قیمت بازار و ارزش کار", "قیمت کاملاً شانسی"],
    1,
    "قیمت مناسب باید هزینه‌ها را پوشش دهد.",
    30,
    "🏪",
  ],
  [
    "بذر سرمایه",
    "باغ آینده",
    "می‌خواهی برای یک هدف بلندمدت پول کنار بگذاری.",
    "روش سالم کدام است؟",
    [
      "گذاشتن هدف، بازه زمانی و بررسی منظم",
      "انتظار سود تضمینی زیاد",
      "سپردن همه پول به فرد ناشناس",
    ],
    0,
    "هیچ راهی بدون ریسک و با سود تضمینی عجیب نیست.",
    30,
    "🌱",
  ],
  [
    "شبکه شایعه",
    "رادیو شهر",
    "همه می‌گویند یک روش سریع پولدار شدن پیدا کرده‌اند.",
    "واکنش بهتر چیست؟",
    [
      "چون همه می‌گویند، انجام می‌دهم",
      "فوری پول قرض می‌گیرم",
      "منبع ادعا و ریسک آن را بررسی می‌کنم",
    ],
    2,
    "محبوب بودن یک ادعا، صحتش را ثابت نمی‌کند.",
    30,
    "📡",
  ],
  [
    "جعبه اضطراری",
    "خانه امن",
    "امروز یک خرج پیش‌بینی‌نشده پیش آمده است.",
    "بودجه اضطراری به چه کار می‌آید؟",
    ["برای خریدهای هیجانی", "برای هزینه‌های ناگهانی و ضروری", "برای شرط‌بندی"],
    1,
    "داشتن ذخیره اضطراری کمک می‌کند تصمیم عجولانه نگیری.",
    25,
    "🧰",
  ],
  [
    "هدیه هوشمند",
    "جشن شهر",
    "برای تولد دوستت ۱۵۰ سکه کنار گذاشته‌ای.",
    "هدیه ۱۸۰ سکه است. چه می‌کنی؟",
    [
      "دنبال جایگزین مناسب بودجه می‌گردم",
      "بدون برنامه قرض می‌گیرم",
      "از مبلغ ضروری کم می‌کنم",
    ],
    0,
    "بودجه محدودیت نیست؛ فرصتی برای انتخاب خلاقانه است.",
    20,
    "🎂",
  ],
  [
    "تصمیم تیمی",
    "شورای شهر",
    "شهر به کتابخانه و زمین بازی نیاز دارد ولی بودجه کافی نیست.",
    "راه منطقی چیست؟",
    [
      "فقط پرطرفدارترین گزینه",
      "بدون گفتگو تصمیم می‌گیرم",
      "اولویت‌ها، هزینه‌ها و نظر گروه را مقایسه می‌کنم",
    ],
    2,
    "تصمیم مالی جمعی با گفت‌وگو بهتر می‌شود.",
    30,
    "🏛️",
  ],
  [
    "سرنخ رمز",
    "راهروی نهایی",
    "چهار کد روی دیوار است؛ فقط یکی امنیت کافی دارد.",
    "کدام گذرواژه بهتر است؟",
    ["123456", "یک عبارت طولانی و منحصربه‌فرد", "نام خودم"],
    1,
    "گذرواژه بلند و یکتا محافظ بهتری است.",
    30,
    "🗝️",
  ],
  [
    "طرح جزیره",
    "دروازه نهایی",
    "برای جزیره مخفی خودت باید سه چیز بسازی: خانه، باغ و کارگاه.",
    "با بودجه محدود از کجا شروع می‌کنی؟",
    [
      "نیازها را اولویت‌بندی و مرحله‌ای می‌سازم",
      "همه را هم‌زمان بدون بودجه شروع می‌کنم",
      "همه را به شانس می‌سپارم",
    ],
    0,
    "اهداف بزرگ با گام‌های کوچک و برنامه‌ریزی واقعی می‌شوند.",
    40,
    "🏝️",
  ],
  [
    "قفل سی‌ام",
    "قلب گاوصندوق",
    "گرینو می‌گوید: حالا که همه رازها را پیدا کردی، یک انتخاب آخر مانده!",
    "مهم‌ترین ابزار تو در تصمیم‌های مالی چیست؟",
    ["سکه بیشتر از همه", "شانس و اتفاق", "فکر کردن، پرسیدن و برنامه‌ریزی"],
    2,
    "تو با مهارت‌های مالی خوب می‌توانی آینده دلخواهت را بسازی.",
    100,
    "👑",
  ],
];
const missions: Mission[] = missionRows
  .slice(0, 20)
  .map(
    ([
      title,
      location,
      story,
      prompt,
      choices,
      correct,
      explanation,
      reward,
      icon,
    ]) => ({
      title,
      location,
      story,
      prompt,
      choices,
      correct,
      explanation,
      reward,
      icon,
    }),
  );

const storageKey = "postino-vault-v1";
const TOTAL_MISSIONS = 20;
const MILESTONE_REWARDS: Record<number, number> = { 10: 100, 20: 200 };

export function VaultGame() {
  const [completed, setCompleted] = useState<number[]>([]);
  const [coins, setCoins] = useState(0);
  const [active, setActive] = useState<number | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [opened, setOpened] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) ?? "null");
      if (saved && Array.isArray(saved.completed)) {
        const checked = saved.completed.filter(
          (x: unknown) =>
            Number.isInteger(x) && Number(x) >= 0 && Number(x) < TOTAL_MISSIONS,
        );
        setCompleted([...new Set(checked as number[])].sort((a, b) => a - b));
        setCoins(Number(saved.coins) || 0);
        setOpened(new Set(checked).size >= TOTAL_MISSIONS);
      }
    } catch {
      /* invalid previous save */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready)
      localStorage.setItem(storageKey, JSON.stringify({ completed, coins }));
  }, [completed, coins, ready]);

  const next = completed.length;
  const current = active === null ? null : missions[active];
  function choose(index: number) {
    if (!revealed) setSelected(index);
  }
  function finish() {
    if (active === null || !revealed || selected !== current?.correct) return;
    if (!completed.includes(active)) {
      const nextCompleted = [...completed, active].sort((a, b) => a - b);
      setCompleted(nextCompleted);
      setCoins(
        (prev) =>
          prev +
          current.reward +
          (MILESTONE_REWARDS[nextCompleted.length] ?? 0),
      );
      if (nextCompleted.length === TOTAL_MISSIONS) setOpened(true);
    }
    setActive(null);
    setSelected(null);
    setRevealed(false);
  }
  function start(index: number) {
    if (index > next || completed.includes(index)) return;
    setActive(index);
    setSelected(null);
    setRevealed(false);
  }
  function reset() {
    if (!window.confirm("پیشرفت مأموریت‌ها از ابتدا شروع شود؟")) return;
    setCompleted([]);
    setCoins(0);
    setOpened(false);
    setActive(null);
  }

  return (
    <main className={styles.page} dir="rtl">
      <div className={styles.stars} aria-hidden="true" />
      <header className={styles.header}>
        <Link href="/young" className={styles.back}>
          <ArrowRight size={18} /> بازگشت به گرینو
        </Link>
        <span className={styles.brand}>
          <Sparkles size={18} /> راز ۲۰ قفل
        </span>
        <span className={styles.score}>
          🪙 {coins.toLocaleString("fa-IR")} سکه مجازی
        </span>
      </header>

      <section className={styles.hero}>
        <div className={styles.copy}>
          <span className={styles.eyebrow}>یک ماجراجویی ۲۰ مرحله‌ای</span>
          <h1>
            گاوصندوق <em>اسرارآمیز</em>
          </h1>
          <p>
            هر قفل یک راز مالی دارد. معماها را حل کن، تصمیم‌های سخت بگیر و در
            پایان، جزیره مخفی گرینو را کشف کن.
          </p>
          <div className={styles.progressLabel}>
            <span>
              {completed.length.toLocaleString("fa-IR")} از ۲۰ قفل باز شده
            </span>
            <strong>
              {Math.round(
                (completed.length / TOTAL_MISSIONS) * 100,
              ).toLocaleString("fa-IR")}
              ٪
            </strong>
          </div>
          <div className={styles.progress}>
            <span
              style={{ width: `${(completed.length / TOTAL_MISSIONS) * 100}%` }}
            />
          </div>
          <p className={styles.note}>
            ✨ با سکه‌های مجازی بازی می‌کنی؛ هیچ قفل روزانه اجباری یا جریمه غیبت
            وجود ندارد.
          </p>
          <button
            className={styles.primary}
            onClick={() =>
              opened
                ? document
                    .getElementById("vault-island")
                    ?.scrollIntoView({ behavior: "smooth" })
                : start(next)
            }
          >
            {opened
              ? "ورود به جزیره مخفی"
              : `شروع مأموریت ${Math.min(next + 1, TOTAL_MISSIONS).toLocaleString("fa-IR")}`}{" "}
            <span>←</span>
          </button>
        </div>
        <div
          className={styles.scene}
          aria-label="گاوصندوق سه‌بعدی با قفل‌های مأموریت"
        >
          <div className={styles.halo} />
          <div className={`${styles.vault} ${opened ? styles.vaultOpen : ""}`}>
            <div className={styles.vaultSide} />
            <div className={styles.vaultDoor}>
              <div className={styles.vaultTopBar}>
                <span>POSTINO • VAULT 20</span>
                <span>✦</span>
              </div>
              <div className={styles.ringOuter}>
                <div className={styles.ringInner}>
                  <div className={styles.knob}>✦</div>
                </div>
              </div>
              <div className={styles.indicators}>
                {Array.from({ length: TOTAL_MISSIONS }, (_, i) => (
                  <span
                    key={i}
                    className={completed.includes(i) ? styles.lit : ""}
                  />
                ))}
              </div>
              <span className={styles.doorCaption}>
                هر انتخاب، یک کلید تازه
              </span>
            </div>
            <div className={styles.vaultInside}>
              🏝️<span>دنیای پنهان!</span>
            </div>
          </div>
          <div className={styles.floor} />
          <div className={`${styles.floatToken} ${styles.tokenA}`}>🔑</div>
          <div className={`${styles.floatToken} ${styles.tokenB}`}>⭐</div>
        </div>
      </section>

      <section className={styles.missionSection} id="vault-missions">
        <div className={styles.sectionHead}>
          <div>
            <span className={styles.eyebrow}>نقشه مأموریت‌ها</span>
            <h2>۲۰ قفل. ۲۰ داستان.</h2>
            <p>
              قفل‌ها به‌ترتیب باز می‌شوند؛ ولی می‌توانی بدون محدودیت زمانی بازی
              کنی.
            </p>
          </div>
          <button className={styles.reset} onClick={reset}>
            <RotateCcw size={15} /> شروع دوباره
          </button>
        </div>
        <div className={styles.grid}>
          {missions.map((mission, index) => {
            const done = completed.includes(index);
            const available = index === next;
            return (
              <button
                key={index}
                type="button"
                disabled={!available}
                onClick={() => start(index)}
                className={`${styles.mission} ${done ? styles.done : ""} ${available ? styles.available : ""}`}
              >
                <span className={styles.number}>
                  {(index + 1).toLocaleString("fa-IR").padStart(2, "۰")}
                </span>
                <span className={styles.missionEmoji}>{mission.icon}</span>
                <strong>{mission.title}</strong>
                <small>{mission.location}</small>
                <span className={styles.missionState}>
                  {done ? (
                    <>
                      <Check size={14} /> باز شد
                    </>
                  ) : available ? (
                    "ماموریت فعال ✦"
                  ) : (
                    "🔒 قفل"
                  )}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {opened && (
        <section className={styles.island} id="vault-island">
          <div className={styles.islandGlobe}>🏝️</div>
          <span className={styles.eyebrow}>
            تبریک! ۲۰ مأموریت را تکمیل کردی
          </span>
          <h2>جزیره پنهان برای تو روشن شد!</h2>
          <p>
            این پایان مأموریت‌هاست، اما شروع تصمیم‌های هوشمندانه توئه. می‌تونی
            جزیره رو به سلیقه خودت تصور کنی و دوباره مسیر تازه‌ای بسازی.
          </p>
          <button onClick={reset} className={styles.primary}>
            ماجراجویی از اول <RotateCcw size={17} />
          </button>
        </section>
      )}

      {current && active !== null && (
        <div
          className={styles.modalBackdrop}
          role="presentation"
          onClick={() => setActive(null)}
        >
          <section
            className={styles.dialog}
            role="dialog"
            aria-modal="true"
            aria-label={`مأموریت ${active + 1}`}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className={styles.close}
              onClick={() => setActive(null)}
              aria-label="بستن"
            >
              <X size={20} />
            </button>
            <div className={styles.dialogTop}>
              <span>قفل {(active + 1).toLocaleString("fa-IR")} از ۳۰</span>
              <strong>🪙 +{current.reward.toLocaleString("fa-IR")}</strong>
            </div>
            <div className={styles.dialogIcon}>{current.icon}</div>
            <span className={styles.eyebrow}>{current.location}</span>
            <h2>{current.title}</h2>
            <p>{current.story}</p>
            <h3>{current.prompt}</h3>
            <div className={styles.answers}>
              {current.choices.map((choice, i) => (
                <button
                  key={i}
                  onClick={() => choose(i)}
                  disabled={revealed}
                  className={`${styles.answer} ${selected === i ? styles.selected : ""} ${revealed && i === current.correct ? styles.correct : ""}`}
                >
                  <span>{(i + 1).toLocaleString("fa-IR")}</span>
                  {choice}
                </button>
              ))}
            </div>
            {revealed && (
              <div
                className={`${styles.feedback} ${selected === current.correct ? styles.good : ""}`}
              >
                <strong>
                  {selected === current.correct
                    ? "عالی! قفل آماده باز شدن است ✨"
                    : "یک بار دیگه فکر کن 👀"}
                </strong>
                <p>{current.explanation}</p>
              </div>
            )}
            {revealed && selected === current.correct ? (
              <button className={styles.primary} onClick={finish}>
                باز کردن قفل 🔓
              </button>
            ) : (
              <button
                className={styles.primary}
                disabled={selected === null}
                onClick={() => {
                  if (revealed) {
                    setSelected(null);
                    setRevealed(false);
                  } else setRevealed(true);
                }}
              >
                {revealed ? "انتخاب دوباره" : "بررسی تصمیم"}
              </button>
            )}
          </section>
        </div>
      )}
    </main>
  );
}
