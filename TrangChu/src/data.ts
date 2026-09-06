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
