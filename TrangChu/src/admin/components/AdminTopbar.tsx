import { AdminMainTab } from "../types";
import { AdminAssignmentInfo } from "../../adminData";
import { Search, Bell, Menu } from "lucide-react";

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
  return (
    <header className="h-16 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-6 sm:px-8 flex items-center justify-between sticky top-0 z-20">
      <div className="flex items-center gap-3.5">
        {/* Nút Hamburger CHỈ HIỆN TRÊN MOBILE (lg:hidden), KHÔNG BỊ TRÙNG VỚI NÚT SIDEBAR TRÊN DESKTOP */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-xl border border-slate-200/80 hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer lg:hidden"
          title="Bật / Tắt menu di động"
        >
          <Menu size={18} />
        </button>

        {/* Clean breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-medium">
          <span className="text-slate-400">Điều phối</span>
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
        {/* Global search input */}
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

        {/* Notifications */}
        <button
          onClick={() => showToast("Bạn có 3 thông báo mới về phản ánh vi phạm.")}
          className="relative p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
          title="Thông báo"
        >
          <Bell size={17} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500" />
        </button>

        {/* User profile */}
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
