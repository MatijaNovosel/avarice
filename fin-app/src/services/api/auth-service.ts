import { AppUser } from "./../../models/user";
import firebase from "firebase";
import { db } from "../firebase";
import { User } from "@firebase/auth-types";

export class AuthService {
  async updateUser({
    uid,
    email,
    displayName,
    photoURL
  }: User): Promise<AppUser> {
    const userRef = db.doc(`users/${uid}`);
    const data: AppUser = {
      uid,
      email,
      displayName,
      photoURL
    };
    await userRef.set(data, { merge: true });
    return data;
  }
  async signIn(): Promise<AppUser> {
    const provider = new firebase.auth.GoogleAuthProvider();
    const credential = await firebase.auth().signInWithPopup(provider);
    const userData = await this.updateUser(credential.user as User);
    return userData;
  }
  async signOut(): Promise<void> {
    await firebase.auth().signOut();
  }
}
