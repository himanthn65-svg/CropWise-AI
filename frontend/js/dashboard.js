document.addEventListener("DOMContentLoaded", async () => {

    // ==========================================
    // Authentication
    // ==========================================

    requireLogin();


    // ==========================================
    // Elements
    // ==========================================

    const userEmailElement =
        document.getElementById("userEmail");

    const predictionCountElement =
        document.getElementById("predictionCount");

    const latestCropElement =
        document.getElementById("latestCrop");

    const recentPredictionsElement =
        document.getElementById("recentPredictions");

    const dashboardEmpty =
        document.getElementById("dashboardEmpty");

    const logoutButton =
        document.getElementById("logoutButton");

    const mobileLogoutButton =
        document.getElementById("mobileLogoutButton");

    const mobileMenuButton =
        document.getElementById("mobileMenuButton");

    const mobileDashboardNav =
        document.getElementById("mobileDashboardNav");


    // ==========================================
    // Mobile Menu
    // ==========================================

    if (mobileMenuButton && mobileDashboardNav) {

        mobileMenuButton.addEventListener("click", () => {

            mobileDashboardNav.classList.toggle("open");

        });

    }


    // ==========================================
    // Logout
    // ==========================================

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


    // ==========================================
    // Format Crop Name
    // ==========================================

    function formatCropName(crop) {

        if (!crop) {
            return "Unknown";
        }

        return crop
            .toString()
            .replace(/_/g, " ")
            .replace(/\b\w/g, letter => letter.toUpperCase());

    }


    // ==========================================
    // Format Date
    // ==========================================

    function formatDate(dateValue) {

        if (!dateValue) {
            return "Unknown date";
        }

        const date = new Date(dateValue);

        if (Number.isNaN(date.getTime())) {
            return "Unknown date";
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


    // ==========================================
    // Crop Icon
    // ==========================================

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


    // ==========================================
    // Get Crop From History Item
    // ==========================================

    function getCrop(item) {

        return (
            item.crop ||
            item.predicted_crop ||
            item.recommended_crop ||
            item.label ||
            "Unknown"
        );

    }


    // ==========================================
    // Get Confidence From History Item
    // ==========================================

    function getConfidence(item) {

        const value =
            item.confidence ??
            item.prediction_confidence ??
            item.probability;

        if (value === undefined || value === null) {
            return "—";
        }

        const number =
            Number(value);

        if (Number.isNaN(number)) {
            return "—";
        }

        // Backend may return either:
        // 0.98 or 98

        if (number <= 1) {

            return `${(number * 100).toFixed(1)}%`;

        }

        return `${number.toFixed(1)}%`;

    }


    // ==========================================
    // Get Date From History Item
    // ==========================================

    function getPredictionDate(item) {

        return (
            item.created_at ||
            item.predicted_at ||
            item.timestamp ||
            item.date
        );

    }


    // ==========================================
    // Load User Profile
    // ==========================================

    async function loadUserProfile() {

        try {

            const profile =
                await apiRequest("/profile/me");


            if (profile?.email) {

                userEmailElement.textContent =
                    `, ${profile.email}`;

            }

        } catch (error) {

            console.error(
                "Unable to load profile:",
                error
            );

        }

    }


    // ==========================================
    // Render Recent Predictions
    // ==========================================

    function renderRecentPredictions(history) {

        if (
            !history ||
            !Array.isArray(history) ||
            history.length === 0
        ) {

            recentPredictionsElement.innerHTML = "";

            dashboardEmpty.hidden = false;

            return;

        }


        dashboardEmpty.hidden = true;


        // Show latest 5
        const recent =
            history.slice(0, 5);


        recentPredictionsElement.innerHTML =
            recent.map(item => {

                const crop =
                    getCrop(item);

                const confidence =
                    getConfidence(item);

                const date =
                    formatDate(
                        getPredictionDate(item)
                    );

                return `
                    <div class="prediction-item">

                        <div class="prediction-crop">

                            <div class="prediction-crop-icon">
                                ${getCropIcon(crop)}
                            </div>

                            <div>

                                <strong>
                                    ${formatCropName(crop)}
                                </strong>

                                <small>
                                    AI Recommendation
                                </small>

                            </div>

                        </div>


                        <div class="prediction-confidence">
                            ${confidence}
                        </div>


                        <div class="prediction-date">
                            ${date}
                        </div>

                    </div>
                `;

            }).join("");

    }


    // ==========================================
    // Load Prediction History
    // ==========================================

    async function loadHistory() {

        try {

            recentPredictionsElement.innerHTML = `
                <div class="dashboard-loading">

                    <span class="dashboard-spinner"></span>

                    Loading predictions...

                </div>
            `;


            /*
             * Uses your existing history API.
             *
             * If your backend route is:
             * GET /history
             *
             * this is the correct endpoint.
             */

            const history =
                await apiRequest("/history");


            // Handle different possible API response shapes

            let historyList = history;


            if (Array.isArray(history?.history)) {

                historyList =
                    history.history;

            } else if (Array.isArray(history?.data)) {

                historyList =
                    history.data;

            } else if (Array.isArray(history?.predictions)) {

                historyList =
                    history.predictions;

            }


            if (!Array.isArray(historyList)) {

                historyList = [];

            }


            // ======================================
            // Stats
            // ======================================

            predictionCountElement.textContent =
                historyList.length;


            if (historyList.length > 0) {

                const latest =
                    historyList[0];

                latestCropElement.textContent =
                    formatCropName(
                        getCrop(latest)
                    );

            } else {

                latestCropElement.textContent =
                    "—";

            }


            // ======================================
            // Recent Predictions
            // ======================================

            renderRecentPredictions(
                historyList
            );


        } catch (error) {

            console.error(
                "Unable to load prediction history:",
                error
            );


            predictionCountElement.textContent =
                "—";

            latestCropElement.textContent =
                "—";


            recentPredictionsElement.innerHTML = `
                <div class="dashboard-loading">

                    Unable to load recent predictions.

                </div>
            `;

        }

    }


    // ==========================================
    // Initialize Dashboard
    // ==========================================

    await loadUserProfile();

    await loadHistory();

});