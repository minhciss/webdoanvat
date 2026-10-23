import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  Ticket,
  ArrowRight,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';

export default function CartView() {
  const {
    cart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartSubtotal,
    shippingFee,
    discountAmount,
    cartTotal,
    appliedVoucher,
    voucherError,
    applyVoucher,
    removeVoucher,
    setCustomerTab,
  } = useApp();

  const [inputCode, setInputCode] = useState('');

  const handleApplyVoucher = (e) => {
    e.preventDefault();
    if (inputCode) {
      applyVoucher(inputCode);
      setInputCode('');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto my-12 bg-white p-8 rounded-3xl border border-stone-100 shadow-sm text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-orange-100 text-orange-600 mx-auto flex items-center justify-center">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-black text-stone-900">Giỏ hàng của bạn đang trống</h2>
        <p className="text-xs text-stone-500">
          Hãy quay lại thực đơn để chọn các món ăn vặt giòn ngon hấp dẫn nhé!
        </p>
        <button
          onClick={() => setCustomerTab('menu')}
          className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-2xl shadow-md transition"
        >
          Khám phá thực đơn
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header and Back Button */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCustomerTab('menu')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-500 hover:text-orange-600 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Tiếp tục chọn món ăn</span>
        </button>

        <span className="text-xs font-extrabold text-orange-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
          Bước 1: Kiểm tra Giỏ hàng ({cart.reduce((s, i) => s + i.quantity, 0)} phần)
        </span>
      </div>

      <div className="grid lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Cart Items Table (8 cols) */}
        <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-stone-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <h2 className="text-base font-black text-stone-900">
              Danh Sách Món Ăn Trong Giỏ
            </h2>
            <button
              onClick={clearCart}
              className="text-xs text-stone-400 hover:text-red-500 font-bold transition flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Xóa toàn bộ</span>
            </button>
          </div>

          {/* Items Table */}
          <div className="divide-y divide-stone-100">
            {cart.map((item) => (
              <div
                key={item.cartItemId}
                className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-16 h-16 rounded-2xl object-cover shrink-0 border border-stone-200"
                  />
                  <div>
                    <h3 className="font-extrabold text-stone-900 text-sm">
                      {item.product.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="bg-orange-100 text-orange-700 font-bold px-2 py-0.5 rounded-md text-[10px]">
                        Khẩu vị: {item.spiceLevel}
                      </span>
                      <span className="text-stone-400">|</span>
                      <span className="text-orange-600 font-bold">
                        {item.product.price.toLocaleString('vi-VN')}đ / phần
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6">
                  {/* Quantity Spinner */}
                  <div className="flex items-center bg-stone-100 rounded-xl border border-stone-200 p-0.5">
                    <button
                      onClick={() =>
                        updateCartQuantity(item.cartItemId, item.quantity - 1)
                      }
                      className="w-6 h-6 bg-white hover:bg-orange-50 rounded-lg flex items-center justify-center text-stone-700 font-bold"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center font-black text-stone-900">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateCartQuantity(item.cartItemId, item.quantity + 1)
                      }
                      className="w-6 h-6 bg-white hover:bg-orange-50 rounded-lg flex items-center justify-center text-stone-700 font-bold"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Total */}
                  <div className="text-right min-w-[90px]">
                    <span className="text-sm font-black text-stone-900 block">
                      {(item.product.price * item.quantity).toLocaleString('vi-VN')}đ
                    </span>
                  </div>

                  {/* Delete button */}
                  <button
                    onClick={() => removeFromCart(item.cartItemId)}
                    className="text-stone-300 hover:text-red-500 p-1.5 transition"
                    title="Xóa món"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Voucher & Checkout Summary (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white p-6 rounded-3xl border border-stone-100 shadow-sm space-y-4">
            <h3 className="text-base font-black text-stone-900 border-b border-stone-100 pb-3">
              Mã Ưu Đãi & Thanh Toán
            </h3>

            {/* Voucher input */}
            <div>
              {appliedVoucher ? (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Ticket className="w-4 h-4 text-emerald-600" />
                    <div>
                      <span className="font-bold text-emerald-900">{appliedVoucher.code}</span>
                      <p className="text-[10px] text-emerald-700">{appliedVoucher.name}</p>
                    </div>
                  </div>
                  <button
                    onClick={removeVoucher}
                    className="text-xs text-stone-400 hover:text-red-600 font-bold"
                  >
                    Hủy
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyVoucher} className="flex gap-2">
                  <input
                    type="text"
                    value={inputCode}
                    onChange={(e) => setInputCode(e.target.value)}
                    placeholder="Mã voucher (ANVAT50)..."
                    className="flex-1 px-3 py-2.5 bg-stone-50 rounded-xl border border-stone-200 text-xs font-bold uppercase tracking-wider outline-none focus:border-orange-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs rounded-xl transition"
                  >
                    Áp dụng
                  </button>
                </form>
              )}
              {voucherError && (
                <p className="text-[11px] text-red-500 font-medium mt-1">{voucherError}</p>
              )}
            </div>

            {/* Summary details */}
            <div className="space-y-2 text-xs text-stone-600 border-t border-stone-100 pt-3">
              <div className="flex justify-between">
                <span>Tạm tính đồ ăn:</span>
                <span className="font-bold text-stone-800">
                  {cartSubtotal.toLocaleString('vi-VN')}đ
                </span>
              </div>
              <div className="flex justify-between">
                <span>Phí giao hàng:</span>
                <span className="font-bold text-stone-800">
                  {shippingFee === 0 ? (
                    <span className="text-emerald-600 font-bold">Freeship 0đ</span>
                  ) : (
                    `${shippingFee.toLocaleString('vi-VN')}đ`
                  )}
                </span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Giảm giá Voucher:</span>
                  <span>-{discountAmount.toLocaleString('vi-VN')}đ</span>
                </div>
              )}
              <div className="flex justify-between items-baseline pt-3 border-t border-stone-200 text-stone-900 font-black">
                <span className="text-sm">Tổng cộng:</span>
                <span className="text-xl text-orange-600">
                  {cartTotal.toLocaleString('vi-VN')}đ
                </span>
              </div>
            </div>

            <button
              onClick={() => setCustomerTab('checkout')}
              className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-sm rounded-2xl shadow-lg shadow-orange-500/25 transition flex items-center justify-center gap-2 hover:scale-[1.01]"
            >
              <span>Đi Đến Thanh Toán</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
