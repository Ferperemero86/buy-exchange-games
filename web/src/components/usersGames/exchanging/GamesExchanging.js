import React, {useContext} from "react";

import {UsersGamesContext} from "../../providers/UsersGamesProvider";

import BasicUserInfo from "../BasicUserInfo";
import GamesListSearch from "../exchanging/GamesListSearch";
import GameExchanging from "../exchanging/GameExchanging";
import GamesExchangingLinks from "../exchanging/GamesExchangingLinks";
import MessageForm from "../../../components/forms/MessageForm";
import ConfirmQuestion from "../../messages/ConfirmQuestion";

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
    const game2= gameFromListToExchange ? gameFromListToExchange.game_2 : null;
    let gameKey = 0;

    const closeGamesList = () => {
        dispatchUsersGames({type: "SHOW_GAMES_LIST", payload: false});
    }

    if (games.length > 0 && games[0].length > 0) {
        return games.map(gameArray => {
            const nickName = gameArray[0].nickName;
            const gameId = gameArray[0].id;
            const userId = parseInt(gameArray[0].list_id);
            let data ={
                gameId,
                game2,
                recipientId: userId
            };
            
            if (Array.isArray(gameFromListToExchange)) {
                data = {
                    gameId,
                    game2: gameFromListToExchange[3],
                    recipientId: userId
                };
            }
            
            gameKey++;
            
            return (
                <div className="users-exchanging-game" key={gameKey}>
                    <BasicUserInfo 
                        userId={userId}
                        nickName={nickName} />
                    <GamesListSearch
                        reduceNameLength={reduceNameLength} 
                        gameId={gameId} 
                        closeGamesList={closeGamesList} />
                    <ConfirmQuestion 
                        Url="/api/usersexchanging/proposal"
                        redUrl="/games/users-exchanging"
                        data={data}/>
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