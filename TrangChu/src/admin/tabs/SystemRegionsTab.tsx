import React, { useState, useMemo } from "react";
import {
  Globe2,
  MapPin,
  Search,
  Plus,
  Filter,
  Eye,
  EyeOff,
  Edit3,
  Trash2,
  Check,
  X,
  Star,
  Download,
  Layers,
  ChevronRight,
  Compass,
  CheckCircle2,
  AlertCircle,
  Building2,
  Utensils,
  ArrowUpDown,
} from "lucide-react";
import ImageUploader from "../components/ImageUploader";

export interface ProvinceItem {
  id: string;
  name: string;
  region: "Miền Bắc" | "Miền Trung" | "Miền Nam" | "Tây Nguyên";
  code: string;
  placesCount: number;
  foodsCount: number;
  completeness: number; // percentage
  isFeatured: boolean;
  status: "active" | "hidden";
  description?: string;
  coverImg?: string;
}

export interface RegionItem {
  id: string;
  name: string;
  code: string;
  provincesCount: number;
  placesCount: number;
  isFeatured: boolean;
  status: "active" | "hidden";
  description: string;
}

const initialRegions: RegionItem[] = [
  {
    id: "mb",
    name: "Miền Bắc",
    code: "NORTH",
    provincesCount: 25,
    placesCount: 486,
    isFeatured: true,
    status: "active",
    description: "Khu vực đậm đà văn hóa ngàn năm văn hiến, cảnh sắc hùng vĩ Tây Bắc và Đông Bắc.",
  },
  {
    id: "mt",
    name: "Miền Trung",
    code: "CENTRAL",
    provincesCount: 14,
    placesCount: 672,
    isFeatured: true,
    status: "active",
    description: "Dải đất duyên hải di sản miền Trung với Đà Nẵng, Hội An, Cố đô Huế và bãi biển tuyệt đẹp.",
  },
  {
    id: "mn",
    name: "Miền Nam",
    code: "SOUTH",
    provincesCount: 19,
    placesCount: 684,
    isFeatured: true,
    status: "active",
    description: "Vùng đất trù phú Nam Bộ, trung tâm kinh tế sôi động TP.HCM và sông nước miền Tây.",
  },
  {
    id: "tn",
    name: "Tây Nguyên",
    code: "HIGHLANDS",
    provincesCount: 5,
    placesCount: 185,
    isFeatured: false,
    status: "active",
    description: "Đại ngàn Tây Nguyên với không gian văn hóa cồng chiêng, Đà Lạt sương mờ và đồi chè đại ngàn.",
  },
];

