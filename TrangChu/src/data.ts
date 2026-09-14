export type Place = {
  id: number;
  name: string;
  category: string;
  location: string;
  region: string;
  province: string;
  type: string;
  rating: number;
  reviews: number;
  price: string;
  priceMax: number;
  priceRange: string;
  hours: string;
  status: string;
  desc: string;
  tags: string[];
  img: string;
  lat: number;
  lng: number;
};

export const places: Place[] = [
  {
    id: 1, name: "Phở Thìn Bờ Hồ", category: "Nhà hàng",
    location: "Hoàn Kiếm, Hà Nội", region: "Miền Bắc", province: "Hà Nội",
    type: "Ăn uống", rating: 4.9, reviews: 2341,
    price: "45.000đ – 80.000đ", priceMax: 80000, priceRange: "Bình dân",
    hours: "06:00 – 22:00", status: "Đang mở",
    desc: "Quán phở gia truyền hơn 50 năm với nước dùng ngọt trong, thơm lừng xương bò hầm cả đêm. Không gian đậm chất Hà Nội xưa.",
    tags: ["Phở bò", "Quẩy", "Trứng cút"],
    img: "https://images.unsplash.com/photo-1527997921830-de1cf1f9b430?w=600&h=400&fit=crop&auto=format",
    lat: 21.0308, lng: 105.8515,
  },
  {
    id: 2, name: "Cơm Tấm Thuận Kiều", category: "Quán ăn",
    location: "Quận 3, TP. Hồ Chí Minh", region: "Miền Nam", province: "TP. Hồ Chí Minh",
    type: "Ăn uống", rating: 4.8, reviews: 1876,
    price: "55.000đ – 95.000đ", priceMax: 95000, priceRange: "Bình dân",
    hours: "07:00 – 21:00", status: "Đang mở",
    desc: "Cơm tấm sườn bì chả nổi tiếng nhất Sài Gòn, sườn nướng than hoa thơm lừng, bì trộn mỡ hành béo ngậy.",
    tags: ["Cơm tấm", "Sườn nướng", "Bì chả"],
    img: "https://images.unsplash.com/photo-1718942900279-4711345169d3?w=600&h=400&fit=crop&auto=format",
    lat: 10.7721, lng: 106.6818,
  },
  {
    id: 3, name: "Bánh Mì Phượng", category: "Tiệm bánh",
    location: "Hội An, Quảng Nam", region: "Miền Trung", province: "Quảng Nam",
    type: "Ăn uống", rating: 4.9, reviews: 5420,
    price: "25.000đ – 40.000đ", priceMax: 40000, priceRange: "Bình dân",
    hours: "06:30 – 21:30", status: "Đang mở",
    desc: "Ổ bánh mì huyền thoại được Anthony Bourdain gọi là ngon nhất thế giới. Vỏ giòn rụm, nhân thịt nguội thơm lừng.",
    tags: ["Bánh mì", "Thịt nguội", "Pate"],
    img: "https://images.unsplash.com/photo-1763703686284-b63557b08a86?w=600&h=400&fit=crop&auto=format",
    lat: 15.8793, lng: 108.3321,
  },
  {
    id: 4, name: "The Coffee House Signature", category: "Cà phê",
    location: "Quận 1, TP. Hồ Chí Minh", region: "Miền Nam", province: "TP. Hồ Chí Minh",
    type: "Ăn uống", rating: 4.6, reviews: 892,
    price: "55.000đ – 120.000đ", priceMax: 120000, priceRange: "Trung bình",
    hours: "07:00 – 23:00", status: "Đang mở",
    desc: "Không gian cà phê sang trọng với hạt rang đặc trưng, thực đơn specialty coffee phong phú.",
    tags: ["Espresso", "Cold brew", "Bánh ngọt"],
    img: "https://images.unsplash.com/photo-1762015669851-4098e655ec87?w=600&h=400&fit=crop&auto=format",
    lat: 10.7777, lng: 106.7045,
  },
  {
    id: 5, name: "Chùa Thiên Mụ", category: "Di tích",
    location: "Thành phố Huế", region: "Miền Trung", province: "Thừa Thiên Huế",
    type: "Du lịch", rating: 4.8, reviews: 3102,
    price: "Miễn phí", priceMax: 0, priceRange: "Miễn phí",
    hours: "08:00 – 17:30", status: "Đang mở",
    desc: "Ngôi chùa cổ kính linh thiêng bên dòng sông Hương thơ mộng, biểu tượng của cố đô Huế.",
    tags: ["Chùa cổ", "Sông Hương", "Tháp cổ"],
    img: "https://images.unsplash.com/photo-1569271532956-3fb81a207115?w=600&h=400&fit=crop&auto=format",
    lat: 16.4531, lng: 107.5465,
  },
  {
    id: 6, name: "Quán Bún Bò Huế Mụ Rớt", category: "Quán ăn",
    location: "TP. Huế, Thừa Thiên Huế", region: "Miền Trung", province: "Thừa Thiên Huế",
    type: "Ăn uống", rating: 4.7, reviews: 1543,
    price: "40.000đ – 65.000đ", priceMax: 65000, priceRange: "Bình dân",
    hours: "06:00 – 14:00", status: "Đóng cửa",
    desc: "Bún bò Huế chuẩn vị cố đô hơn 30 năm, nước dùng cay nồng sả ớt, giò heo chắc thịt.",
    tags: ["Bún bò", "Giò heo", "Mắm ruốc"],
    img: "https://images.unsplash.com/photo-1509072619873-adb3dc289b50?w=600&h=400&fit=crop&auto=format",
    lat: 16.4624, lng: 107.5912,
  },
  {
    id: 7, name: "Vịnh Lăng Cô", category: "Bãi biển",
    location: "Phú Lộc, Thừa Thiên Huế", region: "Miền Trung", province: "Thừa Thiên Huế",
    type: "Du lịch", rating: 4.7, reviews: 2210,
    price: "Miễn phí", priceMax: 0, priceRange: "Miễn phí",
    hours: "Cả ngày", status: "Đang mở",
    desc: "Một trong những vịnh biển đẹp nhất thế giới với bãi cát trắng dài, nước biển trong xanh.",
    tags: ["Bãi biển", "Tắm biển", "Hải sản"],
    img: "https://images.unsplash.com/photo-1784448678069-52bc77af96f6?w=600&h=400&fit=crop&auto=format",
    lat: 16.2012, lng: 108.0762,
  },
  {
    id: 8, name: "Nhà hàng Ngon", category: "Nhà hàng",
    location: "Quận 1, TP. Hồ Chí Minh", region: "Miền Nam", province: "TP. Hồ Chí Minh",
    type: "Ăn uống", rating: 4.5, reviews: 4521,
    price: "120.000đ – 350.000đ", priceMax: 350000, priceRange: "Trung bình",
    hours: "10:00 – 22:00", status: "Đang mở",
    desc: "Nhà hàng nằm trong biệt thự Pháp cổ, phục vụ hơn 60 món ăn đặc trưng ba miền trong không gian sân vườn.",
    tags: ["Đặc sản 3 miền", "Sân vườn", "Buffet"],
    img: "https://images.unsplash.com/photo-1783096163906-052d939b1685?w=600&h=400&fit=crop&auto=format",
    lat: 10.7780, lng: 106.6982,
  },
  {
    id: 9, name: "Café Gió & Nước", category: "Cà phê",
    location: "Đà Lạt, Lâm Đồng", region: "Miền Trung", province: "Lâm Đồng",
    type: "Ăn uống", rating: 4.8, reviews: 3670,
    price: "60.000đ – 130.000đ", priceMax: 130000, priceRange: "Trung bình",
    hours: "07:30 – 22:00", status: "Đang mở",
    desc: "Quán cà phê view đồi thông Đà Lạt lãng mạn, sương mờ bao phủ, ly cà phê nóng bên lò sưởi.",
    tags: ["View đồi thông", "Cà phê sữa đá", "Bánh waffle"],
    img: "https://images.unsplash.com/photo-1764745021303-c3d97bedd2c6?w=600&h=400&fit=crop&auto=format",
    lat: 11.9404, lng: 108.4369,
  },
];

// =========================================================================
// TYPES & DATA MAPPING FROM Sql_28_8.sql
// =========================================================================

export type FavoriteType = 1 | 2 | 3 | 4; // 1: Place, 2: Food, 3: Trip, 4: Blog

export interface FavoriteItem {
  id: number;
  targetId: number;
  targetType: FavoriteType;
  title: string;
  subtitle: string;
  coverImg: string;
  categoryTag: string;
  rating?: number;
  reviewCount?: number;
  price?: string;
  extraInfo?: string;
  savedDate: string;
  collection?: string; // e.g. "Săn mây Đà Lạt", "Quán ăn ngon", "Chuyến đi sắp tới"
  privateNote?: string; // Ghi chú riêng tư chỉ mình tôi thấy
}

