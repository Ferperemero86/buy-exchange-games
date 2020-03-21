import React, { useContext, useEffect } from "react";
import { StoreContext } from "../../utils/store";

import axiosModule from "../../utils/APIcall";

import DeleteQuestion from "../../components/messages/DeleteQuestion";
import SuccessMessage from "../../components/messages/Success";

import { useRouter } from 'next/router';


const ListInput = ({ listURL, title }) => {
    const { createListInputValue, setCreateListInputValue } = useContext(StoreContext);
    const { setEditListMenuActive } = useContext(StoreContext);
    const { setEditName } = useContext(StoreContext);
    const { setListName } = useContext(StoreContext);
    const { setListCreated } = useContext(StoreContext);
    const { setMessageSuccess } = useContext(StoreContext);

    const updateInputValue = (e) => {
        setCreateListInputValue(e.target.value)
    }

    const sendInputData = (e) => {
        e.preventDefault();

        const inputValue = (createListInputValue);

        axiosModule.getPostCall(`/api/${listURL}`, "POST", inputValue)
            .then(response => {
                const listCreated = response.data.listCreated;
                const listNameUpdated = response.data.listNameUpdated;
                const name = response.data.listName;

                if (listCreated) {
                    setListCreated(true);
                    setEditListMenuActive(false);
                    setListName(name);
                } else {
                    setListName(false);
                }

                if (listNameUpdated) {
                    setListName(listNameUpdated);
                    //setMessageSuccess("List Name updated");
                    setEditListMenuActive(false);
                    setEditName(false);

                    const timer = setTimeout(() => {
                        setMessageSuccess(false);
                    }, 3000);
                    return () => clearTimeout(timer);
                }
            })
            .catch(err => {
                console.error(err);
            });
    };

    return (
        <form className="create-list-form">
            <label className="label">{title}</label>
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
    const { setAskDelete } = useContext(StoreContext);
    const { setEditName } = useContext(StoreContext);

    const toggleEditMenu = () => {
        if (!editListMenuActive) {
            return setEditListMenuActive(true)
        }
        setEditListMenuActive(false);
    };

    const askForListDelete = () => {
        setAskDelete(true);
    }

    const editListName = () => {
        setEditName(true);

    }

    const List = () => {
        return (
            <ul className="list">
                <li onClick={askForListDelete}>Delete</li>
                <li onClick={editListName}>Change Name</li>
            </ul>
        )
    }

    return (
        <div className="edit-list">
            <span
                className="span"
                onClick={toggleEditMenu}>Edit List</span>
            {editListMenuActive === true && <List />}
        </div>
    )
}


const Games = () => {
    const { gamesList } = useContext(StoreContext);
    let gameId = 0;

    return (
        <div className="games-list">
            {
                gamesList.map(game => {
                    const gameCoverString = game.cover;
                    const coverURL = gameCoverString.replace("t_thumb", "t_cover_big");
                    gameId++;
                    const id = gameId + 1;
                    return (
                        <div className="game" key={id}>
                            <p className="name">{game.name}</p>
                            <img src={`${coverURL}`} className="cover" />
                        </div>
                    )
                })
            }
        </div>
    )

};

const UserList = () => {
    const { listCreated } = useContext(StoreContext);
    const { editName } = useContext(StoreContext);
    const { gamesList, setGamesList } = useContext(StoreContext);
    const { askDelete, setAskDelete } = useContext(StoreContext);
    const { setEditListMenuActive } = useContext(StoreContext);
    const { setListCreated } = useContext(StoreContext);
    const { messageSuccess, setMessageSuccess } = useContext(StoreContext);
    const { listName, setListName } = useContext(StoreContext);
    const { userLogged, setUserLogged } = useContext(StoreContext);
    const { createListInputValue, setCreateListInputValue } = useContext(StoreContext);
    const router = useRouter();

    useEffect(() => {
        axiosModule.getPostCall("/api/getlist", "GET", "")
            .then(response => {
                const gamesListResult = response.data.gamesList;
                const listName = response.data.listName;

                if (response.data.listCreated) {
                    setListCreated(true);
                    setListName(listName);
                } else {
                    setListCreated(false);
                }

                if (gamesListResult) {
                    setGamesList(gamesListResult);
                }

            })
            .catch(err => {
                if (!userLogged) {
                    router.push({ pathname: `/account/login` });
                }
            });
    }, [gamesList.length]);

    const deleteList = () => {
        axiosModule.getPostCall("/api/deletelist", "POST", "")
            .then(response => {
                if (response.data.listDeleted) {
                    setListCreated(false);
                    setGamesList([]);
                    setEditListMenuActive(false);
                    setMessageSuccess("List Deleted!")
                    setAskDelete(false);
                    setListName(false);
                    setCreateListInputValue("");

                    const timer = setTimeout(() => {
                        setMessageSuccess(false);
                    }, 3000);
                    return () => clearTimeout(timer);
                }
            })
            .catch(err => {
                console.error(err);
            });
    }

    return (
        <div className="user-list">
            <DeleteQuestion
                showQuestion={askDelete}
                action={deleteList} />
            <SuccessMessage
                message={messageSuccess}
                elementClass="games-list-success" />
            {!listCreated && <ListInput
                listURL="createlist"
                title="Create List" />
            }
            {listCreated && <EditList />}
            {editName && <ListInput
                listURL="editlistname"
                title="Edit Name" />
            }
            <h1 className="heading">{listName}</h1>
            {listCreated && <Games />}
        </div>
    )
}

export default UserList;