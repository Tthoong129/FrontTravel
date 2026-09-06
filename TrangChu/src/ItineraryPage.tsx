import { useState } from "react";

/* ── CSS ─────────────────────────────────────────────────────────────────── */
const STYLE = `
  :root {
    --ip-black:  #18181B;
    --ip-text:   #3F3F46;
    --ip-sub:    #71717A;
    --ip-border: #E5E7EB;
    --ip-bg:     #F9FAFB;
    --ip-font:   Inter, "SF Pro Text", system-ui, sans-serif;
  }
  .ip *, .ip *::before, .ip *::after { box-sizing: border-box; margin: 0; padding: 0; }
  .ip { font-family: var(--ip-font); background: #fff; color: var(--ip-black); -webkit-font-smoothing: antialiased; min-height: 100vh; }
  .ip-wrap { max-width: 1200px; margin: 0 auto; padding: 0 32px; }

  /* ── hero ── */
  .ip-hero { padding: 56px 32px 48px; max-width: 1200px; margin: 0 auto; }
  .ip-breadcrumb { font-size: 13px; color: var(--ip-sub); margin-bottom: 20px; display: flex; align-items: center; gap: 6px; }
  .ip-hero-h1 { font-size: clamp(28px, 4vw, 48px); font-weight: 900; letter-spacing: -.03em; color: var(--ip-black); margin-bottom: 24px; line-height: 1.1; }
  .ip-stats { display: flex; gap: 0; border: 1px solid var(--ip-border); border-radius: 14px; overflow: hidden; }
  .ip-stat { flex: 1; padding: 20px 24px; border-right: 1px solid var(--ip-border); }
  .ip-stat:last-child { border-right: none; }
  .ip-stat-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .07em; color: var(--ip-sub); margin-bottom: 6px; }
  .ip-stat-value { font-size: 22px; font-weight: 800; color: var(--ip-black); letter-spacing: -.02em; }
  .ip-stat-sub { font-size: 12px; color: var(--ip-sub); margin-top: 2px; }

  /* ── split layout ── */
  .ip-split { display: flex; gap: 64px; align-items: flex-start; padding: 0 32px 80px; max-width: 1200px; margin: 0 auto; }

  /* ── left: timeline ── */
  .ip-left { flex: 55; min-width: 0; }

  /* day tabs */
  .ip-tabs { display: flex; gap: 8px; margin-bottom: 36px; }
  .ip-tab {
    padding: 9px 20px; border-radius: 20px;
    border: 1.5px solid var(--ip-border);
    background: #fff; font-family: var(--ip-font);
    font-size: 13px; font-weight: 600; color: var(--ip-sub);
    cursor: pointer; transition: all .18s;
  }
  .ip-tab:hover { border-color: var(--ip-black); color: var(--ip-black); }
  .ip-tab.active { background: var(--ip-black); border-color: var(--ip-black); color: #fff; }

  /* timeline */
  .ip-timeline { position: relative; padding-left: 84px; }
  .ip-timeline::before {
    content: ''; position: absolute;
    left: 42px; top: 8px; bottom: 8px;
    border-left: 2px dashed var(--ip-border);
  }
  .ip-item { position: relative; margin-bottom: 28px; }
  .ip-item:last-child { margin-bottom: 0; }
  .ip-time {
    position: absolute; left: -82px; top: 18px;
    font-size: 11px; font-weight: 700; color: var(--ip-sub);
    white-space: nowrap; text-align: right; width: 64px;
    letter-spacing: .01em;
  }
  .ip-dot {
    position: absolute; left: -49px; top: 22px;
    width: 10px; height: 10px; border-radius: 50%;
    background: var(--ip-black);
    border: 2px solid #fff;
    box-shadow: 0 0 0 2px var(--ip-black);
  }
  .ip-card {
    display: flex; gap: 16px; padding: 16px;
    border: 1px solid var(--ip-border); border-radius: 14px;
    cursor: pointer; transition: background .18s, box-shadow .18s;
    background: #fff;
  }
  .ip-card:hover { background: var(--ip-bg); box-shadow: 0 2px 12px rgba(0,0,0,.06); }
  .ip-card-thumb {
    width: 80px; height: 80px; border-radius: 10px;
    overflow: hidden; flex-shrink: 0; background: var(--ip-border);
  }
  .ip-card-thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .ip-card-body { flex: 1; min-width: 0; display: flex; flex-direction: column; justify-content: center; }
  .ip-card-type { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .07em; color: var(--ip-sub); margin-bottom: 4px; }
  .ip-card-name { font-size: 15px; font-weight: 700; color: var(--ip-black); margin-bottom: 5px; }
  .ip-card-note { font-size: 13px; color: var(--ip-sub); line-height: 1.5; }
  .ip-card-tags { display: flex; gap: 6px; margin-top: 8px; flex-wrap: wrap; }
  .ip-card-tag { font-size: 11px; font-weight: 600; padding: 2px 10px; border-radius: 20px; background: var(--ip-bg); color: var(--ip-text); border: 1px solid var(--ip-border); }
  .ip-card-right { display: flex; flex-direction: column; align-items: flex-end; justify-content: space-between; flex-shrink: 0; }
  .ip-card-duration { font-size: 12px; color: var(--ip-sub); }
  .ip-card-rating { display: flex; align-items: center; gap: 3px; font-size: 13px; font-weight: 600; color: var(--ip-black); margin-top: 4px; }

  /* ── right: map ── */
  .ip-right { flex: 45; min-width: 0; }
  .ip-map-sticky { position: sticky; top: 100px; }
  .ip-map-card {
    border-radius: 18px; overflow: hidden;
    height: calc(100vh - 180px); max-height: 680px;
    position: relative; background: #ddd;
    border: 1px solid var(--ip-border);
    box-shadow: 0 4px 24px rgba(0,0,0,.08);
  }
  .ip-map-card img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .ip-map-overlay { position: absolute; inset: 0; background: rgba(0,0,0,.04); pointer-events: none; }

  /* map markers */
  .ip-marker {
    position: absolute;
    display: flex; align-items: center; gap: 6px;
    padding: 6px 12px; border-radius: 8px;
    background: var(--ip-black); color: #fff;
    font-size: 12px; font-weight: 700;
    box-shadow: 0 4px 16px rgba(0,0,0,.28);
    white-space: nowrap; cursor: pointer;
    transition: transform .2s, box-shadow .2s;
  }
  .ip-marker:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,.35); }
  .ip-marker::after {
    content: ''; position: absolute; bottom: -6px; left: 50%; transform: translateX(-50%);
    width: 0; height: 0;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 6px solid var(--ip-black);
  }
  .ip-marker-num {
    width: 18px; height: 18px; border-radius: 50%;
    background: rgba(255,255,255,.2);
    display: flex; align-items: center; justify-content: center;
    font-size: 10px; font-weight: 900;
  }

  /* map controls */
  .ip-map-controls {
    position: absolute; top: 12px; right: 12px;
    display: flex; flex-direction: column; gap: 2px;
  }
  .ip-map-ctrl-btn {
    width: 36px; height: 36px; border-radius: 8px;
    background: rgba(255,255,255,.95); border: 1px solid var(--ip-border);
    font-size: 20px; font-weight: 300; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    font-family: var(--ip-font); color: var(--ip-black);
  }
  .ip-map-ctrl-btn:first-child { border-radius: 8px 8px 0 0; }
  .ip-map-ctrl-btn:last-child  { border-radius: 0 0 8px 8px; }
  .ip-map-info {
    position: absolute; bottom: 12px; left: 12px; right: 12px;
    background: rgba(255,255,255,.95); backdrop-filter: blur(8px);
    border-radius: 12px; padding: 14px 16px;
    display: flex; align-items: center; justify-content: space-between;
    box-shadow: 0 2px 12px rgba(0,0,0,.1);
  }
  .ip-map-info-label { font-size: 12px; color: var(--ip-sub); margin-bottom: 2px; }
  .ip-map-info-value { font-size: 14px; font-weight: 700; color: var(--ip-black); }
  .ip-map-btn {
    padding: 8px 16px; border-radius: 8px; border: none;
    background: var(--ip-black); color: #fff;
    font-family: var(--ip-font); font-size: 12px; font-weight: 700;
    cursor: pointer; transition: opacity .15s;
  }
  .ip-map-btn:hover { opacity: .8; }
`;