export interface VisitLogItem {
  id: number;
  placeId: number;
  placeName: string;
  province: string;
  category: string;
  visitedDate: string; // YYYY-MM-DD or formatted
  privacy: 0 | 1; // 0: Public (Globe), 1: Private (Lock)
  rating: number; // 1 - 5 stars
  content: string;
  photos: string[];
  createdAt: string;
  spentAmount?: number; // Số tiền đã chi tiêu (VNĐ)
  companion?: "solo" | "couple" | "family" | "friends"; // Bạn đồng hành
}

export interface ProposalItem {
  id: number;
  name: string;
  category: string;
  province: string;
  address: string;
  phone?: string;
  website?: string;
  openingHours: string;
  minPrice?: number;
  maxPrice?: number;
  description: string;
  coverImg: string;
  mediaUrls: string[];
  status: 0 | 1 | 2; // 0: Pending (Chờ duyệt), 1: Approved (Đã duyệt), 2: Rejected (Từ chối)
  rejectReason?: string;
  createdAt: string;
  viewsCount?: number;
  favoritesCount?: number;
}

export interface UserReviewItem {
  id: number;
  placeId: number;
  placeName: string;
  province: string;
  category: string;
  rating: number;
  content: string;
  photos: string[];
  createdAt: string;
  helpfulCount: number;
  replyCount: number;
  ownerReply?: {
    ownerName: string;
    replyText: string;
    replyDate: string;
  };
}

export interface UserTripItem {
  id: number;
  title: string;
  duration: string;
  startDate: string;
  budgetEstimate: number;
  budgetActual?: number;
  coverImg: string;
  privacy: 0 | 1; // 0: Public, 1: Private
  status: "planning" | "ongoing" | "completed";
  stopsCount: number;
  highlights: string[];
}

export interface UserProfileData {
  userId: number;
  fullName: string;
  email: string;
  phone: string;
  avatarUrl: string;
  coverUrl: string;
  bio: string;
  job: string;
  address: string;
  rankLevel: string;
  reputationScore: number;
  joinedDate: string;
}

export const initialUserProfile: UserProfileData = {
  userId: 1,
  fullName: "Nguyễn Minh Anh",
  email: "anh.nguyen@gmail.com",
  phone: "0912 345 678",
  avatarUrl: "https://i.pravatar.cc/300?img=47",
  coverUrl: "https://images.unsplash.com/photo-1528127269322-539801943592?q=85&w=1920&auto=format&fit=crop",
  bio: "Đam mê du lịch tự túc, khám phá ẩm thực đường phố và lưu giữ những hành trình thật đẹp trên mọi miền đất nước.",
  job: "Travel Blogger & Nhiếp ảnh",
  address: "Hà Nội, Việt Nam",
  rankLevel: "Lữ khách Tinh Anh",
  reputationScore: 485,
  joinedDate: "Tháng 01, 2026",
};

export const provinceOptions = [
  "Hà Nội",
  "TP. Hồ Chí Minh",
  "Đà Nẵng",
  "Quảng Nam",
  "Thừa Thiên Huế",
  "Lâm Đồng (Đà Lạt)",
  "Lào Cai (Sa Pa)",
  "Quảng Ninh (Hạ Long)",
  "Ninh Bình",
  "Hà Giang",
  "Khánh Hòa (Nha Trang)",
  "Kiên Giang (Phú Quốc)",
  "Bà Rịa - Vũng Tàu",
  "Cần Thơ",
  "An Giang",
  "Đắk Nông",
];

export const categoryOptions = [
  { id: 1, name: "Nhà hàng & Đặc sản", type: "Ăn uống" },
  { id: 2, name: "Quán cà phê & Trà", type: "Ăn uống" },
  { id: 3, name: "Ẩm thực đường phố", type: "Ăn uống" },
  { id: 4, name: "Điểm tham quan & Di tích", type: "Du lịch" },
  { id: 5, name: "Bãi biển & Đảo", type: "Du lịch" },
  { id: 6, name: "Núi rừng & Thác nước", type: "Du lịch" },
  { id: 7, name: "Khách sạn & Homestay", type: "Lưu trú" },
  { id: 8, name: "Trải nghiệm văn hóa", type: "Văn hóa" },
];

export const initialFavorites: FavoriteItem[] = [
  {
    id: 1,
    targetId: 1,
    targetType: 1, // Place
    title: "Phở Thìn Bờ Hồ",
    subtitle: "Hoàn Kiếm, Hà Nội",
    coverImg: "https://images.unsplash.com/photo-1527997921830-de1cf1f9b430?w=600&h=400&fit=crop&auto=format",
    categoryTag: "ĐỊA ĐIỂM",
    rating: 4.9,
    reviewCount: 2341,
    price: "45.000đ – 80.000đ",
    extraInfo: "Mở cửa: 06:00 – 22:00",
    savedDate: "2 ngày trước",
    collection: "Quán ăn ngon Hà Nội",
    privateNote: "Nhớ gọi thêm quẩy giòn và ăn vào sáng sớm lúc trời se se lạnh.",
  },
  {
    id: 2,
    targetId: 3,
    targetType: 1, // Place
    title: "Bánh Mì Phượng",
    subtitle: "Hội An, Quảng Nam",
    coverImg: "https://images.unsplash.com/photo-1763703686284-b63557b08a86?w=600&h=400&fit=crop&auto=format",
    categoryTag: "ĐỊA ĐIỂM",
    rating: 4.9,
    reviewCount: 5420,
    price: "25.000đ – 40.000đ",
    extraInfo: "Mở cửa: 06:30 – 21:30",
    savedDate: "3 ngày trước",
    collection: "Món ngon phố cổ",
    privateNote: "Mua 2 ổ mang ra bờ sông Hoài ngồi ngắm đèn lồng hoàng hôn.",
  },
  {
    id: 3,
    targetId: 9,
    targetType: 1, // Place
    title: "Café Gió & Nước",
    subtitle: "Đà Lạt, Lâm Đồng",
    coverImg: "https://images.unsplash.com/photo-1764745021303-c3d97bedd2c6?w=600&h=400&fit=crop&auto=format",
    categoryTag: "ĐỊA ĐIỂM",
    rating: 4.8,
    reviewCount: 3670,
    price: "60.000đ – 130.000đ",
    extraInfo: "View đồi thông cực chill",
    savedDate: "5 ngày trước",
    collection: "Săn mây Đà Lạt",
    privateNote: "Ghé lúc 07:00 sáng chụp đồi thông không dính người.",
  },
  {
    id: 4,
    targetId: 101,
    targetType: 2, // Food
    title: "Phở Bò Gia Truyền",
    subtitle: "Đặc sản Hà Nội · Miền Bắc",
    coverImg: "https://images.unsplash.com/photo-1509072619873-adb3dc289b50?w=600&h=400&fit=crop&auto=format",
    categoryTag: "ẨM THỰC",
    rating: 5.0,
    reviewCount: 1820,
    price: "Nước dùng hầm 12 tiếng",
    extraInfo: "Top 1 ẩm thực truyền thống",
    savedDate: "1 tuần trước",
    collection: "Quán ăn ngon Hà Nội",
  },
  {
    id: 5,
    targetId: 102,
    targetType: 2, // Food
    title: "Cơm Tấm Sườn Bì Chả",
    subtitle: "Đặc sản Sài Gòn · Miền Nam",
    coverImg: "https://images.unsplash.com/photo-1687902409602-8b7cf039a44a?w=600&h=400&fit=crop&auto=format",
    categoryTag: "ẨM THỰC",
    rating: 4.9,
    reviewCount: 960,
    price: "Sườn nướng than hoa",
    extraInfo: "Món ngon đường phố nức tiếng",
    savedDate: "1 tuần trước",
    collection: "Món ngon Sài Gòn",
  },
  {
    id: 6,
    targetId: 201,
    targetType: 3, // Trip
    title: "Đà Lạt Chậm Rãi · 3 Ngày 2 Đêm",
    subtitle: "Lịch trình săn mây & đồi thông",
    coverImg: "https://images.unsplash.com/photo-1733372607228-6aeaa92c5e62?w=600&h=400&fit=crop&auto=format",
    categoryTag: "HÀNH TRÌNH",
    rating: 4.9,
    reviewCount: 128,
    extraInfo: "12 điểm dừng · Nghỉ dưỡng",
    savedDate: "2 tuần trước",
    collection: "Săn mây Đà Lạt",
  },
  {
    id: 7,
    targetId: 301,
    targetType: 4, // Blog
    title: "48 giờ ở Hội An: đi chậm để cảm nhận phố cổ",
    subtitle: "Bởi Nguyễn Minh Anh · 5 phút đọc",
    coverImg: "https://images.unsplash.com/photo-1691927644490-e1a24b366a5e?w=600&h=400&fit=crop&auto=format",
    categoryTag: "BÀI VIẾT",
    rating: 5.0,
    reviewCount: 84,
    extraInfo: "Kinh nghiệm thực tế & địa điểm ăn sáng",
    savedDate: "2 tuần trước",
    collection: "Món ngon phố cổ",
  },
];

