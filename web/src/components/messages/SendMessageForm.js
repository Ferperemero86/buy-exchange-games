import React, {useRef} from "react";

import {sendDataFromClient} from "../../utils/API";

const SendMessageForm = ({recipient}) => {
    const FormRef = useRef(null);

    const sendMessage = (e) => {
        e.preventDefault();

        const message = FormRef.current["message"].value;

        sendDataFromClient("/api/user/message/save", {
            message, 
            type: "text",
            recipient
        })
    }

    return (
        <div className="send-message-form">
            <form ref={FormRef}>
                <input type="text" name="message"/>
                <button onClick={sendMessage}>Send</button>
            </form>
        </div>
    )
}

export default SendMessageForm;