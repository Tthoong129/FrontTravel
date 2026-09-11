import { useState, useRef, useEffect } from "react";
import {
  X,
  MapPin,
  Clock,
  DollarSign,
  UploadCloud,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Trash2,
  Compass,
  FileText,
  AlertCircle,
  Phone,
  Globe,
  Navigation,
  Sparkles,
  Gift,
  Search,
  Sun,
  Moon,
  Coffee,
  Utensils,
  Mountain,
  Landmark,
  Waves,
  Hotel,
  Star,
  Camera,
  Check,
  ArrowRight,
  ChevronDown,
} from "lucide-react";
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { provinceOptions, categoryOptions, ProposalItem } from "./data";

// ─── PIN ICON FOR LEAFLET MINI MAP ──────────────────────────────────────────
const customPinIcon = L.divIcon({
  className: "custom-map-pin",
  html: `<div style="position:relative;display:flex;align-items:center;justify-content:center;transform:translate(-50%, -100%);">
    <div style="background:#064e3b;color:#ffffff;width:32px;height:32px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);display:flex;align-items:center;justify-content:center;box-shadow:0 8px 20px rgba(6,78,59,0.3);border:2.5px solid #ffffff;">
      <div style="transform:rotate(45deg);display:flex;align-items:center;justify-content:center;">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
      </div>
    </div>
    <div style="position:absolute;bottom:-2px;width:8px;height:3px;background:rgba(0,0,0,0.2);border-radius:50%;filter:blur(1px);"></div>
  </div>`,
  iconSize: [32, 32],
  iconAnchor: [0, 0],
});

// ─── LEAFLET CONTROLLER COMPONENT ───────────────────────────────────────────
function MapEventsHandler({
  position,
  onChangePosition,
}: {
  position: [number, number];
  onChangePosition: (pos: [number, number]) => void;
}) {
  const map = useMap();

  useEffect(() => {
    map.setView(position, map.getZoom(), { animate: true });
  }, [position, map]);

  useMapEvents({
    click(e) {
      onChangePosition([e.latlng.lat, e.latlng.lng]);
    },
  });

  return (
    <Marker
      position={position}
      icon={customPinIcon}
      draggable={true}
      eventHandlers={{
        dragend(e) {
          const marker = e.target;
          const pos = marker.getLatLng();
          onChangePosition([pos.lat, pos.lng]);
        },
      }}
    />
  );
}

// ─── SAMPLE DATABASE LANDMARKS (Autocomplete suggestions) ───────────────────
interface SuggestedPlace {
  name: string;
  category: string;
  province: string;
  address: string;
  phone?: string;
  website?: string;
  openingHours: string;
  minPrice: number;
  maxPrice: number;
  lat: number;
  lng: number;
  description: string;
  coverImg: string;
}

