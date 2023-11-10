function Validation(values) {
    let error = {};
    const email_pattern = /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/
    const password_pattern = /.{8,}$/; // At least 8 characters

    if (!values.email) {
        error.email = "Email is required"
    } else if (!email_pattern.test(values.email)) {
        error.email = "Email address is invalid"
    }else {
        error.email = ""
    }

    if (!values.password) {
        error.password = "Password is required"
    } else if (!password_pattern.test(values.password)) {
        error.password = "Password must be at least 8 characters"
    }else {
        error.password = ""
    }   

    return error;
    
}

export default Validation;
