import React, {useContext} from "react";
import {useRouter} from "next/router";

import {sendLocalData} from "../../../utils/API";

import Game from "../../../components/games/Game";
import ConfirmQuestion from "../../../components/messages/ConfirmQuestion";
import {MessagesContext} from "../../../components/providers/MessagesProvider";

export async function getServerSideProps(ctx) {
    const id = ctx.query.id;
    const URLBase = await ctx.req.headers.host;
    const Url = new URL("/api/usersselling/game", `http://${URLBase}`).href;

    const gameDetails = await sendLocalData(Url, {id});

    return { props: {gameDetails} };
}


const SellingLinks = () => {
    const {dispatchMessages} = useContext(MessagesContext)
    const router = useRouter();

    const goToPreviousPage = () => {
        router.push("/games/users-selling");
    }

    const askConfirmation = () => {
        const message = "Send Proposal?";

        dispatchMessages({type: "SHOW_CONFIRM_QUESTION", payload: true})
        dispatchMessages({type: "UPDATE_CONFIRMATION_MESSAGE", payload: message})
    }

    return (
        <div className="selling-links">
            <button className="selling-links-button proposal"
                    onClick={askConfirmation}>Send Proposal</button>
            <button className="selling-links-button cancel"
                    onClick={goToPreviousPage}>Cancel</button>
        </div>
    )
}

const SellingDetails = ({gameDetails}) => {
    const {price, condition, description, platform} = gameDetails.games[0];
    return (
        <div className="selling-details">
            <p>Price: {price}</p>
            <p>Condition: {condition}</p>
            <p>Platform: {platform.toUpperCase()}</p>
            <p>Description: {description}</p>
        </div>
    )
}

const GameDetails = ({gameDetails}) => {
    const {name, cover} = gameDetails.games[0];
    return (
        <div className="game-info">
            <Game 
                title={name}
                Url={cover} />
            <SellingDetails gameDetails={gameDetails} />
        </div>
    )
}

const UsersSellingDetails = ({gameDetails}) => {
    return (
        <div className="users-selling-game-details">
            <ConfirmQuestion />
            <GameDetails gameDetails={gameDetails} />
            <SellingLinks />
        </div>
    )
}

export default UsersSellingDetails;