import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, accuracy_score

# Load dataset

df = pd.read_csv(
    "../data/processed/final_dataset.csv"
)

# Features

X = df.drop(
    columns=[
        "Condition",
        "PCOS (Y/N)",
        "PCOD_Score"
    ]
)

# Target

y = df["Condition"]

# Encode target

label_encoder = LabelEncoder()

y_encoded = label_encoder.fit_transform(y)

# Numerical columns

numerical_columns = X.columns.tolist()

# Preprocessing

preprocessor = ColumnTransformer(
    transformers=[
        (
            "num",
            StandardScaler(),
            numerical_columns
        )
    ]
)

# Model

model = Pipeline([
    ("preprocessor", preprocessor),
    (
        "classifier",
        RandomForestClassifier(
            n_estimators=200,
            random_state=42
        )
    )
])

# Train test split

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y_encoded,
    test_size=0.2,
    random_state=42,
    stratify=y_encoded
)

# Train

model.fit(
    X_train,
    y_train
)

# Predict

y_pred = model.predict(X_test)

# Metrics

print(
    "\nAccuracy:",
    accuracy_score(y_test, y_pred)
)

print(
    classification_report(
        y_test,
        y_pred,
        target_names=label_encoder.classes_
    )
)

# Save

joblib.dump(
    model,
    "models/pcod_pcos_model.pkl"
)

joblib.dump(
    label_encoder,
    "models/label_encoder.pkl"
)

print(
    "\nModel Saved Successfully"
)