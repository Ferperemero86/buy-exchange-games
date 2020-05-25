import React from "react";
import GamesDisplay from "../../components/explore/GamesDisplay";
import {fetchApiData} from "../../utils/API";

export async function getServerSideProps({query}) {
    const gameQuery = `fields name, summary, cover.url; where platforms = {6}; limit 300;`;
    const pc = await fetchApiData("games", "POST", gameQuery);
    const games = {pc};
  
    return {props: {games, platform: "pc", page: query.page}};
}

const Pc = () => (
    <GamesDisplay />
  );
  

export default Pc;
  