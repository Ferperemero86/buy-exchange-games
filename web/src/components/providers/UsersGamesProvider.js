import React, {createContext, useReducer, useMemo} from "react";
import {sendDataFromClient} from "../../utils/API";

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
    const gameFromListToExchange = null;
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
    };
    
    const [usersGamesState, dispatchUsersGames] = useReducer(usersGamesReducer, initialValues);

    const usersGames = useMemo(() => {
        return usersGamesState
    }, [usersGamesState]);

    const getUserGames = async (selectedCountryName, citySelected, userId, searchInputValue, type) => {
        await sendDataFromClient("/api/usersgames", {
            country: selectedCountryName,
            city: citySelected,
            userId,
            textSearch: searchInputValue,
            type
        })
        .then(result => {
            if (result.data) {
                const games = result.data.games;
                dispatchUsersGames({type: "UPDATE_GAMES", payload: games});
            }
        })
        .catch(err => {
            console.log(err);
        })
    };

    const selectCountry = (e) => {
        const countryCode = e.target.value;
        let countryName;
    
        if (messages.length > 0) {
            dispatchUsersGames({type: "UPDATE_MESSAGES", payload: ""});
        }
        
        Object.keys(countries).map(name => {
            if (countries[name] === countryCode) {
                countryName = name;
            }
        })

        sendDataFromClient("/api/cities", {selectedCountryCode: countryCode})
            .then(result => {
                dispatchUsersGames({type: "UPDATE_CITIES", payload: result.data.cities});
                dispatchUsersGames({type: "UPDATE_SELECTED_COUNTRY_NAME", payload: countryName});
                dispatchUsersGames({type: "UPDATE_SELECTED_COUNTRY", payload: countryCode});
            })
            .catch(err => {
                console.log(err.response);
            })
    };

    const selectCity = (e) => {
        const city = e.target.value;
        
        dispatchUsersGames({type: "UPDATE_SELECTED_CITY", payload: city});
    };

    const addSelectedAttribute = (selectValues, selectedValue) => {
        const selectChildren = selectValues && selectValues.current ? selectValues.current.children : [];
        const selectChildrenArray = [...selectChildren];
        
        selectChildrenArray.map((item) => {
            if (selectedValue === item.innerHTML) {
                    item.selected = true;
                }
        })
    };

    const showNewOfferForm = () => {
        dispatchUsersGames({type: "SHOW_NEW_OFFER_FORM", payload: true});
    };

    const updatePrice = (e) => {
        const price = e.target.value;
        dispatchUsersGames({type: "UPDATE_GAME_SELLING_PRICE", payload: price});
    };

    return <UsersGamesContext.Provider 
            value={{
                usersGames, 
                dispatchUsersGames, 
                getUserGames,
                selectCountry,
                selectCity,
                addSelectedAttribute,
                showNewOfferForm,
                updatePrice
            }}>{children}</UsersGamesContext.Provider>

}

export default UsersGamesProvider;