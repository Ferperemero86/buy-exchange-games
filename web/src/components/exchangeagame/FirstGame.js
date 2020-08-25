import React, {useContext} from "react";

import {TransactionsContext} from "../providers/TransactionsProvider";

import Game from "../../components/games/Game";


const FirstGame = () => {
    const {transactions, dispatchTransactions} = useContext(TransactionsContext);
    const {gameFromListToExchange} = transactions;
    let name, cover, platform;
   
    const openSearchWindow = () => {
        dispatchTransactions({type: "SHOW_EXCHANGE_SEARCH_WINDOW", payload: true});
        dispatchTransactions({type: "SET_GAME_TO_FIND", payload: "game1"});
        dispatchTransactions({type: "SET_EXCHANGE_GAMES_SEARCH", payload: []});
    }

    if (gameFromListToExchange) {
        
        if (Object.keys(gameFromListToExchange).length > 0 ) {
            name = gameFromListToExchange.name;
            cover = gameFromListToExchange.cover;
            platform = gameFromListToExchange.platform.toUpperCase();
        }
        if (Array.isArray(gameFromListToExchange) && gameFromListToExchange.length > 0 ) {
            name = gameFromListToExchange[0].name;
            cover = gameFromListToExchange[0].cover;
        }
    
        return (
            <div>
                <Game 
                 Url={cover} 
                 title={name} 
                 gameToRemove="game1"
                 page="exchange-a-game" />
                <p className="game-1-text">{platform}</p>
            </div>
        )
    }
    
    return (
        <div className="find-a-game1">
            <button className="button" onClick={openSearchWindow}>Find Game</button>
        </div>
    )  
}

export default FirstGame;
