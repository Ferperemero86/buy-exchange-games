import React, {useContext} from "react";

import {TransactionsContext} from "../providers/TransactionsProvider";

const RemoveGameButton = ({classEl, gameToRemove}) => {
    const {dispatchTransactions} = useContext(TransactionsContext);

    const removeGameFromExchange = () => {
        console.log(gameToRemove);
        if (gameToRemove === "game1") {
            dispatchTransactions({type: "SET_GAME_FROM_LIST_TO_EXCHANGE", action: {} })
        }
        if (gameToRemove === "game2") {
            dispatchTransactions({type: "SET_GAME_TO_EXCHANGE", action: {} })
        }
    }

    return <button className={`${classEl}`} onClick={removeGameFromExchange}>Remove</button>    
}

export default RemoveGameButton;