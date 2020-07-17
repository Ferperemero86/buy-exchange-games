import React, {useContext} from "react";
import {useRouter} from "next/router";

import {UsersGamesContext} from "../../providers/UsersGamesProvider";
import {sendDataFromClient} from "../../../utils/API";
import {MessagesContext} from "../../providers/MessagesProvider";

import Button from "../../forms/Button";

const GamesExchangingLinks = ({gameId, closeGamesList, userId}) => {
    const {dispatchMessages} = useContext(MessagesContext);
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

    const submitProposal = (e) => {
        const gameId = parseInt(e.currentTarget.getAttribute("data"));
        
        dispatchMessages({type: "SHOW_CONFIRM_QUESTION", payload: gameId})

        closeGamesList();
    }

    const showMessageForm = (e) => {
        const userId = e.currentTarget.getAttribute("data-user-id");
        dispatchUsersGames({type: "SHOW_MESSAGE_FORM", payload: userId})
    }

    return (
        <div className="links">
            <Button
                className="button proposal"
                data={gameId}
                onClick={submitProposal}
                text="Submit Proposal" />
             <Button
                className="button send-message"
                onClick={showMessageForm}
                data={userId}
                text="Send Message" />
             <Button
                className="button offer-game"
                onClick={showGamesList}
                data={gameId}
                text="Offer Game" />
        </div>
    )
}

export default GamesExchangingLinks;