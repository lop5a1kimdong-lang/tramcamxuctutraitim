import React from 'react';
import { 
  Home, 
  BookHeart, 
  Mic, 
  Send, 
  Image as ImageIcon, 
  HeartHandshake, 
  ShieldCheck, 
  LockKeyhole,
  GraduationCap
} from 'lucide-react';
import { SidebarKidsWithHeart } from './Illustrations';

export type NavTab = 'home' | 'journal' | 'voice' | 'write' | 'image' | 'kindness' | 'teacher';

interface SidebarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenTeacherLogin: () => void;
  isTeacherLoggedIn: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  onOpenTeacherLogin,
  isTeacherLoggedIn,
}) => {
  const menuItems = [
    {
      id: 'home' as NavTab,
      label: 'Trang chủ',
      icon: Home,
      color: 'text-sky-500',
      activeBg: 'bg-sky-100 text-sky-800 font-bold shadow-sm',
    },
    {
      id: 'journal' as NavTab,
      label: 'Nhật ký cảm xúc',
      icon: BookHeart,
      color: 'text-pink-500',
      activeBg: 'bg-pink-100 text-pink-800 font-bold shadow-sm',
    },
    {
      id: 'voice' as NavTab,
      label: 'Ghi âm tâm sự',
      icon: Mic,
      color: 'text-blue-500',
      activeBg: 'bg-blue-100 text-blue-800 font-bold shadow-sm',
    },
    {
      id: 'write' as NavTab,
      label: 'Viết lời nhắn',
      icon: Send,
      color: 'text-emerald-500',
      activeBg: 'bg-emerald-100 text-emerald-800 font-bold shadow-sm',
    },
    {
      id: 'image' as NavTab,
      label: 'Gửi hình ảnh',
      icon: ImageIcon,
      color: 'text-purple-500',
      activeBg: 'bg-purple-100 text-purple-800 font-bold shadow-sm',
    },
    {
      id: 'kindness' as NavTab,
      label: 'Lời nhắn yêu thương',
      icon: HeartHandshake,
      color: 'text-rose-500',
      activeBg: 'bg-rose-100 text-rose-800 font-bold shadow-sm',
    },
  ];

  return (
    <aside className="w-64 bg-white/95 backdrop-blur-md border-r border-sky-100 flex flex-col justify-between p-4 shadow-sm h-full shrink-0">
      {/* Brand Logo Header */}
      <div>
        <button
          onClick={() => onSelectTab('home')}
          className="flex items-center gap-3 w-full p-2 rounded-2xl hover:bg-sky-50 transition-all text-left mb-6 group cursor-pointer"
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-400 via-rose-300 to-amber-200 flex items-center justify-center shadow-md shadow-pink-200 group-hover:scale-105 transition-transform shrink-0">
            <span className="text-2xl animate-pulse">💖</span>
          </div>
          <div>
            <h1 className="font-extrabold text-base text-sky-900 leading-tight">
              Trạm Cảm Xúc
            </h1>
            <p className="font-bold text-xs text-rose-500">
              Từ Trái Tim
            </p>
          </div>
        </button>

        {/* Navigation Links */}
        <nav className="space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  isActive
                    ? item.activeBg
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className={`p-1 rounded-xl ${isActive ? 'bg-white shadow-xs' : ''}`}>
                  <Icon className={`w-5 h-5 ${item.color}`} />
                </div>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom section: Emotional Support Mascot Card */}
      <div className="space-y-3 pt-4">
        <div className="bg-gradient-to-br from-pink-50/90 via-sky-50 to-indigo-50 border border-pink-200/80 rounded-3xl p-3 text-center shadow-xs overflow-hidden">
          {/* Mini Cute Mascot Illustration Matching Mockup */}
          <div className="flex justify-center mb-1">
            <SidebarKidsWithHeart className="w-40 h-28 drop-shadow-sm" />
          </div>
          <h4 className="font-black text-sky-900 text-sm tracking-tight mt-1">
            Bạn không đơn độc!
          </h4>
          <p className="text-[11px] text-sky-700/80 mt-0.5 leading-snug font-medium">
            Luôn có thầy cô, bạn bè và những người quan tâm đến bạn!
          </p>
        </div>

        {/* Teacher portal toggle button */}
        <button
          onClick={onOpenTeacherLogin}
          className={`w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
            isTeacherLoggedIn
              ? 'bg-amber-100/80 border-amber-300 text-amber-900 hover:bg-amber-200/80'
              : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-800'
          }`}
          title="Dành riêng cho giáo viên phụ trách tâm lý"
        >
          {isTeacherLoggedIn ? (
            <>
              <GraduationCap className="w-4 h-4 text-amber-600" />
              <span>Quản trị Giáo viên</span>
            </>
          ) : (
            <>
              <LockKeyhole className="w-3.5 h-3.5 text-slate-400" />
              <span>Khu vực Giáo viên</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
};
