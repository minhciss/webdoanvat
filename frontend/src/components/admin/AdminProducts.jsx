import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CATEGORIES, SPICE_LEVELS } from '../../data/mockData';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Power,
  X,
  AlertTriangle,
  Check,
  Flame,
  Sparkles,
} from 'lucide-react';

export default function AdminProducts() {
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleProductStatus,
    showToast,
  } = useApp();

  const [keyword, setKeyword] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Form states
  const [formName, setFormName] = useState('');
  const [formCat, setFormCat] = useState('banh-trang');
  const [formPrice, setFormPrice] = useState(30000);
  const [formDiscount, setFormDiscount] = useState(0);
  const [formStock, setFormStock] = useState(50);
  const [formImage, setFormImage] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formSpices, setFormSpices] = useState(['Không cay', 'Cay vừa']);
  const [formIsFlashSale, setFormIsFlashSale] = useState(false);
  const [formIsNew, setFormIsNew] = useState(true);

  // Open modal for creating or editing
  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormName('');
    setFormCat('banh-trang');
    setFormPrice(30000);
    setFormDiscount(0);
    setFormStock(50);
    setFormImage('https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?w=600');
    setFormDesc('Món ăn vặt thơm ngon giòn rụm được nhiều thực khách yêu thích.');
    setFormSpices(['Không cay', 'Cay vừa']);
    setFormIsFlashSale(false);
    setFormIsNew(true);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (prod) => {
    setEditingProduct(prod);
    setFormName(prod.name);
    setFormCat(prod.categoryId);
    setFormPrice(prod.originalPrice || prod.price);
    setFormDiscount(prod.discountPercent || 0);
    setFormStock(prod.stock);
    setFormImage(prod.image);
    setFormDesc(prod.description);
    setFormSpices(prod.spiceLevels || ['Cay vừa']);
    setFormIsFlashSale(prod.isFlashSale || false);
    setFormIsNew(prod.isNew || false);
    setIsModalOpen(true);
  };

  const handleSaveProduct = (e) => {
    e.preventDefault();
    if (!formName.trim()) {
      showToast('Vui lòng nhập tên món ăn!', 'error');
      return;
    }

    const catObj = CATEGORIES.find((c) => c.id === formCat) || CATEGORIES[1];
    const discount = Number(formDiscount) || 0;
    const origPrice = Number(formPrice) || 0;
    const finalPrice = Math.round(origPrice * (1 - discount / 100));

    const productPayload = {
      name: formName.trim(),
      categoryId: formCat,
      categoryName: catObj.name,
      price: finalPrice,
      originalPrice: origPrice,
      discountPercent: discount,
      stock: Number(formStock),
      spiceLevels: formSpices.length > 0 ? formSpices : ['Cay vừa'],
      defaultSpice: formSpices[0] || 'Cay vừa',
      image: formImage.trim() || 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?w=600',
      description: formDesc.trim(),
      isFlashSale: formIsFlashSale,
      isNew: formIsNew,
    };

    if (editingProduct) {
      updateProduct({ ...editingProduct, ...productPayload });
    } else {
      addProduct(productPayload);
    }

    setIsModalOpen(false);
  };

  const toggleSpiceInForm = (spiceLabel) => {
    if (formSpices.includes(spiceLabel)) {
      if (formSpices.length > 1) {
        setFormSpices(formSpices.filter((s) => s !== spiceLabel));
      } else {
        showToast('Món phải có ít nhất 1 cấp độ cay!', 'error');
      }
    } else {
      setFormSpices([...formSpices, spiceLabel]);
    }
  };

  // Filter products
  const displayProducts = products.filter((p) => {
    if (keyword.trim()) {
      const q = keyword.toLowerCase();
      if (!p.name.toLowerCase().includes(q) && !p.id.toLowerCase().includes(q)) {
        return false;
      }
    }
    if (selectedCat !== 'all' && p.categoryId !== selectedCat) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Action Bar: Title, Search, Category Filter & Add Button */}
      <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-1 items-center gap-3 w-full md:w-auto">
          {/* Search box */}
          <div className="relative flex-1 max-w-xs">
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Tìm theo tên món hoặc mã..."
              className="w-full pl-9 pr-3 py-2 bg-stone-50 rounded-xl border border-stone-200 text-xs font-medium outline-none focus:bg-white focus:border-orange-500"
            />
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          </div>

          {/* Category Dropdown */}
          <select
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
            className="px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold text-stone-700 outline-none"
          >
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleOpenAdd}
          className="w-full md:w-auto px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Thêm Món Ăn Mới</span>
        </button>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase font-black tracking-wider text-[10px]">
              <tr>
                <th className="p-4">Món Ăn</th>
                <th className="p-4">Danh Mục</th>
                <th className="p-4">Giá Bán</th>
                <th className="p-4">Tồn Kho</th>
                <th className="p-4">Cấp Độ Cay</th>
                <th className="p-4">Trạng Thái</th>
                <th className="p-4 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {displayProducts.map((p) => {
                const isLow = p.stock > 0 && p.stock <= 5;
                const isOut = p.stock <= 0;

                return (
                  <tr key={p.id} className="hover:bg-stone-50/80 transition">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-12 h-12 rounded-xl object-cover shrink-0 border border-stone-200"
                        />
                        <div>
                          <p className="font-extrabold text-stone-900 text-xs">{p.name}</p>
                          <span className="text-[10px] text-stone-400 font-mono">#{p.id}</span>
                          {p.isFlashSale && (
                            <span className="ml-2 text-[10px] bg-red-100 text-red-600 px-1.5 py-0.2 rounded font-bold">
                              Sale -{p.discountPercent}%
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="p-4 font-bold text-stone-700">{p.categoryName}</td>

                    <td className="p-4">
                      <div className="font-black text-orange-600 text-xs">
                        {p.price.toLocaleString('vi-VN')}đ
                      </div>
                      {p.originalPrice > p.price && (
                        <div className="text-[10px] text-stone-400 line-through">
                          {p.originalPrice.toLocaleString('vi-VN')}đ
                        </div>
                      )}
                    </td>

                    <td className="p-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          isOut
                            ? 'bg-stone-200 text-stone-600'
                            : isLow
                            ? 'bg-amber-100 text-amber-800 border border-amber-300'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {isLow && <AlertTriangle className="w-3 h-3 text-amber-600" />}
                        <span>{p.stock} phần</span>
                      </span>
                    </td>

                    <td className="p-4">
                      <div className="flex flex-wrap gap-1 max-w-[140px]">
                        {p.spiceLevels?.map((s, idx) => (
                          <span
                            key={idx}
                            className="text-[9px] bg-stone-100 px-1.5 py-0.5 rounded text-stone-600 font-semibold"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="p-4">
                      <button
                        onClick={() => toggleProductStatus(p.id)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[10px] font-bold transition ${
                          p.status === 'available'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                            : 'bg-stone-100 text-stone-500 border border-stone-200 hover:bg-stone-200'
                        }`}
                      >
                        <Power className="w-3 h-3" />
                        <span>{p.status === 'available' ? 'Đang bán' : 'Tạm dừng'}</span>
                      </button>
                    </td>

                    <td className="p-4 text-right space-x-1 whitespace-nowrap">
                      <button
                        onClick={() => handleOpenEdit(p)}
                        className="p-1.5 hover:bg-stone-100 text-stone-600 rounded-lg transition"
                        title="Chỉnh sửa món"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Bạn có chắc muốn xóa món "${p.name}"?`)) {
                            deleteProduct(p.id);
                          }
                        }}
                        className="p-1.5 hover:bg-red-50 text-stone-400 hover:text-red-600 rounded-lg transition"
                        title="Xóa món ăn"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto space-y-4 shadow-2xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full hover:bg-stone-100 flex items-center justify-center text-stone-400"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-black text-stone-900">
              {editingProduct ? 'Chỉnh Sửa Thông Tin Món Ăn' : 'Thêm Món Ăn Mới Vào Thực Đơn'}
            </h3>

            <form onSubmit={handleSaveProduct} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Tên món ăn *</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Ví dụ: Bánh Tráng Cuốn Sốt Trứng Muối"
                  className="w-full p-2.5 bg-stone-50 rounded-xl border border-stone-200 outline-none focus:border-orange-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Danh mục *</label>
                  <select
                    value={formCat}
                    onChange={(e) => setFormCat(e.target.value)}
                    className="w-full p-2.5 bg-stone-50 rounded-xl border border-stone-200 outline-none font-medium"
                  >
                    {CATEGORIES.filter((c) => c.id !== 'all').map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Số lượng tồn kho *</label>
                  <input
                    type="number"
                    min="0"
                    value={formStock}
                    onChange={(e) => setFormStock(e.target.value)}
                    className="w-full p-2.5 bg-stone-50 rounded-xl border border-stone-200 outline-none font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Giá gốc (VNĐ) *</label>
                  <input
                    type="number"
                    min="1000"
                    step="1000"
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    className="w-full p-2.5 bg-stone-50 rounded-xl border border-stone-200 outline-none font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Khuyến mãi (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="90"
                    value={formDiscount}
                    onChange={(e) => setFormDiscount(e.target.value)}
                    className="w-full p-2.5 bg-stone-50 rounded-xl border border-stone-200 outline-none font-medium"
                  />
                </div>
              </div>

              {/* Calculated price preview */}
              <div className="p-2.5 bg-orange-50 rounded-xl border border-orange-200 flex justify-between items-center text-xs">
                <span className="font-bold text-orange-900">
                  Giá bán hiển thị cho khách:
                </span>
                <span className="font-black text-orange-600 text-sm">
                  {Math.round(formPrice * (1 - formDiscount / 100)).toLocaleString('vi-VN')}đ
                </span>
              </div>

              {/* Spice levels checkboxes */}
              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Cấp độ cay hỗ trợ:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {SPICE_LEVELS.map((sp) => (
                    <button
                      type="button"
                      key={sp.id}
                      onClick={() => toggleSpiceInForm(sp.label)}
                      className={`p-2 rounded-xl border text-left flex items-center justify-between transition ${
                        formSpices.includes(sp.label)
                          ? 'bg-orange-500 text-white border-orange-600 font-bold'
                          : 'bg-stone-50 text-stone-700 border-stone-200'
                      }`}
                    >
                      <span>
                        {sp.icon} {sp.label}
                      </span>
                      {formSpices.includes(sp.label) && <Check className="w-3.5 h-3.5" />}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Đường dẫn ảnh món</label>
                <input
                  type="url"
                  value={formImage}
                  onChange={(e) => setFormImage(e.target.value)}
                  placeholder="https://..."
                  className="w-full p-2.5 bg-stone-50 rounded-xl border border-stone-200 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Mô tả chi tiết</label>
                <textarea
                  rows={2}
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 rounded-xl border border-stone-200 outline-none resize-none"
                ></textarea>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                {/* Is New flag */}
                <label className="flex items-center gap-2 cursor-pointer font-bold text-stone-700 bg-stone-50 p-2.5 rounded-xl border border-stone-200">
                  <input
                    type="checkbox"
                    checked={formIsNew}
                    onChange={(e) => setFormIsNew(e.target.checked)}
                    className="w-4 h-4 accent-emerald-600 cursor-pointer"
                  />
                  <span className="flex items-center gap-1 text-emerald-700 text-xs font-black">
                    <Sparkles className="w-3.5 h-3.5 fill-emerald-600 text-emerald-600" /> Món Mới giới thiệu
                  </span>
                </label>

                {/* Flash sale flag */}
                <label className="flex items-center gap-2 cursor-pointer font-bold text-stone-700 bg-stone-50 p-2.5 rounded-xl border border-stone-200">
                  <input
                    type="checkbox"
                    checked={formIsFlashSale}
                    onChange={(e) => setFormIsFlashSale(e.target.checked)}
                    className="w-4 h-4 accent-orange-600 cursor-pointer"
                  />
                  <span className="flex items-center gap-1 text-red-600 text-xs font-black">
                    <Flame className="w-3.5 h-3.5 fill-red-600" /> Bật Flash Sale
                  </span>
                </label>
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 border border-stone-200 text-stone-600 font-bold rounded-xl"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl shadow-md transition"
                >
                  {editingProduct ? 'Lưu Thay Đổi' : 'Thêm Vào Menu'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
