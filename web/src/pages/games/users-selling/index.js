import React, {useContext} from "react";

import Games from "../../../components/usersselling/Games";
import Message from "../../../components/messages/Message";
import UsersGamesForm from "../../../components/forms/UsersGamesForm";

import {UsersSellingContext} from "../../../components/providers/UsersSellingProvider";
import {getLocalData, sendLocalData} from "../../../utils/API";

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
    const {usersSelling} = useContext(UsersSellingContext);
    const {messages} = usersSelling;
   
    return (
        <div className="users-selling">
            <h1 className="users-selling-heading">Users Selling Games</h1>
            <div className="users-selling-forms">
               <UsersGamesForm userId={userId} />
            </div>
            <div className="users-selling-games">
                <Message messages={messages} />
                <UsersGames/>
            </div>
        </div>
    )
}

export default GamesForSale;
