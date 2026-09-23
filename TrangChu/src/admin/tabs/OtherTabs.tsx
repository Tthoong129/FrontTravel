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
} from "lucide-react";
import { AdminFoodItem, AdminBlogItem, AdminAuditLog, AdminAssignmentInfo } from "../../adminData";
import ImageUploader from "../components/ImageUploader";

/* ─────────────────────────────────────────────────────────────
   TAB 6: ẨM THỰC & ĐẶC SẢN VÙNG (FOODS TAB)
───────────────────────────────────────────────────────────── */
export function FoodsTab({ foodsList: initialFoods }: { foodsList: AdminFoodItem[] }) {
  const [foods, setFoods] = useState<AdminFoodItem[]>(initialFoods);
  const [searchText, setSearchText] = useState("");
  const [provinceFilter, setProvinceFilter] = useState("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newFood, setNewFood] = useState({
    name: "",
    province: "Đà Nẵng",
    desc: "",
    coverImg: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=400&fit=crop",
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
        const matchDesc = f.desc.toLowerCase().includes(q);
        if (!matchName && !matchDesc) return false;
      }
      return true;
    });
  }, [foods, provinceFilter, searchText]);

  const handleAddFood = () => {
    if (!newFood.name || !newFood.desc) return;
    const item: AdminFoodItem = {
      id: Date.now(),
      name: newFood.name,
      province: newFood.province,
      desc: newFood.desc,
      coverImg: newFood.coverImg,
      famousPlacesCount: 1,
    };
    setFoods([item, ...foods]);
    setIsAddModalOpen(false);
    setNewFood({
      name: "",
      province: "Đà Nẵng",
      desc: "",
      coverImg: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=400&fit=crop",
    });
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-150">
      {/* Header & Actions */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4 text-xs">
        <div>
          <h2 className="font-bold text-base text-slate-900 tracking-tight flex items-center gap-2">
            <Utensils className="text-slate-700" size={18} />
            <span>Ẩm thực &amp; Đặc sản vùng ({foods.length} món)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Quản lý danh sách món ăn đặc sản truyền thống gắn liền với từng tỉnh thành
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
        >
          <Plus size={14} />
          <span>Thêm món đặc sản</span>
        </button>
      </div>

      {/* Search & Filter */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 min-w-[260px]">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm kiếm món đặc sản theo tên hoặc mô tả..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50/70 text-xs font-medium focus:bg-white focus:border-slate-400 outline-none"
          />
        </div>

        <select
          value={provinceFilter}
          onChange={(e) => setProvinceFilter(e.target.value)}
          className="px-3 py-2 rounded-xl border border-slate-200 bg-white font-semibold text-slate-700 cursor-pointer outline-none hover:border-slate-300"
        >
          <option value="all">Tất cả Tỉnh / Thành</option>
          {provinces.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>

      {/* Foods Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredFoods.map((food) => (
          <div
            key={food.id}
            className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow"
          >
            <div className="relative h-44 overflow-hidden bg-slate-100">
              <img src={food.coverImg} alt={food.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
              <span className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-slate-900/75 backdrop-blur-xs text-white font-bold text-[10px]">
                {food.province}
              </span>
            </div>

            <div className="p-4 space-y-2 flex-1 flex flex-col justify-between text-xs">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">{food.name}</h3>
                <p className="text-slate-500 line-clamp-2 leading-relaxed mt-1">{food.desc}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
                <span className="flex items-center gap-1">
                  <MapPin size={12} className="text-slate-500" />
                  {food.famousPlacesCount || 3} quán tiêu biểu
                </span>
                <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  Đang hiển thị
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Food Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 p-6 space-y-4 shadow-2xl text-xs">
            <h3 className="font-bold text-base text-slate-900">Thêm món đặc sản mới</h3>
            <div className="space-y-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Tên món ăn</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Bê Thui Cầu Mống"
                  value={newFood.name}
                  onChange={(e) => setNewFood({ ...newFood, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:bg-white"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Tỉnh / Thành đặc trưng</label>
                <select
                  value={newFood.province}
                  onChange={(e) => setNewFood({ ...newFood, province: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:bg-white font-medium"
                >
                  <option value="Đà Nẵng">Đà Nẵng</option>
                  <option value="Quảng Nam">Quảng Nam</option>
                  <option value="Thừa Thiên Huế">Thừa Thiên Huế</option>
                  <option value="Khánh Hòa">Khánh Hòa</option>
                  <option value="Lâm Đồng">Lâm Đồng</option>
                </select>
              </div>

              <div>
                <ImageUploader
                  value={newFood.coverImg}
                  onChange={(url) => setNewFood({ ...newFood, coverImg: url })}
                  label="Ảnh minh họa món ăn"
                  helperText="Tải tệp từ máy tính hoặc nhập liên kết ảnh"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Mô tả nét đặc trưng</label>
                <textarea
                  rows={3}
                  placeholder="Mô tả hương vị, nguyên liệu và cách thưởng thức chuẩn vị..."
                  value={newFood.desc}
                  onChange={(e) => setNewFood({ ...newFood, desc: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:bg-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 font-bold">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-600"
              >
                Hủy
              </button>
              <button
                onClick={handleAddFood}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800"
              >
                Lưu món ăn
              </button>
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
export function CollectionsTab() {
  const [collections] = useState([
    {
      id: 1,
      name: "Top 10 Quán Mì Quảng Ngon Nhất Đà Nẵng",
      count: 10,
      img: "https://images.unsplash.com/photo-1541544741938-0af808871cc0?w=600&h=400&fit=crop",
      tag: "Ẩm thực truyền thống",
      isFeatured: true,
    },
    {
      id: 2,
      name: "Cà Phê Check-in View Cầu Rồng & Sông Hàn",
      count: 8,
      img: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&h=400&fit=crop",
      tag: "Check-in & Cà phê",
      isFeatured: true,
    },
    {
      id: 3,
      name: "Hương Vị Phố Cổ Hội An Về Đêm",
      count: 12,
      img: "https://images.unsplash.com/photo-1528127269322-539801943592?w=600&h=400&fit=crop",
      tag: "Đêm phố cổ",
      isFeatured: false,
    },
  ]);

  return (
    <div className="space-y-5 animate-in fade-in duration-150">
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4 text-xs">
        <div>
          <h2 className="font-bold text-base text-slate-900 tracking-tight flex items-center gap-2">
            <FolderHeart className="text-slate-700" size={18} />
            <span>Bộ sưu tập địa điểm tuyển chọn ({collections.length})</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Bộ sưu tập định hướng du lịch hiển thị nổi bật trên Trang chủ và trang Khám phá
          </p>
        </div>

        <button className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer">
          <Plus size={14} />
          <span>Tạo bộ sưu tập mới</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {collections.map((col) => (
          <div key={col.id} className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3 text-xs">
            <div className="relative h-44 rounded-xl overflow-hidden bg-slate-100">
              <img src={col.img} alt="" className="w-full h-full object-cover" />
              {col.isFeatured && (
                <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-amber-500 text-white font-bold text-[10px]">
                  ★ Nổi bật trang chủ
                </span>
              )}
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                {col.tag}
              </span>
              <h3 className="font-bold text-sm text-slate-900 pt-1">{col.name}</h3>
              <p className="text-slate-400 text-[11px] font-medium">{col.count} địa điểm tuyển chọn</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   TAB 8: TỈNH / THÀNH TRONG VÙNG (PROVINCES TAB)
───────────────────────────────────────────────────────────── */
export function ProvincesTab() {
  const provinces = [
    { name: "Đà Nẵng", places: 16, foods: 8, completeness: "88%", active: true, region: "Duyên hải Nam Trung Bộ" },
    { name: "Quảng Nam", places: 8, foods: 5, completeness: "83%", active: true, region: "Duyên hải Nam Trung Bộ" },
    { name: "Thừa Thiên Huế", places: 4, foods: 6, completeness: "75%", active: true, region: "Bắc Trung Bộ" },
    { name: "Khánh Hòa", places: 3, foods: 4, completeness: "70%", active: true, region: "Duyên hải Nam Trung Bộ" },
    { name: "Lâm Đồng", places: 5, foods: 4, completeness: "85%", active: true, region: "Tây Nguyên" },
  ];

  return (
    <div className="space-y-5 animate-in fade-in duration-150">
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs text-xs">
        <h2 className="font-bold text-base text-slate-900 tracking-tight flex items-center gap-2">
          <Compass className="text-slate-700" size={18} />
          <span>Tỉnh / Thành trong vùng phụ trách</span>
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Theo dõi mức độ số hóa dữ liệu và tình trạng kích hoạt của từng địa bàn
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden text-xs">
        <table className="w-full text-left">
          <thead className="bg-slate-50/80 text-slate-400 font-bold border-b border-slate-100 text-[11px] uppercase tracking-wider">
            <tr>
              <th className="py-3.5 px-4">Tỉnh / Thành</th>
              <th className="py-3.5 px-3">Vùng địa lý</th>
              <th className="py-3.5 px-3">Địa điểm số hóa</th>
              <th className="py-3.5 px-3">Món đặc sản</th>
              <th className="py-3.5 px-3">Độ phủ dữ liệu</th>
              <th className="py-3.5 px-4 text-center">Trạng thái</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {provinces.map((prv) => (
              <tr key={prv.name} className="hover:bg-slate-50/70 transition-colors">
                <td className="py-3.5 px-4 font-bold text-slate-900">{prv.name}</td>
                <td className="py-3.5 px-3 font-medium text-slate-600">{prv.region}</td>
                <td className="py-3.5 px-3 font-bold text-slate-800">{prv.places} địa điểm</td>
                <td className="py-3.5 px-3 font-medium text-slate-700">{prv.foods} món đặc trưng</td>
                <td className="py-3.5 px-3">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{prv.completeness}</span>
                    <div className="w-16 h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: prv.completeness }} />
                    </div>
                  </div>
                </td>
                <td className="py-3.5 px-4 text-center">
                  <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[10px]">
                    Đang hoạt động
                  </span>
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
export function BlogsTab({ blogsList: initialBlogs }: { blogsList: AdminBlogItem[] }) {
  const [blogs, setBlogs] = useState<AdminBlogItem[]>(initialBlogs);
  const [blogStatusFilter, setBlogStatusFilter] = useState<"all" | "published" | "pending">("all");

  const handleToggleBlog = (id: number) => {
    setBlogs((prev) =>
      prev.map((b) => (b.id === id ? { ...b, isPublished: !b.isPublished } : b))
    );
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-150">
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4 text-xs">
        <div>
          <h2 className="font-bold text-base text-slate-900 tracking-tight flex items-center gap-2">
            <BookOpen className="text-slate-700" size={18} />
            <span>Blog &amp; Cẩm nang du lịch ({blogs.length})</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Kiểm duyệt và xuất bản các bài cẩm nang trải nghiệm của tác giả &amp; cộng tác viên
          </p>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-slate-100/80 rounded-xl">
          <button
            onClick={() => setBlogStatusFilter("all")}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              blogStatusFilter === "all" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600"
            }`}
          >
            Tất cả bài viết
          </button>
          <button
            onClick={() => setBlogStatusFilter("published")}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              blogStatusFilter === "published" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600"
            }`}
          >
            Đã xuất bản
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
        {blogs
          .filter((b) => (blogStatusFilter === "published" ? b.isPublished : true))
          .map((blog) => (
            <div
              key={blog.id}
              className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row gap-4"
            >
              <img
                src={blog.coverImg}
                alt=""
                className="w-full sm:w-36 h-32 rounded-xl object-cover ring-1 ring-slate-200 shrink-0"
              />
              <div className="space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                      Cẩm nang
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                        blog.isPublished
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {blog.isPublished ? "Đã xuất bản" : "Bản nháp"}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm mt-1.5 line-clamp-2">{blog.title}</h3>
                  <p className="text-slate-500 line-clamp-2 leading-relaxed mt-1 text-[11px]">{blog.summary}</p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Tác giả: <strong className="text-slate-700">{blog.authorName}</strong></span>
                  <button
                    onClick={() => handleToggleBlog(blog.id)}
                    className="font-bold text-blue-600 hover:underline cursor-pointer"
                  >
                    {blog.isPublished ? "Tạm ẩn" : "Duyệt xuất bản"}
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   TAB 10: DANH MỤC HỆ THỐNG (CATEGORIES TAB)
───────────────────────────────────────────────────────────── */
export function CategoriesTab({ currentAdminInfo }: { currentAdminInfo: AdminAssignmentInfo }) {
  return (
    <div className="space-y-5 animate-in fade-in duration-150 text-xs">
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <h2 className="font-bold text-base text-slate-900 tracking-tight flex items-center gap-2">
          <Layers className="text-slate-700" size={18} />
          <span>Danh mục hệ thống (Phạm vi phân quyền)</span>
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Danh mục ẩm thực và dịch vụ do Admin cấp 1 được phân quyền quản trị nội dung
        </p>
      </div>

      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs divide-y divide-slate-100">
        {currentAdminInfo.assignedCategories.map((cat, idx) => (
          <div key={idx} className="py-3.5 flex items-center justify-between first:pt-0 last:pb-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
                {idx + 1}
              </div>
              <span className="font-bold text-slate-900 text-sm">{cat}</span>
            </div>

            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[11px] flex items-center gap-1.5">
              <CheckCircle2 size={13} />
              <span>Được phân quyền quản lý</span>
            </span>
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
  const notifications = [
    { id: 1, title: "Báo cáo vi phạm khẩn cấp tại Mì Quảng Ếch Bếp Trang", time: "10 phút trước", type: "urgent" },
    { id: 2, title: "Đề xuất thêm mới địa điểm 'Bánh tráng Hoàng Tín' chờ duyệt", time: "1 giờ trước", type: "proposal" },
    { id: 3, title: "Cấu hình SLA cảnh báo tự động kích hoạt cho khu vực Đà Nẵng", time: "Hôm nay 08:30", type: "system" },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-150 text-xs">
      {/* Profile Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <img
            src={currentAdminInfo.adminAvatar}
            alt=""
            className="w-16 h-16 rounded-2xl object-cover ring-2 ring-slate-200 shrink-0"
          />
          <div>
            <h2 className="font-black text-lg text-slate-900">{currentAdminInfo.adminName}</h2>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 font-bold text-[10px]">
                {currentAdminInfo.roleTitle}
              </span>
              <span className="text-slate-400">{currentAdminInfo.adminEmail}</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Phụ trách: {currentAdminInfo.assignedRegionName}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200/60">
          <div className="text-center px-3 border-r border-slate-200">
            <div className="text-[10px] text-slate-400 uppercase font-bold">Đã duyệt tháng</div>
            <div className="font-black text-slate-900 text-sm mt-0.5">{currentAdminInfo.stats.approvedThisMonth}</div>
          </div>
          <div className="text-center px-3">
            <div className="text-[10px] text-slate-400 uppercase font-bold">SLA trung bình</div>
            <div className="font-black text-emerald-600 text-sm mt-0.5">{currentAdminInfo.stats.slaHours}h</div>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs divide-y divide-slate-100 overflow-hidden">
        <div className="p-4 bg-slate-50/70 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 flex items-center gap-2">
            <Bell size={15} className="text-slate-700" />
            <span>Thông báo công việc &amp; Cảnh báo</span>
          </h3>
          <span className="text-[11px] text-blue-600 font-bold cursor-pointer hover:underline">Đánh dấu tất cả đã đọc</span>
        </div>

        {notifications.map((notif) => (
          <div key={notif.id} className="p-4 flex items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors">
            <div className="flex items-center gap-3">
              <div
                className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                  notif.type === "urgent" ? "bg-rose-500" : notif.type === "proposal" ? "bg-amber-500" : "bg-blue-500"
                }`}
              />
              <span className="font-semibold text-slate-800">{notif.title}</span>
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
export function AuditLogsTab({ auditLogs }: { auditLogs: AdminAuditLog[] }) {
  const [filterType, setFilterType] = useState<string>("all");
  const [searchText, setSearchText] = useState("");

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
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <h2 className="font-bold text-base text-slate-900 tracking-tight flex items-center gap-2">
          <History className="text-slate-700" size={18} />
          <span>Nhật ký kiểm toán hệ thống (Audit Trail)</span>
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Lưu vết toàn bộ thao tác duyệt, ẩn, sửa, phân công phục vụ thanh tra và giám sát minh bạch
        </p>
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
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50/70 text-xs font-medium focus:bg-white focus:border-slate-400 outline-none"
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
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredLogs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap">{log.timestamp}</td>
                <td className="py-3.5 px-4 font-bold text-slate-900">{log.action}</td>
                <td className="py-3.5 px-4 font-semibold text-slate-800">{log.targetName || "—"}</td>
                <td className="py-3.5 px-4 text-slate-600">{log.adminName || "Admin"}</td>
                <td className="py-3.5 px-4 text-slate-500 leading-relaxed">{log.details}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
