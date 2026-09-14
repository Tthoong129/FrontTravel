import React, { useState, useEffect } from "react";
import {
  MapPin,
  Search,
  Heart,
  Bookmark,
  Eye,
  Clock,
  Share2,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  Send,
  CheckCircle2,
  ChevronRight,
  BookOpen,
  User,
  Calendar,
  MessageSquare,
  ThumbsUp,
} from "lucide-react";
import { BlogArticleItem, initialBlogArticles, Place, places } from "./data";

export interface BlogPageProps {
  onBack?: () => void;
  onSelectPlace?: (place: Place) => void;
}

export default function BlogPage({ onBack, onSelectPlace }: BlogPageProps) {
  const [articles, setArticles] = useState<BlogArticleItem[]>(initialBlogArticles);
  const [selectedArticleId, setSelectedArticleId] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<"feed" | "reader">("feed");
  const [selectedCategory, setSelectedCategory] = useState<string>("Tất cả");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [likedArticles, setLikedArticles] = useState<Set<number>>(new Set());
  const [savedArticles, setSavedArticles] = useState<Set<number>>(new Set([1]));
  const [toastMsg, setToastMsg] = useState("");
  const [readProgress, setReadProgress] = useState(0);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 2800);
  };

  const selectedArticle =
    articles.find((a) => a.id === selectedArticleId) || articles[0];
  const featuredArticle =
    articles.find((a) => a.isFeatured) || articles[0];

  const handleOpenArticle = (article: BlogArticleItem) => {
    setSelectedArticleId(article.id);
    setViewMode("reader");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleLike = (id: number, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setLikedArticles((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        showToast("Đã bỏ thích bài viết.");
      } else {
        next.add(id);
        showToast("Đã thích bài viết!");
      }
      return next;
    });
  };

  const toggleSave = (id: number, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSavedArticles((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        showToast("Đã bỏ lưu bài viết khỏi bộ sưu tập.");
      } else {
        next.add(id);
        showToast("Đã lưu bài viết vào cẩm nang!");
      }
      return next;
    });
  };

  const handleShare = (article: BlogArticleItem, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast("Đã sao chép liên kết bài viết!");
    } else {
      showToast("Đã sẵn sàng chia sẻ bài viết!");
    }
  };

  // Track reading scroll progress
  useEffect(() => {
    if (viewMode !== "reader") return;
    const handleScroll = () => {
      const total =
        document.documentElement.scrollHeight - window.innerHeight;
      if (total > 0) {
        const current = window.scrollY;
        setReadProgress(Math.min(100, Math.round((current / total) * 100)));
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [viewMode]);

  const filteredArticles = articles.filter((a) => {
    const matchesCat =
      selectedCategory === "Tất cả" || a.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !q ||
      a.title.toLowerCase().includes(q) ||
      a.subtitle.toLowerCase().includes(q) ||
      a.authorName.toLowerCase().includes(q);
    return matchesCat && matchesQuery;
  });

  const categories = [
    "Tất cả",
    "Ẩm thực",
    "Kinh nghiệm",
    "Khám phá",
    "Lịch trình",
    "Văn hóa",
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased pb-24">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-semibold animate-in slide-in-from-bottom-5 border border-slate-700">
          <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════
          VIEW 1: FEED & MAGAZINE COVER
          ═══════════════════════════════════════════════════════════════════════ */}
      {viewMode === "feed" && (
        <div className="space-y-10">
          {/* Top Bar Navigation */}
          <div className="bg-white border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {onBack && (
                  <button
                    onClick={onBack}
                    className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    <ArrowLeft size={16} />
                  </button>
                )}
                <div className="inline-flex items-center gap-2">
                  <BookOpen size={16} className="text-emerald-800" />
                  <span className="text-sm font-bold text-slate-900">
                    Cẩm Nang & Câu Chuyện Du Lịch
                  </span>
                </div>
              </div>

              <div className="text-xs text-slate-500 hidden sm:block">
                <span>Khám phá các góc nhìn chân thực từ người bản xứ</span>
              </div>
            </div>
          </div>

          {/* ── MAGAZINE HERO BANNER (BALANCED 2-COLUMN EDITORIAL) ── */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-0">
              {/* Left Column: Story Content */}
              <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  {/* Badge */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-800 text-white text-xs font-bold shadow-xs">
                      <Sparkles size={12} className="text-amber-300" />
                      <span>Bài viết tiêu điểm</span>
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
                      {featuredArticle.category}
                    </span>
                  </div>

                  {/* Title */}
                  <h1
                    onClick={() => handleOpenArticle(featuredArticle)}
                    className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 leading-snug tracking-tight font-serif-title hover:text-emerald-800 transition-colors cursor-pointer"
                  >
                    {featuredArticle.title}
                  </h1>

                  {/* Excerpt */}
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed line-clamp-3">
                    {featuredArticle.excerpt || featuredArticle.subtitle}
                  </p>
                </div>

                {/* Author Strip & Action Buttons */}
                <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={featuredArticle.authorAvatar}
                      alt={featuredArticle.authorName}
                      className="w-10 h-10 rounded-full object-cover border border-slate-200"
                    />
                    <div>
                      <p className="text-xs font-bold text-slate-900">
                        {featuredArticle.authorName}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {featuredArticle.publishDate} · {featuredArticle.readTimeMinutes} phút đọc
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={() => handleOpenArticle(featuredArticle)}
                      className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 active:scale-95 text-white font-bold text-xs rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Đọc bài viết</span>
                      <ArrowRight size={14} />
                    </button>
                    <button
                      onClick={(e) => toggleSave(featuredArticle.id, e)}
                      className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                        savedArticles.has(featuredArticle.id)
                          ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                          : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                      }`}
                      title="Lưu bài viết"
                    >
                      <Bookmark
                        size={15}
                        className={savedArticles.has(featuredArticle.id) ? "fill-emerald-800" : ""}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column: High Quality Image */}
              <div
                onClick={() => handleOpenArticle(featuredArticle)}
                className="lg:col-span-5 relative min-h-[260px] lg:min-h-full overflow-hidden bg-slate-100 cursor-pointer group"
              >
                <img
                  src={featuredArticle.coverImg}
                  alt={featuredArticle.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                <div className="absolute bottom-3 right-3">
                  <span className="px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-sm text-white text-[11px] font-semibold">
                    Xem ảnh đầy đủ
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ── SEARCH & CATEGORY BAR ── */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="bg-white rounded-2xl p-3 sm:p-4 shadow-md border border-slate-200 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 md:pb-0">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      selectedCategory === cat
                        ? "bg-emerald-800 text-white font-bold shadow-xs"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Search Box */}
              <div className="relative min-w-[260px]">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  placeholder="Tìm kiếm bài viết, chủ đề..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-600 focus:bg-white text-slate-800 placeholder:text-slate-400"
                />
              </div>
            </div>
          </div>

          {/* ── ARTICLES GRID ── */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.map((art) => {
                const isSaved = savedArticles.has(art.id);
                const isLiked = likedArticles.has(art.id);
                return (
                  <article
                    key={art.id}
                    onClick={() => handleOpenArticle(art)}
                    className="group bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-emerald-600/40 hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col h-full hover:-translate-y-1"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                      <img
                        src={art.coverImg}
                        alt={art.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="px-2.5 py-1 bg-white/95 backdrop-blur-sm text-slate-900 text-[10px] font-bold rounded-md shadow-xs">
                          {art.category}
                        </span>
                      </div>
                      <div className="absolute top-3 right-3">
                        <button
                          onClick={(e) => toggleSave(art.id, e)}
                          className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm transition-all cursor-pointer ${
                            isSaved
                              ? "bg-emerald-800 text-white"
                              : "bg-black/40 text-white hover:bg-black/60"
                          }`}
                        >
                          <Bookmark
                            size={14}
                            className={isSaved ? "fill-white" : ""}
                          />
                        </button>
                      </div>
                    </div>

                    <div className="p-5 flex flex-col flex-1 justify-between">
                      <div>
                        <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug group-hover:text-emerald-800 transition-colors line-clamp-2 mb-2 font-serif-title">
                          {art.title}
                        </h3>
                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">
                          {art.excerpt || art.subtitle}
                        </p>
                      </div>

                      <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 mt-auto">
                        <div className="flex items-center gap-2">
                          <img
                            src={art.authorAvatar}
                            alt={art.authorName}
                            className="w-6 h-6 rounded-full object-cover"
                          />
                          <span className="font-semibold text-slate-800 truncate max-w-[120px]">
                            {art.authorName}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                          <Clock size={12} /> {art.readTimeMinutes} phút đọc
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════
          VIEW 2: INSIDE ARTICLE (READER VIEW - EDITORIAL MAGAZINE STYLE)
          ═══════════════════════════════════════════════════════════════════════ */}
      {viewMode === "reader" && selectedArticle && (
        <div className="bg-white min-h-screen">
          {/* Reading Progress Indicator */}
          <div
            className="fixed top-0 left-0 h-1 bg-emerald-600 z-50 transition-all duration-100"
            style={{ width: `${readProgress}%` }}
          />

          {/* Reader Sticky Header */}
          <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
            <div className="max-w-4xl mx-auto h-14 px-4 flex items-center justify-between">
              <button
                onClick={() => {
                  setViewMode("feed");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="flex items-center gap-1.5 text-slate-700 hover:text-emerald-800 font-bold text-xs sm:text-sm transition-colors cursor-pointer"
              >
                <ArrowLeft size={16} /> Quay lại danh sách bài viết
              </button>

              <div className="flex items-center gap-2 text-slate-500">
                <button
                  onClick={(e) => toggleLike(selectedArticle.id, e)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all cursor-pointer ${
                    likedArticles.has(selectedArticle.id)
                      ? "bg-red-50 text-red-600 border-red-200"
                      : "hover:bg-slate-50 border-slate-200 text-slate-600"
                  }`}
                >
                  <Heart
                    size={14}
                    className={
                      likedArticles.has(selectedArticle.id) ? "fill-red-600" : ""
                    }
                  />
                  <span>
                    {selectedArticle.likesCount +
                      (likedArticles.has(selectedArticle.id) ? 1 : 0)}
                  </span>
                </button>

                <button
                  onClick={(e) => toggleSave(selectedArticle.id, e)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all cursor-pointer ${
                    savedArticles.has(selectedArticle.id)
                      ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                      : "hover:bg-slate-50 border-slate-200 text-slate-600"
                  }`}
                >
                  <Bookmark
                    size={14}
                    className={
                      savedArticles.has(selectedArticle.id)
                        ? "fill-emerald-800"
                        : ""
                    }
                  />
                  <span>
                    {savedArticles.has(selectedArticle.id) ? "Đã lưu" : "Lưu bài"}
                  </span>
                </button>

                <button
                  onClick={(e) => handleShare(selectedArticle, e)}
                  className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer"
                  title="Chia sẻ bài viết"
                >
                  <Share2 size={15} />
                </button>
              </div>
            </div>
          </div>

          {/* Article Container */}
          <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-8">
            {/* Header Meta */}
            <div className="space-y-4 text-center sm:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold">
                <span>{selectedArticle.category}</span>
                <span>•</span>
                <span>{selectedArticle.publishDate}</span>
              </div>

              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight tracking-tight font-serif-title">
                {selectedArticle.title}
              </h1>

              {selectedArticle.subtitle && (
                <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
                  {selectedArticle.subtitle}
                </p>
              )}
            </div>

            {/* Author Profile Strip */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 border-y border-slate-200">
              <div className="flex items-center gap-3">
                <img
                  src={selectedArticle.authorAvatar}
                  alt={selectedArticle.authorName}
                  className="w-12 h-12 rounded-full object-cover border border-slate-200"
                />
                <div>
                  <h4 className="font-bold text-sm text-slate-900">
                    {selectedArticle.authorName}
                  </h4>
                  <p className="text-xs text-slate-500">
                    {selectedArticle.authorRole || "Tác giả chia sẻ"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs font-semibold text-slate-500">
                <span className="flex items-center gap-1">
                  <Clock size={14} /> {selectedArticle.readTimeMinutes} phút đọc
                </span>
                <span className="flex items-center gap-1">
                  <Eye size={14} /> {selectedArticle.viewsCount.toLocaleString()} lượt đọc
                </span>
              </div>
            </div>

            {/* Main Featured Photo */}
            <div className="rounded-2xl overflow-hidden shadow-md border border-slate-200 bg-slate-100">
              <img
                src={selectedArticle.coverImg}
                alt={selectedArticle.title}
                className="w-full max-h-[480px] object-cover"
              />
            </div>

            {/* Article Content Body */}
            <div className="space-y-8 text-base text-slate-800 leading-relaxed font-normal pt-4">
              {selectedArticle.sections.map((sec) => (
                <section key={sec.id} className="space-y-4">
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-8 mb-3 font-serif-title">
                    {sec.heading}
                  </h2>
                  <p className="text-justify text-slate-700 leading-relaxed text-[16px] sm:text-[17px]">
                    {sec.content}
                  </p>

                  {/* Tip Highlight Box */}
                  {sec.highlightTip && (
                    <div className="p-4 sm:p-5 bg-emerald-50/80 border-l-4 border-emerald-800 rounded-r-2xl text-emerald-950 text-xs sm:text-sm my-4">
                      <span className="font-bold block mb-1 text-emerald-900 flex items-center gap-1.5">
                        <Sparkles size={14} className="text-amber-500" />
                        <span>Kinh nghiệm từ thổ địa:</span>
                      </span>
                      <p className="leading-relaxed">{sec.highlightTip}</p>
                    </div>
                  )}

                  {/* High Quality Photo Figure */}
                  {sec.image && (
                    <figure className="my-6">
                      <img
                        src={sec.image}
                        alt=""
                        className="w-full rounded-2xl object-cover max-h-[440px] shadow-sm border border-slate-200"
                        loading="lazy"
                      />
                      {sec.imageCaption && (
                        <figcaption className="text-center text-xs text-slate-500 mt-2 italic">
                          {sec.imageCaption}
                        </figcaption>
                      )}
                    </figure>
                  )}
                </section>
              ))}
            </div>

            {/* Mentioned Places Section */}
            {selectedArticle.mentionedPlaces &&
              selectedArticle.mentionedPlaces.length > 0 && (
                <div className="mt-12 p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <MapPin size={18} className="text-emerald-800" />
                    <span>Tọa độ được nhắc đến trong bài viết</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedArticle.mentionedPlaces.map((pl, i) => (
                      <div
                        key={i}
                        className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between"
                      >
                        <div>
                          <span className="text-[10px] font-bold text-emerald-800 uppercase">
                            {pl.category}
                          </span>
                          <h4 className="font-bold text-sm text-slate-900 mt-0.5">
                            {pl.name}
                          </h4>
                          <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                            <MapPin size={11} /> {pl.province}
                          </p>
                        </div>

                        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                          <span className="font-bold text-amber-600">★ {pl.rating}</span>
                          <button
                            onClick={() => {
                              const found = places.find(
                                (p) =>
                                  p.name
                                    .toLowerCase()
                                    .includes(pl.name.toLowerCase()) ||
                                  pl.name
                                    .toLowerCase()
                                    .includes(p.name.toLowerCase())
                              );
                              if (found && onSelectPlace) {
                                onSelectPlace(found);
                              } else {
                                showToast(`Địa điểm: ${pl.name}`);
                              }
                            }}
                            className="text-xs font-bold text-emerald-800 hover:underline cursor-pointer"
                          >
                            Xem chi tiết →
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {/* Bottom Engagement & Author Footer */}
            <div className="pt-8 border-t border-slate-200 space-y-6">
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 flex flex-col sm:flex-row items-center gap-4">
                <img
                  src={selectedArticle.authorAvatar}
                  alt={selectedArticle.authorName}
                  className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm"
                />
                <div className="space-y-1 text-center sm:text-left flex-1">
                  <h4 className="font-bold text-base text-slate-900">
                    {selectedArticle.authorName}
                  </h4>
                  <p className="text-xs text-slate-500">
                    {selectedArticle.authorRole || "Thành viên cộng đồng LangThang"}
                  </p>
                  <p className="text-xs text-slate-600 pt-1">
                    Cảm ơn bạn đã đọc bài viết! Hãy lưu lại cẩm nang hoặc chia sẻ cho bạn bè cùng chuyến đi nhé.
                  </p>
                </div>
              </div>

              {/* Action Buttons Footer */}
              <div className="flex items-center justify-center gap-4 pt-2">
                <button
                  onClick={(e) => toggleLike(selectedArticle.id, e)}
                  className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 border transition-all cursor-pointer ${
                    likedArticles.has(selectedArticle.id)
                      ? "bg-red-50 text-red-600 border-red-200"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <Heart
                    size={16}
                    className={
                      likedArticles.has(selectedArticle.id) ? "fill-red-600" : ""
                    }
                  />
                  <span>
                    Thích bài viết (
                    {selectedArticle.likesCount +
                      (likedArticles.has(selectedArticle.id) ? 1 : 0)}
                    )
                  </span>
                </button>

                <button
                  onClick={(e) => toggleSave(selectedArticle.id, e)}
                  className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 border transition-all cursor-pointer ${
                    savedArticles.has(selectedArticle.id)
                      ? "bg-emerald-800 text-white border-emerald-800"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <Bookmark
                    size={16}
                    className={
                      savedArticles.has(selectedArticle.id) ? "fill-white" : ""
                    }
                  />
                  <span>
                    {savedArticles.has(selectedArticle.id)
                      ? "Đã lưu vào cẩm nang"
                      : "Lưu vào cẩm nang"}
                  </span>
                </button>
              </div>
            </div>
          </main>
        </div>
      )}
    </div>
  );
}
