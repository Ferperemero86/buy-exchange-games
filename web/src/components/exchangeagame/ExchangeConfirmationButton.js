import React, {useContext} from "react";
import axios from "axios";

import {StoreContext} from "../../utils/store";



const ExchangeConfirmationButton = () => {
    const {gameToExchange} = useContext(StoreContext);
    const {setMessage} = useContext(StoreContext);
    const {setGamesList} = useContext(StoreContext);
    const {gameFromListToExchange} = useContext(StoreContext);
    let game1;
    
    const game2 = gameToExchange.length > 0 ? gameToExchange[0].id : null;
    
    if (gameFromListToExchange) {
        if (Array.isArray(gameFromListToExchange) && gameFromListToExchange.length > 0) {
            game1 = gameFromListToExchange[0].id;
        } else {
            game1 = parseInt(gameFromListToExchange.id);
        }
    } else {
        game1 = [];
    }

    const exchangeGame = () => {
        axios.post("/api/exchangegame", {game1: game1, game2: game2})
            .then(result => {
                const message = result.data.message;
                const gamesList = result.data.gamesList;

                setGamesList(gamesList);
                setMessage(message);
            })
            .catch(err => {
                const error = err.response;

                if (error) {
                    setMessage(error.data);
                }
            })
            
    }
    //If both games to exchange are selected show exchange button
    if (game1 && game2) {
        return <button className="exchange-confirmation-button" onClick={exchangeGame}>Exchange</button>
    }

    return null;
}

export default ExchangeConfirmationButton;
