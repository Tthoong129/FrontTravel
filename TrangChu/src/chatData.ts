import { Place, places } from "./data";

export type AttachmentType = "image" | "file" | "place" | "itinerary" | "audio" | "location";

export interface ImageAttachment {
  type: "image";
  url: string;
  name?: string;
  size?: string;
  width?: number;
  height?: number;
  caption?: string;
}

export interface FileAttachment {
  type: "file";
  name: string;
  size: string;
  fileType: "pdf" | "doc" | "xls" | "zip" | "txt";
  url?: string;
}

export interface PlaceAttachment {
  type: "place";
  placeId: number;
  name: string;
  location: string;
  category: string;
  rating: number;
  price: string;
  img: string;
  desc: string;
  reviewCount?: number;
  openStatus?: string;
  phone?: string;
  mapSnapshotUrl?: string;
  subtitle?: string;
}

export interface ItineraryAttachment {
  type: "itinerary";
  title: string;
  duration: string;
  stopsCount: number;
  budget: string;
  coverImg: string;
  highlights: string[];
}

export interface AudioAttachment {
  type: "audio";
  duration: string; // e.g. "0:28"
  waveform: number[]; // heights 0 to 100
}

export interface LocationAttachment {
  type: "location";
  name: string;
  address: string;
  lat: number;
  lng: number;
}

export type ChatAttachment =
  | ImageAttachment
  | FileAttachment
  | PlaceAttachment
  | ItineraryAttachment
  | AudioAttachment
  | LocationAttachment;

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string; // "current-user" or friend user ID
  senderName: string;
  senderAvatar: string;
  timestamp: string; // e.g. "10:32"
  createdAt: number;
  text: string;
  status: "sending" | "sent" | "delivered" | "read";
  replyTo?: {
    id: string;
    senderName: string;
    text: string;
    attachmentSummary?: string;
  };
  reactions?: Record<string, number>;
  userReactions?: string[];
  attachments?: ChatAttachment[];
  readReceiptAvatar?: string;
  themeColor?: string;
}

export interface Conversation {
  id: string;
  type: "direct" | "group" | "assistant";
  name: string;
  avatarUrl: string;
  isOnline: boolean;
  lastSeen?: string;
  unreadCount: number;
  isPinned?: boolean;
  isMuted?: boolean;
  bio?: string;
  city?: string;
  friendUserId?: number;
  themeColor?: string;
  customEmoji?: string;
  nickname?: string;
  members?: {
    id: string;
    name: string;
    avatarUrl: string;
    role?: string;
    isOnline?: boolean;
  }[];
  lastMessage?: {
    text: string;
    timestamp: string;
    senderId: string;
    status?: "sending" | "sent" | "delivered" | "read";
    hasAttachment?: boolean;
    attachmentLabel?: string;
    isReply?: boolean;
  };
}

// ── Web Audio Synthesizer for message chimes ──
export function playChatChime(type: "send" | "receive" = "receive") {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    if (type === "send") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(580, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.14);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } else {
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();
      osc1.type = "triangle";
      osc2.type = "sine";
      osc1.frequency.setValueAtTime(520, ctx.currentTime);
      osc1.frequency.setValueAtTime(780, ctx.currentTime + 0.08);
      osc2.frequency.setValueAtTime(1040, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.28);
      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);
      osc1.start();
      osc2.start(ctx.currentTime + 0.08);
      osc1.stop(ctx.currentTime + 0.29);
      osc2.stop(ctx.currentTime + 0.29);
    }
  } catch (e) {
    // AudioContext might be blocked before first user interaction
  }
}

