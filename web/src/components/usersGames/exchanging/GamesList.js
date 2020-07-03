import React, {useContext} from "react";

import {UsersGamesContext} from "../../providers/UsersGamesProvider";
import Game from "../../../components/games/Game";

const GamesList = ({reduceNameLength}) => {
    const {usersGames, dispatchUsersGames} = useContext(UsersGamesContext);
    const {gamesList} = usersGames;

    const selectGame = (e) => {
        const gameData = e.target.getAttribute("data-game-data");
        const gameDataArray = gameData.split(",");

        dispatchUsersGames({type: "GAME_FROM_LIST_TO_EXCHANGE", payload: gameDataArray});
        dispatchUsersGames({type: "SHOW_GAMES_LIST", payload: false});
    }
    
    if (gamesList && Array.isArray(gamesList)) {
        if (gamesList.length > 0) {
            return gamesList.map(game => {
                let shortName;
                const {platform, cover, name, game_id} = game;
                shortName = reduceNameLength(name);
                const gameData = [platform, cover, shortName, game_id];
                
                return (
                    <div className="games-list-game" key={game.id}>
                        <Game
                            platform={platform}
                            title={shortName}
                            Url={cover} />
                        <button onClick={selectGame}
                                className="button"
                                data-game-data={gameData}>Select</button>
                    </div>
                )
            })
        }
        return <p className="no-results-text">No games available in list</p>
    }
    return null;
}

export default GamesList;
