// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyDcemnc3QB-7x-o8md3HP-Ya75_Oe5Vk5g',
  authDomain: 'house-marketplace-app-lagkonas.firebaseapp.com',
  projectId: 'house-marketplace-app-lagkonas',
  storageBucket: 'house-marketplace-app-lagkonas.appspot.com',
  messagingSenderId: '174952588436',
  appId: '1:174952588436:web:5303ab923f2d0819554081',
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const db = getFirestore();
