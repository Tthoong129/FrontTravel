import React, { useState, useMemo } from "react";
import {
  SlidersHorizontal,
  Search,
  Plus,
  Edit3,
  Trash2,
  Check,
  X,
  Layers,
  Utensils,
  Building,
  Compass,
  Sparkles,
  ShoppingBag,
  Eye,
  EyeOff,
  UserCog,
  MapPin,
  AlertTriangle,
  Info,
  ChevronRight,
  Download,
} from "lucide-react";

export interface PlaceTypeItem {
  id: string;
  name: string;
  code: string;
  categoriesCount: number;
  placesCount: number;
  iconName: string;
  status: "active" | "hidden";
  description: string;
}

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  typeId: string;
  typeName: string;
  placesCount: number;
  assignedAdminsCount: number;
  status: "active" | "hidden";
  description: string;
  icon: string;
  isPopular?: boolean;
}

const initialPlaceTypes: PlaceTypeItem[] = [
  {
    id: "type-food",
    name: "Ẩm thực & Quán ăn",
    code: "FOOD_BEVERAGE",
    categoriesCount: 6,
    placesCount: 628,
    iconName: "Utensils",
    status: "active",
    description: "Các mô hình dịch vụ ăn uống từ nhà hàng sang trọng, quán cà phê đến món ngon vỉa hè.",
  },
  {
    id: "type-stay",
    name: "Lưu trú & Nghỉ dưỡng",
    code: "ACCOMMODATION",
    categoriesCount: 4,
    placesCount: 384,
    iconName: "Building",
    status: "active",
    description: "Khách sạn, Resort, Homestay và Biệt thự lưu trú phục vụ du khách.",
  },
  {
    id: "type-travel",
    name: "Điểm tham quan & Di tích",
    code: "ATTRACTION",
    categoriesCount: 5,
    placesCount: 512,
    iconName: "Compass",
    status: "active",
    description: "Di tích lịch sử, danh lam thắng cảnh thiên nhiên, bảo tàng và công trình kiến trúc.",
  },
  {
    id: "type-activity",
    name: "Trải nghiệm & Giải trí",
    code: "ACTIVITY",
    categoriesCount: 3,
    placesCount: 318,
    iconName: "Sparkles",
    status: "active",
    description: "Hoạt động vui chơi giải trí, tour trải nghiệm văn hóa bản địa, thể thao ngoài trời.",
  },
];

const initialCategories: CategoryItem[] = [
  {
    id: "cat-restaurant",
    name: "Nhà hàng & Quán ăn",
    slug: "nha-hang-quan-an",
    typeId: "type-food",
    typeName: "Ẩm thực & Quán ăn",
    placesCount: 312,
    assignedAdminsCount: 3,
    status: "active",
    description: "Địa điểm phục vụ các món ăn chính, cơm gia đình, đặc sản truyền thống.",
    icon: "🍽️",
    isPopular: true,
  },
  {
    id: "cat-coffee",
    name: "Quán Cà phê & Trà",
    slug: "quan-ca-phe-tra",
    typeId: "type-food",
    typeName: "Ẩm thực & Quán ăn",
    placesCount: 184,
    assignedAdminsCount: 2,
    status: "active",
    description: "Không gian thư giãn, thưởng thức cà phê rang xay, trà sữa và ngắm cảnh.",
    icon: "☕",
    isPopular: true,
  },
  {
    id: "cat-streetfood",
    name: "Ẩm thực đường phố & Ăn vặt",
    slug: "am-thuc-duong-pho",
    typeId: "type-food",
    typeName: "Ẩm thực & Quán ăn",
    placesCount: 132,
    assignedAdminsCount: 2,
    status: "active",
    description: "Quán vỉa hè, chợ đêm, món ăn vặt đặc trưng của giới trẻ và ẩm thực đường phố.",
    icon: "🍢",
    isPopular: true,
  },
  {
    id: "cat-hotel",
    name: "Khách sạn & Resort",
    slug: "khach-san-resort",
    typeId: "type-stay",
    typeName: "Lưu trú & Nghỉ dưỡng",
    placesCount: 220,
    assignedAdminsCount: 4,
    status: "active",
    description: "Khách sạn tiêu chuẩn từ 2 đến 5 sao, resort nghỉ dưỡng ven biển.",
    icon: "🏨",
    isPopular: true,
  },
  {
    id: "cat-homestay",
    name: "Homestay & Căn hộ",
    slug: "homestay-can-ho",
    typeId: "type-stay",
    typeName: "Lưu trú & Nghỉ dưỡng",
    placesCount: 164,
    assignedAdminsCount: 2,
    status: "active",
    description: "Nhà dân, căn hộ dịch vụ và không gian lưu trú ấm cúng đậm chất địa phương.",
    icon: "🏡",
    isPopular: false,
  },
  {
    id: "cat-scenic",
    name: "Danh lam thắng cảnh",
    slug: "danh-lam-thang-canh",
    typeId: "type-travel",
    typeName: "Điểm tham quan & Di tích",
    placesCount: 245,
    assignedAdminsCount: 3,
    status: "active",
    description: "Bãi biển, đèo núi, thác nước, thung lũng và hang động thiên nhiên kỳ vĩ.",
    icon: "🏞️",
    isPopular: true,
  },
  {
    id: "cat-heritage",
    name: "Di tích lịch sử & Văn hóa",
    slug: "di-tich-lich-su",
    typeId: "type-travel",
    typeName: "Điểm tham quan & Di tích",
    placesCount: 178,
    assignedAdminsCount: 3,
    status: "active",
    description: "Chùa cổ, đình làng, thành quách, lăng tẩm và bảo tàng lưu giữ lịch sử.",
    icon: "🏛️",
    isPopular: false,
  },
  {
    id: "cat-entertainment",
    name: "Khu vui chơi & Giải trí",
    slug: "khu-vui-choi",
    typeId: "type-activity",
    typeName: "Trải nghiệm & Giải trí",
    placesCount: 145,
    assignedAdminsCount: 2,
    status: "active",
    description: "Công viên chủ đề, khu du lịch sinh thái và tổ hợp trò chơi giải trí.",
    icon: "🎡",
    isPopular: false,
  },
];

