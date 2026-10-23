import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Star,
  Flame,
  ShoppingBag,
  Plus,
  Minus,
  ShieldCheck,
  Check,
  MessageSquare,
  Send,
  Zap,
} from 'lucide-react';
import { SPICE_LEVELS } from '../data/mockData';

export default function ProductDetailModal() {
  const {
    selectedProduct,
    setSelectedProduct,
    addToCart,
    reviews,
    addReview,
    setCustomerTab,
    setIsCartDrawerOpen,
  } = useApp();

  if (!selectedProduct) return null;

  const [spiceLevel, setSpiceLevel] = useState(
    selectedProduct.defaultSpice || selectedProduct.spiceLevels[0] || 'Cay vừa'
  );
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('details'); // 'details' | 'reviews'

  // New review state
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [reviewerName, setReviewerName] = useState('');

  const productReviews = reviews.filter(
    (r) => r.productId === selectedProduct.id
  );

  const handleAddToCart = () => {
    addToCart(selectedProduct, spiceLevel, quantity);
    setSelectedProduct(null);
  };

  const handleBuyNow = () => {
    addToCart(selectedProduct, spiceLevel, quantity);
    setSelectedProduct(null);
    setCustomerTab('checkout');
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    addReview({
      productId: selectedProduct.id,
      userName: reviewerName.trim() || 'Thực khách giấu tên',
      rating: newRating,
      comment: newComment.trim(),
      spiceLevel,
    });

    setNewComment('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl shadow-2xl border border-stone-100 max-w-4xl w-full max-h-[92vh] overflow-y-auto relative flex flex-col md:flex-row"
      >
        {/* Close Button */}
        <button
          onClick={() => setSelectedProduct(null)}
          className="absolute top-4 right-4 z-10 w-9 h-9 bg-white/80 hover:bg-stone-100 text-stone-600 rounded-full flex items-center justify-center transition shadow-sm"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Image Section */}
        <div className="md:w-1/2 p-6 bg-stone-50 flex flex-col justify-between">
          <div className="relative aspect-square w-full rounded-2xl overflow-hidden shadow-inner bg-white">
            <img
              src={selectedProduct.image}
              alt={selectedProduct.name}
              className="w-full h-full object-cover"
            />
            {selectedProduct.discountPercent > 0 && (
              <span className="absolute top-3 left-3 bg-red-600 text-white font-black text-xs px-2.5 py-1 rounded-xl shadow-md">
                GIẢM {selectedProduct.discountPercent}%
              </span>
            )}
          </div>

          <div className="mt-4 p-3.5 bg-amber-50/70 border border-amber-200/60 rounded-2xl text-xs space-y-1.5 text-stone-700">
            <div className="flex items-center gap-1.5 font-bold text-amber-800">
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              <span>Cam kết chất lượng ĂnVặtPro:</span>
            </div>
            <p className="text-[11px] text-stone-600 leading-relaxed">
              • Đồ ăn được làm tươi mới theo từng mẻ đặt hàng.
              <br />• Đóng gói hộp giấy sạch sẽ giữ nhiệt trong suốt quá trình ship.
            </p>
          </div>
        </div>

        {/* Right Info Section */}
        <div className="md:w-1/2 p-6 flex flex-col justify-between">
          <div>
            {/* Header info */}
            <div className="flex items-center gap-2 text-xs font-semibold text-orange-600 mb-1">
              <span>{selectedProduct.categoryName}</span>
              <span>•</span>
              <span className="text-stone-400">Mã: {selectedProduct.id}</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-stone-900 leading-snug">
              {selectedProduct.name}
            </h2>

            {/* Rating & Sold count */}
            <div className="flex items-center gap-3 my-2 text-xs">
              <div className="flex items-center gap-1 bg-amber-50 text-amber-800 px-2.5 py-1 rounded-lg font-bold border border-amber-200">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{selectedProduct.rating} / 5.0</span>
              </div>
              <span className="text-stone-400">|</span>
              <span className="text-stone-600 font-semibold">
                {productReviews.length + (selectedProduct.reviewCount || 0)} Đánh giá
              </span>
              <span className="text-stone-400">|</span>
              <span className="text-stone-600 font-semibold">
                Đã bán {selectedProduct.soldCount}
              </span>
            </div>

            {/* Price Box */}
            <div className="flex items-baseline gap-3 my-3 p-3 bg-orange-50/60 rounded-2xl border border-orange-100">
              <span className="text-2xl font-black text-orange-600">
                {selectedProduct.price.toLocaleString('vi-VN')}đ
              </span>
              {selectedProduct.originalPrice > selectedProduct.price && (
                <span className="text-sm text-stone-400 line-through">
                  {selectedProduct.originalPrice.toLocaleString('vi-VN')}đ
                </span>
              )}
              <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full ml-auto">
                {selectedProduct.stock > 0 ? `Còn ${selectedProduct.stock} phần` : 'Hết hàng'}
              </span>
            </div>

            {/* Tab Switcher: Thông tin món / Đánh giá khách hàng */}
            <div className="flex items-center border-b border-stone-200 mb-4 text-xs font-bold">
              <button
                onClick={() => setActiveTab('details')}
                className={`pb-2 mr-6 transition ${
                  activeTab === 'details'
                    ? 'text-orange-600 border-b-2 border-orange-600'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                Chi Tiết & Khẩu Vị
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`pb-2 transition flex items-center gap-1 ${
                  activeTab === 'reviews'
                    ? 'text-orange-600 border-b-2 border-orange-600'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                <span>Đánh Giá Thực Khách</span>
                <span className="bg-stone-100 px-1.5 py-0.2 rounded-full text-[10px]">
                  {productReviews.length}
                </span>
              </button>
            </div>

            {activeTab === 'details' ? (
              <div className="space-y-4">
                <p className="text-xs text-stone-600 leading-relaxed">
                  {selectedProduct.description}
                </p>

                {/* Ingredients */}
                <div className="p-3 bg-stone-50 rounded-xl text-xs space-y-1">
                  <span className="font-bold text-stone-700">Nguyên liệu & Topping:</span>
                  <p className="text-stone-500 text-[11px] leading-relaxed">
                    {selectedProduct.ingredients}
                  </p>
                </div>

                {/* Spice Level Selector */}
                <div>
                  <label className="block text-xs font-black text-stone-800 mb-2 flex items-center gap-1.5">
                    <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
                    <span>Chọn cấp độ cay theo khẩu vị của bạn:</span>
                  </label>

                  <div className="grid grid-cols-2 gap-2">
                    {SPICE_LEVELS.map((spice) => {
                      const isAvailable = selectedProduct.spiceLevels.includes(spice.label);
                      const isChosen = spiceLevel === spice.label;

                      return (
                        <button
                          key={spice.id}
                          disabled={!isAvailable}
                          onClick={() => setSpiceLevel(spice.label)}
                          className={`p-2 rounded-xl text-left border transition flex items-start gap-2 relative ${
                            !isAvailable
                              ? 'opacity-40 bg-stone-100 border-stone-200 cursor-not-allowed'
                              : isChosen
                              ? 'bg-orange-500 text-white border-orange-600 shadow-sm'
                              : 'bg-white hover:bg-orange-50 border-stone-200 text-stone-800'
                          }`}
                        >
                          <span className="text-base">{spice.icon}</span>
                          <div>
                            <div className="text-xs font-bold leading-tight">
                              {spice.label}
                            </div>
                            <div
                              className={`text-[10px] leading-tight ${
                                isChosen ? 'text-orange-100' : 'text-stone-400'
                              }`}
                            >
                              {spice.desc}
                            </div>
                          </div>
                          {isChosen && (
                            <Check className="w-3.5 h-3.5 text-white absolute top-2 right-2" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Quantity adjuster */}
                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs font-black text-stone-800">Số lượng cần mua:</span>
                  <div className="flex items-center gap-2 bg-stone-100 p-1 rounded-2xl border border-stone-200">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="w-7 h-7 bg-white hover:bg-orange-100 text-stone-700 rounded-xl flex items-center justify-center transition shadow-xs"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center font-bold text-sm text-stone-900">
                      {quantity}
                    </span>
                    <button
                      onClick={() =>
                        setQuantity((q) =>
                          Math.min(selectedProduct.stock || 99, q + 1)
                        )
                      }
                      className="w-7 h-7 bg-white hover:bg-orange-100 text-stone-700 rounded-xl flex items-center justify-center transition shadow-xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* Reviews Section */
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                {/* List of existing reviews */}
                <div className="space-y-2.5">
                  {productReviews.length === 0 ? (
                    <p className="text-xs text-stone-400 text-center py-4">
                      Chưa có đánh giá nào cho món này. Hãy là người đầu tiên thưởng thức và nhận xét!
                    </p>
                  ) : (
                    productReviews.map((rev) => (
                      <div
                        key={rev.id}
                        className="p-3 bg-stone-50 rounded-2xl border border-stone-100 text-xs space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-stone-800">{rev.userName}</span>
                          <span className="text-[10px] text-stone-400">{rev.date}</span>
                        </div>
                        <div className="flex items-center gap-1 text-amber-500">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${
                                i < rev.rating
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'text-stone-300'
                              }`}
                            />
                          ))}
                          <span className="text-[10px] bg-orange-100 text-orange-700 font-bold px-1.5 py-0.2 rounded ml-1">
                            {rev.spiceLevel}
                          </span>
                        </div>
                        <p className="text-stone-600 text-[11px]">{rev.comment}</p>
                      </div>
                    ))
                  )}
                </div>

                {/* Write a review form */}
                <form
                  onSubmit={handleSubmitReview}
                  className="p-3 bg-orange-50/50 rounded-2xl border border-orange-200 space-y-2 mt-4"
                >
                  <span className="text-xs font-bold text-orange-800 block">
                    Gửi nhận xét của bạn:
                  </span>

                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      placeholder="Họ tên của bạn..."
                      value={reviewerName}
                      onChange={(e) => setReviewerName(e.target.value)}
                      className="flex-1 px-3 py-1.5 bg-white rounded-xl border border-stone-200 text-xs outline-none focus:border-orange-500"
                    />

                    {/* Star selector */}
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setNewRating(star)}
                        >
                          <Star
                            className={`w-4 h-4 cursor-pointer transition ${
                              star <= newRating
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-stone-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Cảm nhận về vị cay, độ giòn, nước sốt..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="flex-1 px-3 py-1.5 bg-white rounded-xl border border-stone-200 text-xs outline-none focus:border-orange-500"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold transition flex items-center gap-1"
                    >
                      <Send className="w-3 h-3" />
                      <span>Gửi</span>
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* Bottom Action Buttons */}
          <div className="pt-4 border-t border-stone-100 flex items-center gap-3 mt-4">
            <button
              onClick={handleAddToCart}
              disabled={selectedProduct.stock <= 0}
              className="flex-1 py-3 px-4 bg-orange-100 hover:bg-orange-200 text-orange-700 font-black text-xs rounded-2xl transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Thêm vào giỏ ({(selectedProduct.price * quantity).toLocaleString('vi-VN')}đ)</span>
            </button>

            <button
              onClick={handleBuyNow}
              disabled={selectedProduct.stock <= 0}
              className="flex-1 py-3 px-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-xs rounded-2xl shadow-lg shadow-orange-500/25 transition flex items-center justify-center gap-2 hover:scale-[1.02] disabled:opacity-50"
            >
              <Zap className="w-4 h-4 fill-white" />
              <span>Mua Ngay</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
