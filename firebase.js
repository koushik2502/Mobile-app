// firebase.js
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, set } from 'firebase/database';

// Use same config as your mobile app's firebase-config.js
const firebaseConfig = {
  apiKey: "AIzaSyCB5iqCRZYKzdn4AkHhUemkx2kwEGMWp3k",
  authDomain: "phonecontrol-250208.firebaseapp.com",
  databaseURL: "https://phonecontrol-250208-default-rtdb.firebaseio.com/",
  projectId: "phonecontrol-250208",
  storageBucket: "phonecontrol-250208.appspot.com",
  messagingSenderId: "428817953538",
  appId: "1:428817953538:android:6c2986313c4852ff42881b",
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database, ref, onValue, set };
