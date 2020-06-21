import React, {useRef, useContext} from "react";

import {UsersMessagesContext} from "../providers/UsersMessagesProvider";
import {sendLocalData} from "../../utils/API";

const TextInput = () => {
    const {usersMessages} = useContext(UsersMessagesContext);
    const {currentRecipient} = usersMessages;
    const formRef = useRef(null);
    const sendMessage = (e) => {
        e.preventDefault();
        
        const message = formRef.current["message"].value;

        const result = sendLocalData("/api/user/message/save", {recipient: currentRecipient, message});
        console.log(result);
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