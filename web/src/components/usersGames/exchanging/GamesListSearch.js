import React, {useContext} from "react";

import {UsersGamesContext} from "../../providers/UsersGamesProvider";
import GamesList from "./GamesList";

const GamesListSearch = ({gameId, closeGamesList, reduceNameLength}) => {
    const {usersGames} = useContext(UsersGamesContext);
    const {showGamesList, gamesList} = usersGames;

    if (showGamesList === gameId) {
        return (
            <div className="games-list" key={gameId}>
                <div className="close-icon">
                    <span onClick={closeGamesList}>X</span>
                </div>
                <GamesList 
                    reduceNameLength={reduceNameLength} />
            </div>
        )
    }
    if (showGamesList && Array.isArray(gamesList) && gamesList.length < 1) {
        <p>No Games available in your list.</p>
    }
    return null;
}

export default GamesListSearch;