import React from 'react';
import { useApp } from '../../context/AppContext';
import { FileClock, ShieldCheck, UserCheck } from 'lucide-react';

export default function AdminLogs() {
  const { auditLogs } = useApp();

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs flex items-center justify-between">
        <div>
          <h2 className="text-base font-black text-stone-900 flex items-center gap-2">
            <FileClock className="w-5 h-5 text-orange-500" />
            <span>Nhật Ký Kiểm Toán Hệ Thống (System Audit Logs)</span>
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Ghi vết tự động mọi hành động: duyệt đơn hàng, sửa giá thực đơn, nhập kho và phát hành voucher
          </p>
        </div>

        <span className="text-xs bg-stone-100 text-stone-700 font-mono px-3 py-1 rounded-xl font-bold">
          {auditLogs.length} sự kiện ghi vết
        </span>
      </div>

      <div className="bg-white rounded-3xl border border-stone-200 shadow-xs p-6">
        <div className="space-y-4 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-stone-200">
          {auditLogs.map((log) => (
            <div key={log.id} className="relative flex items-start gap-4 text-xs group">
              <div className="w-7 h-7 rounded-full bg-orange-500 text-white flex items-center justify-center shrink-0 z-10 shadow-sm border-2 border-white">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>

              <div className="flex-1 p-3.5 bg-stone-50 rounded-2xl border border-stone-100 group-hover:border-orange-200 transition space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-black text-stone-900">{log.action}</span>
                  <span className="text-[10px] text-stone-400 font-mono">{log.time}</span>
                </div>

                <p className="text-stone-600 text-xs">{log.detail}</p>

                <div className="text-[10px] text-orange-600 font-semibold pt-1 flex items-center gap-1">
                  <UserCheck className="w-3 h-3" />
                  <span>Thực hiện bởi: {log.user}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
