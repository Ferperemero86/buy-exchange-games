import React from "react";

import Game from "../../games/Game";
import Heading from "../../Heading";

const GameExchanging = ({gameArray, reduceNameLength, gameFromListToExchange}) => {
    let gameKey = 0;

    if (gameArray && Array.isArray(gameArray) && gameArray.length > 0) {
        return gameArray.map(game => {
            gameKey++;
            
            const gameClass = `game-${gameKey}`;
            const heading = gameClass === "game-1" ? "Game Owning" : "Looking For";
            const gameFromListToExchangeId = gameFromListToExchange ? parseInt(gameFromListToExchange[4]) : null;
            let platform = game.platform.toUpperCase();
            let shortName = reduceNameLength(game.name);
            let coverUrl = game.cover;

            if (gameClass === "game-2" && 
                gameFromListToExchange instanceof Array === true && 
                gameFromListToExchangeId === game.id) {

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
    return  <Heading 
             text="No Games Found" 
             className="users-games-no-results"
             type="h1" />;
}

export default GameExchanging;
