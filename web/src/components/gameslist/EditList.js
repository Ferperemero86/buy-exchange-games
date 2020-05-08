import React, {useContext} from "react";

import {StoreContext} from "../../utils/store";


const EditList = () => {
    const {editListMenuActive} = useContext(StoreContext);
    const {setAskDeleteList} = useContext(StoreContext);
    const {setEditName} = useContext(StoreContext);
    const {editList, setEditList} = useContext(StoreContext);
    const {setCreateListInput} = useContext(StoreContext);

    const toggleEditMenu = () => {
        if (!editList) {
            return setEditList(true)
        }
        setEditList(false);
    };

    const askForListDelete = () => {
        setAskDeleteList(true);
    }

    const editListName = () => {
        setEditName(true);
        setCreateListInput(true);
    }

    const List = () => {
        return (
            <ul className="list">
                <li onClick={askForListDelete}>Delete</li>
                <li onClick={editListName}>Change Name</li>
            </ul>
        )
    }

    if(editListMenuActive) {
        return (
            <div className="edit-list">
                <span
                    className="span"
                    onClick={toggleEditMenu}>Edit List</span>
                {editList === true && <List />}
            </div>
        )
    }
    return null;
};

export default EditList;
