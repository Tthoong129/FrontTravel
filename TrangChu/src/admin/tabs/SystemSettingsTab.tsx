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
} from "lucide-react";

/* ── Setting types dựa trên dbo.SystemSettings ── */

interface SettingItem {
  id: number;
  key: string;
  value: string;
  description: string;
  group: "GENERAL" | "MODERATION" | "SECURITY";
  inputType: "text" | "number" | "toggle" | "textarea" | "email" | "tel";
  updatedAt: string;
  updatedBy: string;
}

const INITIAL_SETTINGS: SettingItem[] = [
  {
    id: 1,
    key: "SITE_NAME",
    value: "Lang Thang - Nền tảng Du lịch & Ẩm thực Việt Nam",
    description: "Tên hiển thị hệ thống trên header, SEO và email gửi đi",
    group: "GENERAL",
    inputType: "text",
    updatedAt: "22/09/2026 08:30",
    updatedBy: "Nguyễn Minh Anh",
  },
  {
    id: 2,
    key: "SITE_HOTLINE",
    value: "1900 6868",
    description: "Đường dây nóng hỗ trợ du khách hiển thị trên footer và trang liên hệ",
    group: "GENERAL",
    inputType: "tel",
    updatedAt: "15/09/2026 10:00",
    updatedBy: "Nguyễn Minh Anh",
  },
  {
    id: 3,
    key: "SITE_EMAIL",
    value: "support@langthang.vn",
    description: "Email hỗ trợ tiếp nhận thắc mắc và khiếu nại từ người dùng",
    group: "GENERAL",
    inputType: "email",
    updatedAt: "15/09/2026 10:00",
    updatedBy: "Nguyễn Minh Anh",
  },
  {
    id: 4,
    key: "MAINTENANCE_MODE",
    value: "0",
    description: "Bật/tắt chế độ bảo trì toàn hệ thống. Khi bật, người dùng thường không thể truy cập",
    group: "GENERAL",
    inputType: "toggle",
    updatedAt: "01/09/2026 12:00",
    updatedBy: "Nguyễn Minh Anh",
  },
  {
    id: 5,
    key: "AUTO_APPROVE_PLACES",
    value: "0",
    description: "Tự động duyệt địa điểm mới tạo bởi người dùng (0 = Chờ Admin duyệt, 1 = Tự động duyệt)",
    group: "MODERATION",
    inputType: "toggle",
    updatedAt: "20/09/2026 09:15",
    updatedBy: "Nguyễn Minh Anh",
  },
  {
    id: 6,
    key: "AUTO_APPROVE_REVIEWS",
    value: "1",
    description: "Tự động duyệt bài đánh giá của người dùng (0 = Chờ duyệt, 1 = Tự động duyệt)",
    group: "MODERATION",
    inputType: "toggle",
    updatedAt: "20/09/2026 09:15",
    updatedBy: "Nguyễn Minh Anh",
  },
  {
    id: 7,
    key: "MAX_UPLOAD_PHOTOS",
    value: "10",
    description: "Số lượng ảnh tối đa cho mỗi bài đánh giá hoặc đề xuất địa điểm",
    group: "MODERATION",
    inputType: "number",
    updatedAt: "18/09/2026 14:30",
    updatedBy: "Nguyễn Minh Anh",
  },
  {
    id: 8,
    key: "MAX_UPLOAD_SIZE_MB",
    value: "5",
    description: "Dung lượng tối đa cho mỗi ảnh tải lên (đơn vị: MB)",
    group: "MODERATION",
    inputType: "number",
    updatedAt: "18/09/2026 14:30",
    updatedBy: "Nguyễn Minh Anh",
  },
  {
    id: 9,
    key: "BLACKLIST_WORDS",
    value: "lừa đảo,đm,dcm,chó,vcl,đĩ,bậy,chửi",
    description: "Danh sách từ khóa cấm / nhạy cảm ngăn cách bởi dấu phẩy. Nội dung chứa từ này sẽ bị đánh dấu tự động",
    group: "SECURITY",
    inputType: "textarea",
    updatedAt: "22/09/2026 07:00",
    updatedBy: "Nguyễn Minh Anh",
  },
];

interface SettingLog {
  id: number;
  key: string;
  oldValue: string;
  newValue: string;
  changedBy: string;
  changedAt: string;
  action: string;
}

