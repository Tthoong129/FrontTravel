import { useState } from "react";

/* ── CSS ─────────────────────────────────────────────────────────────────── */
const STYLE = `
  :root {
    --bp-black:  #18181B;
    --bp-text:   #374151;
    --bp-sub:    #71717A;
    --bp-border: #E5E7EB;
    --bp-bg:     #F9FAFB;
    --bp-font:   Inter, "SF Pro Text", system-ui, sans-serif;
  }
  .bp *, .bp *::before, .bp *::after { box-sizing: border-box; margin: 0; padding: 0; }
  .bp { font-family: var(--bp-font); background: #fff; color: var(--bp-black); -webkit-font-smoothing: antialiased; }

  /* ── hero cover ── */
  .bp-cover { position: relative; width: 100%; height: 520px; overflow: hidden; background: #111; }
  .bp-cover img { width: 100%; height: 100%; object-fit: cover; opacity: .78; display: block; }
  .bp-cover-overlay { position: absolute; inset: 0; background: linear-gradient(to bottom, rgba(0,0,0,.15) 0%, rgba(0,0,0,.55) 100%); }
  .bp-cover-body {
    position: absolute; inset: 0;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    padding: 0 32px; text-align: center;
  }
  .bp-cover-tag { font-size: 12px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: rgba(255,255,255,.7); margin-bottom: 16px; }
  .bp-cover-h1 {
    font-size: clamp(30px, 5vw, 52px); font-weight: 900;
    color: #fff; line-height: 1.15; letter-spacing: -.025em;
    text-shadow: 0 2px 20px rgba(0,0,0,.4);
    max-width: 800px;
  }

  /* ── meta strip ── */
  .bp-meta-wrap { max-width: 680px; margin: 0 auto; padding: 32px 24px 24px; }
  .bp-meta { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
  .bp-avatar {
    width: 40px; height: 40px; border-radius: 50%;
    overflow: hidden; flex-shrink: 0; background: var(--bp-border);
  }
  .bp-avatar img { width: 100%; height: 100%; object-fit: cover; }
  .bp-author-name { font-size: 14px; font-weight: 700; color: var(--bp-black); }
  .bp-author-sub { font-size: 13px; color: var(--bp-sub); }
  .bp-meta-divider { width: 1px; height: 20px; background: var(--bp-border); }
  .bp-meta-item { font-size: 13px; color: var(--bp-sub); display: flex; align-items: center; gap: 5px; }
  .bp-divider { border: none; border-top: 1px solid var(--bp-border); margin-top: 20px; }

  /* ── article layout ── */
  .bp-article-outer {
    position: relative;
    max-width: 960px; margin: 0 auto;
    padding: 48px 152px 80px;
  }

  /* ── sticky sidebar ── */
  .bp-sidebar {
    position: absolute; left: 32px; top: 48px;
    display: flex; flex-direction: column; gap: 12px;
  }
  .bp-sidebar-sticky { position: sticky; top: 120px; display: flex; flex-direction: column; gap: 12px; }
  .bp-side-btn {
    width: 44px; height: 44px; border-radius: 50%;
    border: 1.5px solid var(--bp-border); background: #fff;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: all .2s;
    font-family: var(--bp-font);
  }
  .bp-side-btn:hover { border-color: var(--bp-black); box-shadow: 0 4px 12px rgba(0,0,0,.1); transform: translateY(-1px); }
  .bp-side-btn.active { background: var(--bp-black); border-color: var(--bp-black); }
  .bp-side-btn.active svg { stroke: #fff; }
  .bp-side-count { font-size: 11px; font-weight: 700; color: var(--bp-sub); text-align: center; margin-top: -4px; }

  /* ── article content ── */
  .bp-content { /* naturally fills padded area */ }
  .bp-content p { font-size: 18px; color: var(--bp-text); line-height: 1.85; margin-bottom: 28px; }
  .bp-content h2 { font-size: 26px; font-weight: 800; color: var(--bp-black); letter-spacing: -.02em; margin: 48px 0 20px; }
  .bp-content h3 { font-size: 20px; font-weight: 700; color: var(--bp-black); margin: 36px 0 16px; }
  .bp-content img { width: 100%; border-radius: 14px; margin: 32px 0; display: block; }
  .bp-content img + em { display: block; font-size: 13px; color: var(--bp-sub); text-align: center; margin-top: -20px; margin-bottom: 32px; font-style: normal; }
  .bp-blockquote {
    border-left: 4px solid var(--bp-black);
    padding: 4px 0 4px 28px; margin: 36px 0;
  }
  .bp-blockquote p { font-size: 20px; font-style: italic; color: var(--bp-black); font-weight: 500; line-height: 1.7; margin: 0; }
  .bp-blockquote cite { display: block; font-size: 13px; color: var(--bp-sub); margin-top: 12px; font-style: normal; }

  /* ── read more ── */
  .bp-more { border-top: 1px solid var(--bp-border); margin-top: 0; }
  .bp-more-inner { max-width: 1200px; margin: 0 auto; padding: 64px 32px 80px; }
  .bp-more-h2 { font-size: 24px; font-weight: 800; color: var(--bp-black); letter-spacing: -.02em; margin-bottom: 28px; }
  .bp-more-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 28px; }
  .bp-blog-card { cursor: pointer; }
  .bp-blog-img { aspect-ratio: 16/9; border-radius: 12px; overflow: hidden; background: var(--bp-border); margin-bottom: 14px; }
  .bp-blog-img img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform .4s; }
  .bp-blog-card:hover .bp-blog-img img { transform: scale(1.05); }
  .bp-blog-tag { font-size: 11px; font-weight: 700; color: var(--bp-sub); text-transform: uppercase; letter-spacing: .07em; margin-bottom: 7px; }
  .bp-blog-title { font-size: 17px; font-weight: 800; color: var(--bp-black); line-height: 1.35; margin-bottom: 8px; letter-spacing: -.01em; }
  .bp-blog-excerpt { font-size: 14px; color: var(--bp-sub); line-height: 1.65; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
  .bp-blog-meta { display: flex; align-items: center; gap: 8px; margin-top: 10px; font-size: 12px; color: var(--bp-sub); }
`;

