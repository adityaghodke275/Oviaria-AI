// ==========================================
// USER INFO
// ==========================================
const userEmail = sessionStorage.getItem("userEmail");

if (userEmail) {
    document.getElementById("userEmail").innerText = userEmail;
    document.getElementById("userName").innerText = userEmail + " ▼";
}

// ==========================================
// BMI Calculation
// ==========================================
const weight = document.getElementById("weight");
const height = document.getElementById("height");
const bmiValue = document.getElementById("bmiValue");

function calculateBMI() {
    const w = parseFloat(weight.value) || 0;
    const h = parseFloat(height.value) || 0;

    if (w > 0 && h > 0) {
        const bmi = w / ((h / 100) * (h / 100));
        bmiValue.innerText = bmi.toFixed(2);
    } else {
        bmiValue.innerText = "0.0";
    }
}

weight.addEventListener("input", calculateBMI);
height.addEventListener("input", calculateBMI);
calculateBMI();

// ==========================================
// Predict Button
// ==========================================
document
    .getElementById("predictBtn")
    .addEventListener("click", async function () {

        try {

            const data = {

                "Age (yrs)": Number(
                    document.getElementById("age").value
                ),

                "Pulse rate(bpm)": Number(
                    document.getElementById("pulseRate").value
                ),

                "Weight (Kg)": Number(
                    document.getElementById("weight").value
                ),

                "Height(Cm)": Number(
                    document.getElementById("height").value
                ),

                "Cycle (Irregularity)":
                    document.getElementById("cycle").value === "Irregular"
                        ? 1
                        : 0,

                "Cycle length(days)": Number(
                    document.getElementById("cycleLength").value
                ),

                "Marriage Status (Yrs)": Number(
                    document.getElementById("marriage").value
                ),

                "Pregnant(Y/N)":
                    document.getElementById("pregnant").value === "Yes"
                        ? 1
                        : 0,

                "No. of abortions": Number(
                    document.getElementById("abortions").value
                ),

                "Hip(inch)": Number(
                    document.getElementById("hip").value
                ),

                "Waist(inch)": Number(
                    document.getElementById("waist").value
                ),

                "Weight gain(Y/N)":
                    document.getElementById("weightGain").value === "Yes"
                        ? 1
                        : 0,

                "hair growth(Y/N)":
                    document.getElementById("hairGrowth").value === "Yes"
                        ? 1
                        : 0,

                "Skin darkening (Y/N)":
                    document.getElementById("skinDarkening").value === "Yes"
                        ? 1
                        : 0,

                "Hair loss(Y/N)":
                    document.getElementById("hairLoss").value === "Yes"
                        ? 1
                        : 0,

                "Pimples(Y/N)":
                    document.getElementById("pimples").value === "Yes"
                        ? 1
                        : 0,

                "Fast food (Y/N)":
                    document.getElementById("fastFood").value === "Yes"
                        ? 1
                        : 0,

                "Reg.Exercise(Y/N)":
                    document.getElementById("exercise").value === "Yes"
                        ? 1
                        : 0,

                "Sleep Duration (hr)": Number(
                    document.getElementById("sleep").value
                )
            };

            const response = await fetch(
                "http://127.0.0.1:5000/predict",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(data)
                }
            );

            const result = await response.json();

            sessionStorage.setItem(
                "prediction",
                JSON.stringify(result)
            );

            window.location.href = "Result.html";

        } catch (error) {

            console.error(error);

            alert("Prediction Failed");
        }
    });

// ==========================================
// DROPDOWN MENU
// ==========================================
const dropdown = document.querySelector(".dropdown");
const dropdownContent = document.querySelector(".dropdown-content");

dropdown?.addEventListener("click", function (e) {
    e.stopPropagation();

    dropdownContent.style.display =
        dropdownContent.style.display === "block"
            ? "none"
            : "block";
});

document.addEventListener("click", function () {
    if (dropdownContent) {
        dropdownContent.style.display = "none";
    }
});

// ==========================================
// LOGOUT
// ==========================================
const logoutBtn = document.getElementById("logoutBtn");

logoutBtn?.addEventListener("click", function (e) {
    e.preventDefault();

    sessionStorage.clear();
    localStorage.clear();

    window.location.href = "Login.html";
});