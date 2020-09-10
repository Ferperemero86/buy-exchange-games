import React, {useContext, useEffect} from "react";
import Link from "next/link";

import {UserProfileContext} from "../../components/providers/UserProfileProvider";
import {UserContext} from "../../components/providers/UserProvider";
import SendMessageForm from "../../components/forms/MessageForm";
import {getLocalData, sendLocalData, uploadFile, sendDataFromClient} from "../../utils/API";

import Paragraph from "../../components/Paragraph";
import Span from "../../components/Span";
import Input from "../../components/forms/Input";
import Button from "../../components/forms/Button";
import Label from "../../components/forms/Label";
import Select from "../../components/Select";
import Image from "../../components/Image";
import Heading from "../../components/Heading";
import Option from "../../components/Option";

import CountriesSearch from "../../components/forms/CountriesSearch";
import CitiesSearch from "../../components/forms/CitiesSearch";


export async function getServerSideProps(ctx) {
    const userQueryId = parseInt(ctx.query.userId);
    const userId = await ctx.req.user ? ctx.req.user.id : null;
    const URLBase = await ctx.req.headers.host;
    const profileUrl = new URL("/api/user/profile", `http://${URLBase}`).href;
    const countriesUrl = new URL("/api/countries", `http://${URLBase}`).href;
    const citiesUrl = new URL("/api/cities", `http://${URLBase}`).href;

    const profile = await sendLocalData(profileUrl, {userId: userQueryId});
    const country = profile.profile ? profile.profile.country : ""; 
    const countriesList = await getLocalData(countriesUrl);
    const countryCode = countriesList.countries[country];
    const cities = await sendLocalData(citiesUrl, {selectedCountryCode: countryCode});
   
    if (!userId) { return { props: {login: false} } }

    if(profile.userDoesNotExist) { return { props: {profileExists: false} } }
   
    return { props: {userQueryId, profile, countriesList, cities, userId, countryCode} }
}

const EditButton = ({field}) => {
    const {showButtons} = useContext(UserProfileContext);

    return (
        <Button
         className="edition-field-button"
         data={field}
         onClick={showButtons}
         text="Edit" />
    )
};

const OptionButtons = ({field}) => {
    const {userProfile, cancelEdit, updateField} = useContext(UserProfileContext);
    const {editProfileField, fieldValue} = userProfile;
    
    if (editProfileField === field) {
        return (
            <div className="cancel-save-buttons">
                <Button
                 className="save-button"
                 data={[field, fieldValue]}
                 onClick={updateField}
                 text="Save" />
                <Button
                 className="cancel-button"
                 onClick={cancelEdit}
                 text="Cancel" />
            </div>
        )
    }
    return null;
};

const SelectField = ({countriesList, labelClass, labelText, updateLocationAction}) => {
    const {userProfile, dispatchUserProfile} = useContext(UserProfileContext);
    const countries = countriesList ? countriesList.countries : null;
    const countryNames = countriesList ? countriesList.countryNames : null;
    const {cities} = userProfile;
    let location;
   
    const updateLocation = (e) => {
        if (labelText === "Country") {
            const countryCode = e.currentTarget.value;
            const countryName = Object.keys(countries).filter((index) => countries[index] === countryCode);
            location = countryName[0];

            dispatchUserProfile({type: "UPDATE_COUNTRY_CODE", payload: countryCode});
        }
        if (labelText === "City") {
            location = e.currentTarget.value;
        }

        dispatchUserProfile({type: "UPDATE_FIELD_VALUE", payload: location});
        dispatchUserProfile({type: updateLocationAction, payload: location});
    };

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
                    <Option 
                     value="">Select city</Option>
                    <Option 
                     value="not selected">All cities</Option>
                    <CitiesSearch
                     cities={cities} />
                </Select>}
            <OptionButtons field={labelText} />
        </div>
    )
}; 

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
};

const TextField = ({labelClass, labelText}) => {
    const {updateFieldValue} = useContext(UserProfileContext);

    return (
        <div>
            <Label 
             className={labelClass}
             text={labelText} />
            <Input onChange={updateFieldValue} />
            <OptionButtons field={labelText} />
        </div>
    )
};

const PictureField = () => {
    const {user} = useContext(UserContext);
    const {userId} = user;
    const {userProfile, updateImage, dispatchUserProfile} = useContext(UserProfileContext);
    const {profileImage, profileImageUrl} = userProfile;
    
    const saveProfileImage = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("file", profileImage);
        formData.append("upload_preset", "tuikewob");

        const imageUrl = await uploadFile(formData);
        
        const imageSaved = await sendDataFromClient("/api/user/profile/save", {
            fieldValue: imageUrl.url,
            userId,
            fieldName: "Picture"
        })
    
        dispatchUserProfile({type: "UPDATE_PROFILE_IMAGE_URL", payload: imageSaved.fieldValue});
        dispatchUserProfile({type: "UPDATE_PROFILE_IMAGE", payload: false});
    };

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
             data={profileImage} 
             className="picture-save-image-button" 
             onClick={saveProfileImage}
             text="Save" />}
            {profileImage && <Button 
             className="picture-cancel-image-button" 
             text="Cancel" />}
        </div>
    )
};

const Message = ({recipient}) => {
    const {userProfile, closeMessageForm, showMessageForm} = useContext(UserProfileContext);
    const {messageForm} = userProfile;

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
};


const UserInfo = ({countriesList}) => {
    const {userProfile} = useContext(UserProfileContext);
    const {editProfileField, country, nickName, city, cities} = userProfile;
    let cityName = city;

    if (city === "not selected") {
        cityName = "All cities";
    }
   
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
                 parText={cityName}
                 spanClass="span"
                 spanText="City" />}
            {editProfileField === "City" 
             && <SelectField
                 citiesList={cities} 
                 labelClass="span"
                 labelText="City"
                 updateLocationAction="UPDATE_CITY" />}
            </div>           
    )
}

const UserProfile = ({countriesList, profileExists}) => {
    const {user} = useContext(UserContext);
    const userLogged = user.userId;
    const {userProfile, dispatchUserProfile} = useContext(UserProfileContext);
    const {country, countryCode, userId, userQueryId} = userProfile;
   
    useEffect(() => {
        const cities = sendDataFromClient("/api/cities", {selectedCountryCode: countryCode});
        
        cities.then(result => { 
            const citiesList = result.cities;
            dispatchUserProfile({type: "UPDATE_CITIES", payload: citiesList});
        });
    }, [country]);

    if (profileExists === false) {
        return <Heading
                text="Profile does not exist" 
                type="h1" 
                className="user-profile-does-not-exist" />
    }
    
    return (
        <div className="user-profile">
            <UserInfo 
             countriesList={countriesList} />
            {userLogged !== userQueryId &&
            <Link href={{ pathname: "/account/gameslist", query: {id: userId} }}>
                <a className="user-profile-list">See games list</a>
            </Link>}
            {userLogged !== userQueryId
            && <Message recipient={userId}/>}
        </div>
    )
};

export default UserProfile;