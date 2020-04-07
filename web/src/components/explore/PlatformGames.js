import { useEffect, useContext } from "react";
import { StoreContext } from "../../utils/store";
import GamesDisplay from "./GamesDisplay";

const PlatformGames = ({ gamesFromServer, query }) => {
    const {setPage} = useContext(StoreContext);
    
    useEffect(() => {
      setPage(parseInt(query.page));
    })
  
    return <GamesDisplay 
            gamesFromServer={gamesFromServer} />
};

export default PlatformGames;
