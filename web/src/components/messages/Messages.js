import React, {useEffect} from "react";
import {useRouter} from "next/router";
import timeOut from "../../controllers/helpers";

const Messages = ({message, page, clearMessage, currentPage, setCurrentPage}) => {
    let msg = null;
    const router = useRouter();
    console.log(message);
   
    useEffect(() => {
        if (currentPage !== page) {
            clearMessage(false);
        }

        setCurrentPage(page);
    });

    /*****ERROR*****/

    if (message.login === false) {

        switch (page) {

            case "session":
                msg = <p className="error-message login">User/Password do not match.</p>;

                break;
            
            case "details":
                msg = <p className="error-message details">Please Login first.</p>

                break;
    
        }
    }

    if (message.userExists) {
        msg = <p className="error-message">Please choose other username.</p>;
    }

    if (message.listExists) {
        console.log(page);
        switch (page) {
            case "details":
                msg = <p className="error-message details">Please create a List first.</p>

                break;

            case "gameslist":
                msg = <p className="error-message gameslist">List already exists</p>

        }
    }

    if (message.gameNoAdded) {

        switch(page) {
            case "details":
                msg = <p className="error-message">Could not add game to the List.</p>

                break;
        }

    }

    if (message.internalError) {
        msg = <p className={`error-message ${page}`}>Something wrong happened</p>;
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
        msg = <p className="success-message">Account created</p>
    } 

    if (message.gameAddedToList) {
        msg = <p className="success-message">Game Added to List</p>;
        timeOut(clearMessage, false, "3000");
    }

    return msg;
};

export default Messages;