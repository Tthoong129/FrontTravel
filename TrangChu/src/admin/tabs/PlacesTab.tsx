import React, { useState, useMemo } from "react";
import { Place } from "../../data";
import { PlaceDetailTab } from "../types";
import {
  Search,
  Plus,
  ArrowLeft,
  CheckCircle2,
  EyeOff,
  Eye,
  MapPin,
  Phone,
  Globe,
  Clock,
  DollarSign,
  Star,
  ShieldCheck,
  ShieldAlert,
  Image as ImageIcon,
  MessageSquare,
  FileText,
  Navigation,
  SlidersHorizontal,
  ArrowUpDown,
  Share2,
  ExternalLink,
  Edit3,
  Check,
  AlertTriangle,
} from "lucide-react";

interface PlacesTabProps {
  placesList: Place[];
  selectedPlaceId: number | null;
  setSelectedPlaceId: (id: number | null) => void;
  placeDetailTab?: PlaceDetailTab;
  setPlaceDetailTab?: (tab: PlaceDetailTab) => void;
  placeSearchText: string;
  setPlaceSearchText: (v: string) => void;
  placeFilterProvince: string;
  setPlaceFilterProvince: (v: string) => void;
  placeFilterStatus: string;
  setPlaceFilterStatus: (v: string) => void;
  setIsAddPlaceModalOpen: (v: boolean) => void;
  handleApprovePlace?: (placeId: number) => void;
  handleTogglePlaceStatus?: (placeId: number) => void;
  handleOpenModerationDrawer?: (groupKey: string) => void;
  handleOpenEditPlace?: (place: any) => void;
  showToast: (msg: string) => void;
}

