document.addEventListener("DOMContentLoaded", async () => {
    requireLogin();

    // =========================
    // Elements
    // =========================

    const profileForm = document.getElementById("profileForm");

    const fullNameInput = document.getElementById("fullName");
    const profileEmailInput = document.getElementById("profileEmail");
    const phoneInput = document.getElementById("phone");
    const bioInput = document.getElementById("bio");

    const stateInput = document.getElementById("state");
    const districtInput = document.getElementById("district");
    const villageInput = document.getElementById("village");

    const farmSizeInput = document.getElementById("farmSize");
    const soilTypeInput = document.getElementById("soilType");
    const irrigationInput = document.getElementById("irrigation");

    const farmerTypeInput = document.getElementById("farmerType");
    const farmingExperienceInput =
        document.getElementById("farmingExperience");
    const primaryCropsInput =
        document.getElementById("primaryCrops");
    const preferredSeasonInput =
        document.getElementById("preferredSeason");
    const farmingGoalInput =
        document.getElementById("farmingGoal");

    const profilePhotoInput =
        document.getElementById("profilePhotoInput");
    const profilePhotoPreview =
        document.getElementById("profilePhotoPreview");
    const profileAvatar =
        document.getElementById("profileAvatar");
    const avatarInitial =
        document.getElementById("avatarInitial");

    const profileDisplayName =
        document.getElementById("profileDisplayName");
    const profileDisplayEmail =
        document.getElementById("profileDisplayEmail");

    const removePhotoButton =
        document.getElementById("removePhotoButton");

    const bioCount =
        document.getElementById("bioCount");

    const accountEmail =
        document.getElementById("accountEmail");
    const accountCreated =
        document.getElementById("accountCreated");
    const totalPredictions =
        document.getElementById("totalPredictions");
    const lastPrediction =
        document.getElementById("lastPrediction");

    const profileCompletion =
        document.getElementById("profileCompletion");
    const profileProgressBar =
        document.getElementById("profileProgressBar");

    const profileError =
        document.getElementById("profileError");
    const profileSuccess =
        document.getElementById("profileSuccess");

    const saveProfileButton =
        document.getElementById("saveProfileButton");
    const saveButtonText =
        saveProfileButton?.querySelector(".button-text");
    const saveButtonLoader =
        saveProfileButton?.querySelector(".button-loader");

    const resetButton =
        document.getElementById("resetButton");

    const logoutButton =
        document.getElementById("logoutButton");
    const mobileLogoutButton =
        document.getElementById("mobileLogoutButton");

    const mobileMenuButton =
        document.getElementById("mobileMenuButton");
    const mobileDashboardNav =
        document.getElementById("mobileDashboardNav");


    // =========================
    // Mobile Navigation
    // =========================

    if (mobileMenuButton && mobileDashboardNav) {
        mobileMenuButton.addEventListener("click", () => {
            mobileDashboardNav.classList.toggle("open");
        });
    }

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


    // =========================
    // State
    // =========================

    let currentProfile = null;
    let accountData = null;

    let selectedProfilePhoto = null;
    let photoRemoved = false;


    // =========================
    // Helpers
    // =========================

    function showError(message) {
        profileSuccess.hidden = true;
        profileError.textContent = message;
        profileError.hidden = false;
    }

    function showSuccess(message) {
        profileError.hidden = true;
        profileSuccess.textContent = message;
        profileSuccess.hidden = false;
    }

    function clearMessages() {
        profileError.hidden = true;
        profileSuccess.hidden = true;
        profileError.textContent = "";
        profileSuccess.textContent = "";
    }


    function formatDate(dateValue) {
        if (!dateValue) {
            return "—";
        }

        const date = new Date(dateValue);

        if (Number.isNaN(date.getTime())) {
            return "—";
        }

        return date.toLocaleDateString(undefined, {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    }


    function getInitial(name) {
        if (!name) {
            return "H";
        }

        return name.trim().charAt(0).toUpperCase();
    }


    function updateAvatar(name) {
        const initial = getInitial(name);

        avatarInitial.textContent = initial;

        if (!selectedProfilePhoto && !currentProfile?.profile_photo) {
            profilePhotoPreview.hidden = true;
            avatarInitial.hidden = false;
        }
    }


    function updateDisplayName(name) {
        const displayName = name?.trim() || "Himanth";

        profileDisplayName.textContent = displayName;
        updateAvatar(displayName);
    }


    // =========================
    // Bio Counter
    // =========================

    function updateBioCount() {
        const length = bioInput.value.length;
        bioCount.textContent = length;
    }

    bioInput.addEventListener("input", updateBioCount);


    // =========================
    // Profile Photo
    // =========================

    profilePhotoInput.addEventListener("change", () => {
        const file = profilePhotoInput.files?.[0];

        if (!file) {
            return;
        }

        if (!file.type.startsWith("image/")) {
            showError("Please select a valid image file.");
            profilePhotoInput.value = "";
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            showError("Profile photo must be smaller than 2 MB.");
            profilePhotoInput.value = "";
            return;
        }

        clearMessages();

        selectedProfilePhoto = file;
        photoRemoved = false;

        const reader = new FileReader();

        reader.onload = (event) => {
            profilePhotoPreview.src = event.target.result;
            profilePhotoPreview.hidden = false;
            avatarInitial.hidden = true;
        };

        reader.readAsDataURL(file);
    });


    removePhotoButton.addEventListener("click", () => {
        selectedProfilePhoto = null;
        photoRemoved = true;

        profilePhotoInput.value = "";
        profilePhotoPreview.src = "";
        profilePhotoPreview.hidden = true;

        avatarInitial.hidden = false;

        updateAvatar(fullNameInput.value);

        clearMessages();
    });


    // =========================
    // Profile Data
    // =========================

    function fillProfile(profile) {
        if (!profile) {
            return;
        }

        currentProfile = profile;

        fullNameInput.value = profile.full_name || "";
        phoneInput.value = profile.phone || "";
        bioInput.value = profile.bio || "";

        stateInput.value = profile.state || "";
        districtInput.value = profile.district || "";
        villageInput.value = profile.village || "";

        farmSizeInput.value =
            profile.farm_size ?? "";

        soilTypeInput.value =
            profile.soil_type || "";

        irrigationInput.value =
            profile.irrigation || "";

        farmerTypeInput.value =
            profile.farmer_type || "";

        farmingExperienceInput.value =
            profile.farming_experience || "";

        primaryCropsInput.value =
            profile.primary_crops || "";

        preferredSeasonInput.value =
            profile.preferred_season || "";

        farmingGoalInput.value =
            profile.farming_goal || "";

        updateDisplayName(profile.full_name);
        updateBioCount();

        if (profile.profile_photo) {
            profilePhotoPreview.src =
                profile.profile_photo;

            profilePhotoPreview.hidden = false;
            avatarInitial.hidden = true;
        } else {
            profilePhotoPreview.src = "";
            profilePhotoPreview.hidden = true;
            avatarInitial.hidden = false;
        }

        photoRemoved = false;
        selectedProfilePhoto = null;
    }


    // =========================
    // Account Information
    // =========================

    async function loadAccountInformation() {
        try {
            const account = await apiRequest("/auth/me");

            accountData = account;

            const email = account?.email || "—";

            profileEmailInput.value = email;
            profileDisplayEmail.textContent = email;
            accountEmail.textContent = email;

            accountCreated.textContent =
                formatDate(account?.created_at);

        } catch (error) {
            console.error(
                "Unable to load account information:",
                error
            );

            profileEmailInput.value = "Unable to load";
            profileDisplayEmail.textContent = "Unable to load";
            accountEmail.textContent = "—";
            accountCreated.textContent = "—";
        }
    }


    // =========================
    // Prediction Statistics
    // =========================

    async function loadPredictionStatistics() {
        try {
            const historyResponse =
                await apiRequest("/history");

            let history = historyResponse;

            if (Array.isArray(historyResponse?.history)) {
                history = historyResponse.history;
            } else if (Array.isArray(historyResponse?.data)) {
                history = historyResponse.data;
            } else if (
                Array.isArray(historyResponse?.predictions)
            ) {
                history = historyResponse.predictions;
            }

            if (!Array.isArray(history)) {
                history = [];
            }

            totalPredictions.textContent =
                history.length;

            if (history.length > 0) {
                const latest = history[0];

                const latestDate =
                    latest.created_at ||
                    latest.predicted_at ||
                    latest.timestamp ||
                    latest.date;

                lastPrediction.textContent =
                    formatDate(latestDate);
            } else {
                lastPrediction.textContent = "—";
            }

        } catch (error) {
            console.error(
                "Unable to load prediction statistics:",
                error
            );

            totalPredictions.textContent = "—";
            lastPrediction.textContent = "—";
        }
    }


    // =========================
    // Profile Completion
    // =========================

    function calculateProfileCompletion() {
        const fields = [
            fullNameInput.value.trim(),
            phoneInput.value.trim(),
            bioInput.value.trim(),
            stateInput.value.trim(),
            districtInput.value.trim(),
            villageInput.value.trim(),
            farmSizeInput.value,
            soilTypeInput.value,
            irrigationInput.value,
            farmerTypeInput.value,
            farmingExperienceInput.value,
            primaryCropsInput.value.trim(),
            preferredSeasonInput.value,
            farmingGoalInput.value
        ];

        const completedFields =
            fields.filter(
                value =>
                    value !== null &&
                    value !== undefined &&
                    String(value).trim() !== ""
            ).length;

        const percentage = Math.round(
            (completedFields / fields.length) * 100
        );

        profileCompletion.textContent =
            `${percentage}%`;

        profileProgressBar.style.width =
            `${percentage}%`;
    }


    // Update completion whenever the user edits the form.

    profileForm.addEventListener("input", () => {
        calculateProfileCompletion();
    });

    profileForm.addEventListener("change", () => {
        calculateProfileCompletion();
    });


    // =========================
    // Photo Conversion
    // =========================

    function fileToDataURL(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = () => {
                resolve(reader.result);
            };

            reader.onerror = () => {
                reject(
                    new Error("Unable to read profile photo.")
                );
            };

            reader.readAsDataURL(file);
        });
    }


    // =========================
    // Form Data
    // =========================

    async function buildProfileData() {
        let profilePhoto = currentProfile?.profile_photo || null;

        if (photoRemoved) {
            profilePhoto = null;
        }

        if (selectedProfilePhoto) {
            profilePhoto =
                await fileToDataURL(selectedProfilePhoto);
        }

        const farmSizeValue =
            farmSizeInput.value.trim();

        return {
            full_name: fullNameInput.value.trim(),

            phone:
                phoneInput.value.trim() || null,

            bio:
                bioInput.value.trim() || null,

            profile_photo: profilePhoto,

            state:
                stateInput.value.trim() || null,

            district:
                districtInput.value.trim() || null,

            village:
                villageInput.value.trim() || null,

            farm_size:
                farmSizeValue
                    ? Number(farmSizeValue)
                    : null,

            soil_type:
                soilTypeInput.value || null,

            irrigation:
                irrigationInput.value || null,

            farmer_type:
                farmerTypeInput.value || null,

            farming_experience:
                farmingExperienceInput.value || null,

            primary_crops:
                primaryCropsInput.value.trim() || null,

            preferred_season:
                preferredSeasonInput.value || null,

            farming_goal:
                farmingGoalInput.value || null
        };
    }


    // =========================
    // Validation
    // =========================

    function validateProfile() {
        const fullName =
            fullNameInput.value.trim();

        if (fullName.length < 2) {
            return "Full name must contain at least 2 characters.";
        }

        const farmSize =
            farmSizeInput.value.trim();

        if (farmSize) {
            const numericFarmSize =
                Number(farmSize);

            if (
                Number.isNaN(numericFarmSize) ||
                numericFarmSize <= 0
            ) {
                return "Farm size must be greater than 0.";
            }
        }

        if (phoneInput.value.trim()) {
            const phone =
                phoneInput.value.trim();

            if (phone.length < 7) {
                return "Please enter a valid phone number.";
            }
        }

        return null;
    }


    // =========================
    // Loading State
    // =========================

    function setSavingState(isSaving) {
        saveProfileButton.disabled = isSaving;

        if (isSaving) {
            saveButtonText.hidden = true;
            saveButtonLoader.hidden = false;
        } else {
            saveButtonText.hidden = false;
            saveButtonLoader.hidden = true;
        }
    }


    // =========================
    // Save Profile
    // =========================

    profileForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        clearMessages();

        const validationError =
            validateProfile();

        if (validationError) {
            showError(validationError);
            return;
        }

        setSavingState(true);

        try {
            const profileData =
                await buildProfileData();

            let savedProfile;

            if (currentProfile?.id) {
                savedProfile = await apiRequest(
                    "/profile",
                    {
                        method: "PUT",
                        body: JSON.stringify(profileData)
                    }
                );
            } else {
                savedProfile = await apiRequest(
                    "/profile",
                    {
                        method: "POST",
                        body: JSON.stringify(profileData)
                    }
                );
            }

            currentProfile = savedProfile;

            selectedProfilePhoto = null;
            photoRemoved = false;

            fillProfile(savedProfile);

            calculateProfileCompletion();

            showSuccess(
                "Profile updated successfully."
            );

        } catch (error) {
            console.error(
                "Unable to save profile:",
                error
            );

            showError(
                error.message ||
                "Unable to save your profile. Please try again."
            );

        } finally {
            setSavingState(false);
        }
    });


    // =========================
    // Reset
    // =========================

    resetButton.addEventListener("click", () => {
        clearMessages();

        if (currentProfile) {
            fillProfile(currentProfile);
        } else {
            profileForm.reset();

            profilePhotoPreview.src = "";
            profilePhotoPreview.hidden = true;
            avatarInitial.hidden = false;

            updateDisplayName("Himanth");
            updateBioCount();
        }

        selectedProfilePhoto = null;
        photoRemoved = false;

        calculateProfileCompletion();
    });


    // =========================
    // Load Existing Profile
    // =========================

    async function loadProfile() {
        try {
            const profile =
                await apiRequest("/profile");

            fillProfile(profile);

        } catch (error) {

            if (
                error.message &&
                error.message.toLowerCase().includes(
                    "farmer profile not found"
                )
            ) {
                currentProfile = null;

                updateDisplayName("Himanth");
                updateBioCount();

                showSuccess(
                    "Your profile is ready. Add your details and save."
                );

                return;
            }

            console.error(
                "Unable to load profile:",
                error
            );

            showError(
                error.message ||
                "Unable to load your profile."
            );
        }
    }


    // =========================
    // Initial Load
    // =========================

    await loadAccountInformation();
    await loadProfile();
    await loadPredictionStatistics();

    calculateProfileCompletion();
});