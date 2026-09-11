import { useState, useEffect } from "react";
import { X, Mail, Lock, User, Eye, EyeOff, CheckCircle2, ArrowRight, ShieldCheck } from "lucide-react";
import { UserProfileData, initialUserProfile } from "./data";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "login" | "register" | "forgot";
  onLoginSuccess: (user: UserProfileData) => void;
}

export default function AuthModal({
  isOpen,
  onClose,
  initialMode = "login",
  onLoginSuccess,
}: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "register" | "forgot">(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setErrorMsg("");
      setSuccessMsg("");
    }
  }, [isOpen, initialMode]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!email) {
      setErrorMsg("Vui lòng nhập địa chỉ email.");
      return;
    }

    if (mode === "forgot") {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setSuccessMsg(`Liên kết đặt lại mật khẩu đã được gửi tới ${email}.`);
      }, 800);
      return;
    }

    if (!password || password.length < 6) {
      setErrorMsg("Mật khẩu phải có ít nhất 6 ký tự.");
      return;
    }

    if (mode === "register") {
      if (!fullName.trim()) {
        setErrorMsg("Vui lòng nhập họ và tên đầy đủ.");
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg("Xác nhận mật khẩu không khớp.");
        return;
      }
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const userToLogin: UserProfileData = {
        ...initialUserProfile,
        fullName: mode === "register" ? fullName : initialUserProfile.fullName,
        email: email || initialUserProfile.email,
      };
      setSuccessMsg(mode === "register" ? "Đăng ký tài khoản thành công!" : "Đăng nhập thành công!");
      setTimeout(() => {
        onLoginSuccess(userToLogin);
        onClose();
      }, 600);
    }, 800);
  };

  const handleGoogleLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess(initialUserProfile);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div
        className="relative w-full max-w-[460px] bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden z-10 transition-all duration-300 transform scale-100"
        style={{
          boxShadow: "0 25px 50px -12px rgba(6, 78, 59, 0.25), 0 0 0 1px rgba(226, 232, 240, 0.8)",
        }}
      >
        {/* Top Header Pattern / Ambient Glow */}
        <div className="relative bg-gradient-to-br from-emerald-900 via-emerald-800 to-slate-900 px-8 pt-8 pb-7 text-white overflow-hidden">
          {/* Subtle glow circles */}
          <div className="absolute -top-12 -right-12 w-40 h-40 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-orange-500/20 rounded-full blur-xl pointer-events-none" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white flex items-center justify-center transition-colors"
          >
            <X size={18} />
          </button>

          {/* Brand & Title */}
          <div className="flex items-center gap-2 mb-2">
            <span
              className="text-2xl font-bold tracking-tight text-white"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              LangThang<span className="text-orange-400">.</span>
            </span>
          </div>

          <h3 className="text-xl font-bold text-white mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
            {mode === "login" && "Chào mừng bạn trở lại!"}
            {mode === "register" && "Tạo tài khoản mới"}
            {mode === "forgot" && "Quên mật khẩu?"}
          </h3>
          <p className="text-xs text-emerald-100/80">
            {mode === "login" && "Đăng nhập để tiếp tục hành trình khám phá Việt Nam."}
            {mode === "register" && "Tham gia cộng đồng yêu xê dịch và chia sẻ cẩm nang du lịch."}
            {mode === "forgot" && "Nhập email của bạn để nhận liên kết khôi phục mật khẩu."}
          </p>

          {/* Tabs Switcher (when not in forgot mode) */}
          {mode !== "forgot" && (
            <div className="flex bg-black/25 p-1 rounded-xl mt-5 backdrop-blur-sm border border-white/10">
              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setErrorMsg("");
                }}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                  mode === "login"
                    ? "bg-white text-emerald-950 shadow-md font-bold"
                    : "text-white/70 hover:text-white"
                }`}
              >
                Đăng nhập
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode("register");
                  setErrorMsg("");
                }}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                  mode === "register"
                    ? "bg-white text-emerald-950 shadow-md font-bold"
                    : "text-white/70 hover:text-white"
                }`}
              >
                Đăng ký thành viên
              </button>
            </div>
          )}
        </div>

        {/* Modal Form Body */}
        <div className="p-7">
          {errorMsg && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-medium flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-700 font-medium flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0" />
              {successMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name for Register */}
            {mode === "register" && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Họ và tên <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="Nguyễn Văn A"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 outline-none transition-all"
                  />
                </div>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Địa chỉ Email <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 outline-none transition-all"
                />
              </div>
            </div>

            {/* Password Field (Not for Forgot Mode) */}
            {mode !== "forgot" && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Mật khẩu <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Ít nhất 6 ký tự"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
            )}

            {/* Confirm Password (Register Mode Only) */}
            {mode === "register" && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Nhập lại mật khẩu <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <ShieldCheck size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    placeholder="Xác nhận lại mật khẩu"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
            )}

            {/* Options Row (Remember me & Forgot Password) */}
            {mode === "login" && (
              <div className="flex items-center justify-between pt-1 text-xs">
                <label className="flex items-center gap-2 text-slate-600 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-700 focus:ring-emerald-600 accent-emerald-800"
                  />
                  <span>Ghi nhớ đăng nhập</span>
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setMode("forgot");
                    setErrorMsg("");
                  }}
                  className="font-semibold text-emerald-800 hover:text-emerald-950 transition-colors"
                >
                  Quên mật khẩu?
                </button>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 px-4 rounded-xl text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/15 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {mode === "login" && "Đăng nhập ngay"}
                  {mode === "register" && "Đăng ký tài khoản"}
                  {mode === "forgot" && "Gửi yêu cầu khôi phục"}
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </form>

          {/* Social login divider */}
          {mode !== "forgot" && (
            <>
              <div className="relative flex items-center justify-center my-5">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <span className="relative px-3 bg-white text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Hoặc tiếp tục với
                </span>
              </div>

              {/* Google Button */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 active:scale-[0.99] transition-all flex items-center justify-center gap-2.5"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Đăng nhập với Google</span>
              </button>
            </>
          )}

          {/* Footer Back link for Forgot Password */}
          {mode === "forgot" && (
            <div className="mt-5 text-center">
              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setErrorMsg("");
                }}
                className="text-xs font-semibold text-emerald-800 hover:underline"
              >
                ← Quay lại đăng nhập
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
