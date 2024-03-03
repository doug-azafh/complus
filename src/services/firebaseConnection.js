import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyD4MP7kkc8PQQnC1C0AdK4LKmIgN2oO_y4",
  authDomain: "complus-c4ca3.firebaseapp.com",
  projectId: "complus-c4ca3",
  storageBucket: "complus-c4ca3.appspot.com",
  messagingSenderId: "372854355919",
  appId: "1:372854355919:web:139b748a5339d8492c84ba",
  measurementId: "G-DYR14VGGCC"
};

const firebaseApp = initializeApp(firebaseConfig);

const auth = getAuth(firebaseApp);

const db = getFirestore(firebaseApp);

const storage = getStorage(firebaseApp);

export { auth, db, storage };
