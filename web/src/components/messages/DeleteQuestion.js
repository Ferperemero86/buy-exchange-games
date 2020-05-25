import React, {useContext} from "react";
import {GamesListContext} from "../providers/GamesListProvider";

const DeleteQuestion = ({action, element, gameId}) => {
    const {gamesList, dispatchGamesList} = useContext(GamesListContext);
    const {showQuestion, gameToDelete} = gamesList;

    let title;

    if (element === "list") {
        title = "Delete List?";
    }

    if (element === "game") {
        title = "Delete Game?"
    }

    const deleteItem = () => {
        if (element === "game") {
            return action(gameId);
        }
        if (element === "list") {
            return action()
        }
    }

    const stopDelete = () => {
        dispatchGamesList({type: "HIDE_DELETE_QUESTION"})
    }

    if( (element === "game" && showQuestion && gameToDelete === gameId) || element === "list" && showQuestion) {
        return (
            <div className={`delete-question ${element}`}>
                <h1 className="heading">{title}</h1>
                <button className="button" onClick={deleteItem}>Ok</button>
                <button className="button" onClick={stopDelete}>Cancel</button>
            </div>
        )
    }
    return null;
};

export default DeleteQuestion;