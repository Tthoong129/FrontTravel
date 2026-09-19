import { useState, useEffect } from "react";
import {
  Camera,
  Edit3,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Key,
  Shield,
  Star,
  Plus,
  Clock,
  Heart,
  MessageSquare,
  Sparkles,
  Award,
  CheckCircle2,
  XCircle,
  AlertCircle,
  X,
  Lock,
  Compass,
  Eye,
  FileCheck,
  Send,
  Trash2,
  Check,
  ExternalLink,
  Bookmark,
  FileText,
  Users,
  ShieldAlert,
  Flag,
  HelpCircle,
  Info,
} from "lucide-react";
import {
  UserProfileData,
  FavoriteItem,
  VisitLogItem,
  ProposalItem,
  initialUserProfile,
} from "./data";
import FavoritesSection from "./FavoritesSection";
import VisitedLogSection from "./VisitedLogSection";
import ReportModal, { ReportTargetInfo } from "./ReportModal";

interface ProfilePageProps {
  user: UserProfileData;
  onUpdateUser: (updatedUser: UserProfileData) => void;
  favorites: FavoriteItem[];
  onRemoveFavorite: (id: number) => void;
  visitLogs: VisitLogItem[];
  onAddVisitLog: (newLog: VisitLogItem) => void;
  onTogglePrivacyVisitLog?: (id: number) => void;
  onUpdateVisitLog?: (updatedLog: VisitLogItem) => void;
  onDeleteVisitLog?: (id: number) => void;
  proposals: ProposalItem[];
  onOpenProposeModal: () => void;
  onOpenFriends?: () => void;
  onNavigate?: (target: string) => void;
  initialTab?: "reviews" | "favorites" | "visitLogs" | "proposals" | "blogs" | "reports";
}

