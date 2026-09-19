import React, { useState } from "react";
import {
  Coffee,
  UtensilsCrossed,
  Soup,
  Leaf,
  Cake,
  Award,
  Star,
  MapPin,
  Clock,
  ArrowRight,
  Search,
  Sparkles,
  ChevronRight,
  Flag,
} from "lucide-react";
import { Place, places } from "./data";

const CATEGORIES = [
  { label: "Cà phê & Trà", icon: Coffee, count: "120+ quán" },
  { label: "Ăn vặt phố cổ", icon: UtensilsCrossed, count: "85+ điểm" },
  { label: "Nhà hàng đặc sản", icon: Soup, count: "95+ quán" },
  { label: "Món chay thanh tịnh", icon: Leaf, count: "40+ điểm" },
  { label: "Tráng miệng & Bánh", icon: Cake, count: "60+ quán" },
  { label: "Chuẩn Michelin", icon: Award, count: "25+ điểm" },
];

const FOOD_CARDS = [
  {
    name: "Phở Bò Tái Lăn Bát Đàn",
    region: "Miền Bắc",
    province: "Hà Nội",
    price: "55.000đ - 85.000đ",
    rating: 4.9,
    reviews: 1420,
    tag: "Đặc sản",
    img: "https://images.unsplash.com/photo-1527997921830-de1cf1f9b430?w=600&h=800&fit=crop&auto=format",
  },
  {
    name: "Bún Chả Nem Cua Bể",
    region: "Miền Bắc",
    province: "Hà Nội",
    price: "60.000đ - 90.000đ",
    rating: 4.8,
    reviews: 980,
    tag: "Gia truyền",
    img: "https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=600&h=800&fit=crop&auto=format",
  },
  {
    name: "Bánh Mì Phố Cổ Phượng",
    region: "Miền Trung",
    province: "Hội An",
    price: "35.000đ - 50.000đ",
    rating: 4.9,
    reviews: 3200,
    tag: "Nổi tiếng",
    img: "https://images.unsplash.com/photo-1517433367423-c7e5b0f35086?w=600&h=800&fit=crop&auto=format",
  },
  {
    name: "Cơm Tấm Sườn Bì Chả",
    region: "Miền Nam",
    province: "TP. Hồ Chí Minh",
    price: "45.000đ - 75.000đ",
    rating: 4.8,
    reviews: 2150,
    tag: "Sài Gòn",
    img: "https://images.unsplash.com/photo-1718942900279-4711345169d3?w=600&h=800&fit=crop&auto=format",
  },
  {
    name: "Bún Bò Giò Heo Cố Đô",
    region: "Miền Trung",
    province: "Thừa Thiên Huế",
    price: "50.000đ - 70.000đ",
    rating: 4.9,
    reviews: 1840,
    tag: "Cung đình",
    img: "https://images.unsplash.com/photo-1509072619873-adb3dc289b50?w=600&h=800&fit=crop&auto=format",
  },
  {
    name: "Mì Quảng Tôm Thịt Trứng",
    region: "Miền Trung",
    province: "Đà Nẵng",
    price: "40.000đ - 65.000đ",
    rating: 4.7,
    reviews: 1120,
    tag: "Đậm đà",
    img: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=600&h=800&fit=crop&auto=format",
  },
  {
    name: "Bánh Xèo Tôm Nhảy Giòn Rụm",
    region: "Miền Nam",
    province: "Cần Thơ",
    price: "35.000đ - 60.000đ",
    rating: 4.8,
    reviews: 890,
    tag: "Miền Tây",
    img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=800&fit=crop&auto=format",
  },
  {
    name: "Cao Lầu Thịt Xíu Hội An",
    region: "Miền Trung",
    province: "Quảng Nam",
    price: "40.000đ - 55.000đ",
    rating: 4.9,
    reviews: 1650,
    tag: "Di sản",
    img: "https://images.unsplash.com/photo-1552611052-33e04de081de?w=600&h=800&fit=crop&auto=format",
  },
];

const COLLECTIONS = [
  {
    eyebrow: "Bộ sưu tập · Bờ biển",
    title: "Top 10 Quán Cà Phê View Biển Đẹp Nhất Việt Nam",
    desc: "Ngắm trọn hoàng hôn lãng mạn cùng ly cà phê đậm đà",
    placesCount: "10 địa điểm",
    img: "https://images.unsplash.com/photo-1559847844-5315695dadae?w=800&h=500&fit=crop&auto=format",
  },
  {
    eyebrow: "Hành trình ẩm thực · Phố cổ",
    title: "15 Món Ăn Đường Phố Nhất Định Phải Thử Tại Hội An",
    desc: "Khám phá hương vị truyền thống ngàn năm trong lòng phố hội",
    placesCount: "15 món ngon",
    img: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=500&fit=crop&auto=format",
  },
];

