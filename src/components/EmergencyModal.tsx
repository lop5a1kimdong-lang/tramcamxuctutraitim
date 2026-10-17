import React, { useState } from 'react';
import { ShieldAlert, Phone, MapPin, X, Heart, AlertCircle, CheckCircle, Users } from 'lucide-react';
import { apiClient } from '../api/client';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [studentName, setStudentName] = useState('');
  const [studentGrade, setStudentGrade] = useState('');
  const [location, setLocation] = useState('');
  const [urgentNeed, setUrgentNeed] = useState<string>('Em muốn nói chuyện trực tiếp với thầy cô');
  const [details, setDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const fullContent = `[YÊU CẦU HỖ TRỢ KHẨN CẤP / BẢO VỆ AN TOÀN]\n- Nhu cầu: ${urgentNeed}\n- Vị trí/Nơi đang ở: ${location || 'Chưa cung cấp'}\n- Nội dung chia sẻ: ${details || 'Học sinh bấm nút cần hỗ trợ trực tiếp'}`;

    const res = await apiClient.submitEntry({
      type: 'urgent_help',
      emotion: 'kho-noi',
      topic: 'dieu-lo-lang',
      supportLevel: 'can-giup-do-som',
      content: fullContent,
      studentName: studentName.trim() || 'Học sinh cần trợ giúp khẩn',
      studentGrade: studentGrade.trim() || 'Cần hỗ trợ',
      isAnonymous: !studentName.trim(),
      isEmergencyAlert: true,
    });

    setIsSubmitting(false);
    if (res.success) {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        onClose();
        onSuccess();
      }, 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border-4 border-amber-300 p-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-800">
              Thầy cô đã nhận được thông tin của em!
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed max-w-md mx-auto">
              Thầy cô sẽ chủ động tìm em hoặc mời em tới phòng tham vấn sớm nhất. Em hãy bình tĩnh và ở nơi an toàn nhé!
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Header Badge */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-md">
                <ShieldAlert className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h3 className="font-extrabold text-lg text-amber-900">
                  Em Cần Thầy Cô Giúp Đỡ
                </h3>
                <p className="text-xs text-amber-700">
                  Luôn có người lớn lắng nghe, bảo vệ và đồng hành cùng em!
                </p>
              </div>
            </div>

            {/* Gentle Warm Guidance */}
            <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200 text-xs sm:text-sm text-amber-950 space-y-2">
              <p className="font-semibold flex items-center gap-1.5 text-amber-800">
                <Heart className="w-4 h-4 fill-amber-500 text-amber-500 shrink-0" />
                Em hãy an tâm, đây là không gian bảo mật và an toàn:
              </p>
              <ul className="space-y-1.5 text-slate-700 pl-5 list-disc">
                <li>Nếu em đang thấy sợ hãi hoặc có ai đe dọa, hãy tới ngay <strong>Phòng Đội, Phòng Y tế, hoặc tìm Cô giáo chủ nhiệm / Chú bảo vệ</strong> gần nhất.</li>
                <li>Em không có lỗi khi gặp chuyện buồn hay bị bắt nạt. Thầy cô luôn bên cạnh em.</li>
              </ul>
            </div>

            {/* Quick Action Choices */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Em muốn thầy cô hỗ trợ thế nào?
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  'Em muốn nói chuyện trực tiếp với thầy cô',
                  'Em cần thầy cô giúp đỡ sớm',
                  'Em cảm thấy không an toàn ở trường',
                  'Có bạn đang làm phiền hoặc dọa nạt em',
                ].map((option) => (
                  <button
                    type="button"
                    key={option}
                    onClick={() => setUrgentNeed(option)}
                    className={`p-2.5 text-left rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                      urgentNeed === option
                        ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {/* Student Identification (Optional but strongly encouraged for safety) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Họ và tên của em:
                </label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="Ví dụ: Nguyễn Minh Anh"
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-400 bg-slate-50"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Lớp của em:
                </label>
                <input
                  type="text"
                  value={studentGrade}
                  onChange={(e) => setStudentGrade(e.target.value)}
                  placeholder="Ví dụ: Lớp 4B"
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-400 bg-slate-50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Em đang ở đâu? (hoặc lớp học nào):
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Ví dụ: Trong lớp 4B, hoặc gần thư viện..."
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-400 bg-slate-50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Điều em muốn nói thêm với thầy cô:
              </label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Em có thể viết vài dòng ngắn nếu muốn..."
                rows={2}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-400 bg-slate-50 resize-none"
              />
            </div>

            {/* Direct Helpline Banner */}
            <div className="bg-sky-50 border border-sky-200 rounded-2xl p-3 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-sky-500 text-white flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-sky-900">
                    Tổng đài Quốc gia Bảo vệ Trẻ em
                  </p>
                  <p className="text-xs text-sky-700 font-extrabold">
                    Gọi số 111 (Miễn phí 24/7)
                  </p>
                </div>
              </div>
              <span className="text-[10px] bg-sky-200/70 text-sky-800 font-bold px-2 py-1 rounded-full">
                Khẩn cấp
              </span>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-bold cursor-pointer"
              >
                Đóng
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-[2] py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white text-sm font-extrabold shadow-md shadow-amber-300/50 cursor-pointer disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                {isSubmitting ? 'Đang gửi thông tin...' : 'Gửi yêu cầu tới thầy cô ngay'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
