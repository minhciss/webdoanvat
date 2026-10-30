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
  Printer,
  Columns,
  List,
  FileText,
  Sparkles,
} from 'lucide-react';

export default function AdminOrders() {
  const { orders, updateOrderStatus, cancelOrder, showToast } = useApp();

  const [keyword, setKeyword] = useState('');
  const [selectedStatusTab, setSelectedStatusTab] = useState('all');
  const [viewingOrder, setViewingOrder] = useState(null);
  const [cancelModalOrder, setCancelModalOrder] = useState(null);
  const [cancelReason, setCancelReason] = useState('Khách đổi ý hủy đơn');

  // Chế độ xem: 'main-sub' (Main-Sub Form 2 cột) hoặc 'table' (Bảng truyền thống)
  const [layoutMode, setLayoutMode] = useState('main-sub');
  const [selectedOrderForSubForm, setSelectedOrderForSubForm] = useState(orders[0] || null);
  const [printingOrder, setPrintingOrder] = useState(null);

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

  const activeSubOrder =
    filteredOrders.find((o) => o.id === selectedOrderForSubForm?.id) ||
    filteredOrders[0] ||
    null;

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

  const triggerPrintReceipt = (order) => {
    setPrintingOrder(order);
  };

  return (
    <div className="space-y-6">
      {/* Top Filter Tabs & Search & Chuyển Chế Độ Main-Sub */}
      <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
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

          {/* Toggle Chế Độ Xem: Main-Sub Form vs Bảng */}
          <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-2xl border border-stone-200 text-xs">
            <button
              onClick={() => setLayoutMode('main-sub')}
              className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition ${
                layoutMode === 'main-sub'
                  ? 'bg-white text-orange-600 shadow-xs'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
              title="Chế độ thiết kế Main-Sub Form (Master-Detail)"
            >
              <Columns className="w-3.5 h-3.5" />
              <span>Thiết Kế Main-Sub Form</span>
            </button>
            <button
              onClick={() => setLayoutMode('table')}
              className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition ${
                layoutMode === 'table'
                  ? 'bg-white text-orange-600 shadow-xs'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Chế Độ Bảng Danh Sách</span>
            </button>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Tìm theo Mã đơn (AV-xxxxx), Tên khách hoặc Số điện thoại..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs outline-none focus:border-orange-500 transition"
          />
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* ================================================================= */}
      {/* 1. THIẾT KẾ MAIN-SUB FORM (MASTER-DETAIL 2 CỘT LIÊN KẾT THỜI GIAN THỰC) */}
      {/* ================================================================= */}
      {layoutMode === 'main-sub' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* CỘT TRÁI: MAIN FORM (DANH SÁCH BẢN GHI MASTER) */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
              <div>
                <span className="text-[10px] font-black uppercase text-orange-600 tracking-wider">
                  MAIN FORM (MASTER)
                </span>
                <h3 className="text-xs font-black text-stone-900">Danh Sách Hóa Đơn / Đơn Hàng</h3>
              </div>
              <span className="text-[11px] font-bold text-stone-500 bg-white px-2 py-0.5 rounded-lg border border-stone-200">
                {filteredOrders.length} đơn
              </span>
            </div>

            <div className="divide-y divide-stone-100 max-h-[650px] overflow-y-auto">
              {filteredOrders.length === 0 ? (
                <div className="p-8 text-center text-stone-400 text-xs">
                  Không tìm thấy đơn hàng nào phù hợp!
                </div>
              ) : (
                filteredOrders.map((ord) => {
                  const isSelected = activeSubOrder?.id === ord.id;
                  return (
                    <div
                      key={ord.id}
                      onClick={() => setSelectedOrderForSubForm(ord)}
                      className={`p-4 cursor-pointer transition flex items-center justify-between ${
                        isSelected
                          ? 'bg-orange-50/70 border-l-4 border-orange-500 shadow-xs'
                          : 'hover:bg-stone-50'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-black text-xs text-stone-900">#{ord.id}</span>
                          <span
                            className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                              ord.status === 'completed'
                                ? 'bg-emerald-100 text-emerald-800'
                                : ord.status === 'cancelled'
                                ? 'bg-red-100 text-red-800'
                                : ord.status === 'shipping'
                                ? 'bg-blue-100 text-blue-800'
                                : ord.status === 'confirmed'
                                ? 'bg-orange-100 text-orange-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {ord.status}
                          </span>
                        </div>
                        <p className="text-xs font-bold text-stone-700">{ord.customerName}</p>
                        <p className="text-[10px] text-stone-400">{ord.orderDate || 'Hôm nay'}</p>
                      </div>

                      <div className="text-right space-y-1">
                        <span className="text-xs font-black text-stone-900 block">
                          {ord.totalAmount?.toLocaleString('vi-VN')}đ
                        </span>
                        <span className="text-[10px] text-stone-500 block">
                          {ord.items?.length || 1} món
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* CỘT PHẢI: SUB FORM (CHI TIẾT DETAIL TƯƠNG ỨNG VỚI BẢN GHI MAIN ĐANG CHỌN) */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden sticky top-20">
            {activeSubOrder ? (
              <div className="p-6 space-y-5">
                <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                  <div>
                    <span className="text-[10px] font-black uppercase text-blue-600 tracking-wider">
                      SUB FORM (DETAIL)
                    </span>
                    <h3 className="text-base font-black text-stone-900 flex items-center gap-2">
                      <span>Chi Tiết Đơn Hàng #{activeSubOrder.id}</span>
                    </h3>
                  </div>

                  {/* Nút In hóa đơn / Xuất PDF */}
                  <button
                    onClick={() => triggerPrintReceipt(activeSubOrder)}
                    className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
                    title="In phiếu hóa đơn bán lẻ hoặc xuất file PDF"
                  >
                    <Printer className="w-3.5 h-3.5 text-orange-400" />
                    <span>In Hóa Đơn / Xuất PDF</span>
                  </button>
                </div>

                {/* Thông tin khách hàng & Giao nhận (Từ Master Record) */}
                <div className="grid grid-cols-2 gap-3 text-xs p-3.5 bg-stone-50 rounded-2xl border border-stone-200">
                  <div>
                    <span className="text-[10px] text-stone-400 font-bold block">Khách Nhận:</span>
                    <p className="font-bold text-stone-800">{activeSubOrder.customerName}</p>
                    <p className="text-stone-500 text-[11px]">{activeSubOrder.customerPhone}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-400 font-bold block">Địa Chỉ Giao:</span>
                    <p className="font-medium text-stone-700 text-[11px] leading-tight">
                      {activeSubOrder.shippingAddress}
                    </p>
                  </div>
                  {activeSubOrder.note && (
                    <div className="col-span-2 text-[11px] bg-orange-50 p-2 rounded-xl text-orange-700 font-medium">
                      Ghi chú: "{activeSubOrder.note}"
                    </div>
                  )}
                </div>

                {/* BẢNG SUB FORM: CHI TIẾT CÁC MÓN ĂN TRONG ĐƠN (ORDER_ITEMS) */}
                <div className="space-y-2">
                  <span className="text-xs font-black text-stone-800 block">
                    Danh Sách Món Ăn Trong Đơn ({activeSubOrder.items?.length || 0} món):
                  </span>
                  <div className="border border-stone-200 rounded-2xl overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-stone-50 border-b border-stone-200 text-[10px] font-bold text-stone-500">
                        <tr>
                          <th className="py-2.5 px-3">Tên Món</th>
                          <th className="py-2.5 px-3 text-center">Cấp Độ Cay</th>
                          <th className="py-2.5 px-3 text-center">Số Lượng</th>
                          <th className="py-2.5 px-3 text-right">Đơn Giá</th>
                          <th className="py-2.5 px-3 text-right">Thành Tiền</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100 text-stone-700">
                        {activeSubOrder.items?.map((item, idx) => (
                          <tr key={idx} className="hover:bg-stone-50/50">
                            <td className="py-2.5 px-3 font-bold text-stone-900">{item.name}</td>
                            <td className="py-2.5 px-3 text-center">
                              <span className="text-[9px] bg-orange-100 text-orange-700 font-bold px-1.5 py-0.5 rounded">
                                {item.spiceLevel}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 text-center font-bold">x{item.quantity}</td>
                            <td className="py-2.5 px-3 text-right text-stone-500">
                              {item.price?.toLocaleString('vi-VN')}đ
                            </td>
                            <td className="py-2.5 px-3 text-right font-black text-stone-900">
                              {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Tính toán thanh toán */}
                <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-1.5 text-xs text-stone-600">
                  <div className="flex justify-between">
                    <span>Phí vận chuyển:</span>
                    <span>{activeSubOrder.shippingFee?.toLocaleString('vi-VN')}đ</span>
                  </div>
                  {activeSubOrder.discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-bold">
                      <span>Mã giảm giá ({activeSubOrder.voucherCode}):</span>
                      <span>-{activeSubOrder.discountAmount?.toLocaleString('vi-VN')}đ</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm font-black text-stone-900 pt-2 border-t border-stone-200">
                    <span>Tổng Tiền Thanh Toán:</span>
                    <span className="text-orange-600 text-base">
                      {activeSubOrder.totalAmount?.toLocaleString('vi-VN')}đ
                    </span>
                  </div>
                </div>

                {/* Các nút hành động xử lý đơn */}
                <div className="flex items-center gap-2 pt-1">
                  {activeSubOrder.status === 'pending' && (
                    <button
                      onClick={() => handleNextStatus(activeSubOrder)}
                      className="flex-1 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold text-xs shadow-xs transition"
                    >
                      Duyệt Đơn Vào Bếp ➔
                    </button>
                  )}
                  {activeSubOrder.status === 'confirmed' && (
                    <button
                      onClick={() => handleNextStatus(activeSubOrder)}
                      className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-xs transition"
                    >
                      Bàn Giao Cho Shipper ➔
                    </button>
                  )}
                  {activeSubOrder.status === 'shipping' && (
                    <button
                      onClick={() => handleNextStatus(activeSubOrder)}
                      className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-xs transition"
                    >
                      Xác Nhận Đã Giao Thành Công ✓
                    </button>
                  )}
                  {['pending', 'confirmed'].includes(activeSubOrder.status) && (
                    <button
                      onClick={() => setCancelModalOrder(activeSubOrder)}
                      className="px-4 py-2.5 bg-stone-100 hover:bg-red-50 text-stone-600 hover:text-red-600 rounded-xl font-bold text-xs transition"
                    >
                      Hủy Đơn Này
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-12 text-center text-stone-400 text-xs">
                Vui lòng chọn một đơn hàng ở cột bên trái để xem Sub Form chi tiết!
              </div>
            )}
          </div>
        </div>
      ) : (
        /* ================================================================= */
        /* 2. CHẾ ĐỘ BẢNG TRUYỀN THỐNG */
        /* ================================================================= */
        <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-200 text-[11px] font-bold text-stone-500">
                  <th className="py-3.5 px-4">Mã Đơn</th>
                  <th className="py-3.5 px-4">Khách Hàng</th>
                  <th className="py-3.5 px-4">Ngày Đặt</th>
                  <th className="py-3.5 px-4">Phương Thức</th>
                  <th className="py-3.5 px-4">Trạng Thái</th>
                  <th className="py-3.5 px-4 text-right">Tổng Tiền</th>
                  <th className="py-3.5 px-4 text-center">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-700">
                {filteredOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-stone-50/60 transition">
                    <td className="py-3 px-4 font-black text-stone-900">#{ord.id}</td>
                    <td className="py-3 px-4">
                      <p className="font-bold text-stone-800">{ord.customerName}</p>
                      <p className="text-[10px] text-stone-400">{ord.customerPhone}</p>
                    </td>
                    <td className="py-3 px-4 text-stone-500">{ord.orderDate || 'Hôm nay'}</td>
                    <td className="py-3 px-4 uppercase text-[10px] font-bold text-stone-500">
                      {ord.paymentMethod}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          ord.status === 'completed'
                            ? 'bg-emerald-50 text-emerald-700'
                            : ord.status === 'cancelled'
                            ? 'bg-red-50 text-red-700'
                            : 'bg-amber-50 text-amber-700'
                        }`}
                      >
                        {ord.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-black text-stone-900">
                      {ord.totalAmount?.toLocaleString('vi-VN')}đ
                    </td>
                    <td className="py-3 px-4 text-center flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => triggerPrintReceipt(ord)}
                        className="p-1.5 hover:bg-stone-100 text-stone-600 rounded-lg transition"
                        title="In hóa đơn"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setViewingOrder(ord)}
                        className="p-1.5 hover:bg-stone-100 text-stone-600 rounded-lg transition"
                        title="Xem chi tiết"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* MODAL IN HÓA ĐƠN BÁN LẺ CHUẨN IN VÀ XUẤT PDF (WINDOW.PRINT) */}
      {/* ================================================================= */}
      {printingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl relative text-xs space-y-4 max-h-[95vh] overflow-y-auto">
            <button
              onClick={() => setPrintingOrder(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full hover:bg-stone-100 flex items-center justify-center text-stone-400"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Khung Hóa Đơn Chuẩn Bị In */}
            <div id="printable-receipt" className="border border-stone-300 p-5 rounded-2xl space-y-3 font-mono text-stone-800 bg-white">
              <div className="text-center border-b border-dashed border-stone-300 pb-3">
                <h2 className="text-base font-black uppercase text-stone-900">TIỆM ĂN VẶT PRO</h2>
                <p className="text-[10px] text-stone-500">Đồ Ăn Vặt Ngon - Nóng Hổi - Chuẩn Vị</p>
                <p className="text-[10px] text-stone-500">123 Đường Số 7, Linh Trung, TP. Thủ Đức, TP.HCM</p>
                <p className="text-[10px] text-stone-500">Hotline: 0901.234.567</p>
                <h3 className="font-bold text-xs uppercase mt-2">HÓA ĐƠN BÁN LẺ #{printingOrder.id}</h3>
              </div>

              <div className="text-[11px] space-y-1">
                <p>Khách hàng: <span className="font-bold">{printingOrder.customerName}</span></p>
                <p>Số ĐT: {printingOrder.customerPhone}</p>
                <p>Địa chỉ: {printingOrder.shippingAddress}</p>
                <p>Thời gian: {printingOrder.orderDate || new Date().toLocaleString('vi-VN')}</p>
                <p>Hình thức: {printingOrder.paymentMethod?.toUpperCase()} ({printingOrder.paymentStatus || 'Đã thanh toán'})</p>
              </div>

              <div className="border-t border-b border-dashed border-stone-300 py-2">
                <table className="w-full text-left text-[11px]">
                  <thead>
                    <tr className="border-b border-stone-200">
                      <th>Món</th>
                      <th className="text-center">SL</th>
                      <th className="text-right">Đ.Giá</th>
                      <th className="text-right">T.Tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    {printingOrder.items?.map((it, idx) => (
                      <tr key={idx}>
                        <td className="py-1">
                          {it.name} <span className="text-[9px]">({it.spiceLevel})</span>
                        </td>
                        <td className="text-center">{it.quantity}</td>
                        <td className="text-right">{it.price?.toLocaleString('vi-VN')}</td>
                        <td className="text-right">{(it.price * it.quantity).toLocaleString('vi-VN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="space-y-1 text-right text-[11px]">
                <p>Phí giao hàng: {printingOrder.shippingFee?.toLocaleString('vi-VN')}đ</p>
                {printingOrder.discountAmount > 0 && (
                  <p className="text-emerald-700">Voucher giảm giá: -{printingOrder.discountAmount?.toLocaleString('vi-VN')}đ</p>
                )}
                <p className="text-sm font-black text-stone-900 pt-1 border-t border-dashed border-stone-300">
                  TỔNG CỘNG: {printingOrder.totalAmount?.toLocaleString('vi-VN')}đ
                </p>
              </div>

              <div className="text-center pt-2 border-t border-dashed border-stone-300 text-[10px] text-stone-500">
                <p>*** Cảm ơn quý khách và hẹn gặp lại! ***</p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs transition"
              >
                <Printer className="w-4 h-4" />
                <span>Xác Nhận In / Xuất PDF (Ctrl + P)</span>
              </button>
              <button
                onClick={() => setPrintingOrder(null)}
                className="py-2.5 px-4 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-xl text-xs"
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
              <option value="Không liên lạc được khách">Không liên lạc được khách</option>
              <option value="Quá thời gian chuẩn bị">Quá thời gian chuẩn bị</option>
            </select>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setCancelModalOrder(null)}
                className="flex-1 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-xl text-xs"
              >
                Hủy Bỏ
              </button>
              <button
                onClick={handleConfirmCancel}
                className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs shadow-xs"
              >
                Xác Nhận Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
