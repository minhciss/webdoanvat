import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  PackageCheck,
  AlertTriangle,
  Plus,
  ArrowDownCircle,
  ArrowUpCircle,
  Search,
} from 'lucide-react';

export default function AdminInventory() {
  const { products, updateProduct, addAuditLog, showToast } = useApp();

  const [keyword, setKeyword] = useState('');
  const [restockProduct, setRestockProduct] = useState(null);
  const [restockQty, setRestockQty] = useState(30);

  const lowStockItems = products.filter((p) => p.stock > 0 && p.stock <= 5);
  const outOfStockItems = products.filter((p) => p.stock <= 0);

  const handleRestockSubmit = (e) => {
    e.preventDefault();
    if (!restockProduct) return;

    const added = Number(restockQty);
    const newStock = restockProduct.stock + added;

    updateProduct({
      ...restockProduct,
      stock: newStock,
      status: 'available',
    });

    addAuditLog(
      'Nhập kho nguyên liệu',
      `Nhập thêm +${added} phần cho món "${restockProduct.name}" (Tồn mới: ${newStock})`
    );

    showToast(`Đã nhập thêm +${added} phần cho "${restockProduct.name}"!`);
    setRestockProduct(null);
  };

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(keyword.toLowerCase()) ||
      p.id.toLowerCase().includes(keyword.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Banner Alert if low stock */}
      {lowStockItems.length > 0 && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-3xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-black text-amber-900">
                Có {lowStockItems.length} món ăn sắp hết hàng trong kho (Tồn ≤ 5)!
              </h4>
              <p className="text-[11px] text-amber-700">
                Bao gồm: {lowStockItems.map((i) => i.name).join(', ')}. Hãy nhập thêm nguyên liệu để không gián đoạn bán hàng.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Inventory Table */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-stone-200 flex items-center justify-between gap-4">
          <div className="relative max-w-xs flex-1">
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Tìm kiếm tồn kho món..."
              className="w-full pl-9 pr-3 py-2 bg-stone-50 rounded-xl border border-stone-200 text-xs font-medium outline-none"
            />
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          </div>

          <span className="text-xs font-bold text-stone-500">
            Tổng {products.length} mặt hàng quản lý
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase font-black tracking-wider text-[10px]">
              <tr>
                <th className="p-4">Mặt Hàng</th>
                <th className="p-4">Danh Mục</th>
                <th className="p-4">Đã Bán</th>
                <th className="p-4">Số Lượng Tồn</th>
                <th className="p-4">Mức Độ Tồn</th>
                <th className="p-4 text-right">Nhập Thêm Kho</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filtered.map((p) => {
                const isLow = p.stock > 0 && p.stock <= 5;
                const isOut = p.stock <= 0;

                return (
                  <tr key={p.id} className="hover:bg-stone-50/80 transition">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-10 h-10 rounded-xl object-cover shrink-0"
                        />
                        <div>
                          <p className="font-bold text-stone-900">{p.name}</p>
                          <span className="text-[10px] text-stone-400 font-mono">#{p.id}</span>
                        </div>
                      </div>
                    </td>

                    <td className="p-4 font-semibold text-stone-700">{p.categoryName}</td>

                    <td className="p-4 font-bold text-stone-800">{p.soldCount} phần</td>

                    <td className="p-4 font-black text-sm text-stone-900">{p.stock} phần</td>

                    <td className="p-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          isOut
                            ? 'bg-red-100 text-red-800'
                            : isLow
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {isOut ? 'Hết hàng' : isLow ? 'Sắp hết' : 'Tồn dồi dào'}
                      </span>
                    </td>

                    <td className="p-4 text-right">
                      <button
                        onClick={() => {
                          setRestockProduct(p);
                          setRestockQty(30);
                        }}
                        className="px-3 py-1.5 bg-orange-50 hover:bg-orange-100 text-orange-700 rounded-xl font-bold text-xs transition border border-orange-200 inline-flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Nhập kho</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Restock Modal */}
      {restockProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <h3 className="font-black text-stone-900 text-base">
              Nhập Thêm Kho Cho Món
            </h3>
            <p className="text-xs text-stone-600">
              <strong>{restockProduct.name}</strong> (Tồn hiện tại:{' '}
              {restockProduct.stock})
            </p>

            <form onSubmit={handleRestockSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Số lượng nhập thêm:
                </label>
                <input
                  type="number"
                  min="1"
                  max="500"
                  required
                  value={restockQty}
                  onChange={(e) => setRestockQty(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 rounded-xl border border-stone-200 font-bold text-sm outline-none focus:border-orange-500"
                />
              </div>

              <div className="p-3 bg-stone-50 rounded-xl border border-stone-100 text-[11px] text-stone-500">
                Tồn mới sau khi nhập: <strong>{restockProduct.stock + Number(restockQty || 0)} phần</strong>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setRestockProduct(null)}
                  className="flex-1 py-2 border border-stone-200 text-stone-600 rounded-xl font-bold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold shadow-sm"
                >
                  Xác nhận nhập
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