/* ── DATA ───────────────────────────────────────────────────────────────── */
const RELATED = [
  { tag: "Ẩm thực · Hà Nội", title: "48 giờ tại Hà Nội: Bản đồ ẩm thực không thể bỏ lỡ", excerpt: "Từ bát phở nóng hổi sáng sớm ở phố cổ đến ly cà phê trứng chiều tà, Hà Nội ẩn chứa cả thế giới hương vị.", img: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=600&h=340&fit=crop&auto=format", date: "28 tháng 5", time: "6 phút đọc" },
  { tag: "Du lịch · Miền Trung", title: "Hội An: Phố cổ nghìn năm và những góc khuất ít người biết", excerpt: "Vượt ra ngoài đèn lồng và bánh mì nổi tiếng, Hội An còn có những con ngõ nhỏ, những nghệ nhân già và câu chuyện ít ai kể.", img: "https://images.unsplash.com/photo-1559447066-5f3b7f4ece12?w=600&h=340&fit=crop&auto=format", date: "14 tháng 5", time: "8 phút đọc" },
  { tag: "Trải nghiệm · Tây Nguyên", title: "Một tuần ở Đà Lạt: Sương mờ, cà phê và những khu vườn hoa bất tận", excerpt: "Đà Lạt không chỉ là thành phố ngàn hoa — đó là nơi bạn tìm lại nhịp thở chậm trong cuộc sống hiện đại hối hả.", img: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600&h=340&fit=crop&auto=format", date: "2 tháng 5", time: "7 phút đọc" },
];

/* ── COMPONENT ──────────────────────────────────────────────────────────── */
export default function BlogPage({ onBack }: { onBack: () => void }) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [likeCount, setLikeCount] = useState(142);

  const handleLike = () => {
    setLiked(v => !v);
    setLikeCount(c => liked ? c - 1 : c + 1);
  };

  return (
    <div className="bp">
      <style>{STYLE}</style>

      {/* ── Cover ── */}
      <div className="bp-cover">
        <img
          src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1400&h=700&fit=crop&auto=format"
          alt="Blog cover"
        />
        <div className="bp-cover-overlay"/>
        <div className="bp-cover-body">
          <p className="bp-cover-tag">Ẩm thực · Khám phá</p>
          <h1 className="bp-cover-h1">
            Hành trình theo dấu phở — Từ gánh hàng rong đến những tô phở huyền thoại
          </h1>
        </div>
      </div>

      {/* ── Meta ── */}
      <div className="bp-meta-wrap">
        <div className="bp-meta">
          <div className="bp-avatar">
            <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop" alt="Author"/>
          </div>
          <div>
            <p className="bp-author-name">Nguyễn Bảo Châu</p>
            <p className="bp-author-sub">Phóng viên ẩm thực</p>
          </div>
          <div className="bp-meta-divider"/>
          <span className="bp-meta-item">
            <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="#71717A" strokeWidth={2} strokeLinecap="round"><rect x={3} y={4} width={18} height={18} rx={2}/><line x1={16} y1={2} x2={16} y2={6}/><line x1={8} y1={2} x2={8} y2={6}/><line x1={3} y1={10} x2={21} y2={10}/></svg>
            15 tháng 6, 2025
          </span>
          <div className="bp-meta-divider"/>
          <span className="bp-meta-item">
            <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="#71717A" strokeWidth={2} strokeLinecap="round"><circle cx={12} cy={12} r={10}/><path d="M12 6v6l4 2"/></svg>
            9 phút đọc
          </span>
        </div>
        <hr className="bp-divider"/>
      </div>

      {/* ── Article ── */}
      <div className="bp-article-outer">

        {/* Sticky sidebar */}
        <div className="bp-sidebar">
          <div className="bp-sidebar-sticky">
            <button className={`bp-side-btn${liked?" active":""}`} onClick={handleLike} title="Thích bài viết">
              <svg width={18} height={18} viewBox="0 0 24 24" fill={liked?"#fff":"none"} stroke={liked?"#fff":"#18181B"} strokeWidth={2} strokeLinecap="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            </button>
            <p className="bp-side-count">{likeCount}</p>
            <button className="bp-side-btn" title="Chia sẻ">
              <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#18181B" strokeWidth={2} strokeLinecap="round"><circle cx={18} cy={5} r={3}/><circle cx={6} cy={12} r={3}/><circle cx={18} cy={19} r={3}/><path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98"/></svg>
            </button>
            <button className={`bp-side-btn${saved?" active":""}`} onClick={()=>setSaved(v=>!v)} title="Lưu bài">
              <svg width={18} height={18} viewBox="0 0 24 24" fill={saved?"#fff":"none"} stroke={saved?"#fff":"#18181B"} strokeWidth={2} strokeLinecap="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="bp-content">
          <p>Có một câu hỏi tôi luôn tự hỏi mỗi khi đặt chân đến một vùng đất mới của Việt Nam: <strong>"Tô phở ở đây như thế nào?"</strong> Không phải vì tôi thiếu trí tò mò về các món khác, mà vì phở — trong tất cả sự giản dị của mình — luôn là thước đo trung thực nhất về bản sắc ẩm thực của một vùng đất.</p>

          <p>Hành trình lần này bắt đầu từ một buổi sáng mùa đông Hà Nội, khi hơi sương còn dày đặc trên mặt hồ Hoàn Kiếm. Tôi theo chân một người bạn đến một con phố nhỏ khuất sau chợ Đồng Xuân — nơi bà Thìn đã bán phở hơn bốn thập kỷ, đời này qua đời khác truyền lại bí quyết ninh xương suốt mười hai tiếng đồng hồ.</p>

          <div className="bp-blockquote">
            <p>"Phở không cần nhiều nguyên liệu đắt tiền. Nó cần thời gian, sự kiên nhẫn, và tình yêu của người nấu."</p>
            <cite>— Bà Nguyễn Thị Thìn, 72 tuổi, Hà Nội</cite>
          </div>

          <p>Điều làm tôi kinh ngạc nhất không phải là hương vị của tô phở — dù nó thực sự xuất sắc — mà là cách bà Thìn kể về lịch sử của món ăn này. Phở ra đời vào cuối thế kỷ XIX, trong giai đoạn giao thoa văn hóa Việt–Pháp, chịu ảnh hưởng từ kỹ thuật làm nước dùng của người Hoa lẫn cách ăn beef của người Tây.</p>

          <h2>Từ Bắc vào Nam — Ngàn kiểu phở, một hồn Việt</h2>

          <p>Khi tàu hỏa đưa tôi qua đèo Hải Vân và vào đất Huế, tô phở cũng bắt đầu đổi giọng. Người Huế không ăn phở bò thuần túy như người Hà Nội — họ pha vào đó ít sả, vài lát ớt tươi, và đôi khi một muỗng mắm ruốc để nước dùng đậm đà hơn, cay hơn, phức tạp hơn.</p>

          <img
            src="https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=680&h=400&fit=crop&auto=format"
            alt="Tô phở truyền thống"
          />
          <em>Tô phở bò Hà Nội với nước dùng trong vắt, bánh phở mềm mịn — ảnh chụp tại phố Bát Đàn, Hoàn Kiếm.</em>

          <p>Đến Sài Gòn, phở lại khoác lên mình chiếc áo khác. Tô phở miền Nam to hơn, rau giá mọc cao như cỏ, tương đen tương đỏ bày sẵn trên bàn, người ăn tự điều chỉnh vị theo khẩu vị cá nhân. Đây là minh chứng cho triết lý ẩm thực phóng khoáng của người Nam — không có công thức cứng nhắc, chỉ có sự hài lòng của thực khách mới là tiêu chuẩn tối cao.</p>

          <h3>Kỹ thuật ninh xương — Bí quyết không ai chịu nói thẳng</h3>

          <p>Sau nhiều cuộc trò chuyện với các chủ quán phở lâu năm, tôi đúc kết được một điều: nước dùng ngon không đến từ bí quyết gia truyền bí ẩn nào, mà đến từ sự tỉ mỉ trong từng công đoạn. Xương bò phải được chần qua nước sôi trước, gừng và hành phải được nướng vàng đều trên than để lấy mùi thơm, và nước phải được giữ ở nhiệt độ sôi liu riu — không được sôi bùng — trong suốt mười tiếng đồng hồ.</p>

          <p>Đó là lý do vì sao phở ngon thực sự là một di sản — không chỉ là món ăn, mà còn là sự tích lũy của thời gian, công sức và tâm huyết của cả một thế hệ người nấu.</p>
        </div>
      </div>

      {/* ── Read More ── */}
      <div className="bp-more">
        <div className="bp-more-inner">
          <h2 className="bp-more-h2">Bài viết liên quan</h2>
          <div className="bp-more-grid">
            {RELATED.map((r, i) => (
              <div key={i} className="bp-blog-card">
                <div className="bp-blog-img">
                  <img src={r.img} alt={r.title} onError={e=>{(e.target as HTMLImageElement).src=RELATED[0].img;}}/>
                </div>
                <p className="bp-blog-tag">{r.tag}</p>
                <p className="bp-blog-title">{r.title}</p>
                <p className="bp-blog-excerpt">{r.excerpt}</p>
                <div className="bp-blog-meta">
                  <span>{r.date}</span>
                  <span>·</span>
                  <span>{r.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
