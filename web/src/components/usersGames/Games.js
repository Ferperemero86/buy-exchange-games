import React, {useContext} from "react";

import {useRouter} from "next/router";

import BasicUserInfo from "./BasicUserInfo";
import GameInfo from "./GameInfo";
import Game from "../games/Game";

import {UsersGamesContext} from "../providers/UsersGamesProvider";
import {sendDataFromClient} from "../../utils/API";

const reduceNameLength = (name) => {
    let stringName = name.split();
    let shortName;

    if (stringName[0].length > 15) {
        shortName = stringName[0].slice(0, 15) + "...";
    }
    return shortName;
};

const GamesSelling = ({games}) => {
    console.log(games);
    if (games && Array.isArray(games) && games.length > 0) {
        if (Array.isArray(games[0])) { return null }

        return games.map(game => {
            const {name, cover, price, platform, currency, id, nickName} = game;
            const capitalPlatform = platform.toUpperCase();

            const shortName = reduceNameLength(name);
           
            return (
                <div className="users-selling-game" key={game.id}>
                    <BasicUserInfo nickName={nickName} />
                    <Game 
                        title={shortName}
                        Url={cover} 
                        price={price} />
                    <GameInfo 
                        id={id}
                        price={price} 
                        currency={currency}
                        platform={capitalPlatform} />
                </div>
            )
        })
    }
    return null;
};

const GamesList = () => {
    const {usersGames, dispatchUsersGames} = useContext(UsersGamesContext);
    const {gamesList} = usersGames;

    const selectGame = (e) => {
        const gameData = e.target.getAttribute("data-game-data");
        const gameDataArray = gameData.split(",");

        dispatchUsersGames({type: "GAME_FROM_LIST_TO_EXCHANGE", payload: gameDataArray});
        dispatchUsersGames({type: "SHOW_GAMES_LIST", payload: false});
    }
    console.log(gamesList);
    if (gamesList && Array.isArray(gamesList)) {
        if (gamesList.length > 0) {
            return gamesList.map(game => {
                let shortName;
                const {platform, cover, name} = game;
                shortName = reduceNameLength(name);
                const gameData = [platform, cover, shortName];
        
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

const GamesListSearch = ({gameId, closeGamesList}) => {
    const {usersGames} = useContext(UsersGamesContext);
    const {showGamesList, gamesList} = usersGames;

    if (showGamesList === gameId) {
        return (
            <div className="games-list" key={gameId}>
                <div className="close-icon">
                    <span onClick={closeGamesList}>X</span>
                </div>
                <GamesList />
            </div>
        )
    }
    if (showGamesList && Array.isArray(gamesList) && gamesList.length < 1) {
        <p>No Games available in your list.</p>
    }
    return null;
}


const GamesExchangingLinks = ({gameId, closeGamesList}) => {
    const {dispatchUsersGames} = useContext(UsersGamesContext);
    const router = useRouter();
   
    const showGamesList = async() => {
        const games = await sendDataFromClient("/api/gameslist", {status: "inList"});
       
        if (games) {
            const gamesList = games.gamesList;

            if (Array.isArray(gamesList)) {
                dispatchUsersGames({type: "UPDATE_GAMES_LIST", payload: gamesList});
                dispatchUsersGames({type: "SHOW_GAMES_LIST", payload: gameId});
            }
            if (games.login === false) { router.push("/account/login")}
        }
    }

    return (
        <div className="links">
            <button className="button proposal"
                    onClick={closeGamesList}>Submit Proposal</button>
            <button className="button offer-game"
                    data-game-id={gameId}
                    onClick={showGamesList}>Offer Game</button>
        </div>
    )
}

const GameExchanging = ({gameArray}) => {
    const {usersGames} = useContext(UsersGamesContext);
    const {gameFromListToExchange} = usersGames;
    let gameKey = 0;

    if (gameArray && Array.isArray(gameArray) && gameArray.length > 0) {
        return gameArray.map(game => {
            gameKey++;
            let platform, shortName, coverUrl;

            const gameClass = `game-${gameKey}`;
            const heading = gameClass === "game-1" ? "Game Owning" : "Looking For";

            if (!gameFromListToExchange || gameFromListToExchange && gameClass === "game-1") {
                const {name, cover} = game;

                platform = game.platform.toUpperCase();
                shortName = reduceNameLength(name);
                coverUrl = cover;
            } 
           
            if (gameClass === "game-2" && gameFromListToExchange) {
                platform = gameFromListToExchange[0];
                coverUrl = gameFromListToExchange[1];
                shortName = reduceNameLength(gameFromListToExchange[2]);
            }
    
            return (
                <div className={gameClass} key={gameKey}>
                    <h3 className="heading">{heading}</h3>
                    <Game
                        platform={platform}
                        title={shortName}
                        Url={coverUrl} />
                </div>
            )
        })
    }
    return null;
}

const GamesExchanging = ({games}) => {
    const {dispatchUsersGames} = useContext(UsersGamesContext);
    let gameKey = 0;

    const closeGamesList = () => {
        dispatchUsersGames({type: "SHOW_GAMES_LIST", payload: false});
    }

    if (games.length > 0 && games[0].length > 0) {
        return games.map(gameArray => {
            const nickName = gameArray[0].nickName;
            const gameId = gameArray[0].id;
            gameKey++;
    
            return (
                <div className="users-exchanging-game" key={gameKey}>
                    <BasicUserInfo nickName={nickName} />
                    <GamesListSearch 
                        gameId={gameId} 
                        closeGamesList={closeGamesList} />
                    <GameExchanging gameArray={gameArray} />
                    <GamesExchangingLinks
                        closeGamesList={closeGamesList}  
                        gameId={gameId} />
                </div>
            )
        })
    }
    return null;
}

const Games = ({games, type}) => {
    if (type === "exchanging") {
        return <GamesExchanging games={games} />
    }
    return <GamesSelling games={games} />
 }
   
export default Games;