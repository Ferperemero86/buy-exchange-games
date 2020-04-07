import React, { useContext, useEffect } from "react";
import { StoreContext } from "../../utils/store";

const DeleteQuestion = ({showQuestion, action}) => {
    const {deleteElement, setDeleteElement} = useContext(StoreContext);
    const {askDelete, setAskDelete} = useContext(StoreContext);

    const deleteItem = () => {
        action();
    }

    const cancelDelete = () => {
        setAskDelete(false);
    }

    if(showQuestion) {
        return (
            <div className="delete-question">
                <h1 className="heading">Are you sure?</h1>
                <button className="button" onClick={deleteItem}>Ok</button>
                <button className="button" onClick={cancelDelete}>Cancel</button>
            </div>
        )
    }
    return null;
};

export default DeleteQuestion;