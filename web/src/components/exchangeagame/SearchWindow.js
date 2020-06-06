import React, {useContext} from "react";
import axios from "axios";

import GamesSearch from "../../components/GamesSearch";

import {TransactionsContext} from "../providers/TransactionsProvider";


const SearchInput = () => {
    const {transactions, dispatchTransactions} = useContext(TransactionsContext);
    const {gameToFind, searchGameToExchangeInputValue, platformSelected} = transactions;

    const handleInputValue = async (e) => {
        const inputValue = e.currentTarget.value;

        dispatchTransactions({type: "SET_SEARCH_GAME_TO_EXCHANGE_INPUT_VALUE", payload: inputValue})

        await axios.post("/api/gamesinlist/game/search", { 
                game: inputValue,
                platformSelected: platformSelected.code
            })
            .then(result => {
                const games = result.data.gamesList;
                console.log("GAMES", result);
                dispatchTransactions({type: "SET_EXCHANGE_GAMES_SEARCH", payload: games});
            })
            .catch(() => {
                //const error = err.response;
            })

    }

    if(gameToFind === "game2") {
        return (
            <div className="input-search">
                <label className="label-search">Search Game</label>
                <input type="text" 
                       value={searchGameToExchangeInputValue} 
                       onChange={handleInputValue} />
            </div>
        )
    }

    return null;
}

const Heading = () => {
    const {transactions} = useContext(TransactionsContext);
    const {gameToFind} = transactions;

    if (gameToFind === "game1") {
        return <h3 className="window-search-heading">Games available in List</h3>
    }
    return null;
}

const SearchWindow = () => {
    const {transactions, dispatchTransactions} = useContext(TransactionsContext);
    const {showGameExchangeWindow} = transactions;
   
    const closeWindow = () => {
        dispatchTransactions({type: "SET_GAME_TO_FIND", payload: false});
        dispatchTransactions({type: "SHOW_EXCHANGE_SEARCH_WINDOW", payload: false});
        console.log(showGameExchangeWindow);
    }

    if(showGameExchangeWindow) {
        return (
            <div className="window-game-search">
                <span onClick={closeWindow} 
                    className="close-icon">X</span>
                <Heading />
                <SearchInput />
                <div className="window-search-games"> 
                    <GamesSearch page="exchange-a-game" />
                </div>
            </div>
        )
    }
    
    return null;
}

export default SearchWindow;