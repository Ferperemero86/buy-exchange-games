import React from "react";

import BasicUserInfo from "./BasicUserInfo";
import GameInfo from "./GameInfo";
import Game from "../games/Game";

const reduceNameLength = (name) => {
    let stringName = name.split();
    let shortName;

    if (stringName[0].length > 15) {
        shortName = stringName[0].slice(0, 15) + "...";
    }
    return shortName;
};

const GamesSelling = ({games}) => {
    console.log(games);
    if (games && Array.isArray(games) && games.length > 0) {
        if (Array.isArray(games[0])) { return null }

        return games.map(game => {
            const {name, cover, price, platform, currency, id, nickName} = game;
            const capitalPlatform = platform.toUpperCase();

            const shortName = reduceNameLength(name);
           
            return (
                <div className="users-selling-game" key={game.id}>
                    <BasicUserInfo nickName={nickName} />
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
    }
    return null;
};

const GameExchanging = ({gameArray}) => {
    console.log(gameArray);
    let gameKey = 0;

    if (gameArray && Array.isArray(gameArray) && gameArray.length > 0) {
        return gameArray.map(game => {
            gameKey++;
            const {name, cover} = game;
            const shortName = reduceNameLength(name);
            const gameClass = `game-${gameKey}`;
    
            return (
                <div className={gameClass} key={gameKey}>
                    <Game 
                       title={shortName}
                       Url={cover} />
                </div>
            )
        })
    }
    return null;
}

const GamesExchanging = ({games}) => {
    console.log(games);
    let gameKey = 0;

    if (games.length > 0 && games[0].length > 0) {
        return games.map(gameArray => {
            const nickName = gameArray[0].nickName;
            gameKey++;
    
            return (
                <div className="users-exchanging-game" key={gameKey}>
                    <BasicUserInfo nickName={nickName} />
                    <GameExchanging gameArray={gameArray} />
                </div>
            )
        })
    }
    return null;
}

const Games = ({games, type}) => {
    if (Array.isArray(games) && games.length < 1 || games[0].length < 1) {
        return <p className="no-results-text">No Results</p>
    }
    if (type === "exchanging") {
        return <GamesExchanging games={games} />
    }
    return <GamesSelling games={games} />
 }
   
export default Games;