import React, { useContext, useEffect, useRef } from "react";
import { StoreContext } from "../../utils/store";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';

import axiosModule from "../../utils/APIcall";

const CreateListInput = () => {
    const { createListInputValue, setCreateListInputValue } = useContext(StoreContext);
    const { listCreated, setListCreated } = useContext(StoreContext);

    const updateInputValue = (e) => {
        setCreateListInputValue(e.target.value)
    }

    const sendInputData = (e) => {
        e.preventDefault();

        const inputValue = (createListInputValue);

        axiosModule.getPostCall("/api/createlist", "POST", inputValue)
            .then(response => {
                console.log("gameslist response", response);
                if (response.data.listCreated) {
                    setListCreated(true);
                }
            })
            .catch(err => {
                console.error(err);
            });
    };

    return (
        <form className="create-list-form">
            <label className="label">Create List</label>
            <input
                type="text"
                onChange={updateInputValue}
                value={createListInputValue}
                className="input" />
            <button
                onClick={sendInputData}
                className="button">Send</button>
        </form>
    )
};

const EditList = () => {
    const { editListMenuActive, setEditListMenuActive } = useContext(StoreContext);

    const EditListMenu = () => {
        return (
            <ul className="list">
                <li onClick={deleteList}>Delete</li>
                <li>Change Name</li>
            </ul>
        )
    }

    const toggleEditMenu = () => {
        if (!editListMenuActive) {
            return setEditListMenuActive(true)
        }
        setEditListMenuActive(false);
    };

    const deleteList = () => {

        axiosModule.getPostCall("/api/deletelist", "POST", "")
            .then(response => {
                console.log(response);
            })
            .catch(err => {
                console.error(err);
            });
    }

    return (
        <div className="edit-list">
            <span
                className="span"
                onClick={toggleEditMenu}>Edit List</span>
            {editListMenuActive === true && <EditListMenu />}
        </div>
    )
}


const Games = () => {
    const { gamesList, setGamesList } = useContext(StoreContext);
    const { listCreated, setListCreated } = useContext(StoreContext);

    useEffect(() => {
        axiosModule.getPostCall("/api/getlist", "GET", "")
            .then(response => {
                const gamesListResult = response.data.gamesList;

                if (response.data.listExists) {
                    setListCreated(true);
                } else {
                    setListCreated(false);
                }

                setGamesList(gamesListResult);

            })
            .catch(err => {
                console.error(err);
            });
    }, [gamesList.length]);

    return (
        <div className="games-list">
            <h1 className="heading">Games List</h1>
            {

                gamesList.map(game => {
                    const gameCoverString = game.cover;
                    const coverURL = gameCoverString.replace("t_thumb", "t_cover_big");

                    return (
                        <div className="game" key={game.name}>
                            <p className="name">{game.name}</p>
                            <img src={`${coverURL}`} className="cover" />
                        </div>
                    )
                })
            }
        </div>
    )
};

const UserLists = () => {
    const { listCreated } = useContext(StoreContext);
    return (
        <div>
            {!listCreated && <CreateListInput />}
            {listCreated && <EditList />}
            <Games />
        </div>
    )
}

export default UserLists;