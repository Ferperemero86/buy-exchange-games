import React, {useContext} from "react";

import {GamesListContext} from "../providers/GamesListProvider";

import DeleteQuestion from "./DeleteQuestion";

const DeleteGameQuestion = ({action, element, gameId}) => {
    const {gamesList} = useContext(GamesListContext);
    const {showDeleteGameQuestion, gameToDelete} = gamesList;
    console.log("showDeleteGameQuestion", showDeleteGameQuestion);
    if (showDeleteGameQuestion && gameToDelete === gameId) {
        return <DeleteQuestion 
                    action={action}
                    gameId={gameId}
                    element={element} />
    }
    return null;
}

export default DeleteGameQuestion;