export const initialVisitLogs: VisitLogItem[] = [
  {
    id: 1,
    placeId: 9,
    placeName: "Cà phê Mây Lang Thang",
    province: "Đà Lạt, Lâm Đồng",
    category: "Cà phê & Điểm ngắm cảnh",
    visitedDate: "10/08/2026",
    privacy: 0, // Public (Globe)
    rating: 5,
    spentAmount: 180000,
    companion: "couple",
    content: "Không gian yên tĩnh, nhìn xuống thung lũng rất đẹp vào sáng sớm khi sương chưa tan. Cà phê trứng thơm ngậy và nhân viên siêu thân thiện. Chắc chắn sẽ quay lại!",
    photos: [
      "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=85&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1764745021303-c3d97bedd2c6?w=600&h=400&fit=crop&auto=format",
    ],
    createdAt: "2026-08-10T14:30:00Z",
  },
  {
    id: 2,
    placeId: 3,
    placeName: "Bánh Mì Phượng",
    province: "Hội An, Quảng Nam",
    category: "Ẩm thực đường phố",
    visitedDate: "28/07/2026",
    privacy: 1, // Private (Lock)
    rating: 4,
    spentAmount: 70000,
    companion: "friends",
    content: "Nước sốt pate béo ngậy đặc trưng, bánh mì giòn rụm dù ăn tại chỗ hay mang về. Giờ cao điểm xếp hàng hơi đông khoảng 15 phút nhưng rất xứng đáng.",
    photos: [
      "https://images.unsplash.com/photo-1763703686284-b63557b08a86?w=600&h=400&fit=crop&auto=format",
    ],
    createdAt: "2026-07-28T09:15:00Z",
  },
  {
    id: 3,
    placeId: 1,
    placeName: "Phở Thìn Bờ Hồ",
    province: "Hoàn Kiếm, Hà Nội",
    category: "Nhà hàng truyền thống",
    visitedDate: "15/06/2026",
    privacy: 0, // Public (Globe)
    rating: 5,
    spentAmount: 130000,
    companion: "solo",
    content: "Buổi sáng Hà Nội se se lạnh ăn bát phở tái lăn nhiều hành thì không còn gì bằng. Nước dùng ngọt thanh béo ngậy, quẩy giòn tan.",
    photos: [
      "https://images.unsplash.com/photo-1527997921830-de1cf1f9b430?w=600&h=400&fit=crop&auto=format",
    ],
    createdAt: "2026-06-15T08:00:00Z",
  },
];

export const initialProposals: ProposalItem[] = [
  {
    id: 1,
    name: "Đồi Chè Cầu Đất Farm",
    category: "Điểm tham quan & Di tích",
    province: "Lâm Đồng (Đà Lạt)",
    address: "Thôn Cầu Đất, Xã Xuân Trường, TP. Đà Lạt",
    phone: "0263 3838 123",
    website: "https://caudatfarm.vn",
    openingHours: "06:00 – 17:30",
    minPrice: 50000,
    maxPrice: 150000,
    description: "Không gian đồi chè xanh bạt ngàn với tuabin gió khổng lồ, điểm săn mây bình minh tuyệt đẹp của Đà Lạt.",
    coverImg: "https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?q=85&w=600&auto=format&fit=crop",
    mediaUrls: [
      "https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?q=85&w=600&auto=format&fit=crop",
    ],
    status: 1, // Approved
    viewsCount: 1420,
    favoritesCount: 86,
    createdAt: "2026-08-01",
  },
  {
    id: 2,
    name: "Hồ Tà Đùng - Vịnh Hạ Long Tây Nguyên",
    category: "Núi rừng & Thác nước",
    province: "Đắk Nông",
    address: "Xã Đắk Som, Huyện Đắk Glong, Tỉnh Đắk Nông",
    openingHours: "07:00 – 18:00",
    minPrice: 100000,
    maxPrice: 300000,
    description: "Quần thể hơn 40 hòn đảo lớn nhỏ nhấp nhô giữa lòng hồ nước trong xanh, khí hậu mát mẻ quanh năm.",
    coverImg: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=85&w=600&auto=format&fit=crop",
    mediaUrls: [
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=85&w=600&auto=format&fit=crop",
    ],
    status: 0, // Pending
    createdAt: "2026-09-02",
  },
  {
    id: 3,
    name: "Quán Nướng Khói Hoàng Hôn",
    category: "Nhà hàng & Đặc sản",
    province: "Lâm Đồng (Đà Lạt)",
    address: "Hẻm 31 Sào Nam, Phường 11, TP. Đà Lạt",
    phone: "0908 777 xxx",
    openingHours: "16:30 – 23:00",
    minPrice: 150000,
    maxPrice: 350000,
    description: "Quán nướng sườn bò view hoàng hôn cực chill giữa rừng thông.",
    coverImg: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=400&fit=crop&auto=format",
    mediaUrls: [
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=400&fit=crop&auto=format",
    ],
    status: 2, // Revisions needed / Rejected
    rejectReason: "Ban Quản Trị: Ảnh chụp chưa rõ biển hiệu địa điểm. Vui lòng bổ sung số điện thoại liên hệ chính xác và ảnh chụp mặt tiền quán để được duyệt lên bản đồ.",
    createdAt: "2026-08-25",
  },
];

export const initialReviews: UserReviewItem[] = [
  {
    id: 1,
    placeId: 9,
    placeName: "Cà phê Mây Lang Thang",
    province: "Đà Lạt, Lâm Đồng",
    category: "Cà phê & Điểm ngắm cảnh",
    rating: 5,
    content: "Không gian yên tĩnh, nhìn xuống thung lũng rất đẹp vào sáng sớm khi mây chưa tan. Nhân viên dễ thương và cà phê trứng thơm béo, rất đáng để ghé khi đến Đà Lạt.",
    photos: [
      "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=85&w=1200&auto=format&fit=crop",
    ],
    createdAt: "2 giờ trước",
    helpfulCount: 14,
    replyCount: 3,
    ownerReply: {
      ownerName: "Ban quản lý Mây Lang Thang",
      replyText: "Cảm ơn bạn Minh Anh đã dành lời khen cho quán! Lần sau ghé quán nhớ nhắn trước để tụi mình giữ bàn view thung lũng đẹp nhất cho bạn nhé.",
      replyDate: "1 giờ trước",
    },
  },
  {
    id: 2,
    placeId: 3,
    placeName: "Bánh Mì Phượng",
    province: "Hội An, Quảng Nam",
    category: "Ẩm thực đường phố",
    rating: 4,
    content: "Bánh mì giòn rụm, pate đậm đà. Vào giờ ăn trưa xếp hàng khoảng 15 phút, các bạn nên đi sớm để tránh đông nhé.",
    photos: [
      "https://images.unsplash.com/photo-1763703686284-b63557b08a86?w=600&h=400&fit=crop&auto=format",
    ],
    createdAt: "Hôm qua",
    helpfulCount: 8,
    replyCount: 1,
  },
];

export const initialTrips: UserTripItem[] = [
  {
    id: 1,
    title: "Đà Lạt Chậm Rãi · Săn Mây & Cà Phê",
    duration: "3 Ngày 2 Đêm",
    startDate: "15/10/2026",
    budgetEstimate: 3500000,
    budgetActual: 3200000,
    coverImg: "https://images.unsplash.com/photo-1733372607228-6aeaa92c5e62?w=600&h=400&fit=crop&auto=format",
    privacy: 0, // Public
    status: "planning",
    stopsCount: 8,
    highlights: ["Săn mây Cầu Đất", "Cà phê Mây Lang Thang", "Lẩu gà lá é Tao Ngộ", "Rừng thông Tuyền Lâm"],
  },
  {
    id: 2,
    title: "Hành Trình Di Sản Miền Trung (Huế - Hội An)",
    duration: "4 Ngày 3 Đêm",
    startDate: "20/07/2026",
    budgetEstimate: 5000000,
    budgetActual: 4850000,
    coverImg: "https://images.unsplash.com/photo-1691927644490-e1a24b366a5e?w=600&h=400&fit=crop&auto=format",
    privacy: 1, // Private (Chỉ mình tôi)
    status: "completed",
    stopsCount: 12,
    highlights: ["Đại Nội Huế", "Bánh Mì Phượng", "Thả hoa đăng sông Hoài", "Chùa Cầu"],
  },
];

// ═════════════════════════════════════════════════════════════════════════════
// HÀNH TRÌNH CHI TIẾT (ITINERARY PLANNER & COLLABORATION)
// ═════════════════════════════════════════════════════════════════════════════

export type TripRole = "Owner" | "Editor" | "Viewer";
export type TripPrivacy = 0 | 1 | 2; // 0: Public (Cộng đồng xem & copy), 1: Friends Only (Bạn bè), 2: Private (Chỉ cá nhân/nhóm tham gia)
export type TransportType = "Xe máy" | "Ô tô" | "Đi bộ" | "Taxi" | "Xe buýt" | "Tàu hỏa" | "Máy bay";

export interface TripMember {
  id: number;
  name: string;
  avatar: string;
  email: string;
  role: TripRole;
  joinedDate?: string;
}

export interface ItineraryStop {
  id: string;
  time: string; // e.g. "07:30"
  startTime: string; // e.g. "07:30"
  endTime: string;   // e.g. "09:00"
  name: string;
  category: string;
  address?: string;
  note: string;
  costEstimate: number;
  duration: string;
  transportMode: TransportType;
  visitOrder: number;
  img: string;
  lat?: number;
  lng?: number;
  rating?: number;
}

