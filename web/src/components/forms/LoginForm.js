import React, {useContext, useEffect} from "react";
import {sendDataFromClient} from "../../utils/API";

import {useRouter} from "next/router";

import {LoginContext} from "../providers/forms/LoginProvider";
import {UserContext} from "../providers/UserProvider";

import Label from "../Label";
import Input from "../forms/Input";
import Button from "../forms/Button";
import handleMessages from "../../controllers/messagesHandler";
import Message from "../messages/Message";
import Heading from "../Heading";


const LoginForm = () => {
    const {user, dispatchUser} = useContext(UserContext);
    const {login, dispatchLogin, updateUsernameValue, updatePassValue} = useContext(LoginContext);
    const {usernameInputValue, passwordInputValue, messages} = login;
    const router = useRouter();

    const sendData = async (e) => {
        e.preventDefault();

        const userData = {
            email: usernameInputValue,
            password: passwordInputValue,
         };
  
        const loginResult = await sendDataFromClient(`/api/session`, userData);

        if (loginResult.login === false) {
            const messages = handleMessages(loginResult);
            dispatchLogin({type: "UPDATE_MESSAGE", payload: messages});
        } else {
            const userId = loginResult.data ? loginResult.data.userId : null;

            dispatchUser({type: "USER_LOGGED_IN"});
            dispatchUser({type: "UPDATE_USER_ID", payload: userId})
        }

    };


    useEffect(() => {
        if (user.userLogged) {
            router.push("/");
        }
    });

    return (
        <form id="user-form">
            <Heading
             type="h1"
             text="Login" />
            <Message messages={messages} />
            <div className="form-section">
                <Label text="Name" />
                <Input
                 type="text"
                 value={usernameInputValue}
                 onChange={updateUsernameValue} />
            </div>
            <div className="form-section">
                <Label text="Password" />
                <Input
                 type="password"
                 value={passwordInputValue}
                 onChange={updatePassValue} />
            </div>
            <Button 
             onClick={sendData}
             text="Send" />
        </form>
    )
}

export default LoginForm;