import React, { useState, useEffect } from 'react';
import { Heart, Sparkles, Send, MessageCircleHeart, Award, Smile, Sun } from 'lucide-react';
import { apiClient } from '../api/client';
import { KindnessNote } from '../types';
import confetti from 'canvas-confetti';

interface KindnessWallProps {
  onBack: () => void;
}

const TEMPLATES = [
  { id: 'thay-co', label: 'Em cảm ơn thầy cô vì...', icon: '👩‍🏫', prefix: 'Em cảm ơn thầy cô vì ' },
  { id: 'ban-be', label: 'Em muốn nói với bạn rằng...', icon: '🤝', prefix: 'Em muốn nói với bạn rằng ' },
  { id: 'tu-hao', label: 'Hôm nay em tự hào vì...', icon: '🌟', prefix: 'Hôm nay em tự hào vì ' },
  { id: 'nu-cuoi', label: 'Điều làm em mỉm cười là...', icon: '😊', prefix: 'Điều làm em mỉm cười là ' },
  { id: 'khac', label: 'Lời chúc tốt đẹp khác', icon: '💖', prefix: '' },
];

export const KindnessWall: React.FC<KindnessWallProps> = ({ onBack }) => {
  const [notes, setNotes] = useState<KindnessNote[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState('thay-co');
  const [content, setContent] = useState('Em cảm ơn thầy cô vì luôn ân cần chỉ bảo từng nét chữ cho chúng em!');
  const [senderName, setSenderName] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    const list = await apiClient.getKindnessNotes();
    setNotes(list);
  };

  const handleSelectTemplate = (tmpl: typeof TEMPLATES[0]) => {
    setSelectedTemplate(tmpl.id);
    setContent(tmpl.prefix);
  };

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    const newNote = await apiClient.postKindnessNote({
      templateType: selectedTemplate as any,
      content: content.trim(),
      senderName: senderName.trim() || 'Một bạn nhỏ đáng yêu',
      recipientName: recipientName.trim(),
    });

    setIsSubmitting(false);
    if (newNote) {
      setNotes(prev => [newNote, ...prev]);
      setContent('');
      setRecipientName('');

      // Confetti celebration
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#F43F5E', '#FBBF24', '#38BDF8', '#34D399', '#A855F7'],
      });
    }
  };

  const handleLike = async (id: string) => {
    if (likedMap[id]) return;
    setLikedMap(prev => ({ ...prev, [id]: true }));

    const newLikes = await apiClient.likeKindnessNote(id);
    if (newLikes !== null) {
      setNotes(prev => prev.map(n => n.id === id ? { ...n, likes: newLikes } : n));
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-rose-400 via-pink-400 to-amber-300 rounded-3xl p-6 text-white shadow-lg flex items-center justify-between">
        <div>
          <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold mb-2">
            <Heart className="w-4 h-4 fill-white" />
            Vườn Hoa Lời Nhắn Yêu Thương
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold">
            Gửi Gắm Những Điều Tốt Đẹp
          </h2>
          <p className="text-white/95 text-sm mt-1 max-w-xl">
            Cùng nhau lan tỏa lòng biết ơn, tình bạn và nụ cười ấm áp tới mọi người xung quanh em nhé!
          </p>
        </div>
        <div className="text-5xl hidden sm:block animate-bounce">
          🌸✨
        </div>
      </div>

      {/* Post form */}
      <div className="bg-white rounded-3xl p-6 border border-pink-100 shadow-sm space-y-4">
        <h3 className="font-extrabold text-base text-slate-800 flex items-center gap-2">
          <span>💌</span>
          <span>Em muốn gửi điều tốt đẹp gì hôm nay?</span>
        </h3>

        {/* Template choices */}
        <div className="flex flex-wrap gap-2">
          {TEMPLATES.map((tmpl) => (
            <button
              type="button"
              key={tmpl.id}
              onClick={() => handleSelectTemplate(tmpl)}
              className={`px-3.5 py-2 rounded-2xl text-xs font-bold flex items-center gap-1.5 border transition-all cursor-pointer ${
                selectedTemplate === tmpl.id
                  ? 'bg-rose-500 text-white border-rose-500 shadow-sm scale-105'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <span>{tmpl.icon}</span>
              <span>{tmpl.label}</span>
            </button>
          ))}
        </div>

        <form onSubmit={handlePost} className="space-y-3">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={3}
            placeholder="Viết lời nhắn ấm áp của em tại đây..."
            className="w-full p-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-3 focus:ring-rose-300 text-slate-700 text-sm bg-rose-50/20 resize-none"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              placeholder="Gửi tới ai: (Ví dụ: Cô giáo Hà, Bạn An lớp 3A...)"
              className="px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50"
            />
            <input
              type="text"
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              placeholder="Tên của em (Ví dụ: Bạn nhỏ lớp 3A, hoặc để trống)"
              className="px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50"
            />
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="submit"
              disabled={isSubmitting || !content.trim()}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-rose-200 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'Đang gửi...' : 'Gửi lời yêu thương'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Display Wall of Good Deeds */}
      <div className="space-y-3">
        <h3 className="font-extrabold text-base text-slate-800 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <span>🌻</span>
            <span>Những cánh bướm yêu thương từ các bạn:</span>
          </span>
          <span className="text-xs text-slate-500 font-semibold">
            {notes.length} lời nhắn
          </span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {notes.map((note) => (
            <div
              key={note.id}
              className="bg-white rounded-3xl p-5 border border-pink-100/80 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between space-y-3 relative overflow-hidden"
            >
              {/* Cute corner ribbon */}
              <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none overflow-hidden">
                <div className="bg-gradient-to-bl from-pink-200 to-transparent w-full h-full" />
              </div>

              <div>
                {note.recipientName && (
                  <div className="text-[11px] font-bold text-rose-500 mb-1 flex items-center gap-1">
                    <span>Gửi đến:</span>
                    <span className="bg-rose-50 px-2 py-0.5 rounded-md border border-rose-100">
                      {note.recipientName}
                    </span>
                  </div>
                )}
                <p className="text-slate-800 text-sm leading-relaxed font-medium">
                  "{note.content}"
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-50 text-xs">
                <span className="font-bold text-slate-500">
                  {note.senderName}
                </span>

                <button
                  type="button"
                  onClick={() => handleLike(note.id)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    likedMap[note.id]
                      ? 'bg-rose-100 text-rose-600 scale-105'
                      : 'bg-slate-50 text-slate-600 hover:bg-rose-50 hover:text-rose-500'
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${likedMap[note.id] ? 'fill-rose-500 text-rose-500' : ''}`} />
                  <span>{note.likes || 1}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-start">
        <button
          type="button"
          onClick={onBack}
          className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 cursor-pointer"
        >
          Quay lại trang chủ
        </button>
      </div>
    </div>
  );
};
