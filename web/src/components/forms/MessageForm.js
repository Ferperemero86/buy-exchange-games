import React, {useRef} from "react";

import {sendDataFromClient} from "../../utils/API";

const SendMessageForm = ({recipient}) => {
    const FormRef = useRef(null);
   
    const sendMessage = (e) => {
        e.preventDefault();

        const message = FormRef.current["message"].value;

        sendDataFromClient("/api/user/message/save", {
            message, 
            recipient
        })
    }

    return (
        <div className="send-message-form">
            <form ref={FormRef}>
                <input type="text"
                       name="message"
                       className="text-input" />
                <button onClick={sendMessage}
                        className="button-input">Send</button>
            </form>
        </div>
    )
}

export default SendMessageForm;