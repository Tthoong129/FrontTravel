import React, { useState, useMemo } from "react";
import {
  Users,
  Search,
  Filter,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Star,
  Award,
  Lock,
  Unlock,
  AlertTriangle,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  MoreVertical,
  Edit2,
  Trash2,
  Eye,
  FileSpreadsheet,
  Download,
  Plus,
  RefreshCw,
  X,
  MessageSquare,
  Image,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  Check,
  TrendingUp,
  Bookmark,
  Sparkles,
} from "lucide-react";

export interface UserItem {
  id: number;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  rank: "Tân binh" | "Khám phá viên" | "Người đồng hành" | "Đại sứ du lịch";
  reputation: number; // 0 - 100
  status: "active" | "reviewing" | "banned";
  region: "Miền Bắc" | "Miền Trung" | "Miền Nam";
  province: string;
  joinedAt: string;
  lastActive: string;
  totalProposals: number;
  totalReviews: number;
  totalPhotos: number;
  reportCount: number;
  bio: string;
}

const INITIAL_USERS: UserItem[] = [
  {
    id: 10482,
    name: "Nguyễn Hoàng Long",
    email: "long.nguyen@gmail.com",
    phone: "0905 123 456",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&h=120&fit=crop",
    rank: "Đại sứ du lịch",
    reputation: 94,
    status: "active",
    region: "Miền Trung",
    province: "Đà Nẵng",
    joinedAt: "12/01/2025",
    lastActive: "10 phút trước",
    totalProposals: 28,
    totalReviews: 84,
    totalPhotos: 312,
    reportCount: 0,
    bio: "Nhiếp ảnh gia và Food Reviewer đam mê khám phá ẩm thực đường phố và di sản văn hóa miền Trung.",
  },
  {
    id: 10317,
    name: "Trần Minh Quang",
    email: "quang.tran@gmail.com",
    phone: "0912 888 999",
    avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=120&h=120&fit=crop",
    rank: "Người đồng hành",
    reputation: 82,
    status: "active",
    region: "Miền Bắc",
    province: "Hà Nội",
    joinedAt: "24/02/2025",
    lastActive: "1 giờ trước",
    totalProposals: 14,
    totalReviews: 42,
    totalPhotos: 160,
    reportCount: 0,
    bio: "Sinh sống tại phố cổ Hà Nội, chuyên săn lùng những quán ăn trên 30 năm tuổi.",
  },
  {
    id: 10294,
    name: "Lê Thu Thảo",
    email: "thuthao.le@yahoo.com",
    phone: "0988 555 222",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop",
    rank: "Khám phá viên",
    reputation: 68,
    status: "active",
    region: "Miền Nam",
    province: "TP. Hồ Chí Minh",
    joinedAt: "15/05/2025",
    lastActive: "Hôm qua",
    totalProposals: 6,
    totalReviews: 19,
    totalPhotos: 85,
    reportCount: 1,
    bio: "Blogger du lịch tự túc, yêu thích cà phê không gian vintage và ẩm thực chợ đêm.",
  },
  {
    id: 10188,
    name: "Phạm Hải Đăng",
    email: "haidang.pham@outlook.com",
    phone: "0934 777 111",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop",
    rank: "Khám phá viên",
    reputation: 55,
    status: "reviewing",
    region: "Miền Trung",
    province: "Thừa Thiên Huế",
    joinedAt: "02/08/2025",
    lastActive: "2 ngày trước",
    totalProposals: 3,
    totalReviews: 8,
    totalPhotos: 24,
    reportCount: 4,
    bio: "Du khách tự do thường xuyên chia sẻ trải nghiệm lưu trú và ẩm thực cung đình.",
  },
  {
    id: 10098,
    name: "Tài khoản quảng cáo 247",
    email: "spam247.service@gmail.com",
    phone: "0900 000 999",
    avatar: "https://images.unsplash.com/photo-1628157582853-a796fa650a6a?w=120&h=120&fit=crop",
    rank: "Tân binh",
    reputation: 8,
    status: "banned",
    region: "Miền Nam",
    province: "Bình Dương",
    joinedAt: "20/09/2026",
    lastActive: "3 ngày trước",
    totalProposals: 0,
    totalReviews: 89,
    totalPhotos: 12,
    reportCount: 89,
    bio: "Dịch vụ tăng tương tác và đặt bàn tiệc.",
  },
  {
    id: 10055,
    name: "Đỗ Mai Anh",
    email: "maianh.do@gmail.com",
    phone: "0977 123 789",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop",
    rank: "Người đồng hành",
    reputation: 79,
    status: "active",
    region: "Miền Bắc",
    province: "Lào Cai",
    joinedAt: "10/03/2025",
    lastActive: "3 giờ trước",
    totalProposals: 11,
    totalReviews: 35,
    totalPhotos: 140,
    reportCount: 0,
    bio: "Hướng dẫn viên bản địa Sa Pa, chuyên dẫn tour trekking và cắm trại ngắm mây.",
  },
];

