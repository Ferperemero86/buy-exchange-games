import React, {useContext} from "react";
import {useRouter} from "next/router";

import {sendLocalData} from "../../../utils/API";

import Game from "../../../components/games/Game";
import Button from "../../../components/forms/Button";

import ConfirmQuestion from "../../../components/messages/ConfirmQuestion";
import NewOfferForm from "../../../components/forms/NewOfferForm";
import {MessagesContext} from "../../../components/providers/MessagesProvider";
import {UsersGamesContext} from "../../../components/providers/UsersGamesProvider";

export async function getServerSideProps(ctx) {
    const {id, gameId} = ctx.query;
    const URLBase = await ctx.req.headers.host;
    const Url = new URL("/api/usersselling/game", `http://${URLBase}`).href;
    
    const gameDetails = await sendLocalData(Url, {id, gameId});

    return { props: {gameDetails} };
}


const SellingLinks = () => {
    const {dispatchUsersGames} = useContext(UsersGamesContext);
    const {dispatchMessages} = useContext(MessagesContext);
    const router = useRouter();
   
    const goToPreviousPage = () => {
        router.push("/games/users-selling");
    }

    const askConfirmation = () => {
        const message = "Send Proposal?";

        dispatchMessages({type: "SHOW_CONFIRM_QUESTION", payload: true})
        dispatchMessages({type: "UPDATE_CONFIRMATION_MESSAGE", payload: message})
    }

    const showNewOfferForm = () => {
        dispatchUsersGames({type: "SHOW_NEW_OFFER_FORM", payload: true});
    }

    return (
        <div className="selling-links">
            <Button 
                className="selling-links-button proposal"
                text="Send proposal"
                onClick={askConfirmation} />
            <Button 
                className="selling-links-button new-offer"
                text="New Offer"
                onClick={showNewOfferForm} />
            <Button 
                className="selling-links-button cancel"
                text="Cancel"
                onClick={goToPreviousPage} />
        </div>
    )
}

const SellingDetails = ({gameDetails}) => {
    const {usersGames, dispatchUsersGames} = useContext(UsersGamesContext);
    const {gameSellingPrice, newOfferForm} = usersGames;
    const {condition, description, currency} = gameDetails;
    const {platform} = gameDetails.content;

    const updatePrice = (e) => {
        const price = e.target.value;
        dispatchUsersGames({type: "UPDATE_GAME_SELLING_PRICE", payload: price});
    }

    return (
        <div className="selling-details">
            <NewOfferForm
                newOfferForm={newOfferForm}
                onChange={updatePrice}
                value={gameSellingPrice}
                currency={currency}
                price={gameSellingPrice} />
            <p>Condition: {condition}</p>
            <p>Platform: {platform.toUpperCase()}</p>
            <p>Description: {description}</p>
        </div>
    )
}

const GameDetails = ({gameDetails}) => {
    const {name, cover} = gameDetails.content;

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
    const {usersGames} = useContext(UsersGamesContext);
    const {gameSellingPrice} = usersGames;
    const {games} = gameDetails;
    const data = {
        price: gameSellingPrice,
        gameId: games.id,
        recipientId: games.list_id
    };
    
    return (
        <div className="users-selling-game-details">
            <ConfirmQuestion 
                Url="/api/usersselling/proposal"
                redUrl="/games/users-selling"
                data={data} />
            <GameDetails gameDetails={games} />
            <SellingLinks />
        </div>
    )
}

export default UsersSellingDetails;