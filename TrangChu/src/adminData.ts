// DỮ LIỆU KHỞI TẠO VÀ PHÂN QUYỀN ADMIN CẤP 1 (CLO3)
// Quản lý và kiểm duyệt nội dung trong phạm vi được phân công (AdminAssignments)

export interface AdminAssignmentInfo {
  adminId: number;
  adminName: string;
  adminEmail: string;
  adminPhone: string;
  adminAvatar: string;
  role: number; // 2: Category Admin / Regional Moderator (Admin Cấp 1)
  roleTitle: string;
  assignedRegion: string;
  assignedProvinces: string[];
  assignedCategories: string[];
  permissions: string[];
  restrictedFeatures: string[];
  assignedDate: string;
  assignedBy: string;
  stats: {
    pendingProposals: number;
    pendingReports: number;
    totalPlaces: number;
    totalFoods: number;
    totalBlogs: number;
    approvedThisMonth: number;
    rejectedThisMonth: number;
    slaHours: number;
  };
}

export const currentAdminInfo: AdminAssignmentInfo = {
  adminId: 2,
  adminName: "Lê Hoàng Nam",
  adminEmail: "nam.le.moderator@langthang.vn",
  adminPhone: "0905 123 456",
  adminAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop",
  role: 2,
  roleTitle: "Quản trị viên Danh mục (Category Admin)",
  assignedRegion: "Toàn quốc (Theo phân công danh mục)",
  assignedProvinces: ["Toàn bộ khu vực"],
  assignedCategories: [
    "Nhà hàng & Quán ăn",
    "Quán Cà phê & Trà",
    "Ẩm thực đường phố",
  ],
  permissions: [
    "Kiểm duyệt đề xuất địa điểm (Proposals) thuộc 3 danh mục Ẩm thực được giao",
    "Xử lý báo cáo vi phạm nội dung (Reports) trong phạm vi danh mục Ẩm thực",
    "Quản lý & chỉnh sửa thông tin Địa điểm thuộc danh mục phụ trách",
    "Cập nhật danh sách Món ăn đặc sản địa phương (Foods & FoodPlaces)",
    "Kiểm duyệt bài viết Cẩm nang du lịch liên quan đến ẩm thực (Blogs)",
  ],
  restrictedFeatures: [
    "Địa điểm thuộc danh mục Du lịch, Lưu trú, Vui chơi (Do Category Admin khác phụ trách)",
    "Quản trị tài khoản người dùng toàn hệ thống (Users Management - Quyền System Admin)",
    "Thêm/Xóa/Sửa cấu trúc Danh mục gốc (Categories Config - Quyền System Admin)",
    "Cấu hình hệ thống, Database và phân quyền Admin khác",
  ],
  assignedDate: "15/01/2026",
  assignedBy: "System Administrator (Trần Đại Nghĩa)",
  stats: {
    pendingProposals: 4,
    pendingReports: 3,
    totalPlaces: 28,
    totalFoods: 16,
    totalBlogs: 8,
    approvedThisMonth: 116,
    rejectedThisMonth: 19,
    slaHours: 2.1,
  },
};

export interface AdminProposalItem {
  id: number;
  userId: number;
  userName: string;
  userAvatar: string;
  userReputation: number;
  type: "NEW_PLACE" | "EDIT_PLACE";
  targetPlaceId?: number;
  targetPlaceName?: string;
  province: string;
  category: string;
  createdAt: string;
  status: 0 | 1 | 2; // 0: Pending, 1: Approved, 2: Rejected
  reviewedBy?: string;
  reviewedAt?: string;
  rejectReason?: string;
  currentData?: {
    name: string;
    category: string;
    province: string;
    address: string;
    price: string;
    hours: string;
    phone: string;
    website?: string;
    lat: number;
    lng: number;
    desc: string;
    coverImg: string;
    tags: string[];
  };
  proposedData: {
    name: string;
    category: string;
    province: string;
    address: string;
    price: string;
    hours: string;
    phone: string;
    website?: string;
    lat: number;
    lng: number;
    desc: string;
    coverImg: string;
    tags: string[];
    noteFromUser?: string;
  };
  diffFields?: string[];
}

