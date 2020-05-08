import React, {useContext, useEffect} from "react";

import {StoreContext} from "../../utils/store";

import fetch from "node-fetch";
import axios from "axios";

import DeleteQuestion from "../../components/messages/DeleteQuestion";
import Messages from "../../components/messages/Messages";
import GamesSection from "../../components/gameslist/GamesSection";
import ListInput from "../../components/gameslist/GamesSection";
import EditList from "../../components/gameslist/GamesSection";


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
    const {askDeleteList, setAskDeleteList} = useContext(StoreContext);
    const {setEditListMenuActive} = useContext(StoreContext);
    const {setCreateListInputValue} = useContext(StoreContext);
    const {setEditList} = useContext(StoreContext);
    const {message, setMessage} = useContext(StoreContext);
    const {listName, setListName} = useContext(StoreContext);
    const {setCreateListInput} = useContext(StoreContext);
    const {setEditName} = useContext(StoreContext);
    const {setListDeleted} = useContext(StoreContext);
    const {fetchGamesListFromServer} = useContext(StoreContext);
    const {gameStatus} = useContext(StoreContext);
    const {gameToExchange, setGameToExchange} = useContext(StoreContext);
    const {setGameFromListToExchange} = useContext(StoreContext);

    const deleteList = () => {
        axios({ 
            url: "/api/deletelist", 
            method: "POST" 
        })
            .then(() => {
                setListDeleted(true);
                setEditListMenuActive(false);
                setAskDeleteList(false);
                setCreateListInput(true);
                setGamesList([]);
                setCreateListInputValue("");
                setListName("");
                setEditName(false);
            })
            .catch(err => {
                const error = err.response.data;

                setMessage(error);
                setEditListMenuActive(false);
                setAskDeleteList(false);
            });
    };
   
    useEffect(() => {

        if (Array.isArray(gameToExchange) && gameToExchange.length > 0) {
            setGameToExchange([]);
        }

        setGameFromListToExchange(false);

        //If not logged redirects to login page
        if (data.login === false) {
            setMessage(data);
        }
        
        if (data.listExists === false) {
            console.log("NO LISTTTT");
            setGamesList([]);
            setListName("");
            setCreateListInput(true);
            setEditListMenuActive(false);
        }

        if (data.internalError) {
            setMessage(data);
        }
        
        //Gets data from server
        if (data.gamesList && fetchGamesListFromServer) {
            if (Array.isArray(data.gamesList)) {
                setGamesList(data.gamesList);
            } else {
                setMessage({couldNotGetList: true});
            }
    
            setCreateListInput(false);
            setEditListMenuActive(true);
            setEditList(false);
            setUserId(data.id);
            setListName(data.list.result.list_name);
        } 

        //Stops getting data from server.
        //Fetches from client with axios.
        //Updates user id hook if different from coming from server.
        if ( (!fetchGamesListFromServer || (data.id !== userId && userId !== null) ) && !gameStatus ) {
            let id;

            if (data.id !== userId) {
                id = data.id;
                setUserId(data.id);
            } else {
                id = userId;
            }
           
            setCreateListInput(false);
            setEditListMenuActive(true);
           
            //If list does not exist or user id is different from the last session
            //Fecth data from the client to update the visual content
            if (!data.listExists || data.id !== userId) {
                
                //Fetches games and listName when did not get them previously from server.
                axios("/api/getlist", { method: 'POST', data: {userId: id, status: null} })
                    .then(result => {          
                        console.log("fetching elements from client", result);              
                        const gamesList = result.data.gamesList;
                        const listName = result.data.list.result.list_name;
                    
                        if (Array.isArray(gamesList)) {
                            setGamesList(gamesList);
                        } else {
                            setMessage({couldNotGetList: true});
                        }
                    
                        setCreateListInput(false);
                        setEditListMenuActive(true);
                        setListName(listName);
                    }) 
                    .catch(()=> {
                        setCreateListInput(true);
                        setEditListMenuActive(false);
                    })
    
            }
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
                showQuestion={askDeleteList} 
                action={deleteList} 
                element="list"
                cancelDelete={setAskDeleteList}/>
            <ListInput />
            <h3 className="gameslist-heading">{listName}</h3>
            <EditList />
            <GamesSection />
        </div>
    )
}

export default UserList;