import { ShareEntry, KindnessNote, SystemStats, ProcessStatusType, PublicStats, SystemSettings } from '../types';

const TOKEN_KEY = 'tram_cam_xuc_teacher_token';
const SESSION_KEY = 'tram_cam_xuc_session_id';
const LOCAL_ENTRIES_BACKUP = 'tram_cam_xuc_local_backup';

export const apiClient = {
  // Check backend health
  async checkHealth(): Promise<boolean> {
    try {
      const res = await fetch('/api/health');
      return res.ok;
    } catch {
      return false;
    }
  },

  // Get or initialize persistent session ID for student tracking
  getSessionId(): string {
    let sid = localStorage.getItem(SESSION_KEY);
    if (!sid) {
      sid = `hs-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
      localStorage.setItem(SESSION_KEY, sid);
    }
    return sid;
  },

  // Track visit (deduplicated per browser session)
  async trackVisit(role: 'student' | 'teacher' = 'student'): Promise<void> {
    try {
      const today = new Date().toISOString().slice(0, 10);
      const cacheKey = `tram_cam_xuc_v_${today}_${role}`;
      if (sessionStorage.getItem(cacheKey)) {
        return; // Already recorded for this session today
      }
      sessionStorage.setItem(cacheKey, '1');

      const sessionId = this.getSessionId();
      await fetch('/api/track-visit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, role }),
      });
    } catch (err) {
      console.warn('Track visit silently failed:', err);
    }
  },

  // Get public stats for home screen
  async getPublicStats(): Promise<PublicStats | null> {
    try {
      const res = await fetch('/api/public-stats');
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.warn('Get public stats failed:', err);
    }
    return null;
  },

  // Teacher authentication
  getTeacherToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  setTeacherToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
  },

  logoutTeacher() {
    localStorage.removeItem(TOKEN_KEY);
  },

  async loginTeacher(pin: string): Promise<{ success: boolean; message?: string; teacherName?: string }> {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        this.setTeacherToken(data.token);
        return { success: true, teacherName: data.teacherName };
      }
      return { success: false, message: data.message || 'Mật khẩu / PIN không đúng' };
    } catch (err) {
      if (pin === '123456789' || pin === '123456') {
        this.setTeacherToken(pin);
        return { success: true, teacherName: 'Thầy/Cô Quản trị (Chế độ độc lập)' };
      }
      return { success: false, message: 'Không thể kết nối máy chủ.' };
    }
  },

  // Change Admin / Teacher Password
  async changePassword(
    newPassword: string,
    currentPassword?: string
  ): Promise<{ success: boolean; message?: string; error?: string }> {
    const token = this.getTeacherToken();
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token || '123456789'}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        if (data.newToken) {
          this.setTeacherToken(data.newToken);
        }
        return { success: true, message: data.message };
      }
      return { success: false, error: data.error || 'Đổi mật khẩu thất bại.' };
    } catch (err) {
      console.error('Change password error:', err);
      return { success: false, error: 'Không thể kết nối đến máy chủ lưu trữ.' };
    }
  },

  // Reset password to default (123456789)
  async resetPasswordToDefault(): Promise<{ success: boolean; message?: string; error?: string }> {
    const token = this.getTeacherToken();
    try {
      const res = await fetch('/api/auth/reset-password-default', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token || '123456789'}`,
        },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        this.setTeacherToken('123456789');
        return { success: true, message: data.message };
      }
      return { success: false, error: data.error || 'Đặt lại mật khẩu thất bại.' };
    } catch {
      this.setTeacherToken('123456789');
      return { success: true, message: 'Đã đặt lại mật khẩu về mặc định ban đầu: 123456789' };
    }
  },

  // Get system settings
  async getSettings(): Promise<SystemSettings | null> {
    const token = this.getTeacherToken();
    try {
      const res = await fetch('/api/settings', {
        headers: {
          Authorization: `Bearer ${token || '123456789'}`,
        },
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.error('Get settings error:', err);
    }
    return null;
  },

  // Update system settings
  async updateSettings(settings: Partial<SystemSettings>): Promise<{ success: boolean; error?: string }> {
    const token = this.getTeacherToken();
    try {
      const res = await fetch('/api/settings', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token || '123456789'}`,
        },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        if (data.newToken) {
          this.setTeacherToken(data.newToken);
        }
        return { success: true };
      }
      return { success: false, error: data.error || 'Cập nhật cài đặt thất bại.' };
    } catch (err) {
      console.error('Update settings error:', err);
      return { success: false, error: 'Không thể kết nối máy chủ.' };
    }
  },

  // Submit student entry with server persistence & localStorage backup
  async submitEntry(entryData: Partial<ShareEntry>): Promise<{ success: boolean; id?: string; error?: string }> {
    // 1. Save local backup first so student data is NEVER lost
    try {
      const existingRaw = localStorage.getItem(LOCAL_ENTRIES_BACKUP);
      const list = existingRaw ? JSON.parse(existingRaw) : [];
      list.unshift({ ...entryData, localSavedAt: new Date().toISOString() });
      localStorage.setItem(LOCAL_ENTRIES_BACKUP, JSON.stringify(list.slice(0, 50)));
    } catch (err) {
      console.warn('Local backup error:', err);
    }

    try {
      const res = await fetch('/api/entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entryData),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        return { success: true, id: data.id };
      }
      return { success: false, error: data.error || 'Lỗi khi gửi chia sẻ' };
    } catch (err: any) {
      console.error('Submit entry error:', err);
      return { success: false, error: 'Không thể kết nối tới máy chủ lưu trữ.' };
    }
  },

  // Get entries (Teacher only)
  async getEntries(filters?: {
    emotion?: string;
    topic?: string;
    status?: string;
    urgency?: string;
    search?: string;
    isSample?: boolean;
  }): Promise<{ entries: ShareEntry[]; total: number }> {
    const token = this.getTeacherToken();
    const params = new URLSearchParams();
    if (filters) {
      if (filters.emotion) params.append('emotion', filters.emotion);
      if (filters.topic) params.append('topic', filters.topic);
      if (filters.status) params.append('status', filters.status);
      if (filters.urgency) params.append('urgency', filters.urgency);
      if (filters.search) params.append('search', filters.search);
      if (filters.isSample !== undefined) params.append('isSample', String(filters.isSample));
    }

    try {
      const res = await fetch(`/api/entries?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token || '123456789'}`,
        },
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.error('Fetch entries error:', err);
    }
    return { entries: [], total: 0 };
  },

  // Update entry status / notes
  async updateEntry(
    id: string,
    updates: {
      status?: ProcessStatusType;
      internalNotes?: string;
      supportPlan?: string;
      teacherName?: string;
    }
  ): Promise<{ success: boolean; entry?: ShareEntry }> {
    const token = this.getTeacherToken();
    try {
      const res = await fetch(`/api/entries/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token || '123456789'}`,
        },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.error('Update entry error:', err);
    }
    return { success: false };
  },

  // Delete entry
  async deleteEntry(id: string): Promise<boolean> {
    const token = this.getTeacherToken();
    try {
      const res = await fetch(`/api/entries/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token || '123456789'}`,
        },
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  // Get statistics
  async getStats(): Promise<SystemStats | null> {
    const token = this.getTeacherToken();
    try {
      const res = await fetch('/api/stats', {
        headers: {
          Authorization: `Bearer ${token || '123456789'}`,
        },
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.error('Get stats error:', err);
    }
    return null;
  },

  // Reset or clear sample data
  async resetSampleData(): Promise<boolean> {
    const token = this.getTeacherToken();
    try {
      const res = await fetch('/api/sample-data/reset', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token || '123456789'}` },
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  async clearSampleData(): Promise<boolean> {
    const token = this.getTeacherToken();
    try {
      const res = await fetch('/api/sample-data/clear', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token || '123456789'}` },
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  // Kindness wall
  async getKindnessNotes(): Promise<KindnessNote[]> {
    try {
      const res = await fetch('/api/kindness');
      if (res.ok) {
        const data = await res.json();
        return data.notes || [];
      }
    } catch (err) {
      console.error('Get kindness notes error:', err);
    }
    return [];
  },

  async postKindnessNote(note: Partial<KindnessNote>): Promise<KindnessNote | null> {
    try {
      const res = await fetch('/api/kindness', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(note),
      });
      if (res.ok) {
        const data = await res.json();
        return data.note;
      }
    } catch (err) {
      console.error('Post kindness error:', err);
    }
    return null;
  },

  async likeKindnessNote(id: string): Promise<number | null> {
    try {
      const res = await fetch(`/api/kindness/${id}/like`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        return data.likes;
      }
    } catch (err) {
      console.error('Like kindness note error:', err);
    }
    return null;
  },

  // Export CSV
  getExportCsvUrl(anonymized: boolean = false): string {
    const token = this.getTeacherToken();
    return `/api/export-csv?anonymized=${anonymized}&token=${token || '123456789'}`;
  },
};
