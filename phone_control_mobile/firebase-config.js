import { initializeApp } from '@react-native-firebase/app';
import database from '@react-native-firebase/database';

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

export { database };
export default app;
