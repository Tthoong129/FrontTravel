import { useState, useEffect, useRef } from "react";
import {
  X,
  UploadCloud,
  CheckCircle2,
  Trash2,
} from "lucide-react";

/* ── CSS STYLES ───────────────────────────────────────────────────────────── */
const STYLE = `
  .rm-overlay {
    position: fixed; inset: 0; z-index: 9999;
    background: rgba(15, 23, 42, 0.6);
    backdrop-filter: blur(8px);
    display: flex; align-items: center; justify-content: center;
    padding: 20px;
    animation: rm-fade-in .2s ease-out;
  }
  @keyframes rm-fade-in { from { opacity: 0 } to { opacity: 1 } }

  .rm-modal {
    background: #ffffff;
    border-radius: 20px;
    width: 100%; max-width: 540px;
    max-height: 90vh;
    display: flex; flex-direction: column;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.05);
    animation: rm-slide-up .25s cubic-bezier(0.16, 1, 0.3, 1);
    overflow: hidden;
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
  }
  @keyframes rm-slide-up {
    from { opacity: 0; transform: translateY(18px) scale(0.98); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }

  /* Header */
  .rm-header {
    padding: 22px 26px 18px;
    display: flex; align-items: flex-start; justify-content: space-between;
    border-bottom: 1px solid #F1F5F9;
  }
  .rm-header-text { flex: 1; min-width: 0; padding-right: 16px; }
  .rm-badge {
    display: inline-flex; align-items: center; gap: 5px;
    font-size: 11px; font-weight: 700; text-transform: uppercase;
    letter-spacing: 0.05em; color: #EA580C; background: #FFF7ED;
    padding: 3px 9px; border-radius: 999px; margin-bottom: 6px;
  }
  .rm-title {
    font-size: 18px; font-weight: 800; color: #0F172A;
    letter-spacing: -0.02em; line-height: 1.3; margin: 0 0 4px 0;
  }
  .rm-sub {
    font-size: 13px; color: #64748B; margin: 0; line-height: 1.4;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .rm-close {
    width: 34px; height: 34px; border-radius: 50%;
    border: 1px solid #E2E8F0; background: #F8FAFC;
    color: #64748B; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: all 0.15s ease; flex-shrink: 0;
  }
  .rm-close:hover { background: #E2E8F0; color: #0F172A; }

  /* Body Scrollable */
  .rm-body {
    padding: 22px 26px;
    overflow-y: auto;
    display: flex; flex-direction: column; gap: 20px;
  }
  .rm-body::-webkit-scrollbar { width: 6px; }
  .rm-body::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 4px; }

  .rm-section-label {
    font-size: 12px; font-weight: 700; text-transform: uppercase;
    letter-spacing: 0.04em; color: #475569; margin-bottom: 10px;
    display: flex; align-items: center; justify-content: space-between;
  }

  /* Reason Grid */
  .rm-grid {
    display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;
  }
  @media (max-width: 520px) {
    .rm-grid { grid-template-columns: 1fr; }
  }

  .rm-card {
    display: flex; flex-direction: column; justify-content: center;
    padding: 13px 15px; border-radius: 12px;
    border: 1.5px solid #E2E8F0; background: #FFFFFF;
    cursor: pointer; transition: all 0.18s ease; text-align: left;
    position: relative; min-height: 72px;
  }
  .rm-card:hover {
    border-color: #94A3B8; background: #F8FAFC;
  }
  .rm-card.active {
    border-color: #064E3B; background: #ECFDF5;
    box-shadow: 0 0 0 1px #064E3B;
  }
  .rm-card-title {
    font-size: 13px; font-weight: 700; color: #1E293B;
    line-height: 1.35; margin-bottom: 3px;
  }
  .rm-card.active .rm-card-title { color: #064E3B; }
  .rm-card-desc {
    font-size: 11.5px; color: #64748B; line-height: 1.4;
  }
  .rm-card.active .rm-card-desc { color: #047857; }

  /* Textarea */
  .rm-textarea-wrap { position: relative; }
  .rm-textarea {
    width: 100%; border: 1.5px solid #E2E8F0; border-radius: 12px;
    padding: 12px 14px 28px; font-size: 13px; font-family: inherit;
    color: #0F172A; resize: none; min-height: 90px;
    outline: none; transition: border-color 0.15s, box-shadow 0.15s;
    line-height: 1.55; box-sizing: border-box; background: #FAFAFA;
  }
  .rm-textarea:focus {
    background: #FFFFFF; border-color: #064E3B;
    box-shadow: 0 0 0 3px rgba(6, 78, 59, 0.1);
  }
  .rm-textarea::placeholder { color: #94A3B8; }
  .rm-char-count {
    position: absolute; right: 12px; bottom: 8px;
    font-size: 11px; color: #94A3B8;
  }

  /* Upload */
  .rm-dropzone {
    border: 1.5px dashed #CBD5E1; border-radius: 12px;
    padding: 14px 16px; background: #F8FAFC;
    cursor: pointer; transition: all 0.15s ease;
    display: flex; align-items: center; justify-content: space-between;
  }
  .rm-dropzone:hover { border-color: #064E3B; background: #F0FDF4; }
  .rm-drop-left { display: flex; align-items: center; gap: 12px; }
  .rm-drop-icon {
    width: 36px; height: 36px; border-radius: 10px;
    background: #E2E8F0; color: #475569;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .rm-dropzone:hover .rm-drop-icon { background: #DCFCE7; color: #064E3B; }
  .rm-drop-text strong { display: block; font-size: 13px; font-weight: 600; color: #1E293B; }
  .rm-drop-text span { font-size: 11px; color: #64748B; }

  .rm-file-chip {
    display: flex; align-items: center; justify-content: space-between;
    padding: 10px 14px; border-radius: 10px; background: #ECFDF5;
    border: 1px solid #A7F3D0;
  }
  .rm-file-name {
    font-size: 13px; font-weight: 600; color: #064E3B;
    display: flex; align-items: center; gap: 8px;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 360px;
  }
  .rm-file-remove {
    background: none; border: none; color: #059669;
    cursor: pointer; padding: 4px; display: flex; align-items: center;
    border-radius: 6px; transition: background 0.15s;
  }
  .rm-file-remove:hover { background: #D1FAE5; color: #DC2626; }

  /* Footer */
  .rm-footer {
    padding: 16px 26px 22px;
    display: flex; gap: 12px; align-items: center;
    border-top: 1px solid #F1F5F9;
    background: #FAFAFA;
  }
  .rm-btn-cancel {
    padding: 11px 20px; border-radius: 10px;
    border: 1.5px solid #CBD5E1; background: #FFFFFF;
    color: #334155; font-size: 13px; font-weight: 600;
    cursor: pointer; transition: all 0.15s;
  }
  .rm-btn-cancel:hover { background: #F1F5F9; border-color: #94A3B8; }
  .rm-btn-submit {
    flex: 1; padding: 11px 24px; border-radius: 10px;
    border: none; background: #064E3B; color: #FFFFFF;
    font-size: 13px; font-weight: 700; cursor: pointer;
    transition: all 0.15s ease; box-shadow: 0 4px 12px rgba(6, 78, 59, 0.25);
    display: flex; align-items: center; justify-content: center; gap: 8px;
  }
  .rm-btn-submit:hover:not(:disabled) {
    background: #04382A; transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(6, 78, 59, 0.35);
  }
  .rm-btn-submit:disabled {
    background: #94A3B8; box-shadow: none; cursor: not-allowed; opacity: 0.6;
  }

  /* Success View */
  .rm-success-box {
    padding: 48px 32px 40px; text-align: center;
    display: flex; flex-direction: column; align-items: center;
  }
  .rm-success-circle {
    width: 64px; height: 64px; border-radius: 50%;
    background: #ECFDF5; color: #059669;
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 20px;
    animation: rm-pop .3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }
  @keyframes rm-pop {
    from { transform: scale(0.5); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
  }
  .rm-success-title {
    font-size: 20px; font-weight: 800; color: #0F172A; margin: 0 0 8px 0;
  }
  .rm-success-desc {
    font-size: 13px; color: #64748B; line-height: 1.6; max-width: 380px; margin: 0 0 24px 0;
  }
  .rm-success-btn {
    padding: 10px 32px; border-radius: 10px;
    border: none; background: #064E3B; color: #fff;
    font-size: 13px; font-weight: 700; cursor: pointer;
    transition: opacity 0.15s;
  }
  .rm-success-btn:hover { opacity: 0.9; }
`;

