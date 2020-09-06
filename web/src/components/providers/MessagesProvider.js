import React, {createContext, useReducer, useMemo} from "react";

import {messagesReducer} from "../../utils/reducers";

export const MessagesContext = createContext();


const MessagesProvider = ({children}) => {
    const initialValues = {
       confirmQuestion: false,
       confirmMessage: ""
    };
    
    const [messagesState, dispatchMessages] = useReducer(messagesReducer, initialValues);

    const messages = useMemo(() => {
        return messagesState
    }, [messagesState]);

    const askConfirmation = (e) => {
        const gameId = parseInt(e.currentTarget.getAttribute("data"));
        const message = "Send Proposal?";

        dispatchMessages({type: "SHOW_CONFIRM_QUESTION", payload: gameId})
        dispatchMessages({type: "UPDATE_CONFIRMATION_MESSAGE", payload: message})
    }
       
    return <MessagesContext.Provider 
            value={{
                messages, 
                dispatchMessages,
                askConfirmation
            }}>{children}</MessagesContext.Provider>

}

export default MessagesProvider;