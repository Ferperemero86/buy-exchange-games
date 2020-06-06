import React from "react";

import BasicUserInfo from "./BasicUserInfo";
import GameInfo from "./GameInfo";
import Game from "../games/Game";

const GameSelling = ({games}) => {
    return games.map(game => {
        const {name, cover, price, platform, currency, id} = game;
        const capitalPlatform = platform.toUpperCase();
        let stringName = name.split();
        let shortName;
    
        if (stringName[0].length > 15) {
            shortName = stringName[0].slice(0, 15) + "...";
        }
    
        return (
            <div className="users-selling-game" key={game.id}>
                <BasicUserInfo />
                <Game 
                    title={shortName}
                    Url={cover} 
                    price={price} />
                <GameInfo 
                    id={id}
                    price={price} 
                    currency={currency}
                    platform={capitalPlatform} />
            </div>
        )
    })
};

const GameExchanging = () => {
    return <h1>Exchanging</h1>
}

const Games = ({games, type}) => {
    if (Array.isArray(games) && games.length < 1) {
        return <h2>No Results</h2>
    }
    if (type === "exchanging") {
        return <GameExchanging />
    }
    return <GameSelling games={games} />
 }
   
export default Games;