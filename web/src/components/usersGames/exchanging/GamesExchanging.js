import React, {useContext} from "react";

import {UsersGamesContext} from "../../providers/UsersGamesProvider";

import BasicUserInfo from "../BasicUserInfo";
import GamesListSearch from "../exchanging/GamesListSearch";
import GameExchanging from "../exchanging/GameExchanging";
import GamesExchangingLinks from "../exchanging/GamesExchangingLinks";
import MessageForm from "../../../components/forms/MessageForm";

const MessageToSend = ({recipient}) => {
    const {usersGames, dispatchUsersGames} = useContext(UsersGamesContext);
    const {messageForm} = usersGames;

    const closeMessageForm = () => {
        dispatchUsersGames({type: "SHOW_MESSAGE_FORM", payload: false})
    } 
    
    if (parseInt(messageForm) === recipient) {
        return (
            <div className="message-to-send">
                <span className="close-icon"
                      onClick={closeMessageForm}>X</span>
                <MessageForm recipient={recipient} />
            </div>
        )
    }
    return null;
}

const GamesExchanging = ({games, reduceNameLength}) => {
    const {usersGames, dispatchUsersGames} = useContext(UsersGamesContext);
    const {gameFromListToExchange} = usersGames;
    let gameKey = 0;

    const closeGamesList = () => {
        dispatchUsersGames({type: "SHOW_GAMES_LIST", payload: false});
    }

    if (games.length > 0 && games[0].length > 0) {
        return games.map(gameArray => {
            const nickName = gameArray[0].nickName;
            const gameId = gameArray[0].id;
            const userId = parseInt(gameArray[0].list_id);
            console.log("RECIPIENT", userId);
            gameKey++;
    
            return (
                <div className="users-exchanging-game" key={gameKey}>
                    <BasicUserInfo nickName={nickName} />
                    <GamesListSearch
                        reduceNameLength={reduceNameLength} 
                        gameId={gameId} 
                        closeGamesList={closeGamesList} />
                    <GameExchanging 
                        gameArray={gameArray} 
                        gameFromListToExchange={gameFromListToExchange}
                        reduceNameLength={reduceNameLength} />
                    <GamesExchangingLinks
                        closeGamesList={closeGamesList}  
                        userId={userId}
                        gameId={gameId} />
                    <MessageToSend recipient={userId} />
                </div>
            )
        })
    }
    return null;
}

export default GamesExchanging;