"use client";

import {
  goals,
  initialGame,
  outcome,
  reactions,
  stations,
  validGame,
  type Game,
} from "@/lib/greeno";
import {
  ArrowLeft,
  ArrowUpLeft,
  Check,
  Globe2,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import {
  Component,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import CityPreview from "./city-preview";
import "./greeno.css";
import "./light.css";

const Scene = dynamic(() => import("./css-city"), {
  ssr: false,
  loading: () => <div className="gr-loading">در حال ساختن شهر تو…</div>,
});
const money = (n: number) => Math.round(n).toLocaleString("fa-IR");
class SceneBoundary extends Component<
  { children: ReactNode; onFailure: () => void; retry: () => void },
  { failed: boolean; webglUnavailable: boolean }
> {
  state = { failed: false, webglUnavailable: false };
  static getDerivedStateFromError(error: Error) {
    return {
      failed: true,
      webglUnavailable: error.name === "GreenoWebGLUnavailableError",
    };
  }
  componentDidCatch(error: Error) {
    console.error("[Greeno] 3D scene initialization failed:", error);
    this.props.onFailure();
  }
  render() {
    return this.state.failed ? (
      <CityPreview
        retry={this.props.retry}
        webglUnavailable={this.state.webglUnavailable}
      />
    ) : (
      this.props.children
    );
  }
}
export default function GreenoGame() {
  const [game, setGame] = useState<Game>(initialGame);
  const [loaded, setLoaded] = useState(false);
  const [overview, setOverview] = useState(true);
  const [arrived, setArrived] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [compare, setCompare] = useState(false);
  const [alternative, setAlternative] = useState(1);
  const [storage, setStorage] = useState(true);
  const [sceneUnavailable, setSceneUnavailable] = useState(false);
  const [sceneReady, setSceneReady] = useState(false);
  const [sceneAttempt, setSceneAttempt] = useState(0);
  const panel = useRef<HTMLDivElement>(null);
  useEffect(() => {
    panel.current?.scrollTo({ top: 0, behavior: "auto" });
  }, [game.step, overview, arrived]);
  useEffect(() => {
    const hydration = setTimeout(() => {
      try {
        const raw = localStorage.getItem("greeno-v1");
        if (raw) {
          const saved: unknown = JSON.parse(raw);
          if (validGame(saved)) setGame(saved);
        }
      } catch {
        setStorage(false);
      }
      const query = matchMedia("(prefers-reduced-motion: reduce)");
      setReduced(query.matches);
      setLoaded(true);
    }, 0);
    const query = matchMedia("(prefers-reduced-motion: reduce)");
    const change = () => setReduced(query.matches);
    query.addEventListener("change", change);
    return () => {
      clearTimeout(hydration);
      query.removeEventListener("change", change);
    };
  }, []);
  useEffect(() => {
    if (loaded)
      try {
        localStorage.setItem("greeno-v1", JSON.stringify(game));
      } catch {
        queueMicrotask(() => setStorage(false));
      }
  }, [game, loaded]);
  const onArrive = useCallback(() => {
    setSceneReady(true);
    setArrived(true);
  }, []);
  const onSceneFailure = useCallback(() => {
    setSceneUnavailable(true);
    setSceneReady(true);
    setArrived(true);
  }, []);
  const result = outcome(game);
  const travel = (step: number) => {
    if (!loaded || !sceneReady || (step === game.step && !overview)) return;
    setArrived(sceneUnavailable);
    setOverview(false);
    setGame((g) => ({ ...g, step, unlocked: Math.max(g.unlocked, step) }));
  };
  const retryScene = () => {
    setSceneUnavailable(false);
    setSceneReady(false);
    setArrived(false);
    setSceneAttempt((value) => value + 1);
  };
  const next = () => travel(Math.min(4, game.step + 1));
  const patch = (value: Partial<Game>) =>
    setGame((g) => ({
      ...g,
      ...value,
      ...("allowance" in value || "save" in value || "skill" in value
        ? { reaction: null, unlocked: Math.min(g.unlocked, 3) }
        : {}),
    }));
  return (
    <main className="greeno" dir="rtl">
      <header className="gr-header">
        <Link href="/young" className="gr-brand">
          <Image
            src="/images/postbank-logo.svg"
            alt="پست بانک ایران"
            width="34"
            height="38"
          />
          <span>
            گرینو<span className="gr-brand-sub">دنیای فردای تو</span>
          </span>
        </Link>
        <nav aria-label="راهبری گرینو">
          <a href="#adventure">کشف گرینو</a>
          <a href="#how">چطور بازی کنیم؟</a>
          <Link href="/young">
            دنیای نوجوانان <ArrowUpLeft size={14} />
          </Link>
        </nav>
        <span className="gr-demo">
          <i /> یک تجربه آموزشی
        </span>
      </header>
      <section
        className="gr-stage"
        id="adventure"
        aria-label="شهر و کنترل‌های بازی گرینو"
      >
        <div className="gr-world">
          <div className="gr-world-top">
            <span>
              GREENO WORLD <i>01 — 05</i>
            </span>
            <span className="gr-live">● شهر زنده تو</span>
          </div>
          <SceneBoundary
            key={sceneAttempt}
            retry={retryScene}
            onFailure={onSceneFailure}
          >
            <Scene
              step={game.step}
              overview={overview}
              reduced={reduced}
              growth={result.savings / 250}
              reaction={game.reaction}
              onArrive={onArrive}
            />
          </SceneBoundary>
          <div className="gr-scene-actions">
            <button
              disabled={!loaded || !sceneReady}
              onClick={() => {
                setArrived(sceneUnavailable);
                setOverview((v) => !v);
              }}
            >
              <Globe2 size={16} />
              {overview ? "رفتن به ایستگاه" : "نمای کلی شهر"}
            </button>
            <button
              aria-label={reduced ? "فعال کردن حرکت‌ها" : "کاهش حرکت‌ها"}
              onClick={() => setReduced((v) => !v)}
            >
              {reduced ? <Play size={16} /> : <Pause size={16} />}{" "}
              {reduced ? "حرکت کم" : "شهر متحرک"}
            </button>
          </div>
          <span className="gr-world-caption">
            هر تصمیم تو، یک گوشه از این شهر رو می‌سازه.
          </span>
        </div>
        <div className="gr-panel" ref={panel}>
          {overview && (
            <div className="gr-intro">
              <span className="gr-eyebrow">
                <span /> به نسل فردا خوش اومدی
              </span>
              <h1>
                آینده‌تو
                <br />
                <em>بازی کن.</em>
                <Sparkles className="gr-spark" />
              </h1>
              <p>
                اینجا شهر توئه. با هر تصمیم کوچیک،
                <br />
                یه قدم به رؤیاهات نزدیک‌تر شو.
              </p>
              <button
                className="gr-primary"
                disabled={!loaded || !sceneReady}
                aria-busy={!loaded || !sceneReady}
                onClick={() => travel(game.step)}
              >
                {game.step ? "ادامه ماجراجویی" : "بزن بریم ماجراجویی"}{" "}
                <ArrowLeft size={19} />
              </button>
              <span className="gr-small" role="status">
                {!loaded || !sceneReady
                  ? "در حال آماده‌شدن شهر…"
                  : "۵ ایستگاه · کلی کشف تازه · فقط سکه‌های مجازی"}
              </span>
              <div className="gr-guide">
                <span className="gr-bot-icon">▣</span>
                <p>
                  <b>من گرینوم، همسفر تو!</b>
                  <br />
                  با هم شهری می‌سازیم که شبیه رؤیاهای توئه.
                </p>
              </div>
            </div>
          )}
          {loaded && !overview && arrived && (
            <article className="gr-card" aria-live="polite">
              <div className="gr-card-heading">
                <span>ایستگاه {money(game.step + 1)} / ۵</span>
                <h2>{stations[game.step]}</h2>
              </div>
              {game.step === 0 && (
                <>
                  <p>دوست داری برای چی پس‌انداز کنی؟</p>
                  <div className="gr-options">
                    {goals.map((g, i) => (
                      <button
                        key={g.name}
                        aria-pressed={game.goal === i}
                        className={game.goal === i ? "selected" : ""}
                        onClick={() => patch({ goal: i })}
                      >
                        <span className="gr-emoji">{g.icon}</span>
                        <b>{g.name}</b>
                        <small>{money(g.price)} سکه مجازی</small>
                      </button>
                    ))}
                  </div>
                  <button className="gr-primary" onClick={next}>
                    این رؤیای منه <ArrowLeft size={16} />
                  </button>
                </>
              )}
              {game.step === 1 && (
                <>
                  <p>
                    برنامه پول‌توجیبی مجازی‌ات رو انتخاب کن. همین مقدار وارد کیف
                    پول بازی می‌شه.
                  </p>
                  <div className="gr-options">
                    {[300, 400, 500].map((n) => (
                      <button
                        key={n}
                        className={game.allowance === n ? "selected" : ""}
                        aria-pressed={game.allowance === n}
                        onClick={() => patch({ allowance: n })}
                      >
                        <b>{money(n)} سکه</b>
                        <small>کاملاً مجازی</small>
                      </button>
                    ))}
                  </div>
                  <button
                    className="gr-primary"
                    disabled={!game.allowance}
                    onClick={next}
                  >
                    دریافت و ادامه <ArrowLeft size={16} />
                  </button>
                </>
              )}
              {game.step === 2 && (
                <>
                  <p>
                    {money(game.allowance)} سکه رو تقسیم کن؛ مهارت، در ایستگاه
                    بعد امکان کسب درآمد می‌ده.
                  </p>
                  <label className="gr-slider">
                    پس‌انداز{" "}
                    <b>
                      {money(game.save)}٪ ·{" "}
                      {money((game.allowance * game.save) / 100)} سکه
                    </b>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      value={game.save}
                      onChange={(e) => {
                        const save = +e.target.value;
                        const skill = Math.min(game.skill, 100 - save);
                        patch({ save, skill, spend: 100 - save - skill });
                      }}
                    />
                  </label>
                  <label className="gr-slider">
                    یادگیری مهارت{" "}
                    <b>
                      {money(game.skill)}٪ ·{" "}
                      {money((game.allowance * game.skill) / 100)} سکه
                    </b>
                    <input
                      type="range"
                      min="0"
                      max={100 - game.save}
                      step="5"
                      value={game.skill}
                      onChange={(e) =>
                        patch({
                          skill: +e.target.value,
                          spend: 100 - game.save - +e.target.value,
                        })
                      }
                    />
                  </label>
                  <p className="gr-budget">
                    خرج روزمره: {money(game.spend)}٪ ={" "}
                    {money((game.allowance * game.spend) / 100)} سکه · مجموع:
                    ۱۰۰٪
                  </p>
                  <button className="gr-primary" onClick={next}>
                    نقشه‌ام آماده‌ست <ArrowLeft size={16} />
                  </button>
                </>
              )}
              {game.step === 3 && (
                <>
                  <p>تولد دوستته! هدیه‌ای که دیدی ۸۰ سکه‌ست. چه کار می‌کنی؟</p>
                  <div className="gr-options">
                    {reactions.map((r, i) => (
                      <button
                        key={r.title}
                        disabled={
                          i !== 1 &&
                          (game.allowance * (100 - game.skill)) / 100 <
                            (i === 0 ? 80 : 30)
                        }
                        className={game.reaction === i ? "selected" : ""}
                        aria-pressed={game.reaction === i}
                        onClick={() => patch({ reaction: i })}
                      >
                        <b>{r.title}</b>
                        <small>
                          {i === 1
                            ? `با بودجه مهارت تو: ${money(((game.allowance * game.skill) / 100) * 0.5)} سکه درآمد`
                            : r.detail}
                        </small>
                      </button>
                    ))}
                  </div>
                  <button
                    className="gr-primary"
                    disabled={game.reaction === null}
                    onClick={next}
                  >
                    ببین شهرم چه شکلی شد <ArrowLeft size={16} />
                  </button>
                </>
              )}
              {game.step === 4 && (
                <>
                  <p>
                    شهر تو رشد کرد! هر بار برنامه‌ریزی، یک قدم به{" "}
                    {goals[game.goal].name} نزدیک‌ترت می‌کنه.
                  </p>
                  <div className="gr-results">
                    <div>
                      <b>{money(result.savings)}</b>
                      <span>سکه پس‌انداز</span>
                    </div>
                    <div>
                      <b>{money(result.wallet)}</b>
                      <span>سکه باقی‌مانده خرج</span>
                    </div>
                    <div>
                      <b>{money(result.progress)}٪</b>
                      <span>پیشرفت هدف</span>
                    </div>
                  </div>
                  <progress
                    max="100"
                    value={result.progress}
                    aria-label="پیشرفت هدف"
                  />
                  <p>
                    تا هدف:{" "}
                    {money(
                      Math.max(0, goals[game.goal].price - result.savings),
                    )}{" "}
                    سکه. بودجه مهارت:{" "}
                    {money((game.allowance * game.skill) / 100)} سکه.
                  </p>
                  <button
                    className="gr-primary"
                    onClick={() => {
                      setAlternative(
                        game.reaction === 1 &&
                          (game.allowance * (100 - game.skill)) / 100 >= 30
                          ? 2
                          : 1,
                      );
                      setCompare((v) => !v);
                    }}
                  >
                    اگه جور دیگه انتخاب می‌کردم؟
                  </button>
                  {compare && (
                    <div className="gr-comparison">
                      <label>
                        انتخاب جایگزین{" "}
                        <select
                          value={alternative}
                          onChange={(e) => setAlternative(+e.target.value)}
                        >
                          {reactions.map((r, i) => (
                            <option
                              key={r.title}
                              value={i}
                              disabled={
                                i !== 1 &&
                                (game.allowance * (100 - game.skill)) / 100 <
                                  (i === 0 ? 80 : 30)
                              }
                            >
                              {r.title}
                            </option>
                          ))}
                        </select>
                      </label>
                      <div className="gr-results">
                        <div>
                          <b>{money(result.savings)}</b>
                          <span>پس‌انداز انتخاب اصلی</span>
                        </div>
                        <div>
                          <b>{money(outcome(game, alternative).savings)}</b>
                          <span>پس‌انداز انتخاب جایگزین</span>
                        </div>
                        <div>
                          <b>{money(outcome(game, alternative).progress)}٪</b>
                          <span>پیشرفت جایگزین</span>
                        </div>
                      </div>
                      <p>
                        این فقط مقایسه‌ست؛ انتخاب و پیشرفت اصلی تو تغییر
                        نمی‌کنه.
                      </p>
                    </div>
                  )}
                  <button
                    className="gr-text-button"
                    onClick={() => {
                      setGame(initialGame);
                      setOverview(true);
                      setCompare(false);
                    }}
                  >
                    <RotateCcw size={15} /> شروع یک ماجراجویی تازه
                  </button>
                </>
              )}
              {game.step > 0 && (
                <button
                  className="gr-text-button"
                  onClick={() => travel(game.step - 1)}
                >
                  بازگشت به ایستگاه قبل
                </button>
              )}
            </article>
          )}
          {!overview && !arrived && (
            <p className="gr-travel" role="status">
              گرینو داره به ایستگاه می‌رسه…
            </p>
          )}
        </div>
        <div className="gr-route" id="how">
          <div className="gr-section-title">
            <div>
              <span className="gr-eyebrow">نقشه ماجراجویی تو</span>
              <h2>پنج قدم تا یک فردای سبزتر</h2>
            </div>
            <span>
              {storage
                ? "پیشرفتت روی همین دستگاه ذخیره می‌شه"
                : "ذخیره‌سازی در این مرورگر در دسترس نیست"}
            </span>
          </div>
          <ol className="gr-stations">
            {stations.map((name, i) => (
              <li
                key={name}
                className={
                  i === game.step ? "active" : i < game.unlocked ? "done" : ""
                }
              >
                <button
                  disabled={!loaded || !sceneReady || i > game.unlocked}
                  onClick={() => travel(i)}
                >
                  <span>
                    {i < game.unlocked ? <Check size={18} /> : money(i + 1)}
                  </span>
                  <b>{name}</b>
                  <small>
                    {
                      [
                        "یه رؤیا انتخاب کن",
                        "کیف پولت رو بساز",
                        "به پولت مسیر بده",
                        "تصمیم با توئه",
                        "نتیجه رو کشف کن",
                      ][i]
                    }
                  </small>
                </button>
              </li>
            ))}
          </ol>
        </div>
      </section>
      <footer className="gr-footer">
        <span>
          گرینو، جوانه‌ای برای فردا <span></span>
        </span>
        <p>
          همه مبالغ و رویدادها مجازی‌اند. این بازی آموزشی، حساب یا خدمت بانکی
          فعال نیست.
        </p>
        <Link href="/young">
          بازگشت به گرینو <ArrowLeft size={14} />
        </Link>
      </footer>
    </main>
  );
}
