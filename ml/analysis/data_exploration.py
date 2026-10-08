from pathlib import Path

import numpy as np
import pandas as pd


# ============================================================
# CropWise AI - Dataset Exploration
# ============================================================

print("\n" + "=" * 60)
print("                 CROPWISE AI")
print("              DATASET EXPLORATION")
print("=" * 60)


# ============================================================
# 1. Locate Dataset
# ============================================================

# Current file:
# ml/analysis/data_exploration.py
#
# parents[0] = analysis
# parents[1] = ml
# parents[1] / "dataset" = ml/dataset

PROJECT_ROOT = Path(__file__).resolve().parents[2]
DATA_PATH = PROJECT_ROOT / "ml" / "dataset" / "Crop_recommendation.csv"


print("\n[1] DATASET LOCATION")
print("-" * 60)
print(f"Dataset path: {DATA_PATH}")


# ============================================================
# 2. Check Dataset Exists
# ============================================================

if not DATA_PATH.exists():
    print("\nERROR: Dataset file was not found.")
    print(f"Expected location:\n{DATA_PATH}")
    print("\nPlease make sure the CSV is inside:")
    print("ml/dataset/")
    raise FileNotFoundError(DATA_PATH)

print("Dataset found successfully.")


# ============================================================
# 3. Load Dataset
# ============================================================

df = pd.read_csv(DATA_PATH)


# ============================================================
# 4. Dataset Shape
# ============================================================

print("\n[2] DATASET SHAPE")
print("-" * 60)
print(f"Rows    : {df.shape[0]}")
print(f"Columns : {df.shape[1]}")


# ============================================================
# 5. Column Names
# ============================================================

print("\n[3] COLUMN NAMES")
print("-" * 60)

for number, column in enumerate(df.columns, start=1):
    print(f"{number}. {column}")


# ============================================================
# 6. First 5 Rows
# ============================================================

print("\n[4] FIRST 5 ROWS")
print("-" * 60)
print(df.head().to_string())


# ============================================================
# 7. Last 5 Rows
# ============================================================

print("\n[5] LAST 5 ROWS")
print("-" * 60)
print(df.tail().to_string())


# ============================================================
# 8. Dataset Information
# ============================================================

print("\n[6] DATASET INFORMATION")
print("-" * 60)
df.info()


# ============================================================
# 9. Data Types
# ============================================================

print("\n[7] DATA TYPES")
print("-" * 60)
print(df.dtypes)


# ============================================================
# 10. Missing Values
# ============================================================

print("\n[8] MISSING VALUES")
print("-" * 60)

missing_values = df.isnull().sum()

print(missing_values)

total_missing = missing_values.sum()

print(f"\nTotal missing values: {total_missing}")


# ============================================================
# 11. Duplicate Rows
# ============================================================

print("\n[9] DUPLICATE ROWS")
print("-" * 60)

duplicate_count = df.duplicated().sum()

print(f"Number of duplicate rows: {duplicate_count}")


# ============================================================
# 12. Statistical Summary
# ============================================================

print("\n[10] STATISTICAL SUMMARY")
print("-" * 60)

print(df.describe().to_string())


# ============================================================
# 13. Unique Values
# ============================================================

print("\n[11] UNIQUE VALUES")
print("-" * 60)

for column in df.columns:
    print(f"{column}: {df[column].nunique()} unique values")


# ============================================================
# 14. Crop Distribution
# ============================================================

print("\n[12] CROP DISTRIBUTION")
print("-" * 60)

if "label" in df.columns:
    crop_distribution = df["label"].value_counts()

    print(crop_distribution.to_string())

    print(f"\nNumber of different crops: {df['label'].nunique()}")


# ============================================================
# 15. Numerical Columns
# ============================================================

print("\n[13] NUMERICAL COLUMNS")
print("-" * 60)

numerical_columns = df.select_dtypes(include=np.number).columns.tolist()

print(numerical_columns)


# ============================================================
# 16. Categorical Columns
# ============================================================

print("\n[14] CATEGORICAL COLUMNS")
print("-" * 60)

categorical_columns = df.select_dtypes(
    include=["object", "category"]
).columns.tolist()

print(categorical_columns)


# ============================================================
# 17. Dataset Memory Usage
# ============================================================

print("\n[15] MEMORY USAGE")
print("-" * 60)

memory_usage = df.memory_usage(deep=True).sum()

print(f"Memory used: {memory_usage / 1024:.2f} KB")


# ============================================================
# 18. Basic Dataset Validation
# ============================================================

print("\n[16] BASIC VALIDATION")
print("-" * 60)

if df.empty:
    print("WARNING: Dataset is empty.")
else:
    print("Dataset contains data.")

if total_missing == 0:
    print("Missing values: PASS")
else:
    print("Missing values: NEEDS REVIEW")

if duplicate_count == 0:
    print("Duplicate rows: PASS")
else:
    print("Duplicate rows: NEEDS REVIEW")


# ============================================================
# 19. Exploration Summary
# ============================================================

print("\n" + "=" * 60)
print("             EXPLORATION COMPLETED")
print("=" * 60)

print(f"Dataset rows       : {df.shape[0]}")
print(f"Dataset columns    : {df.shape[1]}")
print(f"Missing values     : {total_missing}")
print(f"Duplicate rows     : {duplicate_count}")

if "label" in df.columns:
    print(f"Crop classes       : {df['label'].nunique()}")

print("=" * 60)