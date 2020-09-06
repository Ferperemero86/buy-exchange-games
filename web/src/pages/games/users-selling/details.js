import React, {useContext} from "react";
import {useRouter} from "next/router";

import {sendLocalData} from "../../../utils/API";

import Game from "../../../components/games/Game";
import Button from "../../../components/forms/Button";
import Paragraph from "../../../components/Paragraph";

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


const SellingLinks = ({gameId}) => {
    const {askConfirmation} = useContext(MessagesContext);
    const {showNewOfferForm} = useContext(UsersGamesContext);
    const router = useRouter();
   
    const goToPreviousPage = () => {
        router.push("/games/users-selling");
    };

    return (
        <div className="selling-links">
            <Button 
                className="selling-links-button proposal"
                data={gameId}
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
};

const SellingDetails = ({gameDetails}) => {
    const {usersGames, updatePrice} = useContext(UsersGamesContext);
    const {gameSellingPrice, newOfferForm} = usersGames;
    const {condition, description, currency} = gameDetails;
    const {platform} = gameDetails.content;

    return (
        <div className="selling-details">
            <NewOfferForm
                newOfferForm={newOfferForm}
                onChange={updatePrice}
                value={gameSellingPrice}
                currency={currency}
                price={gameSellingPrice} />
            <Paragraph>Condition: {condition}</Paragraph>
            <Paragraph>Platform: {platform.toUpperCase()}</Paragraph>
            <Paragraph>Description: {description}</Paragraph>
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
    const router = useRouter();
    const data = {
        price: gameSellingPrice,
        gameId: games.id,
        recipientId: games.list_id
    };

    const sendGamesData = (Url, data, redUrl) => {
        sendLocalData(Url, data);
        router.push(redUrl);
    };

    return (
        <div className="users-selling-game-details">
            <ConfirmQuestion 
                Url="/api/usersselling/proposal"
                redUrl="/games/users-selling"
                gameId={games.id}
                customFunct={sendGamesData}
                data={data} />
            <GameDetails gameDetails={games} />
            <SellingLinks gameId={games.id} />
        </div>
    )
}

export default UsersSellingDetails;