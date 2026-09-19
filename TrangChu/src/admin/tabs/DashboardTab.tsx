import { useState } from "react";
import { Place } from "../../data";
import { AdminProposalItem, AdminReportItem, AdminAssignmentInfo, AdminAuditLog } from "../../adminData";
import { AdminMainTab } from "../types";
import {
  TrendingUp,
  MapPin,
  MessageSquare,
  ClipboardCheck,
  ShieldAlert,
  Star,
  AlertTriangle,
  Play,
  Filter,
  RefreshCw,
  Plus,
  ArrowRight,
  Sparkles,
  Award,
  Clock,
  Compass,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Eye,
  BarChart3,
  Calendar,
  Layers,
  ArrowUpRight,
} from "lucide-react";

interface DashboardTabProps {
  currentAdminInfo: AdminAssignmentInfo;
  places: Place[];
  proposals: AdminProposalItem[];
  reports: AdminReportItem[];
  reportedReviews: any[];
  auditLogs?: AdminAuditLog[];
  dashRegion: string;
  setDashRegion: (v: string) => void;
  dashProvince: string;
  setDashProvince: (v: string) => void;
  dashTimeRange: "today" | "7days" | "30days" | "90days";
  setDashTimeRange: (v: "today" | "7days" | "30days" | "90days") => void;
  setMainTab: (tab: AdminMainTab) => void;
  setPlaceFilterStatus: (v: string) => void;
  setProposalStatusFilter: (v: any) => void;
  setRevComTab: (v: "reviews" | "comments") => void;
  setRevReportFilter: (v: string) => void;
  setReportSubTab: (v: any) => void;
  setIsAddPlaceModalOpen: (v: boolean) => void;
  showToast: (msg: string) => void;
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
  const [selectedChartMonth, setSelectedChartMonth] = useState<number>(3); // Tháng 4 default
  const [queueFilter, setQueueFilter] = useState<"all" | "urgent" | "proposals" | "reports">("all");

  const pendingPlaces = places.filter((p) => p.status === "Chờ duyệt" || (p as any).statusNum === 0);
  const pendingProposals = proposals.filter((p) => p.status === 0);
  const pendingReports = reports.filter((r) => r.status === 0);

  const totalPendingWork =
    pendingPlaces.length + pendingProposals.length + pendingReports.length + reportedReviews.length;

  // Monthly stats for the interactive chart
  const monthlyStats = [
    { month: "Tháng 1", positive: 180, negative: 45, total: 225 },
    { month: "Tháng 2", positive: 310, negative: 60, total: 370 },
    { month: "Tháng 3", positive: 210, negative: 40, total: 250 },
    { month: "Tháng 4", positive: 620, negative: 116, total: 736 },
    { month: "Tháng 5", positive: 490, negative: 85, total: 575 },
    { month: "Tháng 6", positive: 430, negative: 72, total: 502 },
  ];

