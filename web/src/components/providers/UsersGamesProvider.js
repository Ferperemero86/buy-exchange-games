import React, {createContext, useReducer, useMemo} from "react";

import {usersGamesReducer} from "../../utils/reducers";
import handleMessages from "../../controllers/messagesHandler";

export const UsersGamesContext = createContext();


const UsersGamesProvider = ({children, pageProps}) => {
    const games = pageProps.data && pageProps.data.games ? pageProps.data.games : [];
    const selectedCountryName = pageProps.data && pageProps.data.countryName ? pageProps.data.countryName : "";
    const citySelected = pageProps.data && pageProps.data.city ? pageProps.data.city : "";
    const {countries, countryNames, cities, countryCode} = pageProps;
    const cityValues = cities ? cities.cities : "";
    const gameSellingPrice = pageProps.gameDetails ? pageProps.gameDetails.games.price : "";
    const gameFromListToExchange = pageProps.data.games &&  pageProps.data.games[0] ? pageProps.data.games[0][1] : null;
    let messages = "";
    
    if (pageProps.data && pageProps.data.locationsEmpty) {
        messages = handleMessages(pageProps.data);
    }
    
    const initialValues = {
        games,
        countries,
        countryNames,
        selectedCountryName,
        cities: cityValues,
        countrySelected: countryCode,
        citySelected,
        stateSelected: "",
        searchInputValue: "",
        messages,
        showGamesList: false, 
        gameList: [],
        gameFromListToExchange,
        messageForm: false,
        newOfferForm: false,
        gameSellingPrice
    }
    
    const [usersGamesState, dispatchUsersGames] = useReducer(usersGamesReducer, initialValues);

    const usersGames = useMemo(() => {
        return usersGamesState
    }, [usersGamesState])
       
    return <UsersGamesContext.Provider value={{usersGames, dispatchUsersGames}}>{children}</UsersGamesContext.Provider>

}

export default UsersGamesProvider;