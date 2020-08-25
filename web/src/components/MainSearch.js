import React, {useContext} from "react";
import {MainSearchContext} from "../components/providers/MainSearchProvider";

import Game from "../components/games/Game";
import Button from "../components/forms/Button";


const MainSearchGame = ({game, platform}) => {
    const {goToDetails} = useContext(MainSearchContext);
    const cover = game.cover ? game.cover.url : null;
    let summary = game.summary;

    if (game.summary && game.summary.length > 400) {
        summary = summary.slice(0, 400) + "...";
    }
    
    return (
        <div key={game.id}
             className="main-search-game">
            <Game
             key={game.id}
             Url={cover}
             platform={platform}
             gameId={game.id}
             title={game.name} />
            <Button 
             text="Details"
             className="button"
             data={
                 `{"id": "${game.id}", 
                   "title": "${game.name}",
                   "cover": "${cover}",
                   "platform": "${platform}",
                   "summary": "${summary}"
                  }`
             }
             onClick={goToDetails} />
        </div>
    )
};

const MainSearch = ({games}) => {
    return Object.keys(games).map(index => {
        return games[index].map(game=> {
            return <MainSearchGame
                    key={game.id} 
                    platform={index}
                    game={game} />
        })
    });
};

export default MainSearch;