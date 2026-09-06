import { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, CircleMarker, Marker, Popup, Polyline, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  Search, Clock, MapPin, Navigation, X, Plus,
  RotateCcw, Heart,
} from "lucide-react";
import { Place, places } from "./data";

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const STOP_COLORS = ["#22c55e", "#3b82f6", "#a855f7", "#f59e0b", "#ef4444", "#06b6d4"];
const SPEEDS: Record<string, number> = { car: 60, bike: 35, walk: 5 };
const CATEGORIES = ["Tất cả", "Ăn uống", "Du lịch", "Lưu trú", "Vui chơi"];
const LS_SEARCHES_KEY = "lt_recent_searches";
const LS_VIEWED_KEY = "lt_recently_viewed";

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function haversine(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371, r = (v: number) => (v * Math.PI) / 180;
  const dLat = r(lat2 - lat1), dLng = r(lng2 - lng1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(r(lat1)) * Math.cos(r(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function fmtTime(h: number) {
  const hh = Math.floor(h), mm = Math.round((h - hh) * 60);
  if (hh === 0) return `${mm} phút`;
  if (mm === 0) return `${hh} giờ`;
  return `${hh}g ${mm}p`;
}

function fmtPrice(place: Place) {
  if (place.priceMax === 0) return "Free";
  if (place.priceMax >= 1_000_000) return `${(place.priceMax / 1_000_000).toFixed(1)}M`;
  return `${Math.round(place.priceMax / 1000)}k`;
}

function loadLS<T>(key: string, fallback: T): T {
  try { return JSON.parse(localStorage.getItem(key) || "null") ?? fallback; }
  catch { return fallback; }
}

function saveLS(key: string, value: unknown) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}

// ─── HEART MARKER ICON ────────────────────────────────────────────────────────
function createHeartIcon(hovered: boolean) {
  const scale = hovered ? 1.25 : 1;
  const html = `<div style="transform:scale(${scale});transform-origin:center;transition:transform 0.15s;filter:drop-shadow(0 2px 6px rgba(0,0,0,0.25));cursor:pointer">
    <svg width="26" height="26" viewBox="0 0 24 24" fill="#ef4444" stroke="white" stroke-width="1.5" stroke-linejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  </div>`;
  return L.divIcon({ className: "", html, iconSize: [26, 26], iconAnchor: [13, 13] });
}

const LS_FAVS_KEY = "lt_favorites";

// ─── MAP CONTROLLER ───────────────────────────────────────────────────────────
function MapController({
  flyTarget, onMoveEnd,
}: {
  flyTarget: { center: [number, number]; zoom: number } | null;
  onMoveEnd: (center: [number, number], zoom: number) => void;
}) {
  const map = useMap();
  useMapEvents({
    moveend: () => { const c = map.getCenter(); onMoveEnd([c.lat, c.lng], map.getZoom()); },
  });
  useEffect(() => {
    if (flyTarget) map.flyTo(flyTarget.center, flyTarget.zoom, { duration: 1 });
  }, [flyTarget]);
  return null;
}

// ─── STAR ROW ─────────────────────────────────────────────────────────────────
function StarRow({ rating, size = 10 }: { rating: number; size?: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} width={size} height={size} viewBox="0 0 24 24" fill={s <= Math.round(rating) ? "#FBBF24" : "#E5E7EB"}>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function MapPage({
  history, onSelectPlace,
}: {
  history: Place[];
  onSelectPlace: (p: Place) => void;
}) {
  // Search & history
  const [search, setSearch] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>(() => loadLS(LS_SEARCHES_KEY, []));
  const [recentViewed] = useState<Place[]>(() => {
    const ids: number[] = loadLS(LS_VIEWED_KEY, []);
    return ids.map((id) => places.find((p) => p.id === id)).filter(Boolean) as Place[];
  });
  const searchRef = useRef<HTMLDivElement>(null);

  // Map
  const [flyTarget, setFlyTarget] = useState<{ center: [number, number]; zoom: number } | null>(null);
  const [currentCenter, setCurrentCenter] = useState<[number, number]>([16.0, 108.0]);
  const [showSearchArea, setShowSearchArea] = useState(false);
  const [searchAreaCenter, setSearchAreaCenter] = useState<[number, number] | null>(null);

  // Places
  const [hoveredPlace, setHoveredPlace] = useState<Place | null>(null);
  const [clickedPlace, setClickedPlace] = useState<Place | null>(null);
  const [activeTab, setActiveTab] = useState<"list" | "route" | "history">("list");
  const [favorites, setFavorites] = useState<Set<number>>(() => new Set(loadLS<number[]>(LS_FAVS_KEY, [])));

  const toggleFavorite = (id: number, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setFavorites((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      saveLS(LS_FAVS_KEY, [...next]);
      return next;
    });
  };

  // Filters
  const [filterCat, setFilterCat] = useState("Tất cả");
  const [filterMinRating, setFilterMinRating] = useState(0);
  const [filterMaxPrice, setFilterMaxPrice] = useState(1_000_000);

  // Route
  const [stops, setStops] = useState<(Place | null)[]>([null, null]);
  const [transport, setTransport] = useState<"car" | "bike" | "walk">("car");
  const [routeComputed, setRouteComputed] = useState(false);

  // Dismiss search dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setSearchFocused(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Sync history to localStorage when it changes
  useEffect(() => {
    saveLS(LS_VIEWED_KEY, history.slice(0, 10).map((p) => p.id));
  }, [history]);

  // Filtered places
  const baseFiltered = places.filter((p) => {
    if (filterCat !== "Tất cả" && p.type !== filterCat) return false;
    if (p.rating < filterMinRating) return false;
    if (p.priceMax > 0 && p.priceMax > filterMaxPrice) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.location.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  // "Search this area" filtered places
  const displayedPlaces = searchAreaCenter
    ? baseFiltered.sort((a, b) => haversine(searchAreaCenter[0], searchAreaCenter[1], a.lat, a.lng) - haversine(searchAreaCenter[0], searchAreaCenter[1], b.lat, b.lng))
    : baseFiltered;

  // Search actions
  const doSearch = (term: string) => {
    if (!term.trim()) return;
    setSearch(term);
    setSearchFocused(false);
    const updated = [term, ...recentSearches.filter((s) => s !== term)].slice(0, 5);
    setRecentSearches(updated);
    saveLS(LS_SEARCHES_KEY, updated);
  };

  const clearSearches = () => { setRecentSearches([]); saveLS(LS_SEARCHES_KEY, []); };

  const flyToPlace = (place: Place) => {
    setFlyTarget({ center: [place.lat, place.lng], zoom: 13 });
    setClickedPlace(place);
    setShowSearchArea(false);
  };

  // Route helpers
  const stopIndex = (place: Place) => stops.findIndex((s) => s?.id === place.id);
  const filledStops = stops.filter((s): s is Place => s !== null);
  const canRoute = filledStops.length >= 2;
  const legs = stops.reduce<{ from: Place; to: Place; dist: number; time: number }[]>((acc, stop, i) => {
    if (i < stops.length - 1 && stop && stops[i + 1]) {
      const a = stop, b = stops[i + 1]!;
      const dist = haversine(a.lat, a.lng, b.lat, b.lng);
      acc.push({ from: a, to: b, dist, time: dist / SPEEDS[transport] });
    }
    return acc;
  }, []);
  const totalDist = legs.reduce((s, l) => s + l.dist, 0);
  const totalTime = legs.reduce((s, l) => s + l.time, 0);
  const routeCoords: [number, number][] = stops.filter((s): s is Place => s !== null).map((s) => [s.lat, s.lng]);

  const setStop = (i: number, place: Place | null) => {
    setStops((prev) => { const n = [...prev]; n[i] = place; return n; });
    setRouteComputed(false);
  };

  const computeRoute = () => {
    if (!canRoute) return;
    setRouteComputed(true);
    const lats = filledStops.map((s) => s.lat), lngs = filledStops.map((s) => s.lng);
    const spread = Math.max(Math.max(...lats) - Math.min(...lats), Math.max(...lngs) - Math.min(...lngs));
    setFlyTarget({
      center: [(Math.min(...lats) + Math.max(...lats)) / 2, (Math.min(...lngs) + Math.max(...lngs)) / 2],
      zoom: spread > 5 ? 5 : spread > 2 ? 6 : spread > 0.5 ? 8 : 11,
    });
  };

  const addStopFromPlace = (place: Place) => {
    const emptyIdx = stops.findIndex((s) => !s);
    if (emptyIdx >= 0) setStop(emptyIdx, place);
    else setStops((prev) => [...prev, place]);
    setActiveTab("route");
  };

  const tabBtn = (id: typeof activeTab, label: string, count?: number) => (
    <button
      onClick={() => setActiveTab(id)}
      className="flex-1 py-2.5 text-xs font-bold transition-all flex items-center justify-center gap-1"
      style={activeTab === id
        ? { color: "#18181B", borderBottom: "2.5px solid #18181B" }
        : { color: "#9CA3AF", borderBottom: "2.5px solid transparent" }}
    >
      {label}
      {count !== undefined && count > 0 && (
        <span className="text-[10px] rounded-full px-1.5 py-0.5 font-black"
          style={activeTab === id ? { background: "#18181B", color: "white" } : { background: "#F3F4F6", color: "#9CA3AF" }}>
          {count}
        </span>
      )}
    </button>
  );

  return (
    <div className="flex h-[calc(100vh-64px)]" style={{ background: "#F8FAFC" }}>

      {/* ══ SIDEBAR ══════════════════════════════════════════════════════════ */}
      <aside className="w-80 flex-shrink-0 bg-white flex flex-col overflow-hidden border-r border-slate-100"
        style={{ boxShadow: "2px 0 16px rgba(0,0,0,0.05)" }}>

        {/* Smart Search */}
        <div ref={searchRef} className="px-4 pt-4 pb-3 border-b border-slate-100 relative">
          <div
            className="flex items-center gap-2.5 rounded-2xl px-3.5 py-2.5 border transition-all"
            style={{ background: "#F9FAFB", borderColor: searchFocused ? "#18181B" : "#E5E7EB" }}
          >
            <Search size={14} className="text-slate-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="Tìm tên quán, thành phố…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onKeyDown={(e) => e.key === "Enter" && doSearch(search)}
              className="flex-1 text-sm outline-none bg-transparent text-slate-800 placeholder-slate-400"
            />
            {search && (
              <button onClick={() => { setSearch(""); }} className="flex-shrink-0">
                <X size={13} className="text-slate-400 hover:text-slate-600" />
              </button>
            )}
          </div>

          {/* Dropdown */}
          {searchFocused && (
            <div className="absolute left-4 right-4 top-[calc(100%-4px)] bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 overflow-hidden"
              style={{ boxShadow: "0 16px 48px rgba(0,0,0,0.14)" }}>

              {/* Recent searches */}
              {recentSearches.length > 0 && (
                <div className="px-4 pt-3 pb-2">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-black tracking-widest uppercase text-slate-400">Tìm kiếm gần đây</span>
                    <button onClick={clearSearches} className="text-[11px] text-slate-400 hover:text-slate-600 hover:underline transition-colors">Xóa</button>
                  </div>
                  {recentSearches.map((s) => (
                    <button key={s} onClick={() => doSearch(s)}
                      className="w-full flex items-center gap-2.5 py-2 text-left hover:bg-slate-50 rounded-xl px-2 transition-colors">
                      <Clock size={12} className="text-slate-400 flex-shrink-0" />
                      <span className="text-sm text-slate-700">{s}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Recently viewed */}
              {recentViewed.length > 0 && (
                <div className="px-4 pt-2 pb-3 border-t border-slate-50">
                  <span className="text-[10px] font-black tracking-widest uppercase text-slate-400 block mb-2">Vừa xem</span>
                  {recentViewed.slice(0, 4).map((place) => (
                    <button key={place.id}
                      onClick={() => { setSearchFocused(false); flyToPlace(place); }}
                      className="w-full flex items-center gap-2.5 py-1.5 text-left hover:bg-slate-50 rounded-xl px-2 transition-colors">
                      <div className="w-9 h-9 rounded-lg overflow-hidden flex-shrink-0">
                        <img src={place.img} alt={place.name} className="w-full h-full object-cover"
                          onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1527997921830-de1cf1f9b430?w=80&h=80&fit=crop"; }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-800 truncate">{place.name}</p>
                        <p className="text-[11px] text-slate-400 truncate">{place.location}</p>
                      </div>
                      <MapPin size={11} className="text-slate-300 flex-shrink-0" />
                    </button>
                  ))}
                </div>
              )}

              {recentSearches.length === 0 && recentViewed.length === 0 && (
                <div className="px-4 py-5 text-center text-xs text-slate-400">Chưa có lịch sử tìm kiếm</div>
              )}
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-100 px-3">
          {tabBtn("list", "Địa điểm", displayedPlaces.length)}
          {tabBtn("route", "Tìm đường")}
          {tabBtn("history", "Đã xem", history.length)}
        </div>

        <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>

          {/* ── TAB: LIST ─────────────────────────────────────────────────── */}
          {activeTab === "list" && (
            <div>
              {/* Filters */}
              <div className="px-4 pt-3 pb-2 border-b border-slate-50 space-y-3">
                {/* Category pills */}
                <div className="flex flex-wrap gap-1.5">
                  {CATEGORIES.map((cat) => (
                    <button key={cat} onClick={() => setFilterCat(cat)}
                      className="px-3 py-1 rounded-full text-xs font-semibold border transition-all"
                      style={filterCat === cat
                        ? { background: "#18181B", color: "white", borderColor: "#18181B" }
                        : { background: "white", color: "#6B7280", borderColor: "#E5E7EB" }}>
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Rating + Price */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] text-slate-500 font-medium">Sao tối thiểu:</span>
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button key={s} onClick={() => setFilterMinRating(filterMinRating === s ? 0 : s)}>
                          <svg width={14} height={14} viewBox="0 0 24 24" fill={s <= filterMinRating ? "#FBBF24" : "#E5E7EB"}>
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                          </svg>
                        </button>
                      ))}
                    </div>
                  </div>
                  {(filterCat !== "Tất cả" || filterMinRating > 0) && (
                    <button onClick={() => { setFilterCat("Tất cả"); setFilterMinRating(0); setFilterMaxPrice(1_000_000); }}
                      className="ml-auto text-[11px] text-slate-400 hover:text-slate-700 hover:underline transition-colors">
                      Xóa bộ lọc
                    </button>
                  )}
                </div>
              </div>

              {/* Place cards */}
              <div className="px-3 py-2 space-y-1">
                {displayedPlaces.length === 0 ? (
                  <div className="py-10 text-center text-xs text-slate-400">Không có địa điểm phù hợp</div>
                ) : (
                  displayedPlaces.map((place) => {
                    const isFav = favorites.has(place.id);
                    return (
                      <div
                        key={place.id}
                        onMouseEnter={() => setHoveredPlace(place)}
                        onMouseLeave={() => setHoveredPlace(null)}
                        className="flex items-center gap-3 px-2.5 py-2.5 rounded-2xl transition-all border cursor-pointer"
                        style={{
                          borderColor: hoveredPlace?.id === place.id || clickedPlace?.id === place.id ? "#18181B" : "transparent",
                          background: hoveredPlace?.id === place.id || clickedPlace?.id === place.id ? "#F9FAFB" : "transparent",
                        }}
                        onClick={() => flyToPlace(place)}
                      >
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
                          <img src={place.img} alt={place.name} className="w-full h-full object-cover"
                            onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1527997921830-de1cf1f9b430?w=80&h=80&fit=crop"; }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-slate-900 truncate">{place.name}</p>
                          <p className="text-[11px] text-slate-400 truncate mb-1">{place.location}</p>
                          <div className="flex items-center gap-1.5">
                            <StarRow rating={place.rating} />
                            <span className="text-[11px] font-semibold text-slate-600">{place.rating}</span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2 flex-shrink-0">
                          <button
                            onClick={(e) => toggleFavorite(place.id, e)}
                            className="w-7 h-7 rounded-full flex items-center justify-center transition-all hover:scale-110"
                            style={{ background: isFav ? "#FEE2E2" : "#F3F4F6" }}
                          >
                            <Heart size={13} fill={isFav ? "#ef4444" : "none"} stroke={isFav ? "#ef4444" : "#9CA3AF"} strokeWidth={2} />
                          </button>
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full font-semibold"
                            style={{ background: place.status === "Đang mở" ? "#DCFCE7" : "#F3F4F6", color: place.status === "Đang mở" ? "#166534" : "#6B7280" }}>
                            {place.status === "Đang mở" ? "Mở" : "Đóng"}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* ── TAB: ROUTE ────────────────────────────────────────────────── */}
          {activeTab === "route" && (
            <div className="px-4 py-4 space-y-4">
              {/* Stops */}
              <div>
                <p className="text-[10px] font-black tracking-widest uppercase text-slate-400 mb-2">
                  Điểm dừng ({stops.length})
                </p>
                <div className="space-y-2">
                  {stops.map((stop, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black text-white flex-shrink-0"
                        style={{ background: STOP_COLORS[i % STOP_COLORS.length] }}>{i + 1}</div>
                      <select
                        value={stop?.id ?? ""}
                        onChange={(e) => setStop(i, places.find((p) => p.id === Number(e.target.value)) ?? null)}
                        className="flex-1 py-2 text-xs font-medium rounded-xl outline-none appearance-none cursor-pointer truncate border"
                        style={{ paddingLeft: 10, paddingRight: 6, background: "#F3F4F6", borderColor: "transparent", color: stop ? "#111827" : "#9CA3AF" }}
                      >
                        <option value="">{i === 0 ? "Điểm xuất phát" : i === stops.length - 1 ? "Điểm đến" : `Điểm dừng ${i}`}</option>
                        {places.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                      </select>
                      <button onClick={() => {
                        setStops((prev) => prev.length <= 2 ? prev.map((s, idx) => idx === i ? null : s) : prev.filter((_, idx) => idx !== i));
                        setRouteComputed(false);
                      }} className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-slate-100 flex-shrink-0">
                        <X size={12} className="text-slate-400" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <div className="w-6 flex justify-center"><div className="w-px h-4 bg-slate-200" /></div>
                  <button onClick={() => setStops((p) => [...p, null])} disabled={stops.length >= 6}
                    className="flex items-center gap-1.5 text-xs font-semibold transition-colors disabled:opacity-30"
                    style={{ color: "#18181B" }}>
                    <Plus size={13} /> Thêm điểm dừng
                  </button>
                </div>
              </div>

              <div className="flex gap-2">
                <button onClick={computeRoute} disabled={!canRoute}
                  className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white transition-all disabled:opacity-40"
                  style={{ background: "#18181B" }}>
                  Tìm đường
                </button>
                {(routeComputed || stops.some(Boolean)) && (
                  <button onClick={() => { setStops([null, null]); setRouteComputed(false); }}
                    className="px-3 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors">
                    <RotateCcw size={13} className="text-slate-500" />
                  </button>
                )}
              </div>

              {/* Route result */}
              {routeComputed && legs.length > 0 && (
                <div className="rounded-2xl overflow-hidden border border-slate-100">
                  <div className="px-4 py-3" style={{ background: "#18181B" }}>
                    <div className="flex items-baseline gap-3">
                      <span className="text-2xl font-black text-white">{totalDist.toFixed(0)} km</span>
                      <span className="text-sm text-slate-300">~{fmtTime(totalTime)}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {transport === "car" ? "Xe hơi" : transport === "bike" ? "Xe máy" : "Đi bộ"} · {filledStops.length} điểm dừng
                    </p>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {legs.map((leg, i) => (
                      <div key={i} className="px-4 py-2.5">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-black text-white flex-shrink-0"
                            style={{ background: STOP_COLORS[i % STOP_COLORS.length] }}>{i + 1}</div>
                          <span className="text-[11px] text-slate-500 truncate">{leg.from.name}</span>
                        </div>
                        <div className="flex items-center gap-2 pl-4 mb-1">
                          <span className="text-[11px] font-semibold text-slate-700">{leg.dist.toFixed(0)} km · {fmtTime(leg.time)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-black text-white flex-shrink-0"
                            style={{ background: STOP_COLORS[(i + 1) % STOP_COLORS.length] }}>{i + 2}</div>
                          <span className="text-[11px] text-slate-500 truncate">{leg.to.name}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── TAB: HISTORY ──────────────────────────────────────────────── */}
          {activeTab === "history" && (
            <div className="px-4 py-4">
              {history.length === 0 ? (
                <div className="text-center py-12">
                  <Clock size={32} className="text-slate-200 mx-auto mb-2" />
                  <p className="text-xs text-slate-400">Chưa có lịch sử</p>
                  <p className="text-[11px] text-slate-300 mt-1">Xem chi tiết địa điểm để lưu lịch sử</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {history.map((place, i) => (
                    <div key={`${place.id}-${i}`}
                      onClick={() => flyToPlace(place)}
                      className="flex items-center gap-3 p-2.5 rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer">
                      <div className="relative w-11 h-11 rounded-xl overflow-hidden flex-shrink-0">
                        <img src={place.img} alt={place.name} className="w-full h-full object-cover" />
                        <div className="absolute bottom-0 right-0 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-black text-white"
                          style={{ background: "#18181B" }}>{i + 1}</div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-800 truncate">{place.name}</p>
                        <p className="text-[11px] text-slate-400 truncate">{place.category} · {place.province}</p>
                        <StarRow rating={place.rating} />
                      </div>
                      <div className="flex flex-col items-end gap-1 flex-shrink-0">
                        <button onClick={(e) => { e.stopPropagation(); onSelectPlace(place); }}
                          className="text-[10px] font-bold px-2 py-0.5 rounded-full border border-slate-200 text-slate-500 hover:border-slate-900 hover:text-slate-900 transition-all">
                          Chi tiết
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); addStopFromPlace(place); }}
                          className="text-[10px] font-bold px-2 py-0.5 rounded-full border border-slate-200 text-slate-500 hover:border-slate-900 hover:text-slate-900 transition-all">
                          + Tuyến
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </aside>

      {/* ══ MAP ══════════════════════════════════════════════════════════════ */}
      <div className="flex-1 relative">
        <MapContainer center={[16.0, 108.0]} zoom={6} style={{ height: "100%", width: "100%" }} zoomControl={false}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapController
            flyTarget={flyTarget}
            onMoveEnd={(center) => {
              setCurrentCenter(center);
              setShowSearchArea(true);
            }}
          />

          {/* Route polyline */}
          {routeComputed && routeCoords.length >= 2 && (
            <Polyline positions={routeCoords}
              pathOptions={{ color: "#18181B", weight: 4, dashArray: "12 6", opacity: 0.85 }} />
          )}

          {/* Markers: CircleMarker for regular, heart Marker for favorites */}
          {places.map((place) => {
            const si = stopIndex(place);
            const isStop = si >= 0 && routeComputed;
            const isHovered = hoveredPlace?.id === place.id;
            const isClicked = clickedPlace?.id === place.id;
            const isFav = favorites.has(place.id);

            const fillColor = isClicked ? "#18181B"
              : isStop ? STOP_COLORS[si % STOP_COLORS.length]
              : isHovered ? "#18181B"
              : "#EA580C";

            const popup = (
              <Popup maxWidth={240}>
                <div style={{ minWidth: 220, fontFamily: "Inter, sans-serif" }}>
                  <img src={place.img} alt={place.name}
                    style={{ width: "100%", height: 100, objectFit: "cover", borderRadius: 10, marginBottom: 8 }}
                    onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1527997921830-de1cf1f9b430?w=300&h=200&fit=crop"; }} />
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 2 }}>
                    <p style={{ fontWeight: 800, fontSize: 13, margin: 0, color: "#111827" }}>{place.name}</p>
                    <button onClick={() => toggleFavorite(place.id)}
                      style={{ background: favorites.has(place.id) ? "#FEE2E2" : "#F3F4F6", border: "none", borderRadius: "50%", width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0, marginLeft: 6 }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill={favorites.has(place.id) ? "#ef4444" : "none"} stroke={favorites.has(place.id) ? "#ef4444" : "#9CA3AF"} strokeWidth="2">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                      </svg>
                    </button>
                  </div>
                  <p style={{ fontSize: 11, color: "#6B7280", margin: "0 0 6px" }}>{place.location}</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#111827" }}>{place.rating}★</span>
                    <span style={{ fontSize: 11, color: "#9CA3AF" }}>({place.reviews.toLocaleString()})</span>
                    <span style={{ marginLeft: "auto", fontSize: 11, padding: "2px 8px", borderRadius: 99, background: place.status === "Đang mở" ? "#DCFCE7" : "#F3F4F6", color: place.status === "Đang mở" ? "#166534" : "#6B7280", fontWeight: 600 }}>
                      {place.status}
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button onClick={() => addStopFromPlace(place)}
                      style={{ flex: 1, padding: "7px 0", borderRadius: 10, background: "#F3F4F6", color: "#374151", fontSize: 11, fontWeight: 700, border: "none", cursor: "pointer" }}>
                      + Thêm tuyến
                    </button>
                    <button onClick={() => onSelectPlace(place)}
                      style={{ flex: 1, padding: "7px 0", borderRadius: 10, background: "#18181B", color: "#fff", fontSize: 11, fontWeight: 700, border: "none", cursor: "pointer" }}>
                      Xem chi tiết
                    </button>
                  </div>
                </div>
              </Popup>
            );

            if (isFav) {
              return (
                <Marker key={place.id} position={[place.lat, place.lng]}
                  icon={createHeartIcon(isHovered || isClicked)}
                  eventHandlers={{
                    click: () => { setClickedPlace(place); setFlyTarget({ center: [place.lat, place.lng], zoom: 13 }); },
                    mouseover: () => setHoveredPlace(place),
                    mouseout: () => setHoveredPlace(null),
                  }}>
                  {popup}
                </Marker>
              );
            }

            return (
              <CircleMarker key={place.id} center={[place.lat, place.lng]}
                radius={isHovered || isClicked ? 13 : 10}
                pathOptions={{ fillColor, fillOpacity: 0.95, color: "#fff", weight: 2.5 }}
                eventHandlers={{
                  click: () => { setClickedPlace(place); setFlyTarget({ center: [place.lat, place.lng], zoom: 13 }); },
                  mouseover: () => setHoveredPlace(place),
                  mouseout: () => setHoveredPlace(null),
                }}>
                {popup}
              </CircleMarker>
            );
          })}
        </MapContainer>

        {/* "Search this area" button */}
        {showSearchArea && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000]">
            <button
              onClick={() => { setSearchAreaCenter(currentCenter); setShowSearchArea(false); setActiveTab("list"); }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-bold shadow-xl border border-slate-100 hover:shadow-2xl transition-all hover:-translate-y-0.5"
              style={{ background: "white", color: "#18181B", boxShadow: "0 4px 24px rgba(0,0,0,0.16)" }}
            >
              <Search size={14} />
              Tìm kiếm khu vực này
            </button>
          </div>
        )}

        {/* Route summary chip */}
        {routeComputed && legs.length > 0 && (
          <div className="absolute top-4 right-4 z-[1000] flex items-center gap-3 px-5 py-2.5 rounded-full"
            style={{ background: "#18181B", boxShadow: "0 4px 20px rgba(0,0,0,0.3)" }}>
            <span className="text-white text-sm font-black">{totalDist.toFixed(0)} km</span>
            <div className="w-px h-4 bg-white/20" />
            <span className="text-slate-300 text-xs">~{fmtTime(totalTime)}</span>
            <div className="w-px h-4 bg-white/20" />
            <span className="text-slate-300 text-xs">{filledStops.length} điểm</span>
          </div>
        )}

        {/* Focused place mini-card */}
        {clickedPlace && (
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-[1000] bg-white rounded-2xl px-4 py-3 flex items-center gap-3"
            style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.18)", minWidth: 320, maxWidth: 420 }}>
            <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
              <img src={clickedPlace.img} alt={clickedPlace.name} className="w-full h-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1527997921830-de1cf1f9b430?w=80&h=80&fit=crop"; }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-slate-900 text-sm truncate">{clickedPlace.name}</p>
              <p className="text-xs text-slate-400 truncate mb-1">{clickedPlace.location}</p>
              <div className="flex items-center gap-1.5">
                <StarRow rating={clickedPlace.rating} size={11} />
                <span className="text-xs font-semibold text-slate-700">{clickedPlace.rating}</span>
                <span className="text-[11px] font-bold text-slate-800 ml-2">{fmtPrice(clickedPlace)}</span>
              </div>
            </div>
            <div className="flex flex-col gap-1.5 flex-shrink-0">
              <button onClick={() => onSelectPlace(clickedPlace)}
                className="px-3 py-1.5 rounded-lg text-xs font-bold text-white" style={{ background: "#18181B" }}>
                Chi tiết
              </button>
              <button onClick={() => setClickedPlace(null)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-200 text-slate-500 hover:bg-slate-50">
                Đóng
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
