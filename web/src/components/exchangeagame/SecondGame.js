import React, {useContext} from "react";

import {TransactionsContext} from "../providers/TransactionsProvider";

import Game from "../../components/games/Game";

const SecondGame = () => {
    const {transactions, dispatchTransactions} = useContext(TransactionsContext);
    const {gameToExchange} = transactions; 

    const openSearchWindow = () => {
        dispatchTransactions({type: "SHOW_EXCHANGE_SEARCH_WINDOW", payload: true})
        dispatchTransactions({type: "SET_GAME_TO_FIND", payload: "game2"})
        dispatchTransactions({type: "SET_EXCHANGE_GAMES_SEARCH", payload: []})
    }

    if (Array.isArray(gameToExchange) && gameToExchange.length > 0) {
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