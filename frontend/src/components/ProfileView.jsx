import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  User,
  Phone,
  Mail,
  MapPin,
  Sparkles,
  Lock,
  ShoppingBag,
  ExternalLink,
  RotateCcw,
  CheckCircle2,
  Gift,
  Eye,
  EyeOff,
} from 'lucide-react';

export default function ProfileView() {
  const {
    user,
    setIsAuthModalOpen,
    updateProfile,
    orders,
    setActiveTrackingId,
    setCustomerTab,
    addToCart,
    showToast,
  } = useApp();

  const [fullName, setFullName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [email, setEmail] = useState(user?.email || '');
  const [address, setAddress] = useState(user?.address || '');

  // Password visibility toggles
  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);

  // Filter orders strictly for the logged-in user (Customer only sees their own orders)
  const userOrders = orders.filter((ord) => {
    if (!user) return false;
    if (user.role === 'admin') return true;
    return (
      (ord.userId && ord.userId === user.id) ||
      (ord.customerPhone && user.phone && ord.customerPhone.trim() === user.phone.trim()) ||
      (ord.customerName && user.name && ord.customerName.trim().toLowerCase() === user.name.trim().toLowerCase())
    );
  });

  // Change password fields
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');

  const handleSaveInfo = (e) => {
    e.preventDefault();
    updateProfile({
      name: fullName,
      phone,
      email,
      address,
    });
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (!oldPass || !newPass) {
      showToast('Vui lòng điền mật khẩu cũ và mới!', 'error');
      return;
    }
    showToast('Đổi mật khẩu thành công!');
    setOldPass('');
    setNewPass('');
  };

  const handleReorder = (order) => {
    order.items?.forEach((item) => {
      addToCart(
        {
          id: item.id,
          name: item.name,
          price: item.price,
          image:
            item.image ||
            'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?w=400',
          stock: 99,
          spiceLevels: [item.spiceLevel],
        },
        item.spiceLevel,
        item.quantity
      );
    });
    setCustomerTab('cart');
  };

  if (!user || user.role === 'guest' || user.id === 'GUEST') {
    return (
      <div className="max-w-md mx-auto my-12 bg-white p-8 rounded-3xl border border-stone-100 shadow-sm text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-orange-100 text-orange-600 mx-auto flex items-center justify-center">
          <User className="w-8 h-8" />
        </div>
        <h2 className="text-lg font-black text-stone-900">Tài Khoản & Hồ Sơ</h2>
        <p className="text-xs text-stone-500 leading-relaxed">
          Bạn chưa đăng nhập. Vui lòng đăng nhập để xem thông tin cá nhân, tích lũy điểm thưởng và theo dõi lịch sử đơn hàng của bạn.
        </p>
        <button
          onClick={() => setIsAuthModalOpen(true)}
          className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-xs rounded-xl shadow-md transition cursor-pointer active:scale-95"
        >
          Đăng Nhập / Đăng Ký Ngay
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Loyalty Header Banner */}
      <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white text-orange-600 font-black text-2xl flex items-center justify-center shadow-lg">
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black">{user.name}</h1>
            <p className="text-xs text-orange-100">{user.email || user.phone}</p>
            <span className="inline-block mt-1 bg-white/20 text-white font-bold text-[10px] px-2.5 py-0.5 rounded-full uppercase">
              Thành Viên VIP ĂnVặtPro
            </span>
          </div>
        </div>

        {/* Loyalty Points Card */}
        <div className="bg-stone-900/40 backdrop-blur-md p-4 rounded-2xl border border-white/20 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-400 text-stone-900 flex items-center justify-center font-black">
            <Gift className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] text-orange-100 font-medium">Điểm tích lũy ĂnVặt:</span>
            <div className="text-2xl font-black text-yellow-300 flex items-center gap-1">
              <span>{user.points || 0}</span>
              <span className="text-xs text-white">Xu</span>
            </div>
            <p className="text-[10px] text-stone-300">Quy đổi: Giảm {((user.points || 0) * 100).toLocaleString('vi-VN')}đ</p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-12 gap-6">
        {/* Left Form: Profile info (5 cols) */}
        <div className="md:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-stone-100 shadow-sm space-y-4">
            <h2 className="text-sm font-black text-stone-900 uppercase tracking-wider flex items-center gap-2">
              <User className="w-4 h-4 text-orange-500" />
              <span>Hồ Sơ & Sổ Địa Chỉ</span>
            </h2>

            <form onSubmit={handleSaveInfo} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Họ và tên:</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 rounded-xl border border-stone-200 outline-none focus:border-orange-500 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Số điện thoại:</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 rounded-xl border border-stone-200 outline-none focus:border-orange-500 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Email:</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 rounded-xl border border-stone-200 outline-none focus:border-orange-500 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Địa chỉ mặc định:</label>
                <textarea
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 rounded-xl border border-stone-200 outline-none focus:border-orange-500 font-medium resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition shadow-sm"
              >
                Cập nhật thông tin
              </button>
            </form>
          </div>

          {/* Change password card */}
          <div className="bg-white p-6 rounded-3xl border border-stone-100 shadow-sm space-y-4">
            <h2 className="text-sm font-black text-stone-900 uppercase tracking-wider flex items-center gap-2">
              <Lock className="w-4 h-4 text-orange-500" />
              <span>Đổi Mật Khẩu</span>
            </h2>

            <form onSubmit={handleChangePassword} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Mật khẩu cũ:</label>
                <div className="relative">
                  <input
                    type={showOldPass ? 'text' : 'password'}
                    value={oldPass}
                    onChange={(e) => setOldPass(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-3 pr-10 py-2.5 bg-stone-50 rounded-xl border border-stone-200 outline-none focus:border-orange-500 font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowOldPass(!showOldPass)}
                    className="absolute right-3 top-2.5 text-stone-400 hover:text-orange-600 transition p-0.5 focus:outline-none"
                    title={showOldPass ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                  >
                    {showOldPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Mật khẩu mới:</label>
                <div className="relative">
                  <input
                    type={showNewPass ? 'text' : 'password'}
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-3 pr-10 py-2.5 bg-stone-50 rounded-xl border border-stone-200 outline-none focus:border-orange-500 font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPass(!showNewPass)}
                    className="absolute right-3 top-2.5 text-stone-400 hover:text-orange-600 transition p-0.5 focus:outline-none"
                    title={showNewPass ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                  >
                    {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2 border border-stone-300 hover:bg-stone-50 text-stone-700 font-bold rounded-xl transition"
              >
                Xác nhận đổi mật khẩu
              </button>
            </form>
          </div>
        </div>

        {/* Right List: Order History (7 cols) */}
        <div className="md:col-span-7 space-y-4">
          <div className="bg-white p-6 rounded-3xl border border-stone-100 shadow-sm space-y-4">
            <h2 className="text-sm font-black text-stone-900 uppercase tracking-wider flex items-center justify-between">
              <span className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-orange-500" />
                <span>Lịch Sử Đặt Hàng ({userOrders.length})</span>
              </span>
              <span className="text-xs text-stone-400 font-normal">Cập nhật thời gian thực</span>
            </h2>

            <div className="space-y-3">
              {userOrders.length === 0 ? (
                <div className="py-12 text-center space-y-3 bg-stone-50 rounded-2xl border border-dashed border-stone-200 p-6">
                  <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-500 mx-auto flex items-center justify-center">
                    <ShoppingBag className="w-6 h-6" />
                  </div>
                  <p className="text-stone-700 font-bold text-sm">Bạn chưa có đơn hàng nào</p>
                  <p className="text-stone-400 text-xs">Các món ăn vặt nóng hổi thơm ngon đang chờ bạn khám phá!</p>
                  <button
                    onClick={() => setCustomerTab('menu')}
                    className="mt-2 px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl transition shadow-sm"
                  >
                    Khám phá thực đơn ngay
                  </button>
                </div>
              ) : (
                userOrders.map((ord) => (
                <div
                  key={ord.id}
                  className="p-4 bg-stone-50 rounded-2xl border border-stone-100 space-y-3 hover:border-orange-200 transition"
                >
                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <span className="font-black text-stone-900 text-sm">#{ord.id}</span>
                      <p className="text-[11px] text-stone-400">{ord.orderDate}</p>
                    </div>

                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                        ord.status === 'completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : ord.status === 'cancelled'
                          ? 'bg-red-100 text-red-800'
                          : ord.status === 'shipping'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {ord.status === 'completed'
                        ? 'Hoàn tất'
                        : ord.status === 'shipping'
                        ? 'Đang giao'
                        : ord.status === 'confirmed'
                        ? 'Bếp đang làm'
                        : ord.status === 'cancelled'
                        ? 'Đã hủy'
                        : 'Chờ duyệt'}
                    </span>
                  </div>

                  {/* Items summary */}
                  <div className="text-xs text-stone-600 line-clamp-1">
                    {ord.items?.map((item) => `${item.name} (x${item.quantity})`).join(', ')}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-stone-200 text-xs">
                    <div>
                      <span className="text-stone-500">Tổng tiền:</span>{' '}
                      <span className="font-black text-orange-600">
                        {ord.totalAmount?.toLocaleString('vi-VN')}đ
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setActiveTrackingId(ord.id);
                          setCustomerTab('tracking');
                        }}
                        className="px-3 py-1 bg-white hover:bg-orange-50 text-orange-600 border border-orange-200 rounded-lg font-bold text-[11px] transition flex items-center gap-1"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>Xem lộ trình</span>
                      </button>

                      <button
                        onClick={() => handleReorder(ord)}
                        className="px-3 py-1 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-bold text-[11px] transition flex items-center gap-1 shadow-xs"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Đặt lại</span>
                      </button>
                    </div>
                  </div>
                </div>
              )))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
