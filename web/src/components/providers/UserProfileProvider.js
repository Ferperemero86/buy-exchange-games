import React, {createContext, useReducer, useMemo} from "react";

import {userProfileReducer} from "../../utils/reducers";

export const UserProfileContext = createContext();


const UserProfileProvider = ({children}) => {
    const initialValues = {
        messageForm: false
    }
    
    const [userProfileState, dispatchUserProfile] = useReducer(userProfileReducer, initialValues);

    const userProfile = useMemo(() => {
        return userProfileState
    }, [userProfileState])
       
    return <UserProfileContext.Provider value={{userProfile, dispatchUserProfile}}>{children}</UserProfileContext.Provider>

}

export default UserProfileProvider;