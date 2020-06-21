import React from "react";
import {useRouter} from "next/router";

const BasicUserInfo = ({nickName, userId}) => {
    const router = useRouter();
   
    const goToUserProfile = () => {
        router.push({
            pathname: "/account/user-profile", 
            query: {userId} 
        });
    }
    
    return (
        <div className="basic-user-info" onClick={goToUserProfile}>
            <div className="picture-name">
                <span className="image"></span>
                <p className="name">{nickName}</p>
            </div>
        </div>
    )
}

export default BasicUserInfo;
