import React, { useState, useMemo, useEffect } from "react";
import {
  MapPin,
  ClipboardCheck,
  ShieldAlert,
  MessageSquare,
  CheckCircle2,
  Clock,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  ArrowRight,
  Plus,
  RefreshCw,
  Filter,
  BarChart3,
  Calendar as CalendarIcon,
  Sparkles,
  Users,
  Utensils,
  Layers,
  ShieldCheck,
  Eye,
  FileSpreadsheet,
  Activity,
  Flame,
  Star,
  Award,
  PieChart,
  HardDrive,
  Cpu,
  Radio,
  SlidersHorizontal,
  ChevronRight,
  ChevronLeft,
  Maximize2,
  Download,
  Share2,
  Check,
  BookOpen,
  ArrowUpRight,
  Globe,
  Zap,
  Lock,
  Compass,
  AlertCircle,
  Copy,
  Edit2,
  Trash2,
  FileText,
  CreditCard,
  Building2,
  Bookmark,
  Search,
} from "lucide-react";
import { Place } from "../../data";
import { AdminProposalItem, AdminReportItem, AdminAssignmentInfo, AdminAuditLog } from "../../adminData";
import { AdminMainTab } from "../types";

interface DashboardTabProps {
  currentAdminInfo: AdminAssignmentInfo;
  places: Place[];
  proposals: AdminProposalItem[];
  reports: AdminReportItem[];
  reportedReviews: any[];
  auditLogs?: AdminAuditLog[];
  dashRegion: string;
  setDashRegion: (value: string) => void;
  dashProvince: string;
  setDashProvince: (value: string) => void;
  dashTimeRange: "today" | "7days" | "30days" | "90days";
  setDashTimeRange: (value: "today" | "7days" | "30days" | "90days") => void;
  setMainTab: (tab: AdminMainTab) => void;
  setPlaceFilterStatus: (value: string) => void;
  setProposalStatusFilter: (value: any) => void;
  setRevComTab: (value: "reviews" | "comments") => void;
  setRevReportFilter: (value: string) => void;
  setReportSubTab: (value: any) => void;
  setIsAddPlaceModalOpen: (value: boolean) => void;
  showToast: (message: string) => void;
}

