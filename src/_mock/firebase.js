//At the top
import { getFirestore } from 'firebase/firestore';
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { FIREBASE_API } from '../config';


// Initialize Firebase
const app = initializeApp(FIREBASE_API);
//Below the import code
const db = getFirestore(app);
export default db