import React, {useContext} from "react";
import {StoreContext} from "../../utils/store";

const DeleteQuestion = ({showQuestion, action, cancelDelete, element, gameId}) => {
    const {gameID} = useContext(StoreContext);
    let title;

    if (element === "list") {
        title = "Delete List?";
    }

    if (element === "game") {
        title = "Delete Game?"
    }

    const deleteItem = () => {
        action();
    }

    const stopDelete = () => {
        cancelDelete(false);
    }

    if(showQuestion && gameID === gameId) {
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