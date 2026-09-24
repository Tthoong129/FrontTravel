import { useState } from "react";
import {
  Settings2,
  Save,
  AlertTriangle,
  Check,
  Clock,
  Globe2,
  Shield,
  Lock,
  Database,
  RefreshCw,
  FileText,
  Users,
  Activity,
  X,
  Sliders,
  Sparkles,
  Layers,
  Image as ImageIcon,
  Zap,
  Plus,
  Trash2,
  HelpCircle,
  RotateCcw,
  CheckCircle2,
  SlidersHorizontal,
  BellRing,
  Info,
  CheckCheck,
  ChevronDown,
} from "lucide-react";

/* ── Setting Item Definition ── */
interface SettingItem {
  id: number;
  key: string;
  name: string;
  value: string;
  description: string;
  group: "GENERAL" | "MODERATION" | "SLA" | "MEDIA" | "SECURITY";
  inputType: "text" | "number" | "toggle" | "textarea" | "email" | "tel" | "tags";
  updatedAt: string;
  updatedBy: string;
  unit?: string;
  recommendation?: string;
}

const INITIAL_SETTINGS: SettingItem[] = [
  // GENERAL
  {
    id: 1,
    key: "SITE_NAME",
    name: "Tên thương hiệu hệ thống",
    value: "Lang Thang - Nền tảng Du lịch & Ẩm thực Việt Nam",
    description: "Tên hiển thị chính thức trên tiêu đề web, thông báo và email hệ thống.",
    group: "GENERAL",
    inputType: "text",
    updatedAt: "24/09/2026 08:30",
    updatedBy: "Nguyễn Minh Anh",
    recommendation: "Tối ưu dưới 60 ký tự",
  },
  {
    id: 2,
    key: "SITE_HOTLINE",
    name: "Hotline hỗ trợ & Đối tác",
    value: "1900 6868",
    description: "Đường dây nóng hỗ trợ khẩn cấp hiển thị trên Footer và trang Liên hệ.",
    group: "GENERAL",
    inputType: "tel",
    updatedAt: "24/09/2026 10:00",
    updatedBy: "Nguyễn Minh Anh",
  },
  {
    id: 3,
    key: "SITE_EMAIL",
    name: "Email hỗ trợ CSKH",
    value: "support@langthang.vn",
    description: "Hòm thư tiếp nhận phản ánh, hỗ trợ đối tác và báo cáo kỹ thuật.",
    group: "GENERAL",
    inputType: "email",
    updatedAt: "24/09/2026 10:00",
    updatedBy: "Nguyễn Minh Anh",
  },
  {
    id: 4,
    key: "MAINTENANCE_MODE",
    name: "Chế độ bảo trì hệ thống",
    value: "0",
    description: "Khi kích hoạt, chỉ tài khoản Quản trị viên cấp cao mới có thể truy cập cổng điều hành.",
    group: "GENERAL",
    inputType: "toggle",
    updatedAt: "24/09/2026 12:00",
    updatedBy: "Nguyễn Minh Anh",
    recommendation: "Bật khi bảo trì máy chủ hoặc nâng cấp Database",
  },
  {
    id: 5,
    key: "MAINTENANCE_MESSAGE",
    name: "Thông điệp bảo trì",
    value: "Hệ thống đang được nâng cấp định kỳ nhằm tối ưu hóa trải nghiệm. Vui lòng quay lại sau ít phút!",
    description: "Thông báo hiển thị toàn màn hình cho du khách khi hệ thống ở chế độ bảo trì.",
    group: "GENERAL",
    inputType: "textarea",
    updatedAt: "24/09/2026 12:00",
    updatedBy: "Nguyễn Minh Anh",
  },

  // MODERATION
  {
    id: 6,
    key: "AUTO_APPROVE_PLACES",
    name: "Tự động duyệt địa điểm mới",
    value: "0",
    description: "Tự động xuất bản địa điểm do thành viên khởi tạo mà không qua hàng chờ kiểm duyệt.",
    group: "MODERATION",
    inputType: "toggle",
    updatedAt: "24/09/2026 09:15",
    updatedBy: "Nguyễn Minh Anh",
    recommendation: "Khuyến nghị TẮT để bảo đảm tính xác thực thông tin",
  },
  {
    id: 7,
    key: "AUTO_APPROVE_REVIEWS",
    name: "Tự động duyệt đánh giá & bình luận",
    value: "1",
    description: "Cho phép đánh giá hiển thị ngay lập tức (sẽ tự động ẩn nếu vượt ngưỡng báo cáo).",
    group: "MODERATION",
    inputType: "toggle",
    updatedAt: "24/09/2026 09:15",
    updatedBy: "Nguyễn Minh Anh",
    recommendation: "Bật để nâng cao tính tương tác thời gian thực",
  },
  {
    id: 8,
    key: "MIN_TRUST_SCORE_AUTO_POST",
    name: "Ngưỡng điểm uy tín ưu tiên duyệt",
    value: "85",
    description: "Thành viên đạt từ mức điểm uy tín này trở lên sẽ được tự động kích hoạt chế độ duyệt nhanh.",
    group: "MODERATION",
    inputType: "number",
    unit: "điểm (0 - 100)",
    updatedAt: "24/09/2026 11:20",
    updatedBy: "Nguyễn Minh Anh",
  },
  {
    id: 9,
    key: "AUTO_HIDE_REPORT_THRESHOLD",
    name: "Ngưỡng báo cáo tự động tạm ẩn",
    value: "5",
    description: "Số lượng phản ánh vi phạm khiến bài viết hoặc địa điểm bị tạm ẩn ngay để chờ admin xử lý.",
    group: "MODERATION",
    inputType: "number",
    unit: "lượt báo cáo",
    updatedAt: "24/09/2026 15:40",
    updatedBy: "Nguyễn Minh Anh",
  },

  // SLA
  {
    id: 10,
    key: "SLA_URGENT_HOURS",
    name: "SLA xử lý báo cáo khẩn cấp",
    value: "12",
    description: "Thời hạn tối đa ban quản trị phải tiếp nhận và xử lý dứt điểm các báo cáo mức khẩn cấp.",
    group: "SLA",
    inputType: "number",
    unit: "giờ",
    updatedAt: "24/09/2026 08:00",
    updatedBy: "Nguyễn Minh Anh",
  },
  {
    id: 11,
    key: "SLA_NORMAL_HOURS",
    name: "SLA xử lý đề xuất đóng góp & duyệt địa điểm",
    value: "48",
    description: "Thời hạn tiêu chuẩn kiểm duyệt các đề xuất tạo mới hoặc cập nhật thông tin địa điểm.",
    group: "SLA",
    inputType: "number",
    unit: "giờ",
    updatedAt: "24/09/2026 08:00",
    updatedBy: "Nguyễn Minh Anh",
  },
  {
    id: 12,
    key: "SLA_WARNING_THRESHOLD_PERCENT",
    name: "Ngưỡng cảnh báo cận hạn SLA",
    value: "80",
    description: "Tỷ lệ thời gian trôi qua để hệ thống tự động phát cảnh báo màu vàng cho Admin phụ trách.",
    group: "SLA",
    inputType: "number",
    unit: "% thời gian",
    updatedAt: "24/09/2026 08:00",
    updatedBy: "Nguyễn Minh Anh",
  },

  // MEDIA
  {
    id: 13,
    key: "MAX_UPLOAD_SIZE_MB",
    name: "Dung lượng ảnh tối đa mỗi file",
    value: "10",
    description: "Giới hạn dung lượng tệp tin tải lên máy chủ để tối ưu tốc độ tải trang.",
    group: "MEDIA",
    inputType: "number",
    unit: "MB",
    updatedAt: "24/09/2026 14:00",
    updatedBy: "Nguyễn Minh Anh",
  },
  {
    id: 14,
    key: "MAX_PHOTOS_PER_PLACE",
    name: "Số ảnh tối đa mỗi địa điểm",
    value: "30",
    description: "Số lượng ảnh tối đa trong thư viện Media của một địa điểm du lịch.",
    group: "MEDIA",
    inputType: "number",
    unit: "ảnh",
    updatedAt: "24/09/2026 14:00",
    updatedBy: "Nguyễn Minh Anh",
  },
  {
    id: 15,
    key: "AUTO_WEBP_COMPRESSION",
    name: "Tự động nén & chuyển đổi định dạng WebP",
    value: "1",
    description: "Tự động tối ưu dung lượng hình ảnh tải lên về định dạng WebP hiện đại giúp tăng tốc độ tải.",
    group: "MEDIA",
    inputType: "toggle",
    updatedAt: "24/09/2026 14:00",
    updatedBy: "Nguyễn Minh Anh",
  },

  // SECURITY
  {
    id: 16,
    key: "BLACKLIST_WORDS",
    name: "Danh sách từ khóa cấm & Nhạy cảm",
    value: "lừa đảo, cờ bạc, phản động, mại dâm, xúc phạm, phân biệt vùng miền, spam quảng cáo, hack",
    description: "Hệ thống tự động chặn hoặc đánh dấu nghi vấn các nội dung chứa các từ khóa này.",
    group: "SECURITY",
    inputType: "tags",
    updatedAt: "24/09/2026 16:30",
    updatedBy: "Nguyễn Minh Anh",
  },
  {
    id: 17,
    key: "MAX_LOGIN_ATTEMPTS",
    name: "Số lần đăng nhập sai tối đa",
    value: "5",
    description: "Khóa tạm thời IP hoặc tài khoản sau số lần nhập sai mật khẩu liên tiếp.",
    group: "SECURITY",
    inputType: "number",
    unit: "lần",
    updatedAt: "24/09/2026 16:30",
    updatedBy: "Nguyễn Minh Anh",
  },
];

