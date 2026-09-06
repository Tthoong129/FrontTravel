import { Place, places } from "./data";

/* ── CSS ─────────────────────────────────────────────────────────────────── */
const STYLE = `
  :root {
    --fp-black:  #18181B;
    --fp-sub:    #71717A;
    --fp-border: #E5E7EB;
    --fp-bg:     #F3F4F6;
    --fp-font:   Inter, "SF Pro Text", system-ui, sans-serif;
  }
  .fp *, .fp *::before, .fp *::after { box-sizing: border-box; margin: 0; padding: 0; }
  .fp { font-family: var(--fp-font); background: #fff; color: var(--fp-black); -webkit-font-smoothing: antialiased; }
  .fp-wrap { max-width: 1200px; margin: 0 auto; padding: 0 32px; }

  /* ── hero ── */
  .fp-hero { text-align: center; padding: 72px 32px 56px; max-width: 1200px; margin: 0 auto; }
  .fp-hero-h1 { font-size: clamp(48px, 7vw, 80px); font-weight: 900; letter-spacing: -.04em; line-height: 1.05; color: var(--fp-black); margin-bottom: 16px; }
  .fp-hero-sub { font-size: 18px; color: var(--fp-sub); max-width: 520px; margin: 0 auto 48px; line-height: 1.6; }

  /* ── categories ── */
  .fp-cats { display: flex; gap: 28px; justify-content: center; flex-wrap: wrap; }
  .fp-cat { display: flex; flex-direction: column; align-items: center; gap: 10px; cursor: pointer; }
  .fp-cat-circle {
    width: 72px; height: 72px; border-radius: 50%;
    border: 1.5px solid var(--fp-border);
    background: #fff;
    display: flex; align-items: center; justify-content: center;
    transition: transform .2s ease, box-shadow .2s ease;
  }
  .fp-cat:hover .fp-cat-circle { transform: translateY(-5px); box-shadow: 0 8px 24px rgba(0,0,0,.10); }
  .fp-cat-label { font-size: 12px; font-weight: 600; color: var(--fp-black); }

  /* ── section header ── */
  .fp-section { padding: 64px 0 0; }
  .fp-section-head { display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 24px; }
  .fp-section-h2 { font-size: 26px; font-weight: 800; letter-spacing: -.02em; color: var(--fp-black); }
  .fp-section-link { font-size: 14px; font-weight: 600; color: var(--fp-black); text-decoration: underline; text-underline-offset: 3px; cursor: pointer; }

  /* ── horizontal scroll ── */
  .fp-hscroll {
    display: flex; gap: 16px;
    overflow-x: auto; scroll-snap-type: x mandatory;
    scrollbar-width: none; padding-bottom: 8px;
  }
  .fp-hscroll::-webkit-scrollbar { display: none; }

  /* ── food card (3:4 portrait) ── */
  .fp-food-card {
    flex-shrink: 0; width: 210px; aspect-ratio: 3/4;
    border-radius: 14px; overflow: hidden;
    position: relative; cursor: pointer;
    scroll-snap-align: start;
    background: var(--fp-bg);
  }
  .fp-food-card img { width: 100%; height: 100%; object-fit: cover; transition: transform .45s ease; display: block; }
  .fp-food-card:hover img { transform: scale(1.06); }
  .fp-food-card-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(to top, rgba(0,0,0,.72) 0%, rgba(0,0,0,.18) 45%, transparent 70%);
    pointer-events: none;
  }
  .fp-food-card-body { position: absolute; bottom: 0; left: 0; right: 0; padding: 16px 14px; }
  .fp-food-card-region { font-size: 10px; font-weight: 700; color: rgba(255,255,255,.65); text-transform: uppercase; letter-spacing: .07em; margin-bottom: 4px; }
  .fp-food-card-name { font-size: 16px; font-weight: 700; color: #fff; line-height: 1.3; }

  /* ── collection grid ── */
  .fp-collection-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
  .fp-collection-item {
    height: 260px; border-radius: 18px; overflow: hidden;
    position: relative; cursor: pointer; background: var(--fp-bg);
  }
  .fp-collection-item img { width: 100%; height: 100%; object-fit: cover; transition: transform .45s; display: block; }
  .fp-collection-item:hover img { transform: scale(1.04); }
  .fp-collection-item-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(0,0,0,.55) 0%, rgba(0,0,0,.1) 100%);
  }
  .fp-collection-item-body { position: absolute; bottom: 0; left: 0; padding: 24px; }
  .fp-collection-item-eyebrow { font-size: 11px; font-weight: 700; color: rgba(255,255,255,.6); text-transform: uppercase; letter-spacing: .08em; margin-bottom: 8px; }
  .fp-collection-item-title { font-size: 22px; font-weight: 800; color: #fff; line-height: 1.25; max-width: 280px; letter-spacing: -.01em; }

  /* ── nearby grid ── */
  .fp-nearby-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }
  .fp-nearby-card { cursor: pointer; }
  .fp-nearby-img {
    width: 100%; aspect-ratio: 1 / 1;
    border-radius: 14px; overflow: hidden;
    background: var(--fp-bg); margin-bottom: 12px; position: relative;
  }
  .fp-nearby-img img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform .4s; }
  .fp-nearby-card:hover .fp-nearby-img img { transform: scale(1.07); }
  .fp-nearby-badge {
    position: absolute; top: 10px; right: 10px;
    font-size: 10px; font-weight: 700; padding: 3px 9px; border-radius: 20px;
    background: rgba(255,255,255,.9); color: var(--fp-black);
  }
  .fp-nearby-name { font-size: 14px; font-weight: 700; color: var(--fp-black); margin-bottom: 4px; }
  .fp-nearby-rating { display: flex; align-items: center; gap: 4px; font-size: 13px; color: var(--fp-black); font-weight: 600; margin-bottom: 3px; }
  .fp-nearby-price { font-size: 13px; color: var(--fp-sub); }

  /* ── bottom padding ── */
  .fp-bottom { height: 80px; }
`;

