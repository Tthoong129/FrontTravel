import { useState, useMemo } from "react";
import { places as allPlaces, Place } from "./data";
import {
  Star,
  MapPin,
  Bookmark,
  Search,
  Clock,
  Tag,
  ArrowRight,
  SlidersHorizontal,
  ChevronDown,
  Sparkles,
} from "lucide-react";

interface LeaderboardPageProps {
  onSelectPlace: (place: Place) => void;
  onReportPlace?: (place: Place) => void;
  showToast: (message: string) => void;
}

const REGIONS = [
  { id: "all", label: "Toàn quốc" },
  { id: "Miền Bắc", label: "Miền Bắc" },
  { id: "Miền Trung", label: "Miền Trung" },
  { id: "Miền Nam", label: "Miền Nam" },
];

export default function LeaderboardPage({ onSelectPlace, showToast }: LeaderboardPageProps) {
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState<"rating" | "reviews">("rating");
  const [searchQuery, setSearchQuery] = useState("");
  const [savedPlaceIds, setSavedPlaceIds] = useState<Set<number>>(new Set());

  // Dynamic unique categories from DB
  const availableCategories = useMemo(() => {
    const cats = new Set<string>();
    allPlaces.forEach((p) => {
      if (p.category) cats.add(p.category);
    });
    return ["all", ...Array.from(cats)];
  }, []);

  // Filtered & Ranked Places (100% backend-ready sorting)
  const rankedPlaces = useMemo(() => {
    let list = [...allPlaces];

    // Filter by Region
    if (selectedRegion !== "all") {
      list = list.filter((p) => p.region === selectedRegion);
    }

    // Filter by Category
    if (selectedCategory !== "all") {
      list = list.filter((p) => p.category === selectedCategory);
    }

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.province.toLowerCase().includes(q) ||
          p.location.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Sort strictly by DB columns
    return list.sort((a, b) => {
      if (sortBy === "rating") {
        if (b.rating !== a.rating) return b.rating - a.rating;
        return b.reviews - a.reviews;
      } else {
        if (b.reviews !== a.reviews) return b.reviews - a.reviews;
        return b.rating - a.rating;
      }
    });
  }, [selectedRegion, selectedCategory, sortBy, searchQuery]);

  const handleToggleSave = (placeId: number, placeName: string) => {
    setSavedPlaceIds((prev) => {
      const next = new Set(prev);
      if (next.has(placeId)) {
        next.delete(placeId);
        showToast(`Đã bỏ lưu "${placeName}".`);
      } else {
        next.add(placeId);
        showToast(`Đã lưu "${placeName}" vào danh sách yêu thích.`);
      }
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased pb-20">
      {/* ── HEADER BÁO CHÍ ĐƠN GIẢN, TINH TẾ ── */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-4">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span>Trang chủ</span>
            <span>/</span>
            <span className="font-semibold text-slate-800">Bảng xếp hạng địa điểm</span>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Bảng Xếp Hạng Địa Điểm Nổi Bật Nhất
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed max-w-3xl">
              Danh sách được sắp xếp tự động dựa trên điểm đánh giá trung bình và số lượng phản hồi thực tế từ cộng đồng du khách trên hệ thống.
            </p>
          </div>
        </div>
      </div>

      {/* ── THANH BỘ LỌC TỐI GIẢN (KHÔNG CHẾ TRƯỜNG ẢO) ── */}
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            {/* Vùng miền */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              {REGIONS.map((r) => (
                <button
                  key={r.id}
                  onClick={() => setSelectedRegion(r.id)}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer whitespace-nowrap ${
                    selectedRegion === r.id
                      ? "bg-blue-600 text-white shadow-xs"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>

            {/* Bộ lọc Danh mục, Tiêu chí & Tìm kiếm */}
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              {/* Danh mục */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white font-medium text-slate-700 outline-none cursor-pointer hover:border-slate-300"
              >
                <option value="all">Tất cả danh mục</option>
                {availableCategories
                  .filter((c) => c !== "all")
                  .map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
              </select>

              {/* Sắp xếp theo DB fields */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white font-medium text-slate-700 outline-none cursor-pointer hover:border-slate-300"
              >
                <option value="rating">Điểm đánh giá cao nhất</option>
                <option value="reviews">Nhiều lượt đánh giá nhất</option>
              </select>

              {/* Ô tìm kiếm */}
              <div className="relative flex-1 sm:w-48">
                <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Tìm tên, tỉnh thành..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-xs outline-none focus:bg-white focus:border-blue-500 transition"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── DANH SÁCH XẾP HẠNG (THIẾT KẾ ĐƠN GIẢN, CHUẨN FORM BÁO CHÍ) ── */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-500 px-1">
          <span>
            Hiển thị <strong>{rankedPlaces.length}</strong> địa điểm
          </span>
          <span>
            Sắp xếp theo: <strong>{sortBy === "rating" ? "Số sao đánh giá (AvgRating)" : "Số đánh giá (ReviewCount)"}</strong>
          </span>
        </div>

        {rankedPlaces.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-slate-400 text-sm">
            Không tìm thấy địa điểm nào phù hợp với bộ lọc hiện tại.
          </div>
        ) : (
          rankedPlaces.map((place, index) => {
            const rank = index + 1;
            const isSaved = savedPlaceIds.has(place.id);

            return (
              <article
                key={place.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow p-5 sm:p-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
                  {/* CỘT TRÁI: ẢNH ĐỊA ĐIỂM */}
                  <div className="md:col-span-5 relative aspect-4/3 rounded-xl overflow-hidden bg-slate-100 group">
                    <img
                      src={place.img}
                      alt={place.name}
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300 cursor-pointer"
                      onClick={() => onSelectPlace(place)}
                    />
                    <span className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-slate-900/75 backdrop-blur-xs text-white font-semibold text-[11px] shadow-xs">
                      {place.category}
                    </span>
                    <span className="absolute bottom-3 left-3 px-2 py-0.5 rounded-md bg-slate-900/75 backdrop-blur-xs text-white font-medium text-[11px]">
                      {place.province}
                    </span>
                  </div>

                  {/* CỘT PHẢI: THÔNG TIN CHÍNH (CHUẨN 100% DB) */}
                  <div className="md:col-span-7 space-y-3">
                    {/* Dòng thứ hạng & Nút Bookmark */}
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h2
                          onClick={() => onSelectPlace(place)}
                          className="text-xl sm:text-2xl font-bold text-blue-700 hover:text-blue-800 hover:underline transition-colors cursor-pointer tracking-tight"
                        >
                          {place.name}
                        </h2>

                        <div className="mt-1 flex items-center gap-1.5 text-xs font-bold text-slate-800">
                          <span className="text-amber-600">📁</span>
                          <span>
                            # {rank} trong danh sách{" "}
                            <span className="font-semibold text-slate-700">
                              {place.category} ({place.region})
                            </span>
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleToggleSave(place.id, place.name)}
                        className={`p-2 rounded-xl border transition cursor-pointer shrink-0 ${
                          isSaved
                            ? "bg-rose-50 text-rose-600 border-rose-200"
                            : "bg-white text-slate-400 border-slate-200 hover:text-slate-700 hover:bg-slate-50"
                        }`}
                        title={isSaved ? "Đã lưu" : "Lưu vào yêu thích"}
                      >
                        <Bookmark size={15} className={isSaved ? "fill-current" : ""} />
                      </button>
                    </div>

                    {/* Dải thông số sao, đánh giá, địa chỉ, mức giá */}
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 font-medium pt-0.5">
                      <div className="flex items-center gap-1 text-amber-600 font-bold">
                        <Star size={13} className="fill-amber-400 text-amber-500" />
                        <span>{place.rating.toFixed(1)}</span>
                        <span className="text-slate-400 font-normal">({place.reviews} đánh giá)</span>
                      </div>
                      <span>·</span>
                      <div className="flex items-center gap-1 text-slate-600">
                        <MapPin size={12} className="text-slate-400" />
                        <span>{place.location}</span>
                      </div>
                      <span>·</span>
                      <span className="text-slate-700 font-semibold">{place.price}</span>
                      {place.hours && (
                        <>
                          <span>·</span>
                          <div className="flex items-center gap-1 text-slate-500">
                            <Clock size={12} className="text-slate-400" />
                            <span>{place.hours}</span>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Mô tả từ DB */}
                    <p className="text-xs sm:text-[13px] text-slate-700 leading-relaxed pt-1 line-clamp-3">
                      {place.desc}
                    </p>

                    {/* Tags từ DB */}
                    {place.tags && place.tags.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        {place.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[11px] font-medium"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Nút xem chi tiết */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-end">
                      <button
                        onClick={() => onSelectPlace(place)}
                        className="text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <span>Xem chi tiết địa điểm &amp; Đánh giá</span>
                        <ArrowRight size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })
        )}
      </main>
    </div>
  );
}
