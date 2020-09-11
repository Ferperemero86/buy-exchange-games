import React from "react";
import {useRouter} from "next/router";

import Paragraph from "../../components/Paragraph";
import Image from "../../components/Image";


const BasicUserInfo = ({nickName, userId, imageUrl}) => {
    const router = useRouter();
   
    const goToUserProfile = () => {
        router.push({
            pathname: "/account/user-profile", 
            query: {userId} 
        });
    };

    return (
        <div className="basic-user-info" 
             onClick={goToUserProfile}>
            <div className="picture-name">
                {imageUrl === "not selected" 
                 &&<div className="empty-profile-image"></div>}
                <Image 
                 className="image" 
                 Url={imageUrl} />
                <Paragraph
                    className="name"
                    text={nickName} />
            </div>
        </div>
    )
}

export default BasicUserInfo;
