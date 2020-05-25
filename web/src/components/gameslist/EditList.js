import React, {useContext} from "react";

import {GamesListContext} from "../providers/GamesListProvider";


const List = () => {
    const {gamesList, dispatchGamesList} = useContext(GamesListContext);
    const {editList} = gamesList;

    const askForListDelete = () => {
        dispatchGamesList({type: "SHOW_DELETE_LIST_QUESTION", payload: true})
        dispatchGamesList({type: "SET_ELEMENT_TO_DELETE", payload: "list"})
        dispatchGamesList({type: "EDIT_NAME", payload: false});
    }

    const editListName = () => {
        dispatchGamesList({type: "EDIT_NAME", payload: true});
        dispatchGamesList({type: "SHOW_CREATE_LIST_INPUT"});
    }

    if (editList) {
        return (
            <ul className="list">
                <li onClick={askForListDelete}>Delete</li>
                <li onClick={editListName}>Change Name</li>
            </ul>
        )
    }
    return null;
}

const EditList = () => {
    const {gamesList, dispatchGamesList} = useContext(GamesListContext);
    const {editList} = gamesList;
    const {editListMenuActive} = gamesList;
  
    const toggleEditMenu = () => {
        if (!editList) {
            return dispatchGamesList({type: "SHOW_EDIT_LIST"})
        }
        return dispatchGamesList({type: "HIDE_EDIT_LIST"});
    };


    if(editListMenuActive) {
        return (
            <div className="edit-list">
                <span
                    className="span"
                    onClick={toggleEditMenu}>Edit List</span>
                <List />
            </div>
        )
    }
    return null;
};

export default EditList;
