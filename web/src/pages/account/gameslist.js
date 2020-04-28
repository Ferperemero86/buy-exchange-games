import React, {useContext, useEffect} from "react";
import {useRouter} from "next/router";
import {StoreContext} from "../../utils/store";

import fetch from "node-fetch";
import axios from "axios";

import DeleteQuestion from "../../components/messages/DeleteQuestion";
import Messages from "../../components/messages/Messages";

const ListInput = () => {
    const {createListInputValue, setCreateListInputValue} = useContext(StoreContext);
    const {createListInput, setCreateListInput} = useContext(StoreContext);
    const {setEditListMenuActive} = useContext(StoreContext);
    const {editName} = useContext(StoreContext);
    const {setListName} = useContext(StoreContext);
    const {setEditList} = useContext(StoreContext);
    const {setListCreated} = useContext(StoreContext);
    const {setMessage} = useContext(StoreContext);
    const {userId} = useContext(StoreContext);
    const URL = editName ? "editlistname" : "createlist";
    const label = URL === "editlistname" ? "Edit Name" : "New List";


    const updateInputValue = (e) => {
        setCreateListInputValue(e.target.value)
    }

    const sendInputData = (e) => {
        e.preventDefault();
        axios({
            url: `/api/${URL}`,
            method: "POST",
            data: {listName: createListInputValue, userId}
        })
            .then(result => {
                const success = result.data;

                if (success.listCreated) {
                    setCreateListInput(false);
                    setEditListMenuActive(true);
                    setEditList(false);
                    setListCreated(true);
                    setListName(success.listName)
                }

                if (success.listNameUpdated) {
                    setListName(success.listNameUpdated);
                    setCreateListInput(false);
                    setEditList(false);
                    setCreateListInputValue("");
                }
            })
            .catch(err => {
                const error = err.response.data;
                setMessage(error);
            });
    };

    const cancelEditName = () => {
        setCreateListInput(false);
    };

    if (createListInput) {
        return (
            <div className="create-list">
                <form className="create-list-form">
                    <label className="label">{label}</label>
                    <input
                        type="text"
                        onChange={updateInputValue}
                        value={createListInputValue}
                        className="input" />
                    <button
                        onClick={sendInputData}
                        className="button">Send</button>
                        {URL === "editlistname" && <button 
                                                        onClick={cancelEditName}
                                                        className="button">Cancel</button>}
                </form>
            </div>
        )  
    }
    return null;
};

const EditList = () => {
    const {editListMenuActive} = useContext(StoreContext);
    const {setAskDeleteList} = useContext(StoreContext);
    const {setEditName} = useContext(StoreContext);
    const {editList, setEditList} = useContext(StoreContext);
    const {setCreateListInput} = useContext(StoreContext);

    const toggleEditMenu = () => {
        if (!editList) {
            return setEditList(true)
        }
        setEditList(false);
    };

    const askForListDelete = () => {
        setAskDeleteList(true);
    }

    const editListName = () => {
        setEditName(true);
        setCreateListInput(true);
    }

    const List = () => {
        return (
            <ul className="list">
                <li onClick={askForListDelete}>Delete</li>
                <li onClick={editListName}>Change Name</li>
            </ul>
        )
    }

    if(editListMenuActive) {
        return (
            <div className="edit-list">
                <span
                    className="span"
                    onClick={toggleEditMenu}>Edit List</span>
                {editList === true && <List />}
            </div>
        )
    }
    return null;
};

const GameStatus = ({status}) => {
    let heading = null;

    if (status === "selling") {
        heading = "Selling"    
    }

    if (heading) {
        return (
            <div className="game-status">
                <h3 className="heading">{heading}</h3>
                <button className="button">Stop Selling</button>
            </div>
        )
    }
    return null;
}

const GameMenuIcon = ({displayGameMenu, gameId}) => {
    return <span className="game-menu-icon"
                 data-key-game-id={gameId} 
                 onClick={displayGameMenu}>....</span>;
}

