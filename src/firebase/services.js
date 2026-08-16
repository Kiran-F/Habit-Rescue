import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where,
  serverTimestamp 
} from "firebase/firestore";
import { db } from "./config";

/**
 * Firestore Service Layer for Habit Rescue
 */

// User Profile Service
export async function saveUserProfile(user) {
  if (!db || !user?.uid) return;
  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    await setDoc(userRef, {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || user.email.split('@')[0],
      resilienceScore: 100,
      successfulRecoveries: 0,
      totalRecoveryAttempts: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
  }
}

// Habits Service
export async function fetchUserHabits(userId) {
  if (!db || !userId) return [];
  try {
    const q = query(collection(db, "habits"), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (err) {
    console.warn("Firestore fetch habits warning:", err.message);
    return [];
  }
}

export async function saveHabitToFirestore(habitData) {
  if (!db) return;
  const habitRef = doc(collection(db, "habits"));
  const habitWithId = {
    ...habitData,
    id: habitRef.id,
    createdAt: new Date().toISOString(),
    updatedAt: serverTimestamp()
  };
  await setDoc(habitRef, habitWithId);
  return habitWithId;
}

export async function updateHabitInFirestore(habitId, updates) {
  if (!db || !habitId) return;
  const habitRef = doc(db, "habits", habitId);
  await updateDoc(habitRef, {
    ...updates,
    updatedAt: serverTimestamp()
  });
}

export async function deleteHabitFromFirestore(habitId) {
  if (!db || !habitId) return;
  await deleteDoc(doc(db, "habits", habitId));
}

// Habit Logs Service
export async function saveHabitLogToFirestore(logData) {
  if (!db) return;
  const logRef = doc(collection(db, "habitLogs"));
  const logWithId = {
    ...logData,
    id: logRef.id,
    createdAt: serverTimestamp()
  };
  await setDoc(logRef, logWithId);
  return logWithId;
}

// Recovery Plans Service
export async function saveRecoveryPlanToFirestore(planData) {
  if (!db) return;
  const planRef = doc(collection(db, "recoveryPlans"));
  const planWithId = {
    ...planData,
    id: planRef.id,
    createdAt: serverTimestamp()
  };
  await setDoc(planRef, planWithId);
  return planWithId;
}
