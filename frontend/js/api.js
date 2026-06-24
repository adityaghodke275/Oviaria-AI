async function submitForm(userData) {

    try {

        const response = await fetch(
            "http://127.0.0.1:5000/predict",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(userData)
            }
        );

        const result = await response.json();

        localStorage.setItem(
            "predictionResult",
            JSON.stringify(result)
        );

        window.location.href = "result.html";

    } catch (error) {

        console.error(error);

        alert("Prediction failed.");

    }
}