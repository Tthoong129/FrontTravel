import { useState } from "react";
import { ClipboardCheck, Check, X, Clock, User, MapPin } from "lucide-react";
import { AdminProposalItem } from "../../adminData";

interface ProposalsTabProps {
  proposals: AdminProposalItem[];
  proposalStatusFilter: "all" | "0" | "1" | "2";
  setProposalStatusFilter: (status: "all" | "0" | "1" | "2") => void;
  setProposals: React.Dispatch<React.SetStateAction<AdminProposalItem[]>>;
  addAuditLog: (action: string, targetName: string, details: string, type: "approve" | "reject" | "resolve" | "hide") => void;
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
  const [selectedProposalForDiff, setSelectedProposalForDiff] = useState<AdminProposalItem | null>(null);

  const filteredProposals = proposals.filter((prop) =>
    proposalStatusFilter === "all" ? true : String(prop.status) === proposalStatusFilter
  );

  const pendingCount = proposals.filter((p) => p.status === 0).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header & Filter Pill */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4 text-xs">
        <div>
          <h2 className="font-bold text-base text-slate-900 tracking-tight flex items-center gap-2">
            <ClipboardCheck className="text-slate-700" size={18} />
            <span>Đề xuất đóng góp từ cộng đồng</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Duyệt thông tin địa điểm mới và các cập nhật số hóa từ người dùng
          </p>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-slate-100/80 rounded-xl">
          {(["all", "0", "1", "2"] as const).map((statusKey) => (
            <button
              key={statusKey}
              onClick={() => setProposalStatusFilter(statusKey)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                proposalStatusFilter === statusKey
                  ? "bg-white text-slate-900 shadow-xs font-semibold"
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
      </div>

      {/* Proposals List */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs divide-y divide-slate-100 text-xs overflow-hidden">
        {filteredProposals.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            Không có đề xuất nào trong trạng thái này.
          </div>
        ) : (
          filteredProposals.map((prop) => (
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
                      className={`px-2 py-0.5 rounded-md text-[10px] font-semibold ${
                        prop.type === "NEW_PLACE"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200/80"
                          : "bg-sky-50 text-sky-700 border border-sky-200/80"
                      }`}
                    >
                      {prop.type === "NEW_PLACE" ? "+ Thêm mới" : "✏ Cập nhật thông tin"}
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
                    {prop.proposedData.desc}
                  </p>

                  <div className="flex items-center gap-3 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <User size={12} />
                      <strong>{prop.userName}</strong> (Uy tín: {prop.userReputation}đ)
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {prop.createdAt}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                {prop.status === 0 ? (
                  <>
                    <button
                      onClick={() => {
                        setProposals((prev) =>
                          prev.map((p) => (p.id === prop.id ? { ...p, status: 1 } : p))
                        );
                        addAuditLog(
                          "Duyệt đề xuất đóng góp",
                          prop.proposedData.name,
                          "Chấp nhận đề xuất cộng đồng",
                          "approve"
                        );
                        showToast(`Đã duyệt đề xuất "${prop.proposedData.name}".`);
                      }}
                      className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium cursor-pointer transition-colors flex items-center gap-1 shadow-xs"
                    >
                      <Check size={14} />
                      <span>Chấp nhận</span>
                    </button>
                    <button
                      onClick={() => {
                        setProposals((prev) =>
                          prev.map((p) => (p.id === prop.id ? { ...p, status: 2 } : p))
                        );
                        addAuditLog(
                          "Từ chối đề xuất",
                          prop.proposedData.name,
                          "Thông tin chưa chính xác",
                          "reject"
                        );
                        showToast(`Đã từ chối đề xuất #${prop.id}.`);
                      }}
                      className="px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-600 font-medium cursor-pointer transition-colors flex items-center gap-1"
                    >
                      <X size={14} />
                      <span>Từ chối</span>
                    </button>
                  </>
                ) : (
                  <span
                    className={`px-3 py-1 rounded-lg font-medium text-xs ${
                      prop.status === 1
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200/80"
                        : "bg-rose-50 text-rose-700 border border-rose-200/80"
                    }`}
                  >
                    {prop.status === 1 ? "✓ Đã phê duyệt" : "✕ Đã từ chối"}
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
