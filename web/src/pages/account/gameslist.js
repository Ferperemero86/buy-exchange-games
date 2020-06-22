import React, {useContext, useEffect} from "react";

import axios from "axios";
import {useRouter} from "next/router";

import {GamesListContext} from "../../components/providers/GamesListProvider";
import {sendLocalData} from "../../utils/API";

import DeleteListQuestion from "../../components/messages/DeleteListQuestion";
import GamesSection from "../../components/games/GamesSection";
import ListInput from "../../components/gameslist/ListInput";
import EditList from "../../components/gameslist/EditList";


export async function getServerSideProps(ctx) {
    let userLogged = ctx.req.user ? ctx.req.user.id : null;
    const userId = ctx.query.id ? ctx.query.id : null;
    const URLBase = ctx.req.headers.host;
    const Url = new URL("/api/gameslist", `http://${URLBase}`).href;
    const page = "gameslist";
    let data;

    if (userId) { userLogged = userId }
    
    if (userLogged) {
        const content = await sendLocalData(Url, {userId: userLogged});
       
        if (content) { data = content }
       
        return { 
            props: { gamesInList: data.gamesList, 
                     gamesListName: data.gamesListName,
                     listExists: data.listExists,
                     page, 
                     login: true, 
                     userId,
                     userLogged
                   } 
        };
    }

    return { props: {login: false} };
}

const GamesList = ({gamesInList, userId}) => {
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
                dispatchGamesList({type: "SHOW_DELETE_LIST_QUESTION", payload: false});
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
            <DeleteListQuestion 
                action={deleteList} 
                element={elementToDelete} />
            <ListInput />
            <h3 className="gameslist-heading">{listName}</h3>
            <EditList />
            <GamesSection 
                gamesInList={gamesInList}
                userId={userId} />
        </div>
    )

}

export default GamesList;

