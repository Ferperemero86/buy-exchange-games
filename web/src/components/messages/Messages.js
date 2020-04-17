import React, {useEffect} from "react";
import {useRouter} from "next/router";
import timeOut from "../../controllers/helpers";
import ValidationError from "../messages/ValidationError";


const Messages = ({message, page, clearMessage, currentPage, setCurrentPage}) => {
    let msg = null;
    const router = useRouter();
   
    useEffect(() => {
        if (currentPage !== page) {
            clearMessage(false);
        }

        setCurrentPage(page);
    });

    /*****ERROR*****/

    if (message.inputValidation) {
        return <ValidationError inputValidation={message.inputValidation} />;
    }

    if (message.login === false) {

        switch (page) {

            case "session":
                msg = <p className={`error-message ${page}`}>User/Password do not match.</p>;

                break;
            
            case "details":
                msg = <p className={`error-message ${page}`}>Please Login first.</p>

                break;

            case "gameslist":
                router.push("/account/login");
            
                break;
        }
    }

    if (message.userExists) {
        msg = <p className={`error-message ${page}`}>Please choose other username.</p>;
    }

    if (message.listExists) {
        switch(page) {
            case "gameslist":
                msg = <p className={`error-message ${page}`}>List already exists</p>

                break;

        }
    }

    if (message.listExists === false) {

        switch(page) {
            case "details":
            msg = <p className={`error-message ${page}`}>Please create a List first.</p>

            break;
        }
    }

    if (message.gameNoAdded) {

        switch(page) {
            case "details":
                msg = <p className={`error-message ${page}`}>Could not add game to the List.</p>

                break;
        }

    }

    if (message.internalError) {
        msg = <p className={`error-message ${page}`}>Something wrong happened</p>;
    }

    if (message.couldNotGetList) {
        msg = <p className={`error-message ${page}`}>Could not update list, but game is deleted.</p>;
    }

    /******SUCCESS*****/

    if (message.login) {

        switch (page) {

            case "session":
                router.push("/");

                break;
        }

    }

    if (message.register) {
        msg = <p className={`success-message ${page}`}>Account created</p>;
        timeOut(clearMessage, false, "3000");
    } 

    if (message.gameAddedToList) {
        msg = <p className={`success-message ${page}`}>Game Added to List</p>;
        timeOut(clearMessage, false, "3000");
    }

    if (message.listCreated) {
        msg = <p className={`success-message ${page}`}>List created</p>;
        timeOut(clearMessage, false, "3000");
    }

    return msg;
};

export default Messages;