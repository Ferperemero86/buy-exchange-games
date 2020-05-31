import React, {useContext, useEffect} from "react";
import axios from "axios";

import {useRouter} from "next/router";

import {FormsContext} from "../providers/FormsProvider";
import {UserContext} from "../providers/UserProvider";

import Countries from "../../components/forms/CountriesSearch";
import Cities from "../../components/forms/CitiesSearch";

const RegistrationInputs = ({URL}) => {
    const {forms, dispatchForms} = useContext(FormsContext);
    const {countries, cities, nickName, countryNames} = forms;

    const selectCountry = (e) => {
        const countryCodeSel = e.target.value;
        
        Object.keys(countries).map(country => {
            const code = countries[country];

            if (code === countryCodeSel) {
                dispatchForms({type: "UPDATE_SELECTED_COUNTRY_NAME", payload: country});
                dispatchForms({type: "UPDATE_SELECTED_COUNTRY_CODE", payload: countryCodeSel});
            }
        })
    }

    const selectCity = (e) => {
        const city = e.target.value;

        dispatchForms({type: "UPDATE_SELECTED_CITY", payload: city})
    }

    const updateNickName = (e) => {
        const nickVal = e.target.value;
      
        dispatchForms({type: "UPDATE_NICK_NAME_VALUE", payload: nickVal})
    }

    if (URL === "user/new") {
        return (
            <div className="registration-forms">
                <div className="form-section">
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
            </div>
        )
    }
    return null;
}


const Heading = ({url}) => {
    if (url === "session") {return <h1>Login</h1>}
    return <h1>Register</h1>
};

const UserForm = ({URL}) => {
    const {user, dispatchUser} = useContext(UserContext);
    const {forms, dispatchForms} = useContext(FormsContext);
    const {usernameInputValue, passwordInputValue, selectedCityName, selectedCountryName, nickName} = forms;
    const router = useRouter();

    const updateUsernameValue = (e) => {
        dispatchForms({ type:"ADD_USERNAMEINPUT_VALUE", payload: e.target.value });
    }

    const updatePassValue = (e) => {
       dispatchForms({ type: "ADD_PASSWORDINPUT_VALUE", payload: e.target.value });
    }

    const sendInputData = (e) => {
        e.preventDefault();

        let userData;

        if (URL === "user/new") {
            userData = {
                email: usernameInputValue,
                password: passwordInputValue,
                nickName,
                country: selectedCountryName,
                city: selectedCityName
            };
        } else {
            userData = {
                email: usernameInputValue,
                password: passwordInputValue
            };
        }
        
        axios.post(`/api/${URL}`, userData)
            .then((result) => {
                const success = result.data;
               
                if (success && success.login) {
                    dispatchUser({ type: "USER_LOGGED_IN"});
                }
            })
            .catch(err => {
                console.log(err.response);
            });
    }

    useEffect(() => {
        if (user.userLogged) {
            router.push("/");
        }
    });

    return (
        <form id="user-form">
            <Heading url={URL} />
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
            <RegistrationInputs URL={URL}/>
            <button 
                onClick={sendInputData}>Send</button>
        </form>
    )
}

export default UserForm;