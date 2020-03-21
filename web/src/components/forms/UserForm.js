import React, { useContext } from "react";
import { StoreContext } from "../../utils/store";
import axios from "axios";
import ValidationError from "../messages/errors/ValidationError";
import cookie from "react-cookies";

const UserForm = ({ URL }) => {

    const { loginUsernameValue, setLoginUsernameValue } = useContext(StoreContext);
    const { loginPassValue, setLoginPassValue } = useContext(StoreContext);
    const { inputValidation, setInputValidation } = useContext(StoreContext);
    const { userLogged, setUserLogged } = useContext(StoreContext);

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

                if (inputValidation) {
                    return setInputValidation(inputValidation);
                }

                setUserLogged(true);
            })
            .catch(err => {
                console.log(err);
            });
    }

    return (
        <form>
            <ValidationError inputValidation={inputValidation} />
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
            <button onClick={sendInputData}>Send</button>
        </form>
    )
}

export default UserForm;