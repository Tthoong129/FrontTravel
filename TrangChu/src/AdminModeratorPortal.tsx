import { useState } from "react";
import {
  currentAdminInfo,
  initialAdminProposals,
  initialAdminReports,
  initialAdminFoods,
  initialAdminBlogs,
  initialAdminAuditLogs,
  AdminProposalItem,
  AdminReportItem,
  AdminAuditLog,
} from "./adminData";
import { places as initialPlaces, Place } from "./data";
import {
  AdminMainTab,
  PlaceDetailTab,
  PlaceMediaItem,
  PlaceReviewItem,
  PlaceCommentItem,
  GroupedReport,
} from "./admin/types";

// Modular Components
import AdminSidebar from "./admin/components/AdminSidebar";
import AdminTopbar from "./admin/components/AdminTopbar";
import ModerationDrawer from "./admin/components/ModerationDrawer";

// Modular Tabs
import DashboardTab from "./admin/tabs/DashboardTab";
import PlacesTab from "./admin/tabs/PlacesTab";
import ProposalsTab from "./admin/tabs/ProposalsTab";
import ReviewsCommentsTab from "./admin/tabs/ReviewsCommentsTab";
import ReportsTab from "./admin/tabs/ReportsTab";
import UsersTab from "./admin/tabs/UsersTab";
import PermissionsTab from "./admin/tabs/PermissionsTab";
import SystemSettingsTab from "./admin/tabs/SystemSettingsTab";
import {
  FoodsTab,
  CollectionsTab,
  ProvincesTab,
  BlogsTab,
  CategoriesTab,
  NotificationsProfileTab,
  AuditLogsTab,
} from "./admin/tabs/OtherTabs";

// Modals
import AddPlaceModal from "./admin/modals/AddPlaceModal";
import EditPlaceModal from "./admin/modals/EditPlaceModal";

// Re-export types for backward compatibility
export type { AdminMainTab, PlaceDetailTab, PlaceMediaItem, PlaceReviewItem, PlaceCommentItem };

interface AdminModeratorPortalProps {
  onBackToUserView: () => void;
  onOpenSystemAdmin?: () => void;
  showToast: (msg: string) => void;
}

