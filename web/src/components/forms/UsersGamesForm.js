import React, {useContext, useRef, useEffect} from "react";
import axios from "axios";

import {UsersGamesContext} from "../providers/UsersGamesProvider";

import Countries from "../../components/forms/CountriesSearch";
import Cities from "../../components/forms/CitiesSearch";


const FirstCitiesOption = () => {
    const {usersGames} = useContext(UsersGamesContext);
    const {cities} = usersGames;

    if (cities && cities.length > 1) {
        return <option value="not selected">All cities</option>
    }
    return <option>Choose city</option>
};

const NameSearch = ({getUserGames, userId}) => {
    const {usersGames, dispatchUsersGames} = useContext(UsersGamesContext);
    const {searchInputValue, selectedCountryName, citySelected} = usersGames;

     
    const searchGamesByName = (e) => {
        const textValue = e.target.value;
        
        getUserGames(selectedCountryName, citySelected, userId, textValue);
        dispatchUsersGames({type: "UPDATE_SEARCH_INPUT_VALUE", payload: textValue})
    }

    return (
        <div className="name-search">
            <label className="label">Search</label>
            <input type="search"
                   className="search-input"
                   value={searchInputValue}
                   onChange={searchGamesByName}></input>
        </div>
    )
}

const Locations = ({userId, getUserGames}) => {
    const {usersGames, dispatchUsersGames} = useContext(UsersGamesContext);
    const {countries, countryNames, cities, messages,
           selectedCountryName, citySelected, searchInputValue } = usersGames;
    const selectCountriesRef = useRef(null);
    const selectCitiesRef = useRef(null);

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

        axios.post("/api/cities", {selectedCountryCode: countryCode})
            .then(result => {
                dispatchUsersGames({type: "UPDATE_CITIES", payload: result.data.cities});
                dispatchUsersGames({type: "UPDATE_SELECTED_COUNTRY_NAME", payload: countryName});
                dispatchUsersGames({type: "UPDATE_SELECTED_COUNTRY", payload: countryCode});
            })
            .catch(err => {
                console.log(err.response);
            })
    }

    const selectCity = (e) => {
        const city = e.target.value;

        dispatchUsersGames({type: "UPDATE_SELECTED_CITY", payload: city});
    }


    const addSelectedAttribute = (selectValues, selectedValue) => {
        const selectChildren = selectValues.current.children;
        const selectChildrenArray = [...selectChildren];
        
        selectChildrenArray.map((item) => {
            if (selectedValue === item.innerHTML) {
                    item.selected = true;
                }
        })
    }
   
    useEffect(() => {
        addSelectedAttribute(selectCountriesRef, selectedCountryName);
        addSelectedAttribute(selectCitiesRef, citySelected);

        getUserGames(selectedCountryName, citySelected, userId, searchInputValue);

        
    }, [selectedCountryName, citySelected])


    return (
        <div className="locations">
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
        </div>
    )
}

const UsersGamesForm = ({userId}) => {
    const {dispatchUsersGames} = useContext(UsersGamesContext);

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
        
                dispatchUsersGames({type: "UPDATE_GAMES", payload: games});
            }
        })
        .catch(err => {
            console.log(err);
        })
    };

    return (
        <form>
            <Locations 
                userId={userId} 
                getUserGames={getUserGames} />
            <NameSearch 
                userId={userId} 
                getUserGames={getUserGames} />
        </form>
    )
}

export default UsersGamesForm;
