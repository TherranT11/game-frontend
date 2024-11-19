const BACKEND_URL = "https://game-backend-9bdx.onrender.com";

// Fetch and display the game world data
async function fetchGameWorld() {
    try {
        const response = await fetch(`${BACKEND_URL}/game-world`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const gameWorld = await response.json();
        console.log("Game world data:", gameWorld);

        // Display the in-game time
        document.getElementById('in-game-time').innerText = `In-Game Time: ${gameWorld.time}`;
    } catch (error) {
        console.error("Error fetching game world:", error);
        alert('Failed to load game data.');
    }
}

// Handle the login process
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOMContentLoaded fired");

    const form = document.getElementById('form');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');

    if (!form || !usernameInput || !passwordInput) {
        console.error("Required elements are missing from the DOM!");
        return;
    }

    // Attach submit event listener to the form
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const username = usernameInput.value;
        const password = passwordInput.value;

        if (!username || !password) {
            alert("Username and password are required.");
            return;
        }

        try {
            console.log("Sending login request with:", { username, password });

            // Send login request to the backend
            const response = await fetch(`${BACKEND_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log("Login response:", data);

            if (data.success) {
                // Store user ID and redirect to world selection
                sessionStorage.setItem('userId', data.userId);
                window.location.href = 'world-select.html';
            } else {
                alert("Login failed. Please try again.");
            }
        } catch (error) {
            console.error("Error during fetch:", error);
            alert("Could not connect to the server.");
        }
    });

    // Handle advancing the game time manually
    const advanceTimeButton = document.getElementById('advance-time');
    if (advanceTimeButton) {
        advanceTimeButton.addEventListener('click', async () => {
            try {
                console.log("Sending advance time request...");
                const response = await fetch(`${BACKEND_URL}/advance-time`, { method: 'POST' });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const gameWorld = await response.json();
                console.log("Advanced game time:", gameWorld);
                document.getElementById('in-game-time').innerText = `In-Game Time: ${gameWorld.time}`;
            } catch (error) {
                console.error("Error advancing time:", error);
                alert("Failed to advance time.");
            }
        });
    }
});

// Handle Sign-Up Button Click
document.addEventListener('DOMContentLoaded', () => {
    const signupButton = document.getElementById('signup-button');
    if (signupButton) {
        signupButton.addEventListener('click', () => {
            document.getElementById('login-form').style.display = 'none';
            document.getElementById('signup-form').style.display = 'block';
        });
    }

    // Handle Sign-Up Form Submission
    const signupForm = document.getElementById('signup');
    if (signupForm) {
        signupForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const username = document.getElementById('signup-username').value;
            const password = document.getElementById('signup-password').value;

            if (!username || !password) {
                alert("Username and password are required.");
                return;
            }

            try {
                const response = await fetch(`${BACKEND_URL}/signup`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password }),
                });

                const data = await response.json();
                if (data.success) {
                    alert("Sign-up successful! You can now log in.");
                    document.getElementById('signup-form').style.display = 'none';
                    document.getElementById('login-form').style.display = 'block';
                } else {
                    alert(data.error);
                }
            } catch (error) {
                console.error("Error during sign-up:", error);
                alert("Could not connect to the server.");
            }
        });
    }
});

// Add back button functionality if it exists
document.addEventListener('DOMContentLoaded', () => {
    const backButton = document.getElementById('back-button');
    if (backButton) {
        backButton.addEventListener('click', () => {
            document.getElementById('signup-form').style.display = 'none';
            document.getElementById('login-form').style.display = 'block';
        });
    }
});
