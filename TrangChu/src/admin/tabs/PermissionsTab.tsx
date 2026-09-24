import { useState } from "react";
import {
  ShieldCheck,
  UserCog,
  AlertTriangle,
  Plus,
  Search,
  Check,
  X,
  Clock,
  Globe2,
  MapPin,
  Tag,
  Users,
  FileClock,
  Shield,
  Crown,
  Layers,
  Edit3,
  Trash2,
  Power,
  RotateCcw,
  CheckCircle2,
  Calendar,
  Filter,
} from "lucide-react";

/* ── Static data & types dựa trên DB seed ── */

export interface RoleRow {
  id: number;
  code: string;
  name: string;
  description: string;
  isSystemRole: boolean;
  isActive: boolean;
  usersCount: number;
}

export const INITIAL_ROLES: RoleRow[] = [
  { id: 1, code: "USER", name: "Người dùng", description: "Quyền sử dụng các tính năng công cộng dành cho du khách & cộng đồng", isSystemRole: false, isActive: true, usersCount: 10482 },
  { id: 2, code: "CATEGORY_ADMIN", name: "Admin cấp 1", description: "Quản trị theo phạm vi vùng miền, tỉnh thành và danh mục được phân công", isSystemRole: false, isActive: true, usersCount: 6 },
  { id: 3, code: "SYSTEM_ADMIN", name: "Admin hệ thống", description: "Toàn quyền quản trị, cấu hình và phân quyền trên toàn hệ thống LangThang", isSystemRole: true, isActive: true, usersCount: 2 },
];

export interface PermissionRow {
  id: number;
  code: string;
  name: string;
  description: string;
  category: string;
}

export const PERMISSIONS: PermissionRow[] = [
  { id: 1, code: "PLACE_READ", name: "Xem địa điểm", description: "Xem dữ liệu địa điểm trong phạm vi", category: "Địa điểm" },
  { id: 2, code: "PLACE_MODERATE", name: "Kiểm duyệt địa điểm", description: "Duyệt, từ chối hoặc ẩn địa điểm", category: "Địa điểm" },
  { id: 3, code: "CONTENT_MODERATE", name: "Kiểm duyệt nội dung", description: "Xử lý đánh giá, bình luận, bài viết và media", category: "Nội dung" },
  { id: 4, code: "REPORT_RESOLVE", name: "Xử lý báo cáo", description: "Tiếp nhận và xử lý báo cáo vi phạm, khiếu nại", category: "Kiểm duyệt" },
  { id: 5, code: "PROPOSAL_REVIEW", name: "Duyệt đề xuất", description: "Duyệt đề xuất thêm hoặc sửa đổi dữ liệu từ người dùng", category: "Kiểm duyệt" },
  { id: 6, code: "TASK_MANAGE", name: "Quản lý tác vụ", description: "Nhận, chuyển giao và hoàn tất tác vụ quản trị", category: "Tác vụ" },
  { id: 7, code: "USER_MANAGE", name: "Quản lý người dùng", description: "Khóa, mở khóa hoặc điều chỉnh điểm uy tín người dùng", category: "Hệ thống" },
  { id: 8, code: "AUDIT_READ", name: "Xem Audit Log", description: "Tra cứu lịch sử thao tác và nhật ký kiểm duyệt", category: "Hệ thống" },
  { id: 9, code: "SYSTEM_CONFIG", name: "Cấu hình hệ thống", description: "Thay đổi cấu hình tham số toàn cục", category: "Hệ thống" },
];

export const DEFAULT_ROLE_PERMISSIONS: Record<string, string[]> = {
  USER: ["PLACE_READ"],
  CATEGORY_ADMIN: ["PLACE_READ", "PLACE_MODERATE", "CONTENT_MODERATE", "REPORT_RESOLVE", "PROPOSAL_REVIEW", "TASK_MANAGE"],
  SYSTEM_ADMIN: PERMISSIONS.map((p) => p.code),
};

export type AdminLevel = "SYSTEM_ADMIN" | "CATEGORY_ADMIN" | "USER";

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  avatar: string;
  level: AdminLevel;
  status: "active" | "pending" | "suspended";
  assignedAt: string;
  expiresAt: string | null;
  assignedBy: string;
  tasks30d: number;
  regions: string[];
  provinces: string[];
  categories: string[];
  customPermissions?: string[]; // Specific granular permissions override
}

