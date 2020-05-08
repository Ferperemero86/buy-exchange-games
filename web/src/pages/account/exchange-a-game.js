import React, {useContext, useEffect} from "react";
import {StoreContext} from "../../utils/store";

import {faArrowsAltH} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

import Messages from "../../components/messages/Messages";
import FirstGame from "../../components/exchangeagame/FirstGame";
import SecondGame from "../../components/exchangeagame/SecondGame";
import ExchangeConfirmationButton from "../../components/exchangeagame/ExchangeConfirmationButton";
import SearchWindow from "../../components/exchangeagame/SearchWindow";


export async function getServerSideProps ({query}) {
    return { props: {query} };
}

const GameToExchange = ({query}) => {
    const {message, setMessage} = useContext(StoreContext);
    const {currentPage, setCurrentPage} = useContext(StoreContext);
    const {gameFromListToExchange, setGameFromListToExchange} = useContext(StoreContext);
    const game = query;
    const title = query.title;
    const cover = query.cover;
    
    useEffect(() => {
        if (!gameFromListToExchange) {
            setGameFromListToExchange(game);
        }
    }, [setGameFromListToExchange.length])

    return (
        <div className="exchange-a-game">
            <SearchWindow />
            <div className="games">
                <FirstGame cover={cover} 
                           title={title} />
                <Messages 
                    page="exchange-a-game" 
                    message={message} 
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    clearMessage={setMessage}/>
                <FontAwesomeIcon icon={faArrowsAltH} className="exchange-arrow" />
                <ExchangeConfirmationButton game1={query.id} />
                <SecondGame />
            </div>
        </div>
    )

}

export default GameToExchange;