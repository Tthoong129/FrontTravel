import { Place } from "../../data";
import { Search, Plus, ArrowLeft } from "lucide-react";

interface PlacesTabProps {
  placesList: Place[];
  selectedPlaceId: number | null;
  setSelectedPlaceId: (id: number | null) => void;
  placeSearchText: string;
  setPlaceSearchText: (v: string) => void;
  placeFilterProvince: string;
  setPlaceFilterProvince: (v: string) => void;
  placeFilterStatus: string;
  setPlaceFilterStatus: (v: string) => void;
  setIsAddPlaceModalOpen: (v: boolean) => void;
  handleNavigateToPlaceContext: (placeId: number) => void;
}

export default function PlacesTab({
  placesList,
  selectedPlaceId,
  setSelectedPlaceId,
  placeSearchText,
  setPlaceSearchText,
  placeFilterProvince,
  setPlaceFilterProvince,
  placeFilterStatus,
  setPlaceFilterStatus,
  setIsAddPlaceModalOpen,
  handleNavigateToPlaceContext,
}: PlacesTabProps) {
  const currentPlace = selectedPlaceId ? placesList.find((p) => p.id === selectedPlaceId) : null;

  if (selectedPlaceId && currentPlace) {
    return (
      <div className="space-y-6 animate-in fade-in duration-150">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <button
            onClick={() => setSelectedPlaceId(null)}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
          >
            <ArrowLeft size={14} />
            <span>Quay lại danh sách</span>
          </button>
          <div className="flex items-center gap-4 pt-2">
            <img src={currentPlace.img} className="w-16 h-16 rounded-2xl object-cover border border-slate-200" alt="" />
            <div>
              <h2 className="text-xl font-bold text-slate-900">{currentPlace.name}</h2>
              <p className="text-xs text-slate-500 mt-0.5">{currentPlace.location} • {currentPlace.province}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="relative flex-1 min-w-[280px]">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm kiếm địa điểm theo tên, địa chỉ..."
              value={placeSearchText}
              onChange={(e) => setPlaceSearchText(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium focus:bg-white focus:border-slate-300 outline-none"
            />
          </div>

          <button
            onClick={() => setIsAddPlaceModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Plus size={14} />
            <span>Thêm địa điểm mới</span>
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 text-xs pt-1">
          <select
            value={placeFilterProvince}
            onChange={(e) => setPlaceFilterProvince(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white font-medium text-slate-700 cursor-pointer outline-none hover:border-slate-300"
          >
            <option value="all">Tất cả Tỉnh/Thành</option>
            <option value="Đà Nẵng">Đà Nẵng</option>
            <option value="Quảng Nam">Quảng Nam</option>
            <option value="Thừa Thiên Huế">Thừa Thiên Huế</option>
          </select>

          <select
            value={placeFilterStatus}
            onChange={(e) => setPlaceFilterStatus(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white font-medium text-slate-700 cursor-pointer outline-none hover:border-slate-300"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="0">Chờ duyệt</option>
            <option value="1">Đã duyệt</option>
            <option value="3">Đang ẩn</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50/70 text-slate-400 font-semibold border-b border-slate-100 text-[11px] uppercase tracking-wider">
            <tr>
              <th className="py-3.5 px-4">Tên Quán &amp; Ảnh</th>
              <th className="py-3.5 px-4">Tỉnh</th>
              <th className="py-3.5 px-4">Danh mục</th>
              <th className="py-3.5 px-4">Đánh giá</th>
              <th className="py-3.5 px-4">Trạng thái</th>
              <th className="py-3.5 px-4 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {placesList
              .filter((p) => {
                if (placeFilterProvince !== "all" && p.province !== placeFilterProvince) return false;
                if (placeFilterStatus !== "all" && String((p as any).statusNum) !== placeFilterStatus) return false;
                if (placeSearchText) {
                  return p.name.toLowerCase().includes(placeSearchText.toLowerCase());
                }
                return true;
              })
              .map((pl) => (
                <tr key={pl.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-slate-900 flex items-center gap-3">
                    <img src={pl.img} className="w-9 h-9 rounded-lg object-cover border border-slate-200" alt="" />
                    <div>
                      <span>{pl.name}</span>
                      <span className="text-[10px] text-slate-400 block font-normal">{pl.location}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-700">{pl.province}</td>
                  <td className="py-3.5 px-4 text-slate-600">{pl.category}</td>
                  <td className="py-3.5 px-4 font-bold text-amber-500">★ {pl.rating}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full font-medium text-[10px] ${
                        (pl as any).statusNum === 0
                          ? "bg-amber-50 text-amber-700 border border-amber-200"
                          : (pl as any).statusNum === 1
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {(pl as any).statusNum === 0 ? "Chờ duyệt" : (pl as any).statusNum === 1 ? "Đã duyệt" : "Đang ẩn"}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={() => handleNavigateToPlaceContext(pl.id)}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-900 hover:text-white text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
                    >
                      Xem chi tiết
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
