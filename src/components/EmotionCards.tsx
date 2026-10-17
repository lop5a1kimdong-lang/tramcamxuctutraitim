import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { EmotionType } from '../types';
import { HappyAvatar, SadAvatar, WorriedAvatar, AngryAvatar, ShyAvatar } from './Illustrations';
import { Heart, ChevronRight, Sparkles } from 'lucide-react';

interface EmotionCardsProps {
  onSelectEmotion: (emotion: EmotionType) => void;
  selectedEmotion?: EmotionType;
}

interface EmotionItem {
  id: EmotionType;
  label: string;
  emoji: string;
  bgGradient: string;
  borderColor: string;
  bevelColor: string;
  shadowColor: string;
  textColor: string;
  subtitle: string;
  tagBg: string;
  avatar: React.ReactNode;
}

// 3D Motion Card with dynamic tilt physics
const MotionCardItem: React.FC<{
  item: EmotionItem;
  idx: number;
  isSelected: boolean;
  onSelect: () => void;
}> = ({ item, idx, isSelected, onSelect }) => {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    // Moderate tilt angles for child-friendly smoothness
    setRotateX(-(y / (rect.height / 2)) * 12);
    setRotateY((x / (rect.width / 2)) * 12);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.button
      onClick={onSelect}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, scale: 0.9, y: 25 }}
      animate={{ 
        opacity: 1, 
        scale: 1, 
        y: 0,
        rotateX,
        rotateY,
        transition: { type: 'spring', stiffness: 350, damping: 25 }
      }}
      whileHover={{ 
        scale: 1.06, 
        y: -10,
        transition: { type: 'spring', stiffness: 400, damping: 22 }
      }}
      whileTap={{ scale: 0.94, y: 3 }}
      style={{
        transformStyle: 'preserve-3d',
        perspective: 800,
      }}
      className={`group relative flex flex-col items-center justify-between p-4 sm:p-5 rounded-[30px] border-2 transition-all cursor-pointer ${item.bgGradient} ${item.borderColor} ${item.bevelColor} ${item.shadowColor} shadow-lg ${
        isSelected
          ? 'ring-4 ring-pink-400 ring-offset-2 scale-[1.06] -translate-y-2 shadow-2xl'
          : ''
      }`}
    >
      {/* 3D Glossy Top Reflection Arc */}
      <div className="absolute top-1.5 left-4 right-4 h-4 bg-gradient-to-b from-white/60 to-white/0 rounded-full pointer-events-none" />

      {/* Floating 3D Character Avatar in Front Layer */}
      <motion.div
        style={{ transform: 'translateZ(30px)' }}
        animate={{
          y: [0, -6, 0],
          rotate: idx % 2 === 0 ? [-1, 1, -1] : [1, -1, 1],
        }}
        transition={{
          duration: 3 + idx * 0.3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="py-2 flex items-center justify-center filter drop-shadow-md"
      >
        {item.avatar}
      </motion.div>

      {/* Label and Emotional Subtitle with 3D depth */}
      <div 
        style={{ transform: 'translateZ(20px)' }}
        className="text-center mt-2 w-full space-y-1.5"
      >
        <span className={`block font-black text-base sm:text-lg tracking-wide ${item.textColor} drop-shadow-xs`}>
          {item.label}
        </span>
        <span className={`inline-block text-[11px] font-extrabold px-3 py-1 rounded-full ${item.tagBg} shadow-xs border border-white/60`}>
          {item.subtitle}
        </span>
      </div>

      {/* Selection Star indicator */}
      {isSelected && (
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-2.5 -right-2.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white p-1.5 rounded-full shadow-md text-xs"
        >
          ✨
        </motion.div>
      )}
    </motion.button>
  );
};

