import React, {useContext} from "react";

import Games from "../../../components/usersselling/Games";
import Message from "../../../components/messages/Message";
import UsersGamesForm from "../../../components/forms/UsersGamesForm";

import {UsersGamesContext} from "../../../components/providers/UsersGamesProvider";
import {getLocalData, sendLocalData} from "../../../utils/API";

export async function getServerSideProps(ctx) {
    const userId = await ctx.req.user ? ctx.req.user.id : null;
    const URLBase = await ctx.req.headers.host;
    const Url = new URL("/api/usersgames", `http://${URLBase}`).href;
    const countriesUrl = new URL("/api/countries", `http://${URLBase}`).href;
    const citiesUrl = new URL("/api/cities", `http://${URLBase}`).href;

    const countriesResult = await getLocalData(countriesUrl);
    const data = await sendLocalData(Url, {userId, type: "exchanging"});

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


const UsersExchangingGames = ({userId, data}) => {
    console.log(data);
    const {usersGames} = useContext(UsersGamesContext);
    const {games, messages} = usersGames;
   
    return (
        <div className="users-games-container">
            <h1 className="users-games-heading">Users Selling Games</h1>
            <div className="users-games-forms">
               <UsersGamesForm 
                    userId={userId} 
                    type="exchanging" />
            </div>
            <div className="users-games">
                <Message messages={messages} />
                <Games games={games} />
            </div>
        </div>
    )
}

export default UsersExchangingGames;