const GameMenu = ({game, hideGameMenu}) => {
    const {showGameMenu} = useContext(StoreContext);
    const {gameID} = useContext(StoreContext);
    const {setShowGameMenu} = useContext(StoreContext);
    const gameId = game.id;
    const router = useRouter();

    const goToSellaGame = () => {
        setShowGameMenu(false);

        router.push({pathname: "/account/sell-a-game", 
                     query: {id: game.id, 
                             status: "selling",
                             title: game.name, 
                             platform: game.platform, 
                             cover: game.cover}})
    }
   
    if (showGameMenu && gameID === gameId) {
        return (
            <ul className="game-menu">
                <li className="list-element">
                    <span className="close-menu-icon" onClick={hideGameMenu}>X</span>
                </li>
                
                    <li className="list-element" 
                        data-key-game-id={gameId}
                        onClick={goToSellaGame}>Sell</li>
               
                <li className="list-element">Exchange</li>
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
                <GameStatus status={game.status} />
                <GameMenu hideGameMenu={hideGameMenu} 
                          game={game} /> 
                <div className="game-header">
                    <DeleteGameIcon game={game} askForListDelete={askForListDelete} />
                    <GameMenuIcon displayGameMenu={displayGameMenu} gameId={game.id}/>
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

    if (gamesList) {
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

export async function getServerSideProps(ctx) {
    const userId = await ctx.req.user ? ctx.req.user.id : null;
    const URLBase = await ctx.req.headers.host;
    const Url = new URL("/api/getlist", `http://${URLBase}`).href;

    const result = await fetch(Url, { method: 'POST', 
                                      body: JSON.stringify({userId}), 
                                      headers: {'Content-Type': 'application/json'} 
                                    });
    const content = await result.json();

    let data;

    if (await userId) {
        data = content;
    } else {
        data = {login: false};
    }

    return { props: {data} };
}

const UserList = ({data}) => {
    const {userId, setUserId} = useContext(StoreContext);
    const {currentPage, setCurrentPage} = useContext(StoreContext);
    const {gamesList, setGamesList} = useContext(StoreContext);
    const {askDeleteList, setAskDeleteList} = useContext(StoreContext);
    const {setEditListMenuActive} = useContext(StoreContext);
    const {setCreateListInputValue} = useContext(StoreContext);
    const {setEditList} = useContext(StoreContext);
    const {message, setMessage} = useContext(StoreContext);
    const {listName} = useContext(StoreContext);
    const {setCreateListInput} = useContext(StoreContext);
    const {setListName} = useContext(StoreContext);
    const {setEditName} = useContext(StoreContext);
    const {setListDeleted} = useContext(StoreContext);
    const {fetchGamesListFromServer} = useContext(StoreContext);


    const deleteList = () => {
        axios({ 
            url: "/api/deletelist", 
            method: "POST" 
        })
            .then(() => {
                setListDeleted(true);
                setEditListMenuActive(false);
                setAskDeleteList(false);
                setCreateListInput(true);
                setGamesList([]);
                setCreateListInputValue("");
                setListName("");
                setEditName(false);
            })
            .catch(err => {
                const error = err.response.data;

                setMessage(error);
                setEditListMenuActive(false);
                setAskDeleteList(false);
            });
    };

    useEffect(() => {
        //If not logged redirects to login page
        if (data.login === false) {
            setMessage(data);
        }
        
        if (data.listExists === false) {
            setCreateListInput(true);
            setEditListMenuActive(false);
        }

        if (data.internalError) {
            setMessage(data);
        }
        
        //Gets data from server
        if (data.gamesList && fetchGamesListFromServer) {
            
            if (Array.isArray(data.gamesList)) {
                setGamesList(data.gamesList);
            } else {
                setMessage({couldNotGetList: true});
            }
    
            setCreateListInput(false);
            setEditListMenuActive(true);
            setEditList(false);
            setUserId(data.id);
            setListName(data.list.result.list_name);
        } 

        //Stops getting data from server.
        //Fetches from client with axios.
        //Updates user id hook if different from coming from server.
        if (!fetchGamesListFromServer || (data.id !== userId && userId !== null) ) {
            let id;
            
            if (data.id !== userId) {
                id = data.id;
                setUserId(data.id);
            } else {
                id = userId;
            }

            setCreateListInput(false);
            setEditListMenuActive(true);
        
            //Fetches games and listName when did not get them previously from server.
            axios("/api/getlist", { method: 'POST', data: {userId: id} })
                    .then(result => {                        
                        const gamesList = result.data.gamesList;
                        const listName = result.data.list.result.list_name;
                
                        if (Array.isArray(gamesList)) {
                            setGamesList(gamesList);
                        } else {
                            setMessage({couldNotGetList: true});
                        }

                        setCreateListInput(false);
                        setEditListMenuActive(true);
                        setListName(listName);
                    }) 
                    .catch(()=> {
                        setCreateListInput(true);
                        setEditListMenuActive(false);
                    })
    
        }
    }, [gamesList.length]);

    return (
        <div className="user-list">
            <Messages 
                page="gameslist" 
                message={message} 
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                clearMessage={setMessage}/>
            <DeleteQuestion 
                showQuestion={askDeleteList} 
                action={deleteList} 
                element="list"
                cancelDelete={setAskDeleteList}/>
            <ListInput />
            <h3 className="gameslist-heading">{listName}</h3>
            <EditList />
            <GamesSection />
        </div>
    )
}

export default UserList;