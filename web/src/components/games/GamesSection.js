import React, {useContext, useEffect} from "react";

import axios from "axios";

import DeleteGameQuestion from "../messages/DeleteGameQuestion";
import {GamesListContext} from "../providers/GamesListProvider";

import {useRouter} from "next/router";

const GameStatusButton = ({Url, heading, gameId}) => {
    const {gamesList, dispatchGamesList} = useContext(GamesListContext);
    const {userId} = gamesList;
    
    const changeStatus = async (e) => {
        e.preventDefault();
        
        await axios.post(`/api/${Url}`, {gameId})
            .then(result => {
                const {gamesList} = result.data;
                dispatchGamesList({type: "UPDATE_GAMES", payload: gamesList})
                
            })
            .catch(() => {
                //setMessage(err.response.data);
            })
    }
    if (userId !== null) {
        return null;
    }
    
    return (
        <button className="button"
                onClick={changeStatus}>Stop {heading}</button>
    )
}


const GameStatus = ({status, gameId}) => {
    const {gamesList} = useContext(GamesListContext);
    const {userId} = gamesList;
    let heading = null;
    let Url = null;
    console.log(status, userId);
    if (status === "exchanging") {
        heading = "Exchanging";
        Url = "gamesinlist/game/stopexchanging";
    }
   
    if (status === "selling") {
        heading = "Selling";
        Url = "gamesinlist/game/stopselling";  
    }

    if (status === "inList" && userId) {
        heading = "Selling/Exchanging"
    }

    if (heading) {
        return (
            <div className="game-status" key={gameId}>
                <h3 className="heading">{heading}</h3>
                <GameStatusButton
                    Url={Url}
                    gameId={gameId}
                    heading={heading} />
            </div>
        )
    }
    return null;
}

const GameMenuIcon = ({displayGameMenu, gameId, status}) => { 
    const {gamesList} = useContext(GamesListContext);
    const {userId} = gamesList;
    
    if (status === "inList" || userId !== null) {
        return null;
    }
    return <span className="game-menu-icon"
                     data-key-game-id={gameId} 
                     onClick={displayGameMenu}>....</span>;
}

const GameMenu = ({game, hideGameMenu}) => {
   const {gamesList, dispatchGamesList} = useContext(GamesListContext)
   const {showGameMenu} = gamesList;
   let gameId = game.id;
   let id;
   const router = useRouter();
   
   const goToNextPage = (Url, status) => {
       dispatchGamesList({type: "SHOW_GAME_MENU"})
      
       router.push({pathname: `/account/${Url}`, 
                    query: {id, 
                            status,
                            name: game.name, 
                            platform: game.platform, 
                            cover: game.cover}})
   }
   const goToSellaGame = () => {
       id = game.game_id;
       goToNextPage("sell-a-game", "selling");
   }
   const goToExchangeaGame = () => {
        id = game.id;
       goToNextPage("exchange-a-game", "exchanging")
   }

   if (parseInt(showGameMenu) === gameId) {
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

const Game = ({games}) => {
   const {gamesList, dispatchGamesList} = useContext(GamesListContext);
   const {elementToDelete} = gamesList;
   let coverURL;
   let gameId = 0;

    return games.map(game => {
       if (game.cover) {
         const gameCoverString = game.cover;
         coverURL = gameCoverString.replace("t_thumb", "t_cover_big");
       }
        const id = gameId + 1;
        gameId++;

        const displayGameMenu = (e) => {
            const gameId = parseInt(e.currentTarget.getAttribute("data-key-game-id") );
           
            dispatchGamesList({type: "SHOW_GAME_MENU", payload: gameId});
        }

        const hideGameMenu = () => {
         dispatchGamesList({type: "SHOW_GAME_MENU", payload: null});
        }

        const deleteGame = (gameId) => {

         axios.post("/api/gamesinlist/game/delete", {gameId})
             .then(result => {
                 const gamesList = result.data.gamesList;
                
                 dispatchGamesList({type: "SHOW_DELETE_GAME_QUESTION", payload: false});
                
                 if (Array.isArray(gamesList)) {
                     dispatchGamesList({type: "UPDATE_GAMES", payload: gamesList});
                 } else {
                     //setMessage({internalError: true});
                 }
             })
             .catch(() => {
               dispatchGamesList({type: "SHOW_DELETE_GAME_QUESTION", payload: false})
                 //setMessage(err.response.data);
             })
            
        };

        const askForListDelete = (e) => {
            const gameId = parseInt(e.currentTarget.getAttribute("data-key-game-id"));
           
            if(gameId === game.id) {
               dispatchGamesList({type: "SET_ELEMENT_TO_DELETE", payload: "game"})
               dispatchGamesList({type: "SET_GAME_TO_DELETE", payload: gameId})
               dispatchGamesList({type: "SHOW_DELETE_GAME_QUESTION", payload: true});
            }
        }

        return (
            <div className="game" key={id}>
               <DeleteGameQuestion gameId={game.id}
                                   action={deleteGame} 
                                   element={elementToDelete} /> 
               <GameStatus status={game.status} 
                           gameId={game.id} />
               <GameMenu hideGameMenu={hideGameMenu} 
                         game={game} /> 
               <div className="game-header">
                   <DeleteGameIcon game={game} 
                                   data-key-game-id={game.id}
                                   askForListDelete={askForListDelete} />
                   <GameMenuIcon displayGameMenu={displayGameMenu} 
                                 data-game-id={game.id}
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

const Games = ({games}) => {
   return (
       <div className="gameslist">
           <Game games={games} />
       </div>
   )
};

const GamesSection = ({gamesInList, userId}) => {
   const {gamesList, dispatchGamesList} = useContext(GamesListContext);
   const {games} = gamesList;
   let platform = null;
   let organizedGames = {};

    useEffect(() => {
        dispatchGamesList({type: "UPDATE_GAMES", payload: gamesInList});
        dispatchGamesList({type: "UPDATE_USER_ID", payload: userId})
    }, [gamesInList])
   
    if (Array.isArray(games) ) {
        games.map(game => {
            if(!organizedGames[game.platform]) {
               organizedGames[game.platform] = [];
            }
            organizedGames[game.platform].push(game);
        });
       
        return Object.keys(organizedGames).map(index => {
           
            return organizedGames[index].map(game => {
               if(game.platform && game.platform !== platform) {
                   platform = game.platform;
                   
                   return (
                       <section className="games-list-section" key={game.id}>
                           <h3 className="heading">{platform.toUpperCase()}</h3>
                           <Games games={organizedGames[platform]} />
                       </section>
                   )
               }
            })
        })
    }
   return null;
};

export default GamesSection;

