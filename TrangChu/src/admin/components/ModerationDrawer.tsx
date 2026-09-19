import { GroupedReport } from "../types";
import { AdminReportItem } from "../../adminData";
import { X, AlertTriangle, Sparkles, CheckCircle2, ShieldAlert, UserCheck } from "lucide-react";

interface ModerationDrawerProps {
  activeReportGroup: GroupedReport | null;
  selectedReportInDrawer: AdminReportItem | null;
  setSelectedReportIdInDrawer: (id: number) => void;
  drawerDecisionTab: "accept" | "dismiss";
  setDrawerDecisionTab: (tab: "accept" | "dismiss") => void;
  drawerActionTaken: string;
  setDrawerActionTaken: (action: string) => void;
  drawerResolutionNote: string;
  setDrawerResolutionNote: (note: string) => void;
  drawerDismissReason: string;
  setDrawerDismissReason: (reason: string) => void;
  drawerAutoCloseDuplicates: boolean;
  setDrawerAutoCloseDuplicates: (v: boolean) => void;
  drawerAutoNotifyReporters: boolean;
  setDrawerAutoNotifyReporters: (v: boolean) => void;
  drawerAutoRecalculateRating: boolean;
  setDrawerAutoRecalculateRating: (v: boolean) => void;
  handleConfirmDrawerResolution: () => void;
  handleAssignToMe: (groupKey: string) => void;
  onClose: () => void;
}

