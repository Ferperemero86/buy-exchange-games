import React from "react";
import fetch from "node-fetch";

export async function getServerSideProps(ctx) {
    const URLBase = await ctx.req.headers.host;
    const Url = new URL("/api/finduserwithgame", `http://${URLBase}`).href;
    const query = await ctx.query;
    console.log("query", query.id);
    //console.log("context", ctx.query);

    const result = await fetch(Url, { method: "POST", 
                       body: JSON.stringify({gameId: query.id}), 
                       headers: {'Content-Type': 'application/json'} });

    const data = await result.json();

    return { props: {query: data} };
}

const GameToBuy = ({query}) => {
    console.log(query);
    return <h1>{query.id}</h1>;
}

export default GameToBuy;