import React, {createContext, useReducer, useMemo} from "react";

import {gamesListReducer} from "../../utils/reducers";

export const GamesListContext = createContext(null);

const GamesListProvider =({children, pageProps}) => {
    const games = pageProps.gamesList;
    const listExists = pageProps.listExists;
    const login = pageProps.login;
    const listName = pageProps.gamesListName;

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
        showQuestion: false,
        gameToDelete: null,
        elementToDelete: null
    };

    const [GamesListState, dispatchGamesList] = useReducer(gamesListReducer, initialValues);

    const store = useMemo(() => {
        return GamesListState
    }, [GamesListState]);

    return <GamesListContext.Provider value={{gamesList: store, dispatchGamesList}}>{children}</GamesListContext.Provider>
}

export default GamesListProvider;