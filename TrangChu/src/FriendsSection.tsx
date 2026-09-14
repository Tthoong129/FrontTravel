import { useState } from "react";
import { FriendUser, initialFriendsData } from "./data";
import { Search, MapPin, UserPlus, X, MoreHorizontal, MessageCircle, UserX, Check, UserMinus, Filter } from "lucide-react";

interface FriendsSectionProps {
  currentUserName?: string;
  onSelectUserHistory?: (friend: FriendUser) => void;
  showToast: (msg: string) => void;
  onViewTripDetail?: (tripId: number) => void;
}

export default function FriendsSection({
  showToast,
  onViewTripDetail,
}: FriendsSectionProps) {
  const [friends, setFriends] = useState<FriendUser[]>(initialFriendsData);
  const [activeTab, setActiveTab] = useState<"accepted" | "suggestions" | "incoming" | "outgoing" | "blocked">("accepted");
  
  // Search and Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestionSearchQuery, setSuggestionSearchQuery] = useState("");
  const [suggestionCityFilter, setSuggestionCityFilter] = useState("all");

  const [selectedProfileUser, setSelectedProfileUser] = useState<FriendUser | null>(null);
  const [unfriendConfirmUser, setUnfriendConfirmUser] = useState<FriendUser | null>(null);

  const acceptedFriends = friends.filter((f) => f.status === "accepted");
  const incomingRequests = friends.filter((f) => f.status === "pending_incoming");
  const outgoingRequests = friends.filter((f) => f.status === "pending_outgoing");
  const blockedUsers = friends.filter((f) => f.status === "blocked");
  const allSuggestions = friends.filter((f) => f.status === "suggestion").sort((a, b) => (b.reputationScore || 0) - (a.reputationScore || 0));

  const filterUser = (u: FriendUser) => {
    const q = searchQuery.toLowerCase().trim();
    return !q || u.fullName.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
  };

  const filterSuggestion = (u: FriendUser) => {
    const q = suggestionSearchQuery.toLowerCase().trim();
    const matchQ = !q || u.fullName.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
    const matchCity = suggestionCityFilter === "all" || u.city.includes(suggestionCityFilter);
    return matchQ && matchCity;
  };

  const displayedAccepted = acceptedFriends.filter(filterUser);
  const displayedIncoming = incomingRequests.filter(filterUser);
  const displayedOutgoing = outgoingRequests.filter(filterUser);
  const displayedBlocked = blockedUsers.filter(filterUser);
  const displayedSuggestions = allSuggestions.filter(filterSuggestion);

  // Extract unique cities from suggestions for the filter dropdown
  const uniqueCities = Array.from(new Set(allSuggestions.map(s => s.city.split(',')[0].trim())));

  const handleAccept = (friend: FriendUser) => {
    setFriends((prev) => prev.map((f) => f.id === friend.id ? { ...f, status: "accepted", connectedDate: "Vừa kết bạn" } : f));
    showToast(`Đã kết bạn với ${friend.fullName}.`);
  };

  const handleDecline = (friend: FriendUser) => {
    setFriends((prev) => prev.map((f) => (f.id === friend.id ? { ...f, status: "suggestion" } : f)));
    showToast(`Đã gỡ lời mời từ ${friend.fullName}.`);
  };

  const handleSendRequest = (friend: FriendUser) => {
    setFriends((prev) => prev.map((f) => (f.id === friend.id ? { ...f, status: "pending_outgoing" } : f)));
    showToast(`Đã gửi lời mời đến ${friend.fullName}.`);
  };

  const handleCancelOutgoing = (friend: FriendUser) => {
    setFriends((prev) => prev.map((f) => (f.id === friend.id ? { ...f, status: "suggestion" } : f)));
    showToast(`Đã hủy lời mời gửi đến ${friend.fullName}.`);
  };

  const handleUnfriendConfirm = () => {
    if (!unfriendConfirmUser) return;
    setFriends((prev) => prev.map((f) => f.id === unfriendConfirmUser.id ? { ...f, status: "suggestion" } : f));
    showToast(`Đã hủy kết bạn với ${unfriendConfirmUser.fullName}.`);
    setUnfriendConfirmUser(null);
  };

  const handleUnblock = (friend: FriendUser) => {
    setFriends((prev) => prev.map((f) => f.id === friend.id ? { ...f, status: "suggestion", blockedDate: undefined } : f));
    showToast(`Đã bỏ chặn ${friend.fullName}.`);
  };

  const tabs = [
    { key: "accepted" as const, label: "Tất cả bạn bè", count: acceptedFriends.length },
    { key: "suggestions" as const, label: "Khám phá bạn mới", count: 0 },
    { key: "incoming" as const, label: "Lời mời kết bạn", count: incomingRequests.length },
    { key: "outgoing" as const, label: "Đã gửi", count: outgoingRequests.length },
    { key: "blocked" as const, label: "Đã chặn", count: blockedUsers.length },
  ];

  return (
    <div className="min-h-screen bg-[#F0F2F5] font-sans text-[#1C1E21] antialiased">
      
      <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col lg:flex-row gap-6 items-start">
        {/* Left Sidebar Menu */}
        <aside className="w-full lg:w-[320px] bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex-shrink-0 lg:sticky lg:top-6">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Bạn bè</h1>
          </div>
          
          <div className="p-3 space-y-1">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => {
                     setActiveTab(tab.key);
                     setSearchQuery("");
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors cursor-pointer ${
                    isActive ? "bg-[#E7F3FF] font-bold text-[#1877F2]" : "hover:bg-gray-100 font-semibold text-gray-700"
                  }`}
                >
                  <span className="text-[15px]">{tab.label}</span>
                  {tab.count > 0 && (
                     <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${isActive ? 'bg-[#1877F2] text-white' : 'bg-gray-200 text-gray-600'}`}>
                       {tab.count}
                     </span>
                  )}
                </button>
              );
            })}
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="w-full flex-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 sm:p-6 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                {tabs.find(t => t.key === activeTab)?.label}
              </h2>
              
              {/* Search bar specifically for regular tabs */}
              {activeTab !== "suggestions" && (
                <div className="relative w-full sm:w-72">
                  <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm bạn bè..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:border-blue-500 focus:bg-white text-[15px] text-gray-900 placeholder-gray-500 transition-all"
                  />
                </div>
              )}
            </div>

            {/* List Content */}
            <div>
              {/* 1. Accepted Friends */}
              {activeTab === "accepted" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {displayedAccepted.length === 0 && <p className="text-gray-500 col-span-2 text-center py-8">Không tìm thấy bạn bè nào.</p>}
                  {displayedAccepted.map((friend) => (
                    <div key={friend.id} className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-xl border border-gray-200 bg-white hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-4 flex-1">
                         <img src={friend.avatarUrl} alt="" className="w-16 h-16 rounded-full object-cover border border-gray-100 cursor-pointer" onClick={() => setSelectedProfileUser(friend)} />
                         <div className="flex-1 min-w-0">
                           <button onClick={() => setSelectedProfileUser(friend)} className="font-bold text-[16px] text-gray-900 hover:text-blue-600 truncate w-full text-left">
                             {friend.fullName}
                           </button>
                           <p className="text-xs text-gray-500 mt-0.5">{friend.mutualFriendsCount} bạn chung</p>
                         </div>
                      </div>
                      <div className="flex items-center gap-2 mt-3 sm:mt-0">
                         <button className="flex-1 sm:flex-none px-4 py-2 bg-[#E7F3FF] hover:bg-[#DBE7F2] text-[#1877F2] font-semibold text-sm rounded-lg cursor-pointer transition-colors flex items-center justify-center gap-2">
                           <MessageCircle size={16} /> Nhắn tin
                         </button>
                         <button onClick={() => setUnfriendConfirmUser(friend)} className="px-3 py-2 bg-gray-100 hover:bg-red-50 text-gray-700 hover:text-red-600 font-semibold text-sm rounded-lg cursor-pointer transition-colors" title="Hủy kết bạn">
                           <UserX size={16} />
                         </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* 2. FIND NEW FRIENDS (SUGGESTIONS) */}
              {activeTab === "suggestions" && (
                <div>
                   {/* Advanced Filters */}
                   <div className="flex flex-col sm:flex-row gap-3 mb-6 bg-gray-50 p-4 rounded-xl border border-gray-100">
                     <div className="relative flex-1">
                       <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                       <input
                         type="text"
                         placeholder="Tìm theo tên..."
                         value={suggestionSearchQuery}
                         onChange={(e) => setSuggestionSearchQuery(e.target.value)}
                         className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 text-[15px] text-gray-900 placeholder-gray-500 transition-all"
                       />
                     </div>
                     <div className="relative w-full sm:w-64">
                       <Filter size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                       <select
                         value={suggestionCityFilter}
                         onChange={(e) => setSuggestionCityFilter(e.target.value)}
                         className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 text-[15px] text-gray-900 cursor-pointer appearance-none"
                       >
                         <option value="all">Tất cả Tỉnh/Thành phố</option>
                         {uniqueCities.map(city => (
                           <option key={city} value={city}>{city}</option>
                         ))}
                       </select>
                     </div>
                   </div>

                   {displayedSuggestions.length === 0 ? (
                     <p className="text-gray-500 text-center py-12">Không tìm thấy kết quả nào phù hợp.</p>
                   ) : (
                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
                       {displayedSuggestions.map((user) => (
                         <div key={user.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col hover:shadow-lg transition-shadow">
                           <div className="relative">
                              <img src={user.coverUrl || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=150&fit=crop"} alt="" className="w-full h-24 object-cover opacity-80" />
                              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2">
                                 <img src={user.avatarUrl} alt="" className="w-20 h-20 rounded-full object-cover border-4 border-white cursor-pointer shadow-sm" onClick={() => setSelectedProfileUser(user)} />
                              </div>
                           </div>
                           <div className="p-4 pt-10 flex-1 flex flex-col justify-between text-center mt-2">
                             <div className="mb-4">
                               <button onClick={() => setSelectedProfileUser(user)} className="font-bold text-gray-900 text-[16px] hover:underline line-clamp-1">
                                 {user.fullName}
                               </button>
                               <div className="flex items-center justify-center gap-1 text-xs text-gray-500 mt-1">
                                 <MapPin size={12} /> {user.city}
                               </div>
                               {user.mutualFriendsCount > 0 && (
                                 <p className="text-xs text-gray-500 mt-1">{user.mutualFriendsCount} bạn chung</p>
                               )}
                             </div>
                             <div className="space-y-2 mt-auto">
                               <button onClick={() => handleSendRequest(user)} className="w-full py-2 bg-[#E7F3FF] hover:bg-[#DBE7F2] text-[#1877F2] font-bold text-sm rounded-lg cursor-pointer transition-colors flex items-center justify-center gap-1.5">
                                 <UserPlus size={16} /> Thêm bạn bè
                               </button>
                             </div>
                           </div>
                         </div>
                       ))}
                     </div>
                   )}
                </div>
              )}

              {/* 3. Incoming Requests */}
              {activeTab === "incoming" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {displayedIncoming.length === 0 && <p className="text-gray-500 col-span-2 text-center py-8">Không có lời mời kết bạn nào mới.</p>}
                  {displayedIncoming.map((user) => (
                    <div key={user.id} className="flex flex-col sm:flex-row gap-4 p-4 rounded-xl border border-gray-200 bg-white hover:shadow-md transition-shadow">
                      <div className="flex gap-4 flex-1">
                         <img src={user.avatarUrl} alt="" className="w-20 h-20 rounded-full object-cover border border-gray-100 cursor-pointer" onClick={() => setSelectedProfileUser(user)} />
                         <div className="flex-1 min-w-0 flex flex-col justify-center">
                           <button onClick={() => setSelectedProfileUser(user)} className="font-bold text-[16px] text-gray-900 hover:text-blue-600 truncate w-full text-left mb-1">
                             {user.fullName}
                           </button>
                           <p className="text-sm text-gray-500 mb-3">{user.mutualFriendsCount} bạn chung</p>
                           <div className="flex items-center gap-2">
                             <button onClick={() => handleAccept(user)} className="flex-1 py-1.5 bg-[#0866FF] hover:bg-[#0759E0] text-white font-bold text-sm rounded-lg cursor-pointer transition-colors flex items-center justify-center gap-1">
                               <Check size={16} /> Xác nhận
                             </button>
                             <button onClick={() => handleDecline(user)} className="flex-1 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold text-sm rounded-lg cursor-pointer transition-colors">
                               Xóa
                             </button>
                           </div>
                         </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* 4. Outgoing Requests */}
              {activeTab === "outgoing" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {displayedOutgoing.length === 0 && <p className="text-gray-500 col-span-2 text-center py-8">Không có lời mời nào đã gửi.</p>}
                  {displayedOutgoing.map((user) => (
                    <div key={user.id} className="flex flex-col sm:flex-row gap-4 p-4 rounded-xl border border-gray-200 bg-white hover:shadow-md transition-shadow">
                      <div className="flex gap-4 flex-1">
                         <img src={user.avatarUrl} alt="" className="w-16 h-16 rounded-full object-cover border border-gray-100 cursor-pointer" onClick={() => setSelectedProfileUser(user)} />
                         <div className="flex-1 min-w-0 flex flex-col justify-center">
                           <button onClick={() => setSelectedProfileUser(user)} className="font-bold text-[16px] text-gray-900 hover:text-blue-600 truncate w-full text-left mb-1">
                             {user.fullName}
                           </button>
                           <button onClick={() => handleCancelOutgoing(user)} className="w-max px-4 py-1.5 mt-2 bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold text-sm rounded-lg cursor-pointer transition-colors">
                             Hủy lời mời
                           </button>
                         </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* 5. Blocked */}
              {activeTab === "blocked" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {displayedBlocked.length === 0 && <p className="text-gray-500 col-span-2 text-center py-8">Danh sách chặn trống.</p>}
                  {displayedBlocked.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 rounded-xl border border-gray-200 bg-white">
                      <div className="flex items-center gap-3">
                        <img src={user.avatarUrl} alt="" className="w-12 h-12 rounded-full object-cover grayscale opacity-60" />
                        <span className="font-bold text-[16px] text-gray-900 line-through text-opacity-70">{user.fullName}</span>
                      </div>
                      <button onClick={() => handleUnblock(user)} className="py-1.5 px-4 bg-gray-900 hover:bg-gray-800 text-white font-bold text-sm rounded-lg cursor-pointer transition-colors">
                        Bỏ chặn
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Mini Suggestions Divider below normal tabs (Not shown if already in Khám phá) */}
          {allSuggestions.length > 0 && activeTab !== "suggestions" && !searchQuery && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 sm:p-6 mt-6">
              <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
                 <h3 className="text-xl font-bold text-gray-900">Những người bạn có thể biết</h3>
                 <button onClick={() => setActiveTab("suggestions")} className="text-sm text-blue-600 font-semibold cursor-pointer hover:underline">
                   Xem tất cả
                 </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {allSuggestions.slice(0, 3).map((user) => (
                  <div key={user.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col hover:shadow-lg transition-shadow">
                    <div className="relative">
                       <img src={user.coverUrl || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=150&fit=crop"} alt="" className="w-full h-24 object-cover opacity-80" />
                       <div className="absolute -bottom-8 left-1/2 -translate-x-1/2">
                          <img src={user.avatarUrl} alt="" className="w-20 h-20 rounded-full object-cover border-4 border-white cursor-pointer shadow-sm" onClick={() => setSelectedProfileUser(user)} />
                       </div>
                    </div>
                    <div className="p-4 pt-10 flex-1 flex flex-col justify-between text-center mt-2">
                      <div className="mb-4">
                        <button onClick={() => setSelectedProfileUser(user)} className="font-bold text-gray-900 text-[16px] hover:underline line-clamp-1">
                          {user.fullName}
                        </button>
                        {user.mutualFriendsCount > 0 && (
                          <p className="text-xs text-gray-500 mt-1">{user.mutualFriendsCount} bạn chung</p>
                        )}
                      </div>
                      <div className="space-y-2 mt-auto">
                        <button onClick={() => handleSendRequest(user)} className="w-full py-2 bg-[#E7F3FF] hover:bg-[#DBE7F2] text-[#1877F2] font-bold text-sm rounded-lg cursor-pointer transition-colors flex items-center justify-center gap-1.5">
                          <UserPlus size={16} /> Thêm bạn bè
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Profile Modal */}
      {selectedProfileUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-[500px] bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="relative h-[220px] bg-gray-200">
              <img src={selectedProfileUser.coverUrl || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=400&fit=crop"} className="w-full h-full object-cover" alt="" />
              <button onClick={() => setSelectedProfileUser(null)} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-black/40 hover:bg-black/60 text-white rounded-full transition-colors cursor-pointer">
                <X size={18} />
              </button>
            </div>
            <div className="px-6 pb-6 -mt-20 relative">
              <div className="w-[140px] h-[140px] rounded-full border-[5px] border-white bg-white shadow-md mx-auto overflow-hidden">
                <img src={selectedProfileUser.avatarUrl} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="text-center mt-3">
                <h2 className="text-2xl font-extrabold text-gray-900">{selectedProfileUser.fullName}</h2>
                <p className="text-[15px] font-semibold text-gray-500 mt-1">{selectedProfileUser.mutualFriendsCount} bạn chung</p>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#0866FF] hover:bg-[#0759E0] text-white font-bold text-[15px] rounded-xl cursor-pointer transition-colors shadow-sm shadow-blue-500/30">
                  <UserPlus size={18} /> Thêm bạn bè
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold text-[15px] rounded-xl cursor-pointer transition-colors">
                  <MessageCircle size={18} /> Nhắn tin
                </button>
              </div>
              
              <div className="mt-6 p-4 bg-gray-50 border border-gray-100 rounded-xl space-y-3">
                <div className="flex items-center gap-3 text-[15px] text-gray-900">
                  <MapPin size={20} className="text-gray-400" /> 
                  <span>Sống tại <strong className="font-bold">{selectedProfileUser.city}</strong></span>
                </div>
                {selectedProfileUser.bio && (
                  <p className="text-[15px] text-gray-600 leading-relaxed border-t border-gray-200 pt-3 mt-3">
                    "{selectedProfileUser.bio}"
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {unfriendConfirmUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6 text-center animate-in fade-in duration-200">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
              <UserMinus size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Hủy kết bạn?</h3>
            <p className="text-sm text-gray-500 mb-6">Bạn có chắc chắn muốn hủy kết bạn với <strong className="text-gray-900">{unfriendConfirmUser.fullName}</strong>? Họ sẽ không được thông báo.</p>
            <div className="flex gap-3">
              <button onClick={() => setUnfriendConfirmUser(null)} className="flex-1 py-2.5 bg-gray-100 text-gray-900 font-bold rounded-xl hover:bg-gray-200 cursor-pointer transition-colors">
                Trở lại
              </button>
              <button onClick={handleUnfriendConfirm} className="flex-1 py-2.5 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 cursor-pointer transition-colors shadow-sm">
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
