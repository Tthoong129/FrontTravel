import { useState } from "react";
import { AdminMainTab } from "../types";
import { AdminAssignmentInfo } from "../../adminData";
import { Search, Bell, Menu, CheckCheck, Sparkles } from "lucide-react";

interface AdminTopbarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (v: boolean) => void;
  mainTab: AdminMainTab;
  selectedPlaceId: number | null;
  currentPlaceName?: string;
  searchText: string;
  setSearchText: (v: string) => void;
  currentAdminInfo: AdminAssignmentInfo;
  showToast: (msg: string) => void;
}

export default function AdminTopbar({
  isSidebarOpen,
  setIsSidebarOpen,
  mainTab,
  selectedPlaceId,
  currentPlaceName,
  searchText,
  setSearchText,
  currentAdminInfo,
  showToast,
}: AdminTopbarProps) {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, title: "Báo cáo vi phạm mới", detail: "Có 3 phản ánh mới cần rà soát trong Miền Trung.", time: "2 phút trước", unread: true, level: "Cao" },
    { id: 2, title: "Đề xuất đóng góp cần duyệt", detail: "Bếp Trang gửi 2 thay đổi thông tin địa điểm mới.", time: "18 phút trước", unread: true, level: "Mới" },
    { id: 3, title: "Phạm vi admin đã được cập nhật", detail: "Admin cấp 1 Miền Bắc vừa được bàn giao 2 danh mục.", time: "1 giờ trước", unread: false, level: "Thông tin" },
    { id: 4, title: "Tài khoản spam đang chờ xử lý", detail: "Có 5 tài khoản đánh giá không rõ nguồn gốc.", time: "Hôm qua", unread: false, level: "Cảnh báo" },
  ]);

  const unreadCount = notifications.filter((item) => item.unread).length;

  const handleOpenNotification = () => setIsNotificationOpen((prev) => !prev);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((item) => ({ ...item, unread: false })));
    showToast("Đã đánh dấu tất cả thông báo là đã đọc.");
  };

  const markOneRead = (id: number) => {
    setNotifications((prev) => prev.map((item) => (item.id === id ? { ...item, unread: false } : item)));
  };

  return (
    <header className="h-16 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-6 sm:px-8 flex items-center justify-between sticky top-0 z-20">
      <div className="flex items-center gap-3.5">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-xl border border-slate-200/80 hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer lg:hidden"
          title="Bật / Tắt menu di động"
        >
          <Menu size={18} />
        </button>

        <div className="flex items-center gap-2 text-xs font-medium">
          <span className="text-slate-400">Quản trị</span>
          <span className="text-slate-300">/</span>
          <span className="text-slate-900 font-bold">
            {mainTab === "dashboard" && "Dashboard Tổng Quan"}
            {mainTab === "places" && (selectedPlaceId ? `Chi tiết: ${currentPlaceName || ""}` : "Quản lý Địa điểm")}
            {mainTab === "proposals" && "Đề xuất đóng góp"}
            {mainTab === "reviews_comments" && "Đánh giá & Bình luận"}
            {mainTab === "reports" && "Hàng chờ vi phạm"}
            {mainTab === "foods" && "Ẩm thực & Đặc sản"}
            {mainTab === "collections" && "Bộ sưu tập"}
            {mainTab === "provinces" && "Tỉnh/Thành trong vùng"}
            {mainTab === "blogs" && "Blog & Cẩm nang"}
            {mainTab === "categories" && "Danh mục hệ thống"}
            {mainTab === "notifications_profile" && "Hồ sơ cá nhân"}
            {mainTab === "audit_logs" && "Nhật ký kiểm toán"}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4 sm:gap-6">
        <div className="relative hidden sm:block w-72 lg:w-96">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm ID, địa điểm, nội dung..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full pl-9 pr-12 py-1.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-slate-300 outline-none transition-all"
          />
          <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] bg-slate-200/60 text-slate-500 px-1.5 py-0.5 rounded font-mono font-medium">⌘K</span>
        </div>

        <div className="relative">
          <button
            onClick={handleOpenNotification}
            className="relative p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
            title="Thông báo"
          >
            <Bell size={17} />
            {unreadCount > 0 && <span className="absolute top-1.5 right-1.5 min-w-[16px] h-4 px-1 flex items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white">{unreadCount > 9 ? "9+" : unreadCount}</span>}
          </button>

          {isNotificationOpen && (
            <div className="absolute right-0 top-12 z-50 w-[360px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.12)]">
              <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                <div>
                  <div className="text-[10px] font-black uppercase tracking-[0.12em] text-slate-400">Thông báo</div>
                  <div className="mt-1 text-sm font-bold text-slate-900">{unreadCount} tin chưa đọc</div>
                </div>
                <button onClick={markAllRead} className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2 py-1.5 text-[10px] font-bold text-slate-600 hover:border-slate-300">
                  <CheckCheck size={12} /> Đọc hết
                </button>
              </div>

              <div className="max-h-[360px] overflow-y-auto">
                {notifications.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      markOneRead(item.id);
                      setIsNotificationOpen(false);
                      showToast(item.title + ": " + item.detail);
                    }}
                    className={`flex w-full items-start gap-3 border-b border-slate-100 px-4 py-3 text-left transition ${item.unread ? "bg-amber-50/40" : "bg-white"}`}
                  >
                    <div className={`mt-1 h-2.5 w-2.5 rounded-full ${item.unread ? "bg-rose-500" : "bg-slate-300"}`} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-sm font-bold text-slate-800">{item.title}</span>
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-bold text-slate-500">{item.level}</span>
                      </div>
                      <p className="mt-1 text-xs leading-5 text-slate-500">{item.detail}</p>
                      <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400">
                        <span>{item.time}</span>
                        <span className="inline-flex items-center gap-1 font-semibold text-slate-500">
                          <Sparkles size={10} /> Chi tiết
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2.5 pl-3 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center ring-2 ring-slate-100">
            N
          </div>
          <div className="leading-tight hidden md:block">
            <span className="font-bold text-xs text-slate-900 block">
              {currentAdminInfo.adminName}
            </span>
            <span className="text-[10px] text-slate-400 font-medium block">
              Điều phối viên
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
