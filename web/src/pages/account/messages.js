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
   
    return { props: {data, userId} }
}

const UsersMessages = ({userId}) => {
    return (
        <div>
            <div className="users-messages">
                <div className="conversations">
                    <Conversations userId={userId} />
                </div>
                <div className="messages">
                    <Messages />
                </div>
            </div>
            <TextInput userId={userId} />
        </div>
    )
}

export default UsersMessages;