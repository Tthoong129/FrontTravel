import { useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Place, places } from "./data";
import ReportModal from "./ReportModal";

/* ─────────────────────────────────────────────────────────────────────────────
   PURE CSS — injected via <style> tag
───────────────────────────────────────────────────────────────────────────── */
const STYLE = `
  :root {
    --white:       #FFFFFF;
    --black:       #18181B;
    --text-sub:    #71717A;
    --border:      #E5E7EB;
    --bg-chip:     #F4F4F5;
    --green:       #16A34A;
    --green-light: #DCFCE7;
    --star:        #F59E0B;
    --font: Inter, "SF Pro Text", -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
    --radius-lg:   16px;
    --radius-md:   12px;
    --radius-sm:   8px;
  }

  /* reset minimal */
  .pd *, .pd *::before, .pd *::after { box-sizing: border-box; margin: 0; padding: 0; }
  .pd { font-family: var(--font); background: var(--white); color: var(--black); -webkit-font-smoothing: antialiased; }
  .pd a { color: inherit; text-decoration: none; }
  .pd button { font-family: var(--font); cursor: pointer; }
  .pd img { display: block; }

  /* ── top bar ── */
  .pd-topbar {
    position: sticky; top: 64px; z-index: 100;
    background: rgba(255,255,255,0.92);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--border);
  }
  .pd-topbar-inner {
    max-width: 1120px; margin: 0 auto; padding: 0 24px;
    height: 54px; display: flex; align-items: center; justify-content: space-between;
  }
  .pd-back-btn {
    display: flex; align-items: center; gap: 8px;
    background: none; border: none;
    font-size: 14px; font-weight: 600; color: var(--black);
    transition: opacity .15s;
  }
  .pd-back-btn:hover { opacity: .6; }
  .pd-topbar-right { display: flex; gap: 4px; }
  .pd-icon-btn {
    display: flex; align-items: center; gap: 6px;
    background: none; border: none;
    font-size: 13px; font-weight: 600; color: var(--black);
    padding: 8px 14px; border-radius: var(--radius-sm);
    transition: background .15s;
    text-decoration: underline; text-underline-offset: 3px;
  }
  .pd-icon-btn:hover { background: var(--bg-chip); }

  /* ── wrapper ── */
  .pd-wrap { max-width: 1120px; margin: 0 auto; padding: 0 24px; }

  /* ── Part A : header ── */
  .pd-header { padding: 36px 0 20px; }
  .pd-h1 {
    font-size: 32px; font-weight: 800;
    line-height: 1.2; letter-spacing: -.025em;
    color: var(--black); margin-bottom: 12px;
  }
  .pd-meta {
    display: flex; align-items: center; gap: 6px;
    font-size: 14px; color: var(--black); flex-wrap: wrap;
  }
  .pd-meta-stars { display: flex; align-items: center; gap: 3px; }
  .pd-meta-rating { font-weight: 700; }
  .pd-meta-reviews { color: var(--text-sub); text-decoration: underline; text-underline-offset: 2px; cursor: pointer; }
  .pd-meta-dot { color: var(--border); font-size: 16px; }
  .pd-meta-loc { color: var(--text-sub); }

  /* ── Part A : gallery ── */
  .pd-gallery {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr;
    grid-template-rows: 250px 250px;
    gap: 8px;
    border-radius: var(--radius-lg);
    overflow: hidden;
    position: relative;
    margin-bottom: 0;
  }
  .pd-gallery-cell { overflow: hidden; position: relative; background: var(--bg-chip); }
  .pd-gallery-cell img { width: 100%; height: 100%; object-fit: cover; transition: transform .4s ease; }
  .pd-gallery-cell:hover img { transform: scale(1.04); }
  .pd-gallery-main { grid-column: 1 / 2; grid-row: 1 / 3; }
  .pd-gallery-showbtn {
    position: absolute; bottom: 16px; right: 16px;
    display: flex; align-items: center; gap: 7px;
    padding: 9px 16px; border-radius: var(--radius-sm);
    border: 1.5px solid var(--black);
    background: rgba(255,255,255,0.95);
    font-size: 13px; font-weight: 700; color: var(--black);
    box-shadow: 0 2px 12px rgba(0,0,0,.12);
    transition: box-shadow .15s;
  }
  .pd-gallery-showbtn:hover { box-shadow: 0 4px 24px rgba(0,0,0,.18); }

  /* ── Part B : flex split ── */
  .pd-split { display: flex; gap: 80px; margin-top: 48px; align-items: flex-start; padding-bottom: 80px; }

  /* ── Part B : left column ── */
  .pd-left { flex: 6.5; min-width: 0; }

  .pd-section { padding: 32px 0; border-bottom: 1px solid var(--border); }
  .pd-section:first-child { padding-top: 0; }
  .pd-section:last-child { border-bottom: none; }

  .pd-section-h2 {
    font-size: 22px; font-weight: 700; color: var(--black);
    letter-spacing: -.015em; margin-bottom: 16px;
  }

  /* info rows */
  .pd-info-grid { display: flex; flex-direction: column; gap: 14px; }
  .pd-info-row { display: flex; align-items: flex-start; gap: 14px; }
  .pd-info-icon { color: var(--text-sub); flex-shrink: 0; margin-top: 1px; }
  .pd-info-content {}
  .pd-info-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .07em; color: var(--text-sub); margin-bottom: 2px; }
  .pd-info-value { font-size: 14px; color: var(--black); line-height: 1.5; }

  /* description */
  .pd-desc { font-size: 15px; color: #3F3F46; line-height: 1.8; margin-bottom: 12px; }
  .pd-tags { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 16px; }
  .pd-tag {
    font-size: 13px; font-weight: 500;
    padding: 6px 16px; border-radius: 20px;
    border: 1px solid var(--border); color: var(--black);
    background: var(--white); transition: border-color .15s;
  }
  .pd-tag:hover { border-color: var(--black); }

  /* reviews */
  .pd-rating-row { display: flex; gap: 32px; align-items: center; margin-bottom: 32px; }
  .pd-big-score {
    width: 104px; height: 84px; border-radius: var(--radius-md);
    background: var(--black);
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .pd-big-score-num { font-size: 36px; font-weight: 900; color: #fff; line-height: 1; }
  .pd-big-score-lbl { font-size: 10px; color: rgba(255,255,255,.5); margin-top: 4px; letter-spacing: .04em; text-transform: uppercase; }
  .pd-bars { flex: 1; display: flex; flex-direction: column; gap: 9px; }
  .pd-bar-row { display: flex; align-items: center; gap: 10px; }
  .pd-bar-n { font-size: 13px; color: var(--text-sub); width: 10px; text-align: right; flex-shrink: 0; }
  .pd-bar-track { flex: 1; height: 4px; background: var(--border); border-radius: 2px; overflow: hidden; }
  .pd-bar-fill { height: 100%; background: var(--black); border-radius: 2px; }

  /* review item */
  .pd-review { padding: 24px 0; border-bottom: 1px solid var(--border); }
  .pd-review:last-of-type { border-bottom: none; }
  .pd-review-top { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 10px; }
  .pd-review-author { display: flex; align-items: center; gap: 12px; }
  .pd-avatar {
    width: 42px; height: 42px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 13px; font-weight: 800; color: #fff; flex-shrink: 0;
  }
  .pd-author-name { font-size: 14px; font-weight: 700; color: var(--black); margin-bottom: 2px; }
  .pd-author-sub  { font-size: 12px; color: var(--text-sub); }
  .pd-review-stars-row { display: flex; align-items: center; gap: 5px; margin-bottom: 8px; }
  .pd-review-text { font-size: 14px; color: #3F3F46; line-height: 1.7; margin-bottom: 12px; }
  .pd-review-photos { display: flex; gap: 8px; margin-bottom: 12px; }
  .pd-review-thumb {
    width: 76px; height: 76px; border-radius: 10px;
    overflow: hidden; border: 1px solid var(--border);
  }
  .pd-review-thumb img { width: 100%; height: 100%; object-fit: cover; }
  .pd-helpful-btn {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 6px 14px; border-radius: 20px;
    border: 1.5px solid var(--border);
    font-size: 12px; font-weight: 600; color: var(--text-sub);
    background: var(--white); transition: all .15s;
  }
  .pd-helpful-btn:hover, .pd-helpful-btn.active { border-color: var(--black); color: var(--black); background: var(--bg-chip); }
  .pd-see-all-btn {
    display: block; width: 100%; margin-top: 24px;
    padding: 15px; border-radius: var(--radius-sm);
    border: 1.5px solid var(--black); background: var(--white);
    font-size: 14px; font-weight: 700; color: var(--black);
    transition: background .15s;
  }
  .pd-see-all-btn:hover { background: var(--bg-chip); }

  /* ── Part B : right sidebar ── */
  .pd-right { flex: 3.5; min-width: 0; }
  .pd-card {
    position: sticky; top: 132px;
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    box-shadow: 0 2px 8px rgba(0,0,0,.04), 0 12px 36px rgba(0,0,0,.08);
    overflow: hidden;
    background: var(--white);
  }
  .pd-card-map { height: 200px; position: relative; }
  .pd-card-map-overlay {
    position: absolute; inset: 0;
    background: transparent;
    cursor: pointer; z-index: 400;
    display: flex; align-items: flex-end; justify-content: flex-end;
    padding: 10px;
  }
  .pd-map-open-btn {
    display: flex; align-items: center; gap: 5px;
    padding: 7px 13px; border-radius: var(--radius-sm); border: none;
    background: rgba(255,255,255,.9);
    font-size: 12px; font-weight: 700; color: var(--black);
    box-shadow: 0 2px 10px rgba(0,0,0,.14);
  }
  .pd-card-body { padding: 24px; }
  .pd-card-price { font-size: 24px; font-weight: 900; color: var(--black); margin-bottom: 4px; }
  .pd-card-price-sub { font-size: 13px; color: var(--text-sub); margin-bottom: 18px; }
  .pd-card-divider { border: none; border-top: 1px solid var(--border); margin: 16px 0; }
  .pd-card-meta { display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px; }
  .pd-card-meta-row { display: flex; align-items: center; justify-content: space-between; font-size: 13px; }
  .pd-card-meta-key { display: flex; align-items: center; gap: 7px; color: var(--text-sub); }
  .pd-open-badge { font-size: 12px; font-weight: 700; padding: 3px 10px; border-radius: 20px; background: var(--green-light); color: var(--green); }
  .pd-closed-badge { font-size: 12px; font-weight: 700; padding: 3px 10px; border-radius: 20px; background: var(--bg-chip); color: var(--text-sub); }
  .pd-cta-btn {
    display: block; width: 100%;
    padding: 16px; border-radius: var(--radius-sm); border: none;
    background: var(--black); color: #fff;
    font-size: 15px; font-weight: 800; letter-spacing: -.01em;
    transition: opacity .15s; margin-bottom: 10px;
  }
  .pd-cta-btn:hover { opacity: .82; }
  .pd-card-actions { display: flex; gap: 8px; }
  .pd-card-action {
    flex: 1; padding: 11px 0; border-radius: var(--radius-sm);
    border: 1.5px solid var(--border); background: var(--white);
    font-size: 13px; font-weight: 700; color: var(--black);
    display: flex; align-items: center; justify-content: center; gap: 6px;
    transition: border-color .15s, background .15s;
    cursor: pointer; white-space: nowrap;
  }
  .pd-card-action:hover { border-color: var(--black); background: var(--bg-chip); }
  .pd-card-action:hover { border-color: var(--black); }
  .pd-card-action.saved { background: #FFF0F3; border-color: #F87171; color: #DC2626; }
  .pd-card-note { text-align: center; font-size: 11px; color: var(--text-sub); margin-top: 14px; }

  /* ── Part C : related ── */
  .pd-related { border-top: 1px solid var(--border); }
  .pd-related-inner { max-width: 1120px; margin: 0 auto; padding: 56px 24px 80px; }
  .pd-related-h2 {
    font-size: 26px; font-weight: 800; color: var(--black);
    letter-spacing: -.02em; margin-bottom: 28px;
  }
  .pd-related-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 24px;
  }
  .pd-related-card { cursor: pointer; }
  .pd-related-img {
    width: 100%; aspect-ratio: 1 / 1;
    border-radius: var(--radius-md);
    overflow: hidden; background: var(--bg-chip);
    margin-bottom: 12px; position: relative;
  }
  .pd-related-img img { width: 100%; height: 100%; object-fit: cover; transition: transform .4s; }
  .pd-related-card:hover .pd-related-img img { transform: scale(1.07); }
  .pd-related-badge {
    position: absolute; top: 10px; left: 10px;
    font-size: 10px; font-weight: 700; padding: 3px 8px; border-radius: 20px;
    background: rgba(255,255,255,0.9); color: var(--black);
  }
  .pd-related-name { font-size: 14px; font-weight: 700; color: var(--black); margin-bottom: 4px; line-height: 1.35; }
  .pd-related-loc  { font-size: 13px; color: var(--text-sub); margin-bottom: 5px; }
  .pd-related-foot { display: flex; align-items: center; justify-content: space-between; }
  .pd-related-stars{ display: flex; align-items: center; gap: 4px; font-size: 13px; font-weight: 600; color: var(--black); }
  .pd-related-price{ font-size: 13px; color: var(--text-sub); }
`;

