import React from "react";

import Game from "../../games/Game";

const GameExchanging = ({gameArray, reduceNameLength, gameFromListToExchange}) => {
    let gameKey = 0;

    if (gameArray && Array.isArray(gameArray) && gameArray.length > 0) {
        return gameArray.map(game => {
            gameKey++;
            let platform, shortName, coverUrl;

            const gameClass = `game-${gameKey}`;
            const heading = gameClass === "game-1" ? "Game Owning" : "Looking For";

            if (!gameFromListToExchange || gameFromListToExchange && gameClass === "game-1") {
                const {name, cover} = game;

                platform = game.platform.toUpperCase();
                shortName = reduceNameLength(name);
                coverUrl = cover;
            } 
            
            if (gameClass === "game-2" && gameFromListToExchange instanceof Array === false) {
                platform = gameFromListToExchange.platform;
                coverUrl = gameFromListToExchange.cover;
                shortName = reduceNameLength(gameFromListToExchange.name);
            }
            if (gameClass === "game-2" && gameFromListToExchange instanceof Array === true) {
                platform = gameFromListToExchange[0];
                coverUrl = gameFromListToExchange[1];
                shortName = reduceNameLength(gameFromListToExchange[2]);
            }
    
            return (
                <div className={gameClass} key={gameKey}>
                    <h3 className="heading">{heading}</h3>
                    <Game
                        platform={platform}
                        title={shortName}
                        Url={coverUrl} />
                </div>
            )
        })
    }
    return null;
}

export default GameExchanging;
