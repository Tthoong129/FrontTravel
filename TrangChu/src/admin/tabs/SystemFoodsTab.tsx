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
  Sparkles,
  Download,
  Filter,
  DollarSign,
  Calendar,
  Flame,
} from "lucide-react";
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
    desc: "Sợi mì vàng óng dai mềm hòa quyện nước dùng đậm đà từ xương, tôm, thịt hoặc ếch, ăn kèm bánh tráng nướng giòn rụm và rau sống trà quế.",
    coverImg: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=400&fit=crop",
    famousPlacesCount: 86,
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
    famousPlacesCount: 54,
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
    famousPlacesCount: 120,
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
    famousPlacesCount: 110,
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
    famousPlacesCount: 48,
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
    famousPlacesCount: 75,
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
    famousPlacesCount: 68,
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
    famousPlacesCount: 32,
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
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  // Filter & Search
  const [searchText, setSearchText] = useState("");
  const [regionFilter, setRegionFilter] = useState("all");
  const [provinceFilter, setProvinceFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Selection & Modal
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFood, setEditingFood] = useState<FoodItem | null>(null);

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
      if (selectedFood?.id === id) setSelectedFood(null);
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
        famousPlacesCount: 1,
        avgPrice: form.avgPrice,
        bestSeason: form.bestSeason,
        isPopular: form.isPopular,
        status: form.status,
        updatedAt: "Vừa xong",
      };
      setFoods([newFoodItem, ...foods]);
      onNotify(`Đã thêm mới món đặc sản "${newFoodItem.name}".`);
    }

    setIsModalOpen(false);
  };

  const handleExportCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "ID,Tên Món Ăn,Tỉnh Thành,Vùng Miền,Danh Mục,Số Quán Tiêu Biểu,Mức Giá,Trạng Thái\n" +
      foods
        .map(
          (f) =>
            `${f.id},"${f.name}","${f.province}","${f.region}","${f.category}",${f.famousPlacesCount},"${f.avgPrice}",${
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
  const totalLinkedPlaces = foods.reduce((acc, f) => acc + f.famousPlacesCount, 0);

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* 1. Header & Actions */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Utensils size={18} />
            </div>
            <div>
              <h1 className="text-base font-black text-slate-900 tracking-tight">
                Từ điển món ăn &amp; Đặc sản toàn quốc
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Kho dữ liệu văn hóa ẩm thực và các quán ăn phục vụ đặc sản truyền thống 63 tỉnh thành
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === "grid" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500"
              }`}
              title="Dạng lưới thẻ"
            >
              <LayoutGrid size={15} />
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === "table" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500"
              }`}
              title="Dạng bảng"
            >
              <List size={15} />
            </button>
          </div>

          <button
            onClick={handleExportCSV}
            className="px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Xuất CSV"
          >
            <Download size={14} />
            <span className="hidden sm:inline">Xuất CSV</span>
          </button>

          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer shrink-0"
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
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50/70 text-xs font-medium focus:bg-white focus:border-slate-400 outline-none transition-all"
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

      {/* 4. GRID VIEW */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredFoods.length === 0 ? (
            <div className="col-span-full py-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-200 text-xs">
              Không tìm thấy món ăn nào phù hợp với bộ lọc.
            </div>
          ) : (
            filteredFoods.map((f) => {
              const isActive = f.status === "active";
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
                        <span className="flex items-center gap-1 text-slate-700 font-bold">
                          <MapPin size={12} className="text-blue-500" />
                          {f.famousPlacesCount} quán phục vụ
                        </span>
                        <span className="text-emerald-700 font-bold">{f.avgPrice}</span>
                      </div>

                      <div className="flex items-center gap-1 pt-1">
                        <button
                          onClick={() => setSelectedFood(f)}
                          className="flex-1 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-900 hover:text-white font-bold text-slate-700 text-xs transition cursor-pointer"
                        >
                          Chi tiết
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

      {/* 4. TABLE VIEW */}
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
                              onClick={() => setSelectedFood(f)}
                              className="font-bold text-slate-900 hover:text-amber-600 transition text-left cursor-pointer"
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

                      <td className="py-3.5 px-3 font-bold text-blue-600 whitespace-nowrap">
                        {f.famousPlacesCount} địa chỉ
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
                            onClick={() => setSelectedFood(f)}
                            className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-900 hover:text-white text-slate-700 font-bold text-xs transition cursor-pointer"
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

      {/* 5. Modal: ADD / EDIT FOOD */}
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
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-medium text-slate-800 placeholder:text-slate-400 focus:bg-white outline-none focus:border-slate-300"
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
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium cursor-pointer transition shadow-xs flex items-center gap-1.5"
              >
                <Check size={14} />
                <span>{editingFood ? "Lưu thay đổi" : "Tạo món ăn"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. Drawer: FOOD DETAILS */}
      {selectedFood && (
        <div
          className="fixed inset-0 bg-slate-950/30 backdrop-blur-xs flex justify-end z-50 animate-in fade-in duration-150"
          onClick={() => setSelectedFood(null)}
        >
          <div
            className="w-full max-w-md bg-white h-full shadow-2xl p-6 overflow-y-auto space-y-5 text-xs animate-in slide-in-from-right duration-200"
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
                onClick={() => setSelectedFood(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X size={16} />
              </button>
            </div>

            <div className="relative h-48 rounded-xl overflow-hidden ring-1 ring-slate-200">
              <img
                src={selectedFood.coverImg}
                alt={selectedFood.name}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-md bg-slate-900/80 backdrop-blur-xs text-white font-bold text-[10px]">
                {selectedFood.province}
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-black text-slate-900">{selectedFood.name}</h2>
                <span
                  className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                    selectedFood.status === "active"
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {selectedFood.status === "active" ? "Đang hiển thị" : "Đang ẩn"}
                </span>
              </div>
              <p className="text-slate-500 leading-relaxed pt-1">{selectedFood.desc}</p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2.5">
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500 font-medium">Xuất xứ địa phương:</span>
                <span className="font-bold text-slate-800">
                  {selectedFood.province} ({selectedFood.region})
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500 font-medium">Nhóm ẩm thực:</span>
                <span className="font-bold text-amber-700">{selectedFood.category}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500 font-medium">Mức giá phổ biến:</span>
                <span className="font-bold text-emerald-700">{selectedFood.avgPrice}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500 font-medium">Mùa thưởng thức lý tưởng:</span>
                <span className="font-bold text-slate-900">
                  {selectedFood.bestSeason || "Quanh năm"}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500 font-medium">Số quán ăn tiêu biểu liên kết:</span>
                <span className="font-bold text-blue-600">
                  {selectedFood.famousPlacesCount} quán
                </span>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  handleOpenEdit(selectedFood);
                  setSelectedFood(null);
                }}
                className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Edit3 size={14} />
                <span>Chỉnh sửa</span>
              </button>
              <button
                onClick={() => {
                  handleToggleStatus(selectedFood.id);
                  setSelectedFood((prev) =>
                    prev
                      ? {
                          ...prev,
                          status: prev.status === "active" ? "hidden" : "active",
                        }
                      : null
                  );
                }}
                className="px-4 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold transition cursor-pointer"
              >
                {selectedFood.status === "active" ? "Tạm ẩn" : "Kích hoạt"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
