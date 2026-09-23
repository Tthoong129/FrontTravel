import React from "react";
import { X, Save } from "lucide-react";
import ImageUploader from "../components/ImageUploader";

interface EditPlaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  form: {
    id: number;
    name: string;
    category: string;
    province: string;
    location: string;
    price: string;
    hours: string;
    phone: string;
    website: string;
    desc: string;
    img: string;
  };
  setForm: React.Dispatch<React.SetStateAction<any>>;
  onSubmit: () => void;
}

export default function EditPlaceModal({
  isOpen,
  onClose,
  form,
  setForm,
  onSubmit,
}: EditPlaceModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl border border-slate-200/80 text-xs max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-bold text-base text-slate-900 tracking-tight">
              Chỉnh sửa địa điểm
            </h3>
            <p className="text-slate-400 text-xs mt-0.5">
              Cập nhật thông tin địa điểm đang có trên hệ thống
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div className="sm:col-span-2">
            <label className="font-semibold text-slate-700 block mb-1">Tên địa điểm *</label>
            <input
              type="text"
              placeholder="Ví dụ: Bánh Mì Phượng"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-medium text-slate-800 placeholder:text-slate-400 focus:bg-white outline-none focus:border-slate-300"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Tỉnh/Thành</label>
            <select
              value={form.province}
              onChange={(e) => setForm({ ...form, province: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-medium text-slate-800 focus:bg-white outline-none cursor-pointer"
            >
              <option value="Đà Nẵng">Đà Nẵng</option>
              <option value="Quảng Nam">Quảng Nam</option>
              <option value="Thừa Thiên Huế">Thừa Thiên Huế</option>
              <option value="Khánh Hòa">Khánh Hòa</option>
              <option value="Lâm Đồng">Lâm Đồng</option>
            </select>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Danh mục</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-medium text-slate-800 focus:bg-white outline-none cursor-pointer"
            >
              <option value="Nhà hàng & Quán ăn">Nhà hàng &amp; Quán ăn</option>
              <option value="Quán Cà phê & Trà">Quán Cà phê &amp; Trà</option>
              <option value="Ẩm thực đường phố">Ẩm thực đường phố</option>
              <option value="Điểm tham quan">Điểm tham quan</option>
              <option value="Lưu trú">Lưu trú</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="font-semibold text-slate-700 block mb-1">Địa chỉ chi tiết *</label>
            <input
              type="text"
              placeholder="Số nhà, tên đường, phường/xã..."
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-medium text-slate-800 placeholder:text-slate-400 focus:bg-white outline-none focus:border-slate-300"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Số điện thoại</label>
            <input
              type="text"
              placeholder="Ví dụ: 0905 123 456"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-medium text-slate-800 focus:bg-white outline-none"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Website / Fanpage</label>
            <input
              type="text"
              placeholder="https://..."
              value={form.website}
              onChange={(e) => setForm({ ...form, website: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-medium text-slate-800 focus:bg-white outline-none"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Mức giá tham khảo</label>
            <input
              type="text"
              placeholder="Ví dụ: 35.000đ – 75.000đ"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-medium text-slate-800 focus:bg-white outline-none"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Giờ mở cửa</label>
            <input
              type="text"
              placeholder="07:00 – 22:00"
              value={form.hours}
              onChange={(e) => setForm({ ...form, hours: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-medium text-slate-800 focus:bg-white outline-none"
            />
          </div>

          <div className="sm:col-span-2">
            <ImageUploader
              value={form.img}
              onChange={(url) => setForm({ ...form, img: url })}
              label="Ảnh bìa địa điểm *"
              helperText="Chọn tệp từ máy hoặc nhập URL (kèm ảnh mẫu du lịch có sẵn)"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="font-semibold text-slate-700 block mb-1">Mô tả giới thiệu</label>
            <textarea
              placeholder="Nhập mô tả về địa điểm..."
              value={form.desc}
              onChange={(e) => setForm({ ...form, desc: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-medium text-slate-800 placeholder:text-slate-400 focus:bg-white outline-none focus:border-slate-300 resize-none"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium cursor-pointer transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={onSubmit}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium cursor-pointer transition-colors shadow-xs flex items-center gap-1.5"
          >
            <Save size={14} />
            <span>Lưu thay đổi</span>
          </button>
        </div>
      </div>
    </div>
  );
}
