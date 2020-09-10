import React, {useContext, useEffect} from "react";
import {useRouter} from "next/router";

import axios from "axios";

import {GamesListContext} from "../providers/GamesListProvider";
import {UserContext} from "../providers/UserProvider";

import DeleteGameQuestion from "../messages/DeleteGameQuestion";
import Button from "../forms/Button";
import Span from "../Span";
import Heading from "../Heading";
import Div from "../Div";
import List from "../List";
import ListElement from "../ListElement";
import Image from "../Image";
import Paragraph from "../Paragraph";
import Section from "../Section";


const GameStatusButton = ({Url, heading, gameId}) => {
    const {dispatchGamesList} = useContext(GamesListContext);
    
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
    
    return (
        <Button
            className="button"
            onClick={changeStatus}
            text={`Stop ${heading}`} />
    )
}


const GameStatus = ({status, gameId}) => {
    const {gamesList} = useContext(GamesListContext);
    const {user} = useContext(UserContext);
    const userLogged = user.userId;
    const userId = parseInt(gamesList.userLogged);
    let heading = null;
    let Url = null;
    
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
            <Div 
             className="game-status" 
             key={gameId}>
                <Heading
                    className="heading"
                    type="h3"
                    text={heading} />
                {userLogged === userId 
                 && heading !== "Selling/Exchanging" 
                 && <GameStatusButton
                    Url={Url}
                    gameId={gameId}
                    heading={heading} />}
            </Div>
        )
    }
    return null;
}

const GameMenuIcon = ({displayGameMenu, gameId, status}) => { 
    const {gamesList} = useContext(GamesListContext);
    const {user} = useContext(UserContext);
    const userLogged = user.userId;
    const userId = gamesList.userLogged;
    
    if (status !== "inList" || userId !== userLogged) {
        return null;
    }
    return <Span 
             className="game-menu-icon"
             data={gameId}
             text="..."
             onClick={displayGameMenu} />
}

const GameMenu = ({game, hideGameMenu}) => {
    const {gamesList, dispatchGamesList} = useContext(GamesListContext)
    const {showGameMenu} = gamesList;
    let gameId = game.id;
    const platform = game.platform;
    let id = game.game_id;
    const router = useRouter();
    
    const goToNextPage = (Url, status) => {
        dispatchGamesList({type: "SHOW_GAME_MENU"})
       
        router.push({pathname: `/account/${Url}`, 
                     query: {id, status, platform}})
    }
    const goToSellaGame = () => {
        goToNextPage("sell-a-game", "selling");
    }
    const goToExchangeaGame = () => {
        goToNextPage("exchange-a-game", "exchanging")
    }


    if (parseInt(showGameMenu) === gameId) {
        return (
            <List className="game-menu">
                <ListElement className="list-element">
                    <Span 
                     className="close-menu-icon"
                     text="X"
                     onClick={hideGameMenu} />
                </ListElement>
                <ListElement 
                 className="list-element"
                 onClick={goToSellaGame} >
                    <Span text="Sell"/>
                </ListElement>
                <ListElement 
                 className="list-element"
                 onClick={goToExchangeaGame} >
                    <Span text="Exchange"/>
                </ListElement>
 
            </List>
        )
    }
    return null;
}

const DeleteGameIcon = ({game, askForListDelete}) => {
    const {gamesList} = useContext(GamesListContext);
    const {userId} = gamesList;
    
    if (userId !== null) {
        return null;
    }

    return (
        <div className="delete-icon"
             onClick={askForListDelete}
             data={game.id}>
            <Span 
             className="icon"
             text="X" />
        </div>
    )
}

const Cover = ({Url}) => (
    <div className="cover-container">
        <Image
         className="cover"
         Url={`${Url}`} />
    </div>
)

const Title = ({title}) => (
    <Paragraph
     className="title"
     text={title} />
)

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
            const gameId = parseInt(e.currentTarget.getAttribute("data") );
           
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
            const gameId = parseInt(e.currentTarget.getAttribute("data"));
           
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
                       <Section className="games-list-section" key={game.id}>
                           <Heading 
                            className="heading"
                            text={platform.toUpperCase()}
                            type="h3" />
                           <Games games={organizedGames[platform]} />
                       </Section>
                   )
               }
            })
        })
    }
   return null;
};

export default GamesSection;

