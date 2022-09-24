function passStrengthChecker(pass) {
    let regExp = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/;
    if(!regExp.test(pass)) {
        return true;
    }
    return false;
}

function validateEmail(email) {
    let regExp = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    if(!regExp.test(email)) {
        return true;
    }
    return false;
}

function validateUsername(fullname) {
    let regExp = /^([\w]{2,})+\s+([\w\s]{2,})+$/i;
    if(!regExp.test(fullname)) {
        return true;
    }
    return false;
}


function handleErrors(obj) {
    //Check if password is strong and email is valid
    if(passStrengthChecker(obj.password)) {
        throw 'Password is not strong enough';
    }
    if(validateEmail(obj.email)) {
        throw 'Email is not valid';
    }
    if(validateUsername(obj.fullname)) {
        throw 'Please enter your full name';
    }

    //Check if the repeated password is identical
    if(obj.password !== obj.passwordRepeat) {
        throw 'Passwords are not indentical';
    }

    return obj;
}

module.exports = { handleErrors, passStrengthChecker, validateUsername, validateEmail };