const initialProvinces: ProvinceItem[] = [
  {
    id: "p-danang",
    name: "Đà Nẵng",
    region: "Miền Trung",
    code: "DAD",
    placesCount: 142,
    foodsCount: 28,
    completeness: 94,
    isFeatured: true,
    status: "active",
    description: "Thành phố đáng sống với biển Mỹ Khê, Bà Nà Hills và ẩm thực phong phú.",
    coverImg: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=600&h=400&fit=crop",
  },
  {
    id: "p-quangnam",
    name: "Quảng Nam",
    region: "Miền Trung",
    code: "QNA",
    placesCount: 88,
    foodsCount: 22,
    completeness: 88,
    isFeatured: true,
    status: "active",
    description: "Vùng đất di sản với Phố cổ Hội An, Thánh địa Mỹ Sơn và đặc sản Mì Quảng.",
    coverImg: "https://images.unsplash.com/photo-1691927644490-e1a24b366a5e?w=600&h=400&fit=crop",
  },
  {
    id: "p-hue",
    name: "Thừa Thiên Huế",
    region: "Miền Trung",
    code: "HUE",
    placesCount: 76,
    foodsCount: 35,
    completeness: 85,
    isFeatured: true,
    status: "active",
    description: "Cố đô thơ mộng bên dòng sông Hương với Quần thể di tích Cố đô và ẩm thực cung đình.",
    coverImg: "https://images.unsplash.com/photo-1569271532956-3fb81a207115?w=600&h=400&fit=crop",
  },
  {
    id: "p-hanoi",
    name: "Hà Nội",
    region: "Miền Bắc",
    code: "HAN",
    placesCount: 210,
    foodsCount: 45,
    completeness: 96,
    isFeatured: true,
    status: "active",
    description: "Thủ đô nghìn năm văn hiến với 36 phố phường, Hồ Gươm và ẩm thực tinh tế.",
    coverImg: "https://images.unsplash.com/photo-1509072619873-adb3dc289b50?w=600&h=400&fit=crop",
  },
  {
    id: "p-hcm",
    name: "TP. Hồ Chí Minh",
    region: "Miền Nam",
    code: "SGN",
    placesCount: 260,
    foodsCount: 50,
    completeness: 98,
    isFeatured: true,
    status: "active",
    description: "Đô thị năng động nhất cả nước với nhịp sống đêm sôi động và ẩm thực đa dạng.",
    coverImg: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=600&h=400&fit=crop",
  },
  {
    id: "p-lamdong",
    name: "Lâm Đồng",
    region: "Tây Nguyên",
    code: "LDG",
    placesCount: 95,
    foodsCount: 18,
    completeness: 82,
    isFeatured: true,
    status: "active",
    description: "Thành phố ngàn hoa Đà Lạt, khí hậu mát mẻ quanh năm và thiên đường nghỉ dưỡng.",
    coverImg: "https://images.unsplash.com/photo-1733372607228-6aeaa92c5e62?w=600&h=400&fit=crop",
  },
  {
    id: "p-khanhhoa",
    name: "Khánh Hòa",
    region: "Miền Trung",
    code: "KHA",
    placesCount: 84,
    foodsCount: 19,
    completeness: 79,
    isFeatured: false,
    status: "active",
    description: "Thành phố biển Nha Trang xinh đẹp với vịnh biển trong xanh và hải sản tươi sống.",
    coverImg: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&h=400&fit=crop",
  },
  {
    id: "p-laocai",
    name: "Lào Cai",
    region: "Miền Bắc",
    code: "LCI",
    placesCount: 65,
    foodsCount: 14,
    completeness: 75,
    isFeatured: true,
    status: "active",
    description: "Thị trấn Sa Pa mờ sương, đỉnh Fansipan hùng vĩ và ruộng bậc thang kỳ vĩ.",
    coverImg: "https://images.unsplash.com/photo-1606801954050-be6b29588460?w=600&h=400&fit=crop",
  },
  {
    id: "p-ninhbinh",
    name: "Ninh Bình",
    region: "Miền Bắc",
    code: "NBI",
    placesCount: 52,
    foodsCount: 12,
    completeness: 78,
    isFeatured: false,
    status: "active",
    description: "Quần thể danh thắng Tràng An di sản thế giới, Tam Cốc Bích Động và Cố đô Hoa Lư.",
    coverImg: "https://images.unsplash.com/photo-1528127269322-539801943592?w=600&h=400&fit=crop",
  },
  {
    id: "p-kiengiang",
    name: "Kiên Giang",
    region: "Miền Nam",
    code: "KGI",
    placesCount: 72,
    foodsCount: 16,
    completeness: 81,
    isFeatured: false,
    status: "active",
    description: "Đảo ngọc Phú Quốc với bãi biển cát trắng mịn màng và hệ sinh thái biển phong phú.",
    coverImg: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=600&h=400&fit=crop",
  },
];

interface SystemRegionsTabProps {
  onNotify: (msg: string) => void;
}

