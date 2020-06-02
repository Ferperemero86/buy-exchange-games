import React from "react";

const Message = ({messages}) => {
    let msgKey = 0;
   
    console.log(messages);

    if (messages && messages.length > 0) {
        return messages.map(msg => {
            msgKey++;
            return <p key={msgKey}>{msg}</p>
        })
    }
   return null;
};

export default Message;