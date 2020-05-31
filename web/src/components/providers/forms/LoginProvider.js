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
    }, [LoginState])

    return <LoginContext.Provider value={{login: form, dispatchLogin}}>{children}</LoginContext.Provider>

}

export default LoginProvider;