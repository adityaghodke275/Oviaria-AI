import { auth, db } from "./firebase-config.js";

import {
    collection,
    getDocs,
    getDoc,
    doc,
    query,
    where
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { signOut }
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const historyContainer =
document.getElementById(
    "historyContainer"
);

const userEmail =
sessionStorage.getItem(
    "userEmail"
);

if(userEmail){

    document.getElementById(
        "userEmail"
    ).innerText = userEmail;

}

// =========================
// LOAD HISTORY FROM FIREBASE
// =========================

async function loadHistory() {

    const userEmail =
    sessionStorage.getItem(
        "userEmail"
    );

    if(!userEmail) return;

    historyContainer.innerHTML = "";

    try {

        const q = query(
            collection(
                db,
                "prediction_history"
            ),
            where(
                "email",
                "==",
                userEmail
            )
        );

        const snapshot =
        await getDocs(q);

        document.getElementById(
            "totalReports"
        ).innerText =
        snapshot.size;

        snapshot.forEach((doc) => {

            const report =
            doc.data();

            createReportCard(
                report,
                doc.id
            );

        });

    }

    catch(error){

        console.error(error);

    }

}



function getRisk(condition){

if(condition==="Normal")
return "Low Risk";

if(condition==="PCOD")
return "Moderate Risk";

if(condition==="PCOS")
return "High Risk";

return "";
}

function createReportCard(report, id) {

    let icon = "";

    if(report.condition === "Normal"){
        icon = "assets/NORMAL.png";
    }
    else if(report.condition === "PCOD"){
        icon = "assets/PCOD.png";
    }
    else{
        icon = "assets/PCOS.png";
    }

    const date =
    report.createdAt?.toDate
        ? report.createdAt.toDate()
        : new Date();

    const card =
    document.createElement("div");

    card.className =
    "report-card";

    card.innerHTML = `
        <div class="report-left">

            <img
               src="${icon}"
               class="condition-icon"
            > 

            <div>

                <h3>${report.condition}</h3>

                <p>
                   ${getRisk(report.condition)}
                </p>

            </div>

        </div>

        <div class="report-confidence">

            <h3>
                ${report.confidence}%
            </h3>

            <p>Confidence</p>

        </div>

        <div class="report-date">

            <h4>
                ${date.toLocaleDateString()}
            </h4>

            <p>
                ${date.toLocaleTimeString()}
            </p>

        </div>

            <button
                class="view-btn"
                onclick="downloadReport('${id}')"
            >
                Download PDF
            </button>
    `;

    historyContainer.appendChild(card);
}

document
.getElementById("newAssessmentBtn")
.addEventListener("click", () => {

    window.location.href =
    "assessment.html";

});

document
.getElementById("logoutBtn")
.addEventListener("click", async () => {

    try {

        await signOut(auth);

        sessionStorage.clear();

        window.location.href =
        "index.html";

    }

    catch(error){

        console.error(error);

    }

});

document
.getElementById("searchInput")
.addEventListener("keyup", function(){

    const search =
    this.value.toLowerCase();

    const cards =
    document.querySelectorAll(
        ".report-card"
    );

    cards.forEach(card => {

        const text =
        card.innerText.toLowerCase();

        if(text.includes(search)){

            card.style.display =
            "grid";

        }

        else{

            card.style.display =
            "none";

        }

    });

});



// ==========================
// DOWNLOAD REPORT
// ==========================

window.downloadReport =
async function(id){

    try{

        const reportRef =
        doc(
            db,
            "prediction_history",
            id
        );

        const reportSnap =
        await getDoc(reportRef);

        if(!reportSnap.exists()){

            alert(
                "Report not found"
            );

            return;
        }

        const report =
        reportSnap.data();

        const {
            jsPDF
        } =
        window.jspdf;

        const pdf =
        new jsPDF();

        pdf.setFontSize(20);

        pdf.text(
            "Oviaria AI Report",
            20,
            20
        );

        pdf.setFontSize(14);

        pdf.text(
            `Condition: ${report.condition}`,
            20,
            40
        );

        pdf.text(
            `Confidence: ${report.confidence}%`,
            20,
            55
        );

        pdf.text(
            `Date: ${
                report.createdAt
                ?.toDate()
                .toLocaleDateString()
            }`,
            20,
            70
        );

        pdf.setFontSize(16);

        pdf.text(
            "AI Insights",
            20,
            95
        );

        pdf.setFontSize(12);

        pdf.text(
            report.ai_insights?.observed ||
            "",
            20,
            110,
            {
                maxWidth:170
            }
        );

        pdf.text(
            report.ai_insights?.impact ||
            "",
            20,
            140,
            {
                maxWidth:170
            }
        );

        pdf.text(
            report.ai_insights?.action ||
            "",
            20,
            170,
            {
                maxWidth:170
            }
        );

        pdf.save(
            `Oviaria_Report_${report.condition}.pdf`
        );

    }

    catch(error){

        console.error(error);

    }

};

loadHistory();
