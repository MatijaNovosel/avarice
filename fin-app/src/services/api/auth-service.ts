import { AppUser } from "./../../models/user";
import firebase from "firebase";
import { db } from "../firebase";
import { User } from "@firebase/auth-types";

export class AuthService {
  updateUser({ uid, email, displayName, photoURL }: User) {
    const userRef = db.doc(`users/${uid}`);
    const data: AppUser = {
      uid,
      email,
      displayName,
      photoURL
    };
    return userRef.set(data, { merge: true });
  }
  async signIn() {
    const provider = new firebase.auth.GoogleAuthProvider();
    const credential = await firebase.auth().signInWithPopup(provider);
    this.updateUser(credential.user as User);
  }
  signOut() {
    //
  }
}
