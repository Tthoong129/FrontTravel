import { useState, useMemo } from "react";
import {
  Trophy,
  Flame,
  TrendingUp,
  Star,
  MapPin,
  Eye,
  Bookmark,
  Share2,
  SlidersHorizontal,
  Search,
  Filter,
  ArrowUp,
  ArrowDown,
  Minus,
  Sparkles,
  Award,
  Pin,
  Zap,
  Download,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  BarChart3,
  X,
  Compass,
  Utensils,
  Camera,
  Building,
  Heart,
  TrendingDown,
} from "lucide-react";

export interface RankedPlaceItem {
  id: number;
  rank: number;
  previousRank: number;
  name: string;
  category: string;
  province: string;
  region: "Miền Bắc" | "Miền Trung" | "Miền Nam";
  coverImage: string;
  rating: number;
  reviewCount: number;
  checkInCount: number;
  viewCount: number;
  bookmarkCount: number;
  trendingScore: number; // 0 - 100
  growthRate: number; // e.g. +28.5%
  isPinned: boolean;
  isBoosted: boolean;
  badges: string[];
  address: string;
  tags: string[];
}

const INITIAL_RANKINGS: RankedPlaceItem[] = [
  {
    id: 1,
    rank: 1,
    previousRank: 1,
    name: "Mì Quảng Ếch Bếp Trang",
    category: "Nhà hàng & Quán ăn",
    province: "Đà Nẵng",
    region: "Miền Trung",
    coverImage: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=400&fit=crop",
    rating: 4.8,
    reviewCount: 428,
    checkInCount: 1850,
    viewCount: 45200,
    bookmarkCount: 960,
    trendingScore: 98.6,
    growthRate: 34.2,
    isPinned: true,
    isBoosted: true,
    badges: ["Top 1 Miền Trung", "Michelin Guide Selected", "🔥 Hot Trending"],
    address: "441 Ông Ích Khiêm, Hải Châu, Đà Nẵng",
    tags: ["Mì Quảng", "Đặc sản Đà Nẵng", "Gia đình"],
  },
  {
    id: 2,
    rank: 2,
    previousRank: 3,
    name: "Phố cổ Hội An - Chùa Cầu",
    category: "Thắng cảnh & Di tích",
    province: "Quảng Nam",
    region: "Miền Trung",
    coverImage: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=600&h=400&fit=crop",
    rating: 4.9,
    reviewCount: 890,
    checkInCount: 3420,
    viewCount: 68900,
    bookmarkCount: 2150,
    trendingScore: 96.8,
    growthRate: 28.5,
    isPinned: true,
    isBoosted: false,
    badges: ["Di sản UNESCO", "Top Check-in"],
    address: "Đường Nguyễn Thị Minh Khai, Minh An, Hội An",
    tags: ["Di sản", "Check-in đêm", "Lồng đèn"],
  },
  {
    id: 3,
    rank: 3,
    previousRank: 2,
    name: "Bà Nà Hills - Cầu Vàng",
    category: "Thắng cảnh & Di tích",
    province: "Đà Nẵng",
    region: "Miền Trung",
    coverImage: "https://images.unsplash.com/photo-1528127269322-539801943592?w=600&h=400&fit=crop",
    rating: 4.7,
    reviewCount: 1250,
    checkInCount: 4890,
    viewCount: 84300,
    bookmarkCount: 3100,
    trendingScore: 95.2,
    growthRate: 19.8,
    isPinned: true,
    isBoosted: false,
    badges: ["Kỳ quan kiến trúc", "Top Check-in Quốc tế"],
    address: "Thôn An Sơn, Xã Hòa Ninh, Huyện Hòa Vang, Đà Nẵng",
    tags: ["Cáp treo", "Cầu Vàng", "Làng Pháp"],
  },
  {
    id: 4,
    rank: 4,
    previousRank: 6,
    name: "Cà phê Vợt Phan Đình Phùng",
    category: "Check-in & Cà phê",
    province: "TP. Hồ Chí Minh",
    region: "Miền Nam",
    coverImage: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&h=400&fit=crop",
    rating: 4.6,
    reviewCount: 310,
    checkInCount: 1420,
    viewCount: 29400,
    bookmarkCount: 780,
    trendingScore: 91.4,
    growthRate: 42.1,
    isPinned: false,
    isBoosted: true,
    badges: ["Văn hóa Sài Gòn xưa", "🚀 Đột biến lượt xem"],
    address: "330 Phan Đình Phùng, Phường 1, Phú Nhuận, TP.HCM",
    tags: ["Cà phê vợt", "Sài Gòn 24/7", "Hoài niệm"],
  },
  {
    id: 5,
    rank: 5,
    previousRank: 4,
    name: "Tràng An - Tuyệt Tình Cốc",
    category: "Thắng cảnh & Di tích",
    province: "Ninh Bình",
    region: "Miền Bắc",
    coverImage: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=600&h=400&fit=crop",
    rating: 4.9,
    reviewCount: 760,
    checkInCount: 2890,
    viewCount: 52100,
    bookmarkCount: 1640,
    trendingScore: 89.9,
    growthRate: 15.6,
    isPinned: false,
    isBoosted: false,
    badges: ["Top 1 Miền Bắc", "Di sản thiên nhiên"],
    address: "Quần thể danh thắng Tràng An, Hoa Lư, Ninh Bình",
    tags: ["Chèo thuyền", "Hang động", "Non nước"],
  },
  {
    id: 6,
    rank: 6,
    previousRank: 5,
    name: "Bánh Xèo Tôm Nhảy Cô Ba",
    category: "Nhà hàng & Quán ăn",
    province: "Bình Định",
    region: "Miền Trung",
    coverImage: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&h=400&fit=crop",
    rating: 4.5,
    reviewCount: 285,
    checkInCount: 940,
    viewCount: 18700,
    bookmarkCount: 520,
    trendingScore: 86.3,
    growthRate: 12.0,
    isPinned: false,
    isBoosted: false,
    badges: ["Đặc sản Quy Nhơn"],
    address: "Diên Hồng, Ngô Mây, TP. Quy Nhơn, Bình Định",
    tags: ["Bánh xèo", "Hải sản tươi", "Ẩm thực đêm"],
  },
  {
    id: 7,
    rank: 7,
    previousRank: 9,
    name: "Đồi Vô Ảnh - Check-in Gương Vô Cực",
    category: "Check-in & Cà phê",
    province: "Lâm Đồng",
    region: "Miền Nam",
    coverImage: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&h=400&fit=crop",
    rating: 4.4,
    reviewCount: 215,
    checkInCount: 1680,
    viewCount: 31200,
    bookmarkCount: 890,
    trendingScore: 84.7,
    growthRate: 38.4,
    isPinned: false,
    isBoosted: true,
    badges: ["Hiện tượng mạng Đà Lạt"],
    address: "Đường đèo Ankroet, Lạc Dương, Đà Lạt",
    tags: ["Sống ảo", "Đà Lạt view", "Gương vô cực"],
  },
  {
    id: 8,
    rank: 8,
    previousRank: 7,
    name: "InterContinental Danang Sun Peninsula Resort",
    category: "Khách sạn & Nghỉ dưỡng",
    province: "Đà Nẵng",
    region: "Miền Trung",
    coverImage: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop",
    rating: 4.95,
    reviewCount: 410,
    checkInCount: 890,
    viewCount: 41200,
    bookmarkCount: 1420,
    trendingScore: 83.5,
    growthRate: 8.9,
    isPinned: false,
    isBoosted: false,
    badges: ["Resort Sang Trọng Hàng Đầu", "Bill Bensley Design"],
    address: "Bãi Bắc, Bán đảo Sơn Trà, Đà Nẵng",
    tags: ["Resort 5 sao", "Sơn Trà", "Nghỉ dưỡng"],
  },
];