  // Action Queue items (human language, zero database schema names)
  const actionQueueItems = [
    {
      id: "reports_urgent",
      type: "reports",
      isUrgent: true,
      title: "Báo cáo đóng cửa & vi phạm thông tin",
      desc: "Phản ánh cơ sở kinh doanh đã ngừng hoạt động hoặc chuyển địa điểm nhưng vẫn hiển thị",
      count: pendingReports.length,
      badge: "Quá hạn SLA 1h",
      badgeColor: "bg-rose-50 text-rose-700 border-rose-200/80",
      actionText: "Xử lý vi phạm",
      onAction: () => {
        setReportSubTab("pending");
        setMainTab("reports");
      },
    },
    {
      id: "proposals_new",
      type: "proposals",
      isUrgent: true,
      title: "Đề xuất địa điểm mới từ cộng đồng",
      desc: "Người dùng đóng góp quán ăn mới kèm ảnh thực đơn, cần xác thực tọa độ và số điện thoại",
      count: proposals.filter((p) => p.status === 0 && p.type === "NEW_PLACE").length || 2,
      badge: "Chờ duyệt 48h",
      badgeColor: "bg-amber-50 text-amber-800 border-amber-200/80",
      actionText: "Duyệt đề xuất",
      onAction: () => {
        setProposalStatusFilter("0");
        setMainTab("proposals");
      },
    },
    {
      id: "proposals_edit",
      type: "proposals",
      isUrgent: false,
      title: "Đề xuất hiệu chỉnh giá & giờ mở cửa",
      desc: "Khách hàng cập nhật lại khung giá và thời gian phục vụ chính xác theo thực tế",
      count: proposals.filter((p) => p.status === 0 && p.type === "EDIT_INFO").length || 1,
      badge: "Cần thẩm định",
      badgeColor: "bg-slate-100 text-slate-700 border-slate-200/80",
      actionText: "Đối chiếu & sửa",
      onAction: () => {
        setProposalStatusFilter("0");
        setMainTab("proposals");
      },
    },
    {
      id: "reviews_flagged",
      type: "reports",
      isUrgent: false,
      title: "Đánh giá nghi vấn bôi nhọ & ngôn từ kích động",
      desc: "Người dùng và chủ quán báo cáo đánh giá 1 sao có dấu hiệu cạnh tranh không lành mạnh",
      count: reportedReviews.length || 1,
      badge: "Hôm nay",
      badgeColor: "bg-slate-100 text-slate-700 border-slate-200/80",
      actionText: "Xem đánh giá",
      onAction: () => {
        setRevComTab("reviews");
        setRevReportFilter("reported");
        setMainTab("reviews_comments");
      },
    },
    {
      id: "places_submitted",
      type: "reports",
      isUrgent: false,
      title: "Địa điểm mới chờ phê duyệt phát hành",
      desc: "Hồ sơ địa điểm ẩm thực do đối tác gửi lên, đã hoàn thiện thông tin cơ bản",
      count: pendingPlaces.length,
      badge: "Còn 18h SLA",
      badgeColor: "bg-slate-100 text-slate-700 border-slate-200/80",
      actionText: "Kiểm tra hồ sơ",
      onAction: () => {
        setPlaceFilterStatus("0");
        setMainTab("places");
      },
    },
  ];

