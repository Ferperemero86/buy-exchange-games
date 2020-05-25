import React from "react";
import GamesDisplay from "../../components/explore/GamesDisplay";
import {fetchApiData} from "../../utils/API";

export async function getServerSideProps({query}) {
    const gameQuery = `fields name, summary, cover.url; where platforms = {49}; limit 300;`;
    const xbox = await fetchApiData("games", "POST", gameQuery);
    const games = {xbox};
  
    return {props: {games, platform: "xbox", page: query.page}};
}

const Xbox = () => (
  <GamesDisplay />
);


export default Xbox;
  