interface UsersTabProps {
  showToast: (message: string) => void;
}

export default function UsersTab({ showToast }: UsersTabProps) {
  const [users, setUsers] = useState<UserItem[]>(INITIAL_USERS);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [rankFilter, setRankFilter] = useState<string>("all");
  const [regionFilter, setRegionFilter] = useState<string>("all");
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);
  const [activeProfileTab, setActiveProfileTab] = useState<"info" | "contributions" | "reputation" | "actions">("info");
  const [reputationEditVal, setReputationEditVal] = useState<number>(50);
  const [banReasonText, setBanReasonText] = useState("");
  const [isBanModalOpen, setIsBanModalOpen] = useState(false);

  // Filtered list
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchSearch =
        u.name.toLowerCase().includes(searchText.toLowerCase()) ||
        u.email.toLowerCase().includes(searchText.toLowerCase()) ||
        u.phone.includes(searchText) ||
        u.id.toString().includes(searchText);

      const matchStatus = statusFilter === "all" || u.status === statusFilter;
      const matchRank = rankFilter === "all" || u.rank === rankFilter;
      const matchRegion = regionFilter === "all" || u.region === regionFilter;

      return matchSearch && matchStatus && matchRank && matchRegion;
    });
  }, [users, searchText, statusFilter, rankFilter, regionFilter]);

  // Statistics
  const totalCount = users.length;
  const activeCount = users.filter((u) => u.status === "active").length;
  const reviewingCount = users.filter((u) => u.status === "reviewing").length;
  const bannedCount = users.filter((u) => u.status === "banned").length;
  const ambassadorCount = users.filter((u) => u.rank === "Đại sứ du lịch").length;

  const handleToggleBan = (user: UserItem) => {
    if (user.status === "banned") {
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, status: "active", reputation: 50 } : u))
      );
      if (selectedUser?.id === user.id) {
        setSelectedUser((prev) => (prev ? { ...prev, status: "active", reputation: 50 } : null));
      }
      showToast(`Đã mở khóa tài khoản #${user.id} (${user.name}).`);
    } else {
      setSelectedUser(user);
      setIsBanModalOpen(true);
    }
  };

  const handleConfirmBan = () => {
    if (!selectedUser) return;
    setUsers((prev) =>
      prev.map((u) => (u.id === selectedUser.id ? { ...u, status: "banned", reputation: 0 } : u))
    );
    setSelectedUser((prev) => (prev ? { ...prev, status: "banned", reputation: 0 } : null));
    setIsBanModalOpen(false);
    setBanReasonText("");
    showToast(`Đã khóa tài khoản #${selectedUser.id} với lý do: "${banReasonText || "Vi phạm quy chế"}"`);
  };

  const handleUpdateReputation = () => {
    if (!selectedUser) return;
    setUsers((prev) =>
      prev.map((u) => (u.id === selectedUser.id ? { ...u, reputation: reputationEditVal } : u))
    );
    setSelectedUser((prev) => (prev ? { ...prev, reputation: reputationEditVal } : null));
    showToast(`Đã cập nhật điểm uy tín thành ${reputationEditVal}/100 cho ${selectedUser.name}.`);
  };

  const handlePromoteAmbassador = (user: UserItem) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === user.id ? { ...u, rank: "Đại sứ du lịch", reputation: 95 } : u))
    );
    if (selectedUser?.id === user.id) {
      setSelectedUser((prev) => (prev ? { ...prev, rank: "Đại sứ du lịch", reputation: 95 } : null));
    }
    showToast(`Đã vinh danh ${user.name} trở thành Đại Sứ Du Lịch!`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* ── 1. PAGE TITLE & ACTIONS ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <span>Quản lý Hồ sơ &amp; Điểm Uy Tín Thành Viên</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              10,482 Users
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Giám sát hồ sơ thành viên, thang điểm uy tín (Trust Score), xếp hạng Đại sứ du lịch và chế tài xử lý vi phạm.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => showToast("Đang xuất danh sách người dùng định dạng Excel...")}
            className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <FileSpreadsheet size={14} className="text-emerald-600" />
            <span>Xuất Excel</span>
          </button>
          <button
            onClick={() => showToast("Đã kích hoạt quét tự động tài khoản nghi vấn spam...")}
            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Sparkles size={14} />
            <span>AI Quét Rủi Ro</span>
          </button>
        </div>
      </div>

      {/* 4 Thẻ KPI Người Dùng */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-400 uppercase text-[10px]">Tổng Thành Viên</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Users size={16} />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">10,482</div>
          <div className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
            <TrendingUp size={12} /> +8.5% so với tháng trước
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-400 uppercase text-[10px]">Hoạt Động Tích Cực</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <CheckCircle2 size={16} />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{activeCount}</div>
          <div className="text-[11px] text-slate-500 font-medium">85% tương tác thường xuyên</div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-400 uppercase text-[10px]">Đại Sứ &amp; Cộng Tác</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Award size={16} />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-600">{ambassadorCount} Đại sứ</div>
          <div className="text-[11px] text-amber-700 font-bold">Uy tín &gt; 90 điểm</div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-400 uppercase text-[10px]">Cảnh Báo &amp; Đã Khóa</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
              <AlertTriangle size={16} />
            </div>
          </div>
          <div className="text-2xl font-black text-rose-600">{bannedCount + reviewingCount}</div>
          <div className="text-[11px] text-rose-600 font-bold">Vi phạm quy chế cộng đồng</div>
        </div>
      </div>

      {/* ── 2. OMNI-FILTER TOOLBAR ── */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-[0_3px_12px_rgba(0,0,0,0.03)] flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          <div className="relative min-w-[240px] flex-1 max-w-sm">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Tìm theo tên, email, SĐT hoặc User ID..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 outline-none focus:border-blue-500 focus:bg-white transition"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 outline-none hover:bg-white cursor-pointer"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Đang hoạt động</option>
            <option value="reviewing">Đang xem xét (Cảnh báo)</option>
            <option value="banned">Đã khóa tài khoản</option>
          </select>

          <select
            value={rankFilter}
            onChange={(e) => setRankFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 outline-none hover:bg-white cursor-pointer"
          >
            <option value="all">Tất cả cấp bậc</option>
            <option value="Đại sứ du lịch">Đại sứ du lịch (Cao cấp)</option>
            <option value="Người đồng hành">Người đồng hành</option>
            <option value="Khám phá viên">Khám phá viên</option>
            <option value="Tân binh">Tân binh</option>
          </select>

          <select
            value={regionFilter}
            onChange={(e) => setRegionFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 outline-none hover:bg-white cursor-pointer"
          >
            <option value="all">Tất cả 3 miền</option>
            <option value="Miền Bắc">Miền Bắc</option>
            <option value="Miền Trung">Miền Trung</option>
            <option value="Miền Nam">Miền Nam</option>
          </select>
        </div>

        <div className="text-[11px] text-slate-400 font-semibold">
          Tìm thấy <strong>{filteredUsers.length}</strong> kết quả
        </div>
      </div>

      {/* ── 3. DATA TABLE NGƯỜI DÙNG RUBICK ── */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_3px_12px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-[10px] font-black uppercase tracking-wider text-slate-400 border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-4">NGƯỜI DÙNG</th>
                <th className="py-3.5 px-4">CẤP BẬC / DANH HIỆU</th>
                <th className="py-3.5 px-4">ĐIỂM UY TÍN</th>
                <th className="py-3.5 px-4 text-center">ĐÓNG GÓP</th>
                <th className="py-3.5 px-4">KHU VỰC</th>
                <th className="py-3.5 px-4 text-center">TRẠNG THÁI</th>
                <th className="py-3.5 px-4 text-right">THAO TÁC</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/80 transition">
                  {/* Avatar & User Info */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-9 h-9 rounded-full object-cover border border-slate-200 shadow-2xs"
                      />
                      <div>
                        <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                          <span>{user.name}</span>
                          {user.rank === "Đại sứ du lịch" && (
                            <span className="text-amber-500 font-bold" title="Đại sứ du lịch uy tín">★</span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          #{user.id} • {user.email}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Rank Badge */}
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        user.rank === "Đại sứ du lịch"
                          ? "bg-amber-50 text-amber-700 border border-amber-200"
                          : user.rank === "Người đồng hành"
                          ? "bg-blue-50 text-blue-700 border border-blue-200"
                          : user.rank === "Khám phá viên"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {user.rank === "Đại sứ du lịch" && <CrownIcon size={10} />}
                      <span>{user.rank}</span>
                    </span>
                  </td>

                  {/* Điểm Uy Tín Progress */}
                  <td className="py-3.5 px-4">
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px]">
                        <span className="font-black text-slate-900">{user.reputation}/100</span>
                        <span className="text-[10px] text-slate-400">
                          {user.reputation >= 80 ? "Rất cao" : user.reputation >= 50 ? "Khá" : "Rủi ro"}
                        </span>
                      </div>
                      <div className="w-24 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            user.reputation >= 80
                              ? "bg-emerald-500"
                              : user.reputation >= 50
                              ? "bg-blue-500"
                              : "bg-rose-500"
                          }`}
                          style={{ width: `${user.reputation}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  {/* Đóng góp */}
                  <td className="py-3.5 px-4 text-center">
                    <div className="inline-flex items-center gap-2 text-[11px] font-semibold text-slate-700 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
                      <span title="Địa điểm đề xuất">{user.totalProposals} địa điểm</span>
                      <span>•</span>
                      <span title="Đánh giá">{user.totalReviews} review</span>
                    </div>
                  </td>

                  {/* Khu vực */}
                  <td className="py-3.5 px-4">
                    <div className="text-xs font-bold text-slate-800">{user.province}</div>
                    <div className="text-[10px] text-slate-400">{user.region}</div>
                  </td>

                  {/* Trạng thái */}
                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        user.status === "active"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : user.status === "reviewing"
                          ? "bg-amber-50 text-amber-700 border border-amber-200"
                          : "bg-rose-50 text-rose-700 border border-rose-200"
                      }`}
                    >
                      {user.status === "active"
                        ? "✓ Hoạt động"
                        : user.status === "reviewing"
                        ? "⚠ Đang xem xét"
                        : "✕ Đã khóa"}
                    </span>
                  </td>

                  {/* Thao tác */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setActiveProfileTab("info");
                          setReputationEditVal(user.reputation);
                        }}
                        className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-[11px] transition cursor-pointer"
                      >
                        Hồ sơ
                      </button>

                      <button
                        onClick={() => handleToggleBan(user)}
                        className={`p-1.5 rounded-lg border text-[11px] transition cursor-pointer ${
                          user.status === "banned"
                            ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                            : "border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100"
                        }`}
                        title={user.status === "banned" ? "Mở khóa tài khoản" : "Khóa tài khoản"}
                      >
                        {user.status === "banned" ? <Unlock size={13} /> : <Lock size={13} />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── 4. USER PROFILE HUB DRAWER (MODAL BÊN PHẢI) ── */}
      {selectedUser && !isBanModalOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-xl h-full bg-white shadow-2xl flex flex-col justify-between overflow-y-auto border-l border-slate-200">
            {/* Drawer Header */}
            <div>
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedUser.avatar}
                    alt={selectedUser.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md ring-2 ring-blue-500"
                  />
                  <div>
                    <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                      <span>{selectedUser.name}</span>
                      <span className="text-xs text-slate-400 font-normal">#{selectedUser.id}</span>
                    </h3>
                    <div className="text-xs text-blue-600 font-bold mt-0.5">{selectedUser.rank}</div>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedUser(null)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Sub-tabs Profile */}
              <div className="flex border-b border-slate-100 px-6 gap-6 text-xs font-bold text-slate-500">
                <button
                  onClick={() => setActiveProfileTab("info")}
                  className={`py-3 border-b-2 transition cursor-pointer ${
                    activeProfileTab === "info" ? "border-blue-600 text-blue-600 font-black" : "border-transparent hover:text-slate-800"
                  }`}
                >
                  Thông Tin Cá Nhân
                </button>
                <button
                  onClick={() => setActiveProfileTab("contributions")}
                  className={`py-3 border-b-2 transition cursor-pointer ${
                    activeProfileTab === "contributions" ? "border-blue-600 text-blue-600 font-black" : "border-transparent hover:text-slate-800"
                  }`}
                >
                  Lịch Sử Đóng Góp
                </button>
                <button
                  onClick={() => setActiveProfileTab("reputation")}
                  className={`py-3 border-b-2 transition cursor-pointer ${
                    activeProfileTab === "reputation" ? "border-blue-600 text-blue-600 font-black" : "border-transparent hover:text-slate-800"
                  }`}
                >
                  Điểm Uy Tín
                </button>
                <button
                  onClick={() => setActiveProfileTab("actions")}
                  className={`py-3 border-b-2 transition cursor-pointer ${
                    activeProfileTab === "actions" ? "border-blue-600 text-blue-600 font-black" : "border-transparent hover:text-slate-800"
                  }`}
                >
                  Thao Tác Quản Trị
                </button>
              </div>

              {/* Drawer Content Body */}
              <div className="p-6 space-y-5 text-xs">
                {activeProfileTab === "info" && (
                  <div className="space-y-4">
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Tiểu sử (Bio)</span>
                      <p className="text-slate-700 leading-relaxed italic">"{selectedUser.bio}"</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <span className="text-[10px] font-bold text-slate-400 uppercase block">Email</span>
                        <span className="font-semibold text-slate-800">{selectedUser.email}</span>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <span className="text-[10px] font-bold text-slate-400 uppercase block">Điện thoại</span>
                        <span className="font-semibold text-slate-800">{selectedUser.phone}</span>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <span className="text-[10px] font-bold text-slate-400 uppercase block">Địa bàn sinh sống</span>
                        <span className="font-semibold text-slate-800">{selectedUser.province} • {selectedUser.region}</span>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <span className="text-[10px] font-bold text-slate-400 uppercase block">Ngày tham gia</span>
                        <span className="font-semibold text-slate-800">{selectedUser.joinedAt}</span>
                      </div>
                    </div>
                  </div>
                )}

                {activeProfileTab === "contributions" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div className="p-3 bg-blue-50 text-blue-900 rounded-xl border border-blue-100">
                        <div className="text-xl font-black">{selectedUser.totalProposals}</div>
                        <span className="text-[10px] font-bold">Địa điểm đề xuất</span>
                      </div>
                      <div className="p-3 bg-emerald-50 text-emerald-900 rounded-xl border border-emerald-100">
                        <div className="text-xl font-black">{selectedUser.totalReviews}</div>
                        <span className="text-[10px] font-bold">Bài đánh giá</span>
                      </div>
                      <div className="p-3 bg-purple-50 text-purple-900 rounded-xl border border-purple-100">
                        <div className="text-xl font-black">{selectedUser.totalPhotos}</div>
                        <span className="text-[10px] font-bold">Hình ảnh tải lên</span>
                      </div>
                    </div>

                    <div className="space-y-2 pt-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Đóng góp gần đây</span>
                      {[
                        { title: "Đề xuất thêm quán Bún Bò Huế O Cương", time: "Hôm qua", status: "Đã duyệt" },
                        { title: "Đánh giá 5 sao cho Phở Gia Truyền Bát Đàn", time: "3 ngày trước", status: "Hợp lệ" },
                        { title: "Tải lên 8 ảnh check-in Cầu Rồng Đà Nẵng", time: "Tuần trước", status: "Đã xuất bản" },
                      ].map((item, idx) => (
                        <div key={idx} className="p-3 bg-slate-50 rounded-xl flex items-center justify-between border border-slate-100">
                          <div>
                            <div className="font-bold text-slate-800">{item.title}</div>
                            <span className="text-[10px] text-slate-400">{item.time}</span>
                          </div>
                          <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                            {item.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeProfileTab === "reputation" && (
                  <div className="space-y-4">
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-700">Điểm Uy Tín Hiện Tại</span>
                        <span className="text-xl font-black text-blue-600">{selectedUser.reputation} / 100</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={reputationEditVal}
                        onChange={(e) => setReputationEditVal(Number(e.target.value))}
                        className="w-full cursor-pointer accent-blue-600"
                      />
                      <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
                        <span>0đ (Nguy cơ)</span>
                        <span>50đ (Trung bình)</span>
                        <span>100đ (Xuất sắc)</span>
                      </div>
                      <button
                        onClick={handleUpdateReputation}
                        className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition cursor-pointer"
                      >
                        Lưu Điểm Uy Tín ({reputationEditVal}đ)
                      </button>
                    </div>

                    <div className="space-y-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Lịch sử biến động uy tín</span>
                      {[
                        { reason: "Duyệt đề xuất địa điểm chất lượng", delta: "+15đ", time: "10/09/2026" },
                        { reason: "Bài đánh giá được bình chọn hữu ích", delta: "+5đ", time: "05/09/2026" },
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                          <div>
                            <div className="font-bold text-slate-800">{item.reason}</div>
                            <span className="text-[10px] text-slate-400">{item.time}</span>
                          </div>
                          <span className="font-black text-emerald-600">{item.delta}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeProfileTab === "actions" && (
                  <div className="space-y-3">
                    {selectedUser.rank !== "Đại sứ du lịch" && (
                      <button
                        onClick={() => handlePromoteAmbassador(selectedUser)}
                        className="w-full p-3 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 font-bold text-left flex items-center justify-between transition cursor-pointer"
                      >
                        <div>
                          <div>Vinh danh thành Đại Sứ Du Lịch</div>
                          <span className="text-[10px] font-normal text-amber-700">Cấp huy hiệu ngôi sao vàng và quyền đề xuất nhanh</span>
                        </div>
                        <Award size={18} className="text-amber-600" />
                      </button>
                    )}

                    <button
                      onClick={() => showToast(`Đã gửi email đặt lại mật khẩu tới ${selectedUser.email}`)}
                      className="w-full p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 font-bold text-left flex items-center justify-between transition cursor-pointer"
                    >
                      <div>
                        <div>Gửi liên kết đặt lại mật khẩu</div>
                        <span className="text-[10px] font-normal text-slate-500">Người dùng sẽ nhận email xác thực bảo mật</span>
                      </div>
                      <Mail size={16} className="text-slate-500" />
                    </button>

                    <button
                      onClick={() => showToast(`Đã ẩn toàn bộ 89 bài viết và đánh giá của #${selectedUser.id}`)}
                      className="w-full p-3 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-800 font-bold text-left flex items-center justify-between transition cursor-pointer"
                    >
                      <div>
                        <div>Ẩn toàn bộ nội dung hàng loạt</div>
                        <span className="text-[10px] font-normal text-rose-600">Áp dụng khi phát hiện tài khoản phát tán spam / xúc phạm</span>
                      </div>
                      <Trash2 size={16} className="text-rose-600" />
                    </button>

                    <button
                      onClick={() => handleToggleBan(selectedUser)}
                      className={`w-full p-3 rounded-xl font-bold text-left flex items-center justify-between transition cursor-pointer ${
                        selectedUser.status === "banned"
                          ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                          : "bg-rose-600 hover:bg-rose-700 text-white"
                      }`}
                    >
                      <div>
                        <div>{selectedUser.status === "banned" ? "Mở khóa tài khoản ngay" : "Khóa tài khoản người dùng"}</div>
                        <span className="text-[10px] font-normal opacity-80">
                          {selectedUser.status === "banned" ? "Khôi phục quyền truy cập" : "Chặn đăng nhập và tương tác"}
                        </span>
                      </div>
                      {selectedUser.status === "banned" ? <Unlock size={16} /> : <Lock size={16} />}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">ID Người dùng: <strong>#{selectedUser.id}</strong></span>
              <button
                onClick={() => setSelectedUser(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 5. MODAL XÁC NHẬN KHÓA TÀI KHOẢN ── */}
      {isBanModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center">
              <Lock size={22} />
            </div>

            <div>
              <h3 className="text-lg font-black text-slate-900">Xác Nhận Khóa Tài Khoản</h3>
              <p className="text-xs text-slate-500 mt-1">
                Bạn đang thực hiện khóa tài khoản <strong>{selectedUser.name}</strong> (#{selectedUser.id}). Người dùng này sẽ bị ngắt kết nối và không thể tương tác trên LangThang.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Lý do khóa tài khoản (Bắt buộc để lưu Audit Log):</label>
              <textarea
                rows={3}
                value={banReasonText}
                onChange={(e) => setBanReasonText(e.target.value)}
                placeholder="Ví dụ: Phát tán nội dung spam quảng cáo sai sự thật, xúc phạm người dùng khác..."
                className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-xs outline-none focus:border-rose-500 focus:bg-white"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setIsBanModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs cursor-pointer"
              >
                Hủy
              </button>
              <button
                onClick={handleConfirmBan}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition cursor-pointer"
              >
                Xác Nhận Khóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CrownIcon({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M5 16L3 5L8.5 10L12 4L15.5 10L21 5L19 16H5M19 19C19 19.6 18.6 20 18 20H6C5.4 20 5 19.6 5 19V18H19V19Z" />
    </svg>
  );
}
