import React from "react";

const DeleteQuestion = ({action, element, gameId, cancelDelete}) => {
    let title;

    if (element === "list") {
        title = "Delete List?";
    }

    if (element === "game") {
        title = "Delete Game?";
    }

    if (element === "account") {
        title = "Delete Account?";
    }

    const deleteItem = () => {
        if (element === "game") {
            return action(gameId);
        }

        if (element === "list") {
            return action();
        }

        if (element === "account") {
            return action();
        }
    }

    return (
        <div className={`delete-question ${element}`}>
            <h1 className="heading">{title}</h1>
            <button className="button" onClick={deleteItem}>Ok</button>
            <button className="button" onClick={cancelDelete}>Cancel</button>
        </div>
    )
};

export default DeleteQuestion;