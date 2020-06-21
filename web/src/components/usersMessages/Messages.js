import React, {useContext} from "react";

import {UsersMessagesContext} from "../providers/UsersMessagesProvider";

const Messages = ({conversations, users}) => {
    const {usersMessages} = useContext(UsersMessagesContext);
    const {currentConversation} = usersMessages;
    
    if(conversations && Array.isArray(conversations) && conversations.length > 0) {
        const conversation_id = currentConversation;
        const conversation = conversations.filter(conv => { return conv.conversation_id === conversation_id });
        const messages = conversation.length > 0 ? conversation[0].messages : [];
        const currentUser = conversation.length > 0 ? conversation[0].users[0].user_id : [];
       
        if (messages && Array.isArray(messages)) {
            return messages.map(msg => {
                const addZero = (val) => {
                    if (val < 10) {
                        val = `0${val}`;
                    }
                    return val;
                }

                const user = users.filter(user => { return user.id === msg.user_id });
                const hours = addZero(new Date(msg.time).getHours());
                const minutes = addZero(new Date(msg.time).getMinutes());
                const day = addZero(new Date(msg.time).getDay());
                const month = addZero(new Date(msg.time).getMonth());               

                const time = `${hours}:${minutes} ${day}/${month}`;
                const messageStyles = currentUser === msg.user_id ? "user-left" : "user-right";

                return (
                    <div className={`message ${messageStyles}`} key={msg.id}>
                        <p className="name">{user[0].nickName}</p>
                        <p className="text">{msg.message}</p>
                        <p className="time">{time}</p>
                    </div>
                )
            })
        }
        return null;
    }
    return <h1 className="no-conversations-text">No conversations available</h1>;
}

export default Messages;