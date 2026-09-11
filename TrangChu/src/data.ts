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
