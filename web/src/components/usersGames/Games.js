import React from "react";

import GamesExchanging from "./exchanging/GamesExchanging";
import GamesSelling from "./gamesselling/GamesSelling";

const Games = ({games, type}) => {
    const reduceNameLength = (name) => {
        let stringName = name.split();
        let shortName;
    
        if (stringName[0].length > 15) {
            shortName = stringName[0].slice(0, 15) + "...";
            return shortName;
        }
        return name;
    };

    if (type === "exchanging") {
        return <GamesExchanging 
                    games={games} 
                    reduceNameLength={reduceNameLength} />
    }
    return <GamesSelling 
                games={games} 
                reduceNameLength={reduceNameLength} />
 }
   
export default Games;