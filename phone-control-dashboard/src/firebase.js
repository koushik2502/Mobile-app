import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCB5iqCRZYKzdn4AkHhUemkx2kwEGMWp3k",
  authDomain: "phonecontrol-250208.firebaseapp.com",
  databaseURL: "https://phonecontrol-250208-default-rtdb.firebaseio.com/",
  projectId: "phonecontrol-250208",
  storageBucket: "phonecontrol-250208.appspot.com",
  messagingSenderId: "428817953538",
  appId: "1:428817953538:web:c9e081e01a92c7e642881b"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };
