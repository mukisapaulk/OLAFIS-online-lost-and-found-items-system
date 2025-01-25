import { initializeApp } from "firebase/app";
import 'firebase/firestore';
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";



const firebaseConfig = {
    apiKey: "AIzaSyCD_vnLM5anNad91PTClMQSuUTU7VTPsfQ",
  authDomain: "final-642fc.firebaseapp.com",
  projectId: "final-642fc",
  storageBucket: "final-642fc.appspot.com",
  messagingSenderId: "598157525979",
  appId: "1:598157525979:web:36dd431c0b959f93f61dfe",
  measurementId: "G-LL2Q0F6G03"
};

const app = initializeApp(firebaseConfig);

export const auth=getAuth()
export const storage = getStorage(app);

export default app;








// /*import { initializeApp } from "firebase/app";
// import {getFirestore} from '@firebase/firestore'
// const firebaseConfig = {
//     apiKey: "AIzaSyCLyS5gHZ6whn6BJ1R9vEtxida4aATsTSA",
//     authDomain: "scheme-work.firebaseapp.com",
//     projectId: "scheme-work",
//     storageBucket: "scheme-work.appspot.com",
//     messagingSenderId: "990169536101",
//     appId: "1:990169536101:web:8c9b5a5118c23bc709988c",
//     measurementId: "G-D0FK5FVN3C"
//   };
//   // Initialize Firebase
// const app = initializeApp(firebaseConfig);

// export default app*/


// import { initializeApp } from "firebase/app";
// import 'firebase/firestore';
// import { getAuth } from "firebase/auth";
// import { getStorage } from "firebase/storage";


// const firebaseConfig = {
//   apiKey: "AIzaSyCD_vnLM5anNad91PTClMQSuUTU7VTPsfQ",
//   authDomain: "final-642fc.firebaseapp.com",
//   projectId: "final-642fc",
//   storageBucket: "final-642fc.appspot.com",
//   messagingSenderId: "598157525979",
//   appId: "1:598157525979:web:36dd431c0b959f93f61dfe",
//   measurementId: "G-LL2Q0F6G03"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);

// export const auth=getAuth()
// export const storage = getStorage(app);

// export default app;