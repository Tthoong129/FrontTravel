import { useState } from "react";
import { places as initialPlaces, Place } from "./data";
import PermissionsTab from "./admin/tabs/PermissionsTab";
import SystemReportsTab from "./admin/tabs/SystemReportsTab";
import SystemSettingsTab from "./admin/tabs/SystemSettingsTab";
import DashboardTab from "./admin/tabs/DashboardTab";
import UsersTab from "./admin/tabs/UsersTab";
import SystemRegionsTab from "./admin/tabs/SystemRegionsTab";
import SystemTaxonomyTab from "./admin/tabs/SystemTaxonomyTab";
import SystemFoodsTab from "./admin/tabs/SystemFoodsTab";
import PlacesTab from "./admin/tabs/PlacesTab";
import TrendingLeaderboardTab from "./admin/tabs/TrendingLeaderboardTab";
import NotificationCenterTab from "./admin/tabs/NotificationCenterTab";
import {
  CollectionsTab,
  BlogsTab,
  AuditLogsTab,
} from "./admin/tabs/OtherTabs";
import AddPlaceModal from "./admin/modals/AddPlaceModal";
import EditPlaceModal from "./admin/modals/EditPlaceModal";
import {
  initialAdminBlogs,
  initialAdminProposals,
  initialAdminReports,
  initialAdminAuditLogs,
  AdminAuditLog,
} from "./adminData";
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
  ArrowRight,
  Trophy,
} from "lucide-react";
import { PlaceDetailTab } from "./admin/types";

type SystemTab =
  | "overview"
  | "users"
  | "admins"
  | "master_data"
  | "regions"
  | "taxonomy"
  | "foods"
  | "places"
  | "leaderboard"
  | "collections"
  | "blogs"
  | "complaints"
  | "notifications"
  | "audit"
  | "settings";

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

const navGroups: { label: string; items: { id: SystemTab; label: string; icon: typeof LayoutDashboard; count?: string }[] }[] = [
  { label: "Tổng quan", items: [{ id: "overview", label: "Dashboard", icon: LayoutDashboard }] },
  { label: "Quản trị tài khoản", items: [{ id: "users", label: "Người dùng", icon: Users }, { id: "admins", label: "Admin cấp 1", icon: UserCog }] },
  { label: "Dữ liệu hệ thống", items: [{ id: "regions", label: "Vùng miền & Tỉnh thành", icon: Globe2 }, { id: "taxonomy", label: "Loại địa điểm & Danh mục", icon: SlidersHorizontal }, { id: "foods", label: "Từ điển món ăn", icon: Utensils }] },
  { label: "Nội dung & Xếp hạng", items: [{ id: "places", label: "Địa điểm", icon: MapPin }, { id: "leaderboard", label: "Bảng xếp hạng", icon: Trophy }, { id: "collections", label: "Bộ sưu tập", icon: FolderHeart }, { id: "blogs", label: "Cẩm nang / Blog", icon: BookOpen }] },
  { label: "Kiểm duyệt", items: [{ id: "complaints", label: "Report & Khiếu nại", icon: AlertTriangle, count: "12" }, { id: "audit", label: "Audit Log", icon: FileClock }] },
  { label: "Hệ thống", items: [{ id: "notifications", label: "Trung tâm thông báo", icon: Bell, count: "4" }, { id: "settings", label: "Cấu hình", icon: Settings2 }] },
];

const tabMeta = navGroups.flatMap((group) => group.items);

