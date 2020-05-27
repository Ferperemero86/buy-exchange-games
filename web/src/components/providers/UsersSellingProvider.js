import React, {createContext, useReducer, useMemo} from "react";

import {usersSellingReducer} from "../../utils/reducers";

export const UsersSellingContext = createContext();


const UsersSellingProvider = ({children, pageProps}) => {
    console.log(pageProps.data.games);
    const initialValues = {
        games: pageProps.data.games,
        countries: "Choose a country",
        states: "Choose a country first",
        cities: "Coose a state first",
        countrySelected: "",
        citySelected: "",
        stateSelected: "",
    }
    
    const [usersSellingState, dispatchUsersSelling] = useReducer(usersSellingReducer, initialValues);

    const usersSelling = useMemo(() => {
        return usersSellingState
    }, [usersSellingState])
       
    return <UsersSellingContext.Provider value={{usersSelling, dispatchUsersSelling}}>{children}</UsersSellingContext.Provider>

}

export default UsersSellingProvider;