export interface ItineraryDayData {
  dayNumber: number;
  title: string;
  date?: string; // YYYY-MM-DD or formatted
  description: string;
  stops: ItineraryStop[];
}

export interface DetailedItineraryItem {
  id: number;
  title: string;
  slug: string;
  province: string;
  region: "Miền Bắc" | "Miền Trung" | "Miền Nam" | "Tây Nguyên" | "Tự túc";
  durationDays: number;
  nightsCount: number;
  estimatedBudget: number;
  budgetTarget?: number;
  startDate?: string;
  endDate?: string;
  privacy: TripPrivacy;
  coverImg: string;
  authorName: string;
  authorAvatar: string;
  authorRank: string;
  rating: number;
  reviewCount: number;
  tags: string[];
  description: string;
  days: ItineraryDayData[];
  members: TripMember[];
  createdAt: string;
  isCustom?: boolean;
}

export const initialDetailedItineraries: DetailedItineraryItem[] = [
  {
    id: 1,
    title: "Đà Lạt 3N2Đ: Săn Mây, Đồi Thông & Hương Vị Cà Phê",
    slug: "da-lat-3n2d-san-may-ca-phe",
    province: "Lâm Đồng",
    region: "Tây Nguyên",
    durationDays: 3,
    nightsCount: 2,
    estimatedBudget: 2800000,
    budgetTarget: 3500000,
    startDate: "2026-10-15",
    endDate: "2026-10-17",
    privacy: 0, // Public
    coverImg: "https://images.unsplash.com/photo-1733372607228-6aeaa92c5e62?w=800&h=500&fit=crop&auto=format",
    authorName: "Nguyễn Minh Anh",
    authorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop",
    authorRank: "Lữ khách Tinh Anh",
    rating: 4.9,
    reviewCount: 142,
    tags: ["Săn mây", "Cà phê view đẹp", "Lẩu gà lá é", "Nghỉ dưỡng"],
    description: "Hành trình thư thả khám phá xứ sở sương mù: ngắm bình minh trên đồi chè Cầu Đất, nhâm nhi cà phê trứng thung lũng và thưởng thức ẩm thực ấm cúng giữa tiết trời se lạnh.",
    createdAt: "2026-08-15",
    members: [
      {
        id: 1,
        name: "Nguyễn Minh Anh",
        email: "anh.nguyen@gmail.com",
        avatar: "https://i.pravatar.cc/300?img=47",
        role: "Owner",
        joinedDate: "Trưởng nhóm",
      },
      {
        id: 2,
        name: "Lê Hoàng Long",
        email: "hoanglong.travel@gmail.com",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop",
        role: "Editor",
        joinedDate: "Tham gia 10/08",
      },
      {
        id: 3,
        name: "Trần Mai Phương",
        email: "maiphuong.foodie@gmail.com",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&h=120&fit=crop",
        role: "Viewer",
        joinedDate: "Tham gia 12/08",
      },
    ],
    days: [
      {
        dayNumber: 1,
        title: "Khởi hành & Chạm ngõ Cao nguyên",
        date: "15/10/2026",
        description: "Check-in khách sạn, thưởng thức bánh mì xíu mại và dạo quanh bờ hồ thơ mộng.",
        stops: [
          {
            id: "s1-1",
            time: "07:30",
            startTime: "07:30",
            endTime: "08:30",
            name: "Bánh Mì Xíu Mại Hoàng Diệu",
            category: "Ăn sáng",
            address: "26 Hoàng Diệu, Phường 5, TP. Đà Lạt",
            note: "Quán rất đông vào cuối tuần, nên đến trước 8h để thưởng thức xíu mại nóng giòn cùng chén sữa đậu nành béo ngậy.",
            costEstimate: 45000,
            duration: "1 giờ",
            transportMode: "Xe máy",
            visitOrder: 1,
            img: "https://images.unsplash.com/photo-1509722747041-616f39b57569?w=300&h=200&fit=crop",
            lat: 11.9423,
            lng: 108.4312,
            rating: 4.8,
          },
          {
            id: "s1-2",
            time: "09:00",
            startTime: "09:00",
            endTime: "11:00",
            name: "Cà phê Mây Lang Thang",
            category: "Cà phê & Ngắm cảnh",
            address: "Hẻm 7B Hoàng Hoa Thám, Phường 10, TP. Đà Lạt",
            note: "View nhìn xuống thung lũng mây trôi cực đỉnh. Thích hợp ngồi đọc sách và chụp ảnh kỷ niệm.",
            costEstimate: 85000,
            duration: "2 giờ",
            transportMode: "Xe máy",
            visitOrder: 2,
            img: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=300&h=200&fit=crop",
            lat: 11.9351,
            lng: 108.4682,
            rating: 4.9,
          },
          {
            id: "s1-3",
            time: "11:45",
            startTime: "11:45",
            endTime: "13:30",
            name: "Lẩu Gà Lá É Tao Ngộ",
            category: "Ăn trưa",
            address: "Số 5 Đường 3/4, Phường 3, TP. Đà Lạt",
            note: "Nồi lẩu chua thanh lá é thơm lừng, thịt gà ta chắc dai nhúng kèm nấm và bún tươi.",
            costEstimate: 180000,
            duration: "1.5 giờ",
            transportMode: "Xe máy",
            visitOrder: 3,
            img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&h=200&fit=crop",
            lat: 11.9284,
            lng: 108.4411,
            rating: 4.7,
          },
          {
            id: "s1-4",
            time: "14:30",
            startTime: "14:30",
            endTime: "16:00",
            name: "Dinh I Bảo Đại",
            category: "Tham quan & Di tích",
            address: "Trần Quang Diệu, Phường 10, TP. Đà Lạt",
            note: "Kiến trúc Pháp cổ kính nép mình giữa rừng thông cổ thụ, không khí yên bình.",
            costEstimate: 90000,
            duration: "1.5 giờ",
            transportMode: "Xe máy",
            visitOrder: 4,
            img: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=300&h=200&fit=crop",
            lat: 11.9312,
            lng: 108.4721,
            rating: 4.7,
          },
          {
            id: "s1-5",
            time: "16:30",
            startTime: "16:30",
            endTime: "18:00",
            name: "Hồ Xuân Hương & Quảng Trường Lâm Viên",
            category: "Dạo chơi & Check-in",
            address: "Phường 1, TP. Đà Lạt",
            note: "Đạp vịt trên mặt hồ phẳng lặng hoặc ngồi ngắm hoa atiso khổng lồ lúc hoàng hôn buông.",
            costEstimate: 0,
            duration: "1.5 giờ",
            transportMode: "Xe máy",
            visitOrder: 5,
            img: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop",
            lat: 11.9398,
            lng: 108.4435,
            rating: 4.6,
          },
        ],
      },
      {
        dayNumber: 2,
        title: "Bình Minh Cầu Đất & Chiều Rừng Thông",
        date: "16/10/2026",
        description: "Dậy sớm đón biển mây trắng bồng bềnh và khám phá những đồi thông nguyên sinh mát rượi.",
        stops: [
          {
            id: "s2-1",
            time: "05:00",
            startTime: "05:00",
            endTime: "08:00",
            name: "Đồi Chè Cầu Đất Farm",
            category: "Săn mây & Bình minh",
            address: "Thôn Cầu Đất, Xã Xuân Trường, TP. Đà Lạt",
            note: "Thời điểm mây dày nhất từ 5h30 đến 6h30 sáng. Mang áo ấm vì nhiệt độ buổi sớm chỉ khoảng 14-16°C.",
            costEstimate: 60000,
            duration: "3 giờ",
            transportMode: "Ô tô",
            visitOrder: 1,
            img: "https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?w=300&h=200&fit=crop",
            lat: 11.8951,
            lng: 108.5412,
            rating: 4.9,
          },
          {
            id: "s2-2",
            time: "11:30",
            startTime: "11:30",
            endTime: "13:00",
            name: "Bánh Căn Lệ Yersin",
            category: "Ăn trưa",
            address: "27/44 Yersin, Phường 10, TP. Đà Lạt",
            note: "Bánh căn trứng cút xíu mại béo ngậy, nước chấm mỡ hành cay the cực bắt vị.",
            costEstimate: 55000,
            duration: "1.5 giờ",
            transportMode: "Xe máy",
            visitOrder: 2,
            img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=300&h=200&fit=crop",
            lat: 11.9378,
            lng: 108.4521,
            rating: 4.6,
          },
          {
            id: "s2-3",
            time: "14:30",
            startTime: "14:30",
            endTime: "17:00",
            name: "Hồ Tuyền Lâm & Đường Hầm Điêu Khắc",
            category: "Thắng cảnh tự nhiên",
            address: "Phường 4, TP. Đà Lạt",
            note: "Mặt hồ trong xanh phẳng lặng bao bọc bởi đồi thông, có bến cano ngắm lá phong mùa thu.",
            costEstimate: 120000,
            duration: "2.5 giờ",
            transportMode: "Taxi",
            visitOrder: 3,
            img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop",
            lat: 11.8923,
            lng: 108.4215,
            rating: 4.7,
          },
          {
            id: "s2-4",
            time: "18:30",
            startTime: "18:30",
            endTime: "21:00",
            name: "Phố Ẩm Thực Chợ Đêm Đà Lạt",
            category: "Chợ đêm & Mua sắm",
            address: "Đường Nguyễn Thị Minh Khai, Phường 1, TP. Đà Lạt",
            note: "Thưởng thức bánh tráng nướng 'pizza Việt Nam', sữa hạt ấm và mua dâu tây tươi về làm quà.",
            costEstimate: 150000,
            duration: "2.5 giờ",
            transportMode: "Đi bộ",
            visitOrder: 4,
            img: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=300&h=200&fit=crop",
            lat: 11.9419,
            lng: 108.4358,
            rating: 4.5,
          },
        ],
      },
      {
        dayNumber: 3,
        title: "Ga Cổ, Vườn Hoa & Trở Về",
        date: "17/10/2026",
        description: "Chiêm ngưỡng kiến trúc Đông Dương hoài cổ và mua quà lưu niệm trước khi rời thành phố.",
        stops: [
          {
            id: "s3-1",
            time: "08:30",
            startTime: "08:30",
            endTime: "10:30",
            name: "Ga Đà Lạt - Tuyệt tác Art Deco",
            category: "Di tích lịch sử",
            address: "Đường Quang Trung, Phường 9, TP. Đà Lạt",
            note: "Nhà ga cổ nhất Đông Dương với đầu tàu hơi nước huyền thoại, góc chụp ảnh đậm chất điện ảnh.",
            costEstimate: 30000,
            duration: "2 giờ",
            transportMode: "Xe máy",
            visitOrder: 1,
            img: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=300&h=200&fit=crop",
            lat: 11.9416,
            lng: 108.4552,
            rating: 4.8,
          },
          {
            id: "s3-2",
            time: "11:30",
            startTime: "11:30",
            endTime: "13:30",
            name: "Cơm Niêu Như Ngọc",
            category: "Ăn trưa truyền thống",
            address: "19/8 Hồ Tùng Mậu, Phường 3, TP. Đà Lạt",
            note: "Cơm niêu đập giòn rụm chấm kho quẹt, ăn cùng cá kho tộ và canh atiso hầm sườn non.",
            costEstimate: 180000,
            duration: "2 giờ",
            transportMode: "Xe máy",
            visitOrder: 2,
            img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&h=200&fit=crop",
            lat: 11.9362,
            lng: 108.4419,
            rating: 4.6,
          },
        ],
      },
    ],
  },
  {
    id: 2,
    title: "Di Sản Miền Trung 4N3Đ: Cố Đô Huế & Phố Cổ Hội An",
    slug: "di-san-mien-trung-hue-hoi-an-4n3d",
    province: "Thừa Thiên Huế & Quảng Nam",
    region: "Miền Trung",
    durationDays: 4,
    nightsCount: 3,
    estimatedBudget: 4200000,
    budgetTarget: 5000000,
    startDate: "2026-11-05",
    endDate: "2026-11-08",
    privacy: 0,
    coverImg: "https://images.unsplash.com/photo-1691927644490-e1a24b366a5e?w=800&h=500&fit=crop&auto=format",
    authorName: "Lê Hoàng Long",
    authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop",
    authorRank: "Chuyên gia Hành trình",
    rating: 4.9,
    reviewCount: 96,
    tags: ["Di sản UNESCO", "Ẩm thực Cố Đô", "Đèn lồng Hội An", "Văn hóa"],
    description: "Kết nối dòng sông Hương trầm mặc của Cố đô Huế với phố cổ Hội An rực rỡ sắc hoa đăng và bãi biển Cửa Đại thanh bình.",
    createdAt: "2026-07-20",
    members: [
      {
        id: 2,
        name: "Lê Hoàng Long",
        email: "hoanglong.travel@gmail.com",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop",
        role: "Owner",
      },
    ],
    days: [
      {
        dayNumber: 1,
        title: "Chào Huế trầm mặc & Đại Nội uy nghiêm",
        date: "05/11/2026",
        description: "Khám phá hoàng thành triều Nguyễn và lắng nghe ca Huế trên sông Hương.",
        stops: [
          {
            id: "h1-1",
            time: "08:00",
            startTime: "08:00",
            endTime: "09:00",
            name: "Bún Bò Huế Mụ Rớt",
            category: "Ẩm thực cung đình",
            note: "Tô bún bò cay nồng chuẩn vị, nước dùng trong vắt thơm mùi sả ruốc.",
            costEstimate: 55000,
            duration: "1 giờ",
            transportMode: "Xe máy",
            visitOrder: 1,
            img: "https://images.unsplash.com/photo-1509072619873-adb3dc289b50?w=300&h=200&fit=crop",
            lat: 16.4624,
            lng: 107.5912,
            rating: 4.7,
          },
          {
            id: "h1-2",
            time: "09:30",
            startTime: "09:30",
            endTime: "12:30",
            name: "Đại Nội Huế (Hoàng Thành)",
            category: "Di sản thế giới",
            note: "Quần thể kiến trúc cung điện Ngọ Môn, Điện Thái Hòa tráng lệ lưu giữ ký ức 143 năm triều Nguyễn.",
            costEstimate: 200000,
            duration: "3 giờ",
            transportMode: "Xe máy",
            visitOrder: 2,
            img: "https://images.unsplash.com/photo-1569271532956-3fb81a207115?w=300&h=200&fit=crop",
            lat: 16.4691,
            lng: 107.5783,
            rating: 4.9,
          },
        ],
      },
      {
        dayNumber: 2,
        title: "Vượt đèo Hải Vân đến Phố Hội rực rỡ",
        date: "06/11/2026",
        description: "Đi tàu hỏa ngắm đèo Hải Vân - vịnh Lăng Cô và thả hoa đăng trên sông Hoài.",
        stops: [
          {
            id: "h2-1",
            time: "09:00",
            startTime: "09:00",
            endTime: "12:00",
            name: "Chuyến Tàu Kết Nối Di Sản (Huế - Đà Nẵng)",
            category: "Trải nghiệm đường sắt",
            note: "Đoạn đường sắt ven biển đẹp nhất Việt Nam, nhìn trọn vịnh Lăng Cô trong xanh.",
            costEstimate: 180000,
            duration: "3 giờ",
            transportMode: "Tàu hỏa",
            visitOrder: 1,
            img: "https://images.unsplash.com/photo-1784448678069-52bc77af96f6?w=300&h=200&fit=crop",
            lat: 16.2012,
            lng: 108.0762,
            rating: 4.8,
          },
          {
            id: "h2-2",
            time: "18:00",
            startTime: "18:00",
            endTime: "21:00",
            name: "Phố Cổ Hội An & Thả Hoa Đăng Sông Hoài",
            category: "Không gian di sản",
            note: "Ngắm hàng ngàn lồng đèn rực rỡ thắp sáng các mái ngói rêu phong ven bờ sông.",
            costEstimate: 80000,
            duration: "3 giờ",
            transportMode: "Đi bộ",
            visitOrder: 2,
            img: "https://images.unsplash.com/photo-1763703686284-b63557b08a86?w=300&h=200&fit=crop",
            lat: 15.8801,
            lng: 108.338,
            rating: 5.0,
          },
        ],
      },
    ],
  },
  {
    id: 3,
    title: "Hà Nội 48H: Hương Vị Phố Cổ & Nghìn Năm Văn Hiến",
    slug: "ha-noi-48h-huong-vi-pho-co",
    province: "Hà Nội",
    region: "Miền Bắc",
    durationDays: 2,
    nightsCount: 1,
    estimatedBudget: 1500000,
    budgetTarget: 2000000,
    startDate: "2026-10-24",
    endDate: "2026-10-25",
    privacy: 1, // Friends only
    coverImg: "https://images.unsplash.com/photo-1509072619873-adb3dc289b50?w=800&h=500&fit=crop&auto=format",
    authorName: "Trần Mai Phương",
    authorAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&h=120&fit=crop",
    authorRank: "Food Reviewer",
    rating: 4.8,
    reviewCount: 88,
    tags: ["Food Tour", "36 Phố Phường", "Cà phê Trứng", "Hồ Gươm"],
    description: "48 giờ dạo bước giữa 36 phố phường Hà Nội: ăn phở tái lăn sáng sớm, nhấp cà phê Giảng thơm ngậy và ngắm hoàng hôn Hồ Tây lộng gió.",
    createdAt: "2026-09-01",
    members: [
      {
        id: 3,
        name: "Trần Mai Phương",
        email: "maiphuong.foodie@gmail.com",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&h=120&fit=crop",
        role: "Owner",
      },
    ],
    days: [
      {
        dayNumber: 1,
        title: "Một ngày dạo quanh 36 phố phường",
        date: "24/10/2026",
        description: "Thưởng thức ẩm thực trứ danh và ngắm tháp Rùa cổ kính.",
        stops: [
          {
            id: "hn1-1",
            time: "07:00",
            startTime: "07:00",
            endTime: "08:15",
            name: "Phở Thìn Bờ Hồ",
            category: "Ẩm thực truyền thống",
            note: "Tô phở tái lăn đậm đà, hành lá tươi rói bốc khói nghi ngút.",
            costEstimate: 65000,
            duration: "1.25 giờ",
            transportMode: "Đi bộ",
            visitOrder: 1,
            img: "https://images.unsplash.com/photo-1527997921830-de1cf1f9b430?w=300&h=200&fit=crop",
            lat: 21.0285,
            lng: 105.8542,
            rating: 4.8,
          },
          {
            id: "hn1-2",
            time: "09:00",
            startTime: "09:00",
            endTime: "10:30",
            name: "Cà phê Trứng Giảng 39 Nguyễn Hữu Huân",
            category: "Cà phê đặc sản",
            note: "Vị béo ngậy ngọt ngào của lớp kem trứng đánh bông quyện với cà phê phin đậm đà.",
            costEstimate: 40000,
            duration: "1.5 giờ",
            transportMode: "Đi bộ",
            visitOrder: 2,
            img: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=300&h=200&fit=crop",
            lat: 21.0342,
            lng: 105.8531,
            rating: 4.9,
          },
        ],
      },
    ],
  },
];

