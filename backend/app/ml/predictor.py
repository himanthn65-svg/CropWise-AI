from pathlib import Path

import joblib
import pandas as pd


class CropPredictor:
    """
    Production prediction service for the CropWise AI
    crop recommendation model.
    """

    # ========================================================
    # Project Paths
    # ========================================================

    PROJECT_ROOT = Path(__file__).resolve().parents[3]

    MODEL_PATH = (
        PROJECT_ROOT
        / "backend"
        / "trained_models"
        / "crop_recommendation_model.joblib"
    )

    LABEL_ENCODER_PATH = (
        PROJECT_ROOT
        / "ml"
        / "dataset"
        / "processed"
        / "label_encoder.joblib"
    )

    FEATURE_COLUMNS = [
        "N",
        "P",
        "K",
        "temperature",
        "humidity",
        "ph",
        "rainfall",
    ]

    # ========================================================
    # Initialization
    # ========================================================

    def __init__(self):
        """Load the trained model and label encoder."""

        if not self.MODEL_PATH.exists():
            raise FileNotFoundError(
                f"Trained model not found at:\n"
                f"{self.MODEL_PATH}"
            )

        if not self.LABEL_ENCODER_PATH.exists():
            raise FileNotFoundError(
                f"Label encoder not found at:\n"
                f"{self.LABEL_ENCODER_PATH}"
            )

        self.model = joblib.load(self.MODEL_PATH)

        self.label_encoder = joblib.load(
            self.LABEL_ENCODER_PATH
        )

    # ========================================================
    # Input Validation
    # ========================================================

    def _validate_input(self, input_data: dict):
        """
        Validate prediction input.
        """

        missing_features = [
            feature
            for feature in self.FEATURE_COLUMNS
            if feature not in input_data
        ]

        if missing_features:
            raise ValueError(
                f"Missing required features: "
                f"{missing_features}"
            )

        for feature in self.FEATURE_COLUMNS:

            value = input_data[feature]

            if value is None:
                raise ValueError(
                    f"{feature} cannot be empty."
                )

            try:
                numeric_value = float(value)
            except (TypeError, ValueError):
                raise ValueError(
                    f"{feature} must be a numeric value."
                )

            if pd.isna(numeric_value):
                raise ValueError(
                    f"{feature} cannot be NaN."
                )

    # ========================================================
    # Prediction
    # ========================================================

    def predict(self, input_data: dict):
        """
        Predict the most suitable crop.

        Returns:
            dict containing:
            - recommended_crop
            - confidence
            - alternatives
        """

        self._validate_input(input_data)

        # Create DataFrame in the exact feature order
        input_df = pd.DataFrame(
            [
                {
                    feature: float(input_data[feature])
                    for feature in self.FEATURE_COLUMNS
                }
            ]
        )

        # ----------------------------------------------------
        # Main Prediction
        # ----------------------------------------------------

        prediction = self.model.predict(input_df)[0]

        crop_name = self.label_encoder.inverse_transform(
            [prediction]
        )[0]

        # ----------------------------------------------------
        # Prediction Probabilities
        # ----------------------------------------------------

        probabilities = self.model.predict_proba(
            input_df
        )[0]

        model_classes = self.model.classes_

        # Create crop + probability pairs
        crop_probabilities = []

        for class_value, probability in zip(
            model_classes,
            probabilities
        ):
            crop = self.label_encoder.inverse_transform(
                [int(class_value)]
            )[0]

            crop_probabilities.append(
                {
                    "crop": crop,
                    "confidence": round(
                        float(probability) * 100,
                        2
                    )
                }
            )

        # Sort highest probability first
        crop_probabilities.sort(
            key=lambda item: item["confidence"],
            reverse=True
        )

        # ----------------------------------------------------
        # Top Recommendation
        # ----------------------------------------------------

        recommended_crop = crop_probabilities[0]

        # ----------------------------------------------------
        # Alternative Recommendations
        # ----------------------------------------------------

        alternatives = crop_probabilities[1:4]

        return {
            "recommended_crop": recommended_crop["crop"],
            "confidence": recommended_crop["confidence"],
            "alternatives": alternatives,
        }


# ============================================================
# Singleton Predictor
# ============================================================

predictor = CropPredictor()