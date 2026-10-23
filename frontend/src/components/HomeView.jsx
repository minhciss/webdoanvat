import React from 'react';
import { useApp } from '../context/AppContext';
import HeroBanner from './HeroBanner';
import CategoryNav from './CategoryNav';
import ProductCard from './ProductCard';
import {
  Flame,
  Sparkles,
  ArrowRight,
  TrendingUp,
  PackageCheck,
  Star,
  Quote,
  ShieldCheck,
} from 'lucide-react';

export default function HomeView({
  selectedCategory,
  setSelectedCategory,
  onViewAllMenu,
}) {
  const { products, reviews } = useApp();

  const flashSaleProducts = products.filter((p) => p.isFlashSale).slice(0, 4);
  const bestSellerProducts = products.filter((p) => p.isBestSeller).slice(0, 4);
  const comboProducts = products.filter((p) => p.categoryId === 'combo').slice(0, 2);
  const regularSnacks = products.filter((p) => p.categoryId === 'banh-trang' || p.categoryId === 'do-chien').slice(0, 4);

  return (
    <div className="space-y-10">
      {/* 1. Hero Promotional Banner */}
      <HeroBanner />

      {/* 2. Category Quick Navigation Strip */}
      <CategoryNav
        selectedCategory={selectedCategory}
        onSelectCategory={(catId) => {
          setSelectedCategory(catId);
          onViewAllMenu();
        }}
      />

      {/* 3. Flash Sale Section */}
      <section className="bg-gradient-to-br from-orange-500/10 via-amber-500/5 to-transparent p-6 rounded-3xl border border-orange-200/60 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-orange-200/50 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-red-500 text-white flex items-center justify-center shadow-md animate-bounce">
              <Flame className="w-6 h-6 fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-stone-900 tracking-tight">
                  Flash Sale Hôm Nay - Giảm Sốc Đến 50%
                </h2>
                <span className="bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                  ĐANG DIỄN RA
                </span>
              </div>
              <p className="text-xs text-stone-500">
                Số lượng có hạn trong ngày, ưu đãi tự động áp dụng tại giỏ hàng
              </p>
            </div>
          </div>

          <button
            onClick={onViewAllMenu}
            className="text-xs font-black text-orange-600 hover:text-orange-700 flex items-center gap-1 transition"
          >
            <span>Xem tất cả ưu đãi</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {flashSaleProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 4. Best Sellers Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-orange-500 text-white flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-stone-900 tracking-tight">
                Món Bán Chạy Nhất (Hot Seller)
              </h2>
              <p className="text-xs text-stone-500">
                Được hơn 10.000+ lượt đặt và đánh giá 5 sao từ thực khách
              </p>
            </div>
          </div>

          <button
            onClick={onViewAllMenu}
            className="text-xs font-bold text-orange-600 hover:underline flex items-center gap-1"
          >
            <span>Xem thêm</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {bestSellerProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 5. Special Combo Banner Section */}
      <section className="bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <span className="bg-orange-500 text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
              DÀNH CHO BẠN BÈ & CÀY PHIM
            </span>
            <h2 className="text-2xl sm:text-3xl font-black mt-2">
              Combo Đêm Muộn Siêu Tiết Kiệm (2 - 3 Người)
            </h2>
            <p className="text-stone-300 text-xs mt-1">
              Tiết kiệm đến 40.000đ khi gọi theo set ăn vặt kèm trà sữa giải ngấy
            </p>
          </div>

          <button
            onClick={onViewAllMenu}
            className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1.5"
          >
            <span>Xem Tất Cả Combo</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {comboProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 flex items-center gap-4 hover:bg-white/15 transition group"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-24 h-24 rounded-2xl object-cover border border-white/20 shrink-0 group-hover:scale-105 transition"
              />
              <div className="flex-1 min-w-0">
                <span className="text-[10px] bg-red-500/80 text-white font-bold px-2 py-0.5 rounded-full">
                  Tiết kiệm {product.discountPercent}%
                </span>
                <h3 className="font-extrabold text-sm text-white truncate mt-1">
                  {product.name}
                </h3>
                <p className="text-[11px] text-stone-300 line-clamp-1 mt-0.5">
                  {product.description}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-base font-black text-amber-300">
                    {product.price.toLocaleString('vi-VN')}đ
                  </span>
                  <button
                    onClick={onViewAllMenu}
                    className="text-[11px] font-bold text-orange-400 hover:text-orange-300 flex items-center gap-0.5"
                  >
                    <span>Chi tiết</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Traditional Snacks Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-stone-900 tracking-tight">
              Bánh Tráng & Đồ Chiên Ăn Vặt
            </h2>
            <p className="text-xs text-stone-500">
              Đậm đà hương vị đường phố Sài Gòn, cay the hấp dẫn
            </p>
          </div>

          <button
            onClick={onViewAllMenu}
            className="text-xs font-bold text-orange-600 hover:underline flex items-center gap-1"
          >
            <span>Xem thực đơn đầy đủ</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {regularSnacks.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 7. Real Customer Reviews Wall */}
      <section className="bg-stone-100/70 p-6 rounded-3xl border border-stone-200/80 space-y-4">
        <div className="text-center max-w-md mx-auto space-y-1">
          <div className="inline-flex items-center gap-1.5 bg-orange-100 text-orange-800 text-[10px] font-bold px-3 py-1 rounded-full uppercase">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span>Thực Khách Nói Gì Về ĂnVặtPro</span>
          </div>
          <h2 className="text-xl font-black text-stone-900">
            Hàng Ngàn Đánh Giá Tích Cực
          </h2>
          <p className="text-xs text-stone-500">
            Trải nghiệm chân thực từ những khách hàng đã mua và thưởng thức đồ ăn của quán
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 pt-2">
          {reviews.slice(0, 3).map((rev) => (
            <div
              key={rev.id}
              className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-[10px] text-stone-400">{rev.date}</span>
                </div>
                <p className="text-stone-700 text-xs italic leading-relaxed">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                <span className="font-bold text-stone-900">{rev.userName}</span>
                <span className="text-[10px] bg-orange-50 text-orange-700 font-bold px-2 py-0.5 rounded-md">
                  Vị cay: {rev.spiceLevel}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
