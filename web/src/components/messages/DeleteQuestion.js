import React from "react";

import Heading from "../../components/Heading";
import Button from "../../components/forms/Button";

const DeleteQuestion = ({action, element, gameId, userId, cancelDelete}) => {
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
    if (element === "user") {
        title = "Delete User?"
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
        if (element === "user") {
            return action(userId);
        }
    }

    return (
        <div className={`delete-question ${element}`}>
            <Heading 
             className="heading"
             text={title} />
            <Button 
             className="button" 
             text="Ok"
             onClick={deleteItem} />
            <Button 
             className="button"
             text="Cancel" 
             onClick={cancelDelete} />
        </div>
    )
};

export default DeleteQuestion;