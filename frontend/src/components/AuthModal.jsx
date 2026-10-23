import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Mail,
  Lock,
  User,
  Phone,
  Flame,
  ShieldCheck,
  Check,
} from 'lucide-react';

export default function AuthModal() {
  const { isAuthModalOpen, setIsAuthModalOpen, login, showToast } = useApp();

  const [tab, setTab] = useState('login'); // 'login' | 'register' | 'forgot'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (tab === 'login') {
      login(email || 'khachhang@anvatpro.vn', password);
    } else if (tab === 'register') {
      login(email || `${name.toLowerCase().replace(/\s+/g, '')}@gmail.com`, password);
      showToast('Đăng ký tài khoản thành công!');
    } else {
      showToast(`Đã gửi mã xác nhận OTP về email ${email}!`);
      setTab('login');
    }
  };

  const handleQuickLogin = (role) => {
    if (role === 'admin') {
      login('admin@anvatpro.vn', '123456', 'admin');
    } else {
      login('trangnguyen@gmail.com', '123456', 'customer');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl shadow-2xl border border-stone-100 max-w-md w-full p-6 relative"
      >
        {/* Close Button */}
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-4 right-4 w-8 h-8 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700 flex items-center justify-center transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="text-center space-y-1 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 mx-auto flex items-center justify-center text-white shadow-md shadow-orange-500/30">
            <Flame className="w-7 h-7 text-white fill-amber-200" />
          </div>
          <h2 className="text-xl font-black text-stone-900">
            {tab === 'login'
              ? 'Đăng Nhập Tài Khoản'
              : tab === 'register'
              ? 'Tạo Tài Khoản Mới'
              : 'Khôi Phục Mật Khẩu'}
          </h2>
          <p className="text-xs text-stone-500">
            Trải nghiệm ẩm thực ăn vặt Sài Gòn đỉnh cao cùng ĂnVặtPro
          </p>
        </div>

        {/* Tab switch */}
        {tab !== 'forgot' && (
          <div className="flex bg-stone-100 p-1 rounded-2xl mb-5 text-xs font-bold">
            <button
              onClick={() => setTab('login')}
              className={`flex-1 py-2 rounded-xl transition ${
                tab === 'login'
                  ? 'bg-white text-orange-600 shadow-xs'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              Đăng Nhập
            </button>
            <button
              onClick={() => setTab('register')}
              className={`flex-1 py-2 rounded-xl transition ${
                tab === 'register'
                  ? 'bg-white text-orange-600 shadow-xs'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              Đăng Ký
            </button>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          {tab === 'register' && (
            <>
              <div>
                <label className="block font-bold text-stone-700 mb-1">Họ và tên *</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nguyễn Văn A"
                    className="w-full pl-9 pr-3 py-2.5 bg-stone-50 rounded-xl border border-stone-200 outline-none focus:border-orange-500"
                  />
                  <User className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Số điện thoại *</label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0909 123 456"
                    className="w-full pl-9 pr-3 py-2.5 bg-stone-50 rounded-xl border border-stone-200 outline-none focus:border-orange-500"
                  />
                  <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block font-bold text-stone-700 mb-1">
              Email đăng nhập *
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@gmail.com"
                className="w-full pl-9 pr-3 py-2.5 bg-stone-50 rounded-xl border border-stone-200 outline-none focus:border-orange-500"
              />
              <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
            </div>
          </div>

          {tab !== 'forgot' && (
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="font-bold text-stone-700">Mật khẩu *</label>
                {tab === 'login' && (
                  <button
                    type="button"
                    onClick={() => setTab('forgot')}
                    className="text-[11px] text-orange-600 hover:underline font-semibold"
                  >
                    Quên mật khẩu?
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 bg-stone-50 rounded-xl border border-stone-200 outline-none focus:border-orange-500"
                />
                <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black rounded-2xl shadow-lg shadow-orange-500/25 transition mt-2"
          >
            {tab === 'login'
              ? 'Đăng Nhập Ngay'
              : tab === 'register'
              ? 'Tạo Tài Khoản & Nhận Mã 25K'
              : 'Gửi Mã Xác Nhận OTP'}
          </button>
        </form>

        {tab === 'forgot' && (
          <button
            onClick={() => setTab('login')}
            className="w-full text-center text-xs text-stone-500 hover:text-stone-800 font-semibold mt-3"
          >
            ← Quay lại Đăng nhập
          </button>
        )}

        {/* Quick Demo Access Bar */}
        <div className="mt-6 pt-4 border-t border-stone-100">
          <p className="text-[11px] text-stone-400 text-center mb-2.5 font-medium">
            Đăng nhập nhanh tài khoản thử nghiệm:
          </p>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleQuickLogin('customer')}
              className="p-2 bg-stone-50 hover:bg-orange-50 border border-stone-200 rounded-xl text-center transition"
            >
              <p className="text-xs font-bold text-stone-800">👤 Khách Hàng</p>
              <p className="text-[10px] text-stone-400">Xem menu & Đặt hàng</p>
            </button>

            <button
              onClick={() => handleQuickLogin('admin')}
              className="p-2 bg-orange-50 hover:bg-orange-100 border border-orange-200 rounded-xl text-center transition"
            >
              <p className="text-xs font-bold text-orange-700">👑 Quản Trị Viên</p>
              <p className="text-[10px] text-orange-600">Duyệt đơn, kho, menu</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
