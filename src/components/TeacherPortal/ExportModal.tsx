import React, { useState } from 'react';
import { Download, FileSpreadsheet, ShieldCheck, X, Check } from 'lucide-react';
import { apiClient } from '../../api/client';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose }) => {
  const [anonymized, setAnonymized] = useState(true);

  if (!isOpen) return null;

  const handleDownload = () => {
    const url = apiClient.getExportCsvUrl(anonymized);
    window.open(url, '_blank');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 p-6 relative space-y-5">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-slate-900">
              Xuất Báo Cáo Dữ Liệu Excel / CSV
            </h3>
            <p className="text-xs text-slate-500">
              Tổng hợp phục vụ công tác tâm lý học đường
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <label className="block text-xs font-bold text-slate-700">
            Lựa chọn mức độ bảo vệ danh tính:
          </label>

          <div
            onClick={() => setAnonymized(true)}
            className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3 ${
              anonymized
                ? 'bg-emerald-50 border-emerald-500 text-emerald-950'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <ShieldCheck className={`w-5 h-5 shrink-0 mt-0.5 ${anonymized ? 'text-emerald-600' : 'text-slate-400'}`} />
            <div>
              <p className="font-extrabold text-xs">
                Xuất Báo Cáo Ẩn Danh Hóa (Khuyên dùng)
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                Tự động ẩn họ tên học sinh, chỉ hiển thị khối lớp và nội dung để tổng hợp báo cáo chung mà không lo lộ danh tính.
              </p>
            </div>
          </div>

          <div
            onClick={() => setAnonymized(false)}
            className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3 ${
              !anonymized
                ? 'bg-amber-50 border-amber-500 text-amber-950'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Download className={`w-5 h-5 shrink-0 mt-0.5 ${!anonymized ? 'text-amber-600' : 'text-slate-400'}`} />
            <div>
              <p className="font-extrabold text-xs">
                Xuất Báo Cáo Đầy Đủ Định Danh
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                Bao gồm họ tên học sinh, lớp và ghi chú chi tiết. Chỉ dành riêng cho cán bộ chuyên trách có thẩm quyền.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold cursor-pointer"
          >
            Hủy
          </button>
          <button
            onClick={handleDownload}
            className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold flex items-center gap-2 cursor-pointer shadow-md shadow-emerald-200"
          >
            <Download className="w-4 h-4" />
            <span>Tải tệp CSV về máy</span>
          </button>
        </div>
      </div>
    </div>
  );
};
