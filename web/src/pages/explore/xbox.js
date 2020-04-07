import PlatformGames from "../../components/explore/PlatformGames";
import fetchApiData from "../../utils/API";
import {useEffect, useContext } from "react";
import { StoreContext } from "../../utils/store";

const Xbox = ({gamesFromServer, query}) => {
    const {setPage} = useContext(StoreContext);
    const {setPlatform} = useContext(StoreContext);

    useEffect(() => {
      setPage(parseInt(query.page));
      setPlatform("xbox");
    })
  
    return <PlatformGames
            gamesFromServer={gamesFromServer}
            query={query} />
};

export async function getServerSideProps({query}) {
    const gameQuery = `fields name, summary, cover.url; where platforms = {49}; limit 300;`;
    const xbox = await fetchApiData("games", "POST", gameQuery);
    const gamesFromServer = {xbox};
  
    return {props: {gamesFromServer, query}};
};


export default Xbox;
  