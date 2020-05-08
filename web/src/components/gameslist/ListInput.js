import React, {useContext} from "react";

import axios from "axios";

import {StoreContext} from "../../utils/store";

const ListInput = () => {
    const {createListInputValue, setCreateListInputValue} = useContext(StoreContext);
    const {createListInput, setCreateListInput} = useContext(StoreContext);
    const {setEditListMenuActive} = useContext(StoreContext);
    const {editName} = useContext(StoreContext);
    const {setListName} = useContext(StoreContext);
    const {setEditList} = useContext(StoreContext);
    const {setListCreated} = useContext(StoreContext);
    const {setMessage} = useContext(StoreContext);
    const {userId} = useContext(StoreContext);
    const URL = editName ? "editlistname" : "createlist";
    const label = URL === "editlistname" ? "Edit Name" : "New List";


    const updateInputValue = (e) => {
        setCreateListInputValue(e.target.value)
    }

    const sendInputData = (e) => {
        e.preventDefault();
        axios({
            url: `/api/${URL}`,
            method: "POST",
            data: {listName: createListInputValue, userId}
        })
            .then(result => {
                const success = result.data;

                if (success.listCreated) {
                    setCreateListInput(false);
                    setEditListMenuActive(true);
                    setEditList(false);
                    setListCreated(true);
                    setListName(success.listName)
                }

                if (success.listNameUpdated) {
                    setListName(success.listNameUpdated);
                    setCreateListInput(false);
                    setEditList(false);
                    setCreateListInputValue("");
                }
            })
            .catch(err => {
                const error = err.response.data;
                setMessage(error);
            });
    };

    const cancelEditName = () => {
        setCreateListInput(false);
    };

    if (createListInput) {
        return (
            <div className="create-list">
                <form className="create-list-form">
                    <label className="label">{label}</label>
                    <input
                        type="text"
                        onChange={updateInputValue}
                        value={createListInputValue}
                        className="input" />
                    <button
                        onClick={sendInputData}
                        className="button">Send</button>
                        {URL === "editlistname" && <button 
                                                        onClick={cancelEditName}
                                                        className="button">Cancel</button>}
                </form>
            </div>
        )  
    }
    return null;
};

export default ListInput;