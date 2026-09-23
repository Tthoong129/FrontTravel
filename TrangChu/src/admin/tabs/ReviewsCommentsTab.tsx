import React, { useState, useMemo } from "react";
import { MessageSquare, Star, EyeOff, Eye, ShieldAlert, AlertTriangle, Search, Filter, Check, User, ArrowUpDown } from "lucide-react";
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
  addAuditLog: (
    action: string,
    targetName: string,
    details: string,
    type: "approve" | "reject" | "resolve" | "hide"
  ) => void;
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
  // Search & Filter State
  const [searchText, setSearchText] = useState("");
  const [starFilter, setStarFilter] = useState<"all" | "5" | "4" | "3" | "2" | "1">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "hidden" | "reported">("all");

  const reportedReviewsCount = useMemo(() => reviewsList.filter((r) => r.reportCount > 0).length, [reviewsList]);
  const reportedCommentsCount = useMemo(() => commentsList.filter((c) => c.reportCount > 0).length, [commentsList]);

  // Filtered Reviews
  const filteredReviews = useMemo(() => {
    return reviewsList.filter((rev) => {
      if (statusFilter === "active" && rev.status !== "active") return false;
      if (statusFilter === "hidden" && rev.status !== "hidden") return false;
      if (statusFilter === "reported" && rev.reportCount <= 0) return false;

      if (starFilter !== "all" && String(Math.floor(rev.rating)) !== starFilter) return false;

      if (searchText.trim()) {
        const q = searchText.toLowerCase();
        const matchUser = rev.userName.toLowerCase().includes(q);
        const matchContent = rev.content.toLowerCase().includes(q);
        const matchPlace = rev.placeName.toLowerCase().includes(q);
        if (!matchUser && !matchContent && !matchPlace) return false;
      }

      return true;
    });
  }, [reviewsList, statusFilter, starFilter, searchText]);

  // Filtered Comments
  const filteredComments = useMemo(() => {
    return commentsList.filter((com) => {
      if (statusFilter === "active" && com.status !== "active") return false;
      if (statusFilter === "hidden" && com.status !== "hidden") return false;
      if (statusFilter === "reported" && (com.reportCount || 0) <= 0) return false;

      if (searchText.trim()) {
        const q = searchText.toLowerCase();
        const matchUser = com.userName.toLowerCase().includes(q);
        const matchContent = com.content.toLowerCase().includes(q);
        if (!matchUser && !matchContent) return false;
      }

      return true;
    });
  }, [commentsList, statusFilter, searchText]);

  // Handlers
  const handleToggleReviewStatus = (rev: PlaceReviewItem) => {
    const isCurrentlyActive = rev.status === "active";
    const nextStatus = isCurrentlyActive ? "hidden" : "active";

    setReviewsList((prev) =>
      prev.map((r) => (r.id === rev.id ? { ...r, status: nextStatus } : r))
    );

    addAuditLog(
      isCurrentlyActive ? "Ẩn đánh giá vi phạm" : "Khôi phục hiển thị đánh giá",
      rev.placeName,
      `Đánh giá của ${rev.userName} - ${isCurrentlyActive ? "Tạm ẩn do nghi vấn vi phạm" : "Khôi phục sau xác minh"}`,
      "hide"
    );

    showToast(`Đã ${isCurrentlyActive ? "tạm ẩn" : "khôi phục hiển thị"} đánh giá của "${rev.userName}".`);
  };

  const handleToggleCommentStatus = (com: PlaceCommentItem) => {
    const isCurrentlyActive = com.status === "active";
    const nextStatus = isCurrentlyActive ? "hidden" : "active";

    setCommentsList((prev) =>
      prev.map((c) => (c.id === com.id ? { ...c, status: nextStatus } : c))
    );

    addAuditLog(
      isCurrentlyActive ? "Ẩn bình luận" : "Khôi phục bình luận",
      `Blog #${com.blogId}`,
      `Bình luận của ${com.userName} - ${isCurrentlyActive ? "Tạm ẩn do vi phạm tiêu chuẩn" : "Khôi phục"}`,
      "hide"
    );

    showToast(`Đã ${isCurrentlyActive ? "tạm ẩn" : "khôi phục hiển thị"} bình luận của "${com.userName}".`);
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-150">
      {/* Header & Sub-tab Navigation */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4 text-xs">
        <div>
          <h2 className="font-bold text-base text-slate-900 tracking-tight flex items-center gap-2">
            <MessageSquare className="text-slate-700" size={18} />
            <span>Kiểm duyệt Đánh giá &amp; Bình luận</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Quản lý nội dung tương tác cộng đồng, ngăn chặn hành vi bôi nhọ và spam ảo
          </p>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-slate-100/80 rounded-xl">
          <button
            onClick={() => setRevComTab("reviews")}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-2 ${
              revComTab === "reviews"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <span>Đánh giá địa điểm ({reviewsList.length})</span>
            {reportedReviewsCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[10px] font-extrabold">
                {reportedReviewsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setRevComTab("comments")}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-2 ${
              revComTab === "comments"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <span>Bình luận bài viết ({commentsList.length})</span>
            {reportedCommentsCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[10px] font-extrabold">
                {reportedCommentsCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="relative flex-1 min-w-[260px]">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder={revComTab === "reviews" ? "Tìm theo tên người đánh giá, nội dung, quán..." : "Tìm theo tên người bình luận, nội dung..."}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50/70 text-xs font-medium focus:bg-white focus:border-slate-400 outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white font-semibold text-slate-700 cursor-pointer outline-none hover:border-slate-300"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Đang hiển thị</option>
              <option value="reported">Có báo cáo vi phạm</option>
              <option value="hidden">Đang bị ẩn</option>
            </select>

            {/* Star Filter for Reviews */}
            {revComTab === "reviews" && (
              <select
                value={starFilter}
                onChange={(e) => setStarFilter(e.target.value as any)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white font-semibold text-slate-700 cursor-pointer outline-none hover:border-slate-300"
              >
                <option value="all">Tất cả số sao (★)</option>
                <option value="5">5 Sao (Tuyệt hảo)</option>
                <option value="4">4 Sao (Tốt)</option>
                <option value="3">3 Sao (Bình thường)</option>
                <option value="2">2 Sao (Chưa hài lòng)</option>
                <option value="1">1 Sao (Kém / Nghi vấn bôi nhọ)</option>
              </select>
            )}
          </div>
        </div>
      </div>

      {/* ── 1. REVIEWS VIEW ── */}
      {revComTab === "reviews" && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs divide-y divide-slate-100 text-xs overflow-hidden">
          {filteredReviews.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              Không tìm thấy đánh giá nào phù hợp với bộ lọc.
            </div>
          ) : (
            filteredReviews.map((rev) => {
              const isHidden = rev.status === "hidden";
              const isReported = rev.reportCount > 0;

              return (
                <div
                  key={rev.id}
                  className={`p-5 flex flex-col md:flex-row md:items-start justify-between gap-4 transition-colors ${
                    isHidden ? "bg-slate-50/70 opacity-80" : isReported ? "bg-rose-50/20 hover:bg-rose-50/40" : "hover:bg-slate-50/70"
                  }`}
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
                        <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200/80 font-bold text-[11px] flex items-center gap-1">
                          <Star size={11} fill="currentColor" /> {rev.rating}.0
                        </span>
                        <span className="text-slate-400 text-xs">
                          tại <strong className="text-slate-700">{rev.placeName}</strong> ({rev.province})
                        </span>
                        {isReported && (
                          <span className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold flex items-center gap-1">
                            <AlertTriangle size={10} />
                            {rev.reportCount} lượt báo cáo
                          </span>
                        )}
                        {isHidden && (
                          <span className="px-2 py-0.5 rounded-md bg-slate-200 text-slate-700 font-bold text-[10px]">
                            Đang bị ẩn
                          </span>
                        )}
                      </div>

                      <p className="text-slate-700 leading-relaxed max-w-2xl bg-white/50 p-2 rounded-lg border border-slate-100">
                        {rev.content}
                      </p>

                      {rev.reportReason && (
                        <div className="text-[11px] text-rose-600 font-semibold bg-rose-50 p-2 rounded-lg border border-rose-100 flex items-center gap-1.5">
                          <ShieldAlert size={13} className="shrink-0" />
                          <span>Lý do phản ánh: {rev.reportReason}</span>
                        </div>
                      )}

                      <span className="text-slate-400 text-[11px] block">Thời gian: {rev.createdAt} • Ngày trải nghiệm: {rev.visitDate}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-end md:self-start shrink-0">
                    <button
                      onClick={() => handleToggleReviewStatus(rev)}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-bold cursor-pointer transition-colors flex items-center gap-1.5 ${
                        !isHidden
                          ? "border-slate-200 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 text-slate-600"
                          : "border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-700"
                      }`}
                    >
                      {!isHidden ? <EyeOff size={13} /> : <Eye size={13} />}
                      <span>{!isHidden ? "Tạm ẩn đánh giá" : "Khôi phục hiển thị"}</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* ── 2. COMMENTS VIEW ── */}
      {revComTab === "comments" && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs divide-y divide-slate-100 text-xs overflow-hidden">
          {filteredComments.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              Không tìm thấy bình luận nào phù hợp với bộ lọc.
            </div>
          ) : (
            filteredComments.map((com) => {
              const isHidden = com.status === "hidden";
              return (
                <div
                  key={com.id}
                  className={`p-5 flex flex-col md:flex-row md:items-start justify-between gap-4 transition-colors ${
                    isHidden ? "bg-slate-50/70 opacity-80" : "hover:bg-slate-50/70"
                  }`}
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
                        {isHidden && (
                          <span className="px-2 py-0.5 rounded-md bg-slate-200 text-slate-700 font-bold text-[10px]">
                            Đã ẩn
                          </span>
                        )}
                      </div>
                      <p className="text-slate-700 leading-relaxed max-w-2xl bg-white/50 p-2 rounded-lg border border-slate-100">
                        {com.content}
                      </p>
                      <span className="text-slate-400 text-[11px] block">{com.createdAt}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end md:self-start shrink-0">
                    <button
                      onClick={() => handleToggleCommentStatus(com)}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-bold cursor-pointer transition-colors flex items-center gap-1.5 ${
                        !isHidden
                          ? "border-slate-200 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 text-slate-600"
                          : "border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-700"
                      }`}
                    >
                      {!isHidden ? <EyeOff size={13} /> : <Eye size={13} />}
                      <span>{!isHidden ? "Ẩn bình luận" : "Hiện lại"}</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
