
document.addEventListener("DOMContentLoaded", function () {

    const loginForm = document.getElementById("loginForm");

    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");

    const togglePassword = document.getElementById("togglePassword");

    const loginButton = document.getElementById("loginButton");
    const buttonText = loginButton.querySelector(".button-text");
    const buttonLoader = loginButton.querySelector(".button-loader");

    const loginError = document.getElementById("loginError");


    // =========================================
    // SHOW / HIDE PASSWORD
    // =========================================

    togglePassword.addEventListener("click", function () {

        if (passwordInput.type === "password") {

            passwordInput.type = "text";

            togglePassword.textContent = "🙈";
            togglePassword.setAttribute("aria-label", "Hide password");
            togglePassword.setAttribute("title", "Hide password");

        } else {

            passwordInput.type = "password";

            togglePassword.textContent = "👁";
            togglePassword.setAttribute("aria-label", "Show password");
            togglePassword.setAttribute("title", "Show password");

        }

    });


    // =========================================
    // LOGIN
    // =========================================

    loginForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        loginError.hidden = true;
        loginError.textContent = "";

        const email = emailInput.value.trim();
        const password = passwordInput.value;


        if (!email || !password) {
    showError("Please enter your email and password.");
    return;
}

const rememberMe = document.getElementById("rememberMe");

if (!rememberMe.checked) {
    showError("Please select Remember me to continue.");
    return;
}


        // Start loading ONLY after clicking Sign In
        setLoading(true);


        try {

            const data = await apiRequest("/auth/login", {
                method: "POST",

                body: JSON.stringify({
                    email: email,
                    password: password
                })
            });


            saveToken(data.access_token);

            window.location.href = "dashboard.html";


        } catch (error) {

            showError(
                error.message || "Login failed. Please check your credentials."
            );

        } finally {

            setLoading(false);

        }

    });


    // =========================================
    // LOADING STATE
    // =========================================

    function setLoading(isLoading) {

        loginButton.disabled = isLoading;

        if (isLoading) {

            buttonText.hidden = true;
            buttonLoader.hidden = false;

        } else {

            buttonText.hidden = false;
            buttonLoader.hidden = true;

        }

    }


    // =========================================
    // ERROR
    // =========================================

    function showError(message) {

        loginError.textContent = message;
        loginError.hidden = false;

    }

});