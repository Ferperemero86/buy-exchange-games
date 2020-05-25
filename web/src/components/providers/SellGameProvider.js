import React, {createContext, useReducer, useMemo} from "react";

import {sellGameReducer} from "../../utils/reducers";

export const SellGameContext = createContext(null);

const SellGameProvider =({children, pageProps}) => {
    console.log("EXCHANGE A GAME", pageProps);
    
    const initialValues = {
        title: pageProps.query.name,
        cover: pageProps.query.cover,
        gameId: pageProps.query.id,
        status: pageProps.query.status,
        gameCondition: "Grade A",
        gamePrice: "",
        gameDescription: "",
        gameCurrency: "£"
    };

    const [sellGameState, dispatchSellGame] = useReducer(sellGameReducer, initialValues);

    const store = useMemo(() => {
        return sellGameState
    }, [sellGameState]);

    return <SellGameContext.Provider value={{sellGame: store, dispatchSellGame}}>{children}</SellGameContext.Provider>
}

export default SellGameProvider;