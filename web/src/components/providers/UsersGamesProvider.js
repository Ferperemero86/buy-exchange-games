import React, {createContext, useReducer, useMemo} from "react";

import {usersGamesReducer} from "../../utils/reducers";
import handleMessages from "../../controllers/messagesHandler";

export const UsersGamesContext = createContext();


const UsersGamesProvider = ({children, pageProps}) => {
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
    
    const [usersGamesState, dispatchUsersGames] = useReducer(usersGamesReducer, initialValues);

    const usersGames = useMemo(() => {
        return usersGamesState
    }, [usersGamesState])
       
    return <UsersGamesContext.Provider value={{usersGames, dispatchUsersGames}}>{children}</UsersGamesContext.Provider>

}

export default UsersGamesProvider;