export const initialAdminProposals: AdminProposalItem[] = [
  {
    id: 101,
    userId: 204,
    userName: "Trần Mai Linh",
    userAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop",
    userReputation: 520,
    type: "EDIT_PLACE",
    targetPlaceId: 3,
    targetPlaceName: "Bánh Mì Phượng (Hội An)",
    province: "Quảng Nam",
    category: "Nhà hàng & Quán ăn",
    createdAt: "Hôm nay, 09:30",
    status: 0,
    currentData: {
      name: "Bánh Mì Phượng",
      category: "Nhà hàng & Quán ăn",
      province: "Quảng Nam",
      address: "2B Phan Châu Trinh, Cẩm Châu, Hội An, Quảng Nam",
      price: "25.000đ – 40.000đ",
      hours: "06:30 – 21:30",
      phone: "0905 743 759",
      website: "https://banhmiphuong.vn",
      lat: 15.8793,
      lng: 108.3321,
      desc: "Ổ bánh mì huyền thoại được Anthony Bourdain gọi là ngon nhất thế giới. Vỏ giòn rụm, nhân thịt nguội thơm lừng.",
      coverImg: "https://images.unsplash.com/photo-1763703686284-b63557b08a86?w=600&h=400&fit=crop&auto=format",
      tags: ["Bánh mì", "Thịt nguội", "Pate"],
    },
    proposedData: {
      name: "Bánh Mì Phượng - Cơ Sở Chính Hội An",
      category: "Nhà hàng & Quán ăn",
      province: "Quảng Nam",
      address: "2B Phan Châu Trinh, Phường Minh An, TP. Hội An, Tỉnh Quảng Nam",
      price: "35.000đ – 55.000đ",
      hours: "06:00 – 22:00",
      phone: "0905 743 759",
      website: "https://banhmiphuonghoian.com",
      lat: 15.8795,
      lng: 108.3324,
      desc: "Tiệm bánh mì Hội An nổi tiếng toàn cầu với công thức sốt bơ trứng và pate gia truyền 35 năm. Đã mở rộng không gian lầu 2 máy lạnh phục vụ khách du lịch.",
      coverImg: "https://images.unsplash.com/photo-1763703686284-b63557b08a86?w=600&h=400&fit=crop&auto=format",
      tags: ["Bánh mì Hội An", "Đặc sản phố cổ", "Pate bơ trứng", "Anthony Bourdain"],
      noteFromUser: "Quán mới cập nhật bảng giá năm 2026 và mở thêm phòng máy lạnh tầng trên, giờ mở cửa sớm hơn 30 phút.",
    },
    diffFields: ["name", "address", "price", "hours", "desc", "tags", "website"],
  },
  {
    id: 102,
    userId: 315,
    userName: "Võ Quốc Cường",
    userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
    userReputation: 310,
    type: "NEW_PLACE",
    province: "Đà Nẵng",
    category: "Quán Cà phê & Trà",
    createdAt: "Hôm nay, 08:15",
    status: 0,
    proposedData: {
      name: "Góc Ban Mê Cafe Đà Nẵng",
      category: "Quán Cà phê & Trà",
      province: "Đà Nẵng",
      address: "42 Bạch Đằng, Quận Hải Châu, TP. Đà Nẵng",
      price: "35.000đ – 65.000đ",
      hours: "06:30 – 23:00",
      phone: "0236 388 9999",
      website: "https://gocbanmedanang.vn",
      lat: 16.0684,
      lng: 108.2245,
      desc: "Quán cà phê view trực diện Cầu Rồng và sông Hàn thơ mộng. Hạt Robusta Buôn Ma Thuột mộc nguyên chất pha phin truyền thống.",
      coverImg: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&h=400&fit=crop&auto=format",
      tags: ["View Cầu Rồng", "Cà phê pha phin", "Sông Hàn", "Chill đêm"],
      noteFromUser: "Địa điểm mới khai trương tháng trước, rất đông khách du lịch check-in ngắm rồng phun lửa cuối tuần.",
    },
  },
  {
    id: 103,
    userId: 188,
    userName: "Đặng Thu Thảo",
    userAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop",
    userReputation: 680,
    type: "EDIT_PLACE",
    targetPlaceId: 6,
    targetPlaceName: "Quán Bún Bò Huế Mụ Rớt",
    province: "Thừa Thiên Huế",
    category: "Nhà hàng & Quán ăn",
    createdAt: "Hôm qua, 16:45",
    status: 0,
    currentData: {
      name: "Quán Bún Bò Huế Mụ Rớt",
      category: "Nhà hàng & Quán ăn",
      province: "Thừa Thiên Huế",
      address: "TP. Huế, Thừa Thiên Huế",
      price: "40.000đ – 65.000đ",
      hours: "06:00 – 14:00",
      phone: "0234 382 1122",
      lat: 16.4624,
      lng: 107.5912,
      desc: "Bún bò Huế chuẩn vị cố đô hơn 30 năm, nước dùng cay nồng sả ớt, giò heo chắc thịt.",
      coverImg: "https://images.unsplash.com/photo-1509072619873-adb3dc289b50?w=600&h=400&fit=crop&auto=format",
      tags: ["Bún bò", "Giò heo", "Mắm ruốc"],
    },
    proposedData: {
      name: "Bún Bò Huế Mụ Rớt - Gia Truyền Cố Đô",
      category: "Nhà hàng & Quán ăn",
      province: "Thừa Thiên Huế",
      address: "38 Chi Lăng, Phường Phú Cát, TP. Huế, Thừa Thiên Huế",
      price: "45.000đ – 75.000đ",
      hours: "06:00 – 17:00",
      phone: "0914 025 889",
      lat: 16.4628,
      lng: 107.5919,
      desc: "Quán bún bò Huế gốc Huế cổ truyền, nước dùng hầm xương bò 12 tiếng cùng mắm ruốc thơm lừng, thịt nạm giòn mềm và chả cua tự quết tươi ngon mỗi ngày.",
      coverImg: "https://images.unsplash.com/photo-1509072619873-adb3dc289b50?w=600&h=400&fit=crop&auto=format",
      tags: ["Bún bò Huế", "Chả cua tươi", "38 Chi Lăng", "Đặc sản Cố Đô"],
      noteFromUser: "Cập nhật địa chỉ chi tiết số nhà 38 Chi Lăng và đổi giờ mở cửa chiều vì quán mới phục vụ thêm buổi xế.",
    },
    diffFields: ["name", "address", "price", "hours", "phone", "desc", "tags"],
  },
  {
    id: 104,
    userId: 420,
    userName: "Hoàng Đức Nam",
    userAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop",
    userReputation: 190,
    type: "NEW_PLACE",
    province: "Lâm Đồng (Đà Lạt)",
    category: "Ẩm thực đường phố",
    createdAt: "Hôm qua, 14:20",
    status: 0,
    proposedData: {
      name: "Bánh Tráng Nướng Dì Đinh Đà Lạt",
      category: "Ẩm thực đường phố",
      province: "Lâm Đồng (Đà Lạt)",
      address: "26 Hoàng Diệu, Phường 5, TP. Đà Lạt",
      price: "20.000đ – 35.000đ",
      hours: "14:00 – 22:00",
      phone: "0983 555 123",
      website: "",
      lat: 11.9425,
      lng: 108.4312,
      desc: "Đặc sản pizza Đà Lạt nướng than hoa thơm nức mũi với trứng cút, phô mai béo ngậy, khô bò, tép khô và mỡ hành giòn rụm trong tiết trời se lạnh.",
      coverImg: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=400&fit=crop&auto=format",
      tags: ["Bánh tráng nướng", "Ăn vặt Đà Lạt", "Ấm bụng đêm"],
      noteFromUser: "Quán ăn vặt vỉa hè nổi tiếng bậc nhất Đà Lạt, rất cần có trên hệ thống để du khách dễ tìm kiếm.",
    },
  },
  {
    id: 105,
    userId: 250,
    userName: "Nguyễn Bích Phương",
    userAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop",
    userReputation: 480,
    type: "NEW_PLACE",
    province: "Khánh Hòa (Nha Trang)",
    category: "Nhà hàng & Quán ăn",
    createdAt: "2 ngày trước",
    status: 1, // Approved
    reviewedBy: "Lê Hoàng Nam",
    reviewedAt: "Hôm qua, 10:00",
    proposedData: {
      name: "Bánh Canh Chả Cá Cô Hà Nha Trang",
      category: "Nhà hàng & Quán ăn",
      province: "Khánh Hòa (Nha Trang)",
      address: "14 Phan Chu Trinh, Vạn Thạnh, TP. Nha Trang",
      price: "30.000đ – 50.000đ",
      hours: "06:30 – 21:00",
      phone: "0935 112 334",
      lat: 12.2536,
      lng: 109.1945,
      desc: "Bánh canh chả cá thu chiên và hấp ngọt lịm, nước dùng nấu từ cá ngừ tươi trong vắt không bị ngấy.",
      coverImg: "https://images.unsplash.com/photo-1541544741938-0af808871cc0?w=600&h=400&fit=crop&auto=format",
      tags: ["Chả cá thu", "Bánh canh Nha Trang", "Đặc sản biển"],
    },
  },
  {
    id: 106,
    userId: 99,
    userName: "Vũ Đình Trọng",
    userAvatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&h=150&fit=crop",
    userReputation: 95,
    type: "NEW_PLACE",
    province: "Đà Nẵng",
    category: "Quán Cà phê & Trà",
    createdAt: "3 ngày trước",
    status: 2, // Rejected
    reviewedBy: "Lê Hoàng Nam",
    reviewedAt: "2 ngày trước, 15:30",
    rejectReason: "Địa chỉ quán không tồn tại trên thực tế (sai số nhà và vị trí GPS). Ảnh đính kèm vi phạm bản quyền từ website khác.",
    proposedData: {
      name: "Quán Trà Sữa Thỏ Trắng Ảo",
      category: "Quán Cà phê & Trà",
      province: "Đà Nẵng",
      address: "9999 Nguyễn Văn Linh, Đà Nẵng",
      price: "20.000đ",
      hours: "08:00 – 22:00",
      phone: "0123 456 789",
      lat: 16.0,
      lng: 108.0,
      desc: "Trà sữa ngon rẻ.",
      coverImg: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop&auto=format",
      tags: ["Trà sữa"],
    },
  },
  {
    id: 107,
    userId: 512,
    userName: "Ngô Kiến Huy",
    userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
    userReputation: 410,
    type: "NEW_PLACE",
    province: "Đà Nẵng",
    category: "Khách sạn cao cấp", // OUT OF SCOPE (PlaceTypeId = 3)
    createdAt: "Hôm nay, 11:00",
    status: 0,
    proposedData: {
      name: "InterContinental Danang Sun Peninsula Resort",
      category: "Khách sạn cao cấp",
      province: "Đà Nẵng",
      address: "Bán đảo Sơn Trà, TP. Đà Nẵng",
      price: "8.500.000đ – 25.000.000đ / đêm",
      hours: "24/24",
      phone: "0236 393 8888",
      website: "https://danang.intercontinental.com",
      lat: 16.1215,
      lng: 108.3128,
      desc: "Khu nghỉ dưỡng sang trọng bậc nhất thế giới ẩn mình trong vịnh biển hoang sơ của bán đảo Sơn Trà.",
      coverImg: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop&auto=format",
      tags: ["Resort 5 sao", "Bán đảo Sơn Trà", "Nghỉ dưỡng biển"],
      noteFromUser: "Đề xuất cập nhật khách sạn 5 sao cao cấp phục vụ khách thượng lưu.",
    },
  },
];

