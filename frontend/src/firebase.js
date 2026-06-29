import { initializeApp } from "firebase/app";
import {
  GoogleAuthProvider,
  getAuth,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  increment,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadString } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const app = firebaseConfig.apiKey ? initializeApp(firebaseConfig) : null;
export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app) : null;
export const storage = app ? getStorage(app) : null;
export const googleProvider = new GoogleAuthProvider();
export const isFirebaseReady = Boolean(app);

export const mockIssues = [
  {
    id: "mock-1",
    type: "pothole",
    severity: 9,
    status: "reported",
    title: "Critical pothole near school crossing",
    description: "A deep road cavity is forcing scooters and pedestrians into active traffic near a school gate. The site needs barricading, resurfacing, and priority inspection.",
    ai_description: "Gemini Vision detected severe asphalt failure in a pedestrian-heavy corridor. The issue presents high mobility and public-safety risk.",
    location: { lat: 17.385, lng: 78.4867, address: "School Road, Hyderabad" },
    photo_url: "https://images.unsplash.com/photo-1604448251625-c87a93bdc35b?auto=format&fit=crop&w=1200&q=80",
    reporter_id: "mock-user-1",
    reporter_name: "Aarav Mehta",
    upvotes: 34,
    estimated_days: 3,
    created_at: new Date(Date.now() - 86400000),
    resolved_at: null,
    comments: [{ author: "Neha", text: "Traffic police placed a cone today, but repairs are still pending." }],
  },
  {
    id: "mock-2",
    type: "water_leak",
    severity: 7,
    status: "in_progress",
    title: "Water leak flooding market lane",
    description: "Continuous pipe leakage is flooding the market lane, damaging road surface, and wasting potable water during peak business hours.",
    ai_description: "Gemini Vision detected active water discharge and road flooding. The issue requires utility crew inspection and valve isolation.",
    location: { lat: 17.391, lng: 78.481, address: "Market Lane, Hyderabad" },
    photo_url: "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?auto=format&fit=crop&w=1200&q=80",
    reporter_id: "mock-user-2",
    reporter_name: "Fatima Khan",
    upvotes: 21,
    estimated_days: 2,
    created_at: new Date(Date.now() - 86400000 * 2),
    resolved_at: null,
    comments: [],
  },
  {
    id: "mock-3",
    type: "streetlight",
    severity: 5,
    status: "verified",
    title: "Broken streetlight at bus stop",
    description: "The bus stop light has been off for four nights, making late-evening boarding unsafe for students and workers.",
    ai_description: "Gemini Vision detected low-light public infrastructure failure. Electrical maintenance should verify supply and fixture status.",
    location: { lat: 17.398, lng: 78.492, address: "Central Bus Stop, Hyderabad" },
    photo_url: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
    reporter_id: "mock-user-3",
    reporter_name: "Rohan Iyer",
    upvotes: 15,
    estimated_days: 1,
    created_at: new Date(Date.now() - 86400000 * 3),
    resolved_at: null,
    comments: [],
  },
  {
    id: "mock-4",
    type: "waste",
    severity: 4,
    status: "resolved",
    title: "Overflowing waste bins at park gate",
    description: "Overflowing garbage near the park entrance caused odor, blocked the walkway, and attracted complaints from morning walkers.",
    ai_description: "Gemini Vision detected unmanaged solid waste accumulation near a public-use area.",
    location: { lat: 17.377, lng: 78.475, address: "Lake Park Entrance, Hyderabad" },
    photo_url: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=1200&q=80",
    reporter_id: "mock-user-4",
    reporter_name: "Maya Rao",
    upvotes: 10,
    estimated_days: 1,
    created_at: new Date(Date.now() - 86400000 * 6),
    resolved_at: new Date(Date.now() - 86400000),
    comments: [{ author: "Ward Office", text: "Resolved and added to daily pickup route." }],
  },
];

export const mockUsers = [
  { id: "u1", name: "Maya Rao", email: "maya@example.com", xp: 420, badge: "Legend", issues_reported: 16, issues_resolved: 7, joined_at: new Date() },
  { id: "u2", name: "Aarav Mehta", email: "aarav@example.com", xp: 315, badge: "Hero", issues_reported: 11, issues_resolved: 4, joined_at: new Date() },
  { id: "u3", name: "Fatima Khan", email: "fatima@example.com", xp: 240, badge: "Warrior", issues_reported: 8, issues_resolved: 2, joined_at: new Date() },
  { id: "u4", name: "Rohan Iyer", email: "rohan@example.com", xp: 90, badge: "Rookie", issues_reported: 4, issues_resolved: 0, joined_at: new Date() },
];

