import React, {useContext} from "react";
import {useRouter} from "next/router";
import axios from "axios";

import {TransactionsContext} from "../providers/TransactionsProvider";


const ExchangeConfirmationButton = () => {
    const {transactions} = useContext(TransactionsContext);
    const {gameToExchange, gameFromListToExchange} = transactions;
    let game1;
    const game2 = gameToExchange && gameToExchange.length > 0 ? gameToExchange[0].id : null;
    const game2Data = gameToExchange && gameToExchange.length > 0 ? gameToExchange[0] : null;
    const router = useRouter();
    
    if (gameFromListToExchange) {
        if (Array.isArray(gameFromListToExchange) && gameFromListToExchange.length > 0) {
            game1 = gameFromListToExchange[0].game_id;
        } else {
            game1 = parseInt(gameFromListToExchange.id);
        }
    } else {
        game1 = [];
    }
   
    const exchangeGame = () => {
        axios.post("/api/gamesinlist/game/exchange", {
            game1: game1, 
            game2: game2,
            game2Data
            })
            .then(result => {
                console.log(result);
                router.push("/account/gameslist");
            })
            .catch(() => {
                //const error = err.response;
            })
            
    }
   
    //If both games to exchange are selected show exchange button
    if (game1 && game2) {
        return <button className="exchange-confirmation-button" onClick={exchangeGame}>Exchange</button>
    }

    return null;
}

export default ExchangeConfirmationButton;
