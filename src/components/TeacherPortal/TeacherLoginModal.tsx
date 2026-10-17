import React, { useState } from 'react';
import { LockKeyhole, X, KeyRound, Eye, EyeOff, Sparkles, Check } from 'lucide-react';
import { apiClient } from '../../api/client';

interface TeacherLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const TeacherLoginModal: React.FC<TeacherLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [pin, setPin] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await apiClient.loginTeacher(pin.trim());
    setIsLoading(false);

    if (result.success) {
      onSuccess();
      onClose();
    } else {
      setError(result.message || 'Mật khẩu quản trị viên không chính xác.');
    }
  };

  const handleFillDefault = () => {
    setPin('123456789');
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <form onSubmit={handleSubmit} className="space-y-4 text-center">
          <div className="w-14 h-14 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
            <LockKeyhole className="w-7 h-7" />
          </div>

          <div>
            <h3 className="text-xl font-extrabold text-slate-800">
              Khu Vực Quản Trị & Giáo Viên
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
              Không gian quản trị và bảo vệ học sinh dành cho Giáo viên chủ nhiệm & Chuyên viên tâm lý.
            </p>
          </div>

          {/* Initial password banner */}
          <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-3 text-left text-xs text-amber-900 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                Mật khẩu mặc định ban đầu:
              </span>
              <button
                type="button"
                onClick={handleFillDefault}
                className="text-[11px] font-extrabold text-amber-700 bg-white hover:bg-amber-100 px-2.5 py-1 rounded-lg border border-amber-300 cursor-pointer transition-all active:scale-95 shadow-xs"
              >
                Điền nhanh 123456789
              </button>
            </div>
            <p className="text-slate-600 text-[11px]">
              Mật khẩu khởi tạo: <strong className="font-mono text-xs bg-white px-2 py-0.5 rounded border border-amber-200 text-amber-900">123456789</strong>
            </p>
            <p className="text-[10px] text-slate-500 italic">
              * Quản trị viên có thể đổi mật khẩu mới bất cứ lúc nào trong bảng điều khiển.
            </p>
          </div>

          <div className="text-left space-y-1">
            <label className="text-xs font-bold text-slate-700">
              Nhập mật khẩu quản trị viên:
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="Nhập 123456789"
                autoFocus
                className="w-full pl-9 pr-10 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-400 bg-slate-50 tracking-wider font-mono text-center"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                title={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-600 font-semibold text-left">
              {error}
            </div>
          )}

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isLoading || !pin.trim()}
              className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-extrabold shadow-md shadow-amber-200 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? 'Đang xác thực...' : 'Đăng nhập Quản trị'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
