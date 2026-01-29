document.getElementById("signupForm")?.addEventListener("submit", async (e) => {
    e.preventDefault(); // 🚨 THIS LINE IS MUST

    const user = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        password: document.getElementById("password").value,
        //hostel: document.getElementById("hostel").value,
        //block: document.getElementById("block").value,
        role: document.getElementById("role").value,
    };

    const res = await apiRequest("/auth/register", "POST", user);

    console.log(res); // DEBUG (important)
    console.log("ROLE SELECTED:", document.getElementById("role").value);
    console.log("SENDING:", user);



    if (res.message) {
        alert("Signup successful");
        window.location.href = "index.html";
    } else {
        alert(res.error || "Signup failed");
    }
});


document.getElementById("loginForm")?.addEventListener("submit", async (e) => {
    e.preventDefault(); // ⛔ page reload stop

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (!email || !password) {
        alert("Email and password required");
        return;
    }

    const res = await apiRequest("/auth/login", "POST", {
        email,
        password,
    });

    if (res.token) {
        localStorage.setItem("token", res.token);
        localStorage.setItem("role", res.role);

        const FRONTEND_BASE = "http://127.0.0.1:5500";

        if (res.role === "admin") {
            window.location.href = `admin/dashboard.html`;
        } else {
            window.location.href = `student/dashboard.html`;
        }
    } else {
        alert(res.error || "Login failed");
    }
});
