import React, {createContext, useReducer, useMemo} from "react";

import {transactionsReducer} from "../../utils/reducers";

export const TransactionsContext = createContext(null);

const TransactionsProvider =({children, pageProps}) => {
    const name = pageProps.query ? pageProps.query.name : "";
    const cover = pageProps.query ? pageProps.query.cover : "";
    const platform = pageProps.platform;
    
    const initialValues = {
        name,
        cover,
        gameFromListToExchange: pageProps.query,
        gameToExchange: [],
        gameToFind: [],
        showGameExchangeWindow: false,
        exchangeGamesSearch: [],
        searchGameToExchangeInputValue: "",
        platformSelected: 48,
        platform
    };

    const [exploreGamesState, dispatchTransactions] = useReducer(transactionsReducer, initialValues);

    const store = useMemo(() => {
        return exploreGamesState
    }, [exploreGamesState]);

    return <TransactionsContext.Provider value={{transactions: store, dispatchTransactions}}>{children}</TransactionsContext.Provider>
}

export default TransactionsProvider;