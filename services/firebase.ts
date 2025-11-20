import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const firebaseConfig = {
  apiKey: "AIzaSyBpshRp_PX3ven5n7z4CwrzsGytpatew38",
  authDomain: "kobi-s-student-atlas.firebaseapp.com",
  projectId: "kobi-s-student-atlas",
  storageBucket: "kobi-s-student-atlas.firebasestorage.app",
  messagingSenderId: "955486974004",
  appId: "1:955486974004:android:7c401e00c4da91db3c5a61"
};

const app = initializeApp(firebaseConfig);

let auth;
if (Platform.OS === 'web') {
  auth = getAuth(app);
} else {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
}

export { app, auth };