// ── DANH MỤC LÝ DO BÁO CÁO VI PHẠM (dbo.ReportReasons) ──
export interface ReportReason {
  id: number;
  content: string;
  desc: string;
  status: "active" | "inactive";
}

export const DB_REPORT_REASONS: ReportReason[] = [
  {
    id: 1,
    content: "Nội dung spam hoặc quảng cáo trái phép",
    desc: "Spam link giới thiệu, quảng cáo vay tiền, cờ bạc, nội dung thương mại lặp đi lặp lại.",
    status: "active",
  },
  {
    id: 2,
    content: "Thông tin sai sự thật, gây hiểu nhầm",
    desc: "Cung cấp sai giá cả, hình ảnh cắt ghép làm sai lệch thực tế, tin đồn thất thiệt không có căn cứ.",
    status: "active",
  },
  {
    id: 3,
    content: "Ngôn từ xúc phạm, thù địch, đả kích",
    desc: "Sử dụng từ ngữ thô tục, chửi thề, vu khống cá nhân/chủ quán, kỳ thị vùng miền, ngôn từ đe dọa.",
    status: "active",
  },
  {
    id: 4,
    content: "Hình ảnh nhạy cảm hoặc vi phạm bản quyền",
    desc: "Sử dụng hình ảnh nhạy cảm, bạo lực hoặc lấy ảnh độc quyền của người khác mà không trích dẫn.",
    status: "active",
  },
  {
    id: 5,
    content: "Địa điểm đã đóng cửa hoặc chuyển địa chỉ",
    desc: "Cơ sở kinh doanh đã dỡ biển, trả mặt bằng, dừng hoạt động vĩnh viễn hoặc di dời nơi khác.",
    status: "active",
  },
  {
    id: 6,
    content: "Lý do khác",
    desc: "Các hành vi vi phạm khác chưa được phân loại cụ thể cần Admin xác minh thủ công.",
    status: "active",
  },
];

// ── DANH MỤC MÃ LÝ DO BÁO CÁO VI PHẠM CHUẨN HÓA (dbo.ReportTypes) ──
export type ReportTypeCode =
  | "PLACE_CLOSED"       // Địa điểm đã đóng cửa / dừng hoạt động (Ưu tiên Cao)
  | "PLACE_WRONG_INFO"   // Sai thông tin địa chỉ, giờ mở cửa, số điện thoại (Thường)
  | "PLACE_WRONG_PRICE"  // Sai giá cả / chặt chém (Thường)
  | "PLACE_DUPLICATE"    // Địa điểm bị trùng lặp trên hệ thống (Thấp)
  | "CONTENT_SPAM"       // Spam, quảng cáo, cờ bạc, vay tiền (Thường)
  | "CONTENT_OFFENSIVE"  // Ngôn từ xúc phạm, thù địch, miệt thị (Khẩn)
  | "CONTENT_FAKE"       // Review giả mạo, seeding ảo dìm hàng (Thường)
  | "CONTENT_NSFW_MEDIA" // Ảnh/Video nhạy cảm, bạo lực, đồi trụy (Khẩn)
  | "CONTENT_COPYRIGHT"  // Vi phạm bản quyền hình ảnh/nội dung (Cao)
  | "OTHER";             // Lý do khác (Thấp)

export interface StandardReportType {
  code: ReportTypeCode;
  name: string;
  defaultPriority: "urgent" | "high" | "normal" | "low";
  description: string;
  suggestedAction: string;
}

export const DB_STANDARD_REPORT_TYPES: Record<ReportTypeCode, StandardReportType> = {
  CONTENT_NSFW_MEDIA: {
    code: "CONTENT_NSFW_MEDIA",
    name: "Hình ảnh/Media nhạy cảm, đồi trụy",
    defaultPriority: "urgent",
    description: "Media chứa nội dung nhạy cảm, phản cảm hoặc bạo lực nghiêm trọng.",
    suggestedAction: "Gỡ bỏ media vi phạm ngay lập tức, khóa tính năng đăng ảnh của tác giả.",
  },
  CONTENT_OFFENSIVE: {
    code: "CONTENT_OFFENSIVE",
    name: "Ngôn từ thù địch, xúc phạm, đả kích",
    defaultPriority: "urgent",
    description: "Chửi thề, miệt thị vùng miền, vu khống, xúc phạm nhân phẩm danh dự.",
    suggestedAction: "Ẩn nội dung ngay, ghi 01 vi phạm mức nặng vào hồ sơ tác giả.",
  },
  PLACE_CLOSED: {
    code: "PLACE_CLOSED",
    name: "Địa điểm đã đóng cửa / giải thể",
    defaultPriority: "high",
    description: "Cơ sở kinh doanh đã dỡ biển, trả mặt bằng, dừng hoạt động vĩnh viễn.",
    suggestedAction: "Chuyển trạng thái Place.Status=3 (Đang ẩn), đóng các đề xuất/report liên quan.",
  },
  CONTENT_COPYRIGHT: {
    code: "CONTENT_COPYRIGHT",
    name: "Vi phạm bản quyền nội dung / hình ảnh",
    defaultPriority: "high",
    description: "Sử dụng hình ảnh độc quyền, bài viết độc quyền của người khác không trích dẫn.",
    suggestedAction: "Gỡ nội dung/ảnh vi phạm, yêu cầu tác giả giải trình nguồn gốc.",
  },
  CONTENT_SPAM: {
    code: "CONTENT_SPAM",
    name: "Spam / Quảng cáo thương mại rác",
    defaultPriority: "normal",
    description: "Quảng cáo dịch vụ tài chính, vay tiền, cá độ, link liên kết rác.",
    suggestedAction: "Ẩn nội dung, gửi cảnh báo vi phạm cho tác giả.",
  },
  CONTENT_FAKE: {
    code: "CONTENT_FAKE",
    name: "Đánh giá giả mạo / Đánh giá ảo",
    defaultPriority: "normal",
    description: "Tài khoản ảo seeding điểm cao hoặc hạ bệ đối thủ không có căn cứ.",
    suggestedAction: "Ẩn review, kích hoạt trigger tính lại Rating TB và ReviewCount cho quán.",
  },
  PLACE_WRONG_INFO: {
    code: "PLACE_WRONG_INFO",
    name: "Thông tin địa chỉ / liên hệ sai",
    defaultPriority: "normal",
    description: "Sai số nhà, sai tên đường, số điện thoại không liên lạc được.",
    suggestedAction: "Mở form sửa nhanh thông tin địa điểm và cập nhật dữ liệu chuẩn.",
  },
  PLACE_WRONG_PRICE: {
    code: "PLACE_WRONG_PRICE",
    name: "Sai khung giá / Menu chặt chém",
    defaultPriority: "normal",
    description: "Giá thực tế chênh lệch quá nhiều so với niêm yết trên ứng dụng.",
    suggestedAction: "Cập nhật khoảng giá mới vào thông tin địa điểm.",
  },
  PLACE_DUPLICATE: {
    code: "PLACE_DUPLICATE",
    name: "Địa điểm bị trùng lặp trên hệ thống",
    defaultPriority: "low",
    description: "Tồn tại 2 trang cùng một quán ăn do nhiều người tạo.",
    suggestedAction: "Mở công cụ Gộp địa điểm, chuyển toàn bộ review/media sang địa điểm chính.",
  },
  OTHER: {
    code: "OTHER",
    name: "Lý do khác",
    defaultPriority: "low",
    description: "Vấn đề khác chưa được phân loại cần Admin kiểm tra thủ công.",
    suggestedAction: "Xem xét chi tiết và nhập ghi chú xử lý cụ thể.",
  },
};

