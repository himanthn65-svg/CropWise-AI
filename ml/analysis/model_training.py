from pathlib import Path

import joblib
import pandas as pd

from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.neighbors import KNeighborsClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.svm import SVC


# ============================================================
# CropWise AI - Model Training
# ============================================================

print("\n" + "=" * 60)
print("                 CROPWISE AI")
print("                 MODEL TRAINING")
print("=" * 60)


# ============================================================
# 1. Project Paths
# ============================================================

PROJECT_ROOT = Path(__file__).resolve().parents[2]

PROCESSED_DIR = (
    PROJECT_ROOT
    / "ml"
    / "dataset"
    / "processed"
)

MODEL_DIR = (
    PROJECT_ROOT
    / "backend"
    / "trained_models"
)

MODEL_DIR.mkdir(parents=True, exist_ok=True)


# ============================================================
# 2. Load Processed Data
# ============================================================

print("\n[1] LOADING PROCESSED DATA")
print("-" * 60)

X_train = pd.read_csv(
    PROCESSED_DIR / "X_train.csv"
)

X_test = pd.read_csv(
    PROCESSED_DIR / "X_test.csv"
)

y_train = pd.read_csv(
    PROCESSED_DIR / "y_train.csv"
)["label"]

y_test = pd.read_csv(
    PROCESSED_DIR / "y_test.csv"
)["label"]

print(f"X_train shape: {X_train.shape}")
print(f"X_test shape : {X_test.shape}")
print(f"y_train shape: {y_train.shape}")
print(f"y_test shape : {y_test.shape}")


# ============================================================
# 3. Load Label Encoder
# ============================================================

print("\n[2] LOADING LABEL ENCODER")
print("-" * 60)

label_encoder = joblib.load(
    PROCESSED_DIR / "label_encoder.joblib"
)

print(
    f"Number of crop classes: "
    f"{len(label_encoder.classes_)}"
)


# ============================================================
# 4. Define Models
# ============================================================

print("\n[3] DEFINING MACHINE LEARNING MODELS")
print("-" * 60)

models = {

    "Logistic Regression": Pipeline([
        ("scaler", StandardScaler()),
        (
            "model",
            LogisticRegression(
                max_iter=2000,
                random_state=42
            )
        )
    ]),

    "KNN": Pipeline([
        ("scaler", StandardScaler()),
        (
            "model",
            KNeighborsClassifier(
                n_neighbors=5
            )
        )
    ]),

    "Decision Tree": DecisionTreeClassifier(
        random_state=42
    ),

    "Random Forest": RandomForestClassifier(
        n_estimators=300,
        random_state=42,
        n_jobs=-1
    ),

    "SVM": Pipeline([
        ("scaler", StandardScaler()),
        (
            "model",
            SVC(
                kernel="rbf",
                probability=True,
                random_state=42
            )
        )
    ]),
}


print("Models selected:")
for model_name in models:
    print(f" - {model_name}")


# ============================================================
# 5. Train Models
# ============================================================

print("\n[4] TRAINING MODELS")
print("-" * 60)

trained_models = {}

for model_name, model in models.items():

    print(f"\nTraining: {model_name}")

    model.fit(
        X_train,
        y_train
    )

    trained_models[model_name] = model

    train_accuracy = model.score(
        X_train,
        y_train
    )

    test_accuracy = model.score(
        X_test,
        y_test
    )

    print(
        f"Training Accuracy: "
        f"{train_accuracy:.4f}"
    )

    print(
        f"Testing Accuracy : "
        f"{test_accuracy:.4f}"
    )


# ============================================================
# 6. Compare Models
# ============================================================

print("\n[5] MODEL COMPARISON")
print("-" * 60)

results = []

for model_name, model in trained_models.items():

    train_accuracy = model.score(
        X_train,
        y_train
    )

    test_accuracy = model.score(
        X_test,
        y_test
    )

    results.append({
        "Model": model_name,
        "Training Accuracy": train_accuracy,
        "Testing Accuracy": test_accuracy,
        "Overfitting Gap": (
            train_accuracy - test_accuracy
        )
    })


results_df = pd.DataFrame(results)

results_df = results_df.sort_values(
    by="Testing Accuracy",
    ascending=False
).reset_index(drop=True)


print("\nModel Performance:")
print(
    results_df.to_string(
        index=False,
        formatters={
            "Training Accuracy": "{:.4f}".format,
            "Testing Accuracy": "{:.4f}".format,
            "Overfitting Gap": "{:.4f}".format,
        }
    )
)


# ============================================================
# 7. Select Best Model
# ============================================================

print("\n[6] SELECTING BEST MODEL")
print("-" * 60)

best_model_name = results_df.iloc[0]["Model"]

best_model = trained_models[
    best_model_name
]

best_test_accuracy = results_df.iloc[0][
    "Testing Accuracy"
]

print(f"Best Model      : {best_model_name}")
print(
    f"Testing Accuracy: "
    f"{best_test_accuracy:.4f}"
)


# ============================================================
# 8. Save All Trained Models
# ============================================================

print("\n[7] SAVING TRAINED MODELS")
print("-" * 60)

for model_name, model in trained_models.items():

    safe_name = (
        model_name
        .lower()
        .replace(" ", "_")
    )

    model_path = (
        MODEL_DIR
        / f"{safe_name}.joblib"
    )

    joblib.dump(
        model,
        model_path
    )

    print(f"Saved: {model_path.name}")


# ============================================================
# 9. Save Best Model
# ============================================================

print("\n[8] SAVING BEST MODEL")
print("-" * 60)

best_model_path = (
    MODEL_DIR
    / "crop_recommendation_model.joblib"
)

joblib.dump(
    best_model,
    best_model_path
)

print(
    f"Best model saved as:\n"
    f"{best_model_path}"
)


# ============================================================
# 10. Save Model Results
# ============================================================

print("\n[9] SAVING MODEL COMPARISON")
print("-" * 60)

results_path = (
    MODEL_DIR
    / "model_comparison.csv"
)

results_df.to_csv(
    results_path,
    index=False
)

print(
    f"Comparison saved as:\n"
    f"{results_path}"
)


# ============================================================
# 11. Save Model Metadata
# ============================================================

print("\n[10] SAVING MODEL METADATA")
print("-" * 60)

metadata = {
    "best_model": best_model_name,
    "best_test_accuracy": float(
        best_test_accuracy
    ),
    "feature_columns": list(
        X_train.columns
    ),
    "number_of_features": X_train.shape[1],
    "number_of_classes": len(
        label_encoder.classes_
    ),
    "classes": list(
        label_encoder.classes_
    ),
    "training_samples": len(X_train),
    "testing_samples": len(X_test),
}

metadata_path = (
    MODEL_DIR
    / "model_metadata.joblib"
)

joblib.dump(
    metadata,
    metadata_path
)

print(
    f"Metadata saved as:\n"
    f"{metadata_path}"
)


# ============================================================
# 12. Final Summary
# ============================================================

print("\n" + "=" * 60)
print("             MODEL TRAINING COMPLETED")
print("=" * 60)

print(f"Models trained     : {len(models)}")
print(f"Training samples   : {len(X_train)}")
print(f"Testing samples    : {len(X_test)}")
print(f"Crop classes       : {len(label_encoder.classes_)}")
print(f"Best model         : {best_model_name}")
print(
    f"Best test accuracy : "
    f"{best_test_accuracy:.4f}"
)

print("=" * 60)