import React, {useContext} from "react";

import {GamesListContext} from "../providers/GamesListProvider";

import DeleteQuestion from "./DeleteQuestion";

const DeleteListQuestion = ({action, element, cancelDelete}) => {
    const {gamesList} = useContext(GamesListContext);
    const {showDeleteListQuestion} = gamesList;

    if (showDeleteListQuestion) {
        return <DeleteQuestion 
                    cancelDelete={cancelDelete}
                    action={action}
                    element={element} />
    }
    return null;
}

export default DeleteListQuestion;