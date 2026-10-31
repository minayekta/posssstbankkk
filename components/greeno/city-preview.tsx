import { stations } from '@/lib/greeno';

// This lightweight preview keeps the route usable if a GPU context is unavailable.
// The full experience is still rendered by Three.js whenever it can initialize.
export default function CityPreview({ retry, webglUnavailable = false }: { retry: () => void; webglUnavailable?: boolean }) {
  return <div className="gr-preview">
    <div className="gr-preview-city" aria-label="نمای سبک شهر گرینو">
      {stations.map((name, index) => <div className={`gr-preview-island island-${index}`} key={name}>
        <div className="gr-preview-tower"/><div className="gr-preview-tower small"/>
        <span>{(index + 1).toLocaleString('fa-IR')}</span>
      </div>)}
    </div>
    <div className="gr-preview-note"><b>{webglUnavailable ? 'دسترسی به WebGL2 برقرار نشد' : 'نمای سبک شهر فعال است'}</b><p>{webglUnavailable ? 'شتاب‌دهی گرافیکی Chrome یا درایور گرافیک را بررسی کن؛ همه مراحل بازی همچنان در دسترس‌اند.' : 'صحنه گرافیکی بارگذاری نشد؛ همه مراحل بازی در دسترس‌اند.'}</p><button onClick={retry}>تلاش دوباره برای نمای سه‌بعدی</button></div>
  </div>;
}