const SAMPLE_DATABASE_PLACES: SuggestedPlace[] = [
  {
    name: "Thác Bản Giốc Kỳ Vĩ",
    category: "Núi rừng & Thác nước",
    province: "Cao Bằng",
    address: "Xã Đàm Thủy, Huyện Trùng Khánh, Cao Bằng",
    phone: "02063828111",
    openingHours: "07:00 – 18:00",
    minPrice: 45000,
    maxPrice: 100000,
    lat: 22.666712,
    lng: 106.250045,
    description: "Thác nước tự nhiên lớn thứ tư thế giới trên đường biên giới quốc gia, dòng nước trắng xóa đổ xuống sông Quây Sơn.",
    coverImg: "https://tapchivietnamhuongsac.vn/stores/news_dataimages/tapchivietnamhuongsacvn/012024/17/15/thac-ban-gioc-tien-canh-ky-vi-cua-non-nuoc-cao-bang-32-.5646.jpg",
  },
  {
    name: "Khu Di Tích Quốc Gia Pác Bó",
    category: "Điểm tham quan & Di tích",
    province: "Cao Bằng",
    address: "Xã Trường Hà, Huyện Hà Quảng, Cao Bằng",
    phone: "02063828222",
    openingHours: "07:30 – 17:00",
    minPrice: 45000,
    maxPrice: 60000,
    lat: 22.978512,
    lng: 105.918545,
    description: "Nơi Bác Hồ trở về Tổ quốc lãnh đạo cách mạng năm 1941 bên suối Lê Nin trong vắt và núi Các Mác hùng tráng.",
    coverImg: "https://tripmap.vn/wp-content/uploads/2020/12/di-tich-pac-bo-1609098480785.jpg",
  },
  {
    name: "Động Phong Nha Kẻ Bàng",
    category: "Núi rừng & Thác nước",
    province: "Quảng Bình",
    address: "Thị trấn Phong Nha, Huyện Bố Trạch, Quảng Bình",
    phone: "02323677021",
    website: "http://phongnhakebang.vn",
    openingHours: "07:30 – 16:30",
    minPrice: 150000,
    maxPrice: 250000,
    lat: 17.585512,
    lng: 106.282545,
    description: "Kỳ quan đệ nhất động với dòng sông ngầm dài nhất và hệ thống thạch nhũ lung linh hàng triệu năm tuổi.",
    coverImg: "https://viptrip.vn/public/upload/news/dong-phong-nha-ke-bang_26-08-2023_999464655.png",
  },
  {
    name: "Eo Gió Kỳ Co Quy Nhơn",
    category: "Bãi biển & Đảo",
    province: "Bình Định",
    address: "Xã Nhơn Lý, TP. Quy Nhơn, Bình Định",
    phone: "02563822111",
    openingHours: "06:00 – 18:30",
    minPrice: 25000,
    maxPrice: 150000,
    lat: 13.918512,
    lng: 109.282545,
    description: "Tuyệt tác eo biển lộng gió với con đường đi bộ ven biển ngoạn mục và bãi biển Kỳ Co trong xanh như ngọc bích.",
    coverImg: "https://eholiday.vn/wp-content/uploads/2024/07/ky-co-1.jpg",
  },
  {
    name: "Đồi Cát Bay Mũi Né (Đồi Cát Đỏ)",
    category: "Điểm tham quan & Di tích",
    province: "Bình Thuận",
    address: "Khu phố 5, Phường Mũi Né, TP. Phan Thiết, Bình Thuận",
    phone: "0952555326",
    openingHours: "Mở cửa cả ngày (24/7)",
    minPrice: 0,
    maxPrice: 100000,
    lat: 10.948512,
    lng: 108.291545,
    description: "Bãi sa mạc cát đỏ thay đổi hình dạng liên tục, tham quan miễn phí vé, có dịch vụ trượt cát và lái xe địa hình ATV.",
    coverImg: "https://vietrektravel.com/Upload/News/Huong-Dan-Chi-Tiet-Duong-Di-Doi-Cat-Bay-Mui-Ne-Phan-Thiet.jpg",
  },
];

// Category Icons Mapping
const categoryIcons: Record<string, any> = {
  "Nhà hàng & Đặc sản": Utensils,
  "Quán cà phê & Trà": Coffee,
  "Ẩm thực đường phố": Utensils,
  "Điểm tham quan & Di tích": Landmark,
  "Bãi biển & Đảo": Waves,
  "Núi rừng & Thác nước": Mountain,
  "Khách sạn & Homestay": Hotel,
  "Trải nghiệm văn hóa": Sparkles,
};

interface ProposePlaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitSuccess: (proposal: ProposalItem) => void;
}

