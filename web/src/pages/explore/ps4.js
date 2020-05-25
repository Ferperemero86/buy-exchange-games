import React from "react";
import GamesDisplay from "../../components/explore/GamesDisplay";
import {fetchApiData} from "../../utils/API";


export async function getServerSideProps({query}) {
  const gameQuery = `fields name, summary, cover.url; where platforms = {48}; limit 300;`;
  const ps4 = await fetchApiData("games", "POST", gameQuery);
  const games = {ps4};
  
  return {props: {games, platform: "ps4", page: query.page}};
}

const Ps4 = () => (
  <GamesDisplay />
);


export default Ps4;
  


