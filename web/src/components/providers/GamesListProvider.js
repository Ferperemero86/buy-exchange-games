import React, {createContext, useReducer, useMemo} from "react";

import {gamesListReducer} from "../../utils/reducers";
import {sendDataFromClient} from "../../utils/API";

export const GamesListContext = createContext(null);

const GamesListProvider =({children, pageProps}) => {
    const games = pageProps.gamesInList;
    const listName = pageProps.gamesListName;
    const userId = pageProps.userId ? pageProps.userId : null;
    const {login, listExists, userLogged} = pageProps;
    
    const initialValues = {
        games,
        listExists,
        login,
        listName,
        editList: false,
        askDeleteList: false,
        editListMenuActive: false,
        gameFromListToExchange: [],
        gameToExchange: [],
        showGameMenu: false,
        updateGameStatus: false,
        createListInput: false,
        editListName: false,
        createListInputValue: "",
        showDeleteListQuestion: false,
        showDeleteGameQuestion: false,
        gameToDelete: null,
        elementToDelete: null,
        userId,
        userLogged 
    };

    const [GamesListState, dispatchGamesList] = useReducer(gamesListReducer, initialValues);

    const closeDeleteQuestion = () => {
        dispatchGamesList({type: "SHOW_DELETE_LIST_QUESTION", payload: false});
    };

    const deleteList = async () => {

        dispatchGamesList({type: "SET_ELEMENT_TO_DELETE", payload: "list"});

        await sendDataFromClient("/api/gameslist/deletedlist")
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

    const store = useMemo(() => {
        return GamesListState
    }, [GamesListState]);

    return <GamesListContext.Provider value={{
        gamesList: store, 
        dispatchGamesList,
        closeDeleteQuestion,
        deleteList
    }}>{children}</GamesListContext.Provider>
}

export default GamesListProvider;