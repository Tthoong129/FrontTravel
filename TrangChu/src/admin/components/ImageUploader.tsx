import React, { useState, useRef } from "react";
import {
  UploadCloud,
  Link2,
  Image as ImageIcon,
  X,
  Check,
  Sparkles,
  RefreshCw,
  Eye,
  FileImage,
} from "lucide-react";

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  helperText?: string;
  aspectRatio?: "16:9" | "4:3" | "1:1" | "video";
}

const STOCK_PRESETS = [
  {
    name: "Mì Quảng Đà Nẵng",
    url: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=500&fit=crop",
    category: "Ẩm thực",
  },
  {
    name: "Phố cổ Hội An",
    url: "https://images.unsplash.com/photo-1691927644490-e1a24b366a5e?w=800&h=500&fit=crop",
    category: "Cảnh đẹp",
  },
  {
    name: "Biển Mỹ Khê & Bán đảo",
    url: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800&h=500&fit=crop",
    category: "Biển đảo",
  },
  {
    name: "Cà phê Check-in",
    url: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&h=500&fit=crop",
    category: "Cà phê",
  },
  {
    name: "Khách sạn & Homestay",
    url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=500&fit=crop",
    category: "Lưu trú",
  },
  {
    name: "Sa Pa Ruộng bậc thang",
    url: "https://images.unsplash.com/photo-1606801954050-be6b29588460?w=800&h=500&fit=crop",
    category: "Tây Bắc",
  },
];

export default function ImageUploader({
  value,
  onChange,
  label = "Ảnh bìa / Hình ảnh đại diện",
  helperText = "Hỗ trợ định dạng JPG, PNG, WEBP tối đa 5MB",
}: ImageUploaderProps) {
  const [mode, setMode] = useState<"upload" | "url">("upload");
  const [inputUrl, setInputUrl] = useState(value || "");
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Vui lòng chọn tệp hình ảnh hợp lệ (JPG, PNG, WebP).");
      return;
    }
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        onChange(result);
        setInputUrl(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleApplyUrl = () => {
    if (inputUrl.trim()) {
      onChange(inputUrl.trim());
      setFileName(null);
    }
  };

  const handleClear = () => {
    onChange("");
    setInputUrl("");
    setFileName(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2.5 text-xs">
      <div className="flex items-center justify-between">
        <label className="font-semibold text-slate-700 flex items-center gap-1.5">
          <ImageIcon size={14} className="text-blue-600" />
          <span>{label}</span>
        </label>

        {/* Mode switcher pills */}
        <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-[11px] font-bold">
          <button
            type="button"
            onClick={() => setMode("upload")}
            className={`px-2.5 py-1 rounded-md transition-all cursor-pointer flex items-center gap-1 ${
              mode === "upload"
                ? "bg-white text-slate-900 shadow-2xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <UploadCloud size={12} />
            <span>Tải tệp từ máy</span>
          </button>
          <button
            type="button"
            onClick={() => setMode("url")}
            className={`px-2.5 py-1 rounded-md transition-all cursor-pointer flex items-center gap-1 ${
              mode === "url"
                ? "bg-white text-slate-900 shadow-2xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Link2 size={12} />
            <span>Nhập link ảnh</span>
          </button>
        </div>
      </div>

      {/* ── PREVIEW BOX IF HAS VALUE ── */}
      {value ? (
        <div className="relative rounded-2xl border border-slate-200 bg-slate-50 p-2.5 space-y-2">
          <div className="relative h-44 rounded-xl overflow-hidden ring-1 ring-slate-200/80 bg-slate-900/5 group">
            <img
              src={value}
              alt="Preview"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=400&fit=crop";
              }}
            />
            <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <a
                href={value}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-lg bg-white/90 hover:bg-white text-slate-900 font-bold text-xs flex items-center gap-1 shadow-sm"
              >
                <Eye size={12} />
                <span>Xem ảnh gốc</span>
              </a>
              <button
                type="button"
                onClick={handleClear}
                className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1 shadow-sm cursor-pointer"
              >
                <X size={12} />
                <span>Xóa / Đổi ảnh</span>
              </button>
            </div>

            <div className="absolute top-2 left-2 px-2.5 py-0.5 rounded-md bg-emerald-600 text-white font-bold text-[10px] flex items-center gap-1 shadow-xs">
              <Check size={11} /> Ảnh đã tải
            </div>

            {fileName && (
              <div className="absolute bottom-2 left-2 right-2 px-2.5 py-1 rounded-lg bg-slate-900/75 backdrop-blur-xs text-white text-[10px] truncate flex items-center gap-1.5">
                <FileImage size={12} className="shrink-0 text-slate-300" />
                <span className="truncate">{fileName}</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between text-[11px] px-1 text-slate-500 font-medium">
            <span>{helperText}</span>
            <button
              type="button"
              onClick={() => {
                if (mode === "upload") fileInputRef.current?.click();
                else setInputUrl("");
              }}
              className="font-bold text-blue-600 hover:underline cursor-pointer flex items-center gap-1"
            >
              <RefreshCw size={11} /> Thay đổi ảnh
            </button>
          </div>
        </div>
      ) : (
        /* ── UPLOAD / LINK INPUT BOX ── */
        <div className="space-y-2">
          {mode === "upload" ? (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                isDragging
                  ? "border-blue-500 bg-blue-50/50"
                  : "border-slate-200 hover:border-slate-400 bg-slate-50/60 hover:bg-white"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 mx-auto flex items-center justify-center mb-2 shadow-2xs">
                <UploadCloud size={24} />
              </div>
              <div className="font-bold text-slate-800 text-xs">
                Kéo &amp; thả ảnh vào đây hoặc <span className="text-blue-600 underline">Duyệt tệp</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">{helperText}</p>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Link2 size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Dán đường dẫn ảnh https://..."
                    value={inputUrl}
                    onChange={(e) => setInputUrl(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleApplyUrl();
                      }
                    }}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium focus:bg-white focus:border-slate-400 outline-none"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleApplyUrl}
                  disabled={!inputUrl.trim()}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white font-bold text-xs transition cursor-pointer shrink-0"
                >
                  Áp dụng
                </button>
              </div>

              {/* Quick stock photos presets */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                  <Sparkles size={11} className="text-amber-500" />
                  Hoặc chọn nhanh ảnh mẫu chất lượng cao:
                </span>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                  {STOCK_PRESETS.map((preset, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => {
                        onChange(preset.url);
                        setInputUrl(preset.url);
                        setFileName(preset.name);
                      }}
                      className="group relative h-14 rounded-lg overflow-hidden border border-slate-200 text-left transition hover:ring-2 hover:ring-blue-500 cursor-pointer"
                      title={preset.name}
                    >
                      <img
                        src={preset.url}
                        alt={preset.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent opacity-90 p-1 flex items-end">
                        <span className="text-[9px] text-white font-bold leading-tight truncate">
                          {preset.name}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
