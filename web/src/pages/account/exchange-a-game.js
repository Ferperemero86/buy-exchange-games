import React from "react";
import {fetchApiData} from "../../utils/API";

import {faArrowsAltH} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

import FirstGame from "../../components/exchangeagame/FirstGame";
import SecondGame from "../../components/exchangeagame/SecondGame";
import CancelButton from "../../components/exchangeagame/CancelButton";
import RemoveGameButton from "../../components/exchangeagame/RemoveGameButton";
import ExchangeConfirmationButton from "../../components/exchangeagame/ExchangeConfirmationButton";
import SearchWindow from "../../components/exchangeagame/SearchWindow";


export async function getServerSideProps ({query}) {
    const platform = query ? query.platform : null;
    const status = query ? query.status : null;
    let platformQuery;

    switch(platform) {
        case "ps4" :
            platformQuery = 48;
        break;

        case "xbox" :
            platformQuery = 49;
        break;

        case "pc" :
            platformQuery = 6;
        break;
    }

    const game = await fetchApiData("games", "POST", `fields name, summary, cover.url; where id = ${query.id} & platforms = ${platformQuery};`);
   
    if (game.length === 0 || game.length > 0 && game.status === 400 || status !== "exchanging" || !platform) {
        return { props: {gameNotFound: true} }
    }

    return { props: {query: game[0], platform} };
}

const GameToExchange = ({gameNotFound}) => {
    if (gameNotFound) { return <h1 className="game-not-found">Game Not Found</h1>}

    return (
        <div className="exchange-a-game">
            <SearchWindow />
            <div className="games">
                <div className="first-game">
                    <RemoveGameButton 
                        classEl="remove-game-button" 
                        gameToRemove="game1" />
                    <FirstGame />
                </div>
                <FontAwesomeIcon icon={faArrowsAltH} className="exchange-arrow" />
                <CancelButton />
                <ExchangeConfirmationButton />
                <div className="second-game">
                    <RemoveGameButton 
                        classEl="remove-game-button" 
                        gameToRemove="game2" />
                    <SecondGame />
                </div>
            </div>
        </div>
    )
};

export default GameToExchange;