export default function SystemRegionsTab({ onNotify }: SystemRegionsTabProps) {
  const [subTab, setSubTab] = useState<"provinces" | "regions">("provinces");
  const [regionsList, setRegionsList] = useState<RegionItem[]>(initialRegions);
  const [provincesList, setProvincesList] = useState<ProvinceItem[]>(initialProvinces);

  // Filters & Search
  const [searchText, setSearchText] = useState("");
  const [regionFilter, setRegionFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [featuredFilter, setFeaturedFilter] = useState("all");

  // Selected item for drawer
  const [selectedProvince, setSelectedProvince] = useState<ProvinceItem | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<RegionItem | null>(null);

  // Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProvince, setEditingProvince] = useState<ProvinceItem | null>(null);

  // Form State
  const [provinceForm, setProvinceForm] = useState({
    name: "",
    region: "Miền Trung" as "Miền Bắc" | "Miền Trung" | "Miền Nam" | "Tây Nguyên",
    code: "",
    description: "",
    isFeatured: true,
    status: "active" as "active" | "hidden",
    coverImg: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=600&h=400&fit=crop",
  });

  // Filtered Provinces
  const filteredProvinces = useMemo(() => {
    return provincesList.filter((p) => {
      if (regionFilter !== "all" && p.region !== regionFilter) return false;
      if (statusFilter !== "all" && p.status !== statusFilter) return false;
      if (featuredFilter === "featured" && !p.isFeatured) return false;
      if (featuredFilter === "normal" && p.isFeatured) return false;
      if (searchText.trim()) {
        const q = searchText.toLowerCase();
        const matchName = p.name.toLowerCase().includes(q);
        const matchCode = p.code.toLowerCase().includes(q);
        const matchReg = p.region.toLowerCase().includes(q);
        if (!matchName && !matchCode && !matchReg) return false;
      }
      return true;
    });
  }, [provincesList, regionFilter, statusFilter, featuredFilter, searchText]);

  // Filtered Regions
  const filteredRegions = useMemo(() => {
    return regionsList.filter((r) => {
      if (statusFilter !== "all" && r.status !== statusFilter) return false;
      if (searchText.trim()) {
        const q = searchText.toLowerCase();
        const matchName = r.name.toLowerCase().includes(q);
        const matchCode = r.code.toLowerCase().includes(q);
        if (!matchName && !matchCode) return false;
      }
      return true;
    });
  }, [regionsList, statusFilter, searchText]);

  // Handlers
  const handleToggleFeatured = (id: string) => {
    setProvincesList((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const nextVal = !p.isFeatured;
          onNotify(`Đã ${nextVal ? "đặt nổi bật" : "bỏ nổi bật"} cho ${p.name}.`);
          return { ...p, isFeatured: nextVal };
        }
        return p;
      })
    );
  };

  const handleToggleStatus = (id: string) => {
    setProvincesList((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const nextStatus = p.status === "active" ? "hidden" : "active";
          onNotify(`Đã ${nextStatus === "active" ? "kích hoạt hiển thị" : "tạm ẩn"} ${p.name}.`);
          return { ...p, status: nextStatus };
        }
        return p;
      })
    );
  };

  const handleDeleteProvince = (id: string, name: string) => {
    if (confirm(`Bạn có chắc muốn xóa dữ liệu tỉnh/thành "${name}"?`)) {
      setProvincesList((prev) => prev.filter((p) => p.id !== id));
      if (selectedProvince?.id === id) setSelectedProvince(null);
      onNotify(`Đã xóa tỉnh/thành "${name}".`);
    }
  };

  const handleOpenEdit = (p: ProvinceItem) => {
    setEditingProvince(p);
    setProvinceForm({
      name: p.name,
      region: p.region,
      code: p.code,
      description: p.description || "",
      isFeatured: p.isFeatured,
      status: p.status,
      coverImg: p.coverImg || "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=600&h=400&fit=crop",
    });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = () => {
    if (!editingProvince || !provinceForm.name) return;
    setProvincesList((prev) =>
      prev.map((p) =>
        p.id === editingProvince.id
          ? {
              ...p,
              name: provinceForm.name,
              region: provinceForm.region,
              code: provinceForm.code,
              description: provinceForm.description,
              isFeatured: provinceForm.isFeatured,
              status: provinceForm.status,
              coverImg: provinceForm.coverImg,
            }
          : p
      )
    );
    setIsEditModalOpen(false);
    setEditingProvince(null);
    onNotify(`Đã cập nhật thông tin tỉnh/thành "${provinceForm.name}".`);
  };

  const handleCreateProvince = () => {
    if (!provinceForm.name) {
      onNotify("Vui lòng nhập tên tỉnh/thành.");
      return;
    }
    const newProv: ProvinceItem = {
      id: `p-${Date.now()}`,
      name: provinceForm.name,
      region: provinceForm.region,
      code: provinceForm.code || provinceForm.name.slice(0, 3).toUpperCase(),
      placesCount: 0,
      foodsCount: 0,
      completeness: 30,
      isFeatured: provinceForm.isFeatured,
      status: provinceForm.status,
      description: provinceForm.description,
      coverImg: provinceForm.coverImg,
    };
    setProvincesList([newProv, ...provincesList]);
    setIsAddModalOpen(false);
    setProvinceForm({
      name: "",
      region: "Miền Trung",
      code: "",
      description: "",
      isFeatured: true,
      status: "active",
      coverImg: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=600&h=400&fit=crop",
    });
    onNotify(`Đã thêm mới tỉnh/thành "${newProv.name}".`);
  };

  const handleExportCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "ID,Tên Tỉnh/Thành,Mã Vùng,Thuộc Miền,Số Địa Điểm,Số Món Ăn,Độ Hoàn Thiện,Nổi Bật,Trạng Thái\n" +
      provincesList
        .map(
          (p) =>
            `${p.id},"${p.name}",${p.code},"${p.region}",${p.placesCount},${p.foodsCount},${p.completeness}%,${
              p.isFeatured ? "Có" : "Không"
            },${p.status === "active" ? "Đang hiển thị" : "Đang ẩn"}`
        )
        .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `danh_sach_tinh_thanh_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onNotify("Đã xuất danh sách tỉnh thành dạng CSV thành công!");
  };

  // Quick stats
  const totalProvinces = provincesList.length;
  const activeProvinces = provincesList.filter((p) => p.status === "active").length;
  const featuredProvinces = provincesList.filter((p) => p.isFeatured).length;
  const totalPlaces = provincesList.reduce((acc, p) => acc + p.placesCount, 0);

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* 1. Header & Tabs Switcher */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Globe2 size={18} />
            </div>
            <div>
              <h1 className="text-base font-black text-slate-900 tracking-tight">
                Vùng miền &amp; Tỉnh thành số hóa
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Quản lý phân cấp địa lý, kích hoạt địa bàn và mức độ số hóa dữ liệu du lịch toàn quốc
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-bold">
            <button
              onClick={() => setSubTab("provinces")}
              className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                subTab === "provinces"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Tỉnh / Thành ({totalProvinces})
            </button>
            <button
              onClick={() => setSubTab("regions")}
              className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                subTab === "regions"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Vùng miền ({regionsList.length})
            </button>
          </div>

          <button
            onClick={handleExportCSV}
            className="px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Xuất tệp CSV"
          >
            <Download size={14} />
            <span className="hidden sm:inline">Xuất CSV</span>
          </button>

          <button
            onClick={() => {
              setProvinceForm({
                name: "",
                region: "Miền Trung",
                code: "",
                description: "",
                isFeatured: true,
                status: "active",
                coverImg: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=600&h=400&fit=crop",
              });
              setIsAddModalOpen(true);
            }}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <Plus size={14} />
            <span>Thêm tỉnh / thành</span>
          </button>
        </div>
      </div>

      {/* 2. Stats Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Tổng Tỉnh / Thành
          </div>
          <div className="text-xl font-black text-slate-900 mt-1">{totalProvinces}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Phân bổ trên 4 miền</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">
            Đang hoạt động
          </div>
          <div className="text-xl font-black text-emerald-700 mt-1">{activeProvinces}</div>
          <div className="text-[10px] text-emerald-600 mt-0.5">Hiển thị trên bản đồ</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">
            Nổi bật trang chủ
          </div>
          <div className="text-xl font-black text-amber-700 mt-1">{featuredProvinces}</div>
          <div className="text-[10px] text-amber-600 mt-0.5">Xuất hiện mục Khám phá</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">
            Địa điểm đã số hóa
          </div>
          <div className="text-xl font-black text-blue-700 mt-1">{totalPlaces}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Trên toàn quốc</div>
        </div>
      </div>

      {/* 3. Filters & Search Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[240px]">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder={
                subTab === "provinces"
                  ? "Tìm theo tên tỉnh thành, mã viết tắt, vùng miền..."
                  : "Tìm theo tên vùng miền..."
              }
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50/70 text-xs font-medium focus:bg-white focus:border-slate-400 outline-none transition-all"
            />
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {subTab === "provinces" && (
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
            )}

            <select
              value={featuredFilter}
              onChange={(e) => setFeaturedFilter(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white font-semibold text-slate-700 cursor-pointer outline-none hover:border-slate-300"
            >
              <option value="all">Tất cả mục</option>
              <option value="featured">★ Nổi bật trang chủ</option>
              <option value="normal">Mục thông thường</option>
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

      {/* 4. Table View: PROVINCES */}
      {subTab === "provinces" && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 text-slate-400 font-bold border-b border-slate-100 text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Tỉnh / Thành</th>
                  <th className="py-3.5 px-3">Thuộc miền</th>
                  <th className="py-3.5 px-3">Mã Code</th>
                  <th className="py-3.5 px-3">Số địa điểm</th>
                  <th className="py-3.5 px-3">Món đặc sản</th>
                  <th className="py-3.5 px-3">Độ hoàn thiện</th>
                  <th className="py-3.5 px-3 text-center">Nổi bật</th>
                  <th className="py-3.5 px-3">Trạng thái</th>
                  <th className="py-3.5 px-4 text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProvinces.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-slate-400">
                      Không tìm thấy tỉnh thành nào phù hợp với bộ lọc.
                    </td>
                  </tr>
                ) : (
                  filteredProvinces.map((p) => {
                    const isActive = p.status === "active";
                    return (
                      <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-slate-900">
                          <div className="flex items-center gap-3">
                            {p.coverImg ? (
                              <img
                                src={p.coverImg}
                                alt={p.name}
                                className="w-9 h-9 rounded-xl object-cover ring-1 ring-slate-200 shrink-0"
                              />
                            ) : (
                              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 font-black flex items-center justify-center text-xs">
                                {p.name.slice(0, 2).toUpperCase()}
                              </div>
                            )}
                            <div>
                              <button
                                onClick={() => setSelectedProvince(p)}
                                className="font-bold text-slate-900 hover:text-blue-600 transition text-left cursor-pointer"
                              >
                                {p.name}
                              </button>
                              <span className="text-[10px] text-slate-400 block mt-0.5">
                                ID: {p.id}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-3 font-semibold text-slate-700 whitespace-nowrap">
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px]">
                            {p.region}
                          </span>
                        </td>

                        <td className="py-3.5 px-3 font-mono font-bold text-slate-600 whitespace-nowrap">
                          {p.code}
                        </td>

                        <td className="py-3.5 px-3 font-bold text-slate-900 whitespace-nowrap">
                          {p.placesCount} địa điểm
                        </td>

                        <td className="py-3.5 px-3 font-medium text-slate-700 whitespace-nowrap">
                          {p.foodsCount} món
                        </td>

                        <td className="py-3.5 px-3 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-800 text-[11px]">
                              {p.completeness}%
                            </span>
                            <div className="w-14 h-2 rounded-full bg-slate-100 overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  p.completeness >= 85
                                    ? "bg-emerald-500"
                                    : p.completeness >= 70
                                    ? "bg-blue-500"
                                    : "bg-amber-500"
                                }`}
                                style={{ width: `${p.completeness}%` }}
                              />
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-3 text-center whitespace-nowrap">
                          <button
                            onClick={() => handleToggleFeatured(p.id)}
                            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                              p.isFeatured
                                ? "text-amber-500 hover:bg-amber-50"
                                : "text-slate-300 hover:text-slate-500 hover:bg-slate-100"
                            }`}
                            title={p.isFeatured ? "Bỏ nổi bật" : "Đặt nổi bật"}
                          >
                            <Star size={15} fill={p.isFeatured ? "currentColor" : "none"} />
                          </button>
                        </td>

                        <td className="py-3.5 px-3 whitespace-nowrap">
                          <span
                            className={`px-2.5 py-1 rounded-full font-bold text-[10px] border ${
                              isActive
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : "bg-slate-100 text-slate-600 border-slate-200"
                            }`}
                          >
                            {isActive ? "Đang hiển thị" : "Đang tạm ẩn"}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => setSelectedProvince(p)}
                              className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-900 hover:text-white text-slate-700 font-bold text-xs transition cursor-pointer"
                              title="Xem chi tiết"
                            >
                              Chi tiết
                            </button>

                            <button
                              onClick={() => handleOpenEdit(p)}
                              className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition cursor-pointer"
                              title="Chỉnh sửa"
                            >
                              <Edit3 size={13} />
                            </button>

                            <button
                              onClick={() => handleToggleStatus(p.id)}
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
                              onClick={() => handleDeleteProvince(p.id, p.name)}
                              className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white transition cursor-pointer"
                              title="Xóa tỉnh thành"
                            >
                              <Trash2 size={13} />
                            </button>
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
      )}

      {/* 4. Table View: REGIONS */}
      {subTab === "regions" && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 text-slate-400 font-bold border-b border-slate-100 text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Tên Vùng miền</th>
                  <th className="py-3.5 px-3">Mã Vùng</th>
                  <th className="py-3.5 px-3">Số Tỉnh / Thành</th>
                  <th className="py-3.5 px-3">Số địa điểm</th>
                  <th className="py-3.5 px-3">Mô tả đặc trưng</th>
                  <th className="py-3.5 px-3 text-center">Nổi bật</th>
                  <th className="py-3.5 px-3">Trạng thái</th>
                  <th className="py-3.5 px-4 text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRegions.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900 flex items-center gap-2">
                      <Compass size={16} className="text-blue-600" />
                      <span>{r.name}</span>
                    </td>
                    <td className="py-3.5 px-3 font-mono font-bold text-slate-600">{r.code}</td>
                    <td className="py-3.5 px-3 font-bold text-slate-800">
                      {r.provincesCount} tỉnh thành
                    </td>
                    <td className="py-3.5 px-3 font-bold text-emerald-700">
                      {r.placesCount} địa điểm
                    </td>
                    <td className="py-3.5 px-3 text-slate-500 max-w-xs truncate">{r.description}</td>
                    <td className="py-3.5 px-3 text-center">
                      <Star
                        size={15}
                        className={r.isFeatured ? "text-amber-500 fill-amber-500" : "text-slate-300"}
                      />
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="px-2.5 py-1 rounded-full font-bold text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Đang hiển thị
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => setSelectedRegion(r)}
                        className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-900 hover:text-white font-bold text-slate-700 text-xs transition cursor-pointer"
                      >
                        Chi tiết
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. Modal: ADD / EDIT PROVINCE */}
      {(isAddModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200/80 text-xs max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-base text-slate-900 tracking-tight">
                  {isEditModalOpen ? "Chỉnh sửa tỉnh / thành" : "Thêm tỉnh / thành mới"}
                </h3>
                <p className="text-slate-400 text-xs mt-0.5">
                  Thiết lập thông tin phân cấp hành chính và dữ liệu du lịch
                </p>
              </div>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setIsEditModalOpen(false);
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer transition"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3.5">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Tên Tỉnh / Thành phố *
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Ninh Thuận"
                  value={provinceForm.name}
                  onChange={(e) => setProvinceForm({ ...provinceForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-medium text-slate-800 placeholder:text-slate-400 focus:bg-white outline-none focus:border-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Thuộc Vùng miền</label>
                  <select
                    value={provinceForm.region}
                    onChange={(e) =>
                      setProvinceForm({
                        ...provinceForm,
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

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Mã định danh (Code)</label>
                  <input
                    type="text"
                    placeholder="VD: NTH"
                    value={provinceForm.code}
                    onChange={(e) => setProvinceForm({ ...provinceForm, code: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-medium text-slate-800 focus:bg-white outline-none"
                  />
                </div>
              </div>

              <div>
                <ImageUploader
                  value={provinceForm.coverImg}
                  onChange={(url) => setProvinceForm({ ...provinceForm, coverImg: url })}
                  label="Ảnh bìa cảnh quan Tỉnh / Thành"
                  helperText="Tải tệp từ máy hoặc dán link ảnh phong cảnh"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Mô tả đặc trưng du lịch</label>
                <textarea
                  rows={3}
                  placeholder="Nhập nét nổi bật về cảnh sắc, văn hóa, ẩm thực của địa phương..."
                  value={provinceForm.description}
                  onChange={(e) => setProvinceForm({ ...provinceForm, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-medium text-slate-800 focus:bg-white outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <label className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={provinceForm.isFeatured}
                    onChange={(e) =>
                      setProvinceForm({ ...provinceForm, isFeatured: e.target.checked })
                    }
                    className="rounded text-blue-600"
                  />
                  <span className="font-semibold text-slate-800">Đặt Nổi bật trang chủ</span>
                </label>

                <label className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={provinceForm.status === "active"}
                    onChange={(e) =>
                      setProvinceForm({
                        ...provinceForm,
                        status: e.target.checked ? "active" : "hidden",
                      })
                    }
                    className="rounded text-emerald-600"
                  />
                  <span className="font-semibold text-slate-800">Kích hoạt hiển thị</span>
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setIsEditModalOpen(false);
                }}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium cursor-pointer transition"
              >
                Hủy
              </button>
              <button
                onClick={isEditModalOpen ? handleSaveEdit : handleCreateProvince}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium cursor-pointer transition shadow-xs flex items-center gap-1.5"
              >
                <Check size={14} />
                <span>{isEditModalOpen ? "Lưu thay đổi" : "Tạo tỉnh thành"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. Drawer: PROVINCE DETAILS */}
      {selectedProvince && (
        <div
          className="fixed inset-0 bg-slate-950/30 backdrop-blur-xs flex justify-end z-50 animate-in fade-in duration-150"
          onClick={() => setSelectedProvince(null)}
        >
          <div
            className="w-full max-w-md bg-white h-full shadow-2xl p-6 overflow-y-auto space-y-5 text-xs animate-in slide-in-from-right duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-blue-600" />
                <h3 className="font-bold text-base text-slate-900 tracking-tight">
                  Chi tiết Tỉnh / Thành
                </h3>
              </div>
              <button
                onClick={() => setSelectedProvince(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X size={16} />
              </button>
            </div>

            {selectedProvince.coverImg && (
              <div className="relative h-44 rounded-xl overflow-hidden ring-1 ring-slate-200">
                <img
                  src={selectedProvince.coverImg}
                  alt={selectedProvince.name}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-slate-900/80 text-white font-bold text-[10px]">
                  {selectedProvince.code}
                </span>
              </div>
            )}

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-black text-slate-900">{selectedProvince.name}</h2>
                <span
                  className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                    selectedProvince.status === "active"
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {selectedProvince.status === "active" ? "Đang hiển thị" : "Đang ẩn"}
                </span>
              </div>
              <p className="text-slate-500 leading-relaxed pt-1">
                {selectedProvince.description || "Chưa có thông tin mô tả chi tiết."}
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2.5">
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500 font-medium">Khu vực địa lý:</span>
                <span className="font-bold text-slate-800">{selectedProvince.region}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500 font-medium">Địa điểm đã số hóa:</span>
                <span className="font-bold text-blue-600">
                  {selectedProvince.placesCount} địa điểm
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500 font-medium">Đặc sản vùng miền:</span>
                <span className="font-bold text-emerald-600">
                  {selectedProvince.foodsCount} món ăn
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500 font-medium">Độ hoàn thiện dữ liệu:</span>
                <span className="font-bold text-slate-900">{selectedProvince.completeness}%</span>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  handleOpenEdit(selectedProvince);
                  setSelectedProvince(null);
                }}
                className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Edit3 size={14} />
                <span>Chỉnh sửa</span>
              </button>
              <button
                onClick={() => {
                  handleToggleStatus(selectedProvince.id);
                  setSelectedProvince((prev) =>
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
                {selectedProvince.status === "active" ? "Tạm ẩn" : "Kích hoạt"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
