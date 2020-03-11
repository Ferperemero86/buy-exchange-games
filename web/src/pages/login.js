import React, { useContext } from "react";
import { StoreContext } from "../utils/store";
import axios from "axios";

const Login = () => {

    const { loginUsernameValue, setLoginUsernameValue } = useContext(StoreContext);
    const { loginPassValue, setLoginPassValue } = useContext(StoreContext);

    const updateUsernameValue = (e) => {
        setLoginUsernameValue(e.target.value);
    }

    const updatePassValue = (e) => {
        setLoginPassValue(e.target.value);
    }

    const sendInputData = (e) => {
        e.preventDefault();

        const userData = {
            email: loginUsernameValue,
            password: loginPassValue
        };

        axios.post("/api/session", userData)
            .then(result => {
                console.log(result);
            })
            .catch(err => console.log("Login error"));
    }

    return (
        <div>
            <div>
                <label>Name</label>
                <input
                    type="text"
                    value={loginUsernameValue}
                    onChange={updateUsernameValue} />
            </div>
            <div>
                <label>Password</label>
                <input
                    type="password"
                    value={loginPassValue}
                    onChange={updatePassValue} />
            </div>
            <button onClick={sendInputData}>Send</button>
        </div>
    )
}

export default Login;