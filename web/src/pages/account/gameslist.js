import React, {useContext, useEffect} from "react";
import {StoreContext} from "../../utils/store";

import fetch from "node-fetch";
import axios from "axios";

import DeleteQuestion from "../../components/messages/DeleteQuestion";
import Messages from "../../components/messages/Messages";

const ListInput = () => {
    const {createListInputValue, setCreateListInputValue} = useContext(StoreContext);
    const {createListInput, setCreateListInput} = useContext(StoreContext);
    const {setEditListMenuActive} = useContext(StoreContext);
    //const {setEditName} = useContext(StoreContext);
    //const {setListName} = useContext(StoreContext);
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
                const success = result.data;

                setMessage(success);

                if (success.listCreated) {
                    setCreateListInput(false);
                    setEditListMenuActive(true);
                    setEditList(false);
                    setListCreated(true);
                }
            })
            .catch(err => {
                const error = err.response.data;

                setMessage(error);
            });
    };

    if (createListInput) {
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
    }
    return null;
};

const EditList = () => {
    const {editListMenuActive} = useContext(StoreContext);
    const {setAskDelete} = useContext(StoreContext);
    const {setEditName} = useContext(StoreContext);
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
    const {gamesList} = useContext(StoreContext);
    const {setFetchGamesListFromServer} = useContext(StoreContext);
    let gameId = 0;
    let platform = null;

    useEffect(() => {
        if (gamesList.length > 0) {
            setFetchGamesListFromServer(false);
        }
    })

    if (gamesList) {

        return (
            <div className="games-list">
                {
                    gamesList.map(game => {
                        const gameCoverString = game.cover;
                        const coverURL = gameCoverString.replace("t_thumb", "t_cover_big");
                        platform  !== game.platform ? platform : null;
                        gameId++;
                        const id = gameId + 1;
                        return (
                            <div className="game" key={id}>
                                <h3>{platform}</h3>
                                <p className="name">{game.name}</p>
                                <img src={`${coverURL}`} className="cover" />
                            </div>
                        )
                    })
                }
            </div>
        )
    } else {
        return null;
    }

};

export async function getServerSideProps(ctx) {
    const userId = await ctx.req.user ? ctx.req.user.id : null;
    const URLBase = await ctx.req.headers.host;
    const Url = new URL("/api/getlist", `http://${URLBase}`).href;

    const result = await fetch(Url, { method: 'POST', 
                                      body: JSON.stringify({userId}), 
                                      headers: {'Content-Type': 'application/json'} 
                                    });
    const content = await result.json();

    let data;

    if (await userId) {
        data = content;
    } else {
        data = {login: false};
    }
    
    return { props: {data} };
}

const UserList = ({data}) => {
    const {userId, setUserId} = useContext(StoreContext);
    const {currentPage, setCurrentPage} = useContext(StoreContext);
    const {gamesList, setGamesList} = useContext(StoreContext);
    const {askDelete, setAskDelete} = useContext(StoreContext);
    const {setEditListMenuActive} = useContext(StoreContext);
    //const {setEditList} = useContext(StoreContext);
    //const {setListCreated} = useContext(StoreContext);
    const {message, setMessage} = useContext(StoreContext);
    const {listName} = useContext(StoreContext);
    const {setCreateListInput} = useContext(StoreContext);
    //const {listCreated} = useContext(StoreContext);
    const {setListDeleted} = useContext(StoreContext);
    const {fetchGamesListFromServer} = useContext(StoreContext);


    const deleteList = () => {
        axios({ 
            url: "/api/deletelist", 
            method: "POST" 
        })
            .then(() => {
                setListDeleted(true);
                setEditListMenuActive(false);
                setAskDelete(false);
                setCreateListInput(true);
                setGamesList([]);
            })
            .catch(err => {
                const error = err.response.data;

                setMessage(error);
                setEditListMenuActive(false);
                setAskDelete(false);
            });
    };

    useEffect(() => {

        if (data.login === false) {
            setMessage(data);
        }

        if (data.listExists === false) {
            setCreateListInput(true);
            setEditListMenuActive(false);
        }
        
        if (data.gamesList && fetchGamesListFromServer) {
            setGamesList(data.gamesList);
            setCreateListInput(false);
            setEditListMenuActive(true);
            setUserId(data.id);
        } 

        if (!fetchGamesListFromServer) {
            setCreateListInput(false);
            setEditListMenuActive(true);
            
            axios("/api/getlist", { method: 'POST', data: {userId} })
                    .then(result => {
                        const gamesList = result.data.gamesList;

                        setGamesList(gamesList);
                        setCreateListInput(false);
                        setEditListMenuActive(true);
                    }) 
                    .catch(()=> {
                        setCreateListInput(true);
                        setEditListMenuActive(false);
                    })
    
        }
    }, [gamesList.length]);

    return (
        <div className="user-list">
            <Messages 
                page="gameslist" 
                message={message} 
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                clearMessage={setMessage}/>
            <DeleteQuestion 
                showQuestion={askDelete} 
                action={deleteList} />
            <ListInput />
            <h3 className="gameslist-heading">{listName}</h3>
            <EditList />
            <Games />
        </div>
    )
}

export default UserList;