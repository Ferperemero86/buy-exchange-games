import React, {useContext} from "react";

import {UsersMessagesContext} from "../../components/providers/UsersMessagesProvider";

import {sendLocalData} from "../../utils/API";

export async function getServerSideProps(ctx) {
    const userId = await ctx.req.user ? ctx.req.user.id : null;
    const URLBase = await ctx.req.headers.host;
    const Url = new URL("/api/user/messages", `http://${URLBase}`).href;

    const data = await sendLocalData(Url, {userId});
   
    return { props: {data} }
}


const Messages = ({conversations, users}) => {
    const {usersMessages} = useContext(UsersMessagesContext);
    const {currentConversation} = usersMessages;
    console.log("CURRENT CONVERSATION", currentConversation)
    if(conversations && Array.isArray(conversations) && conversations.length > 0) {
        const conversation_id = currentConversation;
        console.log(conversation_id);
        const conversation = conversations.filter(conv => { return conv.conversation_id === conversation_id });
        const messages = conversation.length > 0 ? conversation[0].messages : [];
        const currentUser = conversation.length > 0 ? conversation[0].users[0].user_id : [];
       
        if (messages && Array.isArray(messages)) {
            return messages.map(msg => {
                const user = users.filter(user => { return user.id === msg.user_id });
                const messageStyles = currentUser === msg.user_id ? "user-left" : "user-right";

                return (
                    <div className={`message ${messageStyles}`} key={msg.id}>
                        <p className="name">{user[0].nickName}</p>
                        <p className="text">{msg.message}</p>
                    </div>
                )
            })
        }
        return null;
    }
    return <h1 className="no-conversations-text">No conversations available</h1>;
}

const Conversations = ({conversations, users}) => {
    const {dispatchUsersMessages} = useContext(UsersMessagesContext);

    const showUserMessages = (e) => {
        const conversation = parseInt(e.currentTarget.getAttribute("data-conv-id"));
        console.log(e.currentTarget.getAttribute("data-conv-id"));
        dispatchUsersMessages({type: "UPDATE_CURRENT_CONVERSATION", payload: conversation})
    }

    if(conversations && Array.isArray(conversations)) {
        return conversations.map(conversation => {
            const userLogged = conversation.user_id;
            const {conversation_id} = conversation;
            let recipient;
           
            conversation.users.map(user => {
                if (user.user_id !== userLogged) {
                    recipient = users.find(usr => usr.id === user.user_id);
                }
            })
            return (
                <div className="conversation"
                    key={conversation_id}
                    data-conv-id={conversation_id}
                    onClick={showUserMessages}><p>{recipient.nickName}</p></div>
            )
        })
    }
    return null;
}

const UsersMessages = ({data}) => {
    const {conversations, users} = data;
    console.log("conversations", conversations);
    console.log("users", users);
    return (
        <div className="users-messages">
            <div className="conversations">
                <Conversations 
                    conversations={conversations} 
                    users={users} />
            </div>
            <div className="messages">
                <Messages
                    conversations={conversations} 
                    users={users} />
            </div>
        </div>
    )
}

export default UsersMessages;