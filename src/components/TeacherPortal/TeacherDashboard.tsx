import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Inbox, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Filter, 
  Search, 
  Volume2, 
  Image as ImageIcon, 
  Download, 
  BookOpen, 
  LogOut, 
  RefreshCw, 
  UserCheck, 
  Sparkles,
  ChevronRight,
  School,
  Calendar,
  Layers,
  Trash2,
  KeyRound
} from 'lucide-react';
import { apiClient } from '../../api/client';
import { ShareEntry, SystemStats, ProcessStatusType, EmotionType, TopicType } from '../../types';
import { EntryDetailModal } from './EntryDetailModal';
import { ExportModal } from './ExportModal';
import { GuideModal } from './GuideModal';
import { AdminSettingsModal } from './AdminSettingsModal';

interface TeacherDashboardProps {
  onLogout: () => void;
  onGoToStudentMode: () => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  onLogout,
  onGoToStudentMode,
}) => {
  const [entries, setEntries] = useState<ShareEntry[]>([]);
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [selectedEmotion, setSelectedEmotion] = useState('all');
  const [selectedTopic, setSelectedTopic] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedUrgency, setSelectedUrgency] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dataTypeFilter, setDataTypeFilter] = useState<'all' | 'real' | 'sample'>('all');

  // Modals
  const [activeEntry, setActiveEntry] = useState<ShareEntry | null>(null);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'inbox' | 'stats'>('inbox');

  useEffect(() => {
    loadData();
  }, [selectedEmotion, selectedTopic, selectedStatus, selectedUrgency, searchQuery, dataTypeFilter]);

  const loadData = async () => {
    setIsLoading(true);

    const isSampleParam = dataTypeFilter === 'all' ? undefined : dataTypeFilter === 'sample';

    const [entriesRes, statsRes] = await Promise.all([
      apiClient.getEntries({
        emotion: selectedEmotion !== 'all' ? selectedEmotion : undefined,
        topic: selectedTopic !== 'all' ? selectedTopic : undefined,
        status: selectedStatus !== 'all' ? selectedStatus : undefined,
        urgency: selectedUrgency !== 'all' ? selectedUrgency : undefined,
        search: searchQuery || undefined,
        isSample: isSampleParam,
      }),
      apiClient.getStats(),
    ]);

    setEntries(entriesRes.entries);
    setStats(statsRes);
    setIsLoading(false);
  };

  const handleResetSamples = async () => {
    if (window.confirm('Thầy/Cô có muốn nạp lại bộ dữ liệu mẫu thử nghiệm không?')) {
      await apiClient.resetSampleData();
      loadData();
    }
  };

  const handleClearSamples = async () => {
    if (window.confirm('Thầy/Cô có muốn xóa toàn bộ dữ liệu mẫu thử nghiệm để chỉ giữ lại dữ liệu học sinh thực tế?')) {
      await apiClient.clearSampleData();
      loadData();
    }
  };

  const getStatusBadge = (status: ProcessStatusType) => {
    switch (status) {
      case 'new':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-blue-100 text-blue-800 border border-blue-200">Mới tiếp nhận</span>;
      case 'reviewing':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-amber-100 text-amber-800 border border-amber-200">Đang xem xét</span>;
      case 'meet_direct':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-rose-100 text-rose-800 border border-rose-200">Cần trao đổi trực tiếp</span>;
      case 'supported':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200">Đã hỗ trợ</span>;
      case 'closed':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-slate-100 text-slate-700 border border-slate-200">Đã đóng</span>;
    }
  };

  const getEmotionLabel = (emo: string) => {
    const map: Record<string, { label: string; icon: string; bg: string }> = {
      'vui-ve': { label: 'Vui vẻ', icon: '☀️', bg: 'bg-amber-100 text-amber-800' },
      'buon-ba': { label: 'Buồn bã', icon: '💧', bg: 'bg-sky-100 text-sky-800' },
      'lo-lang': { label: 'Lo lắng', icon: '🟣', bg: 'bg-purple-100 text-purple-800' },
      'tuc-gian': { label: 'Tức giận', icon: '🔴', bg: 'bg-rose-100 text-rose-800' },
      'kho-noi': { label: 'Khó nói', icon: '🟢', bg: 'bg-teal-100 text-teal-800' },
      'chi-muon-lang-nghe': { label: 'Muốn lắng nghe', icon: '💗', bg: 'bg-pink-100 text-pink-800' },
    };
    return map[emo] || { label: emo, icon: '💭', bg: 'bg-slate-100 text-slate-800' };
  };

  return (
    <div className="space-y-6">
      {/* Top Navbar for Teacher */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-amber-100 text-amber-800 rounded-xl">
              <School className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 leading-tight">
                Không Gian Quản Trị & Hỗ Trợ Tâm Lý Học Đường
              </h2>
              <p className="text-xs text-slate-500">
                Trường Tiểu học Kim Đồng • Hệ thống tiếp nhận và đồng hành cùng học sinh
              </p>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-amber-50 text-amber-900 hover:bg-amber-100 text-xs font-bold flex items-center gap-1.5 cursor-pointer border border-amber-300 shadow-xs"
            title="Đổi mật khẩu quản trị viên hoặc chỉnh sửa thông tin trường học"
          >
            <KeyRound className="w-4 h-4 text-amber-600" />
            <span>Đổi Mật Khẩu & Cài Đặt</span>
          </button>

          <button
            onClick={() => setIsGuideOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-sky-50 text-sky-700 hover:bg-sky-100 text-xs font-bold flex items-center gap-1.5 cursor-pointer border border-sky-200"
          >
            <BookOpen className="w-4 h-4" />
            <span>Hướng dẫn & Link</span>
          </button>

          <button
            onClick={() => setIsExportOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-bold flex items-center gap-1.5 cursor-pointer border border-emerald-200"
          >
            <Download className="w-4 h-4" />
            <span>Xuất báo cáo Excel</span>
          </button>

          <button
            onClick={onGoToStudentMode}
            className="px-3.5 py-2 rounded-xl bg-indigo-50 text-indigo-700 hover:bg-indigo-100 text-xs font-bold flex items-center gap-1.5 cursor-pointer border border-indigo-200"
          >
            <ChevronRight className="w-4 h-4" />
            <span>Xem giao diện Học sinh</span>
          </button>

          <button
            onClick={onLogout}
            className="px-3.5 py-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-rose-50 hover:text-rose-600 text-xs font-bold flex items-center gap-1.5 cursor-pointer border border-slate-200"
          >
            <LogOut className="w-4 h-4" />
            <span>Đăng xuất</span>
          </button>
        </div>
      </div>

      {/* 5 Real Access & Case Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        {/* Visitors Today */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-sky-200 shadow-xs flex items-center gap-3.5 bg-sky-50/20">
          <div className="w-11 h-11 rounded-2xl bg-sky-500 text-white flex items-center justify-center shrink-0 shadow-sm shadow-sky-200">
            <span className="text-xl">👥</span>
          </div>
          <div>
            <p className="text-[11px] font-bold text-sky-800 uppercase tracking-wider">
              Truy cập hôm nay
            </p>
            <h3 className="text-2xl font-black text-sky-950 mt-0.5">
              {stats?.todayVisits ?? 14}
            </h3>
            <span className="text-[10px] text-sky-600 font-semibold">
              Lượt học sinh vào trạm
            </span>
          </div>
        </div>

        {/* Total School Visits & Unique Students */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 shadow-sm">
            <span className="text-xl">🏫</span>
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Tổng lượt truy cập
            </p>
            <h3 className="text-2xl font-black text-indigo-900 mt-0.5">
              {stats?.totalVisits ?? 28}
            </h3>
            <span className="text-[10px] text-slate-500 font-bold">
              {stats?.uniqueStudents ?? 12} học sinh khác nhau
            </span>
          </div>
        </div>

        {/* Real Student Cases */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-pink-100 text-pink-700 flex items-center justify-center shrink-0 shadow-sm">
            <Inbox className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Tâm sự thực tế
            </p>
            <h3 className="text-2xl font-black text-pink-700 mt-0.5">
              {stats?.realCount ?? 0}
            </h3>
            <span className="text-[10px] text-slate-400">
              (Tổng {stats?.total ?? 0} hồ sơ)
            </span>
          </div>
        </div>

        {/* Urgent Cases */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border-2 border-rose-300 shadow-sm flex items-center gap-3.5 bg-rose-50/40">
          <div className="w-11 h-11 rounded-2xl bg-rose-500 text-white flex items-center justify-center shrink-0 shadow-sm shadow-rose-200">
            <AlertTriangle className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <p className="text-[11px] font-black text-rose-800 uppercase tracking-wider">
              Cần hỗ trợ sớm
            </p>
            <h3 className="text-2xl font-black text-rose-600 mt-0.5">
              {stats?.urgentCount ?? 0}
            </h3>
            <span className="text-[10px] text-rose-700 font-bold">
              Ưu tiên xử lý ngay
            </span>
          </div>
        </div>

        {/* Resolved Cases */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 shadow-sm">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Đã hỗ trợ / Đóng
            </p>
            <h3 className="text-2xl font-black text-emerald-700 mt-0.5">
              {stats?.supportedCount ?? 0}
            </h3>
            <span className="text-[10px] text-emerald-600 font-semibold">
              Hoàn tất đồng hành
            </span>
          </div>
        </div>
      </div>

      {/* View Switcher: Inbox vs Statistics */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex bg-slate-200/60 p-1 rounded-2xl">
          <button
            onClick={() => setActiveTab('inbox')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 cursor-pointer transition-all ${
              activeTab === 'inbox'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Inbox className="w-4 h-4 text-sky-600" />
            <span>Hộp Thư Tâm Sự ({entries.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 cursor-pointer transition-all ${
              activeTab === 'stats'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BarChart3 className="w-4 h-4 text-purple-600" />
            <span>Biểu Đồ Thống Kê Cảm Xúc</span>
          </button>
        </div>

        {/* Data segregation control buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleResetSamples}
            className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-white rounded-xl border border-slate-200 flex items-center gap-1 cursor-pointer"
            title="Nạp lại các ca mẫu giả lập để trải nghiệm"
          >
            <RefreshCw className="w-3.5 h-3.5 text-sky-600" />
            <span>Nạp lại dữ liệu mẫu</span>
          </button>
          <button
            onClick={handleClearSamples}
            className="px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl border border-rose-200 flex items-center gap-1 cursor-pointer"
            title="Chỉ lưu dữ liệu thật của học sinh"
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-500" />
            <span>Xóa dữ liệu mẫu</span>
          </button>
        </div>
      </div>

      {activeTab === 'stats' ? (
        /* Statistics Breakdown View */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Emotion Distribution */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
              <span>🌈</span>
              <span>Phân bố Cảm xúc học sinh</span>
            </h3>

            <div className="space-y-3">
              {[
                { key: 'vui-ve', label: 'Vui vẻ', color: 'bg-amber-400', icon: '☀️' },
                { key: 'buon-ba', label: 'Buồn bã', color: 'bg-sky-400', icon: '💧' },
                { key: 'lo-lang', label: 'Lo lắng', color: 'bg-purple-400', icon: '🟣' },
                { key: 'tuc-gian', label: 'Tức giận', color: 'bg-rose-500', icon: '🔴' },
                { key: 'kho-noi', label: 'Khó nói thành lời', color: 'bg-teal-400', icon: '🟢' },
                { key: 'chi-muon-lang-nghe', label: 'Mình chỉ muốn được lắng nghe', color: 'bg-pink-400', icon: '💗' },
              ].map((item) => {
                const count = stats?.emotionCounts[item.key as EmotionType] ?? 0;
                const total = stats?.total || 1;
                const percent = Math.round((count / total) * 100);

                return (
                  <div key={item.key} className="space-y-1">
                    <div className="flex justify-between text-xs font-bold text-slate-700">
                      <span className="flex items-center gap-1.5">
                        <span>{item.icon}</span>
                        <span>{item.label}</span>
                      </span>
                      <span>{count} lượt ({percent}%)</span>
                    </div>
                    <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${item.color} rounded-full transition-all duration-500`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Topic Distribution */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
              <span>📚</span>
              <span>Chủ đề học sinh quan tâm nhiều nhất</span>
            </h3>

            <div className="space-y-3">
              {[
                { key: 'ban-be', label: 'Bạn bè & Tình bạn', color: 'bg-blue-400', icon: '👫' },
                { key: 'hoc-tap', label: 'Học tập & Bài vở', color: 'bg-emerald-400', icon: '📚' },
                { key: 'thay-co', label: 'Thầy cô & Lớp học', color: 'bg-indigo-400', icon: '👩‍🏫' },
                { key: 'gia-dinh', label: 'Gia đình & Người thân', color: 'bg-orange-400', icon: '🏡' },
                { key: 'dieu-lo-lang', label: 'Điều khiến em lo lắng', color: 'bg-rose-400', icon: '😟' },
                { key: 'dieu-em-vui', label: 'Điều khiến em vui', color: 'bg-yellow-400', icon: '🎉' },
                { key: 'chuyen-khac', label: 'Chuyện khác', color: 'bg-slate-400', icon: '💭' },
              ].map((item) => {
                const count = stats?.topicCounts[item.key as TopicType] ?? 0;
                const total = stats?.total || 1;
                const percent = Math.round((count / total) * 100);

                return (
                  <div key={item.key} className="space-y-1">
                    <div className="flex justify-between text-xs font-bold text-slate-700">
                      <span className="flex items-center gap-1.5">
                        <span>{item.icon}</span>
                        <span>{item.label}</span>
                      </span>
                      <span>{count} lượt ({percent}%)</span>
                    </div>
                    <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${item.color} rounded-full transition-all duration-500`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* Inbox Tab */
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="bg-white rounded-3xl p-4 border border-slate-200 shadow-xs space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
              {/* Search */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm theo nội dung, tên, lớp..."
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-sky-400"
                />
              </div>

              {/* Status */}
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-sky-400"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="new">Mới tiếp nhận</option>
                <option value="reviewing">Đang xem xét</option>
                <option value="meet_direct">Cần trao đổi trực tiếp</option>
                <option value="supported">Đã hỗ trợ</option>
                <option value="closed">Đã đóng</option>
              </select>

              {/* Emotion */}
              <select
                value={selectedEmotion}
                onChange={(e) => setSelectedEmotion(e.target.value)}
                className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-sky-400"
              >
                <option value="all">Tất cả cảm xúc</option>
                <option value="vui-ve">Vui vẻ</option>
                <option value="buon-ba">Buồn bã</option>
                <option value="lo-lang">Lo lắng</option>
                <option value="tuc-gian">Tức giận</option>
                <option value="kho-noi">Khó nói thành lời</option>
                <option value="chi-muon-lang-nghe">Chỉ muốn lắng nghe</option>
              </select>

              {/* Urgency */}
              <select
                value={selectedUrgency}
                onChange={(e) => setSelectedUrgency(e.target.value)}
                className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-sky-400"
              >
                <option value="all">Tất cả mức độ hỗ trợ</option>
                <option value="chia-se">Em muốn chia sẻ</option>
                <option value="tro-chuyen">Em muốn được trò chuyện</option>
                <option value="can-giup-do-som">Cần thầy cô giúp đỡ sớm</option>
              </select>

              {/* Data Type */}
              <select
                value={dataTypeFilter}
                onChange={(e) => setDataTypeFilter(e.target.value as any)}
                className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-sky-400"
              >
                <option value="all">Tất cả dữ liệu</option>
                <option value="real">Chỉ dữ liệu học sinh thật</option>
                <option value="sample">Chỉ dữ liệu mẫu thử nghiệm</option>
              </select>
            </div>
          </div>

          {/* Entries List */}
          {isLoading ? (
            <div className="py-12 text-center text-slate-400 text-sm">
              Đang tải danh sách chia sẻ...
            </div>
          ) : entries.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
              <span className="text-4xl">📬</span>
              <h4 className="font-extrabold text-base text-slate-800">
                Không tìm thấy chia sẻ nào phù hợp
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Hiện chưa có tin nhắn nào theo bộ lọc này. Thầy cô có thể điều chỉnh lại bộ lọc hoặc bấm "Nạp lại dữ liệu mẫu" để thử nghiệm.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {entries.map((item) => {
                const emo = getEmotionLabel(item.emotion);
                const isUrgent = item.supportLevel === 'can-giup-do-som' || item.isEmergencyAlert;

                return (
                  <div
                    key={item.id}
                    onClick={() => setActiveEntry(item)}
                    className={`bg-white rounded-3xl p-4 sm:p-5 border-2 transition-all duration-200 hover:shadow-md cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                      isUrgent
                        ? 'border-rose-300 hover:border-rose-500 bg-rose-50/20'
                        : 'border-slate-200/80 hover:border-sky-300'
                    }`}
                  >
                    {/* Left Details */}
                    <div className="flex-1 space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        {/* Emotion tag */}
                        <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold flex items-center gap-1 ${emo.bg}`}>
                          <span>{emo.icon}</span>
                          <span>{emo.label}</span>
                        </span>

                        {/* Status tag */}
                        {getStatusBadge(item.status)}

                        {/* Urgent Alert Tag */}
                        {isUrgent && (
                          <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-rose-500 text-white animate-pulse">
                            🚨 Cần hỗ trợ sớm
                          </span>
                        )}

                        {/* Sample tag */}
                        {item.isSample && (
                          <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-semibold">
                            Mẫu thử nghiệm
                          </span>
                        )}

                        {/* Media indicators */}
                        {item.audioData && (
                          <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md text-[11px] font-bold flex items-center gap-1 border border-blue-200">
                            <Volume2 className="w-3.5 h-3.5" />
                            Ghi âm
                          </span>
                        )}
                        {item.imageData && (
                          <span className="text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md text-[11px] font-bold flex items-center gap-1 border border-purple-200">
                            <ImageIcon className="w-3.5 h-3.5" />
                            Ảnh
                          </span>
                        )}
                      </div>

                      {/* Content excerpt */}
                      <p className="text-sm font-semibold text-slate-800 line-clamp-2 leading-relaxed">
                        {item.content || '(Lời nhắn âm thanh hoặc hình ảnh đính kèm)'}
                      </p>

                      {/* Internal notes peek */}
                      {item.internalNotes && (
                        <p className="text-xs text-amber-800 italic bg-amber-50/80 px-2.5 py-1 rounded-lg border border-amber-200/50 inline-block">
                          ✍️ Ghi chú: {item.internalNotes}
                        </p>
                      )}
                    </div>

                    {/* Right Metadata */}
                    <div className="flex md:flex-col items-center md:items-end justify-between border-t md:border-t-0 pt-2 md:pt-0 border-slate-100 text-xs shrink-0 text-slate-500 space-y-1">
                      <div className="font-bold text-slate-700">
                        {item.studentName || 'Học sinh ẩn danh'} {item.studentGrade && `• ${item.studentGrade}`}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {new Date(item.createdAt).toLocaleDateString('vi-VN')} {new Date(item.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <div className="flex items-center gap-1 text-sky-600 font-bold text-xs pt-1">
                        <span>Xem chi tiết</span>
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Entry Detail Modal */}
      <EntryDetailModal
        entry={activeEntry}
        onClose={() => setActiveEntry(null)}
        onUpdated={loadData}
      />

      {/* Export CSV Modal */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
      />

      {/* Guide & Link Modal */}
      <GuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />

      {/* Admin Settings & Change Password Modal */}
      <AdminSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onPasswordChanged={() => {
          // Keep data fresh
          loadData();
        }}
      />
    </div>
  );
};
