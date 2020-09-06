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

    const sendData = (e) => {
        e.preventDefault();

    const userData = {
        email: usernameInputValue,
        password: passwordInputValue,
     };
       
        
    sendDataFromClient(`/api/session`, userData)
        .then((result) => {
            const success = result.data;
          
            if (success && success.login) {
                const userId = success.userId;
               
                dispatchUser({type: "USER_LOGGED_IN"});
                dispatchUser({type: "UPDATE_USER_ID", payload: userId})
            }
        })
        .catch(err => {
            if (err.response) {
                const messages = handleMessages(err.response.data);

                dispatchLogin({type: "UPDATE_MESSAGE", payload: messages});
            }
        });
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
             text="Loogin" />
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