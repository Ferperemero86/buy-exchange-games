import React, {useContext, useEffect} from "react";

import {UsersMessagesContext} from "../providers/UsersMessagesProvider";
import {sendLocalData} from "../../utils/API";

const Conversations = ({userId}) => {
    const {usersMessages, dispatchUsersMessages} = useContext(UsersMessagesContext);
    const {conversations, users} = usersMessages;

    useEffect(() => {
        const timer = setInterval(async () => {
            const result = await sendLocalData("/api/user/messages", {userId});
            const {conversations} = result;

            dispatchUsersMessages({type: "UPDATE_CONVERSATIONS", payload: conversations});
            console.log(result);
          }, 2000);
          return () => clearTimeout(timer);
    }, [])

    const showUserMessages = (e) => {
        const conversation = parseInt(e.currentTarget.getAttribute("data-conv-id"));
        const recipient = parseInt(e.currentTarget.getAttribute("data-recipient-id"));
        
        dispatchUsersMessages({type: "UPDATE_CURRENT_RECIPIENT", payload: recipient})
        dispatchUsersMessages({type: "UPDATE_CURRENT_CONVERSATION", payload: conversation})
    }

    if (conversations && Array.isArray(conversations)) {
        return conversations.map(conversation => {
            const userLogged = conversation.user_id;
            const {conversation_id} = conversation;
            let recipient;
           
            conversation.users.map(user => {
                if (user.user_id !== userLogged) {
                    recipient = users.find(usr => usr.id === user.user_id);
                }
            })
            
            const {nickName, id} = recipient
            return (
                <div className="conversation"
                    key={conversation_id}
                    data-conv-id={conversation_id}
                    data-recipient-id={id}
                    onClick={showUserMessages}><p>{nickName}</p></div>
            )
        })
    }
    return null;
}

export default Conversations;
