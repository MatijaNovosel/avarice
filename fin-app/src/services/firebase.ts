import { firebaseConfig } from "../config/firebase-config";
import firebase from "firebase";

const firebaseApp = firebase.initializeApp(firebaseConfig);
export const db = firebaseApp.firestore();
