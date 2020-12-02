import { IAuthService } from "./../interfaces/auth-service";
import { AppUser } from "./../../models/user";
import firebase from "firebase";
import { db } from "../firebase";
import { User } from "@firebase/auth-types";

export class AuthService implements IAuthService {
  async signIn(): Promise<AppUser> {
    const provider = new firebase.auth.GoogleAuthProvider();
    const credential = await firebase.auth().signInWithPopup(provider);

    const { uid, email, displayName, photoURL } = {
      ...(credential.user as User)
    };

    const userRef = db.doc(`users/${uid}`);
    const data: AppUser = {
      uid,
      email,
      displayName,
      photoURL
    };
    await userRef.set(data, { merge: true });

    return { uid, email, displayName, photoURL } as AppUser;
  }
  async signOut(): Promise<void> {
    await firebase.auth().signOut();
  }
}
