import React, { useState } from 'react';
import { EmotionType, TopicType, SupportLevelType } from '../types';
import { EmotionCards } from './EmotionCards';
import { apiClient } from '../api/client';
import { Sparkles, Send, ShieldCheck, Heart, User, School, Smile, Info } from 'lucide-react';

interface EmotionJournalProps {
  initialEmotion?: EmotionType;
  onSuccess: () => void;
  onCancel: () => void;
}

const STICKERS = [
  { id: 'heart', emoji: '💖', label: 'Trái tim ấm áp' },
  { id: 'sun', emoji: '☀️', label: 'Ánh nắng rực rỡ' },
  { id: 'rainbow', emoji: '🌈', label: 'Cầu vồng hy vọng' },
  { id: 'star', emoji: '⭐', label: 'Ngôi sao may mắn' },
  { id: 'cat', emoji: '🐱', label: 'Mèo con đáng yêu' },
  { id: 'clover', emoji: '🍀', label: 'Cỏ 4 lá' },
  { id: 'cloud', emoji: '☁️', label: 'Mây bình yên' },
];

export const EmotionJournal: React.FC<EmotionJournalProps> = ({
  initialEmotion = 'vui-ve',
  onSuccess,
  onCancel,
}) => {
  const [selectedEmotion, setSelectedEmotion] = useState<EmotionType>(initialEmotion);
  const [topic, setTopic] = useState<TopicType>('chuyen-khac');
  const [supportLevel, setSupportLevel] = useState<SupportLevelType>('chia-se');
  const [content, setContent] = useState('');
  const [selectedSticker, setSelectedSticker] = useState('heart');
  const [studentName, setStudentName] = useState('');
  const [studentGrade, setStudentGrade] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const topics: { id: TopicType; label: string; icon: string }[] = [
    { id: 'ban-be', label: 'Bạn bè', icon: '👫' },
    { id: 'hoc-tap', label: 'Học tập', icon: '📚' },
    { id: 'thay-co', label: 'Thầy cô', icon: '👩‍🏫' },
    { id: 'gia-dinh', label: 'Gia đình', icon: '🏡' },
    { id: 'dieu-lo-lang', label: 'Điều làm em lo lắng', icon: '😟' },
    { id: 'dieu-em-vui', label: 'Điều làm em vui', icon: '🎉' },
    { id: 'chuyen-khac', label: 'Chuyện khác', icon: '💭' },
  ];

  const supportLevels: { id: SupportLevelType; label: string; desc: string; icon: string }[] = [
    {
      id: 'chia-se',
      label: 'Em muốn chia sẻ',
      desc: 'Chỉ cần thầy cô đọc và hiểu lòng em là em vui rồi',
      icon: '💬',
    },
    {
      id: 'tro-chuyen',
      label: 'Em muốn được trò chuyện',
      desc: 'Nếu có lúc rảnh rỗi, thầy cô nói chuyện với em nhé',
      icon: '🗣️',
    },
    {
      id: 'can-giup-do-som',
      label: 'Em cần thầy cô giúp đỡ sớm',
      desc: 'Em đang thấy khó khăn hoặc có việc quan trọng cần hỗ trợ',
      icon: '🆘',
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!content.trim()) {
      setErrorMessage('Em hãy viết vài dòng chia sẻ về điều đang xảy ra nhé!');
      return;
    }

    setIsSubmitting(true);
    const result = await apiClient.submitEntry({
      type: 'emotion_journal',
      emotion: selectedEmotion,
      topic,
      supportLevel,
      content,
      sticker: selectedSticker,
      studentName: isAnonymous ? 'Học sinh ẩn danh' : studentName,
      studentGrade: isAnonymous ? '' : studentGrade,
      isAnonymous,
      isEmergencyAlert: supportLevel === 'can-giup-do-som',
    });

    setIsSubmitting(false);

    if (result.success) {
      onSuccess();
    } else {
      setErrorMessage(result.error || 'Có lỗi khi gửi bài, em thử lại nhé!');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-pink-400 via-rose-300 to-amber-200 rounded-3xl p-6 text-white shadow-lg flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-2 bg-white/25 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold mb-2">
            <Heart className="w-4 h-4 fill-white" />
            Nhật Ký Cảm Xúc
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold drop-shadow-sm">
            Trang Nhật Ký Yêu Thương Của Em
          </h2>
          <p className="text-white/90 text-sm mt-1">
            Mọi cảm xúc của em đều đáng được trân trọng. Hãy thoải mái chia sẻ nhé!
          </p>
        </div>
        <div className="text-5xl hidden sm:block animate-bounce">
          📖✨
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Choose Emotion */}
        <div className="bg-white rounded-3xl p-5 border border-sky-100 shadow-sm space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-pink-100 text-pink-700 font-extrabold flex items-center justify-center text-sm">
              1
            </span>
            <h3 className="font-extrabold text-base text-slate-800">
              Hôm nay trái tim em đang cảm thấy thế nào?
            </h3>
          </div>
          <EmotionCards
            selectedEmotion={selectedEmotion}
            onSelectEmotion={(emo) => setSelectedEmotion(emo)}
          />
        </div>

        {/* Step 2: Choose Topic */}
        <div className="bg-white rounded-3xl p-5 border border-sky-100 shadow-sm space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-sky-100 text-sky-700 font-extrabold flex items-center justify-center text-sm">
              2
            </span>
            <h3 className="font-extrabold text-base text-slate-800">
              Điều này liên quan đến chủ đề nào?
            </h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
            {topics.map((t) => (
              <button
                type="button"
                key={t.id}
                onClick={() => setTopic(t.id)}
                className={`p-3 rounded-2xl flex flex-col items-center justify-center text-center gap-1 border-2 transition-all cursor-pointer ${
                  topic === t.id
                    ? 'bg-sky-100 border-sky-400 text-sky-900 font-bold scale-105 shadow-xs'
                    : 'bg-slate-50 border-slate-100 hover:bg-slate-100 text-slate-700'
                }`}
              >
                <span className="text-2xl">{t.icon}</span>
                <span className="text-xs">{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Step 3: Choose Support Level */}
        <div className="bg-white rounded-3xl p-5 border border-sky-100 shadow-sm space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-amber-100 text-amber-700 font-extrabold flex items-center justify-center text-sm">
              3
            </span>
            <h3 className="font-extrabold text-base text-slate-800">
              Em mong muốn được thầy cô đồng hành như thế nào?
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {supportLevels.map((lvl) => (
              <button
                type="button"
                key={lvl.id}
                onClick={() => setSupportLevel(lvl.id)}
                className={`p-4 rounded-2xl text-left border-2 transition-all cursor-pointer flex flex-col justify-between ${
                  supportLevel === lvl.id
                    ? 'bg-amber-50 border-amber-400 text-amber-900 shadow-sm'
                    : 'bg-slate-50 border-slate-100 hover:bg-slate-100 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-2xl">{lvl.icon}</span>
                  <span className="font-bold text-sm text-slate-800">{lvl.label}</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">{lvl.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Step 4: Write message & Choose Sticker */}
        <div className="bg-white rounded-3xl p-5 border border-sky-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 font-extrabold flex items-center justify-center text-sm">
                4
              </span>
              <h3 className="font-extrabold text-base text-slate-800">
                Hãy viết đôi dòng tâm sự với thầy cô nhé:
              </h3>
            </div>
            <span className="text-xs text-slate-400 font-medium">
              {content.length}/1000 ký tự
            </span>
          </div>

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            maxLength={1000}
            rows={4}
            placeholder="Hôm nay em cảm thấy thế nào? Có chuyện gì đang làm em vui, băn khoăn hay lo lắng không? Em cứ tự nhiên viết ra nhé..."
            className="w-full p-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-3 focus:ring-pink-300 text-slate-700 text-sm sm:text-base leading-relaxed bg-pink-50/20"
          />

          {/* Stickers */}
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-2">
              Gắn một chiếc hình dán em thích:
            </label>
            <div className="flex flex-wrap gap-2">
              {STICKERS.map((stk) => (
                <button
                  type="button"
                  key={stk.id}
                  onClick={() => setSelectedSticker(stk.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 border transition-all cursor-pointer ${
                    selectedSticker === stk.id
                      ? 'bg-rose-100 border-rose-300 text-rose-800 scale-105 shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span className="text-base">{stk.emoji}</span>
                  <span>{stk.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Step 5: Student Info & Anonymous toggle */}
        <div className="bg-white rounded-3xl p-5 border border-sky-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-purple-100 text-purple-700 font-extrabold flex items-center justify-center text-sm">
                5
              </span>
              <h3 className="font-extrabold text-base text-slate-800">
                Thông tin của em (không bắt buộc)
              </h3>
            </div>
            {/* Anonymous Toggle */}
            <label className="flex items-center gap-2 cursor-pointer bg-slate-50 hover:bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 transition-colors">
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="w-4 h-4 text-pink-500 rounded focus:ring-pink-400"
              />
              <span className="text-xs font-bold text-slate-700">
                Gửi ẩn danh (không ghi tên em)
              </span>
            </label>
          </div>

          {isAnonymous ? (
            <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-800 flex items-start gap-2">
              <Info className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
              <span>
                <strong>Lưu ý:</strong> Em chọn gửi ẩn danh, thầy cô sẽ lắng nghe nhưng sẽ khó tìm gặp trực tiếp để giúp đỡ nếu em đang gặp nguy hiểm. Nếu cần hỗ trợ khẩn cấp, em nên ghi tên và lớp nhé!
              </span>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  Tên của em:
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="Ví dụ: Hoàng Gia Bảo"
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-pink-300 bg-slate-50"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  Lớp học của em:
                </label>
                <div className="relative">
                  <School className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={studentGrade}
                    onChange={(e) => setStudentGrade(e.target.value)}
                    placeholder="Ví dụ: Lớp 3A"
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-pink-300 bg-slate-50"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {errorMessage && (
          <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-semibold text-center">
            {errorMessage}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between gap-4 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 rounded-2xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Quay lại
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 max-w-sm py-3.5 px-6 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 hover:from-pink-600 hover:to-amber-600 text-white font-extrabold text-base shadow-lg shadow-pink-300/50 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 transition-all hover:scale-[1.01] active:scale-[0.99]"
          >
            <Send className="w-5 h-5" />
            <span>{isSubmitting ? 'Đang gửi tâm sự...' : 'Gửi lời tâm sự tới thầy cô'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
