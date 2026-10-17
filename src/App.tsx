import React, { useState, useEffect } from 'react';
import { Sidebar, NavTab } from './components/Sidebar';
import { StudentHome } from './components/StudentHome';
import { EmotionJournal } from './components/EmotionJournal';
import { VoiceRecorder } from './components/VoiceRecorder';
import { TextMessageForm } from './components/TextMessageForm';
import { ImageUploader } from './components/ImageUploader';
import { KindnessWall } from './components/KindnessWall';
import { SuccessScreen } from './components/SuccessScreen';
import { EmergencyModal } from './components/EmergencyModal';
import { TeacherLoginModal } from './components/TeacherPortal/TeacherLoginModal';
import { TeacherDashboard } from './components/TeacherPortal/TeacherDashboard';
import { EmotionType } from './types';
import { apiClient } from './api/client';
import { Menu, X, ShieldAlert, Heart, GraduationCap } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('home');
  const [selectedEmotion, setSelectedEmotion] = useState<EmotionType>('vui-ve');
  const [isTeacherLoggedIn, setIsTeacherLoggedIn] = useState(false);
  const [isTeacherLoginOpen, setIsTeacherLoginOpen] = useState(false);
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);
  const [showSuccessScreen, setShowSuccessScreen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Check if teacher is already logged in
    const token = apiClient.getTeacherToken();
    if (token) {
      setIsTeacherLoggedIn(true);
    }
  }, []);

  const handleSelectEmotionFromHome = (emotion: EmotionType) => {
    setSelectedEmotion(emotion);
    setCurrentTab('journal');
    setShowSuccessScreen(false);
  };

  const handleNavigate = (tab: NavTab) => {
    setShowSuccessScreen(false);
    if (tab === 'teacher') {
      if (isTeacherLoggedIn) {
        setCurrentTab('teacher');
      } else {
        setIsTeacherLoginOpen(true);
      }
    } else {
      setCurrentTab(tab);
    }
    setIsMobileMenuOpen(false);
  };

  const handleTeacherLoginSuccess = () => {
    setIsTeacherLoggedIn(true);
    setShowSuccessScreen(false);
    setCurrentTab('teacher');
  };

  const handleTeacherLogout = () => {
    apiClient.logoutTeacher();
    setIsTeacherLoggedIn(false);
    setCurrentTab('home');
  };

  const handleSubmissionSuccess = () => {
    setShowSuccessScreen(true);
  };

  return (
    <div className="min-h-screen bg-[#f0f8ff] text-slate-800 flex flex-col md:flex-row relative">
      {/* Mobile Header Bar */}
      <div className="md:hidden bg-white/95 backdrop-blur-md border-b border-sky-100 p-3.5 flex items-center justify-between sticky top-0 z-40 shadow-xs">
        <button
          onClick={() => handleNavigate('home')}
          className="flex items-center gap-2 cursor-pointer"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-pink-400 to-amber-200 flex items-center justify-center text-lg shadow-xs">
            💖
          </div>
          <div>
            <h1 className="font-extrabold text-sm text-sky-900 leading-tight">
              Trạm Cảm Xúc
            </h1>
            <p className="font-bold text-[10px] text-rose-500">
              Từ Trái Tim
            </p>
          </div>
        </button>

        <div className="flex items-center gap-2">
          {/* Quick Emergency Button on Mobile */}
          <button
            onClick={() => setIsEmergencyOpen(true)}
            className="p-2 rounded-xl bg-amber-500 text-white shadow-xs animate-pulse cursor-pointer"
            title="Cần giúp đỡ khẩn cấp"
          >
            <ShieldAlert className="w-4 h-4" />
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 cursor-pointer"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-14 z-50 bg-slate-900/40 backdrop-blur-xs flex">
          <div className="w-72 bg-white h-full p-4 shadow-xl flex flex-col justify-between">
            <Sidebar
              activeTab={currentTab}
              onSelectTab={handleNavigate}
              onOpenTeacherLogin={() => {
                setIsMobileMenuOpen(false);
                setIsTeacherLoginOpen(true);
              }}
              isTeacherLoggedIn={isTeacherLoggedIn}
            />
          </div>
          <div className="flex-1" onClick={() => setIsMobileMenuOpen(false)} />
        </div>
      )}

      {/* Desktop Left Sidebar */}
      <div className="hidden md:block sticky top-0 h-screen z-30 shrink-0">
        <Sidebar
          activeTab={currentTab}
          onSelectTab={handleNavigate}
          onOpenTeacherLogin={() => {
            setShowSuccessScreen(false);
            if (isTeacherLoggedIn) {
              setCurrentTab('teacher');
            } else {
              setIsTeacherLoginOpen(true);
            }
          }}
          isTeacherLoggedIn={isTeacherLoggedIn}
        />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        {showSuccessScreen ? (
          <SuccessScreen
            onGoHome={() => {
              setShowSuccessScreen(false);
              setCurrentTab('home');
            }}
            onSendAnother={() => {
              setShowSuccessScreen(false);
              setCurrentTab('journal');
            }}
          />
        ) : (
          <>
            {currentTab === 'home' && (
              <StudentHome
                onSelectEmotion={handleSelectEmotionFromHome}
                onNavigate={handleNavigate}
                onOpenEmergency={() => setIsEmergencyOpen(true)}
                onOpenTeacherLogin={() => {
                  if (isTeacherLoggedIn) {
                    setCurrentTab('teacher');
                  } else {
                    setIsTeacherLoginOpen(true);
                  }
                }}
              />
            )}

            {currentTab === 'journal' && (
              <EmotionJournal
                initialEmotion={selectedEmotion}
                onSuccess={handleSubmissionSuccess}
                onCancel={() => setCurrentTab('home')}
              />
            )}

            {currentTab === 'voice' && (
              <VoiceRecorder
                onSuccess={handleSubmissionSuccess}
                onSwitchToText={() => setCurrentTab('write')}
              />
            )}

            {currentTab === 'write' && (
              <TextMessageForm
                onSuccess={handleSubmissionSuccess}
                onCancel={() => setCurrentTab('home')}
              />
            )}

            {currentTab === 'image' && (
              <ImageUploader
                onSuccess={handleSubmissionSuccess}
                onCancel={() => setCurrentTab('home')}
              />
            )}

            {currentTab === 'kindness' && (
              <KindnessWall onBack={() => setCurrentTab('home')} />
            )}

            {currentTab === 'teacher' && isTeacherLoggedIn && (
              <TeacherDashboard
                onLogout={handleTeacherLogout}
                onGoToStudentMode={() => setCurrentTab('home')}
              />
            )}
          </>
        )}
      </main>

      {/* Emergency Modal */}
      <EmergencyModal
        isOpen={isEmergencyOpen}
        onClose={() => setIsEmergencyOpen(false)}
        onSuccess={() => setShowSuccessScreen(true)}
      />

      {/* Teacher Login Modal */}
      <TeacherLoginModal
        isOpen={isTeacherLoginOpen}
        onClose={() => setIsTeacherLoginOpen(false)}
        onSuccess={handleTeacherLoginSuccess}
      />
    </div>
  );
}
