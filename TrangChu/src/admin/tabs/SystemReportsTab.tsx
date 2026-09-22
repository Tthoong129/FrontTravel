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
      {/* ── HEADER CARD ── */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center font-bold">
              <ShieldAlert size={16} />
            </div>
            <h2 className="font-bold text-base text-slate-900 tracking-tight">
              Báo cáo vi phạm &amp; Khiếu nại (Reports &amp; Moderation)
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Tổng hợp và điều phối xử lý vi phạm địa điểm, đánh giá, bình luận, bài viết toàn hệ thống.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowReportTypes(!showReportTypes)}
            className="px-3.5 py-2 rounded-xl border border-slate-200 hover:border-slate-300 bg-white text-slate-700 text-xs font-semibold shadow-xs flex items-center gap-1.5 transition cursor-pointer"
          >
            <BarChart3 size={14} />
            <span>Loại vi phạm ({Object.keys(DB_STANDARD_REPORT_TYPES).length})</span>
          </button>
          <button
            onClick={() => showToast("Đã xuất báo cáo vi phạm dạng CSV.")}
            className="px-4 py-2 rounded-xl bg-[#063f38] hover:bg-[#084f47] text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition cursor-pointer"
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
              ? "border-[#063f38] bg-[#063f38]/5 text-[#063f38]"
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
                  className="rounded text-[#063f38]"
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
                        className="rounded text-[#063f38]"
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

      {/* ── MODAL XỬ LÝ REPORT ── */}
      {drawerReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-xl bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-8">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="font-bold text-base text-slate-900">
                  Xử lý vi phạm: {drawerReport.codeId || `#${drawerReport.id}`}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Báo cáo gửi bởi {drawerReport.reporterName} ({drawerReport.createdAt})
                </p>
              </div>
              <button onClick={() => setDrawerReport(null)} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100">
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="font-bold text-slate-800 text-sm">{drawerReport.targetTitle}</div>
                <div className="flex items-center gap-2 text-[11px] text-slate-500">
                  <Badge tone="blue">{TARGET_TYPE_LABELS[drawerReport.targetType]}</Badge>
                  <span>Khu vực: {drawerReport.province}</span>
                </div>
                {drawerReport.targetContent && (
                  <p className="text-slate-700 bg-white p-3 rounded-lg border border-slate-200 italic mt-2">
                    "{drawerReport.targetContent}"
                  </p>
                )}
              </div>

              <div>
                <span className="font-bold text-slate-800 block mb-1">Lý do người dùng báo cáo:</span>
                <p className="text-slate-700 bg-rose-50/60 p-3 rounded-xl border border-rose-200/80">
                  <strong>{drawerReport.reportReasonCategory || drawerReport.reportTypeName}:</strong> {drawerReport.reportNote || "Không có ghi chú thêm."}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => handleResolve("Ẩn nội dung vi phạm")}
                  className="py-2.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs transition cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <XCircle size={14} />
                  <span>Ẩn &amp; Khóa nội dung</span>
                </button>
                <button
                  onClick={() => handleResolve("Bác bỏ báo cáo")}
                  className="py-2.5 px-3 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold text-xs transition cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 size={14} />
                  <span>Bác bỏ (Nội dung hợp lệ)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
