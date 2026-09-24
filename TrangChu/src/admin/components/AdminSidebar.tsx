import { AdminMainTab } from "../types";
import {
  LayoutDashboard,
  MapPin,
  MessageSquare,
  ShieldAlert,
  ClipboardCheck,
  Utensils,
  FolderHeart,
  Compass,
  BookOpen,
  Layers,
  Bell,
  History,
  ShieldCheck,
  Settings2,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  Users,
  ArrowLeftRight,
  Trophy,
} from "lucide-react";

interface AdminSidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (v: boolean) => void;
  mainTab: AdminMainTab;
  setMainTab: (tab: AdminMainTab) => void;
  setSelectedPlaceId: (id: number | null) => void;
  pendingPlacesCount: number;
  pendingProposalsCount: number;
  reportedReviewsCount: number;
  pendingReportsCount: number;
  foodsCount: number;
  blogsCount: number;
  auditLogsCount: number;
  onOpenSystemAdmin?: () => void;
  onBackToUserView: () => void;
}

export default function AdminSidebar({
  isSidebarOpen,
  setIsSidebarOpen,
  mainTab,
  setMainTab,
  setSelectedPlaceId,
  pendingPlacesCount,
  pendingProposalsCount,
  reportedReviewsCount,
  pendingReportsCount,
  foodsCount,
  blogsCount,
  auditLogsCount,
  onOpenSystemAdmin,
  onBackToUserView,
}: AdminSidebarProps) {
  return (
    <>
      {/* Mobile backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside
        className={`${
          isSidebarOpen ? "w-64 translate-x-0" : "-translate-x-full lg:translate-x-0 lg:w-20"
        } fixed lg:sticky top-0 h-screen bg-white text-slate-800 border-r border-slate-200 flex flex-col justify-between shrink-0 transition-all duration-300 ease-in-out z-40 select-none shadow-sm`}
      >
        <div className="flex flex-col h-full overflow-hidden">
          {/* Brand Header */}
          <div className="h-16 px-5 flex items-center justify-between shrink-0 border-b border-slate-100 bg-white">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-[11px] font-black text-white shadow-xs shrink-0">
                LT
              </div>
              {isSidebarOpen && (
                <div className="leading-tight overflow-hidden">
                  <div className="font-bold text-base text-blue-600 tracking-tight block">
                    LangThang
                  </div>
                  <div className="text-[11px] font-medium text-slate-400">
                    Admin Cấp 1 · Điều Hành
                  </div>
                </div>
              )}
            </div>

            {/* Collapse/Expand button */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
              title={isSidebarOpen ? "Thu gọn menu" : "Mở rộng menu"}
            >
              {isSidebarOpen ? <PanelLeftClose size={17} /> : <PanelLeftOpen size={17} />}
            </button>
          </div>

          {/* Navigation Items */}
          <div className="px-3 py-3 space-y-4 flex-1 overflow-y-auto text-xs scrollbar-none">
            {/* NHÓM 1: MENU CHÍNH */}
            <div className="space-y-1">
              {isSidebarOpen && (
                <div className="px-3 pt-1 pb-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Menu Điều Hành
                </div>
              )}

              {[
                { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
                { id: "places", label: "Địa điểm", icon: MapPin, count: pendingPlacesCount, isAlert: pendingPlacesCount > 0 },
                { id: "leaderboard", label: "Bảng xếp hạng", icon: Trophy },
                { id: "proposals", label: "Đề xuất đóng góp", icon: ClipboardCheck, count: pendingProposalsCount, isAlert: pendingProposalsCount > 0 },
                { id: "reviews_comments", label: "Đánh giá & Bình luận", icon: MessageSquare, count: reportedReviewsCount, isAlert: reportedReviewsCount > 0 },
                { id: "reports", label: "Báo cáo vi phạm", icon: ShieldAlert, count: pendingReportsCount, isAlert: pendingReportsCount > 0 },
                { id: "users", label: "Người dùng & Uy tín", icon: Users },
              ].map((item) => {
                const IconComp = item.icon;
                const isActive = mainTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setMainTab(item.id as AdminMainTab);
                      setSelectedPlaceId(null);
                    }}
                    className={`w-full group flex items-center ${
                      isSidebarOpen ? "justify-between px-3" : "justify-center px-0"
                    } py-2 rounded-lg transition-all duration-150 cursor-pointer ${
                      isActive
                        ? "bg-blue-600 text-white font-bold shadow-xs"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 font-medium"
                    }`}
                    title={!isSidebarOpen ? item.label : undefined}
                  >
                    <span className="flex items-center gap-3 min-w-0">
                      <span
                        className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 transition-colors ${
                          isActive
                            ? "bg-white text-blue-600 shadow-2xs"
                            : "bg-slate-100 text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-600"
                        }`}
                      >
                        <IconComp size={15} />
                      </span>
                      {isSidebarOpen && <span className="truncate text-xs">{item.label}</span>}
                    </span>

                    {isSidebarOpen && item.count !== undefined && item.count > 0 && (
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          isActive
                            ? "bg-white text-blue-700 shadow-2xs"
                            : item.isAlert
                            ? "bg-rose-500 text-white"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {item.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* NHÓM 2: QUẢN LÝ DỮ LIỆU */}
            <div className="space-y-1">
              {isSidebarOpen && (
                <div className="px-3 pt-2 pb-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Nội Dung Vùng
                </div>
              )}

              {[
                { id: "foods", label: "Ẩm thực & Đặc sản", icon: Utensils, count: foodsCount },
                { id: "collections", label: "Bộ sưu tập", icon: FolderHeart, count: 4 },
                { id: "provinces", label: "Tỉnh/Thành trong vùng", icon: Compass, count: 5 },
                { id: "blogs", label: "Blog & Cẩm nang", icon: BookOpen, count: blogsCount },
              ].map((item) => {
                const IconComp = item.icon;
                const isActive = mainTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setMainTab(item.id as AdminMainTab);
                      setSelectedPlaceId(null);
                    }}
                    className={`w-full group flex items-center ${
                      isSidebarOpen ? "justify-between px-3" : "justify-center px-0"
                    } py-2 rounded-lg transition-all duration-150 cursor-pointer ${
                      isActive
                        ? "bg-blue-600 text-white font-bold shadow-xs"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 font-medium"
                    }`}
                    title={!isSidebarOpen ? item.label : undefined}
                  >
                    <span className="flex items-center gap-3 min-w-0">
                      <span
                        className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 transition-colors ${
                          isActive
                            ? "bg-white text-blue-600 shadow-2xs"
                            : "bg-slate-100 text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-600"
                        }`}
                      >
                        <IconComp size={15} />
                      </span>
                      {isSidebarOpen && <span className="truncate text-xs">{item.label}</span>}
                    </span>

                    {isSidebarOpen && item.count !== undefined && item.count > 0 && (
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          isActive
                            ? "bg-white text-blue-700 shadow-2xs"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {item.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* NHÓM 3: HỆ THỐNG */}
            <div className="space-y-1">
              {isSidebarOpen && (
                <div className="px-3 pt-2 pb-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Hệ Thống
                </div>
              )}

              {[
                { id: "permissions", label: "Phân quyền & Tài khoản", icon: ShieldCheck },
                { id: "categories", label: "Danh mục hệ thống", icon: Layers },
                { id: "settings", label: "Cấu hình hệ thống", icon: Settings2 },
                { id: "notifications", label: "Trung tâm thông báo", icon: Bell, count: 4, isAlert: true },
                { id: "audit_logs", label: "Nhật ký kiểm toán", icon: History, count: auditLogsCount },
              ].map((item) => {
                const IconComp = item.icon;
                const isActive = mainTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setMainTab(item.id as AdminMainTab);
                      setSelectedPlaceId(null);
                    }}
                    className={`w-full group flex items-center ${
                      isSidebarOpen ? "justify-between px-3" : "justify-center px-0"
                    } py-2 rounded-lg transition-all duration-150 cursor-pointer ${
                      isActive
                        ? "bg-blue-600 text-white font-bold shadow-xs"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 font-medium"
                    }`}
                    title={!isSidebarOpen ? item.label : undefined}
                  >
                    <span className="flex items-center gap-3 min-w-0">
                      <span
                        className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 transition-colors ${
                          isActive
                            ? "bg-white text-blue-600 shadow-2xs"
                            : "bg-slate-100 text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-600"
                        }`}
                      >
                        <IconComp size={15} />
                      </span>
                      {isSidebarOpen && <span className="truncate text-xs">{item.label}</span>}
                    </span>

                    {isSidebarOpen && item.count !== undefined && item.count > 0 && (
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          isActive
                            ? "bg-white text-blue-700 shadow-2xs"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {item.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Buttons Footer */}
          <div className="p-3 border-t border-slate-100 bg-slate-50/70 space-y-1 shrink-0">
            {onOpenSystemAdmin && (
              <button
                onClick={onOpenSystemAdmin}
                className={`w-full flex items-center ${
                  isSidebarOpen ? "gap-2.5 px-3" : "justify-center px-0"
                } py-2 rounded-lg text-left text-xs font-semibold text-slate-700 hover:bg-white hover:text-blue-600 hover:shadow-xs border border-transparent hover:border-slate-200 transition cursor-pointer`}
                title="Chuyển sang System Admin"
              >
                <ArrowLeftRight size={15} className="text-blue-600" />
                {isSidebarOpen && <span>Chuyển sang System Admin</span>}
              </button>
            )}
            <button
              onClick={onBackToUserView}
              className={`w-full flex items-center ${
                isSidebarOpen ? "gap-2.5 px-3" : "justify-center px-0"
              } py-2 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 font-semibold text-xs transition-colors cursor-pointer`}
              title="Về trang khách"
            >
              <LogOut size={15} />
              {isSidebarOpen && <span>Về trang người dùng</span>}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
