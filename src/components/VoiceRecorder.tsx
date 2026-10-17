import React, { useState, useRef, useEffect } from 'react';
import { 
  Mic, 
  Square, 
  Play, 
  Pause, 
  RotateCcw, 
  Send, 
  Volume2, 
  AlertCircle, 
  Info, 
  FileText, 
  Sparkles,
  Headphones,
  CheckCircle2,
  Activity
} from 'lucide-react';
import { apiClient } from '../api/client';
import { EmotionType, TopicType } from '../types';

interface VoiceRecorderProps {
  onSuccess: () => void;
  onSwitchToText: () => void;
}

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({
  onSuccess,
  onSwitchToText,
}) => {
  const [recordState, setRecordState] = useState<'idle' | 'recording' | 'paused' | 'stopped'>('idle');
  const [duration, setDuration] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioBase64, setAudioBase64] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const [emotion, setEmotion] = useState<EmotionType>('kho-noi');
  const [studentName, setStudentName] = useState('');
  const [studentGrade, setStudentGrade] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSimulated, setIsSimulated] = useState(false);
  const [volumeLevel, setVolumeLevel] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<any>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      cleanupResources();
    };
  }, []);

  const cleanupResources = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
      audioCtxRef.current.close().catch(() => {});
      audioCtxRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop();
      } catch {}
    }
  };

  // Find best supported mimeType across Chrome, Safari, Firefox, Edge, iOS
  const getSupportedMimeType = (): string => {
    if (typeof MediaRecorder === 'undefined') return '';
    const candidates = [
      'audio/webm;codecs=opus',
      'audio/webm',
      'audio/mp4',
      'audio/ogg;codecs=opus',
      'audio/aac',
      'audio/wav',
    ];
    for (const mime of candidates) {
      if (MediaRecorder.isTypeSupported(mime)) {
        return mime;
      }
    }
    return '';
  };

  const startRecording = async () => {
    setPermissionError(null);
    audioChunksRef.current = [];
    setIsSimulated(false);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('NOT_SUPPORTED');
      }

      // Request stream with basic reliable constraints (avoids device-specific OverconstrainedError)
      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      } catch (err1: any) {
        // Fallback for strict browser policies
        const legacyGUM = (navigator as any).getUserMedia || (navigator as any).webkitGetUserMedia || (navigator as any).mozGetUserMedia;
        if (legacyGUM) {
          stream = await new Promise((resolve, reject) => {
            legacyGUM.call(navigator, { audio: true }, resolve, reject);
          });
        } else {
          throw err1;
        }
      }
      streamRef.current = stream;

      // Setup Web Audio analyser for real-time visual waves (safe execution)
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          const audioCtx = new AudioCtx();
          if (audioCtx.state === 'suspended') {
            audioCtx.resume().catch(() => {});
          }
          audioCtxRef.current = audioCtx;
          const source = audioCtx.createMediaStreamSource(stream);
          const analyser = audioCtx.createAnalyser();
          analyser.fftSize = 64;
          source.connect(analyser);
          analyserRef.current = analyser;

          const dataArray = new Uint8Array(analyser.frequencyBinCount);
          const updateMeter = () => {
            if (analyserRef.current) {
              analyserRef.current.getByteFrequencyData(dataArray);
              let sum = 0;
              for (let i = 0; i < dataArray.length; i++) {
                sum += dataArray[i];
              }
              const avg = sum / dataArray.length;
              setVolumeLevel(Math.min(100, Math.round((avg / 128) * 100)));
            }
            animFrameRef.current = requestAnimationFrame(updateMeter);
          };
          updateMeter();
        }
      } catch (err) {
        console.warn('AudioContext visualization not available:', err);
      }

      // Instantiate MediaRecorder with cross-browser MIME detection
      const bestMime = getSupportedMimeType();
      let mediaRecorder: MediaRecorder;
      try {
        mediaRecorder = bestMime ? new MediaRecorder(stream, { mimeType: bestMime }) : new MediaRecorder(stream);
      } catch {
        mediaRecorder = new MediaRecorder(stream);
      }
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const actualMime = mediaRecorder.mimeType || bestMime || 'audio/webm';
        const audioBlob = new Blob(audioChunksRef.current, { type: actualMime });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);

        const reader = new FileReader();
        reader.onloadend = () => {
          setAudioBase64(reader.result as string);
        };
        reader.readAsDataURL(audioBlob);

        // Release hardware mic tracks
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(t => t.stop());
          streamRef.current = null;
        }
      };

      // Start recording with safe chunking
      try {
        mediaRecorder.start(250);
      } catch {
        mediaRecorder.start();
      }
      setRecordState('recording');
      setDuration(0);

      timerRef.current = setInterval(() => {
        setDuration(prev => {
          if (prev >= 180) { // Max 3 minutes
            stopRecording();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (err: any) {
      console.error('Microphone access error:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError' || err.name === 'SecurityError') {
        setPermissionError('Trình duyệt hoặc khung hiển thị chưa được cấp quyền micro. Em hãy bấm vào biểu tượng chiếc ổ khóa 🔒 trên thanh địa chỉ web để chọn "Cho phép" (Allow) micro nhé, hoặc em có thể dùng tính năng "Thử ghi âm mẫu" ngay bên dưới!');
      } else if (err.message === 'NOT_SUPPORTED') {
        setPermissionError('Thiết bị hoặc trình duyệt hiện tại chưa hỗ trợ ghi âm trực tiếp.');
      } else {
        setPermissionError('Chưa kết nối được với micro thiết bị. Em có thể bật "Thử ghi âm mẫu" hoặc chuyển sang viết lời nhắn nhé.');
      }
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.pause();
      setRecordState('paused');
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'paused') {
      mediaRecorderRef.current.resume();
      setRecordState('recording');
      timerRef.current = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
    }
  };

  const stopRecording = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.requestData();
      } catch {}
      mediaRecorderRef.current.stop();
      setRecordState('stopped');
    }
  };

  const resetRecording = () => {
    cleanupResources();
    setAudioUrl(null);
    setAudioBase64(null);
    setDuration(0);
    setRecordState('idle');
    setIsPlaying(false);
    setIsSimulated(false);
    setVolumeLevel(0);
  };

  // Simulated Voice Memo (For test / simulation when mic hardware is missing)
  const handleLoadDemoAudio = () => {
    resetRecording();
    setIsSimulated(true);

    // Create synthesized friendly voice audio via Web Audio API
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      const sampleRate = 22050;
      const numSeconds = 4;
      const buffer = ctx.createBuffer(1, sampleRate * numSeconds, sampleRate);
      const data = buffer.getChannelData(0);

      // Generate soft melodic pleasant chime tone
      for (let i = 0; i < sampleRate * numSeconds; i++) {
        const t = i / sampleRate;
        const note = Math.sin(2 * Math.PI * 440 * t) * Math.exp(-t * 1.5) +
                     Math.sin(2 * Math.PI * 554.37 * t) * Math.exp(-t * 2) * 0.5 +
                     Math.sin(2 * Math.PI * 659.25 * t) * Math.exp(-t * 2.5) * 0.3;
        data[i] = note * 0.4;
      }

      // Encode into WAV
      const wavBlob = audioBufferToWav(buffer);
      const url = URL.createObjectURL(wavBlob);
      setAudioUrl(url);

      const reader = new FileReader();
      reader.onloadend = () => {
        setAudioBase64(reader.result as string);
      };
      reader.readAsDataURL(wavBlob);

      setDuration(4);
      setRecordState('stopped');
      setPermissionError(null);
    } catch (e) {
      console.error('Demo audio synth error:', e);
    }
  };

  // Helper WAV encoder
  function audioBufferToWav(buffer: AudioBuffer): Blob {
    const numOfChan = buffer.numberOfChannels;
    const length = buffer.length * numOfChan * 2 + 44;
    const outBuffer = new ArrayBuffer(length);
    const view = new DataView(outBuffer);
    const channels: Float32Array[] = [];
    let sample = 0;
    let offset = 0;
    let pos = 0;

    function setUint16(data: any) { view.setUint16(pos, data, true); pos += 2; }
    function setUint32(data: any) { view.setUint32(pos, data, true); pos += 4; }

    setUint32(0x46464952); // "RIFF"
    setUint32(length - 8);
    setUint32(0x45564157); // "WAVE"
    setUint32(0x20746d66); // "fmt "
    setUint32(16);
    setUint16(1);
    setUint16(numOfChan);
    setUint32(buffer.sampleRate);
    setUint32(buffer.sampleRate * 2 * numOfChan);
    setUint16(numOfChan * 2);
    setUint16(16);
    setUint32(0x61746164); // "data"
    setUint32(length - pos - 4);

    for (let i = 0; i < buffer.numberOfChannels; i++) {
      channels.push(buffer.getChannelData(i));
    }

    while (pos < length) {
      for (let i = 0; i < numOfChan; i++) {
        sample = Math.max(-1, Math.min(1, channels[i][offset]));
        sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767) | 0;
        view.setInt16(pos, sample, true);
        pos += 2;
      }
      offset++;
    }
    return new Blob([outBuffer], { type: 'audio/wav' });
  }

  const togglePlayback = () => {
    if (!audioPlayerRef.current) return;
    if (isPlaying) {
      audioPlayerRef.current.pause();
      setIsPlaying(false);
    } else {
      audioPlayerRef.current.play();
      setIsPlaying(true);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSendVoice = async () => {
    if (!audioBase64) return;
    setIsSubmitting(true);

    const res = await apiClient.submitEntry({
      type: 'voice_recording',
      emotion,
      topic: 'chuyen-khac',
      supportLevel: 'chia-se',
      content: `[Bản ghi âm giọng nói tâm sự • Thời lượng: ${formatTime(duration)}]${isSimulated ? ' (Bản ghi âm thử nghiệm)' : ''}`,
      audioData: audioBase64,
      audioDuration: duration,
      studentName: isAnonymous ? 'Học sinh ẩn danh' : (studentName.trim() || 'Học sinh tiểu học'),
      studentGrade: isAnonymous ? '' : studentGrade.trim(),
      isAnonymous,
    });

    setIsSubmitting(false);
    if (res.success) {
      onSuccess();
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* 3D Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-500 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-sky-200 border-t border-white/40">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold mb-2 border border-white/30">
              <Mic className="w-3.5 h-3.5" />
              Góc Ghi Âm Giọng Nói
            </span>
            <h2 className="text-2xl sm:text-3xl font-black drop-shadow-sm">
              Ghi Âm Tâm Sự Của Em
            </h2>
            <p className="text-white/90 text-xs sm:text-sm mt-1 max-w-md leading-relaxed">
              Hãy nói ra điều trong lòng bằng chính giọng nói thân thương của em. Thầy cô luôn lắng nghe và thấu hiểu!
            </p>
          </div>
          <div className="text-5xl hidden sm:block animate-bounce drop-shadow-md">
            🎙️✨
          </div>
        </div>
      </div>

      {permissionError ? (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-rose-200 shadow-lg text-center space-y-5">
          <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
            <AlertCircle className="w-9 h-9" />
          </div>
          <div>
            <h4 className="font-extrabold text-base sm:text-lg text-slate-800">
              Chưa Thể Mở Micro
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 mt-1.5 max-w-md mx-auto leading-relaxed">
              {permissionError}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={startRecording}
              className="px-5 py-2.5 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white font-extrabold text-xs sm:text-sm shadow-md cursor-pointer flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Thử cấp quyền lại</span>
            </button>

            <button
              onClick={handleLoadDemoAudio}
              className="px-5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs sm:text-sm shadow-md cursor-pointer flex items-center gap-2"
            >
              <Headphones className="w-4 h-4" />
              <span>Chạy thử giọng nói mẫu</span>
            </button>

            <button
              onClick={onSwitchToText}
              className="px-5 py-2.5 rounded-2xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs sm:text-sm cursor-pointer flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              <span>Chuyển sang viết lời nhắn</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sky-100 shadow-md space-y-6 text-center">
          {/* 3D Microphone Sphere with Live Audio Wave Animation */}
          <div className="relative flex flex-col justify-center items-center py-4">
            {recordState === 'recording' && (
              <>
                <div 
                  className="absolute rounded-full bg-rose-400/20 transition-all duration-150"
                  style={{ width: `${140 + volumeLevel * 1.2}px`, height: `${140 + volumeLevel * 1.2}px` }}
                />
                <div 
                  className="absolute rounded-full bg-rose-400/10 transition-all duration-200"
                  style={{ width: `${180 + volumeLevel * 1.8}px`, height: `${180 + volumeLevel * 1.8}px` }}
                />
              </>
            )}

            {/* 3D Glossy Mic Orb */}
            <div
              className={`w-32 h-32 rounded-3xl flex items-center justify-center shadow-2xl transition-all duration-300 relative border-4 ${
                recordState === 'recording'
                  ? 'bg-gradient-to-tr from-rose-600 via-rose-500 to-amber-400 border-rose-300 text-white scale-110 shadow-rose-300'
                  : recordState === 'paused'
                  ? 'bg-gradient-to-tr from-amber-500 to-yellow-400 border-amber-300 text-white shadow-amber-200'
                  : recordState === 'stopped'
                  ? 'bg-gradient-to-tr from-emerald-500 to-teal-400 border-emerald-300 text-white shadow-emerald-200'
                  : 'bg-gradient-to-tr from-sky-400 via-blue-500 to-indigo-500 border-sky-200 text-white shadow-sky-200 hover:scale-105'
              }`}
            >
              {/* Gloss highlight on top */}
              <div className="absolute top-2 left-3 right-3 h-8 bg-white/25 rounded-2xl pointer-events-none" />
              <Mic className="w-14 h-14 drop-shadow-md" />
            </div>

            {/* Live Visualizer Waves (Real-time reactivity) */}
            {recordState === 'recording' && (
              <div className="flex items-center gap-1.5 mt-5 h-8">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => {
                  const barH = Math.max(6, Math.min(32, (volumeLevel * 0.4) + Math.sin(i * 1.2 + duration * 3) * 12 + 10));
                  return (
                    <div
                      key={i}
                      className="w-1.5 bg-gradient-to-t from-rose-500 to-amber-400 rounded-full transition-all duration-75"
                      style={{ height: `${barH}px` }}
                    />
                  );
                })}
              </div>
            )}
          </div>

          {/* Time & State Counter */}
          <div>
            <div className="text-4xl font-black text-slate-800 tracking-wider font-mono">
              {formatTime(duration)}
            </div>
            <p className="text-xs font-bold text-slate-500 mt-1">
              {recordState === 'idle' && 'Bấm "Bắt đầu ghi âm" bên dưới để nói'}
              {recordState === 'recording' && '🔴 Đang ghi âm... Em hãy nói to, rõ ràng nhé (Tối đa 3 phút)'}
              {recordState === 'paused' && '⏸️ Đang tạm dừng'}
              {recordState === 'stopped' && (isSimulated ? '🎵 Đã tạo bản ghi âm thử nghiệm! Em hãy nghe lại' : '✅ Đã hoàn tất bản ghi âm! Em có thể nghe lại trước khi gửi')}
            </p>
          </div>

          {/* Audio Player if stopped */}
          {audioUrl && (
            <div className="bg-sky-50 rounded-3xl p-4 sm:p-5 border-2 border-sky-200 max-w-md mx-auto space-y-3">
              <audio
                ref={audioPlayerRef}
                src={audioUrl}
                onEnded={() => setIsPlaying(false)}
                className="hidden"
              />
              <div className="flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={togglePlayback}
                  className="px-5 py-2.5 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white font-extrabold text-xs sm:text-sm flex items-center gap-2 cursor-pointer shadow-md shadow-sky-200"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  <span>{isPlaying ? 'Tạm dừng nghe' : 'Nghe lại giọng nói'}</span>
                </button>
                <button
                  type="button"
                  onClick={resetRecording}
                  className="px-4 py-2.5 rounded-2xl border border-slate-300 text-slate-700 hover:bg-white font-bold text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Ghi âm lại</span>
                </button>
              </div>
            </div>
          )}

          {/* 3D Action Controls */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {recordState === 'idle' && (
              <>
                <button
                  type="button"
                  onClick={startRecording}
                  className="px-8 py-4 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-black text-base shadow-xl shadow-rose-300/60 flex items-center gap-2 cursor-pointer hover:scale-105 active:scale-95 transition-all border-b-4 border-rose-700"
                >
                  <Mic className="w-5 h-5" />
                  <span>Bắt đầu ghi âm</span>
                </button>

                <button
                  type="button"
                  onClick={handleLoadDemoAudio}
                  className="px-4 py-3.5 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                  title="Chạy thử nghiệm tính năng nghe và gửi"
                >
                  <Headphones className="w-4 h-4" />
                  <span>Thử ghi âm mẫu</span>
                </button>
              </>
            )}

            {recordState === 'recording' && (
              <>
                <button
                  type="button"
                  onClick={pauseRecording}
                  className="px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <Pause className="w-4 h-4" />
                  <span>Tạm dừng</span>
                </button>
                <button
                  type="button"
                  onClick={stopRecording}
                  className="px-7 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-sm flex items-center gap-2 cursor-pointer shadow-lg shadow-rose-200"
                >
                  <Square className="w-4 h-4" />
                  <span>Hoàn thành & Nghe lại</span>
                </button>
              </>
            )}

            {recordState === 'paused' && (
              <>
                <button
                  type="button"
                  onClick={resumeRecording}
                  className="px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <Play className="w-4 h-4" />
                  <span>Tiếp tục ghi âm</span>
                </button>
                <button
                  type="button"
                  onClick={stopRecording}
                  className="px-6 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <Square className="w-4 h-4" />
                  <span>Dừng ghi âm</span>
                </button>
              </>
            )}
          </div>

          {/* Optional Info & Submission Section */}
          {audioUrl && (
            <div className="pt-4 border-t border-slate-100 text-left space-y-4 max-w-md mx-auto">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">Thông tin người gửi:</span>
                <label className="flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="w-3.5 h-3.5 text-sky-500 rounded"
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
                    className="px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-sky-300"
                  />
                  <input
                    type="text"
                    value={studentGrade}
                    onChange={(e) => setStudentGrade(e.target.value)}
                    placeholder="Lớp của em (tùy chọn)"
                    className="px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-sky-300"
                  />
                </div>
              )}

              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleSendVoice}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-black text-sm sm:text-base shadow-xl shadow-sky-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 border-b-4 border-blue-800 hover:scale-[1.01] active:scale-[0.99] transition-transform"
              >
                <Send className="w-5 h-5" />
                <span>{isSubmitting ? 'Đang gửi bản ghi âm...' : 'Gửi lời tâm sự tới thầy cô'}</span>
              </button>
            </div>
          )}

          {/* Friendly Privacy Notice */}
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-500 flex items-center justify-center gap-2">
            <Info className="w-4 h-4 text-sky-500 shrink-0" />
            <span>Chỉ lưu bản ghi khi em bấm "Gửi lời tâm sự". Không ghi âm lén và bảo mật an toàn.</span>
          </div>
        </div>
      )}
    </div>
  );
};
