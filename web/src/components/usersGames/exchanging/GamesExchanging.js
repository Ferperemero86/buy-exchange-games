import React, {useContext} from "react";
import {useRouter} from "next/router";

import {UsersGamesContext} from "../../providers/UsersGamesProvider";
import {sendLocalData} from "../../../utils/API";

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
    
    let gameKey = 0;
    const router = useRouter();

    const closeGamesList = () => {
        dispatchUsersGames({type: "SHOW_GAMES_LIST", payload: false});
    }

    const sendGamesData = (Url, data, redUrl) => {
        sendLocalData(Url, data);
        router.push(redUrl);
    }

    if (games.length > 0 && games[0].length > 0) {
        return games.map(gameArray => {
            const nickName = gameArray[0].nickName;
            const gameId = parseInt(gameArray[0].id);
            const userId = parseInt(gameArray[0].list_id);
            const picture = gameArray[0].picture;
            let game2 = gameArray[0].game_2;

            let data = {
                gameId,
                game2,
                recipientId: userId
            };
            
            if (Array.isArray(gameFromListToExchange)) {
                game2 = gameFromListToExchange.game_2;

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
                        imageUrl={picture}
                        userId={userId}
                        nickName={nickName} />
                    <GamesListSearch
                        reduceNameLength={reduceNameLength} 
                        gameId={gameId} 
                        closeGamesList={closeGamesList} />
                    <ConfirmQuestion 
                        Url="/api/usersexchanging/proposal"
                        redUrl="/games/users-exchanging"
                        gameId={gameId}
                        data={data}
                        customFunct={sendGamesData}/>
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