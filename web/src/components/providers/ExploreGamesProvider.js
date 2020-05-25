import React, {createContext, useReducer, useMemo} from "react";

import {exploreGamesReducer} from "../../utils/reducers";

export const ExploreGamesContext = createContext(null);

const ExploreGamesProvider =({children, pageProps}) => {
    const games = pageProps.games;
    const page = pageProps.page;
    const platform = pageProps.platform;

    const initialValues = {
        games,
        page,
        platform
    };

    const [exploreGamesState, dispatchExploreGames] = useReducer(exploreGamesReducer, initialValues);

    const store = useMemo(() => {
        return exploreGamesState
    }, [exploreGamesState]);

    return <ExploreGamesContext.Provider value={{exploreGames: store, dispatchExploreGames}}>{children}</ExploreGamesContext.Provider>
}

export default ExploreGamesProvider;