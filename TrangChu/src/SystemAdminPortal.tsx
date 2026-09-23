import { useState } from "react";
import { places as seededPlaces } from "./data";
import PermissionsTab from "./admin/tabs/PermissionsTab";
import SystemReportsTab from "./admin/tabs/SystemReportsTab";
import SystemSettingsTab from "./admin/tabs/SystemSettingsTab";
import DashboardTab from "./admin/tabs/DashboardTab";
import UsersTab from "./admin/tabs/UsersTab";
import SystemRegionsTab from "./admin/tabs/SystemRegionsTab";
import SystemTaxonomyTab from "./admin/tabs/SystemTaxonomyTab";
import SystemFoodsTab from "./admin/tabs/SystemFoodsTab";
import { initialAdminBlogs, initialAdminProposals, initialAdminReports } from "./adminData";
import {
  Activity,
  AlertTriangle,
  ArrowLeftRight,
  Award,
  BarChart3,
  Bell,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronDown,
  ClipboardCheck,
  Database,
  FileClock,
  Filter,
  Flame,
  FolderHeart,
  Globe2,
  LayoutDashboard,
  LockKeyhole,
  MapPin,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  RefreshCw,
  Save,
  Search,
  Settings2,
  ShieldCheck,
  SlidersHorizontal,
  Star,
  TrendingUp,
  Utensils,
  UserCog,
  Users,
  X,
} from "lucide-react";

type SystemTab = "overview" | "users" | "admins" | "master_data" | "regions" | "taxonomy" | "foods" | "places" | "collections" | "blogs" | "complaints" | "audit" | "settings";
type AdminLevel = "SYSTEM_ADMIN" | "CATEGORY_ADMIN";

interface SystemAdminPortalProps {
  onBackToUserView: () => void;
  onOpenCategoryAdmin: () => void;
  showToast: (message: string) => void;
}

const adminRows = [
  { id: 12, name: "Nguyễn Minh Anh", email: "minhanh@langthang.vn", level: "SYSTEM_ADMIN" as AdminLevel, scope: "Toàn hệ thống", status: "Đang hoạt động", tasks: 248 },
  { id: 18, name: "Trần Quốc Bảo", email: "quocbao@langthang.vn", level: "CATEGORY_ADMIN" as AdminLevel, scope: "Miền Trung · 3 danh mục", status: "Đang hoạt động", tasks: 86 },
  { id: 25, name: "Lê Hoàng Mai", email: "hoangmai@langthang.vn", level: "CATEGORY_ADMIN" as AdminLevel, scope: "Miền Bắc · 2 danh mục", status: "Đang hoạt động", tasks: 64 },
  { id: 31, name: "Phạm Đức Long", email: "duclong@langthang.vn", level: "CATEGORY_ADMIN" as AdminLevel, scope: "Chưa gán phạm vi", status: "Chờ bàn giao", tasks: 0 },
];

const userRows = [
  { id: 10482, name: "Nguyễn Hoàng Long", email: "long.nguyen@gmail.com", rank: "Khám phá viên", reputation: 82, status: "Hoạt động", activity: "Báo cáo 4 nội dung · 2 giờ trước" },
  { id: 10317, name: "Trần Minh Quang", email: "quang.tran@gmail.com", rank: "Người đồng hành", reputation: 64, status: "Hoạt động", activity: "Đánh giá 3 địa điểm · hôm nay" },
  { id: 10098, name: "Tài khoản quảng cáo 247", email: "spam247@sample.com", rank: "Tân binh", reputation: 4, status: "Đang xem xét", activity: "89 bình luận bị báo cáo · hôm nay" },
];

type AdminRow = (typeof adminRows)[number];

const assignableUsers = [
  ...userRows.map((user) => ({ id: user.id, name: user.name, email: user.email })),
  { id: 10401, name: "Lê Thu Hà", email: "ha.le@gmail.com" },
  { id: 10388, name: "Đỗ Minh Khang", email: "khang.do@gmail.com" },
  { id: 10276, name: "Phan Gia Huy", email: "huy.phan@gmail.com" },
];

const scopeOptions = ["Miền Bắc", "Miền Trung", "Miền Nam", "Ẩm thực", "Lưu trú", "Điểm tham quan"];

const complaintRows = [
  { id: "KN-2026-091", title: "Khiếu nại quyết định ẩn đánh giá", sender: "Nguyễn Hoàng Long", assignee: "Chưa phân công", priority: "Cao", status: "Chờ xem xét", time: "18 phút trước" },
  { id: "KN-2026-087", title: "Đề nghị mở lại địa điểm bị từ chối", sender: "Hộ kinh doanh Bếp Trang", assignee: "Trần Quốc Bảo", priority: "Thường", status: "Đang xử lý", time: "1 giờ trước" },
  { id: "KN-2026-082", title: "Phản hồi về khóa tài khoản nhầm", sender: "Lê Thu Hà", assignee: "Nguyễn Minh Anh", priority: "Cao", status: "Đã phản hồi", time: "Hôm qua" },
];

const auditRows = [
  ["Vừa xong", "Nguyễn Minh Anh", "Cập nhật quyền", "Trần Quốc Bảo", "CATEGORY_ADMIN → SYSTEM_ADMIN", "Thành công"],
  ["12 phút trước", "Trần Quốc Bảo", "Ẩn địa điểm", "Places #1842", "Sai thông tin theo báo cáo", "Thành công"],
  ["28 phút trước", "Nguyễn Minh Anh", "Khóa tài khoản", "Users #10098", "Spam hàng loạt", "Thành công"],
  ["Hôm qua", "Lê Hoàng Mai", "Duyệt đề xuất", "Proposals #771", "Bổ sung địa chỉ hợp lệ", "Thành công"],
];

