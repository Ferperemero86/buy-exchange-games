import React, {useContext, useEffect} from "react";

import axios from "axios";

import DeleteQuestion from "../../components/messages/DeleteQuestion";

import {StoreContext} from "../../utils/store";
import {useRouter} from "next/router";


const GameStatus = ({status, gameId}) => {
    const {setGamesList} = useContext(StoreContext);
    const {setMessage} = useContext(StoreContext);
    const {setGameStatus} = useContext(StoreContext);
    let heading = null;
    let Url = null;

    const changeStatus = (e) => {
        e.preventDefault();

        setGameStatus(true)
        
        axios.post(`/api/${Url}`, {gameId})
        .then(result => {
            const gamesList = result.data.gamesList;
            console.log(result.data.gamesList);
            if (Array.isArray(gamesList) ) {
                setGamesList(gamesList)
            } else {
                setMessage(result.data);
            }
        })
        .catch(err => {
            setMessage(err.response.data);
        })
    }
    console.log(status);
    if (status === "exchanging") {
        heading = "Exchanging";
        Url = "stopexchanging"
    }
   
    if (status === "selling") {
        heading = "Selling";
        Url = "stopselling";  
    }

    if (heading) {
        return (
            <div className="game-status" key={gameId}>
                <h3 className="heading">{heading}</h3>
                <button className="button"
                        onClick={changeStatus}>Stop {heading}</button>
            </div>
        )
    }
    return null;
}

const GameMenuIcon = ({displayGameMenu, gameId, status}) => {

    if(status === "inList") {
        return <span className="game-menu-icon"
             data-key-game-id={gameId} 
             onClick={displayGameMenu}>....</span>;
    }
    return null;
}

const GameMenu = ({game, hideGameMenu}) => {
    const {showGameMenu} = useContext(StoreContext);
    const {gameID} = useContext(StoreContext);
    const {setShowGameMenu} = useContext(StoreContext);
    const gameId = game.id;
    const router = useRouter();

    const goToNextPage = (Url, status) => {
        setShowGameMenu(false);
        console.log("show game", game);
        router.push({pathname: `/account/${Url}`, 
                     query: {id: game.game_id, 
                             status,
                             title: game.name, 
                             platform: game.platform, 
                             cover: game.cover}})
    }

    const goToSellaGame = () => {
        goToNextPage("sell-a-game", "selling")
    }

    const goToExchangeaGame = () => {
        goToNextPage("exchange-a-game", "exchanging")
    }
   
    if (showGameMenu && gameID === gameId) {
        return (
            <ul className="game-menu">
                <li className="list-element">
                    <span className="close-menu-icon" 
                          onClick={hideGameMenu}>X</span>
                </li>
                <li className="list-element" 
                    onClick={goToSellaGame}>Sell</li>
                <li className="list-element"
                    onClick={goToExchangeaGame}>Exchange</li>
            </ul>
        )
    }
    return null;
}

const DeleteGameIcon = ({game, askForListDelete}) => {
    return (
        <div className="delete-icon" 
             onClick={askForListDelete}
             data-key-game-id={game.id}>
            <span className="icon">x</span>
        </div>
    )
}

const Cover = ({Url}) => {
    return (
        <div className="cover-container">
            <img src={`${Url}`} className="cover" />
        </div>
    )
}

const Title = ({title}) => {
    return (
        <p className="title">{title}</p>
    )
}

const Game = ({platformGames}) => {
    const {askDeleteGame, setAskDeleteGame} = useContext(StoreContext);
    const {gameID, setGameID} = useContext(StoreContext);
    const {setMessage} = useContext(StoreContext);
    const {setGamesList} = useContext(StoreContext);
    const {setShowGameMenu} = useContext(StoreContext);
    let gameId = 0;

    return platformGames.map(game => {
        const gameCoverString = game.cover;
        const coverURL = gameCoverString.replace("t_thumb", "t_cover_big");
        gameId++;
        const id = gameId + 1;
    

        const displayGameMenu = (e) => {
            const gameId = e.currentTarget.getAttribute("data-key-game-id");
        
            setGameID(parseInt(gameId));
            setShowGameMenu(true);
        }

        const hideGameMenu = () => {
            setShowGameMenu(false);
        }

        const deleteGame = () => {
            axios.post("/api/deletegame", {gameID})
                .then(result => {
                    const gamesList = result.data.gamesList;
                    
                    setAskDeleteGame(false);
                
                    if (Array.isArray(gamesList)) {
                        setGamesList(gamesList);
                    } else {
                        setMessage({internalError: true});
                    }
                })
                .catch(err => {
                    setAskDeleteGame(false);
                    setMessage(err.response.data);
                })
            
        };

        const askForListDelete = (e) => {
            const gameData = e.currentTarget.getAttribute("data-key-game-id");

            setAskDeleteGame(true);
            setGameID(parseInt(gameData));
        }

        return (
            <div className="game" key={id}>
                <DeleteQuestion 
                    gameId={game.id}
                    showQuestion={askDeleteGame} 
                    action={deleteGame} 
                    cancelDelete={setAskDeleteGame}
                    element="game" /> 
                <GameStatus status={game.status} gameId={game.id} />
                <GameMenu hideGameMenu={hideGameMenu} 
                          game={game} /> 
                <div className="game-header">
                    <DeleteGameIcon game={game} askForListDelete={askForListDelete} />
                    <GameMenuIcon displayGameMenu={displayGameMenu} 
                                  gameId={game.id}
                                  status={game.status} />
                </div>
                <div className="game-info">
                    <Cover Url={coverURL} />
                    <Title title={game.name}/>
                </div>
            </div> 
        )
    })
}

const Games = ({platformGames}) => {
    const {setFetchGamesListFromServer} = useContext(StoreContext);

    useEffect(() => {
        if (platformGames.length > 0) {
            setFetchGamesListFromServer(false);
        }
    })

    return (
        <div className="gameslist">
            <Game platformGames={platformGames} />
        </div>
    )
};

const GamesSection = () => {
    const {gamesList} = useContext(StoreContext);
    let platform = null;
    let games = {};

    if (Array.isArray(gamesList)) {
        gamesList.map(game => {
            if(!games[game.platform]) {
                games[game.platform] = [];
            }
            games[game.platform].push(game);
        });
        
        return Object.keys(games).map(index => {
            return games[index].map(game => {
                if(game.platform !== platform) {
                    platform = game.platform;

                    return (
                        <section className="games-list-section" key={platform}>
                            <h3 className="heading">{platform.toUpperCase()}</h3>
                            <Games platformGames={games[platform]} />
                        </section>
                    )
                }

            })
        })
    }
    return null;
};

export default GamesSection;