import React, {useReducer, createContext, useMemo} from "react";

import {formsReducer} from "../../utils/reducers";

export const FormsContext = createContext(false);

const FormsProvider = ({children, pageProps}) => {
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

    const [FormsState, dispatchForms] = useReducer(formsReducer, initialValues);

    const form = useMemo(() => {
        return FormsState
    }, [FormsState]);

    return <FormsContext.Provider 
            value={{
                forms: form, 
                dispatchForms
            }}>{children}</FormsContext.Provider>

}


export default FormsProvider;