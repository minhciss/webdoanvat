import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  DollarSign,
  ShoppingBag,
  AlertTriangle,
  Users,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  Clock,
  Sparkles,
  Flame,
} from 'lucide-react';

export default function AdminDashboard() {
  const { orders, products, updateOrderStatus, setAdminTab } = useApp();

  // Metrics calculation
  const completedOrders = orders.filter((o) => o.status === 'completed');
  const totalRevenue = completedOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  const pendingOrders = orders.filter((o) => o.status === 'pending');
  const lowStockProducts = products.filter((p) => p.stock > 0 && p.stock <= 5);
  const outOfStockProducts = products.filter((p) => p.stock <= 0);

  // Top 5 best selling snacks
  const topSellers = [...products]
    .sort((a, b) => (b.soldCount || 0) - (a.soldCount || 0))
    .slice(0, 5);

  // Simulated 7-day revenue bar data
  const revenueData = [
    { day: 'T2', value: 1250000, height: '45%' },
    { day: 'T3', value: 1820000, height: '65%' },
    { day: 'T4', value: 1400000, height: '50%' },
    { day: 'T5', value: 2100000, height: '75%' },
    { day: 'T6', value: 2850000, height: '90%' },
    { day: 'T7', value: 3400000, height: '100%' },
    { day: 'CN', value: 2950000, height: '92%' },
  ];

  return (
    <div className="space-y-6">
      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Revenue */}
        <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500">Doanh Thu Đã Thu</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-stone-900">
              {totalRevenue.toLocaleString('vi-VN')}đ
            </div>
            <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-bold mt-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+18.4% so với tuần trước</span>
            </div>
          </div>
        </div>

        {/* Card 2: Orders */}
        <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500">Tổng Đơn Hàng</span>
            <div className="w-9 h-9 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-stone-900">{orders.length} Đơn</div>
            <div className="flex items-center gap-1 text-[11px] text-amber-600 font-bold mt-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{pendingOrders.length} đơn đang chờ duyệt</span>
            </div>
          </div>
        </div>

        {/* Card 3: Stock Alert */}
        <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500">Cảnh Báo Tồn Kho</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-amber-600">
              {lowStockProducts.length} Món (Tồn ≤ 5)
            </div>
            <div className="text-[11px] text-stone-500 mt-1">
              {outOfStockProducts.length > 0 ? `${outOfStockProducts.length} món hết hàng` : 'Đủ nguyên liệu bán'}
            </div>
          </div>
        </div>

        {/* Card 4: Customers */}
        <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500">Đánh Giá & Uy Tín</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-stone-900">4.9 ★ / 5.0</div>
            <div className="text-[11px] text-stone-500 mt-1">
              Hơn 98% thực khách hài lòng
            </div>
          </div>
        </div>
      </div>

      {/* Middle Row: Revenue Chart & Status Breakdown */}
      <div className="grid lg:grid-cols-12 gap-6">
        {/* Revenue Chart (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-black text-stone-900 uppercase tracking-wider">
                Doanh Thu Bán Hàng 7 Ngày Gần Nhất
              </h3>
              <p className="text-xs text-stone-400">Đơn vị: VNĐ</p>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-xl">
              Cao nhất: 3.400.000đ (Thứ 7)
            </span>
          </div>

          {/* Bar Chart Visualization */}
          <div className="h-56 flex items-end justify-between gap-3 pt-6 pb-2 px-2 border-b border-stone-100">
            {revenueData.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                <span className="text-[10px] font-bold text-stone-500 opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                  {(d.value / 1000).toLocaleString('vi-VN')}K
                </span>
                <div
                  className="w-full bg-gradient-to-t from-orange-500 to-amber-400 rounded-xl group-hover:from-orange-600 group-hover:to-amber-500 transition-all duration-300"
                  style={{ height: d.height }}
                ></div>
                <span className="text-xs font-bold text-stone-600">{d.day}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between text-xs text-stone-500 pt-1">
            <span>• Trung bình ngày: <strong>2.250.000đ</strong></span>
            <span>• Giờ cao điểm: <strong>15:00 - 18:00 & 20:00 - 22:30</strong></span>
          </div>
        </div>

        {/* Order Status Breakdown & Urgent Action (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-4">
          <h3 className="text-sm font-black text-stone-900 uppercase tracking-wider flex items-center justify-between">
            <span>Trạng Thái Đơn Hàng</span>
            <button
              onClick={() => setAdminTab('orders')}
              className="text-xs font-bold text-orange-600 hover:underline flex items-center gap-1"
            >
              <span>Xem tất cả</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </h3>

          <div className="space-y-2.5 text-xs">
            <div className="flex items-center justify-between p-2.5 bg-amber-50 border border-amber-200 rounded-xl">
              <span className="font-bold text-amber-900">1. Chờ duyệt (Pending)</span>
              <span className="font-black text-amber-700 bg-white px-2 py-0.5 rounded-md">
                {orders.filter((o) => o.status === 'pending').length} đơn
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 bg-blue-50 border border-blue-200 rounded-xl">
              <span className="font-bold text-blue-900">2. Bếp làm món (Confirmed)</span>
              <span className="font-black text-blue-700 bg-white px-2 py-0.5 rounded-md">
                {orders.filter((o) => o.status === 'confirmed').length} đơn
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 bg-indigo-50 border border-indigo-200 rounded-xl">
              <span className="font-bold text-indigo-900">3. Đang giao hàng (Shipping)</span>
              <span className="font-black text-indigo-700 bg-white px-2 py-0.5 rounded-md">
                {orders.filter((o) => o.status === 'shipping').length} đơn
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl">
              <span className="font-bold text-emerald-900">4. Đã hoàn tất (Completed)</span>
              <span className="font-black text-emerald-700 bg-white px-2 py-0.5 rounded-md">
                {orders.filter((o) => o.status === 'completed').length} đơn
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 bg-stone-100 rounded-xl text-stone-500">
              <span>5. Đã hủy (Cancelled)</span>
              <span className="font-bold">
                {orders.filter((o) => o.status === 'cancelled').length} đơn
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row: Recent Urgent Orders & Top Selling Snacks */}
      <div className="grid lg:grid-cols-12 gap-6">
        {/* Urgent Orders (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-stone-900 uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-orange-500" />
              <span>Đơn Hàng Gần Đây Cần Xử Lý</span>
            </h3>
            <span className="text-xs text-stone-400">1-click duyệt đơn ngay</span>
          </div>

          <div className="space-y-3">
            {orders.slice(0, 4).map((ord) => (
              <div
                key={ord.id}
                className="p-3.5 bg-stone-50 rounded-2xl border border-stone-100 flex items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-stone-900">#{ord.id}</span>
                    <span className="text-stone-500 font-semibold">{ord.customerName}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.2 rounded-full uppercase ${
                        ord.status === 'pending'
                          ? 'bg-amber-100 text-amber-800'
                          : ord.status === 'confirmed'
                          ? 'bg-blue-100 text-blue-800'
                          : ord.status === 'shipping'
                          ? 'bg-indigo-100 text-indigo-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {ord.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-400 mt-0.5">
                    {ord.orderDate} • {ord.items?.length || 0} món •{' '}
                    <strong className="text-orange-600 font-bold">
                      {ord.totalAmount?.toLocaleString('vi-VN')}đ
                    </strong>
                  </p>
                </div>

                {/* Quick Action Button */}
                {ord.status === 'pending' ? (
                  <button
                    onClick={() => updateOrderStatus(ord.id, 'confirmed')}
                    className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold text-[11px] transition shadow-xs whitespace-nowrap"
                  >
                    Duyệt đơn này
                  </button>
                ) : ord.status === 'confirmed' ? (
                  <button
                    onClick={() => updateOrderStatus(ord.id, 'shipping')}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-[11px] transition shadow-xs whitespace-nowrap"
                  >
                    Chuyển giao hàng
                  </button>
                ) : (
                  <span className="text-[11px] text-stone-400 font-semibold">
                    Đã xử lý
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Top Selling Snacks (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-4">
          <h3 className="text-sm font-black text-stone-900 uppercase tracking-wider flex items-center gap-2">
            <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
            <span>Top 5 Món Bán Chạy Nhất</span>
          </h3>

          <div className="space-y-3">
            {topSellers.map((item, idx) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="w-5 font-black text-stone-400 text-sm">
                    #{idx + 1}
                  </span>
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-10 h-10 rounded-xl object-cover shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="font-bold text-stone-800 truncate">{item.name}</p>
                    <p className="text-[11px] text-orange-600 font-semibold">
                      {item.price.toLocaleString('vi-VN')}đ
                    </p>
                  </div>
                </div>

                <span className="text-[11px] font-bold bg-stone-100 text-stone-700 px-2 py-0.5 rounded-lg shrink-0">
                  {item.soldCount} đã bán
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
