document.addEventListener('DOMContentLoaded', () => {
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const ermsg = document.getElementById('error');
    ermsg.style.color = 'red';

    const users = JSON.parse(localStorage.getItem('users') || '[]');

    function generateToken() {
        return Math.random().toString(36).substring(2);
    }

    document.getElementById('login').addEventListener('click', () => {
        ermsg.textContent = "";

        if (email.value.trim() === "" || password.value.trim() === "") {
            ermsg.textContent = "Please fill out all fields.";
        } else {
            const user = users.find(user => user.email === email.value.trim());
            if (user) {
                if (user.password === password.value) {
                    const currentUser = {
                        email: user.email,
                        password: user.password,
                        token: generateToken(),
                        firstName: user.firstName,
                        lastName: user.lastName,
                        loginTime: Date.now()
                    };
                    localStorage.setItem("curruser", JSON.stringify(currentUser));
                    ermsg.textContent = "Successfully logged in!";
                    ermsg.style.color = "green";
                    setTimeout(() => {
                        window.location.href = "./profile/index.html";
                    }, 1000);
                } else {
                    ermsg.textContent = "Incorrect password.";
                }
            } else {
                ermsg.textContent = "User not found. Please sign up.";
            }
        }
    });
});