  const filteredQueueItems = actionQueueItems.filter((item) => {
    if (queueFilter === "urgent") return item.isUrgent;
    if (queueFilter === "proposals") return item.type === "proposals";
    if (queueFilter === "reports") return item.type === "reports";
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* ══════════════════════════════════════════════════════════════════
          KHỐI A: THANH ĐIỀU KHIỂN VẬN HÀNH TOÀN CỤC (GLOBAL CONTROL BAR)
         ══════════════════════════════════════════════════════════════════ */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 font-semibold text-slate-800 pr-1">
            <Filter size={14} className="text-slate-500" />
            <span>Phạm vi dữ liệu:</span>
          </div>

          {/* Chọn Vùng */}
          <select
            value={dashRegion}
            onChange={(e) => setDashRegion(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white font-medium text-slate-700 cursor-pointer outline-none hover:border-slate-300 transition-colors"
          >
            <option value="all">Tất cả vùng phụ trách</option>
            <option value="nam_trung_bo">Duyên hải Nam Trung Bộ &amp; Tây Nguyên</option>
          </select>

          {/* Chọn Tỉnh */}
          <select
            value={dashProvince}
            onChange={(e) => setDashProvince(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white font-medium text-slate-700 cursor-pointer outline-none hover:border-slate-300 transition-colors"
          >
            <option value="all">Tất cả Tỉnh/Thành</option>
            <option value="Đà Nẵng">Đà Nẵng</option>
            <option value="Quảng Nam">Quảng Nam</option>
            <option value="Thừa Thiên Huế">Thừa Thiên Huế</option>
            <option value="Khánh Hòa">Khánh Hòa</option>
            <option value="Lâm Đồng">Lâm Đồng</option>
          </select>

          {/* Chọn Thời gian */}
          <select
            value={dashTimeRange}
            onChange={(e) => setDashTimeRange(e.target.value as any)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white font-medium text-slate-700 cursor-pointer outline-none hover:border-slate-300 transition-colors"
          >
            <option value="today">Hôm nay</option>
            <option value="7days">7 ngày qua</option>
            <option value="30days">30 ngày qua</option>
            <option value="90days">90 ngày qua</option>
          </select>

          {/* Pulse badge trạng thái */}
          <div className="hidden xl:flex items-center gap-1.5 pl-2 text-[11px] text-slate-500">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>Hệ thống trực tuyến</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setDashRegion("all");
              setDashProvince("all");
              setDashTimeRange("7days");
              showToast("Đã đặt lại bộ lọc mặc định.");
            }}
            className="px-3 py-1.5 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-50 font-medium cursor-pointer transition-colors"
          >
            Đặt lại
          </button>
          <button
            onClick={() => showToast("Đã đồng bộ số liệu thời gian thực mới nhất.")}
            className="px-3.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium cursor-pointer transition-colors flex items-center gap-1.5"
          >
            <RefreshCw size={13} className="text-slate-500" />
            <span>Đồng bộ</span>
          </button>
          <button
            onClick={() => setIsAddPlaceModalOpen(true)}
            className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium cursor-pointer transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Plus size={14} />
            <span>Thêm địa điểm</span>
          </button>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          KHỐI B: TRUNG TÂM VIỆC CẦN LÀM (OPERATIONAL ACTION QUEUE)
         ══════════════════════════════════════════════════════════════════ */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <h3 className="font-bold text-base text-slate-900 tracking-tight">
                Trung tâm việc cần làm
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 font-semibold text-xs border border-slate-200/60">
                {totalPendingWork} mục chờ xử lý
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Sắp xếp theo mức độ khẩn cấp và thời hạn cam kết xử lý (SLA)
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Filter pills */}
            <div className="hidden sm:flex items-center gap-1 p-1 bg-slate-100/80 rounded-xl text-xs">
              <button
                onClick={() => setQueueFilter("all")}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                  queueFilter === "all"
                    ? "bg-white text-slate-900 shadow-xs font-semibold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Tất cả
              </button>
              <button
                onClick={() => setQueueFilter("urgent")}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                  queueFilter === "urgent"
                    ? "bg-white text-rose-700 shadow-xs font-semibold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Khẩn cấp / SLA
              </button>
              <button
                onClick={() => setQueueFilter("proposals")}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                  queueFilter === "proposals"
                    ? "bg-white text-slate-900 shadow-xs font-semibold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Đề xuất
              </button>
              <button
                onClick={() => setQueueFilter("reports")}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                  queueFilter === "reports"
                    ? "bg-white text-slate-900 shadow-xs font-semibold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Báo cáo
              </button>
            </div>

            <button
              onClick={() => {
                setMainTab("reports");
                setReportSubTab("pending");
                showToast("Bật chế độ điều phối việc liên tục.");
              }}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
            >
              <Play size={12} fill="currentColor" />
              <span>Bắt đầu xử lý liên tục</span>
            </button>
          </div>
        </div>

        <div className="divide-y divide-slate-100 text-xs">
          {filteredQueueItems.map((item) => (
            <div
              key={item.id}
              className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors"
            >
              <div className="flex items-start sm:items-center gap-3.5">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${
                    item.isUrgent
                      ? "bg-rose-50 text-rose-600 border border-rose-200/80"
                      : "bg-slate-100 text-slate-700 border border-slate-200/80"
                  }`}
                >
                  {item.count}
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-slate-900 text-sm">{item.title}</span>
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border ${item.badgeColor}`}
                    >
                      {item.badge}
                    </span>
                  </div>
                  <p className="text-slate-400 text-xs">{item.desc}</p>
                </div>
              </div>

              <button
                onClick={item.onAction}
                className="self-end sm:self-center px-3.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-900 hover:text-white hover:border-slate-900 text-slate-700 font-medium transition-all cursor-pointer shrink-0 text-xs"
              >
                {item.actionText}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          KHỐI C: SỨC KHỎE VÙNG & CHỈ SỐ VẬN HÀNH (KEY SAAS METRICS)
         ══════════════════════════════════════════════════════════════════ */}
      <div>
        <div className="mb-3.5 flex items-center justify-between">
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500">
            Sức khỏe vùng &amp; Hiệu suất điều phối
          </h3>
          <span className="text-xs text-slate-400">Khoảng thời gian: 7 ngày qua</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Địa điểm số hóa */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Địa điểm số hóa</span>
              <span className="p-2 rounded-xl bg-slate-50 text-slate-700">
                <MapPin size={16} />
              </span>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-slate-900 tracking-tight font-mono">
                {places.length}
              </div>
              <div className="flex items-center gap-1.5 text-emerald-600 font-medium text-xs mt-1">
                <TrendingUp size={13} />
                <span>+12.8% so với tháng trước</span>
              </div>
            </div>
            <div className="pt-2.5 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Độ hoàn thiện dữ liệu:</span>
              <span className="font-semibold text-slate-700">94.2%</span>
            </div>
          </div>

          {/* Card 2: Tương tác & Đánh giá */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Đánh giá mới</span>
              <span className="p-2 rounded-xl bg-slate-50 text-slate-700">
                <MessageSquare size={16} />
              </span>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-slate-900 tracking-tight font-mono">
                1.240
              </div>
              <div className="flex items-center gap-1.5 text-emerald-600 font-medium text-xs mt-1">
                <TrendingUp size={13} />
                <span>+18.2% tuần này</span>
              </div>
            </div>
            <div className="pt-2.5 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Điểm trung bình toàn vùng:</span>
              <span className="font-semibold text-amber-600 flex items-center gap-0.5">
                <Star size={11} fill="currentColor" /> 4.8 / 5.0
              </span>
            </div>
          </div>

          {/* Card 3: Đề xuất đóng góp */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Đề xuất cộng đồng</span>
              <span className="p-2 rounded-xl bg-slate-50 text-slate-700">
                <ClipboardCheck size={16} />
              </span>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-slate-900 tracking-tight font-mono">
                38
              </div>
              <div className="flex items-center gap-1.5 text-slate-500 font-medium text-xs mt-1">
                <span>Tỷ lệ duyệt đạt 78.5%</span>
              </div>
            </div>
            <div className="pt-2.5 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Đã hòa nhập bản đồ:</span>
              <span className="font-semibold text-slate-700">30 địa điểm</span>
            </div>
          </div>

          {/* Card 4: Tuân thủ SLA */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Tuân thủ hạn SLA</span>
              <span className="p-2 rounded-xl bg-slate-50 text-slate-700">
                <Clock size={16} />
              </span>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-emerald-600 tracking-tight font-mono">
                98.4%
              </div>
              <div className="flex items-center gap-1.5 text-slate-500 font-medium text-xs mt-1">
                <span>Thời gian xử lý TB (MTTR): 1.8h</span>
              </div>
            </div>
            <div className="pt-2.5 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Chuẩn cam kết chất lượng:</span>
              <span className="font-semibold text-emerald-600">Đạt xuất sắc</span>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          KHỐI D: XU HƯỚNG TƯƠNG TÁC & ĐỘ PHỦ DỮ LIỆU TỈNH (2 CỘT SAAS)
         ══════════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cột trái (2/3): Biểu đồ tương tác thời gian thực */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 sm:p-6 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-base text-slate-900 tracking-tight">
                Thống kê review &amp; tương tác theo thời gian
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Khối lượng phản hồi từ người dùng qua 6 tháng gần nhất
              </p>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-900" />
                <span className="text-slate-600 font-medium">Đánh giá tốt (★4-5)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                <span className="text-slate-600 font-medium">Cần chú ý (★1-3)</span>
              </div>
            </div>
          </div>

          {/* Interactive Bar Chart */}
          <div className="pt-4 pb-2">
            <div className="h-56 flex items-end justify-between gap-2 sm:gap-6 px-2 sm:px-6 border-b border-slate-100">
              {monthlyStats.map((item, idx) => {
                const isSelected = selectedChartMonth === idx;
                const posHeight = (item.positive / 750) * 100;
                const negHeight = (item.negative / 750) * 100;

                return (
                  <div
                    key={item.month}
                    onClick={() => setSelectedChartMonth(idx)}
                    className="flex-1 flex flex-col items-center gap-2 group cursor-pointer h-full justify-end"
                  >
                    {/* Tooltip on active */}
                    <div
                      className={`text-[11px] px-2 py-1 rounded-lg bg-slate-900 text-white font-medium shadow-md transition-opacity whitespace-nowrap mb-1 ${
                        isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                      }`}
                    >
                      {item.total} lượt ({item.positive} tốt / {item.negative} kém)
                    </div>

                    {/* Bars Container */}
                    <div className="w-full max-w-[48px] flex items-end justify-center gap-1 h-44">
                      {/* Positive Bar */}
                      <div
                        style={{ height: `${posHeight}%` }}
                        className={`w-1/2 rounded-t-md transition-all duration-200 ${
                          isSelected
                            ? "bg-slate-900"
                            : "bg-slate-800 group-hover:bg-slate-900"
                        }`}
                      />
                      {/* Negative Bar */}
                      <div
                        style={{ height: `${negHeight}%` }}
                        className={`w-1/2 rounded-t-md transition-all duration-200 ${
                          isSelected
                            ? "bg-slate-400"
                            : "bg-slate-200 group-hover:bg-slate-300"
                        }`}
                      />
                    </div>

                    <span
                      className={`text-[11px] font-medium pt-1 ${
                        isSelected ? "text-slate-900 font-bold" : "text-slate-400 group-hover:text-slate-600"
                      }`}
                    >
                      {item.month}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-800">
                Chi tiết {monthlyStats[selectedChartMonth].month}:
              </span>
              <span className="text-slate-600">
                Tổng cộng <strong>{monthlyStats[selectedChartMonth].total}</strong> lượt phản hồi (Tỷ lệ hài lòng 84.2%)
              </span>
            </div>
            <button
              onClick={() => {
                setRevComTab("reviews");
                setMainTab("reviews_comments");
              }}
              className="text-slate-900 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Xem danh sách review</span>
              <ChevronRight size={13} />
            </button>
          </div>
        </div>

        {/* Cột phải (1/3): Độ phủ dữ liệu theo từng Tỉnh */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 sm:p-6 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-bold text-base text-slate-900 tracking-tight">
                Độ phủ dữ liệu các Tỉnh
              </h3>
              <button
                onClick={() => setMainTab("provinces")}
                className="text-xs text-slate-600 hover:text-slate-900 font-medium cursor-pointer"
              >
                Chi tiết &rarr;
              </button>
            </div>
            <p className="text-xs text-slate-400">
              Tỷ lệ hoàn thành số hóa thông tin địa điểm và thực đơn
            </p>

            {/* Big Aggregate Number */}
            <div className="my-5 p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 font-medium block">Trung bình vùng</span>
                <span className="text-2xl font-extrabold text-slate-900 font-mono">82.4%</span>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-semibold text-xs">
                +8.2% tháng này
              </span>
            </div>

            {/* Province items */}
            <div className="space-y-3.5 text-xs">
              {[
                { province: "Đà Nẵng", places: 28, coverage: 88 },
                { province: "Quảng Nam", places: 14, coverage: 83 },
                { province: "Thừa Thiên Huế", places: 8, coverage: 75 },
                { province: "Lâm Đồng", places: 12, coverage: 86 },
                { province: "Khánh Hòa", places: 9, coverage: 79 },
              ].map((prv) => (
                <div key={prv.province} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-800">{prv.province}</span>
                    <span className="font-mono font-bold text-slate-700 text-xs">
                      {prv.coverage}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-slate-900 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${prv.coverage}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>{prv.places} địa điểm số hóa</span>
                    <span>Đủ ảnh &amp; giờ mở cửa</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setMainTab("provinces")}
            className="w-full mt-4 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium text-xs border border-slate-200/80 transition-colors cursor-pointer"
          >
            Quản lý kế hoạch số hóa vùng
          </button>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          KHỐI E: PHÁT HIỆN BẤT THƯỜNG & CẢNH BÁO THÔNG MINH (ANOMALY ALERTS)
         ══════════════════════════════════════════════════════════════════ */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle size={16} className="text-amber-600" />
            <h3 className="font-bold text-base text-slate-900 tracking-tight">
              Phát hiện bất thường &amp; Cảnh báo tự động
            </h3>
          </div>
          <span className="text-xs text-slate-400">3 cảnh báo cần rà soát</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* Alert 1: Báo đóng cửa dồn dập */}
          <div className="p-4 rounded-xl border border-amber-200/80 bg-amber-50/40 space-y-2.5 flex flex-col justify-between">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-amber-950">Quán bị report đóng cửa</span>
                <span className="px-2 py-0.5 rounded-full bg-amber-200/70 text-amber-900 font-bold text-[10px]">
                  3 lượt
                </span>
              </div>
              <p className="text-slate-600 leading-relaxed text-xs">
                “Mì Quảng Ếch Bếp Trang” nhận 3 lượt báo đóng cửa trong 48h qua, kèm ảnh gỡ biển hiệu.
              </p>
            </div>
            <button
              onClick={() => {
                setMainTab("reports");
                setReportSubTab("pending");
              }}
              className="text-amber-900 font-semibold hover:underline text-xs cursor-pointer inline-flex items-center gap-1 self-start pt-1"
            >
              <span>Kiểm tra ngay</span>
              <ArrowRight size={12} />
            </button>
          </div>

          {/* Alert 2: Nghi vấn spam review */}
          <div className="p-4 rounded-xl border border-rose-200/80 bg-rose-50/40 space-y-2.5 flex flex-col justify-between">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-rose-950">Dấu hiệu spam review</span>
                <span className="px-2 py-0.5 rounded-full bg-rose-200/70 text-rose-900 font-bold text-[10px]">
                  User #188
                </span>
              </div>
              <p className="text-slate-600 leading-relaxed text-xs">
                Gửi liên tiếp 4 đánh giá 1 sao có nội dung bôi nhọ trong vòng 15 phút tại 4 quán khác nhau.
              </p>
            </div>
            <button
              onClick={() => {
                setRevComTab("reviews");
                setRevReportFilter("reported");
                setMainTab("reviews_comments");
              }}
              className="text-rose-900 font-semibold hover:underline text-xs cursor-pointer inline-flex items-center gap-1 self-start pt-1"
            >
              <span>Xem review bị báo cáo</span>
              <ArrowRight size={12} />
            </button>
          </div>

          {/* Alert 3: Khoảng trống dữ liệu */}
          <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/70 space-y-2.5 flex flex-col justify-between">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800">Khoảng trống dữ liệu GPS</span>
                <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-semibold text-[10px]">
                  2 quán
                </span>
              </div>
              <p className="text-slate-600 leading-relaxed text-xs">
                “Cơm Gà Bà Buội” và “Góc Ban Mê” chưa được ghim vị trí chính xác trên bản đồ số.
              </p>
            </div>
            <button
              onClick={() => {
                setMainTab("places");
              }}
              className="text-slate-800 font-semibold hover:underline text-xs cursor-pointer inline-flex items-center gap-1 self-start pt-1"
            >
              <span>Bổ sung tọa độ</span>
              <ArrowRight size={12} />
            </button>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          KHỐI F: NHẬT KÝ KIỂM TOÁN THỜI GIAN THỰC (REAL-TIME AUDIT TRAIL)
         ══════════════════════════════════════════════════════════════════ */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden text-xs">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-slate-900 tracking-tight">
              Hoạt động kiểm duyệt gần nhất (Audit Trail)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Ghi lại mọi tác vụ phê duyệt, ẩn nội dung và giải quyết khiếu nại của điều phối viên
            </p>
          </div>

          <button
            onClick={() => setMainTab("audit_logs")}
            className="text-xs text-slate-600 hover:text-slate-900 font-medium cursor-pointer"
          >
            Xem toàn bộ nhật ký &rarr;
          </button>
        </div>

        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-400 font-semibold border-b border-slate-100 text-[11px]">
            <tr>
              <th className="py-3 px-5">Đối tượng</th>
              <th className="py-3 px-4">Thời gian</th>
              <th className="py-3 px-4">Hành động</th>
              <th className="py-3 px-4 hidden sm:table-cell">Ghi chú chi tiết</th>
              <th className="py-3 px-5 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {(auditLogs.length > 0
              ? auditLogs.slice(0, 5)
              : [
                  {
                    id: 1,
                    targetName: "Bếp Nhà Lục Tỉnh",
                    timestamp: "Vừa xong",
                    action: "Chấp nhận xử lý báo cáo (1 lượt)",
                    details: "Đã xác minh cơ sở ngừng kinh doanh, tiến hành ẩn trên hệ thống.",
                    type: "resolve",
                  },
                  {
                    id: 2,
                    targetName: "Bánh Canh Cua Rời",
                    timestamp: "Hôm qua, 10:00",
                    action: "Phê duyệt đề xuất",
                    details: "Duyệt địa điểm quán ăn mới cho tỉnh Khánh Hòa, thêm vào cơ sở dữ liệu chính thức.",
                    type: "approve",
                  },
                  {
                    id: 3,
                    targetName: "Cà Phê 9999",
                    timestamp: "2 ngày trước, 15:30",
                    action: "Từ chối đề xuất",
                    details: "Lý do: Địa chỉ ảo không tồn tại thực tế, ảnh sao chép vi phạm bản quyền.",
                    type: "reject",
                  },
                  {
                    id: 4,
                    targetName: "Quán Ăn Duyên Hải",
                    timestamp: "Hôm qua, 15:00",
                    action: "Xử lý báo cáo vi phạm",
                    details: "Giải thích thắc mắc khách về ranh giới bãi tắm tự phát, gắn nhãn vị trí rõ ràng.",
                    type: "resolve",
                  },
                ]
            ).map((log: any) => (
              <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                <td className="py-3.5 px-5 font-bold text-slate-900">
                  {log.targetName || "Địa điểm chưa định danh"}
                </td>
                <td className="py-3.5 px-4 text-slate-400">{log.timestamp}</td>
                <td className="py-3.5 px-4">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                      log.type === "approve"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200/80"
                        : log.type === "reject"
                        ? "bg-rose-50 text-rose-700 border border-rose-200/80"
                        : "bg-slate-100 text-slate-800 border border-slate-200/80"
                    }`}
                  >
                    {log.action}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-slate-500 max-w-md truncate hidden sm:table-cell">
                  {log.details}
                </td>
                <td className="py-3.5 px-5 text-right">
                  <button
                    onClick={() => showToast(`Chi tiết tác vụ: ${log.action}`)}
                    className="px-2.5 py-1 rounded-lg hover:bg-slate-100 text-slate-600 font-medium cursor-pointer transition-colors text-xs"
                  >
                    Chi tiết
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
