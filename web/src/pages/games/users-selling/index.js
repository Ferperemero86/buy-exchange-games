import React, {useContext, useEffect, useRef} from "react";

import axios from "axios";

import Games from "../../../components/usersselling/Games";
import Countries from "../../../components/forms/CountriesSearch";
import Cities from "../../../components/forms/CitiesSearch";

import {UsersSellingContext} from "../../../components/providers/UsersSellingProvider";
import {getLocalData, sendLocalData} from "../../../utils/API";
//import handleMessages from "../../../controllers/messagesHandler";
import Message from "../../../components/messages/Message";


export async function getServerSideProps(ctx) {
    const userId = await ctx.req.user ? ctx.req.user.id : null;
    const URLBase = await ctx.req.headers.host;
    const Url = new URL("/api/usersgames", `http://${URLBase}`).href;
    const countriesUrl = new URL("/api/countries", `http://${URLBase}`).href;
    const citiesUrl = new URL("/api/cities", `http://${URLBase}`).href;

    const countriesResult = await getLocalData(countriesUrl);
    const data = await sendLocalData(Url, {userId});

    const {countryName} = await data;
    const {countries, countryNames} = await countriesResult;
    let countryCode = "";
    let cities = [];

    Object.keys(countries).map(name => {
        if (name === countryName) {
            countryCode = countries[name];
        }
    })
    if (userId && countryCode) {
        cities = await sendLocalData(citiesUrl, {selectedCountryCode: countryCode});
    }
    
    return { props: {data, countries, cities, countryCode, countryNames, userId} };
}

const FirstCitiesOption = () => {
    const {usersSelling} = useContext(UsersSellingContext);
    const {cities} = usersSelling;

    if (cities && cities.length > 1) {
        return <option value="not selected">All cities</option>
    }
    return <option>Choose city</option>
};

const UsersGames = () => {
    const {usersSelling} = useContext(UsersSellingContext);
    const {games} = usersSelling;
    
    if (Array.isArray(games)) {
        if (games.length < 1) {
            return <h2>No Results</h2>
        }
        return <Games games={games} />
    }
    return null;
}

const GamesForSale = ({userId}) => {
    const {usersSelling, dispatchUsersSelling} = useContext(UsersSellingContext);
    const {countries, countryNames, cities,
           messages, citySelected, selectedCountryName,
           searchInputValue} = usersSelling;
    const selectCountriesRef = useRef(null);
    const selectCitiesRef = useRef(null);

    const addSelectedAttribute = (selectValues, selectedValue) => {
        const selectChildren = selectValues.current.children;
        const selectChildrenArray = [...selectChildren];
        
        selectChildrenArray.map((item) => {
            if (selectedValue === item.innerHTML) {
                    item.selected = true;
                }
        })
    }

    const selectCountry = (e) => {
        const countryCode = e.target.value;
        let countryName;

        if (messages.length > 0) {
            dispatchUsersSelling({type: "UPDATE_MESSAGES", payload: ""});
        }
        
        Object.keys(countries).map(name => {
            if (countries[name] === countryCode) {
                countryName = name;
            }
        })

        axios.post("/api/cities", {selectedCountryCode: countryCode})
            .then(result => {
                dispatchUsersSelling({type: "UPDATE_CITIES", payload: result.data.cities});
                dispatchUsersSelling({type: "UPDATE_SELECTED_COUNTRY_NAME", payload: countryName});
                dispatchUsersSelling({type: "UPDATE_SELECTED_COUNTRY", payload: countryCode});
            })
            .catch(err => {
                console.log(err.response);
            })
    }

    const selectCity = (e) => {
        const city = e.target.value;

        dispatchUsersSelling({type: "UPDATE_SELECTED_CITY", payload: city});
    }

    const searchGamesByName = (e) => {
        const textValue = e.target.value;
        
        getUserGames(selectedCountryName, citySelected, userId, textValue);
        dispatchUsersSelling({type: "UPDATE_SEARCH_INPUT_VALUE", payload: textValue})
    }

    const getUserGames = async (selectedCountryName, citySelected, userId, searchInputValue) => {
        await axios.post("/api/usersgames", {
            country: selectedCountryName,
            city: citySelected,
            userId,
            textSearch: searchInputValue
        })
        .then(result => {
            if (result.data) {
                const games = result.data.games;
        
                dispatchUsersSelling({type: "UPDATE_GAMES", payload: games});
            }
        })
        .catch(err => {
            console.log(err);
        })
    }
   
    useEffect(() => {
        addSelectedAttribute(selectCountriesRef, selectedCountryName);
        addSelectedAttribute(selectCitiesRef, citySelected);

        getUserGames(selectedCountryName, citySelected, userId, searchInputValue);

        
    }, [selectedCountryName, citySelected])

    return (
        <div className="users-selling">
            <h1 className="users-selling-heading">Users Selling Games</h1>
            <div className="users-selling-forms">
                    <div className="locations">
                        <form>
                            <div className="form-section">
                                <label className="label">Countries</label>
                                <select onChange={selectCountry} 
                                        ref={selectCountriesRef}>
                                    <option>Choose country</option>
                                    <Countries
                                        countries={countries}
                                        countryNames={countryNames} />
                                </select>
                            </div>
                            <div className="form-section">
                                <label className="label">Cities</label>
                                <select onChange={selectCity} 
                                        ref={selectCitiesRef}>
                                    <FirstCitiesOption />
                                    <Cities cities={cities}/>
                                </select>
                            </div>
                        </form>
                    </div>
                    <div className="name-search">
                        <label className="label">Search</label>
                        <input type="search"
                               className="search-input"
                               value={searchInputValue}
                               onChange={searchGamesByName}></input>
                    </div>
                </div>
            <div className="users-selling-games">
                <Message messages={messages} />
                <UsersGames />
            </div>
        </div>
    )
}

export default GamesForSale;
