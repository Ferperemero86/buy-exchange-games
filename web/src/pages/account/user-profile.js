import React from "react";
import Link from "next/link";

import { sendLocalData } from "../../utils/API";

export async function getServerSideProps(ctx) {
    const {userId} = ctx.query;
    const URLBase = await ctx.req.headers.host;
    const Url = new URL("/api/user/profile", `http://${URLBase}`).href;

    const profile = await sendLocalData(Url, {userId});
    console.log(profile);
    return { props: profile }
}

const UserProfile = ({profile}) => {
    console.log(profile);
    const {id, country, city, nickName} = profile;

    return (
        <div className="user-profile">
            <div className="user-info">
                <div className="picture"></div>
                <p className="nickname parag"><span className="span">Nickname:</span> {nickName}</p>
                <p className="country parag"><span className="span">Country:</span> {country}</p>
                <p className="city parag"><span className="span">City:</span> {city}</p>
            </div>
            <Link href={{ pathname: "/account/gameslist", query: {id} }}>
                <a className="user-list">See games list</a>
            </Link>
        </div>
    )
}

export default UserProfile;