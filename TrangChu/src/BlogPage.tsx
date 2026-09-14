import React, { useState } from "react";
import {
  MapPin,
  ChevronRight,
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
} from "lucide-react";
import { BlogArticleItem, initialBlogArticles, Place } from "./data";

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
  const [savedArticles, setSavedArticles] = useState<Set<number>>(new Set());

  const selectedArticle =
    articles.find((a) => a.id === selectedArticleId) || articles[0];
  const featuredArticle =
    articles.find((a) => a.isFeatured) || articles[0];

  const handleOpenArticle = (article: BlogArticleItem) => {
    setSelectedArticleId(article.id);
    setViewMode("reader");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleLike = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedArticles((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSave = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedArticles((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const filteredArticles = articles.filter((a) => {
    const matchesCat =
      selectedCategory === "Tất cả" || a.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !q ||
      a.title.toLowerCase().includes(q) ||
      a.subtitle.toLowerCase().includes(q);
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
      {/* ── 1. FEED VIEW ── */}
      {viewMode === "feed" && (
        <div>
          {/* Featured Editorial Hero */}
          <div className="relative w-full h-[480px] sm:h-[560px] overflow-hidden bg-slate-950 flex flex-col justify-end p-6 sm:p-12">
            {featuredArticle && (
              <img
                src={featuredArticle.coverImg}
                className="absolute inset-0 w-full h-full object-cover opacity-60 scale-105"
                alt=""
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent"></div>

            {/* Back Button & Top Bar */}
            <div className="absolute top-0 inset-x-0 p-4 sm:p-6 z-20 flex items-center justify-between">
              {onBack && (
                <button
                  onClick={onBack}
                  className="px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-xl text-white text-xs font-semibold transition-colors cursor-pointer"
                >
                  ← Trở về
                </button>
              )}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold backdrop-blur-md">
                <Sparkles size={13} className="text-amber-400" />
                <span>Cẩm Nang & Câu Chuyện Du Lịch</span>
              </div>
            </div>

            {/* Hero Main Content */}
            <div className="relative z-10 max-w-4xl space-y-4">
              <span className="inline-block px-3 py-1 bg-emerald-700 text-white text-xs font-bold uppercase rounded-lg">
                Bài viết tiêu điểm
              </span>
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight font-serif-title">
                {featuredArticle.title}
              </h1>
              <p className="text-xs sm:text-base text-slate-300 line-clamp-2 max-w-2xl font-normal">
                {featuredArticle.excerpt || featuredArticle.subtitle}
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => handleOpenArticle(featuredArticle)}
                  className="px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs sm:text-sm transition-all shadow-lg flex items-center gap-2 cursor-pointer"
                >
                  Đọc toàn bộ bài viết <ArrowRight size={15} />
                </button>
                <span className="text-xs text-slate-300 flex items-center gap-1.5">
                  <Clock size={14} /> {featuredArticle.readTimeMinutes} phút đọc · Bởi {featuredArticle.authorName}
                </span>
              </div>
            </div>
          </div>

          {/* Search Box Overlapping Hero */}
          <div className="max-w-4xl mx-auto px-4 relative -mt-6 z-20">
            <div className="bg-white rounded-2xl shadow-xl p-3 flex flex-col sm:flex-row items-center gap-2 border border-slate-200">
              <div className="relative flex-1 w-full">
                <Search
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Tìm cẩm nang, kinh nghiệm phượt, món ngon (Hà Giang, Đà Lạt, Cà phê...)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-emerald-600 focus:bg-white rounded-xl text-xs sm:text-sm outline-none transition-colors"
                />
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => setSearchQuery("")}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl cursor-pointer"
                >
                  Đặt lại
                </button>
              </div>
            </div>
          </div>

          {/* Categories Tab Bar */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 pb-6">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all border cursor-pointer ${
                    selectedCategory === cat
                      ? "bg-emerald-900 text-white border-emerald-900 shadow-sm"
                      : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:text-slate-900"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Articles Grid */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.map((art) => (
                <div
                  key={art.id}
                  onClick={() => handleOpenArticle(art)}
                  className="group bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-emerald-600/40 hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col h-full"
                >
                  <div className="relative h-52 overflow-hidden bg-slate-100">
                    <img
                      src={art.coverImg}
                      alt={art.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 bg-white/95 backdrop-blur-sm text-slate-900 text-[11px] font-bold rounded-lg shadow-sm">
                        {art.category}
                      </span>
                    </div>
                    <div className="absolute top-3 right-3 flex items-center gap-1.5">
                      <button
                        onClick={(e) => toggleLike(art.id, e)}
                        className={`w-8 h-8 flex items-center justify-center backdrop-blur-md rounded-full transition-all cursor-pointer ${
                          likedArticles.has(art.id)
                            ? "bg-red-500 text-white"
                            : "bg-black/40 text-white hover:bg-black/60"
                        }`}
                      >
                        <Heart size={14} className={likedArticles.has(art.id) ? "fill-white" : ""} />
                      </button>
                      <button
                        onClick={(e) => toggleSave(art.id, e)}
                        className={`w-8 h-8 flex items-center justify-center backdrop-blur-md rounded-full transition-all cursor-pointer ${
                          savedArticles.has(art.id)
                            ? "bg-emerald-600 text-white"
                            : "bg-black/40 text-white hover:bg-black/60"
                        }`}
                      >
                        <Bookmark size={14} className={savedArticles.has(art.id) ? "fill-white" : ""} />
                      </button>
                    </div>
                  </div>

                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug group-hover:text-emerald-800 transition-colors line-clamp-2 mb-2 font-serif-title">
                      {art.title}
                    </h3>
                    <p className="text-slate-500 text-xs sm:text-sm line-clamp-2 mb-4">
                      {art.excerpt || art.subtitle}
                    </p>

                    <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-3.5">
                      <div className="flex items-center gap-2">
                        <img
                          src={art.authorAvatar}
                          alt={art.authorName}
                          className="w-7 h-7 rounded-full object-cover"
                        />
                        <span className="text-xs font-semibold text-slate-800">
                          {art.authorName}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] font-medium text-slate-400">
                        <Clock size={12} /> {art.readTimeMinutes} phút đọc
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── 2. READER MODE ── */}
      {viewMode === "reader" && selectedArticle && (
        <div className="bg-white min-h-screen">
          {/* Reader Sticky Header */}
          <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
            <div className="max-w-4xl mx-auto h-14 px-4 flex items-center justify-between">
              <button
                onClick={() => setViewMode("feed")}
                className="flex items-center gap-1.5 text-slate-700 hover:text-emerald-800 font-semibold text-xs sm:text-sm transition-colors cursor-pointer"
              >
                <ArrowLeft size={16} /> Quay lại danh sách bài viết
              </button>
              <div className="flex items-center gap-2 text-slate-500">
                <button
                  onClick={(e) => toggleLike(selectedArticle.id, e)}
                  className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1 border transition-colors cursor-pointer ${
                    likedArticles.has(selectedArticle.id)
                      ? "bg-red-50 text-red-600 border-red-200"
                      : "hover:bg-slate-50 border-slate-200 text-slate-600"
                  }`}
                >
                  <Heart size={15} className={likedArticles.has(selectedArticle.id) ? "fill-red-600" : ""} />
                  <span>{selectedArticle.likesCount + (likedArticles.has(selectedArticle.id) ? 1 : 0)}</span>
                </button>
                <button
                  onClick={(e) => toggleSave(selectedArticle.id, e)}
                  className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1 border transition-colors cursor-pointer ${
                    savedArticles.has(selectedArticle.id)
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "hover:bg-slate-50 border-slate-200 text-slate-600"
                  }`}
                >
                  <Bookmark size={15} className={savedArticles.has(selectedArticle.id) ? "fill-emerald-700" : ""} />
                  <span>{savedArticles.has(selectedArticle.id) ? "Đã lưu" : "Lưu bài"}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Reader Hero Banner */}
          <div className="relative w-full h-[320px] sm:h-[420px] bg-slate-900">
            <img
              src={selectedArticle.coverImg}
              className="w-full h-full object-cover opacity-70"
              alt=""
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
            <div className="absolute inset-0 flex items-end p-6 sm:p-12">
              <div className="max-w-3xl space-y-3">
                <span className="px-3 py-1 bg-emerald-700 text-white text-xs font-bold uppercase rounded-lg inline-block">
                  {selectedArticle.category}
                </span>
                <h1 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight font-serif-title">
                  {selectedArticle.title}
                </h1>
              </div>
            </div>
          </div>

          {/* Reader Main Content */}
          <div className="max-w-3xl mx-auto px-4 py-10">
            {/* Author Meta Strip */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 border-b border-slate-200 mb-8">
              <div className="flex items-center gap-3">
                <img
                  src={selectedArticle.authorAvatar}
                  className="w-11 h-11 rounded-full object-cover"
                  alt=""
                />
                <div>
                  <h4 className="font-bold text-sm text-slate-900">
                    {selectedArticle.authorName}
                  </h4>
                  <p className="text-xs text-slate-500">
                    {selectedArticle.publishDate} · {selectedArticle.readTimeMinutes} phút đọc
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs font-semibold text-slate-500">
                <span className="flex items-center gap-1">
                  <Eye size={14} /> {selectedArticle.viewsCount.toLocaleString()} lượt xem
                </span>
                <span className="flex items-center gap-1">
                  <Heart size={14} /> {selectedArticle.likesCount} yêu thích
                </span>
              </div>
            </div>

            {/* Article Content Sections */}
            <div className="space-y-8 text-base text-slate-800 leading-relaxed font-normal">
              {selectedArticle.sections.map((sec) => (
                <section key={sec.id} className="space-y-4">
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-6 mb-3 font-serif-title">
                    {sec.heading}
                  </h2>
                  <p className="text-justify text-slate-700 leading-relaxed">
                    {sec.content}
                  </p>
                  {sec.highlightTip && (
                    <div className="p-4 bg-emerald-50 border-l-4 border-emerald-700 rounded-r-xl text-emerald-950 text-sm">
                      <span className="font-bold block mb-1 text-emerald-900">
                        💡 Kinh nghiệm chia sẻ:
                      </span>
                      {sec.highlightTip}
                    </div>
                  )}
                  {sec.image && (
                    <figure className="my-6">
                      <img
                        src={sec.image}
                        alt=""
                        className="w-full rounded-2xl object-cover max-h-[460px] shadow-sm border border-slate-200"
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

            {/* Mentioned Places Card */}
            {selectedArticle.mentionedPlaces &&
              selectedArticle.mentionedPlaces.length > 0 && (
                <div className="mt-12 p-6 bg-slate-50 rounded-2xl border border-slate-200">
                  <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <MapPin size={18} className="text-emerald-700" /> Tọa độ được nhắc đến trong bài
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedArticle.mentionedPlaces.map((pl, i) => (
                      <div
                        key={i}
                        className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between"
                      >
                        <div>
                          <p className="text-[10px] font-bold text-emerald-700 uppercase mb-0.5">
                            {pl.category}
                          </p>
                          <h4 className="font-bold text-xs text-slate-900">
                            {pl.name}
                          </h4>
                        </div>
                        <span className="bg-amber-100 text-amber-900 text-xs font-bold px-2 py-0.5 rounded-md">
                          ★ {pl.rating}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
          </div>
        </div>
      )}
    </div>
  );
}
