import React from "react";

const DeleteQuestion = ({showQuestion, action, cancelDelete, element}) => {
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

    if(showQuestion) {
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