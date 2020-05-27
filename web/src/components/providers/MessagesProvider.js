import React, {createContext, useReducer, useMemo} from "react";

import {messagesReducer} from "../../utils/reducers";

export const MessagesContext = createContext();


const MessagesProvider = ({children}) => {
   
    const initialValues = {
       confirmQuestion: false,
       confirmMessage: ""
    }
    
    const [messagesState, dispatchMessages] = useReducer(messagesReducer, initialValues);

    const messages = useMemo(() => {
        return messagesState
    }, [messagesState])
       
    return <MessagesContext.Provider value={{messages, dispatchMessages}}>{children}</MessagesContext.Provider>

}

export default MessagesProvider;