export const INITIAL_ADMINS: AdminUser[] = [
  {
    id: 12,
    name: "Nguyễn Minh Anh",
    email: "minhanh@langthang.vn",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop",
    level: "SYSTEM_ADMIN",
    status: "active",
    assignedAt: "01/03/2026",
    expiresAt: null,
    assignedBy: "Hệ thống",
    tasks30d: 248,
    regions: ["Miền Bắc", "Miền Trung", "Miền Nam"],
    provinces: ["Toàn quốc"],
    categories: ["Tất cả danh mục"],
    customPermissions: PERMISSIONS.map((p) => p.code),
  },
  {
    id: 18,
    name: "Trần Quốc Bảo",
    email: "quocbao@langthang.vn",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
    level: "CATEGORY_ADMIN",
    status: "active",
    assignedAt: "15/01/2026",
    expiresAt: null,
    assignedBy: "Nguyễn Minh Anh",
    tasks30d: 86,
    regions: ["Miền Trung"],
    provinces: ["Đà Nẵng", "Quảng Nam", "Thừa Thiên Huế"],
    categories: ["Nhà hàng & Quán ăn", "Quán Cà phê & Trà", "Ẩm thực đường phố"],
    customPermissions: ["PLACE_READ", "PLACE_MODERATE", "CONTENT_MODERATE", "REPORT_RESOLVE", "PROPOSAL_REVIEW", "TASK_MANAGE"],
  },
  {
    id: 25,
    name: "Lê Hoàng Mai",
    email: "hoangmai@langthang.vn",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop",
    level: "CATEGORY_ADMIN",
    status: "active",
    assignedAt: "20/02/2026",
    expiresAt: "2026-12-31",
    assignedBy: "Nguyễn Minh Anh",
    tasks30d: 64,
    regions: ["Miền Bắc"],
    provinces: ["Hà Nội", "Ninh Bình", "Lào Cai"],
    categories: ["Điểm tham quan", "Di tích lịch sử", "Homestay & Lưu trú"],
    customPermissions: ["PLACE_READ", "PLACE_MODERATE", "CONTENT_MODERATE", "PROPOSAL_REVIEW", "TASK_MANAGE"],
  },
  {
    id: 31,
    name: "Phạm Đức Long",
    email: "duclong@langthang.vn",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop",
    level: "CATEGORY_ADMIN",
    status: "pending",
    assignedAt: "18/09/2026",
    expiresAt: null,
    assignedBy: "Nguyễn Minh Anh",
    tasks30d: 0,
    regions: [],
    provinces: [],
    categories: [],
    customPermissions: ["PLACE_READ", "PLACE_MODERATE", "TASK_MANAGE"],
  },
  {
    id: 38,
    name: "Võ Thanh Hương",
    email: "thanhhuong@langthang.vn",
    avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&h=150&fit=crop",
    level: "CATEGORY_ADMIN",
    status: "active",
    assignedAt: "10/04/2026",
    expiresAt: null,
    assignedBy: "Nguyễn Minh Anh",
    tasks30d: 52,
    regions: ["Miền Nam"],
    provinces: ["TP. Hồ Chí Minh", "Vũng Tàu", "Cần Thơ"],
    categories: ["Nhà hàng & Quán ăn", "Homestay & Lưu trú", "Khu vui chơi"],
    customPermissions: ["PLACE_READ", "PLACE_MODERATE", "CONTENT_MODERATE", "REPORT_RESOLVE", "TASK_MANAGE"],
  },
  {
    id: 42,
    name: "Đặng Khải Minh",
    email: "khaiminh@langthang.vn",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop",
    level: "CATEGORY_ADMIN",
    status: "suspended",
    assignedAt: "05/06/2026",
    expiresAt: null,
    assignedBy: "Nguyễn Minh Anh",
    tasks30d: 12,
    regions: ["Miền Trung"],
    provinces: ["Khánh Hòa", "Phú Yên", "Lâm Đồng"],
    categories: ["Điểm tham quan", "Quán Cà phê & Trà"],
    customPermissions: ["PLACE_READ", "PLACE_MODERATE"],
  },
];

export const ALL_REGIONS = ["Miền Bắc", "Miền Trung", "Miền Nam"];
export const ALL_PROVINCES = [
  "Hà Nội", "Ninh Bình", "Lào Cai", "Hà Giang", "Quảng Ninh", "Hải Phòng",
  "Đà Nẵng", "Quảng Nam", "Thừa Thiên Huế", "Khánh Hòa", "Lâm Đồng", "Phú Yên", "Bình Định",
  "TP. Hồ Chí Minh", "Vũng Tàu", "Cần Thơ", "Kiên Giang", "An Giang", "Tây Ninh"
];
export const ALL_CATEGORIES = [
  "Nhà hàng & Quán ăn", "Quán Cà phê & Trà", "Ẩm thực đường phố",
  "Điểm tham quan", "Di tích lịch sử", "Homestay & Lưu trú", "Khu vui chơi", "Spa & Nghỉ dưỡng"
];

