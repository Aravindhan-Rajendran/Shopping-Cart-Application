document.addEventListener('DOMContentLoaded', () => {
    const firstname = document.getElementById('fname');
    const lastname = document.getElementById('lname');
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const confirm = document.getElementById('confirm');
    const signup = document.getElementById('signup');
    const errmsg = document.getElementById('error');
    const succmsg = document.getElementById('success');

    errmsg.style.color = 'red';

    function clearMessages() {
        errmsg.innerText = "";
        succmsg.innerText = "";
    }

    [firstname, lastname, email, password, confirm].forEach(input => {
        input.addEventListener('input', clearMessages);
    });

    signup.addEventListener('click', () => {
        clearMessages();

        if (!firstname.value || !lastname.value || !email.value || !password.value || !confirm.value) {
            errmsg.innerText = "Please fill all the fields";
        } else if (confirm.value !== password.value) {
            errmsg.innerText = "Password and Confirm password should match";
        } else {
            const users = JSON.parse(localStorage.getItem('users') || "[]");
            const userExists = users.some(user => user.email === email.value);

            if (userExists) {
                errmsg.innerText = 'User already exists!';
            } else {
                users.push({
                    email: email.value,
                    firstName: firstname.value,
                    lastName: lastname.value,
                    password: password.value,
                    createdAt: new Date(),
                });
                localStorage.setItem("users", JSON.stringify(users));
                succmsg.innerText = "Signup successful!";
                firstname.value = "";
                lastname.value = "";
                email.value = "";
                password.value = "";
                confirm.value = "";
            }
        }
    });
});