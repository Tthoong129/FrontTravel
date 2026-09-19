import { useState, useRef, useEffect } from "react";
import {
  MessageCircle,
  X,
  Minus,
  Maximize2,
  ChevronDown,
  Send,
  ImageIcon,
  ThumbsUp,
} from "lucide-react";
import Draggable from "react-draggable";
import {
  ChatMessage,
  Conversation,
  initialConversations,
  initialChatMessages,
  generateSimulatedReply,
  playChatChime,
  sampleTravelPhotos,
} from "./chatData";
import { Place, places } from "./data";

interface FloatingChatWidgetProps {
  onOpenFullChat: (convId?: string) => void;
  onSelectPlace?: (place: Place) => void;
  showToast?: (msg: string) => void;
  externalActiveConvId?: string;
}

export default function FloatingChatWidget({
  onOpenFullChat,
  onSelectPlace,
  showToast = () => {},
  externalActiveConvId,
}: FloatingChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeConvId, setActiveConvId] = useState<string>(
    externalActiveConvId || initialConversations[0].id
  );
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
  const [messagesMap, setMessagesMap] = useState<Record<string, ChatMessage[]>>(initialChatMessages);
  const [inputText, setInputText] = useState("");
  const [partnerTyping, setPartnerTyping] = useState(false);
  const [showConvPicker, setShowConvPicker] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (externalActiveConvId) {
      setActiveConvId(externalActiveConvId);
      setIsOpen(true);
    }
  }, [externalActiveConvId]);

  const activeConv = conversations.find((c) => c.id === activeConvId) || conversations[0];
  const currentMessages = messagesMap[activeConvId] || [];
  const totalUnread = conversations.reduce((acc, c) => acc + (c.unreadCount || 0), 0);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [isOpen, currentMessages, partnerTyping]);

  const handleSend = (textToSend?: string) => {
    const text = textToSend !== undefined ? textToSend : inputText.trim();
    if (!text) return;

    const newMsgId = `float_${Date.now()}`;
    const nowTime = new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });

    const newMsg: ChatMessage = {
      id: newMsgId,
      conversationId: activeConvId,
      senderId: "current-user",
      senderName: "Tôi",
      senderAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop",
      timestamp: nowTime,
      createdAt: Date.now(),
      text: text,
      status: "sent",
    };

    playChatChime("send");

    setMessagesMap((prev) => ({
      ...prev,
      [activeConvId]: [...(prev[activeConvId] || []), newMsg],
    }));

    setInputText("");

    // Simulated reply
    setTimeout(() => {
      setPartnerTyping(true);
    }, 900);

    setTimeout(() => {
      setPartnerTyping(false);
      const replyData = generateSimulatedReply(activeConv, text);
      const replyMsgId = `float_reply_${Date.now()}`;
      const replyTime = new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });

      const replyMsg: ChatMessage = {
        id: replyMsgId,
        conversationId: activeConvId,
        senderId: activeConv.id,
        senderName: activeConv.name,
        senderAvatar: activeConv.avatarUrl,
        timestamp: replyTime,
        createdAt: Date.now(),
        text: replyData.text,
        status: "read",
        attachments: replyData.attachment ? [replyData.attachment] : undefined,
      };

      playChatChime("receive");

      setMessagesMap((prev) => ({
        ...prev,
        [activeConvId]: (prev[activeConvId] || []).map((m): ChatMessage =>
          m.id === newMsgId ? { ...m, status: "read" as const } : m
        ).concat(replyMsg),
      }));
    }, 2000);
  };

  const handleAttachQuickPhoto = () => {
    const photo = sampleTravelPhotos[0];
    const newMsg: ChatMessage = {
      id: `float_img_${Date.now()}`,
      conversationId: activeConvId,
      senderId: "current-user",
      senderName: "Tôi",
      senderAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop",
      timestamp: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
      createdAt: Date.now(),
      text: "Mình gửi ảnh này nhé!",
      status: "sent",
      attachments: [
        {
          type: "image",
          url: photo.url,
          name: photo.name,
          size: photo.size,
          caption: photo.caption,
        },
      ],
    };

    playChatChime("send");

    setMessagesMap((prev) => ({
      ...prev,
      [activeConvId]: [...(prev[activeConvId] || []), newMsg],
    }));

    showToast("Đã đính kèm ảnh");
  };

  return (
    <Draggable handle=".chat-bubble-handle" bounds="body" nodeRef={dragRef}>
      <div ref={dragRef} className="fixed bottom-5 right-5 z-50 font-sans flex flex-col items-end">
        {/* ── MESSENGER POPUP TAB ── */}
        {isOpen && (
        <div className="mb-2 w-[340px] sm:w-[360px] h-[480px] bg-white rounded-2xl shadow-2xl border border-[#E4E6EB] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Header */}
          <div className="px-3.5 py-2.5 bg-white border-b border-[#E4E6EB] flex items-center justify-between text-[#050505]">
            <div className="relative flex items-center gap-2">
              <button
                onClick={() => setShowConvPicker(!showConvPicker)}
                className="flex items-center gap-2 text-left cursor-pointer hover:bg-[#F0F2F5] p-1 rounded-xl transition-colors"
              >
                <div className="relative">
                  <img
                    src={activeConv.avatarUrl}
                    alt=""
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  {activeConv.isOnline && (
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#31A24C] border border-white rounded-full" />
                  )}
                </div>
                <div>
                  <h3 className="text-xs font-bold text-[#050505] truncate flex items-center gap-1">
                    <span>{activeConv.name}</span>
                    <ChevronDown size={12} className="text-[#65676B]" />
                  </h3>
                  <p className="text-[10px] text-[#65676B]">
                    {partnerTyping ? "Đang nhập..." : activeConv.isOnline ? "Đang hoạt động" : "Ngoại tuyến"}
                  </p>
                </div>
              </button>

              {/* Dropdown switch conversation */}
              {showConvPicker && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowConvPicker(false)}
                  />
                  <div className="absolute top-10 left-0 w-56 bg-white rounded-xl shadow-xl border border-[#E4E6EB] py-1 text-[#050505] z-50">
                    {conversations.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => {
                          setActiveConvId(c.id);
                          setShowConvPicker(false);
                        }}
                        className={`w-full px-3 py-1.5 text-left text-xs flex items-center gap-2 hover:bg-[#F0F2F5] ${
                          c.id === activeConvId ? "bg-[#EBF5FF] text-[#0084FF] font-bold" : ""
                        }`}
                      >
                        <img src={c.avatarUrl} alt="" className="w-6 h-6 rounded-full object-cover" />
                        <span className="truncate flex-1">{c.name}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="flex items-center gap-0.5 text-[#0084FF]">
              <button
                onClick={() => {
                  setIsOpen(false);
                  onOpenFullChat(activeConvId);
                }}
                className="p-1.5 hover:bg-[#F0F2F5] rounded-full transition-colors"
                title="Mở toàn màn hình"
              >
                <Maximize2 size={15} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-[#F0F2F5] rounded-full transition-colors"
                title="Thu nhỏ"
              >
                <Minus size={15} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-[#F0F2F5] rounded-full transition-colors"
                title="Đóng"
              >
                <X size={15} />
              </button>
            </div>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-white">
            {currentMessages.map((m) => {
              const isMe = m.senderId === "current-user";
              return (
                <div
                  key={m.id}
                  className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`max-w-[80%] text-[14px] leading-snug break-words ${
                      isMe
                        ? "bg-[#0084FF] text-white rounded-[18px] px-3 py-1.5"
                        : "bg-[#F0F2F5] text-[#050505] rounded-[18px] px-3 py-1.5"
                    }`}
                  >
                    {m.text && <p className="whitespace-pre-wrap">{m.text}</p>}

                    {/* Mini attachments */}
                    {m.attachments?.map((att, i) => {
                      if (att.type === "image") {
                        return (
                          <img
                            key={i}
                            src={att.url}
                            alt=""
                            className="mt-1 rounded-xl w-full max-h-36 object-cover cursor-pointer"
                            onClick={() => {
                              setIsOpen(false);
                              onOpenFullChat(activeConvId);
                            }}
                          />
                        );
                      }
                      if (att.type === "place") {
                        return (
                          <div
                            key={i}
                            onClick={() => {
                              const found = places.find((p) => p.id === att.placeId);
                              if (found && onSelectPlace) onSelectPlace(found);
                            }}
                            className="mt-1 bg-white p-2 rounded-xl border border-[#E4E6EB] text-[#050505] cursor-pointer hover:bg-slate-50"
                          >
                            <img src={att.img} alt="" className="w-full h-20 rounded-lg object-cover" />
                            <p className="font-bold text-xs mt-1 truncate">{att.name}</p>
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>
                </div>
              );
            })}

            {partnerTyping && (
              <div className="flex items-center gap-1 p-2 bg-[#F0F2F5] rounded-[18px] w-16 text-[#65676B]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#65676B] animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#65676B] animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-1.5 h-1.5 rounded-full bg-[#65676B] animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <div className="p-2 bg-white border-t border-[#E4E6EB] flex items-center gap-1.5">
            <button
              onClick={handleAttachQuickPhoto}
              className="p-1.5 rounded-full hover:bg-[#F0F2F5] text-[#0084FF] transition-colors"
              title="Đính kèm ảnh"
            >
              <ImageIcon size={18} />
            </button>

            <input
              type="text"
              placeholder="Aa"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSend();
              }}
              className="flex-1 px-3 py-1.5 bg-[#F0F2F5] rounded-full text-xs text-[#050505] outline-none placeholder-[#65676B]"
            />

            {inputText.trim() ? (
              <button
                onClick={() => handleSend()}
                className="p-1.5 rounded-full text-[#0084FF] hover:bg-[#F0F2F5] transition-colors cursor-pointer"
              >
                <Send size={16} />
              </button>
            ) : (
              <button
                onClick={() => handleSend("👍")}
                className="p-1.5 rounded-full text-[#0084FF] hover:bg-[#F0F2F5] transition-colors cursor-pointer"
              >
                <ThumbsUp size={16} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── FLOATING CHAT HEAD (BONG BÓNG CHAT NỔI) ── */}
      <div className="chat-bubble-handle relative flex items-center gap-2 cursor-move mt-2">
        {/* Hover / Initial Tooltip Pill */}
        {!isOpen && (
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-white/95 backdrop-blur-md text-[#050505] text-xs font-bold rounded-full shadow-lg border border-[#E4E6EB] animate-in fade-in slide-in-from-right-2 duration-300 pointer-events-none">
            <span className="w-2 h-2 rounded-full bg-[#31A24C] animate-pulse" />
            <span>{totalUnread > 0 ? `${totalUnread} tin nhắn mới` : "Trực tuyến"}</span>
          </div>
        )}

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative w-14 h-14 rounded-full bg-gradient-to-tr from-[#00C853] via-[#0084FF] to-[#00B2FE] hover:brightness-110 text-white shadow-2xl flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-110 active:scale-95 group border-2 border-white ring-4 ring-[#0084FF]/20"
          title="Tin nhắn LangThang"
        >
          {isOpen ? (
            <X size={24} className="transition-transform group-hover:rotate-90 duration-200" />
          ) : (
            <div className="relative flex items-center justify-center">
              <MessageCircle size={26} className="fill-white/20" />
              {totalUnread > 0 && (
                <span className="absolute -top-2.5 -right-2.5 px-1.5 min-w-[20px] h-[20px] bg-[#E41E3F] text-white font-black text-[10px] rounded-full border-2 border-white flex items-center justify-center shadow-md animate-bounce">
                  {totalUnread}
                </span>
              )}
            </div>
          )}
        </button>
      </div>
    </div>
    </Draggable>
  );
}
