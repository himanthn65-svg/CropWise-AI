from pathlib import Path

import joblib
import matplotlib.pyplot as plt
import pandas as pd

from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix,
    ConfusionMatrixDisplay,
    precision_score,
    recall_score,
    f1_score,
)
from sklearn.model_selection import cross_val_score


# ============================================================
# CropWise AI - Model Evaluation
# ============================================================

print("\n" + "=" * 60)
print("                 CROPWISE AI")
print("                MODEL EVALUATION")
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

PLOTS_DIR = (
    PROJECT_ROOT
    / "ml"
    / "analysis"
    / "plots"
)

PLOTS_DIR.mkdir(parents=True, exist_ok=True)


# ============================================================
# 2. Load Test Data
# ============================================================

print("\n[1] LOADING TEST DATA")
print("-" * 60)

X_test = pd.read_csv(
    PROCESSED_DIR / "X_test.csv"
)

y_test = pd.read_csv(
    PROCESSED_DIR / "y_test.csv"
)["label"]

X_train = pd.read_csv(
    PROCESSED_DIR / "X_train.csv"
)

y_train = pd.read_csv(
    PROCESSED_DIR / "y_train.csv"
)["label"]

print(f"Training samples: {len(X_train)}")
print(f"Testing samples : {len(X_test)}")
print(f"Features        : {X_test.shape[1]}")


# ============================================================
# 3. Load Best Model
# ============================================================

print("\n[2] LOADING BEST MODEL")
print("-" * 60)

model_path = (
    MODEL_DIR
    / "crop_recommendation_model.joblib"
)

model = joblib.load(model_path)

print("Model loaded successfully.")
print("Model: Random Forest")


# ============================================================
# 4. Load Label Encoder
# ============================================================

print("\n[3] LOADING LABEL ENCODER")
print("-" * 60)

label_encoder = joblib.load(
    PROCESSED_DIR / "label_encoder.joblib"
)

class_names = label_encoder.classes_

print(f"Number of classes: {len(class_names)}")


# ============================================================
# 5. Generate Predictions
# ============================================================

print("\n[4] GENERATING PREDICTIONS")
print("-" * 60)

y_pred = model.predict(X_test)

print("Predictions generated successfully.")


# ============================================================
# 6. Basic Metrics
# ============================================================

print("\n[5] CALCULATING METRICS")
print("-" * 60)

accuracy = accuracy_score(
    y_test,
    y_pred
)

precision = precision_score(
    y_test,
    y_pred,
    average="weighted",
    zero_division=0
)

recall = recall_score(
    y_test,
    y_pred,
    average="weighted",
    zero_division=0
)

f1 = f1_score(
    y_test,
    y_pred,
    average="weighted",
    zero_division=0
)

print(f"Accuracy : {accuracy:.4f}")
print(f"Precision: {precision:.4f}")
print(f"Recall   : {recall:.4f}")
print(f"F1 Score : {f1:.4f}")


# ============================================================
# 7. Classification Report
# ============================================================

print("\n[6] CLASSIFICATION REPORT")
print("-" * 60)

report = classification_report(
    y_test,
    y_pred,
    target_names=class_names,
    zero_division=0
)

print(report)


# ============================================================
# 8. Save Classification Report
# ============================================================

report_path = (
    MODEL_DIR
    / "classification_report.txt"
)

with open(
    report_path,
    "w",
    encoding="utf-8"
) as file:

    file.write(
        "CropWise AI - Classification Report\n"
    )

    file.write(
        "=" * 60 + "\n\n"
    )

    file.write(
        f"Accuracy : {accuracy:.4f}\n"
    )

    file.write(
        f"Precision: {precision:.4f}\n"
    )

    file.write(
        f"Recall   : {recall:.4f}\n"
    )

    file.write(
        f"F1 Score : {f1:.4f}\n\n"
    )

    file.write(report)

print(
    f"Report saved:\n{report_path}"
)


# ============================================================
# 9. Confusion Matrix
# ============================================================

