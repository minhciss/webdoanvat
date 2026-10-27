import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MessageSquare, Star, EyeOff, Send, CheckCircle2, Sparkles } from 'lucide-react';

export default function AdminReviews() {
  const { reviews, hideReview, replyReview, products, showToast } = useApp();

  const [replies, setReplies] = useState({});
  const [editingReplyId, setEditingReplyId] = useState(null);

  const handleSendReply = (reviewId) => {
    const text = replies[reviewId];
    if (!text || !text.trim()) {
      showToast('Vui lòng nhập nội dung phản hồi của bạn!', 'error');
      return;
    }

    if (typeof replyReview === 'function') {
      replyReview(reviewId, text.trim());
    }
    setReplies((prev) => ({ ...prev, [reviewId]: '' }));
    setEditingReplyId(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-black text-stone-900 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-orange-500" />
            <span>Quản Lý Đánh Giá & Phản Hồi Thực Khách ({reviews.length})</span>
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Chăm sóc khách hàng, giải đáp thắc mắc khẩu vị và trả lời trực tiếp bình luận của thực khách
          </p>
        </div>
        <span className="text-xs text-emerald-700 bg-emerald-50 px-3 py-1 rounded-xl font-bold border border-emerald-200 self-start sm:self-auto">
          ✓ {reviews.filter((r) => r.reply).length} đã phản hồi
        </span>
      </div>

      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-stone-200 text-center text-stone-400">
            Chưa có đánh giá nào từ khách hàng.
          </div>
        ) : (
          reviews.map((r) => {
            const product = products.find((p) => p.id === r.productId);

            return (
              <div
                key={r.id}
                className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs space-y-3.5 text-xs transition hover:border-orange-200"
              >
                {/* Header: User & Rating */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-500 text-white font-bold text-sm flex items-center justify-center shadow-xs">
                      {r.userName?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <span className="font-bold text-stone-900 text-xs">{r.userName}</span>
                      <span className="text-[10px] text-stone-400 block">{r.date}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-0.5 text-amber-400">
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

                {/* Product link & custom option */}
                {(product || r.productName) && (
                  <div className="text-[11px] text-orange-700 bg-orange-50 border border-orange-100 px-3 py-1 rounded-xl inline-block font-semibold">
                    Món: <strong>{product?.name || r.productName}</strong>
                    {r.spiceLevel && (
                      <span className="text-stone-500 font-normal"> • Tùy chọn: {r.spiceLevel}</span>
                    )}
                  </div>
                )}

                {/* Comment text */}
                <p className="text-stone-800 text-xs leading-relaxed bg-stone-50 p-3.5 rounded-2xl border border-stone-100 font-medium">
                  "{r.comment}"
                </p>

                {/* Shop's existing reply */}
                {r.reply && editingReplyId !== r.id && (
                  <div className="bg-gradient-to-r from-orange-50/90 to-amber-50/80 border border-orange-200/90 p-4 rounded-2xl space-y-1.5 animate-in fade-in">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-black text-orange-950 flex items-center gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5 text-orange-600 fill-orange-200" />
                        <span>Phản hồi từ ĂnVặtPro Quán</span>
                        <span className="bg-orange-200 text-orange-800 text-[9px] font-black px-1.5 py-0.5 rounded-md">
                          CHỦ QUÁN
                        </span>
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-stone-400">{r.replyDate || 'Vừa xong'}</span>
                        <button
                          type="button"
                          onClick={() => {
                            setReplies((prev) => ({ ...prev, [r.id]: r.reply }));
                            setEditingReplyId(r.id);
                          }}
                          className="text-[11px] text-orange-600 hover:text-orange-800 font-bold underline cursor-pointer"
                        >
                          Chỉnh sửa
                        </button>
                      </div>
                    </div>
                    <p className="text-stone-800 text-xs leading-relaxed font-medium">
                      "{r.reply}"
                    </p>
                  </div>
                )}

                {/* Reply form (show if no reply yet, or when in editing mode) */}
                {(!r.reply || editingReplyId === r.id) && (
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="text"
                      value={replies[r.id] !== undefined ? replies[r.id] : (editingReplyId === r.id ? r.reply : '')}
                      onChange={(e) =>
                        setReplies((prev) => ({ ...prev, [r.id]: e.target.value }))
                      }
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSendReply(r.id);
                      }}
                      placeholder="Gửi phản hồi của Quán đến thực khách..."
                      className="flex-1 px-3.5 py-2.5 bg-stone-50 focus:bg-white rounded-xl border border-stone-200 focus:border-orange-500 text-xs outline-none transition"
                    />
                    <button
                      type="button"
                      onClick={() => handleSendReply(r.id)}
                      className="px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{editingReplyId === r.id ? 'Cập nhật' : 'Trả lời'}</span>
                    </button>
                    {editingReplyId === r.id && (
                      <button
                        type="button"
                        onClick={() => setEditingReplyId(null)}
                        className="px-2.5 py-2 text-stone-400 hover:text-stone-600 text-xs font-semibold cursor-pointer"
                      >
                        Hủy
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