// ── BÁO CÁO VI PHẠM TỪ NGƯỜI DÙNG (dbo.vw_AllReports & dbo.Reports) ──
export interface AdminReportItem {
  id: number; // PK trong bảng report tương ứng
  codeId?: string; // Mã ID hiển thị như #8942, #4412
  targetType: "place" | "review" | "comment" | "blog" | "photo"; // 5 nguồn đối tượng
  targetId: number;
  targetTitle: string;
  targetSubtitle?: string;
  targetImage?: string;
  targetContent?: string;
  targetAuthorName?: string;
  targetAuthorAvatar?: string;
  targetRating?: number;
  parentPlaceId?: number;
  parentPlaceName?: string;
  province: string;
  category: string;
  reportTypeCode: ReportTypeCode;
  reportTypeName: string;
  reportReasonCategory?: string; // Tên ngắn gọn hiển thị ở cột Lý do báo cáo: "Đã đóng cửa / Đổi mặt bằng", v.v.
  reportDuplicatesCount?: number; // Số lượng báo cáo cùng đối tượng (1, 2, 3, 4, 5...)
  reporterId: number;
  reporterName: string;
  reporterAvatar: string;
  reporterReputation: number;
  reporterAccuracyRate: number; // % Tỷ lệ báo đúng (để phát hiện người hay báo sai)
  isFrequentFalseReporter?: boolean; // Hay báo bừa (tỷ lệ < 50%)
  reasonDescription: string; // Mô tả từ người báo
  evidenceImg?: string;
  status: 0 | 1 | 2; // 0: Chờ xử lý (Pending), 1: Đã chấp nhận (Resolved), 2: Đã bác bỏ (Dismissed)
  priority: "urgent" | "high" | "normal" | "low";
  createdAt: string; // "20 phút trước", "Hôm nay, 10:15"
  createdHoursAgo: number; // Giờ đã trôi qua để tính SLA (> 48h đỏ)
  slaStatus?: "breached" | "warning" | "today" | "normal"; // breached = đỏ, warning = vàng, today = xám
  slaLabel?: string; // "Quá hạn 1h", "Còn 4h", "Hôm nay"
  assignedToAdminId?: number;
  assignedToAdminName?: string;
  resolvedBy?: string;
  resolvedAt?: string;
  actionTaken?: "hide_target" | "edit_place" | "merge_place" | "warn_author" | "penalize_author" | "remove_media" | "dismiss";
  actionTakenLabel?: string;
  resolutionNote?: string;
  dismissReason?: string;
}

