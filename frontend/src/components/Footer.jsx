import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Flame,
  PhoneCall,
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  Heart,
  LayoutDashboard,
} from 'lucide-react';

export default function Footer() {
  const { setCustomerTab, setViewMode } = useApp();

  return (
    <footer className="bg-stone-900 text-stone-300 text-xs border-t border-stone-800 mt-16">
      {/* Top Banner with Guarantee */}
      <div className="border-b border-stone-800 py-6 px-4 bg-stone-950/40">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-black text-white">Cam kết 100% Nguyên Liệu Sạch & Vệ Sinh ATTP</p>
              <p className="text-stone-400 text-[11px]">Được kiểm định chất lượng, đổi trả miễn phí nếu không đạt độ giòn nóng!</p>
            </div>
          </div>

          <button
            onClick={() => setViewMode('admin')}
            className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-orange-400 rounded-xl font-bold transition flex items-center gap-2 border border-stone-700"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Mở Cổng Quản Trị Hệ Thống (Admin Portal)</span>
          </button>
        </div>
      </div>

      {/* Main Footer content */}
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Col 1: Brand Info */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-orange-500 flex items-center justify-center text-white shadow-md">
              <Flame className="w-5 h-5 fill-amber-200" />
            </div>
            <span className="text-xl font-black text-white tracking-tight">
              ĂnVặt<span className="text-amber-400">Pro</span>
            </span>
          </div>

          <p className="text-stone-400 text-[11px] leading-relaxed">
            Hệ thống website thương mại điện tử chuyên cung cấp đồ ăn vặt Sài Gòn sạch sẽ, chất lượng: Bánh tráng cuốn sốt bơ, chân gà rút xương sốt Thái, cá viên chiên mắm tóp mỡ, trà sữa và các combo cày phim siêu tiết kiệm.
          </p>

          <div className="flex items-center gap-2 text-stone-400 text-[11px]">
            <Clock className="w-4 h-4 text-orange-400 shrink-0" />
            <span>Mở cửa: 08:00 - 23:00 (Thứ 2 - Chủ Nhật)</span>
          </div>
        </div>

        {/* Col 2: Hệ Thống Cửa Hàng & Hotline */}
        <div className="space-y-3">
          <h4 className="text-sm font-black text-white uppercase tracking-wider">
            Liên Hệ & Chi Nhánh
          </h4>

          <div className="space-y-2 text-stone-400 text-[11px]">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
              <span><strong>Cơ sở 1:</strong> 72 Lê Thánh Tôn, P. Bến Nghé, Quận 1, TP.HCM</span>
            </div>

            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
              <span><strong>Cơ sở 2:</strong> 123 Sư Vạn Hạnh, Phường 12, Quận 10, TP.HCM</span>
            </div>

            <div className="flex items-center gap-2 pt-1 text-white font-bold">
              <PhoneCall className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Hotline giao hàng: 0988.123.456</span>
            </div>

            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-stone-400 shrink-0" />
              <span>Email: cskh@anvatpro.vn</span>
            </div>
          </div>
        </div>

        {/* Col 3: Danh Mục & Quick Links */}
        <div className="space-y-3">
          <h4 className="text-sm font-black text-white uppercase tracking-wider">
            Thực Đơn Nổi Bật
          </h4>

          <ul className="space-y-1.5 text-[11px] text-stone-400">
            <li>
              <button
                onClick={() => setCustomerTab('menu')}
                className="hover:text-orange-400 transition"
              >
                • Bánh Tráng Cuốn Sốt Bơ Trứng Muối
              </button>
            </li>
            <li>
              <button
                onClick={() => setCustomerTab('menu')}
                className="hover:text-orange-400 transition"
              >
                • Chân Gà Rút Xương Sốt Thái Cay Tê
              </button>
            </li>
            <li>
              <button
                onClick={() => setCustomerTab('menu')}
                className="hover:text-orange-400 transition"
              >
                • Cá Viên Chiên Mắm Tỏi Tóp Mỡ
              </button>
            </li>
            <li>
              <button
                onClick={() => setCustomerTab('menu')}
                className="hover:text-orange-400 transition"
              >
                • Nem Chua Rán Phố Cổ Hà Nội
              </button>
            </li>
            <li>
              <button
                onClick={() => setCustomerTab('menu')}
                className="hover:text-orange-400 transition"
              >
                • Trà Mãng Cầu Đậm Vị Nhiệt Đới
              </button>
            </li>
            <li>
              <button
                onClick={() => setCustomerTab('menu')}
                className="hover:text-orange-400 transition"
              >
                • Combo Cày Phim Cuối Tuần
              </button>
            </li>
          </ul>
        </div>

        {/* Col 4: Đối tác & Pháp lý */}
        <div className="space-y-3">
          <h4 className="text-sm font-black text-white uppercase tracking-wider">
            Phương Thức Thanh Toán
          </h4>

          <div className="grid grid-cols-2 gap-2 text-center text-[10px] font-bold">
            <div className="p-2 bg-stone-800 rounded-xl border border-stone-700 text-blue-400">
              VietQR 24/7
            </div>
            <div className="p-2 bg-stone-800 rounded-xl border border-stone-700 text-pink-400">
              Ví MoMo
            </div>
            <div className="p-2 bg-stone-800 rounded-xl border border-stone-700 text-emerald-400">
              Tiền Mặt (COD)
            </div>
            <div className="p-2 bg-stone-800 rounded-xl border border-stone-700 text-amber-400">
              VNPay QR
            </div>
          </div>

          <div className="pt-2 text-[10px] text-stone-500">
            Giấy phép ĐKKD số: 031489211 do Sở KH&ĐT TP.HCM cấp.
            Giấy chứng nhận cơ sở đủ điều kiện ATTP số 889/2026/ATTP-HCM.
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-stone-800 py-4 text-center text-[11px] text-stone-500">
        <p>
          © 2026 ĂnVặtPro. Thiết kế hoàn thiện giao diện đồ án Công nghệ phần mềm (HK1 2026-2027).
        </p>
      </div>
    </footer>
  );
}
