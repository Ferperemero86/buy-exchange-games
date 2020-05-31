import React, {useContext} from "react";
import axios from "axios";

import {RegisterContext} from "../../components/providers/forms/RegisterProvider";
import Countries from "../../components/forms/CountriesSearch";
import Cities from "../../components/forms/CitiesSearch";
import Message from "../../components/messages/Message";

import handleMessages from "../../controllers/messagesHandler";

const RegisterForm = () => {
    const {register, dispatchRegister} = useContext(RegisterContext);
    const {countries, cities, nickName, countryNames, 
           usernameInputValue, passwordInputValue, 
           selectedCountryName, selectedCityName, messages} = register;

    const selectCountry = (e) => {
        const countryCodeSel = e.target.value;
       
        Object.keys(countries).map(country => {
            const code = countries[country];

            if (code === countryCodeSel) {
                dispatchRegister({type: "UPDATE_SELECTED_COUNTRY_NAME", payload: country});
                dispatchRegister({type: "UPDATE_SELECTED_COUNTRY_CODE", payload: countryCodeSel});
            }
        })
       
        if (countryCodeSel === "Choose country") {
            console.log("empty country");
            dispatchRegister({type: "UPDATE_SELECTED_COUNTRY_NAME", payload: ""});
            dispatchRegister({type: "UPDATE_SELECTED_COUNTRY_CODE", payload: ""});
        }
    }

    const selectCity = (e) => {
        const city = e.target.value;

        dispatchRegister({type: "UPDATE_SELECTED_CITY", payload: city})
    }

    const updateUsernameValue = (e) => {
        dispatchRegister({ type:"ADD_USERNAMEINPUT_VALUE", payload: e.target.value });
    }

    const updatePassValue = (e) => {
       dispatchRegister({ type: "ADD_PASSWORDINPUT_VALUE", payload: e.target.value });
    }

    const updateNickName = (e) => {
        const nickVal = e.target.value;
      
        dispatchRegister({type: "UPDATE_NICK_NAME_VALUE", payload: nickVal})
    }

    const sendData = (e) => {
        e.preventDefault();

        const userData = {
            email: usernameInputValue,
            password: passwordInputValue,
            nickName,
            country: selectedCountryName,
            city: selectedCityName
        };
        
        axios.post(`/api/user/new`, userData)
            .then((result) => {
                const success = result.data;
               
                if (success && success.userCreated) {
                    const messages = handleMessages(success.userCreated);
                    dispatchRegister({ type: "USER_CREATED", payload: messages});
                }
            })
            .catch(err => {
                if (err.response) {
                    const messages = handleMessages(err.response.data);
                    dispatchRegister({type: "UPDATE_MESSAGE", payload: messages});
                }
            });
    }

    return (
        <div id="user-form">
            <h1>Register</h1>
            <Message messages={messages} />
            <div className="form-section">
            <div className="form-section">
                <label>Name</label>
                <input
                    type="text"
                    value={usernameInputValue}
                    onChange={updateUsernameValue} />
            </div>
            <div className="form-section">
                <label>Password</label>
                <input
                    type="password"
                    value={passwordInputValue}
                    onChange={updatePassValue} />
            </div>
                <label>Nick Name</label>
                <input type="text"
                       value={nickName}
                       onChange={updateNickName}></input>
            </div>
            <div className="form-section">
                <label>Country</label>
                <select onChange={selectCountry}>
                    <option>Choose country</option>
                    <Countries 
                        countries={countries}
                        countryNames={countryNames} />
                </select>
            </div>
            <div className="form-section">
                <label>City</label>
                <select onChange={selectCity}>
                    <option>Choose city</option>
                    <Cities cities={cities} />
                </select>
            </div> 
            <button onClick={sendData}>Send</button>
        </div>
    )
}

export default RegisterForm;
