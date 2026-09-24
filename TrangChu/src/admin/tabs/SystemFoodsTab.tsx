import React, { useState, useMemo } from "react";
import {
  Utensils,
  Search,
  Plus,
  Edit3,
  Trash2,
  Check,
  X,
  MapPin,
  Eye,
  EyeOff,
  LayoutGrid,
  List,
  Columns,
  Sparkles,
  Download,
  Filter,
  DollarSign,
  Calendar,
  Flame,
  Star,
  ExternalLink,
  ChevronRight,
  SlidersHorizontal,
} from "lucide-react";
import { places as allPlaces, Place } from "../../data";
import ImageUploader from "../components/ImageUploader";

export interface FoodItem {
  id: string;
  name: string;
  province: string;
  region: "Miền Bắc" | "Miền Trung" | "Miền Nam" | "Tây Nguyên";
  category: string;
  desc: string;
  coverImg: string;
  famousPlacesCount: number;
  placeIds: number[];
  avgPrice: string;
  bestSeason?: string;
  isPopular: boolean;
  status: "active" | "draft" | "hidden";
  updatedAt: string;
}

const initialFoods: FoodItem[] = [
  {
    id: "f-1",
    name: "Mì Quảng",
    province: "Quảng Nam",
    region: "Miền Trung",
    category: "Món nước truyền thống",
    desc: "Sợi mì vàng óng dai mềm hòa quyện nước dùng đậm đà từ xương, tôm, thịt hoặc ếch, ăn kèm bánh tráng nướng giòn rụm và rau sống Trà Quế.",
    coverImg: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=400&fit=crop",
    famousPlacesCount: 3,
    placeIds: [6, 8, 3],
    avgPrice: "35.000đ – 65.000đ",
    bestSeason: "Quanh năm",
    isPopular: true,
    status: "active",
    updatedAt: "Hôm nay",
  },
  {
    id: "f-2",
    name: "Bún Bò Huế",
    province: "Thừa Thiên Huế",
    region: "Miền Trung",
    category: "Món bún truyền thống",
    desc: "Nước dùng cay nồng hương sả, đậm đà mắm ruốc đặc trưng kết hợp thịt bắp bò, chả cua và giò heo thơm ngọt.",
    coverImg: "https://images.unsplash.com/photo-1569271532956-3fb81a207115?w=600&h=400&fit=crop",
    famousPlacesCount: 2,
    placeIds: [3, 5],
    avgPrice: "40.000đ – 70.000đ",
    bestSeason: "Mùa đông & Mùa xuân",
    isPopular: true,
    status: "active",
    updatedAt: "Hôm qua",
  },
  {
    id: "f-3",
    name: "Bánh Mì Sài Gòn",
    province: "TP. Hồ Chí Minh",
    region: "Miền Nam",
    category: "Ẩm thực đường phố",
    desc: "Vỏ bánh giòn rụm kẹp pate béo ngậy, chả lụa, thịt nướng, đồ chua giòn ngọt và ngò rí cay the.",
    coverImg: "https://images.unsplash.com/photo-1763703686284-b63557b08a86?w=600&h=400&fit=crop",
    famousPlacesCount: 2,
    placeIds: [7, 4],
    avgPrice: "20.000đ – 45.000đ",
    bestSeason: "Quanh năm",
    isPopular: true,
    status: "active",
    updatedAt: "18/09/2026",
  },
  {
    id: "f-4",
    name: "Phở Bò Hà Nội",
    province: "Hà Nội",
    region: "Miền Bắc",
    category: "Món nước truyền thống",
    desc: "Nước dùng thanh trong ngọt sâu từ xương bò ninh nhừ qua đêm cùng quế hồi thảo quả, sợi phở mềm mại.",
    coverImg: "https://images.unsplash.com/photo-1509072619873-adb3dc289b50?w=600&h=400&fit=crop",
    famousPlacesCount: 2,
    placeIds: [1, 2],
    avgPrice: "45.000đ – 85.000đ",
    bestSeason: "Mùa thu & Mùa đông",
    isPopular: true,
    status: "active",
    updatedAt: "17/09/2026",
  },
  {
    id: "f-5",
    name: "Bánh Tráng Cuốn Thịt Heo",
    province: "Đà Nẵng",
    region: "Miền Trung",
    category: "Món cuốn đặc sản",
    desc: "Thịt heo hai đầu da luộc vừa chín tới, cuốn cùng bánh tráng phơi sương, rau rừng tươi xanh và chấm mắm nêm thơm lừng.",
    coverImg: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=400&fit=crop",
    famousPlacesCount: 2,
    placeIds: [6, 4],
    avgPrice: "60.000đ – 120.000đ",
    bestSeason: "Quanh năm",
    isPopular: true,
    status: "active",
    updatedAt: "16/09/2026",
  },
  {
    id: "f-6",
    name: "Cơm Tấm Sườn Bì Chả",
    province: "TP. Hồ Chí Minh",
    region: "Miền Nam",
    category: "Món cơm đặc sản",
    desc: "Hạt gạo tấm thơm dẻo, sườn nướng mật ong vàng óng xém cạnh, chả trứng béo mềm và mỡ hành thơm phức.",
    coverImg: "https://images.unsplash.com/photo-1687902409602-8b7cf039a44a?w=600&h=400&fit=crop",
    famousPlacesCount: 2,
    placeIds: [7, 8],
    avgPrice: "35.000đ – 65.000đ",
    bestSeason: "Quanh năm",
    isPopular: true,
    status: "active",
    updatedAt: "15/09/2026",
  },
  {
    id: "f-7",
    name: "Bún Chả Hà Nội",
    province: "Hà Nội",
    region: "Miền Bắc",
    category: "Món bún truyền thống",
    desc: "Chả viên và chả miếng nướng than hoa thơm lừng thả trong bát nước chấm chua ngọt kèm đu đủ xanh giòn tan.",
    coverImg: "https://images.unsplash.com/photo-1541544741938-0af808871cc0?w=600&h=400&fit=crop",
    famousPlacesCount: 2,
    placeIds: [1, 3],
    avgPrice: "40.000đ – 70.000đ",
    bestSeason: "Mùa hè & Mùa thu",
    isPopular: true,
    status: "active",
    updatedAt: "14/09/2026",
  },
  {
    id: "f-8",
    name: "Cao Lầu Hội An",
    province: "Quảng Nam",
    region: "Miền Trung",
    category: "Món mì đặc trưng",
    desc: "Sợi cao lầu ngâm tro củi cù lao chàm, thịt xá xíu đậm vị, tóp mỡ chiên giòn và rau sống Trà Quế đặc trưng.",
    coverImg: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=400&fit=crop",
    famousPlacesCount: 2,
    placeIds: [3, 5],
    avgPrice: "35.000đ – 55.000đ",
    bestSeason: "Quanh năm",
    isPopular: false,
    status: "active",
    updatedAt: "12/09/2026",
  },
];

