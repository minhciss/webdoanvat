import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORIES, SPICE_LEVELS } from '../data/mockData';
import ProductCard from './ProductCard';
import {
  SlidersHorizontal,
  Flame,
  Star,
  Search,
  RotateCcw,
  Sparkles,
  ArrowUpDown,
  Filter,
} from 'lucide-react';

export default function MenuView({ searchKeyword, setSearchKeyword, selectedCategory, setSelectedCategory }) {
  const { products } = useApp();

  // Additional filter states
  const [priceRange, setPriceRange] = useState('all'); // 'all' | 'under30' | '30to50' | '50to100' | 'above100'
  const [selectedSpice, setSelectedSpice] = useState('all');
  const [sortBy, setSortBy] = useState('popular'); // 'popular' | 'priceAsc' | 'priceDesc' | 'rating'
  const [onlySale, setOnlySale] = useState(false);

  // Filtered & Sorted products computation
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // 1. Keyword search (name or ingredients or description)
      if (searchKeyword.trim()) {
        const q = searchKeyword.toLowerCase();
        const matches =
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          (p.ingredients && p.ingredients.toLowerCase().includes(q));
        if (!matches) return false;
      }

      // 2. Category
      if (selectedCategory !== 'all' && p.categoryId !== selectedCategory) {
        return false;
      }

      // 3. Price range
      if (priceRange === 'under30' && p.price >= 30000) return false;
      if (priceRange === '30to50' && (p.price < 30000 || p.price > 50000)) return false;
      if (priceRange === '50to100' && (p.price < 50000 || p.price > 100000)) return false;
      if (priceRange === 'above100' && p.price < 100000) return false;

      // 4. Spice level
      if (selectedSpice !== 'all') {
        const hasSpice = p.spiceLevels.some((s) => s.includes(selectedSpice));
        if (!hasSpice) return false;
      }

      // 5. Only flash sale
      if (onlySale && !p.isFlashSale && p.discountPercent <= 0) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'popular') return (b.soldCount || 0) - (a.soldCount || 0);
      if (sortBy === 'priceAsc') return a.price - b.price;
      if (sortBy === 'priceDesc') return b.price - a.price;
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      return 0;
    });
  }, [products, searchKeyword, selectedCategory, priceRange, selectedSpice, sortBy, onlySale]);

  const resetFilters = () => {
    setSearchKeyword('');
    setSelectedCategory('all');
    setPriceRange('all');
    setSelectedSpice('all');
    setOnlySale(false);
    setSortBy('popular');
  };

  const hasActiveFilters =
    searchKeyword ||
    selectedCategory !== 'all' ||
    priceRange !== 'all' ||
    selectedSpice !== 'all' ||
    onlySale;

  return (
    <div className="space-y-6">
      {/* Top Bar: Search, Title & Active Filter Tags */}
      <div className="bg-white p-5 rounded-3xl border border-stone-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-stone-900 flex items-center gap-2">
            <span>Thực Đơn ĂnVặtPro</span>
            <span className="text-xs bg-orange-100 text-orange-700 font-extrabold px-2.5 py-0.5 rounded-full">
              {filteredProducts.length} món ăn
            </span>
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Món làm tươi ngon khi có order, tự do tùy biến gia vị & cấp độ cay
          </p>
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-xs text-stone-500 font-semibold whitespace-nowrap flex items-center gap-1">
            <ArrowUpDown className="w-3.5 h-3.5" /> Sắp xếp:
          </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="flex-1 md:flex-none px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold text-stone-700 outline-none focus:border-orange-500"
          >
            <option value="popular">Bán chạy nhất 🔥</option>
            <option value="priceAsc">Giá: Thấp đến cao</option>
            <option value="priceDesc">Giá: Cao đến thấp</option>
            <option value="rating">Đánh giá cao nhất (★)</option>
          </select>

          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-xl text-xs font-bold transition flex items-center gap-1"
              title="Đặt lại bộ lọc"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Đặt lại</span>
            </button>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-6 items-start">
        {/* Left Filter Sidebar (3 cols) */}
        <div className="lg:col-span-3 bg-white p-5 rounded-3xl border border-stone-100 shadow-sm space-y-5 sticky top-24">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <span className="text-xs font-black text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
              <Filter className="w-4 h-4 text-orange-500" />
              <span>Bộ Lọc Thực Đơn</span>
            </span>
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="text-[11px] text-orange-600 font-bold hover:underline"
              >
                Xóa lọc
              </button>
            )}
          </div>

          {/* 1. Category Filter */}
          <div>
            <label className="block text-xs font-bold text-stone-800 mb-2">
              Danh mục món:
            </label>
            <div className="space-y-1">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center justify-between transition ${
                    selectedCategory === cat.id
                      ? 'bg-orange-500 text-white font-bold shadow-xs'
                      : 'text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  <span>{cat.name}</span>
                  <span
                    className={`text-[10px] ${
                      selectedCategory === cat.id ? 'text-white/80' : 'text-stone-400'
                    }`}
                  >
                    {cat.id === 'all'
                      ? products.length
                      : products.filter((p) => p.categoryId === cat.id).length}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Price Range Filter */}
          <div className="border-t border-stone-100 pt-4">
            <label className="block text-xs font-bold text-stone-800 mb-2">
              Khoảng giá (VNĐ):
            </label>
            <div className="space-y-1.5 text-xs text-stone-600">
              {[
                { id: 'all', label: 'Tất cả mức giá' },
                { id: 'under30', label: 'Dưới 30.000đ' },
                { id: '30to50', label: '30.000đ - 50.000đ' },
                { id: '50to100', label: '50.000đ - 100.000đ' },
                { id: 'above100', label: 'Trên 100.000đ (Combo)' },
              ].map((range) => (
                <label
                  key={range.id}
                  className="flex items-center gap-2 cursor-pointer hover:text-stone-900"
                >
                  <input
                    type="radio"
                    name="priceRange"
                    checked={priceRange === range.id}
                    onChange={() => setPriceRange(range.id)}
                    className="accent-orange-600"
                  />
                  <span>{range.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 3. Spiciness Filter */}
          <div className="border-t border-stone-100 pt-4">
            <label className="block text-xs font-bold text-stone-800 mb-2 flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
              <span>Cấp độ cay:</span>
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { id: 'all', label: 'Tất cả' },
                { id: 'Không cay', label: 'Không cay' },
                { id: 'Cay nhẹ', label: 'Cay nhẹ' },
                { id: 'Cay vừa', label: 'Cay vừa' },
                { id: 'Cay tê tái', label: 'Cay tê tái 🔥' },
              ].map((sp) => (
                <button
                  key={sp.id}
                  onClick={() => setSelectedSpice(sp.id)}
                  className={`p-1.5 rounded-lg text-xs font-medium border text-center transition ${
                    selectedSpice === sp.id
                      ? 'bg-orange-50 border-orange-500 text-orange-700 font-bold'
                      : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  {sp.label}
                </button>
              ))}
            </div>
          </div>

          {/* 4. Special flags filter */}
          <div className="border-t border-stone-100 pt-4">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-stone-700">
              <input
                type="checkbox"
                checked={onlySale}
                onChange={(e) => setOnlySale(e.target.checked)}
                className="w-4 h-4 accent-orange-600 rounded"
              />
              <span className="flex items-center gap-1 text-red-600">
                <Sparkles className="w-3.5 h-3.5" /> Chỉ hiện món Flash Sale / Giảm giá
              </span>
            </label>
          </div>
        </div>

        {/* Right Product Grid (9 cols) */}
        <div className="lg:col-span-9 space-y-4">
          {filteredProducts.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-stone-100 text-center space-y-3">
              <Search className="w-12 h-12 text-stone-300 mx-auto" />
              <h3 className="text-base font-bold text-stone-800">
                Không tìm thấy món ăn nào phù hợp với bộ lọc!
              </h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Hãy thử nới lỏng các tiêu chí tìm kiếm hoặc bấm nút đặt lại bộ lọc để xem toàn bộ thực đơn.
              </p>
              <button
                onClick={resetFilters}
                className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow-md transition"
              >
                Xem tất cả món
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