const REASONS = [
  {
    id: "closed",
    title: "Đã đóng cửa / Dừng hoạt động",
    desc: "Địa điểm đã dừng kinh doanh hoặc chuyển đi",
  },
  {
    id: "location",
    title: "Sai vị trí hoặc sai địa chỉ",
    desc: "Ghim bản đồ hoặc tên đường chưa chính xác",
  },
  {
    id: "hours",
    title: "Sai giờ mở cửa hoặc giá",
    desc: "Thời gian phục vụ hoặc mức giá đã thay đổi",
  },
  {
    id: "duplicate",
    title: "Trùng lặp địa điểm",
    desc: "Đã có một trang tương tự trên LangThang",
  },
  {
    id: "content",
    title: "Nội dung hoặc ảnh không chuẩn",
    desc: "Hình ảnh sai quán hoặc thông tin không phù hợp",
  },
  {
    id: "other",
    title: "Đề xuất cập nhật khác",
    desc: "Bổ sung số điện thoại, menu hoặc tiện ích",
  },
];

interface ReportModalProps {
  placeName: string;
  onClose: () => void;
}

export default function ReportModal({ placeName, onClose }: ReportModalProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detail, setDetail] = useState("");
  const [fileName, setFileName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  /* Close on Escape */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  /* Prevent body scrolling */
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const handleSubmit = () => {
    if (!selectedId) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 450);
  };

  return (
    <>
      <style>{STYLE}</style>
      <div
        className="rm-overlay"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div
          className="rm-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="rm-modal-title"
        >
          {submitted ? (
            <div className="rm-success-box">
              <div className="rm-success-circle">
                <CheckCircle2 size={36} strokeWidth={2.2} />
              </div>
              <h4 className="rm-success-title">Đã tiếp nhận đóng góp!</h4>
              <p className="rm-success-desc">
                Cảm ơn bạn đã hỗ trợ cập nhật thông tin cho{" "}
                <strong style={{ color: "#0F172A" }}>"{placeName}"</strong>. Đội
                ngũ kiểm duyệt sẽ xác minh và điều chỉnh dữ liệu sớm nhất.
              </p>
              <button className="rm-success-btn" onClick={onClose}>
                Hoàn tất
              </button>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="rm-header">
                <div className="rm-header-text">
                  <div className="rm-badge">Đóng góp cộng đồng</div>
                  <h3 className="rm-title" id="rm-modal-title">
                    Báo cáo & Đề xuất chỉnh sửa
                  </h3>
                  <p className="rm-sub">
                    Góp ý về địa điểm: <strong>{placeName}</strong>
                  </p>
                </div>
                <button
                  className="rm-close"
                  onClick={onClose}
                  aria-label="Đóng cửa sổ"
                >
                  <X size={16} strokeWidth={2.2} />
                </button>
              </div>

              {/* Body */}
              <div className="rm-body">
                {/* 1. Category Selection */}
                <div>
                  <div className="rm-section-label">
                    <span>1. Vấn đề bạn nhận thấy *</span>
                  </div>
                  <div className="rm-grid">
                    {REASONS.map((r) => {
                      const isActive = selectedId === r.id;
                      return (
                        <button
                          key={r.id}
                          type="button"
                          className={`rm-card${isActive ? " active" : ""}`}
                          onClick={() => setSelectedId(r.id)}
                        >
                          <div className="rm-card-title">{r.title}</div>
                          <div className="rm-card-desc">{r.desc}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Text description */}
                <div>
                  <div className="rm-section-label">
                    <span>2. Chi tiết cần cập nhật</span>
                    <span style={{ fontWeight: 400, color: "#94A3B8" }}>
                      Tùy chọn
                    </span>
                  </div>
                  <div className="rm-textarea-wrap">
                    <textarea
                      className="rm-textarea"
                      placeholder="Mô tả cụ thể thông tin chính xác (ví dụ: số nhà mới, giờ phục vụ thực tế, món đặc trưng...)"
                      value={detail}
                      maxLength={500}
                      onChange={(e) => setDetail(e.target.value)}
                    />
                    <span className="rm-char-count">{detail.length}/500</span>
                  </div>
                </div>

                {/* 3. Photo proof upload */}
                <div>
                  <div className="rm-section-label">
                    <span>3. Ảnh minh chứng thực tế</span>
                    <span style={{ fontWeight: 400, color: "#94A3B8" }}>
                      Tùy chọn
                    </span>
                  </div>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={(e) =>
                      setFileName(e.target.files?.[0]?.name ?? "")
                    }
                  />

                  {fileName ? (
                    <div className="rm-file-chip">
                      <div className="rm-file-name">
                        <UploadCloud size={16} />
                        <span>{fileName}</span>
                      </div>
                      <button
                        className="rm-file-remove"
                        type="button"
                        onClick={() => {
                          setFileName("");
                          if (fileRef.current) fileRef.current.value = "";
                        }}
                        title="Xóa ảnh"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ) : (
                    <div
                      className="rm-dropzone"
                      onClick={() => fileRef.current?.click()}
                    >
                      <div className="rm-drop-left">
                        <div className="rm-drop-icon">
                          <UploadCloud size={18} />
                        </div>
                        <div className="rm-drop-text">
                          <strong>Tải lên hình ảnh bảng hiệu, menu...</strong>
                          <span>Hỗ trợ định dạng JPG, PNG (tối đa 10 MB)</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="rm-footer">
                <button
                  type="button"
                  className="rm-btn-cancel"
                  onClick={onClose}
                >
                  Hủy bỏ
                </button>
                <button
                  type="button"
                  className="rm-btn-submit"
                  onClick={handleSubmit}
                  disabled={!selectedId || isSubmitting}
                >
                  {isSubmitting ? "Đang gửi..." : "Gửi thông tin"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
