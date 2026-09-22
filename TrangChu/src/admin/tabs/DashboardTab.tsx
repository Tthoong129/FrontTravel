import { useMemo } from "react";
import { AlertTriangle, ArrowRight, BarChart3, CheckCircle2, ClipboardCheck, Clock3, Filter, MapPin, MessageSquare, Plus, RefreshCw, ShieldAlert, Users } from "lucide-react";
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

function Metric({ label, value, note, icon: Icon, tone }: { label: string; value: string | number; note: string; icon: typeof Users; tone: string }) {
  return <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"><div className="flex items-center justify-between text-xs font-semibold text-slate-500"><span>{label}</span><span className={`rounded-lg p-2 ${tone}`}><Icon size={16} /></span></div><div className="mt-3 text-2xl font-black tracking-tight text-slate-900">{value}</div><div className="mt-1 text-[11px] text-slate-400">{note}</div></div>;
}

export default function DashboardTab({ currentAdminInfo, places, proposals, reports, reportedReviews, auditLogs = [], dashRegion, setDashRegion, dashProvince, setDashProvince, dashTimeRange, setDashTimeRange, setMainTab, setPlaceFilterStatus, setProposalStatusFilter, setRevComTab, setRevReportFilter, setReportSubTab, setIsAddPlaceModalOpen, showToast }: DashboardTabProps) {
  const pendingPlaces = places.filter((place) => (place as any).statusNum === 0 || place.status === "Chờ duyệt");
  const pendingProposals = proposals.filter((proposal) => proposal.status === 0);
  const pendingReports = reports.filter((report) => report.status === 0);
  const filteredPlaces = useMemo(() => dashProvince === "all" ? places : places.filter((place) => place.province === dashProvince), [dashProvince, places]);
  const approvedPlaces = filteredPlaces.filter((place) => (place as any).statusNum === 1 || place.status === "Đã duyệt").length;
  const hiddenPlaces = filteredPlaces.filter((place) => (place as any).statusNum === 3 || place.status === "Đang ẩn").length;
  const totalQueue = pendingPlaces.length + pendingProposals.length + pendingReports.length + reportedReviews.length;
  const processedThisMonth = currentAdminInfo.stats.approvedThisMonth + currentAdminInfo.stats.rejectedThisMonth;
  const approvalRate = processedThisMonth ? Math.round((currentAdminInfo.stats.approvedThisMonth / processedThisMonth) * 100) : 0;
  const activity = [
    { label: "Địa điểm đã duyệt", value: approvedPlaces, total: filteredPlaces.length, tone: "bg-blue-600", tab: "places" as AdminMainTab },
    { label: "Đề xuất đang chờ", value: pendingProposals.length, total: proposals.length, tone: "bg-amber-500", tab: "proposals" as AdminMainTab },
    { label: "Báo cáo chưa xử lý", value: pendingReports.length, total: reports.length, tone: "bg-rose-500", tab: "reports" as AdminMainTab },
    { label: "Review bị báo cáo", value: reportedReviews.length, total: reportedReviews.length, tone: "bg-slate-700", tab: "reviews_comments" as AdminMainTab },
  ];
  const queue = [
    { label: "Đề xuất đóng góp", count: pendingProposals.length, action: () => { setProposalStatusFilter("0"); setMainTab("proposals"); } },
    { label: "Báo cáo vi phạm", count: pendingReports.length, action: () => { setReportSubTab("pending"); setMainTab("reports"); } },
    { label: "Địa điểm chờ duyệt", count: pendingPlaces.length, action: () => { setPlaceFilterStatus("0"); setMainTab("places"); } },
    { label: "Review bị báo cáo", count: reportedReviews.length, action: () => { setRevComTab("reviews"); setRevReportFilter("reported"); setMainTab("reviews_comments"); } },
  ];

  return <div className="space-y-4 animate-in fade-in duration-150">
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm"><div className="flex flex-wrap items-center gap-2"><div className="flex items-center gap-2 pr-2 text-xs font-bold text-slate-800"><Filter size={15} className="text-slate-400" />Phạm vi</div><select value={dashRegion} onChange={(event) => setDashRegion(event.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 outline-none"><option value="all">Tất cả vùng phụ trách</option><option value="nam_trung_bo">Duyên hải Nam Trung Bộ & Tây Nguyên</option></select><select value={dashProvince} onChange={(event) => setDashProvince(event.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 outline-none"><option value="all">Tất cả tỉnh/thành</option>{currentAdminInfo.assignedProvinces.filter((province) => province !== "Toàn bộ khu vực").map((province) => <option key={province} value={province}>{province}</option>)}</select><select value={dashTimeRange} onChange={(event) => setDashTimeRange(event.target.value as DashboardTabProps["dashTimeRange"])} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 outline-none"><option value="today">Hôm nay</option><option value="7days">7 ngày qua</option><option value="30days">30 ngày qua</option><option value="90days">90 ngày qua</option></select></div><div className="flex gap-2"><button onClick={() => { setDashRegion("all"); setDashProvince("all"); setDashTimeRange("7days"); }} className="rounded-lg px-3 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-50">Đặt lại</button><button onClick={() => showToast("Đã đồng bộ các hàng chờ và nhật ký mới nhất.")} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700"><RefreshCw size={13} />Đồng bộ</button><button onClick={() => setIsAddPlaceModalOpen(true)} className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-3 py-2 text-xs font-bold text-white"><Plus size={13} />Thêm địa điểm</button></div></div>
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"><Metric label="Địa điểm trong phạm vi" value={filteredPlaces.length} note={`${approvedPlaces} đã duyệt · ${hiddenPlaces} đang ẩn`} icon={MapPin} tone="bg-blue-50 text-blue-700" /><Metric label="Việc chờ xử lý" value={totalQueue} note={`${pendingReports.length} báo cáo · ${pendingProposals.length} đề xuất`} icon={ClipboardCheck} tone="bg-amber-50 text-amber-700" /><Metric label="Đã xử lý tháng này" value={processedThisMonth} note={`${approvalRate}% tỷ lệ duyệt`} icon={CheckCircle2} tone="bg-emerald-50 text-emerald-700" /><Metric label="SLA cấu hình" value={`${currentAdminInfo.stats.slaHours}h`} note="Thời gian xử lý trung bình" icon={Clock3} tone="bg-slate-100 text-slate-700" /></div>
    <div className="grid gap-4 xl:grid-cols-[1.35fr_1fr]"><section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"><div className="flex items-center justify-between border-b border-slate-100 px-4 py-3"><div><h2 className="text-sm font-black text-slate-900">Hàng chờ trong phạm vi</h2><p className="mt-1 text-[11px] text-slate-400">Đi thẳng đến màn hình xử lý tương ứng</p></div><ShieldAlert size={17} className="text-amber-500" /></div><div className="divide-y divide-slate-100">{queue.map((item) => <button key={item.label} onClick={item.action} className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-slate-50"><span className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-black ${item.count > 0 ? "bg-rose-50 text-rose-700" : "bg-slate-100 text-slate-500"}`}>{item.count}</span><span className="flex-1 text-xs font-bold text-slate-800">{item.label}<span className="mt-1 block text-[10px] font-normal text-slate-400">{item.count > 0 ? "Cần kiểm tra" : "Không có mục tồn đọng"}</span></span><ArrowRight size={15} className="text-slate-300" /></button>)}</div></section><section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"><div className="flex items-center justify-between"><div><h2 className="text-sm font-black text-slate-900">Phân bổ trạng thái</h2><p className="mt-1 text-[11px] text-slate-400">Theo dữ liệu đang tải trong portal</p></div><BarChart3 size={17} className="text-slate-400" /></div><div className="mt-5 space-y-4">{activity.map((item) => <button key={item.label} onClick={() => setMainTab(item.tab)} className="w-full text-left"><div className="mb-1.5 flex items-center justify-between text-xs"><span className="font-semibold text-slate-700">{item.label}</span><span className="font-black text-slate-900">{item.value}<span className="font-normal text-slate-400"> / {item.total}</span></span></div><div className="h-2 overflow-hidden rounded-full bg-slate-100"><div className={`h-full rounded-full ${item.tone}`} style={{ width: `${item.total ? Math.min(100, (item.value / item.total) * 100) : 0}%` }} /></div></button>)}</div></section></div>
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"><div className="flex items-center justify-between border-b border-slate-100 px-4 py-3"><div><h2 className="text-sm font-black text-slate-900">Hiệu suất kiểm duyệt</h2><p className="mt-1 text-[11px] text-slate-400">Lấy từ thống kê Admin cấp 1 và AdminActionLogs</p></div><button onClick={() => setMainTab("audit_logs")} className="text-xs font-bold text-slate-600 hover:text-slate-900">Mở nhật ký <ArrowRight size={13} className="ml-1 inline" /></button></div><div className="grid gap-3 p-4 sm:grid-cols-3"><div className="flex items-center gap-3 rounded-lg bg-slate-50 p-3"><Users size={16} className="text-slate-500" /><div><div className="text-[11px] text-slate-400">Phạm vi danh mục</div><div className="mt-1 text-sm font-black text-slate-900">{currentAdminInfo.assignedCategories.length} danh mục</div></div></div><div className="flex items-center gap-3 rounded-lg bg-slate-50 p-3"><MessageSquare size={16} className="text-slate-500" /><div><div className="text-[11px] text-slate-400">Nhật ký gần đây</div><div className="mt-1 text-sm font-black text-slate-900">{auditLogs.length} bản ghi</div></div></div><div className="flex items-center gap-3 rounded-lg bg-slate-50 p-3"><CheckCircle2 size={16} className="text-emerald-600" /><div><div className="text-[11px] text-slate-400">Đã duyệt tháng này</div><div className="mt-1 text-sm font-black text-slate-900">{currentAdminInfo.stats.approvedThisMonth}</div></div></div></div></section>
  </div>;
}