const GROUPS = [
  { id: "GENERAL", label: "Cài đặt chung", icon: Globe2, desc: "Tùy chỉnh thông tin website, hotline và chế độ bảo trì." },
  { id: "MODERATION", label: "Kiểm duyệt & Tín nhiệm", icon: Shield, desc: "Cấu hình tự động duyệt và quản lý tài khoản vi phạm." },
  { id: "SLA", label: "Quy chuẩn SLA", icon: Clock, desc: "Thiết lập thời gian xử lý bắt buộc cho admin." },
  { id: "MEDIA", label: "Media & Dung lượng", icon: ImageIcon, desc: "Giới hạn dung lượng và tối ưu hình ảnh tải lên." },
  { id: "SECURITY", label: "Từ khóa cấm & Bảo mật", icon: Lock, desc: "Bộ lọc từ khóa nhạy cảm và bảo mật đăng nhập." },
] as const;

interface SystemSettingsTabProps {
  showToast: (msg: string) => void;
}

export default function SystemSettingsTab({ showToast }: SystemSettingsTabProps) {
  const [settings, setSettings] = useState<SettingItem[]>(INITIAL_SETTINGS);
  const [expandedGroups, setExpandedGroups] = useState<string[]>(["GENERAL"]);
  const [hasChanges, setHasChanges] = useState(false);
  const [newTagInput, setNewTagInput] = useState("");

  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev => prev.includes(groupId) ? prev.filter(id => id !== groupId) : [...prev, groupId]);
  };

  const updateSetting = (key: string, newValue: string) => {
    setSettings((prev) => prev.map((s) => (s.key === key ? { ...s, value: newValue } : s)));
    setHasChanges(true);
  };

  const handleSave = () => {
    setHasChanges(false);
    showToast("Đã lưu và đồng bộ toàn bộ cấu hình hệ thống thành công!");
  };

  const handleReset = () => {
    if (confirm("Khôi phục tất cả cấu hình về mặc định ban đầu?")) {
      setSettings(INITIAL_SETTINGS);
      setHasChanges(false);
      showToast("Đã khôi phục cài đặt mặc định.");
    }
  };

  // Blacklist tags
  const blacklistSetting = settings.find((s) => s.key === "BLACKLIST_WORDS");
  const blacklistTags = (blacklistSetting?.value || "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  const addBlacklistTag = () => {
    if (!newTagInput.trim()) return;
    const tag = newTagInput.trim();
    if (blacklistTags.includes(tag)) {
      showToast("Từ khóa này đã có trong danh sách!");
      return;
    }
    const updated = [...blacklistTags, tag].join(", ");
    updateSetting("BLACKLIST_WORDS", updated);
    setNewTagInput("");
  };

  const removeBlacklistTag = (tag: string) => {
    const updated = blacklistTags.filter((t) => t !== tag).join(", ");
    updateSetting("BLACKLIST_WORDS", updated);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150 text-slate-800 pb-20">
      {/* ── 1. PAGE TITLE & ACTIONS ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <span>Cấu hình Tham số &amp; Quy chuẩn SLA</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              {settings.length} tham số
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Điều chỉnh các tham số vận hành, thời hạn SLA xử lý, bộ lọc nhạy cảm và quy tắc kiểm duyệt tự động.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={handleReset}
            className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <RotateCcw size={14} className="text-slate-500" />
            <span>Mặc định</span>
          </button>
          <button
            disabled={!hasChanges}
            onClick={handleSave}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer ${
              hasChanges
                ? "bg-blue-600 hover:bg-blue-700 text-white animate-pulse"
                : "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
            }`}
          >
            <Save size={14} />
            <span>Lưu thay đổi</span>
          </button>
        </div>
      </div>

      {/* ── 2. ACCORDION SETTINGS LIST ── */}
      <div className="space-y-4">
        {GROUPS.map((group) => {
          const Icon = group.icon;
          const groupSettings = settings.filter((s) => s.group === group.id);
          const isExpanded = expandedGroups.includes(group.id);

          return (
            <div key={group.id} className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
              <button
                onClick={() => toggleGroup(group.id)}
                className="w-full flex items-center justify-between p-5 hover:bg-slate-50/50 transition-colors cursor-pointer text-left"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-colors ${isExpanded ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-500'}`}>
                    <Icon size={20} />
                  </div>
                  <div>
                    <h2 className="font-bold text-slate-900 text-sm">{group.label}</h2>
                    <p className="text-xs text-slate-500 mt-0.5">{group.desc} ({groupSettings.length} tham số)</p>
                  </div>
                </div>
                <ChevronDown size={20} className={`text-slate-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
              </button>

              {isExpanded && (
                <div className="border-t border-slate-100 divide-y divide-slate-100">
                  {groupSettings.map((item) => {
                    const isToggle = item.inputType === "toggle";
                    const isNumber = item.inputType === "number";
                    const isTags = item.inputType === "tags";
                    const isTextarea = item.inputType === "textarea";

                    return (
                      <div
                        key={item.id}
                        className="p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-5 hover:bg-slate-50/30 transition-colors"
                      >
                        {/* Left description */}
                        <div className="space-y-1 md:max-w-xl">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 text-sm">{item.name}</span>
                            <span className="font-mono text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                              {item.key}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 leading-relaxed">{item.description}</p>
                          {item.recommendation && (
                            <p className="text-[11px] text-blue-600 font-medium flex items-center gap-1 pt-0.5">
                              <Info size={11} />
                              <span>{item.recommendation}</span>
                            </p>
                          )}
                        </div>

                        {/* Right input control */}
                        <div className="w-full md:w-auto md:min-w-[280px] flex md:justify-end">
                          {isToggle ? (
                            <button
                              type="button"
                              onClick={() => updateSetting(item.key, item.value === "1" ? "0" : "1")}
                              className="inline-flex items-center gap-3 cursor-pointer group"
                            >
                              <div
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                  item.value === "1" ? "bg-blue-600" : "bg-slate-300"
                                }`}
                              >
                                <span
                                  className={`inline-block h-4 w-4 rounded-full bg-white shadow-xs transform transition-transform ${
                                    item.value === "1" ? "translate-x-6" : "translate-x-1"
                                  }`}
                                />
                              </div>
                              <span
                                className={`text-xs font-bold ${
                                  item.value === "1" ? "text-blue-600" : "text-slate-400"
                                }`}
                              >
                                {item.value === "1" ? "Đang Bật" : "Đang Tắt"}
                              </span>
                            </button>
                          ) : isTags ? (
                            <div className="w-full space-y-2">
                              <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-2 bg-slate-50 rounded-xl border border-slate-200/80">
                                {blacklistTags.map((tag) => (
                                  <span
                                    key={tag}
                                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 text-xs font-semibold"
                                  >
                                    <span>{tag}</span>
                                    <button
                                      onClick={() => removeBlacklistTag(tag)}
                                      className="hover:text-rose-900 cursor-pointer"
                                    >
                                      <X size={12} />
                                    </button>
                                  </span>
                                ))}
                              </div>
                              <div className="flex items-center gap-1.5">
                                <input
                                  type="text"
                                  placeholder="Thêm từ khóa mới..."
                                  value={newTagInput}
                                  onChange={(e) => setNewTagInput(e.target.value)}
                                  onKeyDown={(e) => e.key === "Enter" && addBlacklistTag()}
                                  className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs outline-none focus:border-blue-500 bg-white"
                                />
                                <button
                                  onClick={addBlacklistTag}
                                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition cursor-pointer"
                                >
                                  Thêm
                                </button>
                              </div>
                            </div>
                          ) : isTextarea ? (
                            <textarea
                              rows={2}
                              value={item.value}
                              onChange={(e) => updateSetting(item.key, e.target.value)}
                              className="w-full md:w-80 px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 outline-none focus:border-blue-500 bg-white"
                            />
                          ) : (
                            <div className="flex items-center gap-2 w-full md:w-64">
                              <input
                                type={isNumber ? "number" : item.inputType}
                                value={item.value}
                                onChange={(e) => updateSetting(item.key, e.target.value)}
                                className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 outline-none focus:border-blue-500 bg-white"
                              />
                              {item.unit && (
                                <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">
                                  {item.unit}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Floating Save Reminder */}
      {hasChanges && (
        <div className="fixed bottom-6 right-8 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-4 animate-in slide-in-from-bottom-5">
          <span className="text-xs font-medium">Bạn có thay đổi cấu hình chưa lưu.</span>
          <button
            onClick={handleSave}
            className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition cursor-pointer shadow-xs"
          >
            Lưu ngay
          </button>
        </div>
      )}
    </div>
  );
}
