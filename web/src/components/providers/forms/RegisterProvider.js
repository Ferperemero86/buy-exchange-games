import React, {useReducer, createContext, useMemo} from "react";

import {registerReducer} from "../../../utils/reducers";

export const RegisterContext = createContext(false);

const RegisterProvider = ({children, pageProps}) => {
    const {countryNames, countries} = pageProps;
    
    const initialValues = {
        usernameInputValue: "",
        passwordInputValue: "",
        selectedImage: null,
        cities: [],
        nickName: "",
        countries,
        countryNames,
        countryCodes: [],
        selectedCountryCode: "",
        selectedCountryName: "",
        messages: []
    };

    const [RegisterState, dispatchRegister] = useReducer(registerReducer, initialValues);

    const form = useMemo(() => {
        return RegisterState
    }, [RegisterState]);

    const selectCountry = (e) => {
        const countryCodeSel = e.target.value;
       
        Object.keys(countries).map(country => {
            const code = countries[country];

            if (code === countryCodeSel) {
                dispatchRegister({type: "UPDATE_SELECTED_COUNTRY_NAME", payload: country});
                dispatchRegister({type: "UPDATE_SELECTED_COUNTRY_CODE", payload: countryCodeSel});
            }
        })
       
        if (countryCodeSel === "Choose country") {
            dispatchRegister({type: "UPDATE_SELECTED_COUNTRY_NAME", payload: ""});
            dispatchRegister({type: "UPDATE_SELECTED_COUNTRY_CODE", payload: ""});
        }
    };

    const selectCity = (e) => {
        const city = e.target.value;

        dispatchRegister({type: "UPDATE_SELECTED_CITY", payload: city})
    };

    const updateUsernameValue = (e) => {
        dispatchRegister({ type:"ADD_USERNAMEINPUT_VALUE", payload: e.target.value });
    };

    const updatePassValue = (e) => {
       dispatchRegister({ type: "ADD_PASSWORDINPUT_VALUE", payload: e.target.value });
    };

    const updateNickName = (e) => {
        const nickVal = e.target.value;
      
        dispatchRegister({type: "UPDATE_NICK_NAME_VALUE", payload: nickVal})
    };

    return <RegisterContext.Provider 
            value={{
                register: form, 
                dispatchRegister,
                selectCountry,
                selectCity,
                updateUsernameValue,
                updatePassValue,
                updateNickName
            }}>{children}</RegisterContext.Provider>

}


export default RegisterProvider;