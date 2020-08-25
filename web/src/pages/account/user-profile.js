import React, {useContext, useEffect} from "react";
import Link from "next/link";

import {UserContext} from "../../components/providers/UserProvider";
import {UserProfileContext} from "../../components/providers/UserProfileProvider";
import SendMessageForm from "../../components/forms/MessageForm";
import {getLocalData, sendLocalData, sendDataFromClient, uploadFile} from "../../utils/API";

import Paragraph from "../../components/Paragraph";
import Span from "../../components/Span";
import Input from "../../components/forms/Input";
import Button from "../../components/forms/Button";
import Label from "../../components/forms/Label";
import Select from "../../components/Select";
import Image from "../../components/Image";

import CountriesSearch from "../../components/forms/CountriesSearch";
import CitiesSearch from "../../components/forms/CitiesSearch";


export async function getServerSideProps(ctx) {
    const {userId} = ctx.query;
    const URLBase = await ctx.req.headers.host;
    const profileUrl = new URL("/api/user/profile", `http://${URLBase}`).href;
    const countriesUrl = new URL("/api/countries", `http://${URLBase}`).href;
    const citiesUrl = new URL("/api/cities", `http://${URLBase}`).href;

    const profile = await sendLocalData(profileUrl, {userId});
    const {country} = profile.profile;
    const countriesList = await getLocalData(countriesUrl);
    const countryCode = countriesList.countries[country];
    const citiesList = await sendLocalData(citiesUrl, {selectedCountryCode: countryCode});
   
    return { props: {profile, countriesList, citiesList} }
}

const EditButton = ({field}) => {
    const {dispatchUserProfile} = useContext(UserProfileContext);

    const showButtons = () => {
        dispatchUserProfile({type: "SHOW_EDIT_PROFILE_FIELD", payload: field});
    }

    return (
        <Button
         className="edition-field-button"
         onClick={showButtons}
         text="Edit" />
    )
}

const OptionButtons = ({field}) => {
    const {user} = useContext(UserContext);
    const {userProfile, dispatchUserProfile, saveFieldValue} = useContext(UserProfileContext);
    const {editProfileField, fieldValue} = userProfile;
    const {userId} = user;

    const hideButtons = (e) => {
        const fieldName = e.currentTarget.getAttribute("data");
    
        dispatchUserProfile({type: "SHOW_EDIT_PROFILE_FIELD", payload: false});

        const updatedField = saveFieldValue(fieldValue, userId, fieldName);

        updatedField.then(result=> {
            if (result.fieldName === "Nickname") {
                dispatchUserProfile({type: "UPDATE_NICKNAME", payload: result.fieldValue});
            }
            if (result.fieldName === "Country") {
                dispatchUserProfile({type: "UPDATE_COUNTRY", payload: result.fieldValue});
            }
        })
    }
   
    if (editProfileField === field) {
        return (
            <div className="cancel-save-buttons">
                <Button
                 className="save-button"
                 data={field}
                 onClick={hideButtons}
                 text="Save" />
                <Button
                 className="cancel-button"
                 onClick={hideButtons}
                 text="Cancel" />
            </div>
        )
    }
    return null;
}

const SelectField = ({countriesList, labelClass, labelText, updateLocationAction, citiesList}) => {
    const {dispatchUserProfile} = useContext(UserProfileContext);
    const countries = countriesList ? countriesList.countries : null;
    const countryNames = countriesList ? countriesList.countryNames : null;
    const cities = citiesList ? citiesList.cities : null;
    let location;
    
    const updateLocation = (e) => {
        if (labelText === "Country") {
            const countryCode = e.currentTarget.value;
            const countryName = Object.keys(countries).filter((index) => countries[index] === countryCode);
            location = countryName[0];
        }
        if (labelText === "City") {
            location = e.currentTarget.value;
        }
        dispatchUserProfile({type: "UPDATE_FIELD_VALUE", payload: location});
        dispatchUserProfile({type: updateLocationAction, payload: location});
    }

    return (
        <div>
            <Label 
             className={labelClass}
             text={`${labelText}`} />
            {labelText === "Country" 
             && <Select onChange={updateLocation}>
                    <CountriesSearch
                     countries={countries}
                     countryNames={countryNames} />
                </Select>}
            {labelText === "City" 
             && <Select onChange={updateLocation}>
                    <CitiesSearch
                     cities={cities} />
                </Select>}
            <OptionButtons field={labelText} />
        </div>
    )
} 

const Field = ({parClass, parText, spanClass, spanText}) => {
    const valueArray = parText.split(" ");
    const capitalizedArray = valueArray.map(word => word.charAt(0).toUpperCase() + word.slice(1));
    const fieldvalue = capitalizedArray.join(" ");

    return (
        <div className="user-info-field">
            <Paragraph 
             className={parClass}
             text={fieldvalue}>
                <Span 
                 text={`${spanText}:`} 
                 className={spanClass} />
            </Paragraph>
            <EditButton field={spanText} />
        </div>
    )
}

