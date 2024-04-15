import { initializeApp } from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyBbiPaBix3LF0whYFtLaGiPNagGkScSwz8",
    authDomain: "volunconnect.firebaseapp.com",
    projectId: "volunconnect",
    storageBucket: "volunconnect.appspot.com",
    messagingSenderId: "127791175646",
    appId: "1:127791175646:web:7782290935529329932f4f"
};

export const firebaseApp = initializeApp(firebaseConfig);

/* 
apiKey: import.meta.env.API_KEY,
    authDomain: import.meta.env.AUTH_DOMAIN,
    projectId: import.meta.env.PROJECT_ID,
    storageBucket: import.meta.env.STORAGE_BUCKET,
    messagingSenderId: import.meta.env.MESSAGING_SENDER_ID,
    appId: import.meta.env.APP_ID,
*/