import React from "react";

import Conversations from "../../components/usersMessages/Conversations";
import Messages from "../../components/usersMessages/Messages";
import TextInput from "../../components/usersMessages/TextInput";

import {sendLocalData} from "../../utils/API";

export async function getServerSideProps(ctx) {
    const userId = await ctx.req.user ? ctx.req.user.id : null;
    const URLBase = await ctx.req.headers.host;
    const Url = new URL("/api/user/messages", `http://${URLBase}`).href;

    const data = await sendLocalData(Url, {userId});
   
    return { props: {data} }
}

const UsersMessages = ({data}) => {
    const {conversations, users} = data;
    
    return (
        <div>
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
            <TextInput />
        </div>
    )
}

export default UsersMessages;