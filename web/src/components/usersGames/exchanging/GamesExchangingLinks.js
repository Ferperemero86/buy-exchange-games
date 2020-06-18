import React, {useContext} from "react";
import {useRouter} from "next/router";

import {UsersGamesContext} from "../../providers/UsersGamesProvider";
import {sendDataFromClient} from "../../../utils/API";

const GamesExchangingLinks = ({gameId, closeGamesList, userId}) => {
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
        const userId = e.target.getAttribute("data-user-id");

        sendDataFromClient("/api/user/message/save", {
            recipient: userId,
            type: "number",
            message: gameId
        });

        closeGamesList();
    }

    const showMessageForm = (e) => {
        const userId = e.target.getAttribute("data-user-id");

        dispatchUsersGames({type: "SHOW_MESSAGE_FORM", payload: userId})
    }

    return (
        <div className="links">
            <button className="button proposal"
                    data-user-id={userId}
                    onClick={submitProposal}>Submit Proposal</button>
            <button className="button send-message"
                    onClick={showMessageForm}
                    data-user-id={userId}>Send Message</button>
            <button className="button offer-game"
                    data-game-id={gameId}
                    onClick={showGamesList}>Offer Game</button>
        </div>
    )
}

export default GamesExchangingLinks;