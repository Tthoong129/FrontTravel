import { useState } from "react";
import {
  Heart,
  LayoutGrid,
  List,
  Search,
  Star,
  MapPin,
  Clock,
  Compass,
  UtensilsCrossed,
  BookOpen,
  ArrowUpRight,
  Filter,
  FolderPlus,
  Folder,
  Lock,
  Edit2,
  Check,
  X,
  Share2,
  Sparkles,
} from "lucide-react";
import { FavoriteItem, FavoriteType } from "./data";

interface FavoritesSectionProps {
  favorites: FavoriteItem[];
  onRemoveFavorite: (id: number) => void;
  onSelectPlaceById?: (placeId: number) => void;
  onUpdateNote?: (id: number, newNote: string) => void;
}

export default function FavoritesSection({
  favorites,
  onRemoveFavorite,
  onSelectPlaceById,
  onUpdateNote,
}: FavoritesSectionProps) {
  const [activeTab, setActiveTab] = useState<"all" | FavoriteType>("all");
  const [selectedCollection, setSelectedCollection] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "rating" | "name">("newest");
  const [removingId, setRemovingId] = useState<number | null>(null);

  // Note editing state
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);
  const [tempNote, setTempNote] = useState("");

  // New Collection Modal State
  const [isNewCollectionModalOpen, setIsNewCollectionModalOpen] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState("");
  const [customCollections, setCustomCollections] = useState<string[]>([
    "Săn mây Đà Lạt",
    "Quán ăn ngon Hà Nội",
    "Món ngon phố cổ",
    "Món ngon Sài Gòn",
  ]);

  // Extract all unique collections
  const allCollections = Array.from(
    new Set([
      ...customCollections,
      ...favorites.map((f) => f.collection).filter(Boolean) as string[],
    ])
  );

  // Tabs Definition
  const tabs = [
    { id: "all", label: "Tất cả", count: favorites.length },
    {
      id: 1,
      label: "Địa điểm",
      icon: MapPin,
      count: favorites.filter((f) => f.targetType === 1).length,
    },
    {
      id: 2,
      label: "Ẩm thực",
      icon: UtensilsCrossed,
      count: favorites.filter((f) => f.targetType === 2).length,
    },
    {
      id: 3,
      label: "Hành trình",
      icon: Compass,
      count: favorites.filter((f) => f.targetType === 3).length,
    },
    {
      id: 4,
      label: "Bài viết",
      icon: BookOpen,
      count: favorites.filter((f) => f.targetType === 4).length,
    },
  ];

  // Filtering & Sorting
  let filteredFavorites = favorites.filter((item) => {
    const matchesTab = activeTab === "all" || item.targetType === activeTab;
    const matchesCollection =
      selectedCollection === "all" || item.collection === selectedCollection;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.categoryTag.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.privateNote &&
        item.privateNote.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesTab && matchesCollection && matchesSearch;
  });

  if (sortBy === "rating") {
    filteredFavorites = [...filteredFavorites].sort(
      (a, b) => (b.rating || 0) - (a.rating || 0)
    );
  } else if (sortBy === "name") {
    filteredFavorites = [...filteredFavorites].sort((a, b) =>
      a.title.localeCompare(b.title)
    );
  }

  const handleUnfavorite = (id: number) => {
    setRemovingId(id);
    setTimeout(() => {
      onRemoveFavorite(id);
      setRemovingId(null);
    }, 450);
  };

  const handleSaveNote = (id: number) => {
    if (onUpdateNote) {
      onUpdateNote(id, tempNote);
    }
    const item = favorites.find((f) => f.id === id);
    if (item) {
      item.privateNote = tempNote;
    }
    setEditingNoteId(null);
    setTempNote("");
  };

  const handleCreateCollection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCollectionName.trim()) return;
    if (!customCollections.includes(newCollectionName.trim())) {
      setCustomCollections((prev) => [...prev, newCollectionName.trim()]);
      setSelectedCollection(newCollectionName.trim());
    }
    setNewCollectionName("");
    setIsNewCollectionModalOpen(false);
  };

  const getBadgeColor = (type: FavoriteType) => {
    switch (type) {
      case 1:
        return "bg-emerald-700 text-white";
      case 2:
        return "bg-orange-600 text-white";
      case 3:
        return "bg-blue-600 text-white";
      case 4:
        return "bg-purple-700 text-white";
      default:
        return "bg-slate-800 text-white";
    }
  };

  return (
    <div className="space-y-5">
      {/* ── HEADER BANNER (Gọn gàng, Chuẩn form, Không làm lố kiểu AI) ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            Địa điểm & Mục đã lưu
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {favorites.length} mục đã lưu · {allCollections.length} bộ sưu tập
          </p>
        </div>

        <button
          onClick={() => setIsNewCollectionModalOpen(true)}
          className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 transition-all flex items-center gap-1.5 cursor-pointer border border-slate-200 shadow-2xs self-start sm:self-auto"
        >
          <FolderPlus size={14} className="text-emerald-700" />
          <span>Tạo thư mục</span>
        </button>
      </div>

      {/* ── BỘ SƯU TẬP (COLLECTION FOLDER PILLS) ── */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        <button
          onClick={() => setSelectedCollection("all")}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
            selectedCollection === "all"
              ? "bg-slate-900 text-white font-semibold shadow-2xs"
              : "bg-white hover:bg-slate-50 text-slate-600 border border-slate-200"
          }`}
        >
          <span>Tất cả</span>
          <span
            className={`text-[10px] px-1.5 py-0.2 rounded-full ${
              selectedCollection === "all" ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
            }`}
          >
            {favorites.length}
          </span>
        </button>

        {allCollections.map((col) => {
          const count = favorites.filter((f) => f.collection === col).length;
          const isSelected = selectedCollection === col;
          return (
            <button
              key={col}
              onClick={() => setSelectedCollection(col)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                isSelected
                  ? "bg-emerald-800 text-white font-semibold shadow-2xs"
                  : "bg-white hover:bg-slate-50 text-slate-600 border border-slate-200"
              }`}
            >
              <span>{col}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isSelected ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── CONTROLS ROW: SEARCH, SORT & VIEW SWITCHER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        {/* Search */}
        <div className="relative flex-1 sm:max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm theo tên hoặc ghi chú riêng..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-700 outline-none transition-all"
          />
        </div>

        {/* Sort & View Mode */}
        <div className="flex items-center gap-2.5">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 text-xs font-medium bg-white border border-slate-200 rounded-xl outline-none text-slate-700"
          >
            <option value="newest">Mới lưu gần đây</option>
            <option value="rating">Đánh giá cao nhất</option>
            <option value="name">Tên A-Z</option>
          </select>

          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 flex-shrink-0">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === "grid"
                  ? "bg-white text-emerald-900 shadow-sm font-bold"
                  : "text-slate-500 hover:text-slate-800"
              }`}
              title="Dạng lưới"
            >
              <LayoutGrid size={15} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === "list"
                  ? "bg-white text-emerald-900 shadow-sm font-bold"
                  : "text-slate-500 hover:text-slate-800"
              }`}
              title="Dạng danh sách"
            >
              <List size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* ── TARGET TYPE TABS ── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar border-b border-slate-200">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2 text-xs font-bold transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
                isActive
                  ? "border-emerald-800 text-emerald-900"
                  : "border-transparent text-slate-500 hover:text-slate-900"
              }`}
            >
              {Icon && <Icon size={14} />}
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  isActive ? "bg-emerald-100 text-emerald-900" : "bg-slate-100 text-slate-500"
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── EMPTY STATE ── */}
      {filteredFavorites.length === 0 && (
        <div className="bg-white rounded-xl p-10 text-center border border-slate-200">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <Heart size={20} />
          </div>
          <h3 className="text-sm font-bold text-slate-800">Không tìm thấy mục đã lưu nào</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            Không có kết quả phù hợp với từ khóa hoặc bộ lọc đã chọn. Hãy thử chọn thư mục khác.
          </p>
        </div>
      )}

      {/* ══════════ BỐ CỤC DẠNG GRID (LƯỚI) ══════════ */}
      {viewMode === "grid" && filteredFavorites.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFavorites.map((item) => {
            const isRemoving = removingId === item.id;
            return (
              <div
                key={item.id}
                className={`group bg-white rounded-xl overflow-hidden border border-slate-200 shadow-2xs hover:border-emerald-800/30 hover:shadow-md transition-all flex flex-col ${
                  isRemoving ? "scale-90 opacity-0 pointer-events-none" : "scale-100 opacity-100"
                }`}
              >
                {/* Cover Image */}
                <div className="relative h-44 overflow-hidden bg-slate-100">
                  <img
                    src={item.coverImg}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Category Tag */}
                  <span className="absolute top-2.5 left-2.5 text-[10px] font-semibold px-2 py-0.5 rounded-md bg-white/95 text-slate-800 shadow-2xs border border-white/80">
                    {item.categoryTag}
                  </span>

                  {/* Un-favorite Button */}
                  <button
                    onClick={() => handleUnfavorite(item.id)}
                    className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/95 hover:bg-white text-rose-500 hover:scale-105 active:scale-95 flex items-center justify-center shadow-xs transition-all cursor-pointer"
                    title="Bỏ lưu"
                  >
                    <Heart size={15} className="fill-rose-500 text-rose-500" />
                  </button>

                  {/* Rating */}
                  {item.rating && (
                    <div className="absolute bottom-2 left-2.5 flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/90 backdrop-blur-xs text-slate-900 text-[11px] font-bold shadow-2xs">
                      <Star size={11} className="fill-amber-400 text-amber-500" />
                      <span>{item.rating.toFixed(1)}</span>
                    </div>
                  )}
                </div>

                {/* Card Content */}
                <div className="p-3.5 flex flex-col flex-1">
                  <h3 className="font-bold text-slate-900 text-sm leading-snug mb-0.5 group-hover:text-emerald-800 transition-colors line-clamp-1">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mb-2 line-clamp-1">
                    <MapPin size={11} className="flex-shrink-0 text-slate-400" />
                    <span>{item.subtitle}</span>
                  </p>

                  {/* Private Note (Gọn gàng, tinh tế) */}
                  {item.privateNote && (
                    <div className="mb-2.5 p-2 rounded-lg bg-stone-50 border border-stone-200/80 text-[11px] text-stone-600 flex items-start justify-between gap-1.5">
                      <span className="italic line-clamp-2">"{item.privateNote}"</span>
                      <button
                        onClick={() => {
                          setEditingNoteId(item.id);
                          setTempNote(item.privateNote || "");
                        }}
                        className="text-emerald-800 hover:underline font-semibold text-[10px] flex-shrink-0 cursor-pointer"
                      >
                        Sửa
                      </button>
                    </div>
                  )}

                  {/* Bottom Meta */}
                  <div className="mt-auto pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-emerald-800 truncate max-w-[170px]">
                      {item.price || item.extraInfo}
                    </span>
                    <span className="text-slate-400 flex-shrink-0">{item.savedDate}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ══════════ BỐ CỤC DẠNG LIST ══════════ */}
      {viewMode === "list" && filteredFavorites.length > 0 && (
        <div className="space-y-3">
          {filteredFavorites.map((item) => {
            const isRemoving = removingId === item.id;
            return (
              <div
                key={item.id}
                className={`group bg-white rounded-xl overflow-hidden border border-slate-200 hover:shadow-md hover:border-emerald-700/30 transition-all p-3 flex flex-col sm:flex-row items-center gap-4 ${
                  isRemoving ? "scale-95 opacity-0" : "scale-100 opacity-100"
                }`}
              >
                {/* Thumbnail */}
                <div className="relative w-full sm:w-44 h-32 rounded-lg overflow-hidden flex-shrink-0 bg-slate-100">
                  <img
                    src={item.coverImg}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2 left-2">
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-md ${getBadgeColor(
                        item.targetType
                      )}`}
                    >
                      {item.categoryTag}
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0 flex flex-col justify-between self-stretch py-1">
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug group-hover:text-emerald-800 transition-colors">
                          {item.title}
                        </h3>
                        {item.collection && (
                          <span className="text-[10px] font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 inline-block mt-1">
                            📁 {item.collection}
                          </span>
                        )}
                      </div>

                      {/* Unfavorite */}
                      <button
                        onClick={() => handleUnfavorite(item.id)}
                        className="p-1.5 rounded-md text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Bỏ lưu"
                      >
                        <Heart size={16} className="fill-rose-500 text-rose-500" />
                      </button>
                    </div>

                    <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                      <MapPin size={12} className="text-slate-400" />
                      <span>{item.subtitle}</span>
                    </p>

                    {item.privateNote && (
                      <p className="text-xs text-stone-700 bg-stone-50 p-2 rounded-lg border border-stone-200/80 mt-2 italic flex items-center gap-1.5">
                        <Lock size={12} className="text-stone-500 flex-shrink-0" />
                        <span>"{item.privateNote}"</span>
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2 mt-2 border-t border-slate-100 text-xs text-slate-400">
                    <span className="font-semibold text-emerald-800">
                      {item.price || item.extraInfo}
                    </span>
                    <span>Đã lưu {item.savedDate}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── MODAL TẠO BỘ SƯU TẬP MỚI ── */}
      {isNewCollectionModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-xl p-5 w-full max-w-sm shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <FolderPlus size={16} className="text-emerald-800" />
                <h3 className="text-sm font-bold text-slate-900">Tạo thư mục bộ sưu tập</h3>
              </div>
              <button
                onClick={() => setIsNewCollectionModalOpen(false)}
                className="w-7 h-7 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>

            <form onSubmit={handleCreateCollection} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tên thư mục <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Kỳ nghỉ hè Đà Lạt, Món ngon Sài Gòn..."
                  value={newCollectionName}
                  onChange={(e) => setNewCollectionName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:border-emerald-700 outline-none transition-colors"
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewCollectionModalOpen(false)}
                  className="py-2 rounded-lg text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="py-2 rounded-lg text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 transition-colors shadow-xs cursor-pointer"
                >
                  Tạo thư mục
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL SỬA GHI CHÚ RIÊNG TƯ ── */}
      {editingNoteId !== null && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-xl p-5 w-full max-w-sm shadow-xl border border-slate-200 space-y-3.5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Lock size={15} className="text-slate-700" />
                <h3 className="text-sm font-bold text-slate-900">Ghi chú riêng tư cho địa điểm</h3>
              </div>
              <button
                onClick={() => setEditingNoteId(null)}
                className="w-7 h-7 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Ghi chú này hoàn toàn riêng tư, chỉ một mình bạn nhìn thấy.
            </p>

            <textarea
              rows={3}
              placeholder="Nhập lưu ý: Giờ đi đẹp nhất, món ăn nên gọi, kinh nghiệm..."
              value={tempNote}
              onChange={(e) => setTempNote(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:border-emerald-700 outline-none resize-none transition-colors"
              autoFocus
            />

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => setEditingNoteId(null)}
                className="py-2 rounded-lg text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={() => handleSaveNote(editingNoteId)}
                className="py-2 rounded-lg text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 transition-colors shadow-xs cursor-pointer"
              >
                Lưu ghi chú
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
