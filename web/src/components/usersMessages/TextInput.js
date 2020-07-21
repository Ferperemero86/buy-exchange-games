import React, {useRef, useContext} from "react";

import {UsersMessagesContext} from "../providers/UsersMessagesProvider";
import {sendLocalData} from "../../utils/API";

import Button from "../forms/Button";
import Input from "../forms/Input";
import Form from "../forms/Form";

const FormElements = ({sendMessage}) => {
    return (
        <div>
            <Input 
                type="text"
                className="text"
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
    const {currentRecipient} = usersMessages;
    const formRef = useRef(null);
   
    const sendMessage = async (e) => {
        e.preventDefault();
        console.log(e.target);
        const message = formRef.current["message"].value;

        await sendLocalData("/api/user/message/save", {recipient: currentRecipient, message});
        const messages = await sendLocalData("/api/user/messages", {userId});
        const{conversations} = messages;

        dispatchUsersMessages({type: "UPDATE_CONVERSATIONS", payload: conversations});
    }

    return (     
        <Form className="text-input"
                 ref={formRef} >
            <FormElements sendMessage={sendMessage} />
        </ Form>
    )
}

export default TextInput;