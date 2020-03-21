import React from "react";

import UserForm from "../../components/forms/UserForm";

const Register = () => {
    return (
        <div id="user-form">
            <h1>Register</h1>
            <UserForm URL="user" />
        </div>
    )
}

export default Register;