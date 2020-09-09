import React from "react";
import GamesDisplay from "../../components/explore/GamesDisplay";
import {fetchApiData} from "../../utils/API";

export async function getServerSideProps({query}) {
    const page = query.page;
    const gameQuery = `fields name, summary, cover.url; where platforms = {6}; limit 300;`;
    const pc = await fetchApiData("games", "POST", gameQuery);
    
    const games = {pc};
    if (!query.page) { return {props: {pageNotFound: true} }}
  
    return { props: {games, platform: "pc", page} };
}

const Pc = ({pageNotFound}) => {
  if (pageNotFound) { return <h1>Page not found</h1> }

  return <GamesDisplay />
};
  

export default Pc;
  