export default function ModerationDrawer({
  activeReportGroup,
  selectedReportInDrawer,
  setSelectedReportIdInDrawer,
  drawerDecisionTab,
  setDrawerDecisionTab,
  drawerActionTaken,
  setDrawerActionTaken,
  drawerResolutionNote,
  setDrawerResolutionNote,
  drawerDismissReason,
  setDrawerDismissReason,
  drawerAutoCloseDuplicates,
  setDrawerAutoCloseDuplicates,
  drawerAutoNotifyReporters,
  setDrawerAutoNotifyReporters,
  drawerAutoRecalculateRating,
  setDrawerAutoRecalculateRating,
  handleConfirmDrawerResolution,
  handleAssignToMe,
  onClose,
}: ModerationDrawerProps) {
  if (!activeReportGroup) return null;

  const currentReport = selectedReportInDrawer || activeReportGroup.reportsList[0];

  return (
    <div className="fixed inset-0 bg-slate-950/45 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 z-50 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl w-full max-w-5xl max-h-[88vh] shadow-2xl border border-slate-200/90 flex flex-col overflow-hidden text-xs">
        {/* Header */}
        <div className="p-4 px-6 bg-white border-b border-slate-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2 text-[11px] font-medium text-slate-500">
                <span>Kiểm duyệt phản ánh</span>
                <span className="text-slate-300">•</span>
                <span className="font-mono text-slate-500">#{activeReportGroup.targetId}</span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-700 font-semibold">
                  {activeReportGroup.targetType === "place" && "Địa điểm"}
                  {activeReportGroup.targetType === "review" && "Đánh giá"}
                  {activeReportGroup.targetType === "blog" && "Bài viết"}
                  {activeReportGroup.targetType === "photo" && "Hình ảnh"}
                  {activeReportGroup.targetType === "comment" && "Bình luận"}
                </span>
                <span className="text-slate-300">•</span>
                <span
                  className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                    activeReportGroup.highestPriority === "urgent"
                      ? "bg-rose-50 text-rose-700 border border-rose-200"
                      : activeReportGroup.highestPriority === "high"
                      ? "bg-amber-50 text-amber-700 border border-amber-200"
                      : "bg-slate-100 text-slate-700 border border-slate-200"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      activeReportGroup.highestPriority === "urgent"
                        ? "bg-rose-500"
                        : activeReportGroup.highestPriority === "high"
                        ? "bg-amber-500"
                        : "bg-slate-400"
                    }`}
                  />
                  {activeReportGroup.highestPriority === "urgent"
                    ? "Khẩn cấp"
                    : activeReportGroup.highestPriority === "high"
                    ? "Ưu tiên cao"
                    : "Bình thường"}
                </span>
              </div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                {activeReportGroup.targetTitle}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {activeReportGroup.assignedAdminName ? (
              <div className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200/80 text-slate-700 font-medium text-xs flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Phụ trách: {activeReportGroup.assignedAdminName}</span>
              </div>
            ) : (
              <button
                onClick={() => handleAssignToMe(activeReportGroup.groupKey)}
                className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium cursor-pointer transition-colors"
              >
                Nhận xử lý
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Đóng cửa sổ"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Natural 2-Column Inspection & Action Workspace */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
          {/* LEFT COLUMN (7/12 = ~58%): Target context & Evidence */}
          <div className="lg:col-span-7 p-6 overflow-y-auto space-y-5 bg-white">
            {/* 1. Target Entity Being Reported */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-xs text-slate-900 tracking-tight uppercase tracking-wider">
                  Đối tượng bị phản ánh
                </span>
                <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                  {activeReportGroup.category}
                </span>
              </div>

              <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/40 space-y-3">
                {activeReportGroup.targetImage && (
                  <img
                    src={activeReportGroup.targetImage}
                    alt=""
                    className="w-full h-44 rounded-lg object-cover border border-slate-200/60"
                  />
                )}

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm text-slate-900">{activeReportGroup.targetTitle}</h4>
                    {activeReportGroup.targetRating && (
                      <span className="px-2 py-0.5 rounded-md bg-amber-500 text-white font-bold text-[11px]">
                        ★ {activeReportGroup.targetRating}
                      </span>
                    )}
                  </div>
                  {activeReportGroup.targetSubtitle && (
                    <p className="text-slate-500 text-xs">{activeReportGroup.targetSubtitle}</p>
                  )}
                </div>

                {/* If there is user content (review / comment text) */}
                {activeReportGroup.targetContent && (
                  <div className="p-3 bg-white rounded-lg border border-slate-200/80 text-slate-700 text-xs leading-relaxed space-y-1">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                      Nội dung chi tiết bị phản ánh:
                    </span>
                    <p className="font-medium text-slate-800">{activeReportGroup.targetContent}</p>
                  </div>
                )}

                {/* Status metadata */}
                <div className="pt-2 border-t border-slate-200/70 flex items-center justify-between text-[11px]">
                  <div>
                    <span className="text-slate-400">Địa bàn: </span>
                    <span className="font-semibold text-slate-800">{activeReportGroup.province}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-600 font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>Đang hoạt động trên hệ thống</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Reporter Claims & Evidence */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-xs text-slate-900 tracking-tight uppercase tracking-wider">
                    Phản ánh từ cộng đồng
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold">
                    {activeReportGroup.reportsCount} báo cáo
                  </span>
                </div>
                {activeReportGroup.reportsCount > 1 && (
                  <div className="flex items-center gap-1">
                    {activeReportGroup.reportsList.map((rep, idx) => (
                      <button
                        key={rep.id}
                        onClick={() => setSelectedReportIdInDrawer(rep.id)}
                        className={`w-5 h-5 rounded text-[10px] font-bold cursor-pointer transition-colors ${
                          currentReport?.id === rep.id
                            ? "bg-slate-900 text-white"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        {idx + 1}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {currentReport && (
                <div className="p-4 rounded-xl border border-slate-200/80 bg-white space-y-3 shadow-2xs">
                  {/* Reporter header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={currentReport.reporterAvatar}
                        alt={currentReport.reporterName}
                        className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200"
                      />
                      <div>
                        <span className="font-semibold text-slate-900 block leading-tight">
                          {currentReport.reporterName}
                        </span>
                        <span className="text-[10px] text-slate-400 font-normal">
                          Điểm uy tín: {currentReport.reporterReputation} • {currentReport.createdAt}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                        currentReport.reporterAccuracyRate >= 80
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-amber-50 text-amber-700 border border-amber-200"
                      }`}
                    >
                      Độ chính xác: {currentReport.reporterAccuracyRate}%
                    </span>
                  </div>

                  {/* Violation tag */}
                  <div>
                    <span className="inline-block px-2.5 py-1 rounded-md bg-rose-50 text-rose-700 border border-rose-200/70 text-xs font-semibold">
                      {currentReport.reportTypeName}
                    </span>
                  </div>

                  {/* Description quote */}
                  <div className="p-3 bg-slate-50/80 rounded-lg border border-slate-100/90 text-slate-700 leading-relaxed font-normal text-xs">
                    "{currentReport.reasonDescription}"
                  </div>

                  {/* Evidence attachment */}
                  {currentReport.evidenceImg && (
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[11px] text-slate-400 block font-medium">Hình ảnh xác thực kèm theo:</span>
                      <img
                        src={currentReport.evidenceImg}
                        alt="Bằng chứng"
                        className="w-full h-36 rounded-lg object-cover border border-slate-200"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 3. Entity History Check */}
            <div className="p-3.5 rounded-xl border border-slate-200/70 bg-slate-50/30 flex items-center justify-between">
              <div>
                <span className="font-semibold text-slate-800 text-xs block">Lịch sử vi phạm đối tượng:</span>
                <span className="text-slate-400 text-[11px]">Chưa từng có ghi nhận vi phạm tiêu chuẩn trong 90 ngày qua</span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200/70 text-slate-700">
                0 vi phạm xác nhận
              </span>
            </div>
          </div>

          {/* RIGHT COLUMN (5/12 = ~42%): Resolution Console */}
          <div className="lg:col-span-5 p-6 overflow-y-auto space-y-4 bg-slate-50/30 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                <h3 className="font-semibold text-xs text-slate-900 tracking-tight uppercase tracking-wider">
                  Quyết định kiểm duyệt
                </h3>
                <span className="text-[11px] text-slate-400">Thi hành quyết định</span>
              </div>

              {/* Segmented Mode Control */}
              <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 rounded-xl">
                <button
                  onClick={() => setDrawerDecisionTab("accept")}
                  className={`py-2 rounded-lg font-semibold text-xs transition-all cursor-pointer ${
                    drawerDecisionTab === "accept"
                      ? "bg-white text-slate-900 shadow-xs"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  Xác nhận vi phạm
                </button>
                <button
                  onClick={() => setDrawerDecisionTab("dismiss")}
                  className={`py-2 rounded-lg font-semibold text-xs transition-all cursor-pointer ${
                    drawerDecisionTab === "dismiss"
                      ? "bg-white text-slate-900 shadow-xs"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  Bác bỏ báo cáo
                </button>
              </div>

              {/* Recommendation Note */}
              <div className="p-3 bg-amber-50/70 border border-amber-200/70 rounded-xl space-y-1">
                <span className="font-semibold text-[11px] text-amber-800 flex items-center gap-1.5">
                  <Sparkles size={13} className="text-amber-600" />
                  <span>Khuyến nghị xử lý:</span>
                </span>
                <p className="text-amber-700 text-[11px] leading-relaxed">
                  {currentReport?.reportTypeCode === "PLACE_CLOSED"
                    ? "Cơ sở được báo ngừng kinh doanh. Khuyến nghị tạm ẩn khỏi bản đồ để bảo vệ trải nghiệm người dùng."
                    : currentReport?.reportTypeCode === "CONTENT_OFFENSIVE" || currentReport?.reportTypeCode === "CONTENT_SPAM"
                    ? "Nội dung phản ánh kích động/quảng cáo. Khuyến nghị ẩn nội dung và gửi cảnh báo tới tài khoản đăng tải."
                    : "Kiểm tra thực tế và áp dụng biện pháp phù hợp theo quy định cộng đồng."}
                </p>
              </div>

              {/* Form depending on Decision Tab */}
              {drawerDecisionTab === "accept" ? (
                <div className="space-y-3.5">
                  <div>
                    <label className="font-medium text-slate-700 block mb-1 text-xs">
                      Biện pháp thi hành:
                    </label>
                    <select
                      value={drawerActionTaken}
                      onChange={(e) => setDrawerActionTaken(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-medium text-slate-800 outline-none hover:border-slate-300 focus:border-slate-400 transition-colors"
                    >
                      <option value="hide_target">
                        {activeReportGroup.targetType === "place"
                          ? "Tạm ẩn địa điểm khỏi hệ thống ứng dụng"
                          : "Ẩn nội dung vi phạm tiêu chuẩn"}
                      </option>
                      <option value="edit_place">Mở form hiệu chỉnh thông tin chuẩn</option>
                      <option value="penalize_author">Ghi nhận vi phạm &amp; trừ 50 điểm uy tín</option>
                      <option value="remove_media">Gỡ bỏ hình ảnh vi phạm</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-medium text-slate-700 block mb-1 text-xs">Ghi chú xử lý:</label>
                    <textarea
                      value={drawerResolutionNote}
                      onChange={(e) => setDrawerResolutionNote(e.target.value)}
                      placeholder="Nhập ghi chú xử lý cụ thể..."
                      rows={3}
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-normal text-slate-800 outline-none hover:border-slate-300 focus:border-slate-400 transition-colors resize-none"
                    />
                  </div>

                  {/* Automation Checkboxes */}
                  <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                    <label className="flex items-center gap-2 text-slate-600 hover:text-slate-900 cursor-pointer font-normal">
                      <input
                        type="checkbox"
                        checked={drawerAutoCloseDuplicates}
                        onChange={(e) => setDrawerAutoCloseDuplicates(e.target.checked)}
                        className="w-4 h-4 rounded border-slate-300 text-slate-900 cursor-pointer accent-slate-900"
                      />
                      <span>Đóng tất cả {activeReportGroup.reportsCount} phản ánh cùng đối tượng này</span>
                    </label>

                    <label className="flex items-center gap-2 text-slate-600 hover:text-slate-900 cursor-pointer font-normal">
                      <input
                        type="checkbox"
                        checked={drawerAutoNotifyReporters}
                        onChange={(e) => setDrawerAutoNotifyReporters(e.target.checked)}
                        className="w-4 h-4 rounded border-slate-300 text-slate-900 cursor-pointer accent-slate-900"
                      />
                      <span>Gửi thông báo kết quả xử lý cho người gửi phản ánh</span>
                    </label>
                  </div>
                </div>
              ) : (
                <div className="space-y-3.5">
                  <div>
                    <label className="font-medium text-slate-700 block mb-1 text-xs">
                      Lý do bác bỏ:
                    </label>
                    <select
                      value={drawerDismissReason}
                      onChange={(e) => setDrawerDismissReason(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-medium text-slate-800 outline-none hover:border-slate-300 focus:border-slate-400 transition-colors"
                    >
                      <option value="Không vi phạm tiêu chuẩn cộng đồng">Không vi phạm tiêu chuẩn cộng đồng</option>
                      <option value="Báo cáo sai thực tế (Quán vẫn mở cửa / Giá chuẩn)">Báo cáo không đúng thực tế</option>
                      <option value="Đã được kiểm tra và xử lý trước đó">Đã được kiểm tra và xử lý trước đó</option>
                      <option value="Tài khoản cố tình spam / dìm hàng đối thủ">Spam báo cáo / Cố tình lạm dụng</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-medium text-slate-700 block mb-1 text-xs">Giải trình cho người báo:</label>
                    <textarea
                      value={drawerResolutionNote}
                      onChange={(e) => setDrawerResolutionNote(e.target.value)}
                      placeholder="Nhập lý do bác bỏ gửi đến người phản ánh..."
                      rows={3}
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-normal text-slate-800 outline-none hover:border-slate-300 focus:border-slate-400 transition-colors resize-none"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Confirm button */}
            <div className="pt-4 border-t border-slate-100">
              <button
                onClick={handleConfirmDrawerResolution}
                className={`w-full py-2.5 rounded-xl font-semibold text-xs text-white transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  drawerDecisionTab === "accept"
                    ? "bg-slate-900 hover:bg-slate-800 shadow-xs"
                    : "bg-rose-600 hover:bg-rose-700 shadow-xs"
                }`}
              >
                <span>
                  {drawerDecisionTab === "accept"
                    ? `Xác nhận xử lý vi phạm (${activeReportGroup.reportsCount} báo cáo)`
                    : `Bác bỏ phản ánh này`}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