const SETTING_LOGS: SettingLog[] = [
  { id: 1, key: "BLACKLIST_WORDS", oldValue: "lừa đảo,đm,dcm,chó,vcl", newValue: "lừa đảo,đm,dcm,chó,vcl,đĩ,bậy,chửi", changedBy: "Nguyễn Minh Anh", changedAt: "22/09/2026 07:00", action: "Thêm 3 từ khóa mới" },
  { id: 2, key: "AUTO_APPROVE_REVIEWS", oldValue: "0", newValue: "1", changedBy: "Nguyễn Minh Anh", changedAt: "20/09/2026 09:15", action: "Bật tự động duyệt đánh giá" },
  { id: 3, key: "MAX_UPLOAD_SIZE_MB", oldValue: "3", newValue: "5", changedBy: "Nguyễn Minh Anh", changedAt: "18/09/2026 14:30", action: "Tăng giới hạn dung lượng ảnh" },
  { id: 4, key: "SITE_HOTLINE", oldValue: "1900 1234", newValue: "1900 6868", changedBy: "Nguyễn Minh Anh", changedAt: "15/09/2026 10:00", action: "Cập nhật đường dây nóng mới" },
  { id: 5, key: "MAINTENANCE_MODE", oldValue: "1", newValue: "0", changedBy: "Nguyễn Minh Anh", changedAt: "01/09/2026 12:00", action: "Tắt chế độ bảo trì sau nâng cấp" },
];

function ToggleSwitch({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label?: string }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="inline-flex items-center gap-2.5 cursor-pointer"
      role="switch"
      aria-checked={checked}
    >
      <div
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          checked ? "bg-[#063f38]" : "bg-slate-300"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 rounded-full bg-white shadow-xs transition-transform ${
            checked ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </div>
      <span className={`text-xs font-semibold ${checked ? "text-[#063f38]" : "text-slate-500"}`}>
        {label ? label : checked ? "Đang bật" : "Đang tắt"}
      </span>
    </button>
  );
}

interface SystemSettingsTabProps {
  showToast: (msg: string) => void;
}

