import { Utensils, FolderHeart, Compass, BookOpen, Layers, Bell, History, CheckCircle2 } from "lucide-react";
import { AdminFoodItem, AdminBlogItem, AdminAuditLog, AdminAssignmentInfo } from "../../adminData";

/* ── TAB 6: FOODS & SPECIALTIES ── */
export function FoodsTab({ foodsList }: { foodsList: AdminFoodItem[] }) {
  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between gap-4">
        <div>
          <h2 className="font-bold text-base text-slate-900 tracking-tight flex items-center gap-2">
            <Utensils className="text-slate-700" size={18} />
            <span>Ẩm thực &amp; Đặc sản vùng ({foodsList.length} món)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Quản lý danh sách món ăn đặc sản gắn liền với tỉnh thành và các quán tiêu biểu
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {foodsList.map((food) => (
          <div
            key={food.id}
            className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden space-y-3 p-4"
          >
            <img src={food.coverImg} alt="" className="w-full h-40 rounded-xl object-cover" />
            <div>
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-slate-900">{food.name}</h4>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                  {food.province}
                </span>
              </div>
              <p className="text-slate-500 text-xs mt-1.5 line-clamp-2 leading-relaxed">{food.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── TAB 7: COLLECTIONS ── */
export function CollectionsTab() {
  const collections = [
    {
      id: 1,
      name: "Top 10 Quán Mì Quảng Ngon Nhất Đà Nẵng",
      count: 10,
      img: "https://images.unsplash.com/photo-1541544741938-0af808871cc0?w=600&h=400&fit=crop",
    },
    {
      id: 2,
      name: "Cà Phê Check-in View Cầu Rồng & Sông Hàn",
      count: 8,
      img: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&h=400&fit=crop",
    },
    {
      id: 3,
      name: "Hương Vị Phố Cổ Hội An",
      count: 12,
      img: "https://images.unsplash.com/photo-1528127269322-539801943592?w=600&h=400&fit=crop",
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <h2 className="font-bold text-base text-slate-900 tracking-tight flex items-center gap-2">
          <FolderHeart className="text-slate-700" size={18} />
          <span>Bộ sưu tập địa điểm tuyển chọn</span>
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Bộ sưu tập do Ban biên tập định hướng theo chủ đề du lịch và ẩm thực
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {collections.map((col) => (
          <div key={col.id} className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
            <img src={col.img} alt="" className="w-full h-40 rounded-xl object-cover" />
            <h4 className="font-bold text-sm text-slate-900">{col.name}</h4>
            <span className="text-xs text-slate-500 font-medium block">{col.count} địa điểm tuyển chọn</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── TAB 8: PROVINCES ── */
export function ProvincesTab() {
  const provinces = [
    { name: "Đà Nẵng", places: 16, completeness: "88%", active: true },
    { name: "Quảng Nam", places: 8, completeness: "83%", active: true },
    { name: "Thừa Thiên Huế", places: 4, completeness: "75%", active: true },
    { name: "Khánh Hòa", places: 3, completeness: "70%", active: false },
    { name: "Lâm Đồng", places: 5, completeness: "85%", active: true },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <h2 className="font-bold text-base text-slate-900 tracking-tight flex items-center gap-2">
          <Compass className="text-slate-700" size={18} />
          <span>Tỉnh/Thành trong vùng phụ trách</span>
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Vùng Duyên hải Nam Trung Bộ &amp; Tây Nguyên (Admin cấp 1)
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 text-xs">
        {provinces.map((prv) => (
          <div key={prv.name} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-sm text-slate-900">{prv.name}</h4>
              <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold text-[10px]">
                {prv.completeness} độ phủ
              </span>
            </div>
            <span className="text-slate-500 block">{prv.places} địa điểm ẩm thực đã duyệt</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── TAB 9: BLOGS ── */
export function BlogsTab({ blogsList }: { blogsList: AdminBlogItem[] }) {
  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <h2 className="font-bold text-base text-slate-900 tracking-tight flex items-center gap-2">
          <BookOpen className="text-slate-700" size={18} />
          <span>Blog &amp; Cẩm nang du lịch</span>
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Kiểm duyệt và quản lý các bài viết cẩm nang trải nghiệm
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {blogsList.map((blog) => (
          <div key={blog.id} className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex gap-4">
            <img src={blog.coverImg} alt="" className="w-28 h-28 rounded-xl object-cover shrink-0" />
            <div className="space-y-1.5 text-xs">
              <h4 className="font-bold text-slate-900 line-clamp-2 text-sm">{blog.title}</h4>
              <p className="text-slate-500 line-clamp-2 leading-relaxed">{blog.summary}</p>
              <span className="text-slate-400 text-[11px] block">Tác giả: {blog.authorName}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── TAB 10: CATEGORIES ── */
export function CategoriesTab({ currentAdminInfo }: { currentAdminInfo: AdminAssignmentInfo }) {
  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <h2 className="font-bold text-base text-slate-900 tracking-tight flex items-center gap-2">
          <Layers className="text-slate-700" size={18} />
          <span>Danh mục hệ thống (Chế độ chỉ xem)</span>
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Phân quyền Admin cấp 1: Quản lý 3 danh mục ngành Ẩm thực được phân công
        </p>
      </div>

      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs divide-y divide-slate-100 text-xs">
        {currentAdminInfo.assignedCategories.map((cat, idx) => (
          <div key={idx} className="py-3.5 flex items-center justify-between first:pt-0 last:pb-0">
            <span className="font-semibold text-slate-900 text-sm">{cat}</span>
            <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-medium text-[11px] flex items-center gap-1.5">
              <CheckCircle2 size={13} className="text-emerald-600" />
              <span>Được phân quyền quản lý</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── TAB 11: NOTIFICATIONS & PROFILE ── */
export function NotificationsProfileTab({ currentAdminInfo }: { currentAdminInfo: AdminAssignmentInfo }) {
  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center gap-4">
          <img
            src={currentAdminInfo.adminAvatar}
            alt=""
            className="w-16 h-16 rounded-full object-cover ring-2 ring-slate-200"
          />
          <div>
            <h2 className="font-bold text-lg text-slate-900">{currentAdminInfo.adminName}</h2>
            <span className="text-xs text-slate-500 font-medium">{currentAdminInfo.roleTitle}</span>
            <span className="text-xs text-slate-400 block mt-0.5">{currentAdminInfo.adminEmail}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── TAB 12: AUDIT LOGS ── */
export function AuditLogsTab({ auditLogs }: { auditLogs: AdminAuditLog[] }) {
  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <h2 className="font-bold text-base text-slate-900 tracking-tight flex items-center gap-2">
          <History className="text-slate-700" size={18} />
          <span>Nhật ký kiểm toán hệ thống (Audit Trail)</span>
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Lưu trữ vết hành động duyệt, ẩn, sửa, xử lý báo cáo phục vụ giám sát minh bạch
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden text-xs">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100 text-[11px]">
            <tr>
              <th className="py-3 px-4">Thời gian</th>
              <th className="py-3 px-4">Hành động</th>
              <th className="py-3 px-4">Đối tượng</th>
              <th className="py-3 px-4">Chi tiết ghi chú</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {auditLogs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                <td className="py-3 px-4 text-slate-400">{log.timestamp}</td>
                <td className="py-3 px-4 font-semibold text-slate-800">{log.action}</td>
                <td className="py-3 px-4 text-slate-900 font-medium">{log.targetName || "—"}</td>
                <td className="py-3 px-4 text-slate-500">{log.details}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