/* ── DATA ───────────────────────────────────────────────────────────────── */
const CATEGORIES = [
  { label: "Cà phê", icon: <svg width={26} height={26} viewBox="0 0 24 24" fill="none" stroke="#18181B" strokeWidth={1.8} strokeLinecap="round"><path d="M17 8h1a4 4 0 0 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V8z"/><line x1={6} y1={2} x2={6} y2={4}/><line x1={10} y1={2} x2={10} y2={4}/><line x1={14} y1={2} x2={14} y2={4}/></svg> },
  { label: "Ăn vặt", icon: <svg width={26} height={26} viewBox="0 0 24 24" fill="none" stroke="#18181B" strokeWidth={1.8} strokeLinecap="round"><path d="M4 11h16M4 6l8-3 8 3M6 11v7a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-7"/></svg> },
  { label: "Nhà hàng", icon: <svg width={26} height={26} viewBox="0 0 24 24" fill="none" stroke="#18181B" strokeWidth={1.8} strokeLinecap="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7"/></svg> },
  { label: "Quán chay", icon: <svg width={26} height={26} viewBox="0 0 24 24" fill="none" stroke="#18181B" strokeWidth={1.8} strokeLinecap="round"><path d="M12 2a10 10 0 0 1 10 10c0 5.52-4.48 10-10 10S2 17.52 2 12"/><path d="M12 6c-2.67 4-4 6.67-4 10"/><path d="M12 6c2.67 4 4 6.67 4 10"/><path d="M8 12h8"/></svg> },
  { label: "Tráng miệng", icon: <svg width={26} height={26} viewBox="0 0 24 24" fill="none" stroke="#18181B" strokeWidth={1.8} strokeLinecap="round"><path d="M12 2c-5.33 4-8 8-8 12a8 8 0 0 0 16 0c0-4-2.67-8-8-12z"/></svg> },
  { label: "Đặc sản", icon: <svg width={26} height={26} viewBox="0 0 24 24" fill="none" stroke="#18181B" strokeWidth={1.8} strokeLinecap="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> },
];

const FOOD_CARDS = [
  { name: "Phở bò Hà Nội", region: "Miền Bắc", img: "https://images.unsplash.com/photo-1527997921830-de1cf1f9b430?w=400&h=530&fit=crop&auto=format" },
  { name: "Bún chả Hà Nội", region: "Miền Bắc", img: "https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=400&h=530&fit=crop&auto=format" },
  { name: "Bánh mì Hội An", region: "Miền Trung", img: "https://images.unsplash.com/photo-1517433367423-c7e5b0f35086?w=400&h=530&fit=crop&auto=format" },
  { name: "Cơm tấm Sài Gòn", region: "Miền Nam", img: "https://images.unsplash.com/photo-1718942900279-4711345169d3?w=400&h=530&fit=crop&auto=format" },
  { name: "Bún bò Huế", region: "Miền Trung", img: "https://images.unsplash.com/photo-1509072619873-adb3dc289b50?w=400&h=530&fit=crop&auto=format" },
  { name: "Mì Quảng", region: "Miền Trung", img: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400&h=530&fit=crop&auto=format" },
  { name: "Bánh xèo giòn", region: "Miền Nam", img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=530&fit=crop&auto=format" },
  { name: "Cao lầu Hội An", region: "Miền Trung", img: "https://images.unsplash.com/photo-1552611052-33e04de081de?w=400&h=530&fit=crop&auto=format" },
];

const COLLECTIONS = [
  { eyebrow: "Bộ sưu tập · Bờ biển", title: "Top 10 quán view biển đẹp nhất Việt Nam", img: "https://images.unsplash.com/photo-1559847844-5315695dadae?w=800&h=400&fit=crop&auto=format" },
  { eyebrow: "Hành trình ẩm thực · Hội An", title: "15 món ăn không thể bỏ lỡ khi đến phố cổ", img: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=400&fit=crop&auto=format" },
];

function StarSVG() {
  return <svg width={12} height={12} viewBox="0 0 24 24" fill="#F59E0B"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>;
}

/* ── COMPONENT ──────────────────────────────────────────────────────────── */
export default function FoodPage({ onSelectPlace }: { onSelectPlace: (p: Place) => void }) {
  const foodPlaces = places.filter(p => p.type === "Ăn uống");

  return (
    <div className="fp">
      <style>{STYLE}</style>

      {/* ── Hero ── */}
      <div className="fp-hero">
        <h1 className="fp-hero-h1">Hôm nay ăn gì?</h1>
        <p className="fp-hero-sub">Khám phá hàng ngàn món ngon, quán ăn đặc sắc từ Ba Miền Việt Nam</p>
        <div className="fp-cats">
          {CATEGORIES.map(c => (
            <div key={c.label} className="fp-cat">
              <div className="fp-cat-circle">{c.icon}</div>
              <span className="fp-cat-label">{c.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Section 1 – Đặc sản địa phương ── */}
      <div className="fp-wrap">
        <div className="fp-section">
          <div className="fp-section-head">
            <h2 className="fp-section-h2">Đặc sản địa phương</h2>
            <span className="fp-section-link">Xem tất cả →</span>
          </div>
          <div className="fp-hscroll">
            {FOOD_CARDS.map((fc, i) => (
              <div key={i} className="fp-food-card">
                <img src={fc.img} alt={fc.name} onError={e=>{(e.target as HTMLImageElement).src=FOOD_CARDS[0].img;}}/>
                <div className="fp-food-card-overlay"/>
                <div className="fp-food-card-body">
                  <p className="fp-food-card-region">{fc.region}</p>
                  <p className="fp-food-card-name">{fc.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Section 2 – Bộ sưu tập nổi bật ── */}
        <div className="fp-section">
          <div className="fp-section-head">
            <h2 className="fp-section-h2">Bộ sưu tập nổi bật</h2>
            <span className="fp-section-link">Xem tất cả →</span>
          </div>
          <div className="fp-collection-grid">
            {COLLECTIONS.map((col, i) => (
              <div key={i} className="fp-collection-item">
                <img src={col.img} alt={col.title} onError={e=>{(e.target as HTMLImageElement).src=FOOD_CARDS[0].img;}}/>
                <div className="fp-collection-item-overlay"/>
                <div className="fp-collection-item-body">
                  <p className="fp-collection-item-eyebrow">{col.eyebrow}</p>
                  <p className="fp-collection-item-title">{col.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Section 3 – Quán ngon quanh đây ── */}
        <div className="fp-section">
          <div className="fp-section-head">
            <h2 className="fp-section-h2">Quán ngon quanh đây</h2>
            <span className="fp-section-link">Xem tất cả →</span>
          </div>
          <div className="fp-nearby-grid">
            {foodPlaces.slice(0, 8).map(p => (
              <div key={p.id} className="fp-nearby-card" onClick={() => onSelectPlace(p)}>
                <div className="fp-nearby-img">
                  <img src={p.img} alt={p.name} onError={e=>{(e.target as HTMLImageElement).src=FOOD_CARDS[0].img;}}/>
                  <span className="fp-nearby-badge">{p.status === "Đang mở" ? "Mở cửa" : "Đóng cửa"}</span>
                </div>
                <p className="fp-nearby-name">{p.name}</p>
                <div className="fp-nearby-rating">
                  <StarSVG/> {p.rating}
                  <span style={{fontWeight:400, color:"#71717A", marginLeft:2}}>({p.reviews.toLocaleString()})</span>
                </div>
                <p className="fp-nearby-price">{p.price}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="fp-bottom"/>
    </div>
  );
}
