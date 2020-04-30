import React, { useContext } from "react";
import Link from "next/link";
import {useRouter} from "next/router";
import {StoreContext} from "../../utils/store";

import axios from "axios";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faArrowCircleLeft} from '@fortawesome/free-solid-svg-icons';

import Messages from "../../components/messages/Messages";
import Game from "../../components/games/Game";

const Form = ({status, gameId, gameTitle}) => {
    const {gamePrice, setGamePrice} = useContext(StoreContext);
    const {gameCondition, setGameCondition} = useContext(StoreContext);
    const {gameDescription, setGameDescription} = useContext(StoreContext);
    const {gameCurrency, setGameCurrency} = useContext(StoreContext);
    const {message, setMessage} = useContext(StoreContext);
    const {currentPage, setCurrentPage} = useContext(StoreContext);
    const router = useRouter();

    const updatePrice = (e) => {
        setGamePrice(e.currentTarget.value);
    }

    const handleGameCurrency = (e) => {
       setGameCurrency(e.currentTarget.value); 
    }

    const handleGameCondition = (e) => {
        setGameCondition(e.currentTarget.value);
    }

    const handleGameDescription = (e) => {
        setGameDescription(e.currentTarget.value);
    }

    const updateGameStatus = (e) => {
        e.preventDefault();

        axios.post("/api/setgameforsell", {status, gameId, gamePrice,
                                           gameCurrency, gameCondition, gameDescription})
            .then(result => {
               setMessage(result.data);
               setGamePrice("");
            })
            .catch(err => {
                setMessage(err.response.data);
            })
    }

    const cancelSelling = (e) => {
        e.preventDefault();
        router.push("/account/gameslist")
    }

    if (gameTitle) {
        return (
            <form className="form">
                <Messages 
                    page="sellagame" 
                    message={message} 
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    clearMessage={setMessage}/>
                <div className="form-section">
                    <div className="label"><label>Price</label></div>
                    <div className="input">
                        <input type="text" 
                               className="input" 
                               onChange={updatePrice}
                               value={gamePrice} />
                        <select id="currency" onChange={handleGameCurrency}>
                            <option value="GBP">£</option>
                            <option value="EUR">€</option>
                        </select>
                    </div>
                </div>
                <div className="form-section">
                <div className="label"><label>Condition</label></div>
                    <div className="input">
                        <select id="condition" onChange={handleGameCondition}>
                            <option value="Grade A">Grade A</option>
                            <option value="Grade B">Grade B</option>
                            <option value="Grade C">Grade C</option>
                        </select>
                    </div>
                </div>
                <div className="form-section">
                    <div className="label"><label>Description</label></div>
                    <div className="input">
                        <textarea className="description"
                                  onChange={handleGameDescription}></textarea>
                    </div>
                </div>
                <button className="button" 
                        onClick={updateGameStatus}>Post For Sale</button>
                <button className="button"
                        onClick={cancelSelling}>Cancel</button>
            </form>
        )
    }
    return (
        <div className="no-game-result">
            <h1 className="no-game-heading">No Game selected for Sale</h1>
            <FontAwesomeIcon icon={faArrowCircleLeft} className="left-arrow" />
            <Link href="/account/gameslist">
                <a to="/account/gameslist" className="go-back-link">Go Back</a>
            </Link>
        </div>
    )
}

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