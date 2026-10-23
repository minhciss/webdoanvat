import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MessageSquare, Star, EyeOff, Send, CheckCircle2 } from 'lucide-react';

export default function AdminReviews() {
  const { reviews, hideReview, products, showToast } = useApp();

  const [replies, setReplies] = useState({});

  const handleSendReply = (reviewId) => {
    const text = replies[reviewId];
    if (!text || !text.trim()) return;

    showToast(`Đã gửi phản hồi từ ĂnVặtPro cho đánh giá #${reviewId}!`);
    setReplies((prev) => ({ ...prev, [reviewId]: '' }));
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs">
        <h2 className="text-base font-black text-stone-900">
          Quản Lý Đánh Giá & Phản Hồi Thực Khách ({reviews.length})
        </h2>
        <p className="text-xs text-stone-500">
          Chăm sóc khách hàng, giải đáp thắc mắc khẩu vị và ẩn các bình luận spam hoặc vi phạm
        </p>
      </div>

      <div className="space-y-4">
        {reviews.map((r) => {
          const product = products.find((p) => p.id === r.productId);

          return (
            <div
              key={r.id}
              className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs space-y-3 text-xs"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 font-bold flex items-center justify-center">
                    {r.userName?.charAt(0)}
                  </div>
                  <div>
                    <span className="font-bold text-stone-900">{r.userName}</span>
                    <span className="text-[10px] text-stone-400 block">{r.date}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-amber-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < r.rating ? 'fill-amber-400 text-amber-400' : 'text-stone-200'
                        }`}
                      />
                    ))}
                  </div>

                  <button
                    onClick={() => hideReview(r.id)}
                    className="p-1.5 hover:bg-red-50 text-stone-400 hover:text-red-600 rounded-lg transition"
                    title="Ẩn đánh giá vi phạm / spam"
                  >
                    <EyeOff className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Product link */}
              {product && (
                <div className="text-[11px] text-orange-700 bg-orange-50 px-2.5 py-1 rounded-xl inline-block font-semibold">
                  Món: {product.name} • Vị cay đã chọn: {r.spiceLevel}
                </div>
              )}

              {/* Comment text */}
              <p className="text-stone-700 text-xs leading-relaxed bg-stone-50 p-3 rounded-2xl border border-stone-100">
                "{r.comment}"
              </p>

              {/* Reply form */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="text"
                  value={replies[r.id] || ''}
                  onChange={(e) =>
                    setReplies((prev) => ({ ...prev, [r.id]: e.target.value }))
                  }
                  placeholder="Gửi phản hồi của Quán đến thực khách..."
                  className="flex-1 px-3 py-2 bg-stone-50 rounded-xl border border-stone-200 text-xs outline-none focus:border-orange-500"
                />
                <button
                  onClick={() => handleSendReply(r.id)}
                  className="px-3 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-1"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Trả lời</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
