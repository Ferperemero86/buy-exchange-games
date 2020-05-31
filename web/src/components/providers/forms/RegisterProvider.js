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
    }

    const [RegisterState, dispatchRegister] = useReducer(registerReducer, initialValues);

    const form = useMemo(() => {
        return RegisterState
    }, [RegisterState])

    return <RegisterContext.Provider value={{register: form, dispatchRegister}}>{children}</RegisterContext.Provider>

}


export default RegisterProvider;