import React, {useContext, useEffect} from "react";
import axios from "axios";

import {useRouter} from "next/router";

import {FormsContext} from "../providers/FormsProvider";
import {UserContext} from "../providers/UserProvider";


const Countries = () => {
    const {forms, dispatchForms} = useContext(FormsContext);
    const {countries, countryNames} = forms;

    useEffect(() => {
        axios.get("/api/countries")
            .then(result => {
                dispatchForms({type: "UPDATE_COUNTRY_NAMES", payload: result.data.countryNames})
                dispatchForms({type: "UPDATE_COUNTRIES", payload: result.data.countries})
            })
    }, [countryNames.length]);
   
    if (countryNames && (Array.isArray(countryNames)) ) {
        return countryNames.map(country => {
            const code = countries[country];
    
            return <option 
                        value={code}
                        key={country}>{country}</option>
        })
    }
   
    return <option>Something went wrong</option>
}

const Cities = () => {
    const {forms, dispatchForms} = useContext(FormsContext);
    const {cities, selectedCountryCode} = forms;
    let keyVal = 0;
   
    useEffect(() => {
        if (selectedCountryCode) {
            console.log("sending post...");
            axios.post("/api/cities", {selectedCountryCode})
            .then(result => {
                console.log(result);
                dispatchForms({type: "UPDATE_CITIES", payload: result.data.cities})
            })
        }
    }, [selectedCountryCode]);

    if (cities && Array.isArray(cities)) {
        return cities.map(city => {
            keyVal++;
            return <option 
                        key={city + keyVal}>{city}</option>
            })
   }

   return <option>Something went wrong</option>
}


const RegistrationInputs = ({URL}) => {
    const {forms, dispatchForms} = useContext(FormsContext);
    const {countries, nickName} = forms;

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
        console.log(nickVal);
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
                        <Countries />
                    </select>
                </div>
                <div className="form-section">
                    <label>City</label>
                    <select onChange={selectCity}>
                        <option>Choose city</option>
                        <Cities />
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
    console.log(selectedCountryName);

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

        console.log(userData);
        
        axios.post(`/api/${URL}`, userData)
            .then((result) => {
                console.log(result);
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