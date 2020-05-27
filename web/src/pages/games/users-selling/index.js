import React, { useContext } from "react";

import axios from "axios";

import Games from "../../../components/usersselling/Games";
import UserLocationForm from "../../../components/forms/UserLocationForm";

import {UsersSellingContext} from "../../../components/providers/UsersSellingProvider";
import {fetchLocalData} from "../../../utils/API";



export async function getServerSideProps(ctx) {
    const userId = await ctx.req.user ? ctx.req.user.id : null;
    const URLBase = await ctx.req.headers.host;
    const Url = new URL("/api/gamesselling", `http://${URLBase}`).href;
   
    const data = await fetchLocalData(Url, "POST", {userId});

    return { props: {data} };
}

const GamesForSale = () => {
    const {usersSelling, dispatchGamesSelling} = useContext(UsersSellingContext);
    const {games} = usersSelling;
   
    const searchGames = (Url, query) => {
        axios.post(Url, {query})
            .then(result => {
                const success = result.data;
                if (success.games) {
                    dispatchGamesSelling({type: "UPDATE_GAMES", payload: success.games})
                }
            })
            .catch(err => {
                console.log(err);
            })
    }

    return (
        <div className="users-selling">
            <h1 className="users-selling-heading">Users Selling Games</h1>
            <UserLocationForm searchGames={searchGames} />
            <div className="users-selling-games">
                <Games games={games} />
            </div>
        </div>
    )
}

export default GamesForSale;
