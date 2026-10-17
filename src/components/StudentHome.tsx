import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { EmotionCards } from './EmotionCards';
import { ActionCards } from './ActionCards';
import { HeroKidsHuggingHeart, SchoolBuilding } from './Illustrations';
import { EmotionType, PublicStats } from '../types';
import { NavTab } from './Sidebar';
import { Settings, Users, MessageCircle, Heart, Sparkles } from 'lucide-react';
import { apiClient } from '../api/client';

interface StudentHomeProps {
  onSelectEmotion: (emotion: EmotionType) => void;
  onNavigate: (tab: NavTab) => void;
  onOpenEmergency: () => void;
  onOpenTeacherLogin: () => void;
}

export const StudentHome: React.FC<StudentHomeProps> = ({
  onSelectEmotion,
  onNavigate,
  onOpenEmergency,
  onOpenTeacherLogin,
}) => {
  const [publicStats, setPublicStats] = useState<PublicStats | null>(null);

  useEffect(() => {
    apiClient.trackVisit('student');
    apiClient.getPublicStats().then(setPublicStats);
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Bar: Activity Status Pill & User Profile */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Real Live Student Activity Badge */}
        <motion.div 
          initial={{ opacity: 0, x: -15 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl border-2 border-sky-100 shadow-md text-xs"
        >
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
          </span>
          <span className="font-extrabold text-sky-950 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-sky-600" />
            Hôm nay: <strong className="text-emerald-700 font-black">{publicStats?.todayVisits ?? 1}</strong> bạn nhỏ ghé thăm
          </span>
          <span className="text-slate-300">•</span>
          <span className="text-slate-700 font-bold flex items-center gap-1">
            <MessageCircle className="w-3.5 h-3.5 text-pink-500" />
            Đã lưu: <strong className="text-pink-600 font-black">{publicStats?.totalShares ?? 0}</strong> lời tâm sự
          </span>
        </motion.div>

        {/* Profile Card & Settings Switcher (Matching Mockup Top Right) */}
        <motion.div 
          initial={{ opacity: 0, x: 15 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2.5 bg-white/95 backdrop-blur-md px-4 py-2 rounded-2xl border-2 border-sky-100 shadow-md ml-auto"
        >
          {/* Cute Round Profile Avatar */}
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-sky-400 via-blue-400 to-indigo-400 flex items-center justify-center text-base shadow-sm ring-2 ring-white">
            👦🏻
          </div>
          <div className="text-left">
            <span className="block text-xs font-black text-sky-950 leading-tight">
              Xin chào, bạn nhỏ!
            </span>
            <span className="block text-[11px] text-sky-700/80 font-semibold">
              Hãy chia sẻ cảm xúc của mình nhé!
            </span>
          </div>
          <motion.button
            whileHover={{ rotate: 90 }}
            transition={{ duration: 0.3 }}
            onClick={onOpenTeacherLogin}
            title="Khu vực dành cho giáo viên phụ trách"
            className="p-1.5 ml-1 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-xl transition-colors cursor-pointer"
          >
            <Settings className="w-4 h-4 text-sky-500" />
          </motion.button>
        </motion.div>
      </div>

      {/* Main 3D Hero Header Banner (Matching exact visual identity in mockup) */}
      <div className="relative rounded-[36px] overflow-hidden bg-gradient-to-b from-[#C9E9FA] via-[#E4F4FE] to-[#F3FAFF] border-2 border-white shadow-[0_16px_40px_-10px_rgba(186,230,253,0.5)] p-6 sm:p-8">
        {/* Floating clouds with gentle animation */}
        <motion.div 
          animate={{ x: [-8, 8, -8] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-3 left-8 text-3xl opacity-80 pointer-events-none select-none"
        >
          ☁️
        </motion.div>
        <motion.div 
          animate={{ x: [8, -8, 8] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-8 left-1/3 text-2xl opacity-70 pointer-events-none select-none"
        >
          ☁️
        </motion.div>

        {/* Paper Airplanes */}
        <motion.div 
          animate={{ y: [-4, 4, -4], x: [-6, 6, -6], rotate: [0, 4, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-6 left-1/5 text-xl opacity-85 pointer-events-none select-none"
        >
          ✈️
        </motion.div>

        {/* Smiling 3D Sun in Top Right Corner */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
          className="absolute top-3 right-8 text-5xl opacity-90 pointer-events-none select-none drop-shadow-md"
        >
          ☀️
        </motion.div>

        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 relative z-10">
          {/* Left/Center: Cute Mascots & School Building */}
          <div className="flex items-center justify-center gap-3 order-2 lg:order-1 flex-1">
            <motion.div 
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="max-w-xs sm:max-w-sm"
            >
              <HeroKidsHuggingHeart className="w-full h-auto drop-shadow-lg" />
            </motion.div>

            <motion.div 
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
              className="hidden sm:block shrink-0"
            >
              <SchoolBuilding className="w-32 h-28 drop-shadow-md" />
            </motion.div>
          </div>

          {/* Right/Center: Title, Slogan Ribbon & Cute Speech Bubble */}
          <div className="text-center order-1 lg:order-2 flex-1 space-y-3.5">
            {/* Arched Styled Title with Heart & Sun badges */}
            <div>
              <div className="flex items-center justify-center gap-2 flex-wrap">
                {/* Heart badge */}
                <motion.span 
                  animate={{ scale: [1, 1.25, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  className="text-2xl"
                >
                  💖
                </motion.span>

                <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-black tracking-tight leading-none drop-shadow-xs flex items-center gap-2">
                  <span className="text-[#0284C7] drop-shadow-sm font-['Comfortaa',sans-serif]">TRẠM</span>{' '}
                  <span className="text-[#F43F5E] drop-shadow-sm font-['Comfortaa',sans-serif]">CẢM XÚC</span>{' '}
                  <span className="text-[#F59E0B] drop-shadow-sm font-['Comfortaa',sans-serif]">TỪ TRÁI TIM</span>
                </h1>

                {/* Sun badge */}
                <motion.span 
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  className="text-2xl"
                >
                  ☀️
                </motion.span>
              </div>

              {/* Curved Yellow 3D Slogan Ribbon */}
              <div className="inline-block mt-3">
                <div className="relative bg-gradient-to-r from-[#FBC02D] via-[#FDD835] to-[#FBC02D] text-[#78350F] font-black text-xs sm:text-sm px-7 py-2 rounded-full shadow-lg uppercase tracking-wider border-2 border-[#FFE082] border-b-4 border-[#F57F17]">
                  CHIA SẺ NỖI NIỀM, XÂY DỰNG TRƯỜNG HỌC HẠNH PHÚC
                </div>
              </div>
            </div>

            {/* Speech Bubble: "Chào bạn! Hôm nay trái tim bạn đang cảm thấy thế nào?" */}
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 300, damping: 20 }}
              className="inline-block relative"
            >
              <div className="bg-white/95 rounded-[28px] px-7 py-4 border-2 border-sky-200 shadow-xl shadow-sky-100 max-w-sm mx-auto relative">
                {/* Speech tail */}
                <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-5 h-5 bg-white border-b-2 border-r-2 border-sky-200 rotate-45" />

                <p className="font-extrabold text-[#0C4A6E] text-base sm:text-lg leading-snug">
                  Chào bạn! <span className="text-[#F43F5E]">💖</span>
                  <br />
                  Hôm nay trái tim bạn đang cảm thấy thế nào?
                </p>

                {/* Flying Paper Plane Icon inside Speech Bubble */}
                <span className="absolute bottom-2 right-4 text-base opacity-75">
                  ✈️
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Content Layout: 5 3D Emotion Cards + 5 Action Cards + 3D Wooden Signs */}
      <div className="flex flex-col xl:flex-row gap-5 items-start">
        {/* Left / Center Area: 5 Emotion Cards & 5 Action Cards */}
        <div className="flex-1 space-y-5 w-full">
          {/* 3D Emotion Cards with Framer Motion Tilt Physics */}
          <EmotionCards onSelectEmotion={onSelectEmotion} />

          {/* 5 3D Action Cards Row */}
          <ActionCards
            onNavigate={onNavigate}
            onOpenEmergency={onOpenEmergency}
          />
        </div>

        {/* Right side: 3D Directional Wooden Signpost (Matching Mockup with wood textures & nails) */}
        <div className="hidden xl:flex flex-col items-center gap-3 w-48 shrink-0 pt-3 relative">
          {/* Wooden Main Post */}
          <div className="w-6 h-full bg-gradient-to-r from-[#8D5B4C] via-[#A66D5B] to-[#6E4234] rounded-full absolute -z-10 shadow-xl border-x border-[#5C3428]" />

          {/* Sign 1: 🌸 Lắng nghe (Pink Plank with wood details) */}
          <motion.div
            whileHover={{ scale: 1.06, rotate: -2 }}
            animate={{ rotate: [-2, -1, -2] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="w-44 py-3 px-4 rounded-2xl bg-gradient-to-r from-[#FF8FA3] via-[#FF758F] to-[#FF8FA3] text-white font-black text-center text-xs shadow-lg border-2 border-[#FFA6B7] border-b-[5px] border-[#D94F6B] cursor-default select-none flex items-center justify-between relative overflow-hidden"
          >
            {/* 3D Wooden Nail Heads */}
            <div className="w-2 h-2 rounded-full bg-slate-200/90 shadow-inner border border-slate-400 shrink-0" />
            <div className="flex items-center gap-1.5 drop-shadow-xs">
              <span className="text-sm">🌸</span>
              <span className="font-['Comfortaa',sans-serif]">Lắng nghe</span>
            </div>
            <div className="w-2 h-2 rounded-full bg-slate-200/90 shadow-inner border border-slate-400 shrink-0" />
          </motion.div>

          {/* Sign 2: 🌟 Thấu hiểu (Warm Yellow Plank) */}
          <motion.div
            whileHover={{ scale: 1.06, rotate: 2 }}
            animate={{ rotate: [2, 3, 2] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
            className="w-44 py-3 px-4 rounded-2xl bg-gradient-to-r from-[#FFD166] via-[#FFC338] to-[#FFD166] text-[#7A4B00] font-black text-center text-xs shadow-lg border-2 border-[#FFE082] border-b-[5px] border-[#D49800] cursor-default select-none flex items-center justify-between relative overflow-hidden"
          >
            <div className="w-2 h-2 rounded-full bg-amber-200 shadow-inner border border-amber-600 shrink-0" />
            <div className="flex items-center gap-1.5 drop-shadow-xs">
              <span className="text-sm">🌟</span>
              <span className="font-['Comfortaa',sans-serif]">Thấu hiểu</span>
            </div>
            <div className="w-2 h-2 rounded-full bg-amber-200 shadow-inner border border-amber-600 shrink-0" />
          </motion.div>

          {/* Sign 3: 🍀 Yêu thương (Mint Green Plank) */}
          <motion.div
            whileHover={{ scale: 1.06, rotate: -2 }}
            animate={{ rotate: [-1, 0, -1] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
            className="w-44 py-3 px-4 rounded-2xl bg-gradient-to-r from-[#06D6A0] via-[#05B98A] to-[#06D6A0] text-white font-black text-center text-xs shadow-lg border-2 border-[#54E4BF] border-b-[5px] border-[#038C68] cursor-default select-none flex items-center justify-between relative overflow-hidden"
          >
            <div className="w-2 h-2 rounded-full bg-emerald-200 shadow-inner border border-emerald-600 shrink-0" />
            <div className="flex items-center gap-1.5 drop-shadow-xs">
              <span className="text-sm">🍀</span>
              <span className="font-['Comfortaa',sans-serif]">Yêu thương</span>
            </div>
            <div className="w-2 h-2 rounded-full bg-emerald-200 shadow-inner border border-emerald-600 shrink-0" />
          </motion.div>

          {/* Sign 4: 🌊 Đồng hành (Sky Blue Plank) */}
          <motion.div
            whileHover={{ scale: 1.06, rotate: 2 }}
            animate={{ rotate: [1, 2, 1] }}
            transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut', delay: 0.9 }}
            className="w-44 py-3 px-4 rounded-2xl bg-gradient-to-r from-[#118AB2] via-[#0E7490] to-[#118AB2] text-white font-black text-center text-xs shadow-lg border-2 border-[#38BDF8] border-b-[5px] border-[#0B5C73] cursor-default select-none flex items-center justify-between relative overflow-hidden"
          >
            <div className="w-2 h-2 rounded-full bg-sky-200 shadow-inner border border-sky-600 shrink-0" />
            <div className="flex items-center gap-1.5 drop-shadow-xs">
              <span className="text-sm">🌊</span>
              <span className="font-['Comfortaa',sans-serif]">Đồng hành</span>
            </div>
            <div className="w-2 h-2 rounded-full bg-sky-200 shadow-inner border border-sky-600 shrink-0" />
          </motion.div>

          {/* Grass and Blooming Flowers at the Base */}
          <div className="mt-4 flex items-center justify-center relative">
            <span className="text-4xl filter drop-shadow-sm">🪴</span>
            <span className="absolute -top-1 -right-2 text-base animate-bounce">🌸</span>
            <span className="absolute -top-1 -left-2 text-base animate-bounce" style={{ animationDelay: '0.4s' }}>🌼</span>
          </div>
        </div>
      </div>

      {/* Bottom Slogan Footer */}
      <div className="text-center pt-2 pb-6">
        <p className="text-xs sm:text-sm font-extrabold text-sky-800/80 italic tracking-wide">
          “Cùng nhau xây dựng một ngôi trường tràn đầy yêu thương!”
        </p>
      </div>
    </div>
  );
};