export const EmotionCards: React.FC<EmotionCardsProps> = ({
  onSelectEmotion,
  selectedEmotion,
}) => {
  const emotions: EmotionItem[] = [
    {
      id: 'vui-ve',
      label: 'Vui vẻ',
      emoji: '😊',
      bgGradient: 'bg-gradient-to-b from-[#FFFDF0] via-[#FEF3C7] to-[#FDE68A]',
      borderColor: 'border-[#FDE68A]',
      bevelColor: 'border-b-[6px] border-[#F59E0B]',
      shadowColor: 'shadow-amber-200/60 hover:shadow-amber-300/80',
      textColor: 'text-[#92400E]',
      tagBg: 'bg-amber-100/90 text-amber-900',
      avatar: <HappyAvatar className="w-20 h-20 sm:w-24 sm:h-24" />,
      subtitle: 'Hân hoan, rạng rỡ ✨',
    },
    {
      id: 'buon-ba',
      label: 'Buồn bã',
      emoji: '😢',
      bgGradient: 'bg-gradient-to-b from-[#F0F9FF] via-[#E0F2FE] to-[#BAE6FD]',
      borderColor: 'border-[#BAE6FD]',
      bevelColor: 'border-b-[6px] border-[#0284C7]',
      shadowColor: 'shadow-sky-200/60 hover:shadow-sky-300/80',
      textColor: 'text-[#075985]',
      tagBg: 'bg-sky-100/90 text-sky-900',
      avatar: <SadAvatar className="w-20 h-20 sm:w-24 sm:h-24" />,
      subtitle: 'Rơi lệ, tủi thân 🌧️',
    },
    {
      id: 'lo-lang',
      label: 'Lo lắng',
      emoji: '😟',
      bgGradient: 'bg-gradient-to-b from-[#FAF5FF] via-[#F3E8FF] to-[#DDD6FE]',
      borderColor: 'border-[#DDD6FE]',
      bevelColor: 'border-b-[6px] border-[#7C3AED]',
      shadowColor: 'shadow-purple-200/60 hover:shadow-purple-300/80',
      textColor: 'text-[#5B21B6]',
      tagBg: 'bg-purple-100/90 text-purple-900',
      avatar: <WorriedAvatar className="w-20 h-20 sm:w-24 sm:h-24" />,
      subtitle: 'Bất an, băn khoăn 💭',
    },
    {
      id: 'tuc-gian',
      label: 'Tức giận',
      emoji: '😡',
      bgGradient: 'bg-gradient-to-b from-[#FFF1F2] via-[#FFE4E6] to-[#FECDD3]',
      borderColor: 'border-[#FECDD3]',
      bevelColor: 'border-b-[6px] border-[#E11D48]',
      shadowColor: 'shadow-rose-200/60 hover:shadow-rose-300/80',
      textColor: 'text-[#9F1239]',
      tagBg: 'bg-rose-100/90 text-rose-900',
      avatar: <AngryAvatar className="w-20 h-20 sm:w-24 sm:h-24" />,
      subtitle: 'Bực bội, khó chịu ⚡',
    },
    {
      id: 'kho-noi',
      label: 'Khó nói thành lời',
      emoji: '😶',
      bgGradient: 'bg-gradient-to-b from-[#F0FDFA] via-[#CCFBF1] to-[#99F6E4]',
      borderColor: 'border-[#99F6E4]',
      bevelColor: 'border-b-[6px] border-[#0D9488]',
      shadowColor: 'shadow-teal-200/60 hover:shadow-teal-300/80',
      textColor: 'text-[#115E59]',
      tagBg: 'bg-teal-100/90 text-teal-900',
      avatar: <ShyAvatar className="w-20 h-20 sm:w-24 sm:h-24" />,
      subtitle: 'Ngập ngừng, chưa tỏ 💬',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full bg-white/95 backdrop-blur-md rounded-[36px] p-5 sm:p-7 border-2 border-white shadow-[0_16px_40px_-8px_rgba(186,230,253,0.5)] space-y-5"
    >
      {/* 5 3D Emotion Cards Grid with Framer Motion 3D Physics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5 sm:gap-4.5">
        {emotions.map((item, idx) => (
          <MotionCardItem
            key={item.id}
            item={item}
            idx={idx}
            isSelected={selectedEmotion === item.id}
            onSelect={() => onSelectEmotion(item.id)}
          />
        ))}
      </div>

      {/* 3D Tactile Wide Pink Bar: "💗 Mình chỉ muốn được lắng nghe" */}
      <motion.button
        onClick={() => onSelectEmotion('chi-muon-lang-nghe')}
        whileHover={{ scale: 1.018, y: -3 }}
        whileTap={{ scale: 0.98, y: 2 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        className={`w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#FF6B93] via-[#FF3366] to-[#FF6B93] text-white font-black text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-[0_12px_28px_-4px_rgba(255,51,102,0.5)] hover:shadow-[0_16px_32px_-4px_rgba(255,51,102,0.65)] active:scale-[0.99] transition-all cursor-pointer border-b-[6px] border-[#BE123C] active:border-b-[2px] relative overflow-hidden ${
          selectedEmotion === 'chi-muon-lang-nghe' ? 'ring-4 ring-pink-300 ring-offset-2' : ''
        }`}
      >
        {/* Subtle top gloss sheen */}
        <div className="absolute top-1 left-8 right-8 h-3 bg-white/30 rounded-full pointer-events-none" />

        <motion.div
          animate={{ scale: [1, 1.25, 1] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Heart className="w-5 h-5 fill-white" />
        </motion.div>
        
        <span className="drop-shadow-sm font-['Comfortaa',sans-serif]">
          💗 Mình chỉ muốn được lắng nghe
        </span>

        <Sparkles className="w-4 h-4 text-amber-200 animate-spin" style={{ animationDuration: '6s' }} />

        <ChevronRight className="w-5 h-5 stroke-[3] ml-1" />
      </motion.button>
    </motion.div>
  );
};