interface SystemFoodsTabProps {
  onNotify: (msg: string) => void;
}

export default function SystemFoodsTab({ onNotify }: SystemFoodsTabProps) {
  const [foods, setFoods] = useState<FoodItem[]>(initialFoods);
  const [viewMode, setViewMode] = useState<"grid" | "table" | "split">("grid");

  // Filter & Search
  const [searchText, setSearchText] = useState("");
  const [regionFilter, setRegionFilter] = useState("all");
  const [provinceFilter, setProvinceFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Selection & Modal
  const [selectedFoodId, setSelectedFoodId] = useState<string>(initialFoods[0]?.id || "");
  const [drawerFood, setDrawerFood] = useState<FoodItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFood, setEditingFood] = useState<FoodItem | null>(null);

  // Place Picker Modal for linking eateries
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [assigningFoodId, setAssigningFoodId] = useState<string | null>(null);
  const [placeModalSearch, setPlaceModalSearch] = useState("");
  const [placeModalCategoryFilter, setPlaceModalCategoryFilter] = useState("all");

  // Form State
  const [form, setForm] = useState({
    name: "",
    province: "Đà Nẵng",
    region: "Miền Trung" as "Miền Bắc" | "Miền Trung" | "Miền Nam" | "Tây Nguyên",
    category: "Món nước truyền thống",
    desc: "",
    coverImg: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=400&fit=crop",
    avgPrice: "35.000đ – 75.000đ",
    bestSeason: "Quanh năm",
    isPopular: true,
    status: "active" as "active" | "draft" | "hidden",
  });

  // Unique provinces in data
  const provinces = useMemo(() => {
    const set = new Set<string>();
    foods.forEach((f) => set.add(f.province));
    return Array.from(set);
  }, [foods]);

  // Filtered Foods
  const filteredFoods = useMemo(() => {
    return foods.filter((f) => {
      if (regionFilter !== "all" && f.region !== regionFilter) return false;
      if (provinceFilter !== "all" && f.province !== provinceFilter) return false;
      if (statusFilter !== "all" && f.status !== statusFilter) return false;
      if (searchText.trim()) {
        const q = searchText.toLowerCase();
        const matchName = f.name.toLowerCase().includes(q);
        const matchProv = f.province.toLowerCase().includes(q);
        const matchDesc = f.desc.toLowerCase().includes(q);
        if (!matchName && !matchProv && !matchDesc) return false;
      }
      return true;
    });
  }, [foods, regionFilter, provinceFilter, statusFilter, searchText]);

  // Currently active food for split view or drawer
  const activeSelectedFood = useMemo(() => {
    return foods.find((f) => f.id === selectedFoodId) || filteredFoods[0] || null;
  }, [foods, selectedFoodId, filteredFoods]);

  const assigningFood = useMemo(() => {
    return foods.find((f) => f.id === assigningFoodId) || null;
  }, [foods, assigningFoodId]);

  // Handlers
  const handleToggleStatus = (id: string) => {
    setFoods((prev) =>
      prev.map((f) => {
        if (f.id === id) {
          const nextStatus = f.status === "active" ? "hidden" : "active";
          onNotify(`Đã ${nextStatus === "active" ? "kích hoạt" : "tạm ẩn"} món "${f.name}".`);
          return { ...f, status: nextStatus };
        }
        return f;
      })
    );
  };

  const handleDeleteFood = (id: string, name: string) => {
    if (confirm(`Bạn có chắc muốn xóa món đặc sản "${name}" khỏi từ điển?`)) {
      setFoods((prev) => prev.filter((f) => f.id !== id));
      if (selectedFoodId === id) {
        setSelectedFoodId(foods.find((f) => f.id !== id)?.id || "");
      }
      if (drawerFood?.id === id) setDrawerFood(null);
      onNotify(`Đã xóa món ăn "${name}".`);
    }
  };

  const handleOpenAdd = () => {
    setEditingFood(null);
    setForm({
      name: "",
      province: "Đà Nẵng",
      region: "Miền Trung",
      category: "Món nước truyền thống",
      desc: "",
      coverImg: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=400&fit=crop",
      avgPrice: "35.000đ – 75.000đ",
      bestSeason: "Quanh năm",
      isPopular: true,
      status: "active",
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (f: FoodItem) => {
    setEditingFood(f);
    setForm({
      name: f.name,
      province: f.province,
      region: f.region,
      category: f.category,
      desc: f.desc,
      coverImg: f.coverImg,
      avgPrice: f.avgPrice,
      bestSeason: f.bestSeason || "Quanh năm",
      isPopular: f.isPopular,
      status: f.status,
    });
    setIsModalOpen(true);
  };

  const handleSaveForm = () => {
    if (!form.name || !form.desc) {
      onNotify("Vui lòng nhập tên món và mô tả chi tiết.");
      return;
    }

    if (editingFood) {
      setFoods((prev) =>
        prev.map((f) =>
          f.id === editingFood.id
            ? {
                ...f,
                name: form.name,
                province: form.province,
                region: form.region,
                category: form.category,
                desc: form.desc,
                coverImg: form.coverImg,
                avgPrice: form.avgPrice,
                bestSeason: form.bestSeason,
                isPopular: form.isPopular,
                status: form.status,
                updatedAt: "Vừa xong",
              }
            : f
        )
      );
      onNotify(`Đã cập nhật thông tin món "${form.name}".`);
    } else {
      const newFoodItem: FoodItem = {
        id: `f-${Date.now()}`,
        name: form.name,
        province: form.province,
        region: form.region,
        category: form.category,
        desc: form.desc,
        coverImg: form.coverImg,
        famousPlacesCount: 0,
        placeIds: [],
        avgPrice: form.avgPrice,
        bestSeason: form.bestSeason,
        isPopular: form.isPopular,
        status: form.status,
        updatedAt: "Vừa xong",
      };
      setFoods([newFoodItem, ...foods]);
      setSelectedFoodId(newFoodItem.id);
      onNotify(`Đã thêm mới món đặc sản "${newFoodItem.name}".`);
    }

    setIsModalOpen(false);
  };

  // Place Linking Handlers
  const handleTogglePlaceLink = (foodId: string, placeId: number) => {
    setFoods((prev) =>
      prev.map((f) => {
        if (f.id === foodId) {
          const currentIds = f.placeIds || [];
          const exists = currentIds.includes(placeId);
          const nextIds = exists ? currentIds.filter((id) => id !== placeId) : [...currentIds, placeId];
          const targetPlace = allPlaces.find((p) => p.id === placeId);
          onNotify(
            exists
              ? `Đã gỡ quán "${targetPlace?.name || placeId}" khỏi món "${f.name}".`
              : `Đã gán quán "${targetPlace?.name || placeId}" vào món "${f.name}".`
          );
          return {
            ...f,
            placeIds: nextIds,
            famousPlacesCount: nextIds.length,
          };
        }
        return f;
      })
    );
  };

  const handleRemovePlaceFromFood = (foodId: string, placeId: number) => {
    setFoods((prev) =>
      prev.map((f) => {
        if (f.id === foodId) {
          const nextIds = (f.placeIds || []).filter((id) => id !== placeId);
          const targetPlace = allPlaces.find((p) => p.id === placeId);
          onNotify(`Đã gỡ quán "${targetPlace?.name || placeId}" khỏi món "${f.name}".`);
          return {
            ...f,
            placeIds: nextIds,
            famousPlacesCount: nextIds.length,
          };
        }
        return f;
      })
    );
  };

  const handleExportCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "ID,Tên Món Ăn,Tỉnh Thành,Vùng Miền,Danh Mục,Số Quán Tiêu Biểu,Mức Giá,Trạng Thái\n" +
      foods
        .map(
          (f) =>
            `${f.id},"${f.name}","${f.province}","${f.region}","${f.category}",${f.placeIds?.length || f.famousPlacesCount},"${f.avgPrice}",${
              f.status === "active" ? "Đang hiển thị" : "Tạm ẩn"
            }`
        )
        .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `tu_dien_mon_an_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onNotify("Đã xuất từ điển món ăn dạng CSV thành công!");
  };

  // Quick stats
  const totalFoods = foods.length;
  const activeFoods = foods.filter((f) => f.status === "active").length;
  const popularFoods = foods.filter((f) => f.isPopular).length;
  const totalLinkedPlaces = foods.reduce((acc, f) => acc + (f.placeIds?.length || f.famousPlacesCount || 0), 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. Page Title & Layout Switcher Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <span>Từ Điển Món Ăn &amp; Đặc Sản</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              {totalFoods} món đặc sản
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Kho dữ liệu văn hóa ẩm thực và mạng lưới các quán ăn phục vụ đặc sản truyền thống 63 tỉnh thành.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          {/* Layout Mode Switcher (Grid / Table / Split Master-Detail) */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs border border-slate-200/80">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 px-2 rounded-lg transition-all flex items-center gap-1 cursor-pointer font-bold ${
                viewMode === "grid" ? "bg-white text-blue-600 shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
              title="Dạng lưới thẻ"
            >
              <LayoutGrid size={15} />
              <span className="hidden md:inline text-[11px]">Lưới</span>
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`p-1.5 px-2 rounded-lg transition-all flex items-center gap-1 cursor-pointer font-bold ${
                viewMode === "table" ? "bg-white text-blue-600 shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
              title="Dạng bảng dữ liệu"
            >
              <List size={15} />
              <span className="hidden md:inline text-[11px]">Bảng</span>
            </button>
            <button
              onClick={() => setViewMode("split")}
              className={`p-1.5 px-2 rounded-lg transition-all flex items-center gap-1 cursor-pointer font-bold ${
                viewMode === "split" ? "bg-white text-blue-600 shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
              title="Bố cục chia đôi: Quản lý chi tiết & Quán ăn liên kết"
            >
              <Columns size={15} />
              <span className="hidden md:inline text-[11px]">Chia đôi (Chi tiết)</span>
            </button>
          </div>

          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs flex items-center gap-1.5 transition cursor-pointer"
          >
            <Download size={14} className="text-emerald-600" />
            <span className="hidden sm:inline">Xuất CSV</span>
          </button>

          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition cursor-pointer"
          >
            <Plus size={14} />
            <span>Thêm món đặc sản</span>
          </button>
        </div>
      </div>

      {/* 2. Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Tổng món đặc sản
          </div>
          <div className="text-xl font-black text-slate-900 mt-1">{totalFoods}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Từ điển số hóa</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">
            Đang hiển thị
          </div>
          <div className="text-xl font-black text-emerald-700 mt-1">{activeFoods}</div>
          <div className="text-[10px] text-emerald-600 mt-0.5">Phục vụ du khách</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">
            Món ăn tiêu biểu
          </div>
          <div className="text-xl font-black text-amber-700 mt-1">{popularFoods}</div>
          <div className="text-[10px] text-amber-600 mt-0.5">Được gợi ý nhiều nhất</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">
            Quán ăn liên kết
          </div>
          <div className="text-xl font-black text-blue-700 mt-1">{totalLinkedPlaces}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Địa chỉ thưởng thức</div>
        </div>
      </div>

      {/* 3. Search & Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="relative flex-1 min-w-[240px]">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm theo tên món ăn, tỉnh thành, hương vị..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50/70 text-xs font-medium focus:bg-white focus:border-blue-500 outline-none transition-all"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <select
              value={regionFilter}
              onChange={(e) => setRegionFilter(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white font-semibold text-slate-700 cursor-pointer outline-none hover:border-slate-300"
            >
              <option value="all">Tất cả Vùng miền</option>
              <option value="Miền Bắc">Miền Bắc</option>
              <option value="Miền Trung">Miền Trung</option>
              <option value="Miền Nam">Miền Nam</option>
              <option value="Tây Nguyên">Tây Nguyên</option>
            </select>

            <select
              value={provinceFilter}
              onChange={(e) => setProvinceFilter(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white font-semibold text-slate-700 cursor-pointer outline-none hover:border-slate-300"
            >
              <option value="all">Tất cả Tỉnh / Thành</option>
              {provinces.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white font-semibold text-slate-700 cursor-pointer outline-none hover:border-slate-300"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Đang hiển thị</option>
              <option value="hidden">Đang tạm ẩn</option>
            </select>
          </div>
        </div>
      </div>

      {/* 4. VIEW MODE 1: GRID VIEW */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredFoods.length === 0 ? (
            <div className="col-span-full py-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-200 text-xs">
              Không tìm thấy món ăn nào phù hợp với bộ lọc.
            </div>
          ) : (
            filteredFoods.map((f) => {
              const isActive = f.status === "active";
              const placeCount = f.placeIds?.length || f.famousPlacesCount || 0;
              return (
                <div
                  key={f.id}
                  className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col justify-between hover:shadow-md transition-all group"
                >
                  <div className="relative h-44 overflow-hidden bg-slate-100">
                    <img
                      src={f.coverImg}
                      alt={f.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                      <span className="px-2.5 py-0.5 rounded-md bg-slate-900/80 backdrop-blur-xs text-white font-bold text-[10px]">
                        {f.province}
                      </span>
                      {f.isPopular && (
                        <span className="px-2 py-0.5 rounded-md bg-amber-500 text-white font-bold text-[10px] flex items-center gap-0.5">
                          <Flame size={11} /> Tiêu biểu
                        </span>
                      )}
                    </div>
                    <span
                      className={`absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md font-bold text-[10px] ${
                        isActive ? "bg-emerald-500 text-white" : "bg-slate-700 text-slate-200"
                      }`}
                    >
                      {isActive ? "Hiển thị" : "Tạm ẩn"}
                    </span>
                  </div>

                  <div className="p-4 space-y-2 flex-1 flex flex-col justify-between text-xs">
                    <div>
                      <div className="text-[11px] text-amber-600 font-semibold">{f.category}</div>
                      <h3 className="font-bold text-slate-900 text-sm mt-0.5">{f.name}</h3>
                      <p className="text-slate-500 line-clamp-2 leading-relaxed mt-1">{f.desc}</p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 space-y-2.5">
                      <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
                        <button
                          onClick={() => {
                            setAssigningFoodId(f.id);
                            setIsAssignModalOpen(true);
                          }}
                          className="flex items-center gap-1 text-blue-600 font-bold hover:underline cursor-pointer"
                          title="Quản lý quán ăn liên kết"
                        >
                          <MapPin size={12} className="text-blue-500" />
                          {placeCount} quán liên kết
                        </button>
                        <span className="text-emerald-700 font-bold">{f.avgPrice}</span>
                      </div>

                      <div className="flex items-center gap-1 pt-1">
                        <button
                          onClick={() => setDrawerFood(f)}
                          className="flex-1 py-1.5 rounded-lg bg-slate-100 hover:bg-blue-600 hover:text-white font-bold text-slate-700 text-xs transition cursor-pointer"
                        >
                          Chi tiết &amp; Quán
                        </button>
                        <button
                          onClick={() => handleOpenEdit(f)}
                          className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition cursor-pointer"
                          title="Sửa món ăn"
                        >
                          <Edit3 size={13} />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(f.id)}
                          className={`p-1.5 rounded-lg transition cursor-pointer ${
                            isActive
                              ? "bg-slate-100 text-slate-600 hover:bg-rose-50 hover:text-rose-600"
                              : "bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white"
                          }`}
                          title={isActive ? "Tạm ẩn" : "Kích hoạt"}
                        >
                          {isActive ? <EyeOff size={13} /> : <Eye size={13} />}
                        </button>
                        <button
                          onClick={() => handleDeleteFood(f.id, f.name)}
                          className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white transition cursor-pointer"
                          title="Xóa món ăn"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* 5. VIEW MODE 2: TABLE VIEW */}
      {viewMode === "table" && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 text-slate-400 font-bold border-b border-slate-100 text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Tên Món ăn</th>
                  <th className="py-3.5 px-3">Tỉnh / Thành</th>
                  <th className="py-3.5 px-3">Phân loại</th>
                  <th className="py-3.5 px-3">Quán tiêu biểu</th>
                  <th className="py-3.5 px-3">Mức giá</th>
                  <th className="py-3.5 px-3">Trạng thái</th>
                  <th className="py-3.5 px-4 text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredFoods.map((f) => {
                  const isActive = f.status === "active";
                  const placeCount = f.placeIds?.length || f.famousPlacesCount || 0;
                  return (
                    <tr key={f.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        <div className="flex items-center gap-3">
                          <img
                            src={f.coverImg}
                            alt={f.name}
                            className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-200 shrink-0"
                          />
                          <div>
                            <button
                              onClick={() => setDrawerFood(f)}
                              className="font-bold text-slate-900 hover:text-blue-600 transition text-left cursor-pointer"
                            >
                              {f.name}
                            </button>
                            <span className="text-[10px] text-slate-400 block mt-0.5">
                              {f.region}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-3 font-semibold text-slate-700 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px]">
                          {f.province}
                        </span>
                      </td>

                      <td className="py-3.5 px-3 font-medium text-slate-600 whitespace-nowrap">
                        {f.category}
                      </td>

                      <td className="py-3.5 px-3 font-bold whitespace-nowrap">
                        <button
                          onClick={() => {
                            setAssigningFoodId(f.id);
                            setIsAssignModalOpen(true);
                          }}
                          className="text-blue-600 hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <MapPin size={12} />
                          <span>{placeCount} quán</span>
                        </button>
                      </td>

                      <td className="py-3.5 px-3 font-bold text-slate-800 whitespace-nowrap">
                        {f.avgPrice}
                      </td>

                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <span
                          className={`px-2.5 py-1 rounded-full font-bold text-[10px] border ${
                            isActive
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-slate-100 text-slate-600 border-slate-200"
                          }`}
                        >
                          {isActive ? "Đang hiển thị" : "Tạm ẩn"}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => setDrawerFood(f)}
                            className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 font-bold text-xs transition cursor-pointer"
                          >
                            Chi tiết
                          </button>
                          <button
                            onClick={() => handleOpenEdit(f)}
                            className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition cursor-pointer"
                            title="Sửa"
                          >
                            <Edit3 size={13} />
                          </button>
                          <button
                            onClick={() => handleToggleStatus(f.id)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition cursor-pointer"
                            title={isActive ? "Tạm ẩn" : "Kích hoạt"}
                          >
                            {isActive ? <EyeOff size={13} /> : <Eye size={13} />}
                          </button>
                          <button
                            onClick={() => handleDeleteFood(f.id, f.name)}
                            className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white transition cursor-pointer"
                            title="Xóa"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 6. VIEW MODE 3: SPLIT MASTER-DETAIL VIEW */}
      {viewMode === "split" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Left Column: Food Items List (5 Cols) */}
          <div className="lg:col-span-5 space-y-3">
            <div className="bg-slate-100/80 p-2.5 rounded-xl text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
              <span>Danh sách món ăn ({filteredFoods.length})</span>
              <span className="text-[10px] text-slate-400 font-normal">Click chọn để xem &amp; gán quán</span>
            </div>

            <div className="space-y-2.5 max-h-[calc(100vh-280px)] overflow-y-auto pr-1">
              {filteredFoods.map((f) => {
                const isSelected = activeSelectedFood?.id === f.id;
                const placeCount = f.placeIds?.length || f.famousPlacesCount || 0;
                return (
                  <div
                    key={f.id}
                    onClick={() => setSelectedFoodId(f.id)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? "bg-blue-50/50 border-blue-500 shadow-xs ring-1 ring-blue-400"
                        : "bg-white border-slate-200/80 hover:bg-slate-50/80"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={f.coverImg}
                        alt={f.name}
                        className="w-14 h-14 rounded-xl object-cover ring-1 ring-slate-200 shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-slate-900 text-xs truncate">{f.name}</span>
                          {f.isPopular && (
                            <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-700 font-bold text-[9px]">
                              Hot
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1.5">
                          <span>{f.province}</span>
                          <span>•</span>
                          <span className="text-emerald-700 font-semibold">{f.avgPrice}</span>
                        </div>
                        <div className="mt-1 flex items-center gap-1 text-[10px] font-bold text-blue-600">
                          <MapPin size={11} />
                          <span>{placeCount} quán ăn phục vụ</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      <span
                        className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                          f.status === "active" ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {f.status === "active" ? "Hiển thị" : "Ẩn"}
                      </span>
                      <ChevronRight size={14} className={isSelected ? "text-blue-600" : "text-slate-300"} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Selected Food Details & Linked Eateries Manager (7 Cols) */}
          <div className="lg:col-span-7 sticky top-4 space-y-4">
            {activeSelectedFood ? (
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 space-y-5 text-xs">
                {/* Food Header Card */}
                <div className="flex flex-col sm:flex-row gap-4 pb-4 border-b border-slate-100">
                  <div className="relative w-full sm:w-44 h-32 rounded-xl overflow-hidden bg-slate-100 shrink-0 ring-1 ring-slate-200">
                    <img
                      src={activeSelectedFood.coverImg}
                      alt={activeSelectedFood.name}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-slate-900/80 backdrop-blur-xs text-white font-bold text-[10px]">
                      {activeSelectedFood.province}
                    </span>
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">
                          {activeSelectedFood.category}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleOpenEdit(activeSelectedFood)}
                            className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition cursor-pointer"
                            title="Chỉnh sửa thông tin món"
                          >
                            <Edit3 size={13} />
                          </button>
                          <button
                            onClick={() => handleToggleStatus(activeSelectedFood.id)}
                            className="p-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition cursor-pointer"
                            title="Bật/Tắt hiển thị"
                          >
                            {activeSelectedFood.status === "active" ? <EyeOff size={13} /> : <Eye size={13} />}
                          </button>
                        </div>
                      </div>
                      <h2 className="text-lg font-black text-slate-900 mt-1">
                        {activeSelectedFood.name}
                      </h2>
                      <p className="text-slate-600 line-clamp-3 leading-relaxed mt-1.5 text-xs">
                        {activeSelectedFood.desc}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 pt-2 text-[11px] font-medium text-slate-500">
                      <span>Khu vực: <strong className="text-slate-800">{activeSelectedFood.region}</strong></span>
                      <span>Mức giá: <strong className="text-emerald-700">{activeSelectedFood.avgPrice}</strong></span>
                      <span>Mùa ngon nhất: <strong className="text-slate-800">{activeSelectedFood.bestSeason || "Quanh năm"}</strong></span>
                    </div>
                  </div>
                </div>

                {/* Linked Eateries Section */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                        <MapPin className="text-blue-600" size={16} />
                        <span>Danh sách Quán ăn &amp; Địa điểm phục vụ</span>
                        <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-bold text-[10px] border border-blue-200">
                          {activeSelectedFood.placeIds?.length || 0} quán
                        </span>
                      </h3>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Người dùng khi xem món ăn này sẽ được gợi ý các quán ăn chuẩn vị dưới đây
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setAssigningFoodId(activeSelectedFood.id);
                        setIsAssignModalOpen(true);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition cursor-pointer"
                    >
                      <Plus size={13} />
                      <span>Gán thêm quán</span>
                    </button>
                  </div>

                  {/* List of linked places */}
                  {(() => {
                    const currentIds = activeSelectedFood.placeIds || [];
                    const linkedPlaces = allPlaces.filter((p) => currentIds.includes(p.id));

                    if (linkedPlaces.length === 0) {
                      return (
                        <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-2">
                          <Utensils size={24} className="mx-auto text-slate-300" />
                          <p className="text-xs text-slate-500 font-medium">
                            Chưa có quán ăn nào được liên kết với món <strong>{activeSelectedFood.name}</strong>.
                          </p>
                          <button
                            onClick={() => {
                              setAssigningFoodId(activeSelectedFood.id);
                              setIsAssignModalOpen(true);
                            }}
                            className="text-xs font-bold text-blue-600 hover:underline inline-flex items-center gap-1 cursor-pointer"
                          >
                            <Plus size={13} />
                            <span>Gán quán ăn tiêu biểu ngay</span>
                          </button>
                        </div>
                      );
                    }

                    return (
                      <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
                        {linkedPlaces.map((place) => (
                          <div
                            key={place.id}
                            className="p-3 rounded-xl border border-slate-200/80 bg-slate-50/60 hover:bg-white hover:border-blue-300 transition-all flex items-center justify-between gap-3 group"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <img
                                src={place.image}
                                alt={place.name}
                                className="w-12 h-12 rounded-lg object-cover ring-1 ring-slate-200 shrink-0"
                              />
                              <div className="min-w-0">
                                <h4 className="font-bold text-slate-900 text-xs truncate group-hover:text-blue-600 transition">
                                  {place.name}
                                </h4>
                                <p className="text-[11px] text-slate-400 truncate mt-0.5">
                                  {place.address}
                                </p>
                                <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-500 font-medium">
                                  <span className="flex items-center gap-0.5 text-amber-600 font-bold">
                                    <Star size={10} className="fill-amber-400 text-amber-400" />
                                    {place.rating}
                                  </span>
                                  <span>•</span>
                                  <span className="text-emerald-700 font-semibold">{place.price}</span>
                                  <span>•</span>
                                  <span>{place.category}</span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0">
                              <button
                                onClick={() => handleRemovePlaceFromFood(activeSelectedFood.id, place.id)}
                                className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 text-slate-600 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                                title="Gỡ quán khỏi món ăn"
                              >
                                <Trash2 size={12} />
                                <span className="hidden sm:inline">Gỡ</span>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </div>
              </div>
            ) : (
              <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-400 text-xs">
                Chọn một món ăn ở danh sách bên trái để quản lý chi tiết và danh sách quán ăn liên kết.
              </div>
            )}
          </div>
        </div>
      )}

      {/* 7. PLACE PICKER MODAL (Gán quán ăn cho món ăn) */}
      {isAssignModalOpen && assigningFood && (
        <div className="fixed inset-0 bg-slate-950/45 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl border border-slate-200 text-xs max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-base text-slate-900 tracking-tight flex items-center gap-2">
                  <MapPin size={17} className="text-blue-600" />
                  <span>Gán quán ăn cho món: "{assigningFood.name}"</span>
                </h3>
                <p className="text-slate-400 text-xs mt-0.5">
                  Chọn các quán ăn / nhà hàng phục vụ món đặc sản này chuẩn vị nhất
                </p>
              </div>
              <button
                onClick={() => setIsAssignModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Filter & Search inside Modal */}
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Tìm theo tên quán ăn, địa chỉ..."
                  value={placeModalSearch}
                  onChange={(e) => setPlaceModalSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs outline-none focus:bg-white focus:border-blue-500"
                />
              </div>

              <select
                value={placeModalCategoryFilter}
                onChange={(e) => setPlaceModalCategoryFilter(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 outline-none cursor-pointer"
              >
                <option value="all">Tất cả phân loại</option>
                <option value="Ẩm thực">Ẩm thực / Quán ăn</option>
                <option value="Cà phê & Check-in">Cà phê &amp; Check-in</option>
                <option value="Điểm tham quan">Điểm tham quan</option>
              </select>
            </div>

            {/* Places List for toggle selection */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1 min-h-[260px]">
              {allPlaces
                .filter((p) => {
                  if (placeModalCategoryFilter !== "all" && p.category !== placeModalCategoryFilter) return false;
                  if (placeModalSearch.trim()) {
                    const q = placeModalSearch.toLowerCase();
                    return p.name.toLowerCase().includes(q) || p.address.toLowerCase().includes(q);
                  }
                  return true;
                })
                .map((place) => {
                  const isLinked = (assigningFood.placeIds || []).includes(place.id);
                  return (
                    <div
                      key={place.id}
                      className={`p-3 rounded-xl border transition flex items-center justify-between gap-3 ${
                        isLinked
                          ? "bg-blue-50/60 border-blue-400 shadow-2xs"
                          : "bg-white border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={place.image}
                          alt={place.name}
                          className="w-12 h-12 rounded-lg object-cover ring-1 ring-slate-200 shrink-0"
                        />
                        <div className="min-w-0">
                          <h4 className="font-bold text-slate-900 text-xs truncate">{place.name}</h4>
                          <p className="text-[11px] text-slate-400 truncate mt-0.5">{place.address}</p>
                          <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-500 font-medium">
                            <span className="flex items-center gap-0.5 text-amber-600 font-bold">
                              <Star size={10} className="fill-amber-400 text-amber-400" />
                              {place.rating}
                            </span>
                            <span>•</span>
                            <span className="text-emerald-700 font-semibold">{place.price}</span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleTogglePlaceLink(assigningFood.id, place.id)}
                        className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition flex items-center gap-1 cursor-pointer shrink-0 ${
                          isLinked
                            ? "bg-blue-600 text-white shadow-xs hover:bg-rose-600 hover:text-white"
                            : "bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700"
                        }`}
                      >
                        {isLinked ? (
                          <>
                            <Check size={13} />
                            <span>Đã gán (Gỡ)</span>
                          </>
                        ) : (
                          <>
                            <Plus size={13} />
                            <span>Gán quán</span>
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-slate-100">
              <span className="text-xs text-slate-500 font-semibold">
                Hiện có <strong>{assigningFood.placeIds?.length || 0}</strong> quán ăn được liên kết
              </span>
              <button
                onClick={() => setIsAssignModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold cursor-pointer transition shadow-xs"
              >
                Xong
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 8. MODAL: ADD / EDIT FOOD */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200/80 text-xs max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-base text-slate-900 tracking-tight">
                  {editingFood ? "Chỉnh sửa món đặc sản" : "Thêm món đặc sản mới"}
                </h3>
                <p className="text-slate-400 text-xs mt-0.5">
                  Lưu trữ thông tin văn hóa ẩm thực vào từ điển hệ thống
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer transition"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3.5">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Tên món ăn *</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Bê Thui Cầu Mống"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-medium text-slate-800 placeholder:text-slate-400 focus:bg-white outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Tỉnh / Thành xuất xứ</label>
                  <input
                    type="text"
                    placeholder="Quảng Nam"
                    value={form.province}
                    onChange={(e) => setForm({ ...form, province: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-medium text-slate-800 focus:bg-white outline-none"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Thuộc Vùng miền</label>
                  <select
                    value={form.region}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        region: e.target.value as any,
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-medium text-slate-800 focus:bg-white outline-none cursor-pointer"
                  >
                    <option value="Miền Bắc">Miền Bắc</option>
                    <option value="Miền Trung">Miền Trung</option>
                    <option value="Miền Nam">Miền Nam</option>
                    <option value="Tây Nguyên">Tây Nguyên</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Phân loại món</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-medium text-slate-800 focus:bg-white outline-none cursor-pointer"
                  >
                    <option value="Món nước truyền thống">Món nước truyền thống</option>
                    <option value="Món cuốn đặc sản">Món cuốn đặc sản</option>
                    <option value="Món cơm đặc sản">Món cơm đặc sản</option>
                    <option value="Ẩm thực đường phố">Ẩm thực đường phố</option>
                    <option value="Bánh truyền thống">Bánh truyền thống</option>
                    <option value="Món lẩu & nướng">Món lẩu &amp; nướng</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Mức giá tham khảo</label>
                  <input
                    type="text"
                    placeholder="35.000đ – 75.000đ"
                    value={form.avgPrice}
                    onChange={(e) => setForm({ ...form, avgPrice: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-medium text-slate-800 focus:bg-white outline-none"
                  />
                </div>
              </div>

              <div>
                <ImageUploader
                  value={form.coverImg}
                  onChange={(url) => setForm({ ...form, coverImg: url })}
                  label="Ảnh minh họa món đặc sản *"
                  helperText="Tải ảnh từ máy hoặc dán link ảnh ẩm thực chất lượng cao"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Mô tả nét đặc trưng &amp; Hương vị *</label>
                <textarea
                  rows={3}
                  placeholder="Mô tả nguyên liệu, cách nêm nếm, rau ăn kèm và trải nghiệm chuẩn vị..."
                  value={form.desc}
                  onChange={(e) => setForm({ ...form, desc: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-medium text-slate-800 focus:bg-white outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <label className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isPopular}
                    onChange={(e) => setForm({ ...form, isPopular: e.target.checked })}
                    className="rounded text-amber-600"
                  />
                  <span className="font-semibold text-slate-800">Đặt Món ăn tiêu biểu</span>
                </label>

                <label className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.status === "active"}
                    onChange={(e) =>
                      setForm({ ...form, status: e.target.checked ? "active" : "hidden" })
                    }
                    className="rounded text-emerald-600"
                  />
                  <span className="font-semibold text-slate-800">Kích hoạt hiển thị</span>
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium cursor-pointer transition"
              >
                Hủy
              </button>
              <button
                onClick={handleSaveForm}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium cursor-pointer transition shadow-xs flex items-center gap-1.5"
              >
                <Check size={14} />
                <span>{editingFood ? "Lưu thay đổi" : "Tạo món ăn"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 9. DRAWER: FOOD DETAILS & LINKED PLACES */}
      {drawerFood && (
        <div
          className="fixed inset-0 bg-slate-950/35 backdrop-blur-xs flex justify-end z-50 animate-in fade-in duration-150"
          onClick={() => setDrawerFood(null)}
        >
          <div
            className="w-full max-w-lg bg-white h-full shadow-2xl p-6 overflow-y-auto space-y-5 text-xs animate-in slide-in-from-right duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Utensils size={16} className="text-amber-600" />
                <h3 className="font-bold text-base text-slate-900 tracking-tight">
                  Chi tiết Món ăn đặc sản
                </h3>
              </div>
              <button
                onClick={() => setDrawerFood(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X size={16} />
              </button>
            </div>

            <div className="relative h-48 rounded-xl overflow-hidden ring-1 ring-slate-200">
              <img
                src={drawerFood.coverImg}
                alt={drawerFood.name}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-md bg-slate-900/80 backdrop-blur-xs text-white font-bold text-[10px]">
                {drawerFood.province}
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-black text-slate-900">{drawerFood.name}</h2>
                <span
                  className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                    drawerFood.status === "active"
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {drawerFood.status === "active" ? "Đang hiển thị" : "Đang ẩn"}
                </span>
              </div>
              <p className="text-slate-600 leading-relaxed pt-1">{drawerFood.desc}</p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2.5">
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500 font-medium">Xuất xứ địa phương:</span>
                <span className="font-bold text-slate-800">
                  {drawerFood.province} ({drawerFood.region})
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500 font-medium">Nhóm ẩm thực:</span>
                <span className="font-bold text-amber-700">{drawerFood.category}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500 font-medium">Mức giá phổ biến:</span>
                <span className="font-bold text-emerald-700">{drawerFood.avgPrice}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500 font-medium">Mùa thưởng thức lý tưởng:</span>
                <span className="font-bold text-slate-900">
                  {drawerFood.bestSeason || "Quanh năm"}
                </span>
              </div>
            </div>

            {/* Linked Eateries in Drawer */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                  <MapPin size={14} className="text-blue-600" />
                  <span>Quán ăn tiêu biểu ({drawerFood.placeIds?.length || 0})</span>
                </h4>
                <button
                  onClick={() => {
                    setAssigningFoodId(drawerFood.id);
                    setIsAssignModalOpen(true);
                  }}
                  className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Plus size={12} />
                  <span>Gán thêm</span>
                </button>
              </div>

              {(() => {
                const linked = allPlaces.filter((p) => (drawerFood.placeIds || []).includes(p.id));
                if (linked.length === 0) {
                  return (
                    <div className="p-4 text-center bg-slate-50 rounded-xl text-slate-400 text-xs">
                      Chưa gán quán ăn nào.
                    </div>
                  );
                }
                return (
                  <div className="space-y-2">
                    {linked.map((p) => (
                      <div
                        key={p.id}
                        className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between gap-2"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <img src={p.image} alt={p.name} className="w-10 h-10 rounded-lg object-cover" />
                          <div className="min-w-0">
                            <div className="font-bold text-slate-900 truncate">{p.name}</div>
                            <div className="text-[10px] text-slate-500 truncate">{p.address}</div>
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemovePlaceFromFood(drawerFood.id, p.id)}
                          className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer"
                          title="Gỡ quán"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>

            <div className="flex gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => {
                  handleOpenEdit(drawerFood);
                  setDrawerFood(null);
                }}
                className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Edit3 size={14} />
                <span>Chỉnh sửa</span>
              </button>
              <button
                onClick={() => {
                  handleToggleStatus(drawerFood.id);
                  setDrawerFood(null);
                }}
                className="px-4 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold transition cursor-pointer"
              >
                {drawerFood.status === "active" ? "Tạm ẩn" : "Kích hoạt"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

