import React, {useContext} from "react";

import {StoreContext} from "../../utils/store";

import Game from "../../components/games/Game";


const FirstGame = ({cover, title}) => {
    const {gameFromListToExchange} = useContext(StoreContext);
    const {setGameToFind} = useContext(StoreContext);
    const {setShowGameExchangeWindow} = useContext(StoreContext);
    const {setExchangeGamesSearch} = useContext(StoreContext);
   
    const openSearchWindow = () => {
        setGameToFind("game1");
        setShowGameExchangeWindow(true);
        setExchangeGamesSearch([]);
    }
   
    if (Array.isArray(gameFromListToExchange) ) {

        if (gameFromListToExchange.length > 0 ) {
            const cover = gameFromListToExchange[0].cover.url;
            const title = gameFromListToExchange[0].name
            return <Game Url={cover} 
                         title={title} 
                         gameToRemove="game1"
                         page="exchange-a-game" />
        }

        if (gameFromListToExchange.length < 1) {
            return (
                <div className="find-a-game1">
                    <button className="button" onClick={openSearchWindow}>Find Game</button>
                </div>
            )
        }
   }
    
    return  <Game Url={cover} 
                  title={title} 
                  gameToRemove= "game1"
                  page="exchange-a-game" />
       
}

export default FirstGame;
