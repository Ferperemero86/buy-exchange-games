import React, { useContext } from "react";
import {StoreContext} from "../../utils/store";

import axios from "axios";

import Messages from "../../components/messages/Messages";

const Form = ({status, gameId}) => {
    const {gamePrice, setGamePrice} = useContext(StoreContext);
    const {gameCondition, setGameCondition} = useContext(StoreContext);
    const {gameDescription, setGameDescription} = useContext(StoreContext);
    const {gameCurrency, setGameCurrency} = useContext(StoreContext);
    const {setMessage} = useContext(StoreContext);

    const updatePrice = (e) => {
        console.log(e.currentTarget.value);
        setGamePrice(e.currentTarget.value);
    }

    const handleGameCurrency = (e) => {
       console.log(e.currentTarget.value);
       setGameCurrency(e.currentTarget.value); 
    }

    const handleGameCondition = (e) => {
        console.log(e.currentTarget.value);
        setGameCondition(e.currentTarget.value);
    }

    const handleGameDescription = (e) => {
        setGameDescription(e.currentTarget.value);
    }

    const updateGameStatus = () => {
        axios.post("/api/setgameforsell", {status, gameId, gamePrice,
                                           gameCurrency, gameCondition, gameDescription})
            .then(result => {
               setMessage(result.data);
            })
            .catch(err => {
                setMessage(err.response.data);
            })
    }

    return (
        <div className="game-price">
            <label className="label">Price</label>
            <input type="text" 
                   className="input" 
                   onChange={updatePrice}
                   value={gamePrice} />
            <label className="label">Condition</label>
            <select id="condition" onChange={handleGameCondition}>
                <option value="Grade A">Grade A</option>
                <option value="Grade B">Grade B</option>
                <option value="Grade C">Grade C</option>
            </select>
            <select id="currency" onChange={handleGameCurrency}>
                <option value="£">GBP</option>
                <option value="€">EUR</option>
            </select>
            <label className="label">Description</label>
            <textarea className="description"
                      onChange={handleGameDescription}></textarea>
            <button className="button" 
                    onClick={updateGameStatus}>Post For Sell</button>
        </div>
    )
}

export async function getServerSideProps({query}) {
    return { props: {query} }
}

const GameToSell = ({query}) => {
    const {message, setMessage} = useContext(StoreContext);
    const {currentPage, setCurrentPage} = useContext(StoreContext);

    return (
        <div className="sell-a-game">
            <Messages 
                page="sellagame" 
                message={message} 
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                clearMessage={setMessage}/>
            <Form status={query.status} 
                gameId={query.id}/>
        </div>
    )
}

export default GameToSell;