export default function ProposePlaceModal({
  isOpen,
  onClose,
  onSubmitSuccess,
}: ProposePlaceModalProps) {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State: Step 1
  const [name, setName] = useState("");
  const [category, setCategory] = useState(categoryOptions[1].name); // Default: Cà phê & Trà
  const [province, setProvince] = useState(provinceOptions[5] || "Lâm Đồng (Đà Lạt)");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");

  // Map and Coordinates
  const [mapCenter, setMapCenter] = useState<[number, number]>([11.9404, 108.4369]); // Dalat default
  const [lat, setLat] = useState("11.9404");
  const [lng, setLng] = useState("108.4369");
  const [isLocating, setIsLocating] = useState(false);

  // Autocomplete
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<SuggestedPlace[]>([]);

  // Step 2: Time & Pricing
  const [openTime, setOpenTime] = useState("07:30");
  const [closeTime, setCloseTime] = useState("22:00");
  const [is24Hours, setIs24Hours] = useState(false);
  const [openingHours, setOpeningHours] = useState("07:30 – 22:00");
  const [isFree, setIsFree] = useState(false);
  const [minPrice, setMinPrice] = useState("35000");
  const [maxPrice, setMaxPrice] = useState("120000");
  const [description, setDescription] = useState("");

  // Step 3: Images
  const [images, setImages] = useState<string[]>([
    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=500&fit=crop&auto=format",
  ]);
  const [coverIndex, setCoverIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // Autocomplete Handler
  const handleNameChange = (val: string) => {
    setName(val);
    if (!val.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    const query = val.toLowerCase();
    const matched = SAMPLE_DATABASE_PLACES.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.province.toLowerCase().includes(query) ||
        p.address.toLowerCase().includes(query)
    );
    setSuggestions(matched);
    setShowSuggestions(matched.length > 0);
  };

  const handleSelectSuggestion = (place: SuggestedPlace) => {
    setName(place.name);
    setCategory(place.category);
    const matchProv = provinceOptions.find((p) => p.includes(place.province)) || place.province;
    setProvince(matchProv);
    setAddress(place.address);
    if (place.phone) setPhone(place.phone);
    if (place.website) setWebsite(place.website);
    setLat(place.lat.toFixed(6));
    setLng(place.lng.toFixed(6));
    setMapCenter([place.lat, place.lng]);

    // Parse time
    if (place.openingHours.includes("cả ngày") || place.openingHours.includes("24/7")) {
      setIs24Hours(true);
      setOpeningHours("Mở cửa cả ngày (24/7)");
    } else {
      setIs24Hours(false);
      const parts = place.openingHours.split(/–|-/).map((s) => s.trim());
      if (parts.length === 2 && parts[0].includes(":") && parts[1].includes(":")) {
        setOpenTime(parts[0]);
        setCloseTime(parts[1]);
        setOpeningHours(`${parts[0]} – ${parts[1]}`);
      } else {
        setOpeningHours(place.openingHours);
      }
    }

    // Pricing
    if (place.minPrice === 0) {
      setIsFree(true);
      setMinPrice("0");
      setMaxPrice(place.maxPrice > 0 ? place.maxPrice.toString() : "0");
    } else {
      setIsFree(false);
      setMinPrice(place.minPrice.toString());
      setMaxPrice(place.maxPrice.toString());
    }

    setDescription(place.description);
    if (place.coverImg) {
      setImages([place.coverImg]);
      setCoverIndex(0);
    }
    setShowSuggestions(false);
  };

  // Adjust time by minutes
  const adjustTime = (target: "open" | "close", deltaMinutes: number) => {
    const current = target === "open" ? openTime : closeTime;
    const [h, m] = current.split(":").map(Number);
    let total = (isNaN(h) ? 7 : h) * 60 + (isNaN(m) ? 0 : m) + deltaMinutes;
    if (total < 0) total += 24 * 60;
    total = total % (24 * 60);
    const newH = Math.floor(total / 60).toString().padStart(2, "0");
    const newM = (total % 60).toString().padStart(2, "0");
    const formatted = `${newH}:${newM}`;

    if (target === "open") {
      setOpenTime(formatted);
      setOpeningHours(`${formatted} – ${closeTime}`);
    } else {
      setCloseTime(formatted);
      setOpeningHours(`${openTime} – ${formatted}`);
    }
  };

  const handleTimePreset = (start: string, end: string) => {
    setIs24Hours(false);
    setOpenTime(start);
    setCloseTime(end);
    setOpeningHours(`${start} – ${end}`);
  };

  const handleToggle24Hours = (checked: boolean) => {
    setIs24Hours(checked);
    if (checked) {
      setOpeningHours("Mở cửa cả ngày (24/7)");
    } else {
      setOpeningHours(`${openTime} – ${closeTime}`);
    }
  };

  // Map pin position
  const handleMapPinChange = (newPos: [number, number]) => {
    setMapCenter(newPos);
    setLat(newPos[0].toFixed(6));
    setLng(newPos[1].toFixed(6));
  };

  // GPS Location
  const handleGetGPSLocation = () => {
    if (!navigator.geolocation) {
      setErrorMsg("Trình duyệt không hỗ trợ định vị GPS.");
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        handleMapPinChange([pos.coords.latitude, pos.coords.longitude]);
      },
      () => {
        setIsLocating(false);
        handleMapPinChange([10.7769, 106.7009]);
      },
      { timeout: 8000 }
    );
  };

  if (!isOpen) return null;

  // Validation
  const handleNextStep = () => {
    setErrorMsg("");
    if (currentStep === 1) {
      if (!name.trim()) {
        setErrorMsg("Vui lòng nhập tên địa điểm bạn muốn đề xuất.");
        return;
      }
      if (!address.trim()) {
        setErrorMsg("Vui lòng nhập địa chỉ cụ thể của địa điểm.");
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (!is24Hours && !openingHours.trim()) {
        setErrorMsg("Vui lòng chọn khung giờ mở cửa.");
        return;
      }
      if (!description.trim()) {
        setErrorMsg("Vui lòng viết một vài dòng chia sẻ về điểm đặc sắc của nơi này.");
        return;
      }
      setCurrentStep(3);
    }
  };

  // Upload Images
  const handleFilesChosen = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const sampleImages = [
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=500&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&h=500&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=800&h=500&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&h=500&fit=crop&auto=format",
    ];
    const newImgs = Array.from(files).map(
      (_, idx) => sampleImages[(images.length + idx) % sampleImages.length]
    );
    setImages((prev) => [...prev, ...newImgs]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFilesChosen(e.dataTransfer.files);
  };

  const handleRemoveImage = (index: number) => {
    if (images.length <= 1) return;
    setImages((prev) => prev.filter((_, i) => i !== index));
    if (coverIndex >= index && coverIndex > 0) {
      setCoverIndex((prev) => prev - 1);
    }
  };

  // Final Submit
  const handleFinalSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const newProposal: ProposalItem = {
        id: Date.now(),
        name,
        category,
        province,
        address,
        phone,
        website,
        openingHours: is24Hours ? "Mở cửa cả ngày (24/7)" : `${openTime} – ${closeTime}`,
        minPrice: isFree ? 0 : parseInt(minPrice) || 0,
        maxPrice: isFree ? (parseInt(maxPrice) || 0) : parseInt(maxPrice) || 0,
        description,
        coverImg: images[coverIndex] || images[0],
        mediaUrls: images,
        status: 0, // Pending review
        createdAt: new Date().toLocaleDateString("vi-VN"),
      };
      onSubmitSuccess(newProposal);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto max-h-[92vh]">
        
        {/* ── MODAL HEADER ── */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
              Đề xuất địa điểm mới
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Chia sẻ quán ngon, cảnh đẹp để được ban biên tập kiểm duyệt và xuất bản lên bản đồ.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors flex items-center justify-center flex-shrink-0 cursor-pointer"
            title="Đóng"
          >
            <X size={16} />
          </button>
        </div>

        {/* ── STEP TABS (Clean Stepper) ── */}
        <div className="px-6 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
          {[
            { step: 1, label: "Vị trí & Tên gọi" },
            { step: 2, label: "Giờ mở & Mức giá" },
            { step: 3, label: "Hình ảnh & Cảm nhận" },
          ].map((item) => {
            const isCurrent = currentStep === item.step;
            const isDone = currentStep > item.step;
            return (
              <button
                key={item.step}
                type="button"
                onClick={() => {
                  if (isDone) setCurrentStep(item.step as any);
                }}
                disabled={!isDone && !isCurrent}
                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-2 whitespace-nowrap ${
                  isCurrent
                    ? "bg-white text-emerald-900 font-semibold shadow-2xs border border-slate-200"
                    : isDone
                    ? "text-emerald-800 hover:text-emerald-950 cursor-pointer"
                    : "text-slate-400 cursor-not-allowed"
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    isCurrent
                      ? "bg-emerald-800 text-white"
                      : isDone
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-slate-200 text-slate-500"
                  }`}
                >
                  {isDone ? <Check size={11} className="stroke-[2.5]" /> : item.step}
                </span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* ── MODAL SCROLLABLE BODY ── */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 text-slate-800">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle size={15} className="flex-shrink-0 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════
              BƯỚC 1: TÊN, DANH MỤC, VỊ TRÍ & BẢN ĐỒ
          ══════════════════════════════════════════════════════════════ */}
          {currentStep === 1 && (
            <div className="space-y-4">
              {/* Tên địa điểm with Autocomplete */}
              <div className="relative">
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Tên địa điểm / Quán <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: Cà phê Mây Lang Thang, Thác Bản Giốc..."
                    value={name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    onFocus={() => {
                      if (name.trim() && suggestions.length > 0) setShowSuggestions(true);
                    }}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:border-emerald-700 outline-none transition-colors font-medium text-slate-900 placeholder:text-slate-400"
                  />
                  <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>

                {/* Suggestions Card */}
                {showSuggestions && (
                  <div className="absolute left-0 right-0 top-full mt-1.5 bg-white rounded-lg shadow-lg border border-slate-200 py-1.5 z-50 max-h-60 overflow-y-auto animate-in fade-in">
                    <div className="px-3 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100 flex items-center justify-between">
                      <span>Địa danh gợi ý</span>
                      <span>{suggestions.length} kết quả</span>
                    </div>
                    {suggestions.map((item, idx) => (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => handleSelectSuggestion(item)}
                        className="w-full px-3 py-2 text-left hover:bg-slate-50 flex items-start justify-between gap-3 border-b border-slate-50 last:border-0 transition-colors"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold text-slate-900 truncate">{item.name}</p>
                          <p className="text-[11px] text-slate-500 truncate mt-0.5">{item.address}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
                            {item.province}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Phân loại & Tỉnh thành */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">
                    Phân loại địa điểm <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full pl-3 pr-8 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:border-emerald-700 outline-none font-medium text-slate-800 cursor-pointer appearance-none"
                    >
                      {categoryOptions.map((c) => (
                        <option key={c.id} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">
                    Tỉnh / Thành phố <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={province}
                      onChange={(e) => setProvince(e.target.value)}
                      className="w-full pl-3 pr-8 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:border-emerald-700 outline-none font-medium text-slate-800 cursor-pointer appearance-none"
                    >
                      {provinceOptions.map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Địa chỉ chi tiết */}
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Địa chỉ chi tiết <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Số nhà, ngõ, đường, phường/xã..."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:border-emerald-700 outline-none font-medium text-slate-800"
                />
              </div>

              {/* ── BẢN ĐỒ MINI MAP ── */}
              <div className="rounded-xl border border-slate-200 overflow-hidden bg-slate-50">
                <div className="px-3.5 py-2 bg-slate-100/70 border-b border-slate-200 flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-700 flex items-center gap-1.5">
                    <MapPin size={13} className="text-emerald-800" />
                    Định vị tọa độ (Kéo ghim hoặc bấm vào bản đồ)
                  </span>
                  <button
                    type="button"
                    onClick={handleGetGPSLocation}
                    disabled={isLocating}
                    className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Navigation size={12} className={isLocating ? "animate-spin" : ""} />
                    <span>{isLocating ? "Đang định vị..." : "Lấy vị trí của tôi"}</span>
                  </button>
                </div>

                <div className="relative h-44 w-full">
                  <MapContainer
                    center={mapCenter}
                    zoom={13}
                    scrollWheelZoom={false}
                    className="h-full w-full"
                    style={{ background: "#f8fafc" }}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://osm.org/copyright">OSM</a>'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <MapEventsHandler position={mapCenter} onChangePosition={handleMapPinChange} />
                  </MapContainer>

                  <div className="absolute bottom-2 left-2 z-[400] px-2 py-0.5 rounded-md bg-white/95 text-[10px] font-mono text-slate-700 shadow-xs border border-slate-200">
                    📍 {lat}, {lng}
                  </div>
                </div>
              </div>

              {/* SĐT & Website */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Số điện thoại liên hệ
                  </label>
                  <input
                    type="tel"
                    placeholder="0263 3838 xxx"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:border-emerald-700 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Website hoặc Trang Fanpage
                  </label>
                  <input
                    type="url"
                    placeholder="https://facebook.com/..."
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:border-emerald-700 outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════
              BƯỚC 2: GIỜ MỞ CỬA & MỨC GIÁ
          ══════════════════════════════════════════════════════════════ */}
          {currentStep === 2 && (
            <div className="space-y-4">
              {/* Khung giờ hoạt động đón khách */}
              <div className="bg-slate-50/70 border border-slate-200 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">
                      Khung giờ hoạt động <span className="text-rose-500">*</span>
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Thời gian mở cửa & đóng cửa trong ngày
                    </span>
                  </div>

                  {/* 24/24 Checkbox */}
                  <label className="flex items-center gap-1.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={is24Hours}
                      onChange={(e) => handleToggle24Hours(e.target.checked)}
                      className="w-4 h-4 rounded text-emerald-800 accent-emerald-800 cursor-pointer"
                    />
                    <span className="text-xs font-semibold text-slate-700">Mở cửa 24/7</span>
                  </label>
                </div>

                {is24Hours ? (
                  <div className="px-3.5 py-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center justify-between text-xs">
                    <span className="font-medium flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block" />
                      Địa điểm mở cửa tự do suốt 24 giờ cả ngày lẫn đêm.
                    </span>
                    <button
                      type="button"
                      onClick={() => handleToggle24Hours(false)}
                      className="font-semibold underline text-emerald-800 hover:text-emerald-950 cursor-pointer text-xs"
                    >
                      Nhập giờ cụ thể
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          Giờ mở cửa
                        </label>
                        <input
                          type="time"
                          value={openTime}
                          onChange={(e) => {
                            setOpenTime(e.target.value);
                            setOpeningHours(`${e.target.value} – ${closeTime}`);
                          }}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:border-emerald-700 outline-none cursor-pointer"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          Giờ đóng cửa
                        </label>
                        <input
                          type="time"
                          value={closeTime}
                          onChange={(e) => {
                            setCloseTime(e.target.value);
                            setOpeningHours(`${openTime} – ${e.target.value}`);
                          }}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:border-emerald-700 outline-none cursor-pointer"
                        />
                      </div>
                    </div>

                    {/* Presets */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                      <span className="text-[11px] text-slate-400 mr-1">Gợi ý nhanh:</span>
                      {[
                        { label: "Cả ngày (07:00 – 22:00)", s: "07:00", e: "22:00" },
                        { label: "Ban ngày (06:00 – 18:00)", s: "06:00", e: "18:00" },
                        { label: "Sáng (06:30 – 12:00)", s: "06:30", e: "12:00" },
                        { label: "Phố đêm (18:00 – 02:00)", s: "18:00", e: "02:00" },
                      ].map((p, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => handleTimePreset(p.s, p.e)}
                          className={`px-2 py-0.5 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
                            !is24Hours && openTime === p.s && closeTime === p.e
                              ? "bg-slate-900 text-white font-semibold"
                              : "bg-white hover:bg-slate-100 border border-slate-200 text-slate-700"
                          }`}
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Mức giá & Miễn phí vé */}
              <div className="bg-slate-50/70 border border-slate-200 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Gift size={16} className={isFree ? "text-emerald-700" : "text-slate-400"} />
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">
                        Miễn phí vé vào cửa?
                      </span>
                      <span className="text-[11px] text-slate-500">
                        Áp dụng cho công viên, di tích mở, bãi biển hoặc điểm tham quan tự do
                      </span>
                    </div>
                  </div>

                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isFree}
                      onChange={(e) => {
                        setIsFree(e.target.checked);
                        if (e.target.checked) {
                          setMinPrice("0");
                          setMaxPrice("0");
                        } else {
                          setMinPrice("35000");
                          setMaxPrice("120000");
                        }
                      }}
                      className="sr-only peer"
                    />
                    <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-800" />
                  </label>
                </div>

                {isFree ? (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between text-xs text-emerald-900">
                    <div>
                      <strong className="font-semibold flex items-center gap-1.5 text-emerald-950">
                        <CheckCircle2 size={14} className="text-emerald-700" />
                        Miễn phí 100% vé vào cửa
                      </strong>
                      <p className="text-[11px] text-emerald-800 mt-0.5">
                        Khách không phải trả phí vào cửa tham quan.
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-500 block">Phụ thu (nếu có)</span>
                      <input
                        type="number"
                        placeholder="0đ"
                        value={maxPrice === "0" ? "" : maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        className="w-24 px-2 py-1 text-xs bg-white border border-emerald-300 rounded-md outline-none text-right font-medium"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Giá tối thiểu (VNĐ)
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          placeholder="35000"
                          value={minPrice}
                          onChange={(e) => setMinPrice(e.target.value)}
                          className="w-full pl-3 pr-7 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:border-emerald-700 outline-none font-medium text-slate-800"
                        />
                        <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[11px] text-slate-400">
                          đ
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Giá tối đa (VNĐ)
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          placeholder="120000"
                          value={maxPrice}
                          onChange={(e) => setMaxPrice(e.target.value)}
                          className="w-full pl-3 pr-7 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:border-emerald-700 outline-none font-medium text-slate-800"
                        />
                        <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[11px] text-slate-400">
                          đ
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Mô tả & Cảm nhận */}
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Mô tả & Cảm nhận nổi bật <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Chia sẻ về không gian, đặc sản nên gọi, khung giờ ngắm cảnh đẹp nhất, hoặc những lưu ý cần biết..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-lg focus:border-emerald-700 outline-none resize-none text-slate-800 placeholder:text-slate-400 leading-relaxed font-normal transition-colors"
                />
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════
              BƯỚC 3: HÌNH ẢNH & XÁC NHẬN REVIEW (Live Preview)
          ══════════════════════════════════════════════════════════════ */}
          {currentStep === 3 && (
            <div className="space-y-5">
              {/* Drag Drop Area */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                  isDragging
                    ? "border-emerald-800 bg-emerald-50/80"
                    : "border-slate-300 hover:border-emerald-800 bg-slate-50/60 hover:bg-slate-50"
                }`}
              >
                <input
                  type="file"
                  multiple
                  ref={fileInputRef}
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFilesChosen(e.target.files)}
                />
                <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center mx-auto mb-2 border border-emerald-100">
                  <UploadCloud size={20} />
                </div>
                <p className="text-xs font-semibold text-slate-900">
                  Kéo thả ảnh chụp vào đây, hoặc <span className="text-emerald-800 underline">chọn từ thiết bị</span>
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">Định dạng JPG, PNG, WEBP tối đa 10MB mỗi ảnh</p>
              </div>

              {/* Thumbnails */}
              {images.length > 0 && (
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-800 mb-2">
                    <span>Ảnh đã chọn ({images.length})</span>
                    <span className="text-[11px] text-slate-400 font-normal">Bấm ảnh để đặt làm ảnh bìa chính</span>
                  </div>

                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {images.map((img, idx) => {
                      const isCover = coverIndex === idx;
                      return (
                        <div
                          key={idx}
                          onClick={() => setCoverIndex(idx)}
                          className={`relative h-24 rounded-lg overflow-hidden cursor-pointer border-2 transition-all group ${
                            isCover ? "border-emerald-700 ring-2 ring-emerald-700/20" : "border-transparent hover:border-slate-300"
                          }`}
                        >
                          <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                          {isCover && (
                            <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-md bg-emerald-800 text-white text-[9px] font-semibold shadow-xs">
                              Ảnh bìa
                            </div>
                          )}
                          {images.length > 1 && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveImage(idx);
                              }}
                              className="absolute top-1.5 right-1.5 w-5 h-5 rounded-md bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-600"
                            >
                              <Trash2 size={11} />
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ── LIVE PREVIEW CARD (Bản xem trước như trên website) ── */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2.5">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block">
                  Bản xem trước thẻ địa điểm:
                </span>

                <div className="bg-white rounded-lg overflow-hidden border border-slate-200 shadow-2xs flex flex-col sm:flex-row gap-3 p-3 items-center">
                  <img
                    src={images[coverIndex] || images[0]}
                    alt="Preview"
                    className="w-full sm:w-36 h-24 rounded-md object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {category}
                      </span>
                      <span className="text-[10px] text-slate-500">{province}</span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 truncate">
                      {name || "Tên địa điểm"}
                    </h4>
                    <p className="text-xs text-slate-500 truncate mt-0.5">{address || "Địa chỉ chi tiết"}</p>

                    <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                      <span className="flex items-center gap-1 font-semibold text-emerald-800">
                        <Clock size={11} /> {openingHours}
                      </span>
                      <span>·</span>
                      <span className="font-semibold text-slate-800">
                        {isFree ? "Miễn phí vé" : `${parseInt(minPrice || "0").toLocaleString("vi-VN")}đ – ${parseInt(maxPrice || "0").toLocaleString("vi-VN")}đ`}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── MODAL FOOTER ── */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={() => setCurrentStep((prev) => (prev - 1) as any)}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <ChevronLeft size={14} />
              <span>Quay lại</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            >
              Hủy
            </button>
          )}

          {currentStep < 3 ? (
            <button
              type="button"
              onClick={handleNextStep}
              className="px-5 py-2 rounded-lg text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <span>Tiếp tục bước {currentStep + 1}</span>
              <ChevronRight size={14} />
            </button>
          ) : (
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleFinalSubmit}
              className="px-5 py-2 rounded-lg text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Đang gửi đề xuất...</span>
              ) : (
                <span>Hoàn tất & Gửi duyệt</span>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
