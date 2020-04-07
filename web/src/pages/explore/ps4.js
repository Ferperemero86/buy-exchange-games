import PlatformGames from "../../components/explore/PlatformGames";
import fetchApiData from "../../utils/API";
import {useEffect, useContext } from "react";
import { StoreContext } from "../../utils/store";

const Ps4 = ({gamesFromServer, query}) => {
    const {setPage} = useContext(StoreContext);
    const {setPlatform} = useContext(StoreContext);

    useEffect(() => {
      setPage(parseInt(query.page));
      setPlatform("ps4");
    })
  
    return <PlatformGames
            gamesFromServer={gamesFromServer}
            query={query} />
    
};

export async function getServerSideProps({query}) {
  const gameQuery = `fields name, summary, cover.url; where platforms = {48}; limit 300;`;
  const ps4 = await fetchApiData("games", "POST", gameQuery);
  const gamesFromServer = {ps4};
  
  return {props: {gamesFromServer, query}};
};


export default Ps4;
  


