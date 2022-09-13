'use strict'

const form = document.querySelector('form');
const password = document.querySelector('.password');
const repeatPassword = document.querySelector('.repeatPass');
const alert = document.querySelector('.alert_text');

// Maybe impplement timer of hidding the alert message
function showAlert(text) {
    alert.style.display = 'block';
    alert.textContent = text;
}

function passStrengthChecker(pass) {
    let regExp = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/;
    if(!regExp.test(pass)) {
        showAlert('Password is too weak');
        return true;
    }
    return false;
}

function validateEmail(email) {
    let regExp = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    if(!regExp.test(email)) {
        showAlert('Invalid email');
        return true;
    }
    return false;
}

function validateUsername(fullname) {
    let regExp = /^[a-zA-Z]+ [a-zA-Z]+$/;
    if(!regExp.test(email)) {
        showAlert('Invalid email');
        return true;
    }
    return false;
}

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    let formData = new FormData(form);
    var obj = {};
    formData.forEach((value, key) => {
        obj[key] = value;
    });

    //Check if password is strong and email is valid
    if(passStrengthChecker(obj.password) ||
    validateEmail(obj.email)) {
        return;
    }

    //Check if the repeated password is identical
    if(obj.password !== obj.passwordRepeat) {
        showAlert('Passwords are different');
        return;
    }

    await fetch('/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(obj)
    })
    .then((res) => res.json())
    .then((data) => {
        alert.style.display = 'block';
        alert.textContent = data.message;
    })
    .catch((err) => console.log(err));

    // remove alert
    alert.style.display = 'none';
});

