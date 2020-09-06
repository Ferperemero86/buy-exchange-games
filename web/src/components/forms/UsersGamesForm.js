import React, {useContext, useRef, useEffect} from "react";
import {UsersGamesContext} from "../providers/UsersGamesProvider";

import Countries from "../../components/forms/CountriesSearch";
import Cities from "../../components/forms/CitiesSearch";
import Option from "../Option";
import Label from "../../components/Label";
import Select from "../../components/Select";
import Input from "../../components/forms/Input";


const FirstCitiesOption = () => {
    const {usersGames} = useContext(UsersGamesContext);
    const {cities} = usersGames;

    if (cities && cities.length > 1) {
        return <Option value="not selected">All cities</Option>
    }
    return <Option>Choose city</Option>
};

const NameSearch = () => {
    const {usersGames, dispatchUsersGames, getUserGames} = useContext(UsersGamesContext);
    const {searchInputValue, selectedCountryName, citySelected, userId} = usersGames;

    const searchGamesByName = (e) => {
        const textValue = e.target.value;
        
        getUserGames(selectedCountryName, citySelected, userId, textValue);
        dispatchUsersGames({type: "UPDATE_SEARCH_INPUT_VALUE", payload: textValue})
    };


    return (
        <div className="name-search">
            <Label 
             className="label"
             text="Search" />
            <Input 
             type="search"
             className="search-input"
             value={searchInputValue}
             onChange={searchGamesByName} />
        </div>
    )
};

const Locations = ({userId, getUserGames, type}) => {
    const {usersGames, selectCountry, selectCity, addSelectedAttribute} = useContext(UsersGamesContext);
    const {countries, countryNames, cities,
           selectedCountryName, citySelected, searchInputValue } = usersGames;
    const selectCountriesRef = useRef(null);
    const selectCitiesRef = useRef(null);
       
    useEffect(() => {
        addSelectedAttribute(selectCountriesRef, selectedCountryName);
        addSelectedAttribute(selectCitiesRef, citySelected);

        getUserGames(selectedCountryName, citySelected, userId, searchInputValue, type);

        
    }, [selectedCountryName, citySelected])


    return (
        <div className="locations">
            <div className="form-section">
                <Label 
                 className="label"
                 text="Countries" />
                <Select 
                 onChange={selectCountry} 
                 ref={selectCountriesRef}>
                    <Option>Choose country</Option>
                    <Countries
                     countries={countries}
                     countryNames={countryNames} />
                </Select>
            </div>
            <div className="form-section">
                <Label 
                 className="label"
                 text="Cities" />
                <Select 
                 onChange={selectCity} 
                 ref={selectCitiesRef}>
                    <FirstCitiesOption />
                    <Cities cities={cities}/>
                </Select>
            </div>
        </div>
    )
};

const UsersGamesForm = ({userId, type}) => {
    const {getUserGames} = useContext(UsersGamesContext);

    return (
        <form>
            <Locations 
             userId={userId} 
             getUserGames={getUserGames} 
             type={type} />
            <NameSearch 
             userId={userId} 
             getUserGames={getUserGames} />
        </form>
    )
};

export default UsersGamesForm;
