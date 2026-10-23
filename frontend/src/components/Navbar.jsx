import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShoppingBag,
  Search,
  User,
  Clock,
  PhoneCall,
  LayoutDashboard,
  Flame,
  FileSearch,
  Sparkles,
  ChevronDown,
  LogOut,
  MapPin,
} from 'lucide-react';

export default function Navbar({ searchKeyword, setSearchKeyword }) {
  const {
    cart,
    cartTotal,
    setCustomerTab,
    customerTab,
    setIsCartDrawerOpen,
    user,
    setIsAuthModalOpen,
    logout,
    setViewMode,
  } = useApp();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCustomerTab('menu');
  };

  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm border-b border-orange-100">
      {/* Top Banner Alert */}
      <div className="bg-gradient-to-r from-orange-600 via-amber-500 to-orange-600 text-white text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-white/20 px-2 py-0.5 rounded font-bold uppercase tracking-wider text-[10px]">
              Flash Sale
            </span>
            <span className="hidden sm:inline">
              🔥 Giảm đến 50% toàn bộ Menu Bánh Tráng & Chân Gà hôm nay! Nhập mã{' '}
              <strong className="underline font-bold text-yellow-200">ANVAT50</strong>
            </span>
            <span className="sm:hidden font-medium">Freeship đơn từ 100K 🛵</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-yellow-200" /> 08:00 - 23:00 Mỗi ngày
            </span>
            <span className="hidden md:flex items-center gap-1">
              <PhoneCall className="w-3.5 h-3.5 text-yellow-200" /> Hotline: 0988.123.456
            </span>
            {/* Quick Switch to Admin Portal Button */}
            <button
              onClick={() => setViewMode('admin')}
              className="bg-black/30 hover:bg-black/50 text-white px-2.5 py-0.5 rounded-full font-semibold flex items-center gap-1 transition"
            >
              <LayoutDashboard className="w-3 h-3 text-amber-300" />
              <span>Cổng Quản Trị (Admin)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <div
            onClick={() => {
              setCustomerTab('home');
              setSearchKeyword('');
            }}
            className="flex items-center gap-2.5 cursor-pointer select-none group"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white shadow-md shadow-orange-500/30 group-hover:scale-105 transition">
              <Flame className="w-7 h-7 text-white fill-amber-200" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-black tracking-tight text-orange-600">
                  ĂnVặt<span className="text-amber-500">Pro</span>
                </span>
                <span className="bg-orange-100 text-orange-700 text-[10px] font-extrabold px-1.5 py-0.5 rounded">
                  NGON & GIÒN
                </span>
              </div>
              <p className="text-[11px] text-stone-500 font-medium hidden sm:block">
                Ăn vặt thả ga - Đậm đà hương vị
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="flex-1 max-w-lg hidden md:flex items-center relative"
          >
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="Tìm kiếm bánh tráng cuốn, cá viên, chân gà, trà sữa..."
              className="w-full pl-10 pr-24 py-2.5 bg-stone-100 focus:bg-white text-sm rounded-full border border-stone-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition"
            />
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 pointer-events-none" />
            <button
              type="submit"
              className="absolute right-1.5 px-4 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold rounded-full transition shadow-sm"
            >
              Tìm kiếm
            </button>
          </form>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Order Tracking Button */}
            <button
              onClick={() => setCustomerTab('tracking')}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl transition ${
                customerTab === 'tracking'
                  ? 'bg-orange-50 text-orange-600 border border-orange-200'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              <FileSearch className="w-4 h-4 text-orange-500" />
              <span className="hidden lg:inline">Tra cứu đơn</span>
            </button>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartDrawerOpen(true)}
              className="relative flex items-center gap-2 px-3 py-2 bg-orange-50 hover:bg-orange-100 text-orange-700 rounded-xl transition border border-orange-200"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5 text-orange-600" />
                {totalCartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white animate-pulse">
                    {totalCartCount}
                  </span>
                )}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-[10px] text-orange-500 font-bold uppercase leading-none">
                  Giỏ hàng
                </p>
                <p className="text-xs font-black text-orange-700 leading-tight">
                  {cartTotal.toLocaleString('vi-VN')}đ
                </p>
              </div>
            </button>

            {/* User Account / Auth */}
            <div className="relative">
              {user.role !== 'guest' ? (
                <div>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-stone-200 hover:border-orange-300 bg-white transition text-left"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-400 to-orange-500 text-white font-bold text-xs flex items-center justify-center shadow-sm">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="hidden md:block">
                      <p className="text-xs font-bold text-stone-800 leading-tight truncate max-w-[100px]">
                        {user.name}
                      </p>
                      <p className="text-[10px] text-amber-600 font-semibold flex items-center gap-0.5">
                        <Sparkles className="w-2.5 h-2.5" /> {user.points || 0} điểm
                      </p>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
                  </button>

                  {/* Dropdown Menu */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-stone-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                      <div className="px-4 py-2 border-b border-stone-100">
                        <p className="text-xs text-stone-400">Đăng nhập với</p>
                        <p className="text-sm font-bold text-stone-800 truncate">{user.name}</p>
                        <p className="text-xs text-stone-500 truncate">{user.email || user.phone}</p>
                      </div>

                      <button
                        onClick={() => {
                          setCustomerTab('profile');
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2.5 text-xs text-stone-700 hover:bg-orange-50 hover:text-orange-600 flex items-center gap-2.5 transition"
                      >
                        <User className="w-4 h-4 text-orange-500" />
                        <span>Hồ sơ & Sổ địa chỉ</span>
                      </button>

                      <button
                        onClick={() => {
                          setCustomerTab('profile');
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2.5 text-xs text-stone-700 hover:bg-orange-50 hover:text-orange-600 flex items-center gap-2.5 transition"
                      >
                        <ShoppingBag className="w-4 h-4 text-amber-500" />
                        <span>Lịch sử đơn hàng</span>
                      </button>

                      <div className="border-t border-stone-100 my-1"></div>

                      <button
                        onClick={() => {
                          logout();
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2.5 transition"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Đăng xuất</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-xl transition shadow-sm"
                >
                  <User className="w-4 h-4" />
                  <span>Đăng nhập</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <form
          onSubmit={handleSearchSubmit}
          className="mt-2.5 flex md:hidden items-center relative"
        >
          <input
            type="text"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            placeholder="Tìm món ăn vặt..."
            className="w-full pl-9 pr-20 py-2 bg-stone-100 text-sm rounded-xl border border-stone-200 outline-none"
          />
          <Search className="w-4 h-4 text-stone-400 absolute left-3" />
          <button
            type="submit"
            className="absolute right-1 px-3 py-1 bg-orange-500 text-white text-xs font-semibold rounded-lg"
          >
            Tìm
          </button>
        </form>

        {/* Navigation Links Bar */}
        <div className="flex items-center justify-between border-t border-stone-100 mt-2.5 pt-2 text-xs font-bold text-stone-600">
          <div className="flex items-center gap-6 overflow-x-auto no-scrollbar py-0.5">
            <button
              onClick={() => {
                setCustomerTab('home');
                setSearchKeyword('');
              }}
              className={`hover:text-orange-600 transition whitespace-nowrap pb-1 ${
                customerTab === 'home'
                  ? 'text-orange-600 border-b-2 border-orange-600 font-extrabold'
                  : ''
              }`}
            >
              Trang Chủ
            </button>
            <button
              onClick={() => {
                setCustomerTab('menu');
                setSearchKeyword('');
              }}
              className={`hover:text-orange-600 transition whitespace-nowrap pb-1 ${
                customerTab === 'menu'
                  ? 'text-orange-600 border-b-2 border-orange-600 font-extrabold'
                  : ''
              }`}
            >
              Thực Đơn Đầy Đủ
            </button>
            <button
              onClick={() => {
                setCustomerTab('menu');
                setSearchKeyword('Bánh tráng');
              }}
              className="hover:text-orange-600 transition whitespace-nowrap pb-1"
            >
              Bánh Tráng Tây Ninh
            </button>
            <button
              onClick={() => {
                setCustomerTab('menu');
                setSearchKeyword('Cá viên');
              }}
              className="hover:text-orange-600 transition whitespace-nowrap pb-1"
            >
              Đồ Chiên Mắm Tỏi
            </button>
            <button
              onClick={() => {
                setCustomerTab('menu');
                setSearchKeyword('Chân gà');
              }}
              className="hover:text-orange-600 transition whitespace-nowrap pb-1"
            >
              Chân Gà Cay Tê
            </button>
            <button
              onClick={() => {
                setCustomerTab('menu');
                setSearchKeyword('Combo');
              }}
              className="hover:text-orange-600 transition whitespace-nowrap pb-1 text-red-600 flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5" /> Combo Cày Phim
            </button>
          </div>

          <div className="hidden lg:flex items-center gap-2 text-stone-500 text-[11px] font-medium">
            <MapPin className="w-3.5 h-3.5 text-orange-500" />
            <span>Giao nhanh nội thành TP.HCM (30 - 45 phút)</span>
          </div>
        </div>
      </div>
    </header>
  );
}
