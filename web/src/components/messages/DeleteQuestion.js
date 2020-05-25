import React, {useContext} from "react";
import {GamesListContext} from "../providers/GamesListProvider";

const DeleteQuestion = ({action, element, gameId}) => {
    const {dispatchGamesList} = useContext(GamesListContext);
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
        if (element === "list") {
            dispatchGamesList({type: "SHOW_DELETE_LIST_QUESTION", payload: false})
        }
        if (element === "game") {
            dispatchGamesList({type: "SHOW_DELETE_GAME_QUESTION", payload: false})
        }
    }

    return (
        <div className={`delete-question ${element}`}>
            <h1 className="heading">{title}</h1>
            <button className="button" onClick={deleteItem}>Ok</button>
            <button className="button" onClick={stopDelete}>Cancel</button>
        </div>
    )
};

export default DeleteQuestion;