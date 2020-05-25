import React, {useContext} from "react";

import Link from "next/link";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faArrowCircleLeft} from '@fortawesome/free-solid-svg-icons';

import {SellGameContext} from "../../components/providers/SellGameProvider";

import Game from "../../components/games/Game";
import Form from "../../components/sellagame/Form";


export async function getServerSideProps({query}) {
    return { props: {query} }
}

const GameToSell = () => {
    const {sellGame} = useContext(SellGameContext);
    const {title, cover, gameId} = sellGame;
    
    if (gameId) {
        return (
            <div className="sell-a-game">
                <Game Url={cover} title={title} page="sell-a-game" />
                <Form />
            </div>
        )
    }
    return (
        <div className="no-game-result">
            <h1 className="no-game-heading">No Game selected for Sale</h1>
            <FontAwesomeIcon icon={faArrowCircleLeft} className="sell-a-game-left-arrow" />
            <Link href="/account/gameslist">
                <a to="/account/gameslist" className="sell-a-game-go-back-link">Go Back</a>
            </Link>
        </div>
    )
}

export default GameToSell;