export const initialAdminReports: AdminReportItem[] = [
  // ── TRANG 1: 7 ĐỐI TƯỢNG ĐẶC TRƯNG CHUẨN XÁC THEO HÀNG CHỜ MODERATION ──
  {
    id: 8942,
    codeId: "#8942",
    targetType: "place",
    targetId: 4,
    targetTitle: "Quán Bún Chả Cá Hùng Huỳnh",
    targetSubtitle: "245 Trần Phú, Hải Châu, Đà Nẵng",
    targetImage: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=400&fit=crop",
    province: "Đà Nẵng",
    category: "Nhà hàng & Quán ăn",
    reportTypeCode: "PLACE_CLOSED",
    reportTypeName: "Địa điểm đã đóng cửa / giải thể",
    reportReasonCategory: "Đã đóng cửa / Đổi mặt bằng",
    reportDuplicatesCount: 2,
    reporterId: 105,
    reporterName: "Trần Văn Hùng",
    reporterAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
    reporterReputation: 450,
    reporterAccuracyRate: 96,
    reasonDescription: "Quán đã dỡ bảng hiệu và trả mặt bằng từ cuối tuần trước, hiện đang sửa lại thành tiệm cắt tóc.",
    evidenceImg: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=600&h=400&fit=crop",
    status: 0,
    priority: "high",
    createdAt: "20 phút trước",
    createdHoursAgo: 49,
    slaStatus: "breached",
    slaLabel: "Quá hạn 1h",
    assignedToAdminId: 2,
    assignedToAdminName: "Lê Hoàng Nam",
  },
  {
    id: 4412,
    codeId: "#4412",
    targetType: "review",
    targetId: 88,
    targetTitle: "Bánh Mì Phượng",
    targetSubtitle: "“Phục vụ thô lỗ, đồ ăn có mùi lạ không chấp nhận...”",
    targetImage: "https://images.unsplash.com/photo-1763703686284-b63557b08a86?w=600&h=400&fit=crop",
    targetRating: 1,
    targetAuthorName: "Nguyễn Tuấn Đạt",
    targetAuthorAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop",
    targetContent: "Bọn làm ăn lừa đảo, thái độ như dở hơi. Đồ ăn thì ôi thiu bẩn thỉu ăn xong về đau bụng cả tuần. Tẩy chay ngay quán này đi đừng ai đến nữa đồ ***",
    parentPlaceId: 3,
    parentPlaceName: "Bánh Mì Phượng (Hội An)",
    province: "Quảng Nam",
    category: "Nhà hàng & Quán ăn",
    reportTypeCode: "CONTENT_OFFENSIVE",
    reportTypeName: "Ngôn từ thù địch, xúc phạm, đả kích",
    reportReasonCategory: "Ngôn từ kích động",
    reportDuplicatesCount: 1,
    reporterId: 44,
    reporterName: "Lê Kim Ngân",
    reporterAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop",
    reporterReputation: 620,
    reporterAccuracyRate: 98,
    reasonDescription: "Review sử dụng từ ngữ thô tục, bôi nhọ nhân phẩm nhân viên và xúc phạm cơ sở kinh doanh.",
    status: 0,
    priority: "urgent",
    createdAt: "35 phút trước",
    createdHoursAgo: 20,
    slaStatus: "warning",
    slaLabel: "Còn 4h",
    assignedToAdminId: 2,
    assignedToAdminName: "Lê Hoàng Nam",
  },
  {
    id: 9921,
    codeId: "#9921",
    targetType: "blog",
    targetId: 501,
    targetTitle: "Cẩm nang Phượt Tây Bắc tự túc 2024",
    targetSubtitle: "Tác giả: phuot_thu_vn • 4 hình ảnh đính kèm",
    targetImage: "https://images.unsplash.com/photo-1528127269322-539801943592?w=600&h=400&fit=crop",
    targetAuthorName: "phuot_thu_vn",
    province: "Lâm Đồng (Đà Lạt)",
    category: "Blog & Cẩm nang",
    reportTypeCode: "CONTENT_SPAM",
    reportTypeName: "Spam / Quảng cáo thương mại rác",
    reportReasonCategory: "Quảng cáo spam",
    reportDuplicatesCount: 3,
    reporterId: 999,
    reporterName: "AutoMod Filter",
    reporterAvatar: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&h=150&fit=crop",
    reporterReputation: 999,
    reporterAccuracyRate: 99,
    reasonDescription: "Hệ thống tự động phát hiện 5 liên kết rút gọn trỏ về trang web cờ bạc và vay nặng lãi.",
    status: 0,
    priority: "normal",
    createdAt: "1 giờ trước",
    createdHoursAgo: 2,
    slaStatus: "today",
    slaLabel: "Hôm nay",
  },
  {
    id: 128,
    codeId: "#0128",
    targetType: "photo",
    targetId: 210,
    targetTitle: "Bộ ảnh Hoàng hôn trên Sông Hàn",
    targetSubtitle: "Gắn thẻ: Cầu Rồng, Điểm check-in",
    targetImage: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=600&h=400&fit=crop",
    province: "Đà Nẵng",
    category: "Hình ảnh & Media",
    reportTypeCode: "CONTENT_COPYRIGHT",
    reportTypeName: "Vi phạm bản quyền nội dung / hình ảnh",
    reportReasonCategory: "Tranh chấp bản quyền ảnh",
    reportDuplicatesCount: 1,
    reporterId: 55,
    reporterName: "Studio Minh Triết",
    reporterAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
    reporterReputation: 780,
    reporterAccuracyRate: 100,
    reasonDescription: "Bài viết sử dụng trái phép chùm ảnh bản quyền của tôi đã đăng trên tạp chí số tháng 01/2026.",
    status: 0,
    priority: "high",
    createdAt: "2 giờ trước",
    createdHoursAgo: 18,
    slaStatus: "warning",
    slaLabel: "Còn 6h",
    assignedToAdminId: 2,
    assignedToAdminName: "Lê Hoàng Nam",
  },
  {
    id: 3109,
    codeId: "#3109",
    targetType: "comment",
    targetId: 142,
    targetTitle: "Cà Phê Gió & Mây",
    targetSubtitle: "“Chủ quán lừa đảo, số điện thoại để quấy rối...”",
    targetImage: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&h=400&fit=crop",
    targetAuthorName: "user_danang_99",
    parentPlaceId: 7,
    parentPlaceName: "Cà Phê Gió & Mây",
    province: "Lâm Đồng (Đà Lạt)",
    category: "Quán Cà phê & Trà",
    reportTypeCode: "CONTENT_OFFENSIVE",
    reportTypeName: "Ngôn từ thù địch, xúc phạm, đả kích",
    reportReasonCategory: "Lộ thông tin cá nhân (Doxxing)",
    reportDuplicatesCount: 4,
    reporterId: 88,
    reporterName: "Võ Minh Đạt",
    reporterAvatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&h=150&fit=crop",
    reporterReputation: 410,
    reporterAccuracyRate: 95,
    reasonDescription: "Công khai số điện thoại, CMND và địa chỉ nhà riêng của chủ quán nhằm kích động trả thù cá nhân.",
    status: 0,
    priority: "urgent",
    createdAt: "3 giờ trước",
    createdHoursAgo: 48.5,
    slaStatus: "breached",
    slaLabel: "Quá hạn 30p",
  },
  {
    id: 7730,
    codeId: "#7730",
    targetType: "place",
    targetId: 95,
    targetTitle: "Bếp Nhà Lục Tỉnh",
    targetSubtitle: "Trùng khớp nội dung với hồ sơ đã xác minh #2201",
    targetImage: "https://images.unsplash.com/photo-1541544741938-0af808871cc0?w=600&h=400&fit=crop",
    province: "Khánh Hòa (Nha Trang)",
    category: "Nhà hàng & Quán ăn",
    reportTypeCode: "PLACE_DUPLICATE",
    reportTypeName: "Địa điểm bị trùng lặp trên hệ thống",
    reportReasonCategory: "Địa điểm trùng lặp",
    reportDuplicatesCount: 2,
    reporterId: 212,
    reporterName: "Nguyễn Thu Thảo",
    reporterAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop",
    reporterReputation: 390,
    reporterAccuracyRate: 92,
    reasonDescription: "Địa điểm này đã được phê duyệt ở mã #2201, quán tạo thêm trang mới trùng lặp tên và tọa độ.",
    status: 0,
    priority: "low",
    createdAt: "4 giờ trước",
    createdHoursAgo: 16,
    slaStatus: "warning",
    slaLabel: "Còn 8h",
  },
  {
    id: 6120,
    codeId: "#6120",
    targetType: "blog",
    targetId: 504,
    targetTitle: "Voucher 50% Homestay Đà Lạt",
    targetSubtitle: "Điều hướng tới liên kết không an toàn bên ngoài",
    targetImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=400&fit=crop",
    province: "Lâm Đồng (Đà Lạt)",
    category: "Blog & Cẩm nang",
    reportTypeCode: "CONTENT_FAKE",
    reportTypeName: "Nội dung lừa đảo / giả mạo",
    reportReasonCategory: "Lừa đảo / Phishing",
    reportDuplicatesCount: 5,
    reporterId: 998,
    reporterName: "Bộ lọc bảo mật",
    reporterAvatar: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&h=150&fit=crop",
    reporterReputation: 999,
    reporterAccuracyRate: 99,
    reasonDescription: "Tạo sự kiện tặng voucher phòng giả mạo để chiếm đoạt mã OTP và tài khoản ngân hàng của khách du lịch.",
    status: 0,
    priority: "urgent",
    createdAt: "5 giờ trước",
    createdHoursAgo: 5,
    slaStatus: "today",
    slaLabel: "Hôm nay",
    assignedToAdminId: 2,
    assignedToAdminName: "Lê Hoàng Nam",
  },
  {
    id: 3041,
    codeId: "#3041",
    targetType: "review",
    targetId: 91,
    targetTitle: "Cơm Gà Bà Buội (Hội An)",
    targetSubtitle: "“Cơm gà nguội ngắt, phục vụ khinh khỉnh...”",
    province: "Quảng Nam",
    category: "Nhà hàng & Quán ăn",
    reportTypeCode: "CONTENT_OFFENSIVE",
    reportTypeName: "Ngôn từ thù địch",
    reportReasonCategory: "Ngôn từ kích động",
    reportDuplicatesCount: 2,
    reporterId: 301,
    reporterName: "Lê Quốc Thái",
    reporterAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop",
    reporterReputation: 210,
    reporterAccuracyRate: 85,
    reasonDescription: "Review chứa từ ngữ thô tục chửi bới nhân viên.",
    status: 0,
    priority: "urgent",
    createdAt: "6 giờ trước",
    createdHoursAgo: 24,
    slaStatus: "warning",
    slaLabel: "Còn 3h",
  },
  {
    id: 3052,
    codeId: "#3052",
    targetType: "place",
    targetId: 18,
    targetTitle: "Trà Cung Đình Đức Phượng",
    targetSubtitle: "24 Nguyễn Huệ, TP. Huế",
    province: "Thừa Thiên Huế",
    category: "Quán Cà phê & Trà",
    reportTypeCode: "PLACE_CLOSED",
    reportTypeName: "Đóng cửa",
    reportReasonCategory: "Đã đóng cửa / Đổi mặt bằng",
    reportDuplicatesCount: 3,
    reporterId: 102,
    reporterName: "Phan Văn Hậu",
    reporterAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
    reporterReputation: 340,
    reporterAccuracyRate: 90,
    reasonDescription: "Quán đã dọn sang cơ sở mới bên đường Đống Đa.",
    status: 0,
    priority: "high",
    createdAt: "7 giờ trước",
    createdHoursAgo: 14,
    slaStatus: "warning",
    slaLabel: "Còn 5h",
  },
  {
    id: 3063,
    codeId: "#3063",
    targetType: "comment",
    targetId: 77,
    targetTitle: "Mì Quảng Bà Mua",
    targetSubtitle: "Bình luận spam link vay online",
    province: "Đà Nẵng",
    category: "Ẩm thực đường phố",
    reportTypeCode: "CONTENT_SPAM",
    reportTypeName: "Quảng cáo rác",
    reportReasonCategory: "Quảng cáo spam",
    reportDuplicatesCount: 6,
    reporterId: 14,
    reporterName: "Nguyễn Hoài Nam",
    reporterAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop",
    reporterReputation: 290,
    reporterAccuracyRate: 94,
    reasonDescription: "Spam link vay tiền lặp đi lặp lại trong phần bình luận.",
    status: 0,
    priority: "normal",
    createdAt: "8 giờ trước",
    createdHoursAgo: 8,
    slaStatus: "today",
    slaLabel: "Hôm nay",
  },
  {
    id: 3074,
    codeId: "#3074",
    targetType: "photo",
    targetId: 889,
    targetTitle: "Ảnh checkin Đồi Chè Cầu Đất",
    targetSubtitle: "Ảnh khiêu dâm phản cảm nơi công cộng",
    province: "Lâm Đồng (Đà Lạt)",
    category: "Hình ảnh & Media",
    reportTypeCode: "CONTENT_NSFW_MEDIA",
    reportTypeName: "Media phản cảm",
    reportReasonCategory: "Hình ảnh nhạy cảm",
    reportDuplicatesCount: 4,
    reporterId: 441,
    reporterName: "Trương Minh Tuấn",
    reporterAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
    reporterReputation: 510,
    reporterAccuracyRate: 98,
    reasonDescription: "Tải lên hình ảnh ăn mặc phản cảm không phù hợp chuẩn mực đạo đức.",
    status: 0,
    priority: "urgent",
    createdAt: "9 giờ trước",
    createdHoursAgo: 9,
    slaStatus: "warning",
    slaLabel: "Còn 2h",
    assignedToAdminId: 2,
    assignedToAdminName: "Lê Hoàng Nam",
  },
  {
    id: 3085,
    codeId: "#3085",
    targetType: "place",
    targetId: 104,
    targetTitle: "Hải Sản Bé Mặn B",
    targetSubtitle: "Lô 11 Võ Nguyên Giáp, Đà Nẵng",
    province: "Đà Nẵng",
    category: "Nhà hàng & Quán ăn",
    reportTypeCode: "PLACE_WRONG_PRICE",
    reportTypeName: "Sai giá",
    reportReasonCategory: "Chặt chém / Sai giá niêm yết",
    reportDuplicatesCount: 3,
    reporterId: 305,
    reporterName: "Đoàn Hải Đăng",
    reporterAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop",
    reporterReputation: 320,
    reporterAccuracyRate: 88,
    reasonDescription: "Hóa đơn tính tiền chênh lệch gấp đôi so với thực đơn niêm yết trên ứng dụng.",
    status: 0,
    priority: "high",
    createdAt: "10 giờ trước",
    createdHoursAgo: 26,
    slaStatus: "warning",
    slaLabel: "Còn 6h",
  },

  // ── ĐÃ XỬ LÝ (Resolved) ──
  {
    id: 308,
    targetType: "place",
    targetId: 19,
    targetTitle: "Quán Cafe Hẻm Cũ Đà Lạt",
    targetSubtitle: "Đà Lạt, Lâm Đồng",
    targetImage: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&h=400&fit=crop",
    province: "Lâm Đồng (Đà Lạt)",
    category: "Quán Cà phê & Trà",
    reportTypeCode: "PLACE_CLOSED",
    reportTypeName: "Địa điểm đã đóng cửa / giải thể",
    reporterId: 301,
    reporterName: "Nguyễn Thùy Dương",
    reporterAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop",
    reporterReputation: 320,
    reporterAccuracyRate: 91,
    reasonDescription: "Quán này đã trả mặt bằng và dừng hoạt động hoàn toàn từ tháng 12/2025, hiện tại đã thành tiệm tạp hóa.",
    status: 1, // Resolved
    priority: "normal",
    createdAt: "2 ngày trước",
    createdHoursAgo: 48,
    assignedToAdminId: 2,
    assignedToAdminName: "Lê Hoàng Nam",
    resolvedBy: "Lê Hoàng Nam",
    resolvedAt: "Hôm qua, 11:30",
    actionTaken: "hide_target",
    actionTakenLabel: "Đã chuyển trạng thái Địa điểm thành Ẩn (Status=3)",
    resolutionNote: "Đã xác minh qua gọi hotline và đối chiếu ảnh người dân gửi, đã tạm ẩn địa điểm khỏi bản đồ du lịch.",
  },

  // ── ĐÃ BÁC BỎ (Dismissed) ──
  {
    id: 309,
    targetType: "review",
    targetId: 65,
    targetTitle: "Đánh giá tại Cơm Hến Đập Đá (Huế)",
    targetSubtitle: "Đánh giá của: Hoàng Khang (2 sao)",
    targetImage: "https://images.unsplash.com/photo-1509072619873-adb3dc289b50?w=600&h=400&fit=crop",
    targetRating: 2,
    targetAuthorName: "Hoàng Khang",
    targetAuthorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop",
    targetContent: "Quán phục vụ hơi lâu vào giờ trưa cao điểm, đồ ăn cay hơn so với khẩu vị người miền Bắc.",
    parentPlaceId: 6,
    parentPlaceName: "Cơm Hến Đập Đá (Huế)",
    province: "Thừa Thiên Huế",
    category: "Nhà hàng & Quán ăn",
    reportTypeCode: "CONTENT_FAKE",
    reportTypeName: "Đánh giá giả mạo / Đánh giá ảo",
    reporterId: 12,
    reporterName: "Hội Ẩm Thực Cố Đô (Chủ quán báo)",
    reporterAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop",
    reporterReputation: 150,
    reporterAccuracyRate: 35, // Hay báo sai
    isFrequentFalseReporter: true,
    reasonDescription: "Người dùng tố cáo review này là sai sự thật, cho rằng khách vu khống quán.",
    status: 2, // Dismissed
    priority: "low",
    createdAt: "3 ngày trước",
    createdHoursAgo: 72,
    assignedToAdminId: 2,
    assignedToAdminName: "Lê Hoàng Nam",
    resolvedBy: "Lê Hoàng Nam",
    resolvedAt: "Hôm qua, 15:00",
    actionTaken: "dismiss",
    actionTakenLabel: "Bác bỏ báo cáo (Không vi phạm)",
    dismissReason: "Không vi phạm tiêu chuẩn cộng đồng",
    resolutionNote: "Đánh giá thể hiện cảm nhận cá nhân thực tế về khẩu vị và thời gian chờ, không có ngôn từ thù địch hay bôi nhọ bịa đặt. Bác bỏ báo cáo.",
  },
];

