import React from "react";
import {useRouter} from "next/router";

import Button from "../forms/Button";

const GameInfo = ({price, platform, currency, id, gameId}) => {
    const router = useRouter();
    
    const goToGameDetails = () => {
        router.push({pathname: "/games/users-selling/details", query: {id, gameId} });
    }

    return (
        <div className="users-selling-game-info">
            <Button
                className="users-selling-details-button"
                onClick={goToGameDetails}
                text="Details" />
            <div className="users-selling-details">
                <p className="price">Price: {price}<span>{currency}</span></p>
                <p className="platform">Platform: {platform}</p>
            </div>
        </div>
    )
}

export default GameInfo;