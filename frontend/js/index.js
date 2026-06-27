import { auth }
from "./firebase-config.js";

import {
    signInWithEmailAndPassword
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

document
.getElementById("loginForm")
.addEventListener(
    "submit",
    async function(e){

        e.preventDefault();

        const email =
        document.getElementById("email").value;

        const password =
        document.getElementById("password").value;

        try{

            const userCredential =
            await signInWithEmailAndPassword(
                auth,
                email,
                password
            );

            sessionStorage.setItem(
                "userEmail",
                userCredential.user.email
            );

            window.location.href =
            "assessment.html";

        }

        catch(error){

            alert(
                "Invalid Email or Password"
            );

        }

    }
);