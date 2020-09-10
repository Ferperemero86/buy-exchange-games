import React, {createContext, useReducer, useMemo} from "react";

import {sellGameReducer} from "../../utils/reducers";

export const SellGameContext = createContext(null);

const SellGameProvider =({children, pageProps}) => {
    const title = pageProps.query ? pageProps.query.name : "";
    const cover = pageProps.query && pageProps.query.cover ? pageProps.query.cover.url : "";
    const gameId = pageProps.query ? pageProps.query.id : null;
    const status = pageProps.query ? pageProps.query.status : "";
    
    const initialValues = {
        title,
        cover,
        gameId,
        status,
        gameCondition: "Grade A",
        gamePrice: "",
        gameDescription: "",
        gameCurrency: "£",
        messages: []
    };

    const [sellGameState, dispatchSellGame] = useReducer(sellGameReducer, initialValues);

    const store = useMemo(() => {
        return sellGameState
    }, [sellGameState]);

    return <SellGameContext.Provider value={{sellGame: store, dispatchSellGame}}>{children}</SellGameContext.Provider>
}

export default SellGameProvider;