// ── Initial Conversations (Directly mapped to dbo.ChatRooms & dbo.ChatRoomMembers) ──
export const initialConversations: Conversation[] = [
  {
    id: "c_nam",
    type: "direct",
    name: "Lê Hoàng Nam",
    avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop",
    isOnline: true,
    lastSeen: "Đang hoạt động",
    unreadCount: 0,
    isPinned: true,
    themeColor: "#00C853", // Messenger Green
    customEmoji: "👍",
    bio: "Nhà thám hiểm Sa Pa & Hướng dẫn viên trekking mây trời Fansipan.",
    city: "Lào Cai",
    friendUserId: 1,
    lastMessage: {
      text: "Có chỗ để xe máy ngay trước cửa nhé bạn, nhân viên trông chu đáo lắm!",
      timestamp: "14:44",
      senderId: "u_nam",
      status: "read",
    },
  },
  {
    id: "c_linh",
    type: "direct",
    name: "Trần Mai Linh",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
    isOnline: true,
    lastSeen: "Đang hoạt động",
    unreadCount: 1,
    themeColor: "#0084FF",
    bio: "Food reviewer & người yêu những góc quán cà phê cổ Hà Nội.",
    city: "Hà Nội",
    friendUserId: 2,
    lastMessage: {
      text: "Quán phở này nước dùng thanh ngọt lắm, bạn ghé thử chưa?",
      timestamp: "7 phút",
      senderId: "u_linh",
      status: "delivered",
    },
  },
  {
    id: "c_tuan",
    type: "direct",
    name: "Nguyễn Quốc Tuấn",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop",
    isOnline: false,
    lastSeen: "Hoạt động 3 ngày trước",
    unreadCount: 0,
    themeColor: "#0084FF",
    bio: "Hướng dẫn viên du lịch Đà Nẵng - Hội An - Cù Lao Chàm.",
    city: "Đà Nẵng",
    lastMessage: {
      text: "Tuần sau nhóm mình có chuyến khám phá phố cổ Hội An nhé!",
      timestamp: "3 ngày · Trả lời?",
      senderId: "u_tuan",
      isReply: true,
    },
  },
  {
    id: "c_thao",
    type: "direct",
    name: "Đặng Thu Thảo",
    avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop",
    isOnline: false,
    lastSeen: "Hoạt động 1 tuần trước",
    unreadCount: 0,
    themeColor: "#8B5CF6",
    bio: "Nhiếp ảnh gia săn mây Đà Lạt & cắm trại đồi thông.",
    city: "Lâm Đồng",
    friendUserId: 5,
    lastMessage: {
      text: "Mình gửi ảnh hoàng hôn đồi thông chiều nay nhé!",
      timestamp: "1 tuần",
      senderId: "u_thao",
    },
  },
  {
    id: "c_group_xuyenviet",
    type: "group",
    name: "Hội Phượt Xuyên Việt 2026",
    avatarUrl: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=150&h=150&fit=crop",
    isOnline: true,
    lastSeen: "8 thành viên trực tuyến",
    unreadCount: 3,
    themeColor: "#0084FF",
    bio: "Nhóm những tâm hồn tự do yêu thích cung đường ven biển và đèo Tây Bắc.",
    city: "Việt Nam",
    members: [
      { id: "current-user", name: "Bạn", avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop", role: "Trưởng đoàn", isOnline: true },
      { id: "u_nam", name: "Lê Hoàng Nam", avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop", role: "Dẫn đường", isOnline: true },
      { id: "u_linh", name: "Trần Mai Linh", avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop", role: "Hậu cần", isOnline: true },
      { id: "u_thao", name: "Đặng Thu Thảo", avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop", role: "Nhiếp ảnh", isOnline: false },
      { id: "u_bao", name: "Phạm Quốc Bảo", avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop", role: "Thành viên", isOnline: true },
    ],
    lastMessage: {
      text: "Lịch trình 3N2Đ săn mây Đà Lạt đã chốt xong mọi người ơi!",
      timestamp: "Hôm qua",
      senderId: "u_thao",
      hasAttachment: true,
      attachmentLabel: "Lịch trình",
    },
  },
  {
    id: "c_assistant",
    type: "assistant",
    name: "Trợ lý Du lịch LangThang AI",
    avatarUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&h=150&fit=crop",
    isOnline: true,
    lastSeen: "Phản hồi tức thì 24/7",
    unreadCount: 0,
    isPinned: false,
    themeColor: "#0084FF",
    bio: "Trợ lý thông minh hỗ trợ tìm điểm đến, lịch trình và mẹo ẩm thực khắp Việt Nam.",
    city: "Toàn quốc",
    lastMessage: {
      text: "Bạn đang muốn đi đâu dịp cuối tuần này? Hãy hỏi mình nhé!",
      timestamp: "09:15",
      senderId: "u_assistant",
      status: "read",
    },
  },
];

// ── Sample Initial Messages ──
export const initialChatMessages: Record<string, ChatMessage[]> = {
  c_nam: [
    {
      id: "m_nam_0",
      conversationId: "c_nam",
      senderId: "current-user",
      senderName: "Tôi",
      senderAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop",
      timestamp: "14:38",
      createdAt: Date.now() - 1000 * 60 * 60 * 72 + 1000 * 60,
      text: "",
      status: "read",
      attachments: [
        {
          type: "place",
          placeId: 1,
          name: "Phở Thìn Bờ Hồ - Hoàn Kiếm",
          subtitle: "Ẩm thực truyền thống Hà Nội · 50.000đ – 80.000đ",
          location: "61 Đinh Tiên Hoàng, Lý Thái Tổ, Hoàn Kiếm, Hà Nội",
          category: "Nhà hàng & Ẩm thực",
          rating: 4.9,
          reviewCount: 850,
          price: "Đang mở cửa · Đóng cửa vào 22:00",
          phone: "024 3825 8888",
          img: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=600&h=350&fit=crop",
          mapSnapshotUrl: "https://images.unsplash.com/photo-1524661135-423995f22d0b?w=600&h=200&fit=crop",
          desc: "Thương hiệu phở gia truyền hơn 70 năm cạnh hồ Hoàn Kiếm, nước dùng trong vắt ngọt thanh từ xương bò tươi.",
        },
      ],
    },
    {
      id: "m_nam_1",
      conversationId: "c_nam",
      senderId: "current-user",
      senderName: "Tôi",
      senderAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop",
      timestamp: "14:39",
      createdAt: Date.now() - 1000 * 60 * 60 * 72 + 1000 * 120,
      text: "Bữa bạn gửi mình quán phở này đúng không?",
      status: "read",
    },
    {
      id: "m_nam_2",
      conversationId: "c_nam",
      senderId: "current-user",
      senderName: "Tôi",
      senderAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop",
      timestamp: "14:40",
      createdAt: Date.now() - 1000 * 60 * 60 * 72 + 1000 * 180,
      text: "Quán này mở cửa từ mấy giờ sáng vậy bạn?",
      status: "read",
    },
    {
      id: "m_nam_3",
      conversationId: "c_nam",
      senderId: "u_nam",
      senderName: "Lê Hoàng Nam",
      senderAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop",
      timestamp: "14:41",
      createdAt: Date.now() - 1000 * 60 * 60 * 72 + 1000 * 240,
      text: "Hỏi người nhà tớ á",
      status: "read",
    },
    {
      id: "m_nam_4",
      conversationId: "c_nam",
      senderId: "u_nam",
      senderName: "Lê Hoàng Nam",
      senderAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop",
      timestamp: "14:41",
      createdAt: Date.now() - 1000 * 60 * 60 * 72 + 1000 * 260,
      text: "À nhớ rồi, quán mở từ 6h sáng nha",
      status: "read",
    },
    {
      id: "m_nam_5",
      conversationId: "c_nam",
      senderId: "u_nam",
      senderName: "Lê Hoàng Nam",
      senderAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop",
      timestamp: "14:42",
      createdAt: Date.now() - 1000 * 60 * 60 * 72 + 1000 * 300,
      text: "Đúng rồi đó, nước dùng ngọt thanh từ xương bò hầm thơm nức mũi luôn!",
      status: "read",
      replyTo: {
        id: "m_nam_1",
        senderName: "Lê Hoàng Nam đã trả lời bạn",
        text: "Bữa bạn gửi mình quán phở này đúng không?",
      },
    },
    {
      id: "m_nam_6",
      conversationId: "c_nam",
      senderId: "current-user",
      senderName: "Tôi",
      senderAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop",
      timestamp: "14:43",
      createdAt: Date.now() - 1000 * 60 * 60 * 72 + 1000 * 360,
      text: "Quán có chỗ để xe máy thuận tiện không hay phải gửi ngoài bạn nhỉ?",
      status: "read",
      readReceiptAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop",
    },
    {
      id: "m_nam_7",
      conversationId: "c_nam",
      senderId: "u_nam",
      senderName: "Lê Hoàng Nam",
      senderAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop",
      timestamp: "14:44",
      createdAt: Date.now() - 1000 * 60 * 60 * 72 + 1000 * 420,
      text: "Có chỗ để xe máy ngay trước cửa nhé bạn, nhân viên trông chu đáo lắm!",
      status: "read",
    },
  ],

  c_assistant: [
    {
      id: "m_ast_1",
      conversationId: "c_assistant",
      senderId: "u_assistant",
      senderName: "Trợ lý LangThang AI",
      senderAvatar: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&h=150&fit=crop",
      timestamp: "09:00",
      createdAt: Date.now() - 1000 * 60 * 60,
      text: "Xin chào bạn! Mình là Trợ lý du lịch LangThang AI 🎒. Mình có thể giúp bạn gợi ý địa điểm ăn uống, tìm khách sạn, thiết kế lịch trình hoặc kiểm tra thời tiết tại mọi tỉnh thành Việt Nam.",
      status: "read",
    },
    {
      id: "m_ast_2",
      conversationId: "c_assistant",
      senderId: "current-user",
      senderName: "Tôi",
      senderAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop",
      timestamp: "09:12",
      createdAt: Date.now() - 1000 * 60 * 48,
      text: "Cuối tuần này mình muốn đi một chuyến nghỉ dưỡng ngắn ngày gần Hà Nội hoặc miền Trung, có chỗ nào vừa đẹp vừa ăn ngon không bot?",
      status: "read",
    },
    {
      id: "m_ast_3",
      conversationId: "c_assistant",
      senderId: "u_assistant",
      senderName: "Trợ lý LangThang AI",
      senderAvatar: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&h=150&fit=crop",
      timestamp: "09:15",
      createdAt: Date.now() - 1000 * 60 * 45,
      text: "Gợi ý số một cho bạn là khám phá phố cổ Hội An & Thừa Thiên Huế! Khí hậu tháng này rất dễ chịu, ẩm thực phong phú và chi phí cực kỳ hợp lý. Dưới đây là địa điểm nổi bật đang có đánh giá 4.9⭐ trên LangThang:",
      status: "read",
      attachments: [
        {
          type: "place",
          placeId: 3,
          name: "Bánh Mì Phượng",
          location: "Hội An, Quảng Nam",
          category: "Tiệm bánh & Ẩm thực",
          rating: 4.9,
          price: "25.000đ – 40.000đ",
          img: "https://images.unsplash.com/photo-1763703686284-b63557b08a86?w=600&h=400&fit=crop",
          desc: "Ổ bánh mì huyền thoại được Anthony Bourdain khen ngợi ngon nhất thế giới. Vỏ giòn tan, sốt pate béo ngậy.",
        },
      ],
      reactions: { "👍": 1 },
    },
  ],

  c_linh: [
    {
      id: "m_linh_1",
      conversationId: "c_linh",
      senderId: "current-user",
      senderName: "Tôi",
      senderAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop",
      timestamp: "Hôm qua 15:20",
      createdAt: Date.now() - 1000 * 60 * 60 * 20,
      text: "Linh ơi, sáng mai mình có cuộc hẹn ở khu phố cổ Hà Nội, có quán ăn sáng nào chuẩn vị người Tràng An xưa không bạn?",
      status: "read",
    },
    {
      id: "m_linh_2",
      conversationId: "c_linh",
      senderId: "u_linh",
      senderName: "Trần Mai Linh",
      senderAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
      timestamp: "Hôm qua 15:25",
      createdAt: Date.now() - 1000 * 60 * 60 * 19,
      text: "Bạn phải qua ngay Phở Thìn Bờ Hồ nhé! Nước dùng ngọt thanh từ xương bò hầm cả đêm, không nhiều mì chính như chỗ khác. Mình đính kèm thẻ địa điểm bạn mở bản đồ đi cho tiện nè:",
      status: "read",
      attachments: [
        {
          type: "place",
          placeId: 1,
          name: "Phở Thìn Bờ Hồ",
          location: "Hoàn Kiếm, Hà Nội",
          category: "Nhà hàng",
          rating: 4.9,
          price: "45.000đ – 80.000đ",
          img: "https://images.unsplash.com/photo-1527997921830-de1cf1f9b430?w=600&h=400&fit=crop",
          desc: "Quán phở gia truyền hơn 50 năm với nước dùng ngọt trong, thơm lừng xương bò hầm cả đêm. Đậm chất Hà Nội.",
        },
      ],
      reactions: { "❤️": 1, "😋": 1 },
    },
    {
      id: "m_linh_3",
      conversationId: "c_linh",
      senderId: "u_linh",
      senderName: "Trần Mai Linh",
      senderAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
      timestamp: "Hôm qua 15:28",
      createdAt: Date.now() - 1000 * 60 * 60 * 18,
      text: "Quán phở này nước dùng thanh ngọt lắm, nhất định phải thử!",
      status: "read",
    },
  ],

  c_group_xuyenviet: [
    {
      id: "m_grp_1",
      conversationId: "c_group_xuyenviet",
      senderId: "u_nam",
      senderName: "Lê Hoàng Nam",
      senderAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop",
      timestamp: "Hôm qua 08:30",
      createdAt: Date.now() - 1000 * 60 * 60 * 26,
      text: "Chào cả team! Chuyến đi Đà Lạt - Nam Tây Nguyên cuối tháng đã có bản thảo lịch trình chi tiết rồi nhé.",
      status: "read",
    },
    {
      id: "m_grp_2",
      conversationId: "c_group_xuyenviet",
      senderId: "u_thao",
      senderName: "Đặng Thu Thảo",
      senderAvatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop",
      timestamp: "Hôm qua 08:45",
      createdAt: Date.now() - 1000 * 60 * 60 * 25,
      text: "Mình đã gắn kèm chi tiết hành trình 3N2Đ cùng dự trù chi phí bên dưới. Mọi người xem qua rồi bấm vote nha!",
      status: "read",
      attachments: [
        {
          type: "itinerary",
          title: "Đà Lạt - Thành phố mộng mơ & Săn Mây Cầu Đất",
          duration: "3 Ngày 2 Đêm",
          stopsCount: 7,
          budget: "2.800.000đ / người",
          coverImg: "https://images.unsplash.com/photo-1733372607228-6aeaa92c5e62?w=600&h=400&fit=crop",
          highlights: ["Đồi chè Cầu Đất", "Rừng thông Dasar", "Hồ Tuyền Lâm", "Chợ đêm Đà Lạt"],
        },
      ],
      reactions: { "🔥": 4, "👍": 3 },
    },
    {
      id: "m_grp_3",
      conversationId: "c_group_xuyenviet",
      senderId: "u_bao",
      senderName: "Phạm Quốc Bảo",
      senderAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop",
      timestamp: "Hôm qua 09:10",
      createdAt: Date.now() - 1000 * 60 * 60 * 24,
      text: "Lịch trình này quá hợp lý luôn! Mình nhận lái xe chặng đèo Prenn nhé anh em.",
      status: "read",
    },
    {
      id: "m_grp_4",
      conversationId: "c_group_xuyenviet",
      senderId: "current-user",
      senderName: "Tôi",
      senderAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop",
      timestamp: "Hôm qua 09:20",
      createdAt: Date.now() - 1000 * 60 * 60 * 23,
      text: "Nhất trí! Mình sẽ phụ trách đặt homestay và liên hệ bên thuê xe máy nha.",
      status: "read",
    },
  ],

  c_thao: [
    {
      id: "m_thao_1",
      conversationId: "c_thao",
      senderId: "u_thao",
      senderName: "Đặng Thu Thảo",
      senderAvatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop",
      timestamp: "14/09 16:10",
      createdAt: Date.now() - 1000 * 60 * 60 * 48,
      text: "Ghé đồi chè lúc 5 giờ sáng đón được biển mây dày đặc thích lắm bạn ơi!",
      status: "read",
      attachments: [
        {
          type: "image",
          url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&h=800&fit=crop",
          caption: "Bình minh trên cao nguyên Dasar",
          name: "binh-minh-dasar.jpg",
          size: "3.5 MB",
        },
      ],
    },
  ],
};

// Preset travel photos for easy simulated upload
export const sampleTravelPhotos = [
  {
    name: "Ruong-bac-thang-Mu-Cang-Chai.jpg",
    url: "https://images.unsplash.com/photo-1609412058473-c199497c3c5d?w=1200&h=800&fit=crop",
    caption: "Mùa lúa chín rực rỡ Mù Cang Chải",
    size: "3.4 MB",
  },
  {
    name: "Pho-co-Hoi-An-ve-dem.jpg",
    url: "https://images.unsplash.com/photo-1691927644490-e1a24b366a5e?w=1200&h=800&fit=crop",
    caption: "Đèn lồng lung linh bên dòng sông Hoài, Hội An",
    size: "2.9 MB",
  },
  {
    name: "Vinh-Ha-Long-hoang-hon.jpg",
    url: "https://images.unsplash.com/photo-1589291432463-fbddbfd10bbd?w=1200&h=800&fit=crop",
    caption: "Hoàng hôn kỳ vĩ trên Vịnh Hạ Long",
    size: "4.1 MB",
  },
  {
    name: "Da-Lat-ngap-tran-hoa.jpg",
    url: "https://images.unsplash.com/photo-1733372607228-6aeaa92c5e62?w=1200&h=800&fit=crop",
    caption: "Mùa hoa dã quỳ nở vàng các triền đồi Đà Lạt",
    size: "2.7 MB",
  },
  {
    name: "Am-thuc-Sai-Gon.jpg",
    url: "https://images.unsplash.com/photo-1687902409602-8b7cf039a44a?w=1200&h=800&fit=crop",
    caption: "Hương vị ẩm thực hẻm phố Sài Gòn",
    size: "2.1 MB",
  },
];

// Preset sample files for simulated file attachments
export const sampleTravelFiles = [
  {
    name: "Lich-trinh-chi-tiet-Phuot-Tay-Bac-5N4D.pdf",
    size: "3.6 MB",
    fileType: "pdf" as const,
  },
  {
    name: "Bang-du-tru-kinh-phi-chuyen-di-Xuyen-Viet.xlsx",
    size: "1.2 MB",
    fileType: "xls" as const,
  },
  {
    name: "Danh-sach-do-trekking-rung-nui.docx",
    size: "840 KB",
    fileType: "doc" as const,
  },
  {
    name: "Bo-anh-goc-Vinh-Ha-Long-RAW.zip",
    size: "48.5 MB",
    fileType: "zip" as const,
  },
];

// Contextual real-time reply generator
export function generateSimulatedReply(
  conversation: Conversation,
  userMessageText: string,
  hasAttachment?: boolean
): { text: string; attachment?: ChatAttachment } {
  const lower = userMessageText.toLowerCase();

  // 1. AI Assistant Replies
  if (conversation.type === "assistant") {
    if (lower.includes("phở") || lower.includes("hà nội") || lower.includes("ăn gì")) {
      return {
        text: "Hà Nội mùa này ăn phở nóng là tuyệt nhất! Mình gợi ý cho bạn quán phở bò gia truyền trứ danh này:",
        attachment: {
          type: "place",
          placeId: 1,
          name: "Phở Thìn Bờ Hồ",
          location: "Hoàn Kiếm, Hà Nội",
          category: "Nhà hàng",
          rating: 4.9,
          price: "45.000đ – 80.000đ",
          img: "https://images.unsplash.com/photo-1527997921830-de1cf1f9b430?w=600&h=400&fit=crop",
          desc: "Quán phở gia truyền hơn 50 năm với nước dùng ngọt trong, đậm đà hương vị cổ truyền.",
        },
      };
    }
    if (lower.includes("đà lạt") || lower.includes("lịch trình") || lower.includes("chuyến đi")) {
      return {
        text: "Đà Lạt đang có thời tiết rất đẹp vào buổi sớm! Đây là gợi ý lịch trình 3N2Đ săn mây và cà phê đồi thông dành cho bạn:",
        attachment: {
          type: "itinerary",
          title: "Đà Lạt - Thành phố mộng mơ & Săn Mây Cầu Đất",
          duration: "3 Ngày 2 Đêm",
          stopsCount: 7,
          budget: "2.800.000đ / người",
          coverImg: "https://images.unsplash.com/photo-1733372607228-6aeaa92c5e62?w=600&h=400&fit=crop",
          highlights: ["Đồi chè Cầu Đất", "Rừng thông Dasar", "Hồ Tuyền Lâm"],
        },
      };
    }
    if (hasAttachment) {
      return {
        text: "Tệp đính kèm bạn gửi rất thú vị! Mình đã ghi nhận thông tin và sẵn sàng hỗ trợ bạn tìm kiếm điểm đến phù hợp tiếp theo.",
      };
    }
    return {
      text: `Chào bạn! Cảm ơn câu hỏi: "${userMessageText}". Dựa trên kinh nghiệm du lịch LangThang, bạn nên lên kế hoạch trước ít nhất 1 tuần và kiểm tra thời tiết cẩn thận để có trải nghiệm tuyệt vời nhất nhé!`,
    };
  }

  // 2. Nam Sa Pa
  if (conversation.id === "c_nam") {
    if (hasAttachment) {
      return {
        text: "Cảm ơn bạn đã gửi! Hình ảnh / tệp đính kèm rõ ràng lắm. Mình sẽ lưu lại vào thư mục chuyến đi chung ngay nhé!",
      };
    }
    if (lower.includes("fansipan") || lower.includes("leo") || lower.includes("núi")) {
      return {
        text: "Chuẩn luôn bạn ơi! Nếu đi đợt này nhớ mang áo gió chống nước 2 lớp và giày có gai bám tốt nhé, đường đèo sớm có sương mù ẩm ướt đó.",
      };
    }
    return {
      text: "Tuyệt vời! Mình vừa xem lại dự báo thời tiết, cuối tuần sau nắng ráo rất thuận lợi. Bạn cần mình chuẩn bị thêm porter hay lều trại không?",
    };
  }

  // 3. Linh Foodie
  if (conversation.id === "c_linh") {
    if (hasAttachment) {
      return {
        text: "Oa địa điểm / hình ảnh bạn gửi trông hấp dẫn quá! Để mình thêm ngay vào cẩm nang ẩm thực tuần này nhé!",
      };
    }
    return {
      text: "Đồng ý luôn! Nhắc tới món này là thèm ghé lại rồi. Chiều mai bạn rảnh thì cùng lượn một vòng phố cổ cà phê trứng luôn nhé!",
    };
  }

  // 4. Group Chat
  if (conversation.type === "group") {
    return {
      text: "Cả nhà cùng xem qua và cho ý kiến nhé! Ai có góp ý thêm địa điểm hay món ngon nào thì gửi vào khung chat luôn nào 🎒🔥",
    };
  }

  // Default fallback
  return {
    text: "Mình đã nhận được tin nhắn của bạn! Cùng nhau chuẩn bị cho hành trình sắp tới nhé ✨",
  };
}