/* ── ITINERARY DATA ──────────────────────────────────────────────────────── */
const DAYS = [
  {
    label: "Ngày 1",
    items: [
      { time: "07:30", type: "Ăn sáng", name: "Bánh mì Lý Quốc Sư", note: "Bánh mì nổi tiếng nhất Đà Lạt, xếp hàng sớm để không hết", tags: ["Ăn uống", "Phải thử"], rating: 4.9, duration: "45 phút", img: "https://images.unsplash.com/photo-1517433367423-c7e5b0f35086?w=200&h=200&fit=crop&auto=format" },
      { time: "09:00", type: "Tham quan", name: "Vườn hoa thành phố Đà Lạt", note: "Hơn 70 loài hoa rực rỡ, điểm chụp ảnh yêu thích của giới trẻ", tags: ["Du lịch", "Chụp ảnh"], rating: 4.6, duration: "1.5 giờ", img: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=200&h=200&fit=crop&auto=format" },
      { time: "11:00", type: "Cà phê", name: "Café Tung Tăng", note: "View thung lũng sương mờ, cà phê sữa đá đặc biệt thơm ngon", tags: ["Cà phê", "View đẹp"], rating: 4.8, duration: "1 giờ", img: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=200&h=200&fit=crop&auto=format" },
      { time: "12:30", type: "Ăn trưa", name: "Bánh Căn Ngọc Hiền", note: "Món ăn đặc trưng Đà Lạt, ăn kèm mắm me chua ngọt", tags: ["Ăn uống", "Đặc sản"], rating: 4.7, duration: "1 giờ", img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=200&h=200&fit=crop&auto=format" },
      { time: "14:30", type: "Tham quan", name: "Hồ Xuân Hương", note: "Hồ tự nhiên trung tâm Đà Lạt, đạp vịt vào buổi chiều mát", tags: ["Du lịch", "Thư giãn"], rating: 4.5, duration: "2 giờ", img: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=200&fit=crop&auto=format" },
      { time: "18:00", type: "Ăn tối", name: "Phố Ẩm Thực Đà Lạt", note: "Khu ăn uống sầm uất nhất, thử hết từ bắp nướng đến nem nướng", tags: ["Ăn uống", "Chợ đêm"], rating: 4.4, duration: "2 giờ", img: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&h=200&fit=crop&auto=format" },
    ]
  },
  {
    label: "Ngày 2",
    items: [
      { time: "06:30", type: "Hoạt động", name: "Đồi Cù — Đón bình minh", note: "Sân golf đẹp nhất Đà Lạt, buổi sáng có thể đi bộ miễn phí", tags: ["Du lịch", "Outdoor"], rating: 4.7, duration: "2 giờ", img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=200&fit=crop&auto=format" },
      { time: "09:30", type: "Tham quan", name: "Ga Đà Lạt", note: "Nhà ga cổ kính thời Pháp thuộc, chuyến tàu hơi nước đến Trại Mát", tags: ["Lịch sử", "Hoài cổ"], rating: 4.8, duration: "2.5 giờ", img: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=200&h=200&fit=crop&auto=format" },
      { time: "13:00", type: "Ăn trưa", name: "Cơm niêu Đà Lạt", note: "Cơm niêu đất truyền thống, các món ăn đồng quê đặc sắc", tags: ["Ăn uống", "Truyền thống"], rating: 4.6, duration: "1 giờ", img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&h=200&fit=crop&auto=format" },
      { time: "15:00", type: "Tham quan", name: "Làng hoa Thái Phiên", note: "Cánh đồng hoa layơn và cúc bạt ngàn, đẹp nhất vào buổi chiều", tags: ["Du lịch", "Thiên nhiên"], rating: 4.9, duration: "1.5 giờ", img: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=200&h=200&fit=crop&auto=format" },
    ]
  },
  {
    label: "Ngày 3",
    items: [
      { time: "08:00", type: "Hoạt động", name: "Datanla — Thác và Cáp treo", note: "Khu du lịch thác nước, trượt máng xanh thú vị", tags: ["Mạo hiểm", "Outdoor"], rating: 4.5, duration: "3 giờ", img: "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=200&h=200&fit=crop&auto=format" },
      { time: "12:00", type: "Ăn trưa", name: "Lẩu bò Đà Lạt", note: "Lẩu bò đặc trưng se lạnh miền cao, nước dùng đậm đà", tags: ["Ăn uống", "Ấm áp"], rating: 4.7, duration: "1.5 giờ", img: "https://images.unsplash.com/photo-1509200536228-620f2e88d252?w=200&h=200&fit=crop&auto=format" },
      { time: "14:30", type: "Mua sắm", name: "Chợ Đà Lạt", note: "Mua đặc sản, mứt dâu, trà Atiso, thổ cẩm làm quà", tags: ["Mua sắm", "Đặc sản"], rating: 4.3, duration: "2 giờ", img: "https://images.unsplash.com/photo-1526364931917-99854fb4e95c?w=200&h=200&fit=crop&auto=format" },
    ]
  }
];

const MARKERS = [
  { label: "Vườn hoa", style: { left: "22%", top: "28%" } },
  { label: "Hồ Xuân Hương", style: { left: "45%", top: "42%" } },
  { label: "Ga Đà Lạt", style: { left: "58%", top: "22%" } },
  { label: "Chợ Đà Lạt", style: { left: "36%", top: "60%" } },
  { label: "Datanla", style: { left: "70%", top: "65%" } },
];

/* ── COMPONENT ──────────────────────────────────────────────────────────── */
export default function ItineraryPage({ onBack }: { onBack: () => void }) {
  const [activeDay, setActiveDay] = useState(0);

  return (
    <div className="ip">
      <style>{STYLE}</style>

      {/* ── Hero ── */}
      <div className="ip-hero">
        <div className="ip-breadcrumb">
          <span style={{ cursor:"pointer" }} onClick={onBack}>Trang chủ</span>
          <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="#71717A" strokeWidth={2}><path d="m9 18 6-6-6-6"/></svg>
          <span>Lịch trình</span>
          <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="#71717A" strokeWidth={2}><path d="m9 18 6-6-6-6"/></svg>
          <span style={{ color:"#18181B", fontWeight:600 }}>Đà Lạt 3 Ngày 2 Đêm</span>
        </div>

        <h1 className="ip-hero-h1">Khám phá Đà Lạt<br/>3 Ngày 2 Đêm</h1>

        <div className="ip-stats">
          <div className="ip-stat">
            <p className="ip-stat-label">Thời gian</p>
            <p className="ip-stat-value">3 ngày</p>
            <p className="ip-stat-sub">2 đêm lưu trú</p>
          </div>
          <div className="ip-stat">
            <p className="ip-stat-label">Ước tính chi phí</p>
            <p className="ip-stat-value">2.500.000đ</p>
            <p className="ip-stat-sub">/ người (chưa khách sạn)</p>
          </div>
          <div className="ip-stat">
            <p className="ip-stat-label">Phương tiện</p>
            <p className="ip-stat-value">Xe máy</p>
            <p className="ip-stat-sub">Hoặc xe ôm công nghệ</p>
          </div>
          <div className="ip-stat">
            <p className="ip-stat-label">Địa điểm</p>
            <p className="ip-stat-value">13 điểm</p>
            <p className="ip-stat-sub">Đà Lạt, Lâm Đồng</p>
          </div>
        </div>
      </div>

      {/* ── Split ── */}
      <div className="ip-split">

        {/* LEFT — Timeline */}
        <div className="ip-left">
          <div className="ip-tabs">
            {DAYS.map((d, i) => (
              <button key={i} className={`ip-tab${activeDay === i ? " active" : ""}`} onClick={() => setActiveDay(i)}>
                {d.label}
              </button>
            ))}
          </div>

          <div className="ip-timeline">
            {DAYS[activeDay].items.map((item, i) => (
              <div key={i} className="ip-item">
                <span className="ip-time">{item.time}</span>
                <div className="ip-dot"/>
                <div className="ip-card">
                  <div className="ip-card-thumb">
                    <img src={item.img} alt={item.name} onError={e=>{(e.target as HTMLImageElement).src=DAYS[0].items[0].img;}}/>
                  </div>
                  <div className="ip-card-body">
                    <p className="ip-card-type">{item.type}</p>
                    <p className="ip-card-name">{item.name}</p>
                    <p className="ip-card-note">{item.note}</p>
                    <div className="ip-card-tags">
                      {item.tags.map(t => <span key={t} className="ip-card-tag">{t}</span>)}
                    </div>
                  </div>
                  <div className="ip-card-right">
                    <span className="ip-card-duration">{item.duration}</span>
                    <span className="ip-card-rating">
                      <svg width={11} height={11} viewBox="0 0 24 24" fill="#F59E0B"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                      {item.rating}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — Sticky Map */}
        <div className="ip-right">
          <div className="ip-map-sticky">
            <div className="ip-map-card">
              {/* Map placeholder — aerial view of Da Lat */}
              <img
                src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=900&h=800&fit=crop&auto=format"
                alt="Bản đồ Đà Lạt"
              />
              <div className="ip-map-overlay"/>

              {/* Markers */}
              {MARKERS.map((m, i) => (
                <div key={i} className="ip-marker" style={m.style as React.CSSProperties}>
                  <span className="ip-marker-num">{i + 1}</span>
                  {m.label}
                </div>
              ))}

              {/* Zoom controls */}
              <div className="ip-map-controls">
                <button className="ip-map-ctrl-btn">+</button>
                <button className="ip-map-ctrl-btn">−</button>
              </div>

              {/* Bottom info strip */}
              <div className="ip-map-info">
                <div>
                  <p className="ip-map-info-label">Đang xem</p>
                  <p className="ip-map-info-value">Đà Lạt, Lâm Đồng</p>
                </div>
                <button className="ip-map-btn">Mở bản đồ lớn</button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
