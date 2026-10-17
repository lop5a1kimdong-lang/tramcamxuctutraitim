import React, { useState } from 'react';
import { Send, Trash2, Eye, Sparkles, MessageSquareHeart, Check, Info } from 'lucide-react';
import { apiClient } from '../api/client';
import { EmotionType, TopicType } from '../types';

interface TextMessageFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const PROMPT_SUGGESTIONS = [
  'Điều gì đang khiến em suy nghĩ?',
  'Hôm nay có chuyện gì làm em vui hoặc buồn?',
  'Em mong thầy cô giúp em điều gì?',
  'Có điều gì em chưa biết nói với ai không?',
];

export const TextMessageForm: React.FC<TextMessageFormProps> = ({
  onSuccess,
  onCancel,
}) => {
  const [content, setContent] = useState('');
  const [activePrompt, setActivePrompt] = useState<string | null>(null);
  const [emotion, setEmotion] = useState<EmotionType>('kho-noi');
  const [topic, setTopic] = useState<TopicType>('chuyen-khac');
  const [studentName, setStudentName] = useState('');
  const [studentGrade, setStudentGrade] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleApplyPrompt = (p: string) => {
    setActivePrompt(p);
    if (!content.trim()) {
      setContent(`- ${p}\n`);
    } else {
      setContent(prev => `${prev}\n- ${p}\n`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!content.trim()) {
      setError('Em hãy viết một vài từ hoặc một câu ngắn gửi tới thầy cô nhé!');
      return;
    }

    setIsSubmitting(true);
    const res = await apiClient.submitEntry({
      type: 'text_message',
      emotion,
      topic,
      supportLevel: 'chia-se',
      content: content.trim(),
      studentName: isAnonymous ? 'Học sinh ẩn danh' : studentName,
      studentGrade: isAnonymous ? '' : studentGrade,
      isAnonymous,
    });

    setIsSubmitting(false);
    if (res.success) {
      onSuccess();
    } else {
      setError(res.error || 'Có lỗi khi gửi tin nhắn, em thử lại nhé!');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 rounded-3xl p-6 text-white shadow-lg flex items-center justify-between">
        <div>
          <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold mb-2">
            <MessageSquareHeart className="w-4 h-4" />
            Góc Viết Lời Nhắn
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold">
            Gửi Gắm Những Điều Em Muốn Nói
          </h2>
          <p className="text-white/90 text-sm mt-1">
            Không cần viết quá dài, một câu ngắn hay một lời tâm sự nhỏ đều được thầy cô đón nhận.
          </p>
        </div>
        <div className="text-5xl hidden sm:block animate-bounce">
          💌✨
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-sky-100 shadow-sm space-y-5">
        {/* Friendly Suggestion Prompts */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-2">
            💡 Gợi ý cho em (bấm vào để lấy ý tưởng nhé):
          </label>
          <div className="flex flex-wrap gap-2">
            {PROMPT_SUGGESTIONS.map((prompt) => (
              <button
                type="button"
                key={prompt}
                onClick={() => handleApplyPrompt(prompt)}
                className="px-3 py-2 rounded-xl text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition-all text-left cursor-pointer flex items-center gap-1.5"
              >
                <span>🌱</span>
                <span>{prompt}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Text Area */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold text-slate-700">
              Nội dung lời nhắn của em:
            </label>
            <span className="text-xs text-slate-400 font-medium">
              {content.length}/1000 ký tự
            </span>
          </div>

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            maxLength={1000}
            rows={6}
            placeholder="Em hãy viết những điều đang có trong lòng vào đây nhé..."
            className="w-full p-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-3 focus:ring-emerald-300 text-slate-700 text-sm sm:text-base leading-relaxed bg-emerald-50/15"
          />

          {/* Quick Toolbar */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => setContent('')}
              disabled={!content}
              className="text-xs text-slate-400 hover:text-rose-500 font-semibold flex items-center gap-1 cursor-pointer disabled:opacity-30"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Xóa nội dung</span>
            </button>
            <button
              type="button"
              onClick={() => setIsPreview(!isPreview)}
              disabled={!content.trim()}
              className="text-xs text-slate-600 hover:text-emerald-700 font-bold flex items-center gap-1 cursor-pointer disabled:opacity-30"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{isPreview ? 'Đóng xem lại' : 'Xem lại lời nhắn'}</span>
            </button>
          </div>
        </div>

        {/* Preview box if toggled */}
        {isPreview && content.trim() && (
          <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-200 space-y-2">
            <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
              Xem lại lời nhắn trước khi gửi:
            </span>
            <p className="text-sm text-slate-800 whitespace-pre-wrap leading-relaxed font-medium">
              {content}
            </p>
          </div>
        )}

        {/* Sender details */}
        <div className="pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-700">Thông tin người gửi:</span>
            <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="w-3.5 h-3.5 text-emerald-600 rounded"
              />
              <span>Gửi ẩn danh</span>
            </label>
          </div>

          {!isAnonymous && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="Họ và tên của em (tùy chọn)"
                className="px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50"
              />
              <input
                type="text"
                value={studentGrade}
                onChange={(e) => setStudentGrade(e.target.value)}
                placeholder="Lớp học của em (tùy chọn)"
                className="px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50"
              />
            </div>
          )}
        </div>

        {error && (
          <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-semibold text-center">
            {error}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between gap-4 pt-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 rounded-2xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-100 cursor-pointer"
          >
            Quay lại
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 max-w-sm py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-extrabold text-sm sm:text-base shadow-lg shadow-emerald-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
            <span>{isSubmitting ? 'Đang gửi...' : 'Gửi lời nhắn tới thầy cô'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