export default function SystemSettingsTab({ showToast }: SystemSettingsTabProps) {
  const [settings, setSettings] = useState<SettingItem[]>(INITIAL_SETTINGS);
  const [activeGroup, setActiveGroup] = useState<"ALL" | "GENERAL" | "MODERATION" | "SECURITY">("ALL");
  const [showAuditLog, setShowAuditLog] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const isMaintenance = settings.find((s) => s.key === "MAINTENANCE_MODE")?.value === "1";

  const updateSetting = (key: string, newValue: string) => {
    setSettings((prev) => prev.map((s) => (s.key === key ? { ...s, value: newValue } : s)));
    setHasChanges(true);
  };

  const handleSave = () => {
    setHasChanges(false);
    showToast("Đã lưu tất cả cấu hình tham số hệ thống thành công.");
  };

  const filteredSettings = settings.filter((s) => {
    if (activeGroup === "ALL") return true;
    return s.group === activeGroup;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-150 text-slate-800">
      {/* ── HEADER CARD ── */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              <Settings2 size={16} />
            </div>
            <h2 className="font-bold text-base text-slate-900 tracking-tight">
              Cấu hình tham số hệ thống (System Settings)
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Quản trị bảng dbo.SystemSettings — kiểm soát kiểm duyệt tự động, upload media, blacklist từ khóa và thông tin vận hành.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowAuditLog(!showAuditLog)}
            className="px-3.5 py-2 rounded-xl border border-slate-200 hover:border-slate-300 bg-white text-slate-700 text-xs font-semibold shadow-xs flex items-center gap-1.5 transition cursor-pointer"
          >
            <Clock size={14} />
            <span>Lịch sử thay đổi ({SETTING_LOGS.length})</span>
          </button>
          <button
            disabled={!hasChanges}
            onClick={handleSave}
            className={`px-4 py-2 rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5 transition cursor-pointer ${
              hasChanges
                ? "bg-[#063f38] hover:bg-[#084f47] text-white"
                : "bg-slate-200 text-slate-400 cursor-not-allowed"
            }`}
          >
            <Save size={14} />
            <span>Lưu thay đổi</span>
          </button>
        </div>
      </div>

      {/* ── MAINTENANCE WARNING BANNER ── */}
      {isMaintenance && (
        <div className="bg-amber-50 border border-amber-200/80 p-4 rounded-2xl flex items-center gap-3 text-amber-800 text-xs">
          <AlertTriangle size={18} className="text-amber-600 shrink-0" />
          <div>
            <strong className="font-bold">Chế độ bảo trì hệ thống đang BẬT!</strong>
            <p className="text-[11px] text-amber-700 mt-0.5">
              Khách vãng lai và người dùng thông thường tạm thời không truy cập được vào nền tảng.
            </p>
          </div>
        </div>
      )}

      {/* ── GROUP NAVIGATION TABS ── */}
      <div className="flex items-center gap-1 p-1 bg-slate-100/80 rounded-xl text-xs">
        <button
          onClick={() => setActiveGroup("ALL")}
          className={`px-3.5 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
            activeGroup === "ALL" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Tất cả cấu hình ({settings.length})
        </button>
        <button
          onClick={() => setActiveGroup("GENERAL")}
          className={`px-3.5 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
            activeGroup === "GENERAL" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Cài đặt chung
        </button>
        <button
          onClick={() => setActiveGroup("MODERATION")}
          className={`px-3.5 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
            activeGroup === "MODERATION" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Kiểm duyệt tự động &amp; Upload
        </button>
        <button
          onClick={() => setActiveGroup("SECURITY")}
          className={`px-3.5 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
            activeGroup === "SECURITY" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Bảo mật &amp; Bộ lọc từ khóa
        </button>
      </div>

      {/* ── SETTINGS LIST / FORMS ── */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs divide-y divide-slate-100 overflow-hidden text-xs">
        {filteredSettings.map((item) => (
          <div key={item.key} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/60 transition">
            <div className="space-y-1 max-w-xl">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-slate-900 font-mono">{item.key}</span>
                <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-semibold">
                  {item.group}
                </span>
              </div>
              <p className="text-slate-500 text-xs">{item.description}</p>
              <div className="text-[10px] text-slate-400">
                Cập nhật lần cuối: {item.updatedAt} bởi {item.updatedBy}
              </div>
            </div>

            {/* Input Control */}
            <div className="shrink-0 min-w-[240px]">
              {item.inputType === "toggle" ? (
                <ToggleSwitch
                  checked={item.value === "1"}
                  onChange={(val) => updateSetting(item.key, val ? "1" : "0")}
                />
              ) : item.inputType === "textarea" ? (
                <textarea
                  rows={3}
                  value={item.value}
                  onChange={(e) => updateSetting(item.key, e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium focus:bg-white outline-none"
                />
              ) : item.inputType === "number" ? (
                <input
                  type="number"
                  value={item.value}
                  onChange={(e) => updateSetting(item.key, e.target.value)}
                  className="w-32 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium focus:bg-white outline-none font-bold text-slate-800"
                />
              ) : (
                <input
                  type="text"
                  value={item.value}
                  onChange={(e) => updateSetting(item.key, e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium focus:bg-white outline-none text-slate-800"
                />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ── AUDIT LOG DIALOG ── */}
      {showAuditLog && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden text-xs">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900">Nhật ký thay đổi tham số cấu hình</h3>
            <button onClick={() => setShowAuditLog(false)} className="p-1 rounded text-slate-400 hover:text-slate-700">
              <X size={16} />
            </button>
          </div>
          <table className="w-full text-left">
            <thead className="bg-slate-50/70 text-slate-400 font-semibold border-b border-slate-100 text-[11px] uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Thời gian</th>
                <th className="py-3 px-4">Tham số</th>
                <th className="py-3 px-4">Hành động</th>
                <th className="py-3 px-4">Giá trị cũ → Giá trị mới</th>
                <th className="py-3 px-4">Người sửa</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {SETTING_LOGS.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/70">
                  <td className="py-2.5 px-4 text-slate-400">{log.changedAt}</td>
                  <td className="py-2.5 px-4 font-mono font-semibold text-slate-800">{log.key}</td>
                  <td className="py-2.5 px-4 text-slate-700">{log.action}</td>
                  <td className="py-2.5 px-4 text-slate-500 font-mono text-[11px]">
                    <span className="text-rose-600 line-through">{log.oldValue}</span> →{" "}
                    <span className="text-emerald-700 font-bold">{log.newValue}</span>
                  </td>
                  <td className="py-2.5 px-4 text-slate-700 font-medium">{log.changedBy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
