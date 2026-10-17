export type EmotionType = 
  | 'vui-ve' 
  | 'buon-ba' 
  | 'lo-lang' 
  | 'tuc-gian' 
  | 'kho-noi' 
  | 'chi-muon-lang-nghe';

export type TopicType = 
  | 'ban-be' 
  | 'hoc-tap' 
  | 'thay-co' 
  | 'gia-dinh' 
  | 'dieu-lo-lang' 
  | 'dieu-em-vui' 
  | 'chuyen-khac';

export type SupportLevelType = 
  | 'chia-se' 
  | 'tro-chuyen' 
  | 'can-giup-do-som';

export type ProcessStatusType = 
  | 'new' 
  | 'reviewing' 
  | 'meet_direct' 
  | 'supported' 
  | 'closed';

export interface HistoryEntry {
  timestamp: string;
  action: string;
  teacherName: string;
  notes?: string;
}

export interface ShareEntry {
  id: string;
  type: 'emotion_journal' | 'voice_recording' | 'text_message' | 'image_share' | 'urgent_help' | 'kindness';
  emotion: EmotionType;
  topic: TopicType;
  supportLevel: SupportLevelType;
  content: string;
  studentName?: string;
  studentGrade?: string;
  isAnonymous: boolean;
  sticker?: string;
  audioData?: string;
  audioDuration?: number;
  imageData?: string;
  status: ProcessStatusType;
  internalNotes?: string;
  supportPlan?: string;
  isSample: boolean;
  isEmergencyAlert?: boolean;
  createdAt: string;
  updatedAt: string;
  history: HistoryEntry[];
}

export interface KindnessNote {
  id: string;
  templateType: 'thay-co' | 'ban-be' | 'tu-hao' | 'nu-cuoi' | 'khac';
  content: string;
  senderName: string;
  recipientName?: string;
  createdAt: string;
  likes: number;
}

export interface SystemStats {
  total: number;
  realCount: number;
  sampleCount: number;
  newCount: number;
  urgentCount: number;
  directMeetCount: number;
  supportedCount: number;
  totalVisits: number;
  todayVisits: number;
  uniqueStudents: number;
  emotionCounts: Record<EmotionType, number>;
  topicCounts: Record<TopicType, number>;
}

export interface PublicStats {
  todayVisits: number;
  totalVisits: number;
  uniqueStudents: number;
  totalShares: number;
  schoolName: string;
}

export interface SystemSettings {
  schoolName: string;
  teacherPin?: string;
  allowAnonymous: boolean;
  counselorPhone: string;
  nationalHelpline: string;
}

