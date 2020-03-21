import React from "react";

import UserForm from "../../components/forms/UserForm";

const Login = () => {
    return (
        <div id="user-form">
            <h1>Login</h1>
            <UserForm URL="session" />
        </div>
    )
}

export default Login;