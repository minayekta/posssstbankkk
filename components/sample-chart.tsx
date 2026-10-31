import data from "@/data/content.json";

export function SampleChart({ compact = false }: { compact?: boolean }) {
  const values = data.investorChart;
  const points = values.map((value, index) => `${28 + index * 49},${178 - value * 1.55}`).join(" ");
  const fill = `28,185 ${points} 567,185`;
  return <div className={`sample-chart ${compact ? "sample-chart-compact" : ""}`}>
    <div className="sample-chart-head"><span>نمای روند <strong>داده نمونه</strong></span><span className="chart-legend"><i/> نمودار آزمایشی</span></div>
    <svg viewBox="0 0 595 205" role="img" aria-label="نمودار خطی نمایشی با روند کلی صعودی، فاقد داده واقعی بازار">
      <defs><linearGradient id="postbank-chart-gradient" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#32aa75" stopOpacity=".32"/><stop offset="100%" stopColor="#ffffff" stopOpacity="0"/></linearGradient></defs>
      {[40,85,130,175].map(y=><line className="chart-grid" key={y} x1="28" x2="567" y1={y} y2={y} stroke="#dce9e2" strokeDasharray="4 7"/>)}
      <polygon className="chart-area" points={fill} opacity=".7"/>
      <polyline className="chart-line" points={points} fill="none" stroke="#0a754f" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
      <circle className="chart-point" cx="567" cy={178-values.at(-1)!*1.55} r="7" fill="#0a754f" stroke="white" strokeWidth="4"/>
    </svg>
    <div className="sample-chart-axis"><span>ابتدای بازه نمونه</span><span>انتهای بازه نمونه</span></div>
    <small>این اعداد ساختگی‌اند و قیمت سهام یا داده رسمی بانک را نشان نمی‌دهند.</small>
  </div>;
}
