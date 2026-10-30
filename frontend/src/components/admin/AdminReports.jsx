import React, { useState, useMemo, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import * as XLSX from 'xlsx';
import {
  Calendar,
  DollarSign,
  TrendingUp,
  Printer,
  FileSpreadsheet,
  Upload,
  Download,
  Filter,
  Search,
  BarChart3,
  PieChart,
  Clock,
  ArrowRight,
  Receipt,
  FileText,
} from 'lucide-react';

export default function AdminReports() {
  const { orders, products, addProduct, showToast } = useApp();

  // Tab điều hướng báo cáo:
  // 'period' | 'quarterly' | 'products' | 'search'
  const [activeReportTab, setActiveReportTab] = useState('period');

  // 1. Khoảng thời gian thống kê
  const [startDate, setStartDate] = useState('2026-10-01');
  const [endDate, setEndDate] = useState('2026-10-31');

  // 2. Năm tài chính
  const [selectedYear, setSelectedYear] = useState('2026');

  // 3. Tra cứu hóa đơn nâng cao
  const [searchKeyword, setSearchKeyword] = useState('');
  const [priceFrom, setPriceFrom] = useState('');
  const [priceTo, setPriceTo] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPayment, setFilterPayment] = useState('all');

  const fileInputRef = useRef(null);

  // Phím tắt chọn nhanh khoảng thời gian
  const setQuickRange = (type) => {
    const today = new Date();
    const formatYMD = (d) => d.toISOString().split('T')[0];

    if (type === 'today') {
      const dStr = formatYMD(today);
      setStartDate(dStr);
      setEndDate(dStr);
    } else if (type === '7days') {
      const past = new Date(today);
      past.setDate(past.getDate() - 7);
      setStartDate(formatYMD(past));
      setEndDate(formatYMD(today));
    } else if (type === 'thisMonth') {
      const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
      const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      setStartDate(formatYMD(firstDay));
      setEndDate(formatYMD(lastDay));
    } else if (type === 'all') {
      setStartDate('2026-01-01');
      setEndDate('2026-12-31');
    }
  };

  // =========================================================================
  // TÍNH TOÁN DỮ LIỆU THỐNG KÊ (MEMOIZED IN-MEMORY CACHE)
  // =========================================================================

  // Thống kê doanh thu theo khoảng thời gian
  const periodStats = useMemo(() => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const filtered = orders.filter((o) => {
      const oDate = o.orderDate ? new Date(o.orderDate) : new Date('2026-10-25');
      return oDate >= start && oDate <= end;
    });

    const totalOrders = filtered.length;
    const completedOrders = filtered.filter((o) => o.status === 'completed');
    const totalRevenue = completedOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    const avgOrderValue = completedOrders.length > 0 ? Math.round(totalRevenue / completedOrders.length) : 0;
    
    // Chi phí vốn nguyên liệu (~55%) & Lợi nhuận gộp
    const totalCost = Math.round(totalRevenue * 0.55);
    const netProfit = totalRevenue - totalCost;

    return {
      filteredOrders: filtered,
      totalOrders,
      completedOrdersCount: completedOrders.length,
      totalRevenue,
      totalCost,
      netProfit,
      avgOrderValue,
    };
  }, [orders, startDate, endDate]);

  // Báo cáo tài chính theo Quý & Năm
  const quarterlyStats = useMemo(() => {
    const quarters = [
      { quarter: 'Quý 1 (Tháng 1 - 3)', revenue: 45200000, cost: 24860000, profit: 20340000, margin: '45.0%' },
      { quarter: 'Quý 2 (Tháng 4 - 6)', revenue: 62400000, cost: 34320000, profit: 28080000, margin: '45.0%' },
      { quarter: 'Quý 3 (Tháng 7 - 9)', revenue: 58900000, cost: 32395000, profit: 26505000, margin: '45.0%' },
      { quarter: 'Quý 4 (Tháng 10 - 12)', revenue: 81500000, cost: 44825000, profit: 36675000, margin: '45.0%' },
    ];

    const totalRevenue = quarters.reduce((s, q) => s + q.revenue, 0);
    const totalCost = quarters.reduce((s, q) => s + q.cost, 0);
    const totalProfit = totalRevenue - totalCost;

    return { quarters, totalRevenue, totalCost, totalProfit };
  }, [selectedYear]);

  // Phân tích doanh thu theo từng món ăn qua các Quý
  const productQuarterStats = useMemo(() => {
    return products.map((prod) => {
      const sold = prod.soldCount || 45;
      const q1Qty = Math.round(sold * 0.18);
      const q2Qty = Math.round(sold * 0.28);
      const q3Qty = Math.round(sold * 0.24);
      const q4Qty = sold - (q1Qty + q2Qty + q3Qty);

      const q1Rev = q1Qty * prod.price;
      const q2Rev = q2Qty * prod.price;
      const q3Rev = q3Qty * prod.price;
      const q4Rev = q4Qty * prod.price;
      const totalRev = q1Rev + q2Rev + q3Rev + q4Rev;

      return {
        id: prod.id,
        name: prod.name,
        price: prod.price,
        q1Qty,
        q1Rev,
        q2Qty,
        q2Rev,
        q3Qty,
        q3Rev,
        q4Qty,
        q4Rev,
        totalSold: sold,
        totalRev,
      };
    }).sort((a, b) => b.totalRev - a.totalRev);
  }, [products]);

  // Tra cứu hóa đơn nâng cao (kết hợp các điều kiện lọc)
  const advancedSearchResults = useMemo(() => {
    return orders.filter((o) => {
      if (searchKeyword.trim()) {
        const q = searchKeyword.toLowerCase();
        const match =
          o.id.toLowerCase().includes(q) ||
          o.customerName?.toLowerCase().includes(q) ||
          o.customerPhone?.includes(q);
        if (!match) return false;
      }

      if (filterStatus !== 'all' && o.status !== filterStatus) return false;
      if (filterPayment !== 'all' && o.paymentMethod !== filterPayment) return false;

      const amt = o.totalAmount || 0;
      if (priceFrom && amt < Number(priceFrom)) return false;
      if (priceTo && amt > Number(priceTo)) return false;

      return true;
    });
  }, [orders, searchKeyword, filterStatus, filterPayment, priceFrom, priceTo]);

  // =========================================================================
  // XUẤT VÀ NHẬP EXCEL (.XLSX)
  // =========================================================================
  const handleExportExcel = () => {
    try {
      const wb = XLSX.utils.book_new();

      // Sheet 1: Doanh thu theo kỳ
      const s1Data = periodStats.filteredOrders.map((o) => ({
        'Mã Đơn Hàng': o.id,
        'Khách Hàng': o.customerName,
        'Số Điện Thoại': o.customerPhone,
        'Thời Gian Đặt': o.orderDate || '2026-10-30',
        'Hình Thức': o.paymentMethod?.toUpperCase(),
        'Trạng Thái': o.status,
        'Tổng Tiền (VNĐ)': o.totalAmount,
      }));
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(s1Data), 'DoanhThu_TheoKy');

      // Sheet 2: Báo cáo tài chính theo Quý
      const s2Data = quarterlyStats.quarters.map((q) => ({
        'Kỳ Báo Cáo': q.quarter,
        'Doanh Thu (Tổng thu)': q.revenue,
        'Giá Vốn Ước Tính (Tổng chi)': q.cost,
        'Lợi Nhuận Gộp': q.profit,
        'Biên Lợi Nhuận': q.margin,
      }));
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(s2Data), 'TaiChinh_TheoQuy');

      // Sheet 3: Doanh thu theo món ăn
      const s3Data = productQuarterStats.map((p) => ({
        'Mã Món': p.id,
        'Tên Món Ăn': p.name,
        'Đơn Giá': p.price,
        'SL Bán Q1': p.q1Qty,
        'Doanh Thu Q1': p.q1Rev,
        'SL Bán Q2': p.q2Qty,
        'Doanh Thu Q2': p.q2Rev,
        'SL Bán Q3': p.q3Qty,
        'Doanh Thu Q3': p.q3Rev,
        'SL Bán Q4': p.q4Qty,
        'Doanh Thu Q4': p.q4Rev,
        'Tổng Doanh Thu': p.totalRev,
      }));
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(s3Data), 'MonAn_TheoQuy');

      XLSX.writeFile(wb, `BaoCao_KinhDoanh_AnVatPro_${startDate}_${endDate}.xlsx`);
      showToast('Đã xuất file Excel báo cáo thành công!', 'success');
    } catch (err) {
      showToast('Lỗi xuất Excel: ' + err.message, 'error');
    }
  };

  const handleImportExcel = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const data = XLSX.utils.sheet_to_json(wb.Sheets[wsname]);

        if (data.length === 0) {
          showToast('File Excel không có dữ liệu!', 'error');
          return;
        }

        let count = 0;
        data.forEach((row) => {
          const name = row['Tên Món'] || row['name'] || row['Tên Món Ăn'];
          if (name) {
            addProduct({
              name,
              price: Number(row['Giá'] || row['price'] || row['Đơn Giá'] || 30000),
              categoryId: row['Danh Mục'] || row['categoryId'] || 'banh-trang',
              stock: Number(row['Tồn Kho'] || row['stock'] || 50),
              description: row['Mô Tả'] || 'Món ăn nhập từ file Excel',
              spiceLevels: ['Không cay', 'Cay nhẹ', 'Cay vừa'],
              imageUrl: 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?auto=format&fit=crop&w=600&q=80',
            });
            count++;
          }
        });

        showToast(`Đã nhập thành công ${count} món ăn vào hệ thống!`, 'success');
      } catch (err) {
        showToast('Lỗi khi đọc file Excel: ' + err.message, 'error');
      }
    };
    reader.readAsBinaryString(file);
    e.target.value = null;
  };

  return (
    <div className="space-y-6">
      {/* HEADER QUẢN TRỊ BÁO CÁO DOANH THU CHUYÊN NGHIỆP */}
      <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-stone-900 flex items-center gap-2.5">
            <BarChart3 className="w-5 h-5 text-orange-600" />
            <span>Báo Cáo & Thống Kê Doanh Thu</span>
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Theo dõi tổng quan tài chính, doanh thu theo kỳ, lợi nhuận kinh doanh và phân tích hiệu quả bán hàng.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Nút Nhập File Excel */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImportExcel}
            accept=".xlsx, .xls, .csv"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-2xl text-xs font-bold transition flex items-center gap-1.5 border border-emerald-200"
          >
            <Upload className="w-4 h-4 text-emerald-600" />
            <span>Nhập File Excel</span>
          </button>

          {/* Nút Xuất File Excel */}
          <button
            onClick={handleExportExcel}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Xuất Báo Cáo Excel</span>
          </button>

          {/* Nút In ấn / Xuất PDF */}
          <button
            onClick={() => window.print()}
            className="px-3.5 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-2xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
          >
            <Printer className="w-4 h-4 text-orange-400" />
            <span>In Báo Cáo / Xuất PDF</span>
          </button>
        </div>
      </div>

      {/* CÁC TAB CHUYÊN ĐỀ BÁO CÁO */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        <button
          onClick={() => setActiveReportTab('period')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition whitespace-nowrap flex items-center gap-2 ${
            activeReportTab === 'period'
              ? 'bg-orange-500 text-white shadow-xs'
              : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Doanh Thu Theo Thời Gian</span>
        </button>

        <button
          onClick={() => setActiveReportTab('quarterly')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition whitespace-nowrap flex items-center gap-2 ${
            activeReportTab === 'quarterly'
              ? 'bg-orange-500 text-white shadow-xs'
              : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>Báo Cáo Tài Chính (Theo Quý & Năm)</span>
        </button>

        <button
          onClick={() => setActiveReportTab('products')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition whitespace-nowrap flex items-center gap-2 ${
            activeReportTab === 'products'
              ? 'bg-orange-500 text-white shadow-xs'
              : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
          }`}
        >
          <PieChart className="w-4 h-4" />
          <span>Doanh Thu Theo Món Ăn</span>
        </button>

        <button
          onClick={() => setActiveReportTab('search')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition whitespace-nowrap flex items-center gap-2 ${
            activeReportTab === 'search'
              ? 'bg-orange-500 text-white shadow-xs'
              : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
          }`}
        >
          <Filter className="w-4 h-4" />
          <span>Tra Cứu Hóa Đơn Nâng Cao</span>
        </button>
      </div>

      {/* ================================================================= */}
      {/* 1. DOANH THU THEO KHOẢNG THỜI GIAN */}
      {/* ================================================================= */}
      {activeReportTab === 'period' && (
        <div className="space-y-6">
          {/* Thanh lọc mốc thời gian */}
          <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <label className="text-xs font-bold text-stone-600">Từ ngày:</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="p-2 border border-stone-200 rounded-xl text-xs font-semibold outline-none focus:border-orange-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <label className="text-xs font-bold text-stone-600">Đến ngày:</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="p-2 border border-stone-200 rounded-xl text-xs font-semibold outline-none focus:border-orange-500"
                />
              </div>
            </div>

            {/* Các nút chọn nhanh */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs text-stone-400 font-medium mr-1">Xem nhanh:</span>
              <button
                onClick={() => setQuickRange('today')}
                className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 rounded-lg text-xs font-semibold text-stone-700 transition"
              >
                Hôm nay
              </button>
              <button
                onClick={() => setQuickRange('7days')}
                className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 rounded-lg text-xs font-semibold text-stone-700 transition"
              >
                7 ngày qua
              </button>
              <button
                onClick={() => setQuickRange('thisMonth')}
                className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 rounded-lg text-xs font-semibold text-stone-700 transition"
              >
                Tháng này
              </button>
              <button
                onClick={() => setQuickRange('all')}
                className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 rounded-lg text-xs font-semibold text-stone-700 transition"
              >
                Cả năm 2026
              </button>
            </div>
          </div>

          {/* 4 Thẻ chỉ số kinh doanh */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs space-y-1.5">
              <span className="text-xs font-bold text-stone-500">Số Lượng Hóa Đơn</span>
              <div className="text-2xl font-black text-stone-900">{periodStats.totalOrders} Đơn</div>
              <p className="text-[11px] text-emerald-600 font-semibold">
                {periodStats.completedOrdersCount} đơn đã giao thành công
              </p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs space-y-1.5">
              <span className="text-xs font-bold text-stone-500">Tổng Doanh Thu</span>
              <div className="text-2xl font-black text-emerald-600">
                {periodStats.totalRevenue.toLocaleString('vi-VN')}đ
              </div>
              <p className="text-[11px] text-stone-500">
                Giá trị trung bình: {periodStats.avgOrderValue.toLocaleString('vi-VN')}đ/đơn
              </p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs space-y-1.5">
              <span className="text-xs font-bold text-stone-500">Chi Phí Vốn Ước Tính</span>
              <div className="text-2xl font-black text-amber-600">
                {periodStats.totalCost.toLocaleString('vi-VN')}đ
              </div>
              <p className="text-[11px] text-stone-500">Nguyên vật liệu & bao bì (~55%)</p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs space-y-1.5">
              <span className="text-xs font-bold text-stone-500">Lợi Nhuận Gộp</span>
              <div className="text-2xl font-black text-orange-600">
                {periodStats.netProfit.toLocaleString('vi-VN')}đ
              </div>
              <p className="text-[11px] text-emerald-600 font-bold">Biên lợi nhuận: ~45.0%</p>
            </div>
          </div>

          {/* Bảng danh sách chi tiết hóa đơn */}
          <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-stone-100 flex items-center justify-between">
              <h3 className="text-xs font-black text-stone-800">
                Chi Tiết Hóa Đơn ({startDate} đến {endDate})
              </h3>
              <span className="text-[11px] font-bold text-stone-500">
                {periodStats.filteredOrders.length} hóa đơn
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-stone-50 border-b border-stone-100 text-[11px] font-bold text-stone-500">
                    <th className="py-3 px-4">Mã Hóa Đơn</th>
                    <th className="py-3 px-4">Khách Hàng</th>
                    <th className="py-3 px-4">Thời Gian Đặt</th>
                    <th className="py-3 px-4">Phương Thức</th>
                    <th className="py-3 px-4">Trạng Thái</th>
                    <th className="py-3 px-4 text-right">Tổng Tiền</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-stone-700">
                  {periodStats.filteredOrders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-stone-50/60 transition">
                      <td className="py-3 px-4 font-black text-stone-900">#{ord.id}</td>
                      <td className="py-3 px-4 font-bold">{ord.customerName}</td>
                      <td className="py-3 px-4 text-stone-500">{ord.orderDate || '2026-10-30'}</td>
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* 2. BÁO CÁO TÀI CHÍNH THEO QUÝ & NĂM */}
      {/* ================================================================= */}
      {activeReportTab === 'quarterly' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs flex items-center justify-between">
            <div>
              <h3 className="text-sm font-black text-stone-900">
                Kết Quả Hoạt Động Kinh Doanh Năm {selectedYear}
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Tổng hợp doanh thu, giá vốn hàng bán và lợi nhuận gộp theo từng Quý.
              </p>
            </div>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="p-2 border border-stone-200 rounded-xl text-xs font-bold outline-none"
            >
              <option value="2026">Năm Tài Chính 2026</option>
              <option value="2025">Năm Tài Chính 2025</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-emerald-50 border border-emerald-200 p-5 rounded-3xl space-y-1">
              <span className="text-xs font-bold text-emerald-700">TỔNG DOANH THU CẢ NĂM</span>
              <div className="text-2xl font-black text-emerald-800">
                {quarterlyStats.totalRevenue.toLocaleString('vi-VN')}đ
              </div>
              <p className="text-[11px] text-emerald-600">Tổng doanh thu bán hàng 4 Quý</p>
            </div>

            <div className="bg-amber-50 border border-amber-200 p-5 rounded-3xl space-y-1">
              <span className="text-xs font-bold text-amber-700">TỔNG GIÁ VỐN & CHI PHÍ</span>
              <div className="text-2xl font-black text-amber-800">
                {quarterlyStats.totalCost.toLocaleString('vi-VN')}đ
              </div>
              <p className="text-[11px] text-amber-600">Chi phí nhập nguyên liệu & bao bì</p>
            </div>

            <div className="bg-orange-50 border border-orange-200 p-5 rounded-3xl space-y-1">
              <span className="text-xs font-bold text-orange-700">LỢI NHUẬN GỘP CẢ NĂM</span>
              <div className="text-2xl font-black text-orange-800">
                {quarterlyStats.totalProfit.toLocaleString('vi-VN')}đ
              </div>
              <p className="text-[11px] text-orange-600 font-bold">Biên lợi nhuận: 45.0%</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-100 text-[11px] font-bold text-stone-500">
                  <th className="py-3.5 px-4">Kỳ Báo Cáo</th>
                  <th className="py-3.5 px-4 text-right">Doanh Thu (VNĐ)</th>
                  <th className="py-3.5 px-4 text-right">Giá Vốn (VNĐ)</th>
                  <th className="py-3.5 px-4 text-right">Lợi Nhuận Gộp (VNĐ)</th>
                  <th className="py-3.5 px-4 text-center">Tỷ Suất LN</th>
                  <th className="py-3.5 px-4 text-center">Tình Trạng</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-700">
                {quarterlyStats.quarters.map((q, idx) => (
                  <tr key={idx} className="hover:bg-stone-50/60 transition">
                    <td className="py-3.5 px-4 font-bold text-stone-900">{q.quarter}</td>
                    <td className="py-3.5 px-4 text-right font-black text-emerald-700">
                      {q.revenue.toLocaleString('vi-VN')}đ
                    </td>
                    <td className="py-3.5 px-4 text-right font-medium text-amber-700">
                      {q.cost.toLocaleString('vi-VN')}đ
                    </td>
                    <td className="py-3.5 px-4 text-right font-black text-orange-600">
                      {q.profit.toLocaleString('vi-VN')}đ
                    </td>
                    <td className="py-3.5 px-4 text-center font-bold text-stone-600">{q.margin}</td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
                        <TrendingUp className="w-3 h-3" /> Đạt kế hoạch
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* 3. DOANH THU THEO TỪNG MÓN ĂN */}
      {/* ================================================================= */}
      {activeReportTab === 'products' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs flex items-center justify-between">
            <div>
              <h3 className="text-sm font-black text-stone-900">
                Sản Lượng & Doanh Thu Từng Món Ăn (Năm {selectedYear})
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Bảng phân tích số lượng bán ra và doanh số chi tiết của từng món qua 4 Quý trong năm.
              </p>
            </div>
            <button
              onClick={handleExportExcel}
              className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs rounded-xl flex items-center gap-1.5 transition"
            >
              <Download className="w-3.5 h-3.5" /> Xuất Excel
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-stone-50 border-b border-stone-100 text-[11px] font-bold text-stone-500">
                    <th className="py-3 px-4">Tên Món Ăn</th>
                    <th className="py-3 px-4">Đơn Giá</th>
                    <th className="py-3 px-4 text-center bg-orange-50/40">Quý 1 (SL / Tiền)</th>
                    <th className="py-3 px-4 text-center bg-blue-50/40">Quý 2 (SL / Tiền)</th>
                    <th className="py-3 px-4 text-center bg-emerald-50/40">Quý 3 (SL / Tiền)</th>
                    <th className="py-3 px-4 text-center bg-purple-50/40">Quý 4 (SL / Tiền)</th>
                    <th className="py-3 px-4 text-right font-black">Tổng Doanh Thu</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-stone-700">
                  {productQuarterStats.map((prod) => (
                    <tr key={prod.id} className="hover:bg-stone-50/60 transition">
                      <td className="py-3 px-4 font-bold text-stone-900">{prod.name}</td>
                      <td className="py-3 px-4 text-stone-500">{prod.price.toLocaleString('vi-VN')}đ</td>
                      <td className="py-3 px-4 text-center bg-orange-50/10">
                        <span className="font-bold">{prod.q1Qty}</span> phần ({prod.q1Rev.toLocaleString('vi-VN')}đ)
                      </td>
                      <td className="py-3 px-4 text-center bg-blue-50/10">
                        <span className="font-bold">{prod.q2Qty}</span> phần ({prod.q2Rev.toLocaleString('vi-VN')}đ)
                      </td>
                      <td className="py-3 px-4 text-center bg-emerald-50/10">
                        <span className="font-bold">{prod.q3Qty}</span> phần ({prod.q3Rev.toLocaleString('vi-VN')}đ)
                      </td>
                      <td className="py-3 px-4 text-center bg-purple-50/10">
                        <span className="font-bold">{prod.q4Qty}</span> phần ({prod.q4Rev.toLocaleString('vi-VN')}đ)
                      </td>
                      <td className="py-3 px-4 text-right font-black text-orange-600">
                        {prod.totalRev.toLocaleString('vi-VN')}đ
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* 4. TRA CỨU HÓA ĐƠN NÂNG CAO */}
      {/* ================================================================= */}
      {activeReportTab === 'search' && (
        <div className="space-y-6">
          {/* Hộp bộ lọc tra cứu */}
          <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs space-y-4">
            <h3 className="text-sm font-black text-stone-900 flex items-center gap-2">
              <Filter className="w-4 h-4 text-orange-600" />
              <span>Bộ Lọc Tra Cứu Hóa Đơn & Đơn Hàng</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="text-[11px] font-bold text-stone-600 block mb-1">
                  Từ khóa tìm kiếm:
                </label>
                <input
                  type="text"
                  placeholder="Mã đơn, Tên khách, SĐT..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  className="w-full p-2 border border-stone-200 rounded-xl text-xs outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-stone-600 block mb-1">
                  Khoảng giá thanh toán (VNĐ):
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    placeholder="Từ giá"
                    value={priceFrom}
                    onChange={(e) => setPriceFrom(e.target.value)}
                    className="w-1/2 p-2 border border-stone-200 rounded-xl text-xs font-semibold outline-none focus:border-orange-500"
                  />
                  <span className="text-stone-400 text-xs">-</span>
                  <input
                    type="number"
                    placeholder="Đến giá"
                    value={priceTo}
                    onChange={(e) => setPriceTo(e.target.value)}
                    className="w-1/2 p-2 border border-stone-200 rounded-xl text-xs font-semibold outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-stone-600 block mb-1">Trạng thái đơn:</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full p-2 border border-stone-200 rounded-xl text-xs font-medium outline-none"
                >
                  <option value="all">Tất cả trạng thái</option>
                  <option value="completed">Đã hoàn tất</option>
                  <option value="confirmed">Bếp đang làm</option>
                  <option value="shipping">Đang ship</option>
                  <option value="pending">Chờ duyệt</option>
                  <option value="cancelled">Đã hủy</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-stone-600 block mb-1">Hình thức thanh toán:</label>
                <select
                  value={filterPayment}
                  onChange={(e) => setFilterPayment(e.target.value)}
                  className="w-full p-2 border border-stone-200 rounded-xl text-xs font-medium outline-none"
                >
                  <option value="all">Tất cả phương thức</option>
                  <option value="vietqr">Chuyển khoản VietQR</option>
                  <option value="cod">Tiền mặt khi nhận (COD)</option>
                  <option value="momo">Ví MoMo</option>
                  <option value="vnpay">Cổng VNPay</option>
                </select>
              </div>
            </div>
          </div>

          {/* Bảng kết quả tra cứu */}
          <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-stone-100 flex items-center justify-between">
              <h3 className="text-xs font-black text-stone-800">
                Danh Sách Hóa Đơn Thỏa Điều Kiện ({advancedSearchResults.length} đơn)
              </h3>
            </div>

            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-100 text-[11px] font-bold text-stone-500">
                  <th className="py-3 px-4">Mã Đơn</th>
                  <th className="py-3 px-4">Khách Hàng</th>
                  <th className="py-3 px-4">Số Điện Thoại</th>
                  <th className="py-3 px-4">Hình Thức</th>
                  <th className="py-3 px-4">Trạng Thái</th>
                  <th className="py-3 px-4 text-right">Tổng Tiền</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-700">
                {advancedSearchResults.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-stone-400">
                      Không tìm thấy hóa đơn nào phù hợp với bộ lọc hiện tại!
                    </td>
                  </tr>
                ) : (
                  advancedSearchResults.map((ord) => (
                    <tr key={ord.id} className="hover:bg-stone-50/60 transition">
                      <td className="py-3 px-4 font-black text-stone-900">#{ord.id}</td>
                      <td className="py-3 px-4 font-bold">{ord.customerName}</td>
                      <td className="py-3 px-4 text-stone-500">{ord.customerPhone}</td>
                      <td className="py-3 px-4 uppercase text-[10px] font-bold text-stone-500">
                        {ord.paymentMethod}
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-[10px] font-bold bg-stone-100 px-2 py-0.5 rounded-full text-stone-600">
                          {ord.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-black text-orange-600">
                        {ord.totalAmount?.toLocaleString('vi-VN')}đ
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
