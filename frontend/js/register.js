document.addEventListener("DOMContentLoaded", () => {

    const registerForm =
        document.getElementById("registerForm");

    const emailInput =
        document.getElementById("registerEmail");

    const passwordInput =
        document.getElementById("registerPassword");

    const confirmPasswordInput =
        document.getElementById("registerConfirmPassword");

    const togglePassword =
        document.getElementById("toggleRegisterPassword");

    const toggleConfirmPassword =
        document.getElementById("toggleRegisterConfirmPassword");

    const termsCheckbox =
        document.getElementById("terms");

    const errorMessage =
        document.getElementById("registerError");

    const successMessage =
        document.getElementById("registerSuccess");

    const registerButton =
        document.getElementById("registerButton");

    const buttonText =
        registerButton.querySelector(".button-text");

    const buttonLoader =
        registerButton.querySelector(".button-loader");


    // ==========================================
    // Password Show / Hide
    // ==========================================

    togglePassword.addEventListener("click", () => {

        if (passwordInput.type === "password") {

            passwordInput.type = "text";

            togglePassword.textContent = "🙈";

        } else {

            passwordInput.type = "password";

            togglePassword.textContent = "👁";

        }

    });


    // ==========================================
    // Confirm Password Show / Hide
    // ==========================================

    toggleConfirmPassword.addEventListener("click", () => {

        if (confirmPasswordInput.type === "password") {

            confirmPasswordInput.type = "text";

            toggleConfirmPassword.textContent = "🙈";

        } else {

            confirmPasswordInput.type = "password";

            toggleConfirmPassword.textContent = "👁";

        }

    });


    // ==========================================
    // Registration
    // ==========================================

    registerForm.addEventListener("submit", async (event) => {

        event.preventDefault();


        errorMessage.hidden = true;
        successMessage.hidden = true;


        const email =
            emailInput.value.trim();

        const password =
            passwordInput.value;

        const confirmPassword =
            confirmPasswordInput.value;


        // ==========================================
        // Validation
        // ==========================================

        if (!email) {

            errorMessage.textContent =
                "Please enter your email address.";

            errorMessage.hidden = false;

            return;
        }


        if (!password) {

            errorMessage.textContent =
                "Please enter a password.";

            errorMessage.hidden = false;

            return;
        }


        if (password.length < 8) {

            errorMessage.textContent =
                "Password must be at least 8 characters.";

            errorMessage.hidden = false;

            return;
        }


        if (!confirmPassword) {

            errorMessage.textContent =
                "Please confirm your password.";

            errorMessage.hidden = false;

            return;
        }


        if (password !== confirmPassword) {

            errorMessage.textContent =
                "Passwords do not match.";

            errorMessage.hidden = false;

            return;
        }


        if (!termsCheckbox.checked) {

            errorMessage.textContent =
                "Please accept the Terms and Conditions.";

            errorMessage.hidden = false;

            return;
        }


        // ==========================================
        // Loading
        // ==========================================

        registerButton.disabled = true;

        buttonText.textContent =
            "Creating Account...";

        buttonLoader.hidden = false;


        try {

            // ======================================
            // REGISTER API
            // ======================================

            const data = await apiRequest(
                "/auth/register",
                {
                    method: "POST",

                    body: JSON.stringify({
                        email: email,
                        password: password
                    })
                }
            );


            console.log(
                "Registration successful:",
                data
            );


            // ======================================
            // Success
            // ======================================

            successMessage.textContent =
                "Account created successfully! You can now sign in.";

            successMessage.hidden = false;

            errorMessage.hidden = true;


            // Clear form
            registerForm.reset();


            // Reset password visibility
            passwordInput.type = "password";

            confirmPasswordInput.type = "password";

            togglePassword.textContent = "👁";

            toggleConfirmPassword.textContent = "👁";


        } catch (error) {

            console.error(
                "Registration error:",
                error
            );


            errorMessage.textContent =
                error.message ||
                "Registration failed. Please try again.";

            errorMessage.hidden = false;

            successMessage.hidden = true;

        } finally {

            registerButton.disabled = false;

            buttonText.textContent =
                "Create Account";

            buttonLoader.hidden = true;

        }

    });

});