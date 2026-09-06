import { useState, useRef, type RefObject } from "react";
import ExplorePage from "./ExplorePage";
import PlaceDetailPage from "./PlaceDetailPage";
import MapPage from "./MapPage";
import FoodPage from "./FoodPage";
import ItineraryPage from "./ItineraryPage";
import BlogPage from "./BlogPage";
import { Place } from "./data";
import {
  Search,
  MapPin,
  Star,
  Heart,
  Clock,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Mail,
  Phone,
  Share2,
  Camera,
  Play,
  Compass,
  BookOpen,
  UtensilsCrossed,
} from "lucide-react";

const HERO_IMG =
  "https://images.unsplash.com/photo-1609412058473-c199497c3c5d?w=1800&h=900&fit=crop&auto=format";
const HALONG_IMG =
  "https://images.unsplash.com/photo-1589291432463-fbddbfd10bbd?w=600&h=400&fit=crop&auto=format";
const HOIAN_IMG =
  "https://images.unsplash.com/photo-1691927644490-e1a24b366a5e?w=600&h=400&fit=crop&auto=format";
const SAPA_IMG =
  "https://images.unsplash.com/photo-1606801954050-be6b29588460?w=600&h=400&fit=crop&auto=format";
const STREET_FOOD_IMG =
  "https://images.unsplash.com/photo-1687902409602-8b7cf039a44a?w=600&h=400&fit=crop&auto=format";
const BANH_MI_IMG =
  "https://images.unsplash.com/photo-1763703686284-b63557b08a86?w=600&h=400&fit=crop&auto=format";
const DALAT_IMG =
  "https://images.unsplash.com/photo-1733372607228-6aeaa92c5e62?w=600&h=400&fit=crop&auto=format";
const PHO_IMG =
  "https://images.unsplash.com/photo-1509072619873-adb3dc289b50?w=600&h=400&fit=crop&auto=format";
const PHONG_NHA_IMG =
  "https://images.unsplash.com/photo-1547024842-7c86b2226ef5?w=600&h=400&fit=crop&auto=format";
const BLOG1_IMG =
  "https://images.unsplash.com/photo-1505474975305-453b4ac9b972?w=600&h=400&fit=crop&auto=format";
const BLOG2_IMG =
  "https://images.unsplash.com/photo-1732098407342-6b6a05e3da3d?w=600&h=400&fit=crop&auto=format";
const BLOG3_IMG =
  "https://images.unsplash.com/photo-1569271532956-3fb81a207115?w=600&h=400&fit=crop&auto=format";

function ImgWithFallback({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const [errored, setErrored] = useState(false);
  return errored ? (
    <div className={`bg-emerald-100 flex items-center justify-center ${className}`}>
      <MapPin className="text-emerald-400" size={32} />
    </div>
  ) : (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setErrored(true)}
    />
  );
}

const navLinks = [
  "Trang chủ",
  "Khám phá",
  "Bản đồ",
  "Ẩm thực",
  "Hành trình",
  "Blog",
];

const quickSuggestions = [
  "Miền Bắc",
  "Miền Trung",
  "Miền Nam",
  "TP. Hồ Chí Minh",
  "Hà Nội",
  "Đà Nẵng",
];

const mienBac = [
  {
    name: "Hà Nội",
    tag: "HOT",
    tagColor: "bg-red-500",
    desc: "Thủ đô nghìn năm văn hiến, 36 phố phường rêu phong và ẩm thực tinh hoa nức tiếng.",
    img: BLOG1_IMG,
  },
  {
    name: "Sa Pa",
    tag: "LÀO CAI",
    tagColor: "bg-emerald-700",
    desc: "Thị trấn trong mây, ruộng bậc thang kỳ vĩ và nóc nhà Đông Dương Fansipan.",
    img: SAPA_IMG,
  },
  {
    name: "Vịnh Hạ Long",
    tag: "UNESCO",
    tagColor: "bg-blue-600",
    desc: "Kỳ quan thiên nhiên thế giới với hàng ngàn đảo đá vôi nhô lên từ làn nước ngọc bích.",
    img: HALONG_IMG,
  },
  {
    name: "Ninh Bình",
    tag: "TRÀNG AN",
    tagColor: "bg-emerald-700",
    desc: "Vịnh Hạ Long trên cạn, hang Múa tuyệt đẹp và non nước Tràng An hữu tình.",
    img: DALAT_IMG,
  },
  {
    name: "Hà Giang",
    tag: "ĐỒNG VĂN",
    tagColor: "bg-orange-600",
    desc: "Đèo Mã Pí Lèng hiểm trở, dòng sông Nho Quế xanh ngắt và mùa hoa tam giác mạch.",
    img: BLOG2_IMG,
  },
];

