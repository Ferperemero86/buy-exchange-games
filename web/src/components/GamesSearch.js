import React, { useContext, useEffect } from "react";

import axios from "axios";

import Game from "../components/games/Game";
import {TransactionsContext} from "./providers/TransactionsProvider";

const ExchangeGameButton = ({gameId, gameSelected}) => {
    const {transactions, dispatchTransactions} = useContext(TransactionsContext);
    const {gameToFind} = transactions;

    const exchangeGame = async () => {
        await axios.post("/api/gamesinlist/game/search", {game: gameId, gameSelected})
            .then(result => {
                const game = result.data.gamesList;
                
                if (gameToFind === "game1") {
                    dispatchTransactions({type: "SET_GAME_FROM_LIST_TO_EXCHANGE", payload: game})
                } else {
                    dispatchTransactions({type: "SET_GAME_TO_EXCHANGE", payload: game})
                }
                dispatchTransactions({type: "SHOW_EXCHANGE_SEARCH_WINDOW", payload: false})
            })
            .catch(() => {
                //const error = err.response;
            })
    }

    return (
        <button 
            onClick={exchangeGame} 
            className="button">Exchange</button>
    )
}

const GamesSearch = ({page}) => {
    const {transactions, dispatchTransactions} = useContext(TransactionsContext);
    const {searchGameToExchangeInputValue, exchangeGamesSearch, gameToFind} = transactions;

    useEffect(() => {
        axios.post("/api/gameslist", {status: true})
            .then(result => {
                if (result) {
                    const gamesList = result.data.gamesList;
                
                    if (gameToFind === "game1") {
                        dispatchTransactions({type:"SET_EXCHANGE_GAMES_SEARCH", payload: gamesList})
                    }
                }
            })
            .catch(err => {
                console.log(err.response)
            });

    }, [exchangeGamesSearch.length]);
    
   
    if (Array.isArray(exchangeGamesSearch) ) {
    
        if (exchangeGamesSearch.length < 1 && searchGameToExchangeInputValue === "") {
            return <p className="search-message">No Results Found</p>;
        }
       
        return exchangeGamesSearch.map(game => {
            let cover;
            let gameSelected;
            let title = game.name;
          
            if (game && game.cover) {
                if (gameToFind === "game1") {
                    cover = game.cover
                    gameSelected = "game1"
                }
                if (gameToFind === "game2") {
                    cover = game.cover.url;
                    gameSelected = "game2";
                }
            } 
            
            if (page === "exchange-a-game") {
                return (
                    <div className="game-container" key={game.id}>
                        <Game Url={cover} 
                              title={title}
                              platform={game.platform}
                              gameId={game.id}
                              key={game.id} />
                        <ExchangeGameButton gameId={game.id} gameSelected={gameSelected}/>
                    </div>
                )
            }
        })
    } else if (exchangeGamesSearch === null || exchangeGamesSearch === undefined) {
        return <p className="search-message-error">Something went wrong</p>
    }
    

}

export default GamesSearch;