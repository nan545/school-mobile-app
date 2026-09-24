import {
  collection,
  doc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from './config';
import {
  Student,
  SubjectGrade,
  AttendanceRecord,
  SchoolEvent,
  ChatMessage,
  AbsenceExcuseRequest,
  PushNotificationItem,
  Assignment,
} from '../types';
import {
  INITIAL_STUDENTS,
  LEO_GRADES,
  LEO_ATTENDANCE_HISTORY,
  SCHOOL_EVENTS,
  INITIAL_MESSAGES,
  INITIAL_NOTIFICATIONS,
} from '../data/mockData';

// Collection references
export const studentsCol = collection(db, 'students');
export const gradesCol = collection(db, 'grades');
export const attendanceCol = collection(db, 'attendance');
export const eventsCol = collection(db, 'events');
export const messagesCol = collection(db, 'messages');
export const excusesCol = collection(db, 'excuses');
export const notificationsCol = collection(db, 'notifications');

/**
 * Automatically seeds Firestore on initial app launch if the database is empty.
 * Ensures the app is immediately ready to use with rich, realistic school data.
 */
export async function seedInitialDatabase(): Promise<boolean> {
  try {
    const studentSnap = await getDocs(studentsCol);
    if (!studentSnap.empty) {
      return false; // Already seeded
    }

    console.log('Seeding initial school database to Firestore...');

    // 1. Seed Students
    for (const student of INITIAL_STUDENTS) {
      await setDoc(doc(db, 'students', student.id), student);
    }

    // 2. Seed Grades
    for (const grade of LEO_GRADES) {
      await setDoc(doc(db, 'grades', grade.id), {
        ...grade,
        studentId: 'student-leo',
      });
    }

    // 3. Seed Attendance Records
    for (let i = 0; i < LEO_ATTENDANCE_HISTORY.length; i++) {
      const rec = LEO_ATTENDANCE_HISTORY[i];
      const recId = `att-${i + 1}`;
      await setDoc(doc(db, 'attendance', recId), {
        id: recId,
        studentId: 'student-leo',
        ...rec,
      });
    }

    // 4. Seed School Events
    for (const evt of SCHOOL_EVENTS) {
      await setDoc(doc(db, 'events', evt.id), evt);
    }

    // 5. Seed Initial Messages
    for (const [channelId, msgs] of Object.entries(INITIAL_MESSAGES)) {
      for (const msg of msgs) {
        await setDoc(doc(db, 'messages', msg.id), {
          ...msg,
          channelId,
          studentId: 'student-leo',
          createdAt: serverTimestamp(),
        });
      }
    }

    // 6. Seed Notifications
    for (const notif of INITIAL_NOTIFICATIONS) {
      await setDoc(doc(db, 'notifications', notif.id), {
        ...notif,
        studentId: 'student-leo',
        createdAt: serverTimestamp(),
      });
    }

    // 7. Seed Initial Excuse request
    await setDoc(doc(db, 'excuses', 'excuse-seed-1'), {
      id: 'excuse-seed-1',
      studentId: 'student-1',
      date: '2026-10-18',
      reason: 'Medical Appointment',
      note: 'Routine orthodontist adjustment in the morning. Arrived back for 3rd period.',
      documentName: 'ortho_clinic_verified.pdf',
      status: 'Approved',
      submittedAt: 'Oct 18, 2026',
      guardianName: 'Sarah Hayes',
    });

    console.log('Firestore seed completed successfully.');
    return true;
  } catch (error) {
    console.error('Error seeding initial Firestore data:', error);
    return false;
  }
}

/**
 * Real-time listener for students
 */
export function subscribeToStudents(callback: (students: Student[]) => void) {
  return onSnapshot(studentsCol, (snap) => {
    if (snap.empty) {
      callback(INITIAL_STUDENTS);
      return;
    }
    const list = snap.docs.map((d) => d.data() as Student);
    callback(list);
  }, (err) => {
    console.warn('Failed to listen to students:', err);
    callback(INITIAL_STUDENTS);
  });
}

/**
 * Real-time listener for grades of a student
 */
export function subscribeToGrades(studentId: string, callback: (grades: SubjectGrade[]) => void) {
  return onSnapshot(gradesCol, (snap) => {
    if (snap.empty) {
      callback(LEO_GRADES);
      return;
    }
    const list = snap.docs
      .map((d) => d.data() as any)
      .filter((g) => !g.studentId || g.studentId === studentId) as SubjectGrade[];
    callback(list.length > 0 ? list : LEO_GRADES);
  }, (err) => {
    console.warn('Failed to listen to grades:', err);
    callback(LEO_GRADES);
  });
}

/**
 * Real-time listener for attendance records
 */
export function subscribeToAttendance(studentId: string, callback: (records: AttendanceRecord[]) => void) {
  return onSnapshot(attendanceCol, (snap) => {
    if (snap.empty) {
      callback(LEO_ATTENDANCE_HISTORY);
      return;
    }
    const list = snap.docs
      .map((d) => d.data() as any)
      .filter((a) => !a.studentId || a.studentId === studentId) as AttendanceRecord[];
    callback(list.length > 0 ? list : LEO_ATTENDANCE_HISTORY);
  }, (err) => {
    console.warn('Failed to listen to attendance:', err);
    callback(LEO_ATTENDANCE_HISTORY);
  });
}

/**
 * Real-time listener for school events
 */
export function subscribeToEvents(callback: (events: SchoolEvent[]) => void) {
  return onSnapshot(eventsCol, (snap) => {
    if (snap.empty) {
      callback(SCHOOL_EVENTS);
      return;
    }
    const list = snap.docs.map((d) => d.data() as SchoolEvent);
    callback(list);
  }, (err) => {
    console.warn('Failed to listen to events:', err);
    callback(SCHOOL_EVENTS);
  });
}

/**
 * Real-time listener for messages in a channel/teacher
 */
export function subscribeToMessages(callback: (messagesByChannel: Record<string, ChatMessage[]>) => void) {
  return onSnapshot(messagesCol, (snap) => {
    if (snap.empty) {
      callback(INITIAL_MESSAGES);
      return;
    }
    const grouped: Record<string, ChatMessage[]> = {};
    snap.docs.forEach((d) => {
      const data = d.data() as any;
      const channel = data.channelId || 't-jenkins';
      if (!grouped[channel]) grouped[channel] = [];
      grouped[channel].push(data as ChatMessage);
    });

    // Ensure order by timestamp / id
    Object.keys(grouped).forEach((key) => {
      grouped[key].sort((a, b) => a.id.localeCompare(b.id));
    });

    callback(grouped);
  }, (err) => {
    console.warn('Failed to listen to messages:', err);
    callback(INITIAL_MESSAGES);
  });
}

/**
 * Real-time listener for absence excuses
 */
export function subscribeToExcuses(studentId: string, callback: (excuses: AbsenceExcuseRequest[]) => void) {
  return onSnapshot(excusesCol, (snap) => {
    const list = snap.docs
      .map((d) => d.data() as any)
      .filter((e) => !e.studentId || e.studentId === studentId) as AbsenceExcuseRequest[];
    callback(list);
  }, (err) => {
    console.warn('Failed to listen to excuses:', err);
  });
}

/**
 * Real-time listener for in-app push notifications
 */
export function subscribeToNotifications(studentId: string, callback: (notifications: PushNotificationItem[]) => void) {
  return onSnapshot(notificationsCol, (snap) => {
    if (snap.empty) {
      callback(INITIAL_NOTIFICATIONS);
      return;
    }
    const list = snap.docs
      .map((d) => d.data() as any)
      .filter((n) => !n.studentId || n.studentId === studentId) as PushNotificationItem[];
    callback(list);
  }, (err) => {
    console.warn('Failed to listen to notifications:', err);
    callback(INITIAL_NOTIFICATIONS);
  });
}

// ---------------- MUTATIONS ---------------- //

/**
 * Add a new graded assignment to a subject in Firestore
 */
export async function addAssignmentToFirestore(
  subjectId: string,
  assignment: Assignment
): Promise<void> {
  try {
    const subjectRef = doc(db, 'grades', subjectId);
    const snap = await getDocs(query(gradesCol, where('id', '==', subjectId)));
    if (!snap.empty) {
      const currentData = snap.docs[0].data() as SubjectGrade;
      const updatedAssignments = [assignment, ...currentData.assignments];

      // Calculate new score average
      const graded = updatedAssignments.filter((a) => a.status === 'graded');
      const totalScore = graded.reduce((sum, a) => sum + (a.score || 0), 0);
      const totalMax = graded.reduce((sum, a) => sum + a.maxScore, 0);
      const newPercentage = totalMax > 0 ? Math.round((totalScore / totalMax) * 1000) / 10 : currentData.currentPercentage;
      const newLetter =
        newPercentage >= 93
          ? 'A'
          : newPercentage >= 90
          ? 'A-'
          : newPercentage >= 87
          ? 'B+'
          : newPercentage >= 83
          ? 'B'
          : 'B-';

      await updateDoc(snap.docs[0].ref, {
        assignments: updatedAssignments,
        currentPercentage: newPercentage,
        letterGrade: newLetter,
      });
    }
  } catch (err) {
    console.error('Error adding assignment to Firestore:', err);
  }
}

/**
 * Record live gate check-in or period attendance to Firestore
 */
export async function recordAttendanceToFirestore(record: AttendanceRecord): Promise<void> {
  try {
    const docId = `att-${record.date}`;
    await setDoc(doc(db, 'attendance', docId), record, { merge: true });
  } catch (err) {
    console.error('Error recording attendance to Firestore:', err);
  }
}

/**
 * Save RSVP for a school event to Firestore
 */
export async function updateEventRsvpInFirestore(
  eventId: string,
  userId: string,
  status: 'attending' | 'maybe' | 'declined'
): Promise<void> {
  try {
    const eventRef = doc(db, 'events', eventId);
    await updateDoc(eventRef, {
      [`rsvps.${userId}`]: status,
      rsvpStatus: status,
    });
  } catch (err) {
    console.error('Error updating RSVP in Firestore:', err);
  }
}

/**
 * Send a chat message to Firestore
 */
export async function sendChatMessageToFirestore(message: ChatMessage): Promise<void> {
  try {
    await setDoc(doc(db, 'messages', message.id), {
      ...message,
      createdAt: serverTimestamp(),
    });
  } catch (err) {
    console.error('Error sending message to Firestore:', err);
  }
}

/**
 * Submit an absence excuse request to Firestore
 */
export async function submitExcuseToFirestore(excuse: AbsenceExcuseRequest): Promise<void> {
  try {
    await setDoc(doc(db, 'excuses', excuse.id), excuse);
  } catch (err) {
    console.error('Error submitting excuse to Firestore:', err);
  }
}

/**
 * Create or save an in-app notification to Firestore
 */
export async function saveNotificationToFirestore(notification: PushNotificationItem): Promise<void> {
  try {
    await setDoc(doc(db, 'notifications', notification.id), {
      ...notification,
      createdAt: serverTimestamp(),
    });
  } catch (err) {
    console.error('Error saving notification to Firestore:', err);
  }
}

/**
 * Mark notification as read in Firestore
 */
export async function markNotificationAsReadInFirestore(notificationId: string): Promise<void> {
  try {
    const notifRef = doc(db, 'notifications', notificationId);
    await updateDoc(notifRef, { read: true });
  } catch (err) {
    console.error('Error marking notification read in Firestore:', err);
  }
}

/**
 * Create a new school event in Firestore (Teacher / Admin feature)
 */
export async function createSchoolEventInFirestore(event: SchoolEvent): Promise<void> {
  try {
    await setDoc(doc(db, 'events', event.id), event);
  } catch (err) {
    console.error('Error creating event in Firestore:', err);
  }
}