const mienTrung = [
  {
    name: "Hội An",
    tag: "HOT",
    tagColor: "bg-red-500",
    desc: "Phố cổ lung linh hoa đăng, những mảng tường vàng hoài niệm và cà phê bên sông Hoài.",
    img: HOIAN_IMG,
  },
  {
    name: "Đà Nẵng",
    tag: "BIỂN MỸ KHÊ",
    tagColor: "bg-blue-600",
    desc: "Thành phố đáng sống, bãi biển quyến rũ hàng đầu hành tinh và Cầu Vàng nổi tiếng.",
    img: BLOG3_IMG,
  },
  {
    name: "Đà Lạt",
    tag: "HOT",
    tagColor: "bg-red-500",
    desc: "Thành phố ngàn hoa, không khí mát lành, rừng thông bạt ngàn và những quán cafe thơ mộng.",
    img: DALAT_IMG,
  },
  {
    name: "Huế",
    tag: "CỐ ĐÔ",
    tagColor: "bg-purple-700",
    desc: "Kinh thành cổ kính, sông Hương êm đềm và ẩm thực cung đình truyền thống đặc sắc.",
    img: BLOG1_IMG,
  },
  {
    name: "Phong Nha",
    tag: "KỲ QUAN",
    tagColor: "bg-emerald-700",
    desc: "Hệ thống hang động thạch nhũ huyền ảo triệu năm tuổi và thiên nhiên hoang sơ tráng lệ.",
    img: PHONG_NHA_IMG,
  },
];

const mienNam = [
  {
    name: "TP. Hồ Chí Minh",
    tag: "HOT",
    tagColor: "bg-red-500",
    desc: "Thành phố không ngủ, nhịp sống hiện đại giao thoa cùng văn hóa ẩm thực đường phố độc đáo.",
    img: STREET_FOOD_IMG,
  },
  {
    name: "Vũng Tàu",
    tag: "BÀ RỊA",
    tagColor: "bg-blue-600",
    desc: "Gió biển mát rượi, ngọn hải đăng cổ kính và thiên đường hải sản tươi sống chỉ cách Sài Gòn 2 giờ.",
    img: HALONG_IMG,
  },
  {
    name: "Phú Quốc",
    tag: "ĐẢO NGỌC",
    tagColor: "bg-amber-500",
    desc: "Hoàng hôn buông đỏ rực rỡ, bãi sao cát trắng mịn và những khu nghỉ dưỡng sang trọng bậc nhất.",
    img: BLOG2_IMG,
  },
  {
    name: "Cần Thơ",
    tag: "CHỢ NỔI",
    tagColor: "bg-orange-600",
    desc: "Tây Đô hiền hòa, chợ nổi Cái Răng tấp nập sớm mai và miệt vườn trĩu quả thơm lừng.",
    img: DALAT_IMG,
  },
  {
    name: "An Giang",
    tag: "TRÀ SƯ",
    tagColor: "bg-emerald-700",
    desc: "Thảm bèo xanh mướt trải dài mùa nước nổi và văn hóa giao thoa đa sắc tộc Chăm, Khmer, Kinh.",
    img: BLOG3_IMG,
  },
];

const regions = [
  {
    label: "Miền Bắc",
    subtitle: "Hùng vĩ & hoang sơ",
    accent: "#064E3B",
    light: "#ECFDF5",
    data: mienBac,
  },
  {
    label: "Miền Trung",
    subtitle: "Di sản & biển xanh",
    accent: "#1D4ED8",
    light: "#EFF6FF",
    data: mienTrung,
  },
  {
    label: "Miền Nam",
    subtitle: "Sôi động & phóng khoáng",
    accent: "#EA580C",
    light: "#FFF7ED",
    data: mienNam,
  },
];

const tours = [
  {
    title: "Tour Xe Máy Trải Nghiệm Ẩm Thực Đường Phố Sài Gòn (Chuẩn Michelin)",
    price: "750.000đ",
    rating: 5.0,
    reviews: 9642,
    img: STREET_FOOD_IMG,
    badge: "MICHELIN",
  },
  {
    title: "Khám Phá Sài Gòn Về Đêm Bằng Xe Máy & Thưởng Thức Món Ngon Hẻm",
    price: "680.000đ",
    rating: 5.0,
    reviews: 745,
    img: BLOG1_IMG,
    badge: "ĐÊM SÀI GÒN",
  },
  {
    title: "Tour VIP Khám Phá Địa Đạo Củ Chi & Trải Nghiệm Miệt Vườn Sông Nước",
    price: "850.000đ",
    rating: 5.0,
    reviews: 1185,
    img: BLOG2_IMG,
    badge: "VIP",
  },
  {
    title: "Du Thuyền Hoàng Hôn Sông Sài Gòn & Ẩm Thực Tinh Hoa Ven Sông",
    price: "1.250.000đ",
    rating: 5.0,
    reviews: 2336,
    img: HALONG_IMG,
    badge: "DU THUYỀN",
  },
];

const foodRegionFilters = ["Tất cả", "Miền Bắc", "Miền Trung", "Miền Nam"];

const foods = [
  {
    name: "Phở Bò Gia Truyền",
    origin: "Hà Nội",
    region: "Miền Bắc",
    img: PHO_IMG,
    color: "from-emerald-900/60",
  },
  {
    name: "Bánh Mì Phố Cổ",
    origin: "Hội An",
    region: "Miền Trung",
    img: BANH_MI_IMG,
    color: "from-amber-900/60",
  },
  {
    name: "Bún Bò Cố Đô",
    origin: "Thừa Thiên Huế",
    region: "Miền Trung",
    img: BLOG1_IMG,
    color: "from-red-900/60",
  },
  {
    name: "Cơm Tấm Sườn Bì",
    origin: "TP. Hồ Chí Minh",
    region: "Miền Nam",
    img: STREET_FOOD_IMG,
    color: "from-orange-900/60",
  },
];

