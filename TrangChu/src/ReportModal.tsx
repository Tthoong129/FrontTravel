import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import {
  X,
  UploadCloud,
  CheckCircle2,
  Trash2,
  Flag,
  MessageSquare,
  MapPin,
  FileText,
  ShieldCheck,
  Send,
  HelpCircle,
  History,
  AlertTriangle,
} from "lucide-react";
import { DB_REPORT_REASONS, ReportReason } from "./adminData";

/* ── KIỂU DỮ LIỆU ĐỐI TƯỢNG BỊ REPORT (dbo.Reports.TargetType) ── */
export type ReportTargetType = "place" | "review" | "comment";

export interface ReportTargetInfo {
  targetType: ReportTargetType;
  targetId?: number;
  targetTitle: string;
  targetSubtitle?: string;
  targetContent?: string;
  targetAuthor?: string;
  targetRating?: number;
  province?: string;
  category?: string;
}

export interface ReportModalProps {
  placeName?: string;
  initialTarget?: ReportTargetInfo;
  onClose: () => void;
  onSubmittedReport?: (newReport: any) => void;
  defaultTab?: "form" | "guide" | "history";
}

interface SubmittedUserReport {
  id: number;
  targetType: ReportTargetType;
  targetTitle: string;
  reasonContent: string;
  description: string;
  submittedAt: string;
  status: "pending" | "resolved";
  result?: "violation_confirmed" | "dismissed";
  resolutionNote?: string;
}

// Dữ liệu mẫu lịch sử báo cáo người dùng đã gửi
const INITIAL_MY_REPORTS: SubmittedUserReport[] = [
  {
    id: 301,
    targetType: "place",
    targetTitle: "Quán Bún Bò Huế Mụ Rớt",
    reasonContent: "Địa điểm đã đóng cửa hoặc chuyển địa chỉ",
    description: "Quán đã chuyển sang địa chỉ mới từ tháng trước, thông tin trên bản đồ đang bị sai lệch.",
    submittedAt: "Hôm nay, 10:15",
    status: "pending",
  },
  {
    id: 298,
    targetType: "review",
    targetTitle: "Đánh giá tại Cơm Hến Đập Đá",
    reasonContent: "Thông tin sai sự thật, gây hiểu nhầm",
    description: "Tài khoản vu khống quán dùng đồ ăn ôi thiu không có căn cứ.",
    submittedAt: "3 ngày trước",
    status: "resolved",
    result: "dismissed",
    resolutionNote: "Nội dung phản ánh khẩu vị cá nhân, không phát hiện dấu hiệu vi phạm điều khoản.",
  },
];