const TextField = ({labelClass, labelText}) => {
    const {dispatchUserProfile} = useContext(UserProfileContext);
    
    const updateFieldValue = (e) => {
        const value = e.currentTarget.value;
        
        dispatchUserProfile({type: "UPDATE_FIELD_VALUE", payload: value});
        dispatchUserProfile({type: "UPDATE_NICKNAME", payload: value});
    }

    return (
        <div>
            <Label 
             className={labelClass}
             text={labelText} />
            <Input onChange={updateFieldValue} />
            <OptionButtons field={labelText} />
        </div>
    )
}

const PictureField = () => {
    const {user} = useContext(UserContext);
    const {userId} = user;
    const {userProfile, dispatchUserProfile} = useContext(UserProfileContext);
    const {profileImage, profileImageUrl} = userProfile;

    const updateImage = (e) => {
        const image = e.currentTarget.files[0];

        dispatchUserProfile({type: "UPDATE_PROFILE_IMAGE", payload: image});
    }

    const saveProfileImage = async () => {
        const formData = new FormData();

        formData.append("file", profileImage);
        formData.append("upload_preset", "tuikewob");

        const imageUrl = await uploadFile(formData);
        
        const imageSaved = await sendDataFromClient("/api/user/profile/save", {
            fieldValue: imageUrl.url,
            userId,
            fieldName: "Picture"
        })
    
        await dispatchUserProfile({type: "UPDATE_PROFILE_IMAGE_URL", payload: imageSaved.fieldValue});
        await dispatchUserProfile({type: "UPDATE_PROFILE_IMAGE", payload: false});
    }
   
    return(
        <div className="picture">
            <div className="picture-image">
                {profileImageUrl && <Image 
                 Url={`${profileImageUrl}`}
                 className="picture-image" />}
            </div>
            <Input
             onChange={updateImage}
             type="file"
             className="picture-update-image-input"
             text="Update Image" />
            {profileImage && <Button 
             className="picture-save-image-button" 
             onClick={saveProfileImage}
             text="Save" />}
            {profileImage && <Button 
             className="picture-cancel-image-button" 
             text="Cancel" />}
        </div>
    )
}

const Message = ({recipient}) => {
    const {userProfile, dispatchUserProfile} = useContext(UserProfileContext);
    const {messageForm} = userProfile;

    const showMessageForm = () => {
        dispatchUserProfile({type: "SHOW_MESSAGE_FORM", payload: true});
    }

    const closeMessageForm = () => {
        dispatchUserProfile({type: "SHOW_MESSAGE_FORM", payload: false})
    }

    if(messageForm) {
        return (
            <div className="message">
                <Span className="close-icon"
                      text="X"
                      onClick={closeMessageForm} />
                <SendMessageForm recipient={recipient} />           
            </div>
        )
    }
    return <Button className="send-message button"
                   text="Send Message"
                   onClick={showMessageForm} />
}


const UserInfo = ({countriesList, citiesList}) => {
    const {userProfile} = useContext(UserProfileContext);
    const {editProfileField, country, nickName, city} = userProfile;
    
    return (
        <div className="user-profile-info">
            <PictureField />
            {editProfileField !== "Nickname" 
             && <Field 
                 parClass="nickname parag"
                 parText={nickName}
                 spanClass="span"
                 spanText="Nickname" />}
            {editProfileField === "Nickname" 
             && <TextField
                 labelClass="span"
                 labelText="Nickname" />}
            {editProfileField !== "Country" 
             && <Field 
                 parClass="country parag"
                 parText={country}
                 spanClass="span"
                 spanText="Country" />}
            {editProfileField === "Country" 
             && <SelectField 
                 countriesList={countriesList} 
                 labelClass="span"
                 labelText="Country"
                 updateLocationAction="UPDATE_COUNTRY" />}
            {editProfileField !== "City" 
             && <Field 
                 parClass="city parag"
                 parText={city}
                 spanClass="span"
                 spanText="City" />}
            {editProfileField === "City" 
             && <SelectField
                 citiesList={citiesList} 
                 labelClass="span"
                 labelText="City"
                 updateLocationAction="UPDATE_CITY" />}
            </div>           
    )
}

const UserProfile = ({profile, countriesList, citiesList}) => {
    const {userProfile, dispatchUserProfile} = useContext(UserProfileContext);
    const {country} = userProfile;
    const {id} = profile;

    useEffect(() => {
        const cities = sendDataFromClient("/api/cities", {selectedCountryCode: country});
        cities.then(result => { 
            dispatchUserProfile({type: "UPDATE_CITIES", cities: result.cities});
        });
    }, [country])

    return (
        <div className="user-profile">
            <UserInfo 
             countriesList={countriesList} 
             citiesList={citiesList} />
            <Link href={{ pathname: "/account/gameslist", query: {id} }}>
                <a className="user-profile-list">See games list</a>
            </Link>
            <Message recipient={id}/>
        </div>
    )
}

export default UserProfile;