export function toDate(value) {
  if (!value) return null;
  if (value.seconds) return new Date(value.seconds * 1000);
  if (value.toDate) return value.toDate();
  return new Date(value);
}

export function listenToIssues(callback) {
  if (!db) {
    callback(mockIssues);
    return () => {};
  }
  const issuesQuery = query(collection(db, "issues"), orderBy("created_at", "desc"));
  return onSnapshot(
    issuesQuery,
    (snapshot) => {
      const issues = snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
      callback(issues.length ? issues : mockIssues);
    },
    () => callback(mockIssues),
  );
}

export async function fetchIssuesOnce() {
  if (!db) return mockIssues;
  const snapshot = await getDocs(query(collection(db, "issues"), orderBy("created_at", "desc")));
  const issues = snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
  return issues.length ? issues : mockIssues;
}

export async function getIssueById(issueId) {
  if (!db || issueId?.startsWith("mock")) return mockIssues.find((issue) => issue.id === issueId) || null;
  const snapshot = await getDoc(doc(db, "issues", issueId));
  return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
}

export async function uploadIssueImage(dataUrl, filename = "issue.jpg") {
  if (!storage || !dataUrl?.startsWith("data:image")) return dataUrl || "";
  const safeName = filename.replace(/[^a-z0-9._-]/gi, "-").toLowerCase();
  const imageRef = ref(storage, `issues/${Date.now()}_${safeName}`);
  await uploadString(imageRef, dataUrl, "data_url");
  return getDownloadURL(imageRef);
}

export async function createIssue(issue, imageBase64, filename) {
  if (!db) return { id: `local-${Date.now()}`, success: true };
  const photoUrl = await uploadIssueImage(imageBase64, filename);
  const docRef = await addDoc(collection(db, "issues"), {
    ...issue,
    photo_url: photoUrl,
    upvotes: 0,
    status: issue.status || "reported",
    comments: issue.comments || [],
    created_at: serverTimestamp(),
    resolved_at: null,
  });

  if (issue.reporter_id) {
    await setDoc(
      doc(db, "users", issue.reporter_id),
      {
        id: issue.reporter_id,
        name: issue.reporter_name,
        email: issue.reporter_email || "",
        xp: increment(10),
        badge: "Rookie",
        issues_reported: increment(1),
        issues_resolved: increment(0),
        joined_at: serverTimestamp(),
      },
      { merge: true },
    );
  }
  return { id: docRef.id, success: true };
}

export async function upvoteIssue(issueId, userId) {
  if (!db || issueId?.startsWith("mock")) return true;
  await updateDoc(doc(db, "issues", issueId), { upvotes: increment(1) });
  if (userId) await updateDoc(doc(db, "users", userId), { xp: increment(2) });
  return true;
}

export async function updateIssueStatus(issueId, status) {
  if (!db || issueId?.startsWith("mock")) return true;
  const payload = { status };
  if (status === "resolved") payload.resolved_at = serverTimestamp();
  await updateDoc(doc(db, "issues", issueId), payload);
  return true;
}

export async function fetchLeaderboard() {
  if (!db) return mockUsers;
  const snapshot = await getDocs(query(collection(db, "users"), orderBy("xp", "desc"), limit(10)));
  const users = snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
  return users.length ? users : mockUsers;
}

export async function signInWithGoogle() {
  if (!auth) throw new Error("Firebase is not configured.");
  const result = await signInWithPopup(auth, googleProvider);
  const user = result.user;
  await setDoc(
    doc(db, "users", user.uid),
    {
      id: user.uid,
      name: user.displayName || "Citizen",
      email: user.email || "",
      avatar: user.photoURL || "",
      xp: increment(0),
      badge: "Rookie",
      issues_reported: increment(0),
      issues_resolved: increment(0),
      joined_at: serverTimestamp(),
    },
    { merge: true },
  );
  return user;
}

export {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  onAuthStateChanged,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  signOut,
  updateDoc,
};
