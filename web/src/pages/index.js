import React, {useEffect, useContext} from "react";
import Link from 'next/link';
import fetchApiData from "../utils/API";
import {StoreContext} from "../utils/store";

export async function getServerSideProps() {
  const ps4 = await fetchApiData("games", "POST", `fields platforms.name, cover.url; limit 1; where platforms = {48};`);
  const xbox = await fetchApiData("games", "POST", `fields platforms.name, cover.url; limit 1; where platforms = {49};`);
  const pc = await fetchApiData("games", "POST", `fields platforms.name, cover.url; limit 1; where platforms = {6};`);
  const gamesFromServer = {ps4, xbox, pc};

  return {props: {gamesFromServer}};
}

const Games = () => {
  const {games} = useContext(StoreContext);

  return Object.keys(games).map(index => {   
    let cover = games[index][0].cover;
    const gameId = games[index][0].id;
    const platform = index;
    const URL = index;

    if(cover) {
      cover = cover.url;
    }
    
    return(
      <Link href={{ pathname: `/explore/${URL}`, query: {page: 1} }} key={gameId} >
        <div className="game-container">
          <img src={`${cover}`} className="cover" />
          <p className="title">{platform}</p>
        </div>
      </Link>
    )
  });
}

const Home = ({ gamesFromServer }) => {
  const {setGames} = useContext(StoreContext);
  const {setMessage} = useContext(StoreContext);

  useEffect(() => {
    setMessage(false);
    setGames(gamesFromServer);
  });

  return (
  <div id="home">
    <div className="explore-games">
      <Games />
    </div>
  </div>
  )
}

export default Home;