export default function DashboardTab({
  currentAdminInfo,
  places,
  proposals,
  reports,
  reportedReviews,
  auditLogs = [],
  dashRegion,
  setDashRegion,
  dashProvince,
  setDashProvince,
  dashTimeRange,
  setDashTimeRange,
  setMainTab,
  setPlaceFilterStatus,
  setProposalStatusFilter,
  setRevComTab,
  setRevReportFilter,
  setReportSubTab,
  setIsAddPlaceModalOpen,
  showToast,
}: DashboardTabProps) {
  // State quản lý filter và sub-view
  const [userSegmentTab, setUserSegmentTab] = useState<"active" | "inactive">("active");
  const [mapViewMode, setMapViewMode] = useState<"map" | "satellite">("map");
  const [selectedMapCity, setSelectedMapCity] = useState("all");
  const [tablePage, setTablePage] = useState(1);
  const [autoRefreshCountdown, setAutoRefreshCountdown] = useState(30);
  const [isNoteDismissed, setIsNoteDismissed] = useState(false);

  // Auto-refresh countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setAutoRefreshCountdown((prev) => (prev <= 1 ? 30 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Filtered places
  const pendingPlaces = useMemo(
    () => places.filter((p) => (p as any).statusNum === 0 || p.status === "Chờ duyệt"),
    [places]
  );
  const activePlaces = useMemo(
    () => places.filter((p) => (p as any).statusNum === 1 || p.status === "Đang hoạt động" || !p.status),
    [places]
  );
  const pendingProposals = useMemo(
    () => proposals.filter((p) => p.status === "PENDING"),
    [proposals]
  );
  const pendingReports = useMemo(
    () => reports.filter((r) => r.status === "PENDING" || r.status === "IN_REVIEW"),
    [reports]
  );

  // 10 địa điểm nổi bật cho bảng quản lý Rubick
  const weeklyTopPlaces = useMemo(() => {
    return places.slice(0, 8).map((p, idx) => ({
      id: p.id,
      name: p.name,
      category: p.category,
      province: p.province,
      address: p.address,
      views: 120 + idx * 35,
      rating: p.rating || 4.8,
      status: idx % 3 === 0 ? "Pending" : idx === 4 ? "Inactive" : "Active",
      images: [
        p.img,
        "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=100&h=100&fit=crop",
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=100&h=100&fit=crop",
      ],
    }));
  }, [places]);

  const copyRefLink = () => {
    navigator.clipboard?.writeText("https://langthang.vn/ref/ambassador-2026");
    showToast("Đã sao chép liên kết giới thiệu cộng tác viên!");
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* ── 0. LIVE NOTICE & SYNC BAR ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-semibold border border-slate-200/60">
            Khu vực phụ trách: <span className="text-blue-600 font-bold">{currentAdminInfo.region}</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-semibold border border-blue-200/60 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Live Sync • Làm mới sau: <strong>{autoRefreshCountdown}s</strong>
          </span>
          <button
            onClick={() => {
              setAutoRefreshCountdown(30);
              showToast("Đã đồng bộ lại dữ liệu toàn hệ thống theo thời gian thực.");
            }}
            className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition shadow-2xs cursor-pointer"
            title="Làm mới ngay"
          >
            <RefreshCw size={14} />
          </button>
        </div>
      </div>

      {/* ── 0.5. TOP EXECUTIVE KPI STATS CARDS ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Tổng địa điểm */}
        <div className="relative group overflow-hidden bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Tổng Địa Điểm</span>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">{places.length}</div>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100 shadow-2xs group-hover:scale-105 transition-transform">
              <MapPin size={20} />
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs pt-2.5 border-t border-slate-100">
            <span className="text-[11px] text-slate-500 font-medium">Bao phủ 63 tỉnh thành</span>
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60">+18.4%</span>
          </div>
        </div>

        {/* KPI 2: Hàng chờ duyệt */}
        <div className="relative group overflow-hidden bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">Hàng Chờ Kiểm Duyệt</span>
              <div className="text-2xl sm:text-3xl font-black text-amber-600 mt-1">
                {pendingPlaces.length + pendingProposals.length}
              </div>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100 shadow-2xs group-hover:scale-105 transition-transform">
              <Clock size={20} />
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs pt-2.5 border-t border-slate-100">
            <span className="text-[11px] text-slate-500 font-medium">Đề xuất mới trong ngày</span>
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200/60">SLA &lt; 24h</span>
          </div>
        </div>

        {/* KPI 3: Báo cáo vi phạm */}
        <div className="relative group overflow-hidden bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-bold text-rose-600 uppercase tracking-wider">Báo Cáo Vi Phạm</span>
              <div className="text-2xl sm:text-3xl font-black text-rose-600 mt-1">
                {reports.filter((r) => r.status === 0).length || 8}
              </div>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 border border-rose-100 shadow-2xs group-hover:scale-105 transition-transform">
              <ShieldAlert size={20} />
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs pt-2.5 border-t border-slate-100">
            <span className="text-[11px] text-slate-500 font-medium">Xử lý trung bình: 42p</span>
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200/60">98.8% SLA</span>
          </div>
        </div>

        {/* KPI 4: Thành viên & Uy tín */}
        <div className="relative group overflow-hidden bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Thành Viên Hoạt Động</span>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">10,482</div>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100 shadow-2xs group-hover:scale-105 transition-transform">
              <Users size={20} />
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs pt-2.5 border-t border-slate-100">
            <span className="text-[11px] text-slate-500 font-medium">132 Đại sứ &amp; Khám phá</span>
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60">+8.5%</span>
          </div>
        </div>
      </div>

      {/* ── 1. HÀNG 1: GENERAL REPORT + REALTIME VISITORS + USERS BY AGE/SEGMENT ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* CARD 1: GENERAL REPORT (5 Cột) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_3px_12px_rgba(0,0,0,0.03)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
                <BarChart3 size={18} className="text-blue-600" />
                <span>Báo Cáo Tổng Hợp</span>
              </h2>
              <div className="flex items-center gap-2">
                <select
                  value={dashTimeRange}
                  onChange={(e) => setDashTimeRange(e.target.value as any)}
                  className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-slate-200 bg-slate-50 text-slate-700 outline-none hover:bg-white cursor-pointer"
                >
                  <option value="today">Hôm nay</option>
                  <option value="7days">7 ngày qua</option>
                  <option value="30days">Tháng này (30 ngày)</option>
                  <option value="90days">Quý này (90 ngày)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 mt-5">
              {/* Bên trái: Icon giỏ & số liệu chính */}
              <div className="sm:col-span-5 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200/60 shadow-2xs">
                  <Bookmark size={22} className="fill-amber-500 text-amber-500" />
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    128,450
                  </div>
                  <div className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 mt-1 bg-emerald-50 px-2 py-0.5 rounded-md">
                    <TrendingUp size={12} /> +14.2% so với tháng trước
                  </div>
                  <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                    Tổng lượt tương tác, tra cứu địa điểm và đọc cẩm nang du lịch toàn hệ thống.
                  </p>
                </div>
                <button
                  onClick={() => showToast("Đang kết xuất báo cáo Excel toàn diện...")}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 transition cursor-pointer"
                >
                  <span>Xuất báo cáo</span>
                  <ArrowRight size={14} />
                </button>
              </div>

              {/* Bên phải: 4 chỉ số chi tiết dạng Rubick */}
              <div className="sm:col-span-7 space-y-3 border-t sm:border-t-0 sm:border-l border-slate-100 sm:pl-5 pt-3 sm:pt-0">
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Tổng Địa Điểm</span>
                    <div className="text-sm font-black text-slate-800">{places.length} Điểm đến</div>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-0.5">
                    <TrendingUp size={11} /> +18.4%
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs border-t border-slate-50 pt-2">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Hàng Chờ Kiểm Duyệt</span>
                    <div className="text-sm font-black text-amber-600">
                      {pendingPlaces.length + pendingProposals.length} Mục
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
                    SLA &lt; 24h
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs border-t border-slate-50 pt-2">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Tỷ Lệ SLA Tuân Thủ</span>
                    <div className="text-sm font-black text-slate-800">98.8%</div>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-0.5">
                    <TrendingUp size={11} /> +2.1%
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs border-t border-slate-50 pt-2">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Thành Viên Hoạt Động</span>
                    <div className="text-sm font-black text-slate-800">10,482 Users</div>
                  </div>
                  <span className="text-[11px] font-bold text-blue-600 flex items-center gap-0.5">
                    <TrendingUp size={11} /> +5.5%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CARD 2: REALTIME VISITORS & HOTTEST URLS (4 Cột) */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_3px_12px_rgba(0,0,0,0.03)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <Activity size={18} className="text-emerald-500" />
                  <span>Người Dùng Trực Tuyến</span>
                </h2>
                <p className="text-[11px] text-slate-400">Đang lướt xem &amp; tương tác thời gian thực</p>
              </div>
              <button
                onClick={() => showToast("Mở bản đồ nhiệt tương tác thời gian thực (Heatmap)...")}
                className="text-xs font-bold text-blue-600 hover:underline"
              >
                Xem chi tiết
              </button>
            </div>

            <div className="mt-4 flex items-baseline justify-between">
              <div>
                <div className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <span>214</span>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">Lượt xem trang mỗi giây: <strong>49/s</strong></div>
              </div>

              {/* Mini Bar Chart động phong cách Rubick */}
              <div className="flex items-end gap-1.5 h-12">
                {[35, 60, 45, 80, 50, 95, 70, 85, 60, 100].map((h, i) => (
                  <div
                    key={i}
                    className="w-2 bg-blue-500/80 hover:bg-blue-600 rounded-t-sm transition-all"
                    style={{ height: `${h}%` }}
                    title={`Giây -${10 - i}s: ${h} lượt`}
                  />
                ))}
              </div>
            </div>

            {/* Top Active URLs */}
            <div className="mt-5 space-y-2 border-t border-slate-100 pt-3">
              <div className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Top Trang Được Xem Nhiều Nhất</div>
              {[
                { path: "/places/pho-bat-dan-ha-noi", active: 72 },
                { path: "/places/ba-na-hills-da-nang", active: 54 },
                { path: "/blog/food-tour-sai-gon-dem", active: 38 },
                { path: "/places/cafe-trung-giang-hoan-kiem", active: 21 },
              ].map((item) => (
                <div key={item.path} className="flex items-center justify-between text-xs py-1 hover:bg-slate-50 rounded px-1.5 -mx-1.5 transition">
                  <span className="font-mono text-[11px] text-slate-600 truncate max-w-[200px]" title={item.path}>
                    {item.path}
                  </span>
                  <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md text-[11px]">
                    {item.active}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => showToast("Đang làm mới dữ liệu người dùng trực tuyến...")}
            className="mt-4 w-full py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200 transition text-center cursor-pointer"
          >
            Báo cáo Real-Time Toàn Mạng
          </button>
        </div>

        {/* CARD 3: USERS BY AGE / SEGMENT (DONUT RADIAL CHART) (3 Cột) */}
        <div className="lg:col-span-3 bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_3px_12px_rgba(0,0,0,0.03)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-black text-slate-900 tracking-tight">Cơ Cấu Độ Tuổi</h2>
              <div className="flex bg-slate-100 p-0.5 rounded-lg text-[10px] font-bold">
                <button
                  onClick={() => setUserSegmentTab("active")}
                  className={`px-2 py-1 rounded-md transition ${userSegmentTab === "active" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-500"}`}
                >
                  Active
                </button>
                <button
                  onClick={() => setUserSegmentTab("inactive")}
                  className={`px-2 py-1 rounded-md transition ${userSegmentTab === "inactive" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-500"}`}
                >
                  Inactive
                </button>
              </div>
            </div>

            {/* Donut Chart Visual Rubick */}
            <div className="mt-4 flex flex-col items-center">
              <div className="relative w-32 h-32 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  {/* Background Circle */}
                  <path
                    className="text-slate-100"
                    strokeWidth="3.8"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  {/* Segment 1: 18-25t (45% - Blue) */}
                  <path
                    className="text-blue-600"
                    strokeDasharray="45, 100"
                    strokeWidth="4"
                    stroke="currentColor"
                    fill="none"
                    strokeLinecap="round"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  {/* Segment 2: 26-40t (35% - Amber) */}
                  <path
                    className="text-amber-500"
                    strokeDasharray="35, 100"
                    strokeDashoffset="-45"
                    strokeWidth="4"
                    stroke="currentColor"
                    fill="none"
                    strokeLinecap="round"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  {/* Segment 3: >40t (20% - Emerald) */}
                  <path
                    className="text-emerald-500"
                    strokeDasharray="20, 100"
                    strokeDashoffset="-80"
                    strokeWidth="4"
                    stroke="currentColor"
                    fill="none"
                    strokeLinecap="round"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute text-center">
                  <div className="text-xl font-black text-slate-900 leading-none">2,501</div>
                  <div className="text-[9px] text-slate-400 font-bold uppercase mt-0.5">Thành viên</div>
                </div>
              </div>

              {/* Legend Rubick */}
              <div className="w-full mt-4 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                    <span className="text-slate-600 text-[11px]">18 - 25 Tuổi (Gen Z)</span>
                  </div>
                  <span className="font-bold text-slate-800">45%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <span className="text-slate-600 text-[11px]">26 - 40 Tuổi (Millennials)</span>
                  </div>
                  <span className="font-bold text-slate-800">35%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span className="text-slate-600 text-[11px]">&gt; 40 Tuổi (Gia đình)</span>
                  </div>
                  <span className="font-bold text-slate-800">20%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span>Chế độ hiển thị</span>
            <span className="font-bold text-slate-700">Tương thích AI CRM</span>
          </div>
        </div>
      </div>

      {/* ── 2. HÀNG 2: BẢN ĐỒ MẬT ĐỘ ĐỊA ĐIỂM + TOP QUÁN & ĐẠI SỨ TUẦN ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* BẢN ĐỒ SỐ HÓA ĐIỂM ĐẾN (8 Cột) */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_3px_12px_rgba(0,0,0,0.03)] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
                <Globe size={18} className="text-blue-600" />
                <span>Bản Đồ Phân Bố Điểm Đến &amp; Mật Độ Check-in</span>
              </h2>
              <p className="text-[11px] text-slate-400 mt-0.5">
                250+ Địa điểm chính thức tại 21 tỉnh trọng điểm, bấm ghim để định vị nhanh
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex bg-slate-100 p-0.5 rounded-lg text-xs font-semibold">
                <button
                  onClick={() => setMapViewMode("map")}
                  className={`px-3 py-1 rounded-md transition ${mapViewMode === "map" ? "bg-white text-slate-900 shadow-2xs font-bold" : "text-slate-500"}`}
                >
                  Bản đồ
                </button>
                <button
                  onClick={() => setMapViewMode("satellite")}
                  className={`px-3 py-1 rounded-md transition ${mapViewMode === "satellite" ? "bg-white text-slate-900 shadow-2xs font-bold" : "text-slate-500"}`}
                >
                  Vệ tinh
                </button>
              </div>

              <select
                value={selectedMapCity}
                onChange={(e) => setSelectedMapCity(e.target.value)}
                className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-slate-200 bg-slate-50 text-slate-700 outline-none hover:bg-white cursor-pointer"
              >
                <option value="all">Tất cả 3 miền</option>
                <option value="hanoi">Hà Nội &amp; Miền Bắc</option>
                <option value="danang">Đà Nẵng &amp; Miền Trung</option>
                <option value="hcm">TP.HCM &amp; Miền Nam</option>
              </select>
            </div>
          </div>

          {/* Interactive Map Canvas Container (Rubick radar styling) */}
          <div className="relative h-72 w-full rounded-2xl overflow-hidden border border-slate-200 bg-[#E5E9F0]">
            {/* Background Map Visual */}
            <div
              className={`absolute inset-0 bg-cover bg-center transition-all duration-500 ${
                mapViewMode === "satellite"
                  ? "filter contrast-125 brightness-90 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] bg-slate-900"
                  : "bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:20px_20px] bg-slate-100"
              }`}
            >
              {/* Vietnam map overlay lines */}
              <svg className="w-full h-full opacity-30 pointer-events-none" viewBox="0 0 800 400">
                <path
                  d="M 250 40 Q 320 80 300 160 T 360 260 T 290 360"
                  fill="none"
                  stroke={mapViewMode === "satellite" ? "#60A5FA" : "#3B82F6"}
                  strokeWidth="8"
                  strokeDasharray="4 8"
                />
              </svg>
            </div>

            {/* Radar Map Markers (Rubick Pulse Hotspots) */}
            {[
              { id: "hn", name: "Hà Nội", top: "25%", left: "32%", count: "128 quán", tone: "bg-blue-600" },
              { id: "sapa", name: "Sa Pa", top: "15%", left: "26%", count: "45 điểm", tone: "bg-emerald-600" },
              { id: "dn", name: "Đà Nẵng", top: "50%", left: "46%", count: "98 quán", tone: "bg-purple-600" },
              { id: "hue", name: "Huế", top: "44%", left: "42%", count: "62 điểm", tone: "bg-amber-600" },
              { id: "dl", name: "Đà Lạt", top: "68%", left: "48%", count: "86 quán", tone: "bg-rose-600" },
              { id: "hcm", name: "TP. Hồ Chí Minh", top: "78%", left: "43%", count: "210 quán", tone: "bg-blue-600" },
              { id: "pq", name: "Phú Quốc", top: "88%", left: "36%", count: "52 điểm", tone: "bg-emerald-600" },
            ].map((marker) => (
              <button
                key={marker.id}
                onClick={() => {
                  setDashProvince(marker.name);
                  showToast(`Đã lọc dữ liệu theo tỉnh: ${marker.name}`);
                }}
                style={{ top: marker.top, left: marker.left }}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
              >
                <div className="relative flex items-center justify-center">
                  <span className={`animate-ping absolute inline-flex h-8 w-8 rounded-full ${marker.tone} opacity-30`} />
                  <div className={`relative w-6 h-6 rounded-full ${marker.tone} text-white flex items-center justify-center font-bold text-[10px] shadow-lg ring-4 ring-white`}>
                    <MapPin size={12} />
                  </div>
                </div>

                <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-900 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg shadow-xl pointer-events-none z-20">
                  <div>{marker.name}</div>
                  <div className="text-slate-300 font-normal text-[9px]">{marker.count}</div>
                </div>
              </button>
            ))}

            {/* Map Controls Corner */}
            <div className="absolute bottom-3 right-3 flex flex-col gap-1 bg-white/90 backdrop-blur-xs p-1 rounded-xl shadow-md border border-slate-200 text-slate-700 text-xs">
              <button onClick={() => showToast("Phóng to bản đồ")} className="p-1.5 hover:bg-slate-100 rounded-lg font-bold">+</button>
              <button onClick={() => showToast("Thu nhỏ bản đồ")} className="p-1.5 hover:bg-slate-100 rounded-lg font-bold">-</button>
            </div>

            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs px-3 py-1.5 rounded-xl shadow-sm border border-slate-200 text-[11px] font-semibold text-slate-700 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Đang định vị <strong>63 tỉnh thành</strong></span>
            </div>
          </div>
        </div>

        {/* TOP QUÁN ĂN & ĐẠI SỨ NỔI BẬT TUẦN (4 Cột) */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_3px_12px_rgba(0,0,0,0.03)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <Award size={18} className="text-amber-500" />
                  <span>Top Địa Điểm Được Yêu Thích Tuần</span>
                </h2>
                <p className="text-[11px] text-slate-400">Dựa trên lượt lưu &amp; check-in thực tế</p>
              </div>
              <button
                onClick={() => setMainTab("places")}
                className="text-xs font-bold text-blue-600 hover:underline"
              >
                Tất cả
              </button>
            </div>

            {/* List Top Venues (Rubick Style) */}
            <div className="mt-4 divide-y divide-slate-100">
              {[
                { name: "Phở Bát Đàn Cổ Truyền", date: "Hà Nội • Ẩm thực", score: "132 Lưu", avatar: "https://images.unsplash.com/photo-1509072619873-adb3dc289b50?w=100&h=100&fit=crop" },
                { name: "Cà Phê Trứng Giảng 1946", date: "Hà Nội • Đồ uống", score: "107 Lưu", avatar: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=100&h=100&fit=crop" },
                { name: "Bánh Mì Phượng Hội An", date: "Quảng Nam • Đặc sản", score: "102 Lưu", avatar: "https://images.unsplash.com/photo-1763703686284-b63557b08a86?w=100&h=100&fit=crop" },
                { name: "Cơm Tấm Ba Ghiền", date: "TP.HCM • Quán cơm", score: "101 Lưu", avatar: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=100&h=100&fit=crop" },
              ].map((item, idx) => (
                <div key={item.name} className="py-2.5 flex items-center justify-between gap-3 first:pt-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.avatar}
                      alt={item.name}
                      className="w-10 h-10 rounded-full object-cover border border-slate-200"
                    />
                    <div>
                      <div className="text-xs font-bold text-slate-900 truncate max-w-[160px]">
                        {item.name}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{item.date}</div>
                    </div>
                  </div>

                  <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[10px] border border-emerald-200/60 shadow-2xs">
                    {item.score}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => {
              setMainTab("places");
              showToast("Đang mở danh sách toàn bộ điểm đến...");
            }}
            className="mt-4 w-full py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200 transition text-center cursor-pointer"
          >
            Xem Thêm Địa Điểm (View More)
          </button>
        </div>
      </div>

      {/* ── 3. HÀNG 3: 2 ACTION CARDS / PROMO BANNERS (RUBICK STYLE) ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Banner 1: Gradient Royal Blue Action Card */}
        <div className="bg-gradient-to-r from-[#1E3A8A] via-[#1E40AF] to-[#2563EB] rounded-2xl p-6 text-white relative overflow-hidden shadow-lg border border-blue-800 flex flex-col justify-between min-h-[160px]">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10 max-w-md space-y-2">
            <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white font-bold text-[10px] uppercase tracking-wider backdrop-blur-xs">
              Chiến Dịch Số Hóa 2026
            </span>
            <h3 className="text-lg sm:text-xl font-black tracking-tight leading-snug">
              Bảo Trợ &amp; Số Hóa 1.000 Đặc Sản Ẩm Thực 3 Miền
            </h3>
            <p className="text-xs text-blue-100 leading-relaxed">
              Áp dụng tiêu chuẩn xác thực thông tin địa điểm và cẩm nang văn hóa chuẩn quốc gia.
            </p>
          </div>

          <div className="relative z-10 mt-4">
            <button
              onClick={() => {
                setIsAddPlaceModalOpen(true);
                showToast("Mở biểu mẫu thêm địa điểm ẩm thực di sản...");
              }}
              className="px-4 py-2 rounded-xl bg-white text-blue-900 hover:bg-blue-50 font-bold text-xs shadow-md transition cursor-pointer"
            >
              Thêm Địa Điểm Mới (Start Now)
            </button>
          </div>
        </div>

        {/* Banner 2: White Community Referral Action Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-[0_3px_12px_rgba(0,0,0,0.03)] flex flex-col justify-between min-h-[160px]">
          <div className="space-y-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[10px] uppercase tracking-wider border border-emerald-200/60">
              Cộng Tác Viên &amp; Đại Sứ
            </span>
            <h3 className="text-lg font-black text-slate-900 tracking-tight">
              Mời Bạn Bè &amp; Hướng Dẫn Viên Đóng Góp Điểm Đến!
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Nhận huy hiệu Người Đồng Hành Uy Tín và điểm danh vọng khi các đề xuất được duyệt.
            </p>
          </div>

          <div className="mt-4 flex items-center gap-2">
            <div className="flex-1 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-600 truncate">
              https://langthang.vn/ref/ambassador-2026
            </div>
            <button
              onClick={copyRefLink}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition flex items-center gap-1.5 shrink-0 cursor-pointer"
              title="Sao chép liên kết"
            >
              <Copy size={13} />
              <span>Copy</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── 4. HÀNG 4: BẢNG QUẢN LÝ ĐỊA ĐIỂM CẦN CHÚ Ý TUẦN NÀY (RUBICK TABLE) ── */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_3px_12px_rgba(0,0,0,0.03)] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
              <SlidersHorizontal size={18} className="text-blue-600" />
              <span>Địa Điểm &amp; Bài Đóng Góp Cần Quản Trị Tuần Này</span>
            </h2>
            <p className="text-[11px] text-slate-400 mt-0.5">Danh sách tổng hợp các điểm đến trọng điểm và hàng chờ xử lý</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => showToast("Đang xuất file Excel toàn bộ danh sách...")}
              className="px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <FileSpreadsheet size={13} className="text-emerald-600" />
              <span>Export to Excel</span>
            </button>
            <button
              onClick={() => showToast("Đang xuất file PDF báo cáo kiểm duyệt...")}
              className="px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Download size={13} className="text-rose-600" />
              <span>Export to PDF</span>
            </button>
          </div>
        </div>

        {/* Data Table Rubick */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-[10px] font-black uppercase tracking-wider text-slate-400 border-b border-slate-100">
              <tr>
                <th className="py-3 px-4">HÌNH ẢNH</th>
                <th className="py-3 px-4">TÊN ĐỊA ĐIỂM &amp; DANH MỤC</th>
                <th className="py-3 px-4">TỈNH / THÀNH</th>
                <th className="py-3 px-4 text-center">LƯỢT XEM</th>
                <th className="py-3 px-4 text-center">TRẠNG THÁI</th>
                <th className="py-3 px-4 text-right">THAO TÁC</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {weeklyTopPlaces.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition">
                  {/* Avatar Stack Rubick */}
                  <td className="py-3.5 px-4">
                    <div className="flex -space-x-3 overflow-hidden">
                      {item.images.map((imgUrl, i) => (
                        <img
                          key={i}
                          src={imgUrl}
                          alt="preview"
                          className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover shadow-2xs"
                        />
                      ))}
                    </div>
                  </td>

                  {/* Tên & Danh mục */}
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900 text-xs">{item.name}</div>
                    <div className="text-[10px] text-slate-400">{item.category} • {item.address}</div>
                  </td>

                  {/* Tỉnh thành */}
                  <td className="py-3.5 px-4 font-semibold text-slate-700">
                    {item.province}
                  </td>

                  {/* Lượt xem */}
                  <td className="py-3.5 px-4 text-center font-black text-slate-900">
                    {item.views}
                  </td>

                  {/* Trạng thái Badge */}
                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        item.status === "Active"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : item.status === "Pending"
                          ? "bg-amber-50 text-amber-700 border border-amber-200"
                          : "bg-rose-50 text-rose-700 border border-rose-200"
                      }`}
                    >
                      {item.status === "Active" ? "✓ Hoạt động" : item.status === "Pending" ? "⏳ Chờ duyệt" : "✕ Tạm ẩn"}
                    </span>
                  </td>

                  {/* Thao tác */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          setMainTab("places");
                          showToast(`Mở chỉnh sửa địa điểm: ${item.name}`);
                        }}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                      >
                        <Edit2 size={12} />
                        <span>Sửa</span>
                      </button>
                      <button
                        onClick={() => showToast(`Đã thay đổi trạng thái địa điểm: ${item.name}`)}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-500 hover:text-rose-700 hover:underline cursor-pointer"
                      >
                        <Trash2 size={12} />
                        <span>Ẩn</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Rubick */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
          <span className="text-slate-400">
            Hiển thị <strong>1 - 8</strong> trong tổng số <strong>{places.length}</strong> địa điểm
          </span>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setTablePage((p) => Math.max(1, p - 1))}
              disabled={tablePage === 1}
              className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 text-slate-600"
            >
              <ChevronLeft size={14} />
            </button>
            {[1, 2, 3].map((page) => (
              <button
                key={page}
                onClick={() => setTablePage(page)}
                className={`w-7 h-7 rounded-lg text-xs font-bold transition ${
                  tablePage === page
                    ? "bg-blue-600 text-white shadow-2xs"
                    : "border border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setTablePage((p) => Math.min(3, p + 1))}
              disabled={tablePage === 3}
              className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 text-slate-600"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* ── 5. IMPORTANT NOTES NOTICE (RUBICK STYLE) ── */}
      {!isNoteDismissed && (
        <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-5 text-xs text-amber-900 shadow-2xs space-y-2 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle size={16} className="text-amber-600" />
              <span className="font-bold text-sm text-amber-950">Ghi Chú Vận Hành Quan Trọng (Important Notice)</span>
            </div>
            <button
              onClick={() => setIsNoteDismissed(true)}
              className="text-[11px] font-bold text-amber-700 hover:underline cursor-pointer"
            >
              Ẩn thông báo (Dismiss)
            </button>
          </div>
          <p className="text-amber-800 leading-relaxed">
            Hệ thống đang triển khai chiến dịch thẩm định chất lượng hình ảnh và vị trí GPS của các quán ăn ẩm thực đường phố. Vui lòng ưu tiên xử lý các đề xuất thuộc danh mục <strong>Ẩm thực &amp; Quán ăn</strong> trước thời hạn SLA 24h.
          </p>
        </div>
      )}

      {/* ── 6. HÀNG 5: SCHEDULES CALENDAR + RECENT ACTIVITIES + REPUTATION TRANSACTIONS ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-xs">
        {/* CỘT 1: LỊCH ĐIỀU PHỐI (SCHEDULES CALENDAR - 4 Cột) */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_3px_12px_rgba(0,0,0,0.03)] space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
              <CalendarIcon size={18} className="text-blue-600" />
              <span>Lịch Trình Kiểm Duyệt</span>
            </h2>
            <button
              onClick={() => showToast("Đã mở lịch điều phối sự kiện du lịch...")}
              className="text-xs font-bold text-blue-600 hover:underline"
            >
              + Thêm lịch
            </button>
          </div>

          {/* Mini Calendar Visual (Rubick Style) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between font-bold text-slate-800">
              <span>Tháng 09, 2026</span>
              <div className="flex gap-1 text-slate-400">
                <button className="hover:text-slate-800">&lt;</button>
                <button className="hover:text-slate-800">&gt;</button>
              </div>
            </div>

            <div className="grid grid-cols-7 text-center font-bold text-slate-400 text-[10px]">
              {["CN", "T2", "T3", "T4", "T5", "T6", "T7"].map((d) => (
                <div key={d} className="py-1">{d}</div>
              ))}
            </div>

            <div className="grid grid-cols-7 text-center text-xs font-semibold gap-y-1">
              {[
                { day: 29, out: true }, { day: 30, out: true }, { day: 31, out: true },
                { day: 1 }, { day: 2 }, { day: 3 }, { day: 4 },
                { day: 5 }, { day: 6 }, { day: 7 }, { day: 8, active: true }, { day: 9 }, { day: 10 }, { day: 11 },
                { day: 12 }, { day: 13 }, { day: 14 }, { day: 15 }, { day: 16 }, { day: 17 }, { day: 18 },
                { day: 19 }, { day: 20 }, { day: 21 }, { day: 22, today: true }, { day: 23 }, { day: 24 }, { day: 25 },
              ].map((c, i) => (
                <div
                  key={i}
                  className={`py-1.5 rounded-lg transition ${
                    c.today
                      ? "bg-blue-600 text-white font-black shadow-2xs"
                      : c.active
                      ? "bg-emerald-100 text-emerald-800 font-bold"
                      : c.out
                      ? "text-slate-300"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {c.day}
                </div>
              ))}
            </div>
          </div>

          {/* Schedule Tags Rubick */}
          <div className="space-y-2 border-t border-slate-100 pt-3">
            <div className="flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-600" />
                <span className="font-semibold text-slate-700">Kiểm tra thực địa ẩm thực phố cổ</span>
              </div>
              <span className="font-bold text-slate-500">Hôm nay</span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="font-semibold text-slate-700">Họp giao ban SLA miền Trung</span>
              </div>
              <span className="font-bold text-slate-500">25/09</span>
            </div>
          </div>
        </div>

        {/* CỘT 2: HOẠT ĐỘNG GẦN ĐÂY (RECENT ACTIVITIES - 4 Cột) */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_3px_12px_rgba(0,0,0,0.03)] space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Clock size={18} className="text-purple-600" />
              <span>Hoạt Động Gần Đây</span>
            </h2>
            <button
              onClick={() => setMainTab("audit_logs")}
              className="text-xs font-bold text-blue-600 hover:underline"
            >
              Nhật ký →
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {[
              { name: "Trần Quốc Bảo", action: "Đã phê duyệt địa điểm mới", place: "Bún Bò Huế Mụ Rơi", time: "10 phút trước", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop" },
              { name: "Lê Hoàng Mai", action: "Đã phản hồi khiếu nại KN-092", place: "Nhà hàng Biển Đông", time: "45 phút trước", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop" },
              { name: "Nguyễn Minh Anh", action: "Đã cập nhật cẩm nang du lịch", place: "Food Tour Sài Gòn", time: "2 giờ trước", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop" },
              { name: "Phạm Đức Long", action: "Đã phân quyền điều phối viên", place: "Khu vực Miền Nam", time: "Hôm qua", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop" },
            ].map((act, idx) => (
              <div key={idx} className="py-2.5 flex items-start gap-3 first:pt-0 last:pb-0">
                <img
                  src={act.avatar}
                  alt={act.name}
                  className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-slate-900">
                    {act.name} <span className="font-normal text-slate-500">{act.action}</span>
                  </div>
                  <div className="text-[11px] font-semibold text-blue-600 truncate">{act.place}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{act.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CỘT 3: ĐIỂM DANH VỌNG & GIAO DỊCH ĐÓNG GÓP (REPUTATION & POINTS - 4 Cột) */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_3px_12px_rgba(0,0,0,0.03)] space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Star size={18} className="text-amber-500" />
              <span>Điểm Uy Tín Đóng Góp</span>
            </h2>
            <button
              onClick={() => showToast("Mở bảng xếp hạng danh vọng cộng đồng...")}
              className="text-xs font-bold text-blue-600 hover:underline"
            >
              Chi tiết
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {[
              { user: "Hoàng Long (Đại sứ)", note: "Duyệt đề xuất địa điểm chất lượng", point: "+50đ", positive: true },
              { user: "Minh Quang (Cộng tác)", note: "Đánh giá chi tiết kèm 5 ảnh thực tế", point: "+25đ", positive: true },
              { user: "Tài khoản spam 247", note: "Bị trừ điểm do báo cáo sai sự thật", point: "-30đ", positive: false },
              { user: "Thảo Vy (Khám phá)", note: "Đóng góp cẩm nang ẩm thực Tây Bắc", point: "+100đ", positive: true },
            ].map((tx, idx) => (
              <div key={idx} className="py-2.5 flex items-center justify-between gap-3 first:pt-0 last:pb-0">
                <div>
                  <div className="text-xs font-bold text-slate-900">{tx.user}</div>
                  <div className="text-[10px] text-slate-400">{tx.note}</div>
                </div>
                <span
                  className={`font-black text-xs px-2 py-0.5 rounded-md ${
                    tx.positive ? "text-emerald-600 bg-emerald-50" : "text-rose-600 bg-rose-50"
                  }`}
                >
                  {tx.point}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100 text-center">
            <span className="text-[11px] text-slate-400 font-medium">Hệ thống tính điểm tự động theo CLO3</span>
          </div>
        </div>
      </div>
    </div>
  );
}