// ═════════════════════════════════════════════════════════════════════════════
// CẨM NANG & BLOG DU LỊCH (TRAVEL MAGAZINE & ARTICLES)
// ═════════════════════════════════════════════════════════════════════════════

export interface BlogArticleItem {
  id: number;
  slug: string;
  categoryId: number; // 1: Ẩm thực, 2: Kinh nghiệm, 3: Khám phá, 4: Lịch trình, 5: Văn hóa
  title: string;
  subtitle: string;
  excerpt: string;
  category: "Ẩm thực" | "Kinh nghiệm" | "Khám phá" | "Lịch trình" | "Văn hóa";
  coverImg: string;
  authorName: string;
  authorRole: string;
  authorAvatar: string;
  publishDate: string;
  readTime: string;
  readTimeMinutes: number;
  viewsCount: number;
  likesCount: number;
  isFeatured?: boolean;
  contentJSON: string; // Structured JSON String conforming to dbo.Blogs.ContentJSON
  sections: {
    id: string;
    heading: string;
    content: string;
    highlightTip?: string;
    image?: string;
    imageCaption?: string;
  }[];
  mentionedPlaces?: {
    name: string;
    category: string;
    province: string;
    rating: number;
    price: string;
  }[];
}

export const initialBlogArticles: BlogArticleItem[] = [
  {
    id: 1,
    slug: "hanh-trinh-theo-dau-pho-ha-noi",
    categoryId: 1,
    title: "Hành Trình Theo Dấu Phở — Từ Gánh Hàng Rong Đến Những Tô Phở Trứ Danh",
    subtitle: "Khám phá chiều sâu văn hóa ẩm thực nghìn năm qua từng lát thịt bò mỏng tang và nồi nước dùng ninh xương thâu đêm.",
    excerpt: "Một câu chuyện thấm đượm văn hóa Tràng An về gánh phở rong thế kỷ trước, bí quyết ninh xương bò 12 tiếng cùng top 3 quán phở lâu đời nhất thủ đô.",
    category: "Ẩm thực",
    coverImg: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=1200&h=650&fit=crop&auto=format",
    authorName: "Nguyễn Bảo Châu",
    authorRole: "Nhà báo ẩm thực & Văn hóa",
    authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop",
    publishDate: "05/09/2026",
    readTime: "7 phút đọc",
    readTimeMinutes: 7,
    viewsCount: 3840,
    likesCount: 268,
    isFeatured: true,
    contentJSON: JSON.stringify({
      intro: "Phở Hà Nội không đơn thuần chỉ là một món ăn sáng lót dạ, mà là một nếp sống văn hóa đã ăn sâu vào tiềm thức người Tràng An.",
      blocks: [
        { type: "heading", level: 2, text: "1. Tinh hoa kết tinh từ gánh phở rong thế kỷ trước" },
        { type: "paragraph", text: "Từ những năm đầu thế kỷ 20, tiếng rao của các gánh phở rong len lỏi qua từng con ngõ nhỏ của 36 phố phường đã trở thành âm thanh quen thuộc đánh thức cả thủ đô. Gánh phở ngày xưa gồm hai thùng gỗ: một bên chứa nồi nước dùng nghi ngút khói bên lò than hồng, một bên xếp gọn bánh phở trắng mịn, thịt bò tươi và rau thơm hành hoa." },
        { type: "quote", text: "Phở là một thứ quà đặc biệt của Hà Nội, không phải chỉ riêng Hà Nội mới có, nhưng chính là vì chỉ ở Hà Nội mới ngon. — Thạch Lam, Hà Nội 36 Phố Phường" },
        { type: "heading", level: 2, text: "2. Bí mật của nồi nước dùng trong vắt ninh 12 tiếng" },
        { type: "paragraph", text: "Điểm phân biệt một bát phở ngon thượng hạng nằm ở linh hồn của nồi nước dùng. Người đầu bếp phải tỉ mỉ chọn từng khúc xương ống bò tươi, rửa sạch qua gừng muối rồi đem hầm liu riu suốt hơn nửa ngày. Cùng với hoa hồi nướng xém, quế chi cay nồng và thảo quả thơm dịu, nước dùng giữ được độ ngọt thanh tự nhiên từ tủy xương chứ tuyệt nhiên không lạm dụng bột ngọt." },
        { type: "tip", title: "Mẹo thưởng thức chuẩn vị", text: "Người Hà Nội sành ăn thường gọi thêm một chén nước béo thơm ngậy và quẩy giòn tan cắt khúc để nhúng ngập trong tô nước phở nóng hổi khi sáng sớm còn se lạnh." },
        { type: "heading", level: 2, text: "3. Top 3 địa chỉ phở nhất định phải ghé khi đến thủ đô" },
        { type: "paragraph", text: "Nếu có dịp ghé thăm Hà Nội vào một buổi sớm se lạnh mùa thu, đừng quên ghé qua Phở Thìn Bờ Hồ trên phố Đinh Tiên Hoàng, Phở Bát Đàn xếp hàng nức tiếng phố cổ và Phở Gia Truyền 49 Bát Đàn." },
      ]
    }),
    sections: [
      {
        id: "sec-1",
        heading: "1. Tinh hoa kết tinh từ gánh phở rong thế kỷ trước",
        content: "Phở Hà Nội không đơn thuần chỉ là một món ăn sáng lót dạ, mà là một nếp sống văn hóa đã ăn sâu vào tiềm thức người Tràng An. Từ những năm đầu thế kỷ 20, tiếng rao của các gánh phở rong len lỏi qua từng con ngõ nhỏ của 36 phố phường đã trở thành âm thanh quen thuộc đánh thức cả thủ đô.",
        highlightTip: "Mẹo nhỏ: Người Hà Nội sành ăn thường gọi thêm một chén nước béo thơm ngậy và quẩy giòn tan cắt khúc để nhúng ngập trong tô nước phở nóng hổi.",
        image: "https://images.unsplash.com/photo-1509072619873-adb3dc289b50?w=800&h=450&fit=crop",
        imageCaption: "Bát phở bò tái lăn rực rỡ sắc xanh của hành lá và nước dùng sóng sánh ngậy thơm",
      },
      {
        id: "sec-2",
        heading: "2. Bí mật của nồi nước dùng trong vắt ninh 12 tiếng",
        content: "Điểm phân biệt một bát phở ngon thượng hạng nằm ở linh hồn của nồi nước dùng. Người đầu bếp phải tỉ mỉ chọn từng khúc xương ống bò tươi, rửa sạch qua gừng muối rồi đem hầm liu riu suốt hơn nửa ngày. Cùng với hoa hồi nướng xém, quế chi cay nồng và thảo quả thơm dịu, nước dùng giữ được độ ngọt thanh tự nhiên từ tủy xương chứ tuyệt nhiên không lạm dụng bột ngọt.",
        image: "https://images.unsplash.com/photo-1527997921830-de1cf1f9b430?w=800&h=450&fit=crop",
        imageCaption: "Thịt bắp bò thái mỏng chần nhanh qua nước sôi để giữ trọn vẹn độ ngọt tự nhiên",
      },
      {
        id: "sec-3",
        heading: "3. Top 3 địa chỉ phở nhất định phải ghé khi đến thủ đô",
        content: "Nếu có dịp ghé thăm Hà Nội vào một buổi sớm se lạnh mùa thu, đừng quên ghé qua Phở Thìn Bờ Hồ trên phố Đinh Tiên Hoàng, Phở Bát Đàn xếp hàng nức tiếng phố cổ và Phở Gia Truyền 49 Bát Đàn.",
      },
    ],
    mentionedPlaces: [
      { name: "Phở Thìn Bờ Hồ", category: "Nhà hàng truyền thống", province: "Hà Nội", rating: 4.9, price: "60.000đ – 85.000đ" },
      { name: "Phở Gia Truyền Bát Đàn", category: "Quán ăn phố cổ", province: "Hà Nội", rating: 4.8, price: "55.000đ – 75.000đ" },
    ],
  },
  {
    id: 2,
    slug: "hoi-an-di-cham-de-cam-nhan-pho-co",
    categoryId: 3,
    title: "48 Giờ Ở Hội An: Đi Chậm Để Cảm Nhận Nhịp Thở Phố Cổ",
    subtitle: "Vượt ra ngoài những bức tường vàng rêu phong, Hội An còn có những ngõ nhỏ tĩnh lặng và nếp sống chan hòa của cư dân phố thị.",
    excerpt: "Gợi ý lịch trình 48 giờ đón bình minh trên dòng sông Hoài, đạp xe qua những giàn hoa giấy rực rỡ và nếm thử ổ bánh mì giòn rụm bên quán cóc ven đường.",
    category: "Khám phá",
    coverImg: "https://images.unsplash.com/photo-1559447066-5f3b7f4ece12?w=1200&h=650&fit=crop&auto=format",
    authorName: "Nguyễn Minh Anh",
    authorRole: "Travel Blogger",
    authorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop",
    publishDate: "28/08/2026",
    readTime: "5 phút đọc",
    readTimeMinutes: 5,
    viewsCount: 2920,
    likesCount: 195,
    contentJSON: JSON.stringify({
      intro: "Hội An đẹp nhất không phải lúc phố lên đèn rực rỡ, mà là lúc tờ mờ sáng khi sương còn đọng trên mái ngói âm dương.",
      blocks: [
        { type: "heading", level: 2, text: "1. Bình minh thức giấc trên sông Hoài" },
        { type: "paragraph", text: "Hội An đẹp nhất vào khoảng 6 giờ sáng, khi du khách chưa thức dậy và các hàng quán chưa mở cửa đón khách. Mặt sông Hoài lặng như tờ phản chiếu bóng Chùa Cầu trăm năm tuổi, thi thoảng chỉ có tiếng mái chèo khua nước của người dân chèo đò ngang." },
        { type: "tip", title: "Khám phá bằng xe đạp", text: "Nên thuê một chiếc xe đạp nhỏ dạo quanh phố Bạch Đằng và Trần Phú vào sáng sớm để cảm nhận bầu không khí thanh bình." },
        { type: "heading", level: 2, text: "2. Những góc hẻm tường vàng và hoa giấy" },
        { type: "paragraph", text: "Len lỏi vào những con hẻm nhỏ hẹp nối giữa đường Trần Phú và Nguyễn Thái Học, bạn sẽ bắt gặp những mảng tường vàng phủ rêu phong hàng trăm năm tuổi, nơi những nhánh hoa giấy hồng rực rủ xuống dưới ánh nắng vàng ươm miền Trung." },
      ]
    }),
    sections: [
      {
        id: "sec-1",
        heading: "1. Bình minh thức giấc trên sông Hoài",
        content: "Hội An đẹp nhất vào khoảng 6 giờ sáng, khi du khách chưa thức dậy và các hàng quán chưa mở cửa đón khách. Mặt sông Hoài lặng như tờ phản chiếu bóng Chùa Cầu trăm năm tuổi, thi thoảng chỉ có tiếng mái chèo khua nước của người dân chèo đò ngang.",
        highlightTip: "Nên thuê một chiếc xe đạp nhỏ dạo quanh phố Bạch Đằng và Trần Phú vào sáng sớm để cảm nhận bầu không khí thanh bình.",
        image: "https://images.unsplash.com/photo-1763703686284-b63557b08a86?w=800&h=450&fit=crop",
        imageCaption: "Góc ngói rêu phong hoa giấy bừng nở dưới ánh nắng sớm mai Hội An",
      },
      {
        id: "sec-2",
        heading: "2. Những góc hẻm tường vàng và hoa giấy",
        content: "Len lỏi vào những con hẻm nhỏ hẹp nối giữa đường Trần Phú và Nguyễn Thái Học, bạn sẽ bắt gặp những mảng tường vàng phủ rêu phong hàng trăm năm tuổi, nơi những nhánh hoa giấy hồng rực rủ xuống dưới ánh nắng vàng ươm miền Trung.",
      }
    ],
    mentionedPlaces: [
      { name: "Bánh Mì Phượng", category: "Ẩm thực đường phố", province: "Quảng Nam", rating: 4.9, price: "25.000đ – 40.000đ" },
      { name: "Chùa Cầu Hội An", category: "Di tích lịch sử", province: "Quảng Nam", rating: 4.8, price: "Miễn phí" },
    ],
  },
  {
    id: 3,
    slug: "da-lat-mot-tuan-song-cham-giua-rung-thong",
    categoryId: 2,
    title: "Một Tuần Sống Chậm Tại Đà Lạt: Sương Mờ & Những Quán Cà Phê Thung Lũng",
    subtitle: "Gợi ý những tọa độ bình yên tách biệt khỏi phố thị ồn ào để bạn tìm lại nhịp thở tĩnh tại cho tâm hồn.",
    excerpt: "Rời xa khói bụi thành phố để tận hưởng 7 ngày ngắm sương mù trôi bồng bềnh bên đồi thông, thưởng thức tách cà phê nóng bên bếp lửa bập bùng.",
    category: "Kinh nghiệm",
    coverImg: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1200&h=650&fit=crop&auto=format",
    authorName: "Hoàng Nam",
    authorRole: "Nhiếp ảnh gia đường phố",
    authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop",
    publishDate: "15/08/2026",
    readTime: "6 phút đọc",
    readTimeMinutes: 6,
    viewsCount: 4120,
    likesCount: 310,
    contentJSON: JSON.stringify({
      intro: "Đà Lạt với tôi không phải là những điểm check-in đông đúc náo nhiệt, mà là buổi sáng thức dậy quấn mình trong chiếc áo len ấm và nghe tiếng thông reo.",
      blocks: [
        { type: "heading", level: 2, text: "1. Thức giấc giữa thung lũng bảng lảng khói sương" },
        { type: "paragraph", text: "Đà Lạt với tôi không phải là những điểm check-in đông đúc náo nhiệt. Đó là buổi sáng thức dậy quấn mình trong chiếc áo len ấm, nghe tiếng chim hót sau rặng thông và hít hà mùi đất ẩm nồng nàn sau cơn mưa đêm." },
        { type: "quote", text: "Đà Lạt có một phép màu kỳ lạ: nó làm cho những người vội vã nhất cũng phải tự động đi chậm lại một nhịp." },
        { type: "heading", level: 2, text: "2. Nhâm nhi tách cà phê trứng bên sườn đồi" },
        { type: "paragraph", text: "Ngồi ở một quán cà phê gỗ mộc mạc bên triền đồi dốc, gọi một ly cà phê trứng đánh bông ấm nóng. Ngắm nhìn làn sương mỏng tan dần theo ánh nắng mặt trời chiếu qua ngọn thông là trải nghiệm chữa lành tuyệt vời nhất." },
      ]
    }),
    sections: [
      {
        id: "sec-1",
        heading: "1. Thức giấc giữa thung lũng bảng lảng khói sương",
        content: "Đà Lạt với tôi không phải là những điểm check-in đông đúc náo nhiệt. Đó là buổi sáng thức dậy quấn mình trong chiếc áo len ấm, nghe tiếng chim hót sau rặng thông và hít hà mùi đất ẩm nồng nàn sau cơn mưa đêm.",
      },
      {
        id: "sec-2",
        heading: "2. Nhâm nhi tách cà phê trứng bên sườn đồi",
        content: "Ngồi ở một quán cà phê gỗ mộc mạc bên triền đồi dốc, gọi một ly cà phê trứng đánh bông ấm nóng. Ngắm nhìn làn sương mỏng tan dần theo ánh nắng mặt trời chiếu qua ngọn thông là trải nghiệm chữa lành tuyệt vời nhất.",
        image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&h=450&fit=crop",
        imageCaption: "Ly cà phê ấm thơm ngậy giữa không gian mây trôi thung lũng",
      }
    ],
    mentionedPlaces: [
      { name: "Café Gió & Nước", category: "Cà phê & Điểm ngắm cảnh", province: "Lâm Đồng", rating: 4.8, price: "60.000đ – 130.000đ" },
      { name: "Cà phê Mây Lang Thang", category: "Cà phê thung lũng", province: "Lâm Đồng", rating: 4.9, price: "85.000đ – 150.000đ" },
    ],
  },
];

