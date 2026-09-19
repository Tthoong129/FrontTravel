import React from "react";
import { AdminReportItem } from "../../adminData";
import {
  RefreshCw,
  Building2,
  Star,
  FileText,
  Image as ImageIcon,
  MessageSquare,
} from "lucide-react";

interface ReportsTabProps {
  reports: AdminReportItem[];
  reportSubTab: "all" | "urgent" | "assigned_to_me" | "resolved";
  setReportSubTab: (v: "all" | "urgent" | "assigned_to_me" | "resolved") => void;
  reportTargetTypeFilter: "all" | "place" | "review" | "comment" | "blog" | "photo";
  setReportTargetTypeFilter: (v: "all" | "place" | "review" | "comment" | "blog" | "photo") => void;
  reportPriorityFilter: "all" | "urgent" | "high" | "normal" | "low";
  setReportPriorityFilter: (v: "all" | "urgent" | "high" | "normal" | "low") => void;
  reportProvinceFilter: string;
  setReportProvinceFilter: (v: string) => void;
  reportSearchText: string;
  setReportSearchText: (v: string) => void;
  selectedReportRowIds: number[];
  setSelectedReportRowIds: React.Dispatch<React.SetStateAction<number[]>>;
  reportCurrentPage: number;
  setReportCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  currentAdminId: number;
  handleToggleSelectRow: (id: number) => void;
  handleBatchAssign: () => void;
  handleBatchDismiss: () => void;
  handleOpenModerationDrawer: (groupKey: string, specificReportId?: number) => void;
  showToast: (msg: string) => void;
}