const navGroups: { label: string; items: { id: SystemTab; label: string; icon: typeof LayoutDashboard; count?: string }[] }[] = [
  { label: "Tổng quan", items: [{ id: "overview", label: "Dashboard", icon: LayoutDashboard }] },
  { label: "Quản trị tài khoản", items: [{ id: "users", label: "Người dùng", icon: Users }, { id: "admins", label: "Admin cấp 1", icon: UserCog }] },
  { label: "Dữ liệu hệ thống", items: [{ id: "regions", label: "Vùng miền & Tỉnh thành", icon: Globe2 }, { id: "taxonomy", label: "Loại địa điểm & Danh mục", icon: SlidersHorizontal }, { id: "foods", label: "Từ điển món ăn", icon: Utensils }] },
  { label: "Nội dung", items: [{ id: "places", label: "Địa điểm", icon: MapPin }, { id: "collections", label: "Bộ sưu tập", icon: FolderHeart }, { id: "blogs", label: "Cẩm nang / Blog", icon: BookOpen }] },
  { label: "Kiểm duyệt", items: [{ id: "complaints", label: "Report & Khiếu nại", icon: AlertTriangle, count: "12" }, { id: "audit", label: "Audit Log", icon: FileClock }] },
  { label: "Hệ thống", items: [{ id: "settings", label: "Cấu hình", icon: Settings2 }] },
];

const tabMeta = navGroups.flatMap((group) => group.items);

const contentTabData: Record<Exclude<SystemTab, "overview" | "users" | "admins" | "master_data" | "complaints" | "audit" | "settings">, { title: string; description: string; count: string; fields: string[]; rows: string[][] }> = {
  regions: { title: "Vùng miền & Tỉnh thành", description: "Quản lý Regions và Provinces, thứ tự hiển thị, Featured và trạng thái ẩn/hiện.", count: "3 miền · 63 tỉnh thành", fields: ["Tên hiển thị", "Miền cha", "Featured", "Địa điểm", "Trạng thái"], rows: [["Miền Bắc", "—", "Có", "486", "Đang hiển thị"], ["Miền Trung", "—", "Có", "672", "Đang hiển thị"], ["Miền Nam", "—", "Không", "684", "Đang hiển thị"], ["Đà Nẵng", "Miền Trung", "Có", "142", "Đang hiển thị"]] },
  taxonomy: { title: "Loại địa điểm & Danh mục", description: "Quản lý PlaceTypes, Categories và cảnh báo phạm vi Admin cấp 1 trước khi ẩn hoặc gộp.", count: "4 loại · 18 danh mục", fields: ["Tên danh mục", "Loại cha", "Admin phụ trách", "Địa điểm", "Trạng thái"], rows: [["Nhà hàng & Quán ăn", "Ẩm thực", "3 admin", "628", "Đang dùng"], ["Quán cà phê", "Ẩm thực", "2 admin", "284", "Đang dùng"], ["Điểm tham quan", "Du lịch", "4 admin", "390", "Đang dùng"], ["Homestay", "Lưu trú", "1 admin", "126", "Đang dùng"]] },
  foods: { title: "Từ điển món ăn", description: "Kho món ăn và đặc sản độc lập với phạm vi Admin cấp 1, do System Admin quản lý toàn quốc.", count: "248 món · 63 tỉnh", fields: ["Tên món", "Tỉnh / nguồn gốc", "Địa điểm liên kết", "Cập nhật", "Trạng thái"], rows: [["Mì Quảng", "Quảng Nam", "86", "Hôm nay", "Đang hiển thị"], ["Bún bò Huế", "Thừa Thiên Huế", "54", "Hôm qua", "Đang hiển thị"], ["Bánh xèo", "Miền Nam", "39", "18/09/2026", "Đang hiển thị"], ["Cơm tấm", "TP. Hồ Chí Minh", "41", "16/09/2026", "Bản nháp"]] },
  places: { title: "Địa điểm toàn hệ thống", description: "System Admin xem và xử lý địa điểm không giới hạn danh mục, miền hoặc Admin phụ trách.", count: "1.842 địa điểm · 37 chờ duyệt", fields: ["Địa điểm", "Tỉnh / danh mục", "Nguồn", "Trạng thái", "Phụ trách"], rows: [["Mì Quảng Ếch Bếp Trang", "Đà Nẵng · Ẩm thực", "Cộng đồng", "Chờ duyệt", "Trần Quốc Bảo"], ["Bánh Tráng Cuốn Thịt Heo Hoàng Tín", "Đà Nẵng · Ẩm thực", "Cộng đồng", "Đã duyệt", "Trần Quốc Bảo"], ["Ninh Bình Riverside", "Ninh Bình · Du lịch", "Admin tạo", "Đã duyệt", "System Admin"], ["Cà phê Đồi Gió", "Đà Lạt · Ẩm thực", "Cộng đồng", "Đang ẩn", "Chưa gán"]] },
  collections: { title: "Bộ sưu tập", description: "Tạo bộ sưu tập, ghim địa điểm, đặt Featured và kiểm soát thứ tự hiển thị trang chủ.", count: "12 bộ sưu tập · 5 nổi bật", fields: ["Tên bộ sưu tập", "Tỉnh / chủ đề", "Số địa điểm", "Featured", "Trạng thái"], rows: [["Top quán Mì Quảng Đà Nẵng", "Đà Nẵng", "10", "Có", "Đang hiển thị"], ["Hương vị Phố cổ Hội An", "Quảng Nam", "12", "Có", "Đang hiển thị"], ["Cà phê ngắm hoàng hôn", "Toàn quốc", "8", "Không", "Bản nháp"]] },
  blogs: { title: "Cẩm nang / Blog", description: "Biên tập bài viết, gắn địa điểm, quản lý chủ đề, nổi bật và trạng thái xuất bản.", count: "86 bài viết · 14 bản nháp", fields: ["Tiêu đề", "Tác giả", "Chủ đề", "Thời gian đọc", "Trạng thái"], rows: [["Một ngày lang thang ở Đà Nẵng", "Ban biên tập", "Hành trình", "6 phút", "Đã xuất bản"], ["Ăn gì ở Hội An?", "Lê Hoàng Mai", "Ẩm thực", "4 phút", "Chờ duyệt"], ["Cẩm nang khám phá Tây Bắc", "Ban biên tập", "Điểm đến", "8 phút", "Nổi bật"]] },
};

