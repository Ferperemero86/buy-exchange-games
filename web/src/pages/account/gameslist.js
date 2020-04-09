import React, {useContext, useEffect} from "react";
import {StoreContext} from "../../utils/store";

import axios from "axios";

import DeleteQuestion from "../../components/messages/DeleteQuestion";
import Messages from "../../components/messages/Messages";

const ListInput = () => {
    const {createListInputValue, setCreateListInputValue} = useContext(StoreContext);
    const {createListInput, setCreateListInput} = useContext(StoreContext);
    const {setEditListMenuActive} = useContext(StoreContext);
    const {setEditName} = useContext(StoreContext);
    const {setEditList} = useContext(StoreContext);
    const {setListCreated} = useContext(StoreContext);
    const {setMessage} = useContext(StoreContext);


    const updateInputValue = (e) => {
        setCreateListInputValue(e.target.value)
    }

    const sendInputData = (e) => {
        e.preventDefault();

        axios({
            url: `/api/createlist`,
            method: "POST",
            data: {listName: createListInputValue}
        })
            .then(result => {
                console.log(result);
                const success = result.data;
                const listCreated = result.data.listCreated;
                const listNameUpdated = result.data.listNameUpdated;
                const name = result.data.listName;
                
                if (listCreated) {
                    console.log("list created!");
                    setListCreated(true);
                    setEditListMenuActive(true);
                    //setListName(name);
                    setEditList(false);
                    setCreateListInput(false);
                    setMessage(success);
                } else {
                    setListName(false);
                }

                if (listNameUpdated) {
                    setListName(listNameUpdated);
                    setMessage("List Name updated");
                    timeOut(setMessageSuccess, false);
                    setEditListMenuActive(false);
                    setEditName(false);
                }
            })
            .catch(err => {
                console.log(err);
                setMessage(err);
            });
    };

    return (
        <div className="create-list">
            <form className="create-list-form">
                <label className="label">New List</label>
                <input
                    type="text"
                    onChange={updateInputValue}
                    value={createListInputValue}
                    className="input" />
                <button
                    onClick={sendInputData}
                    className="button">Send</button>
            </form>
        </div>
    )  
};

const EditList = () => {
    const { editListMenuActive, setEditListMenuActive } = useContext(StoreContext);
    const { setAskDelete } = useContext(StoreContext);
    const { setEditName } = useContext(StoreContext);
    const {editList, setEditList} = useContext(StoreContext);

    const toggleEditMenu = () => {
        if (!editList) {
            return setEditList(true)
        }
        setEditList(false);
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

    if(editListMenuActive) {
        return (
            <div className="edit-list">
                {console.log(editList)}
                <span
                    className="span"
                    onClick={toggleEditMenu}>Edit List</span>
                {editList === true && <List />}
            </div>
        )
    }
    return null;
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

//const UserList = () => {
//    const {currentPage, setCurrentPage} = useContext(StoreContext);
//    const {gamesList, setGamesList} = useContext(StoreContext);
//    const {askDelete, setAskDelete} = useContext(StoreContext);
//    const {setEditListMenuActive} = useContext(StoreContext);
//    const {setEditList} = useContext(StoreContext);
//    const {setListCreated} = useContext(StoreContext);
//    const {message, setMessage} = useContext(StoreContext);
//    const {setListName} = useContext(StoreContext);
//    const {setCreateListInput} = useContext(StoreContext);
//
//    useEffect(() => {
//
//        axios({
//            url: "/api/getlist", 
//            method: "GET"
//        })
//            .then(result => {
//                const gamesListResult = result.data.gamesList;
//                const listName = result.data.listName;
//                const listCreated = result.data.listCreated;
//                console.log(result);
//                if (listCreated) {
//                    setListCreated(true);
//                    setListName(listName);
//                    setCreateListInput(false);
//                    setEditListMenuActive(true);
//                    setEditList(false);
//                } else {
//                    setListCreated(false);
//                    setCreateListInput(true);
//                    setCreateListInputValue("");
//                }
//
//                if (gamesListResult) {
//                    setGamesList(gamesListResult);
//                    setCreateListInput(false);
//                }
//
//            }, [gamesList.length])
//            .catch(err => {
//                console.log(err.response.data);
//                if (err.response) {
//                    const error = err.response.data;
//    
//                    setMessage(error);
//                }
//            });
//    }, [gamesList.length]);
//
//    const deleteList = () => {
//        axios({ 
//            url: "/api/deletelist", 
//            method: "POST" 
//        })
//            .then(result => {
//                console.log(result);
//                if (result) {
//                    const success = result.data;
//
//                    if(success.listDeleted) {
//                        console.log("list deleted!");
//                        setListCreated(false);
//                        setGamesList([]);
//                        setEditListMenuActive(false);
//                        setEditList(false);
//                        setMessage(success);
//                        setAskDelete(false);
//                        setListName("");
//                        setCreateListInput(false);
//                    }
//                }
//            })
//            .catch(err => {
//                console.log(err);
//                setMessage(err);
//                setEditListMenuActive(false);
//                setAskDelete(false);
//            });
//    };
//
//    return (
//        <div className="user-list">
//            {console.log(message)}
//            <Messages 
//                page="gameslist" 
//                message={message} 
//                currentPage={currentPage}
//                setCurrentPage={setCurrentPage}
//                clearMessage={setMessage}/>
//            <DeleteQuestion 
//                showQuestion={askDelete} 
//                action={deleteList} />
//            <ListInput />
//            <EditList />
//            <Games />
//        </div>
//    )
//}

export async function getServerSideProps () {
    const games = await axios.get("/api/getlist");
    console.log("games", games);
    return { props: {games} };
};

const UserList = ({games}) => {
    console.log(games);
    return null;
};

export default UserList;