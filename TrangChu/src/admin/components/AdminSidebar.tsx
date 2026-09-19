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
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
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
  onBackToUserView,
}: AdminSidebarProps) {
  return (
    <>
      {/* Mobile backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside
        className={`${
          isSidebarOpen ? "w-64 translate-x-0" : "-translate-x-full lg:translate-x-0 lg:w-20"
        } fixed lg:sticky top-0 h-screen bg-white border-r border-slate-200/80 flex flex-col justify-between shrink-0 transition-all duration-300 ease-in-out z-40 select-none shadow-[2px_0_12px_rgba(0,0,0,0.02)]`}
      >
        <div className="flex flex-col h-full overflow-hidden">
          {/* Brand Header & Toggle */}
          <div className="h-16 px-5 flex items-center justify-between shrink-0 border-b border-slate-100">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="flex items-center -space-x-1.5 shrink-0">
                <div className="w-6 h-6 rounded-full bg-sky-400" />
                <div className="w-6 h-6 rounded-full bg-blue-600 shadow-sm flex items-center justify-center text-white font-extrabold text-[9px]">
                  LT
                </div>
              </div>
              {isSidebarOpen && (
                <div className="leading-tight overflow-hidden">
                  <span className="font-extrabold text-base text-slate-900 tracking-tight block">
                    LangThang
                  </span>
                </div>
              )}
            </div>

            {/* Unique Collapse/Expand button on Desktop */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
              title={isSidebarOpen ? "Thu gọn menu" : "Mở rộng menu"}
            >
              {isSidebarOpen ? <PanelLeftClose size={17} /> : <PanelLeftOpen size={17} />}
            </button>
          </div>

          {/* Navigation Items */}
          <div className="px-3.5 py-3 space-y-5 flex-1 overflow-y-auto text-xs scrollbar-none">
            {/* NHÓM 1: MENU CHÍNH */}
            <div className="space-y-1">
              {isSidebarOpen && (
                <div className="px-3 pt-1 pb-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Menu
                </div>
              )}

              {[
                { id: "dashboard", label: "Tổng quan", icon: LayoutDashboard },
                { id: "places", label: "Địa điểm", icon: MapPin, count: pendingPlacesCount, isAlert: pendingPlacesCount > 0 },
                { id: "proposals", label: "Đề xuất đóng góp", icon: ClipboardCheck, count: pendingProposalsCount, isAlert: pendingProposalsCount > 0 },
                { id: "reviews_comments", label: "Đánh giá & Bình luận", icon: MessageSquare, count: reportedReviewsCount, isAlert: reportedReviewsCount > 0 },
                { id: "reports", label: "Báo cáo vi phạm", icon: ShieldAlert, count: pendingReportsCount, isAlert: pendingReportsCount > 0 },
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
                      isSidebarOpen ? "justify-between px-3.5" : "justify-center px-0"
                    } py-2.5 rounded-xl font-semibold transition-all duration-150 cursor-pointer ${
                      isActive
                        ? "bg-[#2563EB] text-white font-bold shadow-md shadow-blue-500/20"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    }`}
                    title={!isSidebarOpen ? item.label : undefined}
                  >
                    <span className="flex items-center gap-3">
                      <IconComp
                        size={18}
                        className={
                          isActive
                            ? "text-white"
                            : "text-slate-400 group-hover:text-slate-600 transition-colors"
                        }
                      />
                      {isSidebarOpen && <span className="truncate text-sm">{item.label}</span>}
                    </span>

                    {isSidebarOpen && item.count !== undefined && item.count > 0 && (
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold ${
                          isActive
                            ? "bg-white text-blue-600"
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
                <div className="px-3 pt-2 pb-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Nội dung vùng
                </div>
              )}

              {[
                { id: "foods", label: "Ẩm thực & Đặc sản", icon: Utensils, count: foodsCount },
                { id: "collections", label: "Bộ sưu tập", icon: FolderHeart, count: 3 },
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
                      isSidebarOpen ? "justify-between px-3.5" : "justify-center px-0"
                    } py-2.5 rounded-xl font-semibold transition-all duration-150 cursor-pointer ${
                      isActive
                        ? "bg-[#2563EB] text-white font-bold shadow-md shadow-blue-500/20"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    }`}
                    title={!isSidebarOpen ? item.label : undefined}
                  >
                    <span className="flex items-center gap-3">
                      <IconComp
                        size={18}
                        className={
                          isActive
                            ? "text-white"
                            : "text-slate-400 group-hover:text-slate-600 transition-colors"
                        }
                      />
                      {isSidebarOpen && <span className="truncate text-sm">{item.label}</span>}
                    </span>

                    {isSidebarOpen && item.count !== undefined && (
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                          isActive ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
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
                <div className="px-3 pt-2 pb-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Hệ thống
                </div>
              )}

              {[
                { id: "categories", label: "Danh mục hệ thống", icon: Layers },
                { id: "notifications_profile", label: "Thông báo & Hồ sơ", icon: Bell, count: 3, isAlert: true },
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
                      isSidebarOpen ? "justify-between px-3.5" : "justify-center px-0"
                    } py-2.5 rounded-xl font-semibold transition-all duration-150 cursor-pointer ${
                      isActive
                        ? "bg-[#2563EB] text-white font-bold shadow-md shadow-blue-500/20"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    }`}
                    title={!isSidebarOpen ? item.label : undefined}
                  >
                    <span className="flex items-center gap-3">
                      <IconComp
                        size={18}
                        className={
                          isActive
                            ? "text-white"
                            : "text-slate-400 group-hover:text-slate-600 transition-colors"
                        }
                      />
                      {isSidebarOpen && <span className="truncate text-sm">{item.label}</span>}
                    </span>

                    {isSidebarOpen && item.count !== undefined && item.count > 0 && (
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          isActive ? "bg-white text-blue-600" : "bg-slate-100 text-slate-600"
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

          {/* Log Out Button */}
          <div className="p-3.5 border-t border-slate-100 shrink-0">
            <button
              onClick={onBackToUserView}
              className={`w-full flex items-center ${
                isSidebarOpen ? "gap-3 px-3.5" : "justify-center px-0"
              } py-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-semibold text-xs transition-colors cursor-pointer`}
              title="Về trang khách"
            >
              <LogOut size={17} className="text-slate-500" />
              {isSidebarOpen && <span>Thoát ra trang khách</span>}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
