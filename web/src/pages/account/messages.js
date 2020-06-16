import React from "react";

import {sendLocalData} from "../../utils/API";

export async function getServerSideProps(ctx) {
    const userId = await ctx.req.user ? ctx.req.user.id : null;
    const URLBase = await ctx.req.headers.host;
    const Url = new URL("/api/user/messages", `http://${URLBase}`).href;

    const data = await sendLocalData(Url, {userId});
    console.log("DATA", data);
    //const {conversations, users} = data;
    
    return { props: {data} }
}


//const Messages = ({messages}) => {
//    if(messages && Array.isArray(messages)) {
//        return messages.map(msg => {
//            const {message, id, user_id} = msg;
//
//            return (
//                <div className="messages" key={id}>
//                    <span>{user_id}</span><p>{message}</p>
//                </div>
//            )
//        })
//    }
//}

const Conversations = ({conversations, users}) => {
    console.log(users);
    if(conversations && Array.isArray(conversations)) {
        return conversations.map(conversation => {
            const userLogged = conversation.user_id;
            const {conversation_id} = conversation;
            let recipient;
           
            conversation.users.map(user => {
                if (user.user_id !== userLogged) {
                    console.log(user.user_id);
                    recipient = users.find(usr => usr.id === user.user_id);
                }
            })
            return (
                <div className="conversation"
                     key={conversation_id}><p>{recipient.nickName}</p></div>
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
        </div>
    )
}

export default UsersMessages;