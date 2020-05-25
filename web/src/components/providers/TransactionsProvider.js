import React, {createContext, useReducer, useMemo} from "react";

import {transactionsReducer} from "../../utils/reducers";

export const TransactionsContext = createContext(null);

const TransactionsProvider =({children, pageProps}) => {
    console.log("EXCHANGE A GAME", pageProps);
    const game = pageProps.query;
    const name = pageProps.query.name;
    const cover = pageProps.query.cover;

    const initialValues = {
        name,
        cover,
        gameFromListToExchange: game,
        gameToExchange: [],
        gameToFind: [],
        showGameExchangeWindow: false,
        exchangeGamesSearch: [],
        searchGameToExchangeInputValue: ""
    };

    const [exploreGamesState, dispatchTransactions] = useReducer(transactionsReducer, initialValues);

    const store = useMemo(() => {
        return exploreGamesState
    }, [exploreGamesState]);

    return <TransactionsContext.Provider value={{transactions: store, dispatchTransactions}}>{children}</TransactionsContext.Provider>
}

export default TransactionsProvider;