export default function AdminModeratorPortal({
  onBackToUserView,
  onOpenSystemAdmin,
  showToast,
}: AdminModeratorPortalProps) {
  // Navigation State
  const [mainTab, setMainTab] = useState<AdminMainTab>("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Global Dashboard Scope
  const [dashRegion, setDashRegion] = useState("all");
  const [dashProvince, setDashProvince] = useState("all");
  const [dashTimeRange, setDashTimeRange] = useState<"today" | "7days" | "30days" | "90days">("7days");

  // Core Data Stores
  const [placesList, setPlacesList] = useState<Place[]>(() =>
    initialPlaces.map((p, idx) => ({
      ...p,
      statusNum: idx === 0 ? 0 : 1,
      status: idx === 0 ? "Chờ duyệt" : "Đã duyệt",
      type: (p as any).category || "Nhà hàng & Quán ăn",
      images: [p.img],
    }))
  );

  const [proposals, setProposals] = useState<AdminProposalItem[]>(initialAdminProposals);
  const [reports, setReports] = useState<AdminReportItem[]>(initialAdminReports);
  const [foodsList] = useState(initialAdminFoods);
  const [blogsList] = useState(initialAdminBlogs);
  const [auditLogs, setAuditLogs] = useState<AdminAuditLog[]>(initialAdminAuditLogs);

  // Places Filter & Details State
  const [selectedPlaceId, setSelectedPlaceId] = useState<number | null>(null);
  const [placeDetailTab, setPlaceDetailTab] = useState<PlaceDetailTab>("info");
  const [placeSearchText, setPlaceSearchText] = useState("");
  const [placeFilterProvince, setPlaceFilterProvince] = useState("all");
  const [placeFilterStatus, setPlaceFilterStatus] = useState("all");

  // Proposals Filter
  const [proposalStatusFilter, setProposalStatusFilter] = useState<"all" | "0" | "1" | "2">("all");

  // Reviews & Comments State
  const [revComTab, setRevComTab] = useState<"reviews" | "comments">("reviews");
  const [revReportFilter, setRevReportFilter] = useState("all");
  const [reviewsList, setReviewsList] = useState<PlaceReviewItem[]>([
    {
      id: 501,
      placeId: 1,
      placeName: "Mì Quảng Ếch Bếp Trang",
      category: "Nhà hàng & Quán ăn",
      province: "Đà Nẵng",
      userName: "Trần Minh Quang",
      userAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop",
      rating: 5,
      content: "Mì quảng ếch nước dùng ngọt thanh, ếch xào săn thịt rất thơm và chuẩn vị Đà Nẵng!",
      images: [],
      createdAt: "18/09/2026 14:20",
      status: "active",
      reportCount: 0,
      visitDate: "17/09/2026",
    },
    {
      id: 502,
      placeId: 2,
      placeName: "Bánh Tráng Cuốn Thịt Heo Hoàng Tín",
      category: "Nhà hàng & Quán ăn",
      province: "Đà Nẵng",
      userName: "Lê Hoàng Mai",
      userAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop",
      rating: 4,
      content: "Thịt hai đầu da ngon chuẩn, mắm nêm đậm đà thơm lừng, rau sống tươi sạch.",
      images: [],
      createdAt: "17/09/2026 10:15",
      status: "active",
      reportCount: 0,
      visitDate: "16/09/2026",
    },
    {
      id: 503,
      placeId: 1,
      placeName: "Mì Quảng Ếch Bếp Trang",
      category: "Nhà hàng & Quán ăn",
      province: "Đà Nẵng",
      userName: "Nguyễn Hoàng Long",
      userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop",
      rating: 1,
      content: "Quán phục vụ lừa đảo khách du lịch, đồ ăn ôi thiu mà giá đắt cắt cổ! Tẩy chay quán này ngay!",
      images: [],
      createdAt: "16/09/2026 19:40",
      status: "active",
      reportCount: 4,
      reportReason: "Nghi vấn bôi nhọ và cạnh tranh không lành mạnh",
      visitDate: "15/09/2026",
    },
  ]);

  const [commentsList, setCommentsList] = useState<PlaceCommentItem[]>([
    {
      id: 901,
      blogId: 1,
      userName: "Hoàng Anh",
      userAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop",
      content: "Bài viết chia sẻ rất chi tiết, mình đã đi theo lịch trình này và trải nghiệm tuyệt vời!",
      createdAt: "18/09/2026 09:30",
      status: "active",
      reportCount: 0,
    },
  ]);

  // Reports Queue State
  const [reportSubTab, setReportSubTab] = useState<"pending" | "resolved" | "dismissed" | "mine">("pending");
  const [reportTargetTypeFilter, setReportTargetTypeFilter] = useState("all");
  const [reportTypeFilter, setReportTypeFilter] = useState("all");
  const [reportProvinceFilter, setReportProvinceFilter] = useState("all");
  const [reportSearchText, setReportSearchText] = useState("");
  const [reportCurrentPage, setReportCurrentPage] = useState(1);
  const [selectedReportRowIds, setSelectedReportRowIds] = useState<number[]>([]);

  // Moderation Drawer State
  const [activeReportGroupKey, setActiveReportGroupKey] = useState<string | null>(null);
  const [selectedReportIdInDrawer, setSelectedReportIdInDrawer] = useState<number | null>(null);
  const [drawerDecisionTab, setDrawerDecisionTab] = useState<"accept" | "dismiss">("accept");
  const [drawerActionTaken, setDrawerActionTaken] = useState("hide_target");
  const [drawerResolutionNote, setDrawerResolutionNote] = useState("");
  const [drawerDismissReason, setDrawerDismissReason] = useState("SPAM_ABUSE");
  const [drawerAutoCloseDuplicates, setDrawerAutoCloseDuplicates] = useState(true);
  const [drawerNotifyReporter, setDrawerNotifyReporter] = useState(true);

  // Add Place Modal State
  const [isAddPlaceModalOpen, setIsAddPlaceModalOpen] = useState(false);
  const [newPlaceForm, setNewPlaceForm] = useState({
    name: "",
    category: "Nhà hàng & Quán ăn",
    province: "Đà Nẵng",
    location: "",
    price: "35.000đ – 75.000đ",
    hours: "07:00 – 22:00",
    phone: "0905 123 456",
    website: "https://langthang.vn",
    desc: "",
    img: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=400&fit=crop",
  });

  // Edit Place Modal State
  const [isEditPlaceModalOpen, setIsEditPlaceModalOpen] = useState(false);
  const [editPlaceForm, setEditPlaceForm] = useState({
    id: 0,
    name: "",
    category: "",
    province: "",
    location: "",
    price: "",
    hours: "",
    phone: "",
    website: "",
    desc: "",
    img: "",
  });

  // Current selected place
  const currentPlace = placesList.find((p) => p.id === selectedPlaceId) || null;

  // ── AUDIT LOG HELPER ──
  const addAuditLog = (
    action: string,
    target: string,
    details: string,
    type: "approve" | "reject" | "edit" | "hide" | "create" | "resolve" | "delete"
  ) => {
    const newLog: AdminAuditLog = {
      id: Date.now(),
      adminId: currentAdminInfo.adminId,
      adminName: currentAdminInfo.adminName,
      action,
      targetType: target,
      targetName: target,
      details,
      timestamp: "Vừa xong",
      type,
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // Handlers for Places
  const handleApprovePlace = (placeId: number) => {
    setPlacesList((prev) =>
      prev.map((p) => {
        if (p.id === placeId) {
          addAuditLog("Duyệt địa điểm phát hành", p.name, "Địa điểm đã được công khai trên hệ thống", "approve");
          showToast(`Đã duyệt địa điểm "${p.name}".`);
          return { ...p, status: "Đã duyệt", statusNum: 1 };
        }
        return p;
      })
    );
  };

  const handleTogglePlaceStatus = (placeId: number) => {
    setPlacesList((prev) =>
      prev.map((p) => {
        if (p.id === placeId) {
          const isHidden = (p as any).statusNum === 3;
          const nextStatusNum = isHidden ? 1 : 3;
          const nextStatusStr = isHidden ? "Đã duyệt" : "Đang ẩn";
          addAuditLog(
            isHidden ? "Khôi phục hiển thị địa điểm" : "Tạm ẩn địa điểm",
            p.name,
            isHidden ? "Khôi phục hiển thị trên trang khách" : "Tạm ẩn khỏi trang khách",
            "hide"
          );
          showToast(`Đã ${isHidden ? "hiện lại" : "tạm ẩn"} địa điểm "${p.name}".`);
          return { ...p, status: nextStatusStr, statusNum: nextStatusNum };
        }
        return p;
      })
    );
  };

  const handleCreateNewPlace = () => {
    if (!newPlaceForm.name || !newPlaceForm.location) {
      showToast("Vui lòng nhập đầy đủ tên và địa chỉ địa điểm.");
      return;
    }

    const newId = Date.now();
    const createdPlace: Place = {
      id: newId,
      name: newPlaceForm.name,
      category: newPlaceForm.category,
      province: newPlaceForm.province,
      location: newPlaceForm.location,
      price: newPlaceForm.price,
      hours: newPlaceForm.hours,
      phone: newPlaceForm.phone,
      website: newPlaceForm.website,
      desc: newPlaceForm.desc || "Địa điểm chất lượng được ban quản trị thêm mới.",
      img: newPlaceForm.img,
      rating: 5.0,
      reviews: 0,
      isVerified: true,
      status: "Đã duyệt",
      type: "Ăn uống",
      tags: [newPlaceForm.category, newPlaceForm.province],
      images: [newPlaceForm.img],
      ...({
        statusNum: 1,
        slug: newPlaceForm.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        createdBy: `Admin (${currentAdminInfo.adminName})`,
        createdAt: "Hôm nay",
        minPrice: 30000,
        maxPrice: 80000,
        lat: 16.0678,
        lng: 108.2208,
      } as any),
    };

    setPlacesList((prev) => [createdPlace, ...prev]);
    addAuditLog("Thêm mới địa điểm trực tiếp", createdPlace.name, "Tạo mới bởi Admin cấp 1", "create");
    setIsAddPlaceModalOpen(false);
    showToast(`Đã thêm mới địa điểm "${createdPlace.name}".`);
  };

  const handleOpenEditPlace = (place: any) => {
    setEditPlaceForm({
      id: place.id,
      name: place.name || "",
      category: place.category || "",
      province: place.province || "",
      location: place.location || "",
      price: place.price || "",
      hours: place.hours || "",
      phone: place.phone || "",
      website: place.website || "",
      desc: place.desc || "",
      img: place.img || "",
    });
    setIsEditPlaceModalOpen(true);
  };

  const handleUpdatePlace = () => {
    setPlacesList((prev) =>
      prev.map((p) => {
        if (p.id === editPlaceForm.id) {
          addAuditLog("Cập nhật địa điểm", editPlaceForm.name, "Chỉnh sửa thông tin bởi Admin", "edit");
          return {
            ...p,
            name: editPlaceForm.name,
            category: editPlaceForm.category,
            province: editPlaceForm.province,
            location: editPlaceForm.location,
            price: editPlaceForm.price,
            hours: editPlaceForm.hours,
            phone: editPlaceForm.phone,
            website: editPlaceForm.website,
            desc: editPlaceForm.desc,
            img: editPlaceForm.img,
          };
        }
        return p;
      })
    );
    setIsEditPlaceModalOpen(false);
    showToast(`Đã cập nhật địa điểm "${editPlaceForm.name}".`);
  };

  // ── GROUPED REPORTS LOGIC ──
  const priorityOrder: Record<string, number> = { urgent: 4, high: 3, normal: 2, low: 1 };

  const groupedReportsList = Object.values(
    reports.reduce((acc, rep) => {
      const key = `${rep.targetType}_${rep.targetId}`;
      if (!acc[key]) {
        acc[key] = {
          groupKey: key,
          targetType: rep.targetType,
          targetId: rep.targetId,
          targetTitle: rep.targetTitle,
          targetSubtitle: rep.targetSubtitle,
          targetImage: rep.targetImage,
          province: rep.province,
          status: rep.status,
          assignedAdminId: rep.assignedToAdminId,
          assignedAdminName: rep.assignedToAdminName,
          highestPriority: rep.priority,
          latestReportAt: rep.createdAt,
          reportsCount: 0,
          reportsList: [],
        };
      }
      acc[key].reportsCount += 1;
      acc[key].reportsList.push(rep);

      if (priorityOrder[rep.priority] > priorityOrder[acc[key].highestPriority]) {
        acc[key].highestPriority = rep.priority;
      }
      if (rep.assignedToAdminName) {
        acc[key].assignedAdminId = rep.assignedToAdminId;
        acc[key].assignedAdminName = rep.assignedToAdminName;
      }
      return acc;
    }, {} as Record<string, GroupedReport>)
  ).map((group) => {
    const hasPending = group.reportsList.some((r: AdminReportItem) => r.status === 0);
    const hasResolved = group.reportsList.some((r: AdminReportItem) => r.status === 1);
    group.status = hasPending ? 0 : hasResolved ? 1 : 2;
    return group;
  });

  const activeReportGroup = activeReportGroupKey
    ? groupedReportsList.find((g) => g.groupKey === activeReportGroupKey) || null
    : null;

  const selectedReportInDrawer = activeReportGroup
    ? activeReportGroup.reportsList.find((r: AdminReportItem) => r.id === selectedReportIdInDrawer) ||
      activeReportGroup.reportsList[0]
    : null;

  // Moderation Handlers
  const handleOpenModerationDrawer = (groupKey: string, specificReportId?: number) => {
    setActiveReportGroupKey(groupKey);
    const grp = groupedReportsList.find((g) => g.groupKey === groupKey);
    if (grp) {
      setSelectedReportIdInDrawer(specificReportId || grp.reportsList[0]?.id || null);
      const firstRep = grp.reportsList[0];
      if (firstRep) {
        if (firstRep.reportTypeCode === "PLACE_CLOSED") {
          setDrawerActionTaken("hide_target");
          setDrawerResolutionNote("Đã xác minh cơ sở ngừng kinh doanh thực tế, tiến hành ẩn trên hệ thống.");
        } else if (firstRep.reportTypeCode === "CONTENT_OFFENSIVE" || firstRep.reportTypeCode === "CONTENT_SPAM") {
          setDrawerActionTaken("hide_target");
          setDrawerResolutionNote("Nội dung vi phạm tiêu chuẩn cộng đồng. Đã ẩn nội dung và ghi nhận vi phạm tác giả.");
        } else if (firstRep.reportTypeCode === "PLACE_WRONG_INFO" || firstRep.reportTypeCode === "PLACE_WRONG_PRICE") {
          setDrawerActionTaken("edit_place");
          setDrawerResolutionNote("Đã hiệu chỉnh thông tin theo phản ánh chính xác từ người dùng.");
        } else {
          setDrawerActionTaken("hide_target");
          setDrawerResolutionNote("Đã tiếp nhận và xử lý vi phạm.");
        }
      }
      setDrawerDecisionTab("accept");
    }
  };

  const handleAssignToMe = (groupKey: string) => {
    setReports((prev) =>
      prev.map((r) => {
        if (`${r.targetType}_${r.targetId}` === groupKey) {
          return {
            ...r,
            assignedToAdminId: currentAdminInfo.adminId,
            assignedToAdminName: currentAdminInfo.adminName,
          };
        }
        return r;
      })
    );
    showToast(`Đã nhận việc! Nhóm báo cáo được gán cho ${currentAdminInfo.adminName}.`);
  };

  const handleToggleSelectRow = (id: number) => {
    setSelectedReportRowIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleBatchAssign = () => {
    if (selectedReportRowIds.length === 0) return;
    setReports((prev) =>
      prev.map((r) =>
        selectedReportRowIds.includes(r.id)
          ? {
              ...r,
              assignedToAdminId: currentAdminInfo.adminId,
              assignedToAdminName: currentAdminInfo.adminName,
            }
          : r
      )
    );
    showToast(`Đã phân công ${selectedReportRowIds.length} mục cho bạn (${currentAdminInfo.adminName}).`);
    setSelectedReportRowIds([]);
  };

  const handleSubmitModerationResolution = () => {
    if (!activeReportGroup) return;
    const isAccept = drawerDecisionTab === "accept";
    const note = drawerResolutionNote.trim() || (isAccept ? "Đã xử lý vi phạm thành công." : "Bác bỏ báo cáo.");

    // Update targets
    if (isAccept) {
      if (drawerActionTaken === "hide_target") {
        if (activeReportGroup.targetType === "place") {
          setPlacesList((prev) =>
            prev.map((p) =>
              p.id === activeReportGroup.targetId ? { ...p, statusNum: 3, status: "Đang ẩn" } : p
            )
          );
        } else if (activeReportGroup.targetType === "review") {
          setReviewsList((prev) =>
            prev.map((r) =>
              r.id === activeReportGroup.targetId ? { ...r, status: "hidden" } : r
            )
          );
        } else if (activeReportGroup.targetType === "comment") {
          setCommentsList((prev) =>
            prev.map((c) =>
              c.id === activeReportGroup.targetId ? { ...c, status: "hidden" } : c
            )
          );
        }
      }
    }

    // Update reports state
    setReports((prev) =>
      prev.map((r) => {
        const matchesTarget = r.targetType === activeReportGroup.targetType && r.targetId === activeReportGroup.targetId;
        const matchesSpecific = !drawerAutoCloseDuplicates ? r.id === selectedReportInDrawer?.id : matchesTarget;

        if (matchesSpecific) {
          return {
            ...r,
            status: isAccept ? 1 : 2,
            resolvedAt: "Vừa xong",
            resolvedByAdminId: currentAdminInfo.adminId,
            resolvedByAdminName: currentAdminInfo.adminName,
            actionTaken: isAccept ? drawerActionTaken : "none",
            resolutionNote: note,
            dismissReason: !isAccept ? drawerDismissReason : undefined,
          };
        }
        return r;
      })
    );

    addAuditLog(
      isAccept ? `Chấp nhận xử lý báo cáo (${activeReportGroup.reportsCount} lượt)` : `Bác bỏ báo cáo (${drawerDismissReason})`,
      activeReportGroup.targetTitle,
      `Hành động: ${drawerActionTaken}. Ghi chú: ${note}`,
      isAccept ? "resolve" : "reject"
    );

    const notifCount = drawerAutoCloseDuplicates ? activeReportGroup.reportsCount : 1;
    showToast(
      isAccept
        ? `✓ Đã xử lý ${notifCount} báo cáo vi phạm. Đã gửi thông báo kết quả cho người báo.`
        : `✕ Đã bác bỏ ${notifCount} báo cáo (${drawerDismissReason}).`
    );

    setActiveReportGroupKey(null);
  };

  const handleNavigateToPlaceContext = (placeId: number, tab: PlaceDetailTab = "info") => {
    setSelectedPlaceId(placeId);
    setPlaceDetailTab(tab);
    setMainTab("places");
  };

  // Counts for Badges
  const pendingPlaces = placesList.filter((p) => (p as any).statusNum === 0);
  const pendingProposals = proposals.filter((p) => p.status === 0);
  const pendingReports = reports.filter((r) => r.status === 0);
  const reportedReviews = reviewsList.filter((r) => r.reportCount > 0);

  return (
    <div className="min-h-screen bg-[#F1F5F9] text-slate-800 flex font-sans antialiased selection:bg-blue-600 selection:text-white">
      {/* ── 1. COLLAPSIBLE MODERN SAAS SIDEBAR ── */}
      <AdminSidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        mainTab={mainTab}
        setMainTab={setMainTab}
        setSelectedPlaceId={setSelectedPlaceId}
        pendingPlacesCount={pendingPlaces.length}
        pendingProposalsCount={pendingProposals.length}
        reportedReviewsCount={reportedReviews.length}
        pendingReportsCount={pendingReports.length}
        foodsCount={foodsList.length}
        blogsCount={blogsList.length}
        auditLogsCount={auditLogs.length}
        onOpenSystemAdmin={onOpenSystemAdmin}
        onBackToUserView={onBackToUserView}
      />

      {/* ── 2. MAIN WORKSPACE ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        {/* Topbar (No duplicate toggle buttons on desktop!) */}
        <AdminTopbar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          mainTab={mainTab}
          selectedPlaceId={selectedPlaceId}
          currentPlaceName={currentPlace?.name}
          searchText={placeSearchText}
          setSearchText={setPlaceSearchText}
          currentAdminInfo={currentAdminInfo}
          showToast={showToast}
        />

        {/* ── MAIN CONTENT ROUTER ── */}
        <main className="p-6 sm:p-8 space-y-7 flex-1">
          {/* TAB 1: TỔNG QUAN (DASHBOARD) */}
          {mainTab === "dashboard" && (
            <DashboardTab
              currentAdminInfo={currentAdminInfo}
              places={placesList}
              proposals={proposals}
              reports={reports}
              reportedReviews={reportedReviews}
              auditLogs={auditLogs}
              dashRegion={dashRegion}
              setDashRegion={setDashRegion}
              dashProvince={dashProvince}
              setDashProvince={setDashProvince}
              dashTimeRange={dashTimeRange}
              setDashTimeRange={setDashTimeRange}
              setMainTab={setMainTab}
              setPlaceFilterStatus={setPlaceFilterStatus}
              setProposalStatusFilter={setProposalStatusFilter}
              setRevComTab={setRevComTab}
              setRevReportFilter={setRevReportFilter}
              setReportSubTab={setReportSubTab}
              setIsAddPlaceModalOpen={setIsAddPlaceModalOpen}
              showToast={showToast}
            />
          )}

          {/* TAB 2: ĐỊA ĐIỂM (PLACES) */}
          {mainTab === "places" && (
            <PlacesTab
              placesList={placesList}
              selectedPlaceId={selectedPlaceId}
              setSelectedPlaceId={setSelectedPlaceId}
              placeDetailTab={placeDetailTab}
              setPlaceDetailTab={setPlaceDetailTab}
              placeSearchText={placeSearchText}
              setPlaceSearchText={setPlaceSearchText}
              placeFilterProvince={placeFilterProvince}
              setPlaceFilterProvince={setPlaceFilterProvince}
              placeFilterStatus={placeFilterStatus}
              setPlaceFilterStatus={setPlaceFilterStatus}
              setIsAddPlaceModalOpen={setIsAddPlaceModalOpen}
              handleApprovePlace={handleApprovePlace}
              handleTogglePlaceStatus={handleTogglePlaceStatus}
              handleOpenModerationDrawer={handleOpenModerationDrawer}
              handleOpenEditPlace={handleOpenEditPlace}
              showToast={showToast}
            />
          )}

          {/* TAB 3: ĐỀ XUẤT ĐÓNG GÓP (PROPOSALS) */}
          {mainTab === "proposals" && (
            <ProposalsTab
              proposals={proposals}
              proposalStatusFilter={proposalStatusFilter}
              setProposalStatusFilter={setProposalStatusFilter}
              setProposals={setProposals}
              addAuditLog={addAuditLog}
              showToast={showToast}
            />
          )}

          {/* TAB 4: ĐÁNH GIÁ & BÌNH LUẬN (REVIEWS & COMMENTS) */}
          {mainTab === "reviews_comments" && (
            <ReviewsCommentsTab
              revComTab={revComTab}
              setRevComTab={setRevComTab}
              reviewsList={reviewsList}
              setReviewsList={setReviewsList}
              commentsList={commentsList}
              setCommentsList={setCommentsList}
              revReportFilter={revReportFilter}
              setRevReportFilter={setRevReportFilter}
              addAuditLog={addAuditLog}
              showToast={showToast}
            />
          )}

          {/* TAB 5: BÁO CÁO VI PHẠM (REPORTS QUEUE) */}
          {mainTab === "reports" && (
            <ReportsTab
              reports={reports}
              groupedReportsList={groupedReportsList}
              reportSubTab={reportSubTab}
              setReportSubTab={setReportSubTab}
              reportTargetTypeFilter={reportTargetTypeFilter}
              setReportTargetTypeFilter={setReportTargetTypeFilter}
              reportTypeFilter={reportTypeFilter}
              setReportTypeFilter={setReportTypeFilter}
              reportProvinceFilter={reportProvinceFilter}
              setReportProvinceFilter={setReportProvinceFilter}
              reportSearchText={reportSearchText}
              setReportSearchText={setReportSearchText}
              selectedReportRowIds={selectedReportRowIds}
              handleToggleSelectRow={handleToggleSelectRow}
              handleBatchAssign={handleBatchAssign}
              handleOpenModerationDrawer={handleOpenModerationDrawer}
              handleAssignToMe={handleAssignToMe}
              reportCurrentPage={reportCurrentPage}
              setReportCurrentPage={setReportCurrentPage}
              currentAdminId={currentAdminInfo.adminId}
            />
          )}

          {/* TAB 5.5: QUẢN LÝ NGƯỜI DÙNG & ĐIỂM UY TÍN (USERS MANAGEMENT) */}
          {mainTab === "users" && <UsersTab showToast={showToast} />}

          {/* TAB 6: ẨM THỰC & ĐẶC SẢN */}
          {mainTab === "foods" && <FoodsTab foodsList={foodsList} />}

          {/* TAB 7: BỘ SƯU TẬP */}
          {mainTab === "collections" && <CollectionsTab />}

          {/* TAB 8: TỈNH/THÀNH TRONG VÙNG */}
          {mainTab === "provinces" && <ProvincesTab />}

          {/* TAB 9: BLOG & CẨM NANG */}
          {mainTab === "blogs" && <BlogsTab blogsList={blogsList} />}

          {/* TAB 10: DANH MỤC HỆ THỐNG */}
          {mainTab === "categories" && <CategoriesTab currentAdminInfo={currentAdminInfo} />}

          {/* TAB 11: PHÂN QUYỀN & TÀI KHOẢN QUẢN TRỊ */}
          {mainTab === "permissions" && <PermissionsTab showToast={showToast} />}

          {/* TAB 12: CẤU HÌNH HỆ THỐNG & SLA */}
          {mainTab === "settings" && <SystemSettingsTab showToast={showToast} />}

          {/* TAB 13: THÔNG BÁO & HỒ SƠ */}
          {mainTab === "notifications_profile" && (
            <NotificationsProfileTab currentAdminInfo={currentAdminInfo} />
          )}

          {/* TAB 14: NHẬT KÝ KIỂM TOÁN */}
          {mainTab === "audit_logs" && <AuditLogsTab auditLogs={auditLogs} />}
        </main>
      </div>

      {/* ── 3. MODERATION DRAWER ── */}
      {activeReportGroup && (
        <ModerationDrawer
          activeReportGroup={activeReportGroup}
          selectedReportInDrawer={selectedReportInDrawer}
          setSelectedReportIdInDrawer={setSelectedReportIdInDrawer}
          drawerDecisionTab={drawerDecisionTab}
          setDrawerDecisionTab={setDrawerDecisionTab}
          drawerActionTaken={drawerActionTaken}
          setDrawerActionTaken={setDrawerActionTaken}
          drawerResolutionNote={drawerResolutionNote}
          setDrawerResolutionNote={setDrawerResolutionNote}
          drawerDismissReason={drawerDismissReason}
          setDrawerDismissReason={setDrawerDismissReason}
          drawerAutoCloseDuplicates={drawerAutoCloseDuplicates}
          setDrawerAutoCloseDuplicates={setDrawerAutoCloseDuplicates}
          drawerNotifyReporter={drawerNotifyReporter}
          setDrawerNotifyReporter={setDrawerNotifyReporter}
          handleAssignToMe={handleAssignToMe}
          onClose={() => setActiveReportGroupKey(null)}
          onSubmitResolution={handleSubmitModerationResolution}
          onNavigateToPlace={handleNavigateToPlaceContext}
          showToast={showToast}
        />
      )}

      {/* ── 4. ADD PLACE MODAL ── */}
      <AddPlaceModal
        isOpen={isAddPlaceModalOpen}
        onClose={() => setIsAddPlaceModalOpen(false)}
        form={newPlaceForm}
        setForm={setNewPlaceForm}
        onSubmit={handleCreateNewPlace}
      />

      {/* ── 5. EDIT PLACE MODAL ── */}
      <EditPlaceModal
        isOpen={isEditPlaceModalOpen}
        onClose={() => setIsEditPlaceModalOpen(false)}
        form={editPlaceForm}
        setForm={setEditPlaceForm}
        onSubmit={handleUpdatePlace}
      />
    </div>
  );
}
