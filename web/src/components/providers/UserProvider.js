import React, {createContext, useReducer, useMemo} from "react";

import {userReducer} from "../../utils/reducers";

import cookie from 'react-cookies'

export const UserContext = createContext();


const UserProvider = ({children}) => {
    let userLogged = cookie.load("user_id") ? true : false;

    const initialValues = {
        userId: cookie.load("user_id"),
        userLogged,
        hasMounted: false
    }
    
    const [userState, dispatchUser] = useReducer(userReducer, initialValues);

    const user = useMemo(() => {
        return userState
    }, [userState])
       
    return <UserContext.Provider value={{user, dispatchUser}}>{children}</UserContext.Provider>

}

export default UserProvider;