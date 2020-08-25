import React, {createContext, useReducer, useMemo} from "react";

import {userProfileReducer} from "../../utils/reducers";
import {sendDataFromClient} from "../../utils/API";

export const UserProfileContext = createContext();


const UserProfileProvider = ({children, pageProps}) => {
    const {nickName, country, city, picture} = pageProps.profile.profile;

    const saveFieldValue = (fieldValue, userId, fieldName) => {
        return sendDataFromClient("/api/user/profile/save", {fieldValue, userId, fieldName});
    }

    const initialValues = {
        messageForm: false,
        editField: false,
        editProfileField: false,
        fieldValue: "",
        nickName,
        country,
        city,
        cities: "",
        profileImage: "",
        profileImageUrl: picture
    }
    
    const [userProfileState, dispatchUserProfile] = useReducer(userProfileReducer, initialValues);

    const userProfile = useMemo(() => {
        return userProfileState
    }, [userProfileState])
       
    return <UserProfileContext.Provider value={{
        userProfile, 
        dispatchUserProfile,
        saveFieldValue
    }}>{children}</UserProfileContext.Provider>

}

export default UserProfileProvider;