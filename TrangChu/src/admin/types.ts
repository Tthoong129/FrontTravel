import { Place } from "../data";
import {
  AdminProposalItem,
  AdminReportItem,
  AdminFoodItem,
  AdminBlogItem,
  AdminAuditLog,
  ReportTypeCode,
} from "../adminData";

// 11 TABS THEO ĐÚNG ĐẶC TẢ HỆ THỐNG
export type AdminMainTab =
  | "dashboard"             // 1. Tổng quan (Dashboard)
  | "places"                // 2. Địa điểm (Places, PlaceMedia)
  | "proposals"             // 3. Đề xuất đóng góp (Proposals)
  | "reviews_comments"      // 4. Đánh giá & Bình luận (Reviews, Comments)
  | "reports"               // 5. Báo cáo vi phạm (PlaceReports, ReviewReports, CommentReports, BlogReports)
  | "foods"                 // 6. Ẩm thực & Đặc sản (Foods, FoodPlaces, FoodProvinces)
  | "collections"           // 7. Bộ sưu tập (Collections, CollectionPlaces)
  | "provinces"             // 8. Tỉnh/Thành trong vùng (Provinces, Regions)
  | "blogs"                 // 9. Blog & Cẩm nang (Blogs)
  | "categories"            // 10. Danh mục (chỉ xem: PlaceTypes, Categories)
  | "notifications_profile" // 11. Thông báo & Hồ sơ cá nhân (Notifications, UserProfiles)
  | "audit_logs";           // Nhật ký kiểm toán

// Sub-tabs inside PLACE DETAIL FORM & HUB
export type PlaceDetailTab =
  | "info"
  | "contact"
  | "map"
  | "media"
  | "backlinks"
  | "reviews"
  | "proposals"
  | "reports";

// Place Media Item
export interface PlaceMediaItem {
  id: number;
  url: string;
  type: "image" | "video" | "360";
  isCover: boolean;
  isVerified: boolean;
  status: "active" | "hidden";
  uploadedBy: string;
  uploadedAt: string;
}

// Review Item
export interface PlaceReviewItem {
  id: number;
  placeId: number;
  placeName: string;
  category: string;
  province: string;
  userName: string;
  userAvatar: string;
  rating: number;
  content: string;
  images: string[];
  createdAt: string;
  status: "active" | "hidden";
  reportCount: number;
  reportReason?: string;
  visitDate: string;
}

// Comment Item
export interface PlaceCommentItem {
  id: number;
  reviewId: number;
  placeId: number;
  placeName: string;
  category: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  createdAt: string;
  status: "active" | "hidden";
  reportCount: number;
  reportReason?: string;
  parentId?: number;
  replyToName?: string;
}

// Grouped Report Type
export interface GroupedReport {
  groupKey: string;
  targetType: "place" | "review" | "comment" | "blog" | "photo";
  targetId: number;
  targetTitle: string;
  targetSubtitle?: string;
  targetImage?: string;
  targetContent?: string;
  targetRating?: number;
  province: string;
  category: string;
  reportsCount: number;
  reportsList: AdminReportItem[];
  highestPriority: "urgent" | "high" | "normal" | "low";
  latestReportTime: string;
  assignedAdminId?: number;
  assignedAdminName?: string;
  hasUnresolvedUrgent: boolean;
  status: 0 | 1 | 2;
}
