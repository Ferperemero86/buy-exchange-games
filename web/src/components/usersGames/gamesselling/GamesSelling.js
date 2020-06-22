import React from "react";

import BasicUserInfo from "../BasicUserInfo";
import Game from "../../games/Game";
import GameInfo from "../GameInfo";

const GamesSelling = ({games, reduceNameLength}) => {
    if (games && Array.isArray(games) && games.length > 0) {
        if (Array.isArray(games[0])) { return null }

        return games.map(game => {
            console.log(game);
            const {name, cover, price, platform, currency, id, nickName} = game;
            const capitalPlatform = platform.toUpperCase();

            const shortName = reduceNameLength(name);
           
            return (
                <div className="users-selling-game" key={game.id}>
                    <BasicUserInfo 
                        nickName={nickName} 
                        userId={id} />
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

export default GamesSelling;