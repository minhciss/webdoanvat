import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  Eye,
  CheckCircle2,
  Truck,
  ChefHat,
  XCircle,
  Clock,
  MapPin,
  Phone,
  User,
  ShoppingBag,
  X,
  CreditCard,
} from 'lucide-react';

export default function AdminOrders() {
  const { orders, updateOrderStatus, cancelOrder, showToast } = useApp();

  const [keyword, setKeyword] = useState('');
  const [selectedStatusTab, setSelectedStatusTab] = useState('all');
  const [viewingOrder, setViewingOrder] = useState(null);
  const [cancelModalOrder, setCancelModalOrder] = useState(null);
  const [cancelReason, setCancelReason] = useState('Khách đổi ý hủy đơn');

  const statusTabs = [
    { id: 'all', label: 'Tất Cả Đơn', count: orders.length },
    { id: 'pending', label: 'Chờ Duyệt', count: orders.filter((o) => o.status === 'pending').length },
    { id: 'confirmed', label: 'Bếp Đang Làm', count: orders.filter((o) => o.status === 'confirmed').length },
    { id: 'shipping', label: 'Đang Ship', count: orders.filter((o) => o.status === 'shipping').length },
    { id: 'completed', label: 'Đã Hoàn Tất', count: orders.filter((o) => o.status === 'completed').length },
    { id: 'cancelled', label: 'Đã Hủy', count: orders.filter((o) => o.status === 'cancelled').length },
  ];

  const filteredOrders = orders.filter((ord) => {
    if (selectedStatusTab !== 'all' && ord.status !== selectedStatusTab) {
      return false;
    }
    if (keyword.trim()) {
      const q = keyword.toLowerCase();
      const match =
        ord.id.toLowerCase().includes(q) ||
        ord.customerName?.toLowerCase().includes(q) ||
        ord.customerPhone?.includes(q);
      if (!match) return false;
    }
    return true;
  });

  const handleNextStatus = (order) => {
    if (order.status === 'pending') {
      updateOrderStatus(order.id, 'confirmed');
    } else if (order.status === 'confirmed') {
      updateOrderStatus(order.id, 'shipping');
    } else if (order.status === 'shipping') {
      updateOrderStatus(order.id, 'completed');
    }
  };

  const handleConfirmCancel = () => {
    if (cancelModalOrder) {
      cancelOrder(cancelModalOrder.id, cancelReason);
      setCancelModalOrder(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Filter Tabs & Search */}
      <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs space-y-4">
        {/* Status Tab buttons */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {statusTabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setSelectedStatusTab(t.id)}
              className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
                selectedStatusTab === t.id
                  ? 'bg-orange-500 text-white shadow-xs'
                  : 'bg-stone-50 hover:bg-stone-100 text-stone-600'
              }`}
            >
              <span>{t.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                  selectedStatusTab === t.id ? 'bg-white/20 text-white' : 'bg-stone-200 text-stone-700'
                }`}
              >
                {t.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative max-w-md">
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Tìm theo mã đơn (AV-xxxxx), tên hoặc SĐT khách..."
            className="w-full pl-9 pr-3 py-2 bg-stone-50 rounded-xl border border-stone-200 text-xs font-medium outline-none focus:bg-white focus:border-orange-500"
          />
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase font-black tracking-wider text-[10px]">
              <tr>
                <th className="p-4">Mã Đơn & Thời Gian</th>
                <th className="p-4">Khách Hàng & Địa Chỉ</th>
                <th className="p-4">Tổng Tiền</th>
                <th className="p-4">Thanh Toán</th>
                <th className="p-4">Trạng Thái Đơn</th>
                <th className="p-4 text-right">Quy Trình Xử Lý</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-stone-400">
                    Không có đơn hàng nào trong mục này.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-stone-50/80 transition">
                    <td className="p-4">
                      <span className="font-black text-stone-900 text-xs block">
                        #{ord.id}
                      </span>
                      <span className="text-[10px] text-stone-400">{ord.orderDate}</span>
                    </td>

                    <td className="p-4">
                      <div className="font-bold text-stone-800">{ord.customerName}</div>
                      <div className="text-[10px] text-stone-500">{ord.customerPhone}</div>
                      <div className="text-[10px] text-stone-400 truncate max-w-xs">
                        {ord.shippingAddress}
                      </div>
                    </td>

                    <td className="p-4">
                      <span className="font-black text-orange-600 text-sm">
                        {ord.totalAmount?.toLocaleString('vi-VN')}đ
                      </span>
                      <span className="block text-[10px] text-stone-400">
                        {ord.items?.length || 0} món
                      </span>
                    </td>

                    <td className="p-4">
                      <span className="font-bold text-stone-800 uppercase block">
                        {ord.paymentMethod}
                      </span>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.2 rounded-md ${
                          ord.paymentStatus === 'paid'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {ord.paymentStatus === 'paid' ? 'Đã thanh toán' : 'Thu tiền mặt'}
                      </span>
                    </td>

                    <td className="p-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                          ord.status === 'completed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : ord.status === 'shipping'
                            ? 'bg-indigo-100 text-indigo-800'
                            : ord.status === 'confirmed'
                            ? 'bg-blue-100 text-blue-800'
                            : ord.status === 'cancelled'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {ord.status}
                      </span>
                    </td>

                    <td className="p-4 text-right space-x-2 whitespace-nowrap">
                      {/* View Details modal */}
                      <button
                        onClick={() => setViewingOrder(ord)}
                        className="px-2.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl font-bold text-[11px] transition inline-flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Chi tiết</span>
                      </button>

                      {/* Transition button */}
                      {ord.status === 'pending' && (
                        <button
                          onClick={() => handleNextStatus(ord)}
                          className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold text-[11px] transition shadow-xs"
                        >
                          Duyệt đơn ➔
                        </button>
                      )}

                      {ord.status === 'confirmed' && (
                        <button
                          onClick={() => handleNextStatus(ord)}
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-[11px] transition shadow-xs"
                        >
                          Giao shipper ➔
                        </button>
                      )}

                      {ord.status === 'shipping' && (
                        <button
                          onClick={() => handleNextStatus(ord)}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-[11px] transition shadow-xs"
                        >
                          Hoàn tất ✓
                        </button>
                      )}

                      {/* Cancel button */}
                      {['pending', 'confirmed'].includes(ord.status) && (
                        <button
                          onClick={() => setCancelModalOrder(ord)}
                          className="p-1.5 hover:bg-red-50 text-stone-400 hover:text-red-600 rounded-lg transition"
                          title="Hủy đơn này"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {viewingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto space-y-4 shadow-2xl relative text-xs">
            <button
              onClick={() => setViewingOrder(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full hover:bg-stone-100 flex items-center justify-center text-stone-400"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-black text-stone-900">
              Chi Tiết Đơn Hàng #{viewingOrder.id}
            </h3>

            {/* Recipient box */}
            <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 space-y-1.5">
              <p className="font-bold text-stone-800">
                👤 {viewingOrder.customerName} - 📞 {viewingOrder.customerPhone}
              </p>
              <p className="text-stone-500">📍 {viewingOrder.shippingAddress}</p>
              {viewingOrder.note && (
                <p className="text-orange-700 bg-orange-50 p-2 rounded-lg font-medium text-[11px]">
                  Ghi chú bếp: "{viewingOrder.note}"
                </p>
              )}
            </div>

            {/* Items list */}
            <div>
              <span className="font-bold text-stone-800 block mb-2">
                Các món trong đơn ({viewingOrder.items?.length}):
              </span>
              <div className="space-y-2">
                {viewingOrder.items?.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 bg-stone-50 rounded-xl"
                  >
                    <div>
                      <p className="font-bold text-stone-800">{item.name}</p>
                      <span className="text-[10px] bg-orange-100 text-orange-700 font-bold px-1.5 py-0.2 rounded">
                        {item.spiceLevel}
                      </span>
                    </div>
                    <span className="font-bold text-stone-900">
                      x{item.quantity} ({(item.price * item.quantity).toLocaleString('vi-VN')}đ)
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Calculation */}
            <div className="border-t border-stone-200 pt-3 space-y-1.5 text-stone-600">
              <div className="flex justify-between">
                <span>Phí giao hàng:</span>
                <span>{viewingOrder.shippingFee?.toLocaleString('vi-VN')}đ</span>
              </div>
              {viewingOrder.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Voucher ({viewingOrder.voucherCode}):</span>
                  <span>-{viewingOrder.discountAmount?.toLocaleString('vi-VN')}đ</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-black text-stone-900 pt-2 border-t border-stone-100">
                <span>Tổng tiền:</span>
                <span className="text-orange-600">
                  {viewingOrder.totalAmount?.toLocaleString('vi-VN')}đ
                </span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setViewingOrder(null)}
                className="w-full py-2.5 bg-stone-100 hover:bg-stone-200 font-bold rounded-xl text-stone-700"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Order Modal */}
      {cancelModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <h3 className="font-black text-stone-900 text-sm">
              Hủy Đơn Hàng #{cancelModalOrder.id}
            </h3>
            <p className="text-xs text-stone-500">
              Vui lòng chọn lý do hủy đơn để lưu vào nhật ký đối soát:
            </p>

            <select
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              className="w-full p-2.5 bg-stone-50 rounded-xl border border-stone-200 text-xs font-medium outline-none"
            >
              <option value="Khách đổi ý hủy đơn">Khách đổi ý hủy đơn</option>
              <option value="Hết nguyên liệu làm món">Hết nguyên liệu làm món</option>
              <option value="Không liên lạc được số điện thoại">Không liên lạc được với khách</option>
              <option value="Khu vực ngoài phạm vi ship">Khu vực ngoài phạm vi ship</option>
            </select>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setCancelModalOrder(null)}
                className="flex-1 py-2 border border-stone-200 text-stone-600 font-bold rounded-xl text-xs"
              >
                Giữ đơn
              </button>
              <button
                onClick={handleConfirmCancel}
                className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs"
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
