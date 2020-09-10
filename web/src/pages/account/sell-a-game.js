import React, {useContext} from "react";
import {fetchApiData} from "../../utils/API";

import Link from "next/link";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faArrowCircleLeft} from '@fortawesome/free-solid-svg-icons';

import {SellGameContext} from "../../components/providers/SellGameProvider";

import Game from "../../components/games/Game";
import Form from "../../components/sellagame/Form";


export async function getServerSideProps({query}) {
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

    if (game.length === 0 || game.length > 0 && game.status === 400 || status !== "selling" || !platform) {
        return { props: {gameNotFound: true} }
    }

    return { props: {query: game[0]} }
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