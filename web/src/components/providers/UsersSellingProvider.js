import React, {createContext, useReducer, useMemo} from "react";

import {usersSellingReducer} from "../../utils/reducers";
import handleMessages from "../../controllers/messagesHandler";

export const UsersSellingContext = createContext();


const UsersSellingProvider = ({children, pageProps}) => {
    const games = pageProps.data.games ? pageProps.data.games : [];
    const selectedCountryName = pageProps.data.countryName ? pageProps.data.countryName : "";
    const citySelected = pageProps.data.city ? pageProps.data.city : "";
    const {countries, countryNames, cities, countryCode} = pageProps;
    let messages = "";

    if (pageProps.data.locationsEmpty) {
        messages = handleMessages(pageProps.data);
    }

    const initialValues = {
        games,
        countries,
        countryNames,
        selectedCountryName,
        cities: cities.cities,
        countrySelected: countryCode,
        citySelected,
        stateSelected: "",
        searchInputValue: "",
        messages
    }
    
    const [usersSellingState, dispatchUsersSelling] = useReducer(usersSellingReducer, initialValues);

    const usersSelling = useMemo(() => {
        return usersSellingState
    }, [usersSellingState])
       
    return <UsersSellingContext.Provider value={{usersSelling, dispatchUsersSelling}}>{children}</UsersSellingContext.Provider>

}

export default UsersSellingProvider;