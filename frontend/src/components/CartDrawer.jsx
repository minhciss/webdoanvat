import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  Ticket,
  ChevronRight,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

export default function CartDrawer() {
  const {
    isCartDrawerOpen,
    setIsCartDrawerOpen,
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

  if (!isCartDrawerOpen) return null;

  const handleApplyVoucher = (e) => {
    e.preventDefault();
    if (inputCode) {
      applyVoucher(inputCode);
      setInputCode('');
    }
  };

  const handleGoToCheckout = () => {
    setIsCartDrawerOpen(false);
    setCustomerTab('checkout');
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300"
      >
        {/* Drawer Header */}
        <div className="p-4 border-b border-stone-100 flex items-center justify-between bg-orange-50/50">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-orange-600" />
            <h2 className="text-base font-black text-stone-900">
              Giỏ Hàng Ăn Vặt ({cart.reduce((s, i) => s + i.quantity, 0)})
            </h2>
          </div>
          <button
            onClick={() => setIsCartDrawerOpen(false)}
            className="w-8 h-8 rounded-full hover:bg-stone-200 flex items-center justify-center text-stone-500 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress bar */}
        <div className="px-4 py-2.5 bg-amber-50 border-b border-amber-100 text-xs">
          {cartSubtotal >= 250000 ? (
            <p className="font-bold text-emerald-700 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Đơn hàng của bạn được <strong>Miễn phí giao hàng (Freeship)!</strong></span>
            </p>
          ) : (
            <div>
              <p className="text-stone-600 font-medium">
                Mua thêm <strong className="text-orange-600 font-bold">{(250000 - cartSubtotal).toLocaleString('vi-VN')}đ</strong> để được Freeship toàn thành phố!
              </p>
              <div className="w-full bg-stone-200 h-1.5 rounded-full mt-1.5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-orange-500 to-amber-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, (cartSubtotal / 250000) * 100)}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
              <div className="w-16 h-16 rounded-full bg-orange-50 text-orange-400 flex items-center justify-center">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-stone-700 text-sm">Giỏ hàng của bạn đang trống!</h3>
              <p className="text-xs text-stone-400 max-w-xs">
                Hãy dạo quanh thực đơn và chọn cho mình những món bánh tráng, chân gà thật ngon miệng nhé.
              </p>
              <button
                onClick={() => {
                  setIsCartDrawerOpen(false);
                  setCustomerTab('menu');
                }}
                className="mt-2 px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow-md transition"
              >
                Khám phá món ngay
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.cartItemId}
                className="flex items-center gap-3 p-3 bg-stone-50 rounded-2xl border border-stone-100 hover:border-orange-200 transition"
              >
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-16 h-16 rounded-xl object-cover border border-stone-200 shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-stone-800 truncate">
                    {item.product.name}
                  </h4>
                  <div className="flex items-center gap-1.5 my-1">
                    <span className="text-[10px] bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded font-bold">
                      {item.spiceLevel}
                    </span>
                    <span className="text-[11px] font-black text-orange-600">
                      {item.product.price.toLocaleString('vi-VN')}đ
                    </span>
                  </div>

                  {/* Quantity Spinner */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center bg-white rounded-lg border border-stone-200 p-0.5">
                      <button
                        onClick={() => updateCartQuantity(item.cartItemId, item.quantity - 1)}
                        className="w-5 h-5 rounded hover:bg-stone-100 flex items-center justify-center text-stone-600"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-6 text-center text-xs font-bold text-stone-800">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.cartItemId, item.quantity + 1)}
                        className="w-5 h-5 rounded hover:bg-stone-100 flex items-center justify-center text-stone-600"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <span className="text-xs font-bold text-stone-700 ml-auto">
                      {(item.product.price * item.quantity).toLocaleString('vi-VN')}đ
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => removeFromCart(item.cartItemId)}
                  className="text-stone-400 hover:text-red-500 p-1 transition"
                  title="Xóa món"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Bottom Checkout & Voucher Section */}
        {cart.length > 0 && (
          <div className="p-4 border-t border-stone-200 bg-white space-y-3 shadow-lg">
            {/* Voucher input */}
            <div>
              {appliedVoucher ? (
                <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs">
                  <div className="flex items-center gap-2">
                    <Ticket className="w-4 h-4 text-emerald-600" />
                    <div>
                      <span className="font-bold text-emerald-800">{appliedVoucher.code}</span>
                      <p className="text-[10px] text-emerald-600 font-medium">
                        {appliedVoucher.name}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={removeVoucher}
                    className="text-stone-400 hover:text-red-600 text-xs font-bold"
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
                    placeholder="Nhập mã voucher (ANVAT50, FREESHIP)..."
                    className="flex-1 px-3 py-2 bg-stone-100 rounded-xl border border-stone-200 text-xs uppercase font-bold tracking-wider outline-none focus:border-orange-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs rounded-xl transition"
                  >
                    Áp dụng
                  </button>
                </form>
              )}
              {voucherError && (
                <p className="text-[11px] text-rose-500 font-semibold mt-1">
                  {voucherError}
                </p>
              )}
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-1.5 text-xs text-stone-600 border-t border-stone-100 pt-2">
              <div className="flex justify-between">
                <span>Tạm tính tiền món:</span>
                <span className="font-bold text-stone-800">
                  {cartSubtotal.toLocaleString('vi-VN')}đ
                </span>
              </div>
              <div className="flex justify-between">
                <span>Phí giao hàng:</span>
                <span className="font-bold text-stone-800">
                  {shippingFee === 0 ? (
                    <span className="text-emerald-600 font-bold">Miễn phí</span>
                  ) : (
                    `${shippingFee.toLocaleString('vi-VN')}đ`
                  )}
                </span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Giảm giá khuyến mãi:</span>
                  <span>-{discountAmount.toLocaleString('vi-VN')}đ</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-black text-stone-900 pt-2 border-t border-stone-200">
                <span>Tổng thanh toán:</span>
                <span className="text-orange-600 text-base">
                  {cartTotal.toLocaleString('vi-VN')}đ
                </span>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-2 pt-1">
              <button
                onClick={clearCart}
                className="px-3 py-3 border border-stone-200 hover:bg-stone-100 text-stone-600 rounded-2xl text-xs font-bold transition"
                title="Xóa toàn bộ giỏ hàng"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <button
                onClick={handleGoToCheckout}
                className="flex-1 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-xs rounded-2xl shadow-lg shadow-orange-500/25 transition flex items-center justify-center gap-2 hover:scale-[1.01]"
              >
                <span>Tiến Hành Đặt Hàng ({cartTotal.toLocaleString('vi-VN')}đ)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
