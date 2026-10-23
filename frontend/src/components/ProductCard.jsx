import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Star,
  Plus,
  Flame,
  Eye,
  ShoppingBag,
  Sparkles,
  AlertTriangle,
} from 'lucide-react';

export default function ProductCard({ product }) {
  const { addToCart, setSelectedProduct } = useApp();

  const isLowStock = product.stock > 0 && product.stock <= 5;
  const isOutOfStock = product.stock <= 0;

  return (
    <div className="bg-white rounded-3xl border border-stone-100 shadow-sm hover:shadow-xl hover:border-orange-200 transition-all duration-300 flex flex-col overflow-hidden group">
      {/* Image Container */}
      <div className="relative aspect-square w-full overflow-hidden bg-stone-100">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-108 transition duration-500"
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start">
          {product.discountPercent > 0 && (
            <span className="bg-red-500 text-white font-black text-[11px] px-2 py-0.5 rounded-lg shadow-sm">
              -{product.discountPercent}%
            </span>
          )}
          {product.isFlashSale && (
            <span className="bg-amber-500 text-white font-extrabold text-[10px] px-2 py-0.5 rounded-lg shadow-sm flex items-center gap-0.5">
              <Flame className="w-3 h-3 fill-white" /> FLASH SALE
            </span>
          )}
          {product.isBestSeller && !product.isFlashSale && (
            <span className="bg-orange-500 text-white font-extrabold text-[10px] px-2 py-0.5 rounded-lg shadow-sm flex items-center gap-0.5">
              <Sparkles className="w-3 h-3" /> BÁN CHẠY
            </span>
          )}
        </div>

        {/* Spice Level Indicator Tag */}
        {product.defaultSpice && (
          <div className="absolute top-2.5 right-2.5 bg-black/60 backdrop-blur-sm text-white px-2 py-0.5 rounded-lg text-[10px] font-bold flex items-center gap-1">
            <span>🌶️</span>
            <span>{product.defaultSpice}</span>
          </div>
        )}

        {/* Quick View Button on Hover */}
        <button
          onClick={() => setSelectedProduct(product)}
          className="absolute inset-0 m-auto w-10 h-10 bg-white/90 hover:bg-white text-stone-900 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition duration-200 hover:scale-110"
          title="Xem chi tiết & chọn vị cay"
        >
          <Eye className="w-5 h-5 text-orange-600" />
        </button>

        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-stone-900/70 backdrop-blur-xs flex items-center justify-center text-white font-black text-sm">
            TẠM HẾT HÀNG
          </div>
        )}
      </div>

      {/* Body Information */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-[11px] text-stone-400 mb-1">
            <span className="font-semibold text-orange-600">{product.categoryName}</span>
            <div className="flex items-center gap-1 text-stone-500">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span className="font-bold text-stone-700">{product.rating}</span>
              <span>({product.reviewCount})</span>
            </div>
          </div>

          <h3
            onClick={() => setSelectedProduct(product)}
            className="text-sm font-extrabold text-stone-800 line-clamp-2 hover:text-orange-600 transition cursor-pointer leading-snug mb-1"
          >
            {product.name}
          </h3>

          <p className="text-[11px] text-stone-500 line-clamp-1 mb-2">
            {product.description}
          </p>

          {/* Stock Warning Badge */}
          {isLowStock && (
            <div className="mb-2 inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
              <AlertTriangle className="w-3 h-3 text-amber-600" />
              <span>Chỉ còn {product.stock} phần trong kho!</span>
            </div>
          )}
        </div>

        {/* Bottom Price & Add to Cart Action */}
        <div className="pt-2 border-t border-stone-100 flex items-center justify-between mt-auto">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-black text-orange-600">
                {product.price.toLocaleString('vi-VN')}đ
              </span>
              {product.originalPrice > product.price && (
                <span className="text-xs text-stone-400 line-through">
                  {product.originalPrice.toLocaleString('vi-VN')}đ
                </span>
              )}
            </div>
            <span className="text-[10px] text-stone-400 font-medium">
              Đã bán {product.soldCount.toLocaleString('vi-VN')}
            </span>
          </div>

          <button
            onClick={() => {
              if (isOutOfStock) return;
              if (product.spiceLevels?.length > 1) {
                // If has multiple spice levels, open modal to let user pick spice level!
                setSelectedProduct(product);
              } else {
                addToCart(product, product.defaultSpice || 'Cay vừa', 1);
              }
            }}
            disabled={isOutOfStock}
            className={`w-9 h-9 rounded-2xl flex items-center justify-center transition shadow-sm ${
              isOutOfStock
                ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                : 'bg-orange-500 hover:bg-orange-600 text-white hover:scale-105 active:scale-95 shadow-orange-500/20'
            }`}
            title="Thêm vào giỏ hàng"
          >
            <Plus className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </div>
  );
}
