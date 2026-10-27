import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  ArrowLeft,
  Star,
  Flame,
  ShoppingBag,
  Plus,
  Minus,
  ShieldCheck,
  Check,
  Send,
  Zap,

  Truck,
  Heart,
  Share2,
  Sparkles,
  Award,
  ChevronRight,
  Info,
  CheckCircle2,
  Coffee,
  IceCream,
  Droplets,
  Cake,
} from 'lucide-react';
import {
  SPICE_LEVELS,
  ICE_LEVELS,
  SWEET_LEVELS,
  DESSERT_ICE_OPTIONS,
  DESSERT_SWEET_OPTIONS,
  FLAN_SAUCE_OPTIONS,
} from '../data/mockData';
import ProductCard from './ProductCard';

export default function ProductDetailView() {
  const {
    selectedProduct,

    products,
    addToCart,
    reviews,
    addReview,
    setCustomerTab,

    showToast,
  } = useApp();

  // If no product selected, fallback to the first product
  const product = selectedProduct || products[0];

  const [spiceLevel, setSpiceLevel] = useState(
    product?.defaultSpice || product?.spiceLevels?.[0] || 'Cay vừa'
  );
  // Drink customizations (tra-sua-nuoc)
  const [selectedIce, setSelectedIce] = useState('50% Đá');
  const [selectedSweet, setSelectedSweet] = useState('70% Ngọt');

  // Chè ngọt customizations (chè có đá: Chè Khúc Bạch, Chè Dừa Dầm)
  const [selectedDessertIce, setSelectedDessertIce] = useState('Ăn kèm đá chung');
  const [selectedDessertSweet, setSelectedDessertSweet] = useState('Ngọt vừa phải');

  // Bánh Flan / Bánh ngọt tráng miệng (TUYỆT ĐỐI KHÔNG CÓ ĐÁ)
  const [selectedBakerySauce, setSelectedBakerySauce] = useState('Cốt dừa & Cà phê phin');

  // Helper to determine exact chosen option
  const isDrink = product?.categoryId === 'tra-sua-nuoc';
  const isCheSoup =
    product?.categoryId === 'che-trang-mieng' &&
    (product?.name?.toLowerCase().includes('chè') || product?.name?.toLowerCase().includes('dầm')) &&
    !product?.name?.toLowerCase().includes('bánh');
  const isFlanOrCake =
    product?.id === 'CH-03' ||
    product?.name?.toLowerCase().includes('flan') ||
    (product?.categoryId === 'che-trang-mieng' && product?.name?.toLowerCase().includes('bánh'));
  const isNonSpicySnack =
    !isDrink &&
    !isCheSoup &&
    !isFlanOrCake &&
    (!product?.spiceLevels ||
      product.spiceLevels.length <= 1 ||
      (product.spiceLevels.length === 1 && product.spiceLevels[0] === 'Không cay'));

  const getCustomOptionString = () => {
    if (isDrink) return `${selectedIce}, ${selectedSweet}`;
    if (isCheSoup) return `${selectedDessertIce}, ${selectedDessertSweet}`;
    if (isFlanOrCake) return `${selectedBakerySauce}, ${selectedDessertSweet}`;
    if (isNonSpicySnack) return 'Tiêu chuẩn (Không cay)';
    return spiceLevel;
  };
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('details'); // 'details' | 'reviews'
  const [isLiked, setIsLiked] = useState(false);

  // New review form state
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [reviewerName, setReviewerName] = useState('');

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  if (!product) {
    return (
      <div className="py-20 text-center space-y-4">
        <p className="text-stone-500 font-medium">Không tìm thấy thông tin sản phẩm.</p>
        <button
          onClick={() => setCustomerTab('menu')}
          className="px-6 py-2.5 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 transition"
        >
          Quay lại thực đơn
        </button>
      </div>
    );
  }

  const productReviews = reviews.filter((r) => r.productId === product.id);

  // Related products from same category
  const relatedProducts = products
    .filter((p) => p.id !== product.id && p.categoryId === product.categoryId)
    .slice(0, 4);

  // If not enough related from same category, pick popular ones
  const extraRecommendations = relatedProducts.length < 4
    ? products.filter((p) => p.id !== product.id && !relatedProducts.some((r) => r.id === p.id)).slice(0, 4 - relatedProducts.length)
    : [];

  const displayedRelated = [...relatedProducts, ...extraRecommendations];

  const handleAddToCart = () => {
    addToCart(product, getCustomOptionString(), quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, getCustomOptionString(), quantity);
    setCustomerTab('checkout');
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    showToast('Đã sao chép liên kết món ăn vào bộ nhớ tạm!', 'info');
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!newComment.trim()) {
      showToast('Vui lòng nhập nội dung đánh giá của bạn!', 'error');
      return;
    }

    addReview({
      productId: product.id,
      userName: reviewerName.trim() || 'Thực khách sành ăn',
      rating: newRating,
      comment: newComment.trim(),
      spiceLevel: getCustomOptionString(),
    });

    setNewComment('');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12">
      {/* 1. Breadcrumbs & Back Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-stone-200">
        <button
          onClick={() => setCustomerTab('menu')}
          className="inline-flex items-center gap-2 text-stone-600 hover:text-orange-600 font-bold text-sm transition group"
        >
          <div className="w-8 h-8 rounded-full bg-white group-hover:bg-orange-100 border border-stone-200 group-hover:border-orange-300 flex items-center justify-center transition">
            <ArrowLeft className="w-4 h-4 text-stone-600 group-hover:text-orange-600" />
          </div>
          <span>Quay lại thực đơn món ăn</span>
        </button>

        <div className="flex items-center gap-1.5 text-xs text-stone-500 overflow-x-auto">
          <button
            onClick={() => setCustomerTab('home')}
            className="hover:text-orange-600 transition"
          >
            Trang chủ
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-stone-400 shrink-0" />
          <button
            onClick={() => setCustomerTab('menu')}
            className="hover:text-orange-600 transition"
          >
            Thực đơn
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-stone-400 shrink-0" />
          <span className="font-semibold text-orange-600 truncate max-w-[200px]">
            {product.categoryName}
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-stone-400 shrink-0" />
          <span className="text-stone-800 font-bold truncate max-w-[220px]">
            {product.name}
          </span>
        </div>
      </div>

      {/* 2. Main Product Details (Two Columns) */}
      <div className="bg-white rounded-3xl border border-stone-100 shadow-sm p-6 sm:p-8 lg:p-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Column: Product Image & Guarantees */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="relative aspect-square w-full rounded-3xl overflow-hidden bg-stone-100 border border-stone-200 shadow-inner group">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-1.5 items-start">
                {product.discountPercent > 0 && (
                  <span className="bg-red-500 text-white font-black text-xs px-3 py-1 rounded-xl shadow-md">
                    GIẢM {product.discountPercent}%
                  </span>
                )}
                {product.isFlashSale && (
                  <span className="bg-amber-500 text-white font-extrabold text-xs px-3 py-1 rounded-xl shadow-md flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 fill-white" /> FLASH SALE
                  </span>
                )}
                {product.isBestSeller && !product.isFlashSale && (
                  <span className="bg-orange-500 text-white font-extrabold text-xs px-3 py-1 rounded-xl shadow-md flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> BÁN CHẠY NHẤT
                  </span>
                )}
              </div>

              {/* Out of Stock Overlay */}
              {product.stock <= 0 && (
                <div className="absolute inset-0 bg-stone-900/75 backdrop-blur-xs flex items-center justify-center text-white font-black text-lg tracking-wider">
                  TẠM HẾT HÀNG
                </div>
              )}
            </div>

            {/* Quality & Delivery Guarantees */}
            <div className="bg-stone-50/80 rounded-2xl p-5 border border-stone-200/70 space-y-3.5">
              <h4 className="text-xs font-black uppercase text-stone-700 tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Cam kết chất lượng ĂnVặtPro:</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-stone-600">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                  <span>Chế biến nóng hổi ngay sau khi chốt đơn.</span>
                </div>
                <div className="flex items-start gap-2">
                  <Truck className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                  <span>Giao nhanh 30 - 45 phút tận nơi.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                  <span>Bao bì hộp giấy sạch sẽ giữ nhiệt.</span>
                </div>
                <div className="flex items-start gap-2">
                  <Award className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                  <span>Hoàn tiền nếu món ăn không đúng vị.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Information, Pricing, Spice & Order Actions */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            <div className="space-y-5">
              {/* Category, SKU, and Action Buttons (Like, Share) */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-orange-600">
                  <span className="bg-orange-100 text-orange-700 px-2.5 py-1 rounded-lg">
                    {product.categoryName}
                  </span>
                  <span className="text-stone-300">•</span>
                  <span className="text-stone-400 font-mono">MÃ: {product.id}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setIsLiked(!isLiked);
                      showToast(isLiked ? 'Đã bỏ yêu thích món ăn' : 'Đã thêm món ăn vào yêu thích!');
                    }}
                    className={`w-9 h-9 rounded-xl border flex items-center justify-center transition ${
                      isLiked
                        ? 'bg-red-50 border-red-200 text-red-500'
                        : 'border-stone-200 text-stone-500 hover:bg-stone-50'
                    }`}
                    title="Yêu thích món này"
                  >
                    <Heart className={`w-4 h-4 ${isLiked ? 'fill-red-500' : ''}`} />
                  </button>
                  <button
                    onClick={handleShare}
                    className="w-9 h-9 rounded-xl border border-stone-200 text-stone-500 hover:bg-stone-50 flex items-center justify-center transition"
                    title="Chia sẻ món ăn"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl font-black text-stone-900 leading-tight">
                {product.name}
              </h1>

              {/* Rating & Sold count */}
              <div className="flex flex-wrap items-center gap-3 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('reviews');
                    document.getElementById('detail-tabs-section')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="flex items-center gap-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 px-3 py-1 rounded-xl font-bold border border-amber-200 transition cursor-pointer"
                  title="Bấm để xem và viết đánh giá sao"
                >
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="text-sm">{product.rating}</span>
                  <span className="text-stone-400 font-normal">/ 5.0</span>
                  <span className="text-stone-400 font-normal">({productReviews.length + (product.reviewCount || 0)} đánh giá)</span>
                </button>
                <span className="text-stone-300">|</span>
                <span className="text-stone-600 font-semibold">
                  Đã bán <strong className="text-stone-800">{product.soldCount.toLocaleString('vi-VN')}</strong> phần
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('reviews');
                    document.getElementById('detail-tabs-section')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="text-xs font-bold text-orange-600 hover:text-orange-700 underline flex items-center gap-1 ml-auto"
                >
                  <Star className="w-3.5 h-3.5 fill-orange-500 text-orange-500" />
                  <span>Viết đánh giá sao</span>
                </button>
              </div>

              {/* Price Banner */}
              <div className="p-4 sm:p-5 bg-gradient-to-r from-orange-50/80 via-amber-50/40 to-transparent rounded-2xl border border-orange-200/80 flex flex-wrap items-baseline justify-between gap-3">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-black text-orange-600 tracking-tight">
                    {product.price.toLocaleString('vi-VN')}đ
                  </span>
                  {product.originalPrice > product.price && (
                    <span className="text-base text-stone-400 line-through">
                      {product.originalPrice.toLocaleString('vi-VN')}đ
                    </span>
                  )}
                  {product.discountPercent > 0 && (
                    <span className="text-xs bg-red-100 text-red-600 font-bold px-2 py-0.5 rounded-md">
                      Tiết kiệm {(product.originalPrice - product.price).toLocaleString('vi-VN')}đ
                    </span>
                  )}
                </div>

                <div>
                  {product.stock > 0 ? (
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                      ✓ Còn {product.stock} phần trong ngày
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-red-600 bg-red-50 border border-red-200 px-3 py-1 rounded-full">
                      Hết hàng
                    </span>
                  )}
                </div>
              </div>

              {/* Description preview */}
              <p className="text-sm text-stone-600 leading-relaxed">
                {product.description}
              </p>

              {/* DYNAMIC CUSTOMIZATION: Drinks (Ice & Sugar) | Desserts (Ice & Sweet) | Non-spicy Snacks | Spicy Snacks */}
              {isDrink ? (
                /* 1. MÓN NƯỚC: MỨC ĐÁ & ĐỘ NGỌT */
                <div className="space-y-4 pt-2 bg-amber-50/40 p-4 rounded-2xl border border-amber-200/60">
                  <div className="flex items-center justify-between pb-2 border-b border-amber-200/50">
                    <label className="text-xs font-black text-stone-800 flex items-center gap-1.5 uppercase tracking-wide">
                      <Coffee className="w-4 h-4 text-amber-600" />
                      <span>Tùy chọn lượng đá & độ ngọt cho món nước:</span>
                    </label>
                    <span className="text-xs text-orange-700 font-extrabold bg-orange-100/90 border border-orange-200 px-2.5 py-0.5 rounded-lg">
                      {selectedIce} • {selectedSweet}
                    </span>
                  </div>

                  {/* Lượng đá */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold text-stone-700 flex items-center gap-1">
                      <span>🧊 Lượng đá:</span>
                    </span>
                    <div className="grid grid-cols-3 gap-2">
                      {ICE_LEVELS.map((ice) => {
                        const isChosen = selectedIce === ice.label;
                        return (
                          <button
                            key={ice.id}
                            type="button"
                            onClick={() => setSelectedIce(ice.label)}
                            className={`p-2.5 rounded-2xl text-left border transition relative flex flex-col justify-between ${
                              isChosen
                                ? 'bg-orange-500 text-white border-orange-600 shadow-md shadow-orange-500/20 scale-[1.02]'
                                : 'bg-white hover:bg-orange-50/70 border-stone-200 text-stone-800'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-base">{ice.icon}</span>
                              {isChosen && <Check className="w-3.5 h-3.5 text-white" />}
                            </div>
                            <div>
                              <div className="text-xs font-black">{ice.label}</div>
                              <div className={`text-[10px] mt-0.5 leading-tight ${isChosen ? 'text-orange-100' : 'text-stone-400'}`}>
                                {ice.desc}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Độ ngọt */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold text-stone-700 flex items-center gap-1">
                      <span>🍯 Độ ngọt (Lượng đường):</span>
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {SWEET_LEVELS.map((sweet) => {
                        const isChosen = selectedSweet === sweet.label;
                        return (
                          <button
                            key={sweet.id}
                            type="button"
                            onClick={() => setSelectedSweet(sweet.label)}
                            className={`p-2.5 rounded-2xl text-left border transition relative flex flex-col justify-between ${
                              isChosen
                                ? 'bg-orange-500 text-white border-orange-600 shadow-md shadow-orange-500/20 scale-[1.02]'
                                : 'bg-white hover:bg-orange-50/70 border-stone-200 text-stone-800'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-base">{sweet.icon}</span>
                              {isChosen && <Check className="w-3.5 h-3.5 text-white" />}
                            </div>
                            <div>
                              <div className="text-xs font-black">{sweet.label}</div>
                              <div className={`text-[10px] mt-0.5 leading-tight ${isChosen ? 'text-orange-100' : 'text-stone-400'}`}>
                                {sweet.desc}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : isCheSoup ? (
                /* 2. CHÈ & MÓN NƯỚC NGỌT: CÁCH DÙNG ĐÁ & ĐỘ NGỌT */
                <div className="space-y-4 pt-2 bg-pink-50/40 p-4 rounded-2xl border border-pink-200/60">
                  <div className="flex items-center justify-between pb-2 border-b border-pink-200/50">
                    <label className="text-xs font-black text-stone-800 flex items-center gap-1.5 uppercase tracking-wide">
                      <IceCream className="w-4 h-4 text-pink-600" />
                      <span>Tùy chọn dùng đá & độ ngọt món chè:</span>
                    </label>
                    <span className="text-xs text-pink-700 font-extrabold bg-pink-100 border border-pink-200 px-2.5 py-0.5 rounded-lg">
                      {selectedDessertIce} • {selectedDessertSweet}
                    </span>
                  </div>

                  {/* Cách dùng đá */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold text-stone-700">🍧 Cách dùng đá:</span>
                    <div className="grid grid-cols-3 gap-2">
                      {DESSERT_ICE_OPTIONS.map((opt) => {
                        const isChosen = selectedDessertIce === opt.label;
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => setSelectedDessertIce(opt.label)}
                            className={`p-2.5 rounded-2xl text-left border transition relative flex flex-col justify-between ${
                              isChosen
                                ? 'bg-orange-500 text-white border-orange-600 shadow-md shadow-orange-500/20 scale-[1.02]'
                                : 'bg-white hover:bg-orange-50/70 border-stone-200 text-stone-800'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-base">{opt.icon}</span>
                              {isChosen && <Check className="w-3.5 h-3.5 text-white" />}
                            </div>
                            <div>
                              <div className="text-xs font-black">{opt.label}</div>
                              <div className={`text-[10px] mt-0.5 leading-tight ${isChosen ? 'text-orange-100' : 'text-stone-400'}`}>
                                {opt.desc}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Độ ngọt */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold text-stone-700">🍃 Độ ngọt món chè:</span>
                    <div className="grid grid-cols-2 gap-2">
                      {DESSERT_SWEET_OPTIONS.map((opt) => {
                        const isChosen = selectedDessertSweet === opt.label;
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => setSelectedDessertSweet(opt.label)}
                            className={`p-2.5 rounded-2xl text-left border transition relative flex flex-col justify-between ${
                              isChosen
                                ? 'bg-orange-500 text-white border-orange-600 shadow-md shadow-orange-500/20 scale-[1.02]'
                                : 'bg-white hover:bg-orange-50/70 border-stone-200 text-stone-800'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-base">{opt.icon}</span>
                              {isChosen && <Check className="w-3.5 h-3.5 text-white" />}
                            </div>
                            <div>
                              <div className="text-xs font-black">{opt.label}</div>
                              <div className={`text-[10px] mt-0.5 leading-tight ${isChosen ? 'text-orange-100' : 'text-stone-400'}`}>
                                {opt.desc}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : isFlanOrCake ? (
                /* 3. BÁNH FLAN / MÓN BÁNH TRÁNG MIỆNG (TUYỆT ĐỐI KHÔNG CÓ ĐÁ) */
                <div className="space-y-4 pt-2 bg-amber-50/50 p-4 rounded-2xl border border-amber-200/70">
                  <div className="flex items-center justify-between pb-2 border-b border-amber-200/60">
                    <label className="text-xs font-black text-stone-800 flex items-center gap-1.5 uppercase tracking-wide">
                      <Cake className="w-4 h-4 text-amber-600" />
                      <span>Tùy chọn sốt & độ ngọt Bánh Flan:</span>
                    </label>
                    <span className="text-xs text-amber-800 font-extrabold bg-amber-100 border border-amber-300 px-2.5 py-0.5 rounded-lg">
                      {selectedBakerySauce} • {selectedDessertSweet}
                    </span>
                  </div>

                  {/* Sốt ăn kèm bánh flan */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold text-stone-700">🍮 Sốt & cốt ăn kèm:</span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {FLAN_SAUCE_OPTIONS.map((opt) => {
                        const isChosen = selectedBakerySauce === opt.label;
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => setSelectedBakerySauce(opt.label)}
                            className={`p-2.5 rounded-2xl text-left border transition relative flex flex-col justify-between ${
                              isChosen
                                ? 'bg-orange-500 text-white border-orange-600 shadow-md shadow-orange-500/20 scale-[1.02]'
                                : 'bg-white hover:bg-orange-50/70 border-stone-200 text-stone-800'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-base">{opt.icon}</span>
                              {isChosen && <Check className="w-3.5 h-3.5 text-white" />}
                            </div>
                            <div>
                              <div className="text-xs font-black">{opt.label}</div>
                              <div className={`text-[10px] mt-0.5 leading-tight ${isChosen ? 'text-orange-100' : 'text-stone-400'}`}>
                                {opt.desc}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Độ ngọt bánh */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold text-stone-700">🍃 Độ ngọt bánh:</span>
                    <div className="grid grid-cols-2 gap-2">
                      {DESSERT_SWEET_OPTIONS.map((opt) => {
                        const isChosen = selectedDessertSweet === opt.label;
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => setSelectedDessertSweet(opt.label)}
                            className={`p-2.5 rounded-2xl text-left border transition relative flex flex-col justify-between ${
                              isChosen
                                ? 'bg-orange-500 text-white border-orange-600 shadow-md shadow-orange-500/20 scale-[1.02]'
                                : 'bg-white hover:bg-orange-50/70 border-stone-200 text-stone-800'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-base">{opt.icon}</span>
                              {isChosen && <Check className="w-3.5 h-3.5 text-white" />}
                            </div>
                            <div>
                              <div className="text-xs font-black">{opt.label}</div>
                              <div className={`text-[10px] mt-0.5 leading-tight ${isChosen ? 'text-orange-100' : 'text-stone-400'}`}>
                                {opt.desc}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : isNonSpicySnack ? (
                /* 3. MÓN ĂN VẶT HOÀN TOÀN KHÔNG CAY */
                <div className="pt-2">
                  <div className="p-4 bg-amber-50/80 rounded-2xl border border-amber-200/80 flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 text-xl shadow-xs">
                      🧀
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-amber-900 uppercase">Món ăn không cay</span>
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-full">
                          Thích hợp mọi lứa tuổi
                        </span>
                      </div>
                      <p className="text-xs text-amber-800/85 leading-relaxed">
                        Món ăn được chế biến béo giòn thơm ngon chuẩn vị ĂnVặtPro, hoàn toàn không cay, rất phù hợp cho cả trẻ nhỏ, gia đình và thực khách không ăn cay.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                /* 4. MÓN ĂN VẶT CÓ CẤP ĐỘ CAY */
                <div className="space-y-2.5 pt-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-black text-stone-800 flex items-center gap-1.5 uppercase tracking-wide">
                      <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
                      <span>Chọn cấp độ cay theo khẩu vị của bạn:</span>
                    </label>
                    <span className="text-xs text-orange-600 font-bold bg-orange-50 border border-orange-200 px-2 py-0.5 rounded-md">
                      Đang chọn: {spiceLevel}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {SPICE_LEVELS.map((spice) => {
                      const isAvailable = product.spiceLevels?.includes(spice.label);
                      const isChosen = spiceLevel === spice.label;

                      return (
                        <button
                          key={spice.id}
                          type="button"
                          disabled={!isAvailable}
                          onClick={() => setSpiceLevel(spice.label)}
                          className={`p-3 rounded-2xl text-left border transition relative flex flex-col justify-between ${
                            !isAvailable
                              ? 'opacity-40 bg-stone-100 border-stone-200 cursor-not-allowed'
                              : isChosen
                              ? 'bg-orange-500 text-white border-orange-600 shadow-md shadow-orange-500/20 scale-[1.02]'
                              : 'bg-white hover:bg-orange-50/70 border-stone-200 text-stone-800'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xl">{spice.icon}</span>
                            {isChosen && (
                              <Check className="w-4 h-4 text-white" />
                            )}
                          </div>
                          <div>
                            <div className="text-xs font-black">{spice.label}</div>
                            <div
                              className={`text-[10px] mt-0.5 leading-tight ${
                                isChosen ? 'text-orange-100' : 'text-stone-400'
                              }`}
                            >
                              {spice.desc}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Quantity Selector */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs font-black text-stone-800 uppercase tracking-wide">
                  Số lượng phần ăn:
                </span>
                <div className="flex items-center gap-3 bg-stone-100 p-1.5 rounded-2xl border border-stone-200">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-8 h-8 bg-white hover:bg-orange-100 text-stone-700 rounded-xl flex items-center justify-center transition shadow-xs active:scale-95"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-10 text-center font-black text-base text-stone-900">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setQuantity((q) => Math.min(product.stock || 99, q + 1))
                    }
                    className="w-8 h-8 bg-white hover:bg-orange-100 text-stone-700 rounded-xl flex items-center justify-center transition shadow-xs active:scale-95"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Total Subtotal & Action Buttons */}
            <div className="pt-6 border-t border-stone-100 space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-stone-500 font-semibold">Tạm tính tiền món:</span>
                <span className="text-xl font-black text-stone-900">
                  {(product.price * quantity).toLocaleString('vi-VN')}đ
                </span>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0}
                  className="w-full sm:flex-1 py-3.5 px-6 bg-orange-100 hover:bg-orange-200 text-orange-700 font-black text-sm rounded-2xl transition flex items-center justify-center gap-2.5 active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed border border-orange-200"
                >
                  <ShoppingBag className="w-5 h-5 text-orange-600" />
                  <span>Thêm vào giỏ hàng</span>
                </button>

                <button
                  type="button"
                  onClick={handleBuyNow}
                  disabled={product.stock <= 0}
                  className="w-full sm:flex-1 py-3.5 px-6 bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-sm rounded-2xl shadow-lg shadow-orange-500/25 transition flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Zap className="w-5 h-5 fill-white" />
                  <span>Mua Ngay</span>
                </button>
              </div>

              {/* Promo reminder tag */}
              <div className="text-[11px] text-stone-500 text-center flex items-center justify-center gap-2 bg-stone-50 py-2 rounded-xl border border-stone-100">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>
                  Áp dụng mã <strong className="text-orange-600 font-bold">ANVAT50</strong> giảm 50K cho đơn từ 200K khi thanh toán
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Detail Tabs Section (Mô tả chi tiết / Đánh giá khách hàng) */}
      <div id="detail-tabs-section" className="bg-white rounded-3xl border border-stone-100 shadow-sm p-6 sm:p-8">
        {/* Tab Headers */}
        <div className="flex items-center gap-6 border-b border-stone-200 pb-4 text-sm font-black">
          <button
            onClick={() => setActiveTab('details')}
            className={`pb-2 transition relative ${
              activeTab === 'details'
                ? 'text-orange-600 font-black'
                : 'text-stone-400 hover:text-stone-700'
            }`}
          >
            <span>Mô Tả & Thành Phần Món Ăn</span>
            {activeTab === 'details' && (
              <span className="absolute bottom-0 left-0 right-0 h-1 bg-orange-600 rounded-full -mb-4" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-2 transition flex items-center gap-2 relative ${
              activeTab === 'reviews'
                ? 'text-orange-600 font-black'
                : 'text-stone-400 hover:text-stone-700'
            }`}
          >
            <span>Đánh Giá Thực Khách</span>
            <span className="bg-orange-100 text-orange-700 text-xs px-2 py-0.5 rounded-full font-bold">
              {productReviews.length}
            </span>
            {activeTab === 'reviews' && (
              <span className="absolute bottom-0 left-0 right-0 h-1 bg-orange-600 rounded-full -mb-4" />
            )}
          </button>
        </div>

        {/* Tab 1: Details */}
        {activeTab === 'details' && (
          <div className="pt-6 space-y-6 text-stone-700">
            <div>
              <h3 className="text-base font-black text-stone-900 mb-2">
                Giới thiệu về món ăn
              </h3>
              <p className="text-sm leading-relaxed text-stone-600">
                {product.description}
              </p>
            </div>

            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/60 space-y-2">
              <h4 className="text-xs font-black uppercase text-stone-800 tracking-wider">
                Nguyên liệu & Topping tuyển chọn:
              </h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                {product.ingredients}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-200/60 space-y-1.5">
                <h4 className="text-xs font-black text-amber-900 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>Cách thưởng thức ngon chuẩn bài:</span>
                </h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Nên thưởng thức ngay khi vừa giao tới lúc món ăn còn giữ độ nóng hoặc giòn tốt nhất. Trộn đều sốt hoặc chấm ngập để cảm nhận trọn vẹn vị béo cay bùng nổ.
                </p>
              </div>

              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/60 space-y-1.5">
                <h4 className="text-xs font-black text-stone-800 flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-stone-600" />
                  <span>Bảo quản:</span>
                </h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Bảo quản nơi khô ráo, thoáng mát. Dùng ngon nhất trong vòng 4 - 6 tiếng kể từ khi nhận đơn.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Reviews */}
        {activeTab === 'reviews' && (
          <div className="pt-6 space-y-8">
            {/* Reviews Summary */}
            <div className="p-5 bg-stone-50 rounded-2xl border border-stone-200/70 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-4xl font-black text-stone-900">{product.rating}</div>
                  <div className="flex items-center justify-center gap-1 text-amber-400 mt-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <div className="text-[11px] text-stone-400 mt-1">
                    {productReviews.length + (product.reviewCount || 0)} lượt đánh giá
                  </div>
                </div>
              </div>

              <div className="text-xs text-stone-500 text-center sm:text-right">
                <p className="font-semibold text-stone-700">100% đánh giá từ thực khách thật đã đặt hàng</p>
                <p className="text-[11px] text-stone-400 mt-0.5">ĂnVặtPro luôn lắng nghe phản hồi để hoàn thiện món ăn mỗi ngày</p>
              </div>
            </div>

            {/* Existing Reviews List */}
            <div className="space-y-3">
              {productReviews.length === 0 ? (
                <div className="text-center py-8 text-stone-400 text-sm">
                  Chưa có đánh giá nào cho món này. Hãy là người đầu tiên thưởng thức và chia sẻ cảm nhận nhé!
                </div>
              ) : (
                productReviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-4 bg-white rounded-2xl border border-stone-200/70 space-y-2 hover:border-orange-200 transition"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-400 to-orange-500 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                          {rev.userName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <span className="text-xs font-bold text-stone-800 block">
                            {rev.userName}
                          </span>
                          <span className="text-[10px] text-stone-400">{rev.date}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <div className="flex items-center gap-0.5 text-amber-400">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3.5 h-3.5 ${
                                i < rev.rating
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'text-stone-200'
                              }`}
                            />
                          ))}
                        </div>
                        {rev.spiceLevel && (
                          <span className="text-[10px] bg-orange-100 text-orange-700 font-bold px-2 py-0.5 rounded-md ml-1">
                            {rev.spiceLevel}
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-stone-600 pl-10 leading-relaxed">
                      {rev.comment}
                    </p>

                    {/* Shop reply */}
                    {rev.reply && (
                      <div className="ml-10 p-3 bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl border border-orange-200/80 space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-black text-orange-950 flex items-center gap-1.5">
                            <Sparkles className="w-3 h-3 text-orange-500 fill-orange-400" />
                            <span>Phản hồi từ ĂnVặtPro Quán</span>
                            <span className="bg-orange-200 text-orange-800 text-[9px] font-black px-1.5 py-0.5 rounded-md">
                              CHỦ QUÁN
                            </span>
                          </span>
                          <span className="text-[10px] text-stone-400">{rev.replyDate}</span>
                        </div>
                        <p className="text-xs text-stone-700 font-medium italic">
                          "{rev.reply}"
                        </p>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Review Form: Đánh giá sao & Mô tả cảm nhận */}
            <form
              onSubmit={handleSubmitReview}
              className="p-6 bg-gradient-to-br from-amber-50/70 via-orange-50/40 to-white rounded-3xl border-2 border-orange-200 space-y-4 shadow-xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-orange-200/60">
                <h4 className="text-xs font-black text-orange-950 uppercase tracking-wide flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span>Gửi Đánh Giá Sao & Mô Tả Cảm Nhận Về Món Ăn:</span>
                </h4>
                <span className="bg-amber-100 text-amber-800 font-black text-[11px] px-2.5 py-0.5 rounded-lg self-start sm:self-center shadow-xs">
                  🎁 Thưởng +20 Xu tích lũy
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">
                    Họ và tên của bạn:
                  </label>
                  <input
                    type="text"
                    placeholder="Họ tên của bạn..."
                    value={reviewerName}
                    onChange={(e) => setReviewerName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white rounded-xl border border-stone-200 text-xs outline-none focus:border-orange-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">
                    Chấm điểm số sao ({newRating}/5 sao):
                  </label>
                  <div className="flex items-center justify-between bg-white px-3 py-2 rounded-xl border border-stone-200 shadow-xs">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setNewRating(star)}
                          className="p-1 hover:scale-125 transition"
                          title={`${star} sao`}
                        >
                          <Star
                            className={`w-5 h-5 cursor-pointer transition ${
                              star <= newRating
                                ? 'fill-amber-400 text-amber-400 drop-shadow-xs'
                                : 'text-stone-200'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                    <span className="text-[11px] font-extrabold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200">
                      {newRating === 5
                        ? '⭐⭐⭐⭐⭐ Xuất sắc'
                        : newRating === 4
                        ? '⭐⭐⭐⭐ Rất ngon'
                        : newRating === 3
                        ? '⭐⭐⭐ Tạm ổn'
                        : newRating === 2
                        ? '⭐⭐ Chưa ngon'
                        : '⭐ Không thích'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Ô TextArea Mô tả cảm nhận */}
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-stone-700">
                  Mô tả cảm nhận & đánh giá của bạn:
                </label>
                <textarea
                  rows={3}
                  placeholder="Hãy chia sẻ về độ nóng giòn, hương vị, độ cay, nước sốt hoặc trải nghiệm của bạn khi thưởng thức món ăn này..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="w-full p-3.5 bg-white rounded-2xl border border-stone-200 text-xs text-stone-800 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 resize-none font-medium leading-relaxed"
                ></textarea>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl text-xs font-black transition flex items-center gap-2 shadow-md shadow-orange-500/20 active:scale-95"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Gửi Đánh Giá Ngay (+20 Xu)</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* 4. Related Products Section */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-orange-500 text-white flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-lg font-black text-stone-900 tracking-tight">
                Món Ngon Ăn Kèm Hợp Vị
              </h3>
              <p className="text-xs text-stone-500">
                Gợi ý thực khách thường đặt cùng {product.name}
              </p>
            </div>
          </div>

          <button
            onClick={() => setCustomerTab('menu')}
            className="text-xs font-bold text-orange-600 hover:underline flex items-center gap-1"
          >
            Xem tất cả
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {displayedRelated.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </div>
  );
}
