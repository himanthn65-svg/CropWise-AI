function saveToken(token) {
    localStorage.setItem("access_token", token);
}

function getToken() {
    return localStorage.getItem("access_token");
}

function removeToken() {
    localStorage.removeItem("access_token");
}

function isLoggedIn() {
    return Boolean(getToken());
}

function redirectTo(page) {
    window.location.href = page;
}

function requireLogin() {
    if (!isLoggedIn()) {
        redirectTo("login.html");
    }
}

function logout() {
    removeToken();
    redirectTo("login.html");
}
/* =========================================================
   GLOBAL PAGE TRANSITIONS
   CropWise AI
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
        return;
    }

    /*
     * Smooth transition when leaving the current page.
     * Internal links only.
     */
    document.querySelectorAll("a[href]").forEach((link) => {
        link.addEventListener("click", (event) => {
            const href = link.getAttribute("href");

            if (!href) return;

            // Ignore special links
            if (
                href.startsWith("#") ||
                href.startsWith("http://") ||
                href.startsWith("https://") ||
                href.startsWith("mailto:") ||
                href.startsWith("tel:") ||
                link.target === "_blank" ||
                event.ctrlKey ||
                event.metaKey ||
                event.shiftKey ||
                event.altKey
            ) {
                return;
            }

            // Ignore same-page hash navigation
            if (href.includes("#")) {
                return;
            }

            event.preventDefault();

            document.body.classList.add("page-leaving");

            setTimeout(() => {
                window.location.href = href;
            }, 220);
        });
    });
});