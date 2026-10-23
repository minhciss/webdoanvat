import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Flame,
  Clock,
  Sparkles,
  Ticket,
  ChevronRight,
  ShieldCheck,
  Zap,
  Truck,
  HeartHandshake,
} from 'lucide-react';

export default function HeroBanner() {
  const { setCustomerTab, applyVoucher } = useApp();

  // Flash Sale Countdown Timer
  const [timeLeft, setTimeLeft] = useState({
    hours: 3,
    minutes: 42,
    seconds: 18,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 4, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-4">
      {/* Main Banner Hero */}
      <div className="relative rounded-3xl overflow-hidden shadow-xl bg-gradient-to-r from-orange-600 via-amber-600 to-amber-500 text-white min-h-[380px] flex items-center">
        {/* Background Decorative patterns */}
        <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="absolute -right-20 -bottom-20 w-96 h-96 rounded-full bg-white/10 blur-3xl pointer-events-none"></div>

        <div className="relative z-10 p-6 sm:p-10 max-w-7xl mx-auto w-full grid md:grid-cols-12 gap-8 items-center">
          {/* Left Content */}
          <div className="md:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 bg-black/25 backdrop-blur-sm border border-white/20 px-3.5 py-1.5 rounded-full text-xs font-bold text-amber-200">
              <Flame className="w-4 h-4 text-orange-400 animate-pulse fill-orange-400" />
              <span>SIÊU ĐẠI TIỆC ĂN VẶT SÀI THÀNH</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Bánh Tráng Sốt Bơ & <br />
              <span className="text-yellow-300 underline decoration-wavy decoration-orange-400">
                Chân Gà Cay Tê
              </span>{' '}
              Đậm Vị
            </h1>

            <p className="text-orange-100 text-sm sm:text-base max-w-xl font-medium">
              Chế biến nóng hổi ngay khi nhận đơn. Tự do tùy chọn cấp độ cay: Không cay, Cay vừa
              cho đến Cay tê tái chuẩn gu gen Z!
            </p>

            {/* Countdown Box */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <div className="flex items-center gap-1.5 bg-black/30 backdrop-blur-sm px-3.5 py-2 rounded-2xl border border-white/15">
                <Clock className="w-4 h-4 text-yellow-300" />
                <span className="text-xs font-semibold text-orange-100">Flash Sale kết thúc sau:</span>
                <div className="flex items-center gap-1 font-mono font-black text-sm text-yellow-300">
                  <span className="bg-stone-900/80 px-2 py-0.5 rounded">
                    {String(timeLeft.hours).padStart(2, '0')}
                  </span>
                  :
                  <span className="bg-stone-900/80 px-2 py-0.5 rounded">
                    {String(timeLeft.minutes).padStart(2, '0')}
                  </span>
                  :
                  <span className="bg-stone-900/80 px-2 py-0.5 rounded">
                    {String(timeLeft.seconds).padStart(2, '0')}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setCustomerTab('menu')}
                className="bg-white hover:bg-yellow-300 text-orange-700 hover:text-orange-900 px-6 py-2.5 rounded-2xl font-black text-sm shadow-lg transition flex items-center gap-1.5 hover:scale-105"
              >
                <span>Xem Menu & Đặt Ngay</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Vouchers Bar */}
            <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
              <span className="text-orange-200 font-semibold flex items-center gap-1">
                <Ticket className="w-3.5 h-3.5" /> Mã Hot:
              </span>
              <button
                onClick={() => applyVoucher('ANVAT50')}
                className="bg-white/20 hover:bg-white/30 px-2.5 py-1 rounded-lg border border-white/30 font-bold transition flex items-center gap-1"
                title="Click để áp dụng ngay"
              >
                <span>ANVAT50</span>
                <span className="text-[10px] text-yellow-200">(Giảm 50K)</span>
              </button>
              <button
                onClick={() => applyVoucher('FREESHIP')}
                className="bg-white/20 hover:bg-white/30 px-2.5 py-1 rounded-lg border border-white/30 font-bold transition flex items-center gap-1"
                title="Click để áp dụng ngay"
              >
                <span>FREESHIP</span>
                <span className="text-[10px] text-yellow-200">(Freeship 20K)</span>
              </button>
              <button
                onClick={() => applyVoucher('CHAOBANMOI')}
                className="bg-white/20 hover:bg-white/30 px-2.5 py-1 rounded-lg border border-white/30 font-bold transition flex items-center gap-1"
                title="Click để áp dụng ngay"
              >
                <span>CHAOBANMOI</span>
                <span className="text-[10px] text-yellow-200">(Tặng 25K)</span>
              </button>
            </div>
          </div>

          {/* Right Showcase Photo & Badge */}
          <div className="md:col-span-5 relative flex justify-center">
            <div className="relative group">
              <div className="w-64 h-64 sm:w-80 sm:h-80 rounded-3xl overflow-hidden shadow-2xl border-4 border-white/30 rotate-2 group-hover:rotate-0 transition duration-300">
                <img
                  src="https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?w=800&auto=format&fit=crop&q=80"
                  alt="Bánh tráng sốt bơ"
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                />
              </div>

              {/* Floating Floating Promo Card */}
              <div className="absolute -bottom-4 -left-6 bg-white text-stone-800 p-3.5 rounded-2xl shadow-2xl border border-orange-100 flex items-center gap-3 animate-pulse">
                <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center font-black text-sm">
                  -50%
                </div>
                <div>
                  <p className="text-xs font-extrabold text-stone-900">Combo Cày Phim Cuối Tuần</p>
                  <p className="text-[11px] text-orange-600 font-bold">Chỉ từ 135.000đ / 3 người</p>
                </div>
              </div>

              {/* Floating Rating Card */}
              <div className="absolute -top-3 -right-3 bg-stone-900 text-white px-3 py-1.5 rounded-xl shadow-xl flex items-center gap-1.5 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                <span>4.9 ★ (Hơn 10.000+ Đơn)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Service Badges */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-2xl border border-stone-100 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-stone-800">Giao Siêu Tốc 30 Phút</h4>
            <p className="text-[11px] text-stone-500">Đóng gói giữ nhiệt nóng giòn</p>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-stone-100 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-stone-800">Tùy Chọn Cấp Độ Cay</h4>
            <p className="text-[11px] text-stone-500">Từ không cay đến cay tê tái</p>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-stone-100 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-stone-800">100% An Toàn Thực Phẩm</h4>
            <p className="text-[11px] text-stone-500">Nguồn gốc nguyên liệu rõ ràng</p>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-stone-100 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-stone-800">Thanh Toán Quét QR</h4>
            <p className="text-[11px] text-stone-500">VietQR, MoMo tự động duyệt</p>
          </div>
        </div>
      </div>
    </div>
  );
}
