document.addEventListener("DOMContentLoaded", () => {
    requireLogin();

    const resultLoading = document.getElementById("resultLoading");
    const resultError = document.getElementById("resultError");
    const resultErrorMessage = document.getElementById("resultErrorMessage");
    const resultContent = document.getElementById("resultContent");

    const recommendedCrop = document.getElementById("recommendedCrop");
    const resultCropIcon = document.getElementById("resultCropIcon");
    const confidenceValue = document.getElementById("confidenceValue");
    const confidenceProgress = document.getElementById("confidenceProgress");

    const alternativesGrid = document.getElementById("alternativesGrid");

    const resultNitrogen = document.getElementById("resultNitrogen");
    const resultPhosphorus = document.getElementById("resultPhosphorus");
    const resultPotassium = document.getElementById("resultPotassium");
    const resultTemperature = document.getElementById("resultTemperature");
    const resultHumidity = document.getElementById("resultHumidity");
    const resultPh = document.getElementById("resultPh");
    const resultRainfall = document.getElementById("resultRainfall");

    const resultExplanation = document.getElementById("resultExplanation");

    const tryAgainButton = document.getElementById("tryAgainButton");
    const backToRecommendButton = document.getElementById(
        "backToRecommendButton"
    );
    const saveResultButton = document.getElementById("saveResultButton");
    const saveStatus = document.getElementById("saveStatus");

    const logoutButton = document.getElementById("logoutButton");
    const mobileLogoutButton = document.getElementById("mobileLogoutButton");

    const mobileMenuButton = document.getElementById("mobileMenuButton");
    const mobileDashboardNav = document.getElementById(
        "mobileDashboardNav"
    );


    /* =====================================================
       MOBILE NAVIGATION
       ===================================================== */

    if (mobileMenuButton && mobileDashboardNav) {
        mobileMenuButton.addEventListener("click", () => {
            mobileDashboardNav.classList.toggle("open");
        });
    }


    /* =====================================================
       LOGOUT
       ===================================================== */

    if (logoutButton) {
        logoutButton.addEventListener("click", () => {
            logout();
        });
    }

    if (mobileLogoutButton) {
        mobileLogoutButton.addEventListener("click", () => {
            logout();
        });
    }


    /* =====================================================
       HELPER FUNCTIONS
       ===================================================== */

    function formatCropName(crop) {
        if (!crop) {
            return "Unknown Crop";
        }

        return crop
            .toString()
            .replace(/_/g, " ")
            .replace(/\b\w/g, letter => letter.toUpperCase());
    }


    function getCropIcon(crop) {
        const cropIcons = {
            apple: "🍎",
            banana: "🍌",
            blackgram: "🌱",
            chickpea: "🌱",
            coconut: "🥥",
            coffee: "☕",
            cotton: "🌿",
            grapes: "🍇",
            jute: "🌿",
            kidneybeans: "🫘",
            lentil: "🌱",
            maize: "🌽",
            mango: "🥭",
            mothbeans: "🌱",
            mungbean: "🌱",
            muskmelon: "🍈",
            orange: "🍊",
            papaya: "🥭",
            pigeonpeas: "🌱",
            pomegranate: "🍎",
            rice: "🌾",
            watermelon: "🍉"
        };

        const key = crop?.toString().toLowerCase();

        return cropIcons[key] || "🌱";
    }


    function getConfidenceValue(value) {
        if (value === undefined || value === null) {
            return null;
        }

        const number = Number(value);

        if (!Number.isFinite(number)) {
            return null;
        }

        /*
         * API may return:
         * 0.987
         * or
         * 98.7
         */

        if (number <= 1) {
            return number * 100;
        }

        return number;
    }


    function getRecommendedCrop(data) {
        return (
            data?.crop ||
            data?.predicted_crop ||
            data?.recommended_crop ||
            data?.prediction ||
            data?.label ||
            data?.result ||
            null
        );
    }


    function getConfidence(data) {
        return (
            data?.confidence ??
            data?.prediction_confidence ??
            data?.probability ??
            data?.score ??
            null
        );
    }


    function getAlternatives(data) {
        const alternatives =
            data?.alternatives ??
            data?.top_alternatives ??
            data?.top_predictions ??
            data?.recommendations ??
            [];

        if (!Array.isArray(alternatives)) {
            return [];
        }

        return alternatives;
    }


    function getAlternativeCrop(item) {
        if (typeof item === "string") {
            return item;
        }

        return (
            item?.crop ||
            item?.predicted_crop ||
            item?.recommended_crop ||
            item?.label ||
            item?.name ||
            null
        );
    }


    function getAlternativeConfidence(item) {
        if (typeof item === "string") {
            return null;
        }

        return (
            item?.confidence ??
            item?.probability ??
            item?.score ??
            item?.prediction_confidence ??
            null
        );
    }


    function getExplanation(data, crop) {
        return (
            data?.explanation ||
            data?.reason ||
            data?.message ||
            `CropWise AI selected ${formatCropName(crop)} because the soil and weather conditions provided closely match the patterns learned by the machine learning model.`
        );
    }


    /* =====================================================
       ERROR STATE
       ===================================================== */

    function showResultError(message) {
        if (resultLoading) {
            resultLoading.hidden = true;
        }

        if (resultContent) {
            resultContent.hidden = true;
        }

        if (resultErrorMessage) {
            resultErrorMessage.textContent = message;
        }

        if (resultError) {
            resultError.hidden = false;
        }
    }


    /* =====================================================
       SHOW RESULT
       ===================================================== */

    function showResultContent() {
        if (resultLoading) {
            resultLoading.hidden = true;
        }

        if (resultError) {
            resultError.hidden = true;
        }

        if (resultContent) {
            resultContent.hidden = false;
        }
    }


    /* =====================================================
       DISPLAY INPUT CONDITIONS
       ===================================================== */

    function displayInputConditions(inputs) {
        if (!inputs) {
            return;
        }

        if (resultNitrogen) {
            resultNitrogen.textContent = inputs.N ?? "—";
        }

        if (resultPhosphorus) {
            resultPhosphorus.textContent = inputs.P ?? "—";
        }

        if (resultPotassium) {
            resultPotassium.textContent = inputs.K ?? "—";
        }

        if (resultTemperature) {
            resultTemperature.textContent =
                inputs.temperature ?? "—";
        }

        if (resultHumidity) {
            resultHumidity.textContent =
                inputs.humidity ?? "—";
        }

        if (resultPh) {
            resultPh.textContent = inputs.ph ?? "—";
        }

        if (resultRainfall) {
            resultRainfall.textContent =
                inputs.rainfall ?? "—";
        }
    }


    /* =====================================================
       DISPLAY CONFIDENCE
       ===================================================== */

    function displayConfidence(rawConfidence) {
        const confidence = getConfidenceValue(rawConfidence);

        if (confidence === null) {
            if (confidenceValue) {
                confidenceValue.textContent = "—";
            }

            if (confidenceProgress) {
                confidenceProgress.style.width = "0%";
            }

            return;
        }

        const safeConfidence = Math.max(
            0,
            Math.min(100, confidence)
        );

        if (confidenceValue) {
            confidenceValue.textContent =
                `${safeConfidence.toFixed(1)}%`;
        }

        if (confidenceProgress) {
            confidenceProgress.style.width =
                `${safeConfidence}%`;
        }
    }


    /* =====================================================
       DISPLAY ALTERNATIVES
       ===================================================== */

    function displayAlternatives(alternatives, recommendedCrop) {

        if (!alternativesGrid) {
            return;
        }

        const mainCropKey =
            recommendedCrop?.toString().toLowerCase();

        const filteredAlternatives =
            alternatives.filter(item => {

                const crop = getAlternativeCrop(item);

                if (!crop) {
                    return false;
                }

                return (
                    crop.toString().toLowerCase() !==
                    mainCropKey
                );
            });


        if (filteredAlternatives.length === 0) {

            alternativesGrid.innerHTML = `
                <div class="alternative-empty">
                    No additional crop alternatives were returned
                    for this prediction.
                </div>
            `;

            return;
        }


        alternativesGrid.innerHTML =
            filteredAlternatives
                .slice(0, 3)
                .map((item, index) => {

                    const crop =
                        getAlternativeCrop(item);

                    const rawConfidence =
                        getAlternativeConfidence(item);

                    const confidence =
                        getConfidenceValue(rawConfidence);

                    const confidenceText =
                        confidence === null
                            ? "Suitable alternative"
                            : `${confidence.toFixed(1)}% confidence`;

                    return `
                        <div class="alternative-card">

                            <div class="alternative-rank">
                                ${index + 2}
                            </div>

                            <div class="alternative-icon">
                                ${getCropIcon(crop)}
                            </div>

                            <h3>
                                ${formatCropName(crop)}
                            </h3>

                            <div class="alternative-confidence">
                                ${confidenceText}
                            </div>

                        </div>
                    `;
                })
                .join("");
    }


    /* =====================================================
       SAVE STATUS
       ===================================================== */

    function showSaveStatus(message, type) {
        if (!saveStatus) {
            return;
        }

        saveStatus.textContent = message;
        saveStatus.className = `save-status ${type}`;
        saveStatus.hidden = false;
    }


    function hideSaveStatus() {
        if (!saveStatus) {
            return;
        }

        saveStatus.hidden = true;
    }


    /* =====================================================
       SAVE / CONFIRM PREDICTION
       ===================================================== */

    function savePrediction() {

        if (!saveResultButton) {
            return;
        }

        hideSaveStatus();

        /*
         * IMPORTANT:
         *
         * The /predict API already saves the recommendation
         * to PostgreSQL before returning the response.
         *
         * Therefore we must NOT send another POST request
         * to /history here.
         */

        const storedResult =
            sessionStorage.getItem("cropwise_prediction");

        if (!storedResult) {
            showSaveStatus(
                "Prediction data is no longer available.",
                "error"
            );

            return;
        }

        try {
            const prediction =
                JSON.parse(storedResult);

            if (!prediction?.recommendation_id) {
                showSaveStatus(
                    "Recommendation could not be confirmed.",
                    "error"
                );

                return;
            }

            saveResultButton.disabled = true;
            saveResultButton.textContent = "Saved ✓";

            showSaveStatus(
                "Recommendation saved successfully.",
                "success"
            );

        } catch (error) {

            console.error(
                "Unable to confirm prediction:",
                error
            );

            showSaveStatus(
                "Unable to confirm recommendation.",
                "error"
            );
        }
    }


    /* =====================================================
       BUTTON ACTIONS
       ===================================================== */

    if (tryAgainButton) {
        tryAgainButton.addEventListener("click", () => {

            sessionStorage.removeItem(
                "cropwise_prediction"
            );

            sessionStorage.removeItem(
                "cropwise_inputs"
            );

            window.location.href = "recommend.html";
        });
    }


    if (backToRecommendButton) {
        backToRecommendButton.addEventListener("click", () => {

            sessionStorage.removeItem(
                "cropwise_prediction"
            );

            sessionStorage.removeItem(
                "cropwise_inputs"
            );

            window.location.href = "recommend.html";
        });
    }


    if (saveResultButton) {
        saveResultButton.addEventListener(
            "click",
            savePrediction
        );
    }


    /* =====================================================
       LOAD RESULT DATA
       ===================================================== */

    try {

        const storedResult =
            sessionStorage.getItem("cropwise_prediction");

        const storedInputs =
            sessionStorage.getItem("cropwise_inputs");


        if (!storedResult) {
            showResultError(
                "No prediction was found. Please make a new crop recommendation."
            );

            return;
        }


        const prediction =
            JSON.parse(storedResult);

        const inputs =
            storedInputs
                ? JSON.parse(storedInputs)
                : null;


        console.log(
            "Stored prediction:",
            prediction
        );

        console.log(
            "Stored inputs:",
            inputs
        );


        /* ---------------------------------------------
           Recommended crop
           --------------------------------------------- */

        const crop =
            getRecommendedCrop(prediction);


        if (!crop) {
            showResultError(
                "The prediction response did not contain a recommended crop."
            );

            return;
        }


        if (recommendedCrop) {
            recommendedCrop.textContent =
                formatCropName(crop);
        }


        if (resultCropIcon) {
            resultCropIcon.textContent =
                getCropIcon(crop);
        }


        /* ---------------------------------------------
           Confidence
           --------------------------------------------- */

        displayConfidence(
            getConfidence(prediction)
        );


        /* ---------------------------------------------
           Alternatives
           --------------------------------------------- */

        displayAlternatives(
            getAlternatives(prediction),
            crop
        );


        /* ---------------------------------------------
           Input conditions
           --------------------------------------------- */

        displayInputConditions(inputs);


        /* ---------------------------------------------
           Explanation
           --------------------------------------------- */

        if (resultExplanation) {
            resultExplanation.textContent =
                getExplanation(
                    prediction,
                    crop
                );
        }


        /* ---------------------------------------------
           Save state
           --------------------------------------------- */

        if (
            saveResultButton &&
            prediction.recommendation_id
        ) {
            saveResultButton.textContent =
                "Save Recommendation";

            saveResultButton.disabled = false;
        }


        /* ---------------------------------------------
           Show complete result
           --------------------------------------------- */

        showResultContent();


    } catch (error) {

        console.error(
            "Unable to load recommendation result:",
            error
        );

        showResultError(
            "Unable to load the recommendation result. Please try again."
        );
    }
});