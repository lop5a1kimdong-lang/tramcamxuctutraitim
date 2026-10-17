import React, { useState } from 'react';
import { ShareEntry, ProcessStatusType } from '../../types';
import { apiClient } from '../../api/client';
import { 
  X, 
  Volume2, 
  Play, 
  Pause, 
  Clock, 
  User, 
  School, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Save, 
  Trash2, 
  FileText,
  Calendar,
  MessageSquare
} from 'lucide-react';

interface EntryDetailModalProps {
  entry: ShareEntry | null;
  onClose: () => void;
  onUpdated: () => void;
}

const STATUS_OPTIONS: { id: ProcessStatusType; label: string; color: string }[] = [
  { id: 'new', label: 'Mới tiếp nhận', color: 'bg-blue-100 text-blue-800 border-blue-300' },
  { id: 'reviewing', label: 'Đang xem xét', color: 'bg-amber-100 text-amber-800 border-amber-300' },
  { id: 'meet_direct', label: 'Cần trao đổi trực tiếp', color: 'bg-rose-100 text-rose-800 border-rose-300' },
  { id: 'supported', label: 'Đã hỗ trợ', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
  { id: 'closed', label: 'Đã đóng trường hợp', color: 'bg-slate-100 text-slate-800 border-slate-300' },
];

export const EntryDetailModal: React.FC<EntryDetailModalProps> = ({
  entry,
  onClose,
  onUpdated,
}) => {
  if (!entry) return null;

  const [status, setStatus] = useState<ProcessStatusType>(entry.status);
  const [internalNotes, setInternalNotes] = useState(entry.internalNotes || '');
  const [supportPlan, setSupportPlan] = useState(entry.supportPlan || '');
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  const handleSave = async () => {
    setIsSaving(true);
    const res = await apiClient.updateEntry(entry.id, {
      status,
      internalNotes,
      supportPlan,
      teacherName: 'Giáo viên phụ trách',
    });
    setIsSaving(false);
    if (res.success) {
      onUpdated();
      onClose();
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Thầy/Cô có chắc chắn muốn xóa hồ sơ tâm sự này theo quy định lưu trữ của nhà trường?')) {
      return;
    }
    setIsDeleting(true);
    const ok = await apiClient.deleteEntry(entry.id);
    setIsDeleting(false);
    if (ok) {
      onUpdated();
      onClose();
    }
  };

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isPlayingAudio) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      audioRef.current.play();
      setIsPlayingAudio(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-100 p-6 relative space-y-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Info */}
        <div className="flex flex-wrap items-center justify-between gap-3 pr-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                #{entry.id}
              </span>
              {entry.isSample && (
                <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                  Dữ liệu mẫu thử nghiệm
                </span>
              )}
              {entry.isEmergencyAlert && (
                <span className="text-[10px] font-extrabold bg-rose-500 text-white px-2 py-0.5 rounded-full animate-pulse">
                  Cần hỗ trợ sớm
                </span>
              )}
            </div>
            <h3 className="text-lg font-extrabold text-slate-900 mt-1">
              Chi Tiết Hồ Sơ Tâm Sự Của Học Sinh
            </h3>
          </div>
        </div>

        {/* Student metadata banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-2xl text-xs">
          <div>
            <span className="text-slate-400 block font-semibold">Học sinh:</span>
            <span className="font-bold text-slate-800 flex items-center gap-1 mt-0.5">
              <User className="w-3.5 h-3.5 text-sky-500" />
              {entry.studentName || 'Học sinh ẩn danh'}
            </span>
          </div>

          <div>
            <span className="text-slate-400 block font-semibold">Lớp:</span>
            <span className="font-bold text-slate-800 flex items-center gap-1 mt-0.5">
              <School className="w-3.5 h-3.5 text-purple-500" />
              {entry.studentGrade || 'Chưa rõ'}
            </span>
          </div>

          <div>
            <span className="text-slate-400 block font-semibold">Cảm xúc:</span>
            <span className="font-bold text-slate-800 capitalize mt-0.5 block">
              {entry.emotion}
            </span>
          </div>

          <div>
            <span className="text-slate-400 block font-semibold">Thời gian:</span>
            <span className="font-bold text-slate-800 mt-0.5 block">
              {new Date(entry.createdAt).toLocaleDateString('vi-VN')} {new Date(entry.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>

        {/* Content Box */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 block">
            Nội dung học sinh chia sẻ:
          </label>
          <div className="p-4 rounded-2xl bg-sky-50/50 border border-sky-100 text-sm text-slate-800 whitespace-pre-wrap leading-relaxed">
            {entry.content || '(Không có nội dung văn bản)'}
          </div>
        </div>

        {/* Attached Audio Player */}
        {entry.audioData && (
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center">
                <Volume2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-blue-900">
                  Bản ghi âm tâm sự giọng nói
                </p>
                <p className="text-[11px] text-blue-700">
                  Thời lượng: {entry.audioDuration ? `${entry.audioDuration} giây` : 'Âm thanh đính kèm'}
                </p>
              </div>
            </div>
            <audio
              ref={audioRef}
              src={entry.audioData}
              onEnded={() => setIsPlayingAudio(false)}
              className="hidden"
            />
            <button
              onClick={toggleAudio}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              {isPlayingAudio ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isPlayingAudio ? 'Tạm dừng' : 'Nghe bản ghi'}</span>
            </button>
          </div>
        )}

        {/* Attached Image Preview */}
        {entry.imageData && (
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 block">
              Hình ảnh đính kèm:
            </label>
            <div className="rounded-2xl border border-slate-200 overflow-hidden max-w-md mx-auto max-h-80 bg-slate-100 flex items-center justify-center">
              <img
                src={entry.imageData}
                alt="Đính kèm từ học sinh"
                className="max-h-80 w-auto object-contain"
              />
            </div>
          </div>
        )}

        {/* Processing Form for Teachers */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-2">
              Trạng thái xử lý tiếp nhận:
            </label>
            <div className="flex flex-wrap gap-2">
              {STATUS_OPTIONS.map((opt) => (
                <button
                  type="button"
                  key={opt.id}
                  onClick={() => setStatus(opt.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    status === opt.id
                      ? `${opt.color} ring-2 ring-slate-400 shadow-xs font-extrabold`
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Ghi chú nội bộ giáo viên / chuyên viên tâm lý (chỉ giáo viên thấy):
            </label>
            <textarea
              value={internalNotes}
              onChange={(e) => setInternalNotes(e.target.value)}
              placeholder="Nhập ghi chú quan sát, nhận định chuyên môn hoặc trao đổi với phụ huynh/GVCN..."
              rows={2}
              className="w-full p-3 rounded-xl border border-slate-200 text-xs text-slate-700 bg-slate-50 focus:ring-2 focus:ring-amber-300 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Kế hoạch hỗ trợ học sinh:
            </label>
            <textarea
              value={supportPlan}
              onChange={(e) => setSupportPlan(e.target.value)}
              placeholder="Ví dụ: Gặp trực tiếp lúc 15h, phối hợp ban đại diện phụ huynh, theo dõi giờ ra chơi..."
              rows={2}
              className="w-full p-3 rounded-xl border border-slate-200 text-xs text-slate-700 bg-slate-50 focus:ring-2 focus:ring-amber-300 resize-none"
            />
          </div>

          {/* Action History / Audit Log */}
          {entry.history && entry.history.length > 0 && (
            <div className="space-y-1.5 pt-2">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Lịch sử xử lý hồ sơ:
              </label>
              <div className="space-y-1 max-h-32 overflow-y-auto bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-[11px] text-slate-600">
                {entry.history.map((h, i) => (
                  <div key={i} className="flex items-start justify-between border-b border-slate-200/50 pb-1 last:border-0 last:pb-0">
                    <div>
                      <span className="font-semibold text-slate-800">{h.action}</span>
                      {h.notes && <p className="text-slate-500 italic">{h.notes}</p>}
                    </div>
                    <span className="text-[10px] text-slate-400 shrink-0">
                      {new Date(h.timestamp).toLocaleDateString('vi-VN')} {new Date(h.timestamp).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-3.5 py-2 text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Xóa hồ sơ</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl text-xs font-bold cursor-pointer"
            >
              Đóng
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-extrabold flex items-center gap-1.5 cursor-pointer shadow-md shadow-amber-200 disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaving ? 'Đang lưu...' : 'Lưu cập nhật'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
