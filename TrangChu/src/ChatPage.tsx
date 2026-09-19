import React, { useState, useRef, useEffect } from "react";
import {
  Search,
  Send,
  Plus,
  Image as ImageIcon,
  Smile,
  Mic,
  MicOff,
  Phone,
  Video,
  Info,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  X,
  FileText,
  Download,
  MapPin,
  Compass,
  Star,
  Play,
  Pause,
  Reply,
  Copy,
  Trash2,
  ExternalLink,
  ThumbsUp,
  Heart,
  Maximize2,
  ZoomIn,
  BellOff,
  Bell,
  User,
  MoreHorizontal,
  Edit3,
  Share2,
  Pin,
  Shield,
  Eye,
  Clock,
  Lock,
  Palette,
  Check,
  PhoneCall,
  Flag,
} from "lucide-react";
import ReportModal, { ReportTargetInfo } from "./ReportModal";
import {
  ChatMessage,
  Conversation,
  ChatAttachment,
  ImageAttachment,
  FileAttachment,
  PlaceAttachment,
  ItineraryAttachment,
  AudioAttachment,
  initialConversations,
  initialChatMessages,
  sampleTravelPhotos,
  sampleTravelFiles,
  generateSimulatedReply,
  playChatChime,
} from "./chatData";
import { Place, places, initialFriendsData } from "./data";

interface ChatPageProps {
  initialConversationId?: string;
  onBack?: () => void;
  onSelectPlace?: (place: Place) => void;
  onViewTripDetail?: () => void;
  showToast?: (msg: string) => void;
}

// Available theme colors
const THEME_OPTIONS = [
  { name: "Xanh lá năng động", color: "#00C853", bgSoft: "#E8F8EE" },
  { name: "Xanh dương hiện đại", color: "#0084FF", bgSoft: "#EBF5FF" },
  { name: "Xanh ngọc Ocean", color: "#06B6D4", bgSoft: "#ECFEFF" },
  { name: "Tím hoàng hôn", color: "#8B5CF6", bgSoft: "#F5F3FF" },
  { name: "Hồng đào Rose", color: "#F43F5E", bgSoft: "#FFF1F2" },
  { name: "Cam nhiệt đới", color: "#F97316", bgSoft: "#FFF7ED" },
];

// Available quick emojis
const EMOJI_OPTIONS = ["👍", "❤️", "🔥", "🎉", "✈️", "⭐", "👏", "🥰"];

