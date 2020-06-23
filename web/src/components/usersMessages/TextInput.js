import React, {useRef, useContext} from "react";

import {UsersMessagesContext} from "../providers/UsersMessagesProvider";
import {sendLocalData} from "../../utils/API";

const TextInput = ({userId}) => {
    const {usersMessages, dispatchUsersMessages} = useContext(UsersMessagesContext);
    const {currentRecipient} = usersMessages;
    const formRef = useRef(null);
   
    const sendMessage = async (e) => {
        e.preventDefault();
        
        const message = formRef.current["message"].value;

        await sendLocalData("/api/user/message/save", {recipient: currentRecipient, message});
        const messages = await sendLocalData("/api/user/messages", {userId});
        const{conversations} = messages;

        dispatchUsersMessages({type: "UPDATE_CONVERSATIONS", payload: conversations});
    }

    return (     
        <form className="text-input"
              ref={formRef}>
            <input type="text"
                   className="text"
                   name="message"></input>
            <button className="button"
                    onClick={sendMessage}>Send</button>
        </form> 
    )
}

export default TextInput;