const itineraries = [
  {
    title: "Đà Lạt - Thành phố mộng mơ",
    duration: "3N2Đ",
    type: "Nghỉ dưỡng",
    rating: 4.9,
    reviews: 128,
    author: "Nguyễn Minh Anh",
    desc: "Trải nghiệm săn mây Cầu Đất, nhâm nhi cà phê đồi thông và khám phá các góc check-in cực thơ.",
    img: DALAT_IMG,
    avatar: "NMA",
  },
  {
    title: "Sa Pa - Chinh phục Fansipan",
    duration: "4N3Đ",
    type: "Trải nghiệm",
    rating: 4.8,
    reviews: 95,
    author: "Hoàng Nam",
    desc: "Chinh phục đỉnh Fansipan hùng vĩ, khám phá văn hóa bản Cát Cát và thưởng thức lẩu cá tầm nóng hổi.",
    img: SAPA_IMG,
    avatar: "HN",
  },
];

const blogs = [
  {
    title: "10 món ăn đường phố nhất định phải thử khi đến Sài Gòn",
    tag: "ẨM THỰC",
    author: "Nguyễn Minh Anh",
    readTime: "5 phút đọc",
    desc: "Cơm tấm đêm, hủ tiếu gõ và các quán ốc hẻm sâu mang đậm nét bình dị khó quên của đất Sài Thành.",
    img: STREET_FOOD_IMG,
  },
  {
    title: "Hành trình trekking khám phá hệ thống hang động Phong Nha",
    tag: "KINH NGHIỆM",
    author: "Tuấn Phong",
    readTime: "7 phút đọc",
    desc: "Cẩm nang chuẩn bị thể lực và trang thiết bị an toàn cho chuyến đi vượt rừng khám phá hang động kỳ vĩ.",
    img: PHONG_NHA_IMG,
  },
  {
    title: "Nghệ thuật thưởng thức cà phê trứng giữa lòng phố cổ Hà Nội",
    tag: "VĂN HÓA",
    author: "Minh Tú",
    readTime: "4 phút đọc",
    desc: "Một tách cà phê thơm béo kể lại lịch sử và gu ẩm thực tinh tế của người Tràng An qua bao thế hệ.",
    img: BLOG3_IMG,
  },
];

