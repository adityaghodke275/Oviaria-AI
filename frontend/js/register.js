import { auth }
from "./firebase-config.js";

import {
    createUserWithEmailAndPassword
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

document
.getElementById("registerForm")
.addEventListener(
    "submit",
    async function(e){

        e.preventDefault();

        const email =
        document.getElementById("email").value;

        const password =
        document.getElementById("password").value;

        const confirmPassword =
        document.getElementById("confirmPassword").value;

        if(password !== confirmPassword){

            alert(
                "Passwords do not match"
            );

            return;
        }

        try{

            await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );

            alert(
                "Registration Successful"
            );

            window.location.href =
            "index.html";

        }

        catch(error){

            alert(error.message);

        }

    }
);