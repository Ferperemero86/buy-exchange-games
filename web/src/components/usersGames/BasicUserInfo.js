import React from "react";
import {useRouter} from "next/router";

const BasicUserInfo = () => {
    const router = useRouter();

    const goToUserProfile = () => {
        router.push("/account/userProfile");
    }
    
    return (
        <div className="basic-user-info" onClick={goToUserProfile}>
            <div className="picture-name">
                <span className="image"></span>
                <p className="name">Fernando</p>
            </div>
        </div>
    )
}

export default BasicUserInfo;
