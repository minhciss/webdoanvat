import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  FileSearch,
  CheckCircle2,
  Clock,
  Truck,
  ChefHat,
  MapPin,
  Phone,
  User,
  ShoppingBag,
  AlertCircle,
  XCircle,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Star,
  Send,
} from 'lucide-react';

export default function OrderTrackingView() {
  const {
    user,
    orders,
    activeTrackingId,
    setActiveTrackingId,
    cancelOrder,
    setCustomerTab,
    showToast,
    reviewOrder,
    products,
    viewProductDetail,
  } = useApp();

  const [searchCode, setSearchCode] = useState(activeTrackingId || '');
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('Đổi ý không ăn nữa');

  // Star rating & Review description state
  const [orderRating, setOrderRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [orderReviewComment, setOrderReviewComment] = useState('');
  const [justReviewedOrders, setJustReviewedOrders] = useState({});

  const starLabels = {
    1: '⭐ Không hài lòng',
    2: '⭐⭐ Chưa ưng ý',
    3: '⭐⭐⭐ Bình thường, tạm ổn',
    4: '⭐⭐⭐⭐ Rất ngon & hài lòng',
    5: '⭐⭐⭐⭐⭐ Tuyệt vời xuất sắc (Chuẩn vị, nóng giòn)',
  };

  // Filter user's own orders
  const userOrders = orders.filter((o) => {
    if (user?.role === 'admin') return true;
    return (
      (o.userId && o.userId === user?.id) ||
      (o.customerPhone && user?.phone && o.customerPhone.trim() === user?.phone.trim()) ||
      (o.customerName && user?.name && o.customerName.trim().toLowerCase() === user?.name.trim().toLowerCase())
    );
  });

  // Find order
  const currentOrder = orders.find(
    (o) => o.id.toUpperCase() === (searchCode || activeTrackingId || '').toUpperCase()
  );

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchCode.trim()) return;
    setActiveTrackingId(searchCode.trim().toUpperCase());
  };

  const statusSteps = [
    {
      id: 'pending',
      title: 'Đã Tiếp Nhận Đơn',
      desc: 'Hệ thống đã ghi nhận đơn vào CSDL',
      icon: Clock,
    },
    {
      id: 'confirmed',
      title: 'Bếp Đang Làm Món',
      desc: 'Quán đang chế biến nóng giòn',
      icon: ChefHat,
    },
    {
      id: 'shipping',
      title: 'Đang Giao Hàng',
      desc: 'Shipper đang hỏa tốc đến địa chỉ bạn',
      icon: Truck,
    },
    {
      id: 'completed',
      title: 'Giao Thành Công',
      desc: 'Chúc bạn có bữa ăn vặt ngon miệng!',
      icon: CheckCircle2,
    },
  ];

  const getStepIndex = (status) => {
    switch (status) {
      case 'pending':
        return 0;
      case 'confirmed':
        return 1;
      case 'shipping':
        return 2;
      case 'completed':
        return 3;
      case 'cancelled':
        return -1;
      default:
        return 0;
    }
  };

  const currentStepIdx = currentOrder ? getStepIndex(currentOrder.status) : 0;

  const handleCancelSubmit = () => {
    if (currentOrder) {
      cancelOrder(currentOrder.id, cancelReason);
      setCancelModalOpen(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header and Search lookup */}
      <div className="bg-white p-6 rounded-3xl border border-stone-100 shadow-sm text-center space-y-4">
        <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold">
          <FileSearch className="w-4 h-4" />
          <span>Hệ Thống Theo Dõi Đơn Hàng Thời Gian Thực</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
          Tra Cứu Tiến Trình Đơn Hàng ĂnVặtPro
        </h1>

        <p className="text-xs text-stone-500 max-w-md mx-auto">
          Nhập mã đơn hàng <strong>AV-xxxxx</strong> (được cấp sau khi đặt hàng) để theo dõi bếp chế biến và vị trí giao hàng.
        </p>

        {/* Search bar */}
        <form onSubmit={handleSearch} className="max-w-md mx-auto flex gap-2">
          <input
            type="text"
            value={searchCode}
            onChange={(e) => setSearchCode(e.target.value)}
            placeholder="Nhập mã đơn (VD: AV-89211)..."
            className="flex-1 px-4 py-2.5 bg-stone-100 rounded-2xl border border-stone-200 text-xs uppercase font-bold tracking-wider outline-none focus:border-orange-500 focus:bg-white"
          />
          <button
            type="submit"
            className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-2xl shadow-md transition"
          >
            Tra cứu
          </button>
        </form>

        {/* Quick select buttons from user's own orders */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-2 text-xs">
          <span className="text-stone-500 text-[11px] font-bold">
            {userOrders.length > 0 ? 'Đơn hàng của bạn:' : 'Mã đơn gần đây:'}
          </span>
          {(userOrders.length > 0 ? userOrders : orders.slice(0, 2)).map((ord) => (
            <button
              key={ord.id}
              onClick={() => {
                setSearchCode(ord.id);
                setActiveTrackingId(ord.id);
              }}
              className={`px-3 py-1 rounded-xl border text-[11px] font-bold transition flex items-center gap-1.5 ${
                (activeTrackingId || '').toUpperCase() === ord.id.toUpperCase()
                  ? 'bg-orange-500 text-white border-orange-600 shadow-sm scale-105'
                  : 'bg-stone-50 hover:bg-orange-50 hover:border-orange-200 text-stone-700 border-stone-200'
              }`}
            >
              <span>{ord.id}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded ${
                (activeTrackingId || '').toUpperCase() === ord.id.toUpperCase() ? 'bg-white/20 text-white' : 'bg-stone-200/70 text-stone-600'
              }`}>
                {ord.status === 'pending' ? 'Chờ duyệt' : ord.status === 'confirmed' ? 'Bếp làm' : ord.status === 'shipping' ? 'Đang giao' : ord.status === 'cancelled' ? 'Đã hủy' : 'Hoàn tất'}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Order Details Display */}
      {currentOrder ? (
        <div className="bg-white rounded-3xl border border-stone-100 shadow-sm overflow-hidden">
          {/* Status Header Banner */}
          <div
            className={`p-6 text-white ${
              currentOrder.status === 'cancelled'
                ? 'bg-gradient-to-r from-stone-700 to-red-800'
                : currentOrder.status === 'completed'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-700'
                : 'bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500'
            }`}
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl sm:text-2xl font-black tracking-tight">
                    Đơn hàng #{currentOrder.id}
                  </span>
                  <span className="bg-white/20 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase">
                    {currentOrder.status}
                  </span>
                </div>
                <p className="text-xs text-orange-100 mt-1">
                  Thời gian đặt: {currentOrder.orderDate} • Phương thức:{' '}
                  {currentOrder.paymentMethod?.toUpperCase()}
                </p>
              </div>

              <div className="text-right">
                <span className="text-xs text-orange-100 block">Tổng tiền đơn:</span>
                <span className="text-2xl font-black text-yellow-300">
                  {currentOrder.totalAmount?.toLocaleString('vi-VN')}đ
                </span>
              </div>
            </div>
          </div>

          {/* Stepper (Only if not cancelled) */}
          {currentOrder.status !== 'cancelled' ? (
            <div className="p-6 border-b border-stone-100 bg-stone-50/50">
              <h3 className="text-xs font-black text-stone-800 mb-6 uppercase tracking-wider">
                Tiến Trình Chế Biến & Giao Hàng
              </h3>

              <div className="relative">
                {/* Connecting line */}
                <div className="absolute top-5 left-6 right-6 h-1 bg-stone-200 -z-0 hidden md:block">
                  <div
                    className="h-full bg-orange-500 transition-all duration-500"
                    style={{
                      width: `${(currentStepIdx / (statusSteps.length - 1)) * 100}%`,
                    }}
                  ></div>
                </div>

                <div className="grid md:grid-cols-4 gap-4 relative z-10">
                  {statusSteps.map((step, idx) => {
                    const StepIcon = step.icon;
                    const isDone = idx <= currentStepIdx;
                    const isCurrent = idx === currentStepIdx;

                    return (
                      <div
                        key={step.id}
                        className={`flex md:flex-col items-center md:items-center gap-3 md:text-center p-3 rounded-2xl transition ${
                          isCurrent
                            ? 'bg-orange-50/80 border border-orange-200'
                            : 'bg-transparent'
                        }`}
                      >
                        <div
                          className={`w-10 h-10 rounded-2xl flex items-center justify-center transition shadow-sm ${
                            isDone
                              ? 'bg-orange-500 text-white'
                              : 'bg-stone-200 text-stone-400'
                          }`}
                        >
                          <StepIcon className="w-5 h-5" />
                        </div>

                        <div>
                          <p
                            className={`text-xs font-black ${
                              isDone ? 'text-stone-900' : 'text-stone-400'
                            }`}
                          >
                            {step.title}
                          </p>
                          <p className="text-[11px] text-stone-500 leading-tight">
                            {step.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 bg-red-50 text-red-800 border-b border-red-100 flex items-center gap-3">
              <XCircle className="w-6 h-6 text-red-600 shrink-0" />
              <div>
                <p className="font-bold text-sm">Đơn hàng này đã bị hủy</p>
                <p className="text-xs text-red-600">{currentOrder.note}</p>
              </div>
            </div>
          )}

          {/* Details Body */}
          <div className="p-6 grid md:grid-cols-2 gap-6">
            {/* Left: Recipient & Delivery */}
            <div className="space-y-4">
              <h4 className="text-xs font-black text-stone-800 uppercase tracking-wider flex items-center gap-2">
                <User className="w-4 h-4 text-orange-500" />
                <span>Thông Tin Nhận Hàng</span>
              </h4>

              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-100 text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-stone-500">Khách hàng:</span>
                  <span className="font-bold text-stone-900">{currentOrder.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Số điện thoại:</span>
                  <span className="font-bold text-stone-900">{currentOrder.customerPhone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Địa chỉ giao:</span>
                  <span className="font-bold text-stone-900 text-right max-w-xs">
                    {currentOrder.shippingAddress}
                  </span>
                </div>
                {currentOrder.note && (
                  <div className="pt-2 border-t border-stone-200">
                    <span className="text-stone-500 block mb-0.5">Ghi chú cho quán:</span>
                    <p className="font-medium text-orange-800 bg-orange-50 p-2 rounded-xl text-[11px]">
                      "{currentOrder.note}"
                    </p>
                  </div>
                )}
              </div>

              {/* Payment Status Badge */}
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-100 text-xs space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-stone-500">Phương thức:</span>
                  <span className="font-bold text-stone-900 uppercase">
                    {currentOrder.paymentMethod}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-stone-500">Trạng thái thanh toán:</span>
                  <span
                    className={`font-bold px-2 py-0.5 rounded-full text-[10px] ${
                      currentOrder.paymentStatus === 'paid'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {currentOrder.paymentStatus === 'paid'
                      ? 'Đã thanh toán Online'
                      : 'Chờ thu tiền mặt (COD)'}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Items list */}
            <div className="space-y-4">
              <h4 className="text-xs font-black text-stone-800 uppercase tracking-wider flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-orange-500" />
                <span>Món Ăn Trong Đơn ({currentOrder.items?.length || 0})</span>
              </h4>

              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {currentOrder.items?.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 bg-stone-50 rounded-2xl border border-stone-100 text-xs"
                  >
                    <div>
                      <p className="font-bold text-stone-900">{item.name}</p>
                      <div className="flex items-center gap-2 text-[10px] text-stone-500 mt-0.5">
                        <span className="bg-orange-100 text-orange-700 font-bold px-1.5 py-0.2 rounded">
                          {item.spiceLevel}
                        </span>
                        <span>x{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => {
                            const prod = products.find((p) => p.id === item.id);
                            if (prod) viewProductDetail(prod);
                          }}
                          className="text-orange-600 hover:text-orange-700 font-bold hover:underline flex items-center gap-0.5 ml-2"
                        >
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          <span>Đánh giá món này</span>
                        </button>
                      </div>
                    </div>
                    <span className="font-black text-stone-800">
                      {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                    </span>
                  </div>
                ))}
              </div>

              {/* Price summary table */}
              <div className="border-t border-stone-200 pt-3 text-xs space-y-1.5 text-stone-600">
                <div className="flex justify-between">
                  <span>Phí giao hàng:</span>
                  <span className="font-semibold text-stone-800">
                    {currentOrder.shippingFee === 0
                      ? 'Freeship 0đ'
                      : `${currentOrder.shippingFee?.toLocaleString('vi-VN')}đ`}
                  </span>
                </div>
                {currentOrder.discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Mã giảm giá ({currentOrder.voucherCode}):</span>
                    <span>-{currentOrder.discountAmount?.toLocaleString('vi-VN')}đ</span>
                  </div>
                )}
                <div className="flex justify-between font-black text-sm text-stone-900 pt-2 border-t border-stone-100">
                  <span>Tổng tiền đã tính:</span>
                  <span className="text-orange-600 text-base">
                    {currentOrder.totalAmount?.toLocaleString('vi-VN')}đ
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Section: ĐÁNH GIÁ SAO VÀ MÔ TẢ CẢM NHẬN KHI ĐƠN ĐÃ GIAO THÀNH CÔNG */}
          {currentOrder.status === 'completed' && (() => {
            const isReviewed = currentOrder.reviewed || !!justReviewedOrders[currentOrder.id];
            const displayRating = currentOrder.rating || justReviewedOrders[currentOrder.id]?.rating || orderRating;
            const displayComment = currentOrder.reviewComment || justReviewedOrders[currentOrder.id]?.comment || orderReviewComment;

            return (
              <div className="p-6 bg-stone-50/50 border-t border-stone-100">
                {isReviewed ? (
                  <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-3xl p-5 space-y-2.5 animate-in fade-in duration-300">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <span className="text-xs font-black text-emerald-800 flex items-center gap-1.5 uppercase">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Bạn đã gửi đánh giá cho đơn hàng này</span>
                      </span>
                      <div className="flex items-center gap-1 text-amber-400">
                        {Array.from({ length: displayRating || 5 }).map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    </div>
                    {displayComment && (
                      <p className="text-xs text-stone-700 bg-white/90 p-3 rounded-2xl border border-emerald-100 italic">
                        "{displayComment}"
                      </p>
                    )}
                    <p className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>Đã tích lũy +20 Xu ĂnVặtPro vào tài khoản của bạn. Cảm ơn phản hồi quý báu của bạn!</span>
                    </p>
                  </div>
                ) : (
                  <div className="bg-gradient-to-br from-amber-50/90 via-orange-50/40 to-white border-2 border-orange-200/90 rounded-3xl p-6 space-y-4 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-orange-200/60">
                      <div>
                        <h3 className="text-sm font-black text-stone-900 uppercase tracking-wide flex items-center gap-2">
                          <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                          <span>Đánh Giá Món Ăn & Phục Vụ Đơn Hàng #{currentOrder.id}</span>
                        </h3>
                        <p className="text-xs text-stone-500 mt-0.5">
                          Đơn hàng đã giao thành công! Hãy gửi đánh giá sao và mô tả nhận xét để nhận ngay <strong className="text-orange-600 font-bold">+20 Xu tích lũy</strong>.
                        </p>
                      </div>
                      <span className="bg-amber-100 text-amber-800 font-black text-xs px-3 py-1 rounded-xl self-start sm:self-center shadow-xs">
                        🎁 Thưởng +20 Xu
                      </span>
                    </div>

                    {/* 1. Chọn số sao */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-black text-stone-800 uppercase tracking-wide">
                        1. Chấm điểm số sao cho món ăn & quán:
                      </label>
                      <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-1.5 bg-white p-2 rounded-2xl border border-stone-200 shadow-xs">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              type="button"
                              key={star}
                              onClick={() => setOrderRating(star)}
                              onMouseEnter={() => setHoverRating(star)}
                              onMouseLeave={() => setHoverRating(0)}
                              className="p-1 hover:scale-125 transition"
                              title={`${star} sao`}
                            >
                              <Star
                                className={`w-6 h-6 sm:w-7 sm:h-7 cursor-pointer transition ${
                                  star <= (hoverRating || orderRating)
                                    ? 'fill-amber-400 text-amber-400 drop-shadow-xs'
                                    : 'text-stone-300'
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                        <span className="text-xs font-bold text-amber-800 bg-amber-50 px-3 py-2 rounded-xl border border-amber-200">
                          {starLabels[hoverRating || orderRating]}
                        </span>
                      </div>
                    </div>

                    {/* 2. Nhập mô tả nhận xét */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-black text-stone-800 uppercase tracking-wide">
                        2. Mô tả nhận xét & cảm nhận của bạn:
                      </label>
                      <textarea
                        rows={3}
                        value={orderReviewComment}
                        onChange={(e) => setOrderReviewComment(e.target.value)}
                        placeholder="Món ăn có nóng hổi không? Nước sốt và độ cay vừa miệng không? Shipper giao nhanh không? Hãy chia sẻ cảm nhận của bạn nhé..."
                        className="w-full p-3.5 bg-white rounded-2xl border border-stone-200 text-xs text-stone-800 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 resize-none font-medium leading-relaxed"
                      ></textarea>
                    </div>

                    {/* Nút gửi đánh giá */}
                    <button
                      type="button"
                      onClick={() => {
                        const finalComment = orderReviewComment.trim() || 'Món ăn rất ngon, đóng gói nóng hổi chuẩn vị!';
                        setJustReviewedOrders((prev) => ({
                          ...prev,
                          [currentOrder.id]: {
                            rating: orderRating,
                            comment: finalComment,
                          },
                        }));
                        if (typeof reviewOrder === 'function') {
                          reviewOrder(currentOrder.id, orderRating, finalComment);
                        } else {
                          showToast('Đã gửi đánh giá thành công! Nhận +20 Xu');
                        }
                        setOrderReviewComment('');
                      }}
                      className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                      <span>Gửi Đánh Giá Ngay (+20 Xu)</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })()}

          {/* Footer Actions */}
          <div className="p-6 bg-stone-50 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={() => setCustomerTab('menu')}
              className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-2"
            >
              <span>Đặt thêm món ăn khác</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Cancel order if pending */}
            {['pending', 'confirmed'].includes(currentOrder.status) && (
              <button
                onClick={() => setCancelModalOpen(true)}
                className="px-4 py-2 border border-red-200 hover:bg-red-50 text-red-600 font-bold text-xs rounded-xl transition"
              >
                Hủy đơn hàng này
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white p-8 rounded-3xl border border-stone-100 text-center space-y-3">
          <AlertCircle className="w-10 h-10 text-stone-300 mx-auto" />
          <h3 className="font-bold text-stone-700 text-sm">
            Không tìm thấy đơn hàng "{searchCode}"
          </h3>
          <p className="text-xs text-stone-400">
            Vui lòng kiểm tra lại mã đơn hàng hoặc chọn một trong các đơn mẫu phía trên.
          </p>
        </div>
      )}

      {/* Cancel Order Modal */}
      {cancelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white p-6 rounded-3xl max-w-sm w-full space-y-4 shadow-2xl">
            <h3 className="font-black text-stone-900 text-sm">
              Xác Nhận Hủy Đơn #{currentOrder?.id}
            </h3>
            <p className="text-xs text-stone-500">
              Bạn có chắc chắn muốn hủy đơn hàng này không? Bếp sẽ ngưng làm món ngay lập tức.
            </p>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Lý do hủy đơn:
              </label>
              <select
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full p-2.5 bg-stone-50 rounded-xl border border-stone-200 text-xs font-medium outline-none"
              >
                <option value="Đổi ý không ăn nữa">Đổi ý không ăn nữa</option>
                <option value="Muốn đặt món khác">Muốn đặt thêm / đổi món khác</option>
                <option value="Thời gian giao lâu quá">Thời gian giao lâu quá</option>
                <option value="Điền nhầm địa chỉ giao">Điền nhầm địa chỉ giao</option>
              </select>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setCancelModalOpen(false)}
                className="flex-1 py-2.5 border border-stone-200 text-stone-600 rounded-xl font-bold text-xs"
              >
                Giữ đơn hàng
              </button>
              <button
                onClick={handleCancelSubmit}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-xs"
              >
                Xác nhận hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
