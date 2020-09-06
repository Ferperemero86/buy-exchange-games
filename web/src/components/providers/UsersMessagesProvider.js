import React, {createContext, useReducer, useMemo, useEffect} from "react";
import {useRouter} from "next/router";

import {usersMessagesReducer} from "../../utils/reducers";

export const UsersMessagesContext = createContext();

const getRecipientId = (conversations) => {
    let recipientId;

    if (conversations && conversations.length > 0) {
        const senderId = conversations[0].user_id;

        const recipient = conversations[0].users.filter(user => { return user.user_id !== senderId });
        recipientId = recipient[0].user_id;
    }
    return recipientId;
}


const UsersMessagesProvider = ({children, pageProps}) => {
    const {login} = pageProps;
    const conversations = pageProps.data ? pageProps.data.conversations : null;
    const users = pageProps.data ? pageProps.data.users : null;
    const conversationId = conversations && conversations.length > 0 ? conversations[0].conversation_id : null;
    const recipientId = getRecipientId(conversations);
    const router = useRouter();
   
    const initialValues = {
        currentConversation: conversationId,
        currentRecipient: recipientId,
        conversations,
        users,
        chatTextInput: ""
    };
    
    const [usersMessagesState, dispatchUsersMessages] = useReducer(usersMessagesReducer, initialValues);

    const usersMessages = useMemo(() => {
        return usersMessagesState
    }, [usersMessagesState]);

    useEffect(() => {
        if (!login) {
            router.push("/account/login");
        }
    })
       
    return <UsersMessagesContext.Provider value={{usersMessages, dispatchUsersMessages}}>{children}</UsersMessagesContext.Provider>

}

export default UsersMessagesProvider;