import React, {createContext, useReducer, useMemo} from "react";
import {useRouter} from "next/router";

import {sendDataFromClient} from "../../utils/API";
import {mainSearchReducer} from "../../utils/reducers";

export const MainSearchContext = createContext();


const MainSearchProvider = ({children}) => {
    const router = useRouter();
    const initialValues = {
        textSearchInput: "",
        games: []
    }

    const [mainSearchState, dispatchMainSearch] = useReducer(mainSearchReducer, initialValues);

    const searchGames = async (e) => {
        const game = e.currentTarget.value;
        const result = await sendDataFromClient("/api/mainsearch", {game});
    
        dispatchMainSearch({type: "UPDATE_TEXT_SEARCH_INPUT", payload: game});
        dispatchMainSearch({type: "UPDATE_GAMES_SEARCH", payload: result.games});
    };

    const goToDetails = (e) => {
        e.preventDefault();
        const data = JSON.parse(e.currentTarget.getAttribute("data"));
        const {id, title, cover, summary} = data;
        
        dispatchMainSearch({type: "UPDATE_TEXT_SEARCH_INPUT", payload: ""});
        dispatchMainSearch({type: "UPDATE_GAMES_SEARCH", payload: []});
        router.push({
            pathname: "/explore/details",
            query: {id, title, cover, summary}
        })
        
    };

    const mainSearch = useMemo(() => {
        return mainSearchState
    }, [mainSearchState])
       
    return <MainSearchContext.Provider value={{
        mainSearch, 
        dispatchMainSearch,
        searchGames,
        goToDetails
    }}>{children}</MainSearchContext.Provider>

};

export default MainSearchProvider;