export default function FoodPage({
  onSelectPlace,
  onReportPlace,
}: {
  onSelectPlace: (p: Place) => void;
  onReportPlace?: (p: Place) => void;
}) {
  const [selectedRegion, setSelectedRegion] = useState("Tất cả");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCat, setSelectedCat] = useState<string | null>(null);

  const foodPlaces = places.filter((p) => p.type === "Ăn uống");

  const filteredFoodCards = FOOD_CARDS.filter((card) => {
    const matchRegion =
      selectedRegion === "Tất cả" || card.region === selectedRegion;
    const matchQuery =
      !searchQuery ||
      card.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.province.toLowerCase().includes(searchQuery.toLowerCase());
    return matchRegion && matchQuery;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-24">
      {/* ── Hero Banner ── */}
      <div className="relative bg-gradient-to-b from-emerald-900 via-emerald-950 to-slate-900 text-white pt-16 pb-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold">
            <Sparkles size={14} className="text-amber-400" />
            <span>Tinh Hoa Ẩm Thực Ba Miền</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-serif-title">
            Hôm Nay Bạn Muốn Ăn Gì?
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto font-normal">
            Khám phá hàng ngàn món ngon đường phố, đặc sản gia truyền và những quán ăn nức tiếng được người bản xứ yêu thích.
          </p>

          {/* Quick Search & Region Filter */}
          <div className="pt-4 max-w-2xl mx-auto">
            <div className="relative bg-white rounded-2xl p-2 shadow-xl flex items-center gap-2 border border-slate-200">
              <Search className="text-slate-400 ml-3" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm món ngon, quán ăn, đặc sản (Phở bò, Cơm tấm, Bánh mì...)"
                className="w-full text-slate-800 text-sm outline-none px-2 py-2 placeholder:text-slate-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="text-xs text-slate-400 hover:text-slate-600 px-2 cursor-pointer"
                >
                  Xóa
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Category Quick Grid ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-8 relative z-10">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {CATEGORIES.map((cat) => {
            const IconComp = cat.icon;
            const isSelected = selectedCat === cat.label;
            return (
              <button
                key={cat.label}
                onClick={() =>
                  setSelectedCat(isSelected ? null : cat.label)
                }
                className={`flex flex-col items-center text-center p-4 rounded-2xl transition-all cursor-pointer border ${
                  isSelected
                    ? "bg-emerald-800 text-white border-emerald-800 shadow-md transform -translate-y-1"
                    : "bg-white text-slate-800 border-slate-200 hover:border-emerald-600/40 hover:shadow-md hover:-translate-y-0.5"
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mb-2.5 ${
                    isSelected ? "bg-white/20 text-white" : "bg-emerald-50 text-emerald-800"
                  }`}
                >
                  <IconComp size={22} strokeWidth={2} />
                </div>
                <span className="text-xs font-bold leading-tight line-clamp-1">{cat.label}</span>
                <span
                  className={`text-[10px] mt-0.5 ${
                    isSelected ? "text-emerald-100" : "text-slate-400"
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Main Content Container ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-12 space-y-16">
        {/* Section 1: Đặc sản 3 Miền */}
        <section>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 pb-3 border-b border-slate-200">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight font-serif-title">
                Đặc Sản Vùng Miền Nổi Tiếng
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Những món ngon mang trọn hồn cốt văn hóa ẩm thực Việt Nam
              </p>
            </div>

            {/* Region Switcher Pills */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
              {["Tất cả", "Miền Bắc", "Miền Trung", "Miền Nam"].map((reg) => (
                <button
                  key={reg}
                  onClick={() => setSelectedRegion(reg)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    selectedRegion === reg
                      ? "bg-white text-emerald-900 shadow-sm font-bold"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {reg}
                </button>
              ))}
            </div>
          </div>

          {/* Food Cards Grid (Portrait Cards) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredFoodCards.map((food, idx) => (
              <div
                key={idx}
                className="group bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-emerald-600/40 hover:shadow-lg transition-all flex flex-col cursor-pointer"
                onClick={() => {
                  const matched = foodPlaces.find((p) =>
                    p.name.toLowerCase().includes(food.province.toLowerCase()) ||
                    p.province.toLowerCase().includes(food.province.toLowerCase())
                  );
                  if (matched) onSelectPlace(matched);
                }}
              >
                <div className="relative aspect-[4/3] sm:aspect-[3/4] overflow-hidden bg-slate-100">
                  <img
                    src={food.img}
                    alt={food.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"></div>
                  
                  <div className="absolute top-2.5 left-2.5">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-700/90 text-white backdrop-blur-sm">
                      {food.tag}
                    </span>
                  </div>

                  <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
                    <p className="text-[11px] font-semibold text-emerald-200 flex items-center gap-1 mb-0.5">
                      <MapPin size={11} /> {food.province} · {food.region}
                    </p>
                    <h3 className="text-sm sm:text-base font-bold text-white line-clamp-1 group-hover:text-emerald-300 transition-colors">
                      {food.name}
                    </h3>
                  </div>
                </div>

                <div className="p-3.5 flex items-center justify-between text-xs border-t border-slate-100 bg-white">
                  <div className="flex items-center gap-1 font-semibold text-slate-800">
                    <Star size={13} className="fill-amber-400 text-amber-400" />
                    <span>{food.rating}</span>
                    <span className="text-slate-400 font-normal">({food.reviews})</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-emerald-800 text-[11px]">{food.price}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const matched = foodPlaces.find((p) =>
                          p.name.toLowerCase().includes(food.province.toLowerCase()) ||
                          p.province.toLowerCase().includes(food.province.toLowerCase())
                        ) || places[0];
                        if (onReportPlace) onReportPlace(matched);
                      }}
                      className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Báo cáo thông tin món ăn / quán ăn này"
                    >
                      <Flag size={11} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 2: Bộ sưu tập ẩm thực nổi bật */}
        <section>
          <div className="flex items-end justify-between mb-6 pb-3 border-b border-slate-200">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight font-serif-title">
                Bộ Sưu Tập Ẩm Thực Tuyển Chọn
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Lộ trình trải nghiệm ẩm thực được biên soạn độc quyền bởi các chuyên gia
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {COLLECTIONS.map((col, idx) => (
              <div
                key={idx}
                className="group relative rounded-2xl overflow-hidden aspect-[16/9] border border-slate-200 shadow-sm hover:shadow-xl transition-all cursor-pointer flex flex-col justify-end p-6"
              >
                <img
                  src={col.img}
                  alt={col.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent"></div>

                <div className="relative z-10 text-white space-y-2">
                  <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-500/30 backdrop-blur-md text-emerald-200 text-[11px] font-semibold">
                    {col.eyebrow}
                  </div>
                  <h3 className="text-lg sm:text-2xl font-bold text-white group-hover:text-emerald-300 transition-colors font-serif-title">
                    {col.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 line-clamp-2">
                    {col.desc}
                  </p>
                  <div className="pt-2 flex items-center gap-2 text-xs font-semibold text-emerald-300">
                    <span>Khám phá bộ sưu tập</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3: Quán ăn đang mở cửa gần bạn */}
        <section>
          <div className="flex items-end justify-between mb-6 pb-3 border-b border-slate-200">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight font-serif-title">
                Tọa Độ Ăn Uống Đánh Giá Cao
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Các địa chỉ quán ăn, quán cà phê nhận được nhiều đánh giá tích cực nhất
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {foodPlaces.slice(0, 8).map((p) => (
              <div
                key={p.id}
                onClick={() => onSelectPlace(p)}
                className="group bg-white rounded-2xl p-3 border border-slate-200 hover:border-emerald-600/40 hover:shadow-lg transition-all cursor-pointer flex flex-col"
              >
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-3 bg-slate-100">
                  <img
                    src={p.img}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-2 right-2">
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        p.status === "Đang mở"
                          ? "bg-emerald-600 text-white"
                          : "bg-slate-800/80 text-slate-200"
                      }`}
                    >
                      {p.status}
                    </span>
                  </div>
                  <div className="absolute bottom-2 left-2">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-black/60 text-white backdrop-blur-sm">
                      {p.category}
                    </span>
                  </div>
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 line-clamp-1 group-hover:text-emerald-800 transition-colors">
                      {p.name}
                    </h4>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                      <MapPin size={12} className="text-slate-400 flex-shrink-0" />
                      <span className="truncate">{p.province}</span>
                    </p>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1 font-bold text-slate-800">
                      <Star size={13} className="fill-amber-400 text-amber-400" />
                      <span>{p.rating}</span>
                      <span className="text-slate-400 font-normal">({p.reviews})</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-emerald-800">{p.price}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onReportPlace) onReportPlace(p);
                        }}
                        className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Báo cáo vi phạm địa điểm ẩm thực này"
                      >
                        <Flag size={11} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
