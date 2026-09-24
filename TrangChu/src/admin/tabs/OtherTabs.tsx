import React, { useState, useMemo } from "react";
import {
  Utensils,
  FolderHeart,
  Compass,
  BookOpen,
  Layers,
  Bell,
  History,
  CheckCircle2,
  Plus,
  Search,
  MapPin,
  Eye,
  EyeOff,
  Check,
  X,
  ShieldCheck,
  Clock,
  Sparkles,
  Edit3,
  Trash2,
  Filter,
  Star,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Download,
  AlertTriangle,
  SlidersHorizontal,
  Bookmark,
  Share2,
  LayoutGrid,
  List,
  Columns,
} from "lucide-react";
import { AdminFoodItem, AdminBlogItem, AdminAuditLog, AdminAssignmentInfo } from "../../adminData";
import { places as allPlaces, Place } from "../../data";
import ImageUploader from "../components/ImageUploader";

/* ─────────────────────────────────────────────────────────────
   TAB 6: ẨM THỰC & ĐẶC SẢN VÙNG (FOODS TAB)
───────────────────────────────────────────────────────────── */
export function FoodsTab({ foodsList: initialFoods, showToast }: { foodsList: AdminFoodItem[]; showToast?: (msg: string) => void }) {
  const [foods, setFoods] = useState<AdminFoodItem[]>(initialFoods);
  const [searchText, setSearchText] = useState("");
  const [provinceFilter, setProvinceFilter] = useState("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingFood, setEditingFood] = useState<AdminFoodItem | null>(null);
  const [viewFood, setViewFood] = useState<AdminFoodItem | null>(null);

  const [form, setForm] = useState({
    name: "",
    province: "Đà Nẵng",
    desc: "",
    coverImg: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=400&fit=crop",
    famousPlacesCount: 3,
  });

  const provinces = useMemo(() => {
    const set = new Set<string>();
    foods.forEach((f) => set.add(f.province));
    return Array.from(set);
  }, [foods]);

  const filteredFoods = useMemo(() => {
    return foods.filter((f) => {
      if (provinceFilter !== "all" && f.province !== provinceFilter) return false;
      if (searchText.trim()) {
        const q = searchText.toLowerCase();
        const matchName = f.name.toLowerCase().includes(q);
        const matchDesc = (f.desc || "").toLowerCase().includes(q);
        if (!matchName && !matchDesc) return false;
      }
      return true;
    });
  }, [foods, provinceFilter, searchText]);

  const handleSaveFood = () => {
    if (!form.name.trim() || !form.desc.trim()) {
      showToast?.("Vui lòng nhập đầy đủ tên và mô tả món ăn.");
      return;
    }

    if (editingFood) {
      setFoods((prev) =>
        prev.map((f) => (f.id === editingFood.id ? { ...f, ...form } : f))
      );
      showToast?.(`Đã cập nhật món ăn "${form.name}".`);
    } else {
      const newItem: AdminFoodItem = {
        id: Date.now(),
        name: form.name,
        province: form.province,
        desc: form.desc,
        coverImg: form.coverImg,
        famousPlacesCount: form.famousPlacesCount || 1,
      };
      setFoods((prev) => [newItem, ...prev]);
      showToast?.(`Đã thêm món đặc sản "${form.name}".`);
    }

    setIsAddModalOpen(false);
    setEditingFood(null);
    setForm({
      name: "",
      province: "Đà Nẵng",
      desc: "",
      coverImg: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=400&fit=crop",
      famousPlacesCount: 3,
    });
  };

  const handleOpenEdit = (food: AdminFoodItem) => {
    setEditingFood(food);
    setForm({
      name: food.name,
      province: food.province,
      desc: food.desc,
      coverImg: food.coverImg,
      famousPlacesCount: food.famousPlacesCount || 1,
    });
    setIsAddModalOpen(true);
  };

  const handleDeleteFood = (id: number, name: string) => {
    setFoods((prev) => prev.filter((f) => f.id !== id));
    showToast?.(`Đã xóa món "${name}".`);
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-150">
      {/* Header & Actions */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4 text-xs">
        <div>
          <h2 className="font-bold text-base text-slate-900 tracking-tight flex items-center gap-2">
            <Utensils className="text-emerald-600" size={18} />
            <span>Ẩm thực &amp; Đặc sản vùng ({foods.length} món)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Kho từ điển ẩm thực đặc trưng truyền thống gắn liền với từng địa bàn tỉnh thành
          </p>
        </div>

        <button
          onClick={() => {
            setEditingFood(null);
            setForm({
              name: "",
              province: "Đà Nẵng",
              desc: "",
              coverImg: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=400&fit=crop",
              famousPlacesCount: 3,
            });
            setIsAddModalOpen(true);
          }}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
        >
          <Plus size={15} />
          <span>Thêm món đặc sản</span>
        </button>
      </div>

      {/* Search & Filter */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 min-w-[260px]">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm kiếm món đặc sản theo tên hoặc mô tả hương vị..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50/70 text-xs font-medium focus:bg-white focus:border-emerald-500 outline-none transition"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={provinceFilter}
            onChange={(e) => setProvinceFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 bg-white font-semibold text-slate-700 cursor-pointer outline-none hover:border-slate-300"
          >
            <option value="all">Tất cả Tỉnh / Thành ({provinces.length})</option>
            {provinces.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Foods Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredFoods.map((food) => (
          <div
            key={food.id}
            className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col justify-between hover:shadow-md hover:-translate-y-0.5 transition-all group"
          >
            <div className="relative h-44 overflow-hidden bg-slate-100">
              <img
                src={food.coverImg}
                alt={food.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <span className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-slate-900/80 backdrop-blur-xs text-white font-bold text-[10px]">
                {food.province}
              </span>
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3 justify-end gap-1.5">
                <button
                  onClick={() => setViewFood(food)}
                  className="p-1.5 rounded-lg bg-white/90 text-slate-800 hover:bg-white font-bold text-xs shadow-xs"
                  title="Xem chi tiết"
                >
                  <Eye size={14} />
                </button>
                <button
                  onClick={() => handleOpenEdit(food)}
                  className="p-1.5 rounded-lg bg-white/90 text-blue-600 hover:bg-white font-bold text-xs shadow-xs"
                  title="Chỉnh sửa"
                >
                  <Edit3 size={14} />
                </button>
                <button
                  onClick={() => handleDeleteFood(food.id, food.name)}
                  className="p-1.5 rounded-lg bg-white/90 text-rose-600 hover:bg-white font-bold text-xs shadow-xs"
                  title="Xóa"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            <div className="p-4 space-y-2 flex-1 flex flex-col justify-between text-xs">
              <div>
                <h3 className="font-bold text-slate-900 text-sm hover:text-emerald-600 transition-colors">
                  {food.name}
                </h3>
                <p className="text-slate-500 line-clamp-2 leading-relaxed mt-1">{food.desc}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
                <span className="flex items-center gap-1 text-slate-600 font-medium">
                  <MapPin size={12} className="text-emerald-600" />
                  {food.famousPlacesCount || 3} quán đặc trưng
                </span>
                <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  Đang hiển thị
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Food Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 p-6 space-y-4 shadow-2xl text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <Utensils size={17} className="text-emerald-600" />
                <span>{editingFood ? "Chỉnh sửa món đặc sản" : "Thêm món đặc sản mới"}</span>
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Tên món ăn <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  placeholder="Ví dụ: Bê Thui Cầu Mống"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:bg-white focus:border-emerald-500 text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Tỉnh / Thành đặc trưng</label>
                <select
                  value={form.province}
                  onChange={(e) => setForm({ ...form, province: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:bg-white focus:border-emerald-500 font-medium text-xs"
                >
                  <option value="Đà Nẵng">Đà Nẵng</option>
                  <option value="Quảng Nam">Quảng Nam</option>
                  <option value="Thừa Thiên Huế">Thừa Thiên Huế</option>
                  <option value="Hà Nội">Hà Nội</option>
                  <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
                  <option value="Khánh Hòa">Khánh Hòa</option>
                  <option value="Lâm Đồng">Lâm Đồng</option>
                  <option value="Ninh Bình">Ninh Bình</option>
                  <option value="Lào Cai">Lào Cai</option>
                </select>
              </div>

              <div>
                <ImageUploader
                  value={form.coverImg}
                  onChange={(url) => setForm({ ...form, coverImg: url })}
                  label="Ảnh minh họa món ăn"
                  helperText="Tải tệp từ máy tính hoặc nhập liên kết ảnh"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Mô tả nét đặc trưng &amp; nguồn gốc <span className="text-rose-500">*</span></label>
                <textarea
                  rows={3}
                  placeholder="Mô tả hương vị, nguyên liệu, lịch sử hình thành và cách thưởng thức chuẩn vị..."
                  value={form.desc}
                  onChange={(e) => setForm({ ...form, desc: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:bg-white focus:border-emerald-500 text-xs leading-relaxed"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 font-bold">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              >
                Hủy
              </button>
              <button
                onClick={handleSaveFood}
                className="px-4 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs"
              >
                {editingFood ? "Lưu cập nhật" : "Tạo món đặc sản"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Food Detail Modal */}
      {viewFood && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 overflow-hidden shadow-2xl text-xs">
            <div className="relative h-48 bg-slate-100">
              <img src={viewFood.coverImg} alt={viewFood.name} className="w-full h-full object-cover" />
              <button
                onClick={() => setViewFood(null)}
                className="absolute top-3 right-3 p-1.5 rounded-full bg-slate-900/70 text-white hover:bg-slate-900"
              >
                <X size={15} />
              </button>
              <span className="absolute bottom-3 left-3 px-3 py-1 rounded-lg bg-emerald-600 text-white font-bold text-xs shadow-md">
                {viewFood.province}
              </span>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <h3 className="text-lg font-black text-slate-900">{viewFood.name}</h3>
                <p className="text-slate-600 mt-2 leading-relaxed text-xs">{viewFood.desc}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">Số quán ăn tiêu biểu liên kết:</span>
                <strong className="text-slate-900 font-bold">{viewFood.famousPlacesCount || 3} địa điểm</strong>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => {
                    handleOpenEdit(viewFood);
                    setViewFood(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700"
                >
                  Chỉnh sửa
                </button>
                <button
                  onClick={() => setViewFood(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   TAB 7: BỘ SƯU TẬP TUYỂN CHỌN (COLLECTIONS TAB)
───────────────────────────────────────────────────────────── */
interface CollectionItem {
  id: number;
  name: string;
  count: number;
  placeIds: number[];
  img: string;
  tag: string;
  province: string;
  isFeatured: boolean;
  desc?: string;
  status: "active" | "draft";
}

export function CollectionsTab({ showToast }: { showToast?: (msg: string) => void }) {
  const [collections, setCollections] = useState<CollectionItem[]>([
    {
      id: 1,
      name: "Top 10 Quán Mì Quảng Ngon Nhất Đà Nẵng",
      count: 3,
      placeIds: [6, 8, 3],
      img: "https://images.unsplash.com/photo-1541544741938-0af808871cc0?w=600&h=400&fit=crop",
      tag: "Ẩm thực truyền thống",
      province: "Đà Nẵng",
      isFeatured: true,
      desc: "Tổng hợp các quán mì Quảng chuẩn vị xứ Quảng, nước dùng thanh ngọt thơm nức mũi.",
      status: "active",
    },
    {
      id: 2,
      name: "Cà Phê Check-in View Cầu Rồng & Sông Hàn",
      count: 2,
      placeIds: [4, 7],
      img: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&h=400&fit=crop",
      tag: "Check-in & Cà phê",
      province: "Đà Nẵng",
      isFeatured: true,
      desc: "Những quán cà phê góc nhìn ôm trọn sông Hàn lung linh ánh đèn và Cầu Rồng phun lửa.",
      status: "active",
    },
    {
      id: 3,
      name: "Hương Vị Phố Cổ Hội An Về Đêm",
      count: 2,
      placeIds: [3, 5],
      img: "https://images.unsplash.com/photo-1528127269322-539801943592?w=600&h=400&fit=crop",
      tag: "Đêm phố cổ",
      province: "Quảng Nam",
      isFeatured: false,
      desc: "Cao lầu, chè bắp, bánh bao bánh vạc cùng những gánh hàng rong ven sông Hoài.",
      status: "active",
    },
    {
      id: 4,
      name: "Hành Trình Ăn Sập Hà Nội 24 Giờ",
      count: 2,
      placeIds: [1, 7],
      img: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=400&fit=crop",
      tag: "Phố cổ Hà Nội",
      province: "Hà Nội",
      isFeatured: true,
      desc: "Phở Bát Đàn, bún chả Hàng Quạt, cà phê Giảng trứng béo ngậy nức tiếng.",
      status: "active",
    },
  ]);

  const [viewMode, setViewMode] = useState<"grid" | "table" | "split">("grid");
  const [selectedColId, setSelectedColId] = useState<number>(1);
  const [searchText, setSearchText] = useState("");
  const [tagFilter, setTagFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCol, setEditingCol] = useState<CollectionItem | null>(null);
  const [isAddPlacePickerOpen, setIsAddPlacePickerOpen] = useState(false);

  const [form, setForm] = useState({
    name: "",
    count: 6,
    placeIds: [1, 3] as number[],
    img: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&h=400&fit=crop",
    tag: "Ẩm thực",
    province: "Đà Nẵng",
    isFeatured: false,
    desc: "",
  });

  const selectedCol = useMemo(() => {
    return collections.find((c) => c.id === selectedColId) || collections[0] || null;
  }, [collections, selectedColId]);

  const filteredCollections = useMemo(() => {
    return collections.filter((c) => {
      if (tagFilter !== "all" && c.tag !== tagFilter) return false;
      if (searchText.trim()) {
        const q = searchText.toLowerCase();
        return c.name.toLowerCase().includes(q) || (c.desc || "").toLowerCase().includes(q) || c.province.toLowerCase().includes(q);
      }
      return true;
    });
  }, [collections, tagFilter, searchText]);

  const handleToggleFeatured = (id: number) => {
    setCollections((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const next = !c.isFeatured;
          showToast?.(`Đã ${next ? "ghim nổi bật" : "bỏ ghim"} bộ sưu tập "${c.name}".`);
          return { ...c, isFeatured: next };
        }
        return c;
      })
    );
  };

  const handleSaveCollection = () => {
    if (!form.name.trim()) {
      showToast?.("Vui lòng nhập tên bộ sưu tập.");
      return;
    }

    if (editingCol) {
      setCollections((prev) =>
        prev.map((c) => (c.id === editingCol.id ? { ...c, ...form, count: c.placeIds.length } : c))
      );
      showToast?.(`Đã cập nhật bộ sưu tập "${form.name}".`);
    } else {
      const newCol: CollectionItem = {
        id: Date.now(),
        name: form.name,
        count: form.placeIds.length,
        placeIds: form.placeIds || [1],
        img: form.img,
        tag: form.tag,
        province: form.province,
        isFeatured: form.isFeatured,
        desc: form.desc,
        status: "active",
      };
      setCollections((prev) => [newCol, ...prev]);
      setSelectedColId(newCol.id);
      showToast?.(`Đã tạo bộ sưu tập mới "${form.name}".`);
    }

    setIsModalOpen(false);
    setEditingCol(null);
  };

  const handleDeleteCol = (id: number, name: string) => {
    if (confirm(`Bạn có chắc chắn muốn xóa bộ sưu tập "${name}"?`)) {
      setCollections((prev) => prev.filter((c) => c.id !== id));
      showToast?.(`Đã xóa bộ sưu tập "${name}".`);
    }
  };

  // Add Place to Collection
  const handleAddPlaceToCol = (colId: number, placeId: number) => {
    setCollections((prev) =>
      prev.map((c) => {
        if (c.id === colId) {
          if (c.placeIds.includes(placeId)) {
            showToast?.("Địa điểm này đã có trong bộ sưu tập!");
            return c;
          }
          const nextIds = [...c.placeIds, placeId];
          showToast?.(`Đã thêm địa điểm vào bộ sưu tập "${c.name}".`);
          return { ...c, placeIds: nextIds, count: nextIds.length };
        }
        return c;
      })
    );
    setIsAddPlacePickerOpen(false);
  };

  // Remove Place from Collection
  const handleRemovePlaceFromCol = (colId: number, placeId: number) => {
    setCollections((prev) =>
      prev.map((c) => {
        if (c.id === colId) {
          const nextIds = c.placeIds.filter((id) => id !== placeId);
          showToast?.(`Đã gỡ địa điểm khỏi bộ sưu tập "${c.name}".`);
          return { ...c, placeIds: nextIds, count: nextIds.length };
        }
        return c;
      })
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150 text-xs text-slate-800">
      {/* ── 1. PAGE TITLE & ACTIONS ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <span>Bộ Sưu Tập Tuyển Chọn</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              {collections.length} bộ sưu tập
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Biên soạn và quản lý danh sách địa điểm theo chủ đề hiển thị nổi bật trên Trang chủ và trang Khám phá.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          {/* View Mode Switcher */}
          <div className="flex items-center bg-slate-200/70 p-1 rounded-xl text-xs">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === "grid" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
              title="Dạng lưới thẻ"
            >
              <LayoutGrid size={15} />
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === "table" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
              title="Dạng bảng quản trị"
            >
              <List size={15} />
            </button>
            <button
              onClick={() => setViewMode("split")}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === "split" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
              title="Dạng chia đôi Master-Detail"
            >
              <Columns size={15} />
            </button>
          </div>

          <button
            onClick={() => showToast?.("Đã xuất danh sách bộ sưu tập dạng CSV.")}
            className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs flex items-center gap-1.5 transition cursor-pointer"
          >
            <Download size={14} className="text-emerald-600" />
            <span>Xuất CSV</span>
          </button>

          <button
            onClick={() => {
              setEditingCol(null);
              setForm({
                name: "",
                count: 0,
                placeIds: [],
                img: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&h=400&fit=crop",
                tag: "Ẩm thực truyền thống",
                province: "Đà Nẵng",
                isFeatured: false,
                desc: "",
              });
              setIsModalOpen(true);
            }}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition cursor-pointer"
          >
            <Plus size={14} />
            <span>Tạo bộ sưu tập mới</span>
          </button>
        </div>
      </div>

      {/* ── 2. FILTER & SEARCH TOOLBAR ── */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[260px]">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm theo tên bộ sưu tập, tỉnh thành, chủ đề..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50/70 text-xs font-medium focus:bg-white focus:border-blue-500 outline-none transition"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={tagFilter}
            onChange={(e) => setTagFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 bg-white font-semibold text-slate-700 cursor-pointer outline-none hover:border-slate-300"
          >
            <option value="all">Tất cả chủ đề</option>
            <option value="Ẩm thực truyền thống">Ẩm thực truyền thống</option>
            <option value="Check-in & Cà phê">Check-in &amp; Cà phê</option>
            <option value="Đêm phố cổ">Đêm phố cổ</option>
            <option value="Phố cổ Hà Nội">Phố cổ Hà Nội</option>
          </select>
        </div>
      </div>

      {/* ── 3. CONTENT DISPLAY: 3 CHẾ ĐỘ VIEW TÙY CHỈNH CHO ADMIN ── */}

      {/* CHẾ ĐỘ 1: LƯỚI THẺ (GRID VIEW) */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCollections.map((col) => {
            const linkedPlaces = allPlaces.filter((p) => col.placeIds.includes(p.id));

            return (
              <div
                key={col.id}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col justify-between hover:shadow-md hover:-translate-y-0.5 transition-all group"
              >
                <div className="relative h-44 bg-slate-100 overflow-hidden">
                  <img src={col.img} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  {col.isFeatured && (
                    <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-md bg-amber-500 text-white font-bold text-[10px] shadow-sm flex items-center gap-1">
                      <Star size={11} fill="white" /> Nổi bật trang chủ
                    </span>
                  )}
                  <span className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-md bg-slate-900/80 backdrop-blur-xs text-white font-bold text-[10px]">
                    {col.province}
                  </span>
                </div>

                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-200">
                      {col.tag}
                    </span>
                    <h3 className="font-bold text-sm text-slate-900 pt-1 hover:text-blue-600 transition-colors">
                      {col.name}
                    </h3>
                    {col.desc && <p className="text-slate-500 text-[11px] line-clamp-2 leading-relaxed">{col.desc}</p>}

                    {/* Danh sách địa điểm tóm tắt */}
                    <div className="pt-2 border-t border-slate-100">
                      <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium mb-1.5">
                        <span>Địa điểm tuyển chọn ({col.placeIds.length}):</span>
                        <button
                          onClick={() => {
                            setSelectedColId(col.id);
                            setViewMode("split");
                          }}
                          className="text-blue-600 font-bold hover:underline"
                        >
                          Quản lý »
                        </button>
                      </div>
                      <div className="flex items-center gap-1 overflow-hidden">
                        {linkedPlaces.slice(0, 4).map((p) => (
                          <span
                            key={p.id}
                            className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-medium truncate max-w-[90px]"
                            title={p.name}
                          >
                            {p.name}
                          </span>
                        ))}
                        {linkedPlaces.length > 4 && (
                          <span className="text-[10px] text-slate-400 font-semibold">+{linkedPlaces.length - 4}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={() => handleToggleFeatured(col.id)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors cursor-pointer ${
                        col.isFeatured ? "text-amber-700 bg-amber-50 hover:bg-amber-100" : "text-slate-500 bg-slate-100 hover:bg-slate-200"
                      }`}
                    >
                      {col.isFeatured ? "★ Đang nổi bật" : "☆ Đặt nổi bật"}
                    </button>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setEditingCol(col);
                          setForm({
                            name: col.name,
                            count: col.placeIds.length,
                            placeIds: col.placeIds,
                            img: col.img,
                            tag: col.tag,
                            province: col.province,
                            isFeatured: col.isFeatured,
                            desc: col.desc || "",
                          });
                          setIsModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 cursor-pointer"
                        title="Chỉnh sửa"
                      >
                        <Edit3 size={14} />
                      </button>
                      <button
                        onClick={() => handleDeleteCol(col.id, col.name)}
                        className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 cursor-pointer"
                        title="Xóa"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CHẾ ĐỘ 2: BẢNG QUẢN TRỊ (TABLE VIEW) */}
      {viewMode === "table" && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50/80 text-slate-500 font-bold border-b border-slate-100 text-[11px] uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Bộ sưu tập</th>
                <th className="py-3.5 px-4">Chủ đề / Vùng</th>
                <th className="py-3.5 px-4">Địa điểm liên kết</th>
                <th className="py-3.5 px-4">Nổi bật</th>
                <th className="py-3.5 px-4 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCollections.map((col) => {
                const linkedPlaces = allPlaces.filter((p) => col.placeIds.includes(p.id));

                return (
                  <tr key={col.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img src={col.img} alt="" className="w-12 h-10 rounded-lg object-cover ring-1 ring-slate-200 shrink-0" />
                        <div>
                          <span className="font-bold text-slate-900 hover:text-blue-600 cursor-pointer text-xs">
                            {col.name}
                          </span>
                          <div className="text-[11px] text-slate-400 line-clamp-1">{col.desc}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="space-y-0.5">
                        <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-bold text-[10px]">
                          {col.tag}
                        </span>
                        <div className="text-slate-500 text-[11px] font-medium">{col.province}</div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => {
                          setSelectedColId(col.id);
                          setViewMode("split");
                        }}
                        className="font-bold text-blue-600 hover:underline flex items-center gap-1"
                      >
                        <span>{col.placeIds.length} địa điểm</span>
                        <ChevronRight size={13} />
                      </button>
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => handleToggleFeatured(col.id)}
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold cursor-pointer ${
                          col.isFeatured ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {col.isFeatured ? "★ Nổi bật" : "Thường"}
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => {
                            setSelectedColId(col.id);
                            setViewMode("split");
                          }}
                          className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 cursor-pointer"
                          title="Xem chi tiết & Quản lý quán"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          onClick={() => {
                            setEditingCol(col);
                            setForm({
                              name: col.name,
                              count: col.placeIds.length,
                              placeIds: col.placeIds,
                              img: col.img,
                              tag: col.tag,
                              province: col.province,
                              isFeatured: col.isFeatured,
                              desc: col.desc || "",
                            });
                            setIsModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 cursor-pointer"
                          title="Chỉnh sửa"
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteCol(col.id, col.name)}
                          className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 cursor-pointer"
                          title="Xóa"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* CHẾ ĐỘ 3: MASTER-DETAIL CHIA ĐÔI (SPLIT VIEW) */}
      {viewMode === "split" && selectedCol && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* CỘT TRÁI: DANH SÁCH BỘ SƯU TẬP (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs divide-y divide-slate-100 overflow-hidden">
            <div className="p-3.5 bg-slate-50 border-b border-slate-100 font-bold text-slate-700 text-xs flex items-center justify-between">
              <span>Danh sách Bộ sưu tập</span>
              <span className="text-[11px] text-slate-400">{filteredCollections.length} mục</span>
            </div>
            <div className="max-h-[600px] overflow-y-auto divide-y divide-slate-100">
              {filteredCollections.map((col) => {
                const isSelected = col.id === selectedCol.id;
                return (
                  <div
                    key={col.id}
                    onClick={() => setSelectedColId(col.id)}
                    className={`p-3.5 flex items-center justify-between gap-3 cursor-pointer transition-colors ${
                      isSelected ? "bg-blue-50/70 border-l-4 border-blue-600 font-bold" : "hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img src={col.img} alt="" className="w-12 h-10 rounded-lg object-cover ring-1 ring-slate-200 shrink-0" />
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-slate-900 truncate">{col.name}</h4>
                        <div className="text-[11px] text-slate-500 font-normal">
                          {col.province} · {col.placeIds.length} địa điểm
                        </div>
                      </div>
                    </div>
                    <ChevronRight size={14} className={isSelected ? "text-blue-600" : "text-slate-300"} />
                  </div>
                );
              })}
            </div>
          </div>

          {/* CỘT PHẢI: QUẢN LÝ ĐỊA ĐIỂM TRONG BỘ SƯU TẬP (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Header chi tiết BST */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 font-bold text-[10px]">
                      {selectedCol.tag}
                    </span>
                    <span className="text-slate-400 text-[11px]">{selectedCol.province}</span>
                  </div>
                  <h2 className="text-lg font-bold text-slate-900 tracking-tight">{selectedCol.name}</h2>
                  {selectedCol.desc && <p className="text-slate-500 text-xs leading-relaxed">{selectedCol.desc}</p>}
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => {
                      setEditingCol(selectedCol);
                      setForm({
                        name: selectedCol.name,
                        count: selectedCol.placeIds.length,
                        placeIds: selectedCol.placeIds,
                        img: selectedCol.img,
                        tag: selectedCol.tag,
                        province: selectedCol.province,
                        isFeatured: selectedCol.isFeatured,
                        desc: selectedCol.desc || "",
                      });
                      setIsModalOpen(true);
                    }}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
                    title="Sửa thông tin"
                  >
                    <Edit3 size={14} />
                  </button>
                  <button
                    onClick={() => setIsAddPlacePickerOpen(true)}
                    className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <Plus size={14} />
                    <span>Gán thêm địa điểm</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Danh sách địa điểm đã được gán vào BST */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
              <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  <MapPin size={14} className="text-blue-600" />
                  <span>Các địa điểm trong bộ sưu tập ({selectedCol.placeIds.length})</span>
                </h3>
                <span className="text-[11px] text-slate-400">Kéo thả hoặc xóa địa điểm</span>
              </div>

              <div className="divide-y divide-slate-100">
                {selectedCol.placeIds.length === 0 ? (
                  <div className="p-8 text-center text-slate-400">
                    Bộ sưu tập này chưa có địa điểm nào. Hãy bấm "Gán thêm địa điểm" để thêm quán!
                  </div>
                ) : (
                  selectedCol.placeIds.map((placeId, idx) => {
                    const p = allPlaces.find((item) => item.id === placeId);
                    if (!p) return null;

                    return (
                      <div key={p.id} className="p-3.5 flex items-center justify-between gap-3 hover:bg-slate-50/70 transition-colors">
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="w-6 h-6 rounded-md bg-slate-100 text-slate-500 font-bold flex items-center justify-center text-[11px] shrink-0">
                            #{idx + 1}
                          </span>
                          <img src={p.img} alt="" className="w-11 h-11 rounded-lg object-cover ring-1 ring-slate-200 shrink-0" />
                          <div className="min-w-0">
                            <h4 className="font-bold text-slate-900 text-xs truncate">{p.name}</h4>
                            <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                              <span className="text-amber-600 font-bold">★ {p.rating}</span>
                              <span>·</span>
                              <span className="truncate">{p.location}</span>
                              <span>·</span>
                              <span className="text-slate-600">{p.price}</span>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => handleRemovePlaceFromCol(selectedCol.id, p.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                          title="Gỡ khỏi bộ sưu tập"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL CHỌN ĐỊA ĐIỂM ĐỂ THÊM VÀO BST ── */}
      {isAddPlacePickerOpen && selectedCol && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 p-6 space-y-4 shadow-2xl text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-base text-slate-900">Chọn địa điểm đưa vào BST</h3>
                <p className="text-slate-400 text-[11px]">{selectedCol.name}</p>
              </div>
              <button onClick={() => setIsAddPlacePickerOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X size={16} />
              </button>
            </div>

            <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
              {allPlaces.map((p) => {
                const isAlreadyIn = selectedCol.placeIds.includes(p.id);

                return (
                  <div key={p.id} className="py-2.5 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img src={p.img} alt="" className="w-10 h-10 rounded-lg object-cover shrink-0" />
                      <div className="min-w-0">
                        <div className="font-bold text-slate-900 text-xs truncate">{p.name}</div>
                        <div className="text-[11px] text-slate-400 truncate">{p.location} · {p.category}</div>
                      </div>
                    </div>

                    <button
                      disabled={isAlreadyIn}
                      onClick={() => handleAddPlaceToCol(selectedCol.id, p.id)}
                      className={`px-3 py-1 rounded-lg font-bold text-xs transition cursor-pointer ${
                        isAlreadyIn
                          ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                          : "bg-blue-600 hover:bg-blue-700 text-white shadow-xs"
                      }`}
                    >
                      {isAlreadyIn ? "Đã có" : "+ Thêm"}
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <button
                onClick={() => setIsAddPlacePickerOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL TẠO / SỬA BỘ SƯU TẬP ── */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 p-6 space-y-4 shadow-2xl text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <FolderHeart size={18} className="text-blue-600" />
                <span>{editingCol ? "Chỉnh sửa bộ sưu tập" : "Tạo bộ sưu tập mới"}</span>
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Tên bộ sưu tập <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  placeholder="Ví dụ: Top 10 Quán Cà Phê Ngắm Hoàng Hôn"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:bg-white focus:border-blue-500 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Chủ đề / Tag</label>
                  <input
                    type="text"
                    value={form.tag}
                    onChange={(e) => setForm({ ...form, tag: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:bg-white focus:border-blue-500 text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Tỉnh / Khu vực</label>
                  <input
                    type="text"
                    value={form.province}
                    onChange={(e) => setForm({ ...form, province: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:bg-white focus:border-blue-500 text-xs"
                  />
                </div>
              </div>

              <div>
                <ImageUploader
                  value={form.img}
                  onChange={(url) => setForm({ ...form, img: url })}
                  label="Ảnh bìa bộ sưu tập"
                  helperText="Tải ảnh lên hoặc dán liên kết ảnh đẹp"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Mô tả ngắn</label>
                <textarea
                  rows={2}
                  placeholder="Tóm tắt điểm đặc sắc của danh sách địa điểm này..."
                  value={form.desc}
                  onChange={(e) => setForm({ ...form, desc: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:bg-white focus:border-blue-500 text-xs"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer pt-1 font-semibold text-slate-700">
                <input
                  type="checkbox"
                  checked={form.isFeatured}
                  onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span>Ghim hiển thị nổi bật trên Trang chủ</span>
              </label>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 font-bold">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              >
                Hủy
              </button>
              <button
                onClick={handleSaveCollection}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 shadow-xs"
              >
                {editingCol ? "Lưu thay đổi" : "Tạo bộ sưu tập"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   TAB 8: TỈNH / THÀNH TRONG VÙNG (PROVINCES TAB)
───────────────────────────────────────────────────────────── */
export function ProvincesTab({ showToast }: { showToast?: (msg: string) => void }) {
  const [provinces, setProvinces] = useState([
    { name: "Đà Nẵng", places: 142, foods: 28, completeness: 92, active: true, region: "Miền Trung", featured: true },
    { name: "Quảng Nam", places: 86, foods: 18, completeness: 85, active: true, region: "Miền Trung", featured: true },
    { name: "Thừa Thiên Huế", places: 64, foods: 24, completeness: 78, active: true, region: "Miền Trung", featured: false },
    { name: "Khánh Hòa", places: 52, foods: 14, completeness: 72, active: true, region: "Miền Trung", featured: false },
    { name: "Lâm Đồng", places: 68, foods: 16, completeness: 88, active: true, region: "Tây Nguyên", featured: true },
    { name: "Hà Nội", places: 184, foods: 42, completeness: 95, active: true, region: "Miền Bắc", featured: true },
    { name: "Ninh Bình", places: 46, foods: 12, completeness: 80, active: true, region: "Miền Bắc", featured: false },
    { name: "TP. Hồ Chí Minh", places: 196, foods: 38, completeness: 94, active: true, region: "Miền Nam", featured: true },
    { name: "Cần Thơ", places: 42, foods: 15, completeness: 76, active: true, region: "Miền Nam", featured: false },
  ]);

  const [regionFilter, setRegionFilter] = useState("all");
  const [searchText, setSearchText] = useState("");

  const filteredProvinces = useMemo(() => {
    return provinces.filter((p) => {
      if (regionFilter !== "all" && p.region !== regionFilter) return false;
      if (searchText.trim()) {
        return p.name.toLowerCase().includes(searchText.toLowerCase());
      }
      return true;
    });
  }, [provinces, regionFilter, searchText]);

  const handleToggleActive = (name: string) => {
    setProvinces((prev) =>
      prev.map((p) => {
        if (p.name === name) {
          const next = !p.active;
          showToast?.(`Đã ${next ? "kích hoạt" : "tạm ẩn"} tỉnh/thành "${p.name}".`);
          return { ...p, active: next };
        }
        return p;
      })
    );
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-150 text-xs">
      {/* ── 1. PAGE TITLE & ACTIONS ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <span>Quản lý Tỉnh / Thành phố</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              {provinces.length} khu vực
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Theo dõi tiến độ số hóa dữ liệu địa điểm, từ điển ẩm thực và phân vùng hiển thị.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => showToast?.("Đã tải xuống danh sách tỉnh thành định dạng CSV.")}
            className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <Download size={14} className="text-slate-600" />
            <span>Xuất CSV</span>
          </button>
        </div>
      </div>

      {/* ── 2. FILTERS ── */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[260px]">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm tỉnh thành..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50/70 text-xs font-medium focus:bg-white focus:border-blue-500 outline-none transition"
          />
        </div>
        <div className="flex items-center gap-2">
          <select
            value={regionFilter}
            onChange={(e) => setRegionFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 bg-white font-semibold text-slate-700 outline-none hover:border-slate-300 transition"
          >
            <option value="all">Tất cả Vùng miền</option>
            <option value="Miền Bắc">Miền Bắc</option>
            <option value="Miền Trung">Miền Trung</option>
            <option value="Miền Nam">Miền Nam</option>
            <option value="Tây Nguyên">Tây Nguyên</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50/90 text-slate-400 font-bold border-b border-slate-100 text-[11px] uppercase tracking-wider">
            <tr>
              <th className="py-3.5 px-5">Tỉnh / Thành</th>
              <th className="py-3.5 px-4">Vùng địa lý</th>
              <th className="py-3.5 px-4">Địa điểm số hóa</th>
              <th className="py-3.5 px-4">Món đặc sản</th>
              <th className="py-3.5 px-4">Độ phủ dữ liệu</th>
              <th className="py-3.5 px-4 text-center">Nổi bật</th>
              <th className="py-3.5 px-5 text-right">Trạng thái</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredProvinces.map((prv) => (
              <tr key={prv.name} className="hover:bg-slate-50/70 transition-colors">
                <td className="py-3.5 px-5 font-bold text-slate-900">{prv.name}</td>
                <td className="py-3.5 px-4 font-medium text-slate-600">{prv.region}</td>
                <td className="py-3.5 px-4 font-bold text-slate-800">{prv.places} địa điểm</td>
                <td className="py-3.5 px-4 font-medium text-slate-700">{prv.foods} món đặc sản</td>
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 w-9">{prv.completeness}%</span>
                    <div className="w-20 h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full transition-all"
                        style={{ width: `${prv.completeness}%` }}
                      />
                    </div>
                  </div>
                </td>
                <td className="py-3.5 px-4 text-center">
                  {prv.featured ? (
                    <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-bold text-[10px]">
                      ★ Nổi bật
                    </span>
                  ) : (
                    <span className="text-slate-400">—</span>
                  )}
                </td>
                <td className="py-3.5 px-5 text-right">
                  <button
                    onClick={() => handleToggleActive(prv.name)}
                    className={`px-3 py-1 rounded-full font-bold text-[10px] cursor-pointer transition ${
                      prv.active
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200"
                        : "bg-slate-100 text-slate-500 hover:bg-emerald-50 hover:text-emerald-700"
                    }`}
                  >
                    {prv.active ? "Đang mở" : "Đang ẩn"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   TAB 9: BLOG & CẨM NANG DU LỊCH (BLOGS TAB)
───────────────────────────────────────────────────────────── */
export function BlogsTab({
  blogsList: initialBlogs,
  showToast,
}: {
  blogsList: AdminBlogItem[];
  showToast?: (msg: string) => void;
}) {
  const [blogs, setBlogs] = useState<AdminBlogItem[]>(initialBlogs);
  const [blogStatusFilter, setBlogStatusFilter] = useState<"all" | "published" | "pending">("all");
  const [searchText, setSearchText] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [readingBlog, setReadingBlog] = useState<AdminBlogItem | null>(null);

  const [form, setForm] = useState({
    title: "",
    summary: "",
    authorName: "Ban Biên Tập",
    coverImg: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=400&fit=crop",
    category: "Cẩm nang",
    isPublished: true,
  });

  const handleToggleBlog = (id: number) => {
    setBlogs((prev) =>
      prev.map((b) => {
        if (b.id === id) {
          const next = !b.isPublished;
          showToast?.(`Đã ${next ? "xuất bản" : "chuyển về bản nháp"} bài viết "${b.title}".`);
          return { ...b, isPublished: next };
        }
        return b;
      })
    );
  };

  const filteredBlogs = useMemo(() => {
    return blogs.filter((b) => {
      if (blogStatusFilter === "published" && !b.isPublished) return false;
      if (blogStatusFilter === "pending" && b.isPublished) return false;
      if (searchText.trim()) {
        const q = searchText.toLowerCase();
        return b.title.toLowerCase().includes(q) || (b.summary || "").toLowerCase().includes(q) || b.authorName.toLowerCase().includes(q);
      }
      return true;
    });
  }, [blogs, blogStatusFilter, searchText]);

  const handleCreateBlog = () => {
    if (!form.title.trim() || !form.summary.trim()) {
      showToast?.("Vui lòng nhập đầy đủ tiêu đề và tóm tắt bài viết.");
      return;
    }

    const newBlog: AdminBlogItem = {
      id: Date.now(),
      title: form.title,
      summary: form.summary,
      authorName: form.authorName,
      coverImg: form.coverImg,
      isPublished: form.isPublished,
      publishedAt: form.isPublished ? "Hôm nay" : undefined,
    };

    setBlogs((prev) => [newBlog, ...prev]);
    setIsAddModalOpen(false);
    showToast?.(`Đã thêm bài viết mới "${form.title}".`);
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-150 text-xs">
      {/* ── 1. PAGE TITLE & ACTIONS ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <span>Quản lý Blog & Cẩm Nang</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              {blogs.length} bài viết
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Kiểm duyệt, chỉnh sửa và xuất bản các bài viết chia sẻ kinh nghiệm du lịch, cẩm nang khám phá từ cộng đồng tác giả.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => {
              setForm({
                title: "",
                summary: "",
                authorName: "Ban Biên Tập",
                coverImg: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=400&fit=crop",
                category: "Cẩm nang",
                isPublished: true,
              });
              setIsAddModalOpen(true);
            }}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Plus size={14} />
            <span>Tạo bài viết mới</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[260px]">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm theo tiêu đề, tác giả, nội dung bài viết..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium focus:bg-white focus:border-emerald-500 outline-none transition"
          />
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
          <button
            onClick={() => setBlogStatusFilter("all")}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              blogStatusFilter === "all" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600"
            }`}
          >
            Tất cả ({blogs.length})
          </button>
          <button
            onClick={() => setBlogStatusFilter("published")}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              blogStatusFilter === "published" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600"
            }`}
          >
            Đã xuất bản ({blogs.filter((b) => b.isPublished).length})
          </button>
          <button
            onClick={() => setBlogStatusFilter("pending")}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              blogStatusFilter === "pending" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600"
            }`}
          >
            Bản nháp ({blogs.filter((b) => !b.isPublished).length})
          </button>
        </div>
      </div>

      {/* Blog Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredBlogs.map((blog) => (
          <div
            key={blog.id}
            className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row gap-4 hover:shadow-md transition-all group"
          >
            <div className="relative w-full sm:w-40 h-36 rounded-xl overflow-hidden bg-slate-100 shrink-0">
              <img
                src={blog.coverImg}
                alt=""
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="space-y-2 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    Cẩm nang
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                      blog.isPublished
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-amber-50 text-amber-700 border border-amber-200"
                    }`}
                  >
                    {blog.isPublished ? "Đã xuất bản" : "Bản nháp"}
                  </span>
                </div>

                <h3
                  onClick={() => setReadingBlog(blog)}
                  className="font-bold text-slate-900 text-sm mt-1.5 line-clamp-2 hover:text-emerald-600 cursor-pointer transition-colors"
                >
                  {blog.title}
                </h3>
                <p className="text-slate-500 line-clamp-2 leading-relaxed mt-1 text-[11px]">{blog.summary}</p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span>Tác giả: <strong className="text-slate-700">{blog.authorName}</strong></span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setReadingBlog(blog)}
                    className="font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
                  >
                    Xem trước
                  </button>
                  <button
                    onClick={() => handleToggleBlog(blog.id)}
                    className="font-bold text-emerald-600 hover:underline cursor-pointer"
                  >
                    {blog.isPublished ? "Tạm ẩn" : "Duyệt xuất bản"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Read Blog Preview Modal */}
      {readingBlog && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 overflow-hidden shadow-2xl text-xs max-h-[85vh] flex flex-col">
            <div className="relative h-56 bg-slate-100 shrink-0">
              <img src={readingBlog.coverImg} alt="" className="w-full h-full object-cover" />
              <button
                onClick={() => setReadingBlog(null)}
                className="absolute top-3 right-3 p-1.5 rounded-full bg-slate-900/70 text-white hover:bg-slate-900"
              >
                <X size={16} />
              </button>
              <div className="absolute bottom-3 left-4 right-4 text-white">
                <span className="px-2.5 py-0.5 rounded-md bg-emerald-600 text-[10px] font-bold">
                  {readingBlog.isPublished ? "Đã xuất bản" : "Bản nháp"}
                </span>
                <h2 className="text-lg font-black mt-1.5 drop-shadow-md">{readingBlog.title}</h2>
              </div>
            </div>
            <div className="p-6 space-y-4 overflow-y-auto flex-1">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 text-slate-500">
                <span>Tác giả: <strong className="text-slate-800">{readingBlog.authorName}</strong></span>
                <span>Ngày đăng: <strong>{readingBlog.publishedAt || "Chưa xuất bản"}</strong></span>
              </div>
              <p className="font-semibold text-slate-800 text-sm leading-relaxed">{readingBlog.summary}</p>
              <div className="text-slate-600 leading-relaxed space-y-3 pt-2">
                <p>
                  Đến với địa điểm này, du khách sẽ được chìm đắm trong không gian văn hóa ẩm thực truyền thống
                  đặc trưng, cảm nhận trọn vẹn tinh hoa phong vị địa phương qua từng món ngon nức tiếng.
                </p>
                <p>
                  Bài viết mang lại góc nhìn chân thực, giàu cảm xúc, hướng dẫn chi tiết từ việc lựa chọn thời gian
                  tham quan, địa điểm lưu trú cho tới bí quyết thưởng thức trọn vẹn ẩm thực bản địa.
                </p>
              </div>
            </div>
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-between items-center">
              <button
                onClick={() => {
                  handleToggleBlog(readingBlog.id);
                  setReadingBlog(null);
                }}
                className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700"
              >
                {readingBlog.isPublished ? "Chuyển về Bản nháp" : "Xuất bản bài viết"}
              </button>
              <button
                onClick={() => setReadingBlog(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-white"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Blog Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 p-6 space-y-4 shadow-2xl text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <BookOpen size={18} className="text-emerald-600" />
                <span>Thêm bài cẩm nang mới</span>
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Tiêu đề bài viết <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  placeholder="Ví dụ: Cẩm nang 48 giờ khám phá ẩm thực Đà Nẵng trọn vẹn"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:bg-white focus:border-emerald-500 text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Tác giả</label>
                <input
                  type="text"
                  value={form.authorName}
                  onChange={(e) => setForm({ ...form, authorName: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:bg-white focus:border-emerald-500 text-xs"
                />
              </div>

              <div>
                <ImageUploader
                  value={form.coverImg}
                  onChange={(url) => setForm({ ...form, coverImg: url })}
                  label="Ảnh bìa bài viết"
                  helperText="Tải lên ảnh phong cảnh du lịch độ nét cao"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Tóm tắt nội dung <span className="text-rose-500">*</span></label>
                <textarea
                  rows={3}
                  placeholder="Tóm tắt ngắn gọn các điểm nhấn chính trong hành trình trải nghiệm..."
                  value={form.summary}
                  onChange={(e) => setForm({ ...form, summary: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:bg-white focus:border-emerald-500 text-xs"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700">
                <input
                  type="checkbox"
                  checked={form.isPublished}
                  onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span>Xuất bản ngay lập tức</span>
              </label>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 font-bold">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              >
                Hủy
              </button>
              <button
                onClick={handleCreateBlog}
                className="px-4 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700"
              >
                Lưu bài viết
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   TAB 10: DANH MỤC HỆ THỐNG (CATEGORIES TAB)
───────────────────────────────────────────────────────────── */
export function CategoriesTab({ currentAdminInfo }: { currentAdminInfo: AdminAssignmentInfo }) {
  const [categories] = useState([
    { id: 1, name: "Nhà hàng & Quán ăn", type: "Ẩm thực", places: 628, assigned: true, status: "Đang hoạt động" },
    { id: 2, name: "Quán Cà phê & Trà", type: "Ẩm thực", places: 284, assigned: true, status: "Đang hoạt động" },
    { id: 3, name: "Ẩm thực đường phố", type: "Ẩm thực", places: 312, assigned: true, status: "Đang hoạt động" },
    { id: 4, name: "Điểm tham quan & Di tích", type: "Du lịch", places: 390, assigned: false, status: "Đang hoạt động" },
    { id: 5, name: "Khách sạn & Homestay", type: "Lưu trú", places: 215, assigned: false, status: "Đang hoạt động" },
  ]);

  return (
    <div className="space-y-5 animate-in fade-in duration-150 text-xs">
      {/* ── 1. PAGE TITLE & ACTIONS ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <span>Danh mục hệ thống</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              {categories.length} danh mục
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Danh mục ẩm thực và dịch vụ do Admin cấp 1 được phân quyền quản trị nội dung &amp; địa điểm.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className={`p-4 rounded-2xl border transition-all ${
              cat.assigned
                ? "bg-white border-emerald-200 shadow-xs ring-1 ring-emerald-500/20"
                : "bg-slate-50/70 border-slate-200 opacity-80"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                {cat.type}
              </span>
              {cat.assigned ? (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                  <CheckCircle2 size={11} /> Phụ trách
                </span>
              ) : (
                <span className="text-[10px] font-medium text-slate-400">Admin khác</span>
              )}
            </div>

            <h3 className="font-bold text-slate-900 text-sm mt-3">{cat.name}</h3>
            <p className="text-slate-400 text-[11px] mt-1">{cat.places} địa điểm trên hệ thống</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   TAB 13: THÔNG BÁO & HỒ SƠ CÁ NHÂN (NOTIFICATIONS PROFILE TAB)
───────────────────────────────────────────────────────────── */
export function NotificationsProfileTab({ currentAdminInfo }: { currentAdminInfo: AdminAssignmentInfo }) {
  const [notifications, setNotifications] = useState([
    { id: 1, title: "Báo cáo vi phạm khẩn cấp tại Mì Quảng Ếch Bếp Trang", time: "10 phút trước", type: "urgent", read: false },
    { id: 2, title: "Đề xuất thêm mới địa điểm 'Bánh tráng Hoàng Tín' chờ duyệt", time: "1 giờ trước", type: "proposal", read: false },
    { id: 3, title: "Cấu hình SLA cảnh báo tự động kích hoạt cho khu vực Đà Nẵng", time: "Hôm nay 08:30", type: "system", read: true },
    { id: 4, title: "Tổng kết số lượng duyệt địa điểm tháng này đạt 116 mục", time: "Hôm qua", type: "system", read: true },
  ]);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150 text-xs">
      {/* Profile Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <img
            src={currentAdminInfo.adminAvatar}
            alt=""
            className="w-16 h-16 rounded-2xl object-cover ring-2 ring-emerald-500/30 shrink-0"
          />
          <div>
            <h2 className="font-black text-lg text-slate-900">{currentAdminInfo.adminName}</h2>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[10px]">
                {currentAdminInfo.roleTitle}
              </span>
              <span className="text-slate-400">{currentAdminInfo.adminEmail}</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Phạm vi: {currentAdminInfo.assignedRegion}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200/60">
          <div className="text-center px-4 border-r border-slate-200">
            <div className="text-[10px] text-slate-400 uppercase font-bold">Đã duyệt tháng</div>
            <div className="font-black text-slate-900 text-base mt-0.5">{currentAdminInfo.stats.approvedThisMonth}</div>
          </div>
          <div className="text-center px-4">
            <div className="text-[10px] text-slate-400 uppercase font-bold">SLA trung bình</div>
            <div className="font-black text-emerald-600 text-base mt-0.5">{currentAdminInfo.stats.slaHours}h</div>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs divide-y divide-slate-100 overflow-hidden">
        <div className="p-4 bg-slate-50/70 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 flex items-center gap-2">
            <Bell size={15} className="text-emerald-600" />
            <span>Thông báo công việc &amp; Cảnh báo</span>
          </h3>
          <button onClick={markAllRead} className="text-[11px] text-emerald-600 font-bold hover:underline cursor-pointer">
            Đánh dấu tất cả đã đọc
          </button>
        </div>

        {notifications.map((notif) => (
          <div
            key={notif.id}
            className={`p-4 flex items-center justify-between gap-4 transition-colors ${
              notif.read ? "hover:bg-slate-50/70" : "bg-emerald-50/30 hover:bg-emerald-50/50"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                  notif.type === "urgent" ? "bg-rose-500" : notif.type === "proposal" ? "bg-amber-500" : "bg-emerald-500"
                }`}
              />
              <span className={`text-slate-800 ${notif.read ? "font-normal" : "font-bold"}`}>{notif.title}</span>
            </div>
            <span className="text-slate-400 text-[11px] whitespace-nowrap">{notif.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   TAB 14: NHẬT KÝ KIỂM TOÁN (AUDIT LOGS TAB)
───────────────────────────────────────────────────────────── */
export function AuditLogsTab({
  auditLogs,
  showToast,
}: {
  auditLogs: AdminAuditLog[];
  showToast?: (msg: string) => void;
}) {
  const [filterType, setFilterType] = useState<string>("all");
  const [searchText, setSearchText] = useState("");
  const [selectedLog, setSelectedLog] = useState<AdminAuditLog | null>(null);

  const filteredLogs = useMemo(() => {
    return auditLogs.filter((log) => {
      if (filterType !== "all" && log.type !== filterType) return false;
      if (searchText.trim()) {
        const q = searchText.toLowerCase();
        const matchAction = log.action.toLowerCase().includes(q);
        const matchTarget = (log.targetName || "").toLowerCase().includes(q);
        const matchAdmin = (log.adminName || "").toLowerCase().includes(q);
        if (!matchAction && !matchTarget && !matchAdmin) return false;
      }
      return true;
    });
  }, [auditLogs, filterType, searchText]);

  return (
    <div className="space-y-5 animate-in fade-in duration-150 text-xs">
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-bold text-base text-slate-900 tracking-tight flex items-center gap-2">
            <History className="text-emerald-600" size={18} />
            <span>Nhật ký kiểm toán hệ thống (Audit Trail)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Lưu vết toàn bộ thao tác duyệt, ẩn, sửa, phân công phục vụ thanh tra và giám sát minh bạch
          </p>
        </div>

        <button
          onClick={() => showToast?.("Đã xuất tệp CSV nhật ký kiểm toán thành công.")}
          className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 shadow-xs cursor-pointer"
        >
          <Download size={14} />
          <span>Xuất CSV</span>
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[260px]">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm theo hành động, đối tượng hoặc người thực hiện..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium focus:bg-white focus:border-emerald-500 outline-none transition"
          />
        </div>

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-3 py-2 rounded-xl border border-slate-200 bg-white font-semibold text-slate-700 cursor-pointer outline-none hover:border-slate-300"
        >
          <option value="all">Tất cả hành động</option>
          <option value="approve">Duyệt phát hành</option>
          <option value="hide">Tạm ẩn</option>
          <option value="reject">Từ chối</option>
          <option value="resolve">Xử lý báo cáo</option>
          <option value="create">Thêm mới</option>
          <option value="edit">Chỉnh sửa</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50/80 text-slate-400 font-bold border-b border-slate-100 text-[11px] uppercase tracking-wider">
            <tr>
              <th className="py-3.5 px-4">Thời gian</th>
              <th className="py-3.5 px-4">Hành động</th>
              <th className="py-3.5 px-4">Đối tượng</th>
              <th className="py-3.5 px-4">Người thực hiện</th>
              <th className="py-3.5 px-4">Chi tiết ghi chú</th>
              <th className="py-3.5 px-4 text-right">Chi tiết</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredLogs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap">{log.timestamp}</td>
                <td className="py-3.5 px-4">
                  <span
                    className={`inline-block font-bold px-2 py-0.5 rounded-md text-[10px] ${
                      log.type === "approve"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : log.type === "hide" || log.type === "reject"
                        ? "bg-rose-50 text-rose-700 border border-rose-200"
                        : "bg-blue-50 text-blue-700 border border-blue-200"
                    }`}
                  >
                    {log.action}
                  </span>
                </td>
                <td className="py-3.5 px-4 font-semibold text-slate-800">{log.targetName || "—"}</td>
                <td className="py-3.5 px-4 text-slate-600 font-medium">{log.adminName || "Admin"}</td>
                <td className="py-3.5 px-4 text-slate-500 leading-relaxed max-w-xs truncate">{log.details}</td>
                <td className="py-3.5 px-4 text-right">
                  <button
                    onClick={() => setSelectedLog(log)}
                    className="text-emerald-600 hover:text-emerald-800 font-bold hover:underline cursor-pointer"
                  >
                    Xem
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Log Detail Inspector Modal */}
      {selectedLog && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 p-6 space-y-4 shadow-2xl text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <History size={16} className="text-emerald-600" />
                <span>Chi tiết nhật ký kiểm toán #{selectedLog.id}</span>
              </h3>
              <button onClick={() => setSelectedLog(null)} className="text-slate-400 hover:text-slate-600 p-1">
                <X size={16} />
              </button>
            </div>
            <div className="space-y-3">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Thời gian:</span>
                  <strong className="text-slate-800">{selectedLog.timestamp}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Admin thực hiện:</span>
                  <strong className="text-slate-800">{selectedLog.adminName}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Hành động:</span>
                  <strong className="text-emerald-700">{selectedLog.action}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Đối tượng:</span>
                  <strong className="text-slate-800">{selectedLog.targetName}</strong>
                </div>
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Nội dung ghi chú &amp; Lý do</label>
                <div className="p-3 bg-white rounded-xl border border-slate-200 text-slate-700 leading-relaxed">
                  {selectedLog.details}
                </div>
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedLog(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800"
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