/* ─────────────────────────────────────────────────────────────────────────────
   DATA
───────────────────────────────────────────────────────────────────────────── */
const GALLERY_IMGS = [
  /* main */ "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=900&h=600&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=300&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=300&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600&h=300&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?w=600&h=300&fit=crop&auto=format",
];

const REVIEWS = [
  { id:1, name:"Minh Tuấn", init:"MT", city:"Hà Nội", ago:"2 ngày trước", rating:5, color:"#064E3B",
    text:"Thực sự xuất sắc! Đây là lần thứ ba tôi quay lại mà vẫn không khỏi ngạc nhiên. Phục vụ nhiệt tình, hương vị chuẩn truyền thống. Không gian sạch thoáng.",
    photos:["https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=200&h=200&fit=crop","https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&h=200&fit=crop"], helpful:24 },
  { id:2, name:"Thu Hà", init:"TH", city:"TP. Hồ Chí Minh", ago:"1 tuần trước", rating:5, color:"#92400E",
    text:"Chất lượng ổn định qua nhiều năm. Hoàn toàn xứng đáng với danh tiếng. Nên đặt chỗ trước vì thường xuyên đông khách.",
    photos:["https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200&h=200&fit=crop"], helpful:18 },
  { id:3, name:"Quốc Bảo", init:"QB", city:"Đà Nẵng", ago:"2 tuần trước", rating:4, color:"#1E40AF",
    text:"Ngon và rẻ. Cuối tuần hơi đông nên nên đến sớm. Nhân viên thân thiện, không gian thoải mái.",
    photos:[], helpful:9 },
  { id:4, name:"Lan Anh", init:"LA", city:"Huế", ago:"3 tuần trước", rating:5, color:"#6D28D9",
    text:"Trải nghiệm tuyệt vời từ đầu đến cuối. Không gian ấm cúng, món ăn đúng vị. Đây sẽ là điểm đến ruột của mình.",
    photos:["https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=200&h=200&fit=crop"], helpful:31 },
];

