import React, { useState, useRef } from 'react';
import { Camera, Upload, Trash2, RotateCcw, Send, AlertTriangle, ShieldCheck, Check, Image as ImageIcon } from 'lucide-react';
import { apiClient } from '../api/client';
import { EmotionType } from '../types';

interface ImageUploaderProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  onSuccess,
  onCancel,
}) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [note, setNote] = useState('');
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [studentName, setStudentName] = useState('');
  const [studentGrade, setStudentGrade] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Strip EXIF and sanitize image via canvas drawing
  const processAndSanitizeImage = (imgSrc: string) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      // Limit dimension to 1280px for performance & bandwidth
      let width = img.width;
      let height = img.height;
      const maxDim = 1280;

      if (width > maxDim || height > maxDim) {
        if (width > height) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
      }

      canvas.width = width;
      canvas.height = height;

      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
        // Export to JPEG - stripped of all EXIF/GPS tags
        const cleanBase64 = canvas.toDataURL('image/jpeg', 0.85);
        setImagePreview(cleanBase64);
      }
    };
    img.src = imgSrc;
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Vui lòng chỉ chọn tệp hình ảnh (PNG, JPG, JPEG, WEBP).');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('Kích thước ảnh tối đa là 10MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        processAndSanitizeImage(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const startCamera = async () => {
    setCameraError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraError('Thiết bị của em không hỗ trợ máy ảnh hoặc camera.');
        return;
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      streamRef.current = stream;
      setIsCameraActive(true);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }, 100);
    } catch (err: any) {
      console.error('Camera open error:', err);
      setCameraError('Không thể mở Camera. Em hãy cho phép quyền máy ảnh trên trình duyệt nhé!');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const captureCameraPhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const photoData = canvas.toDataURL('image/jpeg', 0.85);
      setImagePreview(photoData);
      stopCamera();
    }
  };

  const handleResetImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    stopCamera();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imagePreview) {
      setError('Vui lòng chọn hoặc chụp một bức ảnh trước khi gửi.');
      return;
    }

    setIsSubmitting(true);
    const res = await apiClient.submitEntry({
      type: 'image_share',
      emotion: 'kho-noi',
      topic: 'chuyen-khac',
      supportLevel: 'chia-se',
      content: note.trim() || '[Hình ảnh chia sẻ từ học sinh]',
      imageData: imagePreview,
      studentName: isAnonymous ? 'Học sinh ẩn danh' : studentName,
      studentGrade: isAnonymous ? '' : studentGrade,
      isAnonymous,
    });

    setIsSubmitting(false);
    if (res.success) {
      onSuccess();
    } else {
      setError(res.error || 'Có lỗi khi gửi ảnh, em hãy thử lại nhé!');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-400 via-violet-400 to-pink-400 rounded-3xl p-6 text-white shadow-lg flex items-center justify-between">
        <div>
          <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold mb-2">
            <ImageIcon className="w-4 h-4" />
            Góc Gửi Hình Ảnh
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold">
            Chia Sẻ Bức Ảnh Cùng Thầy Cô
          </h2>
          <p className="text-white/90 text-sm mt-1">
            Bức tranh em vẽ, bài tập em làm, hay một khoảnh khắc em muốn thầy cô xem.
          </p>
        </div>
        <div className="text-5xl hidden sm:block">
          🎨📸
        </div>
      </div>

      {/* Safety Warning Box */}
      <div className="p-4 bg-amber-50 border-2 border-amber-200/80 rounded-2xl flex items-start gap-3 text-xs sm:text-sm text-amber-900 shadow-xs">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-extrabold text-amber-900">
            Lời nhắc an toàn và bảo mật cho em:
          </p>
          <p className="text-slate-700 leading-relaxed">
            Em <strong>không gửi</strong> ảnh chụp giấy tờ cá nhân, địa chỉ nhà, ảnh riêng tư hoặc ảnh của người khác khi bạn chưa cho phép nhé.
            Hệ thống đã tự động bảo vệ quyền riêng tư bằng cách xóa dữ liệu vị trí GPS của ảnh.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-sky-100 shadow-sm space-y-6">
        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept="image/*"
          className="hidden"
        />

        {/* Live Camera View */}
        {isCameraActive && (
          <div className="space-y-3">
            <div className="relative rounded-2xl overflow-hidden bg-black aspect-video max-w-lg mx-auto border-4 border-purple-300">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex justify-center gap-3">
              <button
                type="button"
                onClick={captureCameraPhoto}
                className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm flex items-center gap-2 cursor-pointer shadow-md"
              >
                <Camera className="w-4 h-4" />
                <span>Chụp ảnh này</span>
              </button>
              <button
                type="button"
                onClick={stopCamera}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-50 font-bold text-sm cursor-pointer"
              >
                Hủy chụp
              </button>
            </div>
          </div>
        )}

        {/* Image Preview / Selection Box */}
        {!isCameraActive && !imagePreview && (
          <div className="border-2 border-dashed border-purple-200 rounded-3xl p-8 text-center space-y-4 hover:border-purple-400 transition-colors bg-purple-50/20">
            <div className="w-16 h-16 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mx-auto">
              <ImageIcon className="w-8 h-8" />
            </div>
            <div>
              <h4 className="font-extrabold text-base text-slate-800">
                Chọn hoặc chụp một bức ảnh
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                Hỗ trợ ảnh tranh vẽ, bài vở hoặc hình ảnh em muốn chia sẻ
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 cursor-pointer shadow-md shadow-purple-200"
              >
                <Upload className="w-4 h-4" />
                <span>Chọn ảnh từ máy</span>
              </button>
              <button
                type="button"
                onClick={startCamera}
                className="px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs sm:text-sm flex items-center gap-2 cursor-pointer shadow-md shadow-sky-200"
              >
                <Camera className="w-4 h-4" />
                <span>Mở Camera chụp</span>
              </button>
            </div>

            {cameraError && (
              <p className="text-xs text-rose-600 font-semibold">{cameraError}</p>
            )}
          </div>
        )}

        {/* Preview of Chosen Image */}
        {imagePreview && (
          <div className="space-y-4 text-center">
            <div className="relative inline-block rounded-2xl overflow-hidden border-4 border-purple-200 shadow-md max-w-sm max-h-72">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-auto object-contain max-h-72"
              />
              <span className="absolute top-2 left-2 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                <ShieldCheck className="w-3 h-3" />
                Đã xóa định vị an toàn
              </span>
            </div>

            <div className="flex justify-center gap-3">
              <button
                type="button"
                onClick={handleResetImage}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-50 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Chọn ảnh khác / Xóa ảnh</span>
              </button>
            </div>

            {/* Note attached to photo */}
            <div className="text-left pt-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Lời nhắn kèm theo bức ảnh (tùy chọn):
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Em muốn kể gì về bức ảnh này cho thầy cô nghe không?..."
                rows={2}
                className="w-full p-3 rounded-xl border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-purple-300 bg-purple-50/20 resize-none"
              />
            </div>

            {/* Sender identification */}
            <div className="text-left pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-700">Thông tin người gửi:</span>
                <label className="flex items-center gap-1 text-xs text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="w-3.5 h-3.5 text-purple-600 rounded"
                  />
                  <span>Gửi ẩn danh</span>
                </label>
              </div>

              {!isAnonymous && (
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="Tên của em (tùy chọn)"
                    className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50"
                  />
                  <input
                    type="text"
                    value={studentGrade}
                    onChange={(e) => setStudentGrade(e.target.value)}
                    placeholder="Lớp của em (tùy chọn)"
                    className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50"
                  />
                </div>
              )}
            </div>

            {error && (
              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                {error}
              </div>
            )}

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-extrabold text-sm sm:text-base shadow-lg shadow-purple-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Đang gửi ảnh...' : 'Xác nhận gửi ảnh cho thầy cô'}</span>
              </button>
            </div>
          </div>
        )}

        <div className="flex justify-start pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 cursor-pointer"
          >
            Quay lại trang chủ
          </button>
        </div>
      </form>
    </div>
  );
};
