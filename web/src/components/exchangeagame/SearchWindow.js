import React, {useContext} from "react";
import axios from "axios";

import GamesSearch from "../../components/GamesSearch";

import {StoreContext} from "../../utils/store";


const SearchInput = () => {
    const {searchGameToExchangeInputValue, setSearchGameToExchangeInputValue} = useContext(StoreContext);
    const {setExchangeGamesSearch} = useContext(StoreContext);
    const {gameToFind} = useContext(StoreContext);
    const {setMessage} = useContext(StoreContext);

    const handleInputValue = async (e) => {
        const inputValue = e.currentTarget.value;

        setSearchGameToExchangeInputValue(inputValue);

        await axios.post("/api/searchgames", {game: inputValue} )
            .then(result => {
                const games = result.data.games;
            
                setExchangeGamesSearch(games);
            })
            .catch(err => {
                const error = err.response;

                if (error) { setMessage(error.data) }
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
    const {gameToFind} = useContext(StoreContext);

    if (gameToFind === "game1") {
        return <h3 className="window-search-heading">Games available in List</h3>
    }
    return null;
}

const SearchWindow = () => {
    const {showGameExchangeWindow, setShowGameExchangeWindow} = useContext(StoreContext);
    const {setGameToFind} = useContext(StoreContext);
    const {setMessage} = useContext(StoreContext);
   
    const closeWindow = () => {
        setShowGameExchangeWindow(false);
        setGameToFind(false);
        setMessage(false);
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