/* ─────────────────────────────────────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────────────────────────────────────── */
function isOpen(h: string) {
  if (h === "Cả ngày") return true;
  const m = h.match(/(\d+):(\d+)\s*[–-]\s*(\d+):(\d+)/);
  if (!m) return false;
  const now = new Date(), c = now.getHours() * 60 + now.getMinutes();
  return c >= +m[1] * 60 + +m[2] && c <= +m[3] * 60 + +m[4];
}

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg width={13} height={13} viewBox="0 0 24 24" fill={filled ? "#F59E0B" : "#E5E7EB"}>
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
    </svg>
  );
}
function Stars({ n }: { n: number }) {
  return <span style={{ display:"inline-flex", gap:2 }}>{[1,2,3,4,5].map(s=><StarIcon key={s} filled={s<=Math.round(n)}/>)}</span>;
}

/* ─────────────────────────────────────────────────────────────────────────────
   COMPONENT
───────────────────────────────────────────────────────────────────────────── */
export default function PlaceDetailPage({
  place, onBack, onViewMap, onSelectPlace,
}: {
  place: Place; onBack:()=>void; onViewMap:()=>void; onSelectPlace:(p:Place)=>void;
}) {
  const [saved, setSaved] = useState(false);
  const [liked, setLiked] = useState<Set<number>>(new Set());
  const [showReport, setShowReport] = useState(false);
  const open = isOpen(place.hours);
  const related = places.filter(p => p.id !== place.id && p.region === place.region).slice(0, 4);
  const imgs = [place.img, ...GALLERY_IMGS.slice(1)];

  const toggleLike = (id: number) => setLiked(prev => {
    const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n;
  });

  /* rating bar distribution */
  const p5 = Math.min(84, Math.max(52, Math.round((place.rating-3.5)/1.5*75+12)));
  const p4 = Math.min(28, 96-p5-10);
  const p3 = Math.max(2, 96-p5-p4-6);
  const bars = [{n:5,pct:p5},{n:4,pct:p4},{n:3,pct:p3},{n:2,pct:3},{n:1,pct:2}];

  return (
    <div className="pd">
      <style>{STYLE}</style>

      {showReport && <ReportModal placeName={place.name} onClose={() => setShowReport(false)} />}

      {/* ──────────────── PART A ──────────────── */}
      <div className="pd-wrap">

        {/* Header */}
        <div className="pd-header">
          <h1 className="pd-h1">{place.name}</h1>
          <div className="pd-meta">
            <div className="pd-meta-stars">
              <svg width={14} height={14} viewBox="0 0 24 24" fill="#F59E0B"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              <span className="pd-meta-rating">{place.rating}</span>
            </div>
            <span className="pd-meta-reviews">({place.reviews.toLocaleString()} đánh giá)</span>
            <span className="pd-meta-dot">•</span>
            <span className="pd-meta-loc">{place.location}</span>
            <span className="pd-meta-dot">•</span>
            <span className="pd-meta-loc">{place.priceRange}</span>
          </div>
        </div>

        {/* Gallery */}
        <div className="pd-gallery">
          {/* main photo */}
          <div className="pd-gallery-cell pd-gallery-main">
            <img src={imgs[0]} alt={place.name}
              onError={e=>{(e.target as HTMLImageElement).src=GALLERY_IMGS[0];}}/>
          </div>
          {/* 4 thumbnails */}
          {imgs.slice(1,5).map((src,i)=>(
            <div key={i} className="pd-gallery-cell">
              <img src={src} alt="" onError={e=>{(e.target as HTMLImageElement).src=GALLERY_IMGS[(i+1)%GALLERY_IMGS.length];}}/>
            </div>
          ))}
          <button className="pd-gallery-showbtn">
            <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><rect x={3} y={3} width={18} height={18} rx={2}/><circle cx={8.5} cy={8.5} r={1.5}/><path d="m21 15-5-5L5 21"/></svg>
            Xem tất cả ảnh
          </button>
        </div>

        {/* ──────────────── PART B ──────────────── */}
        <div className="pd-split">

          {/* Left column */}
          <div className="pd-left">

            {/* Thông tin */}
            <div className="pd-section">
              <h2 className="pd-section-h2">Thông tin</h2>
              <div className="pd-info-grid">
                {[
                  { label:"Địa chỉ", value: place.location + ", " + place.province,
                    icon:<svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx={12} cy={10} r={3}/></svg> },
                  { label:"Giờ hoạt động", value: place.hours,
                    icon:<svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><circle cx={12} cy={12} r={10}/><path d="M12 6v6l4 2"/></svg> },
                  { label:"Khoảng giá", value: place.price,
                    icon:<svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><line x1={12} y1={1} x2={12} y2={23}/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg> },
                  { label:"Phân loại", value: place.type + " · " + place.category,
                    icon:<svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><path d="M4 6h16M4 12h16M4 18h7"/></svg> },
                ].map(row=>(
                  <div key={row.label} className="pd-info-row">
                    <span className="pd-info-icon">{row.icon}</span>
                    <div className="pd-info-content">
                      <p className="pd-info-label">{row.label}</p>
                      <p className="pd-info-value">{row.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Giới thiệu */}
            <div className="pd-section">
              <h2 className="pd-section-h2">Giới thiệu</h2>
              <p className="pd-desc">{place.desc}</p>
              <p className="pd-desc">Tọa lạc tại {place.location}, đây là điểm đến được lòng cả người địa phương lẫn du khách trong khu vực {place.province}. Phù hợp cho gia đình, nhóm bạn và các cuộc gặp gỡ đối tác — hội tụ tinh hoa ẩm thực {place.region}.</p>
              <div className="pd-tags">
                {place.tags.map(t=><span key={t} className="pd-tag">{t}</span>)}
              </div>
            </div>

            {/* Đánh giá */}
            <div className="pd-section" id="reviews">
              <h2 className="pd-section-h2">Đánh giá</h2>

              {/* Overview */}
              <div className="pd-rating-row">
                <div className="pd-big-score">
                  <span className="pd-big-score-num">{place.rating}</span>
                  <span className="pd-big-score-lbl">/ 5 sao</span>
                </div>
                <div className="pd-bars">
                  {bars.map(b=>(
                    <div key={b.n} className="pd-bar-row">
                      <span className="pd-bar-n">{b.n}</span>
                      <div className="pd-bar-track">
                        <div className="pd-bar-fill" style={{width:`${b.pct}%`}}/>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Review list */}
              {REVIEWS.map(r=>(
                <div key={r.id} className="pd-review">
                  <div className="pd-review-top">
                    <div className="pd-review-author">
                      <div className="pd-avatar" style={{background:r.color}}>{r.init}</div>
                      <div>
                        <p className="pd-author-name">{r.name}</p>
                        <p className="pd-author-sub">{r.city} · {r.ago}</p>
                      </div>
                    </div>
                    <div className="pd-review-stars-row">
                      <Stars n={r.rating}/>
                    </div>
                  </div>
                  <p className="pd-review-text">{r.text}</p>
                  {r.photos.length > 0 && (
                    <div className="pd-review-photos">
                      {r.photos.map((src,i)=>(
                        <div key={i} className="pd-review-thumb">
                          <img src={src} alt="" onError={e=>{(e.target as HTMLImageElement).src=GALLERY_IMGS[0];}}/>
                        </div>
                      ))}
                    </div>
                  )}
                  <button
                    className={`pd-helpful-btn${liked.has(r.id)?" active":""}`}
                    onClick={()=>toggleLike(r.id)}
                  >
                    <svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>
                    Hữu ích · {liked.has(r.id) ? r.helpful+1 : r.helpful}
                  </button>
                </div>
              ))}

              <button className="pd-see-all-btn">
                Xem tất cả {place.reviews.toLocaleString()} đánh giá
              </button>
            </div>

          </div>{/* /pd-left */}

          {/* Right sidebar */}
          <div className="pd-right">
            <div className="pd-card">

              {/* Map */}
              <div className="pd-card-map">
                <MapContainer
                  center={[place.lat, place.lng]} zoom={14}
                  style={{height:"100%",width:"100%"}}
                  zoomControl={false} scrollWheelZoom={false} dragging={false}
                  attributionControl={false}
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                  <CircleMarker center={[place.lat,place.lng]} radius={11}
                    pathOptions={{fillColor:"#18181B",fillOpacity:1,color:"#fff",weight:2.5}}>
                    <Popup>{place.name}</Popup>
                  </CircleMarker>
                </MapContainer>
                <div className="pd-card-map-overlay" onClick={onViewMap}>
                  <button className="pd-map-open-btn" onClick={onViewMap}>
                    <svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>
                    Mở bản đồ lớn
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="pd-card-body">
                <p className="pd-card-price">{place.price}</p>
                <p className="pd-card-price-sub">{place.priceRange} · {place.category}</p>

                <div className="pd-card-meta">
                  <div className="pd-card-meta-row">
                    <span className="pd-card-meta-key">
                      <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="#71717A" strokeWidth={2} strokeLinecap="round"><circle cx={12} cy={12} r={10}/><path d="M12 6v6l4 2"/></svg>
                      {place.hours}
                    </span>
                    <span className={open?"pd-open-badge":"pd-closed-badge"}>
                      {open?"Đang mở cửa":"Đóng cửa"}
                    </span>
                  </div>
                  <div className="pd-card-meta-row">
                    <span className="pd-card-meta-key">
                      <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="#71717A" strokeWidth={2} strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx={12} cy={10} r={3}/></svg>
                      {place.location}
                    </span>
                  </div>
                  <div className="pd-card-meta-row">
                    <span className="pd-card-meta-key">
                      <svg width={12} height={12} viewBox="0 0 24 24" fill="#F59E0B"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                      <strong style={{color:"#18181B"}}>{place.rating}</strong>
                      <span style={{color:"#71717A"}}>· {place.reviews.toLocaleString()} đánh giá</span>
                    </span>
                  </div>
                </div>

                <hr className="pd-card-divider"/>

                <button className="pd-cta-btn">Chỉ đường</button>

                <div className="pd-card-actions">
                  <button
                    className={`pd-card-action${saved?" saved":""}`}
                    onClick={()=>setSaved(v=>!v)}
                  >
                    <svg width={13} height={13} viewBox="0 0 24 24" fill={saved?"#DC2626":"none"} stroke={saved?"#DC2626":"currentColor"} strokeWidth={2} strokeLinecap="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                    {saved?"Đã lưu":"Lưu lại"}
                  </button>
                  <button className="pd-card-action">
                    <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><circle cx={18} cy={5} r={3}/><circle cx={6} cy={12} r={3}/><circle cx={18} cy={19} r={3}/><path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98"/></svg>
                    Chia sẻ
                  </button>
                  <button className="pd-card-action" onClick={() => setShowReport(true)}>
                    <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1={4} y1={22} x2={4} y2={15}/></svg>
                    Báo cáo
                  </button>
                </div>

                <p className="pd-card-note">Thông tin chỉ mang tính tham khảo</p>
              </div>
            </div>
          </div>

        </div>{/* /pd-split */}
      </div>{/* /pd-wrap */}

      {/* ──────────────── PART C : Related ──────────────── */}
      {related.length > 0 && (
        <div className="pd-related">
          <div className="pd-related-inner">
            <h2 className="pd-related-h2">Có thể bạn sẽ thích</h2>
            <div className="pd-related-grid">
              {related.map(p=>(
                <div key={p.id} className="pd-related-card" onClick={()=>onSelectPlace(p)}>
                  <div className="pd-related-img">
                    <img src={p.img} alt={p.name}
                      onError={e=>{(e.target as HTMLImageElement).src=GALLERY_IMGS[0];}}/>
                    <span className="pd-related-badge">{p.type}</span>
                  </div>
                  <p className="pd-related-name">{p.name}</p>
                  <p className="pd-related-loc">{p.location}</p>
                  <div className="pd-related-foot">
                    <span className="pd-related-stars">
                      <svg width={12} height={12} viewBox="0 0 24 24" fill="#F59E0B"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                      {p.rating}
                    </span>
                    <span className="pd-related-price">{p.price}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
