import React, {createContext, useReducer, useMemo, useEffect} from "react";
import {useRouter} from "next/router";
import cookie from 'react-cookies';

import {settingsReducer} from "../../utils/reducers";
import {sendDataFromClient} from "../../utils/API";

export const SettingsContext = createContext();


const SettingsProvider = ({children, pageProps}) => {
    const initialValues = {
        passwordInput: ""
    };
    
    const [settingsState, dispatchSettings] = useReducer(settingsReducer, initialValues);
    const {login, userId} = pageProps;
    const router = useRouter();

    const updatePassword = async (e) => {
        const password = e.currentTarget.getAttribute("data");
        await sendDataFromClient("/api/editpass", {password});
    }

    const updatePasswordInput = (e) => {        
        dispatchSettings({type:"UPDATE_PASSWORD_INPUT", payload: e.currentTarget.value});
    }

    const deleteAccount = () => {
        sendDataFromClient("/api/user/delete", {userId});
        cookie.remove("user_id", { path: "/" });
        router.push("/");
        dispatchSettings({type: "SHOW_DELETE_QUESTION", payload: false});
    }

    const showDeleteQuestion = (e) => {
        e.preventDefault();
        dispatchSettings({type: "SHOW_DELETE_QUESTION", payload: true});
    }

    const hideDeleteQuestion = (e) => {
        e.preventDefault();
        dispatchSettings({type: "SHOW_DELETE_QUESTION", payload: false});
    }

    useEffect(() => {
        if (login === false) { router.push("/account/login") }
    })

    const settings = useMemo(() => {
        return settingsState
    }, [settingsState])
       
    return <SettingsContext.Provider value={{
        settings, 
        dispatchSettings,
        updatePasswordInput,
        updatePassword,
        deleteAccount,
        showDeleteQuestion,
        hideDeleteQuestion
    }}>{children}</SettingsContext.Provider>

}

export default SettingsProvider;