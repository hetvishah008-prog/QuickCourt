/* =================================
   QuickCourt - Login & Signup
   ================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* ===============================
       SIGNUP
       =============================== */

    const signupForm = document.getElementById("signupForm");

    if (signupForm) {

        signupForm.addEventListener("submit", function (event) {

            event.preventDefault();

            const name =
                document.getElementById("signupName").value.trim();

            const email =
                document.getElementById("signupEmail").value.trim().toLowerCase();

            const password =
                document.getElementById("signupPassword").value;

            if (password.length < 6) {
                alert("Password must contain at least 6 characters.");
                return;
            }

            const existingUserText =
                localStorage.getItem("quickcourtUser");

            const existingUser =
                existingUserText ? JSON.parse(existingUserText) : null;

            if (existingUser && existingUser.email === email) {
                alert("An account with this email already exists.");
                return;
            }

            const user = {
                name: name,
                email: email,
                password: password
            };

            localStorage.setItem(
                "quickcourtUser",
                JSON.stringify(user)
            );

            alert("Account created successfully!");

            window.location.href = "login.html";

        });

    }


    /* ===============================
       LOGIN
       =============================== */

    const loginForm = document.getElementById("loginForm");

    if (loginForm) {

        loginForm.addEventListener("submit", function (event) {

            event.preventDefault();

            const email =
                document.getElementById("loginEmail").value.trim().toLowerCase();

            const password =
                document.getElementById("loginPassword").value;

            const savedUserText =
                localStorage.getItem("quickcourtUser");

            const savedUser =
                savedUserText ? JSON.parse(savedUserText) : null;

            if (!savedUser) {
                alert("No account found. Please sign up first.");
                return;
            }

            if (
                email === savedUser.email &&
                password === savedUser.password
            ) {

                localStorage.setItem(
                    "quickcourtLoggedIn",
                    "true"
                );

                localStorage.setItem(
                    "quickcourtCurrentUser",
                    JSON.stringify(savedUser)
                );

                alert(
                    "Login successful! Welcome, " +
                    savedUser.name +
                    "."
                );

                // Open the main QuickCourt website
                window.location.href = "home.html";

            } else {

                alert("Incorrect email or password. Please try again.");

            }

        });

    }

});