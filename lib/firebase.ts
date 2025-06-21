// lib/firebase.ts
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

export const firebaseConfig = {
    apiKey: "AIzaSyAhP887Bm1dAk9tZ_AGzW9x37mfBzq4YGw",
    authDomain: "skillsync-7db19.firebaseapp.com",
    projectId: "skillsync-7db19",
    storageBucket: "skillsync-7db19.firebasestorage.app",
    messagingSenderId: "72550886536",
    appId: "1:72550886536:web:06923f0dd4c7bf030c433d",
    measurementId: "G-7DKM7WN77Z"
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)