export default function ReportModal({
  placeName,
  initialTarget,
  onClose,
  onSubmittedReport,
  defaultTab = "form",
}: ReportModalProps) {
  const [modalView, setModalView] = useState<"form" | "guide" | "history">(defaultTab);

  // Xác định thông tin đối tượng đang báo cáo từ props
  const targetInfo: ReportTargetInfo = initialTarget || {
    targetType: "place",
    targetTitle: placeName || "Quán ăn / Địa điểm ẩm thực",
    targetSubtitle: "Cơ sở ẩm thực & du lịch",
  };

  const targetType = targetInfo.targetType;

  // State form
  const [selectedReasonId, setSelectedReasonId] = useState<number | null>(null);
  const [description, setDescription] = useState("");
  const [fileName, setFileName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedReportId, setSubmittedReportId] = useState<number | null>(null);
  const [myReports, setMyReports] = useState<SubmittedUserReport[]>(INITIAL_MY_REPORTS);

  const fileRef = useRef<HTMLInputElement>(null);

  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  // Prevent background body scrolling
  useEffect(() => {
    const orig = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = orig;
    };
  }, []);

  // Tiêu đề modal tương ứng theo từng ngữ cảnh
  const getModalTitle = () => {
    switch (targetType) {
      case "place":
        return "Báo cáo Quán ăn / Địa điểm";
      case "review":
        return "Báo cáo Đánh giá vi phạm";
      case "comment":
        return targetInfo.targetTitle?.toLowerCase().includes("bài viết") ||
          targetInfo.targetSubtitle?.toLowerCase().includes("bài viết")
          ? "Báo cáo Bình luận vi phạm"
          : "Báo cáo Vi phạm";
      default:
        return "Báo cáo Vi phạm";
    }
  };

  const getTargetTypeBadge = () => {
    switch (targetType) {
      case "place":
        return { label: "Quán ăn / Địa điểm", icon: MapPin, bg: "bg-emerald-50", text: "text-emerald-800", border: "border-emerald-200" };
      case "review":
        return { label: "Thẻ đánh giá", icon: MessageSquare, bg: "bg-amber-50", text: "text-amber-800", border: "border-amber-200" };
      case "comment":
        return { label: "Bình luận", icon: FileText, bg: "bg-blue-50", text: "text-blue-800", border: "border-blue-200" };
      default:
        return { label: "Nội dung", icon: Flag, bg: "bg-slate-100", text: "text-slate-800", border: "border-slate-200" };
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReasonId) return;

    setIsSubmitting(true);
    const chosenReason = DB_REPORT_REASONS.find((r) => r.id === selectedReasonId);
    const newId = 300 + Math.floor(Math.random() * 900);

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmittedReportId(newId);

      const newReportEntry: SubmittedUserReport = {
        id: newId,
        targetType: targetType,
        targetTitle: targetInfo.targetTitle,
        reasonContent: chosenReason?.content || "Vi phạm quy định",
        description: description.trim() || "Người dùng không để lại mô tả thêm.",
        submittedAt: "Vừa xong",
        status: "pending",
      };

      setMyReports((prev) => [newReportEntry, ...prev]);
      if (onSubmittedReport) {
        onSubmittedReport(newReportEntry);
      }
    }, 450);
  };

  const badgeInfo = getTargetTypeBadge();
  const BadgeIcon = badgeInfo.icon;

  const modalContent = (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 999999,
        backgroundColor: "rgba(15, 23, 42, 0.65)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "24px",
          width: "100%",
          maxWidth: "540px",
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          border: "1px solid #E2E8F0",
          overflow: "hidden",
        }}
        role="dialog"
        aria-modal="true"
      >
        {/* ── HEADER MODAL ── */}
        <div
          style={{
            padding: "18px 24px",
            borderBottom: "1px solid #F1F5F9",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: "#FAFAFA",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "12px",
                backgroundColor: "#FFE4E6",
                border: "1px solid #FECDD3",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#E11D48",
                flexShrink: 0,
              }}
            >
              <Flag size={18} fill="#E11D48" />
            </div>
            <div>
              <h3
                style={{
                  fontSize: "15px",
                  fontWeight: 700,
                  color: "#0F172A",
                  margin: 0,
                  lineHeight: "1.3",
                }}
              >
                {modalView === "guide"
                  ? "Quy chuẩn báo cáo vi phạm"
                  : modalView === "history"
                  ? "Lịch sử báo cáo của bạn"
                  : getModalTitle()}
              </h3>
              <p
                style={{
                  fontSize: "12px",
                  color: "#64748B",
                  margin: "3px 0 0 0",
                  lineHeight: "1.2",
                }}
              >
                Gửi phản hồi ẩn danh tới Quản trị viên để kiểm duyệt
              </p>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {modalView !== "form" && (
              <button
                type="button"
                onClick={() => setModalView("form")}
                style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#E11D48",
                  backgroundColor: "#FFF1F2",
                  border: "none",
                  padding: "6px 12px",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                ← Quay lại form
              </button>
            )}

            <button
              onClick={onClose}
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                border: "1px solid #E2E8F0",
                backgroundColor: "#FFFFFF",
                color: "#64748B",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "all 0.15s",
              }}
              aria-label="Đóng"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* ── THÀNH CÔNG ── */}
        {submittedReportId ? (
          <div
            style={{
              padding: "36px 24px",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "16px",
            }}
          >
            <div
              style={{
                width: "60px",
                height: "60px",
                borderRadius: "50%",
                backgroundColor: "#DCFCE7",
                color: "#16A34A",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CheckCircle2 size={36} strokeWidth={2.2} />
            </div>

            <div>
              <h4 style={{ fontSize: "17px", fontWeight: 700, color: "#0F172A", margin: "0 0 4px 0" }}>
                Đã tiếp nhận báo cáo của bạn
              </h4>
              <p style={{ fontSize: "13px", color: "#64748B", margin: 0 }}>
                Mã theo dõi: <strong style={{ color: "#16A34A" }}>#REP-{submittedReportId}</strong>
              </p>
            </div>

            <div
              style={{
                padding: "16px",
                borderRadius: "16px",
                backgroundColor: "#F8FAFC",
                border: "1px solid #E2E8F0",
                textAlign: "left",
                fontSize: "12px",
                color: "#334155",
                lineHeight: "1.6",
                maxWidth: "440px",
                width: "100%",
              }}
            >
              <p style={{ margin: "0 0 6px 0", fontWeight: 600, color: "#0F172A" }}>
                • Đối tượng: {targetInfo.targetTitle}
              </p>
              <p style={{ margin: 0, color: "#64748B" }}>
                Cảm ơn bạn đã hỗ trợ giữ gìn môi trường thông tin du lịch trung thực và văn minh. Báo cáo sẽ được Quản trị viên đối chiếu và xử lý trong vòng 24 giờ.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              style={{
                padding: "10px 24px",
                borderRadius: "12px",
                fontSize: "13px",
                fontWeight: 700,
                color: "#FFFFFF",
                backgroundColor: "#0F172A",
                border: "none",
                cursor: "pointer",
                marginTop: "8px",
              }}
            >
              Đã hiểu &amp; Đóng
            </button>
          </div>
        ) : modalView === "guide" ? (
          /* ── HƯỚNG DẪN ── */
          <div style={{ padding: "20px 24px", overflowY: "auto", maxHeight: "65vh" }}>
            <div
              style={{
                padding: "14px 16px",
                borderRadius: "14px",
                backgroundColor: "#EFF6FF",
                border: "1px solid #BFDBFE",
                color: "#1E3A8A",
                fontSize: "12px",
                lineHeight: "1.6",
                marginBottom: "16px",
              }}
            >
              <strong style={{ display: "block", marginBottom: "4px" }}>Nguyên tắc tiếp nhận báo cáo</strong>
              Mọi thành viên đều có quyền báo cáo các nội dung vi phạm tiêu chuẩn cộng đồng, bao gồm thông tin quán ăn sai lệch, đánh giá bôi nhọ hoặc bình luận quấy rối.
            </div>

            <h5 style={{ fontSize: "12px", fontWeight: 700, color: "#0F172A", margin: "0 0 10px 0" }}>
              Các lý do vi phạm phổ biến:
            </h5>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "16px" }}>
              {DB_REPORT_REASONS.map((r) => (
                <div
                  key={r.id}
                  style={{
                    padding: "10px 14px",
                    borderRadius: "12px",
                    border: "1px solid #F1F5F9",
                    backgroundColor: "#F8FAFC",
                    fontSize: "12px",
                  }}
                >
                  <strong style={{ color: "#0F172A" }}>• {r.content}:</strong>{" "}
                  <span style={{ color: "#64748B" }}>{r.desc}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => setModalView("form")}
              style={{
                width: "100%",
                padding: "10px",
                textAlign: "center",
                fontSize: "13px",
                fontWeight: 700,
                color: "#FFFFFF",
                backgroundColor: "#E11D48",
                borderRadius: "12px",
                border: "none",
                cursor: "pointer",
              }}
            >
              Tiến hành gửi báo cáo →
            </button>
          </div>
        ) : modalView === "history" ? (
          /* ── LỊCH SỬ BÁO CÁO ── */
          <div style={{ padding: "20px 24px", overflowY: "auto", maxHeight: "65vh" }}>
            <h5
              style={{
                fontSize: "11px",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                color: "#64748B",
                margin: "0 0 12px 0",
              }}
            >
              Báo cáo bạn đã gửi gần đây ({myReports.length})
            </h5>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {myReports.map((rep) => (
                <div
                  key={rep.id}
                  style={{
                    padding: "14px 16px",
                    borderRadius: "14px",
                    border: "1px solid #E2E8F0",
                    backgroundColor: "#F8FAFC",
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: "13px", fontWeight: 700, color: "#0F172A" }}>
                      {rep.targetTitle}
                    </span>
                    <span
                      style={{
                        fontSize: "10px",
                        fontWeight: 700,
                        padding: "3px 8px",
                        borderRadius: "20px",
                        backgroundColor: rep.status === "pending" ? "#FEF3C7" : "#DCFCE7",
                        color: rep.status === "pending" ? "#92400E" : "#166534",
                      }}
                    >
                      {rep.status === "pending" ? "Đang thẩm định" : "Đã xử lý"}
                    </span>
                  </div>
                  <p style={{ fontSize: "12px", color: "#BE123C", fontWeight: 600, margin: 0 }}>
                    Lý do: {rep.reasonContent}
                  </p>
                  <p
                    style={{
                      fontSize: "12px",
                      color: "#475569",
                      fontStyle: "italic",
                      backgroundColor: "#FFFFFF",
                      padding: "8px 12px",
                      borderRadius: "8px",
                      border: "1px solid #F1F5F9",
                      margin: 0,
                    }}
                  >
                    "{rep.description}"
                  </p>
                  <span style={{ fontSize: "11px", color: "#94A3B8" }}>Gửi lúc: {rep.submittedAt}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* ── FORM BÁO CÁO CHÍNH (ĐẸP, THOÁNG, CHUẨN THIẾT KẾ) ── */
          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0, margin: 0 }}
          >
            <div
              style={{
                padding: "20px 24px",
                overflowY: "auto",
                maxHeight: "65vh",
                display: "flex",
                flexDirection: "column",
                gap: "18px",
              }}
            >
              {/* Thẻ tóm tắt đối tượng đang báo cáo */}
              <div
                style={{
                  padding: "14px 16px",
                  borderRadius: "16px",
                  backgroundColor: "#F8FAFC",
                  border: "1px solid #E2E8F0",
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "3px 8px",
                      borderRadius: "6px",
                      fontSize: "11px",
                      fontWeight: 700,
                      backgroundColor: targetType === "place" ? "#ECFDF5" : targetType === "review" ? "#FEF3C7" : "#EFF6FF",
                      color: targetType === "place" ? "#065F46" : targetType === "review" ? "#92400E" : "#1E40AF",
                      border: `1px solid ${targetType === "place" ? "#A7F3D0" : targetType === "review" ? "#FDE68A" : "#BFDBFE"}`,
                    }}
                  >
                    <BadgeIcon size={12} />
                    <span>{badgeInfo.label}</span>
                  </div>

                  {targetInfo.targetRating && (
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: 700,
                        color: "#B45309",
                        backgroundColor: "#FEF3C7",
                        padding: "2px 8px",
                        borderRadius: "6px",
                      }}
                    >
                      ★ {targetInfo.targetRating}.0
                    </span>
                  )}
                </div>

                <div>
                  <h4
                    style={{
                      fontSize: "14px",
                      fontWeight: 700,
                      color: "#0F172A",
                      margin: "2px 0 0 0",
                      lineHeight: "1.4",
                    }}
                  >
                    {targetInfo.targetTitle}
                  </h4>
                  {targetInfo.targetSubtitle && (
                    <p style={{ fontSize: "12px", color: "#64748B", margin: "2px 0 0 0" }}>
                      {targetInfo.targetSubtitle}
                    </p>
                  )}
                </div>

                {targetInfo.targetContent && (
                  <p
                    style={{
                      fontSize: "12px",
                      color: "#334155",
                      fontStyle: "italic",
                      backgroundColor: "#FFFFFF",
                      padding: "8px 12px",
                      borderRadius: "8px",
                      border: "1px solid #E2E8F0",
                      margin: "4px 0 0 0",
                      lineHeight: "1.5",
                    }}
                  >
                    "{targetInfo.targetContent}"
                  </p>
                )}
              </div>

              {/* Danh sách lý do vi phạm */}
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "8px",
                  }}
                >
                  <label
                    style={{
                      fontSize: "12px",
                      fontWeight: 700,
                      color: "#0F172A",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      margin: 0,
                    }}
                  >
                    <span>Chọn lý do vi phạm</span>
                    <span style={{ color: "#E11D48" }}>*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setModalView("guide")}
                    style={{
                      fontSize: "11px",
                      fontWeight: 600,
                      color: "#2563EB",
                      background: "none",
                      border: "none",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "3px",
                      cursor: "pointer",
                      padding: 0,
                    }}
                  >
                    <HelpCircle size={12} />
                    <span>Xem quy chuẩn</span>
                  </button>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
                  {DB_REPORT_REASONS.map((r) => {
                    const isSelected = selectedReasonId === r.id;
                    return (
                      <div
                        key={r.id}
                        onClick={() => setSelectedReasonId(r.id)}
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: "12px",
                          padding: "10px 14px",
                          borderRadius: "14px",
                          border: `1.5px solid ${isSelected ? "#E11D48" : "#E2E8F0"}`,
                          backgroundColor: isSelected ? "#FFF1F2" : "#FFFFFF",
                          cursor: "pointer",
                          transition: "all 0.15s ease",
                        }}
                      >
                        {/* Custom Radio Circle */}
                        <div
                          style={{
                            width: "18px",
                            height: "18px",
                            borderRadius: "50%",
                            border: `2px solid ${isSelected ? "#E11D48" : "#CBD5E1"}`,
                            backgroundColor: "#FFFFFF",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                            marginTop: "2px",
                          }}
                        >
                          {isSelected && (
                            <div
                              style={{
                                width: "9px",
                                height: "9px",
                                borderRadius: "50%",
                                backgroundColor: "#E11D48",
                              }}
                            />
                          )}
                        </div>

                        <div style={{ flex: 1, minWidth: 0 }}>
                          <span
                            style={{
                              fontSize: "13px",
                              fontWeight: 700,
                              color: isSelected ? "#9F1239" : "#1E293B",
                              display: "block",
                              lineHeight: "1.3",
                            }}
                          >
                            {r.content}
                          </span>
                          <span
                            style={{
                              fontSize: "11px",
                              color: isSelected ? "#881337" : "#64748B",
                              display: "block",
                              marginTop: "3px",
                              lineHeight: "1.4",
                            }}
                          >
                            {r.desc}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Ô nhập mô tả chi tiết */}
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "6px",
                  }}
                >
                  <label style={{ fontSize: "12px", fontWeight: 700, color: "#0F172A", margin: 0 }}>
                    Mô tả chi tiết vi phạm
                  </label>
                  <span style={{ fontSize: "11px", color: "#94A3B8" }}>
                    {description.length}/500 ký tự
                  </span>
                </div>
                <textarea
                  rows={3}
                  maxLength={500}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Vui lòng cung cấp thêm thông tin, dẫn chứng hoặc thời gian xảy ra để Quản trị viên dễ dàng xác minh..."
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    fontSize: "12px",
                    padding: "10px 14px",
                    borderRadius: "14px",
                    border: "1px solid #CBD5E1",
                    outline: "none",
                    resize: "none",
                    color: "#0F172A",
                    backgroundColor: "#FFFFFF",
                    fontFamily: "inherit",
                    lineHeight: "1.5",
                  }}
                />
              </div>

              {/* Đính kèm ảnh bằng chứng */}
              <div>
                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: 700,
                    color: "#0F172A",
                    display: "block",
                    marginBottom: "6px",
                  }}
                >
                  Ảnh bằng chứng (tùy chọn)
                </span>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={(e) => setFileName(e.target.files?.[0]?.name ?? "")}
                />

                {fileName ? (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "8px 12px",
                      backgroundColor: "#FFF1F2",
                      borderRadius: "12px",
                      border: "1px solid #FECDD3",
                      fontSize: "12px",
                      color: "#9F1239",
                    }}
                  >
                    <span style={{ display: "flex", alignItems: "center", gap: "8px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      <UploadCloud size={14} color="#E11D48" />
                      <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{fileName}</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setFileName("");
                        if (fileRef.current) fileRef.current.value = "";
                      }}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#E11D48",
                        cursor: "pointer",
                        padding: "2px",
                        display: "flex",
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    style={{
                      width: "100%",
                      border: "1.5px dashed #CBD5E1",
                      borderRadius: "12px",
                      padding: "10px",
                      textAlign: "center",
                      fontSize: "12px",
                      color: "#64748B",
                      backgroundColor: "#F8FAFC",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "6px",
                    }}
                  >
                    <UploadCloud size={15} color="#94A3B8" />
                    <span>Tải lên ảnh chụp màn hình vi phạm</span>
                  </button>
                )}
              </div>

              {/* Cam kết bảo mật ẩn danh */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "10px 14px",
                  borderRadius: "12px",
                  backgroundColor: "#F0FDF4",
                  border: "1px solid #DCFCE7",
                  fontSize: "11px",
                  color: "#166534",
                  fontWeight: 500,
                }}
              >
                <ShieldCheck size={16} color="#16A34A" style={{ flexShrink: 0 }} />
                <span>Báo cáo của bạn được gửi ẩn danh và bảo mật tuyệt đối.</span>
              </div>
            </div>

            {/* ── FOOTER HÀNH ĐỘNG ── */}
            <div
              style={{
                padding: "14px 24px",
                borderTop: "1px solid #F1F5F9",
                backgroundColor: "#FAFAFA",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <button
                type="button"
                onClick={() => setModalView("history")}
                style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#64748B",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "6px 0",
                }}
              >
                Lịch sử ({myReports.length})
              </button>

              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <button
                  type="button"
                  onClick={onClose}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "12px",
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "#475569",
                    backgroundColor: "#F1F5F9",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Hủy bỏ
                </button>

                <button
                  type="submit"
                  disabled={!selectedReasonId || isSubmitting}
                  style={{
                    padding: "9px 20px",
                    borderRadius: "12px",
                    fontSize: "12px",
                    fontWeight: 700,
                    color: "#FFFFFF",
                    backgroundColor: selectedReasonId && !isSubmitting ? "#E11D48" : "#E2E8F0",
                    border: "none",
                    cursor: selectedReasonId && !isSubmitting ? "pointer" : "not-allowed",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    boxShadow: selectedReasonId && !isSubmitting ? "0 4px 12px rgba(225, 29, 72, 0.25)" : "none",
                    transition: "all 0.15s",
                  }}
                >
                  <Send size={13} />
                  <span>{isSubmitting ? "Đang gửi..." : "Gửi Báo Cáo"}</span>
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );

  return typeof document !== "undefined" ? createPortal(modalContent, document.body) : modalContent;
}
