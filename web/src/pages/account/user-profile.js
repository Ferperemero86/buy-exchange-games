import React, {useContext} from "react";
import Link from "next/link";

import {UserProfileContext} from "../../components/providers/UserProfileProvider";
import SendMessageForm from "../../components/forms/MessageForm";
import {sendLocalData} from "../../utils/API";

export async function getServerSideProps(ctx) {
    const {userId} = ctx.query;
    const URLBase = await ctx.req.headers.host;
    const Url = new URL("/api/user/profile", `http://${URLBase}`).href;

    const profile = await sendLocalData(Url, {userId});
    console.log(profile);
    return { props: profile }
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
                <span className="close-icon"
                      onClick={closeMessageForm}>X</span>
                <SendMessageForm recipient={recipient} />           
            </div>
        )
    }
    return <button className="button"
                   onClick={showMessageForm}>Send Message</button>
}

const UserProfile = ({profile}) => {
    const {id, country, city, nickName} = profile;

    return (
        <div className="user-profile">
            <div className="user-profile-info">
                <div className="picture"></div>
                <p className="nickname parag"><span className="span">Nickname:</span> {nickName}</p>
                <p className="country parag"><span className="span">Country:</span> {country}</p>
                <p className="city parag"><span className="span">City:</span> {city}</p>
            </div>           
            <Link href={{ pathname: "/account/gameslist", query: {id} }}>
                <a className="user-profile-list">See games list</a>
            </Link>
            <div className="user-profile-message">
                <Message recipient={id}/>
            </div>
        </div>
    )
}

export default UserProfile;