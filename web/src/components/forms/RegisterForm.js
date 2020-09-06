import React, {useContext, useEffect} from "react";
import {sendDataFromClient} from "../../utils/API";
import {useRouter} from "next/router";

import {RegisterContext} from "../../components/providers/forms/RegisterProvider";
import Countries from "../../components/forms/CountriesSearch";
import Cities from "../../components/forms/CitiesSearch";
import Message from "../../components/messages/Message";
import Label from "../../components/Label";
import Input from "../../components/forms/Input";
import Heading from "../../components/Heading";
import Select from "../../components/Select";
import Option from "../../components/Option";
import Button from "../../components/forms/Button";

import handleMessages from "../../controllers/messagesHandler";

const FormField = ({labelText, inputType, inputValue, onChange}) => (
    <div className="form-section">
        <Label text={labelText} />
        <Input
         type={inputType}
         value={inputValue}
         onChange={onChange} />
    </div>
);

const FormSelectField = ({labelText, onChange, locations, locationNames, type}) => (
    <div className="form-section">
        <Label text={labelText} />
        <Select onChange={onChange}>
            <Option>Choose country</Option>
            {type === "countries"
             && <Countries 
                countries={locations}
                countryNames={locationNames} />}
            {type === "cities"
             && <Cities cities={locations} />}
        </ Select>
    </div>
);


const RegisterForm = () => {
    const {register, dispatchRegister, updateNickName, 
           updateUsernameValue, updatePassValue,
           selectCountry, selectCity} = useContext(RegisterContext);
    const {countries, cities, nickName, countryNames, 
           usernameInputValue, passwordInputValue, 
           selectedCountryName, selectedCityName,
           messages, selectedCountryCode} = register;
    const router = useRouter();

    const sendData = (e) => {
        e.preventDefault();

        const userData = {
            email: usernameInputValue,
            password: passwordInputValue,
            nickName,
            country: selectedCountryName,
            city: selectedCityName
        };
        
        sendDataFromClient(`/api/user/new`, userData)
            .then((result) => {
                const success = result.data;
               
                if (success && success.userCreated) {
                    router.push("/account/login");
                }
            })
            .catch(err => {
                if (err.response) {
                    const messages = handleMessages(err.response.data);
                    dispatchRegister({type: "UPDATE_MESSAGE", payload: messages});
                }
            });
    };

    useEffect(() => {
        if (selectedCountryCode) {
            sendDataFromClient("/api/cities", {selectedCountryCode})
            .then(result => {
                 dispatchRegister({type: "UPDATE_CITIES", payload: result.data.cities})
            })
        }
    }, [selectedCountryCode]);

    return (
        <div id="user-form">
            <Heading
             type="h1"
             text="Register" />
            <Message messages={messages} />
            <FormField
             labelText="Name" 
             inputType="text"
             inputValue={usernameInputValue}
             onChange={updateUsernameValue} />
            <FormField
             labelText="Password" 
             inputType="password"
             inputValue={passwordInputValue}
             onChange={updatePassValue} />
            <FormField
             labelText="NickName" 
             inputType="text"
             inputValue={nickName}
             onChange={updateNickName} />
            <FormSelectField
             labelText="Country"
             onChange={selectCountry}
             locations={countries}
             locationNames={countryNames}
             type="countries" />
            <FormSelectField
             labelText="City"
             onChange={selectCity}
             locations={cities}
             type="cities" />
            <Button 
             onClick={sendData}
             text="Send" />
        </div>
    )
}

export default RegisterForm;
