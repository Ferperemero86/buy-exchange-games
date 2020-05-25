import React, { useContext } from "react";

import {useRouter} from "next/router";
import {SellGameContext} from "../providers/SellGameProvider";

import axios from "axios";


const Price = () => {
    const {sellGame, dispatchSellGame} = useContext(SellGameContext);
    const {gamePrice} = sellGame;
    
    const updatePrice = (e) => {
        dispatchSellGame({type: "UPDATE_GAME_PRICE", payload: e.currentTarget.value})
    }

    const handleGameCurrency = (e) => {
        dispatchSellGame({type: "UPDATE_GAME_CURRENCY", payload: e.currentTarget.value})
    }

    return (
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
    )
   
}

const Condition = () => {
    const {dispatchSellGame} = useContext(SellGameContext)

    const handleGameCondition = (e) => {
        dispatchSellGame({type: "UPDATE_GAME_CONDITION", payload: e.currentTarget.value})
    }

    return (
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
    )
}

const Description = () => {
    const {dispatchSellGame} = useContext(SellGameContext);

    const handleGameDescription = (e) => {
        dispatchSellGame({type: "UPDATE_GAME_DESCRIPTION", payload: e.currentTarget.value})
    }

    return (
        <div className="form-section">
            <div className="label"><label>Description</label></div>
            <div className="input">
                <textarea className="description"
                          onChange={handleGameDescription}></textarea>
            </div>
        </div>  
    )
}


const Form = () => {
    const {sellGame, dispatchSellGame} = useContext(SellGameContext);
    const {gamePrice, gameId, status, 
          gameCondition, gameDescription, gameCurrency} = sellGame;
    const router = useRouter();
    
    const updateGameStatus = (e) => {
        e.preventDefault();
    
        axios.post("/api/gamesinlist/game/sell", 
                    {status, gameId, gamePrice,
                    gameCurrency, gameCondition, gameDescription })
            .then(() => {
               dispatchSellGame({type: "UPDATE_GAME_PRICE", payload: ""});
               router.push("/account/gameslist");
            })
            .catch(() => {
        
            })
    }

    const cancelSelling = (e) => {
        e.preventDefault();
        router.push("/account/gameslist")
    }

    return (
        <form className="form">
            <Price />
            <Condition />
            <Description />
            <button className="button" 
                    onClick={updateGameStatus}>Post For Sale</button>
            <button className="button"
                    onClick={cancelSelling}>Cancel</button>
        </form>
    )
}

export default Form;