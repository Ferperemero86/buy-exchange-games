import React, {useContext} from "react";

import {UsersMessagesContext} from "../providers/UsersMessagesProvider";
import {sendLocalData} from "../../utils/API";

import Button from "../forms/Button";
import Input from "../forms/Input";
import Form from "../forms/Form";

const FormElements = ({sendMessage}) => {
    const {usersMessages, dispatchUsersMessages} = useContext(UsersMessagesContext);
    const {chatTextInput} = usersMessages;

    const updateInputVal = (e) => {
        const message = e.currentTarget.value;
        
        dispatchUsersMessages({type: "UPDATE_CHAT_TEXT_INPUT", payload: message});
    }

    return (
        <div>
            <Input 
                type="text"
                className="text"
                value={chatTextInput}
                onChange={updateInputVal}
                autoComplete="off"
                name="message" />
            <Button 
                className="button"
                onClick={sendMessage}
                text="Send" />
        </div>
    )
}

const TextInput = ({userId}) => {
    const {usersMessages, dispatchUsersMessages} = useContext(UsersMessagesContext);
    const {currentRecipient, chatTextInput} = usersMessages;
    //const formRef = useRef(null);
   
    const sendMessage = async(e) => {
        e.preventDefault();
        
        const message = chatTextInput//formRef.current["message"].value;

        await sendLocalData("/api/user/message/save", {recipient: currentRecipient, message});
        const messages = await sendLocalData("/api/user/messages", {userId});
        const {conversations} = messages;

        dispatchUsersMessages({type: "UPDATE_CONVERSATIONS", payload: conversations});
        dispatchUsersMessages({type: "UPDATE_CHAT_TEXT_INPUT", payload: ""});
    }

    return (     
        <Form className="text-input" >
            <FormElements sendMessage={sendMessage} />
        </ Form>
    )
}

export default TextInput;