interface TrendingLeaderboardTabProps {
  showToast: (msg: string) => void;
}

export default function TrendingLeaderboardTab({ showToast }: TrendingLeaderboardTabProps) {
  const [places, setPlaces] = useState<RankedPlaceItem[]>(INITIAL_RANKINGS);
  const [timeFilter, setTimeFilter] = useState<"week" | "month" | "quarter" | "all">("week");
  const [regionFilter, setRegionFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [searchText, setSearchText] = useState("");
  const [selectedPlaceForAnalytics, setSelectedPlaceForAnalytics] = useState<RankedPlaceItem | null>(null);

  // Filtered List
  const filteredList = useMemo(() => {
    return places.filter((item) => {
      if (regionFilter !== "all" && item.region !== regionFilter && item.province !== regionFilter) return false;
      if (categoryFilter !== "all" && item.category !== categoryFilter) return false;
      if (searchText.trim()) {
        const q = searchText.toLowerCase();
        return (
          item.name.toLowerCase().includes(q) ||
          item.province.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q) ||
          item.tags.some((t) => t.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [places, regionFilter, categoryFilter, searchText]);

  // Top 3 Podium
  const top1 = filteredList[0] || null;
  const top2 = filteredList[1] || null;
  const top3 = filteredList[2] || null;

  // Toggle Pinned
  const handleTogglePin = (id: number) => {
    setPlaces((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const next = !item.isPinned;
          showToast(`Đã ${next ? "Ghim nổi bật trên Trang chủ" : "Bỏ ghim"} cho "${item.name}".`);
          return { ...item, isPinned: next };
        }
        return item;
      })
    );
  };

  // Boost Priority
  const handleBoostVisibility = (id: number) => {
    setPlaces((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const next = !item.isBoosted;
          showToast(`Đã ${next ? "Kích hoạt Tăng điểm ưu tiên +10%" : "Hủy tăng điểm"} cho "${item.name}".`);
          return { ...item, isBoosted: next, trendingScore: next ? Math.min(100, item.trendingScore + 2.5) : Math.max(0, item.trendingScore - 2.5) };
        }
        return item;
      })
    );
  };

  const renderRankChange = (current: number, previous: number) => {
    if (previous > current) {
      return (
        <span className="inline-flex items-center text-emerald-600 font-bold text-[10px] gap-0.5">
          <ArrowUp size={11} /> +{previous - current}
        </span>
      );
    } else if (previous < current) {
      return (
        <span className="inline-flex items-center text-rose-600 font-bold text-[10px] gap-0.5">
          <ArrowDown size={11} /> -{current - previous}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center text-slate-400 font-bold text-[10px] gap-0.5">
        <Minus size={11} /> 0
      </span>
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200 text-slate-800 pb-16">
      {/* ── 1. HEADER & TOP BANNER ── */}
      {/* ── 1. HEADER & ACTIONS ── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <span>Bảng Xếp Hạng & Xu Hướng</span>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1">
              <TrendingUp size={12} /> Live Trending
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Xếp hạng chuyên nghiệp dựa trên điểm tương tác, lượt đánh giá và tăng trưởng thực tế.
          </p>
        </div>

        {/* Quick Header Actions */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <div className="flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl text-xs font-semibold">
            {[
              { id: "week", label: "Tuần này" },
              { id: "month", label: "Tháng này" },
              { id: "quarter", label: "Quý này" },
              { id: "all", label: "Tất cả" },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTimeFilter(t.id as any)}
                className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                  timeFilter === t.id
                    ? "bg-white text-blue-600 shadow-xs font-bold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
          <button
            onClick={() => showToast("Đã tải xuống bảng xếp hạng định dạng Excel/CSV.")}
            className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs flex items-center gap-1.5 transition cursor-pointer"
          >
            <Download size={14} />
            <span>Xuất báo cáo</span>
          </button>
        </div>
      </div>

      {/* ── 2. TOP 3 HIGHLIGHTS ── */}
      {filteredList.length >= 3 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Rank 2 */}
          {top2 && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col order-2 md:order-1 relative group hover:border-slate-300 transition-colors">
              <div className="relative h-40 overflow-hidden bg-slate-100">
                <img src={top2.coverImage} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-slate-900/40" />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-white text-slate-800 font-bold text-xs flex items-center justify-center shadow-xs">
                  #2
                </div>
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <div className="flex items-center gap-1 text-[11px] text-slate-200 font-medium">
                    <MapPin size={11} /> {top2.province}
                  </div>
                  <h3 className="font-bold text-sm truncate">{top2.name}</h3>
                </div>
              </div>

              <div className="p-4 space-y-3 text-xs bg-white">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <span className="text-[11px] font-semibold text-slate-500">Trending Score</span>
                  <span className="font-bold text-slate-800 text-sm">{top2.trendingScore}/100</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center pt-1">
                  <div>
                    <div className="text-[10px] text-slate-500 font-medium">Đánh giá</div>
                    <div className="font-semibold text-slate-800 flex items-center justify-center gap-1 mt-1">
                      <Star size={11} className="text-amber-500 fill-amber-500" /> {top2.rating}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 font-medium">Check-in</div>
                    <div className="font-semibold text-slate-800 mt-1">{top2.checkInCount}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 font-medium">Tăng trưởng</div>
                    <div className="font-semibold text-emerald-600 mt-1">+{top2.growthRate}%</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Rank 1 */}
          {top1 && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col order-1 md:order-2 relative group hover:border-blue-300 transition-colors">
              <div className="absolute top-0 left-0 right-0 h-1 bg-blue-600 z-20" />
              <div className="relative h-44 overflow-hidden bg-slate-100">
                <img src={top1.coverImage} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-slate-900/40" />
                <div className="absolute top-4 left-3 px-3 py-1 rounded-md bg-blue-600 text-white font-bold text-sm flex items-center justify-center shadow-xs">
                  #1
                </div>
                <div className="absolute bottom-4 left-3 right-3 text-white">
                  <div className="flex items-center gap-1 text-[11px] text-blue-100 font-medium">
                    <MapPin size={11} /> {top1.province} · {top1.category}
                  </div>
                  <h3 className="font-bold text-base truncate mt-0.5">{top1.name}</h3>
                </div>
              </div>

              <div className="p-4 space-y-3 text-xs bg-white flex-1">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <span className="text-[11px] font-semibold text-slate-500">Trending Score</span>
                  <span className="font-bold text-blue-700 text-base">{top1.trendingScore}/100</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center pt-1">
                  <div>
                    <div className="text-[10px] text-slate-500 font-medium">Đánh giá</div>
                    <div className="font-semibold text-slate-800 flex items-center justify-center gap-1 mt-1">
                      <Star size={12} className="text-amber-500 fill-amber-500" /> {top1.rating}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 font-medium">Lượt xem</div>
                    <div className="font-semibold text-slate-800 mt-1">{(top1.viewCount / 1000).toFixed(1)}k</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 font-medium">Tăng tốc</div>
                    <div className="font-semibold text-emerald-600 mt-1">+{top1.growthRate}%</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Rank 3 */}
          {top3 && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col order-3 md:order-3 relative group hover:border-slate-300 transition-colors">
              <div className="relative h-40 overflow-hidden bg-slate-100">
                <img src={top3.coverImage} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-slate-900/40" />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-white text-slate-800 font-bold text-xs flex items-center justify-center shadow-xs">
                  #3
                </div>
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <div className="flex items-center gap-1 text-[11px] text-slate-200 font-medium">
                    <MapPin size={11} /> {top3.province}
                  </div>
                  <h3 className="font-bold text-sm truncate">{top3.name}</h3>
                </div>
              </div>

              <div className="p-4 space-y-3 text-xs bg-white">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <span className="text-[11px] font-semibold text-slate-500">Trending Score</span>
                  <span className="font-bold text-slate-800 text-sm">{top3.trendingScore}/100</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center pt-1">
                  <div>
                    <div className="text-[10px] text-slate-500 font-medium">Đánh giá</div>
                    <div className="font-semibold text-slate-800 flex items-center justify-center gap-1 mt-1">
                      <Star size={11} className="text-amber-500 fill-amber-500" /> {top3.rating}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 font-medium">Check-in</div>
                    <div className="font-semibold text-slate-800 mt-1">{top3.checkInCount}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 font-medium">Tăng trưởng</div>
                    <div className="font-semibold text-emerald-600 mt-1">+{top3.growthRate}%</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── 3. FILTER BAR ── */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          {/* Region Filter */}
          <select
            value={regionFilter}
            onChange={(e) => setRegionFilter(e.target.value)}
            className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white font-bold text-slate-700 outline-none hover:border-slate-300 cursor-pointer"
          >
            <option value="all">Toàn quốc (Tất cả vùng)</option>
            <option value="Miền Bắc">Miền Bắc</option>
            <option value="Miền Trung">Miền Trung</option>
            <option value="Miền Nam">Miền Nam</option>
            <option value="Đà Nẵng">TP. Đà Nẵng</option>
            <option value="Hà Nội">TP. Hà Nội</option>
            <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
            <option value="Quảng Nam">Tỉnh Quảng Nam</option>
            <option value="Lâm Đồng">Tỉnh Lâm Đồng</option>
            <option value="Ninh Bình">Tỉnh Ninh Bình</option>
          </select>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white font-bold text-slate-700 outline-none hover:border-slate-300 cursor-pointer"
          >
            <option value="all">Tất cả danh mục</option>
            <option value="Nhà hàng & Quán ăn">Nhà hàng &amp; Quán ăn</option>
            <option value="Thắng cảnh & Di tích">Thắng cảnh &amp; Di tích</option>
            <option value="Check-in & Cà phê">Check-in &amp; Cà phê</option>
            <option value="Khách sạn & Nghỉ dưỡng">Khách sạn &amp; Nghỉ dưỡng</option>
          </select>
        </div>

        {/* Search Input */}
        <div className="relative flex-1 sm:max-w-xs">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm địa điểm, tỉnh thành..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-xs font-semibold outline-none focus:border-blue-500 transition"
          />
        </div>
      </div>

      {/* ── 4. DETAILED RANKING TABLE ── */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden text-xs">
        <div className="p-4 sm:p-5 bg-slate-50/70 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 size={16} className="text-blue-600" />
            <h3 className="font-bold text-sm text-slate-900">
              Chi tiết Bảng xếp hạng ({filteredList.length} địa điểm)
            </h3>
          </div>
          <span className="text-[11px] text-slate-400">
            Dữ liệu được làm mới 15 phút một lần
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-100/50 text-slate-500 font-bold border-b border-slate-200 text-[11px] uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4 text-center w-16">Hạng</th>
                <th className="py-3.5 px-4">Địa điểm &amp; Địa chỉ</th>
                <th className="py-3.5 px-4">Khu vực / Phân loại</th>
                <th className="py-3.5 px-4 text-center">Trending Score</th>
                <th className="py-3.5 px-4 text-center">Đánh giá &amp; Lượt xem</th>
                <th className="py-3.5 px-4 text-center">Tăng trưởng</th>
                <th className="py-3.5 px-4 text-right">Điều phối Curation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredList.map((item, idx) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition">
                  {/* Rank column */}
                  <td className="py-3.5 px-4 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <span
                        className={`w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs ${
                          item.rank === 1
                            ? "bg-amber-400 text-amber-950 shadow-xs"
                            : item.rank === 2
                            ? "bg-slate-200 text-slate-800"
                            : item.rank === 3
                            ? "bg-amber-700 text-white"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        #{item.rank}
                      </span>
                      <div className="mt-1">
                        {renderRankChange(item.rank, item.previousRank)}
                      </div>
                    </div>
                  </td>

                  {/* Name & Cover */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.coverImage}
                        alt=""
                        className="w-12 h-12 rounded-xl object-cover ring-1 ring-slate-200 shrink-0"
                      />
                      <div className="space-y-0.5 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-bold text-slate-900 text-xs hover:text-blue-600 transition">
                            {item.name}
                          </span>
                          {item.isPinned && (
                            <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 text-[10px] font-bold flex items-center gap-0.5">
                              <Pin size={9} /> Ghim Trang chủ
                            </span>
                          )}
                          {item.isBoosted && (
                            <span className="px-1.5 py-0.2 rounded bg-blue-100 text-blue-700 text-[10px] font-bold flex items-center gap-0.5">
                              <Zap size={9} /> Boosted +10%
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 truncate max-w-xs">{item.address}</p>
                      </div>
                    </div>
                  </td>

                  {/* Province / Category */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="font-bold text-slate-800">{item.province}</div>
                    <div className="text-[11px] text-slate-400">{item.category}</div>
                  </td>

                  {/* Trending Score */}
                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    <div className="inline-block px-2.5 py-1 rounded-xl bg-blue-50 border border-blue-100 text-blue-700 font-mono font-black text-xs">
                      {item.trendingScore}
                    </div>
                  </td>

                  {/* Reviews & Views */}
                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-1 font-bold text-slate-800">
                      <Star size={12} className="text-amber-500 fill-amber-500" />
                      <span>{item.rating}</span>
                      <span className="text-slate-400 text-[11px]">({item.reviewCount})</span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {(item.viewCount / 1000).toFixed(1)}k views · {item.checkInCount} check-in
                    </div>
                  </td>

                  {/* Growth */}
                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    <span className="inline-flex items-center gap-0.5 font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                      <TrendingUp size={12} /> +{item.growthRate}%
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setSelectedPlaceForAnalytics(item)}
                        className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 transition cursor-pointer"
                        title="Xem phân tích lưu lượng"
                      >
                        <BarChart3 size={14} />
                      </button>

                      <button
                        onClick={() => handleTogglePin(item.id)}
                        className={`p-1.5 rounded-lg border transition cursor-pointer ${
                          item.isPinned
                            ? "bg-amber-500 text-white border-amber-500"
                            : "border-slate-200 hover:bg-amber-50 text-slate-400 hover:text-amber-600"
                        }`}
                        title={item.isPinned ? "Bỏ ghim khỏi Trang chủ" : "Ghim lên Trang chủ"}
                      >
                        <Pin size={14} />
                      </button>

                      <button
                        onClick={() => handleBoostVisibility(item.id)}
                        className={`p-1.5 rounded-lg border transition cursor-pointer ${
                          item.isBoosted
                            ? "bg-blue-600 text-white border-blue-600"
                            : "border-slate-200 hover:bg-blue-50 text-slate-400 hover:text-blue-600"
                        }`}
                        title={item.isBoosted ? "Hủy tăng ưu tiên" : "Tăng ưu tiên hiển thị +10%"}
                      >
                        <Zap size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── 5. ANALYTICS DETAIL MODAL ── */}
      {selectedPlaceForAnalytics && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden text-xs animate-in zoom-in-95">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
                  <BarChart3 size={17} />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Phân tích Lưu lượng &amp; Tương tác</h3>
                  <p className="text-[11px] text-slate-400">{selectedPlaceForAnalytics.name}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedPlaceForAnalytics(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-100">
                  <div className="text-[10px] text-blue-700 font-bold uppercase">Trending Score</div>
                  <div className="font-black text-xl text-blue-900 mt-0.5">{selectedPlaceForAnalytics.trendingScore}</div>
                  <div className="text-[10px] text-blue-600 mt-1">Hạng #{selectedPlaceForAnalytics.rank} toàn quốc</div>
                </div>

                <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-100">
                  <div className="text-[10px] text-emerald-700 font-bold uppercase">Tốc độ Tăng trưởng</div>
                  <div className="font-black text-xl text-emerald-900 mt-0.5">+{selectedPlaceForAnalytics.growthRate}%</div>
                  <div className="text-[10px] text-emerald-600 mt-1">So với tuần trước</div>
                </div>
              </div>

              <div className="space-y-2 border-t border-slate-100 pt-3">
                <div className="font-bold text-xs text-slate-900">Cơ cấu chỉ số tương tác</div>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">Lượt xem trang (Views)</span>
                    <span className="font-bold text-slate-800">{selectedPlaceForAnalytics.viewCount.toLocaleString()} lượt</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">Lượt Check-in thực tế</span>
                    <span className="font-bold text-slate-800">{selectedPlaceForAnalytics.checkInCount.toLocaleString()} lượt</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">Đánh giá tích cực (&gt; 4 sao)</span>
                    <span className="font-bold text-emerald-600">94.8%</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">Lượt lưu yêu thích (Bookmarks)</span>
                    <span className="font-bold text-slate-800">{selectedPlaceForAnalytics.bookmarkCount.toLocaleString()} lượt</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                onClick={() => setSelectedPlaceForAnalytics(null)}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
