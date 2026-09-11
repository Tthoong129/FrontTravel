import { useState } from "react";
import {
  MapPin,
  Calendar,
  Globe,
  Lock,
  Star,
  Plus,
  Compass,
  X,
  Trash2,
  Eye,
  Edit3,
} from "lucide-react";
import { VisitLogItem, provinceOptions } from "./data";

interface VisitedLogSectionProps {
  logs: VisitLogItem[];
  onAddLog: (newLog: VisitLogItem) => void;
  onUpdateLog?: (updatedLog: VisitLogItem) => void;
  onDeleteLog?: (id: number) => void;
  onTogglePrivacy?: (id: number) => void;
  onSelectPlace?: (placeName: string) => void;
}

export default function VisitedLogSection({
  logs,
  onAddLog,
  onUpdateLog,
  onDeleteLog,
  onTogglePrivacy,
  onSelectPlace,
}: VisitedLogSectionProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [privacyFilter, setPrivacyFilter] = useState<"all" | 0 | 1>("all");
  const [companionFilter, setCompanionFilter] = useState<string>("all");
  const [viewPhotoUrl, setViewPhotoUrl] = useState<string | null>(null);

  // Add modal state
  const [placeName, setPlaceName] = useState("");
  const [province, setProvince] = useState(provinceOptions[0]);
  const [category, setCategory] = useState("Cà phê & Điểm ngắm cảnh");
  const [visitedDate, setVisitedDate] = useState("2026-09-10");
  const [privacy, setPrivacy] = useState<0 | 1>(0); // 0: Public, 1: Private
  const [spentAmount, setSpentAmount] = useState("150000");
  const [companion, setCompanion] = useState<"solo" | "couple" | "family" | "friends">("couple");
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState("");
  const [photoUrl, setPhotoUrl] = useState(
    "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=85&w=600&auto=format&fit=crop"
  );
  const [errorMsg, setErrorMsg] = useState("");

  // Edit modal state
  const [editingLog, setEditingLog] = useState<VisitLogItem | null>(null);
  const [editPlaceName, setEditPlaceName] = useState("");
  const [editProvince, setEditProvince] = useState(provinceOptions[0]);
  const [editCategory, setEditCategory] = useState("");
  const [editVisitedDate, setEditVisitedDate] = useState("");
  const [editPrivacy, setEditPrivacy] = useState<0 | 1>(0);
  const [editSpentAmount, setEditSpentAmount] = useState("");
  const [editCompanion, setEditCompanion] = useState<"solo" | "couple" | "family" | "friends">("couple");
  const [editRating, setEditRating] = useState(5);
  const [editContent, setEditContent] = useState("");
  const [editPhotoUrl, setEditPhotoUrl] = useState("");
  const [editErrorMsg, setEditErrorMsg] = useState("");

  // Stats calculation
  const totalVisited = logs.length;
  const uniqueProvinces = new Set(logs.map((l) => l.province)).size;
  const totalPhotos = logs.reduce((acc, l) => acc + (l.photos?.length || 0), 0);

  // Filtered logs
  const filteredLogs = logs.filter((log) => {
    const matchesPrivacy = privacyFilter === "all" || log.privacy === privacyFilter;
    const matchesCompanion = companionFilter === "all" || log.companion === companionFilter;
    return matchesPrivacy && matchesCompanion;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!placeName.trim()) {
      setErrorMsg("Vui lòng nhập tên địa điểm bạn đã ghé.");
      return;
    }
    if (!content.trim()) {
      setErrorMsg("Vui lòng viết một vài dòng cảm nghĩ kỷ niệm.");
      return;
    }

    const newLogItem: VisitLogItem = {
      id: Date.now(),
      placeId: Date.now(),
      placeName: placeName.trim(),
      province,
      category,
      visitedDate: visitedDate
        ? new Date(visitedDate).toLocaleDateString("vi-VN")
        : "Vừa ghé thăm",
      privacy,
      rating,
      spentAmount: parseInt(spentAmount) || 0,
      companion,
      content: content.trim(),
      photos: photoUrl ? [photoUrl] : [],
      createdAt: new Date().toISOString(),
    };

    onAddLog(newLogItem);
    setIsAddModalOpen(false);
    // Reset form
    setPlaceName("");
    setContent("");
    setErrorMsg("");
  };

  const openEditModal = (item: VisitLogItem) => {
    setEditingLog(item);
    setEditPlaceName(item.placeName);
    setEditProvince(item.province || provinceOptions[0]);
    setEditCategory(item.category || "Cà phê & Điểm ngắm cảnh");
    setEditVisitedDate(item.visitedDate || "");
    setEditPrivacy(item.privacy ?? 0);
    setEditSpentAmount(item.spentAmount ? String(item.spentAmount) : "");
    setEditCompanion((item.companion as any) || "couple");
    setEditRating(item.rating || 5);
    setEditContent(item.content || "");
    setEditPhotoUrl(item.photos && item.photos.length > 0 ? item.photos[0] : "");
    setEditErrorMsg("");
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLog) return;
    if (!editPlaceName.trim()) {
      setEditErrorMsg("Vui lòng nhập tên địa điểm.");
      return;
    }
    if (!editContent.trim()) {
      setEditErrorMsg("Vui lòng viết cảm nghĩ kỷ niệm.");
      return;
    }

    const updated: VisitLogItem = {
      ...editingLog,
      placeName: editPlaceName.trim(),
      province: editProvince,
      category: editCategory,
      visitedDate: editVisitedDate,
      privacy: editPrivacy,
      rating: editRating,
      spentAmount: parseInt(editSpentAmount) || 0,
      companion: editCompanion,
      content: editContent.trim(),
      photos: editPhotoUrl ? [editPhotoUrl] : [],
    };

    if (onUpdateLog) {
      onUpdateLog(updated);
    }
    setEditingLog(null);
  };

  const getCompanionBadge = (comp?: string) => {
    switch (comp) {
      case "solo":
        return "Đi một mình";
      case "couple":
        return "Cặp đôi";
      case "family":
        return "Gia đình";
      case "friends":
        return "Bạn bè";
      default:
        return "Tự túc";
    }
  };

  return (
    <div className="space-y-5">
      {/* ── HEADER ROW ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            Nhật ký đã ghé thăm
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {totalVisited} địa điểm đã ghé qua · {uniqueProvinces} tỉnh thành · {totalPhotos} ảnh lưu niệm
          </p>
        </div>

        <button
          onClick={() => {
            setErrorMsg("");
            setIsAddModalOpen(true);
          }}
          className="px-3.5 py-2 rounded-lg text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 transition-all flex items-center justify-center gap-1.5 flex-shrink-0 cursor-pointer shadow-xs self-start sm:self-auto"
        >
          <Plus size={14} />
          <span>Ghi lại kỷ niệm</span>
        </button>
      </div>

      {/* ── PRIVACY & COMPANION FILTER CONTROLS ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-200">
        {/* Privacy filter */}
        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-slate-400 mr-1 text-[11px] font-medium">Chế độ:</span>
          {[
            { id: "all", label: "Tất cả" },
            { id: 0, label: "Công khai" },
            { id: 1, label: "Chỉ mình tôi" },
          ].map((item) => (
            <button
              key={String(item.id)}
              onClick={() => setPrivacyFilter(item.id as any)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                privacyFilter === item.id
                  ? "bg-slate-900 text-white font-semibold shadow-2xs"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Companion filter */}
        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-slate-400 mr-1 text-[11px] font-medium">Đồng hành:</span>
          {[
            { id: "all", label: "Tất cả" },
            { id: "couple", label: "Cặp đôi" },
            { id: "solo", label: "Đi một mình" },
            { id: "friends", label: "Bạn bè" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setCompanionFilter(item.id)}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer text-xs ${
                companionFilter === item.id
                  ? "bg-emerald-800 text-white font-semibold"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── DANH SÁCH KỶ NIỆM ── */}
      <div>
        {filteredLogs.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center border border-slate-200/80">
            <p className="text-xs text-slate-500">Không có kỷ niệm nào phù hợp với bộ lọc hiện tại.</p>
          </div>
        ) : (
          <div className="space-y-3.5">
            {filteredLogs.map((item) => {
              const isPublic = item.privacy === 0;
              const compInfo = getCompanionBadge(item.companion);

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all"
                >
                  {/* Top Row: Date, Companion, Privacy Switcher & Actions */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 mb-2.5 border-b border-slate-100">
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800">
                        <Calendar size={13} className="text-slate-400" />
                        <span>{item.visitedDate}</span>
                      </div>

                      {/* Companion Badge */}
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                        {compInfo}
                      </span>

                      {/* Spent Badge */}
                      {item.spentAmount && item.spentAmount > 0 && (
                        <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                          {item.spentAmount.toLocaleString("vi-VN")} đ
                        </span>
                      )}
                    </div>

                    {/* Actions: Privacy Toggle Button + Edit + Delete */}
                    <div className="flex items-center gap-1.5">
                      {/* Nút bấm chuyển đổi trực tiếp Công khai <-> Riêng tư */}
                      <button
                        type="button"
                        onClick={() => {
                          if (onTogglePrivacy) {
                            onTogglePrivacy(item.id);
                          }
                        }}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
                          isPublic
                            ? "bg-emerald-50 text-emerald-800 border border-emerald-200/60 hover:bg-emerald-100"
                            : "bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200"
                        }`}
                        title="Bấm để chuyển đổi giữa Công khai và Chỉ mình tôi"
                      >
                        {isPublic ? (
                          <>
                            <Globe size={12} className="text-emerald-700" />
                            <span>Công khai</span>
                          </>
                        ) : (
                          <>
                            <Lock size={12} className="text-slate-600" />
                            <span>Chỉ mình tôi</span>
                          </>
                        )}
                      </button>

                      {/* Nút Sửa kỷ niệm */}
                      <button
                        type="button"
                        onClick={() => openEditModal(item)}
                        className="w-7 h-7 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer"
                        title="Chỉnh sửa kỷ niệm"
                      >
                        <Edit3 size={13} />
                      </button>

                      {/* Nút Xóa */}
                      {onDeleteLog && (
                        <button
                          type="button"
                          onClick={() => onDeleteLog(item.id)}
                          className="w-7 h-7 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center transition-colors cursor-pointer"
                          title="Xóa kỷ niệm"
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Place Name & Rating */}
                  <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1.5">
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                        {item.placeName}
                      </h3>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin size={12} className="text-slate-400" />
                        <span>{item.province}</span>
                        <span>·</span>
                        <span>{item.category}</span>
                      </p>
                    </div>

                    {/* Stars */}
                    <div className="flex items-center gap-0.5 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60">
                      {[...Array(item.rating)].map((_, i) => (
                        <Star key={i} size={11} className="fill-amber-400 text-amber-400" />
                      ))}
                      <span className="text-[11px] font-bold text-amber-900 ml-1">
                        {item.rating}.0
                      </span>
                    </div>
                  </div>

                  {/* Diary Content */}
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed my-2.5 bg-slate-50 p-3 rounded-lg border border-slate-100">
                    "{item.content}"
                  </p>

                  {/* Photo Gallery Grid */}
                  {item.photos && item.photos.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2.5">
                      {item.photos.map((img, idx) => (
                        <div
                          key={idx}
                          onClick={() => setViewPhotoUrl(img)}
                          className="relative h-28 sm:h-32 rounded-lg overflow-hidden bg-slate-100 border border-slate-200/80 cursor-pointer group/img"
                        >
                          <img
                            src={img}
                            alt="Ảnh kỷ niệm"
                            className="w-full h-full object-cover transition-transform duration-300 group-hover/img:scale-105"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/30 transition-colors flex items-center justify-center">
                            <Eye size={16} className="text-white opacity-0 group-hover/img:opacity-100 transition-opacity" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── PHOTO VIEWER MODAL ── */}
      {viewPhotoUrl && (
        <div
          onClick={() => setViewPhotoUrl(null)}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 animate-in fade-in cursor-zoom-out"
        >
          <div className="relative max-w-4xl max-h-[85vh] overflow-hidden rounded-xl shadow-2xl">
            <img src={viewPhotoUrl} alt="Phóng to" className="w-full h-full object-contain max-h-[80vh]" />
            <button
              onClick={() => setViewPhotoUrl(null)}
              className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* ── MODAL: GHI LẠI KỶ NIỆM MỚI ── */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-xl w-full max-w-lg shadow-xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <div className="flex items-center gap-2">
                <Compass size={16} className="text-emerald-800" />
                <h3 className="text-sm font-bold text-slate-900">Ghi lại chuyến đi & kỷ niệm</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-7 h-7 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-5 space-y-3.5 text-xs">
              {errorMsg && (
                <div className="p-2.5 bg-rose-50 text-rose-700 text-xs rounded-lg border border-rose-200">
                  {errorMsg}
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Địa điểm đã đến <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Cà phê Mây Lang Thang, Thác Bản Giốc..."
                  value={placeName}
                  onChange={(e) => setPlaceName(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:border-emerald-700 outline-none transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tỉnh thành</label>
                  <select
                    value={province}
                    onChange={(e) => setProvince(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:border-emerald-700 outline-none transition-colors"
                  >
                    {provinceOptions.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Ngày ghé thăm</label>
                  <input
                    type="date"
                    value={visitedDate}
                    onChange={(e) => setVisitedDate(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:border-emerald-700 outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Chi tiêu ước tính (VNĐ)</label>
                  <input
                    type="number"
                    placeholder="150000"
                    value={spentAmount}
                    onChange={(e) => setSpentAmount(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:border-emerald-700 outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Bạn đồng hành</label>
                  <select
                    value={companion}
                    onChange={(e) => setCompanion(e.target.value as any)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:border-emerald-700 outline-none transition-colors"
                  >
                    <option value="couple">Cặp đôi</option>
                    <option value="friends">Bạn bè</option>
                    <option value="family">Gia đình</option>
                    <option value="solo">Đi một mình</option>
                  </select>
                </div>
              </div>

              {/* Privacy Setting */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
                <div>
                  <span className="block font-semibold text-slate-800 text-xs">Chế độ hiển thị</span>
                  <span className="text-[11px] text-slate-500">
                    {privacy === 0 ? "Công khai: Mọi người đều có thể xem" : "Chỉ mình tôi: Kỷ niệm riêng tư"}
                  </span>
                </div>
                <div className="flex gap-1 bg-slate-200/80 p-0.5 rounded-md">
                  <button
                    type="button"
                    onClick={() => setPrivacy(0)}
                    className={`px-2.5 py-1 rounded text-xs font-semibold transition-all cursor-pointer ${
                      privacy === 0 ? "bg-white text-emerald-900 shadow-2xs" : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Công khai
                  </button>
                  <button
                    type="button"
                    onClick={() => setPrivacy(1)}
                    className={`px-2.5 py-1 rounded text-xs font-semibold transition-all cursor-pointer ${
                      privacy === 1 ? "bg-white text-slate-900 shadow-2xs" : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Chỉ mình tôi
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Cảm nghĩ & Kỷ niệm <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Ghi lại cảm xúc, món ăn ngon, kinh nghiệm..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:border-emerald-700 outline-none resize-none transition-colors"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Ảnh kỷ niệm (URL)</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:border-emerald-700 outline-none transition-colors"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 transition-colors cursor-pointer shadow-xs"
                >
                  Lưu kỷ niệm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: CHỈNH SỬA KỶ NIỆM (EDIT LOG MODAL) ── */}
      {editingLog && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-xl w-full max-w-lg shadow-xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <div className="flex items-center gap-2">
                <Edit3 size={16} className="text-emerald-800" />
                <h3 className="text-sm font-bold text-slate-900">Chỉnh sửa kỷ niệm chuyến đi</h3>
              </div>
              <button
                onClick={() => setEditingLog(null)}
                className="w-7 h-7 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-5 space-y-3.5 text-xs">
              {editErrorMsg && (
                <div className="p-2.5 bg-rose-50 text-rose-700 text-xs rounded-lg border border-rose-200">
                  {editErrorMsg}
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Địa điểm đã đến <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editPlaceName}
                  onChange={(e) => setEditPlaceName(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:border-emerald-700 outline-none transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tỉnh thành</label>
                  <select
                    value={editProvince}
                    onChange={(e) => setEditProvince(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:border-emerald-700 outline-none transition-colors"
                  >
                    {provinceOptions.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Ngày ghé thăm</label>
                  <input
                    type="text"
                    placeholder="VD: 10/09/2026"
                    value={editVisitedDate}
                    onChange={(e) => setEditVisitedDate(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:border-emerald-700 outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Chi tiêu (VNĐ)</label>
                  <input
                    type="number"
                    value={editSpentAmount}
                    onChange={(e) => setEditSpentAmount(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:border-emerald-700 outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Bạn đồng hành</label>
                  <select
                    value={editCompanion}
                    onChange={(e) => setEditCompanion(e.target.value as any)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:border-emerald-700 outline-none transition-colors"
                  >
                    <option value="couple">Cặp đôi</option>
                    <option value="friends">Bạn bè</option>
                    <option value="family">Gia đình</option>
                    <option value="solo">Đi một mình</option>
                  </select>
                </div>
              </div>

              {/* ĐỔI CHẾ ĐỘ RIÊNG TƯ / CÔNG KHAI */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
                <div>
                  <span className="block font-semibold text-slate-800 text-xs">Chế độ hiển thị</span>
                  <span className="text-[11px] text-slate-500">
                    {editPrivacy === 0 ? "Công khai: Mọi người đều có thể xem" : "Chỉ mình tôi: Kỷ niệm riêng tư"}
                  </span>
                </div>
                <div className="flex gap-1 bg-slate-200/80 p-0.5 rounded-md">
                  <button
                    type="button"
                    onClick={() => setEditPrivacy(0)}
                    className={`px-2.5 py-1 rounded text-xs font-semibold transition-all cursor-pointer ${
                      editPrivacy === 0 ? "bg-white text-emerald-900 shadow-2xs" : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Công khai
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditPrivacy(1)}
                    className={`px-2.5 py-1 rounded text-xs font-semibold transition-all cursor-pointer ${
                      editPrivacy === 1 ? "bg-white text-slate-900 shadow-2xs" : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Chỉ mình tôi
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Cảm nghĩ & Kỷ niệm <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:border-emerald-700 outline-none resize-none transition-colors"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Ảnh kỷ niệm (URL)</label>
                <input
                  type="url"
                  value={editPhotoUrl}
                  onChange={(e) => setEditPhotoUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:border-emerald-700 outline-none transition-colors"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingLog(null)}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 transition-colors cursor-pointer shadow-xs"
                >
                  Lưu thay đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