// ── KHIẾU NẠI TỪ NGƯỜI DÙNG (dbo.Appeals) ──
export interface AdminAppealItem {
  id: number; // PK dbo.Appeals.Id
  userId: number; // FK dbo.Users(Id)
  userName: string;
  userAvatar: string;
  targetType: "place" | "review" | "comment" | "place_proposal" | "place_edit_proposal";
  targetId: number;
  targetTitle: string;
  targetContent?: string;
  penaltyAction: string; // Hành động xử phạt trước đó (ví dụ: "Review bị ẩn vì vi phạm", "Đề xuất bị từ chối")
  reason: string; // dbo.Appeals.Reason (lý do người dùng khiếu nại)
  status: "pending" | "handled_by_category_admin" | "escalated_to_system_admin" | "resolved";
  categoryAdminId?: number;
  categoryAdminName?: string;
  categoryAdminResult?: string;
  categoryAdminAt?: string;
  systemAdminId?: number;
  systemAdminResult?: string;
  submittedAt: string;
}

export const initialAdminAppeals: AdminAppealItem[] = [
  {
    id: 501,
    userId: 88,
    userName: "Nguyễn Tuấn Đạt",
    userAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop",
    targetType: "review",
    targetId: 88,
    targetTitle: "Đánh giá tại Quán Bánh Mì Phượng (Hội An)",
    targetContent: "Bọn làm ăn lừa đảo, đồ ăn ôi thiu...",
    penaltyAction: "Đánh giá đã bị ẩn tạm thời do bị tố cáo ngôn từ xúc phạm.",
    reason: "Tôi chỉ chia sẻ trải nghiệm đồ ăn không tươi thực tế của đoàn gia đình tôi, tôi sẵn sàng cung cấp hóa đơn thanh toán ngày 15/09, mong Admin xem xét bỏ ẩn review.",
    status: "pending",
    submittedAt: "Hôm nay, 11:00",
  },
  {
    id: 502,
    userId: 102,
    userName: "Lê Minh Tuấn",
    userAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop",
    targetType: "place_proposal",
    targetId: 104,
    targetTitle: "Đề xuất Địa điểm: Quán Chè Cung Đình 20 Món",
    penaltyAction: "Đề xuất bị từ chối vì lý do 'Thiếu thông tin giấy phép kinh doanh'.",
    reason: "Quán chè này là hộ kinh doanh cá thể truyền thống hơn 25 năm tại chợ Đông Ba, tôi đã bổ sung ảnh chụp giấy chứng nhận an toàn thực phẩm và biển hiệu đầy đủ.",
    status: "handled_by_category_admin",
    categoryAdminId: 2,
    categoryAdminName: "Lê Hoàng Nam",
    categoryAdminResult: "Đã thẩm tra chứng từ bổ sung, chuyển tiếp đề xuất vào hàng đợi duyệt chính thức.",
    categoryAdminAt: "Hôm qua, 16:30",
    submittedAt: "2 ngày trước",
  },
];

