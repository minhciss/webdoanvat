import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Ticket, Plus, X, Calendar, DollarSign, Check, Copy } from 'lucide-react';

export default function AdminVouchers() {
  const { vouchers, addVoucher, showToast } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [type, setType] = useState('fixed'); // 'fixed' | 'percent' | 'shipping'
  const [value, setValue] = useState(30000);
  const [minOrder, setMinOrder] = useState(100000);
  const [expiry, setExpiry] = useState('2026-12-31');
  const [desc, setDesc] = useState('');

  const handleCreateVoucher = (e) => {
    e.preventDefault();
    if (!code.trim()) {
      showToast('Vui lòng nhập mã code voucher!', 'error');
      return;
    }

    addVoucher({
      code: code.trim().toUpperCase(),
      name: name.trim() || `Giảm ${value.toLocaleString('vi-VN')}đ`,
      type,
      value: Number(value),
      minOrder: Number(minOrder),
      maxDiscount: type === 'percent' ? 40000 : Number(value),
      expiry,
      description: desc.trim() || `Áp dụng cho đơn từ ${Number(minOrder).toLocaleString('vi-VN')}đ`,
    });

    setIsModalOpen(false);
    setCode('');
    setName('');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs flex items-center justify-between">
        <div>
          <h2 className="text-base font-black text-stone-900">
            Quản Lý Mã Giảm Giá & Voucher ({vouchers.length})
          </h2>
          <p className="text-xs text-stone-500">
            Kích thích sức mua bằng các chiến dịch chiết khấu giờ vàng và mã bạn mới
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Tạo Mã Mới</span>
        </button>
      </div>

      {/* Grid of Vouchers */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {vouchers.map((v) => (
          <div
            key={v.code}
            className="p-5 bg-white rounded-3xl border border-stone-200 shadow-xs space-y-3 relative overflow-hidden group hover:border-orange-300 transition"
          >
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-50 border border-orange-200 rounded-xl text-orange-700 font-black text-xs uppercase tracking-wider">
                <Ticket className="w-3.5 h-3.5" />
                <span>{v.code}</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                Đang kích hoạt
              </span>
            </div>

            <div>
              <h3 className="font-extrabold text-stone-800 text-sm">{v.name}</h3>
              <p className="text-xs text-stone-500 mt-0.5">{v.description}</p>
            </div>

            <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
              <span>Đơn tối thiểu: <strong>{v.minOrder?.toLocaleString('vi-VN')}đ</strong></span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" /> Hạn: {v.expiry}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl relative text-xs">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full hover:bg-stone-100 flex items-center justify-center text-stone-400"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-black text-stone-900">
              Phát Hành Mã Giảm Giá Mới
            </h3>

            <form onSubmit={handleCreateVoucher} className="space-y-3">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Mã code *</label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="VD: ANVAT2026, BANHTRANG30"
                  className="w-full p-2.5 bg-stone-50 rounded-xl border border-stone-200 uppercase font-black tracking-wider outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Tên chương trình</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Giảm 30K cho đơn ăn vặt đêm"
                  className="w-full p-2.5 bg-stone-50 rounded-xl border border-stone-200 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Loại giảm giá</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full p-2.5 bg-stone-50 rounded-xl border border-stone-200 outline-none font-medium"
                  >
                    <option value="fixed">Số tiền trực tiếp (VNĐ)</option>
                    <option value="percent">Theo phần trăm (%)</option>
                    <option value="shipping">Miễn phí giao hàng</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    Giá trị giảm ({type === 'percent' ? '%' : 'VNĐ'})
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    className="w-full p-2.5 bg-stone-50 rounded-xl border border-stone-200 outline-none font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Đơn tối thiểu</label>
                  <input
                    type="number"
                    min="0"
                    step="10000"
                    value={minOrder}
                    onChange={(e) => setMinOrder(e.target.value)}
                    className="w-full p-2.5 bg-stone-50 rounded-xl border border-stone-200 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Ngày hết hạn</label>
                  <input
                    type="date"
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    className="w-full p-2.5 bg-stone-50 rounded-xl border border-stone-200 outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2 border border-stone-200 text-stone-600 rounded-xl font-bold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold shadow-sm"
                >
                  Phát hành ngay
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
