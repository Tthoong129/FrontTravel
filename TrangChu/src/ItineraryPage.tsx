import { useState } from "react";
import {
  MapPin, Clock, Plus, ArrowLeft, Bookmark, CheckCircle2, ChevronRight, Search, Check, Trash2, Users, GripVertical, Calendar, Globe, Edit2, Star, ChevronDown, ChevronUp, Calculator, X, Compass, Sparkles
} from "lucide-react";
import {
  DetailedItineraryItem,
  ItineraryStop,
  TripRole,
  TripPrivacy,
  TransportType,
  places,
  Place,
  initialDetailedItineraries,
} from "./data";

export interface ItineraryPageProps {
  onBack?: () => void;
  onSelectPlace?: (place: Place) => void;
  initialViewMode?: "catalog" | "my_trips" | "planner";
}

export default function ItineraryPage({
  onBack,
  onSelectPlace,
  initialViewMode = "catalog",
}: ItineraryPageProps) {
  const [itineraries, setItineraries] = useState<DetailedItineraryItem[]>(
    initialDetailedItineraries
  );
  const [selectedItineraryId, setSelectedItineraryId] = useState<number | null>(
    1 // Đà Lạt 3N2Đ by default
  );
  const [viewMode, setViewMode] = useState<"catalog" | "my_trips" | "planner">(
    initialViewMode
  );

  // Catalog Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  const [selectedDuration, setSelectedDuration] = useState<string>("all");
  const [savedItineraryIds, setSavedItineraryIds] = useState<Set<number>>(
    new Set([1])
  );

  // Planner Mode State
  const [activeDayIndex, setActiveDayIndex] = useState(0);
  const [expandedDayIndices, setExpandedDayIndices] = useState<Set<number>>(
    new Set([0]) // Day 1 expanded by default
  );
  const [checkedStopIds, setCheckedStopIds] = useState<Set<string>>(new Set());
  const [currentUserRole, setCurrentUserRole] = useState<TripRole>("Owner");

  // Inline Price Editing State
  const [editingPriceStopId, setEditingPriceStopId] = useState<string | null>(null);
  const [tempPriceValue, setTempPriceValue] = useState<string>("");

  // Edit Stop Modal State
  const [editingStopData, setEditingStopData] = useState<{
    dayIndex: number;
    stop: ItineraryStop;
  } | null>(null);

  // Modals & Drawers
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isPlacePickerOpen, setIsPlacePickerOpen] = useState(false);
  const [placePickerTab, setPlacePickerTab] = useState<"library" | "custom">("library");
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);

  // Drag and Drop State
  const [draggedStopId, setDraggedStopId] = useState<string | null>(null);
  const [dragOverStopId, setDragOverStopId] = useState<string | null>(null);

  // Form: Create Trip
  const [newTripTitle, setNewTripTitle] = useState("");
  const [newTripProvince, setNewTripProvince] = useState("Đà Lạt, Lâm Đồng");
  const [newTripDays, setNewTripDays] = useState(3);
  const [newTripStartDate, setNewTripStartDate] = useState("2026-10-15");
  const [newTripPrivacy, setNewTripPrivacy] = useState<TripPrivacy>(0);
  const [newTripBudget, setNewTripBudget] = useState("1850000");

  // Form: Custom Stop in Picker
  const [stopStartTime, setStopStartTime] = useState("08:00");
  const [stopEndTime, setStopEndTime] = useState("09:30");
  const [stopName, setStopName] = useState("");
  const [stopCategory, setStopCategory] = useState("Tham quan");
  const [stopAddress, setStopAddress] = useState("");
  const [stopCost, setStopCost] = useState("50000");
  const [stopTransport, setStopTransport] = useState<TransportType>("Xe máy");
  const [stopNote, setStopNote] = useState("");

  // Search Places Drawer state
  const [placeSearchQuery, setPlaceSearchQuery] = useState("");
  const [placeCategoryFilter, setPlaceCategoryFilter] = useState("Tất cả");

  // Invite Friend Form
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<TripRole>("Editor");

  // Toast
  const [toastMessage, setToastMessage] = useState("");
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 2500);
  };

  const selectedItinerary =
    itineraries.find((i) => i.id === selectedItineraryId) || itineraries[0];

  // Filtered Itineraries in Catalog
  const filteredItineraries = itineraries.filter((it) => {
    const q = searchQuery.toLowerCase().trim();
    const matchQuery =
      !q ||
      it.title.toLowerCase().includes(q) ||
      it.province.toLowerCase().includes(q) ||
      it.description.toLowerCase().includes(q) ||
      it.tags.some((t) => t.toLowerCase().includes(q));

    const matchRegion =
      selectedRegion === "all" || it.region === selectedRegion;

    const matchDuration =
      selectedDuration === "all"
        ? true
        : selectedDuration === "1"
        ? it.durationDays === 1
        : selectedDuration === "2"
        ? it.durationDays === 2
        : selectedDuration === "3"
        ? it.durationDays === 3
        : selectedDuration === "4"
        ? it.durationDays === 4
        : it.durationDays >= 5;

    return matchQuery && matchRegion && matchDuration;
  });

  const toggleSave = (id: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSavedItineraryIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        showToast("Đã bỏ lưu lịch trình.");
      } else {
        next.add(id);
        showToast("Đã lưu lịch trình.");
      }
      return next;
    });
  };

  const handleDeleteItinerary = (id: number, title: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setItineraries((prev) => prev.filter((it) => it.id !== id));
    showToast(`Đã xóa chuyến đi "${title}".`);
  };

  const handleOpenPlanner = (itinerary: DetailedItineraryItem) => {
    setSelectedItineraryId(itinerary.id);
    const foundMember = itinerary.members?.find((m) => m.id === 1);
    setCurrentUserRole(foundMember?.role || "Owner");
    setExpandedDayIndices(new Set([0]));
    setViewMode("planner");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleDay = (index: number) => {
    setActiveDayIndex(index);
    setExpandedDayIndices((previous) => {
      const next = new Set(previous);
      next.has(index) ? next.delete(index) : next.add(index);
      return next;
    });
  };

  const toggleAllDays = () => {
    if (!selectedItinerary) return;
    setExpandedDayIndices((previous) =>
      previous.size === selectedItinerary.days.length
        ? new Set()
        : new Set(selectedItinerary.days.map((_, index) => index))
    );
  };

  const handleToggleCheckStop = (stopId: string) => {
    setCheckedStopIds((prev) => {
      const next = new Set(prev);
      if (next.has(stopId)) {
        next.delete(stopId);
        showToast("Đã bỏ đánh dấu hoàn thành.");
      } else {
        next.add(stopId);
        showToast("Đã hoàn thành điểm đến!");
      }
      return next;
    });
  };

  const parseTimeToMinutes = (timeStr: string) => {
    if (!timeStr) return 0;
    const [h, m] = timeStr.split(":").map(Number);
    return (h || 0) * 60 + (m || 0);
  };

  // INLINE PRICE EDITING HANDLERS
  const handleStartEditPrice = (stopId: string, currentPrice: number = 0) => {
    if (currentUserRole === "Viewer") {
      showToast("Bạn chỉ có quyền xem (Viewer).");
      return;
    }
    setEditingPriceStopId(stopId);
    setTempPriceValue(String(currentPrice || 0));
  };

  const handleSaveStopPrice = (dayIdx: number, stopId: string) => {
    const newPrice = Math.max(0, parseInt(tempPriceValue, 10) || 0);
    setItineraries((prev) =>
      prev.map((it) => {
        if (it.id === selectedItinerary.id) {
          const updatedDays = it.days.map((day, dIdx) => {
            if (dIdx === dayIdx) {
              const updatedStops = day.stops.map((s) => {
                if (s.id === stopId) {
                  return { ...s, costEstimate: newPrice };
                }
                return s;
              });
              return { ...day, stops: updatedStops };
            }
            return day;
          });

          const newTotal = updatedDays.reduce(
            (sum, d) => sum + d.stops.reduce((sSum, s) => sSum + (s.costEstimate || 0), 0),
            0
          );
          return { ...it, days: updatedDays, estimatedBudget: newTotal };
        }
        return it;
      })
    );
    setEditingPriceStopId(null);
    showToast("Đã cập nhật giá điểm đến thành công!");
  };

  // EDIT FULL STOP MODAL HANDLERS
  const handleOpenEditStopModal = (dayIndex: number, stop: ItineraryStop) => {
    if (currentUserRole === "Viewer") {
      showToast("Bạn chỉ có quyền xem (Viewer).");
      return;
    }
    setEditingStopData({ dayIndex, stop: { ...stop } });
  };

  const handleSaveEditedStop = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStopData) return;

    const { dayIndex, stop } = editingStopData;
    setItineraries((prev) =>
      prev.map((it) => {
        if (it.id === selectedItinerary.id) {
          const updatedDays = it.days.map((day, dIdx) => {
            if (dIdx === dayIndex) {
              const updatedStops = day.stops.map((s) => (s.id === stop.id ? stop : s));
              return { ...day, stops: updatedStops };
            }
            return day;
          });

          const newTotal = updatedDays.reduce(
            (sum, d) => sum + d.stops.reduce((sSum, s) => sSum + (s.costEstimate || 0), 0),
            0
          );
          return { ...it, days: updatedDays, estimatedBudget: newTotal };
        }
        return it;
      })
    );

    setEditingStopData(null);
    showToast(`Đã cập nhật thông tin "${stop.name}"!`);
  };

  const handleDragStart = (e: React.DragEvent, stopId: string) => {
    if (currentUserRole === "Viewer") return;
    setDraggedStopId(stopId);
    e.dataTransfer.setData("text/plain", stopId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, stopId: string) => {
    if (currentUserRole === "Viewer") return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragOverStopId !== stopId) {
      setDragOverStopId(stopId);
    }
  };

  const handleDropOnStop = (e: React.DragEvent, targetStopId: string) => {
    e.preventDefault();
    setDragOverStopId(null);
    if (!draggedStopId || draggedStopId === targetStopId || currentUserRole === "Viewer") {
      setDraggedStopId(null);
      return;
    }

    setItineraries((prev) =>
      prev.map((it) => {
        if (it.id === selectedItinerary.id) {
          const updatedDays = it.days.map((day, dIdx) => {
            if (dIdx === activeDayIndex) {
              const stops = [...day.stops];
              const fromIndex = stops.findIndex((s) => s.id === draggedStopId);
              const toIndex = stops.findIndex((s) => s.id === targetStopId);
              if (fromIndex !== -1 && toIndex !== -1) {
                const [moved] = stops.splice(fromIndex, 1);
                stops.splice(toIndex, 0, moved);
                const reordered = stops.map((s, idx) => ({
                  ...s,
                  visitOrder: idx + 1,
                }));
                return { ...day, stops: reordered };
              }
            }
            return day;
          });
          return { ...it, days: updatedDays };
        }
        return it;
      })
    );

    setDraggedStopId(null);
    showToast("Đã đổi thứ tự điểm đến.");
  };

  const handleCreateTripSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTripTitle.trim()) return;

    const daysCount = Math.max(1, newTripDays);
    const generatedDays = Array.from({ length: daysCount }).map((_, idx) => ({
      dayNumber: idx + 1,
      title: idx === 0 ? "Khởi hành & Chạm ngõ Cao nguyên" : `Ngày ${idx + 1}: Tiếp tục hành trình`,
      description: "Lịch trình trải nghiệm trong ngày",
      stops: [],
    }));

    const newTrip: DetailedItineraryItem = {
      id: Date.now(),
      title: newTripTitle.trim(),
      province: newTripProvince,
      region: "Khác",
      durationDays: daysCount,
      nightsCount: Math.max(1, daysCount - 1),
      estimatedBudget: parseInt(newTripBudget, 10) || 1850000,
      privacy: newTripPrivacy,
      coverImg:
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=500&fit=crop",
      authorName: "Bạn",
      authorAvatar:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&h=120&fit=crop",
      authorRank: "Lữ khách",
      rating: 5.0,
      reviewCount: 1,
      tags: ["Tự thiết kế"],
      description: `Lịch trình du lịch tự túc ${daysCount} ngày tại ${newTripProvince}.`,
      startDate: newTripStartDate,
      days: generatedDays,
      members: [
        {
          id: 1,
          name: "Bạn",
          avatar:
            "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&h=120&fit=crop",
          role: "Owner",
          email: "user@example.com",
        },
      ],
    };

    setItineraries([newTrip, ...itineraries]);
    setIsCreateModalOpen(false);
    setNewTripTitle("");
    handleOpenPlanner(newTrip);
    showToast(`Đã tạo chuyến đi "${newTrip.title}"!`);
  };

  const handleAddNewDay = () => {
    if (currentUserRole === "Viewer") {
      showToast("Bạn chỉ có quyền xem (Viewer).");
      return;
    }
    setItineraries((prev) =>
      prev.map((it) => {
        if (it.id === selectedItinerary.id) {
          const nextDayNum = it.days.length + 1;
          const newDay = {
            dayNumber: nextDayNum,
            title: `Ngày ${nextDayNum}: Tiếp tục hành trình`,
            description: "Chặng khám phá mới",
            stops: [],
          };
          return {
            ...it,
            durationDays: nextDayNum,
            nightsCount: nextDayNum - 1,
            days: [...it.days, newDay],
          };
        }
        return it;
      })
    );
    const newIdx = selectedItinerary.days.length;
    setActiveDayIndex(newIdx);
    setExpandedDayIndices((prev) => new Set([...prev, newIdx]));
    showToast("Đã thêm Ngày " + (newIdx + 1));
  };

  const handleDeleteDay = (dayIdx: number) => {
    if (currentUserRole !== "Owner") {
      showToast("Chỉ Owner mới có quyền xóa ngày.");
      return;
    }
    if (selectedItinerary.days.length <= 1) {
      showToast("Chuyến đi cần tối thiểu 1 ngày.");
      return;
    }

    setItineraries((prev) =>
      prev.map((it) => {
        if (it.id === selectedItinerary.id) {
          const filtered = it.days.filter((_, idx) => idx !== dayIdx);
          const renumbered = filtered.map((d, idx) => ({
            ...d,
            dayNumber: idx + 1,
          }));
          return {
            ...it,
            durationDays: renumbered.length,
            nightsCount: Math.max(1, renumbered.length - 1),
            days: renumbered,
          };
        }
        return it;
      })
    );
    setActiveDayIndex(Math.max(0, dayIdx - 1));
    showToast("Đã xóa ngày khỏi lịch trình.");
  };

  const handleAddPlaceToActiveDay = (place: Place) => {
    if (currentUserRole === "Viewer") {
      showToast("Bạn chỉ có quyền xem (Viewer).");
      return;
    }

    const currentDay = selectedItinerary.days[activeDayIndex] || selectedItinerary.days[0];
    const currentStops = currentDay?.stops || [];
    const lastStop = currentStops[currentStops.length - 1];
    let nextStart = "09:00";
    let nextEnd = "10:30";

    if (lastStop && lastStop.endTime) {
      const endMin = parseTimeToMinutes(lastStop.endTime) + 30;
      const startH = String(Math.floor(endMin / 60)).padStart(2, "0");
      const startM = String(endMin % 60).padStart(2, "0");
      const durEndMin = endMin + 90;
      const endH = String(Math.floor(durEndMin / 60)).padStart(2, "0");
      const endM = String(durEndMin % 60).padStart(2, "0");
      nextStart = `${startH}:${startM}`;
      nextEnd = `${endH}:${endM}`;
    }

    const newStop: ItineraryStop = {
      id: `place-${place.id}-${Date.now()}`,
      time: nextStart,
      startTime: nextStart,
      endTime: nextEnd,
      name: place.name,
      category: place.category || "Tham quan",
      address: place.location,
      note: place.desc || "Trải nghiệm điểm đến",
      costEstimate: place.priceMax || 50000,
      duration: "1.5 giờ",
      transportMode: "Xe máy",
      visitOrder: currentStops.length + 1,
      img: place.img || place.image,
      lat: place.lat,
      lng: place.lng,
      rating: place.rating,
    };

    setItineraries((prev) =>
      prev.map((it) => {
        if (it.id === selectedItinerary.id) {
          const updatedDays = it.days.map((day, dIdx) => {
            if (dIdx === activeDayIndex) {
              return {
                ...day,
                stops: [...day.stops, newStop],
              };
            }
            return day;
          });
          const newTotal = updatedDays.reduce(
            (sum, d) => sum + d.stops.reduce((sSum, s) => sSum + (s.costEstimate || 0), 0),
            0
          );
          return { ...it, days: updatedDays, estimatedBudget: newTotal };
        }
        return it;
      })
    );

    setIsPlacePickerOpen(false);
    showToast(`Đã thêm "${place.name}" vào Ngày ${activeDayIndex + 1}`);
  };

  const handleAddCustomStopSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!stopName.trim() || currentUserRole === "Viewer") return;

    const currentDay = selectedItinerary.days[activeDayIndex] || selectedItinerary.days[0];
    const currentStops = currentDay?.stops || [];
    const newStop: ItineraryStop = {
      id: `custom-${Date.now()}`,
      time: stopStartTime,
      startTime: stopStartTime,
      endTime: stopEndTime,
      name: stopName.trim(),
      category: stopCategory,
      address: stopAddress.trim() || undefined,
      note: stopNote.trim() || "Điểm dừng tự chọn",
      costEstimate: parseInt(stopCost, 10) || 0,
      duration: "1.5 giờ",
      transportMode: stopTransport,
      visitOrder: currentStops.length + 1,
      img: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&h=300&fit=crop",
    };

    setItineraries((prev) =>
      prev.map((it) => {
        if (it.id === selectedItinerary.id) {
          const updatedDays = it.days.map((day, dIdx) => {
            if (dIdx === activeDayIndex) {
              return {
                ...day,
                stops: [...day.stops, newStop],
              };
            }
            return day;
          });
          const newTotal = updatedDays.reduce(
            (sum, d) => sum + d.stops.reduce((sSum, s) => sSum + (s.costEstimate || 0), 0),
            0
          );
          return { ...it, days: updatedDays, estimatedBudget: newTotal };
        }
        return it;
      })
    );

    setIsPlacePickerOpen(false);
    setStopName("");
    setStopAddress("");
    setStopNote("");
    showToast(`Đã thêm "${newStop.name}" vào Ngày ${activeDayIndex + 1}`);
  };

  const handleDeleteStop = (stopId: string, stopTitle: string) => {
    if (currentUserRole === "Viewer") {
      showToast("Bạn chỉ có quyền xem (Viewer).");
      return;
    }
    setItineraries((prev) =>
      prev.map((it) => {
        if (it.id === selectedItinerary.id) {
          const updatedDays = it.days.map((day, dIdx) => {
            if (dIdx === activeDayIndex) {
              const remaining = day.stops
                .filter((s) => s.id !== stopId)
                .map((s, idx) => ({ ...s, visitOrder: idx + 1 }));
              return { ...day, stops: remaining };
            }
            return day;
          });
          const newTotal = updatedDays.reduce(
            (sum, d) => sum + d.stops.reduce((sSum, s) => sSum + (s.costEstimate || 0), 0),
            0
          );
          return { ...it, days: updatedDays, estimatedBudget: newTotal };
        }
        return it;
      })
    );
    showToast(`Đã xóa "${stopTitle}".`);
  };

  const handleInviteMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim() || currentUserRole !== "Owner") return;

    const newMember = {
      id: Date.now(),
      name: inviteEmail.split("@")[0] || "Thành viên",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop",
      role: inviteRole,
      email: inviteEmail.trim(),
    };

    setItineraries((prev) =>
      prev.map((it) => {
        if (it.id === selectedItinerary.id) {
          return {
            ...it,
            members: [...(it.members || []), newMember],
          };
        }
        return it;
      })
    );

    setInviteEmail("");
    showToast(`Đã gửi lời mời tới ${inviteEmail}!`);
  };

  const handleRemoveMember = (memberId: number) => {
    if (currentUserRole !== "Owner") {
      showToast("Chỉ Owner mới có quyền xóa thành viên.");
      return;
    }
    setItineraries((prev) =>
      prev.map((it) => {
        if (it.id === selectedItinerary.id) {
          return {
            ...it,
            members: it.members.filter((m) => m.id !== memberId),
          };
        }
        return it;
      })
    );
    showToast("Đã xóa thành viên.");
  };

  const handleViewPlaceDetails = (stop: ItineraryStop) => {
    if (!onSelectPlace) return;
    const cleanStopName = stop.name.trim().toLowerCase();
    const matched = places.find(
      (p) =>
        p.name.trim().toLowerCase() === cleanStopName ||
        (stop.id && stop.id.includes(`place-${p.id}-`))
    );
    if (matched) {
      onSelectPlace(matched);
    } else {
      const fallbackPlace: Place = {
        id: Date.now(),
        name: stop.name,
        location: stop.address || selectedItinerary.province || "Việt Nam",
        category: stop.category || "Tham quan",
        rating: stop.rating || 4.8,
        reviews: 128,
        price: stop.costEstimate ? `${stop.costEstimate.toLocaleString("vi-VN")} VNĐ` : "Miễn phí",
        image: stop.img || "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&h=400&fit=crop",
        desc: stop.note || `Điểm dừng chân trong hành trình khám phá ${selectedItinerary.province}.`,
        province: selectedItinerary.province || "Việt Nam",
      };
      onSelectPlace(fallbackPlace);
    }
  };

  const getDayDateString = (dayIndex: number = 0) => {
    const dates = ["2026-10-15", "2026-10-16", "2026-10-17", "2026-10-18"];
    if (dayIndex < dates.length) return dates[dayIndex];
    return `2026-10-${15 + dayIndex}`;
  };

  const getTransitDuration = (sIdx: number) => {
    const defaultDurations = ["15 phút", "20 phút", "15 phút", "10 phút", "15 phút"];
    return defaultDurations[sIdx % defaultDurations.length];
  };

  const getDayTotalCost = (day: any) => {
    return day.stops.reduce((sum: number, s: any) => sum + (s.costEstimate || 0), 0);
  };

  const grandTotalCost = selectedItinerary?.days.reduce(
    (daySum, day) => daySum + day.stops.reduce((sSum, s) => sSum + (s.costEstimate || 0), 0),
    0
  ) || 0;

  const filteredPlacesForPicker = places.filter((p) => {
    const q = placeSearchQuery.toLowerCase().trim();
    const matchQ =
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.location.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q);
    const matchC =
      placeCategoryFilter === "Tất cả" || p.category.includes(placeCategoryFilter);
    return matchQ && matchC;
  });

  const getCategoryTextColor = (category?: string) => {
    const cat = (category || "").toLowerCase();
    if (cat.includes("ăn sáng") || cat.includes("ăn trưa") || cat.includes("ẩm thực") || cat.includes("ăn tối")) {
      return "text-amber-600";
    }
    if (cat.includes("cà phê") || cat.includes("cafe")) {
      return "text-purple-600";
    }
    if (cat.includes("tham quan") || cat.includes("di tích")) {
      return "text-blue-600";
    }
    if (cat.includes("check-in") || cat.includes("dạo chơi")) {
      return "text-teal-600";
    }
    return "text-gray-600";
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-gray-900 font-sans antialiased pb-24 selection:bg-blue-100">
      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-gray-900/95 backdrop-blur-xs text-white px-4 py-2.5 rounded-lg shadow-xl flex items-center gap-2.5 text-xs font-medium">
          <CheckCircle2 size={16} className="text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* PAGE 1: CATALOG (EXPLORE ITINERARIES) */}
      {viewMode === "catalog" && (
        <div className="pb-24">
          {/* Sub Navigation Bar */}
          <div className="bg-white border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
              <div className="flex items-center gap-6">
                <button
                  onClick={() => setViewMode("catalog")}
                  className="text-xs sm:text-sm font-bold text-emerald-900 border-b-2 border-emerald-800 py-3.5 transition-colors cursor-pointer"
                >
                  Khám phá lịch trình
                </button>
                <button
                  onClick={() => setViewMode("my_trips")}
                  className="text-xs sm:text-sm font-semibold text-slate-500 hover:text-slate-900 py-3.5 transition-colors cursor-pointer"
                >
                  Chuyến đi của tôi ({itineraries.length})
                </button>
              </div>

              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="px-3.5 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <Plus size={14} strokeWidth={2.5} /> Tạo chuyến đi
              </button>
            </div>
          </div>

          {/* Hero Banner with Background Image & Punchy Text */}
          <div className="relative overflow-hidden bg-gradient-to-r from-emerald-950 via-[#064E3B] to-slate-950 text-white pt-14 pb-20 px-4 sm:px-6 text-center">
            {/* Background Image with Overlay */}
            <img
              src="https://images.unsplash.com/photo-1528127269322-539801943592?w=1800&h=700&fit=crop&auto=format"
              alt="Vietnam Travel Itinerary"
              className="absolute inset-0 w-full h-full object-cover opacity-25 scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-emerald-950/65 to-emerald-950/75"></div>

            <div className="relative z-10 max-w-4xl mx-auto space-y-3.5">
              {/* Badge */}
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[11px] sm:text-xs font-semibold backdrop-blur-md">
                <Compass size={13} className="text-emerald-400" />
                <span>KẾ HOẠCH DU LỊCH TỰ TÚC</span>
              </div>

              {/* Shorter, Clean Title */}
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight font-serif-title">
                Lịch Trình Khám Phá Việt Nam
              </h1>

              {/* Concise Subtitle (Less text, cleaner, modern) */}
              <p className="text-xs sm:text-sm text-slate-200 max-w-xl mx-auto font-normal leading-relaxed">
                Lộ trình tối ưu thời gian & chi phí, đầy đủ điểm ăn chơi và mẹo hữu ích cho từng ngày.
              </p>

              {/* Search Bar */}
              <div className="pt-3 max-w-2xl mx-auto">
                <div className="bg-white rounded-2xl p-2 sm:p-2.5 shadow-2xl flex items-center gap-2 border border-slate-200">
                  <Search className="ml-2 text-slate-400 flex-shrink-0" size={18} />
                  <input
                    type="text"
                    placeholder="Tìm lịch trình theo điểm đến (ví dụ: Đà Nẵng, Sa Pa, Phú Quốc)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full text-slate-800 text-xs sm:text-sm outline-none px-2 py-1 placeholder:text-slate-400"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="text-xs text-slate-400 hover:text-slate-600 px-2 cursor-pointer"
                    >
                      Xóa
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Overlapping Filter Bar */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-8 relative z-10 mb-10">
            <div className="bg-white rounded-2xl p-3 sm:p-4 shadow-lg border border-slate-200 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
              {/* Duration Filter Pills (Matches user screenshot) */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 lg:pb-0">
                {[
                  { label: "Tất cả thời lượng", val: "all" },
                  { label: "Trong ngày (1N)", val: "1" },
                  { label: "Cuối tuần (2N1Đ)", val: "2" },
                  { label: "3 Ngày 2 Đêm", val: "3" },
                  { label: "4 Ngày 3 Đêm", val: "4" },
                  { label: "5 Ngày trở lên", val: "5+" },
                ].map((item) => (
                  <button
                    key={item.val}
                    onClick={() => setSelectedDuration(item.val)}
                    className={`text-xs font-semibold px-3.5 py-2 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                      selectedDuration === item.val
                        ? "bg-emerald-800 text-white font-bold shadow-xs"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {/* Region Filter Pills */}
              <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl flex-shrink-0 self-start lg:self-center">
                {[
                  { label: "Tất cả miền", val: "all" },
                  { label: "Miền Bắc", val: "Bắc" },
                  { label: "Miền Trung", val: "Trung" },
                  { label: "Miền Nam", val: "Nam" },
                ].map((item) => (
                  <button
                    key={item.val}
                    onClick={() => setSelectedRegion(item.val)}
                    className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                      selectedRegion === item.val
                        ? "bg-white text-emerald-900 font-bold shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItineraries.map((it) => {
              const isSaved = savedItineraryIds.has(it.id);
              return (
                <article
                  key={it.id}
                  onClick={() => handleOpenPlanner(it)}
                  className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-xs hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col group hover:-translate-y-1"
                >
                  <div className="relative h-48 bg-gray-100 overflow-hidden">
                    <img
                      src={it.coverImg}
                      alt={it.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-3 left-3 bg-white/95 text-gray-900 text-xs font-semibold px-2.5 py-1 rounded-lg shadow-xs flex items-center gap-1">
                      <MapPin size={11} className="text-gray-500" /> {it.province}
                    </span>
                    <span className="absolute top-3 right-3 bg-gray-900/80 text-white text-xs font-medium px-2 py-0.5 rounded-md">
                      {it.durationDays}N{it.nightsCount}Đ
                    </span>
                    <button
                      onClick={(e) => toggleSave(it.id, e)}
                      className={`absolute bottom-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                        isSaved ? "bg-gray-900 text-white shadow-xs" : "bg-white/90 text-gray-700 hover:bg-white"
                      }`}
                    >
                      <Bookmark size={14} className={isSaved ? "fill-current" : ""} />
                    </button>
                  </div>

                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="text-base font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                      {it.title}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1.5 line-clamp-2 leading-relaxed">
                      {it.description}
                    </p>

                    <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between mt-auto">
                      <div className="flex items-center gap-2">
                        <img src={it.authorAvatar} alt="" className="w-6 h-6 rounded-full object-cover border border-gray-200" />
                        <span className="text-xs text-gray-600 font-medium">{it.authorName}</span>
                      </div>
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-100">
                        ~{it.estimatedBudget ? it.estimatedBudget.toLocaleString("vi-VN") : "1.850.000"}đ
                      </span>
                    </div>
                  </div>
                </article>
              );
            })}
            </div>
          </div>
        </div>
      )}

      {/* PAGE 2: MY TRIPS */}
      {viewMode === "my_trips" && (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 pb-16">
          <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-8">
            <div className="flex items-center gap-8">
              <button
                onClick={() => setViewMode("catalog")}
                className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors cursor-pointer"
              >
                Khám phá lịch trình
              </button>
              <button
                onClick={() => setViewMode("my_trips")}
                className="text-sm font-semibold text-gray-900 pb-2 relative after:absolute after:bottom-[-17px] after:left-0 after:right-0 after:h-0.5 after:bg-gray-900 cursor-pointer"
              >
                Chuyến đi của tôi ({itineraries.length})
              </button>
            </div>

            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-3.5 py-1.5 bg-gray-900 hover:bg-gray-800 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Plus size={14} /> Tạo chuyến đi mới
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {itineraries.map((it) => (
              <article
                key={it.id}
                onClick={() => handleOpenPlanner(it)}
                className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-xs hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col group"
              >
                <div className="relative h-48 bg-gray-100 overflow-hidden">
                  <img
                    src={it.coverImg}
                    alt={it.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 bg-white/95 text-gray-900 text-xs font-semibold px-2.5 py-1 rounded-lg shadow-xs">
                    {it.province}
                  </span>
                  <span className="absolute top-3 right-3 bg-gray-900/80 text-white text-xs font-medium px-2 py-0.5 rounded-md">
                    {it.durationDays}N{it.nightsCount}Đ
                  </span>
                </div>

                <div className="p-5 flex flex-col flex-1">
                  <h3 className="text-base font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                    {it.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1.5 line-clamp-2 leading-relaxed">
                    {it.description}
                  </p>

                  <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between mt-auto">
                    <button className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1 cursor-pointer">
                      <Edit2 size={12} /> Chỉnh sửa
                    </button>
                    <button
                      onClick={(e) => handleDeleteItinerary(it.id, it.title, e)}
                      className="text-xs text-gray-400 hover:text-red-600 flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 size={12} /> Xóa
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}

      {/* PAGE 3: PLANNER MODE (EXACT LAYOUT AS USER SCREENSHOT) */}
      {viewMode === "planner" && selectedItinerary && (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-6 pb-24">
          {/* Back Navigation Link */}
          <div className="mb-4">
            <button
              onClick={() => setViewMode("my_trips")}
              className="text-xs text-gray-500 hover:text-gray-900 flex items-center gap-1.5 cursor-pointer font-medium transition-colors"
            >
              <ArrowLeft size={14} /> Quay lại danh sách chuyến đi
            </button>
          </div>

          {/* TRIP HEADER CARD */}
          <div className="bg-white border border-gray-200/90 rounded-2xl p-6 sm:p-7 mb-6 shadow-xs">
            {/* Top Row: Title + Members */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex-1">
                <h1 className="text-2xl sm:text-[25px] font-bold text-gray-900 tracking-tight leading-snug">
                  {selectedItinerary.title}
                </h1>
                <p className="text-[13px] text-gray-600 mt-2 leading-relaxed">
                  {selectedItinerary.description}
                </p>
              </div>

              {/* Right: Collaborator Avatars & Invite Button */}
              <div className="flex items-center gap-2 flex-shrink-0 self-start sm:self-auto">
                <div className="flex -space-x-1.5 overflow-hidden">
                  {selectedItinerary.members?.map((m) => (
                    <img
                      key={m.id}
                      src={m.avatar}
                      alt={m.name}
                      title={`${m.name} (${m.role})`}
                      className="w-7 h-7 rounded-full object-cover border-2 border-white shadow-xs"
                    />
                  ))}
                </div>
                <button
                  onClick={() => setIsMemberModalOpen(true)}
                  className="flex items-center gap-1 text-xs text-gray-700 hover:text-gray-900 border border-gray-200 hover:bg-gray-50 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer font-medium shadow-2xs"
                >
                  <Plus size={12} /> Mời bạn
                </button>
              </div>
            </div>

            {/* Bottom: Metadata Badges */}
            <div className="flex items-center gap-2.5 mt-5 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100/90 text-gray-700 rounded-full text-xs font-medium">
                <Calendar size={13} className="text-gray-400" />
                15/10/2026 - 17/10/2026
              </span>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100/90 text-gray-700 rounded-full text-xs font-medium">
                <Globe size={13} className="text-gray-400" />
                {selectedItinerary.privacy === 0 ? "Công khai" : "Riêng tư"}
              </span>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200/80 rounded-full text-xs font-medium">
                <Calculator size={13} className="text-emerald-500" />
                Ngân sách dự kiến: ~{(grandTotalCost > 0 ? grandTotalCost : selectedItinerary.estimatedBudget || 1850000).toLocaleString("vi-VN")}đ/người
              </span>
            </div>
          </div>

          {/* Toggle All Days Button */}
          <div className="flex justify-end mb-3">
            <button
              onClick={toggleAllDays}
              className="text-xs text-gray-500 hover:text-gray-800 flex items-center gap-1 cursor-pointer font-medium transition-colors"
            >
              {expandedDayIndices.size === selectedItinerary.days.length ? "Thu gọn tất cả" : "Mở rộng tất cả"}
              {expandedDayIndices.size === selectedItinerary.days.length ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
          </div>

          {/* DAYS LIST */}
          <div className="space-y-3">
            {selectedItinerary.days.map((day, dIdx) => {
              const isExpanded = expandedDayIndices.has(dIdx);
              const dayDateStr = getDayDateString(dIdx);
              const dayCost = getDayTotalCost(day);

              // COLLAPSED DAY CARD
              if (!isExpanded) {
                return (
                  <div
                    key={day.dayNumber}
                    onClick={() => toggleDay(dIdx)}
                    className="bg-white border border-gray-200/90 rounded-2xl shadow-xs overflow-hidden p-4 sm:px-5 flex items-center justify-between cursor-pointer hover:bg-gray-50/70 transition-colors"
                  >
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="text-gray-400">
                        <ChevronRight size={16} />
                      </span>
                      <span className="bg-gray-100 text-gray-700 font-bold text-[11px] px-2 py-0.5 rounded-[4px]">
                        Ngày {day.dayNumber}
                      </span>
                      <span className="font-bold text-gray-900 text-[15px]">
                        {day.title}
                      </span>
                      <span className="text-xs text-gray-400 font-normal">
                        • {day.stops.length} điểm dừng • {dayCost.toLocaleString("vi-VN")}đ
                      </span>
                    </div>

                    <span className="text-xs text-gray-400 font-mono flex-shrink-0 ml-3">
                      {dayDateStr}
                    </span>
                  </div>
                );
              }

              // EXPANDED DAY CARD
              return (
                <div
                  key={day.dayNumber}
                  className="bg-white border border-gray-200/90 rounded-2xl shadow-xs overflow-hidden mb-4"
                >
                  {/* Day Header */}
                  <div
                    onClick={() => toggleDay(dIdx)}
                    className="p-4 sm:px-5 flex items-center justify-between cursor-pointer hover:bg-gray-50/70 transition-colors border-b border-gray-100"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-gray-400">
                        <ChevronUp size={16} />
                      </span>
                      <span className="bg-blue-600 text-white font-bold text-[11px] px-2 py-0.5 rounded-[4px] tracking-wide">
                        Ngày {day.dayNumber}
                      </span>
                      <span className="font-bold text-gray-900 text-[15px]">
                        {day.title}
                      </span>
                    </div>

                    <span className="text-xs text-gray-400 font-mono">
                      {dayDateStr}
                    </span>
                  </div>

                  {/* Stops List inside Day */}
                  <div className="p-4 sm:p-5 bg-gray-50/20 space-y-3">
                    {day.stops.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-xs text-gray-500 font-normal">Chưa có điểm dừng nào cho Ngày {day.dayNumber}.</p>
                      </div>
                    ) : (
                      day.stops.map((stop, sIdx) => {
                        const isChecked = checkedStopIds.has(stop.id);
                        const isEditingThisPrice = editingPriceStopId === stop.id;

                        return (
                          <div key={stop.id} className="relative">
                            {/* Stop Card */}
                            <div className="bg-white border border-gray-200/90 rounded-2xl p-4 sm:p-5 shadow-2xs hover:border-gray-300 transition-colors">
                              <div className="flex items-start gap-4">
                                {/* Grip Drag Handle */}
                                {currentUserRole !== "Viewer" && (
                                  <div
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, stop.id)}
                                    onDragOver={(e) => handleDragOver(e, stop.id)}
                                    onDrop={(e) => handleDropOnStop(e, stop.id)}
                                    className="mt-6 text-gray-300 hover:text-gray-500 cursor-grab active:cursor-grabbing flex-shrink-0"
                                  >
                                    <GripVertical size={14} />
                                  </div>
                                )}

                                {/* Thumbnail Image */}
                                <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-100">
                                  <img
                                    src={stop.img || "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=300&h=200&fit=crop"}
                                    alt={stop.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>

                                {/* Info Column */}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between gap-2">
                                    <div>
                                      <h4 className={`text-[15px] font-bold ${isChecked ? "line-through text-gray-400" : "text-gray-900"}`}>
                                        {stop.name}
                                      </h4>
                                      <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                                        <span className={`text-xs font-semibold ${getCategoryTextColor(stop.category)}`}>
                                          {stop.category}
                                        </span>
                                        <span className="text-xs text-gray-400 line-clamp-1 font-normal">
                                          {stop.address || stop.name}
                                        </span>
                                      </div>
                                    </div>

                                    {/* Time & Price on top right (CLICKABLE TO EDIT INLINE!) */}
                                    <div className="text-right flex-shrink-0">
                                      <span className="text-xs font-bold text-gray-800 block">
                                        {stop.time || stop.startTime}
                                      </span>

                                      {/* INLINE EDITABLE PRICE */}
                                      {isEditingThisPrice ? (
                                        <div
                                          className="flex items-center justify-end gap-1 mt-0.5"
                                          onClick={(e) => e.stopPropagation()}
                                        >
                                          <input
                                            type="number"
                                            step={1000}
                                            min={0}
                                            autoFocus
                                            value={tempPriceValue}
                                            onChange={(e) => setTempPriceValue(e.target.value)}
                                            onKeyDown={(e) => {
                                              if (e.key === "Enter") handleSaveStopPrice(dIdx, stop.id);
                                              if (e.key === "Escape") setEditingPriceStopId(null);
                                            }}
                                            onBlur={() => handleSaveStopPrice(dIdx, stop.id)}
                                            className="w-24 px-1.5 py-0.5 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-400 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500 text-right shadow-2xs"
                                          />
                                          <span className="text-xs font-bold text-emerald-600">đ</span>
                                        </div>
                                      ) : (
                                        <div
                                          onClick={() => handleStartEditPrice(stop.id, stop.costEstimate || 0)}
                                          className="group/price cursor-pointer flex items-center justify-end gap-1 mt-0.5 hover:bg-emerald-50 px-1 py-0.5 rounded transition-all"
                                          title="Bấm vào để trực tiếp chỉnh sửa giá tiền địa điểm này"
                                        >
                                          <span className="text-xs sm:text-[13.5px] font-bold text-emerald-600">
                                            {stop.costEstimate && stop.costEstimate > 0
                                              ? `${stop.costEstimate.toLocaleString("vi-VN")}đ`
                                              : "Miễn phí"}
                                          </span>
                                          <Edit2 size={10} className="text-emerald-500 opacity-0 group-hover/price:opacity-100 transition-opacity" />
                                        </div>
                                      )}
                                    </div>
                                  </div>

                                  {/* Note Box */}
                                  {stop.note && (
                                    <div className="mt-2.5 px-3 py-2 bg-gray-50/90 rounded-lg text-xs text-gray-600 leading-relaxed border border-gray-100/80 font-normal">
                                      {stop.note}
                                    </div>
                                  )}

                                  {/* Bottom Actions Row */}
                                  <div className="mt-3 flex items-center justify-between pt-1">
                                    <div className="flex items-center gap-3">
                                      <button
                                        onClick={() => handleViewPlaceDetails(stop)}
                                        className="text-xs font-semibold text-blue-600 hover:underline cursor-pointer"
                                      >
                                        Xem chi tiết
                                      </button>
                                      <button
                                        onClick={() => handleOpenEditStopModal(dIdx, stop)}
                                        className="text-xs text-gray-400 hover:text-gray-700 flex items-center gap-1 cursor-pointer transition-colors"
                                        title="Chỉnh sửa chi tiết điểm dừng (tên, giờ, giá, ghi chú)"
                                      >
                                        <Edit2 size={11} /> Sửa
                                      </button>
                                    </div>

                                    <div className="flex items-center gap-3">
                                      <button
                                        onClick={() => handleToggleCheckStop(stop.id)}
                                        className={`p-1 rounded cursor-pointer transition-colors ${
                                          isChecked ? "text-emerald-600" : "text-gray-300 hover:text-gray-600"
                                        }`}
                                        title={isChecked ? "Bỏ hoàn thành" : "Đánh dấu đã đến"}
                                      >
                                        <Check size={14} className={isChecked ? "stroke-[3]" : ""} />
                                      </button>

                                      {currentUserRole !== "Viewer" && (
                                        <button
                                          onClick={() => handleDeleteStop(stop.id, stop.name)}
                                          className="p-1 text-gray-300 hover:text-red-500 rounded cursor-pointer transition-colors"
                                          title="Xóa điểm"
                                        >
                                          <Trash2 size={14} />
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Transit Connector between stops */}
                            {sIdx < day.stops.length - 1 && (
                              <div className="flex justify-center my-3">
                                <span className="bg-gray-100/90 text-gray-500 text-[11.5px] font-medium px-3.5 py-1 rounded-full border border-gray-200/60 inline-flex items-center gap-1.5 shadow-2xs">
                                  <Clock size={11} className="text-gray-400" />
                                  <span>{getTransitDuration(sIdx)} di chuyển ({stop.transportMode || "Xe máy"})</span>
                                </span>
                              </div>
                            )}
                          </div>
                        );
                      })
                    )}

                    {/* Add Stop Button for this Day */}
                    {currentUserRole !== "Viewer" && (
                      <div className="mt-4">
                        <button
                          onClick={() => {
                            setActiveDayIndex(dIdx);
                            setPlacePickerTab("library");
                            setIsPlacePickerOpen(true);
                          }}
                          className="w-full border border-dashed border-gray-300 rounded-xl p-3 text-center text-xs font-medium text-gray-500 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50/20 transition-all cursor-pointer"
                        >
                          + Thêm địa điểm vào <span className="text-blue-600 font-semibold">Ngày {day.dayNumber}</span> ...
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Add New Day Button */}
          {currentUserRole !== "Viewer" && (
            <div className="mt-4">
              <button
                onClick={handleAddNewDay}
                className="w-full border border-dashed border-gray-300 rounded-2xl p-3.5 text-center text-xs sm:text-sm font-medium text-gray-600 hover:border-gray-400 hover:bg-gray-50 transition-all cursor-pointer"
              >
                + Thêm ngày mới
              </button>
            </div>
          )}
        </div>
      )}

      {/* EDIT STOP MODAL (When clicking 'Sửa' on any stop) */}
      {editingStopData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg border border-gray-200 overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-gray-200 flex items-center justify-between bg-white">
              <h3 className="text-base font-bold text-gray-900">
                Chỉnh sửa điểm đến
              </h3>
              <button
                onClick={() => setEditingStopData(null)}
                className="p-1 text-gray-400 hover:text-gray-700 rounded cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveEditedStop} className="p-5 space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">Tên địa điểm *</label>
                <input
                  type="text"
                  required
                  value={editingStopData.stop.name}
                  onChange={(e) =>
                    setEditingStopData({
                      ...editingStopData,
                      stop: { ...editingStopData.stop, name: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-900 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">Danh mục</label>
                  <input
                    type="text"
                    value={editingStopData.stop.category}
                    onChange={(e) =>
                      setEditingStopData({
                        ...editingStopData,
                        stop: { ...editingStopData.stop, category: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-900"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">Chi phí dự tính (VNĐ)</label>
                  <input
                    type="number"
                    step={1000}
                    min={0}
                    value={editingStopData.stop.costEstimate || 0}
                    onChange={(e) =>
                      setEditingStopData({
                        ...editingStopData,
                        stop: {
                          ...editingStopData.stop,
                          costEstimate: parseInt(e.target.value, 10) || 0,
                        },
                      })
                    }
                    className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-900 font-bold text-emerald-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">Giờ ghé</label>
                  <input
                    type="time"
                    value={editingStopData.stop.time || "08:00"}
                    onChange={(e) =>
                      setEditingStopData({
                        ...editingStopData,
                        stop: {
                          ...editingStopData.stop,
                          time: e.target.value,
                          startTime: e.target.value,
                        },
                      })
                    }
                    className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-900"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">Phương tiện</label>
                  <select
                    value={editingStopData.stop.transportMode || "Xe máy"}
                    onChange={(e) =>
                      setEditingStopData({
                        ...editingStopData,
                        stop: {
                          ...editingStopData.stop,
                          transportMode: e.target.value as TransportType,
                        },
                      })
                    }
                    className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-900 cursor-pointer"
                  >
                    <option value="Xe máy">Xe máy</option>
                    <option value="Ô tô">Ô tô</option>
                    <option value="Đi bộ">Đi bộ</option>
                    <option value="Taxi">Taxi</option>
                    <option value="Xe buýt">Xe buýt</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">Địa chỉ</label>
                <input
                  type="text"
                  value={editingStopData.stop.address || ""}
                  onChange={(e) =>
                    setEditingStopData({
                      ...editingStopData,
                      stop: { ...editingStopData.stop, address: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-900"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">Ghi chú hoặc lời nhắc</label>
                <textarea
                  rows={2}
                  value={editingStopData.stop.note || ""}
                  onChange={(e) =>
                    setEditingStopData({
                      ...editingStopData,
                      stop: { ...editingStopData.stop, note: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-900"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setEditingStopData(null)}
                  className="px-3.5 py-1.5 text-xs font-semibold text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold text-white bg-gray-900 hover:bg-gray-800 rounded-lg shadow-xs cursor-pointer"
                >
                  Lưu thay đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE TRIP MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-gray-200 flex items-center justify-between bg-white">
              <h3 className="text-base font-bold text-gray-900">Tạo chuyến đi mới</h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-700 rounded cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateTripSubmit} className="p-5 space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">Tên chuyến đi *</label>
                <input
                  type="text"
                  required
                  placeholder="VD: Du lịch Đà Lạt 3N2Đ"
                  value={newTripTitle}
                  onChange={(e) => setNewTripTitle(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">Địa điểm</label>
                  <input
                    type="text"
                    value={newTripProvince}
                    onChange={(e) => setNewTripProvince(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-900"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">Số ngày</label>
                  <input
                    type="number"
                    min={1}
                    max={15}
                    value={newTripDays}
                    onChange={(e) => setNewTripDays(parseInt(e.target.value, 10) || 1)}
                    className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">Ngày khởi hành</label>
                  <input
                    type="date"
                    value={newTripStartDate}
                    onChange={(e) => setNewTripStartDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-900"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">Dự trù kinh phí (VNĐ)</label>
                  <input
                    type="number"
                    step={100000}
                    value={newTripBudget}
                    onChange={(e) => setNewTripBudget(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-900"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-gray-900 hover:bg-gray-800 rounded-lg shadow-xs cursor-pointer"
                >
                  Tạo chuyến đi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PLACE PICKER MODAL */}
      {isPlacePickerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl max-h-[85vh] flex flex-col border border-gray-200 overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-gray-200 flex items-center justify-between bg-white flex-shrink-0">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-gray-900">
                  Thêm địa điểm vào Ngày {activeDayIndex + 1}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">Chọn từ gợi ý có sẵn hoặc tự nhập điểm mới</p>
              </div>
              <button
                onClick={() => setIsPlacePickerOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex border-b border-gray-200 px-5 pt-2 bg-gray-50 flex-shrink-0">
              <button
                onClick={() => setPlacePickerTab("library")}
                className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
                  placePickerTab === "library"
                    ? "border-gray-900 text-gray-900 font-bold"
                    : "border-transparent text-gray-500 hover:text-gray-800"
                }`}
              >
                Gợi ý địa điểm ({filteredPlacesForPicker.length})
              </button>
              <button
                onClick={() => setPlacePickerTab("custom")}
                className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
                  placePickerTab === "custom"
                    ? "border-gray-900 text-gray-900 font-bold"
                    : "border-transparent text-gray-500 hover:text-gray-800"
                }`}
              >
                Tự nhập điểm mới
              </button>
            </div>

            {placePickerTab === "library" && (
              <div className="flex-1 flex flex-col min-h-0">
                <div className="p-3.5 border-b border-gray-100 space-y-2 bg-white flex-shrink-0">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
                    <input
                      type="text"
                      placeholder="Tìm theo tên địa điểm, địa chỉ..."
                      value={placeSearchQuery}
                      onChange={(e) => setPlaceSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-900"
                    />
                  </div>

                  <div className="flex items-center gap-1 overflow-x-auto pb-0.5">
                    {["Tất cả", "Tham quan", "Ăn uống", "Cà phê", "Khách sạn", "Check-in"].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setPlaceCategoryFilter(cat)}
                        className={`px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                          placeCategoryFilter === cat
                            ? "bg-gray-900 text-white font-semibold"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="overflow-y-auto p-3.5 space-y-2.5 flex-1">
                  {filteredPlacesForPicker.map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between gap-3 p-2.5 hover:bg-gray-50 rounded-xl transition-colors border border-gray-100"
                    >
                      <div className="flex gap-3 min-w-0">
                        <img
                          src={p.img || p.image}
                          alt=""
                          className="w-16 h-16 object-cover bg-gray-100 rounded-lg border border-gray-200 flex-shrink-0"
                        />
                        <div className="min-w-0 flex flex-col justify-center">
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-semibold ${getCategoryTextColor(p.category)}`}>
                              {p.category}
                            </span>
                            {p.rating && (
                              <span className="text-[10px] font-semibold text-amber-600 flex items-center gap-0.5">
                                <Star size={10} className="fill-amber-400 text-amber-400" /> {p.rating}
                              </span>
                            )}
                          </div>
                          <h4 className="text-xs sm:text-sm font-bold text-gray-900 truncate mt-0.5">
                            {p.name}
                          </h4>
                          <span className="text-[11px] text-gray-500 line-clamp-1">{p.location}</span>
                          <span className="text-xs text-emerald-600 font-semibold mt-0.5">
                            {p.priceMax ? `${p.priceMax.toLocaleString("vi-VN")}đ` : p.price}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleAddPlaceToActiveDay(p)}
                        className="px-3 py-1.5 text-xs font-semibold text-white bg-gray-900 hover:bg-gray-800 rounded-lg shadow-xs flex-shrink-0 cursor-pointer transition-colors"
                      >
                        + Thêm
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {placePickerTab === "custom" && (
              <form onSubmit={handleAddCustomStopSubmit} className="p-5 space-y-3.5 overflow-y-auto flex-1">
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">Tên địa điểm *</label>
                  <input
                    type="text"
                    required
                    placeholder="VD: Quán Cà Phê Mê Linh"
                    value={stopName}
                    onChange={(e) => setStopName(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-900"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-gray-700 block mb-1">Danh mục</label>
                    <select
                      value={stopCategory}
                      onChange={(e) => setStopCategory(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-900 cursor-pointer"
                    >
                      <option value="Tham quan">Tham quan</option>
                      <option value="Ăn uống">Ăn uống</option>
                      <option value="Cà phê">Cà phê</option>
                      <option value="Khách sạn">Khách sạn</option>
                      <option value="Check-in">Check-in</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-700 block mb-1">Phương tiện</label>
                    <select
                      value={stopTransport}
                      onChange={(e) => setStopTransport(e.target.value as TransportType)}
                      className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-900 cursor-pointer"
                    >
                      <option value="Xe máy">Xe máy</option>
                      <option value="Ô tô">Ô tô</option>
                      <option value="Đi bộ">Đi bộ</option>
                      <option value="Taxi">Taxi</option>
                      <option value="Xe buýt">Xe buýt</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-gray-700 block mb-1">Giờ bắt đầu</label>
                    <input
                      type="time"
                      value={stopStartTime}
                      onChange={(e) => setStopStartTime(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-900"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-700 block mb-1">Giờ kết thúc</label>
                    <input
                      type="time"
                      value={stopEndTime}
                      onChange={(e) => setStopEndTime(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-gray-700 block mb-1">Địa chỉ</label>
                    <input
                      type="text"
                      placeholder="VD: Phường 2, TP. Đà Lạt"
                      value={stopAddress}
                      onChange={(e) => setStopAddress(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-900"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-700 block mb-1">Chi phí dự tính (VNĐ)</label>
                    <input
                      type="number"
                      step={10000}
                      value={stopCost}
                      onChange={(e) => setStopCost(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">Ghi chú</label>
                  <textarea
                    rows={2}
                    placeholder="VD: Quán đông nên ghé sớm..."
                    value={stopNote}
                    onChange={(e) => setStopNote(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-900"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setPlacePickerTab("library")}
                    className="px-3.5 py-1.5 text-xs font-semibold text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 cursor-pointer"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 text-xs font-bold text-white bg-gray-900 hover:bg-gray-800 rounded-lg shadow-xs cursor-pointer"
                  >
                    Lưu vào Ngày {activeDayIndex + 1}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* MEMBER MODAL */}
      {isMemberModalOpen && selectedItinerary && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-white">
              <h3 className="text-base font-bold text-gray-900">Thành viên đồng lên lịch</h3>
              <button
                onClick={() => setIsMemberModalOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-700 rounded cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-5 space-y-4">
              {currentUserRole === "Owner" && (
                <form onSubmit={handleInviteMember} className="space-y-2">
                  <label className="text-xs font-semibold text-gray-700 block">Mời thành viên qua email</label>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      required
                      placeholder="banbe@gmail.com"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      className="flex-1 px-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-900"
                    />
                    <select
                      value={inviteRole}
                      onChange={(e) => setInviteRole(e.target.value as TripRole)}
                      className="px-2 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg font-medium text-gray-700 cursor-pointer"
                    >
                      <option value="Editor">Biên tập</option>
                      <option value="Viewer">Chỉ xem</option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2 bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold rounded-lg shadow-xs transition-colors cursor-pointer"
                  >
                    Gửi lời mời
                  </button>
                </form>
              )}

              <div>
                <span className="text-xs font-semibold text-gray-700 block mb-2">
                  Danh sách thành viên ({selectedItinerary.members?.length || 1})
                </span>
                <div className="space-y-2 max-h-56 overflow-y-auto">
                  {selectedItinerary.members?.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-2.5 border border-gray-100 rounded-xl bg-gray-50/60"
                    >
                      <div className="flex items-center gap-2.5">
                        <img
                          src={member.avatar}
                          alt=""
                          className="w-8 h-8 rounded-full bg-white object-cover border border-gray-200"
                        />
                        <div>
                          <p className="text-xs font-bold text-gray-900">{member.name}</p>
                          <span className="text-[11px] text-gray-500">{member.role}</span>
                        </div>
                      </div>

                      {currentUserRole === "Owner" && member.role !== "Owner" && (
                        <button
                          onClick={() => handleRemoveMember(member.id)}
                          className="text-xs text-red-500 hover:text-red-700 px-2 py-1 rounded cursor-pointer"
                        >
                          Xóa
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
