import React, {useContext} from "react";

import axios from "axios";

import {GamesListContext} from "../providers/GamesListProvider";
import {UserContext} from "../providers/UserProvider";

const ListInput = () => {
    const {gamesList, dispatchGamesList} = useContext(GamesListContext);
    const {createListInput, editName, createListInputValue} = gamesList;
    const {userId} = useContext(UserContext);
    const Url = editName ? "gameslist/name" : "gameslist/newlist";
    const label = Url === "gameslist/name" ? "Edit Name" : "New List";
   
    const updateInputValue = (e) => {
        dispatchGamesList({type: "UPDATE_CREATE_LIST_INPUT_VALUE", payload: e.currentTarget.value});
    }

    const sendInputData = async (e) => {
        e.preventDefault();
        
        await axios({
            url: `/api/${Url}`,
            method: "POST",
            data: {listName: createListInputValue, userId}
        })
            .then(result => {
                const success = result.data;
                if (success.listCreated) {
                    dispatchGamesList({type: "UPDATE_LIST_EXISTS", payload: true});
                    dispatchGamesList({type: "UPDATE_LIST_NAME", payload: success.gamesListName});
                }

                if (success.listNameUpdated) {
                    console.log("List created", result.data);
                    dispatchGamesList({type: "UPDATE_LIST_NAME", payload: success.listNameUpdated});
                    dispatchGamesList({type: "HIDE_EDIT_LIST"})
                    dispatchGamesList({type: "HIDE_CREATE_LIST_INPUT"});
                    dispatchGamesList({type: "UPDATE_CREATE_LIST_INPUT_VALUE"});
                }
            })
            .catch(() => {
            
            });
    };

    
    const cancelEditName = () => {
        dispatchGamesList({type: "HIDE_CREATE_LIST_INPUT"});
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
                        {Url === "gameslist/name" && <button 
                                                        onClick={cancelEditName}
                                                        className="button">Cancel</button>}
                </form>
            </div>
        )  
    }
    return null;
}

export default ListInput;