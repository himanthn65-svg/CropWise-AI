from pathlib import Path

import joblib
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler


# ============================================================
# CropWise AI - Data Preprocessing
# ============================================================

print("\n" + "=" * 60)
print("                 CROPWISE AI")
print("              DATA PREPROCESSING")
print("=" * 60)


# ============================================================
# 1. Project Paths
# ============================================================

PROJECT_ROOT = Path(__file__).resolve().parents[2]

DATA_PATH = PROJECT_ROOT / "ml" / "dataset" / "Crop_recommendation.csv"

PROCESSED_DIR = PROJECT_ROOT / "ml" / "dataset" / "processed"

PROCESSED_DIR.mkdir(parents=True, exist_ok=True)


# ============================================================
# 2. Load Dataset
# ============================================================

print("\n[1] LOADING DATASET")
print("-" * 60)

if not DATA_PATH.exists():
    raise FileNotFoundError(
        f"Dataset not found at:\n{DATA_PATH}"
    )

df = pd.read_csv(DATA_PATH)

print(f"Dataset loaded successfully.")
print(f"Rows    : {df.shape[0]}")
print(f"Columns : {df.shape[1]}")


# ============================================================
# 3. Validate Required Columns
# ============================================================

print("\n[2] VALIDATING COLUMNS")
print("-" * 60)

FEATURE_COLUMNS = [
    "N",
    "P",
    "K",
    "temperature",
    "humidity",
    "ph",
    "rainfall",
]

TARGET_COLUMN = "label"

required_columns = FEATURE_COLUMNS + [TARGET_COLUMN]

missing_columns = [
    column for column in required_columns
    if column not in df.columns
]

if missing_columns:
    raise ValueError(
        f"Required columns are missing: {missing_columns}"
    )

print("All required columns are present.")


# ============================================================
# 4. Check Missing Values
# ============================================================

print("\n[3] CHECKING MISSING VALUES")
print("-" * 60)

missing_values = df[required_columns].isnull().sum()

print(missing_values)

if missing_values.sum() > 0:
    raise ValueError(
        "Missing values detected. "
        "Dataset must be cleaned before preprocessing."
    )

print("\nNo missing values found.")


# ============================================================
# 5. Check Duplicate Rows
# ============================================================

print("\n[4] CHECKING DUPLICATES")
print("-" * 60)

duplicate_count = df.duplicated().sum()

print(f"Duplicate rows: {duplicate_count}")

if duplicate_count > 0:
    print("Removing duplicate rows...")
    df = df.drop_duplicates().reset_index(drop=True)

print(f"Rows after duplicate check: {len(df)}")


# ============================================================
# 6. Separate Features and Target
# ============================================================

print("\n[5] SEPARATING FEATURES AND TARGET")
print("-" * 60)

X = df[FEATURE_COLUMNS].copy()
y = df[TARGET_COLUMN].copy()

print("\nFeatures:")
print(FEATURE_COLUMNS)

print(f"\nFeature shape: {X.shape}")
print(f"Target shape : {y.shape}")


# ============================================================
# 7. Encode Target Labels
# ============================================================

print("\n[6] ENCODING CROP LABELS")
print("-" * 60)

label_encoder = LabelEncoder()

y_encoded = label_encoder.fit_transform(y)

print("Crop classes:")

for encoded_value, crop_name in enumerate(label_encoder.classes_):
    print(f"{encoded_value:2d} -> {crop_name}")


# ============================================================
# 8. Train/Test Split
# ============================================================

print("\n[7] TRAIN / TEST SPLIT")
print("-" * 60)

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y_encoded,
    test_size=0.20,
    random_state=42,
    stratify=y_encoded,
)

print(f"Training samples: {len(X_train)}")
print(f"Testing samples : {len(X_test)}")
print(f"Test size       : 20%")
print(f"Random state    : 42")
print("Stratification  : Enabled")


# ============================================================
# 9. Feature Scaling
# ============================================================

print("\n[8] FEATURE SCALING")
print("-" * 60)

print(
    "Creating StandardScaler for models that require "
    "feature scaling (for example KNN and SVM)."
)

scaler = StandardScaler()

X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

print("Scaler fitted using training data only.")
print("Test data transformed using the training scaler.")


# ============================================================
# 10. Save Train/Test Data
# ============================================================

print("\n[9] SAVING PROCESSED DATA")
print("-" * 60)

X_train.to_csv(
    PROCESSED_DIR / "X_train.csv",
    index=False
)

X_test.to_csv(
    PROCESSED_DIR / "X_test.csv",
    index=False
)

pd.DataFrame(
    X_train_scaled,
    columns=FEATURE_COLUMNS
).to_csv(
    PROCESSED_DIR / "X_train_scaled.csv",
    index=False
)

pd.DataFrame(
    X_test_scaled,
    columns=FEATURE_COLUMNS
).to_csv(
    PROCESSED_DIR / "X_test_scaled.csv",
    index=False
)

pd.DataFrame(
    {"label": y_train}
).to_csv(
    PROCESSED_DIR / "y_train.csv",
    index=False
)

pd.DataFrame(
    {"label": y_test}
).to_csv(
    PROCESSED_DIR / "y_test.csv",
    index=False
)

print("Processed datasets saved successfully.")


# ============================================================
# 11. Save Label Encoder
# ============================================================

print("\n[10] SAVING LABEL ENCODER")
print("-" * 60)

label_encoder_path = PROCESSED_DIR / "label_encoder.joblib"

joblib.dump(
    label_encoder,
    label_encoder_path
)

print(f"Saved: {label_encoder_path}")


# ============================================================
# 12. Save Feature Scaler
# ============================================================

print("\n[11] SAVING FEATURE SCALER")
print("-" * 60)

scaler_path = PROCESSED_DIR / "scaler.joblib"

joblib.dump(
    scaler,
    scaler_path
)

print(f"Saved: {scaler_path}")


# ============================================================
# 13. Save Feature Information
# ============================================================

print("\n[12] SAVING FEATURE INFORMATION")
print("-" * 60)

feature_info = {
    "feature_columns": FEATURE_COLUMNS,
    "target_column": TARGET_COLUMN,
    "number_of_features": len(FEATURE_COLUMNS),
    "number_of_classes": len(label_encoder.classes_),
}

joblib.dump(
    feature_info,
    PROCESSED_DIR / "feature_info.joblib"
)

print("Feature information saved successfully.")


# ============================================================
# 14. Final Summary
# ============================================================

print("\n" + "=" * 60)
print("          PREPROCESSING COMPLETED")
print("=" * 60)

print(f"Original rows       : {len(df)}")
print(f"Features            : {len(FEATURE_COLUMNS)}")
print(f"Crop classes        : {len(label_encoder.classes_)}")
print(f"Training samples    : {len(X_train)}")
print(f"Testing samples     : {len(X_test)}")
print(f"Scaled data         : Yes")
print(f"Output directory    : {PROCESSED_DIR}")

print("=" * 60)