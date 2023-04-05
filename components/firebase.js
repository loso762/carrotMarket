import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import 'firebase/compat/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBkujqvCNPtbN5EQME3QnUEuXYVwryMWQ4",
  authDomain: "carrot-621db.firebaseapp.com",
  databaseURL: "https://carrot-621db-default-rtdb.firebaseio.com",
  projectId: "carrot-621db",
  storageBucket: "carrot-621db.appspot.com",
  messagingSenderId: "240962499876",
  appId: "1:240962499876:web:de454b672f63fa4c90afb1",
  measurementId: "G-W9JQ2QPBF2",
};

// firebaseConfig 정보로 firebase 시작
firebase.initializeApp(firebaseConfig);

// firebase의 firestore 인스턴스를 변수에 저장
const firestore = firebase.firestore();
export { firestore };

const auth = firebase.auth();
export { auth };

export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();