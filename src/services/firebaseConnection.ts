import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDX0MgNUptkFnpxhcJCBunq2qT4aN8Kd1w",
  authDomain: "devlinks-1c47d.firebaseapp.com",
  projectId: "devlinks-1c47d",
  storageBucket: "devlinks-1c47d.appspot.com",
  messagingSenderId: "621937286207",
  appId: "1:621937286207:web:35ba95a3d4f3d4ca6eac8a"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const db = getFirestore(app)

export { auth, db };