import React from "react";

import Game from "../../components/games/Game";
import Form from "../../components/sellagame/Form";


export async function getServerSideProps({query}) {
    return { props: {query} }
}

const GameToSell = ({query}) => {
    const title = query.title;
    const cover = query.cover;

    return (
        <div className="sell-a-game">
            <Game Url={cover} title={title} page="sell-a-game" />
            <Form status={query.status} 
                gameId={query.id}
                gameTitle={title} />
        </div>
    )
}

export default GameToSell;