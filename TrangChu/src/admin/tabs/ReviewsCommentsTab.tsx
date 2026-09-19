import { useState } from "react";
import { MessageSquare, Star, EyeOff, ShieldAlert, AlertTriangle } from "lucide-react";
import { PlaceReviewItem, PlaceCommentItem } from "../types";

interface ReviewsCommentsTabProps {
  revComTab: "reviews" | "comments";
  setRevComTab: (tab: "reviews" | "comments") => void;
  reviewsList: PlaceReviewItem[];
  setReviewsList: React.Dispatch<React.SetStateAction<PlaceReviewItem[]>>;
  commentsList: PlaceCommentItem[];
  setCommentsList: React.Dispatch<React.SetStateAction<PlaceCommentItem[]>>;
  revReportFilter: string;
  setRevReportFilter: (v: string) => void;
  addAuditLog: (action: string, targetName: string, details: string, type: "approve" | "reject" | "resolve" | "hide") => void;
  showToast: (msg: string) => void;
}

export default function ReviewsCommentsTab({
  revComTab,
  setRevComTab,
  reviewsList,
  setReviewsList,
  commentsList,
  setCommentsList,
  revReportFilter,
  setRevReportFilter,
  addAuditLog,
  showToast,
}: ReviewsCommentsTabProps) {
  const reportedReviewsCount = reviewsList.filter((r) => r.reportCount > 0).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header & Sub-tab navigation */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4 text-xs">
        <div>
          <h2 className="font-bold text-base text-slate-900 tracking-tight flex items-center gap-2">
            <MessageSquare className="text-slate-700" size={18} />
            <span>Kiểm duyệt đánh giá &amp; bình luận</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Quản lý nội dung tương tác cộng đồng, xử lý phản ánh bôi nhọ và spam
          </p>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-slate-100/80 rounded-xl">
          <button
            onClick={() => setRevComTab("reviews")}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
              revComTab === "reviews"
                ? "bg-white text-slate-900 shadow-xs font-semibold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Đánh giá ({reviewsList.length})
            {reportedReviewsCount > 0 && (
              <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-bold">
                {reportedReviewsCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setRevComTab("comments")}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
              revComTab === "comments"
                ? "bg-white text-slate-900 shadow-xs font-semibold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Bình luận ({commentsList.length})
          </button>
        </div>
      </div>

      {/* Reviews view */}
      {revComTab === "reviews" && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs divide-y divide-slate-100 text-xs overflow-hidden">
          {reviewsList.map((rev) => (
            <div
              key={rev.id}
              className="p-5 flex flex-col md:flex-row md:items-start justify-between gap-4 hover:bg-slate-50/70 transition-colors"
            >
              <div className="flex items-start gap-3.5">
                <img
                  src={rev.userAvatar}
                  alt=""
                  className="w-10 h-10 rounded-full object-cover ring-1 ring-slate-200 shrink-0"
                />
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-slate-900 text-sm">{rev.userName}</span>
                    <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200/80 font-semibold text-[11px] flex items-center gap-1">
                      <Star size={11} fill="currentColor" /> {rev.rating}.0
                    </span>
                    <span className="text-slate-400 text-xs">tại {rev.placeName}</span>
                    {rev.reportCount > 0 && (
                      <span className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200/80 text-[10px] font-semibold flex items-center gap-1">
                        <AlertTriangle size={10} />
                        {rev.reportCount} lượt báo cáo
                      </span>
                    )}
                  </div>

                  <p className="text-slate-700 leading-relaxed max-w-2xl">{rev.content}</p>

                  <span className="text-slate-400 text-[11px] block">{rev.createdAt}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end md:self-start shrink-0">
                {rev.status === "active" ? (
                  <button
                    onClick={() => {
                      setReviewsList((prev) =>
                        prev.map((r) => (r.id === rev.id ? { ...r, status: "hidden" } : r))
                      );
                      addAuditLog(
                        "Ẩn review vi phạm",
                        rev.placeName,
                        "Nội dung phản cảm hoặc spam",
                        "hide"
                      );
                      showToast(`Đã ẩn đánh giá của "${rev.userName}".`);
                    }}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 text-slate-600 font-medium cursor-pointer transition-colors flex items-center gap-1.5"
                  >
                    <EyeOff size={13} />
                    <span>Ẩn đánh giá</span>
                  </button>
                ) : (
                  <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-500 font-medium text-xs">
                    Đang bị ẩn
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Comments view */}
      {revComTab === "comments" && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs divide-y divide-slate-100 text-xs overflow-hidden">
          {commentsList.map((com) => (
            <div
              key={com.id}
              className="p-5 flex flex-col md:flex-row md:items-start justify-between gap-4 hover:bg-slate-50/70 transition-colors"
            >
              <div className="flex items-start gap-3.5">
                <img
                  src={com.userAvatar}
                  alt=""
                  className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-200 shrink-0"
                />
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-slate-900">{com.userName}</span>
                    <span className="text-slate-400 text-xs">bình luận trên bài blog #{com.blogId}</span>
                  </div>
                  <p className="text-slate-700 leading-relaxed max-w-2xl">{com.content}</p>
                  <span className="text-slate-400 text-[11px] block">{com.createdAt}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end md:self-start shrink-0">
                {com.status === "active" ? (
                  <button
                    onClick={() => {
                      setCommentsList((prev) =>
                        prev.map((c) => (c.id === com.id ? { ...c, status: "hidden" } : c))
                      );
                      addAuditLog(
                        "Ẩn bình luận",
                        `Blog #${com.blogId}`,
                        "Nội dung vi phạm tiêu chuẩn",
                        "hide"
                      );
                      showToast(`Đã ẩn bình luận của "${com.userName}".`);
                    }}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 text-slate-600 font-medium cursor-pointer transition-colors flex items-center gap-1.5"
                  >
                    <EyeOff size={13} />
                    <span>Ẩn</span>
                  </button>
                ) : (
                  <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-500 font-medium text-xs">
                    Đã ẩn
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