export default function ProfilePage({
  user,
  onUpdateUser,
  favorites,
  onRemoveFavorite,
  visitLogs,
  onAddVisitLog,
  onTogglePrivacyVisitLog,
  onUpdateVisitLog,
  onDeleteVisitLog,
  proposals,
  onOpenProposeModal,
  onOpenFriends,
  initialTab = "reviews",
}: ProfilePageProps) {
  const [activeTab, setActiveTab] = useState<
    "reviews" | "favorites" | "visitLogs" | "proposals" | "blogs" | "reports"
  >(initialTab);

  // Sync activeTab when initialTab changes (from dropdown)
  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  // Proposals Filter & Modal Detail State
  const [proposalFilter, setProposalFilter] = useState<"all" | 0 | 1 | 2>("all");
  const [selectedProposalDetail, setSelectedProposalDetail] = useState<ProposalItem | null>(null);

  // Edit Profile Modal State
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [editName, setEditName] = useState(user.fullName);
  const [editBio, setEditBio] = useState(user.bio);
  const [editJob, setEditJob] = useState(user.job);
  const [editAddress, setEditAddress] = useState(user.address);
  const [editPhone, setEditPhone] = useState(user.phone);

  // Password Modal State
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Toast state
  const [toastMessage, setToastMessage] = useState("");

  // Report Modal State
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportModalTab, setReportModalTab] = useState<"form" | "guide" | "history">("form");
  const [selectedReportTarget, setSelectedReportTarget] = useState<ReportTargetInfo | undefined>(undefined);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 2500);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: UserProfileData = {
      ...user,
      fullName: editName.trim() || user.fullName,
      bio: editBio.trim() || user.bio,
      job: editJob.trim() || user.job,
      address: editAddress.trim() || user.address,
      phone: editPhone.trim() || user.phone,
    };
    onUpdateUser(updated);
    setIsEditProfileOpen(false);
    showToast("Đã cập nhật thông tin cá nhân.");
  };

  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    if (!currentPassword) {
      setPasswordError("Vui lòng nhập mật khẩu hiện tại.");
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError("Mật khẩu mới phải từ 6 ký tự trở lên.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Xác nhận mật khẩu mới chưa khớp.");
      return;
    }

    setIsPasswordModalOpen(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    showToast("Đã cập nhật mật khẩu mới an toàn.");
  };

  return (
    <div className="min-h-screen bg-slate-50 font-['Inter',system-ui,sans-serif] pb-20">
      {/* ── PROFILE HERO SECTION (COVER & AVATAR) ── */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Cover Photo */}
          <div className="relative h-60 sm:h-72 rounded-b-2xl overflow-hidden bg-slate-200">
            <img
              src={user.coverUrl}
              alt="Cover"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

            {/* Edit Cover Button */}
            <button
              onClick={() => setIsEditProfileOpen(true)}
              className="absolute bottom-4 right-4 px-3 py-1.5 rounded-lg bg-white/90 hover:bg-white text-slate-800 text-xs font-semibold shadow-sm backdrop-blur-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Camera size={14} />
              <span className="hidden sm:inline">Chỉnh ảnh bìa</span>
            </button>
          </div>

          {/* Profile Identity Bar */}
          <div className="relative pb-6 pt-3 flex flex-col md:flex-row md:items-end justify-between gap-6">
            {/* Avatar & Basic Info */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
              {/* Avatar with edit button */}
              <div className="relative -mt-16 sm:-mt-20 w-32 h-32 sm:w-36 sm:h-36 rounded-full p-1 bg-white shadow-md flex-shrink-0 z-10">
                <img
                  src={user.avatarUrl}
                  alt={user.fullName}
                  className="w-full h-full rounded-full object-cover border border-slate-100"
                />
                <button
                  onClick={() => setIsEditProfileOpen(true)}
                  className="absolute bottom-1 right-1 w-8 h-8 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white flex items-center justify-center shadow-sm transition-colors border-2 border-white cursor-pointer"
                  title="Chỉnh ảnh đại diện"
                >
                  <Camera size={14} />
                </button>
              </div>

              {/* Identity details */}
              <div className="pt-2 sm:pt-3">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 mb-1.5">
                  <h1
                    className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {user.fullName}
                  </h1>
                  {/* Rank Badge */}
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                    <Award size={12} className="text-amber-600" />
                    {user.rankLevel}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 max-w-xl line-clamp-2 leading-relaxed">
                  {user.bio}
                </p>
                <div className="flex items-center justify-center sm:justify-start gap-3 mt-2 text-xs text-slate-500">
                  <span className="font-semibold text-emerald-800">
                    {user.reputationScore} điểm uy tín
                  </span>
                  <span>·</span>
                  <span>{user.job}</span>
                </div>
              </div>
            </div>

            {/* Profile Action Buttons */}
            <div className="flex items-center justify-center gap-2.5 flex-shrink-0 pb-1">
              <button
                onClick={onOpenProposeModal}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Plus size={14} />
                <span>Đề xuất địa điểm</span>
              </button>

              <button
                onClick={() => setIsEditProfileOpen(true)}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <Edit3 size={14} />
                <span>Chỉnh sửa hồ sơ</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── PROFILE MAIN CONTENT: 2 COLUMNS ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ══════════ LEFT SIDEBAR: INTRO & SECURITY ══════════ */}
          <aside className="lg:col-span-4 space-y-5 lg:sticky lg:top-24">
            {/* Intro Card */}
            <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                  Giới thiệu
                </h3>
                <button
                  onClick={() => setIsEditProfileOpen(true)}
                  className="text-xs font-semibold text-emerald-800 hover:underline cursor-pointer"
                >
                  Sửa
                </button>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                {user.bio}
              </p>

              <ul className="space-y-3 text-xs text-slate-700 pt-1 border-t border-slate-100">
                <li className="flex items-center gap-2.5">
                  <MapPin size={15} className="text-slate-400 flex-shrink-0" />
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-slate-400">Nơi sống:</span>
                    <span className="font-medium text-slate-800">{user.address}</span>
                  </div>
                </li>

                <li className="flex items-center gap-2.5">
                  <Phone size={15} className="text-slate-400 flex-shrink-0" />
                  <div className="flex-1 flex items-baseline gap-1.5">
                    <span className="text-slate-400">Điện thoại:</span>
                    <span className="font-medium text-slate-800">{user.phone}</span>
                  </div>
                  <span title="Bảo mật riêng tư">
                    <Lock size={12} className="text-slate-400" />
                  </span>
                </li>

                <li className="flex items-center gap-2.5">
                  <Mail size={15} className="text-slate-400 flex-shrink-0" />
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-slate-400">Email:</span>
                    <span className="font-medium text-slate-800 truncate">{user.email}</span>
                  </div>
                </li>

                <li className="flex items-center gap-2.5">
                  <Calendar size={15} className="text-slate-400 flex-shrink-0" />
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-slate-400">Tham gia:</span>
                    <span className="font-medium text-slate-800">{user.joinedDate}</span>
                  </div>
                </li>
              </ul>
            </div>

            {/* Account Security Card */}
            <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs">
              <div className="flex items-center gap-2 mb-1.5">
                <Shield size={15} className="text-slate-600" />
                <h3 className="text-sm font-bold text-slate-900 tracking-tight">Bảo mật tài khoản</h3>
              </div>
              <p className="text-xs text-slate-500 mb-3.5 leading-relaxed">
                Quản lý mật khẩu và thiết lập an toàn cho tài khoản.
              </p>
              <button
                onClick={() => setIsPasswordModalOpen(true)}
                className="w-full py-2 px-3.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors flex items-center justify-between cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Key size={13} className="text-slate-400" /> Đổi mật khẩu
                </span>
                <span className="text-emerald-800 text-[11px] font-bold">Thay đổi →</span>
              </button>
            </div>

            {/* Travel Companions Quick Widget */}
            <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Users size={15} className="text-slate-700" />
                  <h3 className="text-sm font-bold text-slate-900 tracking-tight">Bạn đồng hành</h3>
                </div>
                <button
                  onClick={onOpenFriends}
                  className="text-xs font-semibold text-emerald-800 hover:underline cursor-pointer"
                >
                  Xem tất cả
                </button>
              </div>
              <p className="text-xs text-slate-500 mb-3 leading-relaxed">
                3 bạn bè đã kết nối cùng chia sẻ hành trình và địa điểm yêu thích.
              </p>
              <div className="flex items-center -space-x-2 overflow-hidden py-1">
                <img
                  className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover"
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop"
                  alt="Lê Hoàng Long"
                  title="Lê Hoàng Long"
                />
                <img
                  className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover"
                  src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop"
                  alt="Trần Mai Phương"
                  title="Trần Mai Phương"
                />
                <img
                  className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover"
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop"
                  alt="Vũ Đình Trọng"
                  title="Vũ Đình Trọng"
                />
                <div
                  onClick={onOpenFriends}
                  className="inline-flex items-center justify-center h-8 w-8 rounded-full ring-2 ring-white bg-emerald-50 text-emerald-800 text-[10px] font-bold cursor-pointer hover:bg-emerald-100 transition-colors"
                >
                  +2
                </div>
              </div>
            </div>
          </aside>

          {/* ══════════ RIGHT MAIN: TABS & CONTENT ══════════ */}
          <div className="lg:col-span-8 space-y-6">
            {/* Tabs Navigation Bar - Flat, natural, no AI-boxed wrapper */}
            <div className="border-b border-slate-200">
              <nav className="flex items-center gap-1 sm:gap-6 overflow-x-auto no-scrollbar -mb-px" aria-label="Tabs">
                {[
                  { id: "reviews", label: "Bài đánh giá", count: 2, icon: MessageSquare },
                  { id: "favorites", label: "Mục đã lưu", count: favorites.length, icon: Bookmark },
                  { id: "visitLogs", label: "Nhật ký ghé thăm", count: visitLogs.length, icon: Compass },
                  { id: "proposals", label: "Địa điểm đã đề xuất", count: proposals.length, icon: MapPin },
                  { id: "blogs", label: "Blog & Lịch trình", count: 3, icon: FileText },
                  { id: "reports", label: "Tố cáo vi phạm", count: 3, icon: ShieldAlert },
                ].map((t) => {
                  const Icon = t.icon;
                  const isActive = activeTab === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setActiveTab(t.id as any)}
                      className={`group inline-flex items-center gap-2 py-3 px-3 border-b-2 text-xs sm:text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
                        isActive
                          ? "border-emerald-800 text-emerald-900 font-semibold"
                          : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300"
                      }`}
                    >
                      <Icon
                        size={16}
                        className={`transition-colors ${
                          isActive ? "text-emerald-800" : "text-slate-400 group-hover:text-slate-600"
                        }`}
                      />
                      <span>{t.label}</span>
                      <span
                        className={`text-[11px] px-2 py-0.5 rounded-full font-medium transition-colors ${
                          isActive
                            ? "bg-emerald-100 text-emerald-900"
                            : "bg-slate-200/70 text-slate-600 group-hover:bg-slate-200"
                        }`}
                      >
                        {t.count}
                      </span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* TAB 1: BÀI ĐÁNH GIÁ (REVIEWS) */}
            {activeTab === "reviews" && (
              <div className="space-y-4">
                {/* Review 1 */}
                <article className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs space-y-3.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={user.avatarUrl}
                        alt=""
                        className="w-9 h-9 rounded-full object-cover border border-slate-100"
                      />
                      <div>
                        <p className="text-xs font-semibold text-slate-900">{user.fullName}</p>
                        <p className="text-[11px] text-slate-400">2 giờ trước · Cà phê Mây Lang Thang, Đà Lạt</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={11} className="fill-amber-400 text-amber-400" />
                      ))}
                      <span className="text-[11px] font-bold text-amber-900 ml-1">5.0</span>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    Không gian yên tĩnh, nhìn xuống thung lũng rất đẹp vào sáng sớm khi mây chưa tan. Nhân viên dễ thương và cà phê trứng thơm béo, rất đáng để ghé khi đến Đà Lạt.
                  </p>

                  <div className="rounded-lg overflow-hidden aspect-video max-h-72 bg-slate-100">
                    <img
                      src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=85&w=1200&auto=format&fit=crop"
                      alt="Không gian quán cà phê"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center gap-4 text-xs text-slate-500">
                    <button className="flex items-center gap-1.5 hover:text-emerald-800 transition-colors cursor-pointer">
                      <Heart size={14} /> <span>Hữu ích (14)</span>
                    </button>
                    <button className="flex items-center gap-1.5 hover:text-emerald-800 transition-colors cursor-pointer">
                      <MessageSquare size={14} /> <span>3 bình luận</span>
                    </button>
                  </div>
                </article>

                {/* Review 2 */}
                <article className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs space-y-3.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={user.avatarUrl}
                        alt=""
                        className="w-9 h-9 rounded-full object-cover border border-slate-100"
                      />
                      <div>
                        <p className="text-xs font-semibold text-slate-900">{user.fullName}</p>
                        <p className="text-[11px] text-slate-400">Hôm qua · Bánh Mì Phượng, Hội An</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60">
                      {[...Array(4)].map((_, i) => (
                        <Star key={i} size={11} className="fill-amber-400 text-amber-400" />
                      ))}
                      <span className="text-[11px] font-bold text-amber-900 ml-1">4.0</span>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    Bánh mì giòn rụm, pate đậm đà. Vào giờ ăn trưa xếp hàng khoảng 15 phút, các bạn nên đi sớm để tránh đông nhé.
                  </p>
                </article>
              </div>
            )}

            {/* TAB 2: MỤC ĐÃ LƯU (FAVORITES) */}
            {activeTab === "favorites" && (
              <FavoritesSection
                favorites={favorites}
                onRemoveFavorite={onRemoveFavorite}
              />
            )}

            {/* TAB 3: NHẬT KÝ ĐÃ GHÉ THĂM (VISITED LOGS) */}
            {activeTab === "visitLogs" && (
              <VisitedLogSection
                logs={visitLogs}
                onAddLog={onAddVisitLog}
                onTogglePrivacy={onTogglePrivacyVisitLog}
                onUpdateLog={onUpdateVisitLog}
                onDeleteLog={onDeleteVisitLog}
              />
            )}

            {/* TAB 4: ĐỊA ĐIỂM ĐÃ ĐỀ XUẤT (PROPOSALS MANAGEMENT CENTER) */}
            {activeTab === "proposals" && (
              <div className="space-y-6">
                {/* Header & Filter Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                      Địa điểm bạn đã đóng góp
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Theo dõi tiến độ xét duyệt và phản hồi từ ban quản trị
                    </p>
                  </div>

                  <button
                    onClick={onOpenProposeModal}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 transition-all flex items-center gap-1.5 shadow-xs cursor-pointer self-start sm:self-auto"
                  >
                    <Plus size={14} /> <span>Đề xuất địa điểm</span>
                  </button>
                </div>

                {/* Status Filter Tabs - Clean, subtle badges without emojis */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                  {[
                    { id: "all", label: "Tất cả", count: proposals.length, dot: null },
                    {
                      id: 0,
                      label: "Chờ duyệt",
                      count: proposals.filter((p) => p.status === 0).length,
                      dot: "bg-amber-400",
                    },
                    {
                      id: 1,
                      label: "Đã phê duyệt",
                      count: proposals.filter((p) => p.status === 1).length,
                      dot: "bg-emerald-500",
                    },
                    {
                      id: 2,
                      label: "Cần chỉnh sửa",
                      count: proposals.filter((p) => p.status === 2).length,
                      dot: "bg-rose-400",
                    },
                  ].map((tab) => {
                    const isSelected = proposalFilter === tab.id;
                    return (
                      <button
                        key={String(tab.id)}
                        onClick={() => setProposalFilter(tab.id as any)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                          isSelected
                            ? "bg-slate-900 text-white font-semibold shadow-xs"
                            : "bg-white hover:bg-slate-100 text-slate-600 border border-slate-200"
                        }`}
                      >
                        {tab.dot && (
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isSelected ? "bg-white" : tab.dot
                            }`}
                          />
                        )}
                        <span>{tab.label}</span>
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${
                            isSelected
                              ? "bg-white/20 text-white"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {tab.count}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Proposals Cards List */}
                <div className="space-y-3.5">
                  {proposals
                    .filter(
                      (prop) =>
                        proposalFilter === "all" || prop.status === proposalFilter
                    )
                    .map((prop) => (
                      <div
                        key={prop.id}
                        className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all flex flex-col md:flex-row gap-4 items-start md:items-center"
                      >
                        <div className="relative w-full md:w-44 h-32 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0 group">
                          <img
                            src={prop.coverImg}
                            alt={prop.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute top-2 left-2">
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-black/60 text-white backdrop-blur-md">
                              {prop.category}
                            </span>
                          </div>
                        </div>

                        <div className="flex-1 min-w-0 space-y-2 w-full">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex flex-wrap items-center gap-2">
                              <h4 className="text-sm sm:text-base font-bold text-slate-900">
                                {prop.name}
                              </h4>

                              {/* Status Badges */}
                              {prop.status === 0 && (
                                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-medium bg-amber-50 text-amber-900 border border-amber-200/60">
                                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                  <span>Chờ duyệt</span>
                                </span>
                              )}
                              {prop.status === 1 && (
                                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-medium bg-emerald-50 text-emerald-900 border border-emerald-200/60">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                                  <span>Đã phê duyệt</span>
                                </span>
                              )}
                              {prop.status === 2 && (
                                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-medium bg-rose-50 text-rose-800 border border-rose-200/60">
                                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                                  <span>Cần chỉnh sửa</span>
                                </span>
                              )}
                            </div>

                            <span className="text-[11px] text-slate-400">
                              Gửi {prop.createdAt}
                            </span>
                          </div>

                          <p className="text-xs text-slate-500 flex items-center gap-1">
                            <MapPin size={13} className="text-slate-400 flex-shrink-0" />
                            <span className="truncate">
                              {prop.province} · {prop.address}
                            </span>
                          </p>

                          {/* WORKFLOW PROGRESS (Dành cho trạng thái Chờ Duyệt) */}
                          {prop.status === 0 && (
                            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200/70 text-[11px] space-y-1">
                              <div className="flex items-center justify-between text-slate-700 font-medium">
                                <span className="flex items-center gap-1.5 text-slate-800">
                                  <Clock size={12} className="text-amber-600" /> Tiến trình xử lý:
                                </span>
                                <span className="text-[10px] text-slate-500">
                                  Dự kiến trong 24h
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-slate-600 text-[11px]">
                                <span className="text-emerald-700 font-semibold">1. Tiếp nhận</span>
                                <span className="text-slate-300">→</span>
                                <span className="text-amber-800 font-semibold">
                                  2. Thẩm định vị trí & dịch vụ
                                </span>
                                <span className="text-slate-300">→</span>
                                <span className="text-slate-400">3. Xuất bản</span>
                              </div>
                            </div>
                          )}

                          {/* APPROVED LIVE STATS (Dành cho trạng thái Đã Duyệt) */}
                          {prop.status === 1 && (
                            <div className="p-2 bg-emerald-50/70 rounded-lg border border-emerald-100 text-[11px] text-emerald-900 flex items-center justify-between">
                              <span className="font-medium flex items-center gap-1.5">
                                <Check size={13} className="text-emerald-700" />
                                Địa điểm đã được hiển thị công khai trên LangThang
                              </span>
                              <span className="text-[10px] text-emerald-800 font-medium">
                                1.420 lượt xem
                              </span>
                            </div>
                          )}

                          {/* REJECTION REASON (Dành cho trạng thái Bị Từ Chối) */}
                          {prop.status === 2 && prop.rejectReason && (
                            <div className="p-2.5 bg-rose-50 rounded-lg border border-rose-200/80 text-xs text-rose-900 space-y-0.5">
                              <strong className="block font-semibold flex items-center gap-1 text-[11px] text-rose-950">
                                <AlertCircle size={13} /> Phản hồi từ kiểm duyệt:
                              </strong>
                              <p className="text-[11px] leading-relaxed text-rose-800">{prop.rejectReason}</p>
                            </div>
                          )}

                          {/* Card Actions Footer */}
                          <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                            <span className="text-slate-500 text-[11px]">
                              Giờ mở cửa: <span className="text-slate-700 font-medium">{prop.openingHours}</span>
                            </span>

                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => setSelectedProposalDetail(prop)}
                                className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-colors flex items-center gap-1 cursor-pointer"
                              >
                                <Eye size={13} />
                                <span>Xem chi tiết</span>
                              </button>

                              {prop.status === 2 && (
                                <button
                                  type="button"
                                  onClick={onOpenProposeModal}
                                  className="px-3 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold transition-colors cursor-pointer"
                                >
                                  Sửa & Gửi lại
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* TAB 5: BLOG & LỊCH TRÌNH */}
            {activeTab === "blogs" && (
              <div className="space-y-3.5">
                <article className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row gap-4 items-center">
                  <img
                    src="https://images.unsplash.com/photo-1691927644490-e1a24b366a5e?w=600&h=400&fit=crop&auto=format"
                    alt="Hội An"
                    className="w-full sm:w-40 h-28 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-orange-50 text-orange-700 border border-orange-200 uppercase">
                      CẨM NANG
                    </span>
                    <h4 className="text-sm sm:text-base font-bold text-slate-900 mt-1 mb-1 tracking-tight">
                      48 giờ ở Hội An: đi chậm để cảm nhận phố cổ
                    </h4>
                    <p className="text-xs text-slate-500 line-clamp-2 mb-2 leading-relaxed">
                      Một hành trình nhẹ nhàng qua các con ngõ nhỏ, quán ăn địa phương và buổi sớm ven sông Hoài.
                    </p>
                    <span className="text-[11px] text-slate-400">Đăng ngày 24/08/2026 · 5 phút đọc</span>
                  </div>
                </article>

                <article className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row gap-4 items-center">
                  <img
                    src="https://images.unsplash.com/photo-1733372607228-6aeaa92c5e62?w=600&h=400&fit=crop&auto=format"
                    alt="Đà Lạt"
                    className="w-full sm:w-40 h-28 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 uppercase">
                      LỊCH TRÌNH
                    </span>
                    <h4 className="text-sm sm:text-base font-bold text-slate-900 mt-1 mb-1 tracking-tight">
                      Đà Lạt chậm rãi · 3 ngày 2 đêm
                    </h4>
                    <p className="text-xs text-slate-500 line-clamp-2 mb-2 leading-relaxed">
                      12 điểm dừng săn mây, cà phê đồi thông và thưởng thức lẩu gà lá é ấm cúng.
                    </p>
                    <span className="text-[11px] text-slate-400">Cập nhật tháng 8, 2026</span>
                  </div>
                </article>
              </div>
            )}

            {/* TAB 6: TỐ CÁO VI PHẠM (dbo.Reports & dbo.Appeals - CLO3) */}
            {activeTab === "reports" && (
              <div className="space-y-4">
                {/* Header Banner */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 shrink-0">
                      <ShieldAlert size={20} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm sm:text-base font-bold text-slate-900">
                          Báo Cáo Vi Phạm Đã Gửi (User Reports)
                        </h3>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
                          dbo.Reports
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Theo dõi thẩm định từ Category Admin, kiểm tra kết quả xử phạt và khiếu nại (Appeals).
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => {
                        setReportModalTab("guide");
                        setSelectedReportTarget(undefined);
                        setIsReportModalOpen(true);
                      }}
                      className="px-3 py-2 rounded-xl text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <HelpCircle size={14} />
                      <span>Report những gì?</span>
                    </button>

                    <button
                      onClick={() => {
                        setReportModalTab("form");
                        setSelectedReportTarget(undefined);
                        setIsReportModalOpen(true);
                      }}
                      className="px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <Flag size={14} />
                      <span>+ Gửi báo cáo mới</span>
                    </button>
                  </div>
                </div>

                {/* 3 Thẻ thống kê */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200/80">
                    <div className="text-[11px] font-medium text-amber-800">Chờ thẩm tra (pending)</div>
                    <div className="text-xl font-black text-amber-900 mt-0.5">1</div>
                    <div className="text-[10px] text-amber-700 mt-1">Đang được Category Admin xác minh</div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200/80">
                    <div className="text-[11px] font-medium text-emerald-800">Đã xử phạt vi phạm</div>
                    <div className="text-xl font-black text-emerald-900 mt-0.5">1</div>
                    <div className="text-[10px] text-emerald-700 mt-1">Nội dung vi phạm đã bị gỡ/ẩn</div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-100 border border-slate-200">
                    <div className="text-[11px] font-medium text-slate-700">Đã bác bỏ (dismissed)</div>
                    <div className="text-xl font-black text-slate-800 mt-0.5">1</div>
                    <div className="text-[10px] text-slate-500 mt-1">Không có dấu hiệu vi phạm điều khoản</div>
                  </div>
                </div>

                {/* Danh sách 3 báo cáo mẫu của người dùng */}
                <div className="space-y-3">
                  {/* Báo cáo 1 */}
                  <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-rose-100 text-rose-800">
                          Địa điểm (place)
                        </span>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                          Quán Bún Bò Huế Mụ Rớt
                        </h4>
                      </div>
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                        Đang chờ duyệt
                      </span>
                    </div>

                    <div className="text-xs text-slate-700">
                      <strong>Lý do (#5):</strong> <span className="text-rose-700">Địa điểm đã đóng cửa hoặc chuyển địa chỉ</span>
                    </div>
                    <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100 italic">
                      "Quán đã chuyển sang 38 Chi Lăng từ tháng trước, thông tin trên bản đồ đang bị sai lệch gây bất tiện cho du khách."
                    </p>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-100">
                      <span>Mã hồ sơ: #REP-301 • Người nhận: Quản trị viên Danh mục Ẩm thực</span>
                      <span>Hôm nay, 10:15</span>
                    </div>
                  </div>

                  {/* Báo cáo 2: Bị bác bỏ -> Có nút Khiếu nại */}
                  <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-amber-100 text-amber-800">
                          Bài đánh giá (review)
                        </span>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                          Đánh giá tại Cơm Hến Đập Đá
                        </h4>
                      </div>
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-700 border border-slate-300">
                        Đã bác bỏ (Hợp lệ)
                      </span>
                    </div>

                    <div className="text-xs text-slate-700">
                      <strong>Lý do (#2):</strong> <span className="text-rose-700">Thông tin sai sự thật, gây hiểu nhầm</span>
                    </div>
                    <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100 italic">
                      "Tài khoản vu khống quán dùng dầu tái chế và đồ ăn ôi thiu không có căn cứ, nghi ngờ là nick ảo của đối thủ cạnh tranh."
                    </p>

                    <div className="text-[11px] bg-blue-50/80 border border-blue-200 text-blue-950 p-2.5 rounded-lg">
                      <strong className="text-blue-900">Phản hồi của Category Admin:</strong> Nội dung nhận xét phản ánh cảm nhận khẩu vị cá nhân của thực khách, không phát hiện dấu hiệu vi phạm điều khoản.
                    </div>

                    <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-100">
                      <span className="text-slate-400">Mã hồ sơ: #REP-298 • 3 ngày trước</span>
                      <button
                        onClick={() => {
                          setReportModalTab("history");
                          setIsReportModalOpen(true);
                        }}
                        className="text-purple-700 hover:text-purple-900 font-bold underline cursor-pointer"
                      >
                        Gửi Khiếu Nại Quyết Định (dbo.Appeals) →
                      </button>
                    </div>
                  </div>

                  {/* Báo cáo 3 */}
                  <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-rose-100 text-rose-800">
                          Địa điểm (place)
                        </span>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                          Quán Cafe Hẻm Cũ Đà Lạt
                        </h4>
                      </div>
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                        Đã xác nhận vi phạm
                      </span>
                    </div>

                    <div className="text-xs text-slate-700">
                      <strong>Lý do (#5):</strong> <span className="text-rose-700">Địa điểm đã đóng cửa hoặc chuyển địa chỉ</span>
                    </div>
                    <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100 italic">
                      "Quán đã trả mặt bằng từ 3 tháng trước, hiện tại địa điểm đã đổi thành tiệm tạp hóa."
                    </p>

                    <div className="text-[11px] bg-emerald-50/80 border border-emerald-200 text-emerald-950 p-2.5 rounded-lg">
                      <strong className="text-emerald-900">Biện pháp xử lý:</strong> Quản trị viên phụ trách danh mục đã thẩm định thực tế và tạm ẩn địa điểm khỏi bản đồ du lịch.
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-100">
                      <span>Mã hồ sơ: #REP-295 • Đã hoàn tất</span>
                      <span>1 tuần trước</span>
                    </div>
                  </div>
                </div>

                {/* Khối Cẩm nang hướng dẫn: Người dùng report những gì? */}
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <HelpCircle size={14} className="text-blue-600" />
                      <span>Quy chuẩn: Người dùng có thể báo cáo những gì?</span>
                    </h4>
                    <button
                      onClick={() => {
                        setReportModalTab("guide");
                        setIsReportModalOpen(true);
                      }}
                      className="text-xs font-semibold text-blue-600 hover:underline cursor-pointer"
                    >
                      Mở cẩm nang đầy đủ →
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                    <div className="bg-white p-3 rounded-xl border border-slate-200/80">
                      <p className="font-bold text-slate-900 flex items-center gap-1 mb-1">
                        <MapPin size={12} className="text-rose-600" />
                        <span>1. Địa điểm (place)</span>
                      </p>
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        Quán đã đóng cửa, sai tọa độ bản đồ, chặt chém giá hoặc cơ sở giả mạo lừa đảo.
                      </p>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-slate-200/80">
                      <p className="font-bold text-slate-900 flex items-center gap-1 mb-1">
                        <MessageSquare size={12} className="text-amber-600" />
                        <span>2. Bài đánh giá (review)</span>
                      </p>
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        Đánh giá seeding giả mạo, chửi bới xúc phạm nhân viên, dìm hàng không căn cứ, ảnh phản cảm.
                      </p>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-slate-200/80">
                      <p className="font-bold text-slate-900 flex items-center gap-1 mb-1">
                        <FileText size={12} className="text-blue-600" />
                        <span>3. Bình luận (comment)</span>
                      </p>
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        Spam đường link rác/cờ bạc, miệt thị vùng miền, quấy rối đe dọa thành viên khác.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </main>

      {/* ── REPORT MODAL ── */}
      {isReportModalOpen && (
        <ReportModal
          initialTarget={selectedReportTarget}
          defaultTab={reportModalTab}
          onClose={() => setIsReportModalOpen(false)}
          onSubmittedReport={() => {
            showToast("Đã gửi báo cáo vi phạm thành công!");
          }}
        />
      )}

      {/* ── MODAL: CHỈNH SỬA THÔNG TIN CÁ NHÂN ── */}
      {isEditProfileOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs"
            onClick={() => setIsEditProfileOpen(false)}
          />
          <div className="relative w-full max-w-lg bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">
                Chỉnh sửa thông tin cá nhân
              </h3>
              <button
                onClick={() => setIsEditProfileOpen(false)}
                className="w-7 h-7 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="p-5 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Họ và tên</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:border-emerald-700 outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Tiểu sử</label>
                <textarea
                  rows={3}
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:border-emerald-700 outline-none resize-none transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Nghề nghiệp</label>
                  <input
                    type="text"
                    value={editJob}
                    onChange={(e) => setEditJob(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:border-emerald-700 outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Nơi sống</label>
                  <input
                    type="text"
                    value={editAddress}
                    onChange={(e) => setEditAddress(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:border-emerald-700 outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Số điện thoại</label>
                <input
                  type="tel"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:border-emerald-700 outline-none transition-colors"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditProfileOpen(false)}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-emerald-800 hover:bg-emerald-900 text-white shadow-xs transition-colors cursor-pointer"
                >
                  Lưu thay đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: ĐỔI MẬT KHẨU ── */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs"
            onClick={() => setIsPasswordModalOpen(false)}
          />
          <div className="relative w-full max-w-md bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">
                Đổi mật khẩu tài khoản
              </h3>
              <button
                onClick={() => setIsPasswordModalOpen(false)}
                className="w-7 h-7 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSavePassword} className="p-5 space-y-3.5">
              {passwordError && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 font-medium">
                  {passwordError}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Mật khẩu hiện tại</label>
                <input
                  type="password"
                  required
                  placeholder="Nhập mật khẩu hiện tại"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:border-emerald-700 outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Mật khẩu mới</label>
                <input
                  type="password"
                  required
                  placeholder="Ít nhất 6 ký tự"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:border-emerald-700 outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Xác nhận mật khẩu mới</label>
                <input
                  type="password"
                  required
                  placeholder="Nhập lại mật khẩu mới"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:border-emerald-700 outline-none transition-colors"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-emerald-800 hover:bg-emerald-900 text-white shadow-xs transition-colors cursor-pointer"
                >
                  Cập nhật mật khẩu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: XEM CHI TIẾT HỒ SƠ ĐỀ XUẤT ── */}
      {selectedProposalDetail && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-xl bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
            {/* Cover Header */}
            <div className="relative h-48 sm:h-56 w-full overflow-hidden bg-slate-100 flex-shrink-0">
              <img
                src={selectedProposalDetail.coverImg}
                alt={selectedProposalDetail.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/25" />

              <button
                type="button"
                onClick={() => setSelectedProposalDetail(null)}
                className="absolute top-3.5 right-3.5 w-7 h-7 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X size={15} />
              </button>

              <div className="absolute bottom-3.5 left-4 right-4 text-white">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-emerald-700 text-white">
                    {selectedProposalDetail.category}
                  </span>
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-black/50 backdrop-blur-md">
                    {selectedProposalDetail.province}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold leading-tight">
                  {selectedProposalDetail.name}
                </h3>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto space-y-3.5 text-xs text-slate-700 flex-1">
              {/* Status Header Bar */}
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="font-medium text-slate-500 text-[11px]">Trạng thái hồ sơ:</span>
                <div>
                  {selectedProposalDetail.status === 0 && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-medium bg-amber-50 text-amber-900 border border-amber-200/60">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                      <span>Đang chờ duyệt</span>
                    </span>
                  )}
                  {selectedProposalDetail.status === 1 && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-medium bg-emerald-50 text-emerald-900 border border-emerald-200/60">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                      <span>Đã phê duyệt & Hiển thị công khai</span>
                    </span>
                  )}
                  {selectedProposalDetail.status === 2 && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-medium bg-rose-50 text-rose-800 border border-rose-200/60">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                      <span>Cần chỉnh sửa</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Rejection Message if status 2 */}
              {selectedProposalDetail.status === 2 && selectedProposalDetail.rejectReason && (
                <div className="p-3 bg-rose-50 border border-rose-200/80 rounded-lg text-rose-800 space-y-0.5">
                  <strong className="block text-rose-950 font-semibold flex items-center gap-1 text-[11px]">
                    <AlertCircle size={13} /> Phản hồi từ kiểm duyệt:
                  </strong>
                  <p className="text-[11px] leading-relaxed">{selectedProposalDetail.rejectReason}</p>
                </div>
              )}

              {/* Address & Hours */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-medium block mb-0.5">Địa chỉ chi tiết</span>
                  <p className="font-medium text-slate-800 flex items-start gap-1">
                    <MapPin size={13} className="text-slate-500 flex-shrink-0 mt-0.5" />
                    <span>{selectedProposalDetail.address}</span>
                  </p>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-medium block mb-0.5">Thời gian hoạt động</span>
                  <p className="font-medium text-slate-800 flex items-center gap-1">
                    <Clock size={13} className="text-slate-500 flex-shrink-0" />
                    <span>{selectedProposalDetail.openingHours}</span>
                  </p>
                </div>
              </div>

              {/* Price & Contact */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-medium block mb-0.5">Mức giá tham khảo</span>
                  <p className="font-semibold text-slate-800">
                    {selectedProposalDetail.minPrice === 0 && selectedProposalDetail.maxPrice === 0
                      ? "Miễn phí"
                      : `${(selectedProposalDetail.minPrice || 0).toLocaleString("vi-VN")}đ – ${(selectedProposalDetail.maxPrice || 0).toLocaleString("vi-VN")}đ`}
                  </p>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-medium block mb-0.5">Số điện thoại</span>
                  <p className="font-medium text-slate-800">
                    {selectedProposalDetail.phone || "Chưa cập nhật"}
                  </p>
                </div>
              </div>

              {/* Description */}
              <div>
                <span className="text-[11px] font-semibold text-slate-700 block mb-1">Mô tả địa điểm:</span>
                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                  {selectedProposalDetail.description}
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                Gửi đề xuất ngày {selectedProposalDetail.createdAt}
              </span>
              <button
                type="button"
                onClick={() => setSelectedProposalDetail(null)}
                className="px-4 py-1.5 rounded-lg text-xs font-medium text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[1000] px-4 py-3 bg-emerald-900 text-white text-xs font-bold rounded-2xl shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 size={16} className="text-emerald-300" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
