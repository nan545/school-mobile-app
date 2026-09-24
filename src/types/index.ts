export type UserRole = 'parent' | 'teacher' | 'admin';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  phone: string;
  notificationsEnabled: boolean;
  biometricsEnabled: boolean;
  pinLockEnabled: boolean;
}

export interface Student {
  id: string;
  name: string;
  grade: string;
  schoolName: string;
  studentIdNumber: string;
  avatar: string;
  homeroom: string;
  homeroomTeacher: string;
  currentGpa: number;
  unweightedGpa: number;
  term: string;
  attendanceRate: number;
  habits: {
    avgHomeworkTimeMins: number;
    preferredStudyHours: string;
    onTimeRate: number;
    portalVisitsPerWeek: number;
    focusAreas: string[];
    strengths: string[];
  };
}

export interface Assignment {
  id: string;
  title: string;
  category: 'Exam' | 'Quiz' | 'Homework' | 'Project' | 'Lab' | 'Participation';
  date: string;
  score: number;
  maxScore: number;
  percentage: number;
  feedback?: string;
  status: 'graded' | 'pending' | 'missing' | 'excused';
}

export interface SubjectGrade {
  id: string;
  name: string;
  code: string;
  period: number;
  teacherName: string;
  teacherEmail: string;
  teacherAvatar: string;
  room: string;
  currentPercentage: number;
  letterGrade: string;
  trend: 'up' | 'down' | 'stable';
  quarterHistory: { q1: number; q2: number; q3: number; q4?: number };
  categoryWeights: {
    tests: number;
    quizzes: number;
    homework: number;
    projects: number;
    participation: number;
  };
  assignments: Assignment[];
}

export interface AttendanceRecord {
  date: string;
  status: 'Present' | 'Absent' | 'Tardy' | 'Excused' | 'Holiday' | 'Weekend';
  checkInTime?: string;
  note?: string;
  periods?: {
    period: number;
    subject: string;
    status: 'Present' | 'Absent' | 'Tardy' | 'Excused';
  }[];
}

export interface AbsenceExcuseRequest {
  id: string;
  studentId: string;
  date: string;
  reason: 'Illness' | 'Medical Appointment' | 'Family Emergency' | 'Bereavement' | 'Religious Observance' | 'Other';
  note: string;
  submittedAt: string;
  status: 'Pending' | 'Approved' | 'Requires Documentation';
  documentName?: string;
}

export interface SchoolEvent {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  category: 'academic' | 'sports' | 'arts' | 'pto' | 'holiday' | 'exam';
  gradeLevels: string[];
  description: string;
  organizer: string;
  rsvpStatus?: 'attending' | 'maybe' | 'declined' | null;
  attendeeCount: number;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'parent' | 'teacher' | 'system';
  senderAvatar: string;
  text: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
  attachment?: {
    type: 'pdf' | 'image' | 'link';
    name: string;
    size?: string;
  };
}

export interface TeacherContact {
  id: string;
  name: string;
  title: string;
  subject: string;
  email: string;
  avatar: string;
  officeHours: string;
  status: 'Available' | 'In Class' | 'Off Duty';
  unreadCount: number;
  lastMessageSnippet: string;
  lastMessageTime: string;
}

export interface PushNotificationItem {
  id: string;
  title: string;
  body: string;
  timestamp: string;
  category: 'grade' | 'attendance' | 'message' | 'event' | 'urgent';
  read: boolean;
  studentId?: string;
  actionTab?: string;
}

export interface AiInsight {
  id: string;
  type: 'academic' | 'attendance' | 'habit' | 'wellness';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  actionableTip: string;
  metric: string;
}

export interface DeviceSession {
  id: string;
  deviceName: string;
  deviceType: 'ios' | 'android' | 'web';
  location: string;
  lastActive: string;
  isCurrent: boolean;
}
