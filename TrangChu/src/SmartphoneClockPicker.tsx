import React, { useState, useRef, useEffect } from "react";
import {
  Clock,
  Sun,
  Moon,
  Sparkles,
  ChevronUp,
  ChevronDown,
  ArrowRight,
  Check,
  X,
  RotateCcw,
  Smartphone,
} from "lucide-react";

interface SmartphoneClockPickerProps {
  openTime: string; // e.g. "07:30"
  closeTime: string; // e.g. "22:00"
  is24Hours: boolean;
  onChange: (openTime: string, closeTime: string, is24Hours: boolean) => void;
}

// Quick presets for common Vietnam tourist spot operating hours
const TIME_PRESETS = [
  { label: "Cả ngày (07:00 – 22:00)", open: "07:00", close: "22:00", icon: "☀️" },
  { label: "Ban ngày (06:00 – 18:00)", open: "06:00", close: "18:00", icon: "🌅" },
  { label: "Cà phê sáng (06:30 – 12:00)", open: "06:30", close: "12:00", icon: "☕" },
  { label: "Chiều & Tối (14:00 – 22:30)", open: "14:00", close: "22:30", icon: "🌆" },
  { label: "Phố đêm / Bar (18:00 – 02:00)", open: "18:00", close: "02:00", icon: "🌌" },
];

