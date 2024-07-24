document.addEventListener('DOMContentLoaded', () => {
    const currentUser = JSON.parse(localStorage.getItem('curruser') || "{}");

    if (!currentUser.email) {
        alert('No user is logged in.');
        window.location.href = '../login.html';
    } else {
        document.getElementById('fname').value = currentUser.firstName || '';
        document.getElementById('lname').value = currentUser.lastName || '';
    }

    document.getElementById('edit-fname').addEventListener('click', () => {
        document.getElementById('fname').disabled = false;
    });

    document.getElementById('edit-lname').addEventListener('click', () => {
        document.getElementById('lname').disabled = false;
    });

    document.getElementById('logout').addEventListener('click', () => {
        localStorage.removeItem('curruser');
        window.location.href = "../login.html";
    });

    document.getElementById('savei').addEventListener('click', () => {
        const firstName = document.getElementById('fname').value;
        const lastName = document.getElementById('lname').value;
        const oldPassword = document.getElementById('old-password').value;
        const newPassword = document.getElementById('new-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        const ermsg = document.getElementById('ermsg');

        ermsg.textContent = '';

        if (!firstName || !lastName) {
            ermsg.textContent = 'Please fill out your first and last names.';
            return;
        }

        if (oldPassword || newPassword) {
            if (!oldPassword) {
                ermsg.textContent = 'Old password is required to update the password.';
                return;
            }
            if (currentUser.password !== oldPassword) {
                ermsg.textContent = 'Old password is incorrect.';
                return;
            }
            if (newPassword !== confirmPassword) {
                ermsg.textContent = 'New password and confirm password do not match.';
                return;
            }
            currentUser.password = newPassword;
        }

        currentUser.firstName = firstName;
        currentUser.lastName = lastName;

        localStorage.setItem('curruser', JSON.stringify(currentUser));
        const users = JSON.parse(localStorage.getItem('users') || "[]");
        const updatedUsers = users.map(user => user.email === currentUser.email ? currentUser : user);
        localStorage.setItem('users', JSON.stringify(updatedUsers));
        alert('Profile updated successfully!');
        document.getElementById('fname').disabled = true;
        document.getElementById('lname').disabled = true;
    });
});
