import React, {createContext, useReducer, useMemo} from "react";

import {usersSellingReducer} from "../../utils/reducers";
import handleMessages from "../../controllers/messagesHandler";

export const UsersSellingContext = createContext();


const UsersSellingProvider = ({children, pageProps}) => {
    console.log(pageProps);
    const games = pageProps.data.games ? pageProps.data.games : [];
    const {countries, countryNames} = pageProps;
    let messages = "";

    if (pageProps.data.locationsEmpty) {
        messages = handleMessages(pageProps.data);
    }

    const initialValues = {
        games,
        countries,
        countryNames,
        selectedCountryName: null,
        cities: [],
        countrySelected: null,
        citySelected: null,
        stateSelected: "",
        messages
    }
    
    const [usersSellingState, dispatchUsersSelling] = useReducer(usersSellingReducer, initialValues);

    const usersSelling = useMemo(() => {
        return usersSellingState
    }, [usersSellingState])
       
    return <UsersSellingContext.Provider value={{usersSelling, dispatchUsersSelling}}>{children}</UsersSellingContext.Provider>

}

export default UsersSellingProvider;