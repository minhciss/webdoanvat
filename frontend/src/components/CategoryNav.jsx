import React from 'react';
import { CATEGORIES } from '../data/mockData';
import {
  Sparkles,
  Flame,
  Utensils,
  Soup,
  IceCream,
  Coffee,
  PackageCheck,
} from 'lucide-react';

const ICON_MAP = {
  Sparkles: Sparkles,
  Flame: Flame,
  Utensils: Utensils,
  Soup: Soup,
  IceCream: IceCream,
  Coffee: Coffee,
  PackageCheck: PackageCheck,
};

export default function CategoryNav({ selectedCategory, onSelectCategory }) {
  return (
    <div className="bg-white p-3 sm:p-4 rounded-3xl border border-stone-100 shadow-sm">
      <div className="flex items-center justify-between mb-3 px-1">
        <div>
          <h2 className="text-base font-black text-stone-900 tracking-tight flex items-center gap-2">
            <span>Danh Mục Thực Đơn</span>
            <span className="text-xs bg-orange-100 text-orange-700 font-bold px-2 py-0.5 rounded-full">
              Đa Dạng Món
            </span>
          </h2>
        </div>
        <p className="text-xs text-stone-500 hidden sm:block">
          Bấm để lọc nhanh các món khoái khẩu
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
        {CATEGORIES.map((cat) => {
          const IconComp = ICON_MAP[cat.icon] || Sparkles;
          const isSelected = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex flex-col items-center justify-center p-3 rounded-2xl transition group text-center relative ${
                isSelected
                  ? 'bg-gradient-to-b from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/20 scale-[1.02]'
                  : 'bg-stone-50 hover:bg-orange-50 text-stone-700 hover:text-orange-600'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center mb-1.5 transition ${
                  isSelected
                    ? 'bg-white/20 text-white'
                    : 'bg-white text-orange-500 group-hover:scale-110 shadow-xs'
                }`}
              >
                <IconComp className="w-5 h-5" />
              </div>

              <span className="text-xs font-bold leading-tight line-clamp-1">
                {cat.name}
              </span>

              <span
                className={`text-[10px] mt-0.5 font-semibold ${
                  isSelected ? 'text-white/80' : 'text-stone-400'
                }`}
              >
                {cat.count} món
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