function Badge({ children, tone = "slate" }: { children: React.ReactNode; tone?: "green" | "amber" | "red" | "blue" | "orange" | "slate" }) {
  const colors = {
    green: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
    amber: "bg-amber-50 text-amber-700 border-amber-200/80",
    red: "bg-rose-50 text-rose-700 border-rose-200/80",
    blue: "bg-blue-50 text-blue-700 border-blue-200/80",
    orange: "bg-orange-50 text-orange-700 border-orange-200/80",
    slate: "bg-slate-100 text-slate-600 border-slate-200",
  };
  return <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-bold ${colors[tone]}`}>{children}</span>;
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
          <span className="inline-flex items-center gap-0.5 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200/60 shrink-0">
            {trend}
          </span>
        )}
      </div>
    </div>
  );
}

function GrantAdminModal({ onClose, onConfirm }: { onClose: () => void; onConfirm: (user: (typeof assignableUsers)[number], level: AdminLevel, scopes: string[]) => void }) {
  const [query, setQuery] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [level, setLevel] = useState<AdminLevel>("CATEGORY_ADMIN");
  const [scopes, setScopes] = useState<string[]>([]);
  const filteredUsers = assignableUsers.filter((user) => `${user.id} ${user.name} ${user.email}`.toLowerCase().includes(query.toLowerCase()));
  const selectedUser = assignableUsers.find((user) => user.id === selectedUserId);
  const toggleScope = (scope: string) => setScopes((current) => current.includes(scope) ? current.filter((item) => item !== scope) : [...current, scope]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4" role="dialog" aria-modal="true">
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
          <div>
            <h2 className="text-lg font-black text-slate-950">Cấp quyền quản trị</h2>
            <p className="mt-1 text-xs text-slate-500">Chọn tài khoản người dùng và phạm vi được phép quản lý.</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100" aria-label="Đóng">
            <X size={18} />
          </button>
        </div>
        <div className="space-y-5 p-6 text-xs">
          <div>
            <label className="mb-2 block font-bold text-slate-700">Tìm người dùng</label>
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                autoFocus
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Tìm theo ID, họ tên hoặc email..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-xs outline-none focus:border-blue-600 focus:bg-white"
              />
            </div>
            <div className="mt-2 max-h-40 overflow-y-auto rounded-xl border border-slate-200">
              {filteredUsers.length ? (
                filteredUsers.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => setSelectedUserId(user.id)}
                    className={`flex w-full items-center justify-between border-b border-slate-100 px-4 py-3 text-left last:border-0 ${
                      selectedUserId === user.id ? "bg-blue-50" : "hover:bg-slate-50"
                    }`}
                  >
                    <span>
                      <span className="block font-bold text-slate-800">{user.name}</span>
                      <span className="text-[11px] text-slate-400">#{user.id} · {user.email}</span>
                    </span>
                    {selectedUserId === user.id && <Check size={16} className="text-blue-700" />}
                  </button>
                ))
              ) : (
                <div className="p-4 text-xs text-slate-400">Không tìm thấy người dùng phù hợp.</div>
              )}
            </div>
          </div>
          <div>
            <label className="mb-2 block font-bold text-slate-700">Cấp quyền</label>
            <div className="grid gap-3 sm:grid-cols-2">
              <button
                onClick={() => setLevel("CATEGORY_ADMIN")}
                className={`rounded-xl border p-3 text-left ${
                  level === "CATEGORY_ADMIN" ? "border-blue-500 bg-blue-50" : "border-slate-200"
                }`}
              >
                <span className="block font-bold text-slate-800">Admin cấp 1</span>
                <span className="mt-1 block text-[11px] text-slate-500">Chỉ xử lý trong phạm vi được gán.</span>
              </button>
              <button
                onClick={() => setLevel("SYSTEM_ADMIN")}
                className={`rounded-xl border p-3 text-left ${
                  level === "SYSTEM_ADMIN" ? "border-[#0B1E36] bg-slate-50" : "border-slate-200"
                }`}
              >
                <span className="block font-bold text-slate-800">System Admin</span>
                <span className="mt-1 block text-[11px] text-slate-500">Toàn quyền trên hệ thống.</span>
              </button>
            </div>
          </div>
          {level === "CATEGORY_ADMIN" && (
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="font-bold text-slate-700">Phạm vi quản lý</label>
                <span className="text-[11px] text-slate-400">{scopes.length} mục đã chọn</span>
              </div>
              <div className="grid gap-2 sm:grid-cols-3">
                {scopeOptions.map((scope) => (
                  <label
                    key={scope}
                    className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold ${
                      scopes.includes(scope) ? "border-blue-300 bg-blue-50 text-blue-800" : "border-slate-200 text-slate-600"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={scopes.includes(scope)}
                      onChange={() => toggleScope(scope)}
                      className="accent-blue-700"
                    />
                    {scope}
                  </label>
                ))}
              </div>
            </div>
          )}
          <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 text-xs">
            <span className="text-slate-500">Tài khoản được chọn</span>
            <strong className="text-right text-slate-800">
              {selectedUser ? `${selectedUser.name} · ${level === "SYSTEM_ADMIN" ? "System Admin" : "Admin cấp 1"}` : "Chưa chọn người dùng"}
            </strong>
          </div>
        </div>
        <div className="flex justify-end gap-2 border-t border-slate-100 px-6 py-4 text-xs">
          <button onClick={onClose} className="rounded-xl border border-slate-200 px-4 py-2.5 font-bold text-slate-600 hover:bg-slate-50">
            Hủy
          </button>
          <button
            disabled={!selectedUser || (level === "CATEGORY_ADMIN" && scopes.length === 0)}
            onClick={() => selectedUser && onConfirm(selectedUser, level, level === "SYSTEM_ADMIN" ? ["Toàn hệ thống"] : scopes)}
            className="rounded-xl bg-blue-600 hover:bg-blue-700 px-4 py-2.5 font-bold text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            Xác nhận cấp quyền
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SystemAdminPortal({ onBackToUserView, onOpenCategoryAdmin, showToast }: SystemAdminPortalProps) {
  const [activeTab, setActiveTab] = useState<SystemTab>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [grantAdminOpen, setGrantAdminOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, title: "Báo cáo vi phạm mới", detail: "Có 3 phản ánh mới cần rà soát trong Miền Trung.", time: "2 phút trước", unread: true, level: "Cao" },
    { id: 2, title: "Phân quyền chờ xử lý", detail: "Lê Thu Hà đã gửi yêu cầu cấp quyền Admin cấp 1.", time: "17 phút trước", unread: true, level: "Mới" },
    { id: 3, title: "Bàn giao phạm vi", detail: "Admin Miền Nam vừa chuyển 2 danh mục sang admin khác.", time: "1 giờ trước", unread: false, level: "Thông tin" },
    { id: 4, title: "Tài khoản spam cảnh báo", detail: "Có 89 bình luận bị báo cáo trong 24 giờ qua.", time: "Hôm qua", unread: false, level: "Cảnh báo" },
  ]);

  // Places Store for System Admin
  const [placesList, setPlacesList] = useState<Place[]>(() =>
    initialPlaces.map((p, idx) => ({
      ...p,
      statusNum: idx === 0 ? 0 : 1,
      status: idx === 0 ? "Chờ duyệt" : "Đã duyệt",
      type: (p as any).category || "Nhà hàng & Quán ăn",
      images: [p.img],
    }))
  );
  const [selectedPlaceId, setSelectedPlaceId] = useState<number | null>(null);
  const [placeDetailTab, setPlaceDetailTab] = useState<PlaceDetailTab>("info");
  const [placeSearchText, setPlaceSearchText] = useState("");
  const [placeFilterProvince, setPlaceFilterProvince] = useState("all");
  const [placeFilterStatus, setPlaceFilterStatus] = useState("all");

  // Add & Edit Place Modals
  const [isAddPlaceModalOpen, setIsAddPlaceModalOpen] = useState(false);
  const [isEditPlaceModalOpen, setIsEditPlaceModalOpen] = useState(false);
  const [newPlaceForm, setNewPlaceForm] = useState({
    name: "",
    category: "Nhà hàng & Quán ăn",
    province: "Đà Nẵng",
    location: "",
    price: "35.000đ – 75.000đ",
    hours: "07:00 – 22:00",
    phone: "0905 123 456",
    website: "https://langthang.vn",
    desc: "",
    img: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=400&fit=crop",
  });
  const [editPlaceForm, setEditPlaceForm] = useState({
    id: 0,
    name: "",
    category: "",
    province: "",
    location: "",
    price: "",
    hours: "",
    phone: "",
    website: "",
    desc: "",
    img: "",
  });

  const [auditLogs, setAuditLogs] = useState<AdminAuditLog[]>(initialAdminAuditLogs);

  const currentLabel = tabMeta.find((tab) => tab.id === activeTab)?.label;
  const unreadNotifications = notifications.filter((item) => item.unread).length;
  const notify = (message: string) => showToast(message);

  const handleApprovePlace = (placeId: number) => {
    setPlacesList((prev) =>
      prev.map((p) => {
        if (p.id === placeId) {
          notify(`Đã duyệt phát hành địa điểm "${p.name}".`);
          return { ...p, status: "Đã duyệt", statusNum: 1 };
        }
        return p;
      })
    );
  };

  const handleTogglePlaceStatus = (placeId: number) => {
    setPlacesList((prev) =>
      prev.map((p) => {
        if (p.id === placeId) {
          const isHidden = (p as any).statusNum === 3;
          const nextStatusNum = isHidden ? 1 : 3;
          const nextStatusStr = isHidden ? "Đã duyệt" : "Đang ẩn";
          notify(`Đã ${isHidden ? "hiện lại" : "tạm ẩn"} địa điểm "${p.name}".`);
          return { ...p, status: nextStatusStr, statusNum: nextStatusNum };
        }
        return p;
      })
    );
  };

  const handleCreateNewPlace = () => {
    if (!newPlaceForm.name || !newPlaceForm.location) {
      notify("Vui lòng nhập đầy đủ tên và địa chỉ địa điểm.");
      return;
    }

    const createdPlace: Place = {
      id: Date.now(),
      name: newPlaceForm.name,
      category: newPlaceForm.category,
      province: newPlaceForm.province,
      location: newPlaceForm.location,
      price: newPlaceForm.price,
      hours: newPlaceForm.hours,
      phone: newPlaceForm.phone,
      website: newPlaceForm.website,
      desc: newPlaceForm.desc || "Địa điểm chất lượng được ban quản trị thêm mới.",
      img: newPlaceForm.img,
      rating: 5.0,
      reviews: 0,
      isVerified: true,
      status: "Đã duyệt",
      type: "Ăn uống",
      tags: [newPlaceForm.category, newPlaceForm.province],
      images: [newPlaceForm.img],
      ...({
        statusNum: 1,
        slug: newPlaceForm.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        createdBy: "System Admin (Nguyễn Minh Anh)",
        createdAt: "Hôm nay",
      } as any),
    };

    setPlacesList((prev) => [createdPlace, ...prev]);
    setIsAddPlaceModalOpen(false);
    notify(`Đã tạo mới địa điểm "${createdPlace.name}".`);
  };

  const handleOpenEditPlace = (place: any) => {
    setEditPlaceForm({
      id: place.id,
      name: place.name || "",
      category: place.category || "",
      province: place.province || "",
      location: place.location || "",
      price: place.price || "",
      hours: place.hours || "",
      phone: place.phone || "",
      website: place.website || "",
      desc: place.desc || "",
      img: place.img || "",
    });
    setIsEditPlaceModalOpen(true);
  };

  const handleUpdatePlace = () => {
    setPlacesList((prev) =>
      prev.map((p) => {
        if (p.id === editPlaceForm.id) {
          return {
            ...p,
            name: editPlaceForm.name,
            category: editPlaceForm.category,
            province: editPlaceForm.province,
            location: editPlaceForm.location,
            price: editPlaceForm.price,
            hours: editPlaceForm.hours,
            phone: editPlaceForm.phone,
            website: editPlaceForm.website,
            desc: editPlaceForm.desc,
            img: editPlaceForm.img,
          };
        }
        return p;
      })
    );
    setIsEditPlaceModalOpen(false);
    notify(`Đã cập nhật địa điểm "${editPlaceForm.name}".`);
  };

  return (
    <div className="min-h-screen bg-[#F1F5F9] text-slate-800 flex font-sans antialiased">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-slate-950/40 backdrop-blur-xs lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <aside
        className={`${
          sidebarOpen ? "w-64 translate-x-0" : "-translate-x-full lg:w-20 lg:translate-x-0"
        } fixed lg:sticky top-0 z-40 flex h-screen shrink-0 flex-col overflow-hidden border-r border-slate-200 bg-white text-slate-800 shadow-sm transition-all duration-300`}
      >
        <div className="flex h-16 items-center justify-between border-b border-slate-100 px-5 bg-white">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-[11px] font-black text-white shadow-xs">
              LT
            </div>
            {sidebarOpen && (
              <div>
                <div className="font-bold text-base text-blue-600 tracking-tight">LangThang</div>
                <div className="text-[11px] font-medium text-slate-400">System Admin · Toàn Quyền</div>
              </div>
            )}
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition cursor-pointer"
            title="Thu gọn menu"
          >
            {sidebarOpen ? <PanelLeftClose size={17} /> : <PanelLeftOpen size={17} />}
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4 scrollbar-none text-xs">
          {sidebarOpen && (
            <div className="px-3 pt-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Quản trị toàn hệ thống
            </div>
          )}
          <div className="space-y-4">
            {navGroups.map((group) => (
              <div key={group.label} className="space-y-1">
                {sidebarOpen && (
                  <div className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {group.label}
                  </div>
                )}
                {group.items.map(({ id, label, icon: Icon, count }) => (
                  <button
                    key={id}
                    onClick={() => {
                      setActiveTab(id);
                      setSelectedPlaceId(null);
                    }}
                    className={`w-full group flex items-center ${
                      sidebarOpen ? "justify-between px-3" : "justify-center px-0"
                    } py-2 rounded-lg transition-all duration-150 cursor-pointer ${
                      activeTab === id
                        ? "bg-blue-600 text-white font-bold shadow-xs"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 font-medium"
                    }`}
                    title={!sidebarOpen ? label : undefined}
                  >
                    <span className="flex items-center gap-3 min-w-0">
                      <span
                        className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 transition-colors ${
                          activeTab === id
                            ? "bg-white text-blue-600 shadow-2xs"
                            : "bg-slate-100 text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-600"
                        }`}
                      >
                        <Icon size={15} />
                      </span>
                      {sidebarOpen && <span className="truncate text-xs">{label}</span>}
                    </span>
                    {sidebarOpen && count && (
                      <span
                        className={`ml-auto rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          activeTab === id ? "bg-white text-blue-700 shadow-2xs" : "bg-rose-500 text-white"
                        }`}
                      >
                        {count}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="border-t border-slate-100 bg-slate-50/70 p-3 space-y-1">
          <button
            onClick={onOpenCategoryAdmin}
            className={`w-full flex items-center ${
              sidebarOpen ? "gap-2.5 px-3" : "justify-center px-0"
            } py-2 rounded-lg text-left text-xs font-semibold text-slate-700 hover:bg-white hover:text-blue-600 hover:shadow-xs border border-transparent hover:border-slate-200 transition cursor-pointer`}
          >
            <ArrowLeftRight size={15} className="text-blue-600" />
            {sidebarOpen && <span>Chuyển sang Admin cấp 1</span>}
          </button>
          <button
            onClick={onBackToUserView}
            className={`w-full flex items-center ${
              sidebarOpen ? "gap-2.5 px-3" : "justify-center px-0"
            } py-2 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 font-semibold text-xs transition cursor-pointer`}
          >
            <X size={15} />
            {sidebarOpen && <span>Về trang người dùng</span>}
          </button>
        </div>
      </aside>

      <div className="min-w-0 flex-1 flex flex-col">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200/80 bg-white/95 px-6 sm:px-8 backdrop-blur-md">
          <div className="flex items-center gap-3.5">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="rounded-xl border border-slate-200/80 p-2 text-slate-600 lg:hidden hover:bg-slate-50 transition cursor-pointer">
              <Menu size={18} />
            </button>
            <div className="flex items-center gap-2 text-xs font-medium">
              <span className="text-slate-400">Hệ thống</span>
              <span className="text-slate-300">/</span>
              <span className="font-bold text-slate-900">{currentLabel}</span>
            </div>
          </div>
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="relative hidden w-72 lg:w-96 sm:block">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={searchText}
                onChange={(event) => setSearchText(event.target.value)}
                className="w-full pl-9 pr-12 py-1.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-slate-300 outline-none transition-all"
                placeholder="Tìm ID, người dùng, nội dung..."
              />
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] bg-slate-200/60 text-slate-500 px-1.5 py-0.5 rounded font-mono font-medium">Ctrl K</span>
            </div>
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen((prev) => !prev)}
                className="relative rounded-xl p-2 text-slate-500 hover:bg-slate-100 transition-colors cursor-pointer"
                title="Thông báo"
              >
                <Bell size={17} />
                {unreadNotifications > 0 && (
                  <span className="absolute right-1.5 top-1.5 min-w-[16px] h-4 px-1 flex items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white">
                    {unreadNotifications > 9 ? "9+" : unreadNotifications}
                  </span>
                )}
              </button>
              {notificationsOpen && (
                <div className="absolute right-0 top-12 z-50 w-[360px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.12)]">
                  <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                    <div>
                      <div className="text-[10px] font-black uppercase tracking-[0.12em] text-slate-400">Thông báo</div>
                      <div className="mt-1 text-sm font-bold text-slate-900">{unreadNotifications} tin chưa đọc</div>
                    </div>
                    <button
                      onClick={() => {
                        setNotifications((items) => items.map((item) => ({ ...item, unread: false })));
                        notify("Đã đánh dấu tất cả thông báo là đã đọc.");
                      }}
                      className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2 py-1.5 text-[10px] font-bold text-slate-600 hover:border-slate-300 cursor-pointer"
                    >
                      Đọc hết
                    </button>
                  </div>
                  <div className="max-h-[320px] overflow-y-auto divide-y divide-slate-100">
                    {notifications.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          setNotifications((items) =>
                            items.map((entry) => (entry.id === item.id ? { ...entry, unread: false } : entry))
                          );
                          setNotificationsOpen(false);
                          setActiveTab("notifications");
                          notify(`${item.title}: ${item.detail}`);
                        }}
                        className={`flex w-full items-start gap-3 px-4 py-3 text-left transition cursor-pointer ${
                          item.unread ? "bg-blue-50/40 hover:bg-blue-50/60" : "bg-white hover:bg-slate-50"
                        }`}
                      >
                        <div className={`mt-1 h-2.5 w-2.5 rounded-full shrink-0 ${item.unread ? "bg-rose-500" : "bg-slate-300"}`} />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-3">
                            <span className="text-xs font-bold text-slate-800 truncate">{item.title}</span>
                            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-bold text-slate-500 shrink-0">
                              {item.level}
                            </span>
                          </div>
                          <p className="mt-0.5 text-xs leading-4 text-slate-500 line-clamp-2">{item.detail}</p>
                          <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-400">
                            <span>{item.time}</span>
                            <span className="font-semibold text-blue-600">Chi tiết</span>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="p-2.5 border-t border-slate-100 bg-slate-50 text-center">
                    <button
                      onClick={() => {
                        setNotificationsOpen(false);
                        setActiveTab("notifications");
                      }}
                      className="w-full py-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 transition cursor-pointer"
                    >
                      Mở Trung tâm thông báo toàn diện →
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2.5 border-l border-slate-200 pl-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white ring-2 ring-blue-100">
                MA
              </div>
              <div className="hidden leading-tight md:block">
                <div className="text-xs font-bold text-slate-900">Nguyễn Minh Anh</div>
                <div className="text-[10px] font-medium text-slate-400">System Admin</div>
              </div>
            </div>
          </div>
        </header>

        <main className="p-6 sm:p-8 space-y-6 flex-1">
          {/* TAB 1: OVERVIEW */}
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
              places={placesList}
              proposals={initialAdminProposals}
              reports={initialAdminReports}
              reportedReviews={[]}
              auditLogs={auditLogs}
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
              setIsAddPlaceModalOpen={() => setIsAddPlaceModalOpen(true)}
              showToast={notify}
            />
          )}

          {/* TAB 2: USERS */}
          {activeTab === "users" && <UsersTab showToast={notify} />}

          {/* TAB 3: ADMINS */}
          {activeTab === "admins" && <PermissionsTab showToast={notify} />}

          {/* TAB 4: REGIONS */}
          {activeTab === "regions" && <SystemRegionsTab onNotify={notify} />}

          {/* TAB 5: TAXONOMY */}
          {activeTab === "taxonomy" && <SystemTaxonomyTab onNotify={notify} />}

          {/* TAB 6: FOODS */}
          {activeTab === "foods" && <SystemFoodsTab onNotify={notify} />}

          {/* TAB 7: PLACES */}
          {activeTab === "places" && (
            <PlacesTab
              placesList={placesList}
              selectedPlaceId={selectedPlaceId}
              setSelectedPlaceId={setSelectedPlaceId}
              placeDetailTab={placeDetailTab}
              setPlaceDetailTab={setPlaceDetailTab}
              placeSearchText={placeSearchText}
              setPlaceSearchText={setPlaceSearchText}
              placeFilterProvince={placeFilterProvince}
              setPlaceFilterProvince={setPlaceFilterProvince}
              placeFilterStatus={placeFilterStatus}
              setPlaceFilterStatus={setPlaceFilterStatus}
              setIsAddPlaceModalOpen={setIsAddPlaceModalOpen}
              handleApprovePlace={handleApprovePlace}
              handleTogglePlaceStatus={handleTogglePlaceStatus}
              handleOpenEditPlace={handleOpenEditPlace}
              showToast={notify}
            />
          )}

          {/* TAB 7.5: LEADERBOARD */}
          {activeTab === "leaderboard" && (
            <TrendingLeaderboardTab showToast={notify} />
          )}

          {/* TAB 8: COLLECTIONS */}
          {activeTab === "collections" && <CollectionsTab showToast={notify} />}

          {/* TAB 9: BLOGS */}
          {activeTab === "blogs" && (
            <BlogsTab blogsList={initialAdminBlogs} showToast={notify} />
          )}

          {/* TAB 10: COMPLAINTS / REPORTS */}
          {activeTab === "complaints" && <SystemReportsTab showToast={notify} />}

          {/* TAB 10.5: NOTIFICATIONS */}
          {activeTab === "notifications" && (
            <NotificationCenterTab
              showToast={notify}
              onNavigateToTab={(tab) => {
                if (tab === "reports") setActiveTab("complaints");
                else if (tab === "proposals" || tab === "places") setActiveTab("places");
              }}
            />
          )}

          {/* TAB 11: AUDIT LOGS */}
          {activeTab === "audit" && (
            <AuditLogsTab auditLogs={auditLogs} showToast={notify} />
          )}

          {/* TAB 12: SETTINGS */}
          {activeTab === "settings" && <SystemSettingsTab showToast={notify} />}

          {/* TAB 13: MASTER DATA HUB */}
          {activeTab === "master_data" && (
            <section className="space-y-5 animate-in fade-in duration-150 text-xs">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-black text-slate-950">Dữ liệu nền toàn hệ thống</h2>
                  <p className="mt-1 text-xs text-slate-500">
                    Trung tâm điều phối Regions, Provinces, PlaceTypes, Categories và Từ điển ẩm thực quốc gia.
                  </p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  ["Miền / Regions", "3", "1 nổi bật", Globe2, "regions"],
                  ["Tỉnh / thành", "63", "58 đang hiển thị", Database, "regions"],
                  ["Danh mục", "18", "4 loại cha", SlidersHorizontal, "taxonomy"],
                  ["Món ăn đặc sản", "248", "63 tỉnh thành", Utensils, "foods"],
                ].map(([label, value, note, Icon, targetTab]) => (
                  <div
                    key={label as string}
                    onClick={() => setActiveTab(targetTab as SystemTab)}
                    className="cursor-pointer"
                  >
                    <MetricCard
                      label={label as string}
                      value={value as string}
                      note={note as string}
                      icon={Icon as typeof Users}
                      accent="bg-blue-50 text-blue-700"
                    />
                  </div>
                ))}
              </div>

              <div className="grid gap-5 lg:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                  <div className="flex items-center justify-between">
                    <h3 className="font-black text-sm text-slate-900">Vùng miền &amp; Tỉnh thành</h3>
                    <button
                      onClick={() => setActiveTab("regions")}
                      className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
                    >
                      <span>Quản lý</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>
                  <div className="mt-4 space-y-2">
                    {[
                      ["Miền Bắc", "25 tỉnh thành", "Đang hiển thị", "green"],
                      ["Miền Trung", "19 tỉnh thành", "Đang hiển thị", "green"],
                      ["Miền Nam", "19 tỉnh thành", "1 tỉnh đang bảo trì", "amber"],
                    ].map(([name, count, status, tone]) => (
                      <div key={name} className="flex items-center gap-3 rounded-xl border border-slate-100 p-3">
                        <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
                          <Globe2 size={15} />
                        </div>
                        <div className="flex-1">
                          <div className="text-xs font-bold text-slate-800">{name}</div>
                          <div className="mt-0.5 text-[10px] text-slate-400">{count} · {status}</div>
                        </div>
                        <Badge tone={tone === "green" ? "green" : "amber"}>Đang dùng</Badge>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                  <div className="flex items-center justify-between">
                    <h3 className="font-black text-sm text-slate-900">Danh mục &amp; Loại địa điểm</h3>
                    <button
                      onClick={() => setActiveTab("taxonomy")}
                      className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
                    >
                      <span>Quản lý</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>
                  <div className="mt-4 space-y-2">
                    {[
                      ["Ẩm thực", "6 danh mục", "1.124 địa điểm"],
                      ["Lưu trú", "5 danh mục", "328 địa điểm"],
                      ["Điểm tham quan", "7 danh mục", "390 địa điểm"],
                    ].map(([name, categories, places]) => (
                      <div key={name} className="flex items-center gap-3 rounded-xl border border-slate-100 p-3">
                        <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
                          <SlidersHorizontal size={15} />
                        </div>
                        <div className="flex-1">
                          <div className="text-xs font-bold text-slate-800">{name}</div>
                          <div className="mt-0.5 text-[10px] text-slate-400">{categories} · {places}</div>
                        </div>
                        <button
                          onClick={() => setActiveTab("taxonomy")}
                          className="text-[11px] font-bold text-blue-600 hover:underline cursor-pointer"
                        >
                          Xem chi tiết
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          )}
        </main>
      </div>

      {/* Grant Admin Modal */}
      {grantAdminOpen && (
        <GrantAdminModal
          onClose={() => setGrantAdminOpen(false)}
          onConfirm={(user, level, scopes) => {
            setGrantAdminOpen(false);
            notify(`Đã cấp ${level === "SYSTEM_ADMIN" ? "System Admin" : "Admin cấp 1"} cho ${user.name}.`);
          }}
        />
      )}

      {/* Add Place Modal */}
      <AddPlaceModal
        isOpen={isAddPlaceModalOpen}
        onClose={() => setIsAddPlaceModalOpen(false)}
        form={newPlaceForm}
        setForm={setNewPlaceForm}
        onSubmit={handleCreateNewPlace}
      />

      {/* Edit Place Modal */}
      <EditPlaceModal
        isOpen={isEditPlaceModalOpen}
        onClose={() => setIsEditPlaceModalOpen(false)}
        form={editPlaceForm}
        setForm={setEditPlaceForm}
        onSubmit={handleUpdatePlace}
      />
    </div>
  );
}