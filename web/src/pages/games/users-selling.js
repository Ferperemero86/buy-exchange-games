import React from "react";
//import {useRouter} from "next/router";
import fetch from "node-fetch";
//import GamesSection from "../../components/games/GamesSection";
//import { StoreContext } from "../../utils/store";

export async function getServerSideProps(ctx) {
    const userId = await ctx.req.user ? ctx.req.user.id : null;
    const URLBase = await ctx.req.headers.host;
    const Url = new URL("/api/gamesselling", `http://${URLBase}`).href;
   
    const result = await fetch(Url, { method: "POST", 
                                      body: JSON.stringify({userId}),
                                      headers: {'Content-Type': 'application/json'} });
    const data = await result.json();
   
    return { props: {data} };
   
}


const GamesForSale = () => {
    return (
        <div className="users-selling">
            <h1>Users Selling Games</h1>
        </div>
    )
}

export default GamesForSale;