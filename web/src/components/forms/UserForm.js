import React, {useContext, useEffect} from "react";

import {UserFormContext} from "../providers/UserFormProvider";
import {UserContext} from "../providers/UserProvider";

import axios from "axios";

import {useRouter} from "next/router";


const Heading = ({url}) => {
    if (url === "session") {return <h1>Login</h1>}
    return <h1>Register</h1>
};

const UserForm = ({URL}) => {
    const {user, dispatchUser} = useContext(UserContext);
    const {userForm, dispatchUserForm} = useContext(UserFormContext);
    const router = useRouter();

    const updateUsernameValue = (e) => {
        dispatchUserForm({ type:"ADD_USERNAMEINPUT_VALUE", payload: e.target.value });
    }

    const updatePassValue = (e) => {
       dispatchUserForm({ type: "ADD_PASSWORDINPUT_VALUE", payload: e.target.value });
    }

    const sendInputData = (e) => {
        e.preventDefault();
    
        const userData = {
            email: userForm.usernameInputValue,
            password: userForm.passwordInputValue
        };
        
        axios.post(`/api/${URL}`, userData)
            .then((result) => {
                const success = result.data;
               
                if (success && success.login) {
                    //const userId = success.userId;
                    
                    dispatchUser({ type: "USER_LOGGED_IN"});
                }
                
            })
            .catch(() => {
                //const error = err.response;
            });
    }

    useEffect(() => {
        if (user.userLogged) {
            router.push("/");
        }
    });

    return (
        <form id="user-form">
            <Heading url={URL} />
            <div className="form-section">
                <label>Name</label>
                <input
                    type="text"
                    value={userForm.usernameInputValue}
                    onChange={updateUsernameValue} />
            </div>
            <div className="form-section">
                <label>Password</label>
                <input
                    type="password"
                    value={userForm.passwordInputValue}
                    onChange={updatePassValue} />
            </div>
            <button 
                onClick={sendInputData}>Send</button>
        </form>
    )
}

export default UserForm;