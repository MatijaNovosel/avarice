import { firebaseConfig } from "../config/firebase-config";
import firebase from "firebase";

const app = firebase.initializeApp(firebaseConfig);
export const db = app.firestore();
