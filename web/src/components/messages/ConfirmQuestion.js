import React, {useContext} from "react";

import {MessagesContext} from "../providers/MessagesProvider";

const ConfirmQuestion = ({Url, data, redUrl, customFunct, gameId}) => {
    const {messages, dispatchMessages} = useContext(MessagesContext);
    const {confirmQuestion, confirmMessage} = messages;
    
    const sendData = () => {
        dispatchMessages({type: "SHOW_CONFIRM_QUESTION", payload: false});
        customFunct(Url, data, redUrl);
    }

    const cancel = () => {
        dispatchMessages({type: "SHOW_CONFIRM_QUESTION", payload: false})
    }

    if (confirmQuestion === gameId) {
        return (
            <div className="confirm-question">
                <p>{confirmMessage}</p>
                <div className="confirm-question-buttons">
                    <button className="button"
                            onClick={sendData}>Send</button>
                    <button className="button"
                            onClick={cancel}>Cancel</button>
                </div>
            </div>
        )
    }
    return null;
}

export default ConfirmQuestion;