export default function App() {
  const [activeNav, setActiveNav] = useState("Trang chủ");
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [foodFilter, setFoodFilter] = useState("Tất cả");
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [visitHistory, setVisitHistory] = useState<Place[]>([]);

  const handleSelectPlace = (place: Place) => {
    setSelectedPlace(place);
    setVisitHistory((prev) => {
      const filtered = prev.filter((p) => p.id !== place.id);
      return [place, ...filtered].slice(0, 20);
    });
  };
  const carouselRef0 = useRef<HTMLDivElement>(null);
  const carouselRef1 = useRef<HTMLDivElement>(null);
  const carouselRef2 = useRef<HTMLDivElement>(null);
  const carouselRefs = [carouselRef0, carouselRef1, carouselRef2];
  const [carouselPages, setCarouselPages] = useState([0, 0, 0]);

  const CARDS_PER_PAGE = 4;

  const goPage = (ri: number, dir: number) => {
    const ref = carouselRefs[ri];
    if (!ref.current) return;
    const W = ref.current.clientWidth;
    const maxPage = Math.ceil(regions[ri].data.length / CARDS_PER_PAGE) - 1;
    setCarouselPages((prev) => {
      const next = [...prev];
      next[ri] = Math.max(0, Math.min(maxPage, prev[ri] + dir));
      ref.current!.scrollTo({ left: next[ri] * (W + 16), behavior: "smooth" });
      return next;
    });
  };

  const toggleFav = (i: number) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  };

  const filteredFoods =
    foodFilter === "Tất cả"
      ? foods
      : foods.filter((f) => f.region === foodFilter);

  if (selectedPlace) {
    return (
      <div className="min-h-full font-['Inter',system-ui,sans-serif]">
        <header className="sticky top-0 z-50 border-b border-slate-200" style={{ background: "rgba(255,255,255,0.92)", backdropFilter: "blur(12px)" }}>
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-8">
            <a href="#" className="flex-shrink-0 text-2xl font-bold tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }} onClick={() => { setSelectedPlace(null); setActiveNav("Trang chủ"); }}>
              <span style={{ color: "#0F172A" }}>LangThang</span><span style={{ color: "#EA580C" }}>.</span>
            </a>
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <button key={link} onClick={() => { setSelectedPlace(null); setActiveNav(link); }}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                  style={{ color: "#374151" }}>{link}</button>
              ))}
            </nav>
            <button className="text-sm font-semibold px-5 py-2.5 rounded-lg text-white" style={{ background: "#064E3B" }}>Đăng ký</button>
          </div>
        </header>
        <PlaceDetailPage
          place={selectedPlace}
          onBack={() => setSelectedPlace(null)}
          onViewMap={() => { setSelectedPlace(null); setActiveNav("Bản đồ"); }}
          onSelectPlace={handleSelectPlace}
        />
      </div>
    );
  }

  if (activeNav === "Bản đồ") {
    return (
      <div className="min-h-full font-['Inter',system-ui,sans-serif]">
        <header className="sticky top-0 z-50 border-b border-slate-200" style={{ background: "rgba(255,255,255,0.92)", backdropFilter: "blur(12px)" }}>
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-8">
            <a href="#" className="flex-shrink-0 text-2xl font-bold tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }} onClick={() => setActiveNav("Trang chủ")}>
              <span style={{ color: "#0F172A" }}>LangThang</span><span style={{ color: "#EA580C" }}>.</span>
            </a>
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <button key={link} onClick={() => setActiveNav(link)}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                  style={activeNav === link ? { color: "#064E3B", background: "#ECFDF5" } : { color: "#374151" }}>{link}</button>
              ))}
            </nav>
            <button className="text-sm font-semibold px-5 py-2.5 rounded-lg text-white" style={{ background: "#064E3B" }}>Đăng ký</button>
          </div>
        </header>
        <MapPage history={visitHistory} onSelectPlace={handleSelectPlace} />
      </div>
    );
  }

  if (activeNav === "Khám phá") {
    return (
      <div className="min-h-full font-['Inter',system-ui,sans-serif]">
        {/* ── HEADER ── */}
        <header
          className="sticky top-0 z-50 border-b border-slate-200"
          style={{ background: "rgba(255,255,255,0.92)", backdropFilter: "blur(12px)" }}
        >
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-8">
            <a href="#" className="flex-shrink-0 text-2xl font-bold tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }} onClick={() => setActiveNav("Trang chủ")}>
              <span style={{ color: "#0F172A" }}>LangThang</span>
              <span style={{ color: "#EA580C" }}>.</span>
            </a>
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <button
                  key={link}
                  onClick={() => setActiveNav(link)}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                  style={activeNav === link ? { color: "#064E3B", background: "#ECFDF5" } : { color: "#374151" }}
                >
                  {link}
                </button>
              ))}
            </nav>
            <div className="flex items-center gap-3">
              <button className="hidden sm:block text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Đăng nhập</button>
              <button className="text-sm font-semibold px-5 py-2.5 rounded-lg text-white" style={{ background: "#064E3B" }}>Đăng ký</button>
            </div>
          </div>
        </header>
        <ExplorePage onSelectPlace={handleSelectPlace} />
      </div>
    );
  }

  if (activeNav === "Ẩm thực") {
    return (
      <div className="min-h-full font-['Inter',system-ui,sans-serif]">
        <header
          className="sticky top-0 z-50 border-b border-slate-200"
          style={{ background: "rgba(255,255,255,0.92)", backdropFilter: "blur(12px)" }}
        >
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-8">
            <a href="#" className="flex-shrink-0 text-2xl font-bold tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }} onClick={() => setActiveNav("Trang chủ")}>
              <span style={{ color: "#0F172A" }}>LangThang</span>
              <span style={{ color: "#EA580C" }}>.</span>
            </a>
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <button
                  key={link}
                  onClick={() => setActiveNav(link)}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                  style={activeNav === link ? { color: "#064E3B", background: "#ECFDF5" } : { color: "#374151" }}
                >
                  {link}
                </button>
              ))}
            </nav>
            <div className="flex items-center gap-3">
              <button className="hidden sm:block text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Đăng nhập</button>
              <button className="text-sm font-semibold px-5 py-2.5 rounded-lg text-white" style={{ background: "#064E3B" }}>Đăng ký</button>
            </div>
          </div>
        </header>
        <FoodPage onSelectPlace={handleSelectPlace} />
      </div>
    );
  }

  if (activeNav === "Hành trình") {
    return (
      <div className="min-h-full font-['Inter',system-ui,sans-serif]">
        <header
          className="sticky top-0 z-50 border-b border-slate-200"
          style={{ background: "rgba(255,255,255,0.92)", backdropFilter: "blur(12px)" }}
        >
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-8">
            <a href="#" className="flex-shrink-0 text-2xl font-bold tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }} onClick={() => setActiveNav("Trang chủ")}>
              <span style={{ color: "#0F172A" }}>LangThang</span>
              <span style={{ color: "#EA580C" }}>.</span>
            </a>
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <button
                  key={link}
                  onClick={() => setActiveNav(link)}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                  style={activeNav === link ? { color: "#064E3B", background: "#ECFDF5" } : { color: "#374151" }}
                >
                  {link}
                </button>
              ))}
            </nav>
            <div className="flex items-center gap-3">
              <button className="hidden sm:block text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Đăng nhập</button>
              <button className="text-sm font-semibold px-5 py-2.5 rounded-lg text-white" style={{ background: "#064E3B" }}>Đăng ký</button>
            </div>
          </div>
        </header>
        <ItineraryPage />
      </div>
    );
  }

  if (activeNav === "Blog") {
    return (
      <div className="min-h-full font-['Inter',system-ui,sans-serif]">
        <header
          className="sticky top-0 z-50 border-b border-slate-200"
          style={{ background: "rgba(255,255,255,0.92)", backdropFilter: "blur(12px)" }}
        >
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-8">
            <a href="#" className="flex-shrink-0 text-2xl font-bold tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }} onClick={() => setActiveNav("Trang chủ")}>
              <span style={{ color: "#0F172A" }}>LangThang</span>
              <span style={{ color: "#EA580C" }}>.</span>
            </a>
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <button
                  key={link}
                  onClick={() => setActiveNav(link)}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                  style={activeNav === link ? { color: "#064E3B", background: "#ECFDF5" } : { color: "#374151" }}
                >
                  {link}
                </button>
              ))}
            </nav>
            <div className="flex items-center gap-3">
              <button className="hidden sm:block text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Đăng nhập</button>
              <button className="text-sm font-semibold px-5 py-2.5 rounded-lg text-white" style={{ background: "#064E3B" }}>Đăng ký</button>
            </div>
          </div>
        </header>
        <BlogPage />
      </div>
    );
  }

  return (
    <div className="min-h-full bg-stone-50 font-['Inter',system-ui,sans-serif]">
      {/* ── HEADER ── */}
      <header
        className="sticky top-0 z-50 border-b border-slate-200"
        style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(12px)" }}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-8">
          {/* Logo */}
          <a href="#" className="flex-shrink-0 text-2xl font-bold tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
            <span style={{ color: "#0F172A" }}>LangThang</span>
            <span style={{ color: "#EA580C" }}>.</span>
          </a>

          {/* Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link}
                onClick={() => setActiveNav(link)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeNav === link
                    ? "text-emerald-800 bg-emerald-50"
                    : "text-slate-700 hover:text-slate-900 hover:bg-slate-50"
                }`}
                style={activeNav === link ? { color: "#064E3B", background: "#ECFDF5" } : {}}
              >
                {link}
              </button>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button className="hidden sm:block text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
              Đăng nhập
            </button>
            <button
              className="text-sm font-semibold px-5 py-2.5 rounded-lg text-white transition-opacity hover:opacity-90"
              style={{ background: "#064E3B" }}
            >
              Đăng ký
            </button>
          </div>
        </div>
      </header>

      {/* ── KHỐI 1: HERO ── */}
      <section className="relative min-h-[88vh] flex items-center overflow-hidden">
        <ImgWithFallback
          src={HERO_IMG}
          alt="Ruộng bậc thang Mù Cang Chải"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Layered gradient: dark vignette + subtle green tint */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(6,28,20,0.78) 0%, rgba(6,78,59,0.45) 50%, rgba(0,0,0,0.25) 100%)" }} />
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 100%, rgba(6,28,20,0.6) 0%, transparent 70%)" }} />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-20 flex flex-col items-center text-center">
          <h1
            className="text-5xl md:text-6xl lg:text-[5.5rem] font-bold leading-[1.06] text-white mb-10 max-w-4xl"
            style={{ fontFamily: "'Playfair Display', serif", letterSpacing: "-0.01em" }}
          >
            Mỗi chuyến đi là{" "}
            <em className="not-italic" style={{ color: "#FDBA74" }}>một điều kỳ diệu</em>
          </h1>

          {/* Search bar — glassmorphism */}
          <div className="flex items-center gap-0 rounded-2xl overflow-hidden max-w-2xl w-full"
            style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(16px)", border: "1px solid rgba(255,255,255,0.3)", boxShadow: "0 8px 32px rgba(0,0,0,0.2)" }}>
            <div className="flex items-center flex-1 px-5 gap-3">
              <Search size={18} className="flex-shrink-0" style={{ color: "rgba(255,255,255,0.7)" }} />
              <input
                type="text"
                placeholder="Tìm địa điểm, món ngon, lịch trình..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="hero-search flex-1 text-sm outline-none bg-transparent py-4"
                style={{ color: "#fff" }}
              />
            </div>
            <button
              className="flex-shrink-0 h-full px-7 py-4 text-sm font-bold text-white transition-opacity hover:opacity-90"
              style={{ background: "#EA580C" }}
            >
              Tìm kiếm
            </button>
          </div>

          {/* CTA to explore */}
          <button
            onClick={() => setActiveNav("Khám phá")}
            className="mt-7 inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white border border-white/30 hover:bg-white/15 transition-all duration-200"
            style={{ background: "rgba(255,255,255,0.1)", backdropFilter: "blur(8px)" }}
          >
            Khám phá địa điểm <ArrowRight size={15} />
          </button>

          {/* Quick suggestions */}
          <div className="flex flex-wrap justify-center gap-2 mt-5">
            {quickSuggestions.map((s) => (
              <button
                key={s}
                className="px-3.5 py-1.5 rounded-full text-xs font-medium text-white/90 border border-white/25 hover:bg-white/15 transition-colors"
                style={{ background: "rgba(255,255,255,0.08)" }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── KHỐI 2: 3 MIỀN — 3 CAROUSEL RIÊNG ── */}
      <section className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-6 mb-10">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: "#064E3B" }}>
            <MapPin size={14} />
            Địa điểm nổi bật
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
            Khám phá 3 miền Việt Nam
          </h2>
          <p className="text-slate-500 max-w-xl leading-relaxed">
            Từ những đỉnh núi mờ sương Tây Bắc đến vẻ trù phú của miệt vườn phương Nam, mỗi vùng miền là một trang ký ức rực rỡ.
          </p>
        </div>

        <div className="space-y-10">
          {regions.map((region, ri) => (
            <div key={region.label}>
              {/* Row header */}
              <div className="max-w-7xl mx-auto px-6 flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-1 h-8 rounded-full" style={{ background: region.accent }} />
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900" style={{ fontFamily: "'Playfair Display', serif" }}>
                      {region.label}
                    </h3>
                    <p className="text-xs font-medium mt-0.5" style={{ color: region.accent }}>
                      {region.subtitle}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => goPage(ri, -1)}
                    disabled={carouselPages[ri] === 0}
                    className="w-10 h-10 rounded-full flex items-center justify-center border border-slate-300 bg-white text-slate-500 hover:border-slate-400 hover:text-slate-800 shadow-sm transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    onClick={() => goPage(ri, 1)}
                    disabled={carouselPages[ri] >= Math.ceil(regions[ri].data.length / CARDS_PER_PAGE) - 1}
                    className="w-10 h-10 rounded-full flex items-center justify-center border border-slate-300 bg-white text-slate-500 hover:border-slate-400 hover:text-slate-800 shadow-sm transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>

              {/* Carousel */}
              <div className="max-w-7xl mx-auto px-6 overflow-hidden">
                <div
                  ref={carouselRefs[ri]}
                  className="flex gap-4"
                  style={{ overflowX: "auto", scrollbarWidth: "none" }}
                >
                {region.data.map((place) => (
                  <div
                    key={place.name}
                    className="group relative rounded-2xl overflow-hidden cursor-pointer bg-slate-200"
                    style={{ width: "calc(25% - 12px)", flexShrink: 0, height: 360 }}
                  >
                    <ImgWithFallback
                      src={place.img}
                      alt={place.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.1) 55%, transparent 100%)" }} />

                    {/* Top tag */}
                    <div className="absolute top-4 left-4">
                      <span className={`${place.tagColor} text-white text-[10px] font-bold px-2.5 py-1 rounded-full tracking-widest`}>
                        {place.tag}
                      </span>
                    </div>

                    {/* Bottom content */}
                    <div className="absolute bottom-0 left-0 right-0 p-3.5">
                      <h4 className="text-white font-bold text-base leading-tight mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
                        {place.name}
                      </h4>
                      <p className="text-slate-300 text-[11px] leading-relaxed line-clamp-2 mb-2">{place.desc}</p>
                      <div
                        className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-all -translate-y-1 group-hover:translate-y-0"
                        style={{ background: region.accent, color: "#fff" }}
                      >
                        Khám phá <ChevronRight size={10} />
                      </div>
                    </div>
                  </div>
                ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── DIVIDER ── */}
      <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

      {/* ── KHỐI 3: BỘ SƯU TẬP TOURS ── */}
      <section className="py-24 relative overflow-hidden" style={{ background: "#06281E" }}>
        {/* Subtle radial glow behind content */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full opacity-20 pointer-events-none" style={{ background: "radial-gradient(ellipse, #064E3B 0%, transparent 70%)" }} />

        <div className="relative max-w-7xl mx-auto px-6">
          {/* Header */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-end mb-14">
            <div>
              <div className="flex items-center gap-2 mb-5">
                <span className="text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full" style={{ background: "rgba(234,88,12,0.2)", color: "#FDBA74", border: "1px solid rgba(234,88,12,0.3)" }}>
                  Bộ sưu tập nổi bật
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                Vòng quanh thành phố<br />
                <em className="not-italic" style={{ color: "#FDBA74" }}>mang tên Bác</em>
              </h2>
            </div>
            <div className="lg:text-right">
              <p className="text-slate-400 text-sm leading-relaxed mb-4">Những trải nghiệm chân thực, sống động nhất tại trái tim Sài Gòn hoa lệ.</p>
              <button className="inline-flex items-center gap-2 text-sm font-semibold transition-opacity hover:opacity-75" style={{ color: "#FED7AA" }}>
                Xem tất cả tour <ArrowRight size={15} />
              </button>
            </div>
          </div>

          {/* Tour cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {tours.map((tour, i) => (
              <div key={i} className="group relative rounded-2xl overflow-hidden flex flex-col" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <div className="relative overflow-hidden bg-slate-800" style={{ height: 220 }}>
                  <ImgWithFallback
                    src={tour.img}
                    alt={tour.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(6,28,20,0.7) 0%, transparent 60%)" }} />
                  <span className="absolute top-3 left-3 text-[10px] font-black px-2.5 py-1 rounded-full text-white tracking-widest" style={{ background: "#EA580C" }}>
                    {tour.badge}
                  </span>
                  <button
                    onClick={() => toggleFav(i)}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-transform hover:scale-110"
                    style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(8px)" }}
                  >
                    <Heart size={14} className={favorites.has(i) ? "fill-red-400 text-red-400" : "text-white"} />
                  </button>
                  {/* Rating overlay */}
                  <div className="absolute bottom-3 left-3 flex items-center gap-1">
                    <Star size={11} className="fill-amber-400 text-amber-400" />
                    <span className="text-xs font-bold text-white">{tour.rating}</span>
                    <span className="text-[10px] text-slate-300">({tour.reviews.toLocaleString()})</span>
                  </div>
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="text-sm font-semibold text-white leading-snug mb-4 flex-1" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {tour.title}
                  </h3>
                  <div className="flex items-center justify-between pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
                    <div>
                      <div className="text-[10px] text-slate-500 uppercase tracking-wider">Từ</div>
                      <div className="text-base font-bold" style={{ color: "#FDBA74" }}>{tour.price}</div>
                    </div>
                    <button className="text-xs font-bold px-4 py-2 rounded-xl text-white transition-all hover:brightness-110 active:scale-95" style={{ background: "#EA580C" }}>
                      Đặt ngay
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── KHỐI 4: ẨM THỰC ── */}
      <section className="py-24" style={{ background: "#FAFAF8" }}>
        <div className="max-w-7xl mx-auto px-6">
          {/* Header — split layout */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-14 pb-10" style={{ borderBottom: "1px solid #E2E8F0" }}>
            <div>
              <div className="flex items-center gap-2 mb-3">
                <UtensilsCrossed size={13} style={{ color: "#EA580C" }} />
                <span className="text-xs font-bold tracking-widest uppercase" style={{ color: "#EA580C" }}>Ẩm thực địa phương</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 whitespace-nowrap" style={{ fontFamily: "'Playfair Display', serif" }}>
                Hương vị <span style={{ color: "#064E3B" }}>Việt Nam</span>
              </h2>
              <p className="text-slate-500 text-sm mt-2 leading-relaxed">Mỗi món ăn là một câu chuyện văn hóa được chắt lọc qua nhiều thế hệ.</p>
            </div>

            {/* Filter tabs */}
            <div className="flex flex-wrap gap-2">
              {foodRegionFilters.map((f) => (
                <button
                  key={f}
                  onClick={() => setFoodFilter(f)}
                  className="px-5 py-2.5 rounded-full text-sm font-semibold transition-all"
                  style={
                    foodFilter === f
                      ? { background: "#064E3B", color: "#fff", boxShadow: "0 4px 14px rgba(6,78,59,0.3)" }
                      : { background: "#fff", color: "#475569", border: "1.5px solid #E2E8F0" }
                  }
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Food cards — tall portrait layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {filteredFoods.map((food) => (
              <div key={food.name} className="group relative rounded-3xl overflow-hidden bg-slate-100 cursor-pointer" style={{ height: 380 }}>
                <ImgWithFallback
                  src={food.img}
                  alt={food.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {/* Gradient */}
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)" }} />

                {/* Region badge top */}
                <div className="absolute top-4 right-4">
                  <span className="text-[10px] font-black tracking-widest uppercase text-white px-2.5 py-1 rounded-full" style={{ background: "rgba(6,78,59,0.85)", backdropFilter: "blur(4px)" }}>
                    {food.region}
                  </span>
                </div>

                {/* Bottom info */}
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h3 className="text-white text-lg font-bold mb-1 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {food.name}
                  </h3>
                  <div className="flex items-center gap-1.5 mb-4">
                    <MapPin size={11} className="text-slate-400" />
                    <span className="text-xs text-slate-400">{food.origin}</span>
                  </div>
                  <a
                    href="#"
                    className="inline-flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-full transition-all group-hover:gap-2.5"
                    style={{ background: "#EA580C", color: "#fff" }}
                  >
                    Khám phá địa chỉ <ArrowRight size={12} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── KHỐI 5: HÀNH TRÌNH GỢI Ý ── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-12">
            <div className="flex items-center gap-5 flex-wrap">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 whitespace-nowrap" style={{ fontFamily: "'Playfair Display', serif" }}>
                Hành trình gợi ý
              </h2>
              <span className="text-[10px] font-black px-3 py-1.5 rounded-full text-white tracking-widest" style={{ background: "#EA580C" }}>
                LỊCH TRÌNH TỐI ƯU
              </span>
            </div>
            <button className="flex items-center gap-2 text-sm font-semibold flex-shrink-0 px-5 py-2.5 rounded-full transition-all hover:opacity-80 whitespace-nowrap" style={{ background: "#ECFDF5", color: "#064E3B" }}>
              Xem tất cả <ArrowRight size={15} />
            </button>
          </div>
          <p className="text-slate-500 text-sm mb-10 -mt-6">Các lịch trình được thiết kế bài bản từ các thành viên giàu kinh nghiệm.</p>

          {/* Itinerary cards — full image with overlay */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {itineraries.map((item, i) => (
              <div key={i} className="group relative rounded-3xl overflow-hidden cursor-pointer bg-slate-200" style={{ height: 340 }}>
                <ImgWithFallback
                  src={item.img}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(6,28,20,0.8) 0%, rgba(6,78,59,0.4) 60%, transparent 100%)" }} />

                {/* Top badges */}
                <div className="absolute top-5 left-5 flex gap-2">
                  <span className="text-[10px] font-black px-3 py-1.5 rounded-full text-white tracking-widest" style={{ background: "#064E3B" }}>
                    {item.duration}
                  </span>
                  <span className="text-[10px] font-bold px-3 py-1.5 rounded-full tracking-wider" style={{ background: "rgba(255,255,255,0.15)", color: "#fff", backdropFilter: "blur(8px)" }}>
                    {item.type}
                  </span>
                </div>

                {/* Bottom content */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-white text-2xl font-bold mb-2 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {item.title}
                  </h3>
                  <p className="text-slate-300 text-sm leading-relaxed mb-5 max-w-sm">{item.desc}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold text-white ring-2 ring-white/20" style={{ background: "#064E3B" }}>
                        {item.avatar}
                      </div>
                      <span className="text-sm text-slate-300">{item.author}</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.12)", backdropFilter: "blur(8px)" }}>
                      <Star size={12} className="fill-amber-400 text-amber-400" />
                      <span className="text-sm font-bold text-white">{item.rating}</span>
                      <span className="text-xs text-slate-400">({item.reviews})</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── KHỐI 6: BLOG ── */}
      <section className="py-24" style={{ background: "#FAFAF8" }}>
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <div className="flex items-end justify-between mb-12 pb-8" style={{ borderBottom: "1px solid #E2E8F0" }}>
            <div>
              <div className="flex items-center gap-3 mb-3">
                <BookOpen size={13} style={{ color: "#EA580C" }} />
                <span className="text-xs font-bold tracking-widest uppercase" style={{ color: "#EA580C" }}>Blog & Cẩm nang</span>
                <span className="text-[10px] font-black px-2.5 py-1 rounded-full text-white tracking-widest" style={{ background: "#064E3B" }}>CHIA SẺ KINH NGHIỆM</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900" style={{ fontFamily: "'Playfair Display', serif" }}>
                Cẩm nang du lịch
              </h2>
            </div>
            <a href="#" className="hidden md:flex items-center gap-2 text-sm font-semibold transition-opacity hover:opacity-70" style={{ color: "#064E3B" }}>
              Tất cả bài viết <ArrowRight size={15} />
            </a>
          </div>

          {/* 3-column card grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {blogs.map((blog, i) => (
              <article key={i} className="group bg-white rounded-2xl overflow-hidden border border-slate-100 hover:shadow-xl transition-all duration-300 flex flex-col">
                <div className="relative overflow-hidden bg-slate-200" style={{ height: 220 }}>
                  <ImgWithFallback
                    src={blog.img}
                    alt={blog.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="text-[10px] font-black px-3 py-1.5 rounded-full text-white tracking-widest" style={{ background: "#EA580C" }}>
                      {blog.tag}
                    </span>
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3
                    className="font-bold text-slate-900 text-base leading-snug mb-3 flex-1 transition-colors group-hover:text-emerald-800"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {blog.title}
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed mb-5 line-clamp-2">{blog.desc}</p>
                  <div className="flex items-center gap-3 pt-4 text-xs text-slate-400" style={{ borderTop: "1px solid #F1F5F9" }}>
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0" style={{ background: "#064E3B" }}>
                      {blog.author.charAt(0)}
                    </div>
                    <span className="font-medium text-slate-600">{blog.author}</span>
                    <span className="text-slate-300">·</span>
                    <Clock size={11} />
                    <span>{blog.readTime}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: "#06281E", borderTop: "2px solid #EA580C" }}>
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
            {/* Brand */}
            <div className="lg:col-span-1">
              <div className="text-2xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                <span className="text-white">LangThang</span>
                <span style={{ color: "#EA580C" }}>.</span>
              </div>
              <p className="text-sm leading-relaxed mb-6" style={{ color: "#CBD5E1" }}>
                Nền tảng du lịch & ẩm thực Việt Nam — nơi mỗi hành trình trở thành một câu chuyện đáng nhớ.
              </p>
              <div className="flex gap-3">
                {[Share2, Camera, Play].map((Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    className="w-9 h-9 rounded-full flex items-center justify-center transition-colors hover:bg-emerald-700"
                    style={{ background: "rgba(255,255,255,0.08)" }}
                  >
                    <Icon size={16} className="text-white" />
                  </a>
                ))}
              </div>
            </div>

            {/* Links */}
            <div>
              <h4 className="text-sm font-bold text-white mb-5 tracking-wider uppercase">Khám phá</h4>
              <ul className="space-y-3">
                {["Miền Bắc", "Miền Trung", "Miền Nam", "Ẩm thực địa phương", "Lịch trình nổi bật"].map((l) => (
                  <li key={l}>
                    <a href="#" className="text-sm transition-colors hover:text-white" style={{ color: "#CBD5E1" }}>
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-bold text-white mb-5 tracking-wider uppercase">Hỗ trợ</h4>
              <ul className="space-y-3">
                {["Về chúng tôi", "Liên hệ", "Chính sách bảo mật", "Điều khoản sử dụng", "FAQ"].map((l) => (
                  <li key={l}>
                    <a href="#" className="text-sm transition-colors hover:text-white" style={{ color: "#CBD5E1" }}>
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h4 className="text-sm font-bold text-white mb-5 tracking-wider uppercase">Nhận tin tức</h4>
              <p className="text-sm mb-5" style={{ color: "#CBD5E1" }}>
                Đăng ký để nhận những cẩm nang du lịch và ẩm thực mới nhất.
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Email của bạn"
                  className="flex-1 min-w-0 text-sm px-4 py-2.5 rounded-xl outline-none text-white placeholder-slate-500"
                  style={{ background: "#042017", border: "1px solid #064E3B" }}
                />
                <button
                  className="flex-shrink-0 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
                  style={{ background: "#EA580C" }}
                >
                  Gửi
                </button>
              </div>
              <div className="mt-5 flex items-center gap-2 text-sm" style={{ color: "#CBD5E1" }}>
                <Phone size={14} />
                <span>1900 6868</span>
              </div>
              <div className="mt-2 flex items-center gap-2 text-sm" style={{ color: "#CBD5E1" }}>
                <Mail size={14} />
                <span>hello@langthang.vn</span>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-emerald-900 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs" style={{ color: "#CBD5E1" }}>
              © 2026 LangThang. Tất cả quyền được bảo lưu.
            </p>
            <p className="text-xs" style={{ color: "#CBD5E1" }}>
              Thiết kế với ❤ cho những tâm hồn lãng du Việt Nam
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
