import React, {useContext} from "react";

import {StoreContext} from "../../utils/store";

import Game from "../../components/games/Game";

const SecondGame = () => {
    const {setShowGameExchangeWindow} = useContext(StoreContext);
    const {gameToExchange} = useContext(StoreContext);
    const {setGameToFind} = useContext(StoreContext);
    const {setExchangeGamesSearch} = useContext(StoreContext);

    const openSearchWindow = () => {
        setShowGameExchangeWindow(true);
        setGameToFind("game2");
        setExchangeGamesSearch([]);
    }

    if (gameToExchange && gameToExchange.length > 0) {
        const cover = gameToExchange[0].cover.url;
        const title = gameToExchange[0].name;

        return (
            <div className="game-2">
                <Game Url={cover} 
                      title={title} 
                      gameToRemove= "game2"
                      page="exchange-a-game" />
            </div>    
        ) 
    } 

    return (
        <div className="find-a-game2">
            <button className="button" 
                    game="game2"
                    onClick={openSearchWindow}>Find Game</button>
        </div>
    )
}

export default SecondGame;