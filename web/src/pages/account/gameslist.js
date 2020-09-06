import React, {useContext, useEffect} from "react";
import {useRouter} from "next/router";

import {GamesListContext} from "../../components/providers/GamesListProvider";
import {sendLocalData} from "../../utils/API";

import DeleteListQuestion from "../../components/messages/DeleteListQuestion";
import GamesSection from "../../components/games/GamesSection";
import ListInput from "../../components/gameslist/ListInput";
import EditList from "../../components/gameslist/EditList";
import Heading from "../../components/Heading";


export async function getServerSideProps(ctx) {
    let userLogged = ctx.req.user ? ctx.req.user.id : null;
    const sellGame = ctx.query.sellGame ? ctx.query.sellgame : null;
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
                     userLogged,
                     sellGame
                   } 
        };
    }

    return { props: {login: false} };
}

const GamesList = ({gamesInList, userId, sellGame}) => {
    const {gamesList, dispatchGamesList, closeDeleteQuestion, deleteList} = useContext(GamesListContext);
    const {login, listExists, editListName, listName, elementToDelete} = gamesList;
    const router = useRouter();
    
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
   
    if (sellGame && gamesInList.length < 1) {
        return <Heading 
                type="h1"
                className="sell-game-gameslist-empty-message"
                text="Please add games in the list first" />
    }

    return (
        <div className="user-list">
            <DeleteListQuestion 
                action={deleteList} 
                cancelDelete={closeDeleteQuestion}
                element={elementToDelete} />
            <ListInput />
            <Heading 
             className="gameslist-heading"
             type="h3"
             text={listName} />
            <EditList />
            <GamesSection 
                gamesInList={gamesInList}
                userId={userId} />
        </div>
    )

};

export default GamesList;

