from groq import Groq
import os
import joblib
import pandas as pd
import json
import os
from dotenv import load_dotenv

load_dotenv()
client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)

# ==================================================
# Load Model and Label Encoder
# ==================================================

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

MODEL_PATH = os.path.join(
    BASE_DIR,
    "models",
    "pcod_pcos_model.pkl"
)

LABEL_ENCODER_PATH = os.path.join(
    BASE_DIR,
    "models",
    "label_encoder.pkl"
)

model = joblib.load(MODEL_PATH)

label_encoder = joblib.load(
    LABEL_ENCODER_PATH
)

def ai_insights(
    condition,
    confidence,
    symptoms
):

    prompt = f"""
You are a healthcare AI assistant for Oviaria AI.

Prediction:
{condition}

Confidence:
{confidence}%

Symptoms Reported:
{', '.join(symptoms)}

Generate exactly 3 sections:

1. What We Observed
2. Possible Health Impact
3. What You Can Do

Write 2-3 complete sentences for each section.

What We Observed:
Explain the user's symptoms and how they relate to the predicted condition.

Possible Health Impact:
Explain possible future health effects if symptoms continue.

What You Can Do:
Provide practical lifestyle recommendations including diet, exercise, sleep, hydration, stress management and medical follow-up if needed.

Use simple language.
Be supportive and professional.

Do not exceed 80 words per section.

Return ONLY valid JSON in this exact format:

{{
  "observed":"text",
  "impact":"text",
  "action":"text"
}}
"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.4
    )

    return json.loads(
         response.choices[0].message.content
    )

# ==================================================
# Prediction Function
# ==================================================

def predict_condition(user_data):

    try:

        # Convert JSON/Input Dictionary to DataFrame

        df = pd.DataFrame([user_data])

        # ==========================================
        # Feature Engineering
        # ==========================================

        # BMI

        df["BMI"] = (
            df["Weight (Kg)"]
            /
            (
                (df["Height(Cm)"] / 100) ** 2
            )
        )

        # Waist Hip Ratio

        df["Waist_Hip_Ratio"] = (
            df["Waist(inch)"]
            /
            df["Hip(inch)"]
        )

        # ==========================================
        # Prediction
        # ==========================================

        prediction = model.predict(df)[0]

        probabilities = model.predict_proba(df)[0]

        # Decode Prediction

        condition = label_encoder.inverse_transform(
            [prediction]
        )[0]

        # Confidence

        confidence = round(
            max(probabilities) * 100,
            2
        )
        # ==========================================
        # Symptoms For AI Explanation
        # ==========================================
        
        symptoms = []

        if len(symptoms) == 0:
         symptoms.append("No major symptoms reported")

        if user_data["Weight gain(Y/N)"] == 1:
         symptoms.append("Weight Gain")

        if user_data["hair growth(Y/N)"] == 1:
         symptoms.append("Excess Hair Growth")

        if user_data["Hair loss(Y/N)"] == 1:
         symptoms.append("Hair Loss")

        if user_data["Pimples(Y/N)"] == 1:
         symptoms.append("Pimples")

        if user_data["Cycle (Irregularity)"] == 1:
         symptoms.append("Irregular Menstrual  Periods")

        if user_data["Skin darkening (Y/N)"] == 1:
         symptoms.append("Skin Darkening")

        # Generate AI Explanation

        ai_response = ai_insights(
                condition,
                confidence,     
                symptoms
        )
        

        # Class Probabilities

        class_probabilities = {}

        for label, prob in zip(
            label_encoder.classes_,
            probabilities
        ):

            class_probabilities[label] = round(
                prob * 100,
                2
            )

        return {

            "condition": condition,

            "confidence": confidence,

            "probabilities": class_probabilities,

            "ai_insights": ai_response 


        }

    except Exception as e:

        return {

            "error": str(e)

        }


# ==================================================
# Testing
# ==================================================

if __name__ == "__main__":

    sample = {

        "Age (yrs)": 24,

        "Weight (Kg)": 70,

        "Height(Cm)": 160,

        "Pulse rate(bpm)": 72,

        "Cycle (Irregularity)": 0,

        "Cycle length(days)": 3,

        "Marriage Status (Yrs)": 0,

        "Pregnant(Y/N)": 0,

        "No. of abortions": 0,

        "Hip(inch)": 40,

        "Waist(inch)": 34,

        "Weight gain(Y/N)": 1,

        "hair growth(Y/N)": 1,

        "Skin darkening (Y/N)": 0,

        "Hair loss(Y/N)": 0,

        "Pimples(Y/N)": 0,

        "Fast food (Y/N)": 0,

        "Reg.Exercise(Y/N)": 1,

        "Sleep Duration (hr)": 9

    }

    result = predict_condition(sample)

    print(result)