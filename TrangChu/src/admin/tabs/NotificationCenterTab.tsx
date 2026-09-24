import { useState, useMemo } from "react";
import {
  Bell,
  CheckCheck,
  Trash2,
  Filter,
  Search,
  AlertTriangle,
  ClipboardCheck,
  MessageSquare,
  ShieldAlert,
  Info,
  Clock,
  Sparkles,
  ChevronRight,
  Settings,
  Volume2,
  VolumeX,
  Eye,
  CheckCircle2,
  Flame,
  ArrowUpRight,
  Shield,
  Send,
  X,
  SlidersHorizontal,
} from "lucide-react";
import { AdminAssignmentInfo } from "../../adminData";

export interface AdminNotification {
  id: number;
  title: string;
  detail: string;
  category: "report" | "proposal" | "review" | "system" | "sla";
  priority: "urgent" | "high" | "normal" | "info";
  time: string;
  timestamp: number;
  unread: boolean;
  targetType?: "place" | "review" | "proposal" | "report" | "system";
  targetId?: number;
  targetName?: string;
  slaRemainingHours?: number;
  actionUrl?: string;
}

const INITIAL_NOTIFICATIONS: AdminNotification[] = [
  {
    id: 1,
    title: "Cảnh báo SLA vi phạm khẩn cấp!",
    detail: "Báo cáo #REP-2026-88 tại 'Mì Quảng Ếch Bếp Trang' chỉ còn 2 giờ là chạm mốc SLA cam kết xử lý 24h.",
    category: "sla",
    priority: "urgent",
    time: "5 phút trước",
    timestamp: Date.now() - 5 * 60 * 1000,
    unread: true,
    targetType: "report",
    targetId: 101,
    targetName: "Mì Quảng Ếch Bếp Trang",
    slaRemainingHours: 2,
  },
  {
    id: 2,
    title: "Báo cáo vi phạm mới: Nghi vấn thông tin sai lệch",
    detail: "Người dùng @hoangnam99 báo cáo địa điểm 'Cà phê Vợt Bà Ba' đổi địa chỉ kinh doanh mà chưa cập nhật.",
    category: "report",
    priority: "high",
    time: "25 phút trước",
    timestamp: Date.now() - 25 * 60 * 1000,
    unread: true,
    targetType: "report",
    targetId: 102,
    targetName: "Cà phê Vợt Bà Ba",
  },
  {
    id: 3,
    title: "Đề xuất cập nhật thông tin địa điểm",
    detail: "Thành viên cộng đồng gửi đề xuất bổ sung menu mới & khung giờ mở cửa tại 'Bánh tráng Hoàng Tín'.",
    category: "proposal",
    priority: "normal",
    time: "1 giờ trước",
    timestamp: Date.now() - 60 * 60 * 1000,
    unread: true,
    targetType: "proposal",
    targetId: 201,
    targetName: "Bánh tráng Hoàng Tín",
  },
  {
    id: 4,
    title: "Phát hiện đánh giá có dấu hiệu Spam / Blacklist",
    detail: "Bộ lọc tự động phát hiện 3 đánh giá chứa từ khóa cấm từ các tài khoản mới lập tại khu vực Đà Nẵng.",
    category: "review",
    priority: "high",
    time: "2 giờ trước",
    timestamp: Date.now() - 2 * 3600 * 1000,
    unread: true,
    targetType: "review",
    targetId: 301,
    targetName: "Review Spam Filter",
  },
  {
    id: 5,
    title: "Cập nhật chính sách & Cấu hình kiểm duyệt v2.6",
    detail: "Quản trị viên trưởng vừa cập nhật danh sách từ khóa cấm (Blacklist) và chuẩn nén hình ảnh WebP.",
    category: "system",
    priority: "info",
    time: "Hôm nay 08:30",
    timestamp: Date.now() - 5 * 3600 * 1000,
    unread: false,
    targetType: "system",
  },
  {
    id: 6,
    title: "Địa điểm mới chờ phê duyệt phát hành",
    detail: "Người dùng @linhtravel vừa khởi tạo địa điểm 'Tiệm Bánh Cối Xay Gió - Chi nhánh Đà Nẵng'.",
    category: "proposal",
    priority: "normal",
    time: "Hôm qua 16:45",
    timestamp: Date.now() - 20 * 3600 * 1000,
    unread: false,
    targetType: "place",
    targetId: 401,
    targetName: "Tiệm Bánh Cối Xay Gió",
  },
  {
    id: 7,
    title: "Báo cáo nội dung hình ảnh không phù hợp",
    detail: "Có 4 lượt báo cáo về hình ảnh đính kèm bài đánh giá tại 'Bà Dưỡng Bánh Xèo'.",
    category: "report",
    priority: "high",
    time: "Hôm qua 11:20",
    timestamp: Date.now() - 26 * 3600 * 1000,
    unread: false,
    targetType: "review",
    targetId: 104,
    targetName: "Bánh xèo Bà Dưỡng",
  },
  {
    id: 8,
    title: "Đạt mốc xử lý SLA tuần xuất sắc!",
    detail: "Đội ngũ điều hành Miền Trung đã xử lý 98.4% báo cáo vi phạm trước hạn cam kết SLA trong tuần qua.",
    category: "system",
    priority: "info",
    time: "3 ngày trước",
    timestamp: Date.now() - 72 * 3600 * 1000,
    unread: false,
    targetType: "system",
  },
];

