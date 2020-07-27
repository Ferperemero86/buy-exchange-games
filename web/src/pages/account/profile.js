import React from "react";

import {sendLocalData} from "../../utils/API";

import BasicUserInfo from "../../components/usersGames/BasicUserInfo";
import Div from "../../components/Div";
import Heading from "../../components/Header";

export async function getServerSideProps(ctx) {
    const userId = ctx.req.user ? ctx.req.user.id : null;
    const URLBase = ctx.req.headers.host;
    const Url = new URL("/api/user/profile", `http://${URLBase}`).href;

    const profile = await sendLocalData(Url, {userId});
    
    return  {props: profile}
}

const UserProfile = ({profile}) => {
    const {userId, nickName} = profile;

    return(
        <Div className="user-profile">
            <Heading
             type="h1"
             text="Profile" />
            <BasicUserInfo
                userId={userId}
                nickName={nickName} />
        </Div>
    )
}

export default UserProfile;

