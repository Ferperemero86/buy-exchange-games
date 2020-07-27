import React, {createContext, useReducer, useMemo} from "react";

import {userReducer} from "../../utils/reducers";

export const UserContext = createContext();


const UserProvider = ({children}) => {

    const initialValues = {
        userId: false,
        userLogged: false,
        hasMounted: false
    }

    const [userState, dispatchUser] = useReducer(userReducer, initialValues);

    const user = useMemo(() => {
        return userState
    }, [userState])
       
    return <UserContext.Provider value={{user, dispatchUser}}>{children}</UserContext.Provider>

}

export default UserProvider;