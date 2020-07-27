import React, {createContext, useReducer, useMemo} from "react";

import {gamesListReducer} from "../../utils/reducers";

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

    const store = useMemo(() => {
        return GamesListState
    }, [GamesListState]);

    return <GamesListContext.Provider value={{gamesList: store, dispatchGamesList}}>{children}</GamesListContext.Provider>
}

export default GamesListProvider;