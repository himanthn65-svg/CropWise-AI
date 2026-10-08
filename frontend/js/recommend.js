document.addEventListener("DOMContentLoaded", () => {
    requireLogin();

    const recommendForm = document.getElementById("recommendForm");
    const recommendButton = document.getElementById("recommendButton");
    const buttonText = recommendButton?.querySelector(".button-text");
    const buttonLoader = recommendButton?.querySelector(".button-loader");
    const recommendError = document.getElementById("recommendError");

    const logoutButton = document.getElementById("logoutButton");
    const mobileLogoutButton = document.getElementById("mobileLogoutButton");

    const mobileMenuButton = document.getElementById("mobileMenuButton");
    const mobileDashboardNav = document.getElementById("mobileDashboardNav");


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
       FORM ELEMENTS
       ===================================================== */

    const nitrogenInput = document.getElementById("nitrogen");
    const phosphorusInput = document.getElementById("phosphorus");
    const potassiumInput = document.getElementById("potassium");
    const temperatureInput = document.getElementById("temperature");
    const humidityInput = document.getElementById("humidity");
    const phInput = document.getElementById("ph");
    const rainfallInput = document.getElementById("rainfall");


    /* =====================================================
       ERROR HANDLING
       ===================================================== */

    function showError(message) {
        if (!recommendError) return;

        recommendError.textContent = message;
        recommendError.hidden = false;
    }

    function hideError() {
        if (!recommendError) return;

        recommendError.textContent = "";
        recommendError.hidden = true;
    }


    /* =====================================================
       LOADING STATE
       ===================================================== */

    function setLoading(isLoading) {
        if (!recommendButton) return;

        recommendButton.disabled = isLoading;

        if (buttonText) {
            buttonText.textContent = isLoading
                ? "Analyzing Your Farm..."
                : "Analyze & Recommend Crop";
        }

        if (buttonLoader) {
            buttonLoader.hidden = !isLoading;
        }
    }


    /* =====================================================
       NUMBER VALIDATION
       ===================================================== */

    function getNumberValue(input, fieldName) {
        const value = Number(input.value);

        if (input.value.trim() === "") {
            throw new Error(`Please enter ${fieldName}.`);
        }

        if (!Number.isFinite(value)) {
            throw new Error(`Please enter a valid value for ${fieldName}.`);
        }

        return value;
    }


    /* =====================================================
       FORM SUBMISSION
       ===================================================== */

    if (recommendForm) {
        recommendForm.addEventListener("submit", async (event) => {

            event.preventDefault();

            hideError();

            try {

                /* -----------------------------------------
                   Read input values
                   ----------------------------------------- */

                const nitrogen = getNumberValue(
                    nitrogenInput,
                    "Nitrogen"
                );

                const phosphorus = getNumberValue(
                    phosphorusInput,
                    "Phosphorus"
                );

                const potassium = getNumberValue(
                    potassiumInput,
                    "Potassium"
                );

                const temperature = getNumberValue(
                    temperatureInput,
                    "Temperature"
                );

                const humidity = getNumberValue(
                    humidityInput,
                    "Humidity"
                );

                const ph = getNumberValue(
                    phInput,
                    "soil pH"
                );

                const rainfall = getNumberValue(
                    rainfallInput,
                    "Rainfall"
                );


                /* -----------------------------------------
                   Basic validation
                   ----------------------------------------- */

                if (nitrogen < 0) {
                    throw new Error("Nitrogen cannot be negative.");
                }

                if (phosphorus < 0) {
                    throw new Error("Phosphorus cannot be negative.");
                }

                if (potassium < 0) {
                    throw new Error("Potassium cannot be negative.");
                }

                if (humidity < 0 || humidity > 100) {
                    throw new Error("Humidity must be between 0 and 100%.");
                }

                if (ph < 0 || ph > 14) {
                    throw new Error("Soil pH must be between 0 and 14.");
                }

                if (rainfall < 0) {
                    throw new Error("Rainfall cannot be negative.");
                }


                /* -----------------------------------------
                   Show loading
                   ----------------------------------------- */

                setLoading(true);


                /* -----------------------------------------
                   Prepare prediction data
                   ----------------------------------------- */

                const predictionData = {
                    N: nitrogen,
                    P: phosphorus,
                    K: potassium,
                    temperature: temperature,
                    humidity: humidity,
                    ph: ph,
                    rainfall: rainfall
                };


                /* -----------------------------------------
                   Call ML prediction API
                   ----------------------------------------- */

                const result = await apiRequest("/predict", {
                    method: "POST",
                    body: JSON.stringify(predictionData)
                });


                console.log("Prediction response:", result);


                /* -----------------------------------------
                   Save result temporarily
                   ----------------------------------------- */

                sessionStorage.setItem(
                    "cropwise_prediction",
                    JSON.stringify(result)
                );

                sessionStorage.setItem(
                    "cropwise_inputs",
                    JSON.stringify(predictionData)
                );


                /* -----------------------------------------
                   Go to result page
                   ----------------------------------------- */

                window.location.href = "result.html";

            } catch (error) {

                console.error(
                    "Crop recommendation error:",
                    error
                );

                showError(
                    error.message ||
                    "Unable to generate crop recommendation. Please try again."
                );

                setLoading(false);
            }
        });
    }
});