export default function SmartphoneClockPicker({
  openTime = "07:30",
  closeTime = "22:00",
  is24Hours = false,
  onChange,
}: SmartphoneClockPickerProps) {
  const [modalTarget, setModalTarget] = useState<"open" | "close" | null>(null);
  const [tempHour, setTempHour] = useState<number>(7);
  const [tempMinute, setTempMinute] = useState<number>(30);
  const [clockMode, setClockMode] = useState<"hour" | "minute">("hour");

  const openInputRef = useRef<HTMLInputElement>(null);
  const closeInputRef = useRef<HTMLInputElement>(null);

  // Parse time helper
  const parseHourMin = (timeStr: string) => {
    const [h, m] = (timeStr || "08:00").split(":").map(Number);
    return {
      hour: isNaN(h) ? 8 : Math.min(23, Math.max(0, h)),
      minute: isNaN(m) ? 0 : Math.min(59, Math.max(0, m)),
    };
  };

  // Duration calculation
  const calculateDuration = (start: string, end: string) => {
    if (is24Hours) return "Mở cửa suốt ngày đêm (24/24)";
    const { hour: sh, minute: sm } = parseHourMin(start);
    const { hour: eh, minute: em } = parseHourMin(end);
    let startTotal = sh * 60 + sm;
    let endTotal = eh * 60 + em;
    if (endTotal <= startTotal) {
      endTotal += 24 * 60; // passes midnight
    }
    const diff = endTotal - startTotal;
    const h = Math.floor(diff / 60);
    const m = diff % 60;
    if (m === 0) return `${h} tiếng mỗi ngày`;
    return `${h} giờ ${m} phút mỗi ngày`;
  };

  // Adjust time by delta minutes
  const adjustTime = (target: "open" | "close", deltaMinutes: number) => {
    const current = target === "open" ? openTime : closeTime;
    const { hour, minute } = parseHourMin(current);
    let total = hour * 60 + minute + deltaMinutes;
    if (total < 0) total += 24 * 60;
    total = total % (24 * 60);
    const newH = Math.floor(total / 60)
      .toString()
      .padStart(2, "0");
    const newM = (total % 60).toString().padStart(2, "0");
    const formatted = `${newH}:${newM}`;

    if (target === "open") {
      onChange(formatted, closeTime, false);
    } else {
      onChange(openTime, formatted, false);
    }
  };

  // Open interactive clock modal
  const openClockModal = (target: "open" | "close") => {
    const timeStr = target === "open" ? openTime : closeTime;
    const { hour, minute } = parseHourMin(timeStr);
    setTempHour(hour);
    setTempMinute(minute);
    setClockMode("hour");
    setModalTarget(target);
  };

  // Apply chosen time from modal
  const handleApplyModalTime = () => {
    const formatted = `${tempHour.toString().padStart(2, "0")}:${tempMinute
      .toString()
      .padStart(2, "0")}`;
    if (modalTarget === "open") {
      onChange(formatted, closeTime, false);
    } else if (modalTarget === "close") {
      onChange(openTime, formatted, false);
    }
    setModalTarget(null);
  };

  // Trigger native phone time picker
  const triggerNativePicker = (target: "open" | "close") => {
    const ref = target === "open" ? openInputRef : closeInputRef;
    if (ref.current) {
      if (typeof ref.current.showPicker === "function") {
        try {
          ref.current.showPicker();
          return;
        } catch {
          // fallback
        }
      }
      openClockModal(target);
    }
  };

  return (
    <div className="space-y-3.5">
      {/* Top Header with 24/24 switch */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock size={16} className="text-emerald-800" />
          <span className="text-xs font-bold text-slate-900">
            Giờ đón khách <span className="text-red-500">*</span>
          </span>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
            Đồng hồ điện thoại
          </span>
        </div>

        {/* 24/24 Toggle */}
        <button
          type="button"
          onClick={() => onChange(openTime, closeTime, !is24Hours)}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            is24Hours
              ? "bg-emerald-800 text-white shadow-sm"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          <Sparkles size={13} className={is24Hours ? "text-yellow-300" : ""} />
          <span>Mở 24/24h</span>
        </button>
      </div>

      {is24Hours ? (
        /* ── 24/7 MODE BANNER ── */
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white shadow-md flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
              <strong className="text-sm font-bold tracking-wide">
                Mở cửa cả ngày (24/7)
              </strong>
            </div>
            <p className="text-xs text-emerald-200">
              Địa điểm mở cửa tự do suốt ngày đêm, không giới hạn khung giờ.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onChange("07:30", "22:00", false)}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/15 hover:bg-white/25 text-white border border-white/20 transition-all cursor-pointer"
          >
            Đổi giờ cụ thể
          </button>
        </div>
      ) : (
        /* ── PHONE CLOCK DUAL CARDS ── */
        <div className="space-y-2.5">
          <div className="grid grid-cols-1 sm:grid-cols-[1fr,auto,1fr] gap-2.5 items-center">
            {/* CARD 1: OPEN TIME */}
            <div className="relative group rounded-2xl p-3.5 bg-slate-900 text-white shadow-lg border border-slate-800 hover:border-emerald-600 transition-all">
              {/* Native hidden time input */}
              <input
                ref={openInputRef}
                type="time"
                value={openTime}
                onChange={(e) => onChange(e.target.value, closeTime, false)}
                className="absolute inset-0 opacity-0 pointer-events-none w-full h-full z-0"
              />

              <div className="flex items-center justify-between mb-2">
                <span className="flex items-center gap-1.5 text-[11px] font-bold tracking-wider text-emerald-400 uppercase">
                  <Sun size={13} className="text-amber-400" />
                  Giờ mở cửa
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/10 text-slate-300">
                  {parseInt(openTime.split(":")[0]) < 12 ? "Sáng (AM)" : "Chiều (PM)"}
                </span>
              </div>

              {/* Big Digital Clock Display */}
              <div
                onClick={() => triggerNativePicker("open")}
                className="flex items-center justify-center gap-1.5 py-1 cursor-pointer select-none group/display"
              >
                <div className="text-3xl sm:text-4xl font-mono font-black tracking-tight text-white group-hover/display:text-emerald-300 transition-colors">
                  {openTime}
                </div>
                <div className="flex flex-col gap-0.5 ml-1">
                  <Smartphone size={13} className="text-slate-400 group-hover/display:text-emerald-400" />
                </div>
              </div>

              {/* Stepper & Dial Launcher */}
              <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                <button
                  type="button"
                  onClick={() => openClockModal("open")}
                  className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Clock size={12} />
                  <span>Xoay đồng hồ</span>
                </button>

                <div className="flex items-center gap-1 text-slate-300">
                  <button
                    type="button"
                    title="Giảm 30 phút"
                    onClick={() => adjustTime("open", -30)}
                    className="w-6 h-6 rounded-md bg-slate-800 hover:bg-slate-700 flex items-center justify-center font-bold text-xs"
                  >
                    -
                  </button>
                  <button
                    type="button"
                    title="Tăng 30 phút"
                    onClick={() => adjustTime("open", 30)}
                    className="w-6 h-6 rounded-md bg-slate-800 hover:bg-slate-700 flex items-center justify-center font-bold text-xs"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Middle Divider & Duration Badge */}
            <div className="flex flex-col items-center justify-center py-1 sm:py-0">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shadow-sm">
                <ArrowRight size={15} />
              </div>
              <span className="text-[10px] font-semibold text-slate-600 mt-1 whitespace-nowrap">
                {calculateDuration(openTime, closeTime)}
              </span>
            </div>

            {/* CARD 2: CLOSE TIME */}
            <div className="relative group rounded-2xl p-3.5 bg-slate-900 text-white shadow-lg border border-slate-800 hover:border-emerald-600 transition-all">
              {/* Native hidden time input */}
              <input
                ref={closeInputRef}
                type="time"
                value={closeTime}
                onChange={(e) => onChange(openTime, e.target.value, false)}
                className="absolute inset-0 opacity-0 pointer-events-none w-full h-full z-0"
              />

              <div className="flex items-center justify-between mb-2">
                <span className="flex items-center gap-1.5 text-[11px] font-bold tracking-wider text-teal-400 uppercase">
                  <Moon size={13} className="text-cyan-400" />
                  Giờ đóng cửa
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/10 text-slate-300">
                  {parseInt(closeTime.split(":")[0]) >= 18 || parseInt(closeTime.split(":")[0]) < 6
                    ? "Tối/Đêm"
                    : "Chiều (PM)"}
                </span>
              </div>

              {/* Big Digital Clock Display */}
              <div
                onClick={() => triggerNativePicker("close")}
                className="flex items-center justify-center gap-1.5 py-1 cursor-pointer select-none group/display"
              >
                <div className="text-3xl sm:text-4xl font-mono font-black tracking-tight text-white group-hover/display:text-teal-300 transition-colors">
                  {closeTime}
                </div>
                <div className="flex flex-col gap-0.5 ml-1">
                  <Smartphone size={13} className="text-slate-400 group-hover/display:text-teal-400" />
                </div>
              </div>

              {/* Stepper & Dial Launcher */}
              <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                <button
                  type="button"
                  onClick={() => openClockModal("close")}
                  className="text-teal-400 hover:text-teal-300 font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Clock size={12} />
                  <span>Xoay đồng hồ</span>
                </button>

                <div className="flex items-center gap-1 text-slate-300">
                  <button
                    type="button"
                    title="Giảm 30 phút"
                    onClick={() => adjustTime("close", -30)}
                    className="w-6 h-6 rounded-md bg-slate-800 hover:bg-slate-700 flex items-center justify-center font-bold text-xs"
                  >
                    -
                  </button>
                  <button
                    type="button"
                    title="Tăng 30 phút"
                    onClick={() => adjustTime("close", 30)}
                    className="w-6 h-6 rounded-md bg-slate-800 hover:bg-slate-700 flex items-center justify-center font-bold text-xs"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Preset Pills */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[11px] text-slate-400 mr-1">Khung giờ phổ biến:</span>
            {TIME_PRESETS.map((preset, idx) => {
              const isActive =
                !is24Hours && openTime === preset.open && closeTime === preset.close;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onChange(preset.open, preset.close, false)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all cursor-pointer flex items-center gap-1 ${
                    isActive
                      ? "bg-emerald-800 text-white shadow-sm"
                      : "bg-white hover:bg-slate-100 border border-slate-200 text-slate-700"
                  }`}
                >
                  <span>{preset.icon}</span>
                  <span>{preset.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          INTERACTIVE SMARTPHONE CLOCK DIAL MODAL (Android / iOS Style)
      ══════════════════════════════════════════════════════════════════════ */}
      {modalTarget && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-slate-900 text-white rounded-3xl p-5 w-full max-w-sm shadow-2xl border border-slate-800 space-y-4">
            {/* Modal Title */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-emerald-400" />
                <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                  {modalTarget === "open" ? "Đặt giờ mở cửa" : "Đặt giờ đóng cửa"}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setModalTarget(null)}
                className="w-7 h-7 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white"
              >
                <X size={14} />
              </button>
            </div>

            {/* Digital Display Tabs [ 07 ] : [ 30 ] */}
            <div className="flex items-center justify-center gap-2 bg-slate-950/80 p-3 rounded-2xl border border-slate-800">
              <button
                type="button"
                onClick={() => setClockMode("hour")}
                className={`px-4 py-2 rounded-xl text-3xl sm:text-4xl font-mono font-black transition-all cursor-pointer ${
                  clockMode === "hour"
                    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-900/50 scale-105"
                    : "bg-slate-800 text-slate-400 hover:text-slate-200"
                }`}
              >
                {tempHour.toString().padStart(2, "0")}
              </button>

              <span className="text-3xl font-mono font-bold text-slate-500 animate-pulse">
                :
              </span>

              <button
                type="button"
                onClick={() => setClockMode("minute")}
                className={`px-4 py-2 rounded-xl text-3xl sm:text-4xl font-mono font-black transition-all cursor-pointer ${
                  clockMode === "minute"
                    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-900/50 scale-105"
                    : "bg-slate-800 text-slate-400 hover:text-slate-200"
                }`}
              >
                {tempMinute.toString().padStart(2, "0")}
              </button>

              <div className="ml-2 flex flex-col gap-1 text-[11px] font-bold">
                <button
                  type="button"
                  onClick={() => {
                    if (tempHour >= 12) setTempHour((prev) => prev - 12);
                  }}
                  className={`px-2 py-0.5 rounded-md ${
                    tempHour < 12
                      ? "bg-emerald-700 text-white"
                      : "bg-slate-800 text-slate-400"
                  }`}
                >
                  AM
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (tempHour < 12) setTempHour((prev) => prev + 12);
                  }}
                  className={`px-2 py-0.5 rounded-md ${
                    tempHour >= 12
                      ? "bg-emerald-700 text-white"
                      : "bg-slate-800 text-slate-400"
                  }`}
                >
                  PM
                </button>
              </div>
            </div>

            {/* Circular Clock Dial Interface */}
            <div className="relative w-60 h-60 mx-auto bg-slate-950 rounded-full border border-slate-800 shadow-inner flex items-center justify-center select-none">
              {/* Center Dot */}
              <div className="absolute w-3 h-3 rounded-full bg-emerald-500 z-20 shadow-md"></div>

              {clockMode === "hour" ? (
                /* ── 24-HOUR / 12-HOUR DIAL ── */
                <>
                  {/* Outer circle: 1 to 12 */}
                  {[12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((val) => {
                    const angle = (val * 30 - 90) * (Math.PI / 180);
                    const r = 85; // px from center
                    const x = 120 + r * Math.cos(angle);
                    const y = 120 + r * Math.sin(angle);
                    const isSelected = tempHour % 12 === val % 12 && tempHour < 12;

                    return (
                      <button
                        key={val}
                        type="button"
                        onClick={() => {
                          const newH = tempHour >= 12 ? (val === 12 ? 12 : val + 12) : (val === 12 ? 0 : val);
                          setTempHour(newH);
                          setTimeout(() => setClockMode("minute"), 250);
                        }}
                        style={{ left: `${x}px`, top: `${y}px` }}
                        className={`absolute -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full text-xs font-bold transition-all flex items-center justify-center cursor-pointer ${
                          isSelected
                            ? "bg-emerald-500 text-slate-950 font-black shadow-lg scale-110 z-10"
                            : "text-slate-300 hover:bg-slate-800 hover:text-white"
                        }`}
                      >
                        {val}
                      </button>
                    );
                  })}

                  {/* Inner circle: 00, 13 to 23 (PM) */}
                  {[0, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23].map((val, idx) => {
                    const angle = (idx * 30 - 90) * (Math.PI / 180);
                    const r = 52; // inner circle
                    const x = 120 + r * Math.cos(angle);
                    const y = 120 + r * Math.sin(angle);
                    const isSelected = tempHour === val;

                    return (
                      <button
                        key={val}
                        type="button"
                        onClick={() => {
                          setTempHour(val);
                          setTimeout(() => setClockMode("minute"), 250);
                        }}
                        style={{ left: `${x}px`, top: `${y}px` }}
                        className={`absolute -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full text-[10px] font-semibold transition-all flex items-center justify-center cursor-pointer ${
                          isSelected
                            ? "bg-teal-400 text-slate-950 font-black shadow-lg scale-110 z-10"
                            : "text-slate-400 hover:bg-slate-800 hover:text-white"
                        }`}
                      >
                        {val === 0 ? "00" : val}
                      </button>
                    );
                  })}
                </>
              ) : (
                /* ── MINUTE DIAL (00, 05, 10, ... 55) ── */
                <>
                  {[0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55].map((min, idx) => {
                    const angle = (idx * 30 - 90) * (Math.PI / 180);
                    const r = 85;
                    const x = 120 + r * Math.cos(angle);
                    const y = 120 + r * Math.sin(angle);
                    const isSelected = Math.round(tempMinute / 5) * 5 % 60 === min;

                    return (
                      <button
                        key={min}
                        type="button"
                        onClick={() => setTempMinute(min)}
                        style={{ left: `${x}px`, top: `${y}px` }}
                        className={`absolute -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full text-xs font-bold transition-all flex items-center justify-center cursor-pointer ${
                          isSelected
                            ? "bg-emerald-500 text-slate-950 font-black shadow-lg scale-110 z-10"
                            : "text-slate-300 hover:bg-slate-800 hover:text-white"
                        }`}
                      >
                        {min.toString().padStart(2, "0")}
                      </button>
                    );
                  })}
                </>
              )}
            </div>

            {/* Quick minute increments below clock */}
            <div className="flex items-center justify-center gap-1.5 pt-1">
              <span className="text-[11px] text-slate-400 mr-1">Chỉnh nhanh:</span>
              {[0, 15, 30, 45].map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setTempMinute(m)}
                  className={`px-2 py-1 rounded-lg text-[11px] font-mono font-semibold transition-colors ${
                    tempMinute === m
                      ? "bg-emerald-700 text-white"
                      : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                  }`}
                >
                  :{m.toString().padStart(2, "0")}
                </button>
              ))}
            </div>

            {/* Modal Actions */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setModalTarget(null)}
                className="py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleApplyModalTime}
                className="py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/40 transition-all flex items-center justify-center gap-1.5"
              >
                <Check size={14} />
                <span>Xác nhận</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
