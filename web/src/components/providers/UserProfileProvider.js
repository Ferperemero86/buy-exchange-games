import React, {createContext, useReducer, useMemo, useEffect} from "react";

import {userProfileReducer} from "../../utils/reducers";
import {sendDataFromClient} from "../../utils/API";
import {useRouter} from "next/router";

export const UserProfileContext = createContext();


const UserProfileProvider = ({children, pageProps}) => {
    const router = useRouter();
    const {login, userQueryId, userId, countryCode} = pageProps;
    const cities = pageProps.cities ? pageProps.cities.cities : [];
    const nickName = pageProps.profile ? pageProps.profile.profile.nickName : "";
    const country = pageProps.profile ? pageProps.profile.profile.country : "";
    const city = pageProps.profile ? pageProps.profile.profile.city : "";
    const picture = pageProps.profile ? pageProps.profile.profile.picture : "";
    
    const initialValues = {
        messageForm: false,
        editField: false,
        editProfileField: false,
        fieldValue: "",
        nickName,
        country,
        countryCode,
        city,
        cities,
        profileImage: "",
        profileImageUrl: picture,
        userQueryId,
        userId
    };

    const [userProfileState, dispatchUserProfile] = useReducer(userProfileReducer, initialValues);

    const userProfile = useMemo(() => {
        return userProfileState
    }, [userProfileState]);

    const showButtons = (e) => {
        e.preventDefault();
        
        const field = e.currentTarget.getAttribute("data");
        dispatchUserProfile({type: "SHOW_EDIT_PROFILE_FIELD", payload: field});
    }

    const cancelEdit = () => {
        dispatchUserProfile({type: "SHOW_EDIT_PROFILE_FIELD", payload: false});
    };

    const updateField = (e) => {
        const data = e.currentTarget.getAttribute("data");
        const dataArray = data.split(",");
        const fieldName = dataArray[0];
        const fieldValue = dataArray[1];

        dispatchUserProfile({type: "SHOW_EDIT_PROFILE_FIELD", payload: false});
        const fieldUpdated = sendDataFromClient("/api/user/profile/save", {fieldValue, userId, userQueryId, fieldName});     
        
        fieldUpdated.then(result=> {
            if(result.authError) { router.push("/not-authorised") } 
            if (result.fieldName === "Nickname") {
                dispatchUserProfile({type: "UPDATE_NICKNAME", payload: result.fieldValue});
            }
            if (result.fieldName === "Country") {
                dispatchUserProfile({type: "UPDATE_COUNTRY", payload: result.fieldValue});
            }
        })
    };

    const updateFieldValue = (e) => {
        const value = e.currentTarget.value;
       
        dispatchUserProfile({type: "UPDATE_FIELD_VALUE", payload: value});
        dispatchUserProfile({type: "UPDATE_NICKNAME", payload: value});
    };

    const updateImage = (e) => {
        const image = e.currentTarget.files[0];

        dispatchUserProfile({type: "UPDATE_PROFILE_IMAGE", payload: image});
    };

    const showMessageForm = () => {
        dispatchUserProfile({type: "SHOW_MESSAGE_FORM", payload: true});
    };

    const closeMessageForm = () => {
        dispatchUserProfile({type: "SHOW_MESSAGE_FORM", payload: false})
    };

    useEffect(() => {
        if (login === false) { router.push("/account/login") }
    });
       
    return <UserProfileContext.Provider value={{
        userProfile, 
        dispatchUserProfile,
        updateField,
        cancelEdit,
        showButtons,
        updateFieldValue,
        updateImage,
        showMessageForm,
        closeMessageForm
    }}>{children}</UserProfileContext.Provider>

}

export default UserProfileProvider;