export const CANDIDATE_USERS = [
  { id: 10401, name: "Lê Thu Hà", email: "ha.le@gmail.com", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop" },
  { id: 10388, name: "Đỗ Minh Khang", email: "khang.do@gmail.com", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop" },
  { id: 10276, name: "Phan Gia Huy", email: "huy.phan@gmail.com", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop" },
  { id: 10519, name: "Bùi Ngọc Trinh", email: "trinh.bui@gmail.com", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop" },
  { id: 10642, name: "Hoàng Quốc Việt", email: "viet.hoang@gmail.com", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop" },
];

/* ── Reusable Badges & Simple Metric Card ── */

function StatusBadge({ status }: { status: "active" | "pending" | "suspended" }) {
  if (status === "active") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 text-[11px] font-semibold">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
        Đang hoạt động
      </span>
    );
  }
  if (status === "pending") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200/80 text-[11px] font-semibold">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
        Chờ bàn giao
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200/80 text-[11px] font-semibold">
      <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
      Tạm ngưng
    </span>
  );
}

function RoleBadge({ level }: { level: AdminLevel }) {
  if (level === "SYSTEM_ADMIN") {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-slate-900 text-white text-[10px] font-bold tracking-wide">
        <Crown size={11} className="text-amber-400" />
        System Admin
      </span>
    );
  }
  if (level === "CATEGORY_ADMIN") {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200/80 text-[10px] font-bold">
        <UserCog size={11} />
        Admin cấp 1
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200 text-[10px] font-medium">
      Người dùng
    </span>
  );
}

interface PermissionsTabProps {
  showToast: (msg: string) => void;
}

export default function PermissionsTab({ showToast }: PermissionsTabProps) {
  const [subTab, setSubTab] = useState<"admins" | "matrix" | "roles">("admins");
  const [adminsList, setAdminsList] = useState<AdminUser[]>(INITIAL_ADMINS);
  const [rolesList] = useState<RoleRow[]>(INITIAL_ROLES);
  const [searchText, setSearchText] = useState("");
  const [levelFilter, setLevelFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // State modal chỉnh sửa quyền admin
  const [editingAdmin, setEditingAdmin] = useState<AdminUser | null>(null);
  const [isGrantModalOpen, setIsGrantModalOpen] = useState(false);
  const [expandedRowId, setExpandedRowId] = useState<number | null>(null);

  // Role permissions matrix state
  const [rolePerms, setRolePerms] = useState<Record<string, string[]>>(DEFAULT_ROLE_PERMISSIONS);

  // Counters
  const systemAdminCount = adminsList.filter((a) => a.level === "SYSTEM_ADMIN" && a.status === "active").length;
  const categoryAdminCount = adminsList.filter((a) => a.level === "CATEGORY_ADMIN").length;
  const unassignedScopeCount = adminsList.filter((a) => a.level === "CATEGORY_ADMIN" && a.regions.length === 0).length;

  // Filtered admins
  const filteredAdmins = adminsList.filter((admin) => {
    if (levelFilter !== "all" && admin.level !== levelFilter) return false;
    if (statusFilter !== "all" && admin.status !== statusFilter) return false;
    if (searchText.trim()) {
      const q = searchText.toLowerCase();
      return (
        admin.name.toLowerCase().includes(q) ||
        admin.email.toLowerCase().includes(q) ||
        String(admin.id).includes(q) ||
        admin.provinces.some((p) => p.toLowerCase().includes(q)) ||
        admin.categories.some((c) => c.toLowerCase().includes(q))
      );
    }
    return true;
  });

  // Toggle permission in role matrix
  const handleToggleRolePerm = (roleCode: string, permCode: string) => {
    if (roleCode === "SYSTEM_ADMIN") {
      showToast("System Admin mặc định có toàn bộ quyền trong hệ thống.");
      return;
    }
    setRolePerms((prev) => {
      const currentList = prev[roleCode] || [];
      const updated = currentList.includes(permCode)
        ? currentList.filter((c) => c !== permCode)
        : [...currentList, permCode];
      return { ...prev, [roleCode]: updated };
    });
    showToast(`Đã cập nhật ma trận quyền cho vai trò ${roleCode}.`);
  };

  // Quick toggle status
  const handleToggleStatus = (adminId: number) => {
    setAdminsList((prev) =>
      prev.map((adm) => {
        if (adm.id === adminId) {
          const nextStatus = adm.status === "active" ? "suspended" : "active";
          showToast(`Đã ${nextStatus === "active" ? "kích hoạt" : "tạm ngưng"} tài khoản ${adm.name}.`);
          return { ...adm, status: nextStatus };
        }
        return adm;
      })
    );
  };

  // Delete / Revoke admin
  const handleRevokeAdmin = (admin: AdminUser) => {
    if (admin.level === "SYSTEM_ADMIN" && systemAdminCount <= 1) {
      showToast("Không thể thu hồi System Admin cuối cùng của hệ thống!");
      return;
    }
    if (window.confirm(`Bạn có chắc muốn thu hồi quyền quản trị của ${admin.name} (#${admin.id})?`)) {
      setAdminsList((prev) => prev.filter((a) => a.id !== admin.id));
      showToast(`Đã thu hồi quyền quản trị của ${admin.name}.`);
    }
  };

  // Save changes from Edit Modal
  const handleSaveAdminChanges = (updated: AdminUser) => {
    setAdminsList((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
    setEditingAdmin(null);
    showToast(`Đã cập nhật quyền và phạm vi quản lý cho ${updated.name} thành công.`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150 text-slate-800">
      {/* 1. Page Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <span>Phân Quyền &amp; Quản Trị Viên</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              RBAC Security
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Điều phối vai trò, thiết lập phạm vi phụ trách (Scope vùng/danh mục) và phân quyền chi tiết cho Admin cấp 1.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          {/* Sub-tab navigation */}
          <div className="flex items-center gap-1 p-1 bg-slate-200/70 rounded-xl">
            <button
              onClick={() => setSubTab("admins")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                subTab === "admins"
                  ? "bg-white text-slate-900 shadow-xs font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Admin ({adminsList.length})
            </button>
            <button
              onClick={() => setSubTab("matrix")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                subTab === "matrix"
                  ? "bg-white text-slate-900 shadow-xs font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Ma trận quyền ({PERMISSIONS.length})
            </button>
            <button
              onClick={() => setSubTab("roles")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                subTab === "roles"
                  ? "bg-white text-slate-900 shadow-xs font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Vai trò ({rolesList.length})
            </button>
          </div>

          <button
            onClick={() => setIsGrantModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition cursor-pointer"
          >
            <Plus size={14} />
            <span>Phân quyền Admin</span>
          </button>
        </div>
      </div>

      {/* Metrics Summary Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">System Admin</span>
            <div className="text-xl font-bold text-slate-900 mt-0.5">{systemAdminCount} tài khoản</div>
            <span className="text-[10px] text-slate-500">Toàn quyền toàn hệ thống</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200/60">
            <Crown size={18} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Admin cấp 1</span>
            <div className="text-xl font-bold text-slate-900 mt-0.5">{categoryAdminCount} nhân sự</div>
            <span className="text-[10px] text-slate-500">Phụ trách theo scope vùng/danh mục</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200/60">
            <UserCog size={18} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Chưa gán phạm vi</span>
            <div className={`text-xl font-bold mt-0.5 ${unassignedScopeCount > 0 ? "text-rose-600" : "text-slate-900"}`}>
              {unassignedScopeCount} admin
            </div>
            <span className="text-[10px] text-slate-500">Cần phân công tỉnh/danh mục</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-200/60">
            <AlertTriangle size={18} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Hiệu suất 30 ngày</span>
            <div className="text-xl font-bold text-emerald-700 mt-0.5">
              {adminsList.reduce((sum, a) => sum + a.tasks30d, 0)} việc
            </div>
            <span className="text-[10px] text-slate-500">Đã duyệt &amp; xử lý báo cáo</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200/60">
            <CheckCircle2 size={18} />
          </div>
        </div>
      </div>

      {/* ═══════════ SUB-TAB 1: DANH SÁCH ADMIN & CHỈNH SỬA QUYỀN ═══════════ */}
      {subTab === "admins" && (
        <div className="space-y-4">
          {/* Search & Filters */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="relative flex-1 min-w-[260px]">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Tìm kiếm admin theo họ tên, email, tỉnh phụ trách, danh mục..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium focus:bg-white focus:border-slate-300 outline-none"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={levelFilter}
                onChange={(e) => setLevelFilter(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white font-medium text-slate-700 cursor-pointer outline-none hover:border-slate-300"
              >
                <option value="all">Tất cả vai trò</option>
                <option value="CATEGORY_ADMIN">Admin cấp 1</option>
                <option value="SYSTEM_ADMIN">System Admin</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white font-medium text-slate-700 cursor-pointer outline-none hover:border-slate-300"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="active">Đang hoạt động</option>
                <option value="pending">Chờ bàn giao</option>
                <option value="suspended">Tạm ngưng</option>
              </select>

              {(searchText || levelFilter !== "all" || statusFilter !== "all") && (
                <button
                  onClick={() => {
                    setSearchText("");
                    setLevelFilter("all");
                    setStatusFilter("all");
                  }}
                  className="px-2.5 py-1.5 text-xs text-slate-500 hover:text-slate-800 font-medium underline"
                >
                  Xóa lọc
                </button>
              )}
            </div>
          </div>

          {/* Admin Table */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/70 text-slate-400 font-semibold border-b border-slate-100 text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Quản trị viên</th>
                  <th className="py-3.5 px-4">Vai trò</th>
                  <th className="py-3.5 px-4 min-w-[240px]">Phạm vi phụ trách (Scope)</th>
                  <th className="py-3.5 px-4">Quyền chi tiết</th>
                  <th className="py-3.5 px-4">Hiệu suất (30d)</th>
                  <th className="py-3.5 px-4">Trạng thái</th>
                  <th className="py-3.5 px-4 text-center">Thao tác &amp; Chỉnh sửa</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAdmins.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400">
                      Không tìm thấy quản trị viên nào khớp với bộ lọc.
                    </td>
                  </tr>
                ) : (
                  filteredAdmins.map((admin) => {
                    const isExpanded = expandedRowId === admin.id;
                    const assignedPerms = admin.customPermissions || DEFAULT_ROLE_PERMISSIONS[admin.level] || [];

                    return (
                      <tr
                        key={admin.id}
                        className={`hover:bg-slate-50/70 transition-colors ${
                          isExpanded ? "bg-slate-50/90" : ""
                        }`}
                      >
                        {/* Admin Info */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={admin.avatar}
                              alt=""
                              className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-200 shrink-0"
                            />
                            <div>
                              <div className="font-bold text-slate-900">{admin.name}</div>
                              <div className="text-[11px] text-slate-400 font-normal">
                                #{admin.id} • {admin.email}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Level */}
                        <td className="py-3.5 px-4">
                          <RoleBadge level={admin.level} />
                        </td>

                        {/* Scope */}
                        <td className="py-3.5 px-4">
                          {admin.level === "SYSTEM_ADMIN" ? (
                            <span className="text-slate-600 font-medium">Toàn hệ thống (Toàn quốc)</span>
                          ) : admin.regions.length === 0 ? (
                            <span className="inline-flex items-center gap-1 text-rose-600 font-semibold text-[11px]">
                              <AlertTriangle size={12} /> Chưa gán phạm vi
                            </span>
                          ) : (
                            <div className="space-y-1">
                              <div className="flex flex-wrap gap-1">
                                {admin.regions.map((reg) => (
                                  <span
                                    key={reg}
                                    className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-semibold"
                                  >
                                    {reg}
                                  </span>
                                ))}
                              </div>
                              <div className="text-[11px] text-slate-500 truncate max-w-[280px]">
                                <span className="font-semibold text-slate-700">Tỉnh:</span>{" "}
                                {admin.provinces.join(", ") || "Chưa chọn"}
                              </div>
                              <div className="text-[11px] text-slate-500 truncate max-w-[280px]">
                                <span className="font-semibold text-slate-700">Danh mục:</span>{" "}
                                {admin.categories.join(", ") || "Chưa chọn"}
                              </div>
                            </div>
                          )}
                        </td>

                        {/* Permissions count & details */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1.5">
                            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold text-[11px]">
                              {assignedPerms.length}/{PERMISSIONS.length} quyền
                            </span>
                            {admin.expiresAt && (
                              <span className="text-[10px] text-amber-700 font-medium flex items-center gap-1">
                                <Clock size={10} /> Hết hạn: {admin.expiresAt}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Performance */}
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-900">{admin.tasks30d} việc</div>
                          <div className="text-[10px] text-slate-400">Gán bởi {admin.assignedBy}</div>
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-4">
                          <StatusBadge status={admin.status} />
                        </td>

                        {/* Actions: Nút Chỉnh sửa quyền trực tiếp cho Admin cấp 1 */}
                        <td className="py-3.5 px-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => setEditingAdmin(admin)}
                              className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-[11px] flex items-center gap-1 transition shadow-xs cursor-pointer"
                              title="Chỉnh sửa quyền, vai trò và phạm vi phụ trách"
                            >
                              <Edit3 size={12} />
                              <span>Chỉnh quyền</span>
                            </button>

                            <button
                              onClick={() => handleToggleStatus(admin.id)}
                              className={`p-1.5 rounded-lg border transition cursor-pointer ${
                                admin.status === "active"
                                  ? "border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-rose-600"
                                  : "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                              }`}
                              title={admin.status === "active" ? "Tạm ngưng tài khoản" : "Kích hoạt tài khoản"}
                            >
                              <Power size={13} />
                            </button>

                            <button
                              onClick={() => handleRevokeAdmin(admin)}
                              className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-200 transition cursor-pointer"
                              title="Thu hồi quyền quản trị"
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

      {/* ═══════════ SUB-TAB 2: MA TRẬN QUYỀN (ROLE PERMISSIONS MATRIX) ═══════════ */}
      {subTab === "matrix" && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Ma trận phân quyền theo vai trò (RolePermissions)</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Nhấp vào từng ô để bật/tắt quyền mặc định cho từng vai trò trong hệ thống.
              </p>
            </div>
            <button
              onClick={() => showToast("Đã lưu thiết lập ma trận quyền thành công.")}
              className="px-3.5 py-1.5 rounded-lg bg-[#063f38] hover:bg-[#084f47] text-white text-xs font-semibold shadow-xs transition cursor-pointer"
            >
              Lưu ma trận quyền
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/70 text-slate-400 font-semibold border-b border-slate-100 text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4 min-w-[200px]">Mã &amp; Tên quyền hạn</th>
                  <th className="py-3.5 px-4">Nhóm quyền</th>
                  <th className="py-3.5 px-4 text-center">Người dùng (USER)</th>
                  <th className="py-3.5 px-4 text-center">Admin cấp 1 (CATEGORY_ADMIN)</th>
                  <th className="py-3.5 px-4 text-center">Admin hệ thống (SYSTEM_ADMIN)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {PERMISSIONS.map((perm) => {
                  const hasUser = (rolePerms["USER"] || []).includes(perm.code);
                  const hasCatAdmin = (rolePerms["CATEGORY_ADMIN"] || []).includes(perm.code);
                  const hasSysAdmin = (rolePerms["SYSTEM_ADMIN"] || []).includes(perm.code);

                  return (
                    <tr key={perm.code} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{perm.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{perm.code} — {perm.description}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-medium">
                          {perm.category}
                        </span>
                      </td>

                      {/* USER toggle */}
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => handleToggleRolePerm("USER", perm.code)}
                          className={`w-6 h-6 rounded-md inline-flex items-center justify-center transition cursor-pointer ${
                            hasUser
                              ? "bg-[#063f38] text-white"
                              : "bg-slate-100 text-slate-300 hover:bg-slate-200"
                          }`}
                        >
                          {hasUser ? <Check size={13} strokeWidth={3} /> : <X size={12} />}
                        </button>
                      </td>

                      {/* CATEGORY_ADMIN toggle */}
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => handleToggleRolePerm("CATEGORY_ADMIN", perm.code)}
                          className={`w-6 h-6 rounded-md inline-flex items-center justify-center transition cursor-pointer ${
                            hasCatAdmin
                              ? "bg-blue-600 text-white"
                              : "bg-slate-100 text-slate-300 hover:bg-slate-200"
                          }`}
                        >
                          {hasCatAdmin ? <Check size={13} strokeWidth={3} /> : <X size={12} />}
                        </button>
                      </td>

                      {/* SYSTEM_ADMIN locked */}
                      <td className="py-3 px-4 text-center">
                        <div
                          className="w-6 h-6 rounded-md inline-flex items-center justify-center bg-slate-900 text-amber-400 mx-auto"
                          title="System Admin luôn có toàn quyền"
                        >
                          <Check size={13} strokeWidth={3} />
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

      {/* ═══════════ SUB-TAB 3: VAI TRÒ HỆ THỐNG (ROLES) ═══════════ */}
      {subTab === "roles" && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs divide-y divide-slate-100 overflow-hidden text-xs">
          <div className="p-5 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Danh sách Vai trò Hệ thống (dbo.Roles)</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Các cấp độ tài khoản chuẩn hóa theo cấu trúc phân quyền cơ sở dữ liệu.
              </p>
            </div>
          </div>

          {rolesList.map((role) => (
            <div key={role.id} className="p-5 flex flex-wrap items-center justify-between gap-4 hover:bg-slate-50/70 transition">
              <div className="flex items-center gap-3.5">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                  role.code === "SYSTEM_ADMIN" ? "bg-amber-50 text-amber-700 border border-amber-200" :
                  role.code === "CATEGORY_ADMIN" ? "bg-blue-50 text-blue-700 border border-blue-200" :
                  "bg-slate-100 text-slate-600 border border-slate-200"
                }`}>
                  {role.code === "SYSTEM_ADMIN" ? <Crown size={18} /> :
                   role.code === "CATEGORY_ADMIN" ? <UserCog size={18} /> :
                   <Users size={18} />}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900">{role.name}</span>
                    <span className="px-2 py-0.5 rounded bg-slate-100 font-mono text-[10px] text-slate-600 font-semibold">
                      {role.code}
                    </span>
                    {role.isSystemRole && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-semibold">
                        System Role
                      </span>
                    )}
                  </div>
                  <p className="text-slate-500 text-xs mt-0.5">{role.description}</p>
                  <div className="flex items-center gap-4 text-[11px] text-slate-400 mt-1.5 font-medium">
                    <span>👥 {role.usersCount.toLocaleString()} tài khoản</span>
                    <span>⚡ {(rolePerms[role.code] || []).length} quyền kích hoạt</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setSubTab("matrix");
                    showToast(`Đang xem cấu hình quyền của ${role.name}.`);
                  }}
                  className="px-3.5 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 bg-white text-slate-700 font-semibold text-xs transition cursor-pointer"
                >
                  Xem ma trận quyền
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ═══════════ MODAL: CHỈNH SỬA QUYỀN CHO ADMIN CẤP 1 (HOẶC BẤT KỲ ADMIN) ═══════════ */}
      {editingAdmin && (
        <EditAdminModal
          admin={editingAdmin}
          onClose={() => setEditingAdmin(null)}
          onSave={handleSaveAdminChanges}
        />
      )}

      {/* ═══════════ MODAL: CẤP QUYỀN ADMIN MỚI ═══════════ */}
      {isGrantModalOpen && (
        <GrantNewAdminModal
          onClose={() => setIsGrantModalOpen(false)}
          onGrant={(newAdmin) => {
            setAdminsList((prev) => [newAdmin, ...prev]);
            setIsGrantModalOpen(false);
            showToast(`Đã cấp quyền ${newAdmin.level === "SYSTEM_ADMIN" ? "System Admin" : "Admin cấp 1"} cho ${newAdmin.name}.`);
          }}
        />
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   MODAL: CHỈNH SỬA QUYỀN & PHẠM VI CHO ADMIN CẤP 1 (FULL CONTROLS)
   ══════════════════════════════════════════════════════════════════════ */

interface EditAdminModalProps {
  admin: AdminUser;
  onClose: () => void;
  onSave: (updated: AdminUser) => void;
}

function EditAdminModal({ admin, onClose, onSave }: EditAdminModalProps) {
  const [level, setLevel] = useState<AdminLevel>(admin.level);
  const [status, setStatus] = useState<"active" | "pending" | "suspended">(admin.status);
  const [expiresAt, setExpiresAt] = useState<string>(admin.expiresAt || "");
  const [selectedRegions, setSelectedRegions] = useState<string[]>(admin.regions);
  const [selectedProvinces, setSelectedProvinces] = useState<string[]>(admin.provinces);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(admin.categories);
  const [permissions, setPermissions] = useState<string[]>(
    admin.customPermissions || DEFAULT_ROLE_PERMISSIONS[admin.level] || []
  );

  const [activeTabSection, setActiveTabSection] = useState<"scope" | "permissions" | "account">("scope");

  const toggleItem = (arr: string[], item: string, setter: (v: string[]) => void) => {
    setter(arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item]);
  };

  const handleResetToRoleDefault = () => {
    const defaultList = DEFAULT_ROLE_PERMISSIONS[level] || [];
    setPermissions(defaultList);
  };

  const handleSelectAllProvinces = () => {
    setSelectedProvinces(ALL_PROVINCES);
  };

  const handleClearProvinces = () => {
    setSelectedProvinces([]);
  };

  const handleSelectAllCategories = () => {
    setSelectedCategories(ALL_CATEGORIES);
  };

  const handleClearCategories = () => {
    setSelectedCategories([]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: AdminUser = {
      ...admin,
      level,
      status,
      expiresAt: expiresAt.trim() ? expiresAt : null,
      regions: level === "SYSTEM_ADMIN" ? ["Miền Bắc", "Miền Trung", "Miền Nam"] : selectedRegions,
      provinces: level === "SYSTEM_ADMIN" ? ["Toàn quốc"] : selectedProvinces,
      categories: level === "SYSTEM_ADMIN" ? ["Tất cả danh mục"] : selectedCategories,
      customPermissions: level === "SYSTEM_ADMIN" ? PERMISSIONS.map((p) => p.code) : permissions,
    };
    onSave(updated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="w-full max-w-3xl bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-8">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <img
              src={admin.avatar}
              alt=""
              className="w-11 h-11 rounded-full object-cover ring-2 ring-white shadow-xs"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-slate-900">
                  Chỉnh sửa quyền &amp; phạm vi: {admin.name}
                </h3>
                <RoleBadge level={level} />
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                ID #{admin.id} • {admin.email} • Gán bởi {admin.assignedBy} ({admin.assignedAt})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Section Tabs */}
        <div className="flex items-center gap-2 px-5 pt-3 border-b border-slate-100 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTabSection("scope")}
            className={`pb-3 border-b-2 transition cursor-pointer ${
              activeTabSection === "scope"
                ? "border-[#063f38] text-[#063f38]"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            1. Phạm vi phụ trách (Scope Vùng/Tỉnh/Danh mục)
          </button>
          <button
            type="button"
            onClick={() => setActiveTabSection("permissions")}
            className={`pb-3 border-b-2 transition cursor-pointer ${
              activeTabSection === "permissions"
                ? "border-[#063f38] text-[#063f38]"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            2. Quyền chi tiết ({permissions.length} quyền)
          </button>
          <button
            type="button"
            onClick={() => setActiveTabSection("account")}
            className={`pb-3 border-b-2 transition cursor-pointer ${
              activeTabSection === "account"
                ? "border-[#063f38] text-[#063f38]"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            3. Vai trò &amp; Thời hạn
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6 max-h-[60vh] overflow-y-auto space-y-6 text-xs">
            {/* ── SECTION 1: PHẠM VI QUẢN TRỊ ── */}
            {activeTabSection === "scope" && (
              <div className="space-y-5">
                {level === "SYSTEM_ADMIN" ? (
                  <div className="p-4 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-800">
                    <p className="font-semibold text-xs">System Admin có phạm vi toàn quốc trên tất cả danh mục.</p>
                    <p className="text-[11px] mt-1 text-amber-700">
                      Nếu muốn giới hạn phạm vi quản lý theo từng tỉnh/danh mục cụ thể, hãy chuyển vai trò sang <strong>Admin cấp 1 (CATEGORY_ADMIN)</strong> ở tab "Vai trò &amp; Thời hạn".
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Vùng miền */}
                    <div>
                      <label className="font-bold text-slate-800 block mb-2">
                        Vùng miền phụ trách (AdminRegionScopes):
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {ALL_REGIONS.map((region) => {
                          const active = selectedRegions.includes(region);
                          return (
                            <button
                              type="button"
                              key={region}
                              onClick={() => toggleItem(selectedRegions, region, setSelectedRegions)}
                              className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                                active
                                  ? "bg-[#063f38] text-white border-[#063f38]"
                                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                              }`}
                            >
                              {active && <Check size={12} />}
                              {region}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Tỉnh thành */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="font-bold text-slate-800">
                          Tỉnh / Thành phố được phân quyền duyệt (AdminProvinceScopes):
                        </label>
                        <div className="flex items-center gap-2 text-[11px]">
                          <button
                            type="button"
                            onClick={handleSelectAllProvinces}
                            className="text-[#063f38] font-semibold hover:underline"
                          >
                            Chọn tất cả
                          </button>
                          <span>•</span>
                          <button
                            type="button"
                            onClick={handleClearProvinces}
                            className="text-slate-400 hover:text-slate-600"
                          >
                            Bỏ chọn
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[160px] overflow-y-auto p-2 bg-slate-50 rounded-xl border border-slate-200">
                        {ALL_PROVINCES.map((prov) => {
                          const active = selectedProvinces.includes(prov);
                          return (
                            <label
                              key={prov}
                              className={`flex items-center gap-2 p-2 rounded-lg border text-[11px] font-medium transition cursor-pointer ${
                                active
                                  ? "bg-white border-blue-400 text-blue-800 shadow-xs"
                                  : "bg-white/60 border-slate-200 text-slate-600 hover:bg-white"
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={active}
                                onChange={() => toggleItem(selectedProvinces, prov, setSelectedProvinces)}
                                className="rounded text-[#063f38] focus:ring-0 w-3.5 h-3.5"
                              />
                              <span className="truncate">{prov}</span>
                            </label>
                          );
                        })}
                      </div>
                      <span className="text-[10px] text-slate-400 mt-1 block">
                        Đã chọn: {selectedProvinces.length} tỉnh thành
                      </span>
                    </div>

                    {/* Danh mục */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="font-bold text-slate-800">
                          Danh mục dịch vụ &amp; địa điểm phụ trách (AdminCategoryScopes):
                        </label>
                        <div className="flex items-center gap-2 text-[11px]">
                          <button
                            type="button"
                            onClick={handleSelectAllCategories}
                            className="text-[#063f38] font-semibold hover:underline"
                          >
                            Chọn tất cả
                          </button>
                          <span>•</span>
                          <button
                            type="button"
                            onClick={handleClearCategories}
                            className="text-slate-400 hover:text-slate-600"
                          >
                            Bỏ chọn
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[160px] overflow-y-auto p-2 bg-slate-50 rounded-xl border border-slate-200">
                        {ALL_CATEGORIES.map((cat) => {
                          const active = selectedCategories.includes(cat);
                          return (
                            <label
                              key={cat}
                              className={`flex items-center gap-2 p-2 rounded-lg border text-[11px] font-medium transition cursor-pointer ${
                                active
                                  ? "bg-white border-blue-400 text-blue-800 shadow-xs"
                                  : "bg-white/60 border-slate-200 text-slate-600 hover:bg-white"
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={active}
                                onChange={() => toggleItem(selectedCategories, cat, setSelectedCategories)}
                                className="rounded text-[#063f38] focus:ring-0 w-3.5 h-3.5"
                              />
                              <span className="truncate">{cat}</span>
                            </label>
                          );
                        })}
                      </div>
                      <span className="text-[10px] text-slate-400 mt-1 block">
                        Đã chọn: {selectedCategories.length} danh mục
                      </span>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* ── SECTION 2: QUYỀN CHI TIẾT ── */}
            {activeTabSection === "permissions" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <div>
                    <span className="font-bold text-slate-800 block">Tùy biến quyền hạn riêng (Custom Permissions)</span>
                    <span className="text-[11px] text-slate-500">
                      Admin này đang có {permissions.length}/{PERMISSIONS.length} quyền thao tác.
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleResetToRoleDefault}
                    className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-semibold text-[11px] flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw size={11} />
                    <span>Đặt lại theo vai trò</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {PERMISSIONS.map((perm) => {
                    const hasPerm = permissions.includes(perm.code);
                    return (
                      <div
                        key={perm.code}
                        onClick={() => toggleItem(permissions, perm.code, setPermissions)}
                        className={`p-3 rounded-xl border transition cursor-pointer flex items-center justify-between ${
                          hasPerm
                            ? "bg-emerald-50/40 border-emerald-200 text-slate-900"
                            : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
                        }`}
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs">{perm.name}</span>
                            <span className="font-mono text-[10px] text-slate-400">({perm.code})</span>
                            <span className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 text-[9px] font-semibold">
                              {perm.category}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500">{perm.description}</p>
                        </div>

                        <div
                          className={`w-5 h-5 rounded-md flex items-center justify-center font-bold text-xs ${
                            hasPerm ? "bg-[#063f38] text-white" : "border border-slate-300 bg-white"
                          }`}
                        >
                          {hasPerm && <Check size={12} strokeWidth={3} />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── SECTION 3: VAI TRÒ & THỜI HẠN ── */}
            {activeTabSection === "account" && (
              <div className="space-y-4">
                <div>
                  <label className="font-bold text-slate-800 block mb-1.5">Vai trò quản trị (Role Level):</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label
                      className={`p-3.5 rounded-xl border transition cursor-pointer flex items-start gap-3 ${
                        level === "CATEGORY_ADMIN"
                          ? "bg-blue-50/60 border-blue-400 ring-1 ring-blue-400"
                          : "bg-white border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="admin_level"
                        checked={level === "CATEGORY_ADMIN"}
                        onChange={() => setLevel("CATEGORY_ADMIN")}
                        className="mt-0.5 text-blue-600"
                      />
                      <div>
                        <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                          <UserCog size={13} className="text-blue-600" />
                          Admin cấp 1 (Category Admin)
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1">
                          Phụ trách duyệt bài, địa điểm, xử lý vi phạm trong phạm vi tỉnh &amp; danh mục được chỉ định.
                        </p>
                      </div>
                    </label>

                    <label
                      className={`p-3.5 rounded-xl border transition cursor-pointer flex items-start gap-3 ${
                        level === "SYSTEM_ADMIN"
                          ? "bg-amber-50/60 border-amber-400 ring-1 ring-amber-400"
                          : "bg-white border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="admin_level"
                        checked={level === "SYSTEM_ADMIN"}
                        onChange={() => setLevel("SYSTEM_ADMIN")}
                        className="mt-0.5 text-amber-600"
                      />
                      <div>
                        <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                          <Crown size={13} className="text-amber-600" />
                          Admin hệ thống (System Admin)
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1">
                          Toàn quyền cấu hình, phân quyền các admin khác và quản trị toàn bộ dữ liệu 63 tỉnh thành.
                        </p>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="font-bold text-slate-800 block mb-1.5">Trạng thái tài khoản:</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold focus:bg-white outline-none"
                    >
                      <option value="active">Đang hoạt động (Active)</option>
                      <option value="pending">Chờ bàn giao (Pending)</option>
                      <option value="suspended">Tạm ngưng quyền (Suspended)</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-800 block mb-1.5">
                      Thời hạn hiệu lực (ExpiresAt):
                    </label>
                    <input
                      type="date"
                      value={expiresAt}
                      onChange={(e) => setExpiresAt(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold focus:bg-white outline-none"
                    />
                    <span className="text-[10px] text-slate-400 mt-1 block">Để trống = Vô thời hạn</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="p-4 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold transition cursor-pointer"
            >
              Hủy bỏ
            </button>

            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#063f38] hover:bg-[#084f47] text-white text-xs font-semibold shadow-xs transition cursor-pointer flex items-center gap-1.5"
            >
              <Check size={14} />
              <span>Lưu thay đổi quyền &amp; scope</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   MODAL: CẤP QUYỀN ADMIN MỚI
   ══════════════════════════════════════════════════════════════════════ */

interface GrantNewAdminModalProps {
  onClose: () => void;
  onGrant: (newAdmin: AdminUser) => void;
}

function GrantNewAdminModal({ onClose, onGrant }: GrantNewAdminModalProps) {
  const [selectedCandidate, setSelectedCandidate] = useState<typeof CANDIDATE_USERS[0] | null>(null);
  const [candidateSearch, setCandidateSearch] = useState("");
  const [level, setLevel] = useState<AdminLevel>("CATEGORY_ADMIN");
  const [regions, setRegions] = useState<string[]>(["Miền Trung"]);
  const [provinces, setProvinces] = useState<string[]>(["Đà Nẵng"]);
  const [categories, setCategories] = useState<string[]>(["Nhà hàng & Quán ăn"]);

  const filteredCandidates = CANDIDATE_USERS.filter((c) => {
    if (!candidateSearch) return true;
    const q = candidateSearch.toLowerCase();
    return c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || String(c.id).includes(q);
  });

  const toggleItem = (arr: string[], item: string, setter: (v: string[]) => void) => {
    setter(arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item]);
  };

  const handleConfirm = () => {
    if (!selectedCandidate) return;

    const newAdmin: AdminUser = {
      id: selectedCandidate.id,
      name: selectedCandidate.name,
      email: selectedCandidate.email,
      avatar: selectedCandidate.avatar,
      level,
      status: "active",
      assignedAt: "Hôm nay",
      expiresAt: null,
      assignedBy: "Nguyễn Minh Anh",
      tasks30d: 0,
      regions: level === "SYSTEM_ADMIN" ? ["Miền Bắc", "Miền Trung", "Miền Nam"] : regions,
      provinces: level === "SYSTEM_ADMIN" ? ["Toàn quốc"] : provinces,
      categories: level === "SYSTEM_ADMIN" ? ["Tất cả danh mục"] : categories,
      customPermissions: level === "SYSTEM_ADMIN" ? PERMISSIONS.map((p) => p.code) : DEFAULT_ROLE_PERMISSIONS[level],
    };

    onGrant(newAdmin);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="w-full max-w-2xl bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-8">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="font-bold text-base text-slate-900">Cấp quyền quản trị viên mới</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Chọn người dùng có sẵn và phân quyền vai trò (Admin cấp 1 hoặc System Admin)
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer">
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-5 text-xs max-h-[65vh] overflow-y-auto">
          {/* Step 1: Chọn người dùng */}
          <div>
            <label className="font-bold text-slate-800 block mb-1.5">1. Chọn tài khoản người dùng:</label>
            <div className="relative mb-2">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Tìm tên hoặc email người dùng..."
                value={candidateSearch}
                onChange={(e) => setCandidateSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium focus:bg-white outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[160px] overflow-y-auto p-1">
              {filteredCandidates.map((cand) => {
                const isSelected = selectedCandidate?.id === cand.id;
                return (
                  <div
                    key={cand.id}
                    onClick={() => setSelectedCandidate(cand)}
                    className={`p-2.5 rounded-xl border flex items-center gap-3 transition cursor-pointer ${
                      isSelected
                        ? "bg-emerald-50/70 border-emerald-500 shadow-xs"
                        : "bg-white border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <img src={cand.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                    <div className="truncate">
                      <div className="font-bold text-slate-900 truncate">{cand.name}</div>
                      <div className="text-[10px] text-slate-400 truncate">#{cand.id} • {cand.email}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step 2: Chọn vai trò */}
          <div>
            <label className="font-bold text-slate-800 block mb-1.5">2. Chọn vai trò quản trị:</label>
            <div className="grid grid-cols-2 gap-3">
              <label
                className={`p-3 rounded-xl border transition cursor-pointer flex items-center gap-2.5 ${
                  level === "CATEGORY_ADMIN"
                    ? "bg-blue-50 border-blue-400 text-blue-900 font-bold"
                    : "bg-white border-slate-200 text-slate-700"
                }`}
              >
                <input
                  type="radio"
                  name="grant_level"
                  checked={level === "CATEGORY_ADMIN"}
                  onChange={() => setLevel("CATEGORY_ADMIN")}
                  className="text-blue-600"
                />
                <span>Admin cấp 1 (Theo Scope)</span>
              </label>

              <label
                className={`p-3 rounded-xl border transition cursor-pointer flex items-center gap-2.5 ${
                  level === "SYSTEM_ADMIN"
                    ? "bg-amber-50 border-amber-400 text-amber-900 font-bold"
                    : "bg-white border-slate-200 text-slate-700"
                }`}
              >
                <input
                  type="radio"
                  name="grant_level"
                  checked={level === "SYSTEM_ADMIN"}
                  onChange={() => setLevel("SYSTEM_ADMIN")}
                  className="text-amber-600"
                />
                <span>System Admin (Toàn quyền)</span>
              </label>
            </div>
          </div>

          {/* Step 3: Phạm vi nếu là Admin cấp 1 */}
          {level === "CATEGORY_ADMIN" && (
            <div className="space-y-3 pt-1 border-t border-slate-100">
              <label className="font-bold text-slate-800 block">3. Phân công phạm vi ban đầu:</label>

              <div>
                <span className="text-slate-600 font-semibold block mb-1.5">Vùng miền:</span>
                <div className="flex flex-wrap gap-2">
                  {ALL_REGIONS.map((r) => (
                    <button
                      type="button"
                      key={r}
                      onClick={() => toggleItem(regions, r, setRegions)}
                      className={`px-3 py-1 rounded-lg border text-xs font-semibold cursor-pointer ${
                        regions.includes(r)
                          ? "bg-[#063f38] text-white border-[#063f38]"
                          : "bg-white text-slate-700 border-slate-200"
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-slate-600 font-semibold block mb-1.5">Tỉnh thành phụ trách:</span>
                <div className="flex flex-wrap gap-1.5 max-h-[100px] overflow-y-auto p-2 bg-slate-50 rounded-xl border border-slate-200">
                  {ALL_PROVINCES.slice(0, 10).map((p) => (
                    <button
                      type="button"
                      key={p}
                      onClick={() => toggleItem(provinces, p, setProvinces)}
                      className={`px-2 py-1 rounded-md text-[11px] font-medium border cursor-pointer ${
                        provinces.includes(p)
                          ? "bg-blue-50 text-blue-800 border-blue-300 font-semibold"
                          : "bg-white text-slate-600 border-slate-200"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold transition cursor-pointer"
          >
            Hủy bỏ
          </button>

          <button
            type="button"
            disabled={!selectedCandidate}
            onClick={handleConfirm}
            className="px-5 py-2 rounded-xl bg-[#063f38] hover:bg-[#084f47] disabled:bg-slate-300 text-white text-xs font-semibold shadow-xs transition cursor-pointer"
          >
            Xác nhận cấp quyền
          </button>
        </div>
      </div>
    </div>
  );
}
