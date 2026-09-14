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
  Compass,
  List,
  Flame,
  Check,
  Tag,
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

  const otherArticles = articles.filter(
    (a) => a.id !== (selectedArticle?.id || 1)
  );

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

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
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
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased pb-24 font-sans">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-semibold animate-in slide-in-from-bottom-5 border border-slate-700">
          <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════
          VIEW 1: FEED & MAGAZINE BANNER
          ═══════════════════════════════════════════════════════════════════════ */}
      {viewMode === "feed" && (
        <div className="space-y-12">
          {/* Sub Navigation Bar */}
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

          {/* ── FULL-WIDTH HERO BANNER ── */}
          <div className="relative overflow-hidden bg-gradient-to-r from-emerald-950 via-[#064E3B] to-slate-950 text-white pt-14 pb-20 px-4 sm:px-6 text-center">
            {/* Background Image with Overlay */}
            <img
              src="https://images.unsplash.com/photo-1505474975305-453b4ac9b972?w=1800&h=700&fit=crop&auto=format"
              alt="Vietnam Travel Blog"
              className="absolute inset-0 w-full h-full object-cover opacity-25 scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-emerald-950/65 to-emerald-950/75"></div>

            <div className="relative z-10 max-w-4xl mx-auto space-y-3.5">
              {/* Badge */}
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[11px] sm:text-xs font-semibold backdrop-blur-md">
                <Sparkles size={13} className="text-emerald-400" />
                <span>CẨM NANG & KINH NGHIỆM DU LỊCH</span>
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight font-serif-title">
                Khám Phá Việt Nam Qua Từng Trang Viết
              </h1>

              {/* Subtitle */}
              <p className="text-xs sm:text-sm text-slate-200 max-w-xl mx-auto font-normal leading-relaxed">
                Những câu chuyện chân thực, kinh nghiệm thực tế và cẩm nang văn hóa ẩm thực từ cộng đồng xê dịch.
              </p>

              {/* Search Bar */}
              <div className="pt-3 max-w-2xl mx-auto">
                <div className="bg-white rounded-2xl p-2 sm:p-2.5 shadow-2xl flex items-center gap-2 border border-slate-200">
                  <Search className="ml-2 text-slate-400 flex-shrink-0" size={18} />
                  <input
                    type="text"
                    placeholder="Tìm bài viết, địa điểm, kinh nghiệm (Phở Hà Nội, Hội An, Săn mây Đà Lạt)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full text-slate-800 text-xs sm:text-sm outline-none px-2 py-1 placeholder:text-slate-400"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="text-xs text-slate-400 hover:text-slate-600 px-2 cursor-pointer"
                    >
                      Xóa
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ── OVERLAPPING CATEGORY & SEARCH BAR ── */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-8 relative z-10">
            <div className="bg-white rounded-2xl p-3 sm:p-4 shadow-lg border border-slate-200 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
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

              <span className="text-xs text-slate-500 font-medium hidden md:inline-block">
                Hiển thị <b className="text-slate-800">{filteredArticles.length}</b> bài viết
              </span>
            </div>
          </div>

          {/* ── FEATURED SPOTLIGHT ARTICLE ── */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-0">
              {/* Left Column: Story Content */}
              <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-800 text-white text-xs font-bold shadow-xs">
                      <Sparkles size={12} className="text-amber-300" />
                      <span>Bài viết tiêu điểm</span>
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
                      {featuredArticle.category}
                    </span>
                  </div>

                  <h2
                    onClick={() => handleOpenArticle(featuredArticle)}
                    className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 leading-snug tracking-tight font-serif-title hover:text-emerald-800 transition-colors cursor-pointer"
                  >
                    {featuredArticle.title}
                  </h2>

                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed line-clamp-3">
                    {featuredArticle.excerpt || featuredArticle.subtitle}
                  </p>
                </div>

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

              {/* Right Column: Photo */}
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
              </div>
            </div>
          </div>

          {/* ── ARTICLES GRID ── */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.map((art) => {
                const isSaved = savedArticles.has(art.id);
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
          VIEW 2: INSIDE ARTICLE (READER VIEW - 2-COLUMN EDITORIAL WITH RICH SIDEBAR)
          ═══════════════════════════════════════════════════════════════════════ */}
      {viewMode === "reader" && selectedArticle && (
        <div className="bg-white min-h-screen">
          {/* Reading Progress Bar */}
          <div
            className="fixed top-0 left-0 h-1 bg-emerald-600 z-50 transition-all duration-100"
            style={{ width: `${readProgress}%` }}
          />

          {/* Reader Sticky Header */}
          <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
            <div className="max-w-7xl mx-auto h-14 px-4 sm:px-6 flex items-center justify-between">
              <button
                onClick={() => {
                  setViewMode("feed");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="flex items-center gap-1.5 text-slate-700 hover:text-emerald-800 font-bold text-xs sm:text-sm transition-colors cursor-pointer"
              >
                <ArrowLeft size={16} /> Quay lại cẩm nang
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

          {/* ── 2-COLUMN MAIN CONTENT & SIDEBAR WRAPPER ── */}
          <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              {/* ══ LEFT MAIN ARTICLE CONTENT (8 COLS) ══ */}
              <div className="lg:col-span-8 space-y-8 min-w-0">
                {/* Article Header Meta */}
                <div className="space-y-4">
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

                {/* Author Strip */}
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

                {/* Featured Cover Photo */}
                <div className="rounded-3xl overflow-hidden shadow-md border border-slate-200 bg-slate-100">
                  <img
                    src={selectedArticle.coverImg}
                    alt={selectedArticle.title}
                    className="w-full max-h-[480px] object-cover"
                  />
                </div>

                {/* Article Content Sections */}
                <div className="space-y-8 text-base text-slate-800 leading-relaxed font-normal pt-2">
                  {selectedArticle.sections.map((sec, idx) => (
                    <section key={sec.id} id={sec.id} className="space-y-4 scroll-mt-20">
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

                {/* Author Profile Footer Box */}
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

                  {/* Reaction Buttons */}
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
              </div>

              {/* ══ RIGHT STICKY SIDEBAR (4 COLS - COOL & USEFUL WIDGETS) ══ */}
              <aside className="lg:col-span-4 space-y-6 sticky top-20">
                {/* 1. MỤC LỤC BÀI VIẾT (TABLE OF CONTENTS) */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-xs font-bold text-slate-900">
                    <List size={15} className="text-emerald-800" />
                    <span>Mục lục bài viết</span>
                  </div>
                  <nav className="space-y-1 text-xs">
                    {selectedArticle.sections.map((sec, i) => (
                      <button
                        key={sec.id}
                        onClick={() => scrollToSection(sec.id)}
                        className="w-full text-left py-1.5 px-2.5 rounded-lg text-slate-600 hover:text-emerald-900 hover:bg-emerald-50 transition-colors flex items-start gap-2 cursor-pointer font-medium"
                      >
                        <span className="text-[10px] text-emerald-700 font-bold mt-0.5">
                          0{i + 1}
                        </span>
                        <span className="line-clamp-1">{sec.heading.replace(/^\d+\.\s*/, "")}</span>
                      </button>
                    ))}
                  </nav>
                </div>

                {/* 2. TỌA ĐỘ NHẮC ĐẾN TRONG BÀI (FEATURED PLACES) */}
                {selectedArticle.mentionedPlaces &&
                  selectedArticle.mentionedPlaces.length > 0 && (
                    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                          <MapPin size={15} className="text-emerald-800" />
                          <span>Tọa độ trong bài</span>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-bold">
                          {selectedArticle.mentionedPlaces.length} điểm
                        </span>
                      </div>

                      <div className="space-y-2.5">
                        {selectedArticle.mentionedPlaces.map((pl, i) => (
                          <div
                            key={i}
                            className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 transition-colors flex flex-col justify-between gap-2"
                          >
                            <div>
                              <span className="text-[9px] font-bold text-emerald-800 uppercase tracking-wider">
                                {pl.category}
                              </span>
                              <h4 className="font-bold text-xs text-slate-900 mt-0.5">
                                {pl.name}
                              </h4>
                              <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
                                <MapPin size={10} className="text-slate-400" /> {pl.province}
                              </p>
                            </div>

                            <div className="flex items-center justify-between pt-1 text-[11px]">
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
                                    showToast(`Tọa độ: ${pl.name} (${pl.province})`);
                                  }
                                }}
                                className="font-bold text-emerald-800 hover:underline cursor-pointer flex items-center gap-0.5"
                              >
                                <span>Xem chi tiết</span>
                                <ChevronRight size={12} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                {/* 3. BÀI VIẾT GỢI Ý ĐỌC TIẾP (TRENDING READS) */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-xs font-bold text-slate-900">
                    <Flame size={15} className="text-amber-500" />
                    <span>Bài viết đề xuất</span>
                  </div>

                  <div className="space-y-3">
                    {otherArticles.slice(0, 3).map((art) => (
                      <div
                        key={art.id}
                        onClick={() => handleOpenArticle(art)}
                        className="group flex items-center gap-3 cursor-pointer p-1.5 rounded-xl hover:bg-slate-50 transition-colors"
                      >
                        <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-slate-100">
                          <img
                            src={art.coverImg}
                            alt={art.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-[10px] font-bold text-emerald-800">
                            {art.category}
                          </span>
                          <h4 className="font-bold text-xs text-slate-900 group-hover:text-emerald-800 transition-colors line-clamp-2 leading-snug">
                            {art.title}
                          </h4>
                          <span className="text-[10px] text-slate-400 mt-0.5 block">
                            {art.readTimeMinutes} phút đọc
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 4. HỘP GỢI Ý LÊN LỊCH TRÌNH (TRIP PLANNER PROMO) */}
                <div className="bg-gradient-to-br from-emerald-900 to-slate-900 text-white rounded-2xl p-5 shadow-md space-y-3 border border-emerald-800">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                    <Compass size={12} className="text-amber-300" />
                    <span>Lên kế hoạch du lịch</span>
                  </div>
                  <h4 className="text-sm font-bold leading-snug font-serif-title">
                    Tự tay tạo lịch trình phượt hoàn hảo?
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed font-normal">
                    Tính toán chi phí, sắp xếp điểm dừng theo từng ngày và rủ bạn bè đồng hành ngay hôm nay.
                  </p>
                  <button
                    onClick={() => {
                      setViewMode("feed");
                      if (onBack) onBack();
                    }}
                    className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                  >
                    Khám phá Lịch trình mẫu
                  </button>
                </div>
              </aside>
            </div>
          </main>
        </div>
      )}
    </div>
  );
}