print("\n[7] GENERATING CONFUSION MATRIX")
print("-" * 60)

cm = confusion_matrix(
    y_test,
    y_pred
)

fig, ax = plt.subplots(
    figsize=(14, 12)
)

display = ConfusionMatrixDisplay(
    confusion_matrix=cm,
    display_labels=class_names
)

display.plot(
    ax=ax,
    xticks_rotation=90,
    colorbar=False
)

ax.set_title(
    "CropWise AI - Random Forest Confusion Matrix"
)

plt.tight_layout()

confusion_matrix_path = (
    PLOTS_DIR
    / "confusion_matrix.png"
)

plt.savefig(
    confusion_matrix_path,
    dpi=300,
    bbox_inches="tight"
)

plt.close()

print(
    f"Confusion matrix saved:\n"
    f"{confusion_matrix_path}"
)


# ============================================================
# 10. Cross Validation
# ============================================================

print("\n[8] RUNNING CROSS-VALIDATION")
print("-" * 60)

cv_scores = cross_val_score(
    model,
    X_train,
    y_train,
    cv=5,
    scoring="accuracy",
    n_jobs=-1
)

print("5-Fold Cross-Validation Scores:")

for index, score in enumerate(cv_scores, start=1):
    print(
        f"Fold {index}: {score:.4f}"
    )

cv_mean = cv_scores.mean()
cv_std = cv_scores.std()

print(
    f"\nMean CV Accuracy: {cv_mean:.4f}"
)

print(
    f"CV Standard Deviation: {cv_std:.4f}"
)


# ============================================================
# 11. Feature Importance
# ============================================================

print("\n[9] CALCULATING FEATURE IMPORTANCE")
print("-" * 60)

if hasattr(model, "feature_importances_"):

    feature_importance = pd.DataFrame({
        "Feature": X_train.columns,
        "Importance": model.feature_importances_
    })

    feature_importance = (
        feature_importance
        .sort_values(
            by="Importance",
            ascending=False
        )
        .reset_index(drop=True)
    )

    print("\nFeature Importance:")

    print(
        feature_importance.to_string(
            index=False,
            formatters={
                "Importance": "{:.4f}".format
            }
        )
    )

    feature_importance_path = (
        MODEL_DIR
        / "feature_importance.csv"
    )

    feature_importance.to_csv(
        feature_importance_path,
        index=False
    )

    print(
        f"\nFeature importance saved:\n"
        f"{feature_importance_path}"
    )


# ============================================================
# 12. Save Evaluation Summary
# ============================================================

print("\n[10] SAVING EVALUATION SUMMARY")
print("-" * 60)

evaluation_summary = pd.DataFrame([
    {
        "Metric": "Accuracy",
        "Score": accuracy
    },
    {
        "Metric": "Weighted Precision",
        "Score": precision
    },
    {
        "Metric": "Weighted Recall",
        "Score": recall
    },
    {
        "Metric": "Weighted F1 Score",
        "Score": f1
    },
    {
        "Metric": "5-Fold CV Mean Accuracy",
        "Score": cv_mean
    },
    {
        "Metric": "5-Fold CV Std",
        "Score": cv_std
    }
])

evaluation_path = (
    MODEL_DIR
    / "evaluation_summary.csv"
)

evaluation_summary.to_csv(
    evaluation_path,
    index=False
)

print(
    f"Evaluation summary saved:\n"
    f"{evaluation_path}"
)


# ============================================================
# 13. Final Evaluation Summary
# ============================================================

print("\n" + "=" * 60)
print("            MODEL EVALUATION COMPLETED")
print("=" * 60)

print(f"Accuracy       : {accuracy:.4f}")
print(f"Precision      : {precision:.4f}")
print(f"Recall         : {recall:.4f}")
print(f"F1 Score       : {f1:.4f}")
print(f"Mean CV Score  : {cv_mean:.4f}")
print(f"CV Std         : {cv_std:.4f}")
print(f"Classes        : {len(class_names)}")

print("\nRandom Forest evaluation completed successfully.")

print("=" * 60)