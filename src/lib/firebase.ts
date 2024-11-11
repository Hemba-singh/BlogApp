import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDKsiJwkwYGJ7LjF1LPKeDW8h9Iu0ZqNNc",
  authDomain: "manitombi-40714.firebaseapp.com",
  projectId: "manitombi-40714",
  storageBucket: "manitombi-40714.appspot.com",
  messagingSenderId: "242118943088",
  appId: "1:242118943088:web:4a41c38b95fb81d81e2fb5"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);