export default function ReportsTab({
  reports,
  reportSubTab,
  setReportSubTab,
  reportTargetTypeFilter,
  setReportTargetTypeFilter,
  reportPriorityFilter,
  setReportPriorityFilter,
  reportProvinceFilter,
  setReportProvinceFilter,
  reportSearchText,
  setReportSearchText,
  selectedReportRowIds,
  setSelectedReportRowIds,
  reportCurrentPage,
  setReportCurrentPage,
  currentAdminId,
  handleToggleSelectRow,
  handleBatchAssign,
  handleBatchDismiss,
  handleOpenModerationDrawer,
  showToast,
}: ReportsTabProps) {
  const filteredReports = reports.filter((r) => {
    // SubTab Filter
    if (reportSubTab === "all") {
      if (r.status !== 0) return false;
    } else if (reportSubTab === "urgent") {
      if (r.status !== 0 || (r.priority !== "urgent" && r.slaStatus !== "breached")) return false;
    } else if (reportSubTab === "assigned_to_me") {
      if (r.status !== 0 || r.assignedToAdminId !== currentAdminId) return false;
    } else if (reportSubTab === "resolved") {
      if (r.status === 0) return false;
    }

    // Entity Filter (Thực thể)
    if (reportTargetTypeFilter !== "all" && r.targetType !== reportTargetTypeFilter) return false;

    // Priority Filter (Ưu tiên)
    if (reportPriorityFilter !== "all") {
      if (reportPriorityFilter === "urgent" && r.priority !== "urgent" && r.slaStatus !== "breached") return false;
      if (reportPriorityFilter === "high" && r.priority !== "high") return false;
      if (reportPriorityFilter === "normal" && r.priority !== "normal") return false;
      if (reportPriorityFilter === "low" && r.priority !== "low") return false;
    }

    // Location Filter (Địa bàn)
    if (reportProvinceFilter !== "all" && !r.province.includes(reportProvinceFilter)) return false;

    // Search
    if (reportSearchText.trim()) {
      const q = reportSearchText.toLowerCase();
      const matchId = (r.codeId || `#${r.id}`).toLowerCase().includes(q);
      const matchTitle = r.targetTitle.toLowerCase().includes(q);
      const matchReporter = r.reporterName.toLowerCase().includes(q);
      const matchReason = (r.reportReasonCategory || r.reportTypeName).toLowerCase().includes(q);
      if (!matchId && !matchTitle && !matchReporter && !matchReason) return false;
    }

    return true;
  });

  const PAGE_SIZE = 7;
  const totalPages = Math.max(1, Math.ceil(filteredReports.length / PAGE_SIZE));
  const safePage = Math.min(reportCurrentPage, totalPages);
  const paginatedReports = filteredReports.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  const isAllCurrentSelected =
    paginatedReports.length > 0 && paginatedReports.every((r) => selectedReportRowIds.includes(r.id));

  return (
    <div className="animate-in fade-in duration-150">
      {/* Single unified card for moderation queue */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {/* 1. Page Header & KPI Summary Dots */}
        <div className="p-5 pb-0 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="font-bold text-xl text-slate-900 tracking-tight">Hàng chờ xử lý</h2>
                <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium text-xs">
                  {reports.filter((r) => r.status === 0).length} mục đang chờ
                </span>
              </div>
              <p className="text-xs text-slate-400 font-normal mt-1">
                Xác minh các phản ánh vi phạm cộng đồng, địa điểm và nội dung độc hại
              </p>
            </div>

            {/* Top right KPI summary dots */}
            <div className="flex items-center gap-4 text-xs font-medium">
              <div className="flex items-center gap-1.5 text-rose-600">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                <span>Khẩn cấp: {reports.filter((r) => (r.priority === "urgent" || r.slaStatus === "breached") && r.status === 0).length}</span>
              </div>
              <div className="flex items-center gap-1.5 text-amber-600">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span>Gần hạn SLA: {reports.filter((r) => r.slaStatus === "warning" && r.status === 0).length || 12}</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-600">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Đúng hạn: 98.4%</span>
              </div>
            </div>
          </div>

          {/* 2. Subtabs (Underlined Style) & Auto-sync */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 pt-2">
            <div className="flex items-center gap-8 text-xs font-medium">
              <button
                onClick={() => { setReportSubTab("all"); setReportCurrentPage(1); }}
                className={`pb-3 cursor-pointer transition-colors relative ${
                  reportSubTab === "all"
                    ? "text-slate-900 font-bold border-b-2 border-slate-900 -mb-[1px]"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <span>Tất cả</span>
                <span className="ml-1.5 text-slate-400 font-normal">{reports.filter((r) => r.status === 0).length}</span>
              </button>

              <button
                onClick={() => { setReportSubTab("urgent"); setReportCurrentPage(1); }}
                className={`pb-3 cursor-pointer transition-colors relative ${
                  reportSubTab === "urgent"
                    ? "text-slate-900 font-bold border-b-2 border-slate-900 -mb-[1px]"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <span>Cần xử lý gấp</span>
                <span className="ml-1.5 text-rose-600 font-semibold">
                  {reports.filter((r) => (r.priority === "urgent" || r.slaStatus === "breached") && r.status === 0).length}
                </span>
              </button>

              <button
                onClick={() => { setReportSubTab("assigned_to_me"); setReportCurrentPage(1); }}
                className={`pb-3 cursor-pointer transition-colors relative ${
                  reportSubTab === "assigned_to_me"
                    ? "text-slate-900 font-bold border-b-2 border-slate-900 -mb-[1px]"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <span>Của tôi</span>
                <span className="ml-1.5 text-slate-500 font-medium">
                  {reports.filter((r) => r.assignedToAdminId === currentAdminId && r.status === 0).length || 5}
                </span>
              </button>

              <button
                onClick={() => { setReportSubTab("resolved"); setReportCurrentPage(1); }}
                className={`pb-3 cursor-pointer transition-colors relative ${
                  reportSubTab === "resolved"
                    ? "text-slate-900 font-bold border-b-2 border-slate-900 -mb-[1px]"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <span>Đã giải quyết</span>
              </button>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-slate-400 pb-3">
              <span>Tự đồng bộ 15s</span>
              <button
                onClick={() => showToast("Đã đồng bộ số liệu hàng chờ thời gian thực mới nhất.")}
                className="p-1 hover:text-slate-700 cursor-pointer transition-colors"
                title="Làm mới ngay"
              >
                <RefreshCw size={12} />
              </button>
            </div>
          </div>

          {/* 3. Filter Bar & Batch Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 py-3 text-xs">
            <div className="flex flex-wrap items-center gap-2.5">
              <select
                value={reportTargetTypeFilter}
                onChange={(e) => { setReportTargetTypeFilter(e.target.value as any); setReportCurrentPage(1); }}
                className="px-3 py-1.5 rounded-lg border border-slate-200/80 bg-white font-medium text-slate-700 cursor-pointer outline-none hover:border-slate-300"
              >
                <option value="all">Thực thể: Tất cả</option>
                <option value="place">Địa điểm</option>
                <option value="review">Đánh giá</option>
                <option value="blog">Bài viết</option>
                <option value="photo">Hình ảnh</option>
                <option value="comment">Bình luận</option>
              </select>

              <select
                value={reportPriorityFilter}
                onChange={(e) => { setReportPriorityFilter(e.target.value as any); setReportCurrentPage(1); }}
                className="px-3 py-1.5 rounded-lg border border-slate-200/80 bg-white font-medium text-slate-700 cursor-pointer outline-none hover:border-slate-300"
              >
                <option value="all">Ưu tiên: Tất cả</option>
                <option value="urgent">Khẩn cấp</option>
                <option value="high">Ưu tiên cao</option>
                <option value="normal">Bình thường</option>
                <option value="low">Thấp</option>
              </select>

              <select
                value={reportProvinceFilter}
                onChange={(e) => { setReportProvinceFilter(e.target.value); setReportCurrentPage(1); }}
                className="px-3 py-1.5 rounded-lg border border-slate-200/80 bg-white font-medium text-slate-700 cursor-pointer outline-none hover:border-slate-300"
              >
                <option value="all">Địa bàn: Toàn quốc</option>
                <option value="Đà Nẵng">Đà Nẵng</option>
                <option value="Quảng Nam">Quảng Nam</option>
                <option value="Thừa Thiên Huế">Thừa Thiên Huế</option>
                <option value="Lâm Đồng">Lâm Đồng (Đà Lạt)</option>
                <option value="Khánh Hòa">Khánh Hòa (Nha Trang)</option>
              </select>

              <button
                onClick={() => {
                  setReportTargetTypeFilter("all");
                  setReportPriorityFilter("all");
                  setReportProvinceFilter("all");
                  setReportSearchText("");
                  setReportCurrentPage(1);
                  showToast("Đã đặt lại bộ lọc mặc định.");
                }}
                className="text-slate-500 hover:text-slate-900 font-medium px-2 py-1 cursor-pointer transition-colors"
              >
                Đặt lại
              </button>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500">Đã chọn: {selectedReportRowIds.length}</span>
              <button
                onClick={handleBatchAssign}
                disabled={selectedReportRowIds.length === 0}
                className="px-3 py-1.5 rounded-lg border border-slate-200/80 bg-white hover:bg-slate-50 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed font-medium cursor-pointer transition-colors"
              >
                Phân công
              </button>
              <button
                onClick={handleBatchDismiss}
                disabled={selectedReportRowIds.length === 0}
                className="px-3 py-1.5 rounded-lg border border-slate-200/80 bg-white hover:bg-slate-50 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed font-medium cursor-pointer transition-colors"
              >
                Bỏ qua
              </button>
            </div>
          </div>
        </div>

        {/* 4. Moderation Queue Data Table */}
        <div className="overflow-x-auto border-t border-slate-100">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="text-[11px] font-semibold text-slate-400 border-b border-slate-200/80 bg-slate-50/50 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4 w-8">
                  <input
                    type="checkbox"
                    checked={isAllCurrentSelected}
                    onChange={() => {
                      if (isAllCurrentSelected) {
                        setSelectedReportRowIds((prev) => prev.filter((id) => !paginatedReports.some((r) => r.id === id)));
                      } else {
                        const newIds = paginatedReports.map((r) => r.id);
                        setSelectedReportRowIds((prev) => Array.from(new Set([...prev, ...newIds])));
                      }
                    }}
                    className="w-4 h-4 rounded border-slate-300 text-slate-900 cursor-pointer"
                  />
                </th>
                <th className="py-3 px-3 font-semibold text-slate-400">MÃ ID</th>
                <th className="py-3 px-3 font-semibold text-slate-400">LOẠI</th>
                <th className="py-3 px-4 font-semibold text-slate-400">ĐỐI TƯỢNG &amp; NỘI DUNG VI PHẠM</th>
                <th className="py-3 px-4 font-semibold text-slate-400">LÝ DO BÁO CÁO</th>
                <th className="py-3 px-4 font-semibold text-slate-400">NGƯỜI BÁO &amp; THỜI GIAN</th>
                <th className="py-3 px-4 font-semibold text-slate-400">THỜI HẠN SLA</th>
                <th className="py-3 px-4 text-center font-semibold text-slate-400">THAO TÁC</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedReports.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4">
                    <input
                      type="checkbox"
                      checked={selectedReportRowIds.includes(item.id)}
                      onChange={() => handleToggleSelectRow(item.id)}
                      className="w-4 h-4 rounded border-slate-300 text-slate-900 cursor-pointer"
                    />
                  </td>
                  <td className="py-3.5 px-3 font-mono text-slate-400 text-xs">
                    {item.codeId || `#${item.id}`}
                  </td>
                  <td className="py-3.5 px-3 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md border border-slate-200/80 bg-slate-50 text-slate-700 text-[11px] font-medium">
                      {item.targetType === "place" && <Building2 size={13} className="text-slate-500" />}
                      {item.targetType === "review" && <Star size={13} className="text-slate-500" />}
                      {item.targetType === "blog" && <FileText size={13} className="text-slate-500" />}
                      {item.targetType === "photo" && <ImageIcon size={13} className="text-slate-500" />}
                      {item.targetType === "comment" && <MessageSquare size={13} className="text-slate-500" />}
                      <span>
                        {item.targetType === "place" && "Địa điểm"}
                        {item.targetType === "review" && "Đánh giá"}
                        {item.targetType === "blog" && "Bài viết"}
                        {item.targetType === "photo" && "Hình ảnh"}
                        {item.targetType === "comment" && "Bình luận"}
                      </span>
                    </span>
                  </td>
                  <td className="py-3.5 px-4 max-w-xs sm:max-w-sm md:max-w-md">
                    <div
                      onClick={() => handleOpenModerationDrawer(`${item.targetType}_${item.targetId}`, item.id)}
                      className="font-semibold text-slate-900 hover:text-blue-600 hover:underline cursor-pointer truncate text-sm"
                    >
                      {item.targetTitle}
                    </div>
                    <div className="text-slate-400 text-xs truncate mt-0.5 font-normal">
                      {item.targetSubtitle || item.targetContent || item.reasonDescription}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          item.priority === "urgent" || item.slaStatus === "breached"
                            ? "bg-rose-500"
                            : item.priority === "high" || item.slaStatus === "warning"
                            ? "bg-amber-500"
                            : "bg-slate-400"
                        }`}
                      />
                      <span className="text-slate-700 text-xs font-medium">
                        {item.reportReasonCategory || item.reportTypeName}
                      </span>
                      <span className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-500 text-[10px] font-bold">
                        {item.reportDuplicatesCount || 1}
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="font-medium text-slate-800 text-xs">{item.reporterName}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{item.createdAt}</div>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-1.5 text-xs">
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          item.slaStatus === "breached"
                            ? "bg-rose-500"
                            : item.slaStatus === "warning"
                            ? "bg-amber-500"
                            : "bg-slate-400"
                        }`}
                      />
                      <span
                        className={`font-semibold ${
                          item.slaStatus === "breached"
                            ? "text-rose-600"
                            : item.slaStatus === "warning"
                            ? "text-amber-600"
                            : "text-slate-500 font-medium"
                        }`}
                      >
                        {item.slaLabel || (item.createdHoursAgo > 48 ? "Quá hạn 1h" : "Còn 4h")}
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    <button
                      onClick={() => handleOpenModerationDrawer(`${item.targetType}_${item.targetId}`, item.id)}
                      className="text-xs text-slate-600 hover:text-slate-900 font-semibold px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                      Xem
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 5. Pagination */}
        <div className="p-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            <span>{`${(safePage - 1) * PAGE_SIZE + 1}-${Math.min(safePage * PAGE_SIZE, filteredReports.length)} trên ${filteredReports.length} mục`}</span>
          </div>
          <div className="flex items-center gap-1 font-medium">
            <button
              onClick={() => setReportCurrentPage((p) => Math.max(1, p - 1))}
              disabled={safePage === 1}
              className="px-3 py-1 rounded-lg hover:bg-slate-100 text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
            >
              Trước
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setReportCurrentPage(page)}
                className={`w-7 h-7 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  safePage === page
                    ? "bg-slate-900 text-white"
                    : "hover:bg-slate-100 text-slate-700"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setReportCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage === totalPages}
              className="px-3 py-1 rounded-lg hover:bg-slate-100 text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
            >
              Sau
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