// ═════════════════════════════════════════════════════════════════════════════
// QUẢN LÝ BẠN BÈ & ĐỒNG HÀNH (dbo.Friendships & Social System)
// ═════════════════════════════════════════════════════════════════════════════

export interface FriendPublicTrip {
  id: number;
  title: string;
  duration: string;
  stopsCount: number;
  budget: string;
  coverImg: string;
  highlights: string[];
}

export interface FriendUser {
  id: number;
  fullName: string;
  email: string;
  avatarUrl: string;
  coverUrl?: string;
  rankLevel: string;
  reputationScore: number;
  city: string;
  bio: string;
  mutualFriendsCount: number;
  commonPlacesCount: number;
  status: "accepted" | "pending_incoming" | "pending_outgoing" | "suggestion" | "blocked";
  connectedDate?: string;
  blockedDate?: string;
  publicTrips?: FriendPublicTrip[];
}

export const initialFriendsData: FriendUser[] = [
  {
    id: 2,
    fullName: "Lê Hoàng Long",
    email: "hoanglong.travel@gmail.com",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop",
    coverUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=400&fit=crop",
    rankLevel: "Chuyên gia Hành trình",
    reputationScore: 820,
    city: "Đà Nẵng",
    bio: "Đam mê leo núi, trekking Tây Bắc và cắm trại ven suối. Đã đặt chân đến 42 tỉnh thành Việt Nam.",
    mutualFriendsCount: 14,
    commonPlacesCount: 8,
    status: "accepted",
    connectedDate: "Đã kết bạn 2 tháng trước",
    publicTrips: [
      {
        id: 201,
        title: "Trekking Fansipan & Săn Mây Y Tý 3N2Đ",
        duration: "3 Ngày 2 Đêm",
        stopsCount: 9,
        budget: "3.200.000đ",
        coverImg: "https://images.unsplash.com/photo-1606801954050-be6b29588460?w=600&h=400&fit=crop",
        highlights: ["Đỉnh Fansipan 3.143m", "Bản Cát Cát", "Săn mây Ngải Thầu"],
      },
      {
        id: 202,
        title: "Chinh Phục Đèo Hải Vân & Cắm Trại Lăng Cô",
        duration: "2 Ngày 1 Đêm",
        stopsCount: 6,
        budget: "1.800.000đ",
        coverImg: "https://images.unsplash.com/photo-1784448678069-52bc77af96f6?w=600&h=400&fit=crop",
        highlights: ["Hải Vân Quan", "Vịnh Lăng Cô", "Đầm Lập An"],
      },
    ],
  },
  {
    id: 3,
    fullName: "Trần Mai Phương",
    email: "maiphuong.foodie@gmail.com",
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop",
    coverUrl: "https://images.unsplash.com/photo-1509072619873-adb3dc289b50?w=1200&h=400&fit=crop",
    rankLevel: "Food Reviewer Tinh Tế",
    reputationScore: 615,
    city: "Hà Nội",
    bio: "Review ẩm thực chân thực không quảng cáo. Nghiện phở gà lá chanh và cà phê trứng phố cổ.",
    mutualFriendsCount: 9,
    commonPlacesCount: 5,
    status: "accepted",
    connectedDate: "Đã kết bạn 3 tuần trước",
    publicTrips: [
      {
        id: 203,
        title: "Food Tour Phố Cổ Hà Nội 48 Giờ",
        duration: "2 Ngày 1 Đêm",
        stopsCount: 11,
        budget: "1.500.000đ",
        coverImg: "https://images.unsplash.com/photo-1527997921830-de1cf1f9b430?w=600&h=400&fit=crop",
        highlights: ["Phở Thìn Bờ Hồ", "Cà phê Giảng", "Chả cá Lã Vọng", "Bún chả Đắc Kim"],
      },
    ],
  },
  {
    id: 4,
    fullName: "Vũ Đình Trọng",
    email: "trongvu.outdoor@gmail.com",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
    coverUrl: "https://images.unsplash.com/photo-1687902409602-8b7cf039a44a?w=1200&h=400&fit=crop",
    rankLevel: "Phượt thủ Bền Bỉ",
    reputationScore: 510,
    city: "TP. Hồ Chí Minh",
    bio: "Lái xe máy xuyên Việt 3 lần. Luôn tìm kiếm những cung đèo ven biển lộng gió.",
    mutualFriendsCount: 6,
    commonPlacesCount: 4,
    status: "accepted",
    connectedDate: "Đã kết bạn 1 tháng trước",
    publicTrips: [
      {
        id: 204,
        title: "Phượt Xe Máy Cung Đường Ven Biển Sài Gòn - Vũng Tàu - Bình Thuận",
        duration: "3 Ngày 2 Đêm",
        stopsCount: 8,
        budget: "2.100.000đ",
        coverImg: "https://images.unsplash.com/photo-1589291432463-fbddbfd10bbd?w=600&h=400&fit=crop",
        highlights: ["Hải đăng Vũng Tàu", "Mũi Kê Gà", "Đồi cát Bàu Trắng"],
      },
    ],
  },
  {
    id: 5,
    fullName: "Đặng Thu Thảo",
    email: "thuthao.dalat@gmail.com",
    avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop",
    rankLevel: "Nhiếp ảnh gia Du lịch",
    reputationScore: 740,
    city: "Lâm Đồng",
    bio: "Nhiếp ảnh phong cảnh & chụp ảnh cưới săn mây Đà Lạt. Mong muốn kết nối cùng bạn đồng hành mê hoa.",
    mutualFriendsCount: 12,
    commonPlacesCount: 9,
    status: "pending_incoming",
    publicTrips: [
      {
        id: 205,
        title: "Săn Mây & Mùa Hoa Dã Quỳ Cao Nguyên",
        duration: "3 Ngày 2 Đêm",
        stopsCount: 7,
        budget: "2.500.000đ",
        coverImg: "https://images.unsplash.com/photo-1733372607228-6aeaa92c5e62?w=600&h=400&fit=crop",
        highlights: ["Đồi chè Cầu Đất", "Cung đèo D'ran", "Rừng thông Dasar"],
      },
    ],
  },
  {
    id: 6,
    fullName: "Phạm Quốc Bảo",
    email: "baopham.hike@gmail.com",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop",
    rankLevel: "Nhà leo núi Tự do",
    reputationScore: 430,
    city: "Lào Cai",
    bio: "Chinh phục đỉnh Ky Quan San và Fansipan mùa tuyết trắng.",
    mutualFriendsCount: 4,
    commonPlacesCount: 2,
    status: "pending_outgoing",
    publicTrips: [],
  },
  {
    id: 7,
    fullName: "Bùi Bích Ngọc",
    email: "bichngoc.heritage@gmail.com",
    avatarUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&h=150&fit=crop",
    rankLevel: "Người gìn giữ Di sản",
    reputationScore: 890,
    city: "Thừa Thiên Huế",
    bio: "Nghiên cứu văn hóa cổ truyền và áo ngũ thân. Thích các quán trà thảo mộc ven sông.",
    mutualFriendsCount: 18,
    commonPlacesCount: 11,
    status: "suggestion",
    publicTrips: [
      {
        id: 206,
        title: "Dạo Chơi Di Sản Cố Đô: Lăng Tẩm & Trà Cung Đình",
        duration: "2 Ngày 1 Đêm",
        stopsCount: 6,
        budget: "1.600.000đ",
        coverImg: "https://images.unsplash.com/photo-1569271532956-3fb81a207115?w=600&h=400&fit=crop",
        highlights: ["Lăng Tự Đức", "Chùa Thiên Mụ", "Trà đình Vũ Di"],
      },
    ],
  },
  {
    id: 8,
    fullName: "Nguyễn Tuấn Kiệt",
    email: "tuankiet.saigon@gmail.com",
    avatarUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop",
    rankLevel: "Blogger Văn hóa",
    reputationScore: 380,
    city: "TP. Hồ Chí Minh",
    bio: "Thích lang thang phố người Hoa Chợ Lớn và săn các xe hủ tiếu mì gia truyền.",
    mutualFriendsCount: 7,
    commonPlacesCount: 3,
    status: "suggestion",
    publicTrips: [],
  },
  {
    id: 9,
    fullName: "Trịnh Tuấn Khang",
    email: "tuankhang.spam@gmail.com",
    avatarUrl: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&h=150&fit=crop",
    rankLevel: "Người dùng",
    reputationScore: 50,
    city: "Bình Dương",
    bio: "Tài khoản bị hạn chế tương tác do gửi tin nhắn quảng cáo.",
    mutualFriendsCount: 1,
    commonPlacesCount: 0,
    status: "blocked",
    blockedDate: "Đã chặn 5 ngày trước",
    publicTrips: [],
  },
];

// Danh mục Báo cáo vi phạm (dbo.ReportTypes)
export const initialBlogReportTypes = [
  { id: 1, code: "WRONG_INFO", label: "Sai thông tin hoặc vị trí địa lý", desc: "Nội dung bài viết cung cấp sai số điện thoại, giá cả hoặc địa chỉ." },
  { id: 2, code: "DUPLICATE", label: "Nội dung / Bài viết bị trùng lặp", desc: "Bài viết này đã được đăng tải trước đó hoặc sao chép nguyên văn." },
  { id: 3, code: "INAPPROPRIATE", label: "Nội dung hoặc hình ảnh vi phạm", desc: "Chứa ngôn từ không phù hợp, hình ảnh phản cảm hoặc vi phạm tiêu chuẩn cộng đồng." },
  { id: 4, code: "SPAM", label: "Quảng cáo rác / Spam thương mại", desc: "Bài viết mang tính chất seeding quá đà, lừa đảo hoặc dẫn link độc hại." },
  { id: 5, code: "OTHER", label: "Lý do khác", desc: "Góp ý cập nhật khác cần ban quản trị kiểm tra." },
];