function Badge({ children, tone = "slate" }: { children: React.ReactNode; tone?: "green" | "amber" | "red" | "blue" | "orange" | "slate" }) {
  const colors = { green: "bg-emerald-50 text-emerald-700", amber: "bg-amber-50 text-amber-700", red: "bg-rose-50 text-rose-700", blue: "bg-blue-50 text-blue-700", orange: "bg-orange-50 text-orange-700", slate: "bg-slate-100 text-slate-600" };
  return <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold ${colors[tone]}`}>{children}</span>;
}

function MetricCard({ label, value, note, icon: Icon, accent, trend }: { label: string; value: string; note: string; icon: typeof Users; accent: string; trend?: string }) {
  return (
    <div className="relative group overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
      <div className="flex items-start justify-between">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{label}</span>
          <div className="mt-2 text-2xl sm:text-3xl font-black tracking-tight text-slate-900">{value}</div>
        </div>
        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-2xs transition-transform group-hover:scale-105 ${accent}`}>
          <Icon size={20} />
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between gap-2 pt-2.5 border-t border-slate-100 text-xs">
        <span className="text-[11px] text-slate-500 font-medium truncate">{note}</span>
        {trend && (
          <span className="inline-flex items-center gap-0.5 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60 shrink-0">
            {trend}
          </span>
        )}
      </div>
    </div>
  );
}

