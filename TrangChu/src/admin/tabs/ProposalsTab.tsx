import React, { useState } from "react";
import { AdminProposalItem } from "../../adminData";
import {
  ClipboardCheck,
  Check,
  X,
  Clock,
  User,
  MapPin,
  Eye,
  ArrowRight,
  Sparkles,
  DollarSign,
  Phone,
  Image as ImageIcon,
  CheckCircle2,
  XCircle,
  Filter,
  ShieldCheck,
} from "lucide-react";

interface ProposalsTabProps {
  proposals: AdminProposalItem[];
  proposalStatusFilter: "all" | "0" | "1" | "2";
  setProposalStatusFilter: (status: "all" | "0" | "1" | "2") => void;
  setProposals: React.Dispatch<React.SetStateAction<AdminProposalItem[]>>;
  addAuditLog: (
    action: string,
    targetName: string,
    details: string,
    type: "approve" | "reject" | "resolve" | "hide"
  ) => void;
  showToast: (msg: string) => void;
}

export default function ProposalsTab({
  proposals,
  proposalStatusFilter,
  setProposalStatusFilter,
  setProposals,
  addAuditLog,
  showToast,
}: ProposalsTabProps) {
  // Diff Modal State
  const [selectedProposalForDiff, setSelectedProposalForDiff] = useState<AdminProposalItem | null>(null);
  const [proposalTypeFilter, setProposalTypeFilter] = useState<"all" | "NEW_PLACE" | "UPDATE_INFO">("all");
  const [rejectReason, setRejectReason] = useState("");
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectingProposalId, setRejectingProposalId] = useState<number | null>(null);

  const filteredProposals = proposals.filter((prop) => {
    if (proposalStatusFilter !== "all" && String(prop.status) !== proposalStatusFilter) return false;
    if (proposalTypeFilter !== "all" && prop.type !== proposalTypeFilter) return false;
    return true;
  });

  const pendingCount = proposals.filter((p) => p.status === 0).length;
  const approvedCount = proposals.filter((p) => p.status === 1).length;
  const rejectedCount = proposals.filter((p) => p.status === 2).length;

  const handleApprove = (prop: AdminProposalItem) => {
    setProposals((prev) =>
      prev.map((p) => (p.id === prop.id ? { ...p, status: 1 } : p))
    );
    addAuditLog(
      "Duyệt đề xuất đóng góp",
      prop.proposedData.name,
      `Chấp nhận đề xuất ${prop.type === "NEW_PLACE" ? "thêm địa điểm mới" : "cập nhật dữ liệu"} từ ${prop.userName}`,
      "approve"
    );
    showToast(`✓ Đã duyệt đề xuất "${prop.proposedData.name}". Dữ liệu đã được đồng bộ vào hệ thống.`);
    setSelectedProposalForDiff(null);
  };

  const handleOpenReject = (propId: number) => {
    setRejectingProposalId(propId);
    setRejectReason("Thông tin chưa chính xác hoặc không đủ bằng chứng xác thực.");
    setIsRejectModalOpen(true);
  };

  const handleConfirmReject = () => {
    if (!rejectingProposalId) return;
    const prop = proposals.find((p) => p.id === rejectingProposalId);
    if (!prop) return;

    setProposals((prev) =>
      prev.map((p) => (p.id === rejectingProposalId ? { ...p, status: 2 } : p))
    );
    addAuditLog(
      "Từ chối đề xuất",
      prop.proposedData.name,
      `Lý do từ chối: ${rejectReason}`,
      "reject"
    );
    showToast(`✕ Đã từ chối đề xuất #${prop.id}. Đã gửi phản hồi đến người dùng.`);
    setIsRejectModalOpen(false);
    setRejectingProposalId(null);
    setSelectedProposalForDiff(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header & Filter Controls */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4 text-xs">
        <div>
          <h2 className="font-bold text-base text-slate-900 tracking-tight flex items-center gap-2">
            <ClipboardCheck className="text-slate-700" size={18} />
            <span>Đề xuất đóng góp từ cộng đồng</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Duyệt thông tin địa điểm mới, cập nhật giá và số hóa dữ liệu từ người dùng
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <div className="flex items-center gap-1 p-1 bg-slate-100/80 rounded-xl">
            {(["all", "0", "1", "2"] as const).map((statusKey) => (
              <button
                key={statusKey}
                onClick={() => setProposalStatusFilter(statusKey)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                  proposalStatusFilter === statusKey
                    ? "bg-white text-slate-900 shadow-xs font-bold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {statusKey === "all" && "Tất cả"}
                {statusKey === "0" && `Chờ duyệt (${pendingCount})`}
                {statusKey === "1" && "Đã duyệt"}
                {statusKey === "2" && "Đã từ chối"}
              </button>
            ))}
          </div>

          {/* Type Filter */}
          <select
            value={proposalTypeFilter}
            onChange={(e) => setProposalTypeFilter(e.target.value as any)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white font-semibold text-slate-700 cursor-pointer outline-none hover:border-slate-300"
          >
            <option value="all">Tất cả phân loại</option>
            <option value="NEW_PLACE">Thêm mới địa điểm</option>
            <option value="UPDATE_INFO">Cập nhật thông tin</option>
          </select>
        </div>
      </div>

      {/* Proposals List */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs divide-y divide-slate-100 text-xs overflow-hidden">
        {filteredProposals.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            Không có đề xuất nào phù hợp với bộ lọc này.
          </div>
        ) : (
          filteredProposals.map((prop) => {
            const isPending = prop.status === 0;
            const isApproved = prop.status === 1;
            const isRejected = prop.status === 2;

            return (
              <div
                key={prop.id}
                className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <img
                    src={prop.proposedData.coverImg}
                    alt=""
                    className="w-16 h-16 rounded-xl object-cover ring-1 ring-slate-200 shrink-0"
                  />
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                          prop.type === "NEW_PLACE"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-sky-50 text-sky-700 border border-sky-200"
                        }`}
                      >
                        {prop.type === "NEW_PLACE" ? "+ Thêm mới quán" : "✏ Cập nhật dữ liệu"}
                      </span>
                      <span className="font-bold text-slate-900 text-sm">
                        {prop.proposedData.name}
                      </span>
                      <span className="text-slate-400 font-medium text-xs flex items-center gap-1">
                        <MapPin size={12} />
                        {prop.province}
                      </span>
                    </div>

                    <p className="text-slate-600 line-clamp-1 max-w-xl">
                      {prop.proposedData.desc || "Đề xuất thông tin cập nhật cho địa điểm du lịch & ẩm thực."}
                    </p>

                    <div className="flex items-center gap-3 text-[11px] text-slate-400 flex-wrap">
                      <span className="flex items-center gap-1 font-medium">
                        <User size={12} className="text-slate-500" />
                        <strong className="text-slate-700">{prop.userName}</strong> (Điểm uy tín: <span className="text-blue-600 font-bold">{prop.userReputation}đ</span>)
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {prop.createdAt}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                  <button
                    onClick={() => setSelectedProposalForDiff(prop)}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                    title="So sánh chi tiết thay đổi"
                  >
                    <Eye size={13} />
                    <span>So sánh Diff</span>
                  </button>

                  {isPending ? (
                    <>
                      <button
                        onClick={() => handleApprove(prop)}
                        className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold cursor-pointer transition-colors flex items-center gap-1 shadow-xs"
                      >
                        <Check size={14} />
                        <span>Duyệt</span>
                      </button>
                      <button
                        onClick={() => handleOpenReject(prop.id)}
                        className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-600 font-bold cursor-pointer transition-colors flex items-center gap-1"
                      >
                        <X size={14} />
                        <span>Từ chối</span>
                      </button>
                    </>
                  ) : (
                    <span
                      className={`px-3 py-1 rounded-lg font-bold text-xs border ${
                        isApproved
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-rose-50 text-rose-700 border-rose-200"
                      }`}
                    >
                      {isApproved ? "✓ Đã phê duyệt" : "✕ Đã từ chối"}
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ─────────────────────────────────────────────────────────────
          DIFF MODAL: SO SÁNH SIDE-BY-SIDE CHI TIẾT
      ───────────────────────────────────────────────────────────── */}
      {selectedProposalForDiff && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-3xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Sparkles size={18} className="text-blue-600" />
                <h3 className="font-bold text-base text-slate-900">
                  So sánh dữ liệu đề xuất (#{selectedProposalForDiff.id})
                </h3>
              </div>
              <button
                onClick={() => setSelectedProposalForDiff(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body: Side-by-side comparison */}
            <div className="p-6 overflow-y-auto space-y-5 text-xs">
              {/* Proposal Meta */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="text-slate-500 font-medium">Người gửi đề xuất: </span>
                  <strong className="text-slate-900">{selectedProposalForDiff.userName}</strong>
                  <span className="text-slate-400 ml-2">({selectedProposalForDiff.createdAt})</span>
                </div>
                <div className="flex items-center gap-1.5 text-blue-700 font-bold bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                  <ShieldCheck size={13} />
                  <span>Điểm tín nhiệm: {selectedProposalForDiff.userReputation}đ</span>
                </div>
              </div>

              {/* Side-by-Side Table */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Cột 1: Dữ liệu hiện tại / Gốc */}
                <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200 space-y-3">
                  <div className="font-bold text-slate-500 uppercase tracking-wider text-[11px] pb-1 border-b border-slate-200">
                    Dữ liệu hiện tại trên hệ thống
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold block">Tên địa điểm:</span>
                    <span className="font-bold text-slate-700">
                      {selectedProposalForDiff.originalData?.name || "— Chưa có (Địa điểm mới) —"}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold block">Khoảng giá niêm yết:</span>
                    <span className="text-slate-700">
                      {selectedProposalForDiff.originalData?.price || "— Chưa có —"}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold block">Khung giờ mở cửa:</span>
                    <span className="text-slate-700">
                      {selectedProposalForDiff.originalData?.hours || "— Chưa có —"}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold block">Mô tả tóm tắt:</span>
                    <p className="text-slate-500 line-clamp-3">
                      {selectedProposalForDiff.originalData?.desc || "— Chưa có mô tả trước đó —"}
                    </p>
                  </div>
                </div>

                {/* Cột 2: Dữ liệu đề xuất mới */}
                <div className="bg-emerald-50/40 p-4 rounded-xl border border-emerald-200 space-y-3">
                  <div className="font-bold text-emerald-800 uppercase tracking-wider text-[11px] pb-1 border-b border-emerald-200 flex items-center justify-between">
                    <span>Đề xuất mới từ cộng đồng</span>
                    <span className="px-1.5 py-0.5 rounded bg-emerald-600 text-white text-[9px]">Mới</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-emerald-700 font-semibold block">Tên địa điểm:</span>
                    <span className="font-bold text-emerald-900">
                      {selectedProposalForDiff.proposedData.name}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-emerald-700 font-semibold block">Khoảng giá đề xuất:</span>
                    <span className="font-bold text-emerald-900 bg-emerald-100/80 px-1.5 py-0.5 rounded">
                      {selectedProposalForDiff.proposedData.price || "35.000đ – 75.000đ"}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-emerald-700 font-semibold block">Khung giờ mở cửa:</span>
                    <span className="font-bold text-emerald-900 bg-emerald-100/80 px-1.5 py-0.5 rounded">
                      {selectedProposalForDiff.proposedData.hours || "07:00 – 22:00"}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-emerald-700 font-semibold block">Mô tả cập nhật:</span>
                    <p className="text-emerald-900 bg-emerald-100/50 p-2 rounded-lg leading-relaxed">
                      {selectedProposalForDiff.proposedData.desc || "Mô tả đề xuất chi tiết chất lượng món ăn và phong cách phục vụ."}
                    </p>
                  </div>

                  <div>
                    <span className="text-[10px] text-emerald-700 font-semibold block">Ảnh bìa đề xuất:</span>
                    <img
                      src={selectedProposalForDiff.proposedData.coverImg}
                      alt=""
                      className="w-full h-28 object-cover rounded-lg border border-emerald-300 mt-1"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => setSelectedProposalForDiff(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 bg-white font-bold text-slate-600 hover:bg-slate-100 text-xs cursor-pointer"
              >
                Đóng
              </button>

              {selectedProposalForDiff.status === 0 && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenReject(selectedProposalForDiff.id)}
                    className="px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs cursor-pointer"
                  >
                    ✕ Từ chối đề xuất
                  </button>
                  <button
                    onClick={() => handleApprove(selectedProposalForDiff)}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer shadow-xs"
                  >
                    ✓ Phê duyệt &amp; Đồng bộ dữ liệu
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          REJECT REASON MODAL
      ───────────────────────────────────────────────────────────── */}
      {isRejectModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 p-6 space-y-4 shadow-2xl">
            <h3 className="font-bold text-base text-slate-900">Lý do từ chối đề xuất</h3>
            <p className="text-xs text-slate-500">
              Nhập lý do gửi phản hồi cho người dùng để họ chỉnh sửa lại thông tin chính xác:
            </p>

            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={3}
              className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:bg-white focus:border-slate-400 outline-none"
            />

            <div className="flex justify-end gap-2 pt-2 text-xs font-bold">
              <button
                onClick={() => setIsRejectModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-600"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleConfirmReject}
                className="px-4 py-2 rounded-xl bg-rose-600 text-white hover:bg-rose-700"
              >
                Xác nhận từ chối
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
