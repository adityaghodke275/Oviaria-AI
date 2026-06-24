import { initializeApp }
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import { getAuth }
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import { getFirestore }
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {

    apiKey: "AIzaSyB8JnB1I99pzYh22Ld7WSkuZ_mVM3hfWZo",

    authDomain: "oviaria-f74d7.firebaseapp.com",

    projectId: "oviaria-f74d7",

    storageBucket: "oviaria-f74d7.firebasestorage.app",

    messagingSenderId: "697705871659",

    appId: "1:697705871659:web:06739480fcc95e0b2bed6e",

    measurementId: "G-X2YJKS6DVH"

};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export const auth = getAuth(app);

export { app, db };