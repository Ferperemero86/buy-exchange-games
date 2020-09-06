import React, {useReducer, createContext, useMemo} from "react";

import {loginReducer} from "../../../utils/reducers";

export const LoginContext = createContext(false);

const LoginProvider = ({children}) => {
   
    const initialValues = {
        usernameInputValue: "",
        passwordInputValue: "",
        messages: ""
    }

    const [LoginState, dispatchLogin] = useReducer(loginReducer, initialValues);

    const form = useMemo(() => {
        return LoginState
    }, [LoginState]);

    const updateUsernameValue = (e) => {
        dispatchLogin({ type:"ADD_USERNAMEINPUT_VALUE", payload: e.target.value });
    };

    const updatePassValue = (e) => {
       dispatchLogin({ type: "ADD_PASSWORDINPUT_VALUE", payload: e.target.value });
    };

    return <LoginContext.Provider 
            value={{
                login: form, 
                dispatchLogin,
                updateUsernameValue,
                updatePassValue}}>{children}</LoginContext.Provider>

}

export default LoginProvider;