interface SystemTaxonomyTabProps {
  onNotify: (msg: string) => void;
}

export default function SystemTaxonomyTab({ onNotify }: SystemTaxonomyTabProps) {
  const [subTab, setSubTab] = useState<"categories" | "types">("categories");
  const [categories, setCategories] = useState<CategoryItem[]>(initialCategories);
  const [placeTypes, setPlaceTypes] = useState<PlaceTypeItem[]>(initialPlaceTypes);

  // Search & Filter
  const [searchText, setSearchText] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Selection for detail drawer
  const [selectedCategory, setSelectedCategory] = useState<CategoryItem | null>(null);
  const [selectedType, setSelectedType] = useState<PlaceTypeItem | null>(null);

  // Category Modal State
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);

  // Type Modal State
  const [isTypeModalOpen, setIsTypeModalOpen] = useState(false);
  const [editingType, setEditingType] = useState<PlaceTypeItem | null>(null);

  // Category Form State
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    slug: "",
    typeId: "type-food",
    icon: "🍽️",
    description: "",
    status: "active" as "active" | "hidden",
  });

  // Type Form State
  const [typeForm, setTypeForm] = useState({
    name: "",
    code: "",
    description: "",
    status: "active" as "active" | "hidden",
  });

  // Filtered Categories
  const filteredCategories = useMemo(() => {
    return categories.filter((c) => {
      if (typeFilter !== "all" && c.typeId !== typeFilter) return false;
      if (statusFilter !== "all" && c.status !== statusFilter) return false;
      if (searchText.trim()) {
        const q = searchText.toLowerCase();
        const matchName = c.name.toLowerCase().includes(q);
        const matchSlug = c.slug.toLowerCase().includes(q);
        const matchType = c.typeName.toLowerCase().includes(q);
        if (!matchName && !matchSlug && !matchType) return false;
      }
      return true;
    });
  }, [categories, typeFilter, statusFilter, searchText]);

  // Filtered Types
  const filteredTypes = useMemo(() => {
    return placeTypes.filter((t) => {
      if (statusFilter !== "all" && t.status !== statusFilter) return false;
      if (searchText.trim()) {
        const q = searchText.toLowerCase();
        const matchName = t.name.toLowerCase().includes(q);
        const matchCode = t.code.toLowerCase().includes(q);
        if (!matchName && !matchCode) return false;
      }
      return true;
    });
  }, [placeTypes, statusFilter, searchText]);

  // Handlers for Categories
  const handleToggleCategoryStatus = (id: string) => {
    setCategories((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const nextStatus = c.status === "active" ? "hidden" : "active";
          onNotify(`Đã ${nextStatus === "active" ? "kích hoạt" : "tạm ẩn"} danh mục "${c.name}".`);
          return { ...c, status: nextStatus };
        }
        return c;
      })
    );
  };

  const handleDeleteCategory = (id: string, name: string) => {
    if (confirm(`Bạn có chắc chắn muốn xóa danh mục "${name}" khỏi hệ thống?`)) {
      setCategories((prev) => prev.filter((c) => c.id !== id));
      if (selectedCategory?.id === id) setSelectedCategory(null);
      onNotify(`Đã xóa danh mục "${name}".`);
    }
  };

  const handleOpenAddCategory = () => {
    setEditingCategory(null);
    setCategoryForm({
      name: "",
      slug: "",
      typeId: placeTypes[0]?.id || "type-food",
      icon: "📍",
      description: "",
      status: "active",
    });
    setIsCategoryModalOpen(true);
  };

  const handleOpenEditCategory = (c: CategoryItem) => {
    setEditingCategory(c);
    setCategoryForm({
      name: c.name,
      slug: c.slug,
      typeId: c.typeId,
      icon: c.icon,
      description: c.description,
      status: c.status,
    });
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategoryForm = () => {
    if (!categoryForm.name) {
      onNotify("Vui lòng nhập tên danh mục.");
      return;
    }

    const currentType = placeTypes.find((t) => t.id === categoryForm.typeId);
    const typeName = currentType?.name || "Khác";

    if (editingCategory) {
      // Update
      setCategories((prev) =>
        prev.map((c) =>
          c.id === editingCategory.id
            ? {
                ...c,
                name: categoryForm.name,
                slug: categoryForm.slug || categoryForm.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
                typeId: categoryForm.typeId,
                typeName,
                icon: categoryForm.icon,
                description: categoryForm.description,
                status: categoryForm.status,
              }
            : c
        )
      );
      onNotify(`Đã cập nhật danh mục "${categoryForm.name}".`);
    } else {
      // Create
      const newCat: CategoryItem = {
        id: `cat-${Date.now()}`,
        name: categoryForm.name,
        slug: categoryForm.slug || categoryForm.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        typeId: categoryForm.typeId,
        typeName,
        placesCount: 0,
        assignedAdminsCount: 1,
        status: categoryForm.status,
        description: categoryForm.description,
        icon: categoryForm.icon || "📍",
        isPopular: false,
      };
      setCategories([newCat, ...categories]);
      // Update count in placeTypes
      setPlaceTypes((prev) =>
        prev.map((t) =>
          t.id === categoryForm.typeId ? { ...t, categoriesCount: t.categoriesCount + 1 } : t
        )
      );
      onNotify(`Đã thêm mới danh mục "${newCat.name}".`);
    }

    setIsCategoryModalOpen(false);
  };

  // Handlers for Place Types
  const handleOpenAddType = () => {
    setEditingType(null);
    setTypeForm({
      name: "",
      code: "",
      description: "",
      status: "active",
    });
    setIsTypeModalOpen(true);
  };

  const handleOpenEditType = (pt: PlaceTypeItem) => {
    setEditingType(pt);
    setTypeForm({
      name: pt.name,
      code: pt.code,
      description: pt.description,
      status: pt.status,
    });
    setIsTypeModalOpen(true);
  };

  const handleToggleTypeStatus = (id: string) => {
    setPlaceTypes((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const nextStatus = t.status === "active" ? "hidden" : "active";
          onNotify(`Đã ${nextStatus === "active" ? "kích hoạt" : "tạm ẩn"} loại địa điểm "${t.name}".`);
          return { ...t, status: nextStatus };
        }
        return t;
      })
    );
  };

  const handleDeleteType = (id: string, name: string) => {
    const hasChild = categories.some((c) => c.typeId === id);
    if (hasChild) {
      alert(`Không thể xóa loại hình "${name}" vì đang chứa danh mục con. Vui lòng chuyển hoặc xóa các danh mục con trước.`);
      return;
    }
    if (confirm(`Bạn có chắc muốn xóa loại địa điểm "${name}"?`)) {
      setPlaceTypes((prev) => prev.filter((t) => t.id !== id));
      if (selectedType?.id === id) setSelectedType(null);
      onNotify(`Đã xóa loại địa điểm "${name}".`);
    }
  };

  const handleSaveTypeForm = () => {
    if (!typeForm.name) {
      onNotify("Vui lòng nhập tên loại địa điểm.");
      return;
    }

    if (editingType) {
      setPlaceTypes((prev) =>
        prev.map((t) =>
          t.id === editingType.id
            ? {
                ...t,
                name: typeForm.name,
                code: typeForm.code || typeForm.name.toUpperCase().replace(/[^A-Z0-9]+/g, "_"),
                description: typeForm.description,
                status: typeForm.status,
              }
            : t
        )
      );
      // Update name in categories
      setCategories((prev) =>
        prev.map((c) => (c.typeId === editingType.id ? { ...c, typeName: typeForm.name } : c))
      );
      onNotify(`Đã cập nhật loại địa điểm "${typeForm.name}".`);
    } else {
      const newType: PlaceTypeItem = {
        id: `type-${Date.now()}`,
        name: typeForm.name,
        code: typeForm.code || typeForm.name.toUpperCase().replace(/[^A-Z0-9]+/g, "_"),
        categoriesCount: 0,
        placesCount: 0,
        iconName: "Layers",
        status: typeForm.status,
        description: typeForm.description,
      };
      setPlaceTypes([newType, ...placeTypes]);
      onNotify(`Đã thêm loại địa điểm chính "${newType.name}".`);
    }

    setIsTypeModalOpen(false);
  };

  const handleExportCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "ID,Tên Danh Mục,Slug,Loại Hình Cha,Số Địa Điểm,Admin Phụ Trách,Trạng Thái\n" +
      categories
        .map(
          (c) =>
            `${c.id},"${c.name}","${c.slug}","${c.typeName}",${c.placesCount},${c.assignedAdminsCount},${
              c.status === "active" ? "Đang dùng" : "Đang ẩn"
            }`
        )
        .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `danh_muc_he_thong_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onNotify("Đã xuất danh mục hệ thống dạng CSV thành công!");
  };

  // Quick stats
  const totalCategories = categories.length;
  const activeCategories = categories.filter((c) => c.status === "active").length;
  const totalPlaces = categories.reduce((acc, c) => acc + c.placesCount, 0);

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* 1. Header & Switcher */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <SlidersHorizontal size={18} />
            </div>
            <div>
              <h1 className="text-base font-black text-slate-900 tracking-tight">
                Phân loại địa điểm &amp; Danh mục hệ thống
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Toàn quyền thêm, sửa, đổi tên và quản lý cả <strong>Loại địa điểm (PlaceTypes)</strong> lẫn <strong>Danh mục chi tiết (Categories)</strong>
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-bold">
            <button
              onClick={() => setSubTab("categories")}
              className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                subTab === "categories"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Danh mục ({totalCategories})
            </button>
            <button
              onClick={() => setSubTab("types")}
              className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                subTab === "types"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Loại địa điểm ({placeTypes.length})
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
            onClick={subTab === "categories" ? handleOpenAddCategory : handleOpenAddType}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <Plus size={14} />
            <span>{subTab === "categories" ? "Thêm danh mục mới" : "Thêm loại địa điểm"}</span>
          </button>
        </div>
      </div>

      {/* 2. Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Tổng Danh mục (Cấp 2)
          </div>
          <div className="text-xl font-black text-slate-900 mt-1">{totalCategories}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Chỉnh sửa &amp; thêm tùy ý</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-[11px] font-bold text-purple-600 uppercase tracking-wider">
            Loại địa điểm (Cấp 1)
          </div>
          <div className="text-xl font-black text-purple-700 mt-1">{placeTypes.length}</div>
          <div className="text-[10px] text-purple-600 mt-0.5">PlaceTypes gốc hệ thống</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">
            Đang hoạt động
          </div>
          <div className="text-xl font-black text-emerald-700 mt-1">{activeCategories}</div>
          <div className="text-[10px] text-emerald-600 mt-0.5">Áp dụng cho địa điểm</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">
            Địa điểm liên kết
          </div>
          <div className="text-xl font-black text-blue-700 mt-1">{totalPlaces}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Trên toàn quốc</div>
        </div>
      </div>

      {/* 3. Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="relative flex-1 min-w-[240px]">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder={
                subTab === "categories"
                  ? "Tìm kiếm danh mục, mã slug, loại cha..."
                  : "Tìm kiếm loại địa điểm, mã code..."
              }
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50/70 text-xs font-medium focus:bg-white focus:border-slate-400 outline-none transition-all"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            {subTab === "categories" && (
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white font-semibold text-slate-700 cursor-pointer outline-none hover:border-slate-300"
              >
                <option value="all">Tất cả Loại hình cha</option>
                {placeTypes.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            )}

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white font-semibold text-slate-700 cursor-pointer outline-none hover:border-slate-300"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Đang áp dụng</option>
              <option value="hidden">Tạm ẩn</option>
            </select>
          </div>
        </div>
      </div>

      {/* 4. Table View: CATEGORIES */}
      {subTab === "categories" && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 text-slate-400 font-bold border-b border-slate-100 text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Tên danh mục</th>
                  <th className="py-3.5 px-3">Loại hình cha</th>
                  <th className="py-3.5 px-3">Slug URL</th>
                  <th className="py-3.5 px-3">Số địa điểm</th>
                  <th className="py-3.5 px-3">Admin phụ trách</th>
                  <th className="py-3.5 px-3">Trạng thái</th>
                  <th className="py-3.5 px-4 text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCategories.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400">
                      Không tìm thấy danh mục nào phù hợp.
                    </td>
                  </tr>
                ) : (
                  filteredCategories.map((c) => {
                    const isActive = c.status === "active";
                    return (
                      <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-slate-900">
                          <div className="flex items-center gap-2.5">
                            <span className="text-base p-1.5 bg-slate-100 rounded-lg shrink-0">
                              {c.icon}
                            </span>
                            <div>
                              <button
                                onClick={() => setSelectedCategory(c)}
                                className="font-bold text-slate-900 hover:text-purple-600 transition text-left cursor-pointer"
                              >
                                {c.name}
                              </button>
                              <span className="text-[10px] text-slate-400 block mt-0.5">
                                ID: {c.id}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-3 font-semibold text-slate-700 whitespace-nowrap">
                          <span className="px-2.5 py-1 rounded-md bg-purple-50 text-purple-700 font-semibold text-[11px]">
                            {c.typeName}
                          </span>
                        </td>

                        <td className="py-3.5 px-3 font-mono text-slate-500 whitespace-nowrap">
                          /{c.slug}
                        </td>

                        <td className="py-3.5 px-3 font-bold text-slate-900 whitespace-nowrap">
                          {c.placesCount} địa điểm
                        </td>

                        <td className="py-3.5 px-3 font-medium text-slate-700 whitespace-nowrap">
                          <span className="flex items-center gap-1">
                            <UserCog size={13} className="text-slate-400" />
                            {c.assignedAdminsCount} admin phụ trách
                          </span>
                        </td>

                        <td className="py-3.5 px-3 whitespace-nowrap">
                          <span
                            className={`px-2.5 py-1 rounded-full font-bold text-[10px] border ${
                              isActive
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : "bg-slate-100 text-slate-600 border-slate-200"
                            }`}
                          >
                            {isActive ? "Đang dùng" : "Tạm ẩn"}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => setSelectedCategory(c)}
                              className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-900 hover:text-white text-slate-700 font-bold text-xs transition cursor-pointer"
                            >
                              Chi tiết
                            </button>

                            <button
                              onClick={() => handleOpenEditCategory(c)}
                              className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition cursor-pointer"
                              title="Chỉnh sửa danh mục"
                            >
                              <Edit3 size={13} />
                            </button>

                            <button
                              onClick={() => handleToggleCategoryStatus(c.id)}
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
                              onClick={() => handleDeleteCategory(c.id, c.name)}
                              className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white transition cursor-pointer"
                              title="Xóa danh mục"
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

      {/* 4. Table / Cards View: PLACE TYPES */}
      {subTab === "types" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTypes.map((pt) => {
            const isActive = pt.status === "active";
            const childCategories = categories.filter((c) => c.typeId === pt.id);
            return (
              <div
                key={pt.id}
                className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3.5 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 font-black flex items-center justify-center">
                        <Layers size={20} />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm">{pt.name}</h3>
                        <span className="text-slate-400 font-mono text-[10px]">{pt.code}</span>
                      </div>
                    </div>

                    <span
                      className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] border ${
                        isActive
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-slate-100 text-slate-600 border-slate-200"
                      }`}
                    >
                      {isActive ? "Hoạt động" : "Tạm ẩn"}
                    </span>
                  </div>

                  <p className="text-slate-500 text-xs leading-relaxed">{pt.description}</p>

                  {/* Child category tags */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] font-bold uppercase text-slate-400">
                      Danh mục trực thuộc ({childCategories.length}):
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {childCategories.map((child) => (
                        <span
                          key={child.id}
                          className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium flex items-center gap-1"
                        >
                          <span>{child.icon}</span>
                          <span>{child.name}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900">
                    {pt.placesCount} địa điểm đã gán
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEditType(pt)}
                      className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-600 font-bold text-xs transition flex items-center gap-1 cursor-pointer"
                    >
                      <Edit3 size={13} />
                      <span>Sửa loại hình</span>
                    </button>
                    <button
                      onClick={() => handleToggleTypeStatus(pt.id)}
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
                      onClick={() => handleDeleteType(pt.id, pt.name)}
                      className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white transition cursor-pointer"
                      title="Xóa loại hình"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 5. Modal: ADD / EDIT CATEGORY */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200/80 text-xs max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-base text-slate-900 tracking-tight">
                  {editingCategory ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"}
                </h3>
                <p className="text-slate-400 text-xs mt-0.5">
                  Thiết lập phân loại nội dung cho hệ thống
                </p>
              </div>
              <button
                onClick={() => setIsCategoryModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer transition"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3.5">
              <div className="grid grid-cols-4 gap-3">
                <div className="col-span-1">
                  <label className="font-semibold text-slate-700 block mb-1">Icon Emoji</label>
                  <input
                    type="text"
                    placeholder="🍽️"
                    value={categoryForm.icon}
                    onChange={(e) => setCategoryForm({ ...categoryForm, icon: e.target.value })}
                    className="w-full text-center px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-medium text-lg outline-none focus:bg-white"
                  />
                </div>

                <div className="col-span-3">
                  <label className="font-semibold text-slate-700 block mb-1">Tên Danh mục *</label>
                  <input
                    type="text"
                    placeholder="Ví dụ: Tiệm bánh & Tráng miệng"
                    value={categoryForm.name}
                    onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-medium text-slate-800 placeholder:text-slate-400 focus:bg-white outline-none focus:border-slate-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Thuộc Loại hình cha</label>
                  <select
                    value={categoryForm.typeId}
                    onChange={(e) => setCategoryForm({ ...categoryForm, typeId: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-medium text-slate-800 focus:bg-white outline-none cursor-pointer"
                  >
                    {placeTypes.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Slug URL</label>
                  <input
                    type="text"
                    placeholder="tiem-banh-trang-mieng"
                    value={categoryForm.slug}
                    onChange={(e) => setCategoryForm({ ...categoryForm, slug: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-medium text-slate-800 focus:bg-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Mô tả định nghĩa</label>
                <textarea
                  rows={3}
                  placeholder="Mô tả tiêu chuẩn và đặc điểm của danh mục này..."
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-medium text-slate-800 focus:bg-white outline-none resize-none"
                />
              </div>

              <label className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={categoryForm.status === "active"}
                  onChange={(e) =>
                    setCategoryForm({ ...categoryForm, status: e.target.checked ? "active" : "hidden" })
                  }
                  className="rounded text-emerald-600"
                />
                <span className="font-semibold text-slate-800">Kích hoạt áp dụng ngay</span>
              </label>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setIsCategoryModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium cursor-pointer transition"
              >
                Hủy
              </button>
              <button
                onClick={handleSaveCategoryForm}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium cursor-pointer transition shadow-xs flex items-center gap-1.5"
              >
                <Check size={14} />
                <span>{editingCategory ? "Lưu thay đổi" : "Tạo danh mục"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5.2 Modal: ADD / EDIT PLACE TYPE */}
      {isTypeModalOpen && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200/80 text-xs max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-base text-slate-900 tracking-tight">
                  {editingType ? "Chỉnh sửa loại địa điểm chính" : "Thêm loại địa điểm mới"}
                </h3>
                <p className="text-slate-400 text-xs mt-0.5">
                  Quản lý nhóm PlaceType gốc phân quyền cho Admin cấp 1
                </p>
              </div>
              <button
                onClick={() => setIsTypeModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer transition"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3.5">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Tên loại địa điểm *</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Mua sắm & Đặc sản"
                  value={typeForm.name}
                  onChange={(e) => setTypeForm({ ...typeForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-medium text-slate-800 placeholder:text-slate-400 focus:bg-white outline-none focus:border-slate-300"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Mã định danh (Code)</label>
                <input
                  type="text"
                  placeholder="VD: SHOPPING_SPECIALTY"
                  value={typeForm.code}
                  onChange={(e) => setTypeForm({ ...typeForm, code: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-medium text-slate-800 focus:bg-white outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Mô tả chức năng</label>
                <textarea
                  rows={3}
                  placeholder="Mô tả phạm vi và mục đích của loại địa điểm này..."
                  value={typeForm.description}
                  onChange={(e) => setTypeForm({ ...typeForm, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-medium text-slate-800 focus:bg-white outline-none resize-none"
                />
              </div>

              <label className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={typeForm.status === "active"}
                  onChange={(e) =>
                    setTypeForm({ ...typeForm, status: e.target.checked ? "active" : "hidden" })
                  }
                  className="rounded text-emerald-600"
                />
                <span className="font-semibold text-slate-800">Kích hoạt áp dụng ngay</span>
              </label>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setIsTypeModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium cursor-pointer transition"
              >
                Hủy
              </button>
              <button
                onClick={handleSaveTypeForm}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium cursor-pointer transition shadow-xs flex items-center gap-1.5"
              >
                <Check size={14} />
                <span>{editingType ? "Lưu thay đổi" : "Tạo loại địa điểm"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. Drawer: CATEGORY DETAILS */}
      {selectedCategory && (
        <div
          className="fixed inset-0 bg-slate-950/30 backdrop-blur-xs flex justify-end z-50 animate-in fade-in duration-150"
          onClick={() => setSelectedCategory(null)}
        >
          <div
            className="w-full max-w-md bg-white h-full shadow-2xl p-6 overflow-y-auto space-y-5 text-xs animate-in slide-in-from-right duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">{selectedCategory.icon}</span>
                <h3 className="font-bold text-base text-slate-900 tracking-tight">
                  Chi tiết Danh mục
                </h3>
              </div>
              <button
                onClick={() => setSelectedCategory(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-black text-slate-900">{selectedCategory.name}</h2>
                <span
                  className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                    selectedCategory.status === "active"
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {selectedCategory.status === "active" ? "Đang áp dụng" : "Đang ẩn"}
                </span>
              </div>
              <p className="text-slate-500 leading-relaxed pt-1">
                {selectedCategory.description || "Chưa có mô tả chi tiết."}
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2.5">
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500 font-medium">Loại hình gốc:</span>
                <span className="font-bold text-purple-700">{selectedCategory.typeName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500 font-medium">Slug nhận diện:</span>
                <span className="font-mono font-bold text-slate-800">/{selectedCategory.slug}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500 font-medium">Địa điểm đang thuộc danh mục:</span>
                <span className="font-bold text-blue-600">
                  {selectedCategory.placesCount} địa điểm
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500 font-medium">Admin cấp 1 đang phụ trách:</span>
                <span className="font-bold text-emerald-600">
                  {selectedCategory.assignedAdminsCount} nhân sự
                </span>
              </div>
            </div>

            {/* Scope Safety Notice */}
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-800 flex items-start gap-2.5">
              <AlertTriangle size={16} className="shrink-0 mt-0.5 text-amber-600" />
              <div className="text-[11px] leading-relaxed">
                <strong>Lưu ý phân quyền:</strong> Danh mục này đang được bàn giao cho{" "}
                {selectedCategory.assignedAdminsCount} Admin cấp 1. Nếu ẩn hoặc xóa, các bài kiểm
                duyệt thuộc danh mục này sẽ tạm thời chuyển về System Admin.
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  handleOpenEditCategory(selectedCategory);
                  setSelectedCategory(null);
                }}
                className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Edit3 size={14} />
                <span>Chỉnh sửa</span>
              </button>
              <button
                onClick={() => {
                  handleToggleCategoryStatus(selectedCategory.id);
                  setSelectedCategory((prev) =>
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
                {selectedCategory.status === "active" ? "Tạm ẩn" : "Kích hoạt"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
