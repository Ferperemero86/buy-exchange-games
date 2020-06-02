import React, {useContext, useEffect} from "react";

import axios from "axios";

import Games from "../../../components/usersselling/Games";
import Countries from "../../../components/forms/CountriesSearch";
import Cities from "../../../components/forms/CitiesSearch";

import {UsersSellingContext} from "../../../components/providers/UsersSellingProvider";
import {getLocalData, sendLocalData} from "../../../utils/API";
import handleMessages from "../../../controllers/messagesHandler";
import Message from "../../../components/messages/Message";


export async function getServerSideProps(ctx) {
    const userId = await ctx.req.user ? ctx.req.user.id : null;
    const URLBase = await ctx.req.headers.host;
    const Url = new URL("/api/gamesselling", `http://${URLBase}`).href;
    const countriesUrl = new URL("/api/countries", `http://${URLBase}`).href;

    const result = await getLocalData(countriesUrl);
    const data = await sendLocalData(Url, {userId});

    const {countries, countryNames} = await result;

    return { props: {data, countries, countryNames} };
}

const UsersGames = () => {
    const {usersSelling} = useContext(UsersSellingContext);
    const {games} = usersSelling;
    
    if (Array.isArray(games)) {
        return <Games games={games} />
    }
    return null;
}

const GamesForSale = () => {
    const {usersSelling, dispatchUsersSelling} = useContext(UsersSellingContext);
    const {countries, countryNames, cities, 
           messages, countrySelected, 
           citySelected, selectedCountryName} = usersSelling;

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

        dispatchUsersSelling({type: "UPDATE_SELECTED_COUNTRY_NAME", payload: countryName});
        console.log(countryName);
        axios.post("/api/cities", {selectedCountryCode: countryName})
            .then(result => {
                if (result.data) {
                    const cities = result.data.cities;

                    dispatchUsersSelling({type: "UPDATE_CITIES", payload: cities});
                    dispatchUsersSelling({type: "UPDATE_SELECTED_COUNTRY", payload: countryCode});
                }
            })
            .catch(err => {
                if (err.response) {
                    const error = err.response;
                
                    handleMessages(error)
                }
            })
    }

    const selectCity = (e) => {
        const city = e.target.value;

        dispatchUsersSelling({type: "UPDATE_SELECTED_CITY", payload: city})
    }
   
    useEffect(() => {
        if (selectedCountryName || countrySelected && citySelected) {
            axios.post("/api/gamesselling", {
                country: selectedCountryName,
                city: citySelected
            })
            .then(result => {
                if (result.data) {
                    const games = result.data.games;
                    dispatchUsersSelling({type: "UPDATE_GAMES", payload: games});
                }
            })
            .catch(err => {
                console.log(err.response);
            })
        }
    }, [selectedCountryName])

    return (
        <div className="users-selling">
            <h1 className="users-selling-heading">Users Selling Games</h1>
            <div className="users-selling-forms">
                    <div className="locations">
                        <form>
                            <select onChange={selectCountry}>
                                <option>Choose country</option>
                                <Countries
                                    countries={countries}
                                    countryNames={countryNames} />
                            </select>
                            <select onChange={selectCity}>
                                <option>Choose city</option>
                                <Cities cities={cities}/>
                            </select>
                        </form>
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
