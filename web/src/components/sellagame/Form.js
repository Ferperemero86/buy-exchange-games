import React, { useContext } from "react";
import Link from "next/link";
import {useRouter} from "next/router";
import {StoreContext} from "../../utils/store";

import axios from "axios";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faArrowCircleLeft} from '@fortawesome/free-solid-svg-icons';

import Messages from "../../components/messages/Messages";

const Price = () => {
    const {gamePrice, setGamePrice} = useContext(StoreContext);
    const {setGameCurrency} = useContext(StoreContext);

    const updatePrice = (e) => {
        setGamePrice(e.currentTarget.value);
    }

    const handleGameCurrency = (e) => {
       setGameCurrency(e.currentTarget.value); 
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
    const {setGameCondition} = useContext(StoreContext);

    const handleGameCondition = (e) => {
        setGameCondition(e.currentTarget.value);
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
    const {setGameDescription} = useContext(StoreContext);

    const handleGameDescription = (e) => {
        setGameDescription(e.currentTarget.value);
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


const Form = ({status, gameId, gameTitle}) => {
    const {gamePrice, setGamePrice} = useContext(StoreContext);
    const {setGamesList} = useContext(StoreContext);
    const {gameCondition} = useContext(StoreContext);
    const {gameDescription} = useContext(StoreContext);
    const {gameCurrency} = useContext(StoreContext);
    const {message, setMessage} = useContext(StoreContext);
    const {currentPage, setCurrentPage} = useContext(StoreContext);
    const router = useRouter();

   
    const updateGameStatus = (e) => {
        e.preventDefault();

        axios.post("/api/setgameforsell", {status, gameId, gamePrice,
                                           gameCurrency, gameCondition, gameDescription})
            .then(result => {
               const message = result.data.message;
               const gamesList = result.data.gamesList;

               setMessage(message);
               setGamesList(gamesList);
               setGamePrice("");
            })
            .catch(err => {
                if (err.response) { setMessage(err.response.data) }
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

export default Form;