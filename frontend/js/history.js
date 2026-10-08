document.addEventListener("DOMContentLoaded", async () => {

    requireLogin();

    /* =====================================================
       ELEMENTS
       ===================================================== */

    const logoutButton =
        document.getElementById("logoutButton");

    const mobileLogoutButton =
        document.getElementById("mobileLogoutButton");

    const mobileMenuButton =
        document.getElementById("mobileMenuButton");

    const mobileDashboardNav =
        document.getElementById("mobileDashboardNav");

    const historyEmpty =
        document.getElementById("historyEmpty");

    const historyGrid =
        document.getElementById("historyGrid");

    const totalPredictions =
        document.getElementById("totalPredictions");

    const latestHistoryCrop =
        document.getElementById("latestHistoryCrop");


    /* =====================================================
       MOBILE MENU
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
       CROP NAME
       ===================================================== */

    function formatCropName(crop) {

        if (!crop) {
            return "Unknown";
        }

        return crop
            .toString()
            .replace(/_/g, " ")
            .replace(/\b\w/g, letter => letter.toUpperCase());

    }


    /* =====================================================
       CROP ICON
       ===================================================== */

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

        const key =
            crop?.toString().toLowerCase();

        return cropIcons[key] || "🌱";

    }


    /* =====================================================
       CONFIDENCE
       ===================================================== */

    function formatConfidence(value) {

        if (
            value === undefined ||
            value === null ||
            value === ""
        ) {
            return "—";
        }

        const number = Number(value);

        if (Number.isNaN(number)) {
            return "—";
        }

        if (number <= 1) {
            return `${(number * 100).toFixed(1)}%`;
        }

        return `${number.toFixed(1)}%`;

    }


    /* =====================================================
       DATE
       ===================================================== */

    function formatDate(dateValue) {

        if (!dateValue) {
            return "Date unavailable";
        }

        const date =
            new Date(dateValue);

        if (Number.isNaN(date.getTime())) {
            return "Date unavailable";
        }

        return date.toLocaleDateString(
            undefined,
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );

    }


    /* =====================================================
       DISPLAY VALUE
       ===================================================== */

    function displayValue(value, suffix = "") {

        if (
            value === undefined ||
            value === null ||
            value === ""
        ) {
            return "—";
        }

        return `${value}${suffix}`;

    }


    /* =====================================================
       EMPTY STATE
       ===================================================== */

    function showEmpty() {

        if (historyEmpty) {
            historyEmpty.hidden = false;
        }

        if (historyGrid) {
            historyGrid.innerHTML = "";
        }

        if (totalPredictions) {
            totalPredictions.textContent = "0";
        }

        if (latestHistoryCrop) {
            latestHistoryCrop.textContent = "—";
        }

    }


    /* =====================================================
       ERROR STATE
       ===================================================== */

    function showError(message) {

        if (historyEmpty) {
            historyEmpty.hidden = true;
        }

        if (historyGrid) {

            historyGrid.innerHTML = `
                <div class="history-error-simple">
                    ${message || "Unable to load prediction history."}
                </div>
            `;

        }

        if (totalPredictions) {
            totalPredictions.textContent = "—";
        }

        if (latestHistoryCrop) {
            latestHistoryCrop.textContent = "—";
        }

    }


    /* =====================================================
       RENDER HISTORY
       ===================================================== */

    function renderHistory(history) {

        if (
            !Array.isArray(history) ||
            history.length === 0
        ) {

            showEmpty();
            return;

        }


        /* =================================================
           SUMMARY
           ================================================= */

        if (totalPredictions) {

            totalPredictions.textContent =
                history.length;

        }


        if (latestHistoryCrop) {

            latestHistoryCrop.textContent =
                formatCropName(
                    history[0].recommended_crop
                );

        }


        if (historyEmpty) {
            historyEmpty.hidden = true;
        }


        /* =================================================
           HISTORY CARDS
           ================================================= */

        historyGrid.innerHTML =
            history.map((item, index) => {

                const crop =
                    item.recommended_crop || "Unknown";

                const confidence =
                    formatConfidence(item.confidence);

                const date =
                    formatDate(item.created_at);


                return `

                    <article class="history-card">

                        <div class="history-card-top">

                            <div class="history-crop-info">

                                <div class="history-crop-icon">
                                    ${getCropIcon(crop)}
                                </div>

                                <div>

                                    <h3>
                                        ${formatCropName(crop)}
                                    </h3>

                                    <span>
                                        AI Crop Recommendation
                                    </span>

                                </div>

                            </div>


                            <div class="history-confidence">

                                <strong>
                                    ${confidence}
                                </strong>

                                <span>
                                    Confidence
                                </span>

                            </div>

                        </div>


                        <div class="history-card-divider"></div>


                        <div class="history-card-details">


                            <div class="history-detail">

                                <span>
                                    Nitrogen
                                </span>

                                <strong>
                                    ${displayValue(item.nitrogen)}
                                </strong>

                            </div>


                            <div class="history-detail">

                                <span>
                                    Phosphorus
                                </span>

                                <strong>
                                    ${displayValue(item.phosphorus)}
                                </strong>

                            </div>


                            <div class="history-detail">

                                <span>
                                    Potassium
                                </span>

                                <strong>
                                    ${displayValue(item.potassium)}
                                </strong>

                            </div>


                            <div class="history-detail">

                                <span>
                                    Temperature
                                </span>

                                <strong>
                                    ${displayValue(item.temperature, " °C")}
                                </strong>

                            </div>


                            <div class="history-detail">

                                <span>
                                    Humidity
                                </span>

                                <strong>
                                    ${displayValue(item.humidity, "%")}
                                </strong>

                            </div>


                            <div class="history-detail">

                                <span>
                                    Soil pH
                                </span>

                                <strong>
                                    ${displayValue(item.ph)}
                                </strong>

                            </div>


                            <div class="history-detail">

                                <span>
                                    Rainfall
                                </span>

                                <strong>
                                    ${displayValue(item.rainfall, " mm")}
                                </strong>

                            </div>


                        </div>


                        <div class="history-card-footer">

                            <div class="history-date">
                                🕒 ${date}
                            </div>


                            <button
                                type="button"
                                class="history-view-button"
                                data-index="${index}"
                            >
                                View Details →
                            </button>

                        </div>

                    </article>

                `;

            }).join("");


        /* =================================================
           VIEW DETAILS
           ================================================= */

        const viewButtons =
            document.querySelectorAll(
                ".history-view-button"
            );


        viewButtons.forEach(button => {

            button.addEventListener("click", () => {

                const index =
                    Number(button.dataset.index);

                const prediction =
                    history[index];

                if (!prediction) {
                    return;
                }


                /* -----------------------------------------
                   RESULT DATA
                ----------------------------------------- */

                const resultData = {

                    recommended_crop:
                        prediction.recommended_crop,

                    confidence:
                        prediction.confidence,

                    recommendation_id:
                        prediction.id,

                    alternatives: []

                };


                /* -----------------------------------------
                   INPUT DATA
                ----------------------------------------- */

                const inputData = {

                    N:
                        prediction.nitrogen,

                    P:
                        prediction.phosphorus,

                    K:
                        prediction.potassium,

                    temperature:
                        prediction.temperature,

                    humidity:
                        prediction.humidity,

                    ph:
                        prediction.ph,

                    rainfall:
                        prediction.rainfall

                };


                /* -----------------------------------------
                   SAVE TO SESSION
                ----------------------------------------- */

                sessionStorage.setItem(
                    "cropwise_prediction",
                    JSON.stringify(resultData)
                );


                sessionStorage.setItem(
                    "cropwise_inputs",
                    JSON.stringify(inputData)
                );


                sessionStorage.setItem(
                    "cropwise_history_prediction",
                    JSON.stringify(prediction)
                );


                /* -----------------------------------------
                   OPEN RESULT PAGE
                ----------------------------------------- */

                window.location.href =
                    "result.html";

            });

        });

    }


    /* =====================================================
       LOAD HISTORY
       ===================================================== */

    async function loadHistory() {

        try {

            const history =
                await apiRequest("/history");


            if (!Array.isArray(history)) {

                throw new Error(
                    "Invalid history data received from the server."
                );

            }


            renderHistory(history);

        } catch (error) {

            console.error(
                "History loading error:",
                error
            );


            showError(
                error?.message ||
                "Unable to load prediction history."
            );

        }

    }


    /* =====================================================
       LOAD HISTORY
       ===================================================== */

    await loadHistory();

});