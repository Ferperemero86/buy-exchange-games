import React, { useContext, useEffect } from "react";

import axios from "axios";

import Game from "../components/games/Game";
import { StoreContext } from "../utils/store";

const ExchangeGameButton = ({gameId}) => {
    const {setGameToExchange} = useContext(StoreContext);
    const {setGameFromListToExchange} = useContext(StoreContext);
    const {setShowGameExchangeWindow} = useContext(StoreContext);
    const {gameToFind} = useContext(StoreContext);
    const {setMessage} = useContext(StoreContext);
   
    const exchangeGame = async () => {
        await axios.post("/api/searchgames", {game: gameId})
            .then(result => {
                const game = result.data.games;
                
                if (gameToFind === "game1") {
                    setGameFromListToExchange(game);
                } else {
                    setGameToExchange(game);
                }

                setShowGameExchangeWindow(false);
            })
            .catch(err => {
                const error = err.response;
                
                if (error) {
                    setMessage(error.data);
                }
            })
    }

    return (
        <button 
            onClick={exchangeGame} 
            className="button">Exchange</button>
    )
}

const GamesSearch = ({page}) => {
    const {searchGameToExchangeInputValue} = useContext(StoreContext);
    const {exchangeGamesSearch} = useContext(StoreContext);
    const {setExchangeGamesSearch} = useContext(StoreContext);
    const {gameToFind} = useContext(StoreContext);

    useEffect(() => {
        console.log(gameToFind);
        axios.post("/api/getlist", {status: true})
        .then(result => {
            if (result) {
                const gamesList = result.data.gamesList;
                console.log("GAMESLIST", gamesList);
                if (gameToFind === "game1") {
                    setExchangeGamesSearch(gamesList);
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
            let gameId;
            
            if (game && game.cover) {
                if (gameToFind === "game1") {
                    cover = game.cover
                    gameId = game.game_id;
                }
                if (gameToFind === "game2") {
                    cover = game.cover.url;
                    gameId = game.id;
                }
            } 
            
            if (page === "exchange-a-game") {
                return (
                    <div className="game-container" key={game.id}>
                        <Game Url={cover} 
                              title={game.name}
                              platform={game.platform}
                              gameId={game.id}
                              key={game.id} />
                        <ExchangeGameButton gameId={gameId}/>
                    </div>
                )
            }
        })
    } else if (exchangeGamesSearch === null || exchangeGamesSearch === undefined) {
        return <p className="search-message-error">Something went wrong</p>
    }
    

}

export default GamesSearch;