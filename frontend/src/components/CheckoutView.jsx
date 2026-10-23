import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  MapPin,
  Phone,
  User,
  FileText,
  CreditCard,
  QrCode,
  Banknote,
  ShieldCheck,
  Clock,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Copy,
  Sparkles,
} from 'lucide-react';

export default function CheckoutView() {
  const {
    cart,
    cartSubtotal,
    shippingFee,
    discountAmount,
    cartTotal,
    appliedVoucher,
    createOrder,
    setCustomerTab,
    user,
    showToast,
  } = useApp();

  const [customerName, setCustomerName] = useState(user.name || '');
  const [customerPhone, setCustomerPhone] = useState(user.phone || '');
  const [shippingAddress, setShippingAddress] = useState(user.address || '');
  const [note, setNote] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('vietqr'); // 'vietqr' | 'momo' | 'cod' | 'vnpay'
  const [shippingMethod, setShippingMethod] = useState('express'); // 'express' | 'standard'
  const [isSubmitting, setIsSubmitting] = useState(false);

  // VietQR parameters
  const bankAccount = '0988123456';
  const bankName = 'MB Bank (Quân Đội)';
  const accountHolder = 'ĂN VẶT PRO - NGUYỄN VĂN AN';
  const transferMessage = `ANVAT ${Math.floor(1000 + Math.random() * 9000)}`;

  const vietQrUrl = `https://img.vietqr.io/image/MB-0988123456-compact2.png?amount=${cartTotal}&addInfo=${encodeURIComponent(
    transferMessage
  )}&accountName=${encodeURIComponent(accountHolder)}`;

  const copyToClipboard = (text, label) => {
    navigator.clipboard?.writeText(text);
    showToast(`Đã sao chép ${label}!`);
  };

  const handleSubmitOrder = (e) => {
    e.preventDefault();

    if (!customerName.trim()) {
      showToast('Vui lòng nhập họ và tên người nhận!', 'error');
      return;
    }
    if (!customerPhone.trim() || customerPhone.length < 9) {
      showToast('Vui lòng nhập số điện thoại hợp lệ!', 'error');
      return;
    }
    if (!shippingAddress.trim()) {
      showToast('Vui lòng nhập địa chỉ nhận hàng chi tiết!', 'error');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      createOrder({
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        shippingAddress: shippingAddress.trim(),
        note: note.trim(),
        paymentMethod,
      });
      setIsSubmitting(false);
    }, 600);
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto my-12 bg-white p-8 rounded-3xl border border-stone-100 shadow-sm text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-orange-100 text-orange-600 mx-auto flex items-center justify-center">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-black text-stone-900">Giỏ hàng đang trống</h2>
        <p className="text-xs text-stone-500">
          Bạn chưa chọn món ăn nào để thanh toán. Vui lòng quay lại thực đơn để chọn món nhé!
        </p>
        <button
          onClick={() => setCustomerTab('menu')}
          className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-2xl shadow-md transition"
        >
          Quay lại thực đơn
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Breadcrumb / Back button */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCustomerTab('menu')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-500 hover:text-orange-600 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Tiếp tục chọn món</span>
        </button>

        <span className="text-xs font-extrabold text-orange-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
          Bước 2: Điền thông tin & Thanh toán
        </span>
      </div>

      <form onSubmit={handleSubmitOrder} className="grid lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Delivery Form & Payment Methods (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* 1. Recipient Information */}
          <div className="bg-white p-6 rounded-3xl border border-stone-100 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
              <MapPin className="w-5 h-5 text-orange-500" />
              <h2 className="text-base font-black text-stone-900">
                1. Thông Tin Nhận Hàng
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-stone-400" />
                  <span>Họ và tên người nhận *</span>
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Ví dụ: Nguyễn Văn An"
                  className="w-full px-3.5 py-2.5 bg-stone-50 rounded-xl border border-stone-200 text-xs font-medium focus:bg-white focus:border-orange-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-stone-400" />
                  <span>Số điện thoại liên hệ *</span>
                </label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="Ví dụ: 0909 123 456"
                  className="w-full px-3.5 py-2.5 bg-stone-50 rounded-xl border border-stone-200 text-xs font-medium focus:bg-white focus:border-orange-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-stone-400" />
                <span>Địa chỉ giao đồ ăn chi tiết *</span>
              </label>
              <input
                type="text"
                required
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                placeholder="Số nhà, tên đường, tòa nhà/phòng trọ, phường, quận..."
                className="w-full px-3.5 py-2.5 bg-stone-50 rounded-xl border border-stone-200 text-xs font-medium focus:bg-white focus:border-orange-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5 flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-stone-400" />
                <span>Ghi chú cho Bếp & Shipper (Tùy chọn)</span>
              </label>
              <textarea
                rows={2}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Ví dụ: Bánh tráng cho nhiều sốt bơ, trà sữa lấy 50% đường, gọi trước khi đến..."
                className="w-full px-3.5 py-2 bg-stone-50 rounded-xl border border-stone-200 text-xs font-medium focus:bg-white focus:border-orange-500 outline-none resize-none"
              ></textarea>
            </div>

            {/* Delivery speed selector */}
            <div className="pt-2">
              <label className="block text-xs font-bold text-stone-700 mb-2">
                Hình thức giao hàng:
              </label>
              <div className="grid sm:grid-cols-2 gap-3">
                <label
                  onClick={() => setShippingMethod('express')}
                  className={`p-3 rounded-2xl border cursor-pointer flex items-center gap-3 transition ${
                    shippingMethod === 'express'
                      ? 'bg-orange-50 border-orange-500 text-orange-950 shadow-xs'
                      : 'bg-white border-stone-200 text-stone-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="shippingMethod"
                    checked={shippingMethod === 'express'}
                    onChange={() => setShippingMethod('express')}
                    className="accent-orange-600"
                  />
                  <div>
                    <p className="text-xs font-black flex items-center gap-1">
                      <span>Giao Hỏa Tốc (30 - 45P)</span>
                      <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.2 rounded font-bold">HOT</span>
                    </p>
                    <p className="text-[11px] text-stone-500">Giữ món ăn nóng giòn tối đa</p>
                  </div>
                </label>

                <label
                  onClick={() => setShippingMethod('standard')}
                  className={`p-3 rounded-2xl border cursor-pointer flex items-center gap-3 transition ${
                    shippingMethod === 'standard'
                      ? 'bg-orange-50 border-orange-500 text-orange-950 shadow-xs'
                      : 'bg-white border-stone-200 text-stone-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="shippingMethod"
                    checked={shippingMethod === 'standard'}
                    onChange={() => setShippingMethod('standard')}
                    className="accent-orange-600"
                  />
                  <div>
                    <p className="text-xs font-black">Giao Tiêu Chuẩn</p>
                    <p className="text-[11px] text-stone-500">Dự kiến trong 60 phút</p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* 2. Payment Method Selection */}
          <div className="bg-white p-6 rounded-3xl border border-stone-100 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
              <CreditCard className="w-5 h-5 text-orange-500" />
              <h2 className="text-base font-black text-stone-900">
                2. Phương Thức Thanh Toán
              </h2>
            </div>

            <div className="space-y-2.5">
              {/* VietQR Option */}
              <label
                onClick={() => setPaymentMethod('vietqr')}
                className={`p-3.5 rounded-2xl border cursor-pointer flex items-center justify-between transition ${
                  paymentMethod === 'vietqr'
                    ? 'bg-orange-50 border-orange-500 shadow-sm'
                    : 'bg-white border-stone-200 hover:bg-stone-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'vietqr'}
                    onChange={() => setPaymentMethod('vietqr')}
                    className="accent-orange-600"
                  />
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <QrCode className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-stone-900 flex items-center gap-2">
                      <span>Quét mã VietQR (Tự động duyệt 24/7)</span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded">
                        KHUYÊN DÙNG
                      </span>
                    </p>
                    <p className="text-[11px] text-stone-500">
                      Chuyển khoản qua app ngân hàng MB, Vietcombank, Techcombank,...
                    </p>
                  </div>
                </div>
              </label>

              {/* MoMo Option */}
              <label
                onClick={() => setPaymentMethod('momo')}
                className={`p-3.5 rounded-2xl border cursor-pointer flex items-center justify-between transition ${
                  paymentMethod === 'momo'
                    ? 'bg-orange-50 border-orange-500 shadow-sm'
                    : 'bg-white border-stone-200 hover:bg-stone-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'momo'}
                    onChange={() => setPaymentMethod('momo')}
                    className="accent-orange-600"
                  />
                  <div className="w-9 h-9 rounded-xl bg-pink-100 text-pink-600 font-black text-xs flex items-center justify-center shrink-0">
                    MoMo
                  </div>
                  <div>
                    <p className="text-xs font-black text-stone-900">
                      Ví Điện Tử MoMo
                    </p>
                    <p className="text-[11px] text-stone-500">
                      Quét mã ví MoMo tức thì, tích điểm thưởng
                    </p>
                  </div>
                </div>
              </label>

              {/* COD Option */}
              <label
                onClick={() => setPaymentMethod('cod')}
                className={`p-3.5 rounded-2xl border cursor-pointer flex items-center justify-between transition ${
                  paymentMethod === 'cod'
                    ? 'bg-orange-50 border-orange-500 shadow-sm'
                    : 'bg-white border-stone-200 hover:bg-stone-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="accent-orange-600"
                  />
                  <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                    <Banknote className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-stone-900">
                      Thanh Toán Tiền Mặt Khi Nhận Hàng (COD)
                    </p>
                    <p className="text-[11px] text-stone-500">
                      Nhận hàng, kiểm tra đồ ăn nóng giòn rồi mới thanh toán cho shipper
                    </p>
                  </div>
                </div>
              </label>
            </div>

            {/* Dynamic VietQR Preview Card */}
            {paymentMethod === 'vietqr' && (
              <div className="mt-4 p-4 bg-gradient-to-br from-blue-50/80 to-indigo-50/50 rounded-2xl border border-blue-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <QrCode className="w-5 h-5 text-blue-700" />
                    <span className="text-xs font-black text-blue-900">
                      Mã Thanh Toán VietQR Tự Động
                    </span>
                  </div>
                  <span className="text-[10px] bg-blue-600 text-white font-bold px-2 py-0.5 rounded-md">
                    Cổng MB Bank
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="w-36 h-36 bg-white p-2 rounded-xl shadow-md border border-stone-200 shrink-0">
                    <img
                      src={vietQrUrl}
                      alt="VietQR Code"
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <div className="text-xs space-y-2 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-stone-500">Ngân hàng:</span>
                      <span className="font-bold text-stone-800">{bankName}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-stone-500">Số tài khoản:</span>
                      <div className="flex items-center gap-1.5 font-mono font-bold text-blue-700">
                        <span>{bankAccount}</span>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(bankAccount, 'số tài khoản')}
                          className="hover:text-blue-900"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-stone-500">Chủ tài khoản:</span>
                      <span className="font-bold text-stone-800 text-[11px] truncate max-w-[180px]">
                        {accountHolder}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-stone-500">Số tiền:</span>
                      <span className="font-black text-orange-600 text-sm">
                        {cartTotal.toLocaleString('vi-VN')}đ
                      </span>
                    </div>

                    <div className="flex items-center justify-between bg-white/80 p-1.5 rounded-lg border border-blue-100">
                      <span className="text-stone-500">Nội dung CK:</span>
                      <div className="flex items-center gap-1 font-mono font-black text-indigo-700">
                        <span>{transferMessage}</span>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(transferMessage, 'nội dung chuyển khoản')}
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-[10px] text-blue-600 leading-tight">
                  💡 Sau khi bấm <strong>"Xác Nhận Đặt Hàng"</strong>, hệ thống sẽ tự động kích hoạt tiến trình làm món và thông báo trực tiếp đến bếp!
                </p>
              </div>
            )}

            {/* MoMo QR Preview */}
            {paymentMethod === 'momo' && (
              <div className="mt-4 p-4 bg-pink-50 rounded-2xl border border-pink-200 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-pink-700 font-bold">
                  <Sparkles className="w-4 h-4" />
                  <span>Quét mã ví MoMo số hotline: 0988.123.456</span>
                </div>
                <p className="text-stone-600 text-[11px]">
                  Mở ứng dụng MoMo ➔ Chọn Quét mã QR ➔ Nhập số tiền{' '}
                  <strong className="text-pink-700 font-bold">{cartTotal.toLocaleString('vi-VN')}đ</strong>{' '}
                  kèm cú pháp <strong>ANVAT-{customerPhone}</strong>.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Order Summary & Confirmation (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-stone-100 shadow-sm space-y-4 sticky top-24">
            <h2 className="text-base font-black text-stone-900 border-b border-stone-100 pb-3 flex items-center justify-between">
              <span>Đơn Hàng Của Bạn</span>
              <span className="text-xs text-stone-500 font-normal">
                ({cart.reduce((s, i) => s + i.quantity, 0)} phần ăn)
              </span>
            </h2>

            {/* Items scroll */}
            <div className="max-h-60 overflow-y-auto space-y-3 pr-1">
              {cart.map((item) => (
                <div
                  key={item.cartItemId}
                  className="flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-10 h-10 rounded-xl object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="font-bold text-stone-800 truncate">
                        {item.product.name}
                      </p>
                      <div className="flex items-center gap-1.5 text-[10px] text-stone-500">
                        <span className="bg-orange-100 text-orange-700 font-bold px-1 rounded">
                          {item.spiceLevel}
                        </span>
                        <span>x{item.quantity}</span>
                      </div>
                    </div>
                  </div>

                  <span className="font-black text-stone-900 shrink-0">
                    {(item.product.price * item.quantity).toLocaleString('vi-VN')}đ
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-2 border-t border-stone-100 pt-3 text-xs text-stone-600">
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

              {appliedVoucher && (
                <div className="flex justify-between text-emerald-600 font-bold bg-emerald-50 px-2.5 py-1.5 rounded-xl">
                  <span>Voucher ({appliedVoucher.code}):</span>
                  <span>-{discountAmount.toLocaleString('vi-VN')}đ</span>
                </div>
              )}

              <div className="flex justify-between items-baseline pt-3 border-t border-stone-200 text-stone-900">
                <div>
                  <span className="text-sm font-black">Tổng thanh toán:</span>
                  <p className="text-[10px] text-stone-400">Đã bao gồm VAT & Đóng gói</p>
                </div>
                <span className="text-2xl font-black text-orange-600">
                  {cartTotal.toLocaleString('vi-VN')}đ
                </span>
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-sm rounded-2xl shadow-xl shadow-orange-500/30 transition flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-95 disabled:opacity-60"
            >
              {isSubmitting ? (
                <span>Đang xử lý đơn hàng...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Xác Nhận Đặt Hàng ({cartTotal.toLocaleString('vi-VN')}đ)</span>
                </>
              )}
            </button>

            <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 text-[11px] text-stone-500 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-stone-700">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Quyền lợi khách hàng ĂnVặtPro:</span>
              </div>
              <p>• Được đồng kiểm tra tình trạng hộp và độ nóng trước khi nhận.</p>
              <p>• Tích ngay <strong>+{Math.floor(cartTotal / 1000)} điểm</strong> vào ví tích lũy của bạn!</p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
