import React from "react";
import {useRouter} from "next/router";

const GameInfo = ({price, platform, currency, id, gameId}) => {
    const router = useRouter();
    console.log(gameId);
    const goToGameDetails = () => {
        router.push({pathname: "/games/users-selling/details", query: {id, gameId} });
    }

    const sendProposal = () => {
        console.log("sending proposal...");
        router.push({pathname: "/users-selling/details", query: {id} })
    } 

    return (
        <div className="users-selling-game-info">
            <button className="users-selling-details-button" 
                    onClick={goToGameDetails}>Details</button>
            <button className="users-selling-proposals-button"
                    onClick={sendProposal}>Send proposal</button>
            <div className="users-selling-details">
                <p className="price">Price: {price}<span>{currency}</span></p>
                <p className="platform">Platform: {platform}</p>
            </div>
        </div>
    )
}

export default GameInfo;