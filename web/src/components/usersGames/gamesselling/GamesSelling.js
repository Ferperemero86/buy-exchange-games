import React from "react";

import BasicUserInfo from "../BasicUserInfo";
import Game from "../../games/Game";
import GameInfo from "../GameInfo";
import Heading from "../../Heading";

const GamesSelling = ({games, reduceNameLength}) => {
    let uniqueKey = 0;

    if (games && Array.isArray(games) && games.length > 0) {
        if (Array.isArray(games[0])) { return null }

        return games.map(game => {
            const {name, cover, price, platform, currency, game_id, id, nickName, picture} = game;
            const capitalPlatform = platform.toUpperCase();
            const shortName = reduceNameLength(name);
            uniqueKey++;
            
            return (
                <div className="users-selling-game" key={uniqueKey}>
                    <BasicUserInfo
                        imageUrl={picture}
                        nickName={nickName} 
                        userId={id} />
                    <Game 
                        title={shortName}
                        Url={cover} 
                        price={price} />
                    <GameInfo 
                        id={id}
                        gameId={game_id}
                        price={price} 
                        currency={currency}
                        platform={capitalPlatform} />
                </div>
            )
        })
    }
    return <Heading 
            text="No Games Found" 
            className="users-games-no-results"
            type="h1" />;
};

export default GamesSelling;