function ContentManagementTab({ tab, onNotify }: { tab: Exclude<SystemTab, "overview" | "users" | "admins" | "master_data" | "complaints" | "audit" | "settings">; onNotify: (message: string) => void }) {
  const data = contentTabData[tab];
  const [selectedRecord, setSelectedRecord] = useState<{ title: string; subtitle: string; status: string; description: string } | null>(null);

  const renderStatusBadge = (value: string) => {
    const tone = value.includes("ẩn") || value.includes("Nháp") || value.includes("Chờ") ? "amber" : value.includes("Không") ? "slate" : "green";
    return <Badge tone={tone}>{value}</Badge>;
  };

  const isRegionsTab = tab === "regions";
  const listRows = data.rows.map((row) => ({
    name: row[0],
    parent: row[1],
    featured: row[2],
    count: row[3],
    status: row[4],
  }));

  const openDetail = (rowTitle: string, rowStatus: string) => {
    const safeTitle = rowTitle || "Mục quản lý";
    setSelectedRecord({
      title: safeTitle,
      subtitle: `${data.title} · ${tab}`,
      status: rowStatus,
      description: `Phần này cho phép xem chi tiết, cập nhật trạng thái, gán admin phụ trách và kiểm tra lịch sử chỉnh sửa của ${safeTitle}.`,
    });
    onNotify(`Đã mở chi tiết ${safeTitle}.`);
  };

  const openCreate = () => {
    setSelectedRecord({
      title: `Thêm ${data.title.toLowerCase()}`,
      subtitle: `${data.title} · Mới`,
      status: "Nháp",
      description: `Biểu mẫu tạo mới cho ${data.title.toLowerCase()} với thông tin cơ bản, trạng thái, và quyền quản lý liên quan.`,
    });
    onNotify(`Đã mở biểu mẫu thêm ${data.title.toLowerCase()}.`);
  };

  return <>
    <section className="space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 px-5 py-4">
          <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-400">
            <span>Điều phối</span>
            <span>/</span>
            <span className="text-slate-600">{data.title}</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => onNotify(`Đã xuất dữ liệu ${data.title} dạng CSV.`)} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-[11px] font-bold text-slate-600 hover:bg-slate-50">Xuất CSV</button>
            <button onClick={openCreate} className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-4 py-2.5 text-[11px] font-bold text-white shadow-sm transition"><Plus size={15} />Thêm mới</button>
          </div>
        </div>

        <div className="px-5 py-5">
          <div className="flex flex-wrap items-end justify-between gap-4 pb-4">
            <div>
              <h2 className="text-[19px] font-black tracking-[-0.02em] text-slate-950">{data.title}</h2>
              <p className="mt-1 text-sm text-slate-500">{data.description}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pb-4">
            <div className="relative min-w-[260px] flex-1">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-xs text-slate-700 outline-none transition focus:border-emerald-500 focus:bg-white" placeholder={`Tìm trong ${data.title.toLowerCase()}...`} />
            </div>
            <button onClick={() => onNotify("Đã mở bộ lọc trạng thái và phạm vi.")} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-[11px] font-bold text-slate-600 hover:bg-slate-50">
              <Filter size={14} />Bộ lọc
            </button>
            <span className="ml-auto text-[11px] font-semibold text-slate-400">{data.count}</span>
          </div>

          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[880px] text-left text-xs">
                <thead className="bg-slate-50 text-[10px] font-black uppercase tracking-[0.12em] text-slate-400">
                  <tr>
                    {isRegionsTab ? (
                      <>
                        <th className="px-5 py-3">Vùng miền</th>
                        <th className="px-5 py-3">Thuộc miền</th>
                        <th className="px-5 py-3">Nổi bật</th>
                        <th className="px-5 py-3">Số địa điểm</th>
                        <th className="px-5 py-3">Trạng thái</th>
                        <th className="px-5 py-3 text-right">Thao tác</th>
                      </>
                    ) : (
                      <>
                        {data.fields.map((field) => <th key={field} className="px-4 py-3">{field}</th>)}
                        <th className="px-4 py-3 text-right">Thao tác</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {isRegionsTab ? listRows.map((row) => (
                    <tr key={row.name} className="hover:bg-slate-50/70">
                      <td className="px-5 py-4 font-bold text-slate-900">{row.name}</td>
                      <td className="px-5 py-4 text-slate-600">{row.parent || "—"}</td>
                      <td className="px-5 py-4 font-medium text-slate-600">{row.featured}</td>
                      <td className="px-5 py-4 font-semibold text-slate-800">{row.count}</td>
                      <td className="px-5 py-4">{renderStatusBadge(row.status)}</td>
                      <td className="px-5 py-4 text-right"><button onClick={() => openDetail(row.name, row.status)} className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-bold text-slate-600 hover:border-emerald-600 hover:text-emerald-600 transition">Chi tiết</button></td>
                    </tr>
                  )) : data.rows.map((row) => (
                    <tr key={row[0]} className="hover:bg-slate-50/70">
                      {row.map((cell, index) => <td key={`${row[0]}-${index}`} className={`px-4 py-3 ${index === 0 ? "font-bold text-slate-900" : "text-slate-600"}`}>{index === row.length - 1 ? renderStatusBadge(cell) : cell}</td>)}
                      <td className="px-4 py-3 text-right"><button onClick={() => openDetail(row[0], row[row.length - 1])} className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-bold text-slate-600 hover:border-emerald-600 hover:text-emerald-600 transition">Chi tiết</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>

    {selectedRecord && <div className="fixed inset-0 z-40 flex justify-end bg-slate-950/30" role="dialog" aria-modal="true">
      <div className="h-full w-full max-w-xl overflow-y-auto bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <div className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">{selectedRecord.subtitle}</div>
            <h3 className="mt-1 text-xl font-black text-slate-950">{selectedRecord.title}</h3>
          </div>
          <button onClick={() => setSelectedRecord(null)} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700" aria-label="Đóng chi tiết"><X size={18} /></button>
        </div>

        <div className="space-y-5 p-5">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-[10px] font-black uppercase tracking-[0.12em] text-slate-400">Trạng thái</div>
                <div className="mt-1 text-sm font-bold text-slate-800">{selectedRecord.status}</div>
              </div>
              <Badge tone={selectedRecord.status.includes("Nháp") || selectedRecord.status.includes("Chờ") || selectedRecord.status.includes("ẩn") ? "amber" : "green"}>{selectedRecord.status}</Badge>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.12em] text-slate-400">Mô tả</label>
            <p className="rounded-xl border border-slate-200 bg-white p-3 text-sm leading-6 text-slate-600">{selectedRecord.description}</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-white p-3">
              <div className="text-[10px] font-black uppercase tracking-[0.12em] text-slate-400">Phụ trách</div>
              <div className="mt-2 text-sm font-bold text-slate-800">Trần Quốc Bảo</div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-3">
              <div className="text-[10px] font-black uppercase tracking-[0.12em] text-slate-400">Miền / Danh mục</div>
              <div className="mt-2 text-sm font-bold text-slate-800">Miền Trung · Ẩm thực</div>
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-[11px] font-black uppercase tracking-[0.12em] text-slate-400">Chỉnh sửa nhanh</label>
            <textarea defaultValue="Cập nhật thông tin, kiểm tra nội dung và kiểm soát trạng thái để đảm bảo tính nhất quán thông tin trên portal." className="min-h-[120px] w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-[#0F2742]" />
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            <button onClick={() => { setSelectedRecord(null); onNotify(`Đã lưu thay đổi cho ${selectedRecord.title}.`); }} className="rounded-xl bg-[#0F2742] px-4 py-2.5 text-[11px] font-bold text-white">Lưu thay đổi</button>
            <button onClick={() => { setSelectedRecord(null); onNotify(`Đã ẩn ${selectedRecord.title}.`); }} className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-[11px] font-bold text-amber-700">Ẩn / khóa</button>
            <button onClick={() => { setSelectedRecord(null); onNotify(`Đã giao lại ${selectedRecord.title} cho admin khác.`); }} className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-[11px] font-bold text-slate-600">Giao cho admin</button>
          </div>
        </div>
      </div>
    </div>}
  </>;
}

function GrantAdminModal({ onClose, onConfirm }: { onClose: () => void; onConfirm: (user: (typeof assignableUsers)[number], level: AdminLevel, scopes: string[]) => void }) {
  const [query, setQuery] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [level, setLevel] = useState<AdminLevel>("CATEGORY_ADMIN");
  const [scopes, setScopes] = useState<string[]>([]);
  const filteredUsers = assignableUsers.filter((user) => `${user.id} ${user.name} ${user.email}`.toLowerCase().includes(query.toLowerCase()));
  const selectedUser = assignableUsers.find((user) => user.id === selectedUserId);
  const toggleScope = (scope: string) => setScopes((current) => current.includes(scope) ? current.filter((item) => item !== scope) : [...current, scope]);

  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4" role="dialog" aria-modal="true">
    <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
      <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5"><div><h2 className="text-lg font-black text-slate-950">Cấp quyền quản trị</h2><p className="mt-1 text-xs text-slate-500">Chọn tài khoản người dùng và phạm vi được phép quản lý.</p></div><button onClick={onClose} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100" aria-label="Đóng"><X size={18} /></button></div>
      <div className="space-y-5 p-6">
        <div><label className="mb-2 block text-xs font-bold text-slate-700">Tìm người dùng</label><div className="relative"><Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm theo ID, họ tên hoặc email..." className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-[#0F2742] focus:bg-white" /></div><div className="mt-2 max-h-40 overflow-y-auto rounded-xl border border-slate-200">{filteredUsers.length ? filteredUsers.map((user) => <button key={user.id} onClick={() => setSelectedUserId(user.id)} className={`flex w-full items-center justify-between border-b border-slate-100 px-4 py-3 text-left last:border-0 ${selectedUserId === user.id ? "bg-blue-50" : "hover:bg-slate-50"}`}><span><span className="block text-sm font-bold text-slate-800">{user.name}</span><span className="text-[11px] text-slate-400">#{user.id} · {user.email}</span></span>{selectedUserId === user.id && <Check size={16} className="text-blue-700" />}</button>) : <div className="p-4 text-xs text-slate-400">Không tìm thấy người dùng phù hợp.</div>}</div></div>
        <div><label className="mb-2 block text-xs font-bold text-slate-700">Cấp quyền</label><div className="grid gap-3 sm:grid-cols-2"><button onClick={() => setLevel("CATEGORY_ADMIN")} className={`rounded-xl border p-3 text-left ${level === "CATEGORY_ADMIN" ? "border-blue-500 bg-blue-50" : "border-slate-200"}`}><span className="block text-sm font-bold text-slate-800">Admin cấp 1</span><span className="mt-1 block text-[11px] text-slate-500">Chỉ xử lý trong phạm vi được gán.</span></button><button onClick={() => setLevel("SYSTEM_ADMIN")} className={`rounded-xl border p-3 text-left ${level === "SYSTEM_ADMIN" ? "border-[#0F2742] bg-slate-50" : "border-slate-200"}`}><span className="block text-sm font-bold text-slate-800">System Admin</span><span className="mt-1 block text-[11px] text-slate-500">Toàn quyền trên hệ thống.</span></button></div></div>
        {level === "CATEGORY_ADMIN" && <div><div className="mb-2 flex items-center justify-between"><label className="text-xs font-bold text-slate-700">Phạm vi quản lý</label><span className="text-[11px] text-slate-400">{scopes.length} mục đã chọn</span></div><div className="grid gap-2 sm:grid-cols-3">{scopeOptions.map((scope) => <label key={scope} className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold ${scopes.includes(scope) ? "border-blue-300 bg-blue-50 text-blue-800" : "border-slate-200 text-slate-600"}`}><input type="checkbox" checked={scopes.includes(scope)} onChange={() => toggleScope(scope)} className="accent-blue-700" />{scope}</label>)}</div></div>}
        <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 text-xs"><span className="text-slate-500">Tài khoản được chọn</span><strong className="text-right text-slate-800">{selectedUser ? `${selectedUser.name} · ${level === "SYSTEM_ADMIN" ? "System Admin" : "Admin cấp 1"}` : "Chưa chọn người dùng"}</strong></div>
      </div>
      <div className="flex justify-end gap-2 border-t border-slate-100 px-6 py-4"><button onClick={onClose} className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-600">Hủy</button><button disabled={!selectedUser || (level === "CATEGORY_ADMIN" && scopes.length === 0)} onClick={() => selectedUser && onConfirm(selectedUser, level, level === "SYSTEM_ADMIN" ? ["Toàn hệ thống"] : scopes)} className="rounded-xl bg-[#0F2742] px-4 py-2.5 text-xs font-bold text-white disabled:cursor-not-allowed disabled:opacity-40">Xác nhận cấp quyền</button></div>
    </div>
  </div>;
}

export default function SystemAdminPortal({ onBackToUserView, onOpenCategoryAdmin, showToast }: SystemAdminPortalProps) {
  const [activeTab, setActiveTab] = useState<SystemTab>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [maintenance, setMaintenance] = useState(false);
  const [autoApprovePlaces, setAutoApprovePlaces] = useState(false);
  const [autoApproveReviews, setAutoApproveReviews] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [selectedAdmin, setSelectedAdmin] = useState<number | null>(null);
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const [selectedComplaint, setSelectedComplaint] = useState<string | null>(null);
  const [admins, setAdmins] = useState<AdminRow[]>(adminRows);
  const [grantAdminOpen, setGrantAdminOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, title: "Báo cáo vi phạm mới", detail: "Có 3 phản ánh mới cần rà soát trong Miền Trung.", time: "2 phút trước", unread: true, level: "Cao" },
    { id: 2, title: "Phân quyền chờ xử lý", detail: "Lê Thu Hà đã gửi yêu cầu cấp quyền Admin cấp 1.", time: "17 phút trước", unread: true, level: "Mới" },
    { id: 3, title: "Bàn giao phạm vi", detail: "Admin Miền Nam vừa chuyển 2 danh mục sang admin khác.", time: "1 giờ trước", unread: false, level: "Thông tin" },
    { id: 4, title: "Tài khoản spam cảnh báo", detail: "Có 89 bình luận bị báo cáo trong 24 giờ qua.", time: "Hôm qua", unread: false, level: "Cảnh báo" },
  ]);

  const currentLabel = tabMeta.find((tab) => tab.id === activeTab)?.label;
  const unreadNotifications = notifications.filter((item) => item.unread).length;
  const notify = (message: string) => showToast(message);
  const totalPlaces = seededPlaces.length;
  const pendingPlaces = seededPlaces.filter((place) => (place as any).status === "Chờ duyệt").length;
  const pendingProposals = initialAdminProposals.filter((proposal) => proposal.status === 0).length;
  const pendingReports = initialAdminReports.filter((report) => report.status === 0).length;
  const publishedBlogs = initialAdminBlogs.length;
  const regionRows = [
    { name: "Miền Bắc", places: seededPlaces.filter((place) => ["Hà Nội", "Lào Cai", "Ninh Bình", "Hà Giang"].includes(place.province)).length },
    { name: "Miền Trung", places: seededPlaces.filter((place) => ["Đà Nẵng", "Quảng Nam", "Thừa Thiên Huế"].includes(place.province)).length },
    { name: "Miền Nam", places: seededPlaces.filter((place) => ["TP. Hồ Chí Minh", "Vũng Tàu", "Phú Quốc", "Cần Thơ", "An Giang"].includes(place.province)).length },
  ];
  const dashboardWatchlist = seededPlaces.slice(0, 4).map((place, index) => ({
    id: place.id,
    title: place.name,
    image: place.img,
    category: place.category,
    province: place.province,
    status: index % 2 === 0 ? "Chờ duyệt" : "Cần bổ sung",
    owner: index === 0 ? "Trần Quốc Bảo" : index === 1 ? "Lê Hoàng Mai" : "Nguyễn Minh Anh",
  }));
  const reviewQueue = initialAdminProposals.slice(0, 3).map((proposal) => ({
    id: proposal.id,
    title: proposal.type === "NEW_PLACE" ? proposal.proposedData.name : (proposal.targetPlaceName ?? proposal.proposedData.name),
    subtitle: `${proposal.province} • ${proposal.category}`,
    image: proposal.proposedData.coverImg,
    age: proposal.createdAt,
    priority: proposal.province.includes("Đà") ? "Cao" : "Thường",
  }));

  return <div className="min-h-screen bg-[#F1F5F9] text-slate-800 flex font-sans antialiased">
    {sidebarOpen && <div className="fixed inset-0 z-30 bg-slate-950/40 backdrop-blur-xs lg:hidden" onClick={() => setSidebarOpen(false)} />}
    <aside className={`${sidebarOpen ? "w-64 translate-x-0" : "-translate-x-full lg:w-20 lg:translate-x-0"} fixed lg:sticky top-0 z-40 flex h-screen shrink-0 flex-col overflow-hidden border-r border-emerald-900/60 bg-[#06281E] text-emerald-100 shadow-[4px_0_24px_rgba(0,0,0,0.22)] transition-all duration-300`}>
      <div className="flex h-16 items-center justify-between border-b border-emerald-900/60 px-5 bg-[#031d16]">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500 text-[10px] font-black text-white shadow-md shadow-emerald-500/40">LT</div>
          {sidebarOpen && <div><div className="font-black tracking-tight text-white">LangThang</div><div className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">System Admin</div></div>}
        </div>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="rounded-lg p-1.5 text-emerald-400/80 hover:bg-white/10 hover:text-white transition cursor-pointer" title="Thu gọn menu">{sidebarOpen ? <PanelLeftClose size={17} /> : <PanelLeftOpen size={17} />}</button>
      </div>
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-4 scrollbar-none">
        {sidebarOpen && <div className="px-3 text-[10px] font-black uppercase tracking-wider text-emerald-300/80">Quản trị toàn hệ thống</div>}
        <div className="space-y-4">
          {navGroups.map((group) => (
            <div key={group.label} className="space-y-1">
              {sidebarOpen && <div className="px-3 pb-1 text-[10px] font-black uppercase tracking-wider text-emerald-300/60">{group.label}</div>}
              {group.items.map(({ id, label, icon: Icon, count }) => (
                <button
                  key={id}
                  onClick={() => { setActiveTab(id); setSelectedAdmin(null); setSelectedUser(null); setSelectedComplaint(null); }}
                  className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs font-semibold transition cursor-pointer ${
                    activeTab === id
                      ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 font-bold"
                      : "text-emerald-100/80 hover:bg-white/10 hover:text-white"
                  }`}
                  title={!sidebarOpen ? label : undefined}
                >
                  <Icon size={16} className={activeTab === id ? "text-white" : "text-emerald-400/80 group-hover:text-emerald-300 transition-colors"} />
                  {sidebarOpen && <span className="truncate">{label}</span>}
                  {sidebarOpen && count && (
                    <span className={`ml-auto rounded-full px-2 py-0.5 text-[9px] font-extrabold ${activeTab === id ? "bg-white text-emerald-700" : "bg-rose-500 text-white"}`}>
                      {count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-emerald-900/60 bg-[#031d16] p-3 space-y-1">
        <button onClick={onOpenCategoryAdmin} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs font-semibold text-emerald-300 hover:bg-white/10 hover:text-white transition cursor-pointer"><ArrowLeftRight size={16} className="text-emerald-400" />{sidebarOpen && <span>Chuyển sang Admin cấp 1</span>}</button>
        <button onClick={onBackToUserView} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs font-semibold text-emerald-400/70 hover:bg-white/10 hover:text-rose-400 transition cursor-pointer"><X size={16} />{sidebarOpen && <span>Về trang người dùng</span>}</button>
      </div>
    </aside>

    <div className="min-w-0 flex-1">
      <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-5 backdrop-blur-md sm:px-6">
        <div className="flex items-center gap-3"><button onClick={() => setSidebarOpen(!sidebarOpen)} className="rounded-xl border border-slate-200 p-2 text-slate-600 lg:hidden"><Menu size={18} /></button><div className="flex items-center gap-2 text-xs font-medium"><span className="text-slate-400">Hệ thống</span><span className="text-slate-300">/</span><span className="font-bold text-slate-900">{currentLabel}</span></div></div>
        <div className="flex items-center gap-3 sm:gap-5"><div className="relative hidden w-64 sm:block"><Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input value={searchText} onChange={(event) => setSearchText(event.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-xs outline-none focus:border-blue-500 focus:bg-white" placeholder="Tìm ID, người dùng, nội dung..." /></div><div className="relative"><button onClick={() => setNotificationsOpen((prev) => !prev)} className="relative rounded-xl p-2 text-slate-500 hover:bg-slate-100"><Bell size={18} />{unreadNotifications > 0 && <span className="absolute right-1.5 top-1.5 min-w-[16px] h-4 px-1 flex items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white">{unreadNotifications > 9 ? "9+" : unreadNotifications}</span>}</button>{notificationsOpen && <div className="absolute right-0 top-12 z-50 w-[360px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.12)]"><div className="flex items-center justify-between border-b border-slate-100 px-4 py-3"><div><div className="text-[10px] font-black uppercase tracking-[0.12em] text-slate-400">Thông báo</div><div className="mt-1 text-sm font-bold text-slate-900">{unreadNotifications} tin chưa đọc</div></div><button onClick={() => { setNotifications((items) => items.map((item) => ({ ...item, unread: false }))); notify("Đã đánh dấu tất cả thông báo là đã đọc."); }} className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2 py-1.5 text-[10px] font-bold text-slate-600 hover:border-slate-300">Đọc hết</button></div><div className="max-h-[360px] overflow-y-auto">{notifications.map((item) => <button key={item.id} onClick={() => { setNotifications((items) => items.map((entry) => entry.id === item.id ? { ...entry, unread: false } : entry)); setNotificationsOpen(false); notify(`${item.title}: ${item.detail}`); }} className={`flex w-full items-start gap-3 border-b border-slate-100 px-4 py-3 text-left transition ${item.unread ? "bg-amber-50/40" : "bg-white"}`}><div className={`mt-1 h-2.5 w-2.5 rounded-full ${item.unread ? "bg-rose-500" : "bg-slate-300"}`} /><div className="min-w-0 flex-1"><div className="flex items-center justify-between gap-3"><span className="text-sm font-bold text-slate-800">{item.title}</span><span className="rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-bold text-slate-500">{item.level}</span></div><p className="mt-1 text-xs leading-5 text-slate-500">{item.detail}</p><div className="mt-2 flex items-center justify-between text-[10px] text-slate-400"><span>{item.time}</span><span className="font-semibold text-slate-500">Chi tiết</span></div></div></button>)}</div></div>}</div><div className="flex items-center gap-2 border-l border-slate-200 pl-3"><div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-xs font-black text-white">MA</div><div className="hidden leading-tight md:block"><div className="text-xs font-bold text-slate-900">Nguyễn Minh Anh</div><div className="text-[10px] font-semibold text-slate-400">System Admin</div></div></div></div>
      </header>

      <main className="mx-auto w-full max-w-[1600px] space-y-4 p-5 sm:p-6">
        {activeTab === "regions" && <SystemRegionsTab onNotify={notify} />}
        {activeTab === "taxonomy" && <SystemTaxonomyTab onNotify={notify} />}
        {activeTab === "foods" && <SystemFoodsTab onNotify={notify} />}

        {(["places", "collections", "blogs"] as const).includes(activeTab as "places" | "collections" | "blogs") && <ContentManagementTab tab={activeTab as "places" | "collections" | "blogs"} onNotify={notify} />}

        {activeTab === "overview" && (
          <DashboardTab
            currentAdminInfo={{
              adminId: 12,
              adminName: "Nguyễn Minh Anh",
              email: "minhanh@langthang.vn",
              region: "Toàn quốc (63 Tỉnh)",
              managedCategories: ["Ẩm thực & Quán ăn", "Khách sạn & Homestay", "Điểm tham quan"],
              assignedProvinces: ["Hà Nội", "Đà Nẵng", "TP. Hồ Chí Minh", "Quảng Nam", "Thừa Thiên Huế", "Lào Cai", "Lâm Đồng"],
            }}
            places={seededPlaces}
            proposals={initialAdminProposals}
            reports={initialAdminReports}
            reportedReviews={[]}
            auditLogs={[]}
            dashRegion="Toàn quốc"
            setDashRegion={() => {}}
            dashProvince="all"
            setDashProvince={() => {}}
            dashTimeRange="30days"
            setDashTimeRange={() => {}}
            setMainTab={(tab) => {
              if (tab === "places") setActiveTab("places");
              else if (tab === "proposals" || tab === "reports") setActiveTab("complaints");
              else if (tab === "permissions") setActiveTab("admins");
              else if (tab === "settings") setActiveTab("settings");
              else if (tab === "audit_logs") setActiveTab("audit");
              else if (tab === "foods") setActiveTab("foods");
              else if (tab === "blogs") setActiveTab("blogs");
              else if (tab === "collections") setActiveTab("collections");
              else if (tab === "provinces") setActiveTab("regions");
            }}
            setPlaceFilterStatus={() => {}}
            setProposalStatusFilter={() => {}}
            setRevComTab={() => {}}
            setRevReportFilter={() => {}}
            setReportSubTab={() => {}}
            setIsAddPlaceModalOpen={() => setGrantAdminOpen(true)}
            showToast={notify}
          />
        )}

        {activeTab === "admins" && <PermissionsTab showToast={notify} />}

        {activeTab === "users" && <UsersTab showToast={notify} />}

        {activeTab === "master_data" && <section className="space-y-5"><div className="flex flex-wrap items-end justify-between gap-3"><div><h2 className="text-2xl font-black text-slate-950">Dữ liệu nền</h2><p className="mt-1 text-sm text-slate-500">Quản lý Regions, Provinces, PlaceTypes, Categories và ReportTypes.</p></div><button onClick={() => notify("Đã mở biểu mẫu thêm dữ liệu nền.")} className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition"><Plus size={15} />Thêm dữ liệu</button></div><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{[["Miền / Regions", "3", "1 nổi bật", Globe2], ["Tỉnh / thành", "63", "58 đang hiển thị", Database], ["Danh mục", "18", "2 chờ gộp", SlidersHorizontal], ["Loại báo cáo", "10", "9 đang bật", AlertTriangle]].map(([label, value, note, Icon]) => <MetricCard key={label as string} label={label as string} value={value as string} note={note as string} icon={Icon as typeof Users} accent="bg-emerald-50 text-emerald-700" />)}</div><div className="grid gap-5 lg:grid-cols-2"><div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><h3 className="font-black text-slate-900">Miền & tỉnh thành</h3><button onClick={() => notify("Đã sắp xếp lại thứ tự hiển thị.")} className="text-xs font-bold text-emerald-600 hover:text-emerald-700">Sắp xếp</button></div><div className="mt-4 space-y-2">{[["Miền Bắc", "25 tỉnh", "Đang hiển thị", "green"], ["Miền Trung", "19 tỉnh", "Đang hiển thị", "green"], ["Miền Nam", "19 tỉnh", "1 tỉnh đang ẩn", "amber"]].map(([name, count, status, tone]) => <div key={name} className="flex items-center gap-3 rounded-xl border border-slate-100 p-3"><div className="rounded-lg bg-emerald-50 p-2 text-emerald-600"><Globe2 size={15} /></div><div className="flex-1"><div className="text-xs font-bold text-slate-800">{name}</div><div className="mt-1 text-[10px] text-slate-400">{count} · {status}</div></div><Badge tone={tone === "green" ? "green" : "amber"}>Đang dùng</Badge><button onClick={() => notify(`Đã mở chỉnh sửa ${name}.`)} className="text-[11px] font-bold text-slate-400 hover:text-emerald-600">Sửa</button></div>)}</div></div><div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><h3 className="font-black text-slate-900">Danh mục & loại báo cáo</h3><button onClick={() => notify("Đã mở trình quản lý danh mục.")} className="text-xs font-bold text-emerald-600 hover:text-emerald-700">Quản lý</button></div><div className="mt-4 space-y-2">{[["Ẩm thực", "6 danh mục", "1.124 địa điểm"], ["Lưu trú", "5 danh mục", "328 địa điểm"], ["Điểm tham quan", "7 danh mục", "390 địa điểm"]].map(([name, categories, places]) => <div key={name} className="flex items-center gap-3 rounded-xl border border-slate-100 p-3"><div className="rounded-lg bg-emerald-50 p-2 text-emerald-600"><SlidersHorizontal size={15} /></div><div className="flex-1"><div className="text-xs font-bold text-slate-800">{name}</div><div className="mt-1 text-[10px] text-slate-400">{categories} · {places}</div></div><button onClick={() => notify(`Đã mở cảnh báo tác động cho ${name}.`)} className="text-[11px] font-bold text-slate-400 hover:text-emerald-600">Xem</button></div>)}</div></div></div></section>}

        {activeTab === "complaints" && <SystemReportsTab showToast={notify} />}

        {activeTab === "settings" && <SystemSettingsTab showToast={notify} />}

        {activeTab === "audit" && <section className="space-y-5"><div className="flex flex-wrap items-end justify-between gap-3"><div><h2 className="text-2xl font-black text-slate-950">Nhật ký toàn hệ thống</h2><p className="mt-1 text-sm text-slate-500">Audit log bất biến: ai làm gì, giá trị cũ/mới và trạng thái thao tác.</p></div><button onClick={() => notify("Đã xuất audit log theo bộ lọc hiện tại.")} className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition"><FileClock size={15} />Xuất CSV</button></div><div className="flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><button className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-3 py-2 text-xs font-bold text-white"><Filter size={14} />Tất cả hành động</button><button className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600">Tất cả admin</button><button className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600">7 ngày qua</button><button onClick={() => notify("Bộ lọc nâng cao đã sẵn sàng.")} className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600">Bộ lọc nâng cao</button></div><div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="overflow-x-auto"><table className="w-full min-w-[850px] text-left text-xs"><thead className="bg-slate-50 text-[10px] font-black uppercase tracking-wider text-slate-400"><tr><th className="px-5 py-3">Thời gian</th><th className="px-5 py-3">Người thực hiện</th><th className="px-5 py-3">Hành động</th><th className="px-5 py-3">Đối tượng</th><th className="px-5 py-3">Thay đổi / lý do</th><th className="px-5 py-3">Trạng thái</th></tr></thead><tbody className="divide-y divide-slate-100">{auditRows.map((row) => <tr key={`${row[0]}-${row[3]}`} className="hover:bg-slate-50/70">{row.map((cell, index) => <td key={cell} className={`px-5 py-4 ${index === 1 || index === 2 || index === 3 ? "font-semibold text-slate-800" : "text-slate-500"}`}>{index === 5 ? <Badge tone="green">{cell}</Badge> : cell}</td>)}</tr>)}</tbody></table></div></div></section>}
      </main>
      {grantAdminOpen && <GrantAdminModal onClose={() => setGrantAdminOpen(false)} onConfirm={(user, level, scopes) => {
        const newAdmin: AdminRow = { id: user.id, name: user.name, email: user.email, level, scope: scopes.join(" · ") || "Chưa gán phạm vi", status: "Đang hoạt động", tasks: 0 };
        setAdmins((current) => [newAdmin, ...current.filter((admin) => admin.id !== user.id)]);
        setGrantAdminOpen(false);
        setSelectedAdmin(user.id);
        notify(`Đã cấp ${level === "SYSTEM_ADMIN" ? "System Admin" : "Admin cấp 1"} cho ${user.name}.`);
      }} />}
    </div>
  </div>;
}