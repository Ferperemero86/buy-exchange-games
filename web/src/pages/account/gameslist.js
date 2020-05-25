import React, {useContext, useEffect} from "react";

import fetch from "node-fetch";
import axios from "axios";
import {useRouter} from "next/router";

import {GamesListContext} from "../../components/providers/GamesListProvider";

import DeleteQuestion from "../../components/messages/DeleteQuestion";
import GamesSection from "../../components/games/GamesSection";
import ListInput from "../../components/gameslist/ListInput";
import EditList from "../../components/gameslist/EditList";


export async function getServerSideProps(ctx) {
    const userId = await ctx.req.user ? ctx.req.user.id : null;
    const URLBase = await ctx.req.headers.host;
    const Url = new URL("/api/gameslist", `http://${URLBase}`).href;
    const page = "gameslist";
    let data;
    
    if (userId) {
        const result = await fetch(Url, { method: 'POST', 
                                          body: JSON.stringify({userId}), 
                                          headers: {'Content-Type': 'application/json'} 
                                    });
        const content = await result.json();
       
        if (content) { data = content }
       
        return { props: {gamesList: data.gamesList, 
                         gamesListName: data.gamesListName,
                         listExists: data.listExists,
                         page, 
                         login: true, 
                         userId} };
    }

    return { props: {login: false, userId} };
}

const GamesList = () => {
    const {gamesList, dispatchGamesList} = useContext(GamesListContext);
    const {login, listExists, editListName, listName, elementToDelete} = gamesList;
    const router = useRouter();

    const deleteList = async () => {

        dispatchGamesList({type: "SET_ELEMENT_TO_DELETE", payload: "list"});

        await axios({ 
            url: "/api/gameslist/deletedlist", 
            method: "POST" 
        })
            .then(result=> {
                const games = result.data.gamesList;

                dispatchGamesList({type: "UPDATE_GAMES", payload: games});
                dispatchGamesList({type: "UPDATE_LIST_EXISTS", payload: false});
                dispatchGamesList({type: "HIDE_DELETE_QUESTION"});
                dispatchGamesList({type: "HIDE_EDIT_LIST"});
            })
            .catch(()=> {
                dispatchGamesList({type: "HIDE_DELETE_QUESTION"});
                dispatchGamesList({type: "HIDE_EDIT_LIST"});
            });
    };

    

    useEffect(() => {

        //If user is not logged send to Login page
        if (login === false) {
            router.push("/account/login")
        } else {
            if (listExists && !editListName) {
                dispatchGamesList({type: "HIDE_CREATE_LIST_INPUT"});
            }
            if (listExists && editListName) {
                dispatchGamesList({type: "SHOW_CREATE_LIST_INPUT"});
            }
            if (listExists) {
                dispatchGamesList({type: "SHOW_EDIT_LIST_ACTIVE_MENU"});
            }
            if (!listExists) {
                dispatchGamesList({type: "HIDE_EDIT_LIST_ACTIVE_MENU"});
                dispatchGamesList({type: "SHOW_CREATE_LIST_INPUT"});
                dispatchGamesList({type: "UPDATE_LIST_NAME", payload: ""});
            }
        }

    }, [listExists]);
   

    return (
        <div className="user-list">
            <DeleteQuestion 
                action={deleteList} 
                element={elementToDelete} />
            <ListInput />
            <h3 className="gameslist-heading">{listName}</h3>
            <EditList />
            <GamesSection />
        </div>
    )

}

export default GamesList;

