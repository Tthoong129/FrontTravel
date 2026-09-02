import { useState, useRef, useCallback, useEffect } from "react";
import {
  Search,
  Grid3x3,
  List,
  Star,
  Heart,
  MapPin,
  Clock,
  ChevronDown,
  SlidersHorizontal,
  X,
  ArrowRight,
  RotateCcw,
} from "lucide-react";

// ─── DATA ────────────────────────────────────────────────────────────────────

const provinceMap: Record<string, string[]> = {
  "Tất cả": ["Tất cả"],
  "Miền Bắc": ["Tất cả", "Hà Nội", "Hải Phòng", "Quảng Ninh", "Lào Cai", "Hà Giang", "Ninh Bình"],
  "Miền Trung": ["Tất cả", "Thừa Thiên Huế", "Đà Nẵng", "Quảng Nam", "Quảng Bình", "Lâm Đồng"],
  "Miền Nam": ["Tất cả", "TP. Hồ Chí Minh", "Bình Thuận", "Kiên Giang", "Cần Thơ", "An Giang", "Bà Rịa - Vũng Tàu"],
};

const typeOptions = ["Ăn uống", "Du lịch", "Lưu trú", "Vui chơi"];

const places = [
  {
    id: 1, name: "Phở Thìn Bờ Hồ", category: "Nhà hàng",
    location: "Hoàn Kiếm, Hà Nội", region: "Miền Bắc", province: "Hà Nội",
    type: "Ăn uống", rating: 4.9, reviews: 2341,
    price: "45.000đ – 80.000đ", priceMax: 80000, priceRange: "Bình dân",
    hours: "06:00 – 22:00", status: "Đang mở",
    desc: "Quán phở gia truyền hơn 50 năm với nước dùng ngọt trong, thơm lừng xương bò hầm cả đêm. Không gian đậm chất Hà Nội xưa.",
    tags: ["Phở bò", "Quẩy", "Trứng cút"],
    img: "https://images.unsplash.com/photo-1527997921830-de1cf1f9b430?w=600&h=400&fit=crop&auto=format",
  },
  {
    id: 2, name: "Cơm Tấm Thuận Kiều", category: "Quán ăn",
    location: "Quận 3, TP. Hồ Chí Minh", region: "Miền Nam", province: "TP. Hồ Chí Minh",
    type: "Ăn uống", rating: 4.8, reviews: 1876,
    price: "55.000đ – 95.000đ", priceMax: 95000, priceRange: "Bình dân",
    hours: "07:00 – 21:00", status: "Đang mở",
    desc: "Cơm tấm sườn bì chả nổi tiếng nhất Sài Gòn, sườn nướng than hoa thơm lừng, bì trộn mỡ hành béo ngậy.",
    tags: ["Cơm tấm", "Sườn nướng", "Bì chả"],
    img: "https://images.unsplash.com/photo-1718942900279-4711345169d3?w=600&h=400&fit=crop&auto=format",
  },
  {
    id: 3, name: "Bánh Mì Phượng", category: "Tiệm bánh",
    location: "Hội An, Quảng Nam", region: "Miền Trung", province: "Quảng Nam",
    type: "Ăn uống", rating: 4.9, reviews: 5420,
    price: "25.000đ – 40.000đ", priceMax: 40000, priceRange: "Bình dân",
    hours: "06:30 – 21:30", status: "Đang mở",
    desc: "Ổ bánh mì huyền thoại được Anthony Bourdain gọi là ngon nhất thế giới. Vỏ giòn rụm, nhân thịt nguội thơm lừng.",
    tags: ["Bánh mì", "Thịt nguội", "Pate"],
    img: "https://images.unsplash.com/photo-1763703686284-b63557b08a86?w=600&h=400&fit=crop&auto=format",
  },
  {
    id: 4, name: "The Coffee House Signature", category: "Cà phê",
    location: "Quận 1, TP. Hồ Chí Minh", region: "Miền Nam", province: "TP. Hồ Chí Minh",
    type: "Ăn uống", rating: 4.6, reviews: 892,
    price: "55.000đ – 120.000đ", priceMax: 120000, priceRange: "Trung bình",
    hours: "07:00 – 23:00", status: "Đang mở",
    desc: "Không gian cà phê sang trọng với hạt rang đặc trưng, thực đơn specialty coffee phong phú.",
    tags: ["Espresso", "Cold brew", "Bánh ngọt"],
    img: "https://images.unsplash.com/photo-1762015669851-4098e655ec87?w=600&h=400&fit=crop&auto=format",
  },
  {
    id: 5, name: "Chùa Thiên Mụ", category: "Di tích",
    location: "Thành phố Huế", region: "Miền Trung", province: "Thừa Thiên Huế",
    type: "Du lịch", rating: 4.8, reviews: 3102,
    price: "Miễn phí", priceMax: 0, priceRange: "Miễn phí",
    hours: "08:00 – 17:30", status: "Đang mở",
    desc: "Ngôi chùa cổ kính linh thiêng bên dòng sông Hương thơ mộng, biểu tượng của cố đô Huế.",
    tags: ["Chùa cổ", "Sông Hương", "Tháp cổ"],
    img: "https://images.unsplash.com/photo-1569271532956-3fb81a207115?w=600&h=400&fit=crop&auto=format",
  },
  {
    id: 6, name: "Quán Bún Bò Huế Mụ Rớt", category: "Quán ăn",
    location: "TP. Huế, Thừa Thiên Huế", region: "Miền Trung", province: "Thừa Thiên Huế",
    type: "Ăn uống", rating: 4.7, reviews: 1543,
    price: "40.000đ – 65.000đ", priceMax: 65000, priceRange: "Bình dân",
    hours: "06:00 – 14:00", status: "Đóng cửa",
    desc: "Bún bò Huế chuẩn vị cố đô hơn 30 năm, nước dùng cay nồng sả ớt, giò heo chắc thịt.",
    tags: ["Bún bò", "Giò heo", "Mắm ruốc"],
    img: "https://images.unsplash.com/photo-1509072619873-adb3dc289b50?w=600&h=400&fit=crop&auto=format",
  },
  {
    id: 7, name: "Vịnh Lăng Cô", category: "Bãi biển",
    location: "Phú Lộc, Thừa Thiên Huế", region: "Miền Trung", province: "Thừa Thiên Huế",
    type: "Du lịch", rating: 4.7, reviews: 2210,
    price: "Miễn phí", priceMax: 0, priceRange: "Miễn phí",
    hours: "Cả ngày", status: "Đang mở",
    desc: "Một trong những vịnh biển đẹp nhất thế giới với bãi cát trắng dài, nước biển trong xanh.",
    tags: ["Bãi biển", "Tắm biển", "Hải sản"],
    img: "https://images.unsplash.com/photo-1784448678069-52bc77af96f6?w=600&h=400&fit=crop&auto=format",
  },
  {
    id: 8, name: "Nhà hàng Ngon", category: "Nhà hàng",
    location: "Quận 1, TP. Hồ Chí Minh", region: "Miền Nam", province: "TP. Hồ Chí Minh",
    type: "Ăn uống", rating: 4.5, reviews: 4521,
    price: "120.000đ – 350.000đ", priceMax: 350000, priceRange: "Trung bình",
    hours: "10:00 – 22:00", status: "Đang mở",
    desc: "Nhà hàng nằm trong biệt thự Pháp cổ, phục vụ hơn 60 món ăn đặc trưng ba miền trong không gian sân vườn.",
    tags: ["Đặc sản 3 miền", "Sân vườn", "Buffet"],
    img: "https://images.unsplash.com/photo-1783096163906-052d939b1685?w=600&h=400&fit=crop&auto=format",
  },
  {
    id: 9, name: "Café Gió & Nước", category: "Cà phê",
    location: "Đà Lạt, Lâm Đồng", region: "Miền Trung", province: "Lâm Đồng",
    type: "Ăn uống", rating: 4.8, reviews: 3670,
    price: "60.000đ – 130.000đ", priceMax: 130000, priceRange: "Trung bình",
    hours: "07:30 – 22:00", status: "Đang mở",
    desc: "Quán cà phê view đồi thông Đà Lạt lãng mạn, sương mờ bao phủ, ly cà phê nóng bên lò sưởi.",
    tags: ["View đồi thông", "Cà phê sữa đá", "Bánh waffle"],
    img: "https://images.unsplash.com/photo-1764745021303-c3d97bedd2c6?w=600&h=400&fit=crop&auto=format",
  },
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function fmt(n: number) {
  return n === 0 ? "0đ" : n.toLocaleString("vi-VN") + "đ";
}

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star key={s} size={12}
          className={s <= Math.round(rating) ? "fill-amber-400 text-amber-400" : "fill-slate-200 text-slate-200"}
        />
      ))}
    </div>
  );
}