// ── BÁO CÁO THỐNG KÊ HIỆU SUẤT CÔNG TÁC (Performance Reports Data) ──
export interface PerformanceReportSummary {
  periodTitle: string; // "Tháng 09/2026", "Tuần 37/2026"
  adminName: string;
  adminRoleTitle: string;
  assignedCategories: string[];
  totalManagedPlaces: number;
  proposalsStats: {
    received: number;
    approved: number;
    rejected: number;
    pending: number;
    approvalRatePct: number;
    avgReviewTimeMinutes: number;
  };
  reportsStats: {
    received: number;
    violationConfirmed: number;
    dismissed: number;
    pending: number;
    resolutionRatePct: number;
    breakdownByReason: { reasonId: number; reasonName: string; count: number; pct: number }[];
  };
  appealsStats: {
    received: number;
    handledByAdmin1: number;
    escalatedToAdmin2: number;
    disputeRatePct: number;
  };
  slaCompliancePct: number; // Tỷ lệ xử lý đúng hạn SLA (dưới 24h)
}

export const initialPerformanceReport: PerformanceReportSummary = {
  periodTitle: "Báo Cáo Kiểm Duyệt Tháng 09/2026 (Kỳ Nghiệm Thu CLO3)",
  adminName: "Lê Hoàng Nam",
  adminRoleTitle: "Admin Cấp 1 • Phụ trách Phân hệ Ẩm thực (Category Admin)",
  assignedCategories: ["Nhà hàng & Quán ăn", "Quán Cà phê & Trà", "Ẩm thực đường phố"],
  totalManagedPlaces: 148,
  proposalsStats: {
    received: 42,
    approved: 31,
    rejected: 8,
    pending: 3,
    approvalRatePct: 79.5,
    avgReviewTimeMinutes: 18,
  },
  reportsStats: {
    received: 28,
    violationConfirmed: 19,
    dismissed: 7,
    pending: 2,
    resolutionRatePct: 92.8,
    breakdownByReason: [
      { reasonId: 1, reasonName: "Nội dung spam hoặc quảng cáo trái phép", count: 8, pct: 28.6 },
      { reasonId: 2, reasonName: "Thông tin sai sự thật, gây hiểu nhầm", count: 6, pct: 21.4 },
      { reasonId: 3, reasonName: "Ngôn từ xúc phạm, thù địch, đả kích", count: 7, pct: 25.0 },
      { reasonId: 4, reasonName: "Hình ảnh nhạy cảm hoặc vi phạm bản quyền", count: 2, pct: 7.1 },
      { reasonId: 5, reasonName: "Địa điểm đã đóng cửa hoặc chuyển địa chỉ", count: 4, pct: 14.3 },
      { reasonId: 6, reasonName: "Lý do khác", count: 1, pct: 3.6 },
    ],
  },
  appealsStats: {
    received: 5,
    handledByAdmin1: 4,
    escalatedToAdmin2: 1,
    disputeRatePct: 3.2,
  },
  slaCompliancePct: 98.4,
};

export interface AdminFoodItem {
  id: number;
  name: string;
  region: string;
  province: string;
  category: string;
  description: string;
  historyInfo: string;
  coverImg: string;
  status: 1 | 0; // 1: Active, 0: Hidden
  servingPlacesCount: number;
  servingPlaces: { id: number; name: string; address: string; rating: number }[];
  createdAt: string;
  viewsCount: number;
}

export const initialAdminFoods: AdminFoodItem[] = [
  {
    id: 201,
    name: "Mì Quảng Tôm Thịt Ếch",
    region: "Miền Trung",
    province: "Quảng Nam",
    category: "Đặc sản mì & bún",
    description: "Sợi mì vàng óng dai mềm từ bột gạo pha nghệ tươi, nước nhưỡng đậm đà om từ tôm đất và thịt heo quê, ăn kèm bánh tráng mè nướng giòn và 9 loại rau sống búp chuối tươi non.",
    historyInfo: "Mì Quảng ra đời từ thế kỷ 16 tại vùng đất dinh trấn Thanh Chiêm (Điện Bàn, Quảng Nam). Đây là kết tinh giao thoa văn hóa ẩm thực giữa người Việt mở cõi và các thương gia buôn bán tại thương cảng Hội An cổ xưa.",
    coverImg: "https://images.unsplash.com/photo-1526318896980-cf78c088247c?w=600&h=400&fit=crop&auto=format",
    status: 1,
    servingPlacesCount: 14,
    servingPlaces: [
      { id: 11, name: "Mì Quảng Bà Vị", address: "166 Lê Đình Dương, Hải Châu, Đà Nẵng", rating: 4.8 },
      { id: 12, name: "Mì Quảng Bích Hội An", address: "272 Cửa Đại, Hội An, Quảng Nam", rating: 4.7 },
      { id: 13, name: "Mì Quảng Ếch Bếp Trang", address: "441 Ông Ích Khiêm, Đà Nẵng", rating: 4.9 },
    ],
    createdAt: "2026-01-10",
    viewsCount: 18450,
  },
  {
    id: 202,
    name: "Cao Lầu Phố Cổ Hội An",
    region: "Miền Trung",
    province: "Quảng Nam",
    category: "Món ăn di sản",
    description: "Món mì trứ danh độc nhất vô nhị chỉ có tại Hội An. Sợi mì đục dai sần sật ngâm từ tro củi Cù Lao Chàm và nước giếng Bá Lễ ngàn năm, ăn cùng xá xíu mềm thơm và tép mỡ giòn rụm.",
    historyInfo: "Cao Lầu xuất hiện từ thế kỷ 17 khi Hội An là thương cảng quốc tế sầm uất. Tên gọi 'Cao Lầu' xuất phát từ việc các thương gia xưa thường ngồi trên lầu cao của quán để vừa thưởng thức vừa ngắm nhìn bến thuyền.",
    coverImg: "https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?w=600&h=400&fit=crop&auto=format",
    status: 1,
    servingPlacesCount: 9,
    servingPlaces: [
      { id: 3, name: "Bánh Mì & Cao Lầu Phượng", address: "2B Phan Châu Trinh, Hội An", rating: 4.9 },
      { id: 14, name: "Cao Lầu Thanh Hội An", address: "26 Thái Phiên, Hội An", rating: 4.8 },
      { id: 15, name: "Cao Lầu Bá Lễ", address: "49/3 Trần Hưng Đạo, Hội An", rating: 4.7 },
    ],
    createdAt: "2026-01-12",
    viewsCount: 22100,
  },
  {
    id: 203,
    name: "Bún Bò Huế Cung Đình",
    region: "Miền Trung",
    province: "Thừa Thiên Huế",
    category: "Đặc sản mì & bún",
    description: "Món ăn quốc hồn quốc túy của Cố Đô với nước dùng thơm lừng hương sả tươi và mắm ruốc Huế đặc trưng, sợi bún to tròn ăn kèm bắp bò hoa, gân giòn, tiết luộc và chả cua béo ngậy.",
    historyInfo: "Khởi nguồn từ làng Cổ Tháp (thời chúa Nguyễn Hoàng), bún bò sau đó được tinh chỉnh trong chốn hoàng gia để phục vụ vua chúa triều Nguyễn, tạo nên hương vị cay nồng tinh tế lưu truyền đến nay.",
    coverImg: "https://images.unsplash.com/photo-1509072619873-adb3dc289b50?w=600&h=400&fit=crop&auto=format",
    status: 1,
    servingPlacesCount: 18,
    servingPlaces: [
      { id: 6, name: "Bún Bò Huế Mụ Rớt", address: "38 Chi Lăng, TP. Huế", rating: 4.7 },
      { id: 16, name: "Bún Bò O Cương Điệp", address: "6 Trần Thúc Nhẫn, TP. Huế", rating: 4.8 },
      { id: 17, name: "Bún Bò Cẩm Cố Đô", address: "45 Lê Lợi, TP. Huế", rating: 4.6 },
    ],
    createdAt: "2026-01-15",
    viewsCount: 31200,
  },
  {
    id: 204,
    name: "Bánh Tráng Cuốn Thịt Heo 2 Đầu Da",
    region: "Miền Trung",
    province: "Đà Nẵng",
    category: "Đặc sản cuốn & chấm",
    description: "Thịt heo luộc khéo léo để hai đầu đều có lớp da giòn mỡ trong, cuốn cùng bánh tráng phơi sương Đại Lộc, rau sống ngũ sắc và chấm nước mắm nêm cá cơm nguyên chất cay xè.",
    historyInfo: "Món ăn dân dã bắt nguồn từ vùng quê Quảng Nam - Đà Nẵng, qua bàn tay sáng tạo của người dân xứ Quảng đã trở thành biểu tượng ẩm thực không thể bỏ qua của du khách khi ghé thăm Đà Nẵng.",
    coverImg: "https://images.unsplash.com/photo-1541544741938-0af808871cc0?w=600&h=400&fit=crop&auto=format",
    status: 1,
    servingPlacesCount: 12,
    servingPlaces: [
      { id: 18, name: "Bánh Tráng Thịt Heo Trần", address: "4 Lê Duẩn, Hải Châu, Đà Nẵng", rating: 4.7 },
      { id: 19, name: "Quán Mậu Đà Nẵng", address: "35 Đỗ Thúc Tịnh, Cẩm Lệ, Đà Nẵng", rating: 4.8 },
      { id: 20, name: "Bánh Tráng Bà Mua", address: "95A Nguyễn Tri Phương, Đà Nẵng", rating: 4.6 },
    ],
    createdAt: "2026-01-18",
    viewsCount: 15800,
  },
];