export default function PlacesTab({
  placesList,
  selectedPlaceId,
  setSelectedPlaceId,
  placeDetailTab = "info",
  setPlaceDetailTab,
  placeSearchText,
  setPlaceSearchText,
  placeFilterProvince,
  setPlaceFilterProvince,
  placeFilterStatus,
  setPlaceFilterStatus,
  setIsAddPlaceModalOpen,
  handleApprovePlace,
  handleTogglePlaceStatus,
  handleOpenModerationDrawer,
  handleOpenEditPlace,
  showToast,
}: PlacesTabProps) {
  // Local sub-tab state if not controlled externally
  const [internalTab, setInternalTab] = useState<PlaceDetailTab>("info");
  const activeDetailTab = placeDetailTab || internalTab;
  const changeDetailTab = setPlaceDetailTab || setInternalTab;

  // Sorting state
  const [sortBy, setSortBy] = useState<"name" | "rating" | "reviews">("rating");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const currentPlace = useMemo(() => {
    return selectedPlaceId ? placesList.find((p) => p.id === selectedPlaceId) || null : null;
  }, [selectedPlaceId, placesList]);

  // Unique categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    placesList.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return Array.from(set);
  }, [placesList]);

  // Statistics
  const totalCount = placesList.length;
  const pendingCount = placesList.filter((p) => (p as any).statusNum === 0 || p.status === "Chờ duyệt").length;
  const approvedCount = placesList.filter((p) => (p as any).statusNum === 1 || p.status === "Đã duyệt").length;
  const hiddenCount = placesList.filter((p) => (p as any).statusNum === 3 || p.status === "Đang ẩn").length;

  // Filtered & Sorted Places
  const filteredPlaces = useMemo(() => {
    return placesList
      .filter((p) => {
        if (placeFilterProvince !== "all" && p.province !== placeFilterProvince) return false;
        if (categoryFilter !== "all" && p.category !== categoryFilter) return false;
        if (placeFilterStatus !== "all") {
          const sNum = String((p as any).statusNum ?? (p.status === "Chờ duyệt" ? "0" : p.status === "Đang ẩn" ? "3" : "1"));
          if (sNum !== placeFilterStatus) return false;
        }
        if (placeSearchText.trim()) {
          const q = placeSearchText.toLowerCase();
          const matchName = p.name.toLowerCase().includes(q);
          const matchLoc = p.location.toLowerCase().includes(q);
          const matchCat = (p.category || "").toLowerCase().includes(q);
          if (!matchName && !matchLoc && !matchCat) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "name") return a.name.localeCompare(b.name, "vi");
        if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
        if (sortBy === "reviews") return (b.reviews || 0) - (a.reviews || 0);
        return 0;
      });
  }, [placesList, placeFilterProvince, categoryFilter, placeFilterStatus, placeSearchText, sortBy]);

  /* ─────────────────────────────────────────────────────────────
     RENDER: PLACE DETAIL HUB (MULTI-SUBTAB)
  ───────────────────────────────────────────────────────────── */
  if (selectedPlaceId && currentPlace) {
    const isPending = (currentPlace as any).statusNum === 0 || currentPlace.status === "Chờ duyệt";
    const isHidden = (currentPlace as any).statusNum === 3 || currentPlace.status === "Đang ẩn";

    return (
      <div className="space-y-6 animate-in fade-in duration-150">
        {/* Top Header Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <button
              onClick={() => setSelectedPlaceId(null)}
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/70 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
            >
              <ArrowLeft size={14} />
              <span>Quay lại danh sách</span>
            </button>

            {/* Top Action Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              {isPending && handleApprovePlace && (
                <button
                  onClick={() => handleApprovePlace(currentPlace.id)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors shadow-xs cursor-pointer"
                >
                  <Check size={14} />
                  <span>Duyệt phát hành</span>
                </button>
              )}

              {handleOpenEditPlace && (
                <button
                  onClick={() => handleOpenEditPlace(currentPlace)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors shadow-xs cursor-pointer"
                >
                  <Edit3 size={14} />
                  <span>Chỉnh sửa</span>
                </button>
              )}

              {handleTogglePlaceStatus && (
                <button
                  onClick={() => handleTogglePlaceStatus(currentPlace.id)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer border ${
                    isHidden
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                      : "bg-slate-100 text-slate-700 border-slate-200 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200"
                  }`}
                >
                  {isHidden ? <Eye size={14} /> : <EyeOff size={14} />}
                  <span>{isHidden ? "Hiện lại địa điểm" : "Tạm ẩn địa điểm"}</span>
                </button>
              )}

              {handleOpenModerationDrawer && (
                <button
                  onClick={() => handleOpenModerationDrawer(`place_${currentPlace.id}`)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-bold transition-colors cursor-pointer"
                >
                  <ShieldAlert size={14} />
                  <span>Kiểm tra báo cáo</span>
                </button>
              )}
            </div>
          </div>

          {/* Place Banner & Summary */}
          <div className="flex flex-col md:flex-row gap-5 items-start">
            <img
              src={currentPlace.img}
              alt={currentPlace.name}
              className="w-full md:w-44 h-36 rounded-xl object-cover ring-1 ring-slate-200 shrink-0"
            />
            <div className="space-y-2 flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200/80 text-[11px] font-bold">
                  {currentPlace.category}
                </span>
                <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-semibold flex items-center gap-1">
                  <MapPin size={11} className="text-slate-500" />
                  {currentPlace.province}
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold border ${
                    isPending
                      ? "bg-amber-50 text-amber-700 border-amber-200"
                      : isHidden
                      ? "bg-slate-100 text-slate-600 border-slate-200"
                      : "bg-emerald-50 text-emerald-700 border-emerald-200"
                  }`}
                >
                  {isPending ? "Chờ duyệt" : isHidden ? "Đang ẩn" : "Đã duyệt công khai"}
                </span>
                {currentPlace.isVerified && (
                  <span className="px-2 py-0.5 rounded-md bg-sky-50 text-sky-700 border border-sky-200 text-[10px] font-bold flex items-center gap-1">
                    <ShieldCheck size={11} /> Đã xác thực
                  </span>
                )}
              </div>

              <h1 className="text-xl font-black text-slate-900 tracking-tight">{currentPlace.name}</h1>
              <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{currentPlace.location}</p>

              <div className="flex flex-wrap items-center gap-4 text-xs pt-1 font-semibold text-slate-600">
                <span className="flex items-center gap-1 text-amber-500 font-bold">
                  <Star size={13} fill="currentColor" /> {currentPlace.rating} ({currentPlace.reviews} đánh giá)
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-slate-700">
                  <DollarSign size={13} className="text-emerald-600" /> {currentPlace.price || "35.000đ – 75.000đ"}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-slate-700">
                  <Clock size={13} className="text-blue-600" /> {currentPlace.hours || "07:00 – 22:00"}
                </span>
              </div>
            </div>
          </div>

          {/* Sub-tabs Navigation */}
          <div className="flex items-center gap-1 overflow-x-auto border-t border-slate-100 pt-3 text-xs scrollbar-none">
            {[
              { id: "info", label: "Thông tin tổng quan", icon: FileText },
              { id: "contact", label: "Liên hệ & Vị trí", icon: MapPin },
              { id: "media", label: "Thư viện Media", icon: ImageIcon, count: (currentPlace.images || []).length || 1 },
              { id: "reviews", label: "Đánh giá thực khách", icon: MessageSquare, count: currentPlace.reviews || 0 },
              { id: "reports", label: "Báo cáo & Giám sát", icon: ShieldAlert },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeDetailTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => changeDetailTab(tab.id as PlaceDetailTab)}
                  className={`px-3.5 py-2 rounded-xl font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                    isActive
                      ? "bg-slate-900 text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  <Icon size={14} />
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                        isActive ? "bg-white/20 text-white" : "bg-slate-200/80 text-slate-700"
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Sub-tab Content Area */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-6 text-xs">
          {/* 1. INFO TAB */}
          {activeDetailTab === "info" && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Mô tả giới thiệu</h3>
                    <p className="mt-1.5 text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                      {currentPlace.desc || "Địa điểm ẩm thực truyền thống mang đậm bản sắc vùng miền với nguyên liệu tươi ngon và công thức gia truyền."}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Món đặc sắc &amp; Tags</h3>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {(currentPlace.tags || [currentPlace.category, currentPlace.province, "Đặc sản nổi bật"]).map((tag, idx) => (
                        <span key={idx} className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-semibold">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Thông số kinh doanh</h3>
                    <div className="mt-1.5 bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-3">
                      <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
                        <span className="text-slate-500 font-medium">Khung giờ hoạt động:</span>
                        <span className="font-bold text-slate-800">{currentPlace.hours || "07:00 – 22:00"}</span>
                      </div>
                      <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
                        <span className="text-slate-500 font-medium">Khoảng giá ước tính:</span>
                        <span className="font-bold text-slate-800">{currentPlace.price || "35.000đ – 75.000đ"}</span>
                      </div>
                      <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
                        <span className="text-slate-500 font-medium">Loại hình phục vụ:</span>
                        <span className="font-bold text-slate-800">{currentPlace.type || currentPlace.category}</span>
                      </div>
                      <div className="flex justify-between items-center py-1">
                        <span className="text-slate-500 font-medium">Trạng thái cấp phép:</span>
                        <span className="font-bold text-emerald-600">Đầy đủ VSATTP</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Tiện ích phục vụ</h3>
                    <div className="mt-2 grid grid-cols-2 gap-2 text-slate-700 font-medium">
                      <div className="flex items-center gap-1.5 p-2 rounded-lg bg-slate-50 border border-slate-100">
                        <CheckCircle2 size={13} className="text-emerald-600" /> Có máy lạnh
                      </div>
                      <div className="flex items-center gap-1.5 p-2 rounded-lg bg-slate-50 border border-slate-100">
                        <CheckCircle2 size={13} className="text-emerald-600" /> Chỗ đậu ô tô
                      </div>
                      <div className="flex items-center gap-1.5 p-2 rounded-lg bg-slate-50 border border-slate-100">
                        <CheckCircle2 size={13} className="text-emerald-600" /> Wifi miễn phí
                      </div>
                      <div className="flex items-center gap-1.5 p-2 rounded-lg bg-slate-50 border border-slate-100">
                        <CheckCircle2 size={13} className="text-emerald-600" /> Chấp nhận thanh toán thẻ
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. CONTACT & MAP TAB */}
          {activeDetailTab === "contact" && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Kênh liên lạc chính thức</h3>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                        <Phone size={15} />
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400 uppercase font-semibold">Hotline / Số điện thoại</div>
                        <div className="font-bold text-slate-900">{currentPlace.phone || "0905 123 456"}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                        <Globe size={15} />
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400 uppercase font-semibold">Trang web / Fanpage</div>
                        <a
                          href={currentPlace.website || "https://langthang.vn"}
                          target="_blank"
                          rel="noreferrer"
                          className="font-bold text-blue-600 hover:underline inline-flex items-center gap-1"
                        >
                          {currentPlace.website || "https://facebook.com/langthangvn"} <ExternalLink size={11} />
                        </a>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                        <MapPin size={15} />
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400 uppercase font-semibold">Địa chỉ chi tiết</div>
                        <div className="font-bold text-slate-900">{currentPlace.location}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Tọa độ GPS &amp; Định vị bản đồ</h3>
                  <div className="bg-slate-100 rounded-xl border border-slate-200 overflow-hidden h-44 flex flex-col items-center justify-center text-center p-4 relative">
                    <Navigation size={28} className="text-blue-600 mb-2 animate-bounce" />
                    <span className="font-bold text-slate-800 text-sm">Vị trí trên bản đồ LangThang Map</span>
                    <span className="text-[11px] text-slate-500 mt-0.5">
                      Lat: 16.0678, Lng: 108.2208 ({currentPlace.province})
                    </span>
                    <button
                      onClick={() => showToast("Đang mở tọa độ vị trí thực tế trên bản đồ.")}
                      className="mt-3 px-3 py-1 bg-white text-slate-800 font-bold rounded-lg border border-slate-200 shadow-xs hover:bg-slate-50"
                    >
                      Kiểm tra tọa độ
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 3. MEDIA TAB */}
          {activeDetailTab === "media" && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Thư viện ảnh &amp; Video</h3>
                  <p className="text-slate-500 text-[11px] mt-0.5">Hình ảnh đã qua kiểm duyệt thực tế từ cơ sở và du khách</p>
                </div>
                <button
                  onClick={() => showToast("Tính năng tải thêm ảnh vào thư viện media.")}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 text-white font-bold text-xs"
                >
                  + Tải ảnh mới
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 pt-2">
                {[
                  currentPlace.img,
                  ...(currentPlace.images || []),
                  "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=400&fit=crop",
                  "https://images.unsplash.com/photo-1541544741938-0af808871cc0?w=600&h=400&fit=crop",
                ].slice(0, 4).map((url, idx) => (
                  <div key={idx} className="group relative rounded-xl overflow-hidden border border-slate-200 aspect-video bg-slate-100">
                    <img src={url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2.5 justify-between">
                      <span className="text-[10px] text-white font-bold">{idx === 0 ? "Ảnh bìa" : `Ảnh ${idx + 1}`}</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500 text-white font-bold">Đã duyệt</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. REVIEWS TAB */}
          {activeDetailTab === "reviews" && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Đánh giá từ cộng đồng ({currentPlace.reviews} lượt)</h3>
              <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden bg-slate-50/50">
                <div className="p-4 flex items-start gap-3">
                  <img
                    src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop"
                    className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-200 shrink-0"
                    alt=""
                  />
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">Trần Minh Quang</span>
                      <span className="text-[10px] text-slate-400">18/09/2026</span>
                    </div>
                    <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
                      <Star size={11} fill="currentColor" /> 5.0
                    </div>
                    <p className="text-slate-700 leading-relaxed">
                      Món ăn chuẩn vị địa phương, không gian quán sạch sẽ thoáng mát. Giá cả niêm yết minh bạch, nhân viên thân thiện nhiệt tình.
                    </p>
                  </div>
                </div>

                <div className="p-4 flex items-start gap-3">
                  <img
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop"
                    className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-200 shrink-0"
                    alt=""
                  />
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">Lê Hoàng Mai</span>
                      <span className="text-[10px] text-slate-400">17/09/2026</span>
                    </div>
                    <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
                      <Star size={11} fill="currentColor" /> 4.0
                    </div>
                    <p className="text-slate-700 leading-relaxed">
                      Chất lượng món ăn rất tốt, nước chấm đậm đà. Vào giờ cao điểm hơi đông khách nên phải đợi khoảng 10 phút.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 5. REPORTS & AUDIT TAB */}
          {activeDetailTab === "reports" && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Báo cáo vi phạm &amp; Lịch sử giám sát</h3>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <ShieldCheck size={16} />
                  </div>
                  <div>
                    <span className="font-bold text-slate-800">Không có vi phạm nghiêm trọng tồn đọng</span>
                    <p className="text-[11px] text-slate-400 mt-0.5">Địa điểm tuân thủ đúng quy chế thông tin hệ thống</p>
                  </div>
                </div>
                {handleOpenModerationDrawer && (
                  <button
                    onClick={() => handleOpenModerationDrawer(`place_${currentPlace.id}`)}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs"
                  >
                    Kiểm tra chi tiết
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  /* ─────────────────────────────────────────────────────────────
     RENDER: PLACES LIST VIEW (GRID / TABLE WITH FULL CONTROLS)
  ───────────────────────────────────────────────────────────── */
  return (
    <div className="space-y-5 animate-in fade-in duration-150">
      {/* 1. Quick Stats Header */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Tổng địa điểm</div>
          <div className="text-xl font-black text-slate-900 mt-1">{totalCount}</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">Đã duyệt công khai</div>
          <div className="text-xl font-black text-emerald-700 mt-1">{approvedCount}</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">Chờ kiểm duyệt</div>
          <div className="text-xl font-black text-amber-700 mt-1">{pendingCount}</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Tạm ẩn</div>
          <div className="text-xl font-black text-slate-700 mt-1">{hiddenCount}</div>
        </div>
      </div>

      {/* 2. Filter & Actions Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[260px]">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên quán, địa chỉ, danh mục..."
              value={placeSearchText}
              onChange={(e) => setPlaceSearchText(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50/70 text-xs font-medium focus:bg-white focus:border-slate-400 outline-none transition-all"
            />
          </div>

          {/* Add Place Button */}
          <button
            onClick={() => setIsAddPlaceModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <Plus size={14} />
            <span>Thêm địa điểm mới</span>
          </button>
        </div>

        {/* Filters and Sorters */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={placeFilterProvince}
              onChange={(e) => setPlaceFilterProvince(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white font-semibold text-slate-700 cursor-pointer outline-none hover:border-slate-300"
            >
              <option value="all">Tất cả Tỉnh/Thành</option>
              <option value="Đà Nẵng">Đà Nẵng</option>
              <option value="Quảng Nam">Quảng Nam</option>
              <option value="Thừa Thiên Huế">Thừa Thiên Huế</option>
              <option value="Khánh Hòa">Khánh Hòa</option>
              <option value="Lâm Đồng">Lâm Đồng</option>
            </select>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white font-semibold text-slate-700 cursor-pointer outline-none hover:border-slate-300"
            >
              <option value="all">Tất cả danh mục ({categories.length})</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            <select
              value={placeFilterStatus}
              onChange={(e) => setPlaceFilterStatus(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white font-semibold text-slate-700 cursor-pointer outline-none hover:border-slate-300"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="0">Chờ duyệt ({pendingCount})</option>
              <option value="1">Đã duyệt ({approvedCount})</option>
              <option value="3">Đang ẩn ({hiddenCount})</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400 text-[11px] font-medium flex items-center gap-1">
              <ArrowUpDown size={12} /> Sắp xếp:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white font-semibold text-slate-700 cursor-pointer outline-none hover:border-slate-300 text-xs"
            >
              <option value="rating">Đánh giá cao nhất</option>
              <option value="reviews">Nhiều đánh giá nhất</option>
              <option value="name">Tên A → Z</option>
            </select>
          </div>
        </div>
      </div>

      {/* 3. Places Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-400 font-bold border-b border-slate-100 text-[11px] uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Tên Quán &amp; Địa chỉ</th>
                <th className="py-3.5 px-3">Tỉnh / Thành</th>
                <th className="py-3.5 px-3">Danh mục</th>
                <th className="py-3.5 px-3">Đánh giá</th>
                <th className="py-3.5 px-3">Trạng thái</th>
                <th className="py-3.5 px-4 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPlaces.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    Không tìm thấy địa điểm nào phù hợp với bộ lọc hiện tại.
                  </td>
                </tr>
              ) : (
                filteredPlaces.map((pl) => {
                  const sNum = (pl as any).statusNum ?? (pl.status === "Chờ duyệt" ? 0 : pl.status === "Đang ẩn" ? 3 : 1);
                  const isPending = sNum === 0;
                  const isApproved = sNum === 1;
                  const isHidden = sNum === 3;

                  return (
                    <tr key={pl.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Name & Cover */}
                      <td className="py-3.5 px-4 font-semibold text-slate-900">
                        <div className="flex items-center gap-3">
                          <img
                            src={pl.img}
                            className="w-11 h-11 rounded-xl object-cover ring-1 ring-slate-200 shrink-0"
                            alt={pl.name}
                          />
                          <div className="min-w-0">
                            <button
                              onClick={() => setSelectedPlaceId(pl.id)}
                              className="font-bold text-slate-900 hover:text-blue-600 transition-colors text-left block truncate max-w-[240px] cursor-pointer"
                            >
                              {pl.name}
                            </button>
                            <span className="text-[11px] text-slate-400 font-normal block truncate max-w-[240px] mt-0.5">
                              {pl.location}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Province */}
                      <td className="py-3.5 px-3 font-semibold text-slate-700 whitespace-nowrap">{pl.province}</td>

                      {/* Category */}
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold text-[11px]">
                          {pl.category}
                        </span>
                      </td>

                      {/* Rating */}
                      <td className="py-3.5 px-3 whitespace-nowrap font-bold text-amber-500">
                        <span className="flex items-center gap-1">
                          <Star size={12} fill="currentColor" /> {pl.rating}
                          <span className="text-slate-400 font-normal text-[10px]">({pl.reviews})</span>
                        </span>
                      </td>

                      {/* Status Badge */}
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <span
                          className={`px-2.5 py-1 rounded-full font-bold text-[10px] border ${
                            isPending
                              ? "bg-amber-50 text-amber-700 border-amber-200"
                              : isApproved
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-slate-100 text-slate-600 border-slate-200"
                          }`}
                        >
                          {isPending ? "Chờ duyệt" : isApproved ? "Đã duyệt" : "Đang ẩn"}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => setSelectedPlaceId(pl.id)}
                            className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-900 hover:text-white text-slate-700 font-bold text-xs transition-colors cursor-pointer"
                            title="Xem chi tiết đa tầng"
                          >
                            Chi tiết
                          </button>

                          {handleOpenEditPlace && (
                            <button
                              onClick={() => handleOpenEditPlace(pl)}
                              className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-700 transition-colors cursor-pointer"
                              title="Chỉnh sửa"
                            >
                              <Edit3 size={14} />
                            </button>
                          )}

                          {isPending && handleApprovePlace && (
                            <button
                              onClick={() => handleApprovePlace(pl.id)}
                              className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-600 hover:text-white text-emerald-700 transition-colors cursor-pointer"
                              title="Duyệt phát hành"
                            >
                              <Check size={14} />
                            </button>
                          )}

                          {handleTogglePlaceStatus && (
                            <button
                              onClick={() => handleTogglePlaceStatus(pl.id)}
                              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                                isHidden
                                  ? "bg-emerald-50 hover:bg-emerald-600 hover:text-white text-emerald-700"
                                  : "bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-600"
                              }`}
                              title={isHidden ? "Hiện lại địa điểm" : "Tạm ẩn khỏi trang khách"}
                            >
                              {isHidden ? <Eye size={14} /> : <EyeOff size={14} />}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
