import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  Search,
  Plus,
  Edit2,
  Trash2,
  Lock,
  Unlock,
  Gift,
  Award,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  XCircle,
  X,
  ShoppingBag,
} from 'lucide-react';

export default function AdminCustomers() {
  const {
    customers,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    toggleCustomerStatus,
    adjustCustomerPoints,
    showToast,
  } = useApp();

  const [searchKeyword, setSearchKeyword] = useState('');
  const [filterRank, setFilterRank] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Modal: Add / Edit customer
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formAddress, setFormAddress] = useState('');
  const [formPoints, setFormPoints] = useState(50);
  const [formRank, setFormRank] = useState('Thành viên');
  const [formNote, setFormNote] = useState('');

  // Modal: Adjust points
  const [isPointsModalOpen, setIsPointsModalOpen] = useState(false);
  const [pointCustomer, setPointCustomer] = useState(null);
  const [pointAction, setPointAction] = useState('add'); // 'add' | 'subtract'
  const [pointAmount, setPointAmount] = useState(50);
  const [pointReason, setPointReason] = useState('Tri ân khách hàng thân thiết');

  // Open Add modal
  const handleOpenAdd = () => {
    setEditingCustomer(null);
    setFormName('');
    setFormPhone('');
    setFormEmail('');
    setFormAddress('');
    setFormPoints(50);
    setFormRank('Thành viên');
    setFormNote('');
    setIsCustomerModalOpen(true);
  };

  // Open Edit modal
  const handleOpenEdit = (cust) => {
    setEditingCustomer(cust);
    setFormName(cust.name);
    setFormPhone(cust.phone);
    setFormEmail(cust.email);
    setFormAddress(cust.address);
    setFormPoints(cust.points || 0);
    setFormRank(cust.rank || 'Thành viên');
    setFormNote(cust.note || '');
    setIsCustomerModalOpen(true);
  };

  // Open Points modal
  const handleOpenPoints = (cust) => {
    setPointCustomer(cust);
    setPointAction('add');
    setPointAmount(50);
    setPointReason('Tặng xu tri ân khách hàng thân thiết');
    setIsPointsModalOpen(true);
  };

  // Submit Save Customer
  const handleSaveCustomer = (e) => {
    e.preventDefault();
    if (!formName.trim() || !formPhone.trim()) {
      showToast('Vui lòng điền họ tên và số điện thoại!', 'error');
      return;
    }

    const payload = {
      name: formName.trim(),
      phone: formPhone.trim(),
      email: formEmail.trim() || `${formPhone.trim()}@anvatpro.vn`,
      address: formAddress.trim() || 'Chưa cập nhật địa chỉ',
      points: Number(formPoints) || 0,
      rank: formRank,
      note: formNote.trim(),
    };

    if (editingCustomer) {
      updateCustomer(editingCustomer.id, payload);
    } else {
      addCustomer(payload);
    }

    setIsCustomerModalOpen(false);
  };

  // Submit Points Adjustment
  const handleSavePoints = (e) => {
    e.preventDefault();
    if (!pointCustomer) return;
    const amount = Number(pointAmount) || 0;
    if (amount <= 0) {
      showToast('Số điểm phải lớn hơn 0!', 'error');
      return;
    }

    const diff = pointAction === 'add' ? amount : -amount;
    adjustCustomerPoints(pointCustomer.id, diff, pointReason);
    setIsPointsModalOpen(false);
  };

  // Filtered customer list
  const safeCustomers = Array.isArray(customers) ? customers : [];

  const filteredCustomers = safeCustomers.filter((c) => {
    if (searchKeyword.trim()) {
      const q = searchKeyword.toLowerCase();
      const matchName = c.name?.toLowerCase().includes(q);
      const matchPhone = c.phone?.toLowerCase().includes(q);
      const matchEmail = c.email?.toLowerCase().includes(q);
      if (!matchName && !matchPhone && !matchEmail) return false;
    }

    if (filterRank !== 'all' && c.rank !== filterRank) return false;
    if (filterStatus !== 'all' && c.status !== filterStatus) return false;

    return true;
  });

  const vipCount = safeCustomers.filter((c) => c.rank === 'VIP' || c.rank === 'Kim Cương').length;
  const totalPoints = safeCustomers.reduce((sum, c) => sum + (c.points || 0), 0);
  const activeCount = safeCustomers.filter((c) => c.status !== 'blocked').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. Header & Summary Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-stone-900 tracking-tight flex items-center gap-2.5">
            <Users className="w-7 h-7 text-orange-500" />
            <span>Quản Lý Khách Hàng & Thành Viên</span>
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Theo dõi danh sách khách hàng, cấp bậc VIP, điểm tích lũy và kiểm soát trạng thái tài khoản
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-2xl shadow-md transition flex items-center gap-2 self-start sm:self-auto active:scale-95"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Thêm Khách Hàng Mới</span>
        </button>
      </div>

      {/* 2. Top Statistic Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-3xl border border-stone-200 shadow-xs space-y-1">
          <p className="text-xs font-bold text-stone-400">Tổng khách hàng</p>
          <p className="text-2xl font-black text-stone-900">{safeCustomers.length}</p>
          <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full inline-block">
            ✓ Đã đăng ký thành viên
          </span>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-stone-200 shadow-xs space-y-1">
          <p className="text-xs font-bold text-stone-400">Khách hàng VIP & Kim Cương</p>
          <p className="text-2xl font-black text-amber-600">{vipCount}</p>
          <span className="text-[10px] text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded-full inline-block">
            ⭐ Tỷ lệ đóng góp 65% doanh thu
          </span>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-stone-200 shadow-xs space-y-1">
          <p className="text-xs font-bold text-stone-400">Tổng điểm tích lũy</p>
          <p className="text-2xl font-black text-orange-600">{totalPoints.toLocaleString('vi-VN')} Xu</p>
          <span className="text-[10px] text-orange-700 font-bold bg-orange-50 px-2 py-0.5 rounded-full inline-block">
            🎁 Tương đương {(totalPoints * 100).toLocaleString('vi-VN')}đ
          </span>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-stone-200 shadow-xs space-y-1">
          <p className="text-xs font-bold text-stone-400">Tài khoản hoạt động</p>
          <p className="text-2xl font-black text-emerald-600">{activeCount}</p>
          <span className="text-[10px] text-stone-500 font-medium">
            {safeCustomers.length - activeCount} tài khoản bị khóa
          </span>
        </div>
      </div>

      {/* 3. Search and Filters */}
      <div className="bg-white p-4 rounded-3xl border border-stone-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex flex-1 items-center gap-2.5 w-full md:w-auto">
          <div className="relative flex-1 max-w-sm">
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="Tìm theo tên, số điện thoại, email..."
              className="w-full pl-9 pr-4 py-2 bg-stone-100 rounded-xl text-xs outline-none focus:bg-white focus:border-orange-500 border border-stone-200 font-medium"
            />
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          </div>

          <select
            value={filterRank}
            onChange={(e) => setFilterRank(e.target.value)}
            className="px-3 py-2 bg-stone-100 rounded-xl text-xs font-bold border border-stone-200 outline-none text-stone-700 cursor-pointer"
          >
            <option value="all">Tất cả thứ hạng</option>
            <option value="Kim Cương">💎 Kim Cương</option>
            <option value="VIP">⭐ VIP</option>
            <option value="Thành viên">🌿 Thành viên</option>
            <option value="Mới">🌱 Mới</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 bg-stone-100 rounded-xl text-xs font-bold border border-stone-200 outline-none text-stone-700 cursor-pointer"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Đang hoạt động</option>
            <option value="blocked">Đang khóa</option>
          </select>
        </div>

        <div className="text-xs text-stone-400 font-semibold self-end md:self-auto">
          Hiển thị <strong>{filteredCustomers.length}</strong> khách hàng
        </div>
      </div>

      {/* 4. Customers Table */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-400 uppercase font-black text-[10px] tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Khách Hàng</th>
                <th className="py-3.5 px-4">Liên Hệ & Địa Chỉ</th>
                <th className="py-3.5 px-4 text-center">Hạng</th>
                <th className="py-3.5 px-4 text-center">Điểm Tích Lũy</th>
                <th className="py-3.5 px-4 text-center">Đơn Hàng</th>
                <th className="py-3.5 px-4 text-center">Trạng Thái</th>
                <th className="py-3.5 px-4 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-stone-400">
                    Không tìm thấy khách hàng nào phù hợp với bộ lọc.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((cust) => (
                  <tr key={cust.id} className="hover:bg-stone-50/80 transition">
                    {/* Customer Info */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-500 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-xs">
                          {cust.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-black text-stone-900 text-xs">{cust.name}</p>
                          <p className="text-[10px] text-stone-400 font-mono">MÃ: {cust.id}</p>
                        </div>
                      </div>
                    </td>

                    {/* Contact & Address */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-0.5">
                        <p className="font-bold text-stone-800 flex items-center gap-1.5">
                          <Phone className="w-3 h-3 text-stone-400" />
                          <span>{cust.phone}</span>
                        </p>
                        <p className="text-[11px] text-stone-500 flex items-center gap-1.5 truncate max-w-xs">
                          <MapPin className="w-3 h-3 text-stone-400 shrink-0" />
                          <span>{cust.address}</span>
                        </p>
                      </div>
                    </td>

                    {/* Rank */}
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-wide ${
                          cust.rank === 'Kim Cương'
                            ? 'bg-purple-100 text-purple-800 border border-purple-200'
                            : cust.rank === 'VIP'
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : cust.rank === 'Thành viên'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : 'bg-stone-100 text-stone-600 border border-stone-200'
                        }`}
                      >
                        {cust.rank === 'Kim Cương' && '💎 '}
                        {cust.rank === 'VIP' && '⭐ '}
                        {cust.rank}
                      </span>
                    </td>

                    {/* Loyalty Points */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="inline-flex items-center gap-1 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-xl">
                        <Sparkles className="w-3 h-3 text-amber-500 fill-amber-500" />
                        <span className="font-black text-amber-800 text-xs">
                          {(cust.points || 0).toLocaleString('vi-VN')}
                        </span>
                        <span className="text-[10px] text-amber-600 font-bold">Xu</span>
                      </div>
                    </td>

                    {/* Order count & total spent */}
                    <td className="py-3.5 px-4 text-center">
                      <div>
                        <p className="font-bold text-stone-800">{cust.orderCount || 0} đơn</p>
                        <p className="text-[10px] text-orange-600 font-black">
                          {((cust.totalSpent || 0)).toLocaleString('vi-VN')}đ
                        </p>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => toggleCustomerStatus(cust.id)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black transition cursor-pointer ${
                          cust.status === 'blocked'
                            ? 'bg-red-100 text-red-700 hover:bg-red-200'
                            : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                        }`}
                        title="Bấm để khóa / mở khóa tài khoản"
                      >
                        {cust.status === 'blocked' ? (
                          <>
                            <XCircle className="w-3 h-3 text-red-600" />
                            <span>Đã khóa</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Hoạt động</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenPoints(cust)}
                          className="p-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-lg transition border border-amber-200"
                          title="Tặng / Điều chỉnh điểm thưởng (Xu)"
                        >
                          <Gift className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleOpenEdit(cust)}
                          className="p-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg transition"
                          title="Sửa thông tin khách hàng"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => {
                            if (window.confirm(`Bạn có chắc muốn xóa khách hàng "${cust.name}" không?`)) {
                              deleteCustomer(cust.id);
                            }
                          }}
                          className="p-1.5 bg-stone-100 hover:bg-red-50 text-stone-400 hover:text-red-600 rounded-lg transition"
                          title="Xóa tài khoản"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal 1: Add / Edit Customer */}
      {isCustomerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative border border-stone-100">
            <button
              onClick={() => setIsCustomerModalOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full hover:bg-stone-100 text-stone-400 flex items-center justify-center transition"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-black text-stone-900 uppercase tracking-wide flex items-center gap-2">
              <Users className="w-5 h-5 text-orange-500" />
              <span>{editingCustomer ? 'Chỉnh Sửa Khách Hàng' : 'Thêm Khách Hàng Mới'}</span>
            </h3>

            <form onSubmit={handleSaveCustomer} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Họ và tên *</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="VD: Nguyễn Văn An"
                  className="w-full p-2.5 bg-stone-50 rounded-xl border border-stone-200 outline-none focus:border-orange-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Số điện thoại *</label>
                  <input
                    type="tel"
                    required
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    placeholder="VD: 0909123456"
                    className="w-full p-2.5 bg-stone-50 rounded-xl border border-stone-200 outline-none focus:border-orange-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    placeholder="VD: an@gmail.com"
                    className="w-full p-2.5 bg-stone-50 rounded-xl border border-stone-200 outline-none focus:border-orange-500 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Địa chỉ giao hàng mặc định</label>
                <textarea
                  rows={2}
                  value={formAddress}
                  onChange={(e) => setFormAddress(e.target.value)}
                  placeholder="Số nhà, tên đường, phường/xã, quận/huyện..."
                  className="w-full p-2.5 bg-stone-50 rounded-xl border border-stone-200 outline-none focus:border-orange-500 font-medium resize-none"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Điểm tích lũy (Xu)</label>
                  <input
                    type="number"
                    min="0"
                    value={formPoints}
                    onChange={(e) => setFormPoints(e.target.value)}
                    className="w-full p-2.5 bg-stone-50 rounded-xl border border-stone-200 outline-none focus:border-orange-500 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Hạng thành viên</label>
                  <select
                    value={formRank}
                    onChange={(e) => setFormRank(e.target.value)}
                    className="w-full p-2.5 bg-stone-50 rounded-xl border border-stone-200 outline-none font-bold text-stone-700 cursor-pointer"
                  >
                    <option value="Mới">Mới</option>
                    <option value="Thành viên">Thành viên</option>
                    <option value="VIP">VIP</option>
                    <option value="Kim Cương">Kim Cương</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Ghi chú khẩu vị / đặc điểm khách:</label>
                <input
                  type="text"
                  value={formNote}
                  onChange={(e) => setFormNote(e.target.value)}
                  placeholder="VD: Thích ăn cay vừa, chuộng món bánh tráng..."
                  className="w-full p-2.5 bg-stone-50 rounded-xl border border-stone-200 outline-none focus:border-orange-500 font-medium"
                />
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsCustomerModalOpen(false)}
                  className="flex-1 py-2.5 border border-stone-200 hover:bg-stone-50 rounded-xl font-bold text-stone-600 transition"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold transition shadow-sm"
                >
                  {editingCustomer ? 'Lưu Thay Đổi' : 'Thêm Khách Hàng'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Adjust Loyalty Points */}
      {isPointsModalOpen && pointCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl relative border border-stone-100">
            <button
              onClick={() => setIsPointsModalOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full hover:bg-stone-100 text-stone-400 flex items-center justify-center transition"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-black text-stone-900 flex items-center gap-2">
              <Gift className="w-5 h-5 text-amber-500" />
              <span>Điều Chỉnh Điểm Tích Lũy</span>
            </h3>

            <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs">
              <p className="font-bold text-stone-800">{pointCustomer.name}</p>
              <p className="text-stone-500 text-[11px]">{pointCustomer.phone}</p>
              <p className="text-amber-800 font-black mt-1">
                Điểm hiện tại: {pointCustomer.points || 0} Xu
              </p>
            </div>

            <form onSubmit={handleSavePoints} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Loại thao tác:</label>
                <div className="flex bg-stone-100 p-1 rounded-xl font-bold">
                  <button
                    type="button"
                    onClick={() => setPointAction('add')}
                    className={`flex-1 py-1.5 rounded-lg transition ${
                      pointAction === 'add'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'text-stone-500 hover:text-stone-800'
                    }`}
                  >
                    + Thưởng Xu
                  </button>
                  <button
                    type="button"
                    onClick={() => setPointAction('subtract')}
                    className={`flex-1 py-1.5 rounded-lg transition ${
                      pointAction === 'subtract'
                        ? 'bg-red-600 text-white shadow-xs'
                        : 'text-stone-500 hover:text-stone-800'
                    }`}
                  >
                    - Trừ Xu
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Số lượng Xu:</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={pointAmount}
                  onChange={(e) => setPointAmount(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 rounded-xl border border-stone-200 outline-none focus:border-orange-500 font-black text-stone-900 text-sm"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Lý do điều chỉnh:</label>
                <input
                  type="text"
                  required
                  value={pointReason}
                  onChange={(e) => setPointReason(e.target.value)}
                  placeholder="VD: Quà tặng sinh nhật, Bồi thường giao chậm..."
                  className="w-full p-2.5 bg-stone-50 rounded-xl border border-stone-200 outline-none focus:border-orange-500 font-medium"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsPointsModalOpen(false)}
                  className="flex-1 py-2.5 border border-stone-200 hover:bg-stone-50 rounded-xl font-bold text-stone-600 transition"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold transition shadow-sm"
                >
                  Xác Nhận
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
