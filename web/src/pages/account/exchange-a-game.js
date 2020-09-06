import React from "react";

import {faArrowsAltH} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

import FirstGame from "../../components/exchangeagame/FirstGame";
import SecondGame from "../../components/exchangeagame/SecondGame";
import CancelButton from "../../components/exchangeagame/CancelButton";
import RemoveGameButton from "../../components/exchangeagame/RemoveGameButton";
import ExchangeConfirmationButton from "../../components/exchangeagame/ExchangeConfirmationButton";
import SearchWindow from "../../components/exchangeagame/SearchWindow";


export async function getServerSideProps ({query}) {
    return { props: {query} };
}

const GameToExchange = () => {
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
}

export default GameToExchange;