import React, {createContext, useReducer, useMemo} from "react";

import {usersMessagesReducer} from "../../utils/reducers";

export const UsersMessagesContext = createContext();


const UsersMessagesProvider = ({children, pageProps}) => {
    console.log("pageProps", pageProps);
    const {conversations} = pageProps.data;
    const conversationId = conversations.length > 0 ? conversations[0].conversation_id : null;

    const initialValues = {
        currentConversation: conversationId
    }
    
    const [usersMessagesState, dispatchUsersMessages] = useReducer(usersMessagesReducer, initialValues);

    const usersMessages = useMemo(() => {
        return usersMessagesState
    }, [usersMessagesState])
       
    return <UsersMessagesContext.Provider value={{usersMessages, dispatchUsersMessages}}>{children}</UsersMessagesContext.Provider>

}

export default UsersMessagesProvider;