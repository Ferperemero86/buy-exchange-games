import React, {useContext} from "react";
import Link from "next/link";

import {UserProfileContext} from "../../components/providers/UserProfileProvider";
import SendMessageForm from "../../components/forms/MessageForm";
import {sendLocalData} from "../../utils/API";

import Paragraph from "../../components/Paragraph";
import Span from "../../components/Span";

export async function getServerSideProps(ctx) {
    const {userId} = ctx.query;
    const URLBase = await ctx.req.headers.host;
    const Url = new URL("/api/user/profile", `http://${URLBase}`).href;

    const profile = await sendLocalData(Url, {userId});
    
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
                <Paragraph 
                    className={"nickname parag"}
                    text={nickName}>
                    <Span 
                        text="nickName:" 
                        className="span" />
                </Paragraph>
                <Paragraph 
                    className={"country parag"}
                    text={country}>
                    <Span 
                        text="Country:" 
                        className="span" />
                </Paragraph>
                <Paragraph 
                    className={"city parag"}
                    text={city}>
                    <Span 
                        text="City:" 
                        className="span" />
                </Paragraph>
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