import React, { useState } from 'react';
import { BookOpen, Copy, Check, QrCode, Globe, ShieldCheck, Database, X, ExternalLink } from 'lucide-react';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GuideModal: React.FC<GuideModalProps> = ({ isOpen, onClose }) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const currentUrl = typeof window !== 'undefined' ? window.location.origin : 'https://tram-cam-xuc.edu.vn';

  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 p-6 relative space-y-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-slate-900">
              Hướng Dẫn Triển Khai & Chia Sẻ Cho Học Sinh
            </h3>
            <p className="text-xs text-slate-500">
              Cách đưa ứng dụng vào hoạt động thực tế tại nhà trường
            </p>
          </div>
        </div>

        {/* Section 1: Share Link & QR */}
        <div className="bg-sky-50/70 border border-sky-200 rounded-2xl p-4 space-y-3">
          <h4 className="font-extrabold text-xs text-sky-950 uppercase tracking-wider flex items-center gap-1.5">
            <Globe className="w-4 h-4 text-sky-600" />
            1. Đường link truy cập dành cho học sinh:
          </h4>
          <p className="text-xs text-slate-600">
            Thầy cô có thể chia sẻ đường link này cho phụ huynh, gắn biểu tượng trên màn hình máy tính phòng Tin học, hoặc in mã QR dán tại góc thư viện/phòng tham vấn:
          </p>

          <div className="flex items-center gap-2 bg-white p-2 rounded-xl border border-sky-200">
            <input
              type="text"
              readOnly
              value={currentUrl}
              className="flex-1 text-xs font-mono text-slate-700 bg-transparent outline-none px-2"
            />
            <button
              onClick={handleCopyLink}
              className="px-3 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold flex items-center gap-1 cursor-pointer shrink-0"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Đã sao chép' : 'Sao chép link'}</span>
            </button>
          </div>
        </div>

        {/* Section 2: Recommended deployment in primary schools */}
        <div className="space-y-3">
          <h4 className="font-extrabold text-xs text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            2. Các bước triển khai an toàn tại trường tiểu học:
          </h4>
          <ul className="space-y-2 text-xs text-slate-600 list-disc pl-5">
            <li>
              <strong>Cài đặt lối tắt (Bookmark / Desktop Shortcut):</strong> Tại phòng máy tính trường học, tạo biểu tượng shortcut trên màn hình chính dẫn thẳng tới link ứng dụng.
            </li>
            <li>
              <strong>Giới thiệu trong giờ Sinh hoạt lớp / Chào cờ:</strong> Hướng dẫn các em học sinh biết đây là "Hòm thư điều em muốn nói điện tử", các em luôn được lắng nghe, bảo mật và yêu thương.
            </li>
            <li>
              <strong>Phân công giáo viên tiếp nhận:</strong> Chỉ định Tổng phụ trách Đội, Giáo viên chủ nhiệm hoặc Chuyên viên tư vấn tâm lý học đường trực tiếp phụ trách kiểm tra hộp thư mỗi ngày.
            </li>
          </ul>
        </div>

        {/* Section 3: Data storage & Backend */}
        <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-200">
          <h4 className="font-extrabold text-xs text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <Database className="w-4 h-4 text-purple-600" />
            3. Cơ sở dữ liệu và bảo mật hiện tại:
          </h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            - Hệ thống đang được lưu trữ bền vững trên máy chủ backend tại tệp cơ sở dữ liệu <code className="font-mono bg-white px-1 py-0.5 rounded border border-slate-200">data/database.json</code>, tệp âm thanh và hình ảnh đã được mã hóa an toàn và tự động làm sạch vị trí GPS.
            <br />
            - <strong>Mật khẩu quản trị viên:</strong> Mật khẩu ban đầu mặc định là <code className="font-mono bg-white px-1.5 py-0.5 rounded border border-amber-300 text-amber-900 font-bold">123456789</code>. Thầy cô có thể đổi sang mật khẩu riêng bất kỳ lúc nào tại nút <strong>"Đổi Mật Khẩu & Cài Đặt"</strong>.
            <br />
            - <strong>Tùy chọn mở rộng:</strong> Dữ liệu được bảo toàn tự động và có thể xuất file Excel báo cáo định kỳ cho Ban Giám hiệu nhà trường.
          </p>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-800 text-white font-bold text-xs hover:bg-slate-700 cursor-pointer"
          >
            Đã hiểu, đóng hướng dẫn
          </button>
        </div>
      </div>
    </div>
  );
};
