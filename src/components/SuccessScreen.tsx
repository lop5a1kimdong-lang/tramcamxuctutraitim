import React, { useEffect } from 'react';
import { Heart, Home, RotateCcw, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface SuccessScreenProps {
  onGoHome: () => void;
  onSendAnother: () => void;
}

export const SuccessScreen: React.FC<SuccessScreenProps> = ({
  onGoHome,
  onSendAnother,
}) => {
  useEffect(() => {
    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.5 },
      colors: ['#FDA4AF', '#F43F5E', '#FDE047', '#67E8F9', '#C084FC'],
    });
  }, []);

  return (
    <div className="max-w-xl mx-auto py-8 px-4 text-center space-y-6 animate-fadeIn">
      <div className="bg-white/95 backdrop-blur-md rounded-3xl p-8 border-2 border-pink-200 shadow-xl shadow-pink-100 space-y-6">
        {/* Pulsing Big Heart */}
        <div className="relative flex justify-center items-center">
          <div className="absolute w-36 h-36 rounded-full bg-pink-100 animate-ping opacity-60" />
          <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-pink-400 via-rose-400 to-amber-200 flex items-center justify-center shadow-lg shadow-pink-300 relative z-10 animate-bounce">
            <span className="text-5xl">💖</span>
          </div>
          <span className="absolute -top-1 right-28 text-2xl animate-spin">✨</span>
          <span className="absolute -bottom-1 left-28 text-2xl animate-pulse">🌟</span>
        </div>

        {/* Official Message from Specification */}
        <div className="space-y-3">
          <h2 className="text-2xl sm:text-3xl font-black text-sky-950 tracking-tight leading-snug">
            Cảm ơn em đã tin tưởng chia sẻ!
          </h2>

          <div className="bg-pink-50/70 border border-pink-200 rounded-2xl p-4 text-sm sm:text-base text-pink-950 font-semibold leading-relaxed">
            “Cảm xúc của em rất quan trọng. Em xứng đáng được lắng nghe và tôn trọng.”
          </div>

          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
            Thầy cô đã nhận được lời nhắn của em một cách an toàn và bảo mật. Trái tim em hãy thật nhẹ nhõm và vui vẻ nhé!
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
          <button
            onClick={onGoHome}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 text-white font-extrabold text-sm shadow-md shadow-sky-200 flex items-center justify-center gap-2 cursor-pointer transition-transform hover:scale-105"
          >
            <Home className="w-4 h-4" />
            <span>Về trang chủ</span>
          </button>

          <button
            onClick={onSendAnother}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl border-2 border-pink-300 text-pink-700 hover:bg-pink-50 font-extrabold text-sm flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Gửi thêm điều khác</span>
          </button>
        </div>
      </div>
    </div>
  );
};
