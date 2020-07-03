import React, {useContext} from "react";
import {useRouter} from "next/router";

import {MessagesContext} from "../providers/MessagesProvider";

import {sendDataFromClient} from "../../utils/API";

const ConfirmQuestion = ({Url, data, redUrl}) => {
    const {messages, dispatchMessages} = useContext(MessagesContext);
    const {confirmQuestion, confirmMessage} = messages;
    const router = useRouter();

    const sendData = () => {
        dispatchMessages({type: "SHOW_CONFIRM_QUESTION", payload: false});
        sendDataFromClient(Url, data);
        router.push(redUrl);
    }

    const cancel = () => {
        dispatchMessages({type: "SHOW_CONFIRM_QUESTION", payload: false})
    }

    if (confirmQuestion) {
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