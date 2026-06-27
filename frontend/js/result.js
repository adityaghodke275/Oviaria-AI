import {
    collection,
    addDoc,
    serverTimestamp
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import { db }
from "./firebase-config.js";

const prediction =
JSON.parse(
sessionStorage.getItem(
"prediction"
)
);

const userEmail =
sessionStorage.getItem(
"userEmail"
);

if (userEmail) {


document.getElementById(
    "userName"
).innerText =
userEmail + " ▼";


}

if (!prediction) {


alert(
    "No prediction found."
);

window.location.href =
"assessment.html";


}

document.getElementById(
"condition"
).innerText =
prediction.condition;

document.getElementById(
"confidence"
).innerText =
prediction.confidence + "%";

const probabilities =
prediction.probabilities;

let highestLabel =
prediction.condition;

let highestValue = 0;

for (const key in probabilities) {


if (
    probabilities[key] >
    highestValue
) {

    highestValue =
    probabilities[key];

    highestLabel =
    key;
}


}



let summaryText = "";

if (highestLabel === "PCOS") {

    summaryText =
    "Your symptoms suggest a higher likelihood of PCOS. Early lifestyle changes, regular exercise, healthy eating habits, and medical consultation may help manage symptoms and reduce future health risks.";

}

else if (highestLabel === "PCOD") {

    summaryText =
    "Your symptoms indicate a higher likelihood of PCOD. Maintaining a healthy weight, improving sleep, staying active, and following a balanced diet may help improve hormonal health.";

}

else {

    summaryText =
    "Your assessment indicates a lower likelihood of PCOS or PCOD. Continuing healthy lifestyle habits, regular exercise, proper sleep, and balanced nutrition can help maintain reproductive and hormonal health.";

}

const summaryElement =
document.getElementById(
    "summaryText"
);

if(summaryElement){
    summaryElement.innerText =
    summaryText;
}

console.log(prediction);
console.log(prediction.ai_insights);

async function savePredictionHistory() {

    const userEmail =
    sessionStorage.getItem(
        "userEmail"
    );

    if(!userEmail) return;

    try {

        await addDoc(
            collection(
                db,
                "prediction_history"
            ),
            {

                email:
                userEmail,

                condition:
                prediction.condition,

                confidence:
                prediction.confidence,

                probabilities:
                prediction.probabilities,

                ai_insights:
                prediction.ai_insights,

                predictionData:
                prediction,

                createdAt:
                serverTimestamp()

            }
        );

        console.log(
            "Prediction Saved"
        );

    } catch(error){

        console.error(
            error
        );

    }

}


// ==========================================
// AI INSIGHTS FROM GROQ
// ==========================================

if(prediction.ai_insights){

    document.getElementById(
        "observedText"
    ).innerText =
    prediction.ai_insights.observed;

    document.getElementById(
        "impactText"
    ).innerText =
    prediction.ai_insights.impact;

    document.getElementById(
        "actionText"
    ).innerText =
    prediction.ai_insights.action;

}


document.getElementById(
"newAssessment"
).addEventListener(
"click",
function () {

    window.location.href =
    "assessment.html";
}

);

document.getElementById(
"downloadReport"
).addEventListener(
"click",
function () {

    window.print();
}


);
const viewHistory =
document.getElementById(
    "viewHistory"
);

viewHistory?.addEventListener(
    "click",
    function(){

        window.location.href =
        "history.html";
    }
);

// Save report to Firebase History

savePredictionHistory();

// ==========================================
// LOGOUT
// ==========================================

document
.getElementById(
"logoutBtn"
)
?.addEventListener(
"click",
function(e){

e.preventDefault();

sessionStorage.clear();

localStorage.clear();

window.location.href =
"index.html";


}
);
