import React, {createContext, useReducer, useMemo} from "react";

import {usersMessagesReducer} from "../../utils/reducers";

export const UsersMessagesContext = createContext();

const getRecipientId = (conversations) => {
    let recipientId;

    if (conversations.length > 0) {
        const senderId = conversations[0].user_id;

        const recipient = conversations[0].users.filter(user => { return user.user_id !== senderId });
        recipientId = recipient[0].user_id;
    }
    return recipientId;
}


const UsersMessagesProvider = ({children, pageProps}) => {
    console.log("pageProps", pageProps);
    const {conversations} = pageProps.data;
    const conversationId = conversations.length > 0 ? conversations[0].conversation_id : null;
    const recipientId = getRecipientId(conversations);
   
    const initialValues = {
        currentConversation: conversationId,
        currentRecipient: recipientId
    }
    
    const [usersMessagesState, dispatchUsersMessages] = useReducer(usersMessagesReducer, initialValues);

    const usersMessages = useMemo(() => {
        return usersMessagesState
    }, [usersMessagesState])
       
    return <UsersMessagesContext.Provider value={{usersMessages, dispatchUsersMessages}}>{children}</UsersMessagesContext.Provider>

}

export default UsersMessagesProvider;