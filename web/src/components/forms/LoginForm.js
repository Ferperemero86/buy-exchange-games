import React, {useContext, useEffect} from "react";
import axios from "axios";

import {useRouter} from "next/router";

import {LoginContext} from "../providers/forms/LoginProvider";
import {UserContext} from "../providers/UserProvider";

import handleMessages from "../../controllers/messagesHandler";
import Message from "../messages/Message";



const LoginForm = () => {
    const {user, dispatchUser} = useContext(UserContext);
    const {login, dispatchLogin} = useContext(LoginContext);
    const {usernameInputValue, passwordInputValue, messages} = login;
    const router = useRouter();

    const updateUsernameValue = (e) => {
        dispatchLogin({ type:"ADD_USERNAMEINPUT_VALUE", payload: e.target.value });
    }

    const updatePassValue = (e) => {
       dispatchLogin({ type: "ADD_PASSWORDINPUT_VALUE", payload: e.target.value });
    }

    const sendData = (e) => {
        e.preventDefault();

    const userData = {
        email: usernameInputValue,
        password: passwordInputValue,
     };
       
        
    axios.post(`/api/session`, userData)
        .then((result) => {
            const success = result.data;
           
            if (success && success.login) {
                dispatchUser({ type: "USER_LOGGED_IN"});
            }
        })
        .catch(err => {
            if (err.response) {
                const messages = handleMessages(err.response.data);
                dispatchLogin({type: "UPDATE_MESSAGE", payload: messages});
            }
        });
    }

    useEffect(() => {
        if (user.userLogged) {
            router.push("/");
        }
    });

    return (
        <form id="user-form">
            <h1>Login</h1>
            <Message messages={messages} />
            <div className="form-section">
                <label>Name</label>
                <input
                    type="text"
                    value={usernameInputValue}
                    onChange={updateUsernameValue} />
            </div>
            <div className="form-section">
                <label>Password</label>
                <input
                    type="password"
                    value={passwordInputValue}
                    onChange={updatePassValue} />
            </div>
            <button 
                onClick={sendData}>Send</button>
        </form>
    )
}

export default LoginForm;