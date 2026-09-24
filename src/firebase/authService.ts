import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInAnonymously,
  signOut,
  updateProfile,
  onAuthStateChanged,
  User as FirebaseUser,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { auth, db } from './config';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';

export interface AppUserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: 'parent' | 'teacher' | 'admin';
}

/**
 * Sign in anonymously for quick instant access
 */
export async function loginAnonymously(role: 'parent' | 'teacher' = 'parent'): Promise<FirebaseUser> {
  const cred = await signInAnonymously(auth);
  const user = cred.user;
  const name = role === 'parent' ? 'Sarah Hayes (Guardian)' : 'Mrs. Eleanor Jenkins (Educator)';
  const avatar =
    role === 'parent'
      ? 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80'
      : 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80';

  await updateProfile(user, {
    displayName: name,
    photoURL: avatar,
  });

  await setDoc(
    doc(db, 'users', user.uid),
    {
      uid: user.uid,
      email: `${role}@oakridge.edu`,
      displayName: name,
      photoURL: avatar,
      role,
      lastLogin: serverTimestamp(),
    },
    { merge: true }
  );

  return user;
}

/**
 * Sign in with email and password
 */
export async function loginWithEmail(email: string, pass: string): Promise<FirebaseUser> {
  const cred = await signInWithEmailAndPassword(auth, email, pass);
  return cred.user;
}

/**
 * Register with email and password
 */
export async function registerWithEmail(
  email: string,
  pass: string,
  displayName: string,
  role: 'parent' | 'teacher' = 'parent'
): Promise<FirebaseUser> {
  const cred = await createUserWithEmailAndPassword(auth, email, pass);
  const user = cred.user;

  const avatar =
    role === 'parent'
      ? 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80'
      : 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80';

  await updateProfile(user, {
    displayName,
    photoURL: avatar,
  });

  await setDoc(doc(db, 'users', user.uid), {
    uid: user.uid,
    email,
    displayName,
    photoURL: avatar,
    role,
    createdAt: serverTimestamp(),
  });

  return user;
}

/**
 * Google Sign In via popup
 */
export async function loginWithGoogle(role: 'parent' | 'teacher' = 'parent'): Promise<FirebaseUser> {
  const provider = new GoogleAuthProvider();
  const cred = await signInWithPopup(auth, provider);
  const user = cred.user;

  await setDoc(
    doc(db, 'users', user.uid),
    {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || 'EduPulse User',
      photoURL: user.photoURL,
      role,
      lastLogin: serverTimestamp(),
    },
    { merge: true }
  );

  return user;
}

/**
 * Log out
 */
export async function logoutUser(): Promise<void> {
  await signOut(auth);
}

/**
 * Listen to auth state changes
 */
export function onAuthChange(callback: (user: FirebaseUser | null) => void) {
  return onAuthStateChanged(auth, callback);
}