export interface AdminBlogItem {
  id: number;
  title: string;
  authorName: string;
  authorAvatar: string;
  category: string;
  province: string;
  region: string;
  readTime: string;
  viewCount: number;
  coverImg: string;
  excerpt: string;
  status: 1 | 0; // 1: Published, 0: Hidden
  isFeatured: boolean;
  createdAt: string;
}

export const initialAdminBlogs: AdminBlogItem[] = [
  {
    id: 501,
    title: "Kinh Nghiệm Khám Phá Hội An Tự Túc 3N2Đ Siêu Chi Tiết 2026",
    authorName: "Đặng Thu Thảo",
    authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop",
    category: "Kinh nghiệm du lịch",
    province: "Quảng Nam",
    region: "Miền Trung",
    readTime: "7 phút đọc",
    viewCount: 14200,
    coverImg: "https://images.unsplash.com/photo-1691927644490-e1a24b366a5e?w=600&h=400&fit=crop&auto=format",
    excerpt: "Tổng hợp lịch trình đi bộ phố cổ về đêm, săn vé đi thuyền hoa đăng sông Hoài, ăn sạch các quán ngon lừng danh và mẹo check-in không dính người.",
    status: 1,
    isFeatured: true,
    createdAt: "12/02/2026",
  },
  {
    id: 502,
    title: "10 Quán Cà Phê View Đồi Thông Đẹp Quên Lối Về Tại Đà Lạt",
    authorName: "Nguyễn Minh Anh",
    authorAvatar: "https://i.pravatar.cc/300?img=47",
    category: "Địa điểm check-in",
    province: "Lâm Đồng (Đà Lạt)",
    region: "Miền Trung",
    readTime: "5 phút đọc",
    viewCount: 9850,
    coverImg: "https://images.unsplash.com/photo-1733372607228-6aeaa92c5e62?w=600&h=400&fit=crop&auto=format",
    excerpt: "Gợi ý những góc chill lãng mạn ngắm hoàng hôn buông đỏ thung lũng, nhâm nhi tách cà phê nóng giữa không khí se lạnh mộng mơ xứ ngàn hoa.",
    status: 1,
    isFeatured: true,
    createdAt: "18/02/2026",
  },
  {
    id: 503,
    title: "Hành Trình Di Sản Cố Đô Huế: Chùa Chiền, Lăng Tẩm & Ẩm Thực Cung Đình",
    authorName: "Bùi Bích Ngọc",
    authorAvatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&h=150&fit=crop",
    category: "Văn hóa & Lịch sử",
    province: "Thừa Thiên Huế",
    region: "Miền Trung",
    readTime: "8 phút đọc",
    viewCount: 8400,
    coverImg: "https://images.unsplash.com/photo-1569271532956-3fb81a207115?w=600&h=400&fit=crop&auto=format",
    excerpt: "Tìm về nét trầm mặc của Đại Nội, viếng chùa Thiên Mụ lúc hoàng hôn và thưởng thức những món ăn cung đình cầu kỳ tinh tế thời Nguyễn.",
    status: 1,
    isFeatured: false,
    createdAt: "22/02/2026",
  },
  {
    id: 504,
    title: "Cẩm Nang Ăn Sập Đà Nẵng Trong 24 Giờ Chi Tiết (Đang bị khiếu nại)",
    authorName: "Phượt Thủ Xuyên Việt",
    authorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop",
    category: "Ẩm thực địa phương",
    province: "Đà Nẵng",
    region: "Miền Trung",
    readTime: "6 phút đọc",
    viewCount: 3100,
    coverImg: "https://images.unsplash.com/photo-1589291432463-fbddbfd10bbd?w=600&h=400&fit=crop&auto=format",
    excerpt: "Lịch trình ăn uống giá rẻ tại chợ Cồn và bãi biển Mỹ Khê nhưng có phản ánh vi phạm bản quyền ảnh Cầu Vàng.",
    status: 0, // Hidden due to report
    isFeatured: false,
    createdAt: "25/02/2026",
  },
];

export interface AdminAuditLog {
  id: number;
  action: string;
  target: string;
  details: string;
  timestamp: string;
  type: "approve" | "reject" | "hide" | "edit" | "resolve" | "create";
}

export const initialAdminAuditLogs: AdminAuditLog[] = [
  {
    id: 1,
    action: "Phê duyệt đề xuất",
    target: "Bánh Canh Chả Cá Cô Hà Nha Trang",
    details: "Duyệt địa điểm quán ăn mới cho tỉnh Khánh Hòa, thêm vào cơ sở dữ liệu chính thức",
    timestamp: "Hôm qua, 10:00",
    type: "approve",
  },
  {
    id: 2,
    action: "Từ chối đề xuất",
    target: "Quán Trà Sữa Thỏ Trắng Ảo",
    details: "Lý do: Địa chỉ ảo 9999 Nguyễn Văn Linh không tồn tại, ảnh sao chép vi phạm",
    timestamp: "2 ngày trước, 15:30",
    type: "reject",
  },
  {
    id: 3,
    action: "Xử lý báo cáo vi phạm",
    target: "Đánh giá tại Vịnh Lăng Cô",
    details: "Giải thích thắc mắc khách về ranh giới bãi tắm tự phát, gắn nhãn vị trí rõ ràng",
    timestamp: "Hôm qua, 15:00",
    type: "resolve",
  },
  {
    id: 4,
    action: "Tạm ẩn bài viết Blog",
    target: "Cẩm Nang Ăn Sập Đà Nẵng Trong 24 Giờ",
    details: "Tạm ẩn do khiếu nại bản quyền hình ảnh từ nhiếp ảnh gia Hoàng Thế Nhiệm",
    timestamp: "Hôm qua, 12:00",
    type: "hide",
  },
  {
    id: 5,
    action: "Cập nhật đặc sản món ăn",
    target: "Cao Lầu Phố Cổ Hội An",
    details: "Bổ sung thông tin lịch sử giếng cổ Bá Lễ và cập nhật thêm 3 quán ăn phục vụ",
    timestamp: "3 ngày trước, 09:15",
    type: "edit",
  },
];
