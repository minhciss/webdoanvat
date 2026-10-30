import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  UtensilsCrossed,
  ShoppingBag,
  Users,
  PackageCheck,
  Ticket,
  MessageSquare,
  FileClock,
  ArrowLeft,
  Bell,
  ShieldCheck,
  LogOut,
  Sparkles,
  Flame,
  BarChart3,
} from 'lucide-react';

export default function AdminLayout({ children }) {
  const {
    adminTab,
    setAdminTab,
    setViewMode,
    orders,
    products,
    user,
    logout,
    customers,
  } = useApp();

  const pendingOrdersCount = orders.filter((o) => o.status === 'pending').length;
  const lowStockCount = products.filter((p) => p.stock > 0 && p.stock <= 5).length;

  const navItems = [
    { id: 'dashboard', label: 'Tổng Quan Doanh Thu', icon: LayoutDashboard },
    { id: 'reports', label: 'Thống Kê & Báo Cáo', icon: BarChart3 },
    {
      id: 'orders',
      label: 'Quản Lý Đơn Hàng',
      icon: ShoppingBag,
      badge: pendingOrdersCount > 0 ? pendingOrdersCount : null,
      badgeColor: 'bg-red-500',
    },
    { id: 'products', label: 'Quản Lý Thực Đơn', icon: UtensilsCrossed },
    {
      id: 'customers',
      label: 'Quản Lý Khách Hàng',
      icon: Users,
      badge: customers?.length > 0 ? customers.length : null,
      badgeColor: 'bg-blue-600',
    },
    {
      id: 'inventory',
      label: 'Quản Lý Kho & Tồn',
      icon: PackageCheck,
      badge: lowStockCount > 0 ? lowStockCount : null,
      badgeColor: 'bg-amber-500',
    },
    { id: 'vouchers', label: 'Mã Giảm Giá & Voucher', icon: Ticket },
    { id: 'reviews', label: 'Đánh Giá & Phản Hồi', icon: MessageSquare },
    { id: 'logs', label: 'Nhật Ký Hệ Thống (Audit)', icon: FileClock },
  ];

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col md:flex-row text-stone-800">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-stone-900 text-stone-300 flex flex-col justify-between shrink-0 shadow-xl border-r border-stone-800">
        <div>
          {/* Logo & Portal title */}
          <div className="p-5 border-b border-stone-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-orange-500 flex items-center justify-center text-white shadow-md">
                <Flame className="w-5 h-5 fill-amber-200" />
              </div>
              <div>
                <span className="font-black text-white text-base tracking-tight">
                  ĂnVặt<span className="text-amber-400">Pro</span>
                </span>
                <span className="block text-[10px] text-orange-400 font-bold uppercase tracking-wider">
                  Admin Portal
                </span>
              </div>
            </div>

            <button
              onClick={() => setViewMode('customer')}
              className="p-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white rounded-lg transition"
              title="Về giao diện khách hàng"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="p-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = adminTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setAdminTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition text-left ${
                    isActive
                      ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                      : 'text-stone-400 hover:bg-stone-800/80 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[10px] text-white font-extrabold px-1.5 py-0.2 rounded-full ${
                        item.badgeColor || 'bg-orange-500'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Profile info & Return Button */}
        <div className="p-4 border-t border-stone-800 space-y-3">
          <button
            onClick={() => setViewMode('customer')}
            className="w-full py-2 bg-stone-800 hover:bg-stone-700 text-orange-300 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 border border-stone-700"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Xem Giao Diện Khách Hàng</span>
          </button>

          <div className="flex items-center justify-between pt-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-orange-600 text-white font-black text-xs flex items-center justify-center">
                AD
              </div>
              <div>
                <p className="text-white font-bold leading-tight">Admin Portal</p>
                <p className="text-[10px] text-stone-400">admin@anvatpro.vn</p>
              </div>
            </div>

            <button
              onClick={() => {
                logout();
                setViewMode('customer');
              }}
              className="text-stone-400 hover:text-red-400 p-1.5 rounded-lg transition"
              title="Đăng xuất"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header */}
        <header className="bg-white border-b border-stone-200 px-6 py-3.5 flex items-center justify-between sticky top-0 z-30 shadow-xs">
          <div className="flex items-center gap-3">
            <h1 className="text-base font-black text-stone-900 capitalize">
              {navItems.find((i) => i.id === adminTab)?.label}
            </h1>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-md">
              Hệ Thống Trực Tuyến
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            {pendingOrdersCount > 0 && (
              <button
                onClick={() => setAdminTab('orders')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-700 border border-red-200 rounded-xl animate-pulse font-bold"
              >
                <Bell className="w-3.5 h-3.5 text-red-600" />
                <span>{pendingOrdersCount} đơn chờ duyệt!</span>
              </button>
            )}

            <div className="text-stone-500 hidden sm:block">
              Học kỳ 1 (2026 - 2027) • Đồ Án CNPM
            </div>
          </div>
        </header>

        {/* Tab Content Container */}
        <main className="p-4 sm:p-6 flex-1 max-w-7xl w-full mx-auto space-y-6">
          {children}
        </main>
      </div>
    </div>
  );
}
