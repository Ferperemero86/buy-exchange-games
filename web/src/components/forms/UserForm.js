import React, { useContext } from "react";
import { StoreContext } from "../../utils/store";
import axios from "axios";
import ValidationError from "../messages/ValidationError";
import Messages from "../messages/Messages";

const Heading = ({ url }) => {
    if (url === "session") { return <h1>Login</h1> }
    return <h1>Register</h1>
};

const UserForm = ({ URL }) => {
    const {loginUsernameValue, setLoginUsernameValue} = useContext(StoreContext);
    const {loginPassValue, setLoginPassValue} = useContext(StoreContext);
    const {inputValidation, setInputValidation} = useContext(StoreContext);
    const {setUserLogged} = useContext(StoreContext);
    const {message, setMessage} = useContext(StoreContext);
    const {currentPage, setCurrentPage} = useContext(StoreContext);
    const {disabledButton, setDisabledButton} = useContext(StoreContext);

    const updateUsernameValue = (e) => {
        setLoginUsernameValue(e.target.value);
    }

    const updatePassValue = (e) => {
        setLoginPassValue(e.target.value);
    }

    const sendInputData = (e) => {
        e.preventDefault();

        const userData = {
            email: loginUsernameValue,
            password: loginPassValue
        };

        axios.post(`/api/${URL}`, userData)
            .then(result => {
                const inputValidation = result.data.inputValidation;
                const message = result.data;

                if (inputValidation) {
                    return setInputValidation(inputValidation);
                }
                setUserLogged(true);
                setMessage(message);
                setDisabledButton("disabled");
            })
            .catch(err => {
                if(err.response) {
                    setMessage(err.response.data);
                }
            });
    }

    return (
        <form id="user-form">
            <ValidationError inputValidation={inputValidation} />
            <Messages 
                message={message} 
                page={URL} 
                currentPage={currentPage}
                clearMessage={setMessage}
                setCurrentPage={setCurrentPage} /> 
            <Heading url={URL} />
            <div className="form-section">
                <label>Name</label>
                <input
                    type="text"
                    value={loginUsernameValue}
                    onChange={updateUsernameValue} />
            </div>
            <div className="form-section">
                <label>Password</label>
                <input
                    type="password"
                    value={loginPassValue}
                    onChange={updatePassValue} />
            </div>
            <button 
                onClick={sendInputData}
                disabled={disabledButton}>Send</button>
        </form>
    )
}

export default UserForm;