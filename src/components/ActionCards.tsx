import React from 'react';
import { motion } from 'framer-motion';
import { BookHeart, Mic, FileText, Image as ImageIcon, HeartHandshake, ArrowRight, Sparkles } from 'lucide-react';
import { NavTab } from './Sidebar';

interface ActionCardsProps {
  onNavigate: (tab: NavTab) => void;
  onOpenEmergency: () => void;
}

export const ActionCards: React.FC<ActionCardsProps> = ({
  onNavigate,
  onOpenEmergency,
}) => {
  const actions = [
    {
      id: 'journal' as NavTab,
      title: 'Em muốn chia sẻ',
      subtitle: 'Ghi lại cảm xúc, điều đang suy nghĩ',
      icon: BookHeart,
      cardBg: 'bg-gradient-to-b from-[#FFF5F7] via-[#FFE4EC] to-[#FFD6E3]',
      borderColor: 'border-[#FFC0D3]',
      bevelColor: 'border-b-[5px] border-[#F43F5E]',
      shadowColor: 'shadow-rose-100 hover:shadow-rose-200/80',
      iconBg: 'bg-gradient-to-tr from-[#F43F5E] to-[#FB7185] text-white',
      titleColor: 'text-[#BE123C]',
      btnBg: 'bg-[#F43F5E] text-white shadow-rose-200',
      action: () => onNavigate('journal'),
    },
    {
      id: 'voice' as NavTab,
      title: 'Em muốn ghi âm',
      subtitle: 'Ghi âm tâm sự của em một cách an toàn',
      icon: Mic,
      cardBg: 'bg-gradient-to-b from-[#FFFDF0] via-[#FEF3C7] to-[#FDE68A]',
      borderColor: 'border-[#FDE68A]',
      bevelColor: 'border-b-[5px] border-[#F59E0B]',
      shadowColor: 'shadow-amber-100 hover:shadow-amber-200/80',
      iconBg: 'bg-gradient-to-tr from-[#F59E0B] to-[#FBBF24] text-white',
      titleColor: 'text-[#92400E]',
      btnBg: 'bg-[#F59E0B] text-white shadow-amber-200',
      action: () => onNavigate('voice'),
    },
    {
      id: 'write' as NavTab,
      title: 'Em muốn gửi lời nhắn',
      subtitle: 'Viết những điều em muốn nói',
      icon: FileText,
      cardBg: 'bg-gradient-to-b from-[#F0F9FF] via-[#E0F2FE] to-[#BAE6FD]',
      borderColor: 'border-[#BAE6FD]',
      bevelColor: 'border-b-[5px] border-[#0284C7]',
      shadowColor: 'shadow-sky-100 hover:shadow-sky-200/80',
      iconBg: 'bg-gradient-to-tr from-[#0284C7] to-[#38BDF8] text-white',
      titleColor: 'text-[#075985]',
      btnBg: 'bg-[#0284C7] text-white shadow-sky-200',
      action: () => onNavigate('write'),
    },
    {
      id: 'image' as NavTab,
      title: 'Em muốn gửi hình ảnh',
      subtitle: 'Chia sẻ hình ảnh nếu em muốn',
      icon: ImageIcon,
      cardBg: 'bg-gradient-to-b from-[#FAF5FF] via-[#F3E8FF] to-[#DDD6FE]',
      borderColor: 'border-[#DDD6FE]',
      bevelColor: 'border-b-[5px] border-[#7C3AED]',
      shadowColor: 'shadow-purple-100 hover:shadow-purple-200/80',
      iconBg: 'bg-gradient-to-tr from-[#7C3AED] to-[#A78BFA] text-white',
      titleColor: 'text-[#5B21B6]',
      btnBg: 'bg-[#7C3AED] text-white shadow-purple-200',
      action: () => onNavigate('image'),
    },
    {
      id: 'emergency' as const,
      title: 'Em cần thầy cô giúp đỡ',
      subtitle: 'Khi em gặp khó khăn hoặc cảm thấy không an toàn',
      icon: HeartHandshake,
      cardBg: 'bg-gradient-to-b from-[#FFF1F2] via-[#FFE4E6] to-[#FECDD3]',
      borderColor: 'border-[#FECDD3]',
      bevelColor: 'border-b-[5px] border-[#E11D48]',
      shadowColor: 'shadow-red-200/80 hover:shadow-red-300',
      iconBg: 'bg-gradient-to-tr from-[#E11D48] to-[#F43F5E] text-white',
      titleColor: 'text-[#9F1239]',
      btnBg: 'bg-[#E11D48] text-white shadow-red-200',
      action: onOpenEmergency,
      highlight: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4.5 w-full">
      {actions.map((item, idx) => {
        const Icon = item.icon;
        return (
          <motion.button
            key={idx}
            onClick={item.action}
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + idx * 0.08, type: 'spring', stiffness: 350, damping: 25 }}
            whileHover={{ 
              y: -8, 
              scale: 1.04,
              transition: { type: 'spring', stiffness: 400, damping: 20 }
            }}
            whileTap={{ scale: 0.95, y: 2 }}
            className={`group rounded-[28px] border-2 p-5 flex flex-col justify-between items-center text-center transition-all cursor-pointer shadow-md relative overflow-hidden ${item.cardBg} ${item.borderColor} ${item.bevelColor} ${item.shadowColor} active:border-b-[2px]`}
          >
            {/* Top 3D highlight sheen */}
            <div className="absolute top-1.5 left-4 right-4 h-3 bg-white/50 rounded-full pointer-events-none" />

            {/* 3D Circular Icon with Hover Pulse */}
            <motion.div 
              whileHover={{ rotate: [0, -10, 10, 0], scale: 1.15 }}
              transition={{ duration: 0.35 }}
              className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-md mb-3.5 ${item.iconBg} border border-white/60`}
            >
              <Icon className="w-7 h-7 drop-shadow-sm" />
            </motion.div>

            {/* Title & Subtitle */}
            <div className="flex-1 flex flex-col justify-center space-y-1">
              <h3 className={`font-black text-sm sm:text-base leading-snug drop-shadow-xs ${item.titleColor}`}>
                {item.title}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed line-clamp-2 font-medium">
                {item.subtitle}
              </p>
            </div>

            {/* 3D Circular Arrow Button */}
            <motion.div
              whileHover={{ scale: 1.18, x: 2 }}
              whileTap={{ scale: 0.9 }}
              className={`mt-3.5 w-8 h-8 rounded-full flex items-center justify-center shadow-sm ${item.btnBg} border border-white/40`}
            >
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </motion.div>
          </motion.button>
        );
      })}
    </div>
  );
};