// ─── DUAL RANGE SLIDER ───────────────────────────────────────────────────────

function DualRangeSlider({
  min, max, valueMin, valueMax,
  onChange,
}: {
  min: number; max: number; valueMin: number; valueMax: number;
  onChange: (min: number, max: number) => void;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const dragging = useRef<null | "min" | "max">(null);

  const pct = (v: number) => ((v - min) / (max - min)) * 100;

  const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

  const posToValue = useCallback((clientX: number) => {
    const rect = trackRef.current!.getBoundingClientRect();
    const ratio = clamp((clientX - rect.left) / rect.width, 0, 1);
    return Math.round((ratio * (max - min) + min) / 50000) * 50000;
  }, [min, max]);

  const onMouseDown = (which: "min" | "max") => (e: React.MouseEvent) => {
    e.preventDefault();
    dragging.current = which;

    const onMove = (ev: MouseEvent) => {
      const v = posToValue(ev.clientX);
      if (dragging.current === "min") onChange(clamp(v, min, valueMax - 50000), valueMax);
      else onChange(valueMin, clamp(v, valueMin + 50000, max));
    };
    const onUp = () => {
      dragging.current = null;
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  const onTouchStart = (which: "min" | "max") => (e: React.TouchEvent) => {
    const onMove = (ev: TouchEvent) => {
      const v = posToValue(ev.touches[0].clientX);
      if (which === "min") onChange(clamp(v, min, valueMax - 50000), valueMax);
      else onChange(valueMin, clamp(v, valueMin + 50000, max));
    };
    const onEnd = () => {
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onEnd);
    };
    window.addEventListener("touchmove", onMove);
    window.addEventListener("touchend", onEnd);
  };

  const leftPct = pct(valueMin);
  const rightPct = pct(valueMax);

  return (
    <div className="pt-1 pb-2">
      {/* Value labels */}
      <div className="flex justify-between items-center mb-4">
        <span className="text-xs font-semibold text-slate-800">{fmt(valueMin)}</span>
        <span className="text-[10px] text-slate-400">–</span>
        <span className="text-xs font-semibold text-slate-800">
          {valueMax >= max ? "Không giới hạn" : fmt(valueMax)}
        </span>
      </div>

      {/* Track */}
      <div ref={trackRef} className="relative select-none" style={{ height: 2, background: "#E5E7EB", borderRadius: 2 }}>
        {/* Fill */}
        <div
          className="absolute top-0 h-full"
          style={{ left: `${leftPct}%`, width: `${rightPct - leftPct}%`, background: "#18181B", borderRadius: 2 }}
        />
        {/* Min thumb */}
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 rounded-full bg-white cursor-grab active:cursor-grabbing"
          style={{ left: `${leftPct}%`, width: 20, height: 20, boxShadow: "0 2px 4px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.08)", zIndex: leftPct > 85 ? 4 : 3 }}
          onMouseDown={onMouseDown("min")}
          onTouchStart={onTouchStart("min")}
        />
        {/* Max thumb */}
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 rounded-full bg-white cursor-grab active:cursor-grabbing"
          style={{ left: `${rightPct}%`, width: 20, height: 20, boxShadow: "0 2px 4px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.08)", zIndex: 3 }}
          onMouseDown={onMouseDown("max")}
          onTouchStart={onTouchStart("max")}
        />
      </div>

      {/* Scale */}
      <div className="flex justify-between mt-4 text-[10px] text-slate-400">
        <span>0đ</span>
        <span>500k</span>
        <span>1tr</span>
        <span>2tr+</span>
      </div>
    </div>
  );
}

// ─── SVG STAR RATING ─────────────────────────────────────────────────────────

function StarRating({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hover, setHover] = useState(0);
  const active = hover || value;
  return (
    <div>
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((s) => (
          <button
            key={s}
            onClick={() => onChange(value === s ? 0 : s)}
            onMouseEnter={() => setHover(s)}
            onMouseLeave={() => setHover(0)}
            className="p-0.5 rounded focus:outline-none"
            title={`Từ ${s} sao trở lên`}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" style={{ transition: "fill 0.15s" }}
              fill={s <= active ? "#FBBF24" : "#D1D5DB"}
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </button>
        ))}
      </div>
      {value > 0 && (
        <p className="text-[11px] text-slate-400 mt-2">Từ {value} sao trở lên</p>
      )}
    </div>
  );
}

// ─── TOGGLE SWITCH ───────────────────────────────────────────────────────────

function ToggleSwitch({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <p className="text-sm font-medium text-slate-700">Chỉ hiện nơi đang mở cửa</p>
      <button
        onClick={() => onChange(!checked)}
        className="relative flex-shrink-0 rounded-full transition-colors duration-300 focus:outline-none"
        style={{ width: 48, height: 26, background: checked ? "#064E3B" : "#CBD5E1" }}
      >
        <span
          className="absolute top-1 rounded-full bg-white shadow-md transition-all duration-300"
          style={{ width: 18, height: 18, left: checked ? 26 : 4 }}
        />
      </button>
    </div>
  );
}

// ─── FILTER SECTION WRAPPER ──────────────────────────────────────────────────

function FilterSection({ title, badge, children }: { title: string; badge?: number; children: React.ReactNode }) {
  return (
    <div className="py-4" style={{ borderBottom: "1px solid #F1F5F9" }}>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-[10px] font-black tracking-widest uppercase text-slate-400">{title}</span>
        {badge ? (
          <span className="text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center text-white" style={{ background: "#18181B" }}>
            {badge}
          </span>
        ) : null}
      </div>
      {children}
    </div>
  );
}

// ─── PILL CHECKBOXES ─────────────────────────────────────────────────────────

function PillCheckboxes({
  options, selected, onChange,
}: {
  options: string[];
  selected: string[];
  onChange: (sel: string[]) => void;
}) {
  const toggle = (opt: string) => {
    onChange(selected.includes(opt) ? selected.filter((s) => s !== opt) : [...selected, opt]);
  };
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((opt) => {
        const active = selected.includes(opt);
        return (
          <button
            key={opt}
            onClick={() => toggle(opt)}
            className="text-xs font-semibold transition-all duration-150 border"
            style={{
              borderRadius: 8,
              padding: "8px 14px",
              ...(active
                ? { background: "#18181B", color: "#fff", borderColor: "#18181B" }
                : { background: "#fff", color: "#4B5563", borderColor: "#E5E7EB" }),
            }}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}

// ─── REGION PILLS ────────────────────────────────────────────────────────────

function RegionPills({
  region, province,
  onRegionChange, onProvinceChange,
}: {
  region: string; province: string;
  onRegionChange: (v: string) => void;
  onProvinceChange: (v: string) => void;
}) {
  const regions = Object.keys(provinceMap);
  const provinces = region !== "Tất cả" ? provinceMap[region] : [];

  const handleRegion = (v: string) => {
    onRegionChange(v);
    onProvinceChange("Tất cả");
  };

  const pillStyle = (active: boolean): React.CSSProperties =>
    active
      ? { background: "#18181B", color: "#fff", borderColor: "#18181B" }
      : { background: "#fff", color: "#4B5563", borderColor: "#E5E7EB" };

  return (
    <div className="space-y-3">
      {/* Region pills */}
      <div className="flex flex-wrap gap-1.5">
        {regions.map((r) => (
          <button
            key={r}
            onClick={() => handleRegion(r)}
            className="border text-xs font-semibold transition-all duration-150"
            style={{ ...pillStyle(region === r), borderRadius: 8, padding: "8px 14px" }}
          >
            {r}
          </button>
        ))}
      </div>
      {/* Province dropdown (shown only when a region is selected) */}
      {provinces.length > 0 && (
        <div className="relative">
          <select
            value={province}
            onChange={(e) => onProvinceChange(e.target.value)}
            className="w-full text-xs font-medium text-slate-700 outline-none cursor-pointer transition-all"
            style={{
              appearance: "none",
              background: "#F3F4F6",
              border: "1.5px solid transparent",
              borderRadius: 8,
              padding: "12px 16px",
            }}
            onFocus={(e) => { (e.target as HTMLSelectElement).style.borderColor = "#18181B"; }}
            onBlur={(e) => { (e.target as HTMLSelectElement).style.borderColor = "transparent"; }}
          >
            {provinces.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
          <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>
      )}
    </div>
  );
}

// ─── PLACE CARDS ─────────────────────────────────────────────────────────────

function PlaceCardGrid({ place, saved, onToggleSave }: { place: typeof places[0]; saved: boolean; onToggleSave: () => void }) {
  return (
    <div
      className="group bg-white rounded-2xl overflow-hidden border border-slate-100 flex flex-col"
      style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.06)", transition: "transform 0.25s, box-shadow 0.25s" }}
      onMouseEnter={(e) => { const el = e.currentTarget as HTMLDivElement; el.style.transform = "translateY(-4px)"; el.style.boxShadow = "0 12px 32px rgba(0,0,0,0.12)"; }}
      onMouseLeave={(e) => { const el = e.currentTarget as HTMLDivElement; el.style.transform = "translateY(0)"; el.style.boxShadow = "0 1px 4px rgba(0,0,0,0.06)"; }}
    >
      <div className="relative overflow-hidden bg-slate-100" style={{ aspectRatio: "4/3" }}>
        <img src={place.img} alt={place.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1527997921830-de1cf1f9b430?w=600&h=400&fit=crop"; }} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        <span className="absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded-full text-white tracking-wider"
          style={{ background: place.status === "Đang mở" ? "#064E3B" : "#64748B" }}>
          {place.status}
        </span>
        <button onClick={onToggleSave}
          className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-transform hover:scale-110"
          style={{ background: "rgba(0,0,0,0.35)", backdropFilter: "blur(6px)" }}>
          <Heart size={14} className={saved ? "fill-red-400 text-red-400" : "text-white"} />
        </button>
        <span className="absolute bottom-3 left-3 text-[10px] font-bold px-2 py-1 rounded-md text-white tracking-wider" style={{ background: "#EA580C" }}>
          {place.type}
        </span>
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-bold text-slate-900 leading-snug mb-1.5" style={{ fontFamily: "'Playfair Display', serif", fontSize: 16 }}>{place.name}</h3>
        <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-3">
          <MapPin size={11} className="text-slate-400 flex-shrink-0" /><span className="truncate">{place.location}</span>
        </div>
        <div className="flex items-center gap-2 mb-3">
          <StarRow rating={place.rating} />
          <span className="text-sm font-bold text-slate-800">{place.rating}</span>
          <span className="text-xs text-slate-400">({place.reviews.toLocaleString()})</span>
        </div>
        <div className="mt-auto pt-3 flex items-center justify-between" style={{ borderTop: "1px solid #F1F5F9" }}>
          <span className="text-sm font-semibold" style={{ color: "#064E3B" }}>{place.price}</span>
          <button className="text-xs font-bold px-3 py-1.5 rounded-lg text-white hover:opacity-80" style={{ background: "#EA580C" }}>Xem chi tiết</button>
        </div>
      </div>
    </div>
  );
}

function PlaceCardList({ place, saved, onToggleSave }: { place: typeof places[0]; saved: boolean; onToggleSave: () => void }) {
  return (
    <div
      className="group bg-white rounded-2xl overflow-hidden border border-slate-100 flex"
      style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.06)", transition: "transform 0.25s, box-shadow 0.25s" }}
      onMouseEnter={(e) => { const el = e.currentTarget as HTMLDivElement; el.style.transform = "translateY(-3px)"; el.style.boxShadow = "0 10px 28px rgba(0,0,0,0.1)"; }}
      onMouseLeave={(e) => { const el = e.currentTarget as HTMLDivElement; el.style.transform = "translateY(0)"; el.style.boxShadow = "0 1px 4px rgba(0,0,0,0.06)"; }}
    >
      <div className="relative overflow-hidden bg-slate-100 flex-shrink-0" style={{ width: "35%", minHeight: 200 }}>
        <img src={place.img} alt={place.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1527997921830-de1cf1f9b430?w=600&h=400&fit=crop"; }} />
        <span className="absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded-full text-white tracking-wider"
          style={{ background: place.status === "Đang mở" ? "#064E3B" : "#64748B" }}>
          {place.status}
        </span>
        <span className="absolute bottom-3 left-3 text-[10px] font-bold px-2 py-1 rounded-md text-white" style={{ background: "#EA580C" }}>{place.type}</span>
      </div>
      <div className="flex-1 p-5 flex flex-col min-w-0">
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3 className="font-bold text-slate-900 text-lg leading-snug" style={{ fontFamily: "'Playfair Display', serif" }}>{place.name}</h3>
          <button onClick={onToggleSave} className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center border border-slate-200 transition-all hover:border-red-300 hover:bg-red-50">
            <Heart size={14} className={saved ? "fill-red-400 text-red-400" : "text-slate-400"} />
          </button>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-3">
          <span className="font-medium" style={{ color: "#064E3B" }}>{place.category}</span>
          <span className="text-slate-300">•</span>
          <MapPin size={11} className="text-slate-400" /><span>{place.location}</span>
        </div>
        <div className="flex items-center gap-2 mb-3">
          <StarRow rating={place.rating} />
          <span className="text-sm font-bold text-slate-800">{place.rating}</span>
          <span className="text-xs text-slate-400">{place.reviews.toLocaleString()} đánh giá</span>
        </div>
        <p className="text-sm text-slate-500 leading-relaxed mb-3 line-clamp-2">{place.desc}</p>
        <div className="flex items-center gap-4 text-xs text-slate-500 mb-3">
          <div className="flex items-center gap-1.5"><Clock size={11} className="text-slate-400" /><span>{place.hours}</span></div>
          <span className="font-semibold" style={{ color: "#064E3B" }}>{place.price}</span>
        </div>
        <div className="flex flex-wrap gap-1.5 mb-4">
          {place.tags.map((tag) => (
            <span key={tag} className="text-[11px] font-medium px-2.5 py-1 rounded-full" style={{ background: "#ECFDF5", color: "#064E3B" }}>{tag}</span>
          ))}
        </div>
        <div className="mt-auto flex justify-end">
          <button className="flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-xl text-white hover:opacity-85" style={{ background: "#064E3B" }}>
            Xem chi tiết <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

const PRICE_MAX = 2000000;

export default function ExplorePage() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [sort, setSort] = useState("Phù hợp nhất");
  const [sortOpen, setSortOpen] = useState(false);
  const [search, setSearch] = useState("");

  // Filters
  const [region, setRegion] = useState("Tất cả");
  const [province, setProvince] = useState("Tất cả");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(PRICE_MAX);
  const [minRating, setMinRating] = useState(0);
  const [onlyOpen, setOnlyOpen] = useState(false);

  const [savedIds, setSavedIds] = useState<Set<number>>(new Set([3, 7]));
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 6;

  // Close sort on outside click
  useEffect(() => {
    if (!sortOpen) return;
    const handler = () => setSortOpen(false);
    window.addEventListener("click", handler);
    return () => window.removeEventListener("click", handler);
  }, [sortOpen]);

  const toggleSave = (id: number) => {
    setSavedIds((prev) => { const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next; });
  };

  const resetFilters = () => {
    setRegion("Tất cả"); setProvince("Tất cả");
    setSelectedTypes([]); setPriceMin(0); setPriceMax(PRICE_MAX);
    setMinRating(0); setOnlyOpen(false); setSearch("");
    setPage(1);
  };

  const filtered = places.filter((p) => {
    if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.location.toLowerCase().includes(search.toLowerCase())) return false;
    if (region !== "Tất cả" && p.region !== region) return false;
    if (province !== "Tất cả" && p.province !== province) return false;
    if (selectedTypes.length > 0 && !selectedTypes.includes(p.type)) return false;
    if (p.priceMax > 0 && (p.priceMax < priceMin || p.priceMax > priceMax)) return false;
    if (minRating > 0 && p.rating < minRating) return false;
    if (onlyOpen && p.status !== "Đang mở") return false;
    return true;
  });

  const activeCount = [
    region !== "Tất cả", province !== "Tất cả",
    selectedTypes.length > 0,
    priceMin > 0 || priceMax < PRICE_MAX,
    minRating > 0, onlyOpen,
  ].filter(Boolean).length;

  const sortOptions = ["Phù hợp nhất", "Đánh giá cao", "Nhiều lượt yêu thích", "Mới nhất"];
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pagedResults = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Build active filter chips
  const activeChips: { label: string; onRemove: () => void }[] = [];
  if (region !== "Tất cả") activeChips.push({ label: region, onRemove: () => { setRegion("Tất cả"); setProvince("Tất cả"); } });
  if (province !== "Tất cả") activeChips.push({ label: province, onRemove: () => setProvince("Tất cả") });
  selectedTypes.forEach((t) => activeChips.push({ label: t, onRemove: () => setSelectedTypes(selectedTypes.filter((s) => s !== t)) }));
  if (priceMin > 0 || priceMax < PRICE_MAX) activeChips.push({ label: `${fmt(priceMin)} – ${priceMax >= PRICE_MAX ? "∞" : fmt(priceMax)}`, onRemove: () => { setPriceMin(0); setPriceMax(PRICE_MAX); } });
  if (minRating > 0) activeChips.push({ label: `${minRating}★ trở lên`, onRemove: () => setMinRating(0) });
  if (onlyOpen) activeChips.push({ label: "Đang mở cửa", onRemove: () => setOnlyOpen(false) });

  return (
    <div className="min-h-screen" style={{ background: "#F8FAFC" }}>

      {/* ── HERO BANNER ── */}
      <div className="relative overflow-hidden" style={{ height: 300 }}>
        <img
          src="https://images.unsplash.com/photo-1528127269322-539801943592?w=1600&h=600&fit=crop&auto=format"
          alt="Vietnam travel banner"
          className="w-full h-full object-cover"
        />
        {/* Dark overlay */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.55) 100%)" }} />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
          <p className="text-xs font-semibold tracking-[0.25em] uppercase text-white/60">Việt Nam · 63 tỉnh thành</p>
          <h1
            className="text-5xl md:text-6xl lg:text-7xl font-bold text-center leading-tight"
            style={{
              fontFamily: "'Playfair Display', serif",
              letterSpacing: "-0.02em",
              color: "rgba(255,255,255,0.92)",
              textShadow: "0 1px 2px rgba(0,0,0,0.3)",
              WebkitTextStroke: "0.5px rgba(255,255,255,0.2)",
            }}
          >
            Khám phá địa điểm
          </h1>
          <p className="text-sm text-white/55 max-w-md text-center leading-relaxed">
            Nhà hàng, cà phê, điểm du lịch được review thực tế trên khắp Việt Nam
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 flex gap-6 items-start">

        {/* ── SIDEBAR ─────────────────────────────────────────────────────────── */}
        <aside
          className="hidden md:block flex-shrink-0 bg-white rounded-2xl border border-slate-100 overflow-hidden"
          style={{
            width: 288,
            position: "sticky",
            top: 80,
            maxHeight: "calc(100vh - 100px)",
            boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
          }}
        >
          {/* Sidebar header */}
          <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid #F3F4F6" }}>
            <div className="flex items-center gap-2">
              <SlidersHorizontal size={15} className="text-slate-700" />
              <span className="font-bold text-slate-900 text-sm">Bộ lọc</span>
              {activeCount > 0 && (
                <span className="text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center text-white" style={{ background: "#18181B" }}>
                  {activeCount}
                </span>
              )}
            </div>
            {activeCount > 0 && (
              <button
                onClick={resetFilters}
                className="text-xs font-medium text-slate-500 hover:underline transition-all"
              >
                Xóa hết
              </button>
            )}
          </div>

          {/* Scrollable body */}
          <div className="overflow-y-auto px-5" style={{ maxHeight: "calc(100vh - 172px)", scrollbarWidth: "none" }}>

            {/* 1. Location */}
            <FilterSection title="Khu vực" badge={(region !== "Tất cả" || province !== "Tất cả") ? 1 : undefined}>
              <RegionPills
                region={region} province={province}
                onRegionChange={setRegion} onProvinceChange={setProvince}
              />
            </FilterSection>

            {/* 2. Type */}
            <FilterSection title="Loại địa điểm" badge={selectedTypes.length || undefined}>
              <PillCheckboxes options={typeOptions} selected={selectedTypes} onChange={setSelectedTypes} />
            </FilterSection>

            {/* 3. Price */}
            <FilterSection title="Mức giá" badge={(priceMin > 0 || priceMax < PRICE_MAX) ? 1 : undefined}>
              <DualRangeSlider
                min={0} max={PRICE_MAX}
                valueMin={priceMin} valueMax={priceMax}
                onChange={(lo, hi) => { setPriceMin(lo); setPriceMax(hi); }}
              />
            </FilterSection>

            {/* 4. Rating */}
            <FilterSection title="Đánh giá" badge={minRating > 0 ? 1 : undefined}>
              <StarRating value={minRating} onChange={setMinRating} />
            </FilterSection>

            {/* 5. Status toggle */}
            <FilterSection title="Trạng thái" badge={onlyOpen ? 1 : undefined}>
              <ToggleSwitch checked={onlyOpen} onChange={setOnlyOpen} />
            </FilterSection>

            <div className="pb-5" />
          </div>
        </aside>

        {/* ── RESULTS ─────────────────────────────────────────────────────────── */}
        <div className="flex-1 min-w-0">
          {/* Active filter chips */}
          {activeChips.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4 pb-4" style={{ borderBottom: "1px solid #E2E8F0" }}>
              {activeChips.map((chip, i) => (
                <div
                  key={i}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full"
                  style={{ background: "#F3F4F6", color: "#27272A", border: "1px solid #E5E7EB" }}
                >
                  {chip.label}
                  <button
                    onClick={chip.onRemove}
                    className="w-4 h-4 rounded-full flex items-center justify-center transition-colors hover:bg-slate-200"
                  >
                    <X size={10} className="text-slate-500" />
                  </button>
                </div>
              ))}
              {activeChips.length > 1 && (
                <button
                  onClick={resetFilters}
                  className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full transition-all hover:opacity-80"
                  style={{ background: "#FEF2F2", color: "#DC2626", border: "1px solid #FECACA" }}
                >
                  <X size={10} /> Xóa tất cả
                </button>
              )}
            </div>
          )}

          {/* Toolbar */}
          <div className="flex items-center justify-between gap-4 mb-5">
            <span className="text-sm text-slate-500">
              <span className="font-bold text-slate-800">{filtered.length}</span> địa điểm
              {activeChips.length > 0 && <span className="text-slate-400"> được lọc</span>}
            </span>
            <div className="flex items-center gap-3">
              {/* Sort */}
              <div className="relative">
                <button
                  onClick={(e) => { e.stopPropagation(); setSortOpen((v) => !v); }}
                  className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-xl bg-white border border-slate-200 hover:border-slate-300 transition-colors"
                >
                  <span className="hidden sm:block text-slate-600">{sort}</span>
                  <ChevronDown size={14} className="text-slate-400 transition-transform" style={{ transform: sortOpen ? "rotate(180deg)" : undefined }} />
                </button>
                {sortOpen && (
                  <div className="absolute right-0 top-full mt-2 bg-white rounded-xl border border-slate-100 py-1 z-20"
                    style={{ minWidth: 200, boxShadow: "0 8px 24px rgba(0,0,0,0.1)" }}
                    onClick={(e) => e.stopPropagation()}>
                    {sortOptions.map((opt) => (
                      <button key={opt} onClick={() => { setSort(opt); setSortOpen(false); }}
                        className="w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-slate-50"
                        style={{ color: sort === opt ? "#064E3B" : "#374151", fontWeight: sort === opt ? 600 : 400 }}>
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* View toggle */}
              <div className="flex items-center rounded-xl overflow-hidden border border-slate-200 bg-white">
                {(["grid", "list"] as const).map((v) => (
                  <button key={v} onClick={() => setView(v)}
                    className="w-9 h-9 flex items-center justify-center transition-colors"
                    style={{ background: view === v ? "#064E3B" : "transparent" }}
                    title={v === "grid" ? "Dạng lưới" : "Dạng danh sách"}>
                    {v === "grid"
                      ? <Grid3x3 size={15} className={view === v ? "text-white" : "text-slate-400"} />
                      : <List size={15} className={view === v ? "text-white" : "text-slate-400"} />
                    }
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Cards */}
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ background: "#F3F4F6" }}>
                <Search size={24} className="text-slate-400" />
              </div>
              <h3 className="font-bold text-slate-800 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>Không tìm thấy kết quả</h3>
              <p className="text-sm text-slate-500 mb-4">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
              <button onClick={resetFilters} className="text-sm font-semibold px-5 py-2.5 rounded-xl text-white" style={{ background: "#18181B" }}>
                Xóa bộ lọc
              </button>
            </div>
          ) : view === "grid" ? (
            <div className="grid gap-5" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))" }}>
              {pagedResults.map((place) => (
                <PlaceCardGrid key={place.id} place={place} saved={savedIds.has(place.id)} onToggleSave={() => toggleSave(place.id)} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {pagedResults.map((place) => (
                <PlaceCardList key={place.id} place={place} saved={savedIds.has(place.id)} onToggleSave={() => toggleSave(place.id)} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && filtered.length > 0 && (
            <div className="flex items-center justify-center gap-1 mt-8">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-9 h-9 rounded-full flex items-center justify-center border border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:text-slate-800 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronDown size={14} className="rotate-90" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all border"
                  style={page === p
                    ? { background: "#18181B", color: "#fff", borderColor: "#18181B" }
                    : { background: "#fff", color: "#6B7280", borderColor: "#E5E7EB" }}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="w-9 h-9 rounded-full flex items-center justify-center border border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:text-slate-800 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronDown size={14} className="-rotate-90" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
