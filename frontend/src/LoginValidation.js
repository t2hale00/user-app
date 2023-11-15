function Validation(values) {
    let error = {};
    const email_pattern = /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/
    //const password_pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/

    if (!values.name) {
        error.name = "Name should not be empty"
    } else {
        error.name = ""
    }
    
    if (!values.email) {
        error.email = "Email is required"
    } else if (!email_pattern.test(values.email)) {
        error.email = "Email address is invalid"
    }else {
        error.email = ""
    }

    if (!values.password) {
        error.password = "Password is required";
    } else if (values.password.length < 8) {
        error.password = "Password must be at least 8 characters long";
    } else if (!/\d/.test(values.password)) {
        error.password = "Password must contain at least one digit";
    } else if (!/[a-z]/.test(values.password)) {
        error.password = "Password must contain at least one lowercase letter";
    } else if (!/[A-Z]/.test(values.password)) {
        error.password = "Password must contain at least one uppercase letter";
    } else {
        error.password = "";
    }  

    return error;
    
}

export default Validation;