export default function ChatPage({
  initialConversationId,
  onBack,
  onSelectPlace,
  onViewTripDetail,
  showToast = () => {},
}: ChatPageProps) {
  // Main State
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
  const [activeConvId, setActiveConvId] = useState<string>(
    initialConversationId || initialConversations[0].id
  );
  const [messagesMap, setMessagesMap] = useState<Record<string, ChatMessage[]>>(initialChatMessages);

  // Filter Tabs: "all" | "unread" | "groups"
  const [filterTab, setFilterTab] = useState<"all" | "unread" | "groups">("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Input states
  const [inputText, setInputText] = useState("");
  const [partnerTyping, setPartnerTyping] = useState(false);
  const [replyingTo, setReplyingTo] = useState<ChatMessage | null>(null);
  const [stagedAttachments, setStagedAttachments] = useState<ChatAttachment[]>([]);

  // Right Drawer (Always open by default on desktop like Messenger Web)
  const [showRightDrawer, setShowRightDrawer] = useState(true);

  // Collapsible Accordions in Right Drawer
  const [accordionChatInfo, setAccordionChatInfo] = useState(true);
  const [accordionCustomize, setAccordionCustomize] = useState(true);
  const [accordionMedia, setAccordionMedia] = useState(true);
  const [accordionPrivacy, setAccordionPrivacy] = useState(false);

  // Modals
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [showEmojiModal, setShowEmojiModal] = useState(false);
  const [showNicknameModal, setShowNicknameModal] = useState(false);
  const [nicknameInput, setNicknameInput] = useState("");
  const [showPinnedModal, setShowPinnedModal] = useState(false);
  const [showPlacePicker, setShowPlacePicker] = useState(false);
  const [selectedPlacesToAttach, setSelectedPlacesToAttach] = useState<Place[]>([]);
  const [placeSearchQuery, setPlaceSearchQuery] = useState("");
  const [lightboxImage, setLightboxImage] = useState<ImageAttachment | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [callModal, setCallModal] = useState<{ isOpen: boolean; type: "voice" | "video"; partnerName: string } | null>(null);
  const [reportTarget, setReportTarget] = useState<ReportTargetInfo | null>(null);

  // Audio recording simulation
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Audio message playback
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const audioIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [audioProgress, setAudioProgress] = useState<Record<string, number>>({});

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const activeConversation =
    conversations.find((c) => c.id === activeConvId) || conversations[0];
  const currentMessages = messagesMap[activeConvId] || [];

  // Active theme color (defaults to "#00C853" like in the screenshot)
  const themeColor = activeConversation.themeColor || "#00C853";
  const customEmoji = activeConversation.customEmoji || "👍";

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentMessages, partnerTyping]);

  // Mark unread as 0 on open
  useEffect(() => {
    if (activeConversation && activeConversation.unreadCount > 0) {
      setConversations((prev) =>
        prev.map((c) => (c.id === activeConvId ? { ...c, unreadCount: 0 } : c))
      );
    }
  }, [activeConvId]);

  // Handle send message
  const handleSendMessage = (customText?: string, attachmentsToSend?: ChatAttachment[]) => {
    const textToSend = customText !== undefined ? customText : inputText;
    const finalAttachments = attachmentsToSend || stagedAttachments;

    if (!textToSend.trim() && finalAttachments.length === 0) return;

    const newMsgId = `m_${Date.now()}`;
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, "0")}:${now
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;

    const newMsg: ChatMessage = {
      id: newMsgId,
      conversationId: activeConvId,
      senderId: "current-user",
      senderName: "Tôi",
      senderAvatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop",
      timestamp: timeStr,
      createdAt: Date.now(),
      text: textToSend,
      status: "sent",
      replyTo: replyingTo
        ? {
            id: replyingTo.id,
            senderName: replyingTo.senderName,
            text: replyingTo.text || "Đính kèm",
          }
        : undefined,
      attachments: finalAttachments.length > 0 ? finalAttachments : undefined,
    };

    setMessagesMap((prev) => ({
      ...prev,
      [activeConvId]: [...(prev[activeConvId] || []), newMsg],
    }));

    // Update conversation snippet
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id !== activeConvId) return c;
        return {
          ...c,
          lastMessage: {
            text: textToSend || (finalAttachments.length > 0 ? "Đã gửi tệp đính kèm" : ""),
            timestamp: timeStr,
            senderId: "current-user",
            status: "sent",
          },
        };
      })
    );

    // Play send chime
    playChatChime("send");

    // Clear input
    setInputText("");
    setReplyingTo(null);
    setStagedAttachments([]);

    // Simulate partner response if not assistant
    if (activeConversation.type !== "assistant") {
      setTimeout(() => {
        setPartnerTyping(true);
        setTimeout(() => {
          setPartnerTyping(false);
          const replySim = generateSimulatedReply(activeConversation, textToSend);
          const replyMsgId = `m_${Date.now()}`;
          const replyMsg: ChatMessage = {
            id: replyMsgId,
            conversationId: activeConvId,
            senderId: activeConversation.friendUserId ? `u_${activeConversation.friendUserId}` : "u_partner",
            senderName: activeConversation.nickname || activeConversation.name,
            senderAvatar: activeConversation.avatarUrl,
            timestamp: timeStr,
            createdAt: Date.now(),
            text: replySim.text,
            attachments: replySim.attachment ? [replySim.attachment] : undefined,
            status: "read",
          };

          setMessagesMap((prev) => ({
            ...prev,
            [activeConvId]: [...(prev[activeConvId] || []), replyMsg],
          }));

          setConversations((prev) =>
            prev.map((c) =>
              c.id === activeConvId
                ? {
                    ...c,
                    lastMessage: {
                      text: replySim.text,
                      timestamp: timeStr,
                      senderId: replyMsg.senderId,
                      status: "read",
                    },
                  }
                : c
            )
          );

          playChatChime("receive");
        }, 2200);
      }, 1000);
    }
  };

  // Send default custom emoji (Like button 👍)
  const handleSendCustomEmoji = () => {
    handleSendMessage(customEmoji);
  };

  // Toggle reaction on message (👍, ❤️, 😂, 😮, 😢, 😡)
  const handleToggleReaction = (msgId: string, emoji: string) => {
    setMessagesMap((prev) => ({
      ...prev,
      [activeConvId]: (prev[activeConvId] || []).map((m) => {
        if (m.id !== msgId) return m;
        const currentReactions = { ...(m.reactions || {}) };
        const count = currentReactions[emoji] || 0;
        currentReactions[emoji] = count + 1;
        return { ...m, reactions: currentReactions };
      }),
    }));
  };

  // Select multiple places to attach
  const handleTogglePlaceSelect = (place: Place) => {
    if (selectedPlacesToAttach.some((p) => p.id === place.id)) {
      setSelectedPlacesToAttach((prev) => prev.filter((p) => p.id !== place.id));
    } else {
      setSelectedPlacesToAttach((prev) => [...prev, place]);
    }
  };

  const handleConfirmAttachPlaces = () => {
    if (selectedPlacesToAttach.length === 0) return;
    const newAttachments: PlaceAttachment[] = selectedPlacesToAttach.map((p) => ({
      type: "place",
      placeId: p.id,
      name: p.name,
      location: p.location,
      category: p.category,
      rating: p.rating,
      price: p.price,
      img: p.img,
      desc: p.desc,
      reviewCount: (p as any).reviews || (p as any).reviewsCount || 120,
      openStatus: "Đang mở cửa · Đóng cửa vào 22:00",
      phone: "028 3822 9999",
      mapSnapshotUrl: "https://images.unsplash.com/photo-1524661135-423995f22d0b?w=600&h=200&fit=crop",
    }));

    setStagedAttachments((prev) => [...prev, ...newAttachments]);
    setSelectedPlacesToAttach([]);
    setShowPlacePicker(false);
    showToast(`Đã đính kèm ${newAttachments.length} địa điểm`);
  };

  // File Upload Handlers
  const handleNativeImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      const imgAtt: ImageAttachment = {
        type: "image",
        url,
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      };
      setStagedAttachments((prev) => [...prev, imgAtt]);
      showToast(`Đã thêm ảnh: ${file.name}`);
    }
  };

  const handleNativeFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const ext = file.name.split(".").pop()?.toLowerCase() || "doc";
      const fileType = ["pdf", "doc", "xls", "zip", "txt"].includes(ext)
        ? (ext as "pdf" | "doc" | "xls" | "zip" | "txt")
        : "doc";
      const fileAtt: FileAttachment = {
        type: "file",
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        fileType,
      };
      setStagedAttachments((prev) => [...prev, fileAtt]);
      showToast(`Đã thêm tệp: ${file.name}`);
    }
  };

  // Audio recording simulation
  const handleToggleRecord = () => {
    if (isRecording) {
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
      setIsRecording(false);
      const audioAtt: AudioAttachment = {
        type: "audio",
        duration: `0:${recordingSeconds.toString().padStart(2, "0")}`,
        waveform: [20, 45, 80, 60, 90, 75, 40, 85, 95, 60, 30, 70, 85, 40],
      };
      setStagedAttachments((prev) => [...prev, audioAtt]);
      setRecordingSeconds(0);
      showToast("Đã lưu đoạn ghi âm thoại");
    } else {
      setIsRecording(true);
      setRecordingSeconds(0);
      recordingTimerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    }
  };

  // Audio playback simulation
  const handleToggleAudioPlay = (msgId: string) => {
    if (playingAudioId === msgId) {
      if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
      setPlayingAudioId(null);
    } else {
      if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
      setPlayingAudioId(msgId);
      audioIntervalRef.current = setInterval(() => {
        setAudioProgress((prev) => {
          const current = prev[msgId] || 0;
          if (current >= 100) {
            if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
            setPlayingAudioId(null);
            return { ...prev, [msgId]: 0 };
          }
          return { ...prev, [msgId]: current + 8 };
        });
      }, 150);
    }
  };

  // Change Theme Color
  const handleSelectTheme = (newColor: string) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === activeConvId ? { ...c, themeColor: newColor } : c))
    );
    setShowThemeModal(false);
    showToast("Đã đổi chủ đề đoạn chat");
  };

  // Change Custom Emoji
  const handleSelectEmoji = (newEmoji: string) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === activeConvId ? { ...c, customEmoji: newEmoji } : c))
    );
    setShowEmojiModal(false);
    showToast(`Đã đổi biểu tượng cảm xúc thành ${newEmoji}`);
  };

  // Change Nickname
  const handleSaveNickname = () => {
    if (!nicknameInput.trim()) return;
    setConversations((prev) =>
      prev.map((c) => (c.id === activeConvId ? { ...c, nickname: nicknameInput.trim() } : c))
    );
    setShowNicknameModal(false);
    setNicknameInput("");
    showToast("Đã lưu biệt danh mới");
  };

  // Filter Conversations by Tab and Search
  const filteredConversations = conversations.filter((c) => {
    const matchesSearch =
      !searchQuery ||
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.lastMessage?.text.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (filterTab === "unread") return c.unreadCount > 0;
    if (filterTab === "groups") return c.type === "group";
    return true;
  });

  // Collect shared media for right sidebar
  const allMediaAttachments: ImageAttachment[] = [];
  const allFileAttachments: FileAttachment[] = [];
  const allPlaceAttachments: PlaceAttachment[] = [];

  currentMessages.forEach((m) => {
    m.attachments?.forEach((att) => {
      if (att.type === "image") allMediaAttachments.push(att);
      if (att.type === "file") allFileAttachments.push(att);
      if (att.type === "place") allPlaceAttachments.push(att);
    });
  });

  const lastMessage = currentMessages[currentMessages.length - 1];

  return (
    <div className="flex h-[calc(100vh-64px)] bg-[#F0F2F5] text-[#050505] antialiased font-sans overflow-hidden">
      {/* Hidden File Inputs */}
      <input
        type="file"
        ref={imageInputRef}
        accept="image/*"
        className="hidden"
        onChange={handleNativeImageUpload}
      />
      <input
        type="file"
        ref={fileInputRef}
        accept=".pdf,.doc,.docx,.xls,.xlsx,.zip,.txt"
        className="hidden"
        onChange={handleNativeFileUpload}
      />

      {/* ─────────────────────────────────────────────────────────────
          CỘT 1: SIDEBAR DANH SÁCH ĐOẠN CHAT (FACEBOOK MESSENGER EXACT)
      ───────────────────────────────────────────────────────────── */}
      <aside className="w-80 md:w-[360px] bg-white border-r border-[#E4E6EB] flex flex-col flex-shrink-0 z-20">
        {/* Messenger Header: "Đoạn chat" + "..." + Pen Icon */}
        <div className="p-4 pb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {onBack && (
              <button
                onClick={onBack}
                className="w-9 h-9 rounded-full hover:bg-[#F0F2F5] flex items-center justify-center text-[#65676B] transition-colors cursor-pointer"
                title="Quay lại"
              >
                <ChevronLeft size={22} />
              </button>
            )}
            <h1 className="text-2xl font-bold tracking-tight text-[#050505]">Đoạn chat</h1>
          </div>

          <div className="flex items-center gap-2 text-[#050505]">
            <button
              onClick={() => showToast("Tạo cuộc trò chuyện mới")}
              className="w-9 h-9 rounded-full bg-[#F0F2F5] hover:bg-[#E4E6EB] flex items-center justify-center transition-colors cursor-pointer"
              title="Soạn tin nhắn mới"
            >
              <Edit3 size={18} />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="px-4 py-1.5">
          <div className="relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#65676B]" />
            <input
              type="text"
              placeholder="Tìm kiếm cuộc trò chuyện, bạn bè..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 bg-[#F0F2F5] focus:bg-white border border-transparent focus:border-[#0084FF] rounded-full text-[14px] text-[#050505] placeholder-[#65676B] outline-none transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#65676B] hover:text-[#050505]"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Filter Pills Bar (Tất cả, Chưa đọc, Nhóm) */}
        <div className="px-4 py-2 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setFilterTab("all")}
            className={`px-3 py-1.5 rounded-full text-[13px] font-semibold transition-colors cursor-pointer whitespace-nowrap ${
              filterTab === "all"
                ? "bg-[#EBF5FF] text-[#0084FF]"
                : "text-[#050505] hover:bg-[#F0F2F5]"
            }`}
          >
            Tất cả
          </button>
          <button
            onClick={() => setFilterTab("unread")}
            className={`px-3 py-1.5 rounded-full text-[13px] font-semibold transition-colors cursor-pointer whitespace-nowrap ${
              filterTab === "unread"
                ? "bg-[#EBF5FF] text-[#0084FF]"
                : "text-[#050505] hover:bg-[#F0F2F5]"
            }`}
          >
            Chưa đọc
          </button>
          <button
            onClick={() => setFilterTab("groups")}
            className={`px-3 py-1.5 rounded-full text-[13px] font-semibold transition-colors cursor-pointer whitespace-nowrap ${
              filterTab === "groups"
                ? "bg-[#EBF5FF] text-[#0084FF]"
                : "text-[#050505] hover:bg-[#F0F2F5]"
            }`}
          >
            Nhóm
          </button>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto px-2 py-1 space-y-0.5">
          {filteredConversations.map((conv) => {
            const isActive = conv.id === activeConvId;
            const isUnread = conv.unreadCount > 0;

            return (
              <div
                key={conv.id}
                onClick={() => setActiveConvId(conv.id)}
                className={`flex items-center gap-3 p-2.5 rounded-xl cursor-pointer transition-colors ${
                  isActive
                    ? "bg-[#EBF5FF]"
                    : "hover:bg-[#F2F2F2]"
                }`}
              >
                {/* Avatar with Online Dot */}
                <div className="relative flex-shrink-0">
                  <img
                    src={conv.avatarUrl}
                    alt=""
                    className="w-13 h-13 rounded-full object-cover"
                  />
                  {conv.isOnline && (
                    <span className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 bg-[#31A24C] border-2 border-white rounded-full" />
                  )}
                </div>

                {/* Info & Snippet */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <h3
                      className={`text-[15px] truncate ${
                        isUnread ? "font-bold text-[#050505]" : "font-semibold text-[#050505]"
                      }`}
                    >
                      {conv.nickname || conv.name}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1.5 text-[13px] text-[#65676B]">
                    <p
                      className={`truncate flex-1 ${
                        isUnread ? "font-bold text-[#050505]" : ""
                      }`}
                    >
                      {conv.lastMessage?.senderId === "current-user" && "Bạn: "}
                      {conv.lastMessage?.text || "Bắt đầu cuộc trò chuyện"}
                    </p>
                    <span className="text-[12px] opacity-80 whitespace-nowrap">
                      · {conv.lastMessage?.timestamp || ""}
                    </span>
                  </div>
                </div>

                {/* Unread Blue Dot */}
                {isUnread && (
                  <span className="w-3 h-3 bg-[#0084FF] rounded-full flex-shrink-0" />
                )}
              </div>
            );
          })}
        </div>
      </aside>

      {/* ─────────────────────────────────────────────────────────────
          CỘT 2: KHUNG CHAT CHÍNH (FACEBOOK MESSENGER MAIN FEED)
      ───────────────────────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col bg-white relative overflow-hidden">
        {/* Chat Feed Header */}
        <header className="h-16 px-4 border-b border-[#E4E6EB] flex items-center justify-between gap-4 z-10 bg-white">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative flex-shrink-0">
              <img
                src={activeConversation.avatarUrl}
                alt=""
                className="w-10 h-10 rounded-full object-cover"
              />
              {activeConversation.isOnline && (
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#31A24C] border-2 border-white rounded-full" />
              )}
            </div>

            <div className="min-w-0">
              <h2 className="text-[16px] font-bold text-[#050505] truncate">
                {activeConversation.nickname || activeConversation.name}
              </h2>
              <p className="text-[12px] text-[#65676B]">
                {partnerTyping ? (
                  <span style={{ color: themeColor }} className="font-semibold">
                    Đang nhập...
                  </span>
                ) : (
                  activeConversation.lastSeen || (activeConversation.isOnline ? "Đang hoạt động" : "Không hoạt động")
                )}
              </p>
            </div>
          </div>

          {/* Action Icons: Voice Call, Video Call, Info Button (Theme Green/Blue) */}
          <div className="flex items-center gap-1" style={{ color: themeColor }}>
            <button
              onClick={() =>
                setCallModal({ isOpen: true, type: "voice", partnerName: activeConversation.name })
              }
              className="w-9 h-9 rounded-full hover:bg-[#F0F2F5] flex items-center justify-center transition-colors cursor-pointer"
              title="Bắt đầu gọi thoại"
            >
              <Phone size={20} />
            </button>
            <button
              onClick={() =>
                setCallModal({ isOpen: true, type: "video", partnerName: activeConversation.name })
              }
              className="w-9 h-9 rounded-full hover:bg-[#F0F2F5] flex items-center justify-center transition-colors cursor-pointer"
              title="Bắt đầu gọi video"
            >
              <Video size={20} />
            </button>
            <button
              onClick={() => setShowRightDrawer(!showRightDrawer)}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                showRightDrawer ? "bg-[#F0F2F5]" : "hover:bg-[#F0F2F5]"
              }`}
              title="Thông tin đoạn chat"
            >
              <Info size={20} />
            </button>
          </div>
        </header>

        {/* ── MESSAGES FEED ── */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-2.5">
          {/* Centered Timestamp (e.g. 14:41 T7) */}
          <div className="text-center my-3">
            <span className="text-[12px] font-medium text-[#65676B]">14:41 T7</span>
          </div>

          {/* Render Messages */}
          {currentMessages.map((msg, idx) => {
            const isMe = msg.senderId === "current-user";
            const isNextSameSender =
              currentMessages[idx + 1]?.senderId === msg.senderId;

            return (
              <div
                key={msg.id}
                className={`group flex items-end gap-2 ${
                  isMe ? "justify-end" : "justify-start"
                } ${isNextSameSender ? "mb-0.5" : "mb-2"}`}
              >
                {/* Incoming Avatar (only on last message of consecutive group) */}
                {!isMe && (
                  <div className="w-7 h-7 flex-shrink-0">
                    {!isNextSameSender && (
                      <img
                        src={msg.senderAvatar}
                        alt=""
                        className="w-7 h-7 rounded-full object-cover"
                      />
                    )}
                  </div>
                )}

                {/* Message Bubble Column */}
                <div
                  className={`flex flex-col max-w-[85%] sm:max-w-[70%] md:max-w-[60%] ${
                    isMe ? "items-end" : "items-start"
                  }`}
                >
                  {/* Quoted Reply Header & Bubble (Curved Arrow + Author + Snippet) */}
                  {msg.replyTo && (
                    <div className="mb-1 flex flex-col items-start text-xs max-w-full">
                      <div className="flex items-center gap-1 text-[#65676B] text-[12px] mb-0.5 pl-1">
                        <Reply size={12} className="rotate-180" />
                        <span>{msg.replyTo.senderName || "Đã trả lời bạn"}</span>
                      </div>
                      <div className="px-3 py-1.5 rounded-2xl bg-[#F0F2F5] text-[#65676B] text-[13px] border border-[#E4E6EB] max-w-full truncate">
                        {msg.replyTo.text}
                      </div>
                    </div>
                  )}

                  {/* Bubble / Attachment Cards */}
                  <div>
                    {/* Text Message Bubble */}
                    {msg.text && (
                      <div
                        style={{
                          backgroundColor: isMe ? themeColor : "#F0F2F5",
                          color: isMe ? "#FFFFFF" : "#050505",
                        }}
                        className="relative text-[15px] leading-snug break-words rounded-[18px] px-3.5 py-2 shadow-2xs"
                      >
                        <p className="whitespace-pre-wrap">{msg.text}</p>
                      </div>
                    )}

                    {/* Rich Attachments (Maps to dbo.MessageAttachments: 1 Message -> Multiple Attachments!) */}
                    {msg.attachments && msg.attachments.length > 0 && (
                      <div className={`space-y-2 ${msg.text ? "mt-2" : ""}`}>
                        {msg.attachments.map((att, i) => {
                          // 1. PLACE CARD (FACEBOOK OPENGRAPH / GOOGLE MAPS PREVIEW EXACTLY AS IN SCREENSHOT)
                          if (att.type === "place") {
                            return (
                              <div
                                key={i}
                                className="relative group/card bg-white rounded-2xl overflow-hidden text-[#050505] border border-[#E4E6EB] shadow-sm max-w-[340px]"
                              >
                                {/* Map / Satellite Snapshot Header */}
                                <div className="relative h-32 bg-slate-100 overflow-hidden cursor-pointer">
                                  <img
                                    src={att.mapSnapshotUrl || att.img}
                                    alt=""
                                    className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-300"
                                    onClick={() => {
                                      const found = places.find((p) => p.id === att.placeId);
                                      if (found && onSelectPlace) onSelectPlace(found);
                                    }}
                                  />
                                  <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-xs text-white text-[11px] px-2 py-0.5 rounded-md font-medium flex items-center gap-1">
                                    <MapPin size={12} className="text-red-400" />
                                    <span>Vị trí trên bản đồ</span>
                                  </div>
                                </div>

                                {/* Place Details Body */}
                                <div className="p-3.5">
                                  <div className="flex items-start justify-between gap-2">
                                    <h4
                                      onClick={() => {
                                        const found = places.find((p) => p.id === att.placeId);
                                        if (found && onSelectPlace) onSelectPlace(found);
                                      }}
                                      className="font-bold text-[15px] text-[#050505] leading-tight hover:underline cursor-pointer line-clamp-2"
                                    >
                                      {att.name}
                                    </h4>
                                  </div>

                                  {/* Star Rating & Reviews */}
                                  <div className="flex items-center gap-1.5 mt-1 text-xs">
                                    <span className="font-bold text-[#050505]">{att.rating}</span>
                                    <div className="flex items-center text-amber-500">
                                      {[...Array(5)].map((_, s) => (
                                        <Star
                                          key={s}
                                          size={12}
                                          fill={s < Math.floor(att.rating) ? "#F59E0B" : "none"}
                                          stroke="#F59E0B"
                                        />
                                      ))}
                                    </div>
                                    <span className="text-[#65676B]">({att.reviewCount || 152})</span>
                                  </div>

                                  {/* Subtitle / Category */}
                                  <p className="text-[12px] text-[#65676B] mt-0.5 line-clamp-1">
                                    {att.subtitle || `${att.category} · ${att.price}`}
                                  </p>

                                  {/* Open Status */}
                                  <p className="text-[12px] text-[#31A24C] font-semibold mt-1">
                                    {att.openStatus || "Đang mở cửa · Đóng cửa vào 20:00"}
                                  </p>

                                  {/* Action Buttons: [Đường đi] [Lưu/Bắt đầu] [Gọi] */}
                                  <div className="flex items-center gap-2 mt-3 pt-2.5 border-t border-[#E4E6EB]">
                                    <button
                                      onClick={() => showToast(`Dẫn đường đến "${att.name}"`)}
                                      className="flex-1 py-1.5 bg-[#EBF5FF] hover:bg-[#D8ECFF] text-[#0084FF] rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                                    >
                                      <Compass size={14} />
                                      <span>Đường đi</span>
                                    </button>
                                    <button
                                      onClick={() => showToast(`Đã lưu "${att.name}" vào yêu thích`)}
                                      className="flex-1 py-1.5 bg-[#F0F2F5] hover:bg-[#E4E6EB] text-[#050505] rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                                    >
                                      <Pin size={14} />
                                      <span>Lưu</span>
                                    </button>
                                    <button
                                      onClick={() => showToast(`Gọi tới số: ${att.phone || "028 3822 9999"}`)}
                                      className="flex-1 py-1.5 bg-[#F0F2F5] hover:bg-[#E4E6EB] text-[#050505] rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                                    >
                                      <PhoneCall size={14} />
                                      <span>Gọi</span>
                                    </button>
                                  </div>

                                  {/* Address Note */}
                                  <p className="text-[11px] text-[#65676B] mt-2 truncate">
                                    📍 {att.location}
                                  </p>
                                </div>
                              </div>
                            );
                          }

                          // 2. IMAGE ATTACHMENT
                          if (att.type === "image") {
                            return (
                              <div
                                key={i}
                                onClick={() => setLightboxImage(att)}
                                className="rounded-2xl overflow-hidden cursor-pointer hover:opacity-95 transition-opacity max-w-[340px] border border-[#E4E6EB]"
                              >
                                <img
                                  src={att.url}
                                  alt=""
                                  className="w-full max-h-72 object-cover rounded-2xl"
                                />
                              </div>
                            );
                          }

                          // 3. FILE / DOCUMENT ATTACHMENT
                          if (att.type === "file") {
                            return (
                              <div
                                key={i}
                                className="flex items-center gap-3 p-3 rounded-2xl bg-[#F0F2F5] text-[#050505] border border-[#E4E6EB] max-w-[300px]"
                              >
                                <div className="w-10 h-10 rounded-xl bg-[#0084FF] text-white flex items-center justify-center font-bold text-xs">
                                  {att.fileType.toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-bold text-xs truncate">{att.name}</p>
                                  <p className="text-[11px] text-[#65676B]">{att.size}</p>
                                </div>
                                <button
                                  onClick={() => showToast(`Tải xuống tệp "${att.name}"`)}
                                  className="p-2 hover:bg-black/5 rounded-full cursor-pointer"
                                >
                                  <Download size={16} />
                                </button>
                              </div>
                            );
                          }

                          // 4. AUDIO WAVEFORM
                          if (att.type === "audio") {
                            const isPlaying = playingAudioId === msg.id;
                            const prog = audioProgress[msg.id] || 0;

                            return (
                              <div
                                key={i}
                                className="flex items-center gap-3 p-3 rounded-2xl bg-[#F0F2F5] text-[#050505] border border-[#E4E6EB] min-w-[240px]"
                              >
                                <button
                                  onClick={() => handleToggleAudioPlay(msg.id)}
                                  style={{ backgroundColor: themeColor }}
                                  className="w-9 h-9 rounded-full text-white flex items-center justify-center cursor-pointer shadow-xs"
                                >
                                  {isPlaying ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
                                </button>
                                <div className="flex-1">
                                  <div className="flex items-center gap-1 h-5">
                                    {att.waveform.map((h, wi) => (
                                      <span
                                        key={wi}
                                        style={{
                                          height: `${isPlaying ? Math.max(20, (h * (prog + 20)) % 100) : h}%`,
                                          backgroundColor: themeColor,
                                        }}
                                        className="w-1 rounded-full"
                                      />
                                    ))}
                                  </div>
                                  <span className="text-[10px] text-[#65676B] font-semibold">{att.duration}</span>
                                </div>
                              </div>
                            );
                          }

                          return null;
                        })}
                      </div>
                    )}
                  </div>

                  {/* Reaction Pill beneath bubble */}
                  {msg.reactions && Object.keys(msg.reactions).length > 0 && (
                    <div className="flex items-center gap-1 -mt-2 bg-white px-2 py-0.5 rounded-full border border-[#E4E6EB] shadow-xs text-xs z-10">
                      {Object.entries(msg.reactions).map(([em, cnt]) => (
                        <span key={em} className="flex items-center gap-0.5">
                          <span>{em}</span>
                          {cnt > 1 && <span className="text-[10px] text-[#65676B] font-bold">{cnt}</span>}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Hover Quick Action Menu (Like, Heart, Reply) */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                  <button
                    onClick={() => handleToggleReaction(msg.id, "❤️")}
                    className="w-7 h-7 rounded-full hover:bg-[#F0F2F5] flex items-center justify-center text-sm cursor-pointer"
                    title="Thả tim"
                  >
                    ❤️
                  </button>
                  <button
                    onClick={() => handleToggleReaction(msg.id, customEmoji)}
                    className="w-7 h-7 rounded-full hover:bg-[#F0F2F5] flex items-center justify-center text-sm cursor-pointer"
                    title="Thích"
                  >
                    {customEmoji}
                  </button>
                  <button
                    onClick={() => setReplyingTo(msg)}
                    className="w-7 h-7 rounded-full hover:bg-[#F0F2F5] flex items-center justify-center text-[#65676B] cursor-pointer"
                    title="Trả lời"
                  >
                    <Reply size={14} />
                  </button>
                  {msg.senderId !== "current-user" && (
                    <button
                      onClick={() =>
                        setReportTarget({
                          targetType: "comment",
                          targetId: typeof msg.id === "number" ? msg.id : 100,
                          targetTitle: `Tin nhắn từ ${activeConversation.name}`,
                          targetSubtitle: `Hội thoại: ${activeConversation.name}`,
                          targetContent: msg.text,
                          targetAuthor: activeConversation.name,
                        })
                      }
                      className="w-7 h-7 rounded-full hover:bg-rose-50 text-[#65676B] hover:text-rose-600 flex items-center justify-center cursor-pointer"
                      title="Báo cáo tin nhắn này"
                    >
                      <Flag size={13} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          {/* Typing Indicator (Messenger 3 Bouncing Dots) */}
          {partnerTyping && (
            <div className="flex items-end gap-2">
              <img
                src={activeConversation.avatarUrl}
                alt=""
                className="w-7 h-7 rounded-full object-cover"
              />
              <div className="px-4 py-3 bg-[#F0F2F5] rounded-[18px] flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#65676B] animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 rounded-full bg-[#65676B] animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 rounded-full bg-[#65676B] animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          )}

          {/* Read Receipt: Mini Avatar at Bottom Right (Mapped to dbo.ChatRoomMembers.LastReadAt) */}
          {lastMessage && lastMessage.senderId === "current-user" && (
            <div className="flex justify-end pr-1 -mt-1">
              <img
                src={activeConversation.avatarUrl}
                alt=""
                className="w-3.5 h-3.5 rounded-full object-cover border border-white shadow-2xs"
                title={`Đã xem lúc ${lastMessage.timestamp}`}
              />
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* ─────────────────────────────────────────────────────────────
            MESSENGER INPUT BAR (MIC, IMAGE, MAP, STICKER + PILL + SEND/LIKE)
        ───────────────────────────────────────────────────────────── */}
        <footer className="p-3 bg-white border-t border-[#E4E6EB] relative">
          {/* Reply Quote Banner */}
          {replyingTo && (
            <div className="mb-2 px-3 py-1.5 bg-[#F0F2F5] rounded-xl flex items-center justify-between text-xs">
              <div className="truncate">
                <span className="font-semibold text-[#050505]">Đang trả lời {replyingTo.senderName}: </span>
                <span className="text-[#65676B]">{replyingTo.text}</span>
              </div>
              <button onClick={() => setReplyingTo(null)} className="p-1 text-[#65676B] cursor-pointer">
                <X size={14} />
              </button>
            </div>
          )}

          {/* Staged Attachments Thumbnails */}
          {stagedAttachments.length > 0 && (
            <div className="mb-2 flex items-center gap-2 overflow-x-auto py-1">
              {stagedAttachments.map((att, idx) => (
                <div
                  key={idx}
                  className="relative p-1 bg-[#F0F2F5] border border-[#E4E6EB] rounded-xl flex items-center gap-2 pr-2"
                >
                  {att.type === "image" && (
                    <img src={att.url} alt="" className="w-10 h-10 rounded-lg object-cover" />
                  )}
                  {att.type === "place" && (
                    <div
                      style={{ backgroundColor: themeColor }}
                      className="w-10 h-10 rounded-lg text-white flex items-center justify-center font-bold text-xs"
                    >
                      <MapPin size={18} />
                    </div>
                  )}
                  {att.type === "file" && (
                    <div className="w-10 h-10 rounded-lg bg-red-500 text-white flex items-center justify-center font-bold text-xs">
                      {att.fileType.toUpperCase()}
                    </div>
                  )}
                  <span className="text-xs font-semibold text-[#050505] truncate max-w-[130px]">
                    {att.type === "place" ? att.name : att.type === "image" ? att.name || "Hình ảnh" : (att as any).name || (att as any).title || "Tệp đính kèm"}
                  </span>
                  <button
                    onClick={() => setStagedAttachments((prev) => prev.filter((_, i) => i !== idx))}
                    className="p-1 text-[#65676B] hover:text-[#050505] cursor-pointer"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Main Input Row */}
          <div className="flex items-center gap-2">
            {/* 1. Voice Record Button */}
            <button
              onClick={handleToggleRecord}
              style={{ color: themeColor }}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                isRecording ? "bg-red-500 text-white animate-pulse" : "hover:bg-[#F0F2F5]"
              }`}
              title="Ghi âm thoại"
            >
              {isRecording ? <MicOff size={20} /> : <Mic size={20} />}
            </button>

            {/* 2. Photo Upload Button */}
            <button
              onClick={() => imageInputRef.current?.click()}
              style={{ color: themeColor }}
              className="w-9 h-9 rounded-full hover:bg-[#F0F2F5] flex items-center justify-center transition-colors cursor-pointer"
              title="Gửi hình ảnh"
            >
              <ImageIcon size={20} />
            </button>

            {/* 3. Place / Location Button (Supports Multiple Places!) */}
            <button
              onClick={() => setShowPlacePicker(true)}
              style={{ color: themeColor }}
              className="w-9 h-9 rounded-full hover:bg-[#F0F2F5] flex items-center justify-center transition-colors cursor-pointer"
              title="Đính kèm Địa điểm du lịch / Quán ăn"
            >
              <MapPin size={20} />
            </button>

            {/* 4. Document File Button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              style={{ color: themeColor }}
              className="w-9 h-9 rounded-full hover:bg-[#F0F2F5] flex items-center justify-center transition-colors cursor-pointer"
              title="Gửi tệp tài liệu"
            >
              <FileText size={20} />
            </button>

            {/* 5. Pill Input Field with Aa and Emoji */}
            <div className="flex-1 bg-[#F0F2F5] rounded-full px-4 py-2 flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                placeholder={isRecording ? `Đang ghi âm (0:${recordingSeconds})...` : "Aa"}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSendMessage();
                }}
                className="flex-1 bg-transparent text-[15px] text-[#050505] outline-none placeholder-[#65676B]"
              />

              {/* Emoji inside pill */}
              <button
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                style={{ color: themeColor }}
                className="hover:opacity-80 cursor-pointer"
                title="Biểu tượng cảm xúc"
              >
                <Smile size={20} />
              </button>
            </div>

            {/* Right Action: Send Arrow if text, otherwise Theme Like Button 👍 */}
            {inputText.trim() || stagedAttachments.length > 0 ? (
              <button
                onClick={() => handleSendMessage()}
                style={{ color: themeColor }}
                className="w-9 h-9 rounded-full hover:bg-[#F0F2F5] flex items-center justify-center transition-transform active:scale-95 cursor-pointer"
                title="Gửi tin nhắn"
              >
                <Send size={20} />
              </button>
            ) : (
              <button
                onClick={handleSendCustomEmoji}
                style={{ color: themeColor }}
                className="w-9 h-9 rounded-full hover:bg-[#F0F2F5] flex items-center justify-center transition-transform active:scale-95 cursor-pointer text-xl"
                title={`Gửi biểu tượng ${customEmoji}`}
              >
                {customEmoji}
              </button>
            )}
          </div>
        </footer>
      </main>

      {/* ─────────────────────────────────────────────────────────────
          CỘT 3: THÔNG TIN ĐOẠN CHAT (FACEBOOK MESSENGER RIGHT SIDEBAR EXACT)
      ───────────────────────────────────────────────────────────── */}
      {showRightDrawer && (
        <aside className="w-80 md:w-[340px] bg-white border-l border-[#E4E6EB] flex flex-col flex-shrink-0 z-10 overflow-y-auto">
          {/* Profile Header */}
          <div className="p-6 text-center border-b border-[#E4E6EB]">
            <img
              src={activeConversation.avatarUrl}
              alt=""
              className="w-20 h-20 rounded-full object-cover mx-auto mb-2.5 shadow-2xs"
            />
            <h3 className="text-[17px] font-bold text-[#050505]">
              {activeConversation.nickname || activeConversation.name}
            </h3>
            <p className="text-xs text-[#65676B] mt-0.5">
              {activeConversation.lastSeen || "Hoạt động 7 phút trước"}
            </p>

            {/* End-to-End Encrypted Badge (Iconic Facebook Badge) */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#F0F2F5] rounded-full text-xs font-semibold text-[#050505] mt-2.5">
              <Lock size={12} className="text-[#65676B]" />
              <span>Được mã hóa đầu cuối</span>
            </div>

            {/* 3 Quick Action Circles: Trang cá nhân, Tắt thông báo, Tìm kiếm */}
            <div className="flex items-center justify-center gap-6 mt-4">
              <button
                onClick={() => showToast("Xem trang cá nhân")}
                className="flex flex-col items-center gap-1 group cursor-pointer"
              >
                <div className="w-9 h-9 rounded-full bg-[#F0F2F5] group-hover:bg-[#E4E6EB] flex items-center justify-center text-[#050505]">
                  <User size={16} />
                </div>
                <span className="text-[11px] text-[#65676B]">Trang cá n...</span>
              </button>

              <button
                onClick={() => showToast("Đã tắt thông báo")}
                className="flex flex-col items-center gap-1 group cursor-pointer"
              >
                <div className="w-9 h-9 rounded-full bg-[#F0F2F5] group-hover:bg-[#E4E6EB] flex items-center justify-center text-[#050505]">
                  <BellOff size={16} />
                </div>
                <span className="text-[11px] text-[#65676B]">Tắt thông báo</span>
              </button>

              <button
                onClick={() => showToast("Mở thanh tìm kiếm tin nhắn")}
                className="flex flex-col items-center gap-1 group cursor-pointer"
              >
                <div className="w-9 h-9 rounded-full bg-[#F0F2F5] group-hover:bg-[#E4E6EB] flex items-center justify-center text-[#050505]">
                  <Search size={16} />
                </div>
                <span className="text-[11px] text-[#65676B]">Tìm kiếm</span>
              </button>
            </div>
          </div>

          {/* Collapsible Accordions (Like in the Facebook Messenger Screenshot) */}
          <div className="divide-y divide-[#E4E6EB]">
            {/* 1. Thông tin về đoạn chat */}
            <div className="py-2">
              <button
                onClick={() => setAccordionChatInfo(!accordionChatInfo)}
                className="w-full px-4 py-2 flex items-center justify-between text-[14px] font-bold text-[#050505] hover:bg-[#F0F2F5] transition-colors cursor-pointer"
              >
                <span>Thông tin về đoạn chat</span>
                {accordionChatInfo ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>

              {accordionChatInfo && (
                <div className="px-2 space-y-0.5">
                  <button
                    onClick={() => setShowPinnedModal(true)}
                    className="w-full px-3 py-2 text-left text-[14px] font-semibold text-[#050505] hover:bg-[#F0F2F5] rounded-xl flex items-center gap-3 cursor-pointer"
                  >
                    <Pin size={18} className="text-[#65676B]" />
                    <span>Xem tin nhắn đã ghim</span>
                  </button>
                </div>
              )}
            </div>

            {/* 2. Tùy chỉnh đoạn chat */}
            <div className="py-2">
              <button
                onClick={() => setAccordionCustomize(!accordionCustomize)}
                className="w-full px-4 py-2 flex items-center justify-between text-[14px] font-bold text-[#050505] hover:bg-[#F0F2F5] transition-colors cursor-pointer"
              >
                <span>Tùy chỉnh đoạn chat</span>
                {accordionCustomize ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>

              {accordionCustomize && (
                <div className="px-2 space-y-0.5">
                  {/* Đổi chủ đề */}
                  <button
                    onClick={() => setShowThemeModal(true)}
                    className="w-full px-3 py-2 text-left text-[14px] font-semibold text-[#050505] hover:bg-[#F0F2F5] rounded-xl flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        style={{ backgroundColor: themeColor }}
                        className="w-4.5 h-4.5 rounded-full inline-block border border-white shadow-xs"
                      />
                      <span>Đổi chủ đề</span>
                    </div>
                  </button>

                  {/* Thay đổi biểu tượng cảm xúc */}
                  <button
                    onClick={() => setShowEmojiModal(true)}
                    className="w-full px-3 py-2 text-left text-[14px] font-semibold text-[#050505] hover:bg-[#F0F2F5] rounded-xl flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-base">{customEmoji}</span>
                      <span>Thay đổi biểu tượng cảm xúc</span>
                    </div>
                  </button>

                  {/* Chỉnh sửa biệt danh */}
                  <button
                    onClick={() => {
                      setNicknameInput(activeConversation.nickname || activeConversation.name);
                      setShowNicknameModal(true);
                    }}
                    className="w-full px-3 py-2 text-left text-[14px] font-semibold text-[#050505] hover:bg-[#F0F2F5] rounded-xl flex items-center gap-3 cursor-pointer"
                  >
                    <span className="text-sm font-bold text-[#65676B]">Aa</span>
                    <span>Chỉnh sửa biệt danh</span>
                  </button>
                </div>
              )}
            </div>

            {/* 3. File phương tiện và file */}
            <div className="py-2">
              <button
                onClick={() => setAccordionMedia(!accordionMedia)}
                className="w-full px-4 py-2 flex items-center justify-between text-[14px] font-bold text-[#050505] hover:bg-[#F0F2F5] transition-colors cursor-pointer"
              >
                <span>File phương tiện và file</span>
                {accordionMedia ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>

              {accordionMedia && (
                <div className="px-2 space-y-1">
                  <div className="p-2">
                    <p className="text-xs font-semibold text-[#65676B] mb-2 flex items-center gap-1.5">
                      <ImageIcon size={14} /> File phương tiện ({allMediaAttachments.length + allPlaceAttachments.length})
                    </p>
                    {allMediaAttachments.length > 0 || allPlaceAttachments.length > 0 ? (
                      <div className="grid grid-cols-3 gap-1.5">
                        {allMediaAttachments.map((img, i) => (
                          <img
                            key={i}
                            src={img.url}
                            alt=""
                            onClick={() => setLightboxImage(img)}
                            className="w-full aspect-square object-cover rounded-lg cursor-pointer hover:opacity-85 transition-opacity"
                          />
                        ))}
                        {allPlaceAttachments.map((p, i) => (
                          <div
                            key={`p-${i}`}
                            onClick={() => {
                              const found = places.find((item) => item.id === p.placeId);
                              if (found && onSelectPlace) onSelectPlace(found);
                            }}
                            className="relative w-full aspect-square rounded-lg overflow-hidden cursor-pointer group"
                          >
                            <img
                              src={p.img}
                              alt=""
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                            <div className="absolute inset-0 bg-black/40 flex items-end p-1 text-[10px] font-bold text-white truncate">
                              {p.name}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-[#65676B] italic">Chưa có hình ảnh được chia sẻ</p>
                    )}
                  </div>

                  <div className="p-2 pt-0">
                    <p className="text-xs font-semibold text-[#65676B] mb-2 flex items-center gap-1.5">
                      <FileText size={14} /> File ({allFileAttachments.length})
                    </p>
                    {allFileAttachments.length > 0 ? (
                      <div className="space-y-1.5">
                        {allFileAttachments.map((f, i) => (
                          <div
                            key={i}
                            className="p-2 rounded-xl bg-[#F0F2F5] flex items-center justify-between text-xs"
                          >
                            <span className="font-bold truncate">{f.name}</span>
                            <Download size={14} className="cursor-pointer text-[#65676B] hover:text-[#050505]" />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-[#65676B] italic">Chưa có file tài liệu</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* 4. Quyền riêng tư và hỗ trợ */}
            <div className="py-2">
              <button
                onClick={() => setAccordionPrivacy(!accordionPrivacy)}
                className="w-full px-4 py-2 flex items-center justify-between text-[14px] font-bold text-[#050505] hover:bg-[#F0F2F5] transition-colors cursor-pointer"
              >
                <span>Quyền riêng tư và hỗ trợ</span>
                {accordionPrivacy ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>

              {accordionPrivacy && (
                <div className="px-2 space-y-0.5">
                  <button
                    onClick={() => showToast("Đã tắt thông báo")}
                    className="w-full px-3 py-2 text-left text-[14px] font-semibold text-[#050505] hover:bg-[#F0F2F5] rounded-xl flex items-center gap-3 cursor-pointer"
                  >
                    <BellOff size={18} className="text-[#65676B]" />
                    <span>Tắt thông báo</span>
                  </button>
                  <button
                    onClick={() => showToast("Cài đặt quyền nhắn tin")}
                    className="w-full px-3 py-2 text-left text-[14px] font-semibold text-[#050505] hover:bg-[#F0F2F5] rounded-xl flex items-center gap-3 cursor-pointer"
                  >
                    <Shield size={18} className="text-[#65676B]" />
                    <span>Quyền nhắn tin</span>
                  </button>
                  <button
                    onClick={() => showToast("Bật tin nhắn tự hủy")}
                    className="w-full px-3 py-2 text-left text-[14px] font-semibold text-[#050505] hover:bg-[#F0F2F5] rounded-xl flex items-center gap-3 cursor-pointer"
                  >
                    <Clock size={18} className="text-[#65676B]" />
                    <span>Tin nhắn tự hủy</span>
                  </button>
                  <button
                    onClick={() => showToast("Thông báo đã đọc: Đang Bật")}
                    className="w-full px-3 py-2 text-left text-[14px] font-semibold text-[#050505] hover:bg-[#F0F2F5] rounded-xl flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <Eye size={18} className="text-[#65676B]" />
                      <span>Thông báo đã đọc</span>
                    </div>
                    <span className="text-xs text-[#31A24C] font-bold">Bật</span>
                  </button>
                  <button
                    onClick={() => showToast("Mã hóa đầu cuối đã được xác minh")}
                    className="w-full px-3 py-2 text-left text-[14px] font-semibold text-[#050505] hover:bg-[#F0F2F5] rounded-xl flex items-center gap-3 cursor-pointer"
                  >
                    <Lock size={18} className="text-[#65676B]" />
                    <span>Xác minh mã hóa đầu cuối</span>
                  </button>
                  <button
                    onClick={() => showToast("Hạn chế người dùng này")}
                    className="w-full px-3 py-2 text-left text-[14px] font-semibold text-[#050505] hover:bg-[#F0F2F5] rounded-xl flex items-center gap-3 cursor-pointer"
                  >
                    <Shield size={18} className="text-[#65676B]" />
                    <span>Hạn chế</span>
                  </button>
                  <button
                    onClick={() => showToast("Chặn người dùng này")}
                    className="w-full px-3 py-2 text-left text-[14px] font-semibold text-red-600 hover:bg-red-50 rounded-xl flex items-center gap-3 cursor-pointer"
                  >
                    <X size={18} />
                    <span>Chặn</span>
                  </button>
                  <button
                    onClick={() =>
                      setReportTarget({
                        targetType: "comment",
                        targetTitle: `Cuộc trò chuyện với ${activeConversation.name}`,
                        targetSubtitle: `ID: ${activeConversation.id} • ${(activeConversation as any).userCount || 2} người`,
                        targetContent: `Báo cáo nội dung vi phạm trong hội thoại với ${activeConversation.name}`,
                        targetAuthor: activeConversation.name,
                      })
                    }
                    className="w-full px-3 py-2 text-left text-[14px] font-semibold text-rose-600 hover:bg-rose-50 rounded-xl flex items-center gap-3 cursor-pointer"
                  >
                    <Flag size={18} />
                    <span>Báo cáo cuộc trò chuyện</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </aside>
      )}

      {/* ─────────────────────────────────────────────────────────────
          MODAL: ĐỔI CHỦ ĐỀ MÀU SẮC (THEME COLOR PICKER)
      ───────────────────────────────────────────────────────────── */}
      {showThemeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl p-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-[#050505]">Đổi chủ đề</h3>
              <button
                onClick={() => setShowThemeModal(false)}
                className="w-8 h-8 rounded-full bg-[#F0F2F5] hover:bg-[#E4E6EB] flex items-center justify-center text-[#65676B] cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {THEME_OPTIONS.map((theme) => (
                <button
                  key={theme.name}
                  onClick={() => handleSelectTheme(theme.color)}
                  className={`p-3 rounded-xl border flex items-center gap-2.5 transition-all cursor-pointer ${
                    themeColor === theme.color
                      ? "border-[#0084FF] bg-[#EBF5FF]"
                      : "border-[#E4E6EB] hover:bg-[#F0F2F5]"
                  }`}
                >
                  <span
                    style={{ backgroundColor: theme.color }}
                    className="w-5 h-5 rounded-full inline-block shadow-xs flex-shrink-0"
                  />
                  <span className="text-xs font-bold text-[#050505] truncate">{theme.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          MODAL: THAY ĐỔI BIỂU TƯỢNG CẢM XÚC (CUSTOM EMOJI)
      ───────────────────────────────────────────────────────────── */}
      {showEmojiModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl p-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-[#050505]">Biểu tượng cảm xúc</h3>
              <button
                onClick={() => setShowEmojiModal(false)}
                className="w-8 h-8 rounded-full bg-[#F0F2F5] hover:bg-[#E4E6EB] flex items-center justify-center text-[#65676B] cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="grid grid-cols-4 gap-3 text-center">
              {EMOJI_OPTIONS.map((em) => (
                <button
                  key={em}
                  onClick={() => handleSelectEmoji(em)}
                  className={`p-3 text-2xl rounded-xl border transition-transform hover:scale-110 cursor-pointer ${
                    customEmoji === em
                      ? "border-[#0084FF] bg-[#EBF5FF]"
                      : "border-[#E4E6EB] hover:bg-[#F0F2F5]"
                  }`}
                >
                  {em}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          MODAL: CHỈNH SỬA BIỆT DANH
      ───────────────────────────────────────────────────────────── */}
      {showNicknameModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl p-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-[#050505]">Chỉnh sửa biệt danh</h3>
              <button
                onClick={() => setShowNicknameModal(false)}
                className="w-8 h-8 rounded-full bg-[#F0F2F5] hover:bg-[#E4E6EB] flex items-center justify-center text-[#65676B] cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <input
              type="text"
              value={nicknameInput}
              onChange={(e) => setNicknameInput(e.target.value)}
              placeholder="Nhập biệt danh..."
              className="w-full px-4 py-2.5 bg-[#F0F2F5] rounded-xl text-sm font-semibold outline-none border border-transparent focus:border-[#0084FF] mb-4"
            />

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setShowNicknameModal(false)}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-[#65676B] hover:bg-[#F0F2F5] cursor-pointer"
              >
                Hủy
              </button>
              <button
                onClick={handleSaveNickname}
                style={{ backgroundColor: themeColor }}
                className="px-4 py-2 rounded-xl text-sm font-bold text-white cursor-pointer shadow-xs"
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          MODAL: TIN NHẮN ĐÃ GHIM
      ───────────────────────────────────────────────────────────── */}
      {showPinnedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl p-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Pin size={18} className="text-[#0084FF]" />
                <h3 className="text-lg font-bold text-[#050505]">Tin nhắn đã ghim</h3>
              </div>
              <button
                onClick={() => setShowPinnedModal(false)}
                className="w-8 h-8 rounded-full bg-[#F0F2F5] hover:bg-[#E4E6EB] flex items-center justify-center text-[#65676B] cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-3 bg-[#F0F2F5] rounded-xl text-sm font-semibold text-[#050505] mb-3">
              📌 "Công Ty Cổ Phần Ngọc Trang Tiêu Cục - Chi Nhánh Quận 1"
            </div>
            <div className="p-3 bg-[#F0F2F5] rounded-xl text-sm font-semibold text-[#050505]">
              📌 "Có gắn ghi sđt trước ko hay tới đó ng ta ghi"
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          MODAL: CHỌN ĐỊA ĐIỂM DU LỊCH / QUÁN ĂN (CHO PHÉP CHỌN NHIỀU ĐỊA ĐIỂM!)
      ───────────────────────────────────────────────────────────── */}
      {showPlacePicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl p-5 flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-lg font-bold text-[#050505]">Đính kèm Địa điểm vào tin nhắn</h3>
                <p className="text-xs text-[#65676B]">
                  Hỗ trợ đính kèm nhiều địa điểm cùng lúc (theo chuẩn dbo.MessageAttachments)
                </p>
              </div>
              <button
                onClick={() => setShowPlacePicker(false)}
                className="w-8 h-8 rounded-full bg-[#F0F2F5] hover:bg-[#E4E6EB] flex items-center justify-center text-[#65676B] cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Search Input */}
            <div className="relative mb-3">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#65676B]" />
              <input
                type="text"
                placeholder="Tìm kiếm địa điểm, quán ăn, danh thắng..."
                value={placeSearchQuery}
                onChange={(e) => setPlaceSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-[#F0F2F5] rounded-xl text-sm outline-none"
              />
            </div>

            {/* List Places */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {places
                .filter(
                  (p) =>
                    !placeSearchQuery ||
                    p.name.toLowerCase().includes(placeSearchQuery.toLowerCase()) ||
                    p.location.toLowerCase().includes(placeSearchQuery.toLowerCase())
                )
                .map((p) => {
                  const isSelected = selectedPlacesToAttach.some((item) => item.id === p.id);

                  return (
                    <div
                      key={p.id}
                      onClick={() => handleTogglePlaceSelect(p)}
                      className={`p-2.5 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                        isSelected
                          ? "border-[#0084FF] bg-[#EBF5FF]"
                          : "border-[#E4E6EB] hover:bg-[#F0F2F5]"
                      }`}
                    >
                      <img
                        src={p.img}
                        alt=""
                        className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-sm text-[#050505] truncate">{p.name}</h4>
                        <p className="text-xs text-[#65676B] truncate">{p.location}</p>
                        <div className="flex items-center gap-2 text-xs mt-1">
                          <span className="font-bold text-[#0084FF]">{p.price}</span>
                          <span className="flex items-center gap-0.5 text-amber-500 font-semibold">
                            <Star size={12} fill="#F59E0B" /> {p.rating}
                          </span>
                        </div>
                      </div>
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center border transition-colors ${
                          isSelected
                            ? "bg-[#0084FF] border-[#0084FF] text-white"
                            : "border-[#CCD0D5] bg-white"
                        }`}
                      >
                        {isSelected && <Check size={14} />}
                      </div>
                    </div>
                  );
                })}
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-3 mt-3 border-t border-[#E4E6EB]">
              <span className="text-xs font-semibold text-[#65676B]">
                Đã chọn: <span className="text-[#0084FF] font-bold">{selectedPlacesToAttach.length}</span> địa điểm
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowPlacePicker(false)}
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-[#65676B] hover:bg-[#F0F2F5] cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  onClick={handleConfirmAttachPlaces}
                  disabled={selectedPlacesToAttach.length === 0}
                  style={{ backgroundColor: selectedPlacesToAttach.length > 0 ? themeColor : "#E4E6EB" }}
                  className="px-5 py-2 rounded-xl text-sm font-bold text-white transition-opacity disabled:opacity-50 cursor-pointer shadow-xs"
                >
                  Đính kèm ({selectedPlacesToAttach.length})
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          LIGHTBOX MODAL (XEM ẢNH FULL MÀN HÌNH)
      ───────────────────────────────────────────────────────────── */}
      {lightboxImage && (
        <div
          onClick={() => setLightboxImage(null)}
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 backdrop-blur-xs"
        >
          <button
            onClick={() => setLightboxImage(null)}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer"
          >
            <X size={20} />
          </button>
          <img
            src={lightboxImage.url}
            alt=""
            className="max-w-[90vw] max-h-[90vh] object-contain rounded-xl shadow-2xl"
          />
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          CALL MODAL (MÔ PHỎNG CUỘC GỌI FACEBOOK)
      ───────────────────────────────────────────────────────────── */}
      {callModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/90 flex items-center justify-center p-4 backdrop-blur-md">
          <div className="bg-[#1C1E21] text-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl animate-in fade-in zoom-in-95">
            <img
              src={activeConversation.avatarUrl}
              alt=""
              className="w-24 h-24 rounded-full object-cover mx-auto mb-4 border-4 border-white/10 shadow-lg animate-pulse"
            />
            <h3 className="text-xl font-bold">{callModal.partnerName}</h3>
            <p className="text-sm text-white/60 mt-1">
              Đang gọi {callModal.type === "video" ? "video" : "thoại"}...
            </p>

            <div className="flex items-center justify-center gap-6 mt-8">
              <button
                onClick={() => setCallModal(null)}
                className="w-14 h-14 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center text-white cursor-pointer shadow-lg active:scale-95 transition-transform"
                title="Kết thúc cuộc gọi"
              >
                <Phone size={24} className="rotate-[135deg]" />
              </button>
            </div>
          </div>
        </div>
      )}

      {reportTarget && (
        <ReportModal
          initialTarget={reportTarget}
          onClose={() => setReportTarget(null)}
        />
      )}
    </div>
  );
}