interface NotificationCenterTabProps {
  currentAdminInfo?: AdminAssignmentInfo;
  showToast: (msg: string) => void;
  onNavigateToTab?: (tab: string, targetId?: number) => void;
}

export default function NotificationCenterTab({
  currentAdminInfo,
  showToast,
  onNavigateToTab,
}: NotificationCenterTabProps) {
  const [notifications, setNotifications] = useState<AdminNotification[]>(INITIAL_NOTIFICATIONS);
  const [activeCategory, setActiveCategory] = useState<"all" | "sla" | "report" | "proposal" | "review" | "system">("all");
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [filterReadStatus, setFilterReadStatus] = useState<"all" | "unread" | "read">("all");
  const [searchText, setSearchText] = useState("");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [selectedNotif, setSelectedNotif] = useState<AdminNotification | null>(null);

  // Stats
  const unreadCount = notifications.filter((n) => n.unread).length;
  const urgentCount = notifications.filter((n) => n.priority === "urgent" || n.category === "sla").length;
  const reportCount = notifications.filter((n) => n.category === "report").length;
  const proposalCount = notifications.filter((n) => n.category === "proposal").length;

  // Filtered List
  const filteredList = useMemo(() => {
    return notifications.filter((n) => {
      if (activeCategory !== "all" && n.category !== activeCategory) return false;
      if (filterPriority !== "all" && n.priority !== filterPriority) return false;
      if (filterReadStatus === "unread" && !n.unread) return false;
      if (filterReadStatus === "read" && n.unread) return false;
      if (searchText.trim()) {
        const q = searchText.toLowerCase();
        return (
          n.title.toLowerCase().includes(q) ||
          n.detail.toLowerCase().includes(q) ||
          (n.targetName || "").toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [notifications, activeCategory, filterPriority, filterReadStatus, searchText]);

  // Actions
  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
    showToast("Đã đánh dấu tất cả thông báo là đã đọc.");
  };

  const handleToggleRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: !n.unread } : n))
    );
  };

  const handleDeleteNotification = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    if (selectedNotif?.id === id) setSelectedNotif(null);
    showToast("Đã xóa thông báo khỏi danh sách.");
  };

  const handleClearRead = () => {
    setNotifications((prev) => prev.filter((n) => n.unread));
    showToast("Đã dọn dẹp các thông báo đã đọc.");
  };

  const handleQuickAction = (notif: AdminNotification) => {
    // Mark as read
    setNotifications((prev) =>
      prev.map((n) => (n.id === notif.id ? { ...n, unread: false } : n))
    );

    if (notif.category === "report" || notif.category === "sla") {
      if (onNavigateToTab) onNavigateToTab("reports", notif.targetId);
      else showToast(`Đang chuyển hướng tới Hàng chờ Báo cáo vi phạm [${notif.targetName || ""}]...`);
    } else if (notif.category === "proposal") {
      if (onNavigateToTab) onNavigateToTab("proposals", notif.targetId);
      else showToast(`Đang mở Đề xuất đóng góp [${notif.targetName || ""}]...`);
    } else if (notif.category === "review") {
      if (onNavigateToTab) onNavigateToTab("reviews_comments", notif.targetId);
      else showToast(`Đang mở Đánh giá & Bình luận [${notif.targetName || ""}]...`);
    } else {
      setSelectedNotif(notif);
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "urgent":
        return <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white font-bold text-[10px] animate-pulse flex items-center gap-1"><Flame size={10} /> Khẩn cấp / SLA</span>;
      case "high":
        return <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 font-bold text-[10px]">Ưu tiên cao</span>;
      case "normal":
        return <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-semibold text-[10px]">Tiêu chuẩn</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium text-[10px]">Thông tin</span>;
    }
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case "sla":
        return <Flame className="text-rose-600" size={16} />;
      case "report":
        return <ShieldAlert className="text-rose-600" size={16} />;
      case "proposal":
        return <ClipboardCheck className="text-amber-600" size={16} />;
      case "review":
        return <MessageSquare className="text-purple-600" size={16} />;
      default:
        return <Info className="text-blue-600" size={16} />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200 text-slate-800 pb-16">
      {/* ── 1. TOP HEADER & METRIC CARDS ── */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative z-10">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold shadow-xs">
                <Bell size={22} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  Trung tâm Thông báo &amp; Cảnh báo Điều hành
                  {unreadCount > 0 && (
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-500 text-white animate-pulse">
                      {unreadCount} tin mới
                    </span>
                  )}
                </h1>
                <p className="text-xs text-slate-500">
                  Hệ thống giám sát luồng sự kiện thời gian thực: Cảnh báo vi phạm SLA, báo cáo nội dung xấu, đề xuất địa điểm và thông báo vận hành.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-2.5 rounded-xl border text-xs font-semibold shadow-xs flex items-center gap-2 transition cursor-pointer ${
                soundEnabled
                  ? "bg-white text-blue-600 border-blue-200 hover:bg-blue-50"
                  : "bg-slate-100 text-slate-400 border-slate-200 hover:text-slate-600"
              }`}
              title={soundEnabled ? "Đang bật âm thanh cảnh báo" : "Đã tắt âm thanh cảnh báo"}
            >
              {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            </button>
            <button
              onClick={handleClearRead}
              className="px-3.5 py-2 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-600 text-xs font-semibold shadow-xs flex items-center gap-1.5 transition cursor-pointer"
            >
              <Trash2 size={14} />
              <span>Dọn tin đã đọc</span>
            </button>
            <button
              onClick={handleMarkAllRead}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs flex items-center gap-2 transition cursor-pointer"
            >
              <CheckCheck size={15} />
              <span>Đọc tất cả ({unreadCount})</span>
            </button>
          </div>
        </div>

        {/* Status Mini Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-5 mt-5 border-t border-slate-100 text-xs">
          <div
            onClick={() => { setActiveCategory("all"); setFilterReadStatus("unread"); }}
            className="bg-slate-50 hover:bg-blue-50/50 p-3 rounded-xl border border-slate-100 cursor-pointer transition flex items-center gap-3"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
              <Bell size={16} />
            </div>
            <div>
              <div className="text-[11px] text-slate-400 font-medium">Chưa xem</div>
              <div className="font-bold text-slate-900 text-sm">{unreadCount} thông báo</div>
            </div>
          </div>

          <div
            onClick={() => { setActiveCategory("sla"); setFilterReadStatus("all"); }}
            className="bg-slate-50 hover:bg-rose-50/50 p-3 rounded-xl border border-slate-100 cursor-pointer transition flex items-center gap-3"
          >
            <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center font-bold">
              <Flame size={16} />
            </div>
            <div>
              <div className="text-[11px] text-slate-400 font-medium">Cảnh báo SLA đỏ</div>
              <div className="font-bold text-rose-700 text-sm">{urgentCount} cảnh báo</div>
            </div>
          </div>

          <div
            onClick={() => { setActiveCategory("report"); setFilterReadStatus("all"); }}
            className="bg-slate-50 hover:bg-amber-50/50 p-3 rounded-xl border border-slate-100 cursor-pointer transition flex items-center gap-3"
          >
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
              <ShieldAlert size={16} />
            </div>
            <div>
              <div className="text-[11px] text-slate-400 font-medium">Báo cáo vi phạm</div>
              <div className="font-bold text-amber-800 text-sm">{reportCount} phản ánh</div>
            </div>
          </div>

          <div
            onClick={() => { setActiveCategory("proposal"); setFilterReadStatus("all"); }}
            className="bg-slate-50 hover:bg-purple-50/50 p-3 rounded-xl border border-slate-100 cursor-pointer transition flex items-center gap-3"
          >
            <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center font-bold">
              <ClipboardCheck size={16} />
            </div>
            <div>
              <div className="text-[11px] text-slate-400 font-medium">Đề xuất chờ duyệt</div>
              <div className="font-bold text-purple-700 text-sm">{proposalCount} đề xuất</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. FILTER & TOOLBAR ── */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs">
        {/* Category Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-1 md:pb-0">
          {[
            { id: "all", label: "Tất cả", count: notifications.length },
            { id: "sla", label: "Cảnh báo SLA", count: urgentCount },
            { id: "report", label: "Báo cáo vi phạm", count: reportCount },
            { id: "proposal", label: "Đề xuất đóng góp", count: proposalCount },
            { id: "review", label: "Đánh giá & Spam", count: notifications.filter((n) => n.category === "review").length },
            { id: "system", label: "Hệ thống", count: notifications.filter((n) => n.category === "system").length },
          ].map((tab) => {
            const isActive = activeCategory === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id as any)}
                className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? "bg-blue-600 text-white shadow-xs"
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/80"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`px-1.5 py-0.2 text-[10px] rounded-full ${
                    isActive ? "bg-white/20 text-white" : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search & Dropdowns */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 md:w-56">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm thông báo..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-xs font-medium outline-none focus:border-blue-500 transition"
            />
          </div>

          <select
            value={filterReadStatus}
            onChange={(e) => setFilterReadStatus(e.target.value as any)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white font-semibold text-slate-700 outline-none text-xs cursor-pointer hover:border-slate-300"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="unread">Chưa đọc</option>
            <option value="read">Đã đọc</option>
          </select>
        </div>
      </div>

      {/* ── 3. NOTIFICATION FEED LIST ── */}
      <div className="space-y-3 text-xs">
        {filteredList.length === 0 ? (
          <div className="p-12 text-center space-y-3 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
              <CheckCircle2 size={24} />
            </div>
            <div className="font-bold text-sm text-slate-700">Không có thông báo nào phù hợp</div>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Hộp thư cảnh báo hiện tại đang trống hoặc không có thông tin tương ứng với bộ lọc bạn đã chọn.
            </p>
          </div>
        ) : (
          filteredList.map((notif) => {
            const isUrgent = notif.priority === "urgent" || notif.category === "sla";
            
            return (
              <div
                key={notif.id}
                className={`relative group p-4 sm:p-5 flex flex-col sm:flex-row sm:items-start justify-between gap-5 bg-white rounded-2xl border transition-all duration-300 ${
                  notif.unread
                    ? isUrgent
                      ? "border-rose-200 shadow-[0_8px_30px_-12px_rgba(225,29,72,0.2)]"
                      : "border-blue-200 shadow-[0_8px_30px_-12px_rgba(37,99,235,0.15)]"
                    : "border-slate-200/60 shadow-xs hover:shadow-md hover:border-slate-300"
                }`}
              >
                {/* Unread Indicator Bar */}
                {notif.unread && (
                  <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-12 rounded-r-full ${isUrgent ? "bg-rose-500" : "bg-blue-600"}`} />
                )}

                {/* Left: Icon & Content */}
                <div className="flex items-start gap-4 min-w-0 flex-1 pl-1">
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-2xs mt-0.5 ${
                      isUrgent
                        ? "bg-gradient-to-br from-rose-100 to-rose-50 text-rose-600 ring-1 ring-rose-200"
                        : notif.category === "proposal"
                        ? "bg-gradient-to-br from-amber-100 to-amber-50 text-amber-700 ring-1 ring-amber-200"
                        : notif.category === "review"
                        ? "bg-gradient-to-br from-purple-100 to-purple-50 text-purple-700 ring-1 ring-purple-200"
                        : "bg-gradient-to-br from-blue-100 to-blue-50 text-blue-600 ring-1 ring-blue-200"
                    }`}
                  >
                    {getCategoryIcon(notif.category)}
                  </div>

                  <div className="space-y-1.5 min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`text-[13px] tracking-tight ${notif.unread ? "font-black text-slate-900" : "font-bold text-slate-700"}`}>
                        {notif.title}
                      </span>
                      {getPriorityBadge(notif.priority)}
                      {notif.slaRemainingHours !== undefined && (
                        <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 ring-1 ring-rose-200 font-mono text-[10px] font-bold flex items-center gap-1 shadow-xs">
                          <Clock size={10} /> Còn {notif.slaRemainingHours}h
                        </span>
                      )}
                    </div>

                    <p className={`text-xs leading-relaxed ${notif.unread ? "text-slate-700 font-medium" : "text-slate-500"}`}>
                      {notif.detail}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 pt-1.5 text-[11px] text-slate-400 font-medium">
                      <span className="flex items-center gap-1.5">
                        <Clock size={12} className="text-slate-300" />
                        {notif.time}
                      </span>
                      {notif.targetName && (
                        <span className="flex items-center gap-1.5 text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200/60">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                          {notif.targetName}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Quick Action Buttons */}
                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button
                    onClick={() => handleQuickAction(notif)}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <span>Xử lý</span>
                    <ArrowUpRight size={14} />
                  </button>

                  <button
                    onClick={() => handleToggleRead(notif.id)}
                    className={`p-2.5 rounded-xl border transition cursor-pointer ${
                      notif.unread 
                        ? "bg-white border-slate-200 text-slate-400 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200" 
                        : "bg-slate-50 border-transparent text-slate-400 hover:bg-slate-200 hover:text-slate-700"
                    }`}
                    title={notif.unread ? "Đánh dấu đã đọc" : "Đánh dấu chưa đọc"}
                  >
                    <CheckCheck size={16} />
                  </button>

                  <button
                    onClick={() => handleDeleteNotification(notif.id)}
                    className="p-2.5 rounded-xl bg-white border border-slate-200 hover:bg-rose-50 hover:border-rose-200 text-slate-400 hover:text-rose-600 transition cursor-pointer shadow-xs"
                    title="Xóa thông báo"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ── 4. NOTIFICATION DETAIL MODAL ── */}
      {selectedNotif && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden text-xs animate-in zoom-in-95">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                  {getCategoryIcon(selectedNotif.category)}
                </div>
                <h3 className="font-bold text-sm text-slate-900">Chi tiết thông báo hệ thống</h3>
              </div>
              <button
                onClick={() => setSelectedNotif(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <div className="text-[11px] text-slate-400 uppercase font-bold">Tiêu đề</div>
                <h4 className="text-sm font-bold text-slate-900 mt-0.5">{selectedNotif.title}</h4>
              </div>

              <div>
                <div className="text-[11px] text-slate-400 uppercase font-bold">Nội dung chi tiết</div>
                <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200/80 leading-relaxed mt-1">
                  {selectedNotif.detail}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <div className="text-[10px] text-slate-400 font-medium">Mức độ ưu tiên</div>
                  <div className="mt-1">{getPriorityBadge(selectedNotif.priority)}</div>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <div className="text-[10px] text-slate-400 font-medium">Thời gian phát sinh</div>
                  <div className="font-bold text-slate-800 text-xs mt-1">{selectedNotif.time}</div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                onClick={() => setSelectedNotif(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 font-bold text-xs transition cursor-pointer"
              >
                Đóng
              </button>
              <button
                onClick={() => {
                  setSelectedNotif(null);
                  handleQuickAction(selectedNotif);
                }}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition cursor-pointer shadow-xs"
              >
                Chuyển tới màn hình xử lý
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
