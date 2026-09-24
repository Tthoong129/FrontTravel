import { useState } from "react";
import {
  initialAdminReports,
  DB_STANDARD_REPORT_TYPES,
  type AdminReportItem,
  type ReportTypeCode,
} from "../../adminData";
import {
  AlertTriangle,
  Building2,
  CheckCircle2,
  ChevronDown,
  Clock,
  Eye,
  FileText,
  Filter,
  Image as ImageIcon,
  MessageSquare,
  RefreshCw,
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Star,
  Target,
  TrendingUp,
  Users,
  X,
  XCircle,
  Zap,
  ArrowRight,
  BarChart3,
  Check,
} from "lucide-react";

/* ── Helpers ── */

function Badge({ children, tone = "slate" }: { children: React.ReactNode; tone?: "green" | "amber" | "red" | "blue" | "orange" | "slate" | "purple" }) {
  const colors: Record<string, string> = {
    green: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
    amber: "bg-amber-50 text-amber-700 border-amber-200/80",
    red: "bg-rose-50 text-rose-700 border-rose-200/80",
    blue: "bg-blue-50 text-blue-700 border-blue-200/80",
    orange: "bg-orange-50 text-orange-700 border-orange-200/80",
    slate: "bg-slate-100 text-slate-600 border-slate-200",
    purple: "bg-violet-50 text-violet-700 border-violet-200/80",
  };
  return <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-semibold ${colors[tone]}`}>{children}</span>;
}

const PRIORITY_CONFIG: Record<string, { label: string; tone: string; dotColor: string }> = {
  urgent: { label: "Khẩn cấp", tone: "red", dotColor: "bg-rose-500" },
  high: { label: "Cao", tone: "orange", dotColor: "bg-orange-500" },
  normal: { label: "Thường", tone: "blue", dotColor: "bg-blue-500" },
  low: { label: "Thấp", tone: "slate", dotColor: "bg-slate-400" },
};

const SLA_CONFIG: Record<string, { color: string; bg: string }> = {
  breached: { color: "text-rose-700", bg: "bg-rose-50 border-rose-200" },
  warning: { color: "text-amber-700", bg: "bg-amber-50 border-amber-200" },
  today: { color: "text-blue-700", bg: "bg-blue-50 border-blue-200" },
  normal: { color: "text-slate-500", bg: "bg-slate-50 border-slate-200" },
};

const TARGET_TYPE_ICONS: Record<string, typeof Building2> = {
  place: Building2,
  review: Star,
  comment: MessageSquare,
  blog: FileText,
  photo: ImageIcon,
};

const TARGET_TYPE_LABELS: Record<string, string> = {
  place: "Địa điểm",
  review: "Đánh giá",
  comment: "Bình luận",
  blog: "Bài viết",
  photo: "Hình ảnh",
};

type SubTab = "all" | "urgent" | "assigned" | "resolved";
type TargetFilter = "all" | "place" | "review" | "comment" | "blog" | "photo";
type PriorityFilter = "all" | "urgent" | "high" | "normal" | "low";

interface SystemReportsTabProps {
  showToast: (msg: string) => void;
}

export default function SystemReportsTab({ showToast }: SystemReportsTabProps) {
  const [reports, setReports] = useState<AdminReportItem[]>(initialAdminReports);
  const [subTab, setSubTab] = useState<SubTab>("all");
  const [targetFilter, setTargetFilter] = useState<TargetFilter>("all");
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>("all");
  const [searchText, setSearchText] = useState("");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [drawerReport, setDrawerReport] = useState<AdminReportItem | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showReportTypes, setShowReportTypes] = useState(false);

  /* ── Filtering ── */
  const filteredReports = reports.filter((r) => {
    if (subTab === "all" && r.status !== 0) return false;
    if (subTab === "urgent" && (r.status !== 0 || (r.priority !== "urgent" && r.slaStatus !== "breached"))) return false;
    if (subTab === "assigned" && (r.status !== 0 || !r.assignedToAdminId)) return false;
    if (subTab === "resolved" && r.status === 0) return false;

    if (targetFilter !== "all" && r.targetType !== targetFilter) return false;
    if (priorityFilter !== "all" && r.priority !== priorityFilter) return false;

    if (searchText.trim()) {
      const q = searchText.toLowerCase();
      const match =
        (r.codeId || `#${r.id}`).toLowerCase().includes(q) ||
        r.targetTitle.toLowerCase().includes(q) ||
        r.reporterName.toLowerCase().includes(q) ||
        (r.reportReasonCategory || r.reportTypeName).toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const PAGE_SIZE = 7;
  const totalPages = Math.max(1, Math.ceil(filteredReports.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const pageReports = filteredReports.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  /* ── Metrics ── */
  const pendingAll = reports.filter((r) => r.status === 0);
  const urgentCount = pendingAll.filter((r) => r.priority === "urgent" || r.slaStatus === "breached").length;
  const resolvedThisMonth = reports.filter((r) => r.status !== 0).length;
  const slaRate = pendingAll.length > 0
    ? Math.round(((pendingAll.length - pendingAll.filter((r) => r.slaStatus === "breached").length) / pendingAll.length) * 100)
    : 100;

  /* ── Handlers ── */
  const toggleSelect = (id: number) => {
    setSelectedIds((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === pageReports.length) setSelectedIds([]);
    else setSelectedIds(pageReports.map((r) => r.id));
  };

  const handleResolve = (action: string) => {
    if (!drawerReport) return;
    setReports((prev) =>
      prev.map((r) => (r.id === drawerReport.id ? { ...r, status: 1 } : r))
    );
    showToast(`Đã ${action} đối với báo cáo ${drawerReport.codeId || `#${drawerReport.id}`}.`);
    setDrawerReport(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150 text-slate-800">
      {/* ── 1. PAGE TITLE & ACTIONS ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <span>Báo cáo Vi phạm &amp; Khiếu nại</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
              {pendingAll.length} chờ xử lý
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Tổng hợp và điều phối xử lý vi phạm địa điểm, đánh giá, bình luận, bài viết toàn hệ thống.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => setShowReportTypes(!showReportTypes)}
            className="px-3.5 py-2 rounded-xl border border-slate-200 hover:border-slate-300 bg-white text-slate-700 text-xs font-semibold shadow-2xs flex items-center gap-1.5 transition cursor-pointer"
          >
            <BarChart3 size={14} />
            <span>Loại vi phạm ({Object.keys(DB_STANDARD_REPORT_TYPES).length})</span>
          </button>
          <button
            onClick={() => showToast("Đã xuất báo cáo vi phạm dạng CSV.")}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition cursor-pointer"
          >
            <FileText size={14} />
            <span>Xuất CSV</span>
          </button>
        </div>
      </div>

      {/* ── METRICS STRIP ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Tổng chờ xử lý</span>
            <div className="text-xl font-bold text-rose-600 mt-0.5">{pendingAll.length} mục</div>
            <span className="text-[10px] text-slate-500">Từ tất cả nguồn báo cáo</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-200/60">
            <AlertTriangle size={18} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Khẩn cấp / Quá hạn</span>
            <div className="text-xl font-bold text-amber-600 mt-0.5">{urgentCount} báo cáo</div>
            <span className="text-[10px] text-slate-500">Cần xử lý trong 24h</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200/60">
            <Zap size={18} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Đã xử lý (Tháng này)</span>
            <div className="text-xl font-bold text-emerald-700 mt-0.5">{resolvedThisMonth} trường hợp</div>
            <span className="text-[10px] text-slate-500">Đã khóa hoặc bác bỏ</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200/60">
            <CheckCircle2 size={18} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">SLA Đúng hạn</span>
            <div className="text-xl font-bold text-slate-900 mt-0.5">{slaRate}%</div>
            <span className="text-[10px] text-slate-500">Tỷ lệ trong hạn 48 giờ</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200/60">
            <TrendingUp size={18} />
          </div>
        </div>
      </div>

      {/* ── REPORT TYPES DICTIONARY MODAL/PANEL ── */}
      {showReportTypes && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Danh mục loại vi phạm chuẩn hóa (dbo.ReportTypes)</h3>
              <p className="text-xs text-slate-400 mt-0.5">Các loại báo cáo và hành động xử lý khuyến nghị theo CSDL.</p>
            </div>
            <button onClick={() => setShowReportTypes(false)} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100">
              <X size={16} />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/70 text-slate-400 font-semibold border-b border-slate-100 text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3">Mã code</th>
                  <th className="px-5 py-3">Tên vi phạm</th>
                  <th className="px-5 py-3">Đối tượng</th>
                  <th className="px-5 py-3">Mức ưu tiên</th>
                  <th className="px-5 py-3">Hành động gợi ý</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {Object.values(DB_STANDARD_REPORT_TYPES).map((rt) => (
                  <tr key={rt.code} className="hover:bg-slate-50/70">
                    <td className="px-5 py-3 font-mono text-[11px] text-slate-700 font-semibold">{rt.code}</td>
                    <td className="px-5 py-3 font-bold text-slate-900">{rt.name}</td>
                    <td className="px-5 py-3">
                      <Badge tone={rt.code.startsWith("PLACE") ? "blue" : rt.code.startsWith("CONTENT") ? "purple" : "slate"}>
                        {rt.code.startsWith("PLACE") ? "Địa điểm" : rt.code.startsWith("CONTENT") ? "Nội dung" : "Tất cả"}
                      </Badge>
                    </td>
                    <td className="px-5 py-3">
                      <Badge tone={PRIORITY_CONFIG[rt.defaultPriority]?.tone as any}>
                        {PRIORITY_CONFIG[rt.defaultPriority]?.label}
                      </Badge>
                    </td>
                    <td className="px-5 py-3 text-slate-500">{rt.suggestedAction}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── TOOLBAR: TABS & FILTER ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-1 p-1 bg-slate-100/80 rounded-xl">
          {([
            { key: "all" as SubTab, label: "Tất cả chờ", count: pendingAll.length },
            { key: "urgent" as SubTab, label: "Khẩn cấp", count: urgentCount },
            { key: "assigned" as SubTab, label: "Đã phân công", count: pendingAll.filter((r) => r.assignedToAdminId).length },
            { key: "resolved" as SubTab, label: "Đã xử lý", count: resolvedThisMonth },
          ]).map((t) => (
            <button
              key={t.key}
              onClick={() => { setSubTab(t.key); setCurrentPage(1); setSelectedIds([]); }}
              className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
                subTab === t.key
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {t.label} ({t.count})
            </button>
          ))}
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`px-3.5 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
            showFilters
              ? "border-blue-600 bg-blue-50 text-blue-700 shadow-2xs font-bold"
              : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
          }`}
        >
          <Filter size={14} />
          <span>Bộ lọc &amp; Tìm kiếm</span>
        </button>
      </div>

      {/* ── FILTERS PANEL ── */}
      {showFilters && (
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="text-[11px] font-bold text-slate-700 block mb-1">Tìm kiếm từ khóa:</label>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={searchText}
                onChange={(e) => { setSearchText(e.target.value); setCurrentPage(1); }}
                placeholder="Tìm mã báo cáo, tên, người gửi..."
                className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-xs font-medium focus:bg-white outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-700 block mb-1">Loại đối tượng:</label>
            <select
              value={targetFilter}
              onChange={(e) => { setTargetFilter(e.target.value as TargetFilter); setCurrentPage(1); }}
              className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium outline-none"
            >
              <option value="all">Tất cả loại</option>
              <option value="place">Địa điểm</option>
              <option value="review">Đánh giá</option>
              <option value="comment">Bình luận</option>
              <option value="blog">Bài viết</option>
              <option value="photo">Hình ảnh</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-700 block mb-1">Mức ưu tiên:</label>
            <select
              value={priorityFilter}
              onChange={(e) => { setPriorityFilter(e.target.value as PriorityFilter); setCurrentPage(1); }}
              className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium outline-none"
            >
              <option value="all">Tất cả ưu tiên</option>
              <option value="urgent">Khẩn cấp</option>
              <option value="high">Cao</option>
              <option value="normal">Thường</option>
              <option value="low">Thấp</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => { setTargetFilter("all"); setPriorityFilter("all"); setSearchText(""); setCurrentPage(1); }}
              className="w-full py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 font-medium flex items-center justify-center gap-1 cursor-pointer"
            >
              <RefreshCw size={12} />
              <span>Đặt lại</span>
            </button>
          </div>
        </div>
      )}

      {/* ── BATCH ACTIONS BAR ── */}
      {selectedIds.length > 0 && (
        <div className="bg-slate-900 text-white p-3.5 rounded-2xl flex items-center justify-between text-xs shadow-md">
          <div className="flex items-center gap-2">
            <span className="font-bold">Đã chọn {selectedIds.length} mục</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => { showToast(`Đã phân công ${selectedIds.length} báo cáo cho Admin phụ trách.`); setSelectedIds([]); }}
              className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 font-semibold cursor-pointer"
            >
              Phân công Admin
            </button>
            <button
              onClick={() => { showToast(`Đã bác bỏ ${selectedIds.length} báo cáo hợp lệ.`); setSelectedIds([]); }}
              className="px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 font-semibold cursor-pointer"
            >
              Bác bỏ hàng loạt
            </button>
            <button
              onClick={() => setSelectedIds([])}
              className="text-slate-400 hover:text-white px-2 py-1"
            >
              Hủy
            </button>
          </div>
        </div>
      )}

      {/* ── TABLE VIEW ── */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden text-xs">
        <table className="w-full text-left">
          <thead className="bg-slate-50/70 text-slate-400 font-semibold border-b border-slate-100 text-[11px] uppercase tracking-wider">
            <tr>
              <th className="py-3.5 px-4 w-10">
                <input
                  type="checkbox"
                  checked={selectedIds.length === pageReports.length && pageReports.length > 0}
                  onChange={toggleSelectAll}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
              </th>
              <th className="py-3.5 px-4">Mã Báo cáo</th>
              <th className="py-3.5 px-4 min-w-[220px]">Đối tượng bị phản ánh</th>
              <th className="py-3.5 px-4">Lý do vi phạm</th>
              <th className="py-3.5 px-4">Người gửi</th>
              <th className="py-3.5 px-4">Mức độ</th>
              <th className="py-3.5 px-4">SLA Hạn xử lý</th>
              <th className="py-3.5 px-4 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {pageReports.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-slate-400">
                  Không có báo cáo nào phù hợp trong mục này.
                </td>
              </tr>
            ) : (
              pageReports.map((r) => {
                const TargetIcon = TARGET_TYPE_ICONS[r.targetType] || FileText;
                const pCfg = PRIORITY_CONFIG[r.priority] || PRIORITY_CONFIG["normal"];
                const slaCfg = SLA_CONFIG[r.slaStatus || "normal"] || SLA_CONFIG["normal"];

                return (
                  <tr key={r.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(r.id)}
                        onChange={() => toggleSelect(r.id)}
                        className="rounded text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-700">
                      {r.codeId || `#${r.id}`}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        {r.targetImage ? (
                          <img src={r.targetImage} alt="" className="w-9 h-9 rounded-lg object-cover ring-1 ring-slate-200" />
                        ) : (
                          <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                            <TargetIcon size={16} />
                          </div>
                        )}
                        <div>
                          <div className="font-bold text-slate-900 line-clamp-1">{r.targetTitle}</div>
                          <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-0.5">
                            <Badge tone={r.targetType === "place" ? "blue" : r.targetType === "review" ? "amber" : "slate"}>
                              {TARGET_TYPE_LABELS[r.targetType] || r.targetType}
                            </Badge>
                            <span>{r.province}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800">{r.reportReasonCategory || r.reportTypeName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{r.reportTypeCode}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <img src={r.reporterAvatar} alt="" className="w-6 h-6 rounded-full object-cover" />
                        <div>
                          <span className="font-semibold text-slate-700 block">{r.reporterName}</span>
                          <span className="text-[10px] text-emerald-600 font-medium">
                            {r.reporterAccuracyRate}% uy tín
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge tone={pCfg.tone as any}>{pCfg.label}</Badge>
                    </td>
                    <td className="py-3.5 px-4">
                      {r.slaStatus ? (
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold border ${slaCfg.bg} ${slaCfg.color}`}>
                          <Clock size={10} />
                          {r.slaLabel || "—"}
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => setDrawerReport(r)}
                        className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-[11px] shadow-xs transition cursor-pointer"
                      >
                        Xử lý
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-slate-500 text-[11px]">Trang {safePage} / {totalPages}</span>
            <div className="flex gap-1">
              <button
                disabled={safePage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="px-2.5 py-1 rounded border border-slate-200 bg-white disabled:opacity-40"
              >
                Trước
              </button>
              <button
                disabled={safePage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="px-2.5 py-1 rounded border border-slate-200 bg-white disabled:opacity-40"
              >
                Sau
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── MODAL XỬ LÝ REPORT CHUYÊN NGHIỆP & RÕ RÀNG ── */}
      {drawerReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 sm:p-6 overflow-y-auto">
          <div className="w-full max-w-4xl bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-4 px-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/70 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center border border-rose-200/60">
                  <ShieldAlert size={17} />
                </div>
                <div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <span className="font-mono font-bold text-slate-700">{drawerReport.codeId || `#${drawerReport.id}`}</span>
                    <span>•</span>
                    <span>{drawerReport.createdAt}</span>
                    <span>•</span>
                    <Badge tone={drawerReport.priority === "urgent" ? "red" : drawerReport.priority === "high" ? "orange" : "blue"}>
                      {drawerReport.priority === "urgent" ? "Khẩn cấp" : drawerReport.priority === "high" ? "Ưu tiên cao" : "Bình thường"}
                    </Badge>
                  </div>
                  <h3 className="font-bold text-base text-slate-900 mt-0.5">
                    Hồ sơ xử lý phản ánh vi phạm
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setDrawerReport(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body: 2 Columns */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-y-auto divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
              {/* CỘT TRÁI (7/12): Chi tiết đối tượng & Bằng chứng báo cáo */}
              <div className="lg:col-span-7 p-6 space-y-5 bg-white text-xs">
                {/* 1. Đối tượng bị báo cáo */}
                <div className="space-y-2">
                  <span className="font-bold text-[11px] text-slate-400 uppercase tracking-wider block">
                    1. Đối tượng bị phản ánh
                  </span>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="flex items-start gap-3">
                      {drawerReport.targetImage ? (
                        <img
                          src={drawerReport.targetImage}
                          alt=""
                          className="w-16 h-16 rounded-xl object-cover ring-1 ring-slate-200 shrink-0"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-xl bg-slate-200 flex items-center justify-center text-slate-500 shrink-0">
                          <Building2 size={24} />
                        </div>
                      )}
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge tone="blue">{TARGET_TYPE_LABELS[drawerReport.targetType] || drawerReport.targetType}</Badge>
                          <span className="text-slate-500 font-medium">{drawerReport.province}</span>
                        </div>
                        <h4 className="font-bold text-slate-900 text-sm">{drawerReport.targetTitle}</h4>
                        {drawerReport.targetSubtitle && (
                          <p className="text-slate-500 text-[11px]">{drawerReport.targetSubtitle}</p>
                        )}
                      </div>
                    </div>

                    {/* Nội dung chi tiết nếu là review / comment */}
                    {drawerReport.targetContent && (
                      <div className="p-3 bg-white rounded-lg border border-slate-200 text-slate-800 space-y-1">
                        <span className="text-[10px] text-slate-400 font-bold uppercase">Nội dung hiển thị gốc:</span>
                        <p className="italic leading-relaxed font-medium">"{drawerReport.targetContent}"</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* 2. Chi tiết phản ánh & Bằng chứng */}
                <div className="space-y-2">
                  <span className="font-bold text-[11px] text-slate-400 uppercase tracking-wider block">
                    2. Nội dung người dùng phản ánh &amp; Chứng cứ
                  </span>
                  <div className="p-4 rounded-xl bg-rose-50/40 border border-rose-200/80 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img
                          src={drawerReport.reporterAvatar}
                          alt=""
                          className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200"
                        />
                        <div>
                          <strong className="text-slate-900 font-bold block leading-tight">{drawerReport.reporterName}</strong>
                          <span className="text-[10px] text-slate-500">Tín nhiệm: {drawerReport.reporterReputation}đ</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Độ chính xác: {drawerReport.reporterAccuracyRate}%
                      </span>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-rose-700 uppercase">Hành vi vi phạm:</span>
                      <div className="font-bold text-slate-900 text-xs">
                        {drawerReport.reportReasonCategory || drawerReport.reportTypeName}
                      </div>
                      <p className="text-slate-700 bg-white p-3 rounded-lg border border-rose-200 text-xs leading-relaxed">
                        "{drawerReport.reportNote || drawerReport.reasonDescription || "Người dùng không ghi chú thêm."}"
                      </p>
                    </div>

                    {drawerReport.evidenceImg && (
                      <div className="space-y-1 pt-1">
                        <span className="text-[10px] text-slate-500 font-bold uppercase">Ảnh chụp bằng chứng đính kèm:</span>
                        <img
                          src={drawerReport.evidenceImg}
                          alt="Bằng chứng"
                          className="w-full h-40 rounded-lg object-cover border border-slate-200"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* CỘT PHẢI (5/12): Quyết định & Hành động thi hành */}
              <div className="lg:col-span-5 p-6 space-y-4 bg-slate-50/60 text-xs flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="border-b border-slate-200 pb-2">
                    <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider">
                      3. Quyết định kiểm duyệt
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">Lựa chọn chế tài xử lý hoặc bác bỏ phản ánh</p>
                  </div>

                  {/* Hành động khả dụng */}
                  <div className="space-y-2">
                    <label className="font-bold text-slate-700 block">Hành động áp dụng:</label>
                    <div className="space-y-2">
                      <label className="flex items-start gap-2 p-2.5 rounded-xl border border-slate-200 bg-white cursor-pointer hover:border-rose-300">
                        <input type="radio" name="actionDecision" defaultChecked className="mt-0.5 text-rose-600" />
                        <div>
                          <strong className="block font-bold text-slate-900">Ẩn &amp; Khóa nội dung vi phạm</strong>
                          <span className="text-[10px] text-slate-500">Tạm ẩn khỏi trang khách và ghi nhận vi phạm tác giả</span>
                        </div>
                      </label>

                      <label className="flex items-start gap-2 p-2.5 rounded-xl border border-slate-200 bg-white cursor-pointer hover:border-amber-300">
                        <input type="radio" name="actionDecision" className="mt-0.5 text-amber-600" />
                        <div>
                          <strong className="block font-bold text-slate-900">Yêu cầu hiệu chỉnh thông tin</strong>
                          <span className="text-[10px] text-slate-500">Gửi thông báo yêu cầu chủ cơ sở cập nhật lại</span>
                        </div>
                      </label>

                      <label className="flex items-start gap-2 p-2.5 rounded-xl border border-slate-200 bg-white cursor-pointer hover:border-slate-300">
                        <input type="radio" name="actionDecision" className="mt-0.5 text-slate-600" />
                        <div>
                          <strong className="block font-bold text-slate-900">Bác bỏ báo cáo (Không vi phạm)</strong>
                          <span className="text-[10px] text-slate-500">Nội dung hợp lệ hoặc báo cáo quấy rối/không đúng sự thật</span>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Ghi chú xử lý */}
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 block">Ghi chú xử lý (Lưu vào Audit Trail):</label>
                    <textarea
                      rows={3}
                      defaultValue="Đã xác minh nội dung vi phạm tiêu chuẩn cộng đồng. Tiến hành ẩn và gửi thông báo kết quả."
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs outline-none focus:border-emerald-600"
                    />
                  </div>

                  {/* Tùy chọn tự động */}
                  <div className="space-y-1.5 pt-1">
                    <label className="flex items-center gap-2 text-[11px] text-slate-600 cursor-pointer font-medium">
                      <input type="checkbox" defaultChecked className="rounded text-emerald-600" />
                      <span>Gửi thông báo kết quả xử lý cho {drawerReport.reporterName}</span>
                    </label>
                    <label className="flex items-center gap-2 text-[11px] text-slate-600 cursor-pointer font-medium">
                      <input type="checkbox" defaultChecked className="rounded text-emerald-600" />
                      <span>Tự động đóng các báo cáo trùng lặp về cùng đối tượng này</span>
                    </label>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200">
                  <button
                    onClick={() => setDrawerReport(null)}
                    className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-600 font-bold hover:bg-slate-50"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={() => handleResolve("Ẩn và xử lý vi phạm")}
                    className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold shadow-xs flex items-center gap-1.5"
                  >
                    <Check size